import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { verifyMagicLinkToken, createSessionToken, sessionCookieOptions } from "@/lib/auth";

/**
 * GET /api/auth/verify?token=xxx
 *
 * Verifies a magic link token, looks up the Stripe subscription,
 * creates a session cookie, and redirects to /dashboard.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=invalid", request.url));
  }

  const result = await verifyMagicLinkToken(token);
  if (!result) {
    return NextResponse.redirect(new URL("/login?error=expired", request.url));
  }

  const { email } = result;

  try {
    // Look up customer and active subscription in Stripe
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length === 0) {
      return NextResponse.redirect(new URL("/login?error=no_subscription", request.url));
    }

    const customer = customers.data[0];
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.redirect(new URL("/login?error=no_subscription", request.url));
    }

    // Determine tier from subscription price
    const sub = subscriptions.data[0];
    const amount = sub.items.data[0]?.price?.unit_amount ?? 0;
    const tier = amount >= 9700 ? "insider" : "dashboard";

    const sessionToken = await createSessionToken({
      email,
      tier,
      customerId: customer.id,
    });

    const cookie = sessionCookieOptions(sessionToken);
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set(cookie);
    return response;
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.redirect(new URL("/login?error=server", request.url));
  }
}
