import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { isValidEmail, isAllowedOrigin } from "@/lib/validation";

/**
 * /api/charter-application — Charter Cohort 2026 intake.
 *
 * Brunson Expert Secrets §1 Ch 4 (Mass Movement Vehicle) + DotCom Secrets §23
 * (Application Funnel). The Charter Cohort gates 25 founding-member seats
 * behind a 5-field written application. Same async-only pattern as
 * /api/sharp-application — no DB write, the email IS the record.
 *
 * The founder receives the application via Resend at signals@gitdealflow.com
 * and replies within 48 business hours with a draft profile to confirm.
 *
 * Anonymity rule: pseudonymous handles welcome, real name never required.
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
  handle: string;
  email: string;
  archetype: string;
  thesis: string;
  check_size: string;
  sectors: string;
  why_charter: string;
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
<strong style="color:#854d0e;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Charter Cohort Application</strong>
<p style="margin:4px 0 0;font-size:14px;color:#713f12;">25-seat founding cohort &middot; 48-hour response promised</p>
</div>
<table style="width:100%;border-collapse:collapse;font-size:14px;">
<tr><td style="padding:8px 0;font-weight:600;width:180px;color:#475569;">Handle</td><td style="padding:8px 0;font-family:Menlo,monospace;">${f.handle}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">Email</td><td style="padding:8px 0;"><a href="mailto:${f.email}" style="color:#0ea5e9;">${f.email}</a></td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">Archetype</td><td style="padding:8px 0;">${f.archetype}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">Check size</td><td style="padding:8px 0;">${f.check_size}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;vertical-align:top;">Sectors</td><td style="padding:8px 0;white-space:pre-wrap;">${f.sectors}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;vertical-align:top;">Public thesis</td><td style="padding:8px 0;white-space:pre-wrap;">${f.thesis}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;vertical-align:top;">Why charter, why now</td><td style="padding:8px 0;white-space:pre-wrap;">${f.why_charter || blank}</td></tr>
</table>
<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
<p style="color:#94a3b8;font-size:12px;line-height:1.5;">Submitted from ${f.ip} (${f.ua})<br>Form: https://signals.gitdealflow.com/members/join</p>
<p style="color:#94a3b8;font-size:12px;">Reply directly to <a href="mailto:${f.email}" style="color:#0ea5e9;">${f.email}</a> &mdash; that's the applicant's verified email.</p>
<p style="color:#94a3b8;font-size:12px;">Action: review the thesis, write back inside 48h with either a draft profile to confirm OR a written no with the reason. Then update <code>pseo-site/content/charter-cohort.ts</code> if accepting.</p>
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
    ...(process.env.NODE_ENV !== "production" ? ["http://localhost:8080", "http://localhost:3000"] : []),
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
  // Tighter rate limit — charter applications shouldn't see >3 attempts/hr from one IP.
  const rl = checkRateLimit(`charter-application:${ip}`, 3, 3600_000);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error:
          "Too many applications. Please email signals@gitdealflow.com directly.",
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

    const handle = clip(raw.handle, 40);
    const email = clip(raw.email, 200).toLowerCase();
    const archetype = clip(raw.archetype, 60);
    const thesis = clip(raw.thesis, 1000);
    const check_size = clip(raw.check_size, 60);
    const sectors = clip(raw.sectors, 200);
    const why_charter = clip(raw.why_charter, 800);

    if (!handle || !email || !archetype || !thesis || !check_size || !sectors) {
      return NextResponse.json(
        {
          error:
            "handle, email, archetype, thesis, check_size, and sectors are all required",
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

    const html = applicationEmailHtml({
      handle,
      email,
      archetype,
      thesis,
      check_size,
      sectors,
      why_charter,
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
        subject: `[Charter Cohort] ${handle} — ${archetype}`,
        html,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Failed to send Charter application email:", errText);
      return NextResponse.json(
        {
          error:
            "Failed to deliver application — please email signals@gitdealflow.com directly",
        },
        { status: 500, headers },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message:
          "Application received. The Data Nerd reads every charter application personally and replies within 48 hours.",
      },
      { headers },
    );
  } catch (err) {
    console.error("Charter application error:", err);
    return NextResponse.json(
      {
        error:
          "Something went wrong — please email signals@gitdealflow.com directly",
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
    ...(process.env.NODE_ENV !== "production" ? ["http://localhost:8080", "http://localhost:3000"] : []),
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
