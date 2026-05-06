import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const discountCodesTable = pgTable("discount_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  code: text("code").unique().notNull(),
  discountPercent: integer("discount_percent").notNull(),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  expiresAt: timestamp("expires_at"),
  userId: uuid("user_id").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
});

export type DiscountCode = typeof discountCodesTable.$inferSelect;
export type InsertDiscountCode = typeof discountCodesTable.$inferInsert;
