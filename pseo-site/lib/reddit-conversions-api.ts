/**
 * Reddit Conversions API, server-side event firing.
 *
 * Why server-side:
 *   1. Survives ad-blockers + iOS ITP / Brave shields that nuke the browser
 *      pixel.  Reddit's CAPI typically reports 15-25% more conversions than
 *      pixel-only on the same campaign in 2026 measurement audits.
 *   2. Stripe webhook is the source of truth for `Purchase`, firing here
 *      means Reddit's `attribution_optimization` model trains on real $$,
 *      not best-effort browser pings.
 *   3. CPL/CPA reporting in the Reddit Ads dashboard reads the higher-fidelity
 *      conversion stream once CAPI is wired, better optimization within ~72h.
 *
 * Auth:
 *   - REDDIT_ADS_CONVERSIONS_TOKEN, long-lived bearer token from Reddit Ads
 *     Manager → Events Manager → Conversion API → Generate access token.
 *     Account-scoped, server-only, never NEXT_PUBLIC_*.
 *   - REDDIT_ADS_PIXEL_ID, same id used in the browser pixel
 *     (NEXT_PUBLIC_REDDIT_PIXEL_ID), passed in the path.
 *
 * Idempotency:
 *   - `event_id` parameter is the dedup key Reddit uses to merge a server
 *     event with the matching browser pixel hit (so a Purchase that fires
 *     both pixel + CAPI is counted ONCE).  We use Stripe's event.id for
 *     `Purchase` and a hash of (email + campaign + ts-bucket) for `Lead`.
 *
 * No-op semantics:
 *   - If the env vars are not set, the helpers return early with a debug log
 *     and no network call.  That keeps every code path safe before the user
 *     finishes Reddit Ads Manager setup.
 *
 * Reference: https://ads-api.reddit.com/api/v2.0/conversions/events/{pixel_id}
 *   POST body shape per Reddit's docs as of 2026-Q1, kept narrow to the
 *   subset we actually fire.  If Reddit deprecates fields the request will
 *   400 and we fail-soft (catch-and-log; never block the buyer flow).
 */

import { createHash } from "node:crypto";

type RedditEventName = "Lead" | "Purchase" | "PageVisit" | "ViewContent" | "AddToCart";

type RedditEvent = {
  event_at: string; // ISO 8601
  event_type: { tracking_type: RedditEventName };
  event_metadata?: {
    currency?: string; // "EUR"
    value_decimal?: number; // major-units (€7.00 = 7.00, not cents)
    item_count?: number;
    conversion_id?: string; // dedup key
    products?: Array<{ id: string; name?: string; category?: string }>;
  };
  user?: {
    email?: string; // SHA-256 hex
    external_id?: string;
    ip_address?: string; // SHA-256 hex
    user_agent?: string;
    aaid?: string; // android adv id
    idfa?: string; // ios adv id
    screen_dimensions?: { width: number; height: number };
  };
  click_id?: string; // rdt_cid cookie value
};

const PIXEL_ID = process.env.REDDIT_ADS_PIXEL_ID || process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID;
const TOKEN = process.env.REDDIT_ADS_CONVERSIONS_TOKEN;

/** SHA-256 hex of a lowercased+trimmed value, per Reddit hashing spec. */
function sha256Hex(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/** Build a deterministic conversion_id used for cross-event dedup. */
export function buildConversionId(seed: string): string {
  return createHash("sha256").update(seed).digest("hex").slice(0, 32);
}

/** Internal, POST one event to Reddit Conversions API.  Fails soft. */
async function postEvent(event: RedditEvent): Promise<void> {
  if (!PIXEL_ID || !TOKEN) {
    // Configured-out, common until the user finishes account+pixel setup.
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `[reddit-capi] skipped (missing PIXEL_ID or CONVERSIONS_TOKEN): ${event.event_type.tracking_type}`,
      );
    }
    return;
  }

  const url = `https://ads-api.reddit.com/api/v2.0/conversions/events/${PIXEL_ID}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        test_mode: process.env.NODE_ENV !== "production",
        events: [event],
      }),
      // 2.5s ceiling, never block the buyer flow on Reddit's reachability.
      signal: AbortSignal.timeout(2_500),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "<no body>");
      console.error(
        `[reddit-capi] non-2xx (${res.status}): ${event.event_type.tracking_type}, ${txt.slice(0, 240)}`,
      );
    }
  } catch (err) {
    // Network errors, timeouts, JSON failures, all swallowed by design.
    // Reddit going down must NEVER fail a Stripe webhook acknowledgement.
    console.error(
      `[reddit-capi] dispatch error for ${event.event_type.tracking_type}:`,
      err instanceof Error ? err.message : err,
    );
  }
}

export type LeadInput = {
  email: string;
  utmSource?: string;
  utmCampaign?: string;
  utmContent?: string;
  ipAddress?: string;
  userAgent?: string;
  rdtClickId?: string; // from rdt_cid cookie if present
};

/**
 * Fire a `Lead` conversion event when an email is captured.
 * Called from /api/subscribe POST after Resend accepts the verification mail.
 */
export async function fireRedditLead(input: LeadInput): Promise<void> {
  // Only fire for paid Reddit traffic, organic email captures don't optimize
  // ad delivery and would skew the conversion volume signal.
  if (input.utmSource !== "reddit") return;

  const seed = `lead:${input.email}:${input.utmCampaign || ""}:${input.utmContent || ""}:${Math.floor(Date.now() / 600_000)}`;
  await postEvent({
    event_at: new Date().toISOString(),
    event_type: { tracking_type: "Lead" },
    event_metadata: {
      conversion_id: buildConversionId(seed),
      products: [
        {
          id: "firstlook-lead",
          name: "First Look Pass, Email Capture",
          category: "lead",
        },
      ],
    },
    user: {
      email: sha256Hex(input.email),
      ...(input.ipAddress ? { ip_address: sha256Hex(input.ipAddress) } : {}),
      ...(input.userAgent ? { user_agent: input.userAgent } : {}),
    },
    ...(input.rdtClickId ? { click_id: input.rdtClickId } : {}),
  });
}

export type PurchaseInput = {
  email: string;
  amountEUR: number; // 7.00, 26.00, 97.00, 1797.00, etc.
  tier: string; // "firstlook" | "dashboard" | "insider" | "sector_sweep" | …
  stripeEventId: string; // Stripe event.id, perfect dedup key
  utmSource?: string;
  utmCampaign?: string;
  utmContent?: string;
  ipAddress?: string;
  userAgent?: string;
  rdtClickId?: string;
};

/**
 * Fire a `Purchase` conversion event after Stripe `checkout.session.completed`.
 * Called from /api/webhook/stripe AFTER the welcome email has shipped, so a
 * Reddit-side outage cannot starve the buyer of their receipt.
 */
export async function fireRedditPurchase(input: PurchaseInput): Promise<void> {
  // Reddit attribution lookback is 28d view / 7d click by default, even
  // organic-looking customers may have clicked an ad in the past month, so
  // we fire `Purchase` on every paid order regardless of utm_source. Reddit
  // matches via click_id / cookie / hashed email and credits the right ad.
  await postEvent({
    event_at: new Date().toISOString(),
    event_type: { tracking_type: "Purchase" },
    event_metadata: {
      currency: "EUR",
      value_decimal: input.amountEUR,
      item_count: 1,
      conversion_id: buildConversionId(`purchase:${input.stripeEventId}`),
      products: [
        {
          id: input.tier,
          name: `VC Deal Flow Signal, ${input.tier}`,
          category: "subscription",
        },
      ],
    },
    user: {
      email: sha256Hex(input.email),
      ...(input.ipAddress ? { ip_address: sha256Hex(input.ipAddress) } : {}),
      ...(input.userAgent ? { user_agent: input.userAgent } : {}),
    },
    ...(input.rdtClickId ? { click_id: input.rdtClickId } : {}),
  });
}
