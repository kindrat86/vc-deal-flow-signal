import { NextResponse } from "next/server";
import { verifyToken, verifyVerifyToken } from "@/lib/verify-token";
import { isValidEmail } from "@/lib/validation";
import {
  SOAP_OPERA_EMAILS,
  SOAP_OPERA_F,
  SOAP_OPERA_T,
  SOAP_OPERA_D,
  SOAP_OPERA_I,
  CHALLENGE_EMAILS,
  LAUNCH_EMAILS,
} from "@/lib/emails";
import { isExcluded } from "@/lib/excluded-emails";
import { isNonceUsed, markNonceUsed } from "@/lib/runtime-cache";
import { listUnsubscribeHeaders, injectUnsubscribeLink } from "@/lib/list-unsubscribe";
import { pickAudienceId } from "@/lib/resend-audience";

// Single-use tracking for v2 verify-subscribe nonces. Once a v2 token's nonce
// is consumed, any replay (link prefetcher, leaked URL replay) becomes a
// no-op redirect with no Resend side effects. Backed by Vercel Runtime Cache
//, survives cold starts and is shared across function instances within a
// region. Every replay we catch saves an audience-add + N-email drip
// schedule. See lib/runtime-cache.ts.
const VERIFY_NONCE_NAMESPACE = "verify-nonce";
const VERIFY_NONCE_TTL_SECONDS = 30 * 86_400; // matches v2 token 30-day TTL

// Per-EMAIL sequence dedup, on top of the per-TOKEN nonce above. A visitor
// who subscribes twice gets two different v2 tokens, both single-use, but
// clicking both would enroll the same inbox in the Soap Opera Sequence twice.
// We mark the email itself once the sequence is scheduled; ~180d TTL covers
// the longest sequence span (Day 0-180) with the whole drip arc. A user who
// unsubscribes and later legitimately re-subscribes inside that window is
// re-activated on the audience (PATCH unsubscribed:false below) so digests
// and broadcasts resume, but the already-seen drip sequence is NOT queued a
// second time, which is the sane behavior for a returning subscriber.
const SOS_ENROLLED_NAMESPACE = "sos-enrolled";
const SOS_ENROLLED_TTL_SECONDS = 180 * 86_400;

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const REPORT_URL = process.env.REPORT_URL || "https://gitdealflow.com/report";
const SITE_URL = process.env.SITE_URL || "https://signals.gitdealflow.com";


function confirmedUrl(route: string) {
  const params = new URLSearchParams();
  if (route) params.set("route", route);
  const query = params.toString();
  return `https://gitdealflow.com/confirmed${query ? `?${query}` : ""}`;
}

function routeFromQuery(url: URL): string {
  const rawRoute = (url.searchParams.get("quiz_route") || "").slice(0, 4);
  return ["F", "T", "D", "I"].includes(rawRoute) ? rawRoute : "";
}

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
      // Replay (link-prefetcher rescan, leaked URL replay), return success
      // redirect but skip every Resend side effect.
      return NextResponse.redirect(confirmedUrl(routeFromQuery(url)));
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
    return NextResponse.redirect(confirmedUrl(routeFromQuery(url)));
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
  const tzRaw = clip(url.searchParams.get("tz"), 64);
  const tz = tzRaw.includes("/") ? tzRaw : "";
  const packedAttribution = packAttribution(attribution);

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not configured");
    return NextResponse.redirect(confirmedUrl(routeFromQuery(url)));
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
      let audienceId = pickAudienceId(audiences);

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
      if (tz) {
        contactBody.last_name = `tz:${tz}`;
      }

      const contactRes = await fetch(
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
      if (!contactRes.ok) {
        // Contact already exists, this is a RE-subscriber. If they had
        // previously unsubscribed, the POST above did not flip them back;
        // PATCH unsubscribed:false so they actually receive emails again.
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
    }
  } catch (err) {
    console.error("Failed to add contact to audience:", err);
  }

  // 2. Schedule the cohort drip sequence. `cohort=challenge` routes to the
  //    7-Day Deal Flow Reset; `cohort=launch` routes to the 5-email Brunson
  //    Product Launch Funnel. Otherwise we fork on `quiz_route` (F/T/D/I) so
  //    the value-ladder pitch matches what the visitor self-described on
  //    /landing#signup, pre-buyers (F) skip the €7/€9.97/€97 pitch days,
  //    First-Look (T) gets €7 + Dashboard, Dashboard (D) gets the modal
  //    sequence, Insider (I) skips the small denominations and emphasises
  //    €97 + €1,997. Missing/unknown route falls back to SOAP_OPERA_EMAILS
  //    (= D) so legacy signups without the quiz card stay on the existing
  //    flow.
  const cohortParam = url.searchParams.get("cohort");
  const route = attribution.quiz_route as "F" | "T" | "D" | "I" | "";
  const sequence =
    cohortParam === "challenge"
      ? CHALLENGE_EMAILS
      : cohortParam === "launch"
        ? LAUNCH_EMAILS
        : route === "F"
          ? SOAP_OPERA_F
          : route === "T"
            ? SOAP_OPERA_T
            : route === "D"
              ? SOAP_OPERA_D
              : route === "I"
                ? SOAP_OPERA_I
                : SOAP_OPERA_EMAILS;
  // Resend's scheduled_at API rejects anything more than 30 days in the
  // future (returns 422). Emails within the window are scheduled now; emails
  // beyond it are stored as a deferred plan on the contact's `properties`
  // and picked up by the /api/cron/drip-sender daily cron.
  const MAX_SCHEDULE_MS = 29 * 24 * 60 * 60 * 1000; // 29 days, safety margin
  const now = Date.now();

  const immediate: typeof sequence = [];
  const deferred: typeof sequence = [];
  for (const e of sequence) {
    if (e.delayMs <= MAX_SCHEDULE_MS) immediate.push(e);
    else deferred.push(e);
  }

  // Per-email dedup: a double-subscribe (two verification emails, both
  // clicked) must not double-enroll the inbox in the sequence. Mark BEFORE
  // scheduling so a concurrent second click can't race past the check. The
  // audience add + unsubscribed:false re-activation above already ran, so a
  // legitimate re-subscriber is back on the list for digests either way.
  const alreadyEnrolled = await isNonceUsed(SOS_ENROLLED_NAMESPACE, email);
  if (!alreadyEnrolled) {
    await markNonceUsed(SOS_ENROLLED_NAMESPACE, email, SOS_ENROLLED_TTL_SECONDS);
  }
  const toScheduleNow = alreadyEnrolled ? [] : immediate;
  const toDefer = alreadyEnrolled ? [] : deferred;

  console.log(
    `[verify] dispatch email=${email} cohort=${cohortParam || "default"} route=${route || "none"} total=${sequence.length} immediate=${immediate.length} deferred=${deferred.length}${alreadyEnrolled ? " (already enrolled, skipping drip schedule)" : ""}`,
  );

  for (const soapEmail of toScheduleNow) {
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
          bcc: "sales@sipiteno.com",
          to: email,
          subject: soapEmail.subject,
          html: injectUnsubscribeLink(soapEmail.html, email),
          scheduled_at: sendAt,
          headers: listUnsubscribeHeaders(email),
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

  // Store the deferred email plan on the contact so the drip-sender cron
  // can deliver them when the time comes. We pack the plan into a compact
  // JSON and store it in the contact's `properties.drip` field, keyed by
  // the delay-in-days so the cron can match on days-since-signup.
  if (toDefer.length > 0) {
    const dripPlan = toDefer.map((e) => ({
      d: Math.round(e.delayMs / (24 * 60 * 60 * 1000)), // delay in days
      s: e.subject,
      h: e.html,
    }));
    try {
      // Resolve audience + contact ID, then PATCH properties
      const audienceRes = await fetch("https://api.resend.com/audiences", {
        headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
      });
      if (audienceRes.ok) {
        const audiences = await audienceRes.json();
        const audienceId = pickAudienceId(audiences);
        if (audienceId) {
          await fetch(
            `https://api.resend.com/audiences/${audienceId}/contacts/${encodeURIComponent(email)}`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${RESEND_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                properties: {
                  drip_plan: JSON.stringify(dripPlan),
                  drip_sent: "", // comma-separated list of days already sent
                },
              }),
            },
          );
          console.log(
            `[verify] stored ${toDefer.length} deferred drip emails for ${email}`,
          );
        }
      }
    } catch (err) {
      console.error(`[verify] failed to store deferred drip plan:`, err);
    }
  }

  // 3. Redirect, challenge cohort lands on /challenge/started so the user
  //    sees the curriculum, launch cohort lands on the open launch page so
  //    they can buy immediately if they want, default lands on the report.
  if (cohortParam === "challenge") {
    return NextResponse.redirect(`${SITE_URL}/challenge/started`);
  }
  if (cohortParam === "launch") {
    return NextResponse.redirect(`${SITE_URL}/launch/agent-credits`);
  }
  return NextResponse.redirect(confirmedUrl(route));
}

function redirectWithError(message: string) {
  const errorPage = `https://gitdealflow.com/#signup`;
  return NextResponse.redirect(errorPage);
}
