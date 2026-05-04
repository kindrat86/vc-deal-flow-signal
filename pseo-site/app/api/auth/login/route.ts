import { NextRequest, NextResponse } from "next/server";
import { stripe, getCustomerBalanceCents } from "@/lib/stripe";
import { createMagicLinkToken } from "@/lib/auth";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { isValidEmail, isAllowedOrigin } from "@/lib/validation";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "signal@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://signals.gitdealflow.com";

/**
 * POST /api/auth/login
 * Body: { email: string }
 *
 * Checks if the email has an active Stripe subscription.
 * If yes, sends a magic link email. If no, returns an error.
 */
export async function POST(request: NextRequest) {
  // CSRF: reject requests from disallowed origins
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Rate limit: 3 login attempts per minute per IP (stricter — sends emails)
  const ip = getClientIp(request);
  const rl = checkRateLimit(`login:${ip}`, 3, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429, headers: rateLimitHeaders(rl) }
    );
  }

  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Check Stripe for active subscriptions with this email
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length === 0) {
      // Don't reveal whether the email exists — always say "check your email"
      return NextResponse.json({ ok: true });
    }

    const customer = customers.data[0];
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    });
    const balanceCents = await getCustomerBalanceCents(customer.id);

    if (subscriptions.data.length === 0 && balanceCents <= 0) {
      // No active subscription and no PAYG balance — pretend ok, don't email
      return NextResponse.json({ ok: true });
    }

    // Subscription or PAYG balance present — send magic link
    const token = await createMagicLinkToken(email);
    const magicLink = `${BASE_URL}/api/auth/verify?token=${token}`;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: email,
        subject: "Your login link for VC Deal Flow Signal",
        html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#0ea5e9;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
<p>Click the button below to log in to your dashboard:</p>
<p style="margin:24px 0;"><a href="${magicLink}" style="display:inline-block;background:#0284c7;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Log In to Dashboard</a></p>
<p style="color:#64748b;font-size:14px;">This link expires in 15 minutes. If you didn't request this, you can ignore this email.</p>
</div>
</div></body></html>`,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
