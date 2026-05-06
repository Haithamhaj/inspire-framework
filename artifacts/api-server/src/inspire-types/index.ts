import { z } from "zod";

export type ReportLanguage = "ar" | "en" | "both";
export type AssessmentType = "full" | "mini";
export type AssessmentStatus =
  | "draft"
  | "processing"
  | "pending_retry"
  | "completed"
  | "failed";

export interface BehavioralAnswer {
  questionIndex: number;
  answerIndex: number;
}

export interface ScenarioAnswer {
  scenarioIndex: number;
  choice: "a" | "b";
}

export interface InspireAxisScore {
  axis: string;
  score: number;
  max: number;
  percentage: number;
  confidence: number;
  note: string;
}

export interface ParsedReport {
  inspireTable: InspireAxisScore[];
  roleAnalysis: string;
  redLines: string[];
  strengths: string[];
  developmentAreas: string[];
  recommendations: string[];
  systemInstruction: string;
  quickStarters: string[];
}

const FORBIDDEN_REPORT_WRITER_SECTION_TERMS = [
  "strengths",
  "risks",
  "redLines",
  "roleAnalysis",
  "quickStarters",
  "behavioralSignalMap",
  "inspireScores",
  "starterPrompts",
] as const;

const FORBIDDEN_REPORT_WRITER_INTERNAL_TERMS = [
  "scores",
  "matrix",
  "roleScores",
  "computedProfile",
  "selectedAnswers",
  "questionId",
  "optionId",
  "selectionSignals",
  "priorityScore",
  "routeKey",
  "evidenceLabel",
] as const;

const FORBIDDEN_REPORT_WRITER_PATTERNS = [
  ...FORBIDDEN_REPORT_WRITER_SECTION_TERMS,
  ...FORBIDDEN_REPORT_WRITER_INTERNAL_TERMS,
].map((term) => new RegExp(term, "i"));

const reportWriterBulletSchema = z
  .string()
  .trim()
  .min(1)
  .max(500)
  .superRefine((value, ctx) => {
    if (/^#{1,6}\s/.test(value)) {
      ctx.addIssue({
        code: "custom",
        message: "Bullet strings must not contain Markdown headings.",
      });
    }
    if (/```/.test(value) || /^\s*[{[]/.test(value)) {
      ctx.addIssue({
        code: "custom",
        message: "Bullet strings must not contain code fences or raw JSON.",
      });
    }
    const forbiddenPattern = FORBIDDEN_REPORT_WRITER_PATTERNS.find((pattern) =>
      pattern.test(value)
    );
    if (forbiddenPattern) {
      ctx.addIssue({
        code: "custom",
        message: `Bullet string contains forbidden report/internal term: ${forbiddenPattern}`,
      });
    }
  });

export const ReportWriterOutputSchema = z
  .object({
    operatingSnapshot: z.object({
      bullets: z.array(reportWriterBulletSchema).min(3).max(5),
    }),
    personalizedRecommendations: z.object({
      bullets: z.array(reportWriterBulletSchema).min(4).max(6),
    }),
    customAiUsageTips: z.object({
      bullets: z.array(reportWriterBulletSchema).min(2).max(4),
    }),
    instructionExplanation: z.object({
      include: z.boolean(),
      bullets: z.array(reportWriterBulletSchema).max(5),
    }),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.instructionExplanation.include) {
      if (value.instructionExplanation.bullets.length < 3) {
        ctx.addIssue({
          code: "custom",
          path: ["instructionExplanation", "bullets"],
          message: "Instruction explanation must contain 3 to 5 bullets when included.",
        });
      }
    } else if (value.instructionExplanation.bullets.length !== 0) {
      ctx.addIssue({
        code: "custom",
        path: ["instructionExplanation", "bullets"],
        message: "Instruction explanation bullets must be empty when include is false.",
      });
    }
  });

export type ReportWriterOutput = z.infer<typeof ReportWriterOutputSchema>;

export const OperatingPatternReportContentV1Schema = z
  .object({
    reportType: z.literal("operating_pattern"),
    version: z.literal("v1"),
    generatedAt: z.string().datetime().optional(),
    language: z.enum(["ar", "en", "both"]),
    sections: ReportWriterOutputSchema,
    fixedContent: z
      .object({
        craftIncluded: z.literal(true),
        smartPromptEngineerLinkIncluded: z.literal(true),
        copyReadyInstructionLanguage: z.literal("en"),
      })
      .strict(),
  })
  .strict();

export const PersistedReportContentSchema = z.discriminatedUnion("version", [
  OperatingPatternReportContentV1Schema,
]);

export type OperatingPatternReportContentV1 = z.infer<
  typeof OperatingPatternReportContentV1Schema
>;
export type PersistedReportContent = z.infer<typeof PersistedReportContentSchema>;

export function buildOperatingPatternReportContentV1(
  writerOutput: ReportWriterOutput,
  reportLanguage: ReportLanguage,
  generatedAt: string = new Date().toISOString()
): OperatingPatternReportContentV1 {
  const validation = validateReportWriterOutputContract(writerOutput, reportLanguage);
  if (!validation.success) {
    throw new Error(`Invalid Report Writer output for persisted reportContent: ${validation.error.message}`);
  }

  return {
    reportType: "operating_pattern",
    version: "v1",
    generatedAt,
    language: reportLanguage,
    sections: validation.data,
    fixedContent: {
      craftIncluded: true,
      smartPromptEngineerLinkIncluded: true,
      copyReadyInstructionLanguage: "en",
    },
  };
}

export const expectedInstructionExplanationInclude = (reportLanguage: ReportLanguage): boolean =>
  reportLanguage !== "en";

export function validateReportWriterOutputContract(
  output: unknown,
  reportLanguage: ReportLanguage
): z.SafeParseReturnType<ReportWriterOutput, ReportWriterOutput> {
  const parsed = ReportWriterOutputSchema.safeParse(output);
  if (!parsed.success) return parsed;

  const expectedInclude = expectedInstructionExplanationInclude(reportLanguage);
  if (parsed.data.instructionExplanation.include !== expectedInclude) {
    return {
      success: false,
      error: new z.ZodError([
        {
          code: "custom",
          path: ["instructionExplanation", "include"],
          message:
            'instructionExplanation.include must be false for "en" and true for "ar" or "both".',
        },
      ]),
    };
  }

  return parsed;
}

export interface PromptData {
  name: string;
  jobTitle?: string;
  projectName: string;
  projectGoal: string;
  reportLanguage: ReportLanguage;
  behavioralAnswers: BehavioralAnswer[];
  scenarioAnswers: ScenarioAnswer[];
  openAnswer: string;
}

export const INSPIRE_AXES = [
  "Intention",
  "Narrative",
  "Style",
  "Preferences",
  "Interaction",
  "Reflection",
  "Evaluation",
] as const;

export type InspireAxis = (typeof INSPIRE_AXES)[number];

export const INSPIRE_ACRONYM: Record<InspireAxis, string> = {
  Intention: "I",
  Narrative: "N",
  Style: "S",
  Preferences: "P",
  Interaction: "I",
  Reflection: "R",
  Evaluation: "E",
};

export interface UserPublic {
  id: string;
  email: string;
  name: string;
  jobTitle?: string | null;
  emailVerified: boolean;
  plan: string;
  createdAt: Date;
}

export interface AssessmentSummary {
  id: string;
  projectName: string;
  assessmentType: AssessmentType;
  status: AssessmentStatus;
  reportLanguage: ReportLanguage;
  aiProvider?: string | null;
  aiModel?: string | null;
  createdAt: Date;
}
