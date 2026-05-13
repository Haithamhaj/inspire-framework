import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { assessmentFeedbackTable, assessmentsTable, usersTable } from "@workspace/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getAuthUser } from "../lib/auth";
import { generateAndSavePDF, type AssessmentForPDF } from "../lib/pdf";
import path from "path";
import fs from "fs";
import { randomBytes } from "crypto";
import { type InspireAxisScore } from "../inspire-types";
import { z } from "zod";

const router: IRouter = Router();

const FeedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  useful_answer: z.string().trim().max(1000).optional().nullable(),
  most_useful: z.string().trim().max(1000).optional().nullable(),
  missing: z.string().trim().max(1000).optional().nullable(),
  copied_instructions: z.boolean().optional(),
  feedback_source: z.enum(["after_report", "after_copy"]).optional(),
});

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

// ─── GET /api/results/:id ─────────────────────────────────

router.get(
  "/results/:id",
  async (req: Request, res: Response): Promise<void> => {
    const user = await requireUser(req, res);
    if (!user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const { id } = req.params;

    const [assessment] = await db
      .select()
      .from(assessmentsTable)
      .where(
        and(
          eq(assessmentsTable.id, id as string),
          eq(assessmentsTable.userId, user.id)
        )
      );

    if (!assessment) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }

    const [feedback] = await db
      .select({
        id: assessmentFeedbackTable.id,
        rating: assessmentFeedbackTable.rating,
        usefulAnswer: assessmentFeedbackTable.usefulAnswer,
        mostUseful: assessmentFeedbackTable.mostUseful,
        missing: assessmentFeedbackTable.missing,
        copiedInstructions: assessmentFeedbackTable.copiedInstructions,
        feedbackSource: assessmentFeedbackTable.feedbackSource,
        createdAt: assessmentFeedbackTable.createdAt,
        updatedAt: assessmentFeedbackTable.updatedAt,
      })
      .from(assessmentFeedbackTable)
      .where(
        and(
          eq(assessmentFeedbackTable.assessmentId, assessment.id),
          eq(assessmentFeedbackTable.userId, user.id)
        )
      );

    // Fetch previous assessment's inspire table for delta display
    // Scoped to the same user to prevent cross-user IDOR data leakage
    let previousInspireTable: unknown = null;
    if (assessment.previousAssessmentId) {
      const [prev] = await db
        .select({ inspireTable: assessmentsTable.inspireTable })
        .from(assessmentsTable)
        .where(
          and(
            eq(assessmentsTable.id, assessment.previousAssessmentId),
            eq(assessmentsTable.userId, user.id)
          )
        );
      previousInspireTable = prev?.inspireTable ?? null;
    }

    res.json({
      success: true,
      assessment: {
        id: assessment.id,
        status: assessment.status,
        projectName: assessment.projectName,
        projectGoal: assessment.projectGoal,
        reportLanguage: assessment.reportLanguage,
        assessmentType: assessment.assessmentType,
        aiProvider: assessment.aiProvider,
        aiModel: assessment.aiModel,
        createdAt: assessment.createdAt,
        completionTimeSeconds: assessment.completionTimeSeconds,
        pdfUrl: assessment.pdfUrl,
        reportContent: assessment.reportContent,
        inspireTable: assessment.inspireTable,
        roleAnalysis: assessment.roleAnalysis,
        redLines: assessment.redLines,
        strengths: assessment.strengths,
        developmentAreas: assessment.developmentAreas,
        recommendations: assessment.recommendations,
        systemInstruction: assessment.systemInstruction,
        quickStarters: assessment.quickStarters,
        shareToken: assessment.shareToken,
        shareEnabled: assessment.shareEnabled,
        previousAssessmentId: assessment.previousAssessmentId ?? null,
        previousInspireTable,
        feedback: feedback ?? null,
      },
    });
  }
);

// ─── POST /api/results/:id/feedback ──────────────────────

router.post(
  "/results/:id/feedback",
  async (req: Request, res: Response): Promise<void> => {
    const user = await requireUser(req, res);
    if (!user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const parsed = FeedbackSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: parsed.error.flatten(),
      });
      return;
    }

    const { id } = req.params;
    const [assessment] = await db
      .select({
        id: assessmentsTable.id,
        status: assessmentsTable.status,
        userId: assessmentsTable.userId,
      })
      .from(assessmentsTable)
      .where(
        and(
          eq(assessmentsTable.id, id as string),
          eq(assessmentsTable.userId, user.id)
        )
      );

    if (!assessment || assessment.status !== "completed") {
      res.status(404).json({ success: false, error: "Completed assessment not found" });
      return;
    }

    const clean = (value: string | null | undefined) => {
      const trimmed = value?.trim();
      return trimmed ? trimmed : null;
    };

    const [feedback] = await db
      .insert(assessmentFeedbackTable)
      .values({
        assessmentId: assessment.id,
        userId: user.id,
        rating: parsed.data.rating,
        usefulAnswer: clean(parsed.data.useful_answer),
        mostUseful: clean(parsed.data.most_useful),
        missing: clean(parsed.data.missing),
        copiedInstructions: Boolean(parsed.data.copied_instructions),
        feedbackSource: parsed.data.feedback_source ?? "after_report",
      })
      .onConflictDoUpdate({
        target: [
          assessmentFeedbackTable.assessmentId,
          assessmentFeedbackTable.userId,
        ],
        set: {
          rating: parsed.data.rating,
          usefulAnswer: clean(parsed.data.useful_answer),
          mostUseful: clean(parsed.data.most_useful),
          missing: clean(parsed.data.missing),
          copiedInstructions: Boolean(parsed.data.copied_instructions),
          feedbackSource: parsed.data.feedback_source ?? "after_report",
          updatedAt: new Date(),
        },
      })
      .returning({
        id: assessmentFeedbackTable.id,
        rating: assessmentFeedbackTable.rating,
        usefulAnswer: assessmentFeedbackTable.usefulAnswer,
        mostUseful: assessmentFeedbackTable.mostUseful,
        missing: assessmentFeedbackTable.missing,
        copiedInstructions: assessmentFeedbackTable.copiedInstructions,
        feedbackSource: assessmentFeedbackTable.feedbackSource,
        createdAt: assessmentFeedbackTable.createdAt,
        updatedAt: assessmentFeedbackTable.updatedAt,
      });

    res.json({ success: true, feedback });
  }
);

// ─── GET /api/my-assessments ──────────────────────────────

router.get(
  "/my-assessments",
  async (req: Request, res: Response): Promise<void> => {
    const user = await requireUser(req, res);
    if (!user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const assessments = await db
      .select({
        id: assessmentsTable.id,
        projectName: assessmentsTable.projectName,
        projectGoal: assessmentsTable.projectGoal,
        status: assessmentsTable.status,
        aiProvider: assessmentsTable.aiProvider,
        aiModel: assessmentsTable.aiModel,
        pdfUrl: assessmentsTable.pdfUrl,
        createdAt: assessmentsTable.createdAt,
        completionTimeSeconds: assessmentsTable.completionTimeSeconds,
        inspireTable: assessmentsTable.inspireTable,
        shareToken: assessmentsTable.shareToken,
        shareEnabled: assessmentsTable.shareEnabled,
      })
      .from(assessmentsTable)
      .where(eq(assessmentsTable.userId, user.id))
      .orderBy(desc(assessmentsTable.createdAt));

    res.json({ success: true, assessments });
  }
);

// ─── GET /api/my-assessments/compare?a=id1&b=id2 ─────────

router.get(
  "/my-assessments/compare",
  async (req: Request, res: Response): Promise<void> => {
    const user = await requireUser(req, res);
    if (!user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const { a, b } = req.query as { a?: string; b?: string };
    if (!a || !b) {
      res.status(400).json({ success: false, error: "Provide ?a=id&b=id" });
      return;
    }

    const [assessA] = await db
      .select()
      .from(assessmentsTable)
      .where(
        and(eq(assessmentsTable.id, a), eq(assessmentsTable.userId, user.id))
      );
    const [assessB] = await db
      .select()
      .from(assessmentsTable)
      .where(
        and(eq(assessmentsTable.id, b), eq(assessmentsTable.userId, user.id))
      );

    if (!assessA || !assessB) {
      res.status(404).json({ success: false, error: "One or both assessments not found" });
      return;
    }

    const compare = (tableA: InspireAxisScore[], tableB: InspireAxisScore[]) => {
      const mapB = Object.fromEntries(
        (tableB ?? []).map((r) => [r.axis, r])
      );
      return (tableA ?? []).map((rowA) => ({
        axis: rowA.axis,
        a: { score: rowA.score, percentage: rowA.percentage, note: rowA.note },
        b: mapB[rowA.axis]
          ? { score: mapB[rowA.axis].score, percentage: mapB[rowA.axis].percentage, note: mapB[rowA.axis].note }
          : null,
        delta: rowA.percentage - (mapB[rowA.axis]?.percentage ?? 0),
      }));
    };

    res.json({
      success: true,
      a: {
        id: assessA.id,
        projectName: assessA.projectName,
        createdAt: assessA.createdAt,
        inspireTable: assessA.inspireTable,
      },
      b: {
        id: assessB.id,
        projectName: assessB.projectName,
        createdAt: assessB.createdAt,
        inspireTable: assessB.inspireTable,
      },
      comparison: compare(
        (assessA.inspireTable as InspireAxisScore[]) ?? [],
        (assessB.inspireTable as InspireAxisScore[]) ?? []
      ),
    });
  }
);

// ─── POST /api/results/:id/share ─────────────────────────

router.post(
  "/results/:id/share",
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
        userId: assessmentsTable.userId,
        shareToken: assessmentsTable.shareToken,
        shareEnabled: assessmentsTable.shareEnabled,
      })
      .from(assessmentsTable)
      .where(
        and(
          eq(assessmentsTable.id, id as string),
          eq(assessmentsTable.userId, user.id)
        )
      );

    if (!assessment || assessment.status !== "completed") {
      res.status(404).json({ success: false, error: "Completed assessment not found" });
      return;
    }

    // Re-use existing token if already enabled, otherwise generate new one
    const token = assessment.shareToken ?? randomBytes(24).toString("hex");

    await db
      .update(assessmentsTable)
      .set({ shareToken: token, shareEnabled: true })
      .where(eq(assessmentsTable.id, id as string));

    req.log.info({ assessmentId: id, userId: user.id }, "Share link created");
    res.json({ success: true, shareToken: token });
  }
);

// ─── DELETE /api/results/:id/share ───────────────────────

router.delete(
  "/results/:id/share",
  async (req: Request, res: Response): Promise<void> => {
    const user = await requireUser(req, res);
    if (!user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const { id } = req.params;

    const [assessment] = await db
      .select({ id: assessmentsTable.id, userId: assessmentsTable.userId })
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

    await db
      .update(assessmentsTable)
      .set({ shareToken: null, shareEnabled: false })
      .where(eq(assessmentsTable.id, id as string));

    req.log.info({ assessmentId: id, userId: user.id }, "Share link revoked");
    res.json({ success: true });
  }
);

// ─── GET /api/share/:token ────────────────────────────────

router.get(
  "/share/:token",
  async (req: Request, res: Response): Promise<void> => {
    const { token } = req.params;

    const [assessment] = await db
      .select()
      .from(assessmentsTable)
      .where(
        and(
          eq(assessmentsTable.shareToken, token as string),
          eq(assessmentsTable.shareEnabled, true)
        )
      );

    if (!assessment || assessment.status !== "completed") {
      res.status(404).json({ success: false, error: "Share link not found or expired" });
      return;
    }

    // Return safe public subset — system instruction is excluded
    res.json({
      success: true,
      assessment: {
        id: assessment.id,
        projectName: assessment.projectName,
        projectGoal: assessment.projectGoal,
        reportLanguage: assessment.reportLanguage,
        assessmentType: assessment.assessmentType,
        aiProvider: assessment.aiProvider,
        aiModel: assessment.aiModel,
        createdAt: assessment.createdAt,
        reportContent: assessment.reportContent,
        inspireTable: assessment.inspireTable,
        roleAnalysis: assessment.roleAnalysis,
        redLines: assessment.redLines,
        strengths: assessment.strengths,
        developmentAreas: assessment.developmentAreas,
        recommendations: assessment.recommendations,
        quickStarters: assessment.quickStarters,
      },
    });
  }
);

// ─── POST /api/results/:id/generate-pdf ──────────────────

router.post(
  "/results/:id/generate-pdf",
  async (req: Request, res: Response): Promise<void> => {
    const user = await requireUser(req, res);
    if (!user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const { id } = req.params;

    const [assessment] = await db
      .select()
      .from(assessmentsTable)
      .where(
        and(
          eq(assessmentsTable.id, id as string),
          eq(assessmentsTable.userId, user.id)
        )
      );

    if (!assessment || assessment.status !== "completed") {
      res.status(404).json({ success: false, error: "Completed assessment not found" });
      return;
    }

    if (assessment.pdfUrl) {
      res.json({ success: true, pdfUrl: assessment.pdfUrl });
      return;
    }

    const pdfUrl = await generateAndSavePDF(id as string, user, assessment as AssessmentForPDF);
    if (!pdfUrl) {
      res.status(500).json({ success: false, error: "PDF generation failed" });
      return;
    }

    res.json({ success: true, pdfUrl });
  }
);

// ─── Serve PDF files statically ───────────────────────────

router.get(
  "/pdfs/:filename",
  (req: Request, res: Response): void => {
    const rawFilename = req.params.filename;
    const filename = Array.isArray(rawFilename) ? rawFilename[0] : rawFilename;
    if (!filename || !filename.endsWith(".pdf") || filename.includes("..")) {
      res.status(400).send("Invalid filename");
      return;
    }
    const filePath = path.join(process.cwd(), "public", "pdfs", filename);
    if (!fs.existsSync(filePath)) {
      res.status(404).send("Not found");
      return;
    }
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    fs.createReadStream(filePath).pipe(res);
  }
);

export default router;
