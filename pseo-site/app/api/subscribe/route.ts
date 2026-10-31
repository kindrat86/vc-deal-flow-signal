import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { isValidEmail, isAllowedOrigin } from "@/lib/validation";
import { signVerifyToken } from "@/lib/verify-token";
import { fireRedditLead } from "@/lib/reddit-conversions-api";
import { recordSignup } from "@/lib/recent-signups";
import { listUnsubscribeHeaders, injectUnsubscribeLink } from "@/lib/list-unsubscribe";
import { isInvestorLane } from "@/lib/investor-lanes";
import {
  type SubscribeCohort,
  verificationEmailHtml,
  verificationEmailSubject,
} from "@/lib/confirmation-email";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";

const VERIFY_BASE_URL =
  process.env.VERIFY_BASE_URL || "https://signals.gitdealflow.com";

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

    // Honeypot: landing forms include a visually-hidden "website" field.
    // Bots that fill it get a fake success and no side effects.
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ ok: true }, { headers });
    }

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

    // quiz_route carries ONE OF TWO taxonomies from the landing:
    //   (a) an investor lane (angel/scout/fund/corpdev/builder/other) from
    //       the hero-quiz "tell me your lane" cards, OR
    //   (b) a 4-tier avatar (F/T/D/I) from the pseo quiz, used to fork the
    //       drip pitch sequence.
    // They are separate dimensions. A lane is stored as `lane` and drives
    // first-issue tailoring; an avatar tier stays `quiz_route` and drives
    // the drip fork. Anything else degrades to "" so an unqualified value
    // never silently gets a wrong label downstream.
    const rawRoute = clip(body.quiz_route, 16);
    const lane = isInvestorLane(rawRoute) ? rawRoute : "";
    const quiz_route = lane
      ? ""
      : ["F", "T", "D", "I"].includes(rawRoute)
        ? rawRoute
        : "";
    const quiz_route_label = quiz_route ? clip(body.quiz_route_label, 120) : "";

    // Cohort dispatches the post-verify drip sequence. Default = "soap-opera"
    // (the existing 8-email Russell-style funnel). "challenge" routes to the
    // 7-Day Deal Flow Reset sequence. "launch" routes to the 5-email Brunson
    // Product Launch Funnel for an active launch window. Whitelist enforced.
    const rawCohort = clip(body.cohort, 32);
    const cohort: SubscribeCohort =
      rawCohort === "lead-magnet"
        ? "lead-magnet"
        : rawCohort === "challenge"
        ? "challenge"
        : rawCohort === "launch"
          ? "launch"
          : "soap-opera";

    const tzRaw = clip(body.tz, 64);
    const tz = tzRaw.includes("/") ? tzRaw : "";

    // Build verification URL, attribution piggybacks as query params so
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
    if (lane) params.set("lane", lane);
    if (tz) params.set("tz", tz);
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
        reply_to: FROM_EMAIL,
        bcc: "sales@sipiteno.com",
        to: email,
        subject: verificationEmailSubject(cohort),
        html: verificationEmailHtml(verifyUrl, cohort),
        headers: listUnsubscribeHeaders(email),
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
    // IP, no name. Best-effort, a cache hiccup must never break the subscribe.
    try {
      const city = decodeURIComponent(
        request.headers.get("x-vercel-ip-city") || "",
      ).trim();
      const country = (request.headers.get("x-vercel-ip-country") || "").trim();
      if (city) await recordSignup(city, country);
    } catch (geoErr) {
      console.error("[recent-signups] record failed:", geoErr);
    }

    // Reddit Conversions API, fire `Lead` server-side for paid Reddit
    // traffic only (gated inside fireRedditLead on utm_source==="reddit").
    // Best-effort: a Reddit-side outage must never starve the buyer of
    // their verification email. The helper has its own 2.5s timeout +
    // catch, but we still wrap in a final guard for safety.
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
