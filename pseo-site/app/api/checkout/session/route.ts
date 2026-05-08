import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import {
  ENTRY_TIERS,
  type EntryTierKey,
  BUMPS,
  type BumpKey,
} from "@/lib/stripe-tiers";

export const dynamic = "force-dynamic";

const SITE_ORIGIN = "https://signals.gitdealflow.com";

// Variant tag must stay short (Stripe metadata caps each value at 500 chars)
// and ASCII-safe. We accept up to 32 chars matching this shape; anything
// stranger is dropped silently (better than 400-ing a paying buyer).
const VARIANT_RX = /^[a-zA-Z0-9_.-]{1,32}$/;

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
};

async function readInput(req: NextRequest): Promise<CheckoutInput> {
  const ctype = req.headers.get("content-type") ?? "";
  if (ctype.includes("application/json")) {
    try {
      const body = (await req.json()) as {
        tier?: unknown;
        bump?: unknown;
        variant?: unknown;
      };
      return {
        tier: typeof body.tier === "string" ? body.tier : null,
        bump: typeof body.bump === "string" ? body.bump : null,
        variant: typeof body.variant === "string" ? body.variant : null,
      };
    } catch {
      return { tier: null, bump: null, variant: null };
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
    return {
      tier: typeof tier === "string" ? tier : null,
      bump: typeof bump === "string" && bump !== "" ? bump : null,
      variant: typeof variant === "string" && variant !== "" ? variant : null,
    };
  }
  const sp = req.nextUrl.searchParams;
  return {
    tier: sp.get("tier"),
    bump: sp.get("bump"),
    variant: sp.get("variant"),
  };
}

export async function POST(req: NextRequest) {
  const { tier, bump: rawBump, variant: rawVariant } = await readInput(req);
  if (!tier || !isEntryTier(tier)) {
    return NextResponse.json({ error: "invalid_tier" }, { status: 400 });
  }

  // Bump is optional. Unknown values are dropped silently rather than
  // 400-ing — a malformed param shouldn't block a paying buyer.
  const bump: BumpKey | null = isBump(rawBump) ? rawBump : null;

  // Variant tag for /r/[campaign] + on-page A/B attribution. Sanitized to
  // ASCII-safe shape so it's safe to round-trip via Stripe metadata.
  const variant =
    typeof rawVariant === "string" && VARIANT_RX.test(rawVariant)
      ? rawVariant
      : null;

  const cfg = ENTRY_TIERS[tier];
  const origin = req.headers.get("origin") || SITE_ORIGIN;

  // Brunson DotCom Ch 18 — additive order bump. The bump is a SECOND line
  // item, not a price swap. AOV lifts without disrupting the OTO ladder
  // that follows on /firstlook/thanks.
  //
  // The line_items shape is inferred from the SessionCreateParams the
  // Stripe SDK expects below — annotating Stripe.Checkout.SessionCreateParams.LineItem
  // explicitly is brittle because the Checkout namespace re-exports
  // SessionCreateParams as a type-alias-only, dropping nested member types.
  const baseLineItem = {
    quantity: 1,
    price_data: {
      currency: cfg.currency,
      unit_amount: cfg.unitAmount,
      product_data: {
        name: cfg.productName,
        ...(cfg.description ? { description: cfg.description } : {}),
      },
    },
  } as const;

  const bumpLineItem = bump
    ? ({
        quantity: 1,
        price_data: {
          currency: BUMPS[bump].currency,
          unit_amount: BUMPS[bump].unitAmount,
          product_data: {
            name: BUMPS[bump].productName,
            description: BUMPS[bump].description,
          },
        },
      } as const)
    : null;

  const lineItems = bumpLineItem ? [baseLineItem, bumpLineItem] : [baseLineItem];

  // Round-trip metadata. The thank-you page reads `bump` to acknowledge the
  // upgrade explicitly; analytics pipelines read `variant` to attribute
  // conversion to the ad-set / ICP frame the buyer arrived under.
  const metadata: Record<string, string> = {
    tier,
    flow: "entry_checkout",
    ...(bump ? { bump } : {}),
    ...(variant ? { variant } : {}),
  };

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_creation: "always",
      payment_method_types: ["card"],
      line_items: lineItems,
      payment_intent_data: {
        // Save the card on the customer for one-click OTO charges on the
        // thank-you page (Brunson cart funnel — Secret 18 / DotCom Ch 12).
        // Without this the OTO has to re-collect card details.
        setup_future_usage: "off_session",
        metadata,
      },
      success_url: `${origin}${cfg.successUrl}`,
      cancel_url: `${origin}${cfg.cancelUrl}`,
      metadata,
      allow_promotion_codes: true,
    });
  } catch (err) {
    console.error("checkout.session.create failed", { tier, bump, err });
    return NextResponse.json({ error: "stripe_error" }, { status: 502 });
  }

  if (!session.url) {
    console.error("checkout.session.create returned no url", { tier, sessionId: session.id });
    return NextResponse.json({ error: "no_session_url" }, { status: 500 });
  }

  // A regular <form method=POST> submit needs a 303 to turn into a GET on
  // Stripe; fetch() callers asking for JSON get the URL instead.
  const accept = req.headers.get("accept") ?? "";
  if (accept.includes("application/json")) {
    return NextResponse.json({ url: session.url, id: session.id });
  }
  return NextResponse.redirect(session.url, 303);
}
