import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { assessmentsTable, usersTable, discountCodesTable, paymentsTable } from "@workspace/db/schema";
import { eq, and, gte, lte, like, or, sql, desc, count, avg } from "drizzle-orm";
import { logger } from "../lib/logger";
import { sendResultsEmail } from "../lib/email";

const router: IRouter = Router();

function requireAdmin(req: Request, res: Response): boolean {
  const password = req.headers["x-admin-password"] as string | undefined;
  const expected = process.env["ADMIN_PASSWORD"];
  if (!expected) {
    logger.error("ADMIN_PASSWORD env var is not set");
    res.status(503).json({ success: false, error: "Admin not configured" });
    return false;
  }
  if (!password || password !== expected) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return false;
  }
  return true;
}

// ─── GET /api/admin/stats ─────────────────────────────────

router.get(
  "/admin/stats",
  async (req: Request, res: Response): Promise<void> => {
    if (!requireAdmin(req, res)) return;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());

    const [[totalRow], [usersRow], [completedRow], [processingRow], [failedRow], [todayRow], [weekRow], [avgTimeRow]] =
      await Promise.all([
        db.select({ total: count() }).from(assessmentsTable),
        db.select({ total: count() }).from(usersTable),
        db.select({ total: count() }).from(assessmentsTable).where(eq(assessmentsTable.status, "completed")),
        db.select({ total: count() }).from(assessmentsTable).where(eq(assessmentsTable.status, "processing")),
        db.select({ total: count() }).from(assessmentsTable).where(eq(assessmentsTable.status, "failed")),
        db.select({ total: count() }).from(assessmentsTable).where(gte(assessmentsTable.createdAt, startOfToday)),
        db.select({ total: count() }).from(assessmentsTable).where(gte(assessmentsTable.createdAt, startOfWeek)),
        db.select({ avg: avg(assessmentsTable.completionTimeSeconds) }).from(assessmentsTable).where(eq(assessmentsTable.status, "completed")),
      ]);

    const total = Number(totalRow?.total ?? 0);
    const completed = Number(completedRow?.total ?? 0);
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const avgTimeSeconds = avgTimeRow?.avg ? Math.round(Number(avgTimeRow.avg)) : 0;

    res.json({
      success: true,
      stats: {
        totalUsers: Number(usersRow?.total ?? 0),
        totalAssessments: total,
        completedAssessments: completed,
        processingAssessments: Number(processingRow?.total ?? 0),
        failedAssessments: Number(failedRow?.total ?? 0),
        assessmentsToday: Number(todayRow?.total ?? 0),
        assessmentsThisWeek: Number(weekRow?.total ?? 0),
        completionRate,
        avgCompletionSeconds: avgTimeSeconds,
      },
    });
  }
);

// ─── GET /api/admin/assessments ───────────────────────────

router.get(
  "/admin/assessments",
  async (req: Request, res: Response): Promise<void> => {
    if (!requireAdmin(req, res)) return;

    const {
      page = "1",
      limit = "25",
      status,
      language,
      search,
      dateFrom,
      dateTo,
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    const conditions: any[] = [];

    if (status) conditions.push(eq(assessmentsTable.status, status));
    if (language) conditions.push(eq(assessmentsTable.reportLanguage, language));
    if (dateFrom) conditions.push(gte(assessmentsTable.createdAt, new Date(dateFrom)));
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      conditions.push(lte(assessmentsTable.createdAt, end));
    }

    const allAssessments = await db
      .select({
        id: assessmentsTable.id,
        projectName: assessmentsTable.projectName,
        projectGoal: assessmentsTable.projectGoal,
        assessmentType: assessmentsTable.assessmentType,
        reportLanguage: assessmentsTable.reportLanguage,
        status: assessmentsTable.status,
        aiProvider: assessmentsTable.aiProvider,
        aiModel: assessmentsTable.aiModel,
        completionTimeSeconds: assessmentsTable.completionTimeSeconds,
        emailSent: assessmentsTable.emailSent,
        pdfGenerated: assessmentsTable.pdfGenerated,
        createdAt: assessmentsTable.createdAt,
        userId: assessmentsTable.userId,
      })
      .from(assessmentsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(assessmentsTable.createdAt));

    // Join with users (Drizzle doesn't have a great join + filter API here so we do it in memory)
    const userIds = [...new Set(allAssessments.map((a) => a.userId))];
    const users = userIds.length > 0
      ? await db
          .select({ id: usersTable.id, name: usersTable.name, email: usersTable.email })
          .from(usersTable)
          .where(or(...userIds.map((id) => eq(usersTable.id, id))))
      : [];

    const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

    let enriched = allAssessments.map((a) => ({
      ...a,
      user: userMap[a.userId] ?? null,
    }));

    // Apply search filter (name/email)
    if (search) {
      const term = search.toLowerCase();
      enriched = enriched.filter(
        (a) =>
          a.user?.name?.toLowerCase().includes(term) ||
          a.user?.email?.toLowerCase().includes(term) ||
          a.projectName?.toLowerCase().includes(term)
      );
    }

    const totalFiltered = enriched.length;
    const paginated = enriched.slice(offset, offset + limitNum);

    const enrichedWithFlat = paginated.map((a: any) => ({
      id: a.id,
      userId: a.userId,
      userName: a.user?.name ?? "",
      userEmail: a.user?.email ?? "",
      projectName: a.projectName,
      assessmentType: a.assessmentType,
      reportLanguage: a.reportLanguage,
      status: a.status,
      aiProvider: a.aiProvider,
      aiModel: a.aiModel,
      completionTimeSeconds: a.completionTimeSeconds,
      emailSent: a.emailSent,
      pdfGenerated: a.pdfGenerated,
      createdAt: a.createdAt,
    }));

    res.json({
      success: true,
      assessments: enrichedWithFlat,
      total: totalFiltered,
      page: pageNum,
      pageSize: limitNum,
      totalPages: Math.ceil(totalFiltered / limitNum),
    });
  }
);

// ─── GET /api/admin/export ────────────────────────────────

router.get(
  "/admin/export",
  async (req: Request, res: Response): Promise<void> => {
    if (!requireAdmin(req, res)) return;

    const assessments = await db
      .select({
        id: assessmentsTable.id,
        projectName: assessmentsTable.projectName,
        assessmentType: assessmentsTable.assessmentType,
        reportLanguage: assessmentsTable.reportLanguage,
        status: assessmentsTable.status,
        aiProvider: assessmentsTable.aiProvider,
        completionTimeSeconds: assessmentsTable.completionTimeSeconds,
        emailSent: assessmentsTable.emailSent,
        createdAt: assessmentsTable.createdAt,
        userId: assessmentsTable.userId,
      })
      .from(assessmentsTable)
      .orderBy(desc(assessmentsTable.createdAt));

    const userIds = [...new Set(assessments.map((a) => a.userId))];
    const users = userIds.length > 0
      ? await db
          .select({ id: usersTable.id, name: usersTable.name, email: usersTable.email })
          .from(usersTable)
          .where(or(...userIds.map((id) => eq(usersTable.id, id))))
      : [];

    const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

    const rows = assessments.map((a) => {
      const u = userMap[a.userId];
      return [
        a.id,
        u?.name ?? "",
        u?.email ?? "",
        a.projectName,
        a.assessmentType,
        a.reportLanguage,
        a.status,
        a.aiProvider ?? "",
        a.completionTimeSeconds != null ? Math.round(a.completionTimeSeconds / 60) + " دقيقة" : "",
        a.emailSent ? "نعم" : "لا",
        a.createdAt ? new Date(a.createdAt).toISOString() : "",
      ];
    });

    const header = ["ID", "الاسم", "البريد", "المشروع", "النوع", "اللغة", "الحالة", "AI", "المدة", "بريد أُرسل", "التاريخ"];
    const csv = [header, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="inspire-assessments-${Date.now()}.csv"`);
    res.send("\uFEFF" + csv); // BOM for Arabic Excel compatibility
  }
);

// ─── POST /api/admin/resend-email/:id ────────────────────

router.post(
  "/admin/resend-email/:id",
  async (req: Request, res: Response): Promise<void> => {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;
    const [assessment] = await db
      .select({ id: assessmentsTable.id, status: assessmentsTable.status })
      .from(assessmentsTable)
      .where(eq(assessmentsTable.id, id as string));

    if (!assessment) {
      res.status(404).json({ success: false, error: "Assessment not found" });
      return;
    }
    if (assessment.status !== "completed") {
      res.status(400).json({ success: false, error: "Assessment not completed yet" });
      return;
    }

    // Reset email_sent so sendResultsEmail will send again
    await db
      .update(assessmentsTable)
      .set({ emailSent: false, emailSentAt: null })
      .where(eq(assessmentsTable.id, id as string));

    try {
      await sendResultsEmail(id as string);
      res.json({ success: true, message: "Email sent" });
    } catch (err) {
      logger.error({ id, err }, "Admin resend-email failed");
      res.status(500).json({ success: false, error: String(err) });
    }
  }
);

// ─── GET /api/admin/discount-codes ───────────────────────

router.get(
  "/admin/discount-codes",
  async (req: Request, res: Response): Promise<void> => {
    if (!requireAdmin(req, res)) return;

    const codes = await db
      .select()
      .from(discountCodesTable)
      .orderBy(desc(discountCodesTable.createdAt));

    res.json({ success: true, codes });
  }
);

// ─── POST /api/admin/discount-codes ──────────────────────

router.post(
  "/admin/discount-codes",
  async (req: Request, res: Response): Promise<void> => {
    if (!requireAdmin(req, res)) return;

    const { code, discountPercent, maxUses, expiresAt } = req.body as {
      code: string;
      discountPercent: number;
      maxUses?: number | null;
      expiresAt?: string | null;
    };

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      res.status(400).json({ success: false, error: "code is required" });
      return;
    }

    const pct = Number(discountPercent);
    if (isNaN(pct) || pct < 1 || pct > 100) {
      res.status(400).json({ success: false, error: "discountPercent must be 1–100" });
      return;
    }

    const normalizedCode = code.trim().toUpperCase();

    try {
      const [created] = await db
        .insert(discountCodesTable)
        .values({
          code: normalizedCode,
          discountPercent: pct,
          maxUses: maxUses ?? null,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
        })
        .returning();

      res.status(201).json({ success: true, code: created });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      if (msg.includes("unique") || msg.includes("duplicate")) {
        res.status(409).json({ success: false, error: "الكود موجود مسبقاً" });
      } else {
        res.status(500).json({ success: false, error: msg });
      }
    }
  }
);

// ─── PATCH /api/admin/discount-codes/:id ─────────────────

router.patch(
  "/admin/discount-codes/:id",
  async (req: Request, res: Response): Promise<void> => {
    if (!requireAdmin(req, res)) return;

    const { id } = req.params;
    const { isActive } = req.body as { isActive: boolean };

    if (typeof isActive !== "boolean") {
      res.status(400).json({ success: false, error: "isActive (boolean) required" });
      return;
    }

    const [updated] = await db
      .update(discountCodesTable)
      .set({ isActive })
      .where(eq(discountCodesTable.id, id as string))
      .returning();

    if (!updated) {
      res.status(404).json({ success: false, error: "Code not found" });
      return;
    }

    res.json({ success: true, code: updated });
  }
);

// ─── DELETE /api/admin/discount-codes/:id ────────────────

router.delete(
  "/admin/discount-codes/:id",
  async (req: Request, res: Response): Promise<void> => {
    if (!requireAdmin(req, res)) return;

    const { id } = req.params;

    const [deleted] = await db
      .delete(discountCodesTable)
      .where(eq(discountCodesTable.id, id as string))
      .returning({ id: discountCodesTable.id });

    if (!deleted) {
      res.status(404).json({ success: false, error: "Code not found" });
      return;
    }

    res.json({ success: true });
  }
);

// ─── GET /api/admin/payments ──────────────────────────────

router.get(
  "/admin/payments",
  async (req: Request, res: Response): Promise<void> => {
    if (!requireAdmin(req, res)) return;

    const payments = await db
      .select({
        id: paymentsTable.id,
        userId: paymentsTable.userId,
        assessmentId: paymentsTable.assessmentId,
        paypalOrderId: paymentsTable.paypalOrderId,
        amount: paymentsTable.amount,
        originalAmount: paymentsTable.originalAmount,
        discountCode: paymentsTable.discountCode,
        discountPercent: paymentsTable.discountPercent,
        status: paymentsTable.status,
        createdAt: paymentsTable.createdAt,
      })
      .from(paymentsTable)
      .orderBy(desc(paymentsTable.createdAt))
      .limit(100);

    const userIds = [...new Set(payments.map((p) => p.userId))];
    const users =
      userIds.length > 0
        ? await db
            .select({ id: usersTable.id, name: usersTable.name, email: usersTable.email })
            .from(usersTable)
            .where(or(...userIds.map((id) => eq(usersTable.id, id))))
        : [];

    const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

    const enriched = payments.map((p) => ({
      ...p,
      userName: userMap[p.userId]?.name ?? "",
      userEmail: userMap[p.userId]?.email ?? "",
    }));

    res.json({ success: true, payments: enriched });
  }
);

export default router;

