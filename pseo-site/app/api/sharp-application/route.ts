import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { isValidEmail, isAllowedOrigin } from "@/lib/validation";

/**
 * /api/sharp-application, Russell audit fix 2026-05-05 (DotCom Secrets §23).
 *
 * Receives the Sharp Tier (€497/mo, capped 8 funds/yr) application from
 * landing/apply/index.html, validates, and emails it to signals@gitdealflow.com
 * via Resend so the founder can review + reply within 48h.
 *
 * Anonymity-preserving: no live call mandate, no DB write, the email is the
 * record. PocketBase doesn't have a sharp_applications collection in prod
 * (per memory: prod PB only has users/scouts/predictions/subscribers), and
 * adding one isn't required at <8 apps/yr volume.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const TO_EMAIL = "signals@gitdealflow.com";

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

function applicationEmailHtml(fields: {
  fund_name: string;
  contact_name: string;
  email: string;
  aum: string;
  thesis: string;
  how_heard: string;
  quarterly_question: string;
  dream_state: string;
  current_state: string;
  gap: string;
  money_value: string;
  urgency: string;
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
<div style="background:#fef9c3;border-left:4px solid #facc15;padding:16px 20px;margin-bottom:24px;">
<strong style="color:#854d0e;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Sharp Tier Application</strong>
<p style="margin:4px 0 0;font-size:14px;color:#713f12;">€497/mo &middot; 8-fund cap &middot; 48-hour response promised</p>
</div>
<table style="width:100%;border-collapse:collapse;font-size:14px;">
<tr><td style="padding:8px 0;font-weight:600;width:180px;color:#475569;">Fund / syndicate</td><td style="padding:8px 0;">${f.fund_name}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">Contact</td><td style="padding:8px 0;">${f.contact_name} &lt;<a href="mailto:${f.email}" style="color:#0ea5e9;">${f.email}</a>&gt;</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">AUM / deals/yr</td><td style="padding:8px 0;">${f.aum || blank}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;vertical-align:top;">Thesis focus</td><td style="padding:8px 0;white-space:pre-wrap;">${f.thesis}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">How heard</td><td style="padding:8px 0;">${f.how_heard || blank}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;vertical-align:top;">Quarterly review focus</td><td style="padding:8px 0;white-space:pre-wrap;">${f.quarterly_question || blank}</td></tr>
</table>
<div style="background:#f1f5ff;border-left:4px solid #6366f1;padding:14px 18px;margin:20px 0 8px;">
<strong style="color:#3730a3;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Diligence, 5 Questions</strong>
</div>
<table style="width:100%;border-collapse:collapse;font-size:14px;">
<tr><td style="padding:8px 0;font-weight:600;width:180px;color:#475569;vertical-align:top;">1. Dream state (12-mo)</td><td style="padding:8px 0;white-space:pre-wrap;">${f.dream_state || blank}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;vertical-align:top;">2. Current state</td><td style="padding:8px 0;white-space:pre-wrap;">${f.current_state || blank}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;vertical-align:top;">3. The gap</td><td style="padding:8px 0;white-space:pre-wrap;">${f.gap || blank}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;vertical-align:top;">4. Money, gap value</td><td style="padding:8px 0;white-space:pre-wrap;">${f.money_value || blank}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;vertical-align:top;">5. Urgency, why now</td><td style="padding:8px 0;white-space:pre-wrap;">${f.urgency || blank}</td></tr>
</table>
<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
<p style="color:#94a3b8;font-size:12px;line-height:1.5;">Submitted from ${f.ip} (${f.ua})<br>Form: https://gitdealflow.com/apply</p>
<p style="color:#94a3b8;font-size:12px;">Reply directly to <a href="mailto:${f.email}" style="color:#0ea5e9;">${f.email}</a>: that's the applicant's verified email.</p>
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
  // Tighter rate limit than /subscribe, Sharp Tier should not see >2 attempts/hr from one IP.
  const rl = checkRateLimit(`sharp-application:${ip}`, 2, 3600_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many applications. Please email signals@gitdealflow.com directly." },
      { status: 429, headers: { ...headers, ...rateLimitHeaders(rl) } },
    );
  }

  try {
    // Accept both JSON and FormData (the apex form posts FormData by default).
    const contentType = request.headers.get("content-type") || "";
    let raw: Record<string, unknown>;
    if (contentType.includes("application/json")) {
      raw = await request.json();
    } else {
      const fd = await request.formData();
      raw = Object.fromEntries(fd.entries());
    }

    const fund_name = clip(raw.fund_name, 200);
    const contact_name = clip(raw.contact_name, 100);
    const email = clip(raw.email, 200).toLowerCase();
    const aum = clip(raw.aum, 200);
    const thesis = clip(raw.thesis, 1000);
    const how_heard = clip(raw.how_heard, 50);
    const quarterly_question = clip(raw.quarterly_question, 1500);
    // Brunson high-ticket five-question diligence (DotCom Secrets Ch 22).
    const dream_state = clip(raw.dream_state, 800);
    const current_state = clip(raw.current_state, 800);
    const gap = clip(raw.gap, 800);
    const money_value = clip(raw.money_value, 800);
    const urgency = clip(raw.urgency, 800);

    if (!fund_name || !contact_name || !email || !thesis) {
      return NextResponse.json(
        { error: "fund_name, contact_name, email, and thesis are required" },
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

    const html = applicationEmailHtml({
      fund_name,
      contact_name,
      email,
      aum,
      thesis,
      how_heard,
      quarterly_question,
      dream_state,
      current_state,
      gap,
      money_value,
      urgency,
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
        bcc: "sales@sipiteno.com",
        to: TO_EMAIL,
        reply_to: email,
        subject: `[Sharp Tier Application] ${fund_name}, ${contact_name}`,
        html,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Failed to send Sharp application email:", errText);
      return NextResponse.json(
        { error: "Failed to deliver application, please email signals@gitdealflow.com directly" },
        { status: 500, headers },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message:
          "Application received. The Data Nerd reads every one personally and replies within 48 hours.",
      },
      { headers },
    );
  } catch (err) {
    console.error("Sharp application error:", err);
    return NextResponse.json(
      { error: "Something went wrong, please email signals@gitdealflow.com directly" },
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
    ...(process.env.NODE_ENV !== "production" ? ["http://localhost:8080"] : []),
  ];

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : "",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
