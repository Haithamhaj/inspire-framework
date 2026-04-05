import {
  pgTable,
  text,
  timestamp,
  uuid,
  numeric,
  integer,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { assessmentsTable } from "./assessments";

export const paymentsTable = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  assessmentId: uuid("assessment_id").references(() => assessmentsTable.id, {
    onDelete: "set null",
  }),
  paypalOrderId: text("paypal_order_id").unique(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  originalAmount: numeric("original_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  discountCode: text("discount_code"),
  discountPercent: integer("discount_percent").default(0).notNull(),
  status: text("status").default("pending").notNull(),
});

export type Payment = typeof paymentsTable.$inferSelect;
export type InsertPayment = typeof paymentsTable.$inferInsert;
