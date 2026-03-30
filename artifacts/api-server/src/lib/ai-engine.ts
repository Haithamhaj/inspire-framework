import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@workspace/db";
import { assessmentsTable, usersTable } from "@workspace/db/schema";
import { eq, lte, lt, and } from "drizzle-orm";
import { buildPrompt, type PromptData } from "./prompt-builder";
import { parseFullReport } from "./report-parser";
import { sendResultsEmail, sendFailureEmail } from "./email";
import { logger } from "./logger";

const OPENAI_MODEL_DEFAULT = "gpt-5.4";
const CLAUDE_MODEL_DEFAULT = "claude-sonnet-4-6";

let _openai: OpenAI | null = null;
let _anthropic: Anthropic | null = null;

function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env["OPENAI_API_KEY"]! });
  }
  return _openai;
}

function getAnthropic(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({ apiKey: process.env["ANTHROPIC_API_KEY"]! });
  }
  return _anthropic;
}

const RETRY_INTERVALS_MS = [
  30_000, 60_000, 120_000, 300_000, 300_000, 600_000, 600_000, 1_800_000,
  1_800_000, 3_600_000,
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── MAIN ENTRY ──────────────────────────────────────────

export async function generateReport(
  assessmentId: string,
  promptData: PromptData
): Promise<void> {
  const prompt = buildPrompt(promptData);

  const openaiResult = await tryOpenAI(prompt);
  if (openaiResult.success) {
    await finish(
      assessmentId,
      openaiResult.text!,
      "openai",
      process.env["OPENAI_MODEL"] ?? OPENAI_MODEL_DEFAULT
    );
    return;
  }

  if (process.env["ANTHROPIC_API_KEY"]) {
    const claudeResult = await tryClaude(prompt);
    if (claudeResult.success) {
      await finish(
        assessmentId,
        claudeResult.text!,
        "anthropic",
        process.env["ANTHROPIC_MODEL"] ?? CLAUDE_MODEL_DEFAULT
      );
      return;
    }
  }

  await db
    .update(assessmentsTable)
    .set({
      status: "pending_retry",
      retryCount: 0,
      nextRetryAt: new Date(Date.now() + RETRY_INTERVALS_MS[0]),
    })
    .where(eq(assessmentsTable.id, assessmentId));

  logger.warn({ assessmentId }, "Both AI providers failed — queued for retry");
}

// ─── CRON JOB (called every minute) ──────────────────────

export async function processRetryQueue(): Promise<void> {
  const pending = await db
    .select()
    .from(assessmentsTable)
    .where(
      and(
        eq(assessmentsTable.status, "pending_retry"),
        lte(assessmentsTable.nextRetryAt, new Date()),
        lt(assessmentsTable.retryCount, 10)
      )
    );

  for (const assessment of pending) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, assessment.userId));

    if (!user) continue;

    const promptData: PromptData = {
      name: user.name,
      jobTitle: user.jobTitle ?? undefined,
      projectName: assessment.projectName,
      projectGoal: assessment.projectGoal,
      reportLanguage: assessment.reportLanguage as "ar" | "en" | "both",
      behavioralAnswers: (assessment.behavioralAnswers as any) ?? [],
      scenarioAnswers: (assessment.scenarioAnswers as any) ?? [],
      openAnswer: assessment.openAnswer ?? "",
    };

    const prompt = buildPrompt(promptData);
    const count = assessment.retryCount ?? 0;

    const openaiResult = await tryOpenAI(prompt);
    if (openaiResult.success) {
      await finish(
        assessment.id,
        openaiResult.text!,
        "openai",
        process.env["OPENAI_MODEL"] ?? OPENAI_MODEL_DEFAULT
      );
      continue;
    }

    if (process.env["ANTHROPIC_API_KEY"]) {
      const claudeResult = await tryClaude(prompt);
      if (claudeResult.success) {
        await finish(
          assessment.id,
          claudeResult.text!,
          "anthropic",
          process.env["ANTHROPIC_MODEL"] ?? CLAUDE_MODEL_DEFAULT
        );
        continue;
      }
    }

    const nextCount = count + 1;
    if (nextCount >= 10) {
      await db
        .update(assessmentsTable)
        .set({ status: "failed", retryCount: nextCount, nextRetryAt: null })
        .where(eq(assessmentsTable.id, assessment.id));
      logger.error(
        { assessmentId: assessment.id },
        "Assessment failed after 10 retries"
      );
    } else {
      await db
        .update(assessmentsTable)
        .set({
          retryCount: nextCount,
          nextRetryAt: new Date(
            Date.now() + (RETRY_INTERVALS_MS[count] ?? 3_600_000)
          ),
        })
        .where(eq(assessmentsTable.id, assessment.id));
    }
  }
}

// ─── PROVIDER CALLERS ─────────────────────────────────────

async function tryOpenAI(
  prompt: string
): Promise<{ success: boolean; text?: string }> {
  if (!process.env["OPENAI_API_KEY"]) return { success: false };
  const model = process.env["OPENAI_MODEL"] ?? OPENAI_MODEL_DEFAULT;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await getOpenAI().chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 3500,
        temperature: 0.7,
      });
      const text = res.choices[0]?.message?.content ?? "";
      if (!text) throw new Error("Empty response");
      return { success: true, text };
    } catch (err) {
      logger.error({ attempt, model }, `[OpenAI] attempt ${attempt} failed: ${err}`);
      if (attempt < 3) await sleep(2000 * attempt);
    }
  }
  return { success: false };
}

async function tryClaude(
  prompt: string
): Promise<{ success: boolean; text?: string }> {
  if (!process.env["ANTHROPIC_API_KEY"]) return { success: false };
  const model = process.env["ANTHROPIC_MODEL"] ?? CLAUDE_MODEL_DEFAULT;
  try {
    const res = await getAnthropic().messages.create({
      model,
      max_tokens: 3500,
      messages: [{ role: "user", content: prompt }],
    });
    const text = res.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");
    if (!text) throw new Error("Empty response");
    return { success: true, text };
  } catch (err) {
    logger.error({ model }, `[Claude] failed: ${err}`);
    return { success: false };
  }
}

// ─── SAVE ─────────────────────────────────────────────────

async function finish(
  assessmentId: string,
  rawText: string,
  provider: string,
  model: string
): Promise<void> {
  const parsed = parseFullReport(rawText);
  await db
    .update(assessmentsTable)
    .set({
      ...parsed,
      status: "completed",
      aiProvider: provider,
      aiModel: model,
      retryCount: 0,
      nextRetryAt: null,
    })
    .where(eq(assessmentsTable.id, assessmentId));
  logger.info({ assessmentId, provider, model }, "Assessment completed");
  sendResultsEmail(assessmentId).catch((err) =>
    logger.error({ assessmentId, err }, "sendResultsEmail threw")
  );
}
