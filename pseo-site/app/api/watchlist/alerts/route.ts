import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";

const FROM_EMAIL = process.env.FROM_EMAIL || "signal@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";

/** HTML-escape a string to prevent XSS in email templates */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
  }

  const session = await getSession();
  if (!session || session.tier !== "insider") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 3 requests per minute per user (sends emails)
  const rl = checkRateLimit(`watchlist:${session.email}`, 3, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: rateLimitHeaders(rl) }
    );
  }

  // Use session.email (trusted, from JWT) — NOT user-supplied body.email
  const email = session.email;
  const { watchlist } = await request.json();

  if (!Array.isArray(watchlist) || watchlist.length === 0) {
    return NextResponse.json({ error: "Empty watchlist" }, { status: 400 });
  }

  // Cap watchlist size to prevent abuse
  if (watchlist.length > 50) {
    return NextResponse.json({ error: "Watchlist too large (max 50)" }, { status: 400 });
  }

  // Sanitize all user-provided company names for safe HTML embedding
  const safeNames = watchlist.map((name: string) => escapeHtml(String(name).slice(0, 200)));

  // Notify admin to set up alerts for this user
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: "signal@gitdealflow.com",
      subject: `Watchlist alert request: ${escapeHtml(email)}`,
      html: `<p><strong>Insider watchlist alert request</strong></p>
<p>Email: ${escapeHtml(email)}</p>
<p>Watchlist (${safeNames.length} companies):</p>
<ul>${safeNames.map((name: string) => `<li>${name}</li>`).join("")}</ul>
<p>Time: ${new Date().toISOString()}</p>`,
    }),
  });

  // Confirm to the user
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: "Watchlist alerts enabled",
      html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#0ea5e9;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
<p>Your watchlist alerts are now active.</p>
<p>You'll receive an email when any of these companies show a significant signal change:</p>
<ul>${safeNames.map((name: string) => `<li><strong>${name}</strong></li>`).join("")}</ul>
<p>You can update your watchlist anytime from the <a href="https://signals.gitdealflow.com/dashboard" style="color:#0ea5e9;">Dashboard</a>.</p>
<p>— The Data Nerd</p>
</div>
</div></body></html>`,
    }),
  });

  return NextResponse.json({ ok: true });
}
