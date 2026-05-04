import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, PLAN_CONFIG, isValidPlan } from "@/lib/stripe";
import { getSession } from "@/lib/auth";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://signals.gitdealflow.com";

export async function GET(request: NextRequest) {
  const plan = request.nextUrl.searchParams.get("plan") ?? "";

  if (!isValidPlan(plan)) {
    return NextResponse.redirect(
      new URL("/pricing?error=invalid-plan", BASE_URL)
    );
  }

  const config = PLAN_CONFIG[plan];
  const priceId = process.env[config.priceEnv];
  if (!priceId) {
    console.error(
      `Stripe price not configured for plan ${plan} (env ${config.priceEnv})`
    );
    return NextResponse.redirect(
      new URL("/pricing?error=plan-not-configured", BASE_URL)
    );
  }

  const session = await getSession();

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: config.mode,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${BASE_URL}/dashboard/billing?checkout=success`,
    cancel_url: `${BASE_URL}/pricing?checkout=cancelled`,
    metadata: { gdf_plan: plan },
    allow_promotion_codes: true,
  };

  if (session?.customerId) {
    params.customer = session.customerId;
  } else if (config.mode === "payment") {
    params.customer_creation = "always";
  }

  if (config.mode === "subscription") {
    params.subscription_data = { metadata: { gdf_plan: plan } };
  } else {
    params.payment_intent_data = { metadata: { gdf_plan: plan } };
  }

  try {
    const checkout = await stripe.checkout.sessions.create(params);
    if (!checkout.url) {
      return NextResponse.redirect(
        new URL("/pricing?error=checkout-failed", BASE_URL)
      );
    }
    return NextResponse.redirect(checkout.url, { status: 303 });
  } catch (err) {
    console.error("Stripe checkout failed:", err);
    return NextResponse.redirect(
      new URL("/pricing?error=checkout-failed", BASE_URL)
    );
  }
}
