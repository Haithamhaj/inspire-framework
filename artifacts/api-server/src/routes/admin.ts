import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { assessmentsTable, usersTable } from "@workspace/db/schema";
import { eq, and, gte, lte, like, or, sql, desc, count, avg } from "drizzle-orm";
import { logger } from "../lib/logger";

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

export default router;
