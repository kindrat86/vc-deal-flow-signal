import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { isValidEmail, isAllowedOrigin } from "@/lib/validation";
import { signVerifyToken } from "@/lib/verify-token";
import { fireRedditLead } from "@/lib/reddit-conversions-api";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "signal@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";

const VERIFY_BASE_URL =
  process.env.VERIFY_BASE_URL || "https://signals.gitdealflow.com";

function verificationEmailHtml(
  verifyUrl: string,
  cohort: "soap-opera" | "challenge" | "launch",
): string {
  const headline =
    cohort === "challenge"
      ? "Confirm your email — your 7-Day Reset starts immediately"
      : cohort === "launch"
        ? "Confirm your email — launch sequence starts in 30 minutes"
        : "Your report is ready.";
  const body =
    cohort === "challenge"
      ? `<p>Click below to confirm your email and start the 7-Day Deal Flow Reset Challenge.</p>
<p>Day 1 lands within 15 minutes of confirmation. One signal per day, one 5-minute exercise per day. By Day 7 you'll have a personal sourcing framework built from the SSRN-published methodology.</p>`
      : cohort === "launch"
        ? `<p>Click below to confirm your email and start the Agent Credits launch sequence.</p>
<p>Five emails over ten days: Stage 1 the problem, Stage 2 why current fixes fail, Stage 3 what I shipped, Stage 4 cart open, Stage 5 last call. Cart closes May 20 at 23:59 UTC.</p>`
        : `<p>Click the button below to confirm your email and get instant access to <strong>This Week's Top 5 Breakout Startups</strong> — with real GitHub acceleration data on the fastest-moving companies right now.</p>`;
  const cta =
    cohort === "challenge"
      ? "Start the Challenge"
      : cohort === "launch"
        ? "Start the Launch Sequence"
        : "Get the Report";
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#0ea5e9;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
<p>${headline}</p>
${body}
<div style="text-align:center;margin:32px 0;">
<a href="${verifyUrl}" style="display:inline-block;background:#0284c7;color:#ffffff;font-weight:600;font-size:16px;padding:14px 32px;border-radius:8px;text-decoration:none;">${cta}</a>
</div>
<p style="color:#64748b;font-size:14px;">After you confirm, you'll also start receiving weekly signal updates — the top startups showing unusual engineering acceleration. No spam, unsubscribe anytime.</p>
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p>You're receiving this because you entered your email at <a href="https://gitdealflow.com" style="color:#0ea5e9;">gitdealflow.com</a></p>
<p>If you didn't sign up, you can safely ignore this email.</p>
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
  const rl = checkRateLimit(`subscribe:${ip}`, 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { ...headers, ...rateLimitHeaders(rl) } },
    );
  }

  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
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

    const clip = (v: unknown, max: number): string =>
      typeof v === "string" ? v.slice(0, max) : "";
    const attribution = {
      source: clip(body.source, 100),
      utm_source: clip(body.utm_source, 100),
      utm_medium: clip(body.utm_medium, 100),
      utm_campaign: clip(body.utm_campaign, 200),
      referrer: clip(body.referrer, 500),
      landing_path: clip(body.landing_path, 500),
    };

    // Phase 3 (Qualify Subs) — quiz_route is the avatar tier the visitor
    // self-selected before email capture. Whitelisted to F/T/D/I; anything
    // else degrades to "" so an unqualified email never silently gets a
    // wrong-tier label downstream.
    const rawRoute = clip(body.quiz_route, 4);
    const quiz_route = ["F", "T", "D", "I"].includes(rawRoute) ? rawRoute : "";
    const quiz_route_label = quiz_route ? clip(body.quiz_route_label, 120) : "";

    // Cohort dispatches the post-verify drip sequence. Default = "soap-opera"
    // (the existing 8-email Russell-style funnel). "challenge" routes to the
    // 7-Day Deal Flow Reset sequence. "launch" routes to the 5-email Brunson
    // Product Launch Funnel for an active launch window. Whitelist enforced.
    const rawCohort = clip(body.cohort, 32);
    const cohort: "soap-opera" | "challenge" | "launch" =
      rawCohort === "challenge"
        ? "challenge"
        : rawCohort === "launch"
          ? "launch"
          : "soap-opera";

    // Build verification URL — attribution piggybacks as query params so
    // /api/verify can persist it to PocketBase regardless of which device
    // the user clicks the verify link from. Cohort piggybacks too.
    // v2 token: payload-bound (email + purpose + 30d expiry + nonce). Replaces
    // the deterministic email-only HMAC. 30 days because confirmation emails
    // can sit unread in inboxes for weeks.
    const { token } = signVerifyToken({
      email,
      purpose: "verify-subscribe",
      ttlSeconds: 30 * 86_400,
    });
    const params = new URLSearchParams({ email, token, cohort });
    for (const [k, v] of Object.entries(attribution)) {
      if (v) params.set(k, v);
    }
    if (quiz_route) params.set("quiz_route", quiz_route);
    if (quiz_route_label) params.set("quiz_route_label", quiz_route_label);
    const verifyUrl = `${VERIFY_BASE_URL}/api/verify?${params.toString()}`;

    // Send verification email
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: email,
        subject:
          cohort === "challenge"
            ? "Confirm your email — your 7-Day Reset starts now"
            : cohort === "launch"
              ? "Confirm your email — Agent Credits launch starts now"
              : "Confirm your email — your report is ready",
        html: verificationEmailHtml(verifyUrl, cohort),
        headers: {
          "List-Unsubscribe": `<mailto:${FROM_EMAIL}?subject=unsubscribe>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Failed to send verification email:", errText);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500, headers },
      );
    }

    // Reddit Conversions API — fire `Lead` server-side for paid Reddit
    // traffic only (gated inside fireRedditLead on utm_source==="reddit").
    // Best-effort: a Reddit-side outage must never starve the buyer of
    // their verification email. The helper has its own 2.5s timeout +
    // catch — but we still wrap in a final guard for safety.
    try {
      await fireRedditLead({
        email,
        utmSource: attribution.utm_source,
        utmCampaign: attribution.utm_campaign,
        userAgent: request.headers.get("user-agent") || undefined,
        ipAddress: ip || undefined,
      });
    } catch (capiErr) {
      console.error("[reddit-capi] Lead dispatch error:", capiErr);
    }

    return NextResponse.json(
      { ok: true, verify: true, message: "Check your email" },
      { headers },
    );
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500, headers },
    );
  }
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin") || "";
  const allowed = [
    "https://gitdealflow.com",
    "https://www.gitdealflow.com",
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
