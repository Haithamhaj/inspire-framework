import {
  pgTable,
  text,
  boolean,
  timestamp,
  uuid,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export type OperatingPatternReportContentV1 = {
  reportType: "operating_pattern";
  version: "v1";
  generatedAt?: string;
  language: "ar" | "en" | "both";
  sections: {
    operatingSnapshot: {
      bullets: string[];
    };
    personalizedRecommendations: {
      bullets: string[];
    };
    customAiUsageTips: {
      bullets: string[];
    };
    instructionExplanation: {
      include: boolean;
      bullets: string[];
    };
  };
  fixedContent: {
    craftIncluded: true;
    smartPromptEngineerLinkIncluded: true;
    copyReadyInstructionLanguage: "en";
  };
};

export type AssessmentReportContent = OperatingPatternReportContentV1;

export const assessmentsTable = pgTable("assessments", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  projectName: text("project_name").notNull(),
  projectGoal: text("project_goal").notNull(),
  domain: text("domain"),
  customDomain: text("custom_domain"),
  domainSpecialization: text("domain_specialization"),
  projectContext: text("project_context"),
  reportLanguage: text("report_language").default("ar").notNull(),
  assessmentType: text("assessment_type").default("full").notNull(),

  behavioralAnswers: jsonb("behavioral_answers"),
  scenarioAnswers: jsonb("scenario_answers"),
  openAnswer: text("open_answer"),

  // Deprecated legacy report fields. New Operating Pattern Report UI should use reportContent.
  inspireTable: jsonb("inspire_table"),
  roleAnalysis: text("role_analysis"),
  redLines: jsonb("red_lines"),
  strengths: jsonb("strengths"),
  developmentAreas: jsonb("development_areas"),
  recommendations: jsonb("recommendations"),
  systemInstruction: text("system_instruction"),
  quickStarters: jsonb("quick_starters"),
  reportContent: jsonb("report_content").$type<AssessmentReportContent | null>(),

  aiProvider: text("ai_provider"),
  aiModel: text("ai_model"),

  status: text("status").default("draft").notNull(),
  retryCount: integer("retry_count").default(0).notNull(),
  nextRetryAt: timestamp("next_retry_at"),

  emailSent: boolean("email_sent").default(false).notNull(),
  emailSentAt: timestamp("email_sent_at"),
  pdfGenerated: boolean("pdf_generated").default(false).notNull(),
  pdfUrl: text("pdf_url"),

  completionTimeSeconds: integer("completion_time_seconds"),
  previousAssessmentId: uuid("previous_assessment_id"),

  shareToken: text("share_token").unique(),
  shareEnabled: boolean("share_enabled").default(false).notNull(),

  paymentId: uuid("payment_id"),
});

export const insertAssessmentSchema = createInsertSchema(
  assessmentsTable,
).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessmentsTable.$inferSelect;
