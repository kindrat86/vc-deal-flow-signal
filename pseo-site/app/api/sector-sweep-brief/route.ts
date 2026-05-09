import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { isValidEmail, isAllowedOrigin } from "@/lib/validation";

/**
 * /api/sector-sweep-brief — Brunson DotCom Ch 18 (Cart Funnel) + Ch 23
 * (Application Funnel) + Expert Secrets Ch 16 (Magic Script).
 *
 * Receives the 5-question Sector Sweep brief from /sector-sweep, validates,
 * and emails it to signal@gitdealflow.com via Resend so the founder can
 * reply with a 1-page fit assessment + tailored TOC + buy link inside 24
 * business hours.
 *
 * Anonymity-preserving by design: the "setter" is this form (async, written),
 * and the "closer" is the founder's written reply with the personal Stripe
 * link. No live calls, no founder face/voice, no real-name attribution.
 *
 * Replaces the prior conversion gap where /sector-sweep links in emails 404'd
 * and the only path to the €1,997 tier was a cold Stripe Checkout link.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "signal@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const TO_EMAIL = "signal@gitdealflow.com";

function clip(v: unknown, max: number): string {
  return typeof v === "string" ? v.slice(0, max).trim() : "";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function briefEmailHtml(fields: {
  contact_name: string;
  email: string;
  fund_or_role: string;
  sector: string;
  thesis: string;
  three_orgs: string;
  decision_window: string;
  why_sweep: string;
  ip: string;
  ua: string;
}): string {
  const f = Object.fromEntries(
    Object.entries(fields).map(([k, v]) => [k, escapeHtml(v)]),
  );
  const blank = "<em style='color:#94a3b8;'>blank</em>";
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b;background:#f8fafc;margin:0;padding:0;">
<div style="max-width:640px;margin:0 auto;padding:24px;">
<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px 20px;margin-bottom:24px;">
<strong style="color:#78350f;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Sector Sweep Brief</strong>
<p style="margin:4px 0 0;font-size:14px;color:#92400e;">€1,997 one-time &middot; 8/quarter cap &middot; 24-hour written reply promised &middot; 14-day delivery</p>
</div>
<table style="width:100%;border-collapse:collapse;font-size:14px;">
<tr><td style="padding:8px 0;font-weight:600;width:180px;color:#475569;">Contact</td><td style="padding:8px 0;">${f.contact_name} &lt;<a href="mailto:${f.email}" style="color:#0ea5e9;">${f.email}</a>&gt;</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">Fund / role</td><td style="padding:8px 0;">${f.fund_or_role || blank}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">Decision window</td><td style="padding:8px 0;">${f.decision_window || blank}</td></tr>
</table>
<div style="background:#f1f5ff;border-left:4px solid #6366f1;padding:14px 18px;margin:20px 0 8px;">
<strong style="color:#3730a3;font-size:12px;letter-spacing:1px;text-transform:uppercase;">The 5-question brief</strong>
</div>
<table style="width:100%;border-collapse:collapse;font-size:14px;">
<tr><td style="padding:8px 0;font-weight:600;width:180px;color:#475569;vertical-align:top;">1. Sector</td><td style="padding:8px 0;white-space:pre-wrap;">${f.sector}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;vertical-align:top;">2. Thesis</td><td style="padding:8px 0;white-space:pre-wrap;">${f.thesis}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;vertical-align:top;">3. Three orgs already tracked</td><td style="padding:8px 0;white-space:pre-wrap;">${f.three_orgs || blank}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;vertical-align:top;">4. Decision window</td><td style="padding:8px 0;">${f.decision_window || blank}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;vertical-align:top;">5. Why a Sweep (vs Dashboard)</td><td style="padding:8px 0;white-space:pre-wrap;">${f.why_sweep}</td></tr>
</table>
<div style="background:#ecfdf5;border-left:4px solid #10b981;padding:14px 18px;margin:20px 0;">
<strong style="color:#065f46;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Reply checklist (24-hour SLA)</strong>
<ol style="margin:8px 0 0;padding-left:18px;font-size:13px;color:#064e3b;line-height:1.6;">
<li>1-page fit assessment — is the Sweep right for what they described?</li>
<li>Tailored table of contents (10–14 sections, sector-specific)</li>
<li>Personal Stripe buy link (use existing €1,997 link or a dedicated one)</li>
<li>Honest "don't buy this" note if Q5 says they actually need the Dashboard</li>
</ol>
</div>
<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
<p style="color:#94a3b8;font-size:12px;line-height:1.5;">Submitted from ${f.ip} (${f.ua})<br>Form: https://signals.gitdealflow.com/sector-sweep#brief</p>
<p style="color:#94a3b8;font-size:12px;">Reply directly to <a href="mailto:${f.email}" style="color:#0ea5e9;">${f.email}</a> &mdash; that's the prospect's verified email.</p>
</div>
</body>
</html>`;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin") || "";
  const allowed = [
    "https://gitdealflow.com",
    "https://www.gitdealflow.com",
    "https://signals.gitdealflow.com",
    ...(process.env.NODE_ENV !== "production" ? ["http://localhost:8080"] : []),
  ];

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (allowed.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
  }

  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403, headers });
  }

  const ip = getClientIp(request);
  // Tighter rate limit than /subscribe — Sweep is €1,997, should not see
  // >2 attempts/hr from one IP. Mirrors /api/sharp-application limits.
  const rl = checkRateLimit(`sector-sweep-brief:${ip}`, 2, 3600_000);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error:
          "Too many briefs. Please email signal@gitdealflow.com directly with the same answers.",
      },
      { status: 429, headers: { ...headers, ...rateLimitHeaders(rl) } },
    );
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    let raw: Record<string, unknown>;
    if (contentType.includes("application/json")) {
      raw = await request.json();
    } else {
      const fd = await request.formData();
      raw = Object.fromEntries(fd.entries());
    }

    const contact_name = clip(raw.contact_name, 120);
    const email = clip(raw.email, 200).toLowerCase();
    const fund_or_role = clip(raw.fund_or_role, 200);
    const sector = clip(raw.sector, 600);
    const thesis = clip(raw.thesis, 1500);
    const three_orgs = clip(raw.three_orgs, 500);
    const decision_window = clip(raw.decision_window, 100);
    const why_sweep = clip(raw.why_sweep, 1000);

    if (!contact_name || !email || !sector || !thesis || !why_sweep) {
      return NextResponse.json(
        {
          error:
            "contact_name, email, sector, thesis, and why_sweep are required",
        },
        { status: 400, headers },
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400, headers },
      );
    }

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500, headers },
      );
    }

    const ua = clip(request.headers.get("user-agent") || "", 200);

    const html = briefEmailHtml({
      contact_name,
      email,
      fund_or_role,
      sector,
      thesis,
      three_orgs,
      decision_window,
      why_sweep,
      ip,
      ua,
    });

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: TO_EMAIL,
        reply_to: email,
        subject: `[Sector Sweep Brief] ${contact_name} — ${sector.slice(0, 60)}`,
        html,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Failed to send Sector Sweep brief email:", errText);
      return NextResponse.json(
        {
          error:
            "Failed to deliver brief — please email signal@gitdealflow.com directly with the same answers",
        },
        { status: 500, headers },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message:
          "Brief received. Reply within 24 business hours to the email you provided.",
      },
      { status: 200, headers: { ...headers, ...rateLimitHeaders(rl) } },
    );
  } catch (err) {
    console.error("Sector Sweep brief handler error:", err);
    return NextResponse.json(
      {
        error:
          "Server error — please email signal@gitdealflow.com directly with the same answers",
      },
      { status: 500, headers },
    );
  }
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin") || "";
  const allowed = [
    "https://gitdealflow.com",
    "https://www.gitdealflow.com",
    "https://signals.gitdealflow.com",
  ];
  const headers: Record<string, string> = {};
  if (allowed.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Access-Control-Max-Age"] = "86400";
  }
  return new NextResponse(null, { status: 204, headers });
}
