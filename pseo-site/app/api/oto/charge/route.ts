import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import {
  OTO_TIERS,
  type OtoKey,
  getOrCreateRecurringPrice,
  getOrCreateOnceCoupon,
} from "@/lib/stripe-tiers";
import { isNonceUsed, markNonceUsed } from "@/lib/runtime-cache";

export const dynamic = "force-dynamic";

const REPLAY_NAMESPACE = "oto-charge";
const REPLAY_TTL_SECONDS = 60 * 60 * 6;

type OtoSuccess = {
  ok: true;
  oto: OtoKey;
  receipt: { kind: "payment_intent" | "subscription"; id: string; amount: number };
};

type OtoFailure = { ok: false; error: string; clientAction?: { url: string } };

function isOtoKey(value: unknown): value is OtoKey {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(OTO_TIERS, value);
}

function readSessionId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (!/^cs_(test_|live_)?[a-zA-Z0-9]+$/.test(value)) return null;
  return value;
}

async function loadParentCheckout(sessionId: string): Promise<{
  customerId: string;
  paymentMethodId: string;
  email: string;
} | null> {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["customer", "payment_intent", "payment_intent.payment_method"],
  });

  if (session.payment_status !== "paid") return null;

  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;
  if (!customerId) return null;

  const pi = typeof session.payment_intent === "object" ? session.payment_intent : null;
  let paymentMethodId: string | null = null;
  if (pi) {
    paymentMethodId =
      typeof pi.payment_method === "string"
        ? pi.payment_method
        : pi.payment_method?.id ?? null;
  }
  if (!paymentMethodId) {
    // Fall back to the customer's default payment method from the saved
    // setup_future_usage='off_session' attachment.
    const customer = await stripe.customers.retrieve(customerId);
    if (!customer.deleted) {
      const def = customer.invoice_settings?.default_payment_method;
      paymentMethodId = typeof def === "string" ? def : def?.id ?? null;
    }
    if (!paymentMethodId) {
      const list = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
        limit: 1,
      });
      paymentMethodId = list.data[0]?.id ?? null;
    }
  }
  if (!paymentMethodId) return null;

  const email = session.customer_details?.email ?? "";
  return { customerId, paymentMethodId, email };
}

async function chargeOneTime(
  oto: OtoKey,
  parent: { customerId: string; paymentMethodId: string; email: string; sessionId: string }
): Promise<OtoSuccess | OtoFailure> {
  const cfg = OTO_TIERS[oto];
  if (cfg.kind !== "one_time") return { ok: false, error: "wrong_kind" };

  try {
    const intent = await stripe.paymentIntents.create(
      {
        amount: cfg.unitAmount,
        currency: cfg.currency,
        customer: parent.customerId,
        payment_method: parent.paymentMethodId,
        off_session: true,
        confirm: true,
        // Make the resulting charge appear in the seller's records with a
        // human-readable line so it's clear in the buyer's bank statement
        // that this is a follow-on charge, not a duplicate.
        description: cfg.productName,
        statement_descriptor_suffix: "OTO",
        metadata: {
          oto,
          parent_session: parent.sessionId,
          email: parent.email,
          flow: "oto_one_click",
        },
      },
      // Idempotency on (sessionId, oto) means a double-click or retry on the
      // same OTO never double-charges.
      { idempotencyKey: `oto:${parent.sessionId}:${oto}` }
    );

    if (intent.status === "succeeded" || intent.status === "processing") {
      return {
        ok: true,
        oto,
        receipt: { kind: "payment_intent", id: intent.id, amount: intent.amount },
      };
    }
    if (intent.status === "requires_action" && intent.next_action?.redirect_to_url?.url) {
      return {
        ok: false,
        error: "requires_action",
        clientAction: { url: intent.next_action.redirect_to_url.url },
      };
    }
    return { ok: false, error: `unexpected_status:${intent.status}` };
  } catch (err) {
    return parseStripeError(err);
  }
}

async function chargeSubscription(
  oto: OtoKey,
  parent: { customerId: string; paymentMethodId: string; email: string; sessionId: string }
): Promise<OtoSuccess | OtoFailure> {
  const cfg = OTO_TIERS[oto];
  if (cfg.kind !== "subscription") return { ok: false, error: "wrong_kind" };

  const price = await getOrCreateRecurringPrice({
    lookupKey: cfg.lookupKey,
    productName: cfg.productName,
    unitAmount: cfg.unitAmount,
    currency: cfg.currency,
    interval: cfg.interval,
  });

  let discount: Stripe.SubscriptionCreateParams.Discount | undefined;
  if (cfg.firstInvoiceCouponAmountOff && cfg.firstInvoiceCouponLookupKey) {
    const coupon = await getOrCreateOnceCoupon({
      lookupKey: cfg.firstInvoiceCouponLookupKey,
      amountOff: cfg.firstInvoiceCouponAmountOff,
      currency: cfg.currency,
      name: `${cfg.productName} — First Look OTO first-month discount`,
    });
    discount = { coupon: coupon.id };
  }

  // Make sure the saved card is attached + becomes the default for invoices,
  // otherwise Stripe will try to bill via Checkout next month.
  await stripe.customers.update(parent.customerId, {
    invoice_settings: { default_payment_method: parent.paymentMethodId },
  });

  try {
    const sub = await stripe.subscriptions.create(
      {
        customer: parent.customerId,
        items: [{ price: price.id }],
        default_payment_method: parent.paymentMethodId,
        ...(discount ? { discounts: [discount] } : {}),
        // payment_behavior:'error_if_incomplete' makes Stripe attempt the
        // first invoice synchronously and throw on auth-required cards
        // (we then surface 3DS to the client).
        payment_behavior: "error_if_incomplete",
        expand: ["latest_invoice.payments"],
        metadata: {
          oto,
          parent_session: parent.sessionId,
          email: parent.email,
          flow: "oto_one_click",
        },
        off_session: true,
      },
      { idempotencyKey: `oto:${parent.sessionId}:${oto}` }
    );

    if (sub.status === "active" || sub.status === "trialing") {
      const inv =
        typeof sub.latest_invoice === "object" ? sub.latest_invoice : null;
      const amount = inv?.amount_paid ?? cfg.unitAmount;
      return {
        ok: true,
        oto,
        receipt: { kind: "subscription", id: sub.id, amount },
      };
    }
    return { ok: false, error: `subscription_status:${sub.status}` };
  } catch (err) {
    return parseStripeError(err);
  }
}

function parseStripeError(err: unknown): OtoFailure {
  if (err && typeof err === "object" && "type" in err) {
    const e = err as Stripe.StripeRawError;
    if (e.code === "authentication_required") {
      const piId =
        (e as unknown as { payment_intent?: { id?: string } }).payment_intent?.id;
      return {
        ok: false,
        error: "authentication_required",
        ...(piId ? { clientAction: { url: `/firstlook/auth?pi=${piId}` } } : {}),
      };
    }
    if (e.code === "card_declined") {
      return { ok: false, error: "card_declined" };
    }
    return { ok: false, error: `stripe:${e.code ?? e.type ?? "unknown"}` };
  }
  return { ok: false, error: "stripe_unknown" };
}

export async function POST(req: NextRequest) {
  let body: { session_id?: unknown; oto?: unknown };
  try {
    body = (await req.json()) as { session_id?: unknown; oto?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const sessionId = readSessionId(body.session_id);
  if (!sessionId) {
    return NextResponse.json({ ok: false, error: "invalid_session_id" }, { status: 400 });
  }
  if (!isOtoKey(body.oto)) {
    return NextResponse.json({ ok: false, error: "invalid_oto" }, { status: 400 });
  }
  const oto: OtoKey = body.oto;

  const replayKey = `${sessionId}:${oto}`;
  if (await isNonceUsed(REPLAY_NAMESPACE, replayKey)) {
    return NextResponse.json(
      { ok: false, error: "already_charged" },
      { status: 409 }
    );
  }

  const parent = await loadParentCheckout(sessionId);
  if (!parent) {
    console.error("oto.charge: parent session not found or unpaid", { sessionId });
    return NextResponse.json({ ok: false, error: "parent_not_found" }, { status: 404 });
  }

  const ctx = { ...parent, sessionId };
  const cfg = OTO_TIERS[oto];
  const result =
    cfg.kind === "one_time"
      ? await chargeOneTime(oto, ctx)
      : await chargeSubscription(oto, ctx);

  if (result.ok) {
    await markNonceUsed(REPLAY_NAMESPACE, replayKey, REPLAY_TTL_SECONDS);
  } else {
    console.warn("oto.charge: failed", { sessionId, oto, error: result.error });
  }

  return NextResponse.json(result, { status: result.ok ? 200 : 402 });
}
