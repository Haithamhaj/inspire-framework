import { Router, type IRouter, type Request, type Response } from "express";
import Stripe from "stripe";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { getAuthUser } from "../lib/auth";

const router: IRouter = Router();

function getStripe(): Stripe | null {
  const key = process.env["STRIPE_SECRET_KEY"];
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2025-03-31.basil" });
}

async function requireUser(req: Request, res: Response) {
  const authHeader = req.headers["authorization"] as string | undefined;
  const auth = await getAuthUser(authHeader);
  if (!auth) return null;
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, auth.userId));
  return user ?? null;
}

// ─── POST /api/billing/checkout ───────────────────────────
// Creates a Stripe Checkout session for the Pro plan upgrade

router.post(
  "/billing/checkout",
  async (req: Request, res: Response): Promise<void> => {
    const stripe = getStripe();
    if (!stripe) {
      res.status(503).json({
        success: false,
        error: "Payment system is not configured yet.",
      });
      return;
    }

    const user = await requireUser(req, res);
    if (!user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    if (user.plan === "pro") {
      res.status(400).json({ success: false, error: "Already on Pro plan" });
      return;
    }

    const priceId = process.env["STRIPE_PRICE_ID"];
    if (!priceId) {
      res.status(503).json({
        success: false,
        error: "Billing price is not configured.",
      });
      return;
    }

    const appUrl =
      process.env["APP_URL"] ||
      "https://65b87698-2306-4a02-a0fa-7e418a57ad9f-00-3vu82xw7xi73i.kirk.replit.dev";
    const basePath = "/inspire-web";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}${basePath}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}${basePath}/my-assessments`,
      customer_email: user.email,
      metadata: { userId: user.id },
      locale: "ar",
    });

    req.log.info({ userId: user.id, sessionId: session.id }, "Stripe checkout session created");

    res.json({ success: true, url: session.url });
  }
);

// ─── POST /api/billing/webhook ────────────────────────────
// Stripe sends events here — raw body required for sig verification

router.post(
  "/billing/webhook",
  async (req: Request, res: Response): Promise<void> => {
    const stripe = getStripe();
    if (!stripe) {
      res.status(503).send("Payment system not configured");
      return;
    }

    const webhookSecret = process.env["STRIPE_WEBHOOK_SECRET"];
    if (!webhookSecret) {
      res.status(503).send("Webhook secret not configured");
      return;
    }

    const sig = req.headers["stripe-signature"];
    if (!sig) {
      res.status(400).send("Missing stripe-signature header");
      return;
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body as Buffer,
        sig,
        webhookSecret
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      req.log.warn({ message }, "Stripe webhook signature verification failed");
      res.status(400).send(`Webhook Error: ${message}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.["userId"];

      if (!userId) {
        req.log.warn({ sessionId: session.id }, "No userId in session metadata");
        res.json({ received: true });
        return;
      }

      await db
        .update(usersTable)
        .set({ plan: "pro" })
        .where(eq(usersTable.id, userId));

      req.log.info({ userId, sessionId: session.id }, "User upgraded to Pro");
    }

    res.json({ received: true });
  }
);

export default router;
