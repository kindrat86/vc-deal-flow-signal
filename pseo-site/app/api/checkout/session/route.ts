import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import {
  ENTRY_TIERS,
  type EntryTierKey,
  BUMPS,
  type BumpKey,
} from "@/lib/stripe-tiers";
import { getReferralAttribution } from "@/lib/referrals";
import { isReferralEligibleTier } from "@/lib/referral-core";

export const dynamic = "force-dynamic";

const SITE_ORIGIN = "https://signals.gitdealflow.com";

// SEPA Direct Debit is the EU-standard card fallback (confirmed active on the
// account). Surface it on the subscription tiers and the high-ticket €1,997
// Sector Sweep, where funds and offices routinely pay by direct debit or bank
// transfer rather than card. Micro-trips (€1/€7/€19) stay card-only: SEPA's
// mandate + delayed settlement adds friction with no benefit at that price.
const SEPA_TIERS: ReadonlySet<string> = new Set(["dashboard", "insider", "sector_sweep"]);

// Variant tag must stay short (Stripe metadata caps each value at 500 chars)
// and ASCII-safe. We accept up to 32 chars matching this shape; anything
// stranger is dropped silently (better than 400-ing a paying buyer).
const VARIANT_RX = /^[a-zA-Z0-9_.-]{1,32}$/;
const SIGNAL_DESK_TIER = "signal_desk_pilot";
const SIGNAL_DESK_SEAT_LIMIT = 5;

/**
 * Stripe is the source of truth for the five founding places. We count only
 * completed, paid pilot sessions, never browser state or an unverified URL.
 */
async function hasSignalDeskSeatRemaining(): Promise<boolean> {
  let startingAfter: string | undefined;
  let paidSeats = 0;
  do {
    const page = await stripe.checkout.sessions.list({
      limit: 100,
      status: "complete",
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });
    for (const session of page.data) {
      if (
        session.payment_status === "paid" &&
        session.metadata?.offer === "signal_desk_pilot"
      ) {
        paidSeats += 1;
        if (paidSeats >= SIGNAL_DESK_SEAT_LIMIT) return false;
      }
    }
    startingAfter = page.has_more ? page.data.at(-1)?.id : undefined;
  } while (startingAfter);
  return true;
}

function corsHeaders(origin: string | null): HeadersInit {
  const allowed = [
    "https://gitdealflow.com",
    "https://www.gitdealflow.com",
    ...(process.env.NODE_ENV !== "production" ? ["http://localhost:8080"] : []),
  ];
  return {
    "Access-Control-Allow-Origin": origin && allowed.includes(origin) ? origin : "",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
  };
}

function isEntryTier(value: string): value is EntryTierKey {
  return Object.prototype.hasOwnProperty.call(ENTRY_TIERS, value);
}

function isBump(value: unknown): value is BumpKey {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(BUMPS, value);
}

type CheckoutInput = {
  tier: string | null;
  bump: string | null;
  variant: string | null;
  email: string | null;
  ph_distinct_id: string | null;
  referralCode: string | null;
};

async function readInput(req: NextRequest): Promise<CheckoutInput> {
  const ctype = req.headers.get("content-type") ?? "";
  if (ctype.includes("application/json")) {
    try {
      const body = (await req.json()) as {
        tier?: unknown;
        bump?: unknown;
        variant?: unknown;
        email?: unknown;
        ph_distinct_id?: unknown;
        referralCode?: unknown;
      };
      return {
        tier: typeof body.tier === "string" ? body.tier : null,
        bump: typeof body.bump === "string" ? body.bump : null,
        variant: typeof body.variant === "string" ? body.variant : null,
        email: typeof body.email === "string" ? body.email : null,
        ph_distinct_id: typeof body.ph_distinct_id === "string" ? body.ph_distinct_id : null,
        referralCode: typeof body.referralCode === "string" ? body.referralCode : null,
      };
    } catch {
      return { tier: null, bump: null, variant: null, email: null, ph_distinct_id: null, referralCode: null };
    }
  }
  if (
    ctype.includes("application/x-www-form-urlencoded") ||
    ctype.includes("multipart/form-data")
  ) {
    const fd = await req.formData();
    const tier = fd.get("tier");
    const bump = fd.get("bump");
    const variant = fd.get("variant");
    const email = fd.get("email");
    const ph_distinct_id = fd.get("ph_distinct_id");
    const referralCode = fd.get("referralCode");
    return {
      tier: typeof tier === "string" ? tier : null,
      bump: typeof bump === "string" && bump !== "" ? bump : null,
      variant: typeof variant === "string" && variant !== "" ? variant : null,
      email: typeof email === "string" && email !== "" ? email : null,
      ph_distinct_id: typeof ph_distinct_id === "string" && ph_distinct_id !== "" ? ph_distinct_id : null,
      referralCode: typeof referralCode === "string" && referralCode !== "" ? referralCode : null,
    };
  }
  const sp = req.nextUrl.searchParams;
  return {
    tier: sp.get("tier"),
    bump: sp.get("bump"),
    variant: sp.get("variant"),
    email: sp.get("email"),
    ph_distinct_id: sp.get("ph_distinct_id"),
    referralCode: sp.get("ref"),
  };
}

export async function POST(req: NextRequest) {
  const { tier, bump: rawBump, variant: rawVariant, email, ph_distinct_id, referralCode } = await readInput(req);
  const headers = corsHeaders(req.headers.get("origin"));
  if (!tier || !isEntryTier(tier)) {
    return NextResponse.json({ error: "invalid_tier" }, { status: 400, headers });
  }

  // Bump is optional. Unknown values are dropped silently rather than
  // 400-ing, a malformed param shouldn't block a paying buyer.
  const bump: BumpKey | null = isBump(rawBump) ? rawBump : null;

  // Variant tag for /r/[campaign] + on-page A/B attribution. Sanitized to
  // ASCII-safe shape so it's safe to round-trip via Stripe metadata.
  const variant =
    typeof rawVariant === "string" && VARIANT_RX.test(rawVariant)
      ? rawVariant
      : null;

  const cfg = ENTRY_TIERS[tier];
  const origin = req.headers.get("origin") || SITE_ORIGIN;

  if (tier === SIGNAL_DESK_TIER) {
    try {
      if (!(await hasSignalDeskSeatRemaining())) {
        return NextResponse.json({ error: "pilot_full" }, { status: 409, headers });
      }
    } catch (err) {
      console.error("signal desk capacity check failed", err);
      return NextResponse.json({ error: "capacity_check_failed" }, { status: 502, headers });
    }
  }

  // Referral lookup is deliberately best-effort. A bad or stale code never
  // blocks a genuine purchase; valid Dashboard codes get their Stripe discount
  // and carry the referrer into subscription metadata for the 30-day reward.
  const referral = isReferralEligibleTier(tier)
    ? await getReferralAttribution(stripe, referralCode).catch(() => null)
    : null;

  // Brunson DotCom Ch 14/18, additive order bump. The bump is a SECOND
  // purchasable item, not a price swap. AOV lifts without disrupting the
  // OTO ladder that follows on /firstlook/thanks.
  //
  // For `payment` mode: bump becomes a second line_item alongside the
  // base product, both are one-time charges.
  //
  // For `subscription` mode: bump becomes an add_invoice_item on the
  // FIRST invoice only (Stripe won't allow mixing one-time line_items
  // with recurring ones in subscription mode).
  const baseLineItem = {
    quantity: 1,
    price_data: {
      currency: cfg.currency,
      unit_amount: cfg.unitAmount,
      ...(cfg.mode === "subscription" ? { recurring: { interval: cfg.interval! } } : {}),
      product_data: {
        name: cfg.productName,
        ...(cfg.description ? { description: cfg.description } : {}),
      },
    },
  } as const;

  // Build the bump price data once (only when a valid bump was requested).
  // We reuse this for both payment-mode line_items and subscription-mode
  // add_invoice_items, the shape is identical.
  const validBump: BumpKey | null = bump;
  const bumpPriceData =
    validBump !== null
      ? {
          currency: BUMPS[validBump].currency,
          unit_amount: BUMPS[validBump].unitAmount,
          product_data: {
            name: BUMPS[validBump].productName,
            description: BUMPS[validBump].description,
          },
        }
      : null;

  // payment mode → bump is a second line_item
  const bumpLineItem =
    bumpPriceData && cfg.mode === "payment"
      ? ({ quantity: 1, price_data: bumpPriceData } as const)
      : null;

  const lineItems = bumpLineItem ? [baseLineItem, bumpLineItem] : [baseLineItem];

  // subscription mode → bump is an add_invoice_item on the first invoice
  const bumpInvoiceItem =
    bumpPriceData && cfg.mode === "subscription"
      ? {
          price_data: bumpPriceData,
          quantity: 1 as const,
        }
      : null;

  // Round-trip metadata. The thank-you page reads `bump` to acknowledge the
  // upgrade explicitly; analytics pipelines read `variant` to attribute
  // conversion to the ad-set / ICP frame the buyer arrived under.
  const metadata: Record<string, string> = {
    tier,
    flow: "entry_checkout",
    ...(tier === SIGNAL_DESK_TIER
      ? {
          offer: "signal_desk_pilot",
          pilot_duration_days: "30",
          credit_toward_dashboard_eur: "490",
          seat_limit: "5",
        }
      : {}),
    ...(bump ? { bump } : {}),
    ...(variant ? { variant } : {}),
    ...(ph_distinct_id ? { ph_distinct_id: ph_distinct_id.slice(0, 64) } : {}),
    ...(referral
      ? {
          referral_code: referral.referralCode,
          referral_promotion_code_id: referral.promotionCodeId,
          referrer_customer_id: referral.referrerCustomerId,
          referrer_email: referral.referrerEmail,
        }
      : {}),
  };

  let session: Stripe.Checkout.Session;
  try {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: cfg.mode,
      payment_method_types: SEPA_TIERS.has(tier) ? ["card", "sepa_debit"] : ["card"],
      line_items: lineItems,
      success_url: cfg.successUrl.startsWith("http") ? cfg.successUrl : `${origin}${cfg.successUrl}`,
      cancel_url: `${origin}${cfg.cancelUrl}`,
      metadata,
      allow_promotion_codes: !referral,
      ...(referral ? { discounts: [{ promotion_code: referral.promotionCodeId }] } : {}),
      ...(email ? { customer_email: email } : {}),
    };

    if (cfg.mode === "payment") {
      sessionParams.customer_creation = "always";
      sessionParams.payment_intent_data = {
        // Save the card on the customer for one-click OTO charges on the
        // thank-you page (Brunson cart funnel, Secret 18 / DotCom Ch 12).
        // Without this the OTO has to re-collect card details.
        setup_future_usage: "off_session",
        metadata,
      };
    } else {
      sessionParams.subscription_data = {
        metadata,
        // Brunson Ch 14, order bump on subscription mode: charge the
        // bump once on the first invoice, then the recurring price
        // continues normally on subsequent invoices.
        ...(bumpInvoiceItem
          ? { add_invoice_items: [bumpInvoiceItem] }
          : {}),
      };
    }

    session = await stripe.checkout.sessions.create(sessionParams);
  } catch (err) {
    console.error("checkout.session.create failed", { tier, bump, err });
    return NextResponse.json({ error: "stripe_error" }, { status: 502, headers });
  }

  if (!session.url) {
    console.error("checkout.session.create returned no url", { tier, sessionId: session.id });
    return NextResponse.json({ error: "no_session_url" }, { status: 500, headers });
  }

  // A regular <form method=POST> submit needs a 303 to turn into a GET on
  // Stripe; fetch() callers asking for JSON get the URL instead.
  const accept = req.headers.get("accept") ?? "";
  if (accept.includes("application/json")) {
    return NextResponse.json({ url: session.url, id: session.id }, { headers });
  }
  return NextResponse.redirect(session.url, 303);
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

// GET support: lets plain <a href="/api/checkout/session?tier=X"> links open
// a live checkout (replaces deactivated static Stripe payment links).
export async function GET(req: NextRequest) {
  const tier = req.nextUrl.searchParams.get("tier") || "";
  if (!isEntryTier(tier)) {
    return NextResponse.redirect(`${SITE_ORIGIN}/pricing`, 302);
  }
  const cfg = ENTRY_TIERS[tier];
  if (tier === SIGNAL_DESK_TIER) {
    try {
      if (!(await hasSignalDeskSeatRemaining())) {
        return NextResponse.redirect(`${SITE_ORIGIN}/signal-desk?full=1`, 302);
      }
    } catch {
      return NextResponse.redirect(`${SITE_ORIGIN}/signal-desk?capacity=unavailable`, 302);
    }
  }
  try {
    const session = await stripe.checkout.sessions.create({
      mode: cfg.mode,
      payment_method_types: SEPA_TIERS.has(tier) ? ["card", "sepa_debit"] : ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: cfg.currency,
            unit_amount: cfg.unitAmount,
            ...(cfg.mode === "subscription" ? { recurring: { interval: cfg.interval! } } : {}),
            product_data: {
              name: cfg.productName,
              ...(cfg.description ? { description: cfg.description } : {}),
            },
          },
        },
      ],
      success_url: cfg.successUrl.startsWith("http") ? cfg.successUrl : `${SITE_ORIGIN}${cfg.successUrl}`,
      cancel_url: `${SITE_ORIGIN}${cfg.cancelUrl}`,
      metadata: {
        tier,
        flow: "entry_checkout_get",
        ...(tier === SIGNAL_DESK_TIER
          ? {
              offer: "signal_desk_pilot",
              pilot_duration_days: "30",
              credit_toward_dashboard_eur: "490",
              seat_limit: "5",
            }
          : {}),
      },
      allow_promotion_codes: true,
      ...(cfg.mode === "payment"
        ? { customer_creation: "always" as const, payment_intent_data: { setup_future_usage: "off_session" as const, metadata: { tier, flow: "entry_checkout_get" } } }
        : {}),
    });
    return NextResponse.redirect(session.url!, 303);
  } catch {
    return NextResponse.redirect(`${SITE_ORIGIN}/pricing`, 302);
  }
}
