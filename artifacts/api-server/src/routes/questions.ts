import { Router, type IRouter, type Request, type Response } from "express";
import { V2_QUESTIONS } from "../data/questions-v2";

const router: IRouter = Router();

// ─── GET /api/questions ───────────────────────────────────────────────────────
// Returns the public question bank for v2 full assessments.
// Backend-only fields (behavioralSignal, instructionSections, ruleText, etc.)
// are never included — only the public shape.

router.get("/questions", (_req: Request, res: Response): void => {
  const questions = V2_QUESTIONS.map((q) => ({
    questionId: q.id,
    block: q.block,
    selectionMode: q.selectionMode,
    questionAr: q.questionAr,
    questionEn: q.questionEn,
    options: q.options.map((o) => ({
      optionId: o.id,
      textAr: o.textAr,
      textEn: o.textEn,
    })),
  }));

  res.json({ success: true, questions });
});

export default router;
