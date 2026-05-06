import { NextResponse } from "next/server";
import { verifyToken, verifyVerifyToken } from "@/lib/verify-token";
import { isValidEmail } from "@/lib/validation";
import { SOAP_OPERA_EMAILS, CHALLENGE_EMAILS, LAUNCH_EMAILS } from "@/lib/emails";
import { isExcluded } from "@/lib/excluded-emails";
import { isNonceUsed, markNonceUsed } from "@/lib/runtime-cache";

// Single-use tracking for v2 verify-subscribe nonces. Once a v2 token's nonce
// is consumed, any replay (link prefetcher, leaked URL replay) becomes a
// no-op redirect with no Resend side effects. Backed by Vercel Runtime Cache
// — survives cold starts and is shared across function instances within a
// region. Every replay we catch saves an audience-add + N-email drip
// schedule. See lib/runtime-cache.ts.
const VERIFY_NONCE_NAMESPACE = "verify-nonce";
const VERIFY_NONCE_TTL_SECONDS = 30 * 86_400; // matches v2 token 30-day TTL

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "signal@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const REPORT_URL = process.env.REPORT_URL || "https://gitdealflow.com/report";
const SITE_URL = process.env.SITE_URL || "https://signals.gitdealflow.com";

interface Attribution {
  source: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  referrer: string;
  landing_path: string;
  quiz_route: string;
  quiz_route_label: string;
}

// Marker we prepend to the JSON-encoded attribution we stash in Resend's
// `first_name` field, so the laptop-side sync can recognize and decode it
// (and so it never accidentally renders to a recipient as a real name).
const ATTR_MARKER = "gdf-attr-v1:";

/**
 * Pack attribution into Resend's `first_name` so the hourly Resend→PocketBase
 * sync can decode it when creating subscriber rows. We can't write to a
 * subscribers collection in prod PB (the dashboard reads from local PB on the
 * laptop), so Resend metadata is the bridge.
 */
function packAttribution(attr: Attribution): string {
  const compact: Record<string, string> = {};
  for (const [k, v] of Object.entries(attr)) {
    if (v) compact[k] = v;
  }
  if (Object.keys(compact).length === 0) return "";
  return ATTR_MARKER + JSON.stringify(compact);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = (url.searchParams.get("email") || "").trim().toLowerCase();
  const token = url.searchParams.get("token") || "";

  // Validate
  if (!email || !isValidEmail(email) || !token) {
    return redirectWithError("Invalid verification link.");
  }

  // Accept v2 (payload-bound, single-use) tokens first. Fall back to the
  // legacy deterministic email-only HMAC for grace-period compatibility with
  // confirmation emails sent before the v2 format was introduced. Legacy
  // tokens carry no nonce, so they cannot be enforced single-use here.
  const v2 = verifyVerifyToken(token, "verify-subscribe");
  let isV2 = false;
  if (v2 && v2.email === email) {
    isV2 = true;
    if (await isNonceUsed(VERIFY_NONCE_NAMESPACE, v2.nonce)) {
      // Replay (link-prefetcher rescan, leaked URL replay) — return success
      // redirect but skip every Resend side effect.
      return NextResponse.redirect(REPORT_URL);
    }
  } else if (!verifyToken(email, token)) {
    return redirectWithError("This verification link is invalid or expired.");
  }

  // Mark v2 nonce consumed BEFORE side effects fire so a concurrent prefetch
  // (e.g. corporate email scanner racing the user's click) cannot trigger the
  // 8-email drip + Resend audience-add twice.
  if (isV2 && v2) {
    await markNonceUsed(VERIFY_NONCE_NAMESPACE, v2.nonce, VERIFY_NONCE_TTL_SECONDS);
  }

  // Tester / bot suppression. Bots (mailinator, deltajohnsons probes, etc.)
  // burn Resend credits and pollute open/click metrics. Return a clean 200
  // redirect so the scanner sees no signal, but skip ALL side effects:
  // no PB attribution row, no Resend audience-add, no 8-email queue.
  if (isExcluded(email)) {
    console.log(`[verify] suppressed excluded address: ${email}`);
    return NextResponse.redirect(REPORT_URL);
  }

  // Pull attribution that /api/subscribe piggybacked on the verify URL.
  const clip = (v: string | null, max: number): string =>
    (v || "").slice(0, max);
  const rawRoute = clip(url.searchParams.get("quiz_route"), 4);
  const attribution: Attribution = {
    source: clip(url.searchParams.get("source"), 100),
    utm_source: clip(url.searchParams.get("utm_source"), 100),
    utm_medium: clip(url.searchParams.get("utm_medium"), 100),
    utm_campaign: clip(url.searchParams.get("utm_campaign"), 200),
    referrer: clip(url.searchParams.get("referrer"), 500),
    landing_path: clip(url.searchParams.get("landing_path"), 500),
    quiz_route: ["F", "T", "D", "I"].includes(rawRoute) ? rawRoute : "",
    quiz_route_label: clip(url.searchParams.get("quiz_route_label"), 120),
  };
  const packedAttribution = packAttribution(attribution);

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not configured");
    return NextResponse.redirect(REPORT_URL);
  }

  // 1. Add verified contact to Resend audience, with attribution packed into
  //    the `first_name` field for the hourly Resend→local-PB sync to decode.
  try {
    const audienceRes = await fetch("https://api.resend.com/audiences", {
      method: "GET",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    });
    if (audienceRes.ok) {
      const audiences = await audienceRes.json();
      let audienceId = audiences.data?.[0]?.id;

      if (!audienceId) {
        const createRes = await fetch("https://api.resend.com/audiences", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: "VC Deal Flow Signal" }),
        });
        const created = await createRes.json();
        audienceId = created.id;
      }

      const contactBody: Record<string, unknown> = {
        email,
        unsubscribed: false,
      };
      if (packedAttribution) {
        contactBody.first_name = packedAttribution;
      }

      await fetch(
        `https://api.resend.com/audiences/${audienceId}/contacts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactBody),
        },
      );
    }
  } catch (err) {
    console.error("Failed to add contact to audience:", err);
  }

  // 2. Schedule the cohort drip sequence. `cohort=challenge` routes to the
  //    7-Day Deal Flow Reset; `cohort=launch` routes to the 5-email Brunson
  //    Product Launch Funnel; default routes to the existing soap-opera funnel.
  const cohortParam = url.searchParams.get("cohort");
  const sequence =
    cohortParam === "challenge"
      ? CHALLENGE_EMAILS
      : cohortParam === "launch"
        ? LAUNCH_EMAILS
        : SOAP_OPERA_EMAILS;
  const now = Date.now();
  for (const soapEmail of sequence) {
    const sendAt = new Date(now + soapEmail.delayMs).toISOString();
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: email,
          subject: soapEmail.subject,
          html: soapEmail.html,
          scheduled_at: sendAt,
          headers: {
            "List-Unsubscribe": `<mailto:${FROM_EMAIL}?subject=unsubscribe>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error(
          `Failed to schedule "${soapEmail.subject}" for ${email}:`,
          errText,
        );
      }
    } catch (err) {
      console.error(
        `Error scheduling "${soapEmail.subject}" for ${email}:`,
        err,
      );
    }
  }

  // 3. Redirect — challenge cohort lands on /challenge/started so the user
  //    sees the curriculum, launch cohort lands on the open launch page so
  //    they can buy immediately if they want, default lands on the report.
  if (cohortParam === "challenge") {
    return NextResponse.redirect(`${SITE_URL}/challenge/started`);
  }
  if (cohortParam === "launch") {
    return NextResponse.redirect(`${SITE_URL}/launch/agent-credits`);
  }
  return NextResponse.redirect(REPORT_URL);
}

function redirectWithError(message: string) {
  const errorPage = `https://gitdealflow.com/#signup`;
  return NextResponse.redirect(errorPage);
}
