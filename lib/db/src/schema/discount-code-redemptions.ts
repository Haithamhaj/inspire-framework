import {
  pgTable,
  timestamp,
  uuid,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { discountCodesTable } from "./discount-codes";
import { paymentsTable } from "./payments";
import { usersTable } from "./users";

export const discountCodeRedemptionsTable = pgTable(
  "discount_code_redemptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    discountCodeId: uuid("discount_code_id")
      .notNull()
      .references(() => discountCodesTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    paymentId: uuid("payment_id").references(() => paymentsTable.id, {
      onDelete: "set null",
    }),
  },
  (table) => ({
    discountUserUnique: uniqueIndex("discount_code_redemptions_code_user_idx").on(
      table.discountCodeId,
      table.userId
    ),
    paymentUnique: uniqueIndex("discount_code_redemptions_payment_idx").on(table.paymentId),
  })
);

export type DiscountCodeRedemption = typeof discountCodeRedemptionsTable.$inferSelect;
export type InsertDiscountCodeRedemption = typeof discountCodeRedemptionsTable.$inferInsert;
