import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import { randomBytes } from "crypto";
import { db } from "@workspace/db";
import { refreshTokensTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = new TextEncoder().encode(process.env["JWT_SECRET"]);
const BCRYPT_ROUNDS = parseInt(process.env["BCRYPT_ROUNDS"] ?? "12");

// ─── PASSWORD ──────────────────────────────────────────

export const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, BCRYPT_ROUNDS);

export const verifyPassword = (
  password: string,
  hash: string
): Promise<boolean> => bcrypt.compare(password, hash);

// ─── ACCESS TOKEN ──────────────────────────────────────

export async function signAccessToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(process.env["JWT_EXPIRES_IN"] ?? "7d")
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyAccessToken(
  token: string
): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { userId: payload.sub as string };
  } catch {
    return null;
  }
}

// ─── REFRESH TOKEN ─────────────────────────────────────

export async function createRefreshToken(userId: string): Promise<string> {
  const token = randomBytes(40).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await db
    .insert(refreshTokensTable)
    .values({ userId, token, expiresAt, revoked: false });
  return token;
}

export async function rotateRefreshToken(
  oldToken: string
): Promise<{ userId: string; newToken: string } | null> {
  const [record] = await db
    .select()
    .from(refreshTokensTable)
    .where(eq(refreshTokensTable.token, oldToken));

  if (!record || record.revoked || record.expiresAt < new Date()) return null;

  await db
    .update(refreshTokensTable)
    .set({ revoked: true })
    .where(eq(refreshTokensTable.id, record.id));

  const newToken = await createRefreshToken(record.userId);
  return { userId: record.userId, newToken };
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await db
    .update(refreshTokensTable)
    .set({ revoked: true })
    .where(eq(refreshTokensTable.token, token));
}

// ─── EMAIL VERIFICATION TOKEN ──────────────────────────

export function generateVerifyToken(): { token: string; expires: Date } {
  return {
    token: randomBytes(32).toString("hex"),
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
}

// ─── AUTH MIDDLEWARE HELPER ────────────────────────────

export async function getAuthUser(
  authHeader: string | undefined
): Promise<{ userId: string } | null> {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  return verifyAccessToken(token);
}
