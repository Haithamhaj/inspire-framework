import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { assessmentsTable, usersTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { getAuthUser } from "../lib/auth";
import { AssessmentStartSchema, AssessmentSubmitSchema } from "../lib/validators";
import { generateReport, processRetryQueue } from "../lib/ai-engine";
import { rateLimit, getClientIp } from "../lib/rate-limit";
import { logger } from "../lib/logger";

const router: IRouter = Router();

async function requireUser(req: Request, res: Response) {
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
    const ip = getClientIp(req as any);
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

    const { project_name, project_goal, report_language, assessment_type } =
      parsed.data;

    const [assessment] = await db
      .insert(assessmentsTable)
      .values({
        userId: user.id,
        projectName: project_name,
        projectGoal: project_goal,
        reportLanguage: report_language,
        assessmentType: assessment_type,
        status: "draft",
      })
      .returning({ id: assessmentsTable.id });

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

    const parsed = AssessmentSubmitSchema.safeParse(req.body);
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
          assessmentType: (existing.assessmentType ?? "full") as "full" | "mini",
        });
      } catch (err) {
        logger.error({ assessmentId: id, err }, "generateReport threw unexpectedly");
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

// ─── GET /api/cron/retry ─────────────────────────────────

router.get(
  "/cron/retry",
  async (req: Request, res: Response): Promise<void> => {
    const secret = req.headers["x-cron-secret"];
    if (!process.env["CRON_SECRET"] || secret !== process.env["CRON_SECRET"]) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    await processRetryQueue();
    res.json({ ok: true });
  }
);

export default router;
