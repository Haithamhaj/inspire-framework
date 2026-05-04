import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { assessmentsTable, usersTable, paymentsTable } from "@workspace/db/schema";
import { eq, and, count, isNull } from "drizzle-orm";
import { getAuthUser } from "../lib/auth";
import {
  AssessmentStartSchema,
  MiniSubmitSchema,
  V2SubmitSchema,
} from "../lib/validators";
import { generateReport, generateReportV2, processRetryQueue } from "../lib/ai-engine";
import { rateLimit, getClientIp } from "../lib/rate-limit";
import { logger } from "../lib/logger";
import { REQUIRED_V2_QUESTION_IDS } from "../data/questions-v2";
import { VALID_OPTION_IDS_BY_QUESTION } from "../data/option-routing";

const router: IRouter = Router();

async function requireUser(req: Request, _res: Response) {
  const authHeader = req.headers["authorization"] as string | undefined;
  const auth = await getAuthUser(authHeader);
  if (!auth) return null;
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, auth.userId));
  return user ?? null;
}

// ─── POST /api/assessments/start ──────────────────────────

router.post(
  "/assessments/start",
  async (req: Request, res: Response): Promise<void> => {
    const ip = getClientIp(req);
    if (!rateLimit(ip, "assess-start", 10, 60 * 60 * 1000)) {
      res.status(429).json({ success: false, error: "تجاوزت الحد المسموح. حاول لاحقاً." });
      return;
    }

    const user = await requireUser(req, res);
    if (!user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const parsed = AssessmentStartSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: parsed.error.flatten(),
      });
      return;
    }

    const {
      project_name,
      project_goal,
      report_language,
      assessment_type,
      previous_assessment_id,
      payment_id,
    } = parsed.data;

    // Count completed assessments for this user
    const [completedRow] = await db
      .select({ total: count() })
      .from(assessmentsTable)
      .where(
        and(
          eq(assessmentsTable.userId, user.id),
          eq(assessmentsTable.status, "completed")
        )
      );
    const _completedCount = Number(completedRow?.total ?? 0);

    // Mini assessments are always free; all full assessments require payment
    let validatedPaymentId: string | null = null;
    if (assessment_type !== "mini") {
      if (!payment_id) {
        res.status(403).json({
          success: false,
          error: "payment_required",
          message: "التقييم الأول مجاني. كل تقييم إضافي يتطلب دفع $10.",
        });
        return;
      }

      const [payment] = await db
        .select()
        .from(paymentsTable)
        .where(
          and(
            eq(paymentsTable.id, payment_id),
            eq(paymentsTable.userId, user.id),
            eq(paymentsTable.status, "completed"),
            isNull(paymentsTable.assessmentId)
          )
        );

      if (!payment) {
        res.status(403).json({
          success: false,
          error: "invalid_payment",
          message: "الدفع غير صالح أو تم استخدامه مسبقاً.",
        });
        return;
      }

      validatedPaymentId = payment.id;
    }

    // Validate ownership of previous assessment (must be completed and belong to this user)
    if (previous_assessment_id) {
      const [prev] = await db
        .select({ id: assessmentsTable.id, status: assessmentsTable.status })
        .from(assessmentsTable)
        .where(
          and(
            eq(assessmentsTable.id, previous_assessment_id),
            eq(assessmentsTable.userId, user.id)
          )
        );
      if (!prev || prev.status !== "completed") {
        res.status(400).json({
          success: false,
          error: "previous_assessment_id must be a completed assessment that belongs to you",
        });
        return;
      }
    }

    const [assessment] = await db
      .insert(assessmentsTable)
      .values({
        userId: user.id,
        projectName: project_name,
        projectGoal: project_goal,
        reportLanguage: report_language,
        assessmentType: assessment_type,
        status: "draft",
        ...(previous_assessment_id ? { previousAssessmentId: previous_assessment_id } : {}),
        ...(validatedPaymentId ? { paymentId: validatedPaymentId } : {}),
      })
      .returning({ id: assessmentsTable.id });

    // Link payment to the newly created assessment
    if (validatedPaymentId) {
      await db
        .update(paymentsTable)
        .set({ assessmentId: assessment!.id })
        .where(eq(paymentsTable.id, validatedPaymentId));
    }

    res.status(201).json({ success: true, assessmentId: assessment!.id });
  }
);

// ─── POST /api/assessments/:id/submit ────────────────────

router.post(
  "/assessments/:id/submit",
  async (req: Request, res: Response): Promise<void> => {
    const user = await requireUser(req, res);
    if (!user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const { id } = req.params;

    const [existing] = await db
      .select()
      .from(assessmentsTable)
      .where(
        and(
          eq(assessmentsTable.id, id as string),
          eq(assessmentsTable.userId, user.id)
        )
      );

    if (!existing) {
      res.status(404).json({ success: false, error: "Assessment not found" });
      return;
    }

    if (existing.status !== "draft") {
      res.status(409).json({ success: false, error: "Assessment already submitted" });
      return;
    }

    const assessmentType = existing.assessmentType ?? "full";

    // ── Mini path ──────────────────────────────────────────────────────────────
    if (assessmentType === "mini") {
      const parsed = MiniSubmitSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten(),
        });
        return;
      }

      const {
        behavioral_answers,
        scenario_answers,
        open_answer,
        completion_time_seconds,
      } = parsed.data;

      await db
        .update(assessmentsTable)
        .set({
          behavioralAnswers: behavioral_answers,
          scenarioAnswers: scenario_answers,
          openAnswer: open_answer,
          completionTimeSeconds: completion_time_seconds,
          status: "processing",
        })
        .where(eq(assessmentsTable.id, id as string));

      res.json({ success: true, status: "processing" });

      setImmediate(async () => {
        try {
          await generateReport(id as string, {
            name: user.name,
            jobTitle: user.jobTitle ?? undefined,
            projectName: existing.projectName,
            projectGoal: existing.projectGoal,
            reportLanguage: existing.reportLanguage as "ar" | "en" | "both",
            behavioralAnswers: behavioral_answers,
            scenarioAnswers: scenario_answers,
            openAnswer: open_answer,
            assessmentType: "mini",
          });
        } catch (err) {
          logger.error({ assessmentId: id, err }, "generateReport (mini) threw unexpectedly");
        }
      });

      return;
    }

    // ── V2 Full path ───────────────────────────────────────────────────────────
    const parsed = V2SubmitSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: parsed.error.flatten(),
      });
      return;
    }

    const { answers, open_answer, completion_time_seconds } = parsed.data;

    // Cross-validate: all 21 required question IDs must be present
    const submittedIds = new Set(answers.map((a) => a.questionId));
    const missingIds = REQUIRED_V2_QUESTION_IDS.filter((qid) => !submittedIds.has(qid));
    if (missingIds.length > 0) {
      res.status(400).json({
        success: false,
        error: "Missing required question IDs",
        details: { missingIds },
      });
      return;
    }

    // Cross-validate: each optionId must be valid for its questionId
    const invalidOptions: Array<{ questionId: string; optionId: string }> = [];
    for (const answer of answers) {
      const validOptions = VALID_OPTION_IDS_BY_QUESTION.get(answer.questionId);
      if (!validOptions || !validOptions.has(answer.optionId)) {
        invalidOptions.push({ questionId: answer.questionId, optionId: answer.optionId });
      }
    }
    if (invalidOptions.length > 0) {
      res.status(400).json({
        success: false,
        error: "Invalid option IDs",
        details: { invalidOptions },
      });
      return;
    }

    await db
      .update(assessmentsTable)
      .set({
        behavioralAnswers: answers,
        openAnswer: open_answer ?? null,
        completionTimeSeconds: completion_time_seconds,
        status: "processing",
      })
      .where(eq(assessmentsTable.id, id as string));

    res.json({ success: true, status: "processing" });

    setImmediate(async () => {
      try {
        await generateReportV2(id as string, {
          name: user.name,
          jobTitle: user.jobTitle ?? undefined,
          projectName: existing.projectName,
          projectGoal: existing.projectGoal,
          reportLanguage: existing.reportLanguage as "ar" | "en" | "both",
          answers,
          openAnswer: open_answer ?? undefined,
        });
      } catch (err) {
        logger.error({ assessmentId: id, err }, "generateReportV2 threw unexpectedly");
      }
    });
  }
);

// ─── GET /api/assessments/:id/status ────────────────────

router.get(
  "/assessments/:id/status",
  async (req: Request, res: Response): Promise<void> => {
    const user = await requireUser(req, res);
    if (!user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const { id } = req.params;

    const [assessment] = await db
      .select({
        id: assessmentsTable.id,
        status: assessmentsTable.status,
        aiProvider: assessmentsTable.aiProvider,
        aiModel: assessmentsTable.aiModel,
        retryCount: assessmentsTable.retryCount,
        nextRetryAt: assessmentsTable.nextRetryAt,
        completionTimeSeconds: assessmentsTable.completionTimeSeconds,
        createdAt: assessmentsTable.createdAt,
        inspireTable: assessmentsTable.inspireTable,
        roleAnalysis: assessmentsTable.roleAnalysis,
        redLines: assessmentsTable.redLines,
        strengths: assessmentsTable.strengths,
        developmentAreas: assessmentsTable.developmentAreas,
        recommendations: assessmentsTable.recommendations,
        systemInstruction: assessmentsTable.systemInstruction,
        quickStarters: assessmentsTable.quickStarters,
      })
      .from(assessmentsTable)
      .where(
        and(
          eq(assessmentsTable.id, id as string),
          eq(assessmentsTable.userId, user.id)
        )
      );

    if (!assessment) {
      res.status(404).json({ success: false, error: "Assessment not found" });
      return;
    }

    res.json({ success: true, assessment });
  }
);

// ─── POST /api/cron/retry (admin-only, kept for manual triggers) ─────────

router.post(
  "/cron/retry",
  async (req: Request, res: Response): Promise<void> => {
    const adminPassword = process.env["ADMIN_PASSWORD"];
    const provided = req.headers["x-admin-password"];
    if (!adminPassword || provided !== adminPassword) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    await processRetryQueue();
    res.json({ ok: true });
  }
);

export default router;
