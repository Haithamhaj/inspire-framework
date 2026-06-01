import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import {
  usersTable,
  paymentsTable,
  discountCodesTable,
  discountCodeRedemptionsTable,
  assessmentsTable,
} from "@workspace/db/schema";
import { eq, and, count, isNull, or, sql } from "drizzle-orm";
import { getAuthUser } from "../lib/auth";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { generateReportV2 } from "../lib/ai-engine";
import type { PromptDataV2 } from "../lib/prompt-builder";

const router: IRouter = Router();

// ─── PayPal helpers ────────────────────────────────────────

function getBillingProvider(): string {
  return process.env["BILLING_PROVIDER"] ?? "paypal";
}

function isPayPalEnabled(): boolean {
  return getBillingProvider() === "paypal";
}

function isLemonEnabled(): boolean {
  return getBillingProvider() === "lemon";
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

function getAppUrl() {
  return (process.env["APP_URL"] ?? "http://localhost:5173").replace(/\/$/, "");
}

function getLemonConfig() {
  const apiKey = process.env["LEMON_SQUEEZY_API_KEY"];
  const storeId = process.env["LEMON_SQUEEZY_STORE_ID"];
  const variantId = process.env["LEMON_SQUEEZY_VARIANT_ID"];
  if (!apiKey || !storeId || !variantId) return null;
  return {
    apiKey,
    storeId,
    variantId,
    testMode: process.env["LEMON_SQUEEZY_TEST_MODE"] === "true",
  };
}

function isV2Answers(value: unknown): value is Array<{ questionId: string; optionId: string }> {
  return Array.isArray(value) && value.every((item) =>
    item &&
    typeof item === "object" &&
    typeof (item as { questionId?: unknown }).questionId === "string" &&
    typeof (item as { optionId?: unknown }).optionId === "string"
  );
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

async function hasUserRedeemedDiscount(discountCodeId: string, userId: string): Promise<boolean> {
  const [redemption] = await db
    .select({ id: discountCodeRedemptionsTable.id })
    .from(discountCodeRedemptionsTable)
    .where(
      and(
        eq(discountCodeRedemptionsTable.discountCodeId, discountCodeId),
        eq(discountCodeRedemptionsTable.userId, userId)
      )
    )
    .limit(1);
  return Boolean(redemption);
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
  if (await hasUserRedeemedDiscount(discount.id, userId)) return null;
  return discount;
}

async function recordDiscountRedemption(
  discount: DiscountCodeRecord,
  userId: string,
  paymentId: string | null,
  requireNew = true
): Promise<boolean> {
  return db.transaction(async (tx) => {
    const inserted = await tx
      .insert(discountCodeRedemptionsTable)
      .values({
        discountCodeId: discount.id,
        userId,
        paymentId,
      })
      .onConflictDoNothing({
        target: [
          discountCodeRedemptionsTable.discountCodeId,
          discountCodeRedemptionsTable.userId,
        ],
      })
      .returning({ id: discountCodeRedemptionsTable.id });

    if (inserted.length === 0) {
      if (requireNew) throw new Error("discount_already_redeemed");
      return false;
    }

    const [updated] = await tx
      .update(discountCodesTable)
      .set({ usedCount: sql`${discountCodesTable.usedCount} + 1` })
      .where(
        and(
          eq(discountCodesTable.id, discount.id),
          or(
            isNull(discountCodesTable.maxUses),
            sql`${discountCodesTable.usedCount} < ${discountCodesTable.maxUses}`
          )
        )
      )
      .returning({ id: discountCodesTable.id });

    if (!updated) throw new Error("discount_usage_limit_reached");
    return true;
  });
}

async function recordCompletedPaymentDiscountUse(
  discountCode: string,
  userId: string,
  paymentId: string,
  req: Request
) {
  const [discount] = await db
    .select()
    .from(discountCodesTable)
    .where(eq(discountCodesTable.code, discountCode));

  if (!discount) {
    req.log.warn({ discountCode, paymentId }, "Completed payment references missing discount code");
    return;
  }

  try {
    await recordDiscountRedemption(discount, userId, paymentId, false);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    req.log.warn(
      { discountCode, userId, paymentId, message },
      "Could not record completed payment discount redemption"
    );
  }
}

async function completeAssessmentAfterPayment(paymentId: string, req: Request) {
  const [payment] = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.id, paymentId));

  if (!payment?.assessmentId) return;

  const [assessment] = await db
    .select()
    .from(assessmentsTable)
    .where(eq(assessmentsTable.id, payment.assessmentId));
  if (!assessment || assessment.status === "completed") return;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, assessment.userId));
  if (!user) return;

  if (!isV2Answers(assessment.behavioralAnswers)) {
    req.log.warn({ assessmentId: assessment.id, paymentId }, "Paid assessment has no V2 answers yet");
    return;
  }

  await db
    .update(assessmentsTable)
    .set({
      paymentId: payment.id,
      status: "processing",
    })
    .where(eq(assessmentsTable.id, assessment.id));

  const promptData: PromptDataV2 = {
    name: user.name,
    jobTitle: user.jobTitle ?? undefined,
    projectName: assessment.projectName,
    projectGoal: assessment.projectGoal,
    domain: assessment.domain ?? assessment.projectName,
    customDomain: assessment.customDomain ?? undefined,
    domainSpecialization: assessment.domainSpecialization ?? undefined,
    projectContext: assessment.projectContext ?? assessment.projectGoal,
    reportLanguage: assessment.reportLanguage as "ar" | "en" | "both",
    answers: assessment.behavioralAnswers,
    openAnswer: assessment.openAnswer ?? undefined,
  };

  setImmediate(async () => {
    try {
      await generateReportV2(assessment.id, promptData);
    } catch (err) {
      req.log.error({ assessmentId: assessment.id, err }, "Lemon paid report generation failed");
    }
  });
}

// ─── GET /api/billing/checkout-config ─────────────────────

router.get(
  "/billing/checkout-config",
  async (req: Request, res: Response): Promise<void> => {
    const user = await requireUser(req, res);
    if (!user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    if (isLemonEnabled()) {
      const lemon = getLemonConfig();
      if (!lemon) {
        res.status(503).json({
          success: false,
          error: "Lemon Squeezy not configured",
          provider: getBillingProvider(),
        });
        return;
      }

      res.json({
        success: true,
        provider: "lemon",
        price: getAssessmentPrice(),
        testMode: lemon.testMode,
      });
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
      provider: "paypal",
      clientId,
      env: process.env["PAYPAL_ENV"] ?? "sandbox",
      price: getAssessmentPrice(),
    });
  }
);

// Backward compatibility for older deployed frontend bundles.
router.get(
  "/billing/paypal-config",
  async (req: Request, res: Response): Promise<void> => {
    req.url = "/billing/checkout-config";
    (router as any).handle(req, res);
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

    if (await hasUserRedeemedDiscount(discount.id, user.id)) {
      res.json({ success: true, valid: false, reason: "استخدمت هذا الكود من قبل" });
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

    if (!isPayPalEnabled() && !isLemonEnabled()) {
      res.status(503).json({ success: false, error: "Checkout is temporarily disabled" });
      return;
    }

    const { discountCode, assessmentId } = req.body as { discountCode?: string; assessmentId?: string };

    const originalPrice = getAssessmentPrice();
    let finalPrice = originalPrice;
    let discountPercent = 0;
    let codeRecord: DiscountCodeRecord | null = null;

    if (discountCode) {
      const found = await findUsableDiscountForUser(discountCode, user.id);
      if (!found) {
        res.status(400).json({ success: false, error: "كود الخصم غير صالح أو تم استخدامه من قبل" });
        return;
      }
      codeRecord = found;
      discountPercent = found.discountPercent;
      finalPrice = discountPrice(discountPercent).finalPrice;
    }

    if (isLemonEnabled()) {
      const lemon = getLemonConfig();
      if (!lemon) {
        res.status(503).json({ success: false, error: "Lemon Squeezy not configured" });
        return;
      }
      if (!assessmentId) {
        res.status(400).json({ success: false, error: "assessmentId required" });
        return;
      }
      if (finalPrice <= 0) {
        res.status(400).json({ success: false, error: "Use free-order for 100% discounts" });
        return;
      }

      const [assessment] = await db
        .select({ id: assessmentsTable.id, userId: assessmentsTable.userId, status: assessmentsTable.status })
        .from(assessmentsTable)
        .where(and(eq(assessmentsTable.id, assessmentId), eq(assessmentsTable.userId, user.id)));

      if (!assessment || (assessment.status !== "pending_payment" && assessment.status !== "draft")) {
        res.status(400).json({ success: false, error: "Assessment is not ready for checkout" });
        return;
      }

      const [payment] = await db
        .insert(paymentsTable)
        .values({
          userId: user.id,
          assessmentId,
          provider: "lemon",
          paypalOrderId: null,
          amount: finalPrice.toFixed(2),
          originalAmount: originalPrice.toFixed(2),
          discountCode: codeRecord?.code ?? null,
          discountPercent,
          status: "pending",
        })
        .returning();

      const returnUrl = `${getAppUrl()}/billing/success?provider=lemon&payment_id=${payment.id}&assessment_id=${assessmentId}`;
      const customPrice = Math.round(finalPrice * 100);
      const checkoutRes = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
        method: "POST",
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          Authorization: `Bearer ${lemon.apiKey}`,
        },
        body: JSON.stringify({
          data: {
            type: "checkouts",
            attributes: {
              ...(finalPrice !== originalPrice ? { custom_price: customPrice } : {}),
              product_options: {
                name: "INSPIRE Framework Full Report",
                description: "Personalized AI operating profile and copy-ready AI instructions.",
                redirect_url: returnUrl,
                receipt_button_text: "Open my INSPIRE report",
                receipt_link_url: returnUrl,
                receipt_thank_you_note: "Your INSPIRE report generation starts automatically after payment.",
                enabled_variants: [Number(lemon.variantId)],
              },
              checkout_options: {
                embed: false,
                media: true,
                logo: true,
                desc: true,
                discount: false,
              },
              checkout_data: {
                email: user.email,
                name: user.name,
                custom: {
                  payment_id: payment.id,
                  assessment_id: assessmentId,
                  user_id: user.id,
                },
              },
              test_mode: lemon.testMode,
            },
            relationships: {
              store: { data: { type: "stores", id: lemon.storeId } },
              variant: { data: { type: "variants", id: lemon.variantId } },
            },
          },
        }),
      });

      if (!checkoutRes.ok) {
        const text = await checkoutRes.text();
        req.log.error({ text }, "Lemon Squeezy create checkout failed");
        await db.update(paymentsTable).set({ status: "failed" }).where(eq(paymentsTable.id, payment.id));
        res.status(502).json({ success: false, error: "Failed to create Lemon Squeezy checkout" });
        return;
      }

      const checkoutData = (await checkoutRes.json()) as {
        data?: { id?: string; attributes?: { url?: string } };
      };
      const checkoutId = checkoutData.data?.id;
      const checkoutUrl = checkoutData.data?.attributes?.url;
      if (!checkoutId || !checkoutUrl) {
        await db.update(paymentsTable).set({ status: "failed" }).where(eq(paymentsTable.id, payment.id));
        res.status(502).json({ success: false, error: "Invalid Lemon Squeezy checkout response" });
        return;
      }

      await db
        .update(paymentsTable)
        .set({ lemonCheckoutId: checkoutId })
        .where(eq(paymentsTable.id, payment.id));

      req.log.info({ userId: user.id, paymentId: payment.id, checkoutId, finalPrice }, "Lemon checkout created");
      res.json({
        success: true,
        provider: "lemon",
        checkoutUrl,
        checkoutId,
        paymentId: payment.id,
        amount: finalPrice,
        originalPrice,
        discountPercent,
      });
      return;
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
        provider: "paypal",
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
      await recordCompletedPaymentDiscountUse(payment.discountCode, user.id, payment.id, req);
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

    let paymentId: string | undefined;
    try {
      const payment = await db.transaction(async (tx) => {
        const [createdPayment] = await tx
          .insert(paymentsTable)
          .values({
            userId: user.id,
            provider: "manual",
            paypalOrderId: null,
            amount: "0.00",
            originalAmount: originalPrice.toFixed(2),
            discountCode: found.code,
            discountPercent: found.discountPercent,
            status: "completed",
          })
          .returning();

        if (!createdPayment) throw new Error("payment_create_failed");

        const inserted = await tx
          .insert(discountCodeRedemptionsTable)
          .values({
            discountCodeId: found.id,
            userId: user.id,
            paymentId: createdPayment.id,
          })
          .onConflictDoNothing({
            target: [
              discountCodeRedemptionsTable.discountCodeId,
              discountCodeRedemptionsTable.userId,
            ],
          })
          .returning({ id: discountCodeRedemptionsTable.id });

        if (inserted.length === 0) throw new Error("discount_already_redeemed");

        const [updatedCode] = await tx
          .update(discountCodesTable)
          .set({ usedCount: sql`${discountCodesTable.usedCount} + 1` })
          .where(
            and(
              eq(discountCodesTable.id, found.id),
              or(
                isNull(discountCodesTable.maxUses),
                sql`${discountCodesTable.usedCount} < ${discountCodesTable.maxUses}`
              )
            )
          )
          .returning({ id: discountCodesTable.id });

        if (!updatedCode) throw new Error("discount_usage_limit_reached");
        return createdPayment;
      });
      paymentId = payment.id;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message === "discount_already_redeemed") {
        res.status(400).json({ success: false, error: "استخدمت هذا الكود من قبل" });
        return;
      }
      if (message === "discount_usage_limit_reached") {
        res.status(400).json({ success: false, error: "الكود استُنفد" });
        return;
      }
      throw err;
    }

    req.log.info(
      { userId: user.id, code: found.code, paymentId },
      "Free order created via 100% discount"
    );

    res.json({ success: true, paymentId });
  }
);

// ─── GET /api/billing/payment-status/:id ──────────────────

router.get(
  "/billing/payment-status/:id",
  async (req: Request, res: Response): Promise<void> => {
    const user = await requireUser(req, res);
    if (!user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const [payment] = await db
      .select()
      .from(paymentsTable)
      .where(and(eq(paymentsTable.id, id as string), eq(paymentsTable.userId, user.id)));

    if (!payment) {
      res.status(404).json({ success: false, error: "Payment not found" });
      return;
    }

    const [assessment] = payment.assessmentId
      ? await db
          .select({ id: assessmentsTable.id, status: assessmentsTable.status })
          .from(assessmentsTable)
          .where(and(eq(assessmentsTable.id, payment.assessmentId), eq(assessmentsTable.userId, user.id)))
      : [];

    res.json({
      success: true,
      payment: {
        id: payment.id,
        provider: payment.provider,
        status: payment.status,
        assessmentId: payment.assessmentId,
      },
      assessment: assessment ?? null,
    });
  }
);

// ─── POST /api/billing/lemon-webhook ──────────────────────

router.post(
  "/billing/lemon-webhook",
  async (req: Request, res: Response): Promise<void> => {
    const secret = process.env["LEMON_SQUEEZY_WEBHOOK_SECRET"];
    if (!secret) {
      req.log.error("Lemon webhook secret not configured");
      res.status(503).json({ success: false, error: "Webhook not configured" });
      return;
    }

    const signature = req.headers["x-signature"];
    const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;
    if (!rawBody || typeof signature !== "string") {
      res.status(400).json({ success: false, error: "Missing signature" });
      return;
    }

    const expected = Buffer.from(createHmac("sha256", secret).update(rawBody).digest("hex"), "utf8");
    const received = Buffer.from(signature, "utf8");
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
      req.log.warn("Invalid Lemon webhook signature");
      res.status(401).json({ success: false, error: "Invalid signature" });
      return;
    }

    const payload = req.body as {
      meta?: { event_name?: string; custom_data?: Record<string, unknown> };
      data?: {
        id?: string;
        attributes?: {
          status?: string;
          total_usd?: number;
          total?: number;
        };
      };
    };

    const eventName = payload.meta?.event_name ?? req.headers["x-event-name"];
    if (eventName !== "order_created") {
      res.json({ success: true, ignored: true });
      return;
    }

    const customData = payload.meta?.custom_data ?? {};
    const paymentId = typeof customData["payment_id"] === "string" ? customData["payment_id"] : null;
    if (!paymentId) {
      req.log.warn({ customData }, "Lemon order_created webhook missing payment_id");
      res.json({ success: true, ignored: true });
      return;
    }

    const [payment] = await db
      .select()
      .from(paymentsTable)
      .where(eq(paymentsTable.id, paymentId));

    if (!payment) {
      req.log.warn({ paymentId }, "Lemon webhook payment not found");
      res.json({ success: true, ignored: true });
      return;
    }

    if (payment.status !== "completed") {
      await db
        .update(paymentsTable)
        .set({
          status: "completed",
          lemonOrderId: payload.data?.id ?? payment.lemonOrderId,
        })
        .where(eq(paymentsTable.id, payment.id));

      if (payment.discountCode) {
        await recordCompletedPaymentDiscountUse(payment.discountCode, payment.userId, payment.id, req);
      }
    }

    await completeAssessmentAfterPayment(payment.id, req);

    req.log.info(
      { paymentId: payment.id, orderId: payload.data?.id, assessmentId: payment.assessmentId },
      "Lemon order processed"
    );
    res.json({ success: true });
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
