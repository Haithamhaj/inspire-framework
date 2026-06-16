import OpenAI from "openai";
import { db } from "@workspace/db";
import {
  assessmentGenerationRunsTable,
  assessmentsTable,
  usersTable,
} from "@workspace/db/schema";
import { eq, lte, lt, and } from "drizzle-orm";
import {
  buildInspireInstructionPromptV2,
  buildPrompt,
  buildReportWriterPromptV2,
  type PromptData,
  type PromptDataV2,
} from "./prompt-builder";
import {
  parseFullReport,
  parseInspireInstructionJsonV2,
  parseReportWriterJsonV2,
} from "./report-parser";
import { buildOperatingPatternReportContentV1 } from "../inspire-types";
import { sendResultsEmail, sendFailureEmail, sendAdminAlertEmail } from "./email";
import { logger } from "./logger";

const OPENAI_MODEL = "gpt-5.5";
const V2_PROMPT_VERSION = "inspire-v2-instruction+report@1";

type AiTextResult = {
  success: boolean;
  text?: string;
  provider?: string;
  model?: string;
  errorMessage?: string;
};

type V2Answer = { questionId: string; optionId: string };

function isV2Answers(value: unknown): value is V2Answer[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    typeof (value[0] as Record<string, unknown>)?.questionId === "string" &&
    typeof (value[0] as Record<string, unknown>)?.optionId === "string"
  );
}

let _openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env["OPENAI_API_KEY"]! });
  }
  return _openai;
}

const RETRY_INTERVALS_MS = [
  30_000, 60_000, 120_000, 300_000, 300_000, 600_000, 600_000, 1_800_000,
  1_800_000, 3_600_000,
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── MAIN ENTRY (v1 / mini path) ──────────────────────────────────────────────

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
      OPENAI_MODEL,
      "v1"
    );
    return;
  }

  await db
    .update(assessmentsTable)
    .set({
      status: "pending_retry",
      retryCount: 0,
      nextRetryAt: new Date(Date.now() + RETRY_INTERVALS_MS[0]),
    })
    .where(eq(assessmentsTable.id, assessmentId));

  logger.warn({ assessmentId }, "OpenAI report generation failed — queued for retry");
  sendAdminAlertEmail({
    subject: "INSPIRE alert — report queued for retry",
    assessmentId,
    reason: `A report generation attempt failed and was queued for retry. openai/${openaiResult.model ?? OPENAI_MODEL}: ${openaiResult.errorMessage ?? "OpenAI generation failed."}`,
  }).catch((err) =>
    logger.error({ assessmentId, err }, "sendAdminAlertEmail threw")
  );
}

// ─── V2 ENTRY (full assessment, section-routing) ──────────────────────────────

export async function generateReportV2(
  assessmentId: string,
  promptData: PromptDataV2
): Promise<void> {
  const [assessment] = await db
    .select({
      id: assessmentsTable.id,
      userId: assessmentsTable.userId,
      assessmentType: assessmentsTable.assessmentType,
    })
    .from(assessmentsTable)
    .where(eq(assessmentsTable.id, assessmentId));

  if (!assessment) {
    logger.error({ assessmentId }, "Cannot generate V2 report for missing assessment");
    return;
  }

  let failureReason = "No provider returned valid V2 report and instruction output.";
  try {
    let generationResult = await runV2GenerationWithEvidence({
      assessmentId,
      userId: assessment.userId,
      assessmentType: assessment.assessmentType ?? "full",
      promptData,
    });
    if (generationResult.success) {
      await finishV2(
        assessmentId,
        generationResult.reportText!,
        generationResult.instructionText!,
        promptData.reportLanguage,
        promptData.projectName,
        generationResult.provider!,
        generationResult.model!
      );
      return;
    }

    // If the AI returned output but validation/parsing failed, try one immediate retry
    // before putting the user into pending_retry. This reduces user-visible failures
    // caused by minor formatting drift.
    if (generationResult.errorMessage?.includes("JSON validation failed")) {
      const retryResult = await runV2GenerationWithEvidence({
        assessmentId,
        userId: assessment.userId,
        assessmentType: assessment.assessmentType ?? "full",
        promptData,
        attemptNumber: 2,
      });
      if (retryResult.success) {
        await finishV2(
          assessmentId,
          retryResult.reportText!,
          retryResult.instructionText!,
          promptData.reportLanguage,
          promptData.projectName,
          retryResult.provider!,
          retryResult.model!
        );
        return;
      }
      if (retryResult.errorMessage) {
        failureReason = retryResult.errorMessage;
      }
    }

    if (generationResult.errorMessage) {
      failureReason = generationResult.errorMessage;
    }
  } catch (err) {
    failureReason = err instanceof Error ? err.message : String(err);
    logger.error({ assessmentId, err }, "V2 generation or validation failed before completion");
  }

  await db
    .update(assessmentsTable)
    .set({
      status: "pending_retry",
      retryCount: 0,
      nextRetryAt: new Date(Date.now() + RETRY_INTERVALS_MS[0]),
    })
    .where(eq(assessmentsTable.id, assessmentId));

  logger.warn({ assessmentId }, "OpenAI V2 generation failed — queued for retry");
  sendAdminAlertEmail({
    subject: "INSPIRE alert — report queued for retry",
    assessmentId,
    reason: `A v2 report generation attempt failed or did not validate, so it was queued for retry. ${failureReason}`,
  }).catch((err) =>
    logger.error({ assessmentId, err }, "sendAdminAlertEmail threw")
  );
}

// ─── CRON JOB (called every minute) ──────────────────────────────────────────

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

    const count = assessment.retryCount ?? 0;

    // Determine retry path: assessmentType is the primary branch; answer shape
    // is a secondary typed guard for full assessments to distinguish v2 vs v1.
    const aType = assessment.assessmentType ?? "full";
    const storedAnswers = assessment.behavioralAnswers;
    const isV2Full = aType === "full" && isV2Answers(storedAnswers);

    let prompt: string;

    if (aType === "mini") {
      type LegacyBehavioralAnswer = { question_index: number; answer_index: number };
      type LegacyScenarioAnswer = { scenario_index: number; choice: "a" | "b" };
      const promptData: PromptData = {
        name: user.name,
        jobTitle: user.jobTitle ?? undefined,
        projectName: assessment.projectName,
        projectGoal: assessment.projectGoal,
        reportLanguage: assessment.reportLanguage as "ar" | "en" | "both",
        behavioralAnswers: (assessment.behavioralAnswers as LegacyBehavioralAnswer[]) ?? [],
        scenarioAnswers: (assessment.scenarioAnswers as LegacyScenarioAnswer[]) ?? [],
        openAnswer: assessment.openAnswer ?? "",
      };
      prompt = buildPrompt(promptData);
    } else if (isV2Full) {
      const promptDataV2: PromptDataV2 = {
        name: user.name,
        jobTitle: user.jobTitle ?? undefined,
        projectName: assessment.projectName,
        projectGoal: assessment.projectGoal,
        domain: assessment.domain ?? assessment.projectName,
        customDomain: assessment.customDomain ?? undefined,
        domainSpecialization: assessment.domainSpecialization ?? undefined,
        projectContext: assessment.projectContext ?? assessment.projectGoal,
        reportLanguage: assessment.reportLanguage as "ar" | "en" | "both",
        answers: storedAnswers,
        openAnswer: assessment.openAnswer ?? undefined,
      };
      let generationResult: Awaited<ReturnType<typeof tryGenerateV2InstructionAndReport>>;
      try {
        generationResult = await runV2GenerationWithEvidence({
          assessmentId: assessment.id,
          userId: assessment.userId,
          assessmentType: assessment.assessmentType ?? "full",
          promptData: promptDataV2,
          attemptNumber: count + 1,
        });
        if (generationResult.success) {
          await finishV2(
            assessment.id,
            generationResult.reportText!,
            generationResult.instructionText!,
            promptDataV2.reportLanguage,
            promptDataV2.projectName,
            generationResult.provider!,
            generationResult.model!
          );
          continue;
        }
      } catch (err) {
        logger.error(
          { assessmentId: assessment.id, err },
          "V2 retry generation or validation failed before completion"
        );
        generationResult = {
          success: false,
          errorMessage: err instanceof Error ? err.message : String(err),
        };
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
        sendAdminAlertEmail({
          subject: "INSPIRE alert — report failed after retries",
          assessmentId: assessment.id,
          reason: "A v2 paid/full report reached the retry limit and is now failed.",
        }).catch((err) =>
          logger.error({ assessmentId: assessment.id, err }, "sendAdminAlertEmail threw")
        );
        sendFailureEmail(user.email, user.name).catch((err) =>
          logger.error({ assessmentId: assessment.id, err }, "sendFailureEmail threw")
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
        sendAdminAlertEmail({
          subject: "INSPIRE alert — report retry failed",
          assessmentId: assessment.id,
          reason: `A v2 retry attempt failed and another retry was scheduled. Attempt ${nextCount}/10. ${generationResult.errorMessage ?? "No provider returned valid output."}`,
        }).catch((err) =>
          logger.error({ assessmentId: assessment.id, err }, "sendAdminAlertEmail threw")
        );
      }
      continue;
    } else {
      const promptData: PromptData = {
        name: user.name,
        jobTitle: user.jobTitle ?? undefined,
        projectName: assessment.projectName,
        projectGoal: assessment.projectGoal,
        reportLanguage: assessment.reportLanguage as "ar" | "en" | "both",
        behavioralAnswers: (assessment.behavioralAnswers as Array<{ question_index: number; answer_index: number }>) ?? [],
        scenarioAnswers: (assessment.scenarioAnswers as Array<{ scenario_index: number; choice: "a" | "b" }>) ?? [],
        openAnswer: assessment.openAnswer ?? "",
      };
      prompt = buildPrompt(promptData);
    }

    const openaiResult = await tryOpenAI(prompt);
    if (openaiResult.success) {
      await finish(assessment.id, openaiResult.text!, "openai", OPENAI_MODEL, "v1");
      continue;
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
      sendFailureEmail(user.email, user.name).catch((err) =>
        logger.error({ assessmentId: assessment.id, err }, "sendFailureEmail threw")
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
      sendAdminAlertEmail({
        subject: "INSPIRE alert — report retry failed",
        assessmentId: assessment.id,
        reason: `A report retry attempt failed and another retry was scheduled. Attempt ${nextCount}/10. openai/${openaiResult.model ?? OPENAI_MODEL}: ${openaiResult.errorMessage ?? "OpenAI generation failed."}`,
      }).catch((err) =>
        logger.error({ assessmentId: assessment.id, err }, "sendAdminAlertEmail threw")
      );
    }
  }
}

// ─── PROVIDER CALLERS ─────────────────────────────────────────────────────────

async function tryOpenAI(
  prompt: string
): Promise<AiTextResult> {
  if (!process.env["OPENAI_API_KEY"]) {
    return { success: false, errorMessage: "OPENAI_API_KEY is not configured." };
  }
  const model = OPENAI_MODEL;
  let lastError = "";
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await getOpenAI().chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        max_completion_tokens: 3500,
      });
      const text = res.choices[0]?.message?.content ?? "";
      if (!text) throw new Error("Empty response");
      return { success: true, text };
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      logger.error({ attempt, model, err }, "[OpenAI] attempt failed");
      if (attempt < 3) await sleep(2000 * attempt);
    }
  }
  return {
    success: false,
    provider: "openai",
    model,
    errorMessage: lastError || "OpenAI generation failed.",
  };
}

async function tryGenerateAiText(prompt: string): Promise<AiTextResult> {
  const openaiResult = await tryOpenAI(prompt);
  if (openaiResult.success) {
    return {
      success: true,
      text: openaiResult.text,
      provider: "openai",
      model: OPENAI_MODEL,
    };
  }
  return {
    success: false,
    errorMessage: `openai/${openaiResult.model ?? OPENAI_MODEL}: ${openaiResult.errorMessage ?? "OpenAI generation failed."}`,
  };
}

async function tryGenerateV2InstructionAndReport(
  promptData: PromptDataV2
): Promise<{
  success: boolean;
  instructionText?: string;
  reportText?: string;
  provider?: string;
  model?: string;
  errorMessage?: string;
}> {
  const instructionPrompt = buildInspireInstructionPromptV2(promptData);
  const reportPrompt = buildReportWriterPromptV2(promptData);

  const instructionResult = await tryGenerateAiText(instructionPrompt);
  if (!instructionResult.success || !instructionResult.text) {
    return {
      success: false,
      errorMessage: `Instruction generation failed: ${instructionResult.errorMessage ?? "No provider returned output."}`,
    };
  }

  const reportResult = await tryGenerateAiText(reportPrompt);
  if (!reportResult.success || !reportResult.text) {
    return {
      success: false,
      errorMessage: `Report generation failed: ${reportResult.errorMessage ?? "No provider returned output."}`,
    };
  }

  const sameProvider = instructionResult.provider === reportResult.provider;
  const sameModel = instructionResult.model === reportResult.model;

  return {
    success: true,
    instructionText: instructionResult.text,
    reportText: reportResult.text,
    provider: sameProvider
      ? instructionResult.provider
      : `${instructionResult.provider}+${reportResult.provider}`,
    model: sameModel ? instructionResult.model : `${instructionResult.model}+${reportResult.model}`,
  };
}

function validateV2Outputs(params: {
  rawReportText: string;
  rawInstructionText: string;
  reportLanguage: "ar" | "en" | "both";
  projectName: string;
}): { ok: true } | { ok: false; errorMessage: string } {
  try {
    const reportWriterOutput = parseReportWriterJsonV2(params.rawReportText, params.reportLanguage);
    void buildOperatingPatternReportContentV1(reportWriterOutput, params.reportLanguage);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, errorMessage: `Report JSON validation failed: ${message}` };
  }

  try {
    const markdown = parseInspireInstructionJsonV2(params.rawInstructionText, {
      instructionLanguage: "en",
      projectName: params.projectName,
    });
    if (!markdown || markdown.trim().length < 40) {
      return { ok: false, errorMessage: "Instruction validation failed: rendered output too short." };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, errorMessage: `Instruction JSON validation failed: ${message}` };
  }

  return { ok: true };
}

async function runV2GenerationWithEvidence(params: {
  assessmentId: string;
  userId: string;
  assessmentType: string;
  promptData: PromptDataV2;
  attemptNumber?: number;
}): Promise<{
  success: boolean;
  instructionText?: string;
  reportText?: string;
  provider?: string;
  model?: string;
  errorMessage?: string;
}> {
  const [run] = await db
    .insert(assessmentGenerationRunsTable)
    .values({
      assessmentId: params.assessmentId,
      userId: params.userId,
      assessmentType: params.assessmentType,
      status: "processing",
      promptVersion: V2_PROMPT_VERSION,
      attemptNumber: params.attemptNumber ?? 1,
      inputSnapshot: {
        promptData: params.promptData,
        promptVersion: V2_PROMPT_VERSION,
      },
    })
    .returning({ id: assessmentGenerationRunsTable.id });

  try {
    const result = await tryGenerateV2InstructionAndReport(params.promptData);
    if (result.success) {
      const validation = validateV2Outputs({
        rawReportText: result.reportText!,
        rawInstructionText: result.instructionText!,
        reportLanguage: params.promptData.reportLanguage,
        projectName: params.promptData.projectName,
      });
      if (!validation.ok) {
        await db
          .update(assessmentGenerationRunsTable)
          .set({
            status: "failed",
            completedAt: new Date(),
            errorMessage: validation.errorMessage,
          })
          .where(eq(assessmentGenerationRunsTable.id, run!.id));

        return { success: false, errorMessage: validation.errorMessage };
      }

      await db
        .update(assessmentGenerationRunsTable)
        .set({
          status: "completed",
          provider: result.provider ?? null,
          model: result.model ?? null,
          completedAt: new Date(),
          outputSnapshot: {
            reportText: result.reportText,
            instructionText: result.instructionText,
          },
        })
        .where(eq(assessmentGenerationRunsTable.id, run!.id));
      return result;
    }

    await db
      .update(assessmentGenerationRunsTable)
      .set({
        status: "failed",
        completedAt: new Date(),
        errorMessage:
          result.errorMessage ??
          "No provider returned valid V2 report and instruction output.",
      })
      .where(eq(assessmentGenerationRunsTable.id, run!.id));

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await db
      .update(assessmentGenerationRunsTable)
      .set({
        status: "failed",
        completedAt: new Date(),
        errorMessage: message,
      })
      .where(eq(assessmentGenerationRunsTable.id, run!.id));
    throw err;
  }
}

// ─── SAVE (v1 / mini) ─────────────────────────────────────────────────────────

async function finish(
  assessmentId: string,
  rawText: string,
  provider: string,
  model: string,
  _version: "v1"
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
  logger.info({ assessmentId, provider, model }, "Assessment completed (v1)");
  sendResultsEmail(assessmentId).catch((err) =>
    logger.error({ assessmentId, err }, "sendResultsEmail threw")
  );
}

// ─── SAVE (v2) ────────────────────────────────────────────────────────────────

async function finishV2(
  assessmentId: string,
  rawReportText: string,
  rawInstructionText: string,
  reportLanguage: "ar" | "en" | "both",
  projectName: string,
  provider: string,
  model: string
): Promise<void> {
  const reportWriterOutput = parseReportWriterJsonV2(rawReportText, reportLanguage);
  const reportContent = buildOperatingPatternReportContentV1(
    reportWriterOutput,
    reportLanguage
  );
  const instructionMarkdown = parseInspireInstructionJsonV2(rawInstructionText, {
    instructionLanguage: "en",
    projectName,
  });
  await db
    .update(assessmentsTable)
    .set({
      systemInstruction: instructionMarkdown,
      reportContent,
      quickStarters: null,
      redLines: null,
      recommendations: null,
      roleAnalysis: null,
      strengths: null,
      developmentAreas: null,
      inspireTable: null,
      status: "completed",
      aiProvider: provider,
      aiModel: model,
      retryCount: 0,
      nextRetryAt: null,
    })
    .where(eq(assessmentsTable.id, assessmentId));
  logger.info({ assessmentId, provider, model }, "Assessment completed (v2)");
  sendResultsEmail(assessmentId).catch((err) =>
    logger.error({ assessmentId, err }, "sendResultsEmail threw")
  );
}
