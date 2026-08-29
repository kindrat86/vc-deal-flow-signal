import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";

// Self-serve billing portal (expansion-audit move #1, 2026-08-29).
//
// Why this route exists: the Stripe Customer Portal configuration already
// allows switching between Dashboard (€49/mo, €490/yr) and Insider
// (€197/mo, €1,970/yr) prices, but before this route the app had NO way
// to open the portal — upgrade copy everywhere said "reply upgrade me by
// email", which makes every plan change manual founder work.
//
// Auth: same JWT session cookie as /dashboard (lib/auth.ts). The session
// carries the Stripe customer ID issued at checkout.
//
// Grandfathering: the portal config deliberately does NOT expose the legacy
// founding prices (€9.97 / €97). A grandfathered subscriber keeps their rate
// unless they actively choose a listed price; this route never mutates the
// subscription itself, it only opens Stripe's portal.

const POSTHOG_PUBLIC_KEY = "phc_lyZCgvTpicjLzAO3rY2GhxuX5WUc5jQjP8ZVwwJqauX";

export async function GET(req: NextRequest) {
  const session = await getSession();

  if (!session) {
    // Not signed in: send to login, preserving nothing sensitive in the URL.
    const origin = req.nextUrl.origin;
    return NextResponse.redirect(`${origin}/login`, 303);
  }
  if (!session.customerId) {
    // Session predates customerId in the payload (e.g. long-lived cookie
    // minted before checkout linked a customer). Re-login mints a fresh one.
    const origin = req.nextUrl.origin;
    return NextResponse.redirect(
      `${origin}/dashboard?billing_portal=unlinked`,
      303
    );
  }

  try {
    const stripe = getStripe();
    const origin = req.nextUrl.origin;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: session.customerId,
      return_url: `${origin}/dashboard?billing_portal=returned`,
    });

    // Best-effort product analytics (same server-side pattern as the Stripe
    // webhook). Event name matches lib/customer-health.ts. Never block the
    // redirect on a capture failure.
    try {
      await fetch("https://eu.i.posthog.com/capture/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: POSTHOG_PUBLIC_KEY,
          event: "billing_portal_opened",
          distinct_id: session.email,
          properties: {
            $host: "signals.gitdealflow.com",
            product: "gitdealflow",
            tier: session.tier,
          },
        }),
      });
    } catch (phErr) {
      console.error("[posthog] billing_portal_opened capture failed:", phErr);
    }

    return NextResponse.redirect(portalSession.url, 303);
  } catch (err) {
    console.error("[billing-portal] session create failed:", err);
    const origin = req.nextUrl.origin;
    return NextResponse.redirect(
      `${origin}/dashboard?billing_portal=error`,
      303
    );
  }
}
