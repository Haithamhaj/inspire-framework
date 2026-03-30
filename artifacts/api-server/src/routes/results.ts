import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { assessmentsTable, usersTable } from "@workspace/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getAuthUser } from "../lib/auth";
import { generateAndSavePDF } from "../lib/pdf";
import { logger } from "../lib/logger";
import path from "path";
import fs from "fs";

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
        inspireTable: assessment.inspireTable,
        roleAnalysis: assessment.roleAnalysis,
        redLines: assessment.redLines,
        strengths: assessment.strengths,
        developmentAreas: assessment.developmentAreas,
        recommendations: assessment.recommendations,
        systemInstruction: assessment.systemInstruction,
        quickStarters: assessment.quickStarters,
      },
    });
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

    const compare = (tableA: any[], tableB: any[]) => {
      const mapB = Object.fromEntries(
        (tableB ?? []).map((r: any) => [r.axis, r])
      );
      return (tableA ?? []).map((rowA: any) => ({
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
        (assessA.inspireTable as any[]) ?? [],
        (assessB.inspireTable as any[]) ?? []
      ),
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

    const pdfUrl = await generateAndSavePDF(id as string, user, assessment);
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
    const { filename } = req.params;
    if (!filename?.endsWith(".pdf") || filename.includes("..")) {
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
