import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { isValidEmail, isAllowedOrigin } from "@/lib/validation";
import { listUnsubscribeHeaders, injectUnsubscribeLink } from "@/lib/list-unsubscribe";

/**
 * /api/crystal-ball/submit — receives Crystal Ball game submissions.
 *
 * Pattern mirrors /api/sharp-application: validate, rate-limit per IP,
 * email signals@gitdealflow.com via Resend for human moderation. No DB
 * write — picks land in inbox, are reviewed within 24h, and seeded into
 * lib/crystal-ball-picks.json (or similar) by the maintainer if accepted.
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

function modEmailHtml(fields: {
  handle: string;
  email: string;
  org: string;
  thesis: string;
  ip: string;
  ua: string;
  submittedAt: string;
  graderDueAt: string;
}): string {
  const f = Object.fromEntries(
    Object.entries(fields).map(([k, v]) => [k, escapeHtml(v)]),
  );
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b;background:#f8fafc;margin:0;padding:0;">
<div style="max-width:640px;margin:0 auto;padding:24px;">
<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px 20px;margin-bottom:24px;">
<strong style="color:#854d0e;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Crystal Ball — Pick Submitted</strong>
<p style="margin:4px 0 0;font-size:14px;color:#713f12;">90-day grading window opens on accept · review within 24h</p>
</div>
<table style="width:100%;border-collapse:collapse;font-size:14px;">
<tr><td style="padding:8px 0;font-weight:600;width:160px;color:#475569;">Forecaster handle</td><td style="padding:8px 0;font-family:monospace;">${f.handle}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">Email (private)</td><td style="padding:8px 0;"><a href="mailto:${f.email}" style="color:#0ea5e9;">${f.email}</a></td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">GitHub org / repo</td><td style="padding:8px 0;font-family:monospace;"><a href="https://github.com/${f.org}" style="color:#0ea5e9;">github.com/${f.org}</a></td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;vertical-align:top;">Thesis</td><td style="padding:8px 0;white-space:pre-wrap;">${f.thesis}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">Submitted</td><td style="padding:8px 0;font-family:monospace;">${f.submittedAt}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">Grade due</td><td style="padding:8px 0;font-family:monospace;">${f.graderDueAt} (90 days)</td></tr>
</table>
<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
<p style="color:#94a3b8;font-size:12px;line-height:1.5;">Submitted from ${f.ip} (${f.ua})<br>Form: https://signals.gitdealflow.com/crystal-ball</p>
<p style="color:#94a3b8;font-size:12px;">Accept: append to lib/crystal-ball-picks.json with status:"pending". Reject: ignore.</p>
</div>
</body>
</html>`;
}

function confirmEmailHtml(handle: string, org: string, graderDueAt: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#f59e0b;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL — CRYSTAL BALL</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
<p>Pick received, ${escapeHtml(handle)}.</p>
<p>You picked <strong style="font-family:monospace;">github.com/${escapeHtml(org)}</strong>. Your 90-day grading window closes <strong>${escapeHtml(graderDueAt)}</strong>.</p>
<p>We review picks within 24 hours to keep the leaderboard clean. Once accepted, your pick gets a permalinked record at <a href="https://signals.gitdealflow.com/crystal-ball" style="color:#0ea5e9;">signals.gitdealflow.com/crystal-ball</a>.</p>
<p>If the org publicly announces a funding round (any size, Seed through Mega), an acquisition, or an IPO inside the 90-day window, the pick is graded as a hit. Public-product launches do not count by default.</p>
<p>Five hits earn the Founding Forecaster badge — permanent, public, and unlocks a 50% discount on a Sector Sweep.</p>
<p>Want a head-start on next week's signal? <a href="https://gitdealflow.com/#signup" style="color:#0ea5e9;">Free Sunday digest</a>.</p>
<p>— The Data Nerd</p>
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p>You're receiving this because you submitted to the Crystal Ball game at signals.gitdealflow.com/crystal-ball.</p>
<p><a href="mailto:signals@gitdealflow.com" style="color:#0ea5e9;">Reply to withdraw</a></p>
</div>
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
  // 1 pick per IP per week — same as the published game rules.
  const rl = checkRateLimit(`crystal-ball:${ip}`, 1, 7 * 24 * 3600_000);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error:
          "One pick per email per week. Come back next Monday — or email signals@gitdealflow.com if your previous pick was rejected.",
      },
      { status: 429, headers: { ...headers, ...rateLimitHeaders(rl) } },
    );
  }

  try {
    const raw = (await request.json()) as Record<string, unknown>;

    const handle = clip(raw.handle, 32);
    const email = clip(raw.email, 200).toLowerCase();
    const org = clip(raw.org, 80);
    const thesis = clip(raw.thesis, 300);

    if (!handle || !email || !org || !thesis) {
      return NextResponse.json(
        { error: "handle, email, org, and thesis are all required" },
        { status: 400, headers },
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400, headers },
      );
    }
    if (!/^[a-zA-Z0-9_@\-]{1,32}$/.test(handle)) {
      return NextResponse.json(
        {
          error:
            "Handle must be 1–32 characters, alphanumerics/underscore/dash/@ only.",
        },
        { status: 400, headers },
      );
    }
    if (!/^[a-zA-Z0-9._-]+(?:\/[a-zA-Z0-9._-]+)?$/.test(org)) {
      return NextResponse.json(
        { error: "Org should be a GitHub handle like 'supabase' or 'supabase/supabase'." },
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

    const submittedAt = new Date().toISOString();
    const graderDueAt = new Date(Date.now() + 90 * 24 * 3600_000)
      .toISOString()
      .slice(0, 10);
    const ua = clip(request.headers.get("user-agent") || "", 200);

    const modHtml = modEmailHtml({
      handle,
      email,
      org,
      thesis,
      ip,
      ua,
      submittedAt,
      graderDueAt,
    });
    const userHtml = confirmEmailHtml(handle, org, graderDueAt);

    // Fire moderation email + user confirmation in parallel.
    const [modRes, userRes] = await Promise.all([
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: TO_EMAIL,
          reply_to: email,
          subject: `[Crystal Ball] ${handle} — github.com/${org}`,
          html: modHtml,
        }),
      }),
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: email,
          subject: `Pick received — github.com/${org} (90-day window)`,
          html: injectUnsubscribeLink(userHtml, email),
          headers: listUnsubscribeHeaders(email),
        }),
      }),
    ]);

    if (!modRes.ok) {
      const errText = await modRes.text();
      console.error("Crystal Ball moderation email failed:", errText);
      return NextResponse.json(
        { error: "Failed to deliver pick — please email signals@gitdealflow.com directly" },
        { status: 500, headers },
      );
    }
    if (!userRes.ok) {
      console.warn("Crystal Ball user confirm email failed (mod ok)");
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Pick received. Confirmation in your inbox in ~30 seconds.",
        graderDueAt,
      },
      { headers },
    );
  } catch (err) {
    console.error("Crystal Ball submit error:", err);
    return NextResponse.json(
      { error: "Something went wrong — please email signals@gitdealflow.com directly" },
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
