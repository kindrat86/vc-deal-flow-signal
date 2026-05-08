import "server-only";
import { type NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { getOrCreateRecurringPrice } from "@/lib/stripe-tiers";
import { getReplayWindow } from "@/lib/replay-window";

/**
 * Brunson Live-Replay cart-close gate.
 *
 * The €9.97/mo founding-member seat is only checkoutable while the weekly
 * cohort is open (Mon 06:00 UTC → Thu 23:59 UTC). Outside that window the
 * route returns a 302 to /founder-closed — a waitlist landing — instead of
 * routing to Stripe.
 *
 * When the cohort IS open, we create a fresh Stripe Checkout Session per
 * click (rather than reusing a static payment link). The session is tagged
 * with the ISO-week cohort id so we can later analyze "founding seats sold
 * per cohort" in Stripe metadata. Allows for future per-cohort price
 * overrides without redeploying.
 *
 * The `dashboard_founder_monthly_v1` recurring price is created on first
 * call via `getOrCreateRecurringPrice` (idempotent via lookup_key).
 */

export const dynamic = "force-dynamic";

const SITE_ORIGIN = "https://signals.gitdealflow.com";
const FOUNDER_PRICE_LOOKUP = "dashboard_founder_monthly_v1";
const FOUNDER_PRICE_AMOUNT_CENTS = 997; // €9.97

async function handle(req: NextRequest): Promise<NextResponse> {
  const { phase, replayId } = getReplayWindow();
  const origin = req.headers.get("origin") || SITE_ORIGIN;

  // Cohort closed → waitlist redirect, no Stripe call.
  if (phase === "closed") {
    const url = new URL("/founder-closed", origin);
    url.searchParams.set("from_cohort", replayId);
    url.searchParams.set("ref", req.nextUrl.searchParams.get("ref") ?? "perfect-webinar");
    return NextResponse.redirect(url, 302);
  }

  let price: Stripe.Price;
  try {
    price = await getOrCreateRecurringPrice({
      lookupKey: FOUNDER_PRICE_LOOKUP,
      productName: "Dashboard — Founding Member (€9.97/mo · Locked Forever)",
      unitAmount: FOUNDER_PRICE_AMOUNT_CENTS,
      currency: "eur",
      interval: "month",
    });
  } catch (err) {
    console.error("founder price lookup/create failed", err);
    return fallbackToWaitlist(origin, replayId, "stripe_price_unavailable");
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: `${origin}/thanks/dashboard?session_id={CHECKOUT_SESSION_ID}&cohort=${replayId}`,
      cancel_url: `${origin}/perfect-webinar?cancelled=1&cohort=${replayId}`,
      // Metadata at session level (one-shot, useful in webhook handlers).
      metadata: {
        tier: "dashboard",
        flow: "founder_cohort",
        cohort: replayId,
        phase,
      },
      // Metadata at subscription level (persists for the life of the sub —
      // shows up in Stripe Dashboard "subscription details", and in
      // recurring-invoice webhook events).
      subscription_data: {
        metadata: {
          tier: "dashboard",
          locked_at_cohort: replayId,
          locked_phase: phase,
        },
      },
      allow_promotion_codes: true,
    });
  } catch (err) {
    console.error("founder checkout.session.create failed", { cohort: replayId, err });
    return fallbackToWaitlist(origin, replayId, "stripe_session_unavailable");
  }

  if (!session.url) {
    console.error("founder session created without url", { sessionId: session.id });
    return fallbackToWaitlist(origin, replayId, "no_session_url");
  }

  return NextResponse.redirect(session.url, 303);
}

function fallbackToWaitlist(
  origin: string,
  replayId: string,
  reason: string,
): NextResponse {
  const url = new URL("/founder-closed", origin);
  url.searchParams.set("from_cohort", replayId);
  url.searchParams.set("error", reason);
  return NextResponse.redirect(url, 302);
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  return handle(req);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return handle(req);
}
