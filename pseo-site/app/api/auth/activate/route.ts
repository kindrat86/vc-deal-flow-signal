import { NextRequest, NextResponse } from "next/server";
import { stripe, getTierFromSession } from "@/lib/stripe";
import { createSessionToken, sessionCookieOptions } from "@/lib/auth";

/**
 * In-memory set of already-used checkout session IDs to prevent replay.
 * Entries are cleaned up after 1 hour (Stripe sessions expire after 24h,
 * but the activation window is much shorter in practice).
 */
const usedSessions = new Map<string, number>();
const SESSION_REPLAY_TTL = 60 * 60 * 1000; // 1 hour

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [id, ts] of usedSessions) {
    if (now - ts > SESSION_REPLAY_TTL) usedSessions.delete(id);
  }
}, 5 * 60 * 1000);

/**
 * GET /api/auth/activate?session_id=cs_xxx
 *
 * Stripe Payment Link redirects here after successful payment.
 * Fetches the checkout session, creates a JWT session cookie,
 * and redirects to /welcome. Each session_id can only be used once.
 */
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Validate session_id format (Stripe checkout sessions start with cs_)
  if (!/^cs_(test_|live_)?[a-zA-Z0-9]+$/.test(sessionId)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Prevent replay: each session_id can only activate once
  if (usedSessions.has(sessionId)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer"],
    });

    if (session.payment_status !== "paid") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Mark as used BEFORE creating the session token
    usedSessions.set(sessionId, Date.now());

    const customer =
      typeof session.customer === "object" && session.customer && !("deleted" in session.customer)
        ? session.customer
        : null;
    const email =
      session.customer_details?.email ?? customer?.email ?? "";
    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id ?? "";
    const tier = getTierFromSession(session);

    if (!email) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // One-time tiers (firstlook, sector_sweep, agent_credits_*) don't grant
    // Dashboard access — the deliverable arrives by email (API key for credit
    // packs; PDF for sector sweep; sector report for first look). Redirect to
    // a thank-you page instead of issuing a session cookie.
    if (
      tier === "firstlook" ||
      tier === "sector_sweep" ||
      tier === "agent_credits_100"
    ) {
      const thanksUrl =
        tier === "sector_sweep"
          ? new URL("/sector-sweep?status=paid", request.url)
          : tier === "agent_credits_100"
            ? new URL("/agents/credits?status=paid", request.url)
            : new URL("/?status=paid&pass=firstlook#firstlook", request.url);
      return NextResponse.redirect(thanksUrl);
    }

    const token = await createSessionToken({ email, tier, customerId });
    const cookie = sessionCookieOptions(token);

    const response = NextResponse.redirect(new URL("/welcome", request.url));
    response.cookies.set(cookie);
    return response;
  } catch (err) {
    console.error("Activate error:", err);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
