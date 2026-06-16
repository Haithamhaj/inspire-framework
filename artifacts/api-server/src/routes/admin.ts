import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import {
  assessmentDecisionSnapshotsTable,
  assessmentFeedbackTable,
  assessmentGenerationRunsTable,
  assessmentsTable,
  usersTable,
  discountCodesTable,
  paymentsTable,
} from "@workspace/db/schema";
import { eq, and, gte, lte, or, desc, count, avg, type SQL } from "drizzle-orm";
import { randomBytes } from "crypto";
import { logger } from "../lib/logger";
import { sendResultsEmail, sendRecoveryEmail } from "../lib/email";
import { generateReportV2 } from "../lib/ai-engine";

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

function isV2Answers(value: unknown): value is Array<{ questionId: string; optionId: string }> {
  return Array.isArray(value) && value.every(
    (item) =>
      item &&
      typeof item === "object" &&
      typeof (item as { questionId?: unknown }).questionId === "string" &&
      typeof (item as { optionId?: unknown }).optionId === "string"
  );
}

function applyAssessmentListFilters(
  query: Record<string, string>,
  conditions: SQL[]
) {
  const { status, language, domain, provider, model, outcome, dateFrom, dateTo } = query;

  if (status) conditions.push(eq(assessmentsTable.status, status));
  if (language) conditions.push(eq(assessmentsTable.reportLanguage, language));
  if (domain) conditions.push(eq(assessmentsTable.domain, domain));
  if (provider) conditions.push(eq(assessmentsTable.aiProvider, provider));
  if (model) conditions.push(eq(assessmentsTable.aiModel, model));
  if (outcome === "failed") conditions.push(eq(assessmentsTable.status, "failed"));
  if (outcome === "completed") conditions.push(eq(assessmentsTable.status, "completed"));
  if (dateFrom) conditions.push(gte(assessmentsTable.createdAt, new Date(dateFrom)));
  if (dateTo) {
    const end = new Date(dateTo);
    end.setHours(23, 59, 59, 999);
    conditions.push(lte(assessmentsTable.createdAt, end));
  }
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

    const [[totalRow], [usersRow], [completedRow], [processingRow], [pendingRetryRow], [failedRow], [lowRatingRow], [todayRow], [weekRow], [avgTimeRow]] =
      await Promise.all([
        db.select({ total: count() }).from(assessmentsTable),
        db.select({ total: count() }).from(usersTable),
        db.select({ total: count() }).from(assessmentsTable).where(eq(assessmentsTable.status, "completed")),
        db.select({ total: count() }).from(assessmentsTable).where(eq(assessmentsTable.status, "processing")),
        db.select({ total: count() }).from(assessmentsTable).where(eq(assessmentsTable.status, "pending_retry")),
        db.select({ total: count() }).from(assessmentsTable).where(eq(assessmentsTable.status, "failed")),
        db.select({ total: count() }).from(assessmentFeedbackTable).where(lte(assessmentFeedbackTable.rating, 2)),
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
        pendingRetryAssessments: Number(pendingRetryRow?.total ?? 0),
        failedAssessments: Number(failedRow?.total ?? 0),
        lowRatingAssessments: Number(lowRatingRow?.total ?? 0),
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
      search,
      recovery,
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    const conditions: SQL[] = [];
    applyAssessmentListFilters(req.query as Record<string, string>, conditions);

    const allAssessments = await db
      .select({
        id: assessmentsTable.id,
        projectName: assessmentsTable.projectName,
        projectGoal: assessmentsTable.projectGoal,
        domain: assessmentsTable.domain,
        assessmentType: assessmentsTable.assessmentType,
        reportLanguage: assessmentsTable.reportLanguage,
        status: assessmentsTable.status,
        aiProvider: assessmentsTable.aiProvider,
        aiModel: assessmentsTable.aiModel,
        completionTimeSeconds: assessmentsTable.completionTimeSeconds,
        emailSent: assessmentsTable.emailSent,
        pdfGenerated: assessmentsTable.pdfGenerated,
        retryCount: assessmentsTable.retryCount,
        nextRetryAt: assessmentsTable.nextRetryAt,
        paymentId: assessmentsTable.paymentId,
        shareToken: assessmentsTable.shareToken,
        shareEnabled: assessmentsTable.shareEnabled,
        reportContent: assessmentsTable.reportContent,
        behavioralAnswers: assessmentsTable.behavioralAnswers,
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

    const assessmentIds = allAssessments.map((a) => a.id);
    const paymentIds = allAssessments
      .map((a) => a.paymentId)
      .filter((id): id is string => Boolean(id));
    const paymentConditions: SQL[] = [];
    if (assessmentIds.length > 0) {
      paymentConditions.push(or(...assessmentIds.map((id) => eq(paymentsTable.assessmentId, id)))!);
    }
    if (paymentIds.length > 0) {
      paymentConditions.push(or(...paymentIds.map((id) => eq(paymentsTable.id, id)))!);
    }
    const payments =
      paymentConditions.length > 0
        ? await db
            .select({
              id: paymentsTable.id,
              assessmentId: paymentsTable.assessmentId,
              paypalOrderId: paymentsTable.paypalOrderId,
              status: paymentsTable.status,
              amount: paymentsTable.amount,
            })
            .from(paymentsTable)
            .where(or(...paymentConditions))
        : [];
    const paymentByAssessmentId = Object.fromEntries(
      payments
        .filter((p) => p.assessmentId)
        .map((p) => [p.assessmentId!, p])
    );
    const paymentById = Object.fromEntries(payments.map((p) => [p.id, p]));

    const feedbacks = assessmentIds.length > 0
      ? await db
          .select({
            assessmentId: assessmentFeedbackTable.assessmentId,
            rating: assessmentFeedbackTable.rating,
            usefulAnswer: assessmentFeedbackTable.usefulAnswer,
            mostUseful: assessmentFeedbackTable.mostUseful,
            missing: assessmentFeedbackTable.missing,
            copiedInstructions: assessmentFeedbackTable.copiedInstructions,
            feedbackSource: assessmentFeedbackTable.feedbackSource,
            updatedAt: assessmentFeedbackTable.updatedAt,
          })
          .from(assessmentFeedbackTable)
          .where(or(...assessmentIds.map((id) => eq(assessmentFeedbackTable.assessmentId, id))))
      : [];
    const feedbackByAssessmentId = Object.fromEntries(
      feedbacks.map((f) => [f.assessmentId, f])
    );

    let enriched = allAssessments.map((a) => ({
      ...a,
      user: userMap[a.userId] ?? null,
      payment: paymentByAssessmentId[a.id] ?? (a.paymentId ? paymentById[a.paymentId] : null),
      feedback: feedbackByAssessmentId[a.id] ?? null,
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

    if (recovery === "paid_no_report") {
      enriched = enriched.filter(
        (a) =>
          a.payment?.status === "completed" &&
          a.status !== "completed"
      );
    } else if (recovery === "low_rating") {
      enriched = enriched.filter((a) => (a.feedback?.rating ?? 99) <= 2);
    } else if (recovery === "needs_attention") {
      enriched = enriched.filter(
        (a) =>
          a.status === "failed" ||
          a.status === "pending_retry" ||
          (a.feedback?.rating ?? 99) <= 2 ||
          (a.payment?.status === "completed" && a.status !== "completed")
      );
    }

    const totalFiltered = enriched.length;
    const paginated = enriched.slice(offset, offset + limitNum);

    const enrichedWithFlat = paginated.map((a) => ({
      id: a.id,
      userId: a.userId,
      userName: a.user?.name ?? "",
      userEmail: a.user?.email ?? "",
      projectName: a.projectName,
      domain: a.domain,
      assessmentType: a.assessmentType,
      reportLanguage: a.reportLanguage,
      status: a.status,
      aiProvider: a.aiProvider,
      aiModel: a.aiModel,
      completionTimeSeconds: a.completionTimeSeconds,
      emailSent: a.emailSent,
      pdfGenerated: a.pdfGenerated,
      retryCount: a.retryCount,
      nextRetryAt: a.nextRetryAt,
      hasReportContent: Boolean(a.reportContent),
      hasAnswers: isV2Answers(a.behavioralAnswers),
      feedbackRating: a.feedback?.rating ?? null,
      feedbackUsefulAnswer: a.feedback?.usefulAnswer ?? null,
      feedbackMostUseful: a.feedback?.mostUseful ?? null,
      feedbackMissing: a.feedback?.missing ?? null,
      feedbackCopiedInstructions: a.feedback?.copiedInstructions ?? null,
      feedbackSource: a.feedback?.feedbackSource ?? null,
      feedbackUpdatedAt: a.feedback?.updatedAt ?? null,
      paymentId: a.payment?.id ?? a.paymentId,
      paymentStatus: a.payment?.status ?? null,
      paypalOrderId: a.payment?.paypalOrderId ?? null,
      paymentAmount: a.payment?.amount ?? null,
      shareToken: a.shareToken,
      shareEnabled: a.shareEnabled,
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

// ─── GET /api/admin/assessments/:id ───────────────────────

router.get(
  "/admin/assessments/:id",
  async (req: Request, res: Response): Promise<void> => {
    if (!requireAdmin(req, res)) return;

    const { id } = req.params;
    const [assessment] = await db
      .select()
      .from(assessmentsTable)
      .where(eq(assessmentsTable.id, id as string));

    if (!assessment) {
      res.status(404).json({ success: false, error: "Assessment not found" });
      return;
    }

    const [[user], [feedback], [decisionSnapshot], generationRuns] = await Promise.all([
      db
        .select({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          jobTitle: usersTable.jobTitle,
          plan: usersTable.plan,
          emailVerified: usersTable.emailVerified,
          consentGiven: usersTable.consentGiven,
          consentAt: usersTable.consentAt,
          isActive: usersTable.isActive,
          lastLoginAt: usersTable.lastLoginAt,
          createdAt: usersTable.createdAt,
        })
        .from(usersTable)
        .where(eq(usersTable.id, assessment.userId)),
      db
        .select()
        .from(assessmentFeedbackTable)
        .where(eq(assessmentFeedbackTable.assessmentId, assessment.id)),
      db
        .select()
        .from(assessmentDecisionSnapshotsTable)
        .where(eq(assessmentDecisionSnapshotsTable.assessmentId, assessment.id)),
      db
        .select()
        .from(assessmentGenerationRunsTable)
        .where(eq(assessmentGenerationRunsTable.assessmentId, assessment.id))
        .orderBy(desc(assessmentGenerationRunsTable.createdAt)),
    ]);

    const paymentConditions: SQL[] = [eq(paymentsTable.assessmentId, assessment.id)];
    if (assessment.paymentId) paymentConditions.push(eq(paymentsTable.id, assessment.paymentId));
    const payments = await db
      .select()
      .from(paymentsTable)
      .where(or(...paymentConditions))
      .orderBy(desc(paymentsTable.createdAt));

    res.json({
      success: true,
      assessment: {
        ...assessment,
        user: user ?? null,
        feedback: feedback ?? null,
        payment: payments[0] ?? null,
        payments,
        decisionSnapshot: decisionSnapshot ?? null,
        generationRuns,
      },
    });
  }
);

// ─── POST /api/admin/assessments/:id/retry-generation ─────────────────────

router.post(
  "/admin/assessments/:id/retry-generation",
  async (req: Request, res: Response): Promise<void> => {
    if (!requireAdmin(req, res)) return;

    const { id } = req.params;
    const [assessment] = await db
      .select()
      .from(assessmentsTable)
      .where(eq(assessmentsTable.id, id as string));

    if (!assessment) {
      res.status(404).json({ success: false, error: "Assessment not found" });
      return;
    }

    if (assessment.status === "completed") {
      res.status(409).json({ success: false, error: "Assessment is already completed" });
      return;
    }

    if ((assessment.assessmentType ?? "full") !== "full" || !isV2Answers(assessment.behavioralAnswers)) {
      res.status(400).json({ success: false, error: "Only submitted v2 full assessments can be retried here" });
      return;
    }
    const answers = assessment.behavioralAnswers;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, assessment.userId));

    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    await db
      .update(assessmentsTable)
      .set({
        status: "processing",
        retryCount: 0,
        nextRetryAt: null,
      })
      .where(eq(assessmentsTable.id, assessment.id));

    setImmediate(async () => {
      try {
        await generateReportV2(assessment.id, {
          name: user.name,
          jobTitle: user.jobTitle ?? undefined,
          projectName: assessment.projectName,
          projectGoal: assessment.projectGoal,
          domain: assessment.domain ?? assessment.projectName,
          customDomain: assessment.customDomain ?? undefined,
          domainSpecialization: assessment.domainSpecialization ?? undefined,
          projectContext: assessment.projectContext ?? assessment.projectGoal,
          reportLanguage: assessment.reportLanguage as "ar" | "en" | "both",
          answers,
          openAnswer: assessment.openAnswer ?? undefined,
        });
      } catch (err) {
        logger.error({ assessmentId: assessment.id, err }, "Admin retry generation threw unexpectedly");
      }
    });

    res.json({ success: true, status: "processing" });
  }
);

// ─── POST /api/admin/assessments/:id/generate-report ──────────────────────────

router.post(
  "/admin/assessments/:id/generate-report",
  async (req: Request, res: Response): Promise<void> => {
    if (!requireAdmin(req, res)) return;

    const { id } = req.params;
    const [assessment] = await db
      .select()
      .from(assessmentsTable)
      .where(eq(assessmentsTable.id, id as string));

    if (!assessment) {
      res.status(404).json({ success: false, error: "Assessment not found" });
      return;
    }

    if (assessment.status === "completed") {
      res.status(409).json({ success: false, error: "Assessment is already completed" });
      return;
    }

    if ((assessment.assessmentType ?? "full") !== "full" || !isV2Answers(assessment.behavioralAnswers)) {
      res.status(400).json({ success: false, error: "No saved answers found for this assessment" });
      return;
    }
    const answers = assessment.behavioralAnswers;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, assessment.userId));

    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    await db
      .update(assessmentsTable)
      .set({ status: "processing", retryCount: 0, nextRetryAt: null })
      .where(eq(assessmentsTable.id, assessment.id));

    setImmediate(async () => {
      try {
        await generateReportV2(assessment.id, {
          name: user.name,
          jobTitle: user.jobTitle ?? undefined,
          projectName: assessment.projectName,
          projectGoal: assessment.projectGoal,
          domain: assessment.domain ?? assessment.projectName,
          customDomain: assessment.customDomain ?? undefined,
          domainSpecialization: assessment.domainSpecialization ?? undefined,
          projectContext: assessment.projectContext ?? assessment.projectGoal,
          reportLanguage: assessment.reportLanguage as "ar" | "en" | "both",
          answers,
          openAnswer: assessment.openAnswer ?? undefined,
        });
      } catch (err) {
        logger.error({ assessmentId: assessment.id, err }, "Admin generate-report threw unexpectedly");
      }
    });

    res.json({ success: true, status: "processing" });
  }
);

// ─── POST /api/admin/assessments/:id/regenerate-report ────────────────────────

router.post(
  "/admin/assessments/:id/regenerate-report",
  async (req: Request, res: Response): Promise<void> => {
    if (!requireAdmin(req, res)) return;

    const { id } = req.params;
    const [assessment] = await db
      .select()
      .from(assessmentsTable)
      .where(eq(assessmentsTable.id, id as string));

    if (!assessment) {
      res.status(404).json({ success: false, error: "Assessment not found" });
      return;
    }

    if ((assessment.assessmentType ?? "full") !== "full" || !isV2Answers(assessment.behavioralAnswers)) {
      res.status(400).json({ success: false, error: "No saved answers found for this assessment" });
      return;
    }
    const answers = assessment.behavioralAnswers;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, assessment.userId));

    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    await db
      .update(assessmentsTable)
      .set({ status: "processing", retryCount: 0, nextRetryAt: null })
      .where(eq(assessmentsTable.id, assessment.id));

    setImmediate(async () => {
      try {
        await generateReportV2(assessment.id, {
          name: user.name,
          jobTitle: user.jobTitle ?? undefined,
          projectName: assessment.projectName,
          projectGoal: assessment.projectGoal,
          domain: assessment.domain ?? assessment.projectName,
          customDomain: assessment.customDomain ?? undefined,
          domainSpecialization: assessment.domainSpecialization ?? undefined,
          projectContext: assessment.projectContext ?? assessment.projectGoal,
          reportLanguage: assessment.reportLanguage as "ar" | "en" | "both",
          answers,
          openAnswer: assessment.openAnswer ?? undefined,
        });
      } catch (err) {
        logger.error({ assessmentId: assessment.id, err }, "Admin regenerate-report threw unexpectedly");
      }
    });

    res.json({ success: true, status: "processing" });
  }
);

// ─── PATCH /api/admin/assessments/:id/share ───────────────────────────────────

router.patch(
  "/admin/assessments/:id/share",
  async (req: Request, res: Response): Promise<void> => {
    if (!requireAdmin(req, res)) return;

    const { id } = req.params;
    const { enabled } = req.body as { enabled?: boolean };
    if (typeof enabled !== "boolean") {
      res.status(400).json({ success: false, error: "enabled boolean required" });
      return;
    }

    const [assessment] = await db
      .select({
        id: assessmentsTable.id,
        status: assessmentsTable.status,
        shareToken: assessmentsTable.shareToken,
      })
      .from(assessmentsTable)
      .where(eq(assessmentsTable.id, id as string));

    if (!assessment) {
      res.status(404).json({ success: false, error: "Assessment not found" });
      return;
    }

    if (enabled && assessment.status !== "completed") {
      res.status(400).json({ success: false, error: "Only completed assessments can be shared" });
      return;
    }

    const shareToken = enabled ? assessment.shareToken ?? randomBytes(24).toString("hex") : null;
    const [updated] = await db
      .update(assessmentsTable)
      .set({ shareToken, shareEnabled: enabled })
      .where(eq(assessmentsTable.id, assessment.id))
      .returning({
        id: assessmentsTable.id,
        shareToken: assessmentsTable.shareToken,
        shareEnabled: assessmentsTable.shareEnabled,
      });

    res.json({ success: true, assessment: updated });
  }
);

// ─── POST /api/admin/assessments/:id/send-recovery-email ──────────────────────

router.post(
  "/admin/assessments/:id/send-recovery-email",
  async (req: Request, res: Response): Promise<void> => {
    if (!requireAdmin(req, res)) return;

    const { id } = req.params;
    const [assessment] = await db
      .select()
      .from(assessmentsTable)
      .where(eq(assessmentsTable.id, id as string));

    if (!assessment) {
      res.status(404).json({ success: false, error: "Assessment not found" });
      return;
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, assessment.userId));

    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    try {
      // Generate a unique 100% personal discount code for this user
      const code = `RECOVER-${user.id.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
      await db.insert(discountCodesTable).values({
        code,
        discountPercent: 100,
        maxUses: 1,
        usedCount: 0,
        isActive: true,
        userId: user.id,
      });

      await sendRecoveryEmail(user.email, user.name, code);
      res.json({ success: true, email: user.email, code });
    } catch {
      res.status(500).json({ success: false, error: "Failed to send email" });
    }
  }
);

// ─── GET /api/admin/export ────────────────────────────────

router.get(
  "/admin/export",
  async (req: Request, res: Response): Promise<void> => {
    if (!requireAdmin(req, res)) return;

    const conditions: SQL[] = [];
    applyAssessmentListFilters(req.query as Record<string, string>, conditions);
    const format = ((req.query as Record<string, string>).format ?? "csv").toLowerCase();

    const assessments = await db
      .select({
        id: assessmentsTable.id,
        projectName: assessmentsTable.projectName,
        projectGoal: assessmentsTable.projectGoal,
        domain: assessmentsTable.domain,
        assessmentType: assessmentsTable.assessmentType,
        reportLanguage: assessmentsTable.reportLanguage,
        status: assessmentsTable.status,
        aiProvider: assessmentsTable.aiProvider,
        aiModel: assessmentsTable.aiModel,
        completionTimeSeconds: assessmentsTable.completionTimeSeconds,
        emailSent: assessmentsTable.emailSent,
        shareEnabled: assessmentsTable.shareEnabled,
        shareToken: assessmentsTable.shareToken,
        createdAt: assessmentsTable.createdAt,
        userId: assessmentsTable.userId,
      })
      .from(assessmentsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(assessmentsTable.createdAt));

    const userIds = [...new Set(assessments.map((a) => a.userId))];
    const users = userIds.length > 0
      ? await db
          .select({ id: usersTable.id, name: usersTable.name, email: usersTable.email })
          .from(usersTable)
          .where(or(...userIds.map((id) => eq(usersTable.id, id))))
      : [];

    const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

    if (format === "json") {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="inspire-assessments-${Date.now()}.json"`);
      res.json({
        exportedAt: new Date().toISOString(),
        count: assessments.length,
        assessments: assessments.map((a) => ({
          ...a,
          user: userMap[a.userId] ?? null,
        })),
      });
      return;
    }

    const rows = assessments.map((a) => {
      const u = userMap[a.userId];
      return [
        a.id,
        u?.name ?? "",
        u?.email ?? "",
        a.projectName,
        a.domain ?? "",
        a.assessmentType,
        a.reportLanguage,
        a.status,
        a.aiProvider ?? "",
        a.aiModel ?? "",
        a.completionTimeSeconds != null ? Math.round(a.completionTimeSeconds / 60) + " دقيقة" : "",
        a.emailSent ? "نعم" : "لا",
        a.shareEnabled ? "نعم" : "لا",
        a.createdAt ? new Date(a.createdAt).toISOString() : "",
      ];
    });

    const header = ["ID", "الاسم", "البريد", "المشروع", "المجال", "النوع", "اللغة", "الحالة", "المزود", "النموذج", "المدة", "بريد أُرسل", "المشاركة", "التاريخ"];
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

    const userIds = [...new Set(codes.map((code) => code.userId).filter(Boolean))] as string[];
    const users = userIds.length > 0
      ? await db
          .select({ id: usersTable.id, email: usersTable.email })
          .from(usersTable)
          .where(or(...userIds.map((id) => eq(usersTable.id, id))))
      : [];
    const userEmailById = Object.fromEntries(users.map((user) => [user.id, user.email]));

    res.json({
      success: true,
      codes: codes.map((code) => ({
        ...code,
        userEmail: code.userId ? userEmailById[code.userId] ?? null : null,
      })),
    });
  }
);

// ─── POST /api/admin/discount-codes ──────────────────────

router.post(
  "/admin/discount-codes",
  async (req: Request, res: Response): Promise<void> => {
    if (!requireAdmin(req, res)) return;

    const { code, discountPercent, maxUses, userEmail, startsAt, expiresAt } = req.body as {
      code: string;
      discountPercent: number;
      maxUses?: number | null;
      userEmail?: string | null;
      startsAt?: string | null;
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
    const normalizedEmail = userEmail?.trim().toLowerCase() || null;
    const normalizedMaxUses = maxUses === undefined || maxUses === null ? null : Number(maxUses);
    const startsDate = startsAt ? new Date(startsAt) : null;
    const expiresDate = expiresAt ? new Date(expiresAt) : null;

    if (normalizedMaxUses !== null && (!Number.isInteger(normalizedMaxUses) || normalizedMaxUses < 1)) {
      res.status(400).json({ success: false, error: "maxUses must be a positive number" });
      return;
    }

    if ((startsDate && Number.isNaN(startsDate.getTime())) || (expiresDate && Number.isNaN(expiresDate.getTime()))) {
      res.status(400).json({ success: false, error: "Invalid date" });
      return;
    }

    if (startsDate && expiresDate && startsDate >= expiresDate) {
      res.status(400).json({ success: false, error: "تاريخ البداية يجب أن يكون قبل تاريخ النهاية" });
      return;
    }

    let userId: string | null = null;
    if (normalizedEmail) {
      const [targetUser] = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, normalizedEmail));

      if (!targetUser) {
        res.status(404).json({ success: false, error: "لا يوجد مستخدم بهذا الإيميل" });
        return;
      }
      userId = targetUser.id;
    }

    try {
      const [created] = await db
        .insert(discountCodesTable)
        .values({
          code: normalizedCode,
          discountPercent: pct,
          maxUses: normalizedMaxUses,
          startsAt: startsDate,
          expiresAt: expiresDate,
          userId,
        })
        .returning();

      res.status(201).json({ success: true, code: { ...created, userEmail: normalizedEmail } });
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

// ─── POST /api/admin/reset-password ───────────────────────

router.post(
  "/admin/reset-password",
  async (req: Request, res: Response): Promise<void> => {
    if (!requireAdmin(req, res)) return;

    const { email, newPassword } = req.body as { email?: string; newPassword?: string };
    if (!email || !newPassword || newPassword.length < 6) {
      res.status(400).json({ success: false, error: "Email and password (min 6 chars) required" });
      return;
    }

    const { hashPassword } = await import("../lib/auth");
    const passwordHash = await hashPassword(newPassword);

    const [updated] = await db
      .update(usersTable)
      .set({ passwordHash, emailVerified: true })
      .where(eq(usersTable.email, email.toLowerCase().trim()))
      .returning({ id: usersTable.id, email: usersTable.email });

    if (!updated) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    res.json({ success: true, user: updated });
  }
);

// ─── DELETE /api/admin/users/:email ───────────────────────

router.delete(
  "/admin/users",
  async (req: Request, res: Response): Promise<void> => {
    if (!requireAdmin(req, res)) return;

    const { email } = req.body as { email?: string };
    if (!email) {
      res.status(400).json({ success: false, error: "Email required" });
      return;
    }

    const [deleted] = await db
      .delete(usersTable)
      .where(eq(usersTable.email, email.toLowerCase().trim()))
      .returning({ id: usersTable.id, email: usersTable.email });

    if (!deleted) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    res.json({ success: true, deleted });
  }
);

// ─── GET /api/admin/users ─────────────────────────────────

router.get(
  "/admin/users",
  async (req: Request, res: Response): Promise<void> => {
    if (!requireAdmin(req, res)) return;

    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        emailVerified: usersTable.emailVerified,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .orderBy(desc(usersTable.createdAt))
      .limit(100);

    const userIds = users.map((user) => user.id);
    const [assessments, payments] =
      userIds.length > 0
        ? await Promise.all([
            db
              .select({
                userId: assessmentsTable.userId,
                status: assessmentsTable.status,
                createdAt: assessmentsTable.createdAt,
              })
              .from(assessmentsTable)
              .where(or(...userIds.map((id) => eq(assessmentsTable.userId, id)))),
            db
              .select({
                userId: paymentsTable.userId,
                status: paymentsTable.status,
              })
              .from(paymentsTable)
              .where(or(...userIds.map((id) => eq(paymentsTable.userId, id)))),
          ])
        : [[], []];

    const assessmentStats = new Map<
      string,
      { total: number; completed: number; latestAt: Date | null }
    >();
    for (const assessment of assessments) {
      const current = assessmentStats.get(assessment.userId) ?? {
        total: 0,
        completed: 0,
        latestAt: null,
      };
      current.total += 1;
      if (assessment.status === "completed") current.completed += 1;
      if (!current.latestAt || assessment.createdAt > current.latestAt) {
        current.latestAt = assessment.createdAt;
      }
      assessmentStats.set(assessment.userId, current);
    }

    const paymentStats = new Map<string, { total: number; completed: number }>();
    for (const payment of payments) {
      const current = paymentStats.get(payment.userId) ?? { total: 0, completed: 0 };
      current.total += 1;
      if (payment.status === "completed") current.completed += 1;
      paymentStats.set(payment.userId, current);
    }

    const enriched = users.map((user) => {
      const userAssessments = assessmentStats.get(user.id);
      const userPayments = paymentStats.get(user.id);
      return {
        ...user,
        assessmentCount: userAssessments?.total ?? 0,
        completedAssessmentCount: userAssessments?.completed ?? 0,
        latestAssessmentAt: userAssessments?.latestAt ?? null,
        paymentCount: userPayments?.total ?? 0,
        completedPaymentCount: userPayments?.completed ?? 0,
      };
    });

    res.json({ success: true, users: enriched });
  }
);

// ─── POST /api/admin/verify-user ──────────────────────────

router.post(
  "/admin/verify-user",
  async (req: Request, res: Response): Promise<void> => {
    if (!requireAdmin(req, res)) return;

    const { email } = req.body as { email?: string };
    if (!email) {
      res.status(400).json({ success: false, error: "Email required" });
      return;
    }

    const [updated] = await db
      .update(usersTable)
      .set({ emailVerified: true })
      .where(eq(usersTable.email, email.toLowerCase().trim()))
      .returning({ id: usersTable.id, email: usersTable.email });

    if (!updated) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    res.json({ success: true, user: updated });
  }
);

export default router;
