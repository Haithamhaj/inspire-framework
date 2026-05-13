import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { assessmentsTable } from "./assessments";

export const assessmentDecisionSnapshotsTable = pgTable(
  "assessment_decision_snapshots",
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
    decisionEngineVersion: text("decision_engine_version").notNull(),
    answersSnapshot: jsonb("answers_snapshot").notNull(),
    matrixSnapshot: jsonb("matrix_snapshot").notNull(),
    scoringSnapshot: jsonb("scoring_snapshot").notNull(),
    selectedRules: jsonb("selected_rules").notNull(),
    selectedRoles: jsonb("selected_roles").notNull(),
    selectedRedLines: jsonb("selected_red_lines").notNull(),
    selectedOutputRules: jsonb("selected_output_rules").notNull(),
  },
  (table) => ({
    assessmentUnique: uniqueIndex("assessment_decision_snapshots_assessment_idx").on(
      table.assessmentId
    ),
    userIdx: index("assessment_decision_snapshots_user_id_idx").on(table.userId),
  })
);

export type AssessmentDecisionSnapshot =
  typeof assessmentDecisionSnapshotsTable.$inferSelect;
export type InsertAssessmentDecisionSnapshot =
  typeof assessmentDecisionSnapshotsTable.$inferInsert;
