import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import fs from "node:fs";
import path from "node:path";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

function normalizeDatabaseUrl(databaseUrl: string): string {
  if (!/sslmode=(prefer|require|verify-ca)/i.test(databaseUrl)) return databaseUrl;
  if (/uselibpqcompat=true/i.test(databaseUrl)) return databaseUrl;

  try {
    const url = new URL(databaseUrl);
    url.searchParams.set("uselibpqcompat", "true");
    return url.toString();
  } catch {
    const hasQuery = databaseUrl.includes("?");
    return `${databaseUrl}${hasQuery ? "&" : "?"}uselibpqcompat=true`;
  }
}

function resolvePgSslConfig():
  | { ca: string; rejectUnauthorized: true }
  | { rejectUnauthorized: false }
  | undefined {
  const databaseUrl = process.env.DATABASE_URL ?? "";
  const looksLikeSupabase = /supabase/i.test(databaseUrl) || /pooler/i.test(databaseUrl);
  if (!looksLikeSupabase) return undefined;

  if (process.env["NODE_ENV"] !== "production" && process.env["PG_SSL_STRICT"] !== "true") {
    return { rejectUnauthorized: false };
  }

  const configuredPath = process.env["PG_SSL_CA_PATH"];
  const defaultPath = path.resolve(process.cwd(), "certs", "supabase-ca-chain.pem");
  const caPath = configuredPath ? path.resolve(configuredPath) : defaultPath;

  if (!fs.existsSync(caPath)) return undefined;
  return { ca: fs.readFileSync(caPath, "utf8"), rejectUnauthorized: true };
}

function readPositiveInteger(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const pool = new Pool({
  connectionString: normalizeDatabaseUrl(process.env.DATABASE_URL),
  ...(() => {
    const ssl = resolvePgSslConfig();
    return ssl ? { ssl } : {};
  })(),
  max: readPositiveInteger("PG_POOL_MAX", 5),
  idleTimeoutMillis: readPositiveInteger("PG_IDLE_TIMEOUT_MS", 30_000),
  connectionTimeoutMillis: readPositiveInteger("PG_CONNECTION_TIMEOUT_MS", 10_000),
});
export const db = drizzle(pool, { schema });

export * from "./schema";
