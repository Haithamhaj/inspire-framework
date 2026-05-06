import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import {
  usersTable,
  adminSessionsTable,
} from "@workspace/db/schema";
import { eq, and, gt } from "drizzle-orm";
import {
  hashPassword,
  verifyPassword,
  signAccessToken,
  createRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
  getAuthUser,
} from "../lib/auth";
import { RegisterSchema, LoginSchema, ProfileUpdateSchema } from "../lib/validators";
import { rateLimit, getClientIp } from "../lib/rate-limit";

const router: IRouter = Router();

// ─── POST /api/auth/register ───────────────────────────

router.post(
  "/auth/register",
  async (req: Request, res: Response): Promise<void> => {
    const ip = getClientIp(req);
    const registerLimit = rateLimit(ip, "register", 30, 60 * 60 * 1000);
    if (!registerLimit.allowed) {
      res
        .status(429)
        .set("Retry-After", String(registerLimit.retryAfterSeconds))
        .json({
          success: false,
          error: "تجاوزت الحد المسموح. حاول لاحقاً.",
          retryAfter: registerLimit.retryAfterSeconds,
        });
      return;
    }

    const requestBody = req.body as unknown;
    const parsed = RegisterSchema.safeParse(
      requestBody &&
      typeof requestBody === "object" &&
      "data" in requestBody
        ? (requestBody as { data?: unknown }).data
        : requestBody
    );
    if (!parsed.success) {
      req.log.warn({ validationErrors: parsed.error.flatten() }, "Registration validation failed");
      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: parsed.error.flatten(),
      });
      return;
    }

    const { name, email, password, job_title } = parsed.data;

    const [existing] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()));

    if (existing) {
      res.status(409).json({ success: false, error: "هذا البريد الإلكتروني مستخدم بالفعل" });
      return;
    }

    const passwordHash = await hashPassword(password);

    const [user] = await db
      .insert(usersTable)
      .values({
        name,
        email: email.toLowerCase(),
        passwordHash,
        jobTitle: job_title ?? null,
        emailVerifyToken: null,
        emailVerifyExpires: null,
        emailVerified: true,
        consentGiven: true,
        consentAt: new Date(),
      })
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        name: usersTable.name,
      });

    req.log.info({ userId: user!.id, autoVerified: true }, "User registered");

    res.status(201).json({
      success: true,
      message: "Registration successful.",
    });
  }
);

// ─── GET /api/auth/verify-email ────────────────────────

router.get(
  "/auth/verify-email",
  async (req: Request, res: Response): Promise<void> => {
    const token = req.query["token"] as string | undefined;
    if (!token) {
      res.status(400).json({ success: false, error: "Token required" });
      return;
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.emailVerifyToken, token),
          gt(usersTable.emailVerifyExpires, new Date())
        )
      );

    if (!user) {
      res
        .status(400)
        .json({ success: false, error: "Invalid or expired token" });
      return;
    }

    await db
      .update(usersTable)
      .set({
        emailVerified: true,
        emailVerifyToken: null,
        emailVerifyExpires: null,
      })
      .where(eq(usersTable.id, user.id));

    req.log.info({ userId: user.id }, "Email verified");
    res.json({ success: true, message: "Email verified. You can now log in." });
  }
);

// ─── POST /api/auth/login ──────────────────────────────

router.post(
  "/auth/login",
  async (req: Request, res: Response): Promise<void> => {
    const ip = getClientIp(req);
    const loginLimit = rateLimit(ip, "login", 10, 15 * 60 * 1000);
    if (!loginLimit.allowed) {
      res
        .status(429)
        .set("Retry-After", String(loginLimit.retryAfterSeconds))
        .json({
          success: false,
          error: "تجاوزت الحد المسموح. حاول لاحقاً.",
          retryAfter: loginLimit.retryAfterSeconds,
        });
      return;
    }

    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: parsed.error.flatten(),
      });
      return;
    }

    const { email, password } = parsed.data;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()));

    if (!user) {
      res.status(401).json({ success: false, error: "Invalid credentials" });
      return;
    }

    if (!user.emailVerified) {
      res.status(403).json({
        success: false,
        error: "Please verify your email before logging in",
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ success: false, error: "Account is disabled" });
      return;
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ success: false, error: "Invalid credentials" });
      return;
    }

    await db
      .update(usersTable)
      .set({ lastLoginAt: new Date() })
      .where(eq(usersTable.id, user.id));

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken(user.id),
      createRefreshToken(user.id),
    ]);

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    req.log.info({ userId: user.id }, "User logged in");

    res.json({
      success: true,
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        jobTitle: user.jobTitle,
        plan: user.plan,
      },
    });
  }
);

// ─── POST /api/auth/refresh ────────────────────────────

router.post(
  "/auth/refresh",
  async (req: Request, res: Response): Promise<void> => {
    const oldToken =
      req.cookies?.["refresh_token"] ??
      (req.body as { refresh_token?: string })?.refresh_token;

    if (!oldToken) {
      res.status(401).json({ success: false, error: "No refresh token" });
      return;
    }

    const result = await rotateRefreshToken(oldToken);
    if (!result) {
      res
        .status(401)
        .json({ success: false, error: "Invalid or expired refresh token" });
      return;
    }

    const accessToken = await signAccessToken(result.userId);

    res.cookie("refresh_token", result.newToken, {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({ success: true, access_token: accessToken });
  }
);

// ─── POST /api/auth/logout ─────────────────────────────

router.post(
  "/auth/logout",
  async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies?.["refresh_token"];
    if (token) await revokeRefreshToken(token);

    res.clearCookie("refresh_token", { path: "/" });
    res.json({ success: true });
  }
);

// ─── GET /api/auth/me ──────────────────────────────────

router.get(
  "/auth/me",
  async (req: Request, res: Response): Promise<void> => {
    const auth = await getAuthUser(req.headers.authorization);
    if (!auth) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const [user] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        name: usersTable.name,
        jobTitle: usersTable.jobTitle,
        plan: usersTable.plan,
        emailVerified: usersTable.emailVerified,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, auth.userId));

    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    res.json({ success: true, user });
  }
);

// ─── GET /api/auth/profile ────────────────────────────

router.get(
  "/auth/profile",
  async (req: Request, res: Response): Promise<void> => {
    const auth = await getAuthUser(req.headers.authorization);
    if (!auth) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const [user] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        name: usersTable.name,
        jobTitle: usersTable.jobTitle,
        plan: usersTable.plan,
        emailVerified: usersTable.emailVerified,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, auth.userId));

    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    res.json({ success: true, user });
  }
);

// ─── PATCH /api/auth/profile ──────────────────────────

router.patch(
  "/auth/profile",
  async (req: Request, res: Response): Promise<void> => {
    const auth = await getAuthUser(req.headers.authorization);
    if (!auth) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const parsed = ProfileUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: parsed.error.flatten(),
      });
      return;
    }

    const { name, job_title, current_password, new_password } = parsed.data;

    // Fetch current user (needed for password verification)
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, auth.userId));

    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    // Build update payload with proper types
    type ProfileUpdates = {
      name?: string;
      jobTitle?: string | null;
      passwordHash?: string;
    };
    const updates: ProfileUpdates = {};

    if (name !== undefined) updates.name = name;
    if (job_title !== undefined) updates.jobTitle = job_title;

    if (current_password && new_password) {
      const valid = await verifyPassword(current_password, user.passwordHash);
      if (!valid) {
        res
          .status(400)
          .json({ success: false, error: "كلمة المرور الحالية غير صحيحة" });
        return;
      }
      updates.passwordHash = await hashPassword(new_password);
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ success: false, error: "No fields to update" });
      return;
    }

    const [updated] = await db
      .update(usersTable)
      .set(updates)
      .where(eq(usersTable.id, auth.userId))
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        name: usersTable.name,
        jobTitle: usersTable.jobTitle,
        plan: usersTable.plan,
      });

    req.log.info({ userId: auth.userId }, "Profile updated");

    res.json({ success: true, user: updated });
  }
);

// ─── POST /api/admin/login ─────────────────────────────

router.post(
  "/admin/login",
  async (req: Request, res: Response): Promise<void> => {
    const { password } = req.body as { password?: string };
    if (!password || password !== process.env["ADMIN_PASSWORD"]) {
      res.status(401).json({ success: false, error: "Invalid password" });
      return;
    }

    const { randomBytes } = await import("crypto");
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);

    await db.insert(adminSessionsTable).values({ token, expiresAt });

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({ success: true });
  }
);

export default router;
