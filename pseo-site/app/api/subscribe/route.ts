import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { isValidEmail, isAllowedOrigin } from "@/lib/validation";
import { signVerifyToken } from "@/lib/verify-token";
import { fireRedditLead } from "@/lib/reddit-conversions-api";
import { recordSignup } from "@/lib/recent-signups";

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
        : "There's a deal in here I missed by one night's sleep.";
  const body =
    cohort === "challenge"
      ? `<p>Click below to confirm your email and start the 7-Day Deal Flow Reset Challenge.</p>
<p>Day 1 lands within 15 minutes of confirmation. One signal per day, one 5-minute exercise per day. By Day 7 you'll have a personal sourcing framework built from the SSRN-published methodology.</p>`
      : cohort === "launch"
        ? `<p>Click below to confirm your email and start the Agent Credits launch sequence.</p>
<p>Five emails over ten days: Stage 1 the problem, Stage 2 why current fixes fail, Stage 3 what I shipped, Stage 4 cart open, Stage 5 last call. Cart closes May 20 at 23:59 UTC.</p>`
        : `<p>A few years ago I was watching a quiet fintech startup. No press, no warm intros circulating — but their public GitHub lit up in two weeks. Four new contributors. Three new repos. I flagged it, then closed my laptop and went to bed.</p>
<p>Three weeks later they raised a $4M Series A. The investors who got in had seen exactly what I'd seen. They just didn't talk themselves out of it.</p>
<p>That's the night that made me build this. Confirm your email below and the first thing you'll read is the whole story — plus <strong>This Week's Top 5 Breakout Startups</strong>, the names showing the same engineering acceleration right now, 21 to 47 days before the deck circulates.</p>`;
  const cta =
    cohort === "challenge"
      ? "Start the Challenge"
      : cohort === "launch"
        ? "Start the Launch Sequence"
        : "Get the Report";
  // Inbox preview line (hidden preheader). Mobile clients show ~90 chars.
  const preheader =
    cohort === "challenge"
      ? "Confirm to start your 7-Day Deal Flow Reset — Day 1 lands in 15 minutes."
      : cohort === "launch"
        ? "Confirm to start the Agent Credits launch sequence — first email in 30 minutes."
        : "Confirm to unlock This Week's Top 5 Breakout Startups — plus the deal I missed.";
  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>VC Deal Flow Signal</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
  body { margin:0 !important; padding:0 !important; width:100% !important; }
  * { -ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; }
  table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; border-collapse:collapse; }
  img { -ms-interpolation-mode:bicubic; border:0; height:auto; line-height:100%; outline:none; text-decoration:none; }
  a { color:#0284c7; }
  @media only screen and (max-width:600px) {
    .container { width:100% !important; }
    .px { padding-left:22px !important; padding-right:22px !important; }
    .h1 { font-size:25px !important; line-height:1.25 !important; }
    .btn-a { font-size:18px !important; padding:17px 24px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;width:100%;background:#f1f5f9;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#f1f5f9;opacity:0;">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f5f9;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,0.08);">
<tr><td class="px" style="padding:32px 40px 8px 40px;">
<span style="display:inline-block;color:#0ea5e9;font-size:13px;font-weight:700;letter-spacing:1.5px;">VC DEAL FLOW SIGNAL</span>
</td></tr>
<tr><td class="px" style="padding:8px 40px 0 40px;">
<h1 class="h1" style="margin:0;font-size:28px;line-height:1.25;font-weight:800;color:#0f172a;letter-spacing:-0.4px;">${headline}</h1>
</td></tr>
<tr><td class="px" style="padding:16px 40px 0 40px;font-size:17px;line-height:1.65;color:#334155;">
${body}
</td></tr>
<tr><td class="px" style="padding:28px 40px 8px 40px;">
<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${verifyUrl}" style="height:54px;v-text-anchor:middle;width:520px;" arcsize="20%" stroke="f" fillcolor="#0284c7">
<w:anchorlock/><center style="color:#ffffff;font-family:sans-serif;font-size:18px;font-weight:bold;">${cta} &rarr;</center>
</v:roundrect>
<![endif]-->
<!--[if !mso]><!-->
<a class="btn-a" href="${verifyUrl}" style="display:block;width:100%;box-sizing:border-box;background:#0284c7;color:#ffffff;font-weight:700;font-size:19px;line-height:1.2;padding:18px 28px;border-radius:10px;text-decoration:none;text-align:center;box-shadow:0 4px 14px rgba(2,132,199,0.35);">${cta} &rarr;</a>
<!--<![endif]-->
</td></tr>
<tr><td class="px" style="padding:0 40px 4px 40px;font-size:13px;line-height:1.5;color:#94a3b8;text-align:center;">
Button not working? Paste this into your browser:<br>
<a href="${verifyUrl}" style="color:#0284c7;word-break:break-all;">${verifyUrl}</a>
</td></tr>
<tr><td class="px" style="padding:20px 40px 28px 40px;font-size:14px;line-height:1.6;color:#64748b;">
After you confirm, you'll also start receiving weekly signal updates — the top startups showing unusual engineering acceleration. No spam, unsubscribe anytime.
</td></tr>
<tr><td class="px" style="padding:20px 40px 32px 40px;border-top:1px solid #e2e8f0;font-size:12px;line-height:1.6;color:#94a3b8;">
You're receiving this because you entered your email at <a href="https://gitdealflow.com" style="color:#0ea5e9;">gitdealflow.com</a>.<br>
If you didn't sign up, you can safely ignore this email.
</td></tr>
</table>
</td></tr>
</table>
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
              : "Confirm to unlock your 5 (and the deal I missed)",
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

    // Honest social proof: record the city/country of this real signup so the
    // landing can show "an investor from {city} signed up" toasts. We capture
    // geo here (direct browser request → accurate location; email-link clicks
    // get proxied and would lie). Anonymous: city + country only, no email, no
    // IP, no name. Best-effort — a cache hiccup must never break the subscribe.
    try {
      const city = decodeURIComponent(
        request.headers.get("x-vercel-ip-city") || "",
      ).trim();
      const country = (request.headers.get("x-vercel-ip-country") || "").trim();
      if (city) await recordSignup(city, country);
    } catch (geoErr) {
      console.error("[recent-signups] record failed:", geoErr);
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
