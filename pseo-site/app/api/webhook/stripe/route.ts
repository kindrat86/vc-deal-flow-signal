import { NextRequest, NextResponse } from "next/server";
import { stripe, getTierFromSession } from "@/lib/stripe";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "signal@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
const TELEGRAM_INSIDER_INVITE = process.env.TELEGRAM_INSIDER_INVITE || "";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendEmail(to: string, subject: string, html: string) {
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    }),
  });
}

function dashboardWelcomeEmail(email: string): { subject: string; html: string } {
  return {
    subject: "Your Dashboard is ready",
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#0ea5e9;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
<p>Welcome to VC Deal Flow Signal Dashboard!</p>
<p>Your early access price of <strong>&euro;9.97/mo is locked in forever</strong>. Here's what's waiting for you:</p>
<ul style="padding-left:20px;">
<li>85+ startups ranked by engineering acceleration</li>
<li>Filter by sector, stage, and geography</li>
<li>Updated weekly with fresh GitHub data</li>
<li>Priority access to new features</li>
</ul>
<p style="margin:24px 0;"><a href="https://signals.gitdealflow.com/login" style="display:inline-block;background:#0284c7;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Access Your Dashboard</a></p>
<p>Log in with this email address (${escapeHtml(email)}) — we'll send you a magic link, no password needed.</p>
<p>Questions? Just reply to this email.</p>
<p>— The Data Nerd</p>
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p><a href="https://gitdealflow.com" style="color:#0ea5e9;">gitdealflow.com</a></p>
</div>
</div></body></html>`,
  };
}

function insiderWelcomeEmail(email: string): { subject: string; html: string } {
  const telegramLine = TELEGRAM_INSIDER_INVITE
    ? `<li><strong>Join the private Telegram group:</strong> <a href="${TELEGRAM_INSIDER_INVITE}" style="color:#0ea5e9;">${TELEGRAM_INSIDER_INVITE}</a></li>`
    : `<li><strong>Private Telegram group:</strong> I'll send your invite link within 24 hours.</li>`;

  return {
    subject: "Welcome to the Insider Circle",
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#0ea5e9;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL — INSIDER CIRCLE</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
<p>You're in. Welcome to the Insider Circle.</p>
<p>Your beta price of <strong>&euro;97/mo is locked in forever</strong>. Here's everything that's included:</p>
<ul style="padding-left:20px;">
<li>Full Dashboard access (85+ startups, all filters)</li>
<li>Private investor Telegram group</li>
<li>Monthly live signal briefing call</li>
<li>Custom watchlists</li>
<li>API access</li>
<li>Direct line to the founder</li>
</ul>
<p style="font-weight:600;">Your next steps:</p>
<ol style="padding-left:20px;">
<li><strong>Access your Dashboard:</strong> <a href="https://signals.gitdealflow.com/login" style="color:#0ea5e9;">Log in here</a> with ${escapeHtml(email)}</li>
${telegramLine}
</ol>
<p style="margin:24px 0;"><a href="https://signals.gitdealflow.com/login" style="display:inline-block;background:#0284c7;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Access Your Dashboard</a></p>
<p>I'll reach out personally within 24 hours to learn what sectors and stages you care about most.</p>
<p>— The Data Nerd</p>
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p><a href="https://gitdealflow.com" style="color:#0ea5e9;">gitdealflow.com</a></p>
</div>
</div></body></html>`,
  };
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Fetch full session with line items
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items"],
    });

    const email = fullSession.customer_details?.email;
    if (!email) {
      console.error("No email in checkout session:", session.id);
      return NextResponse.json({ received: true });
    }

    const tier = getTierFromSession(fullSession);
    const welcomeEmail =
      tier === "insider" ? insiderWelcomeEmail(email) : dashboardWelcomeEmail(email);

    try {
      await sendEmail(email, welcomeEmail.subject, welcomeEmail.html);
    } catch (err) {
      console.error("Failed to send welcome email:", err);
    }

    // Notify admin
    try {
      await sendEmail(
        "signal@gitdealflow.com",
        `New ${tier} subscriber: ${email}`,
        `<p><strong>New paying subscriber!</strong></p>
<p>Email: ${escapeHtml(email)}</p>
<p>Tier: ${escapeHtml(tier)}</p>
<p>Stripe Session: ${escapeHtml(session.id)}</p>
<p>Time: ${new Date().toISOString()}</p>`
      );
    } catch {
      // Admin notification is best-effort
    }
  }

  return NextResponse.json({ received: true });
}
