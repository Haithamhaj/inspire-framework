import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { assessmentsTable } from "./assessments";

export const assessmentFeedbackTable = pgTable(
  "assessment_feedback",
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
    rating: integer("rating").notNull(),
    usefulAnswer: text("useful_answer"),
    mostUseful: text("most_useful"),
    missing: text("missing"),
  },
  (table) => ({
    assessmentUserUnique: uniqueIndex("assessment_feedback_assessment_user_idx").on(
      table.assessmentId,
      table.userId
    ),
  })
);

export type AssessmentFeedback = typeof assessmentFeedbackTable.$inferSelect;
export type InsertAssessmentFeedback = typeof assessmentFeedbackTable.$inferInsert;
