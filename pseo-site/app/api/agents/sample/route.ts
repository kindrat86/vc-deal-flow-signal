import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { isValidEmail } from "@/lib/validation";
import { isExcluded } from "@/lib/excluded-emails";
import { isNonceUsed, markNonceUsed } from "@/lib/runtime-cache";
import { pickAudienceId } from "@/lib/resend-audience";

/**
 * /api/agents/sample, free 5-call deep-signal sample request.
 *
 * Drip emails and press releases promise "drop your email at
 * /agents/credits/sample, get an API key with 5 free get_deep_signal calls".
 * This route backs that promise WITHOUT new billing infra:
 *
 *   1. Rate-limits + honeypots like /api/subscribe.
 *   2. Adds the requester to the Resend audience with
 *      source:"agent-credits-sample" attribution (gdf-attr-v1 bridge).
 *   3. Notifies the admin (reply_to requester) to issue the 5-call key -
 *      key issuance is MANUAL for now; the page promises delivery within
 *      24h, which the admin fulfils by replying with a key.
 *   4. Per-email nonce (30d) so repeat submissions don't re-spam the admin.
 *
 * Accepts form-encoded POSTs from the /agents/credits/sample page (303
 * redirect back with ?status=…) and JSON POSTs from programmatic agents
 * (JSON response).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const ADMIN_EMAIL = "signals@gitdealflow.com";
const SITE_URL = process.env.SITE_URL || "https://signals.gitdealflow.com";
const PAGE_PATH = "/agents/credits/sample";

const SAMPLE_NONCE_NAMESPACE = "agent-sample";
const SAMPLE_NONCE_TTL_SECONDS = 30 * 86_400;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function addToAudience(email: string) {
  if (!RESEND_API_KEY) return;
  try {
    const audRes = await fetch("https://api.resend.com/audiences", {
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    });
    if (!audRes.ok) return;
    const audiences = await audRes.json();
    const audienceId: string | undefined = pickAudienceId(audiences);
    if (!audienceId) return;
    const res = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          first_name:
            "gdf-attr-v1:" + JSON.stringify({ source: "agent-credits-sample" }),
          unsubscribed: false,
        }),
      },
    );
    if (!res.ok) {
      // Already a contact, re-activate so they receive the key email.
      await fetch(
        `https://api.resend.com/audiences/${audienceId}/contacts/${encodeURIComponent(email)}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ unsubscribed: false }),
        },
      );
    }
  } catch (err) {
    console.error("[agents/sample] audience-add failed:", err);
  }
}

async function notifyAdmin(email: string, useCase: string, ip: string) {
  if (!RESEND_API_KEY) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        bcc: "sales@sipiteno.com",
        to: ADMIN_EMAIL,
        reply_to: email,
        subject: `[agent sample] 5-call key request, ${email}`,
        html: `<p><strong>New free 5-call sample request</strong></p>
<p>Email: <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
<p>Use case: ${useCase ? escapeHtml(useCase) : "<em>blank</em>"}</p>
<p>IP: ${escapeHtml(ip)}</p>
<p>Time: ${new Date().toISOString()}</p>
<p><strong>Action (manual, 24h promise on the page):</strong> mint a key for a
Stripe customer with 5 credits (same flow as a credit-pack buyer, pack size 5)
and reply to this email with the key. Key issuance is not automated yet.</p>`,
      }),
    });
  } catch (err) {
    console.error("[agents/sample] admin notify failed:", err);
  }
}

function respond(
  isForm: boolean,
  status: "sent" | "invalid" | "error",
  jsonBody: Record<string, unknown>,
  httpStatus: number,
  headers: Record<string, string> = {},
) {
  if (isForm) {
    // Post/Redirect/Get so a refresh doesn't re-submit.
    return NextResponse.redirect(`${SITE_URL}${PAGE_PATH}?status=${status}`, 303);
  }
  return NextResponse.json(jsonBody, { status: httpStatus, headers });
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const contentType = req.headers.get("content-type") || "";
  const isForm = !contentType.includes("application/json");

  const rl = checkRateLimit(`agent-sample:${ip}`, 5, 60_000);
  if (!rl.allowed) {
    return respond(
      isForm,
      "error",
      { ok: false, error: "Too many requests. Try again in a minute." },
      429,
      rateLimitHeaders(rl),
    );
  }

  let email = "";
  let useCase = "";
  let honeypot = "";
  if (isForm) {
    try {
      const form = await req.formData();
      email = String(form.get("email") || "").trim().toLowerCase();
      useCase = String(form.get("use_case") || "").slice(0, 500).trim();
      honeypot = String(form.get("website") || "").trim();
    } catch {
      // fall through to validation failure
    }
  } else {
    try {
      const body = await req.json();
      email = String(body.email || "").trim().toLowerCase();
      useCase = String(body.use_case || "").slice(0, 500).trim();
      honeypot = String(body.website || "").trim();
    } catch {
      return NextResponse.json(
        { ok: false, error: "invalid_json" },
        { status: 400 },
      );
    }
  }

  // Honeypot: the hidden "website" field is invisible to humans. Bots that
  // fill it get a success response with zero side effects.
  if (honeypot) {
    return respond(isForm, "sent", { ok: true, message: "Request received." }, 200);
  }

  if (!email || !isValidEmail(email)) {
    return respond(
      isForm,
      "invalid",
      { ok: false, error: "invalid_email" },
      400,
    );
  }

  // Tester/bot suppression, visually succeed, no side effects.
  if (isExcluded(email)) {
    console.log(`[agents/sample] suppressed excluded address: ${email}`);
    return respond(isForm, "sent", { ok: true, message: "Request received." }, 200);
  }

  if (!RESEND_API_KEY) {
    console.error("[agents/sample] RESEND_API_KEY not configured");
    return respond(
      isForm,
      "error",
      { ok: false, error: "Email service not configured" },
      500,
    );
  }

  // Per-email nonce: a repeat request inside 30 days acks success but does
  // not re-notify the admin. Mark before side effects to close the
  // double-submit race.
  if (await isNonceUsed(SAMPLE_NONCE_NAMESPACE, email)) {
    return respond(
      isForm,
      "sent",
      {
        ok: true,
        replay: true,
        message:
          "Already requested, your key is being issued. It arrives by email within 24 hours of your first request.",
      },
      200,
    );
  }
  await markNonceUsed(SAMPLE_NONCE_NAMESPACE, email, SAMPLE_NONCE_TTL_SECONDS);

  await addToAudience(email);
  await notifyAdmin(email, useCase, ip);

  return respond(
    isForm,
    "sent",
    {
      ok: true,
      message:
        "Request received. Your API key (5 free deep-signal calls) arrives by email within 24 hours.",
    },
    200,
  );
}

export async function GET() {
  return NextResponse.json({
    endpoint: "POST /api/agents/sample",
    accepts: ["application/x-www-form-urlencoded", "application/json"],
    fields: {
      email: "string (required, valid email)",
      use_case: "string (optional, ≤500 chars)",
    },
    behavior:
      "Requests a free 5-call deep-signal API key. The key is issued by a human and arrives by email within 24 hours. De-duped per email for 30 days.",
    page: `${SITE_URL}${PAGE_PATH}`,
  });
}
