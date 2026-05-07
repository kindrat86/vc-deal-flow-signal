import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { ENTRY_TIERS, type EntryTierKey } from "@/lib/stripe-tiers";

export const dynamic = "force-dynamic";

const SITE_ORIGIN = "https://signals.gitdealflow.com";

function isEntryTier(value: string): value is EntryTierKey {
  return Object.prototype.hasOwnProperty.call(ENTRY_TIERS, value);
}

async function readTier(req: NextRequest): Promise<string | null> {
  const ctype = req.headers.get("content-type") ?? "";
  if (ctype.includes("application/json")) {
    try {
      const body = (await req.json()) as { tier?: unknown };
      if (typeof body.tier === "string") return body.tier;
    } catch {
      return null;
    }
  }
  if (ctype.includes("application/x-www-form-urlencoded") || ctype.includes("multipart/form-data")) {
    const fd = await req.formData();
    const t = fd.get("tier");
    if (typeof t === "string") return t;
  }
  const t = req.nextUrl.searchParams.get("tier");
  if (t) return t;
  return null;
}

export async function POST(req: NextRequest) {
  const tier = await readTier(req);
  if (!tier || !isEntryTier(tier)) {
    return NextResponse.json({ error: "invalid_tier" }, { status: 400 });
  }

  const cfg = ENTRY_TIERS[tier];
  const origin = req.headers.get("origin") || SITE_ORIGIN;

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_creation: "always",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: cfg.currency,
            unit_amount: cfg.unitAmount,
            product_data: {
              name: cfg.productName,
              ...(cfg.description ? { description: cfg.description } : {}),
            },
          },
        },
      ],
      payment_intent_data: {
        // Save the card on the customer for one-click OTO charges on the
        // thank-you page (Brunson cart funnel — Secret 18 / DotCom Ch 12).
        // Without this the OTO has to re-collect card details.
        setup_future_usage: "off_session",
        metadata: { tier, flow: "entry_checkout" },
      },
      success_url: `${origin}${cfg.successUrl}`,
      cancel_url: `${origin}${cfg.cancelUrl}`,
      metadata: { tier, flow: "entry_checkout" },
      allow_promotion_codes: true,
    });
  } catch (err) {
    console.error("checkout.session.create failed", { tier, err });
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
