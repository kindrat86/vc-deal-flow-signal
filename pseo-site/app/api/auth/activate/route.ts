import { NextRequest, NextResponse } from "next/server";
import { stripe, getTierFromSession } from "@/lib/stripe";
import { createSessionToken, sessionCookieOptions } from "@/lib/auth";
import { isNonceUsed, markNonceUsed } from "@/lib/runtime-cache";

/**
 * Replay-prevention: each Stripe checkout session ID can only activate once.
 * Backed by Vercel Runtime Cache (per-region KV with TTL) which survives cold
 * starts and is shared across function instances within a region. Falls back
 * to an in-memory Map for local dev. See lib/runtime-cache.ts.
 *
 * 1-hour TTL: Stripe checkout sessions live for 24h, but the activation
 * window in practice is much shorter (a user clicks the redirect within
 * minutes). 1h is enough to absorb the slow case + email-prefetch + double-
 * click scenarios without bloating the cache namespace.
 */
const REPLAY_NAMESPACE = "activate-session";
const REPLAY_TTL_SECONDS = 60 * 60; // 1 hour

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
  if (await isNonceUsed(REPLAY_NAMESPACE, sessionId)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer"],
    });

    if (session.payment_status !== "paid") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Mark as used BEFORE creating the session token. The Runtime Cache
    // write is awaited so a concurrent request that lost the race sees the
    // mark on its next isNonceUsed check (eventually consistent within ~ms
    // inside a region).
    await markNonceUsed(REPLAY_NAMESPACE, sessionId, REPLAY_TTL_SECONDS);

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

    // One-time tiers (teardown, firstlook, sector_sweep, agent_credits_*,
    // book, book_pack) don't grant Dashboard access — the deliverable
    // arrives by email (manual teardown reply within 4h for teardown;
    // sector report for first look; PDF for sector sweep; API key for
    // credit packs; book downloads + bonus emails for book; pack artefacts
    // for book_pack). Redirect to a thank-you page instead of issuing a
    // session cookie.
    if (
      tier === "teardown" ||
      tier === "firstlook" ||
      tier === "sector_sweep" ||
      tier === "agent_credits_100" ||
      tier === "book" ||
      tier === "book_pack"
    ) {
      const thanksUrl =
        tier === "sector_sweep"
          ? new URL("/sector-sweep?status=paid", request.url)
          : tier === "agent_credits_100"
            ? new URL("/agents/credits?status=paid", request.url)
            : tier === "book" || tier === "book_pack"
              ? new URL(`/book/thanks?status=paid&tier=${tier}`, request.url)
              : tier === "teardown"
                ? new URL("/tweet-teardown/thanks?status=paid", request.url)
                : new URL("/thanks/firstlook?status=paid", request.url);
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
