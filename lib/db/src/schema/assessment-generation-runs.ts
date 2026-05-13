import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { assessmentsTable } from "./assessments";

export const assessmentGenerationRunsTable = pgTable(
  "assessment_generation_runs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    assessmentId: uuid("assessment_id")
      .notNull()
      .references(() => assessmentsTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    assessmentType: text("assessment_type").notNull(),
    status: text("status").default("processing").notNull(),
    provider: text("provider"),
    model: text("model"),
    promptVersion: text("prompt_version").notNull(),
    attemptNumber: integer("attempt_number").default(1).notNull(),
    startedAt: timestamp("started_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"),
    errorMessage: text("error_message"),
    inputSnapshot: jsonb("input_snapshot"),
    outputSnapshot: jsonb("output_snapshot"),
  },
  (table) => ({
    assessmentIdx: index("assessment_generation_runs_assessment_id_idx").on(
      table.assessmentId
    ),
    userIdx: index("assessment_generation_runs_user_id_idx").on(table.userId),
    statusIdx: index("assessment_generation_runs_status_idx").on(table.status),
  })
);

export type AssessmentGenerationRun =
  typeof assessmentGenerationRunsTable.$inferSelect;
export type InsertAssessmentGenerationRun =
  typeof assessmentGenerationRunsTable.$inferInsert;
