import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

function readPositiveInteger(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: readPositiveInteger("PG_POOL_MAX", 5),
  idleTimeoutMillis: readPositiveInteger("PG_IDLE_TIMEOUT_MS", 30_000),
  connectionTimeoutMillis: readPositiveInteger("PG_CONNECTION_TIMEOUT_MS", 10_000),
});
export const db = drizzle(pool, { schema });

export * from "./schema";
