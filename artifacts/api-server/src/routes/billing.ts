import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import {
  usersTable,
  paymentsTable,
  discountCodesTable,
  assessmentsTable,
} from "@workspace/db/schema";
import { eq, and, count, isNull } from "drizzle-orm";
import { getAuthUser } from "../lib/auth";
import { randomBytes } from "crypto";

const router: IRouter = Router();

// ─── PayPal helpers ────────────────────────────────────────

function getBillingProvider(): string {
  return process.env["BILLING_PROVIDER"] ?? "paypal";
}

function isPayPalEnabled(): boolean {
  return getBillingProvider() === "paypal";
}

function getPayPalBase(): string {
  const env = process.env["PAYPAL_ENV"] ?? "sandbox";
  return env === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env["PAYPAL_CLIENT_ID"];
  const secret = process.env["PAYPAL_SECRET"];
  if (!clientId || !secret) {
    throw new Error("PayPal credentials not configured");
  }

  const base = getPayPalBase();
  const credentials = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal auth failed: ${text}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function requireUser(req: Request, _res: Response) {
  const authHeader = req.headers["authorization"] as string | undefined;
  const auth = await getAuthUser(authHeader);
  if (!auth) return null;
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, auth.userId));
  return user ?? null;
}

function getAssessmentPrice(): number {
  const raw = process.env["ASSESSMENT_PRICE"];
  const parsed = parseFloat(raw ?? "");
  return isNaN(parsed) || parsed <= 0 ? 10.0 : parsed;
}

type DiscountCodeRecord = typeof discountCodesTable.$inferSelect;

function isDiscountUsableForUser(discount: DiscountCodeRecord, userId: string): boolean {
  if (!discount.isActive) return false;
  if (discount.userId && discount.userId !== userId) return false;
  if (discount.startsAt && new Date() < discount.startsAt) return false;
  if (discount.expiresAt && new Date() > discount.expiresAt) return false;
  if (discount.maxUses !== null && discount.usedCount >= discount.maxUses) return false;
  return true;
}

function discountPrice(discountPercent: number) {
  const originalPrice = getAssessmentPrice();
  const discountAmount = (originalPrice * discountPercent) / 100;
  const finalPrice = parseFloat((originalPrice - discountAmount).toFixed(2));
  return { originalPrice, finalPrice };
}

async function getCompletedAssessmentCount(userId: string): Promise<number> {
  const [row] = await db
    .select({ total: count() })
    .from(assessmentsTable)
    .where(and(eq(assessmentsTable.userId, userId), eq(assessmentsTable.status, "completed")));
  return Number(row?.total ?? 0);
}

async function getOrCreateNextAssessmentDiscount(userId: string, completedCount: number) {
  if (completedCount <= 0) return null;

  const [existing] = await db
    .select()
    .from(discountCodesTable)
    .where(
      and(
        eq(discountCodesTable.userId, userId),
        eq(discountCodesTable.discountPercent, 50),
        eq(discountCodesTable.maxUses, 1),
        eq(discountCodesTable.usedCount, 0),
        eq(discountCodesTable.isActive, true),
        isNull(discountCodesTable.expiresAt)
      )
    );

  if (existing) return existing;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = `INSPIRE50-${randomBytes(4).toString("hex").toUpperCase()}`;
    try {
      const [created] = await db
        .insert(discountCodesTable)
        .values({
          code,
          discountPercent: 50,
          maxUses: 1,
          usedCount: 0,
          isActive: true,
          userId,
          expiresAt: null,
        })
        .returning();
      return created ?? null;
    } catch {
      // Extremely unlikely code collision; retry with a new token.
    }
  }

  throw new Error("Could not create personalized discount code");
}

async function findUsableDiscountForUser(code: string, userId: string) {
  const [discount] = await db
    .select()
    .from(discountCodesTable)
    .where(eq(discountCodesTable.code, code.toUpperCase().trim()));
  if (!discount || !isDiscountUsableForUser(discount, userId)) return null;
  return discount;
}

// ─── GET /api/billing/paypal-config ───────────────────────

router.get(
  "/billing/paypal-config",
  async (req: Request, res: Response): Promise<void> => {
    const user = await requireUser(req, res);
    if (!user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    if (!isPayPalEnabled()) {
      res.status(503).json({
        success: false,
        error: "Checkout is temporarily disabled",
        provider: getBillingProvider(),
      });
      return;
    }

    const clientId = process.env["PAYPAL_CLIENT_ID"];
    if (!clientId) {
      res.status(503).json({
        success: false,
        error: "PayPal not configured",
      });
      return;
    }

    res.json({
      success: true,
      clientId,
      env: process.env["PAYPAL_ENV"] ?? "sandbox",
      price: getAssessmentPrice(),
    });
  }
);

// ─── GET /api/billing/discount/:code ─────────────────────

router.get(
  "/billing/discount/:code",
  async (req: Request, res: Response): Promise<void> => {
    const user = await requireUser(req, res);
    if (!user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const { code } = req.params;

    const [discount] = await db
      .select()
      .from(discountCodesTable)
      .where(eq(discountCodesTable.code, (code as string).toUpperCase().trim()));

    if (!discount) {
      res.json({ success: true, valid: false, reason: "الكود غير موجود" });
      return;
    }

    if (!discount.isActive || (discount.userId && discount.userId !== user.id)) {
      res.json({ success: true, valid: false, reason: "الكود غير مفعّل" });
      return;
    }

    if (discount.startsAt && new Date() < discount.startsAt) {
      res.json({ success: true, valid: false, reason: "الكود لم يبدأ بعد" });
      return;
    }

    if (discount.expiresAt && new Date() > discount.expiresAt) {
      res.json({ success: true, valid: false, reason: "الكود منتهي الصلاحية" });
      return;
    }

    if (
      discount.maxUses !== null &&
      discount.usedCount >= discount.maxUses
    ) {
      res.json({ success: true, valid: false, reason: "الكود استُنفد" });
      return;
    }

    const { originalPrice, finalPrice } = discountPrice(discount.discountPercent);

    res.json({
      success: true,
      valid: true,
      discountPercent: discount.discountPercent,
      originalPrice,
      finalPrice,
    });
  }
);

// ─── POST /api/billing/create-order ───────────────────────

router.post(
  "/billing/create-order",
  async (req: Request, res: Response): Promise<void> => {
    const user = await requireUser(req, res);
    if (!user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    if (!isPayPalEnabled()) {
      res.status(503).json({ success: false, error: "Checkout is temporarily disabled" });
      return;
    }

    const { discountCode } = req.body as { discountCode?: string };

    const originalPrice = getAssessmentPrice();
    let finalPrice = originalPrice;
    let discountPercent = 0;
    let codeRecord: DiscountCodeRecord | null = null;

    if (discountCode) {
      const found = await findUsableDiscountForUser(discountCode, user.id);
      if (found) {
        codeRecord = found;
        discountPercent = found.discountPercent;
        finalPrice = discountPrice(discountPercent).finalPrice;
      }
    }

    let accessToken: string;
    try {
      accessToken = await getPayPalAccessToken();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      req.log.error({ message }, "PayPal auth failed");
      res.status(503).json({ success: false, error: "PayPal not available" });
      return;
    }

    const base = getPayPalBase();
    const orderRes = await fetch(`${base}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: finalPrice.toFixed(2),
            },
            description: `INSPIRE Framework — تقييم شخصي`,
          },
        ],
      }),
    });

    if (!orderRes.ok) {
      const text = await orderRes.text();
      req.log.error({ text }, "PayPal create-order failed");
      res.status(502).json({ success: false, error: "Failed to create PayPal order" });
      return;
    }

    const orderData = (await orderRes.json()) as { id: string };
    const orderId = orderData.id;

    const [payment] = await db
      .insert(paymentsTable)
      .values({
        userId: user.id,
        paypalOrderId: orderId,
        amount: finalPrice.toFixed(2),
        originalAmount: originalPrice.toFixed(2),
        discountCode: codeRecord?.code ?? null,
        discountPercent,
        status: "pending",
      })
      .returning();

    req.log.info(
      { userId: user.id, orderId, finalPrice },
      "PayPal order created"
    );

    res.json({
      success: true,
      orderId,
      paymentId: payment.id,
      amount: finalPrice,
      originalPrice,
      discountPercent,
    });
  }
);

// ─── POST /api/billing/capture-order ─────────────────────

router.post(
  "/billing/capture-order",
  async (req: Request, res: Response): Promise<void> => {
    const user = await requireUser(req, res);
    if (!user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    if (!isPayPalEnabled()) {
      res.status(503).json({ success: false, error: "Checkout is temporarily disabled" });
      return;
    }

    const { orderId } = req.body as { orderId: string };
    if (!orderId) {
      res.status(400).json({ success: false, error: "orderId required" });
      return;
    }

    const [payment] = await db
      .select()
      .from(paymentsTable)
      .where(
        and(
          eq(paymentsTable.paypalOrderId, orderId),
          eq(paymentsTable.userId, user.id)
        )
      );

    if (!payment) {
      res.status(404).json({ success: false, error: "Payment not found" });
      return;
    }

    if (payment.status === "completed") {
      res.json({ success: true, paymentId: payment.id });
      return;
    }

    let accessToken: string;
    try {
      accessToken = await getPayPalAccessToken();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      req.log.error({ message }, "PayPal auth failed on capture");
      res.status(503).json({ success: false, error: "PayPal not available" });
      return;
    }

    const base = getPayPalBase();
    const captureRes = await fetch(
      `${base}/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!captureRes.ok) {
      const text = await captureRes.text();
      req.log.error({ text, orderId }, "PayPal capture failed");
      await db
        .update(paymentsTable)
        .set({ status: "failed" })
        .where(eq(paymentsTable.id, payment.id));
      res.status(502).json({ success: false, error: "Payment capture failed" });
      return;
    }

    const captureData = (await captureRes.json()) as { status: string };
    if (captureData.status !== "COMPLETED") {
      req.log.warn({ captureData }, "PayPal capture returned non-COMPLETED status");
      res.status(402).json({ success: false, error: "Payment not completed" });
      return;
    }

    await db
      .update(paymentsTable)
      .set({ status: "completed" })
      .where(eq(paymentsTable.id, payment.id));

    if (payment.discountCode) {
      await db
        .update(discountCodesTable)
        .set({
          usedCount: (
            await db
              .select({ c: discountCodesTable.usedCount })
              .from(discountCodesTable)
              .where(eq(discountCodesTable.code, payment.discountCode))
              .then(([r]) => (r?.c ?? 0) + 1)
          ),
        })
        .where(eq(discountCodesTable.code, payment.discountCode));
    }

    req.log.info({ userId: user.id, orderId, paymentId: payment.id }, "Payment captured");

    res.json({ success: true, paymentId: payment.id });
  }
);

// ─── POST /api/billing/free-order ────────────────────────
// Used when a 100% discount code brings the price to $0 — no PayPal needed.

router.post(
  "/billing/free-order",
  async (req: Request, res: Response): Promise<void> => {
    const user = await requireUser(req, res);
    if (!user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const { discountCode } = req.body as { discountCode?: string };
    if (!discountCode) {
      res.status(400).json({ success: false, error: "discountCode required" });
      return;
    }

    const [found] = await db
      .select()
      .from(discountCodesTable)
      .where(eq(discountCodesTable.code, discountCode.toUpperCase().trim()));

    if (!found || !isDiscountUsableForUser(found, user.id)) {
      res.status(400).json({ success: false, error: "كود غير صالح" });
      return;
    }

    const originalPrice = getAssessmentPrice();
    const finalPrice = parseFloat(
      (originalPrice - (originalPrice * found.discountPercent) / 100).toFixed(2)
    );

    if (finalPrice > 0) {
      res.status(400).json({ success: false, error: "هذا الكود لا يصفّر السعر" });
      return;
    }

    // Create a completed payment record for $0
    const [payment] = await db
      .insert(paymentsTable)
      .values({
        userId: user.id,
        paypalOrderId: null,
        amount: "0.00",
        originalAmount: originalPrice.toFixed(2),
        discountCode: found.code,
        discountPercent: found.discountPercent,
        status: "completed",
      })
      .returning();

    // Increment discount code usage
    await db
      .update(discountCodesTable)
      .set({ usedCount: found.usedCount + 1 })
      .where(eq(discountCodesTable.code, found.code));

    req.log.info(
      { userId: user.id, code: found.code, paymentId: payment?.id },
      "Free order created via 100% discount"
    );

    res.json({ success: true, paymentId: payment?.id });
  }
);

// ─── GET /api/billing/status ──────────────────────────────
// Returns number of completed assessments so frontend knows if payment is needed

router.get(
  "/billing/status",
  async (req: Request, res: Response): Promise<void> => {
    const user = await requireUser(req, res);
    if (!user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const completedCount = await getCompletedAssessmentCount(user.id);
    const price = getAssessmentPrice();
    const personalizedDiscount = await getOrCreateNextAssessmentDiscount(user.id, completedCount);
    const discountPayload = personalizedDiscount
      ? {
          code: personalizedDiscount.code,
          discountPercent: personalizedDiscount.discountPercent,
          maxUses: personalizedDiscount.maxUses,
          usedCount: personalizedDiscount.usedCount,
          ...discountPrice(personalizedDiscount.discountPercent),
        }
      : null;

    res.json({
      success: true,
      completedAssessments: completedCount,
      freeUsed: true,
      price,
      nextAssessmentDiscount: discountPayload,
    });
  }
);

export default router;
