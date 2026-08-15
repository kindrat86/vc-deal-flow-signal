/**
 * Paid acquisition, single source of truth for active campaigns.
 *
 * Brunson DotCom Secret #5, Three Types of Traffic.  Earn (organic, SSRN,
 * MCP catalogues) and Own (email list) are in production; Control (paid)
 * was missing.  This file wires the third leg.
 *
 * Rules respected (see MEMORY.md):
 *   - No LinkedIn actions ever (organic OR paid).  LinkedIn campaigns are
 *     intentionally absent below.
 *   - HN account blocked → no HN sponsored slots.
 *   - X / Twitter account blocked → no X-ads campaigns.
 *   - Account creation, card-entry, and campaign launch are USER-only.
 *     This file describes campaigns; it does not launch them.
 *
 * Wiring:
 *   - `app/r/[campaign]/page.tsx` reads CAMPAIGNS by slug and 308-redirects
 *     to the destination with UTMs appended, so ad URLs stay short
 *     (`signals.gitdealflow.com/r/vc-2026-05`) and the destination remains
 *     a single static landing.
 *   - `components/PaidTrafficBanner.tsx` is ready to mount on `/firstlook`
 *     (one import + one JSX node) and will swap the headline if
 *     `?utm_source=reddit|newsletter` is present.  Mounting was held back
 *     in this commit to keep the static landing diff trivial; flip it on
 *     before the first paid spend.
 *   - `/api/subscribe` and `/api/verify` already capture UTMs end-to-end
 *     (see PocketBase `subscribers` collection).
 */

export type ChannelKind =
  | "reddit"
  | "google"
  | "newsletter"
  | "devto"
  | "facebook";

export type Campaign = {
  /** Short slug used in `/r/<slug>` redirect URL.  Keep <= 24 chars, lowercase. */
  slug: string;
  /** Channel, drives ad-network attribution + banner copy. */
  channel: ChannelKind;
  /** Destination on signals.gitdealflow.com (path-only, must start with /). */
  destination: string;
  /** UTM parameters.  utm_source is the channel; utm_medium is the format
   *  (cpc, sponsorship, native); utm_campaign is the slug; utm_content
   *  optionally segments creative. */
  utm: {
    source: string;
    medium: string;
    campaign: string;
    content?: string;
  };
  /** Internal note, what this campaign is testing. Shown in /api/v1/changelog
   *  the day the campaign goes live so the data nerd voice stays public. */
  hypothesis: string;
  /** Status, gate for /r redirect.  Inactive slugs return 410 Gone so old
   *  ad-clicks don't keep landing after the budget is paused. */
  status: "draft" | "live" | "paused" | "killed";
};

const SITE = "https://signals.gitdealflow.com";

/**
 * The starter set.  Reddit Ads first because:
 *   1. Lowest test floor (€5/day, no minimum spend lock-in).
 *   2. r/venturecapital + r/AngelInvestors + r/programming form a literal
 *      Brunson Dream-100 cluster, the developer-investor lives there.
 *   3. Subreddit targeting is precise enough to avoid LinkedIn-style B2B
 *      cost blowups.
 *
 * Google Search second because commercial-intent keywords ("harmonic
 * alternative", "tracxn alternative", "github trending startups") map
 * cleanly to existing /alternatives and /vs pages.
 *
 * Newsletter sponsorship third, saved for after Reddit confirms the
 * landing converts at >2%.
 */
export const CAMPAIGNS: Campaign[] = [
  // ───────────────────────────────────────────── REDDIT, INVESTOR-SIDE ─
  {
    slug: "vc",
    channel: "reddit",
    destination: "/firstlook",
    utm: {
      source: "reddit",
      medium: "cpc",
      campaign: "vc-2026-05",
      content: "venturecapital",
    },
    hypothesis:
      "r/venturecapital readers respond to the 47-day-before-the-deck hook; CTR target 1.8%, /firstlook conv target 2.5%.",
    status: "draft",
  },
  {
    slug: "angel",
    channel: "reddit",
    destination: "/firstlook",
    utm: {
      source: "reddit",
      medium: "cpc",
      campaign: "vc-2026-05",
      content: "angelinvestors",
    },
    hypothesis:
      "r/AngelInvestors readers convert on the dollars-of-cheque math; same /firstlook landing, different ad copy.",
    status: "draft",
  },
  {
    slug: "startups",
    channel: "reddit",
    destination: "/firstlook",
    utm: {
      source: "reddit",
      medium: "cpc",
      campaign: "vc-2026-05",
      content: "startups",
    },
    hypothesis:
      "r/startups skews founder-side, testing if founders share with their angels (referral compounding).",
    status: "draft",
  },

  // ──────────────────────────────────────────── REDDIT, ENGINEER-SIDE ─
  {
    slug: "devtools",
    channel: "reddit",
    destination: "/firstlook",
    utm: {
      source: "reddit",
      medium: "cpc",
      campaign: "dev-2026-05",
      content: "devtools",
    },
    hypothesis:
      "r/devtools is the engineering-acceleration audience; lead-with-method copy, not lead-with-money.",
    status: "draft",
  },
  {
    slug: "programming",
    channel: "reddit",
    destination: "/firstlook",
    utm: {
      source: "reddit",
      medium: "cpc",
      campaign: "dev-2026-05",
      content: "programming",
    },
    hypothesis:
      "r/programming has scale (5M+), broadest test, lowest expected CTR but cheapest CPM.",
    status: "draft",
  },
  {
    slug: "ml",
    channel: "reddit",
    destination: "/firstlook",
    utm: {
      source: "reddit",
      medium: "cpc",
      campaign: "dev-2026-05",
      content: "machinelearning",
    },
    hypothesis:
      "r/MachineLearning maps to AI-infra thesis sectors that drive 60%+ of FirstLook orders.",
    status: "draft",
  },

  // ────────────────────────────────────── GOOGLE SEARCH (Tier 1.5) ────
  {
    slug: "harmonic",
    channel: "google",
    destination: "/alternatives/harmonic-ai",
    utm: {
      source: "google",
      medium: "cpc",
      campaign: "alt-2026-05",
      content: "harmonic-alternative",
    },
    hypothesis:
      "Highest commercial intent keyword in our space. Bid only on bottom-funnel terms; landing already exists at /alternatives/harmonic-ai.",
    status: "draft",
  },
  {
    slug: "tracxn",
    channel: "google",
    destination: "/alternatives/tracxn",
    utm: {
      source: "google",
      medium: "cpc",
      campaign: "alt-2026-05",
      content: "tracxn-alternative",
    },
    hypothesis:
      "Lower volume than harmonic but higher conversion in EU (Tracxn pricing pain is concentrated there).",
    status: "draft",
  },

  // ────────────────────────────── NEWSLETTER SPONSORSHIP (Tier 2) ──────
  {
    slug: "tldr",
    channel: "newsletter",
    destination: "/firstlook",
    utm: {
      source: "tldr",
      medium: "sponsorship",
      campaign: "newsletter-2026-q3",
    },
    hypothesis:
      "TLDR has 4M+ devs; one slot ~$5k. Run only after Reddit confirms /firstlook >2% conv. Buys ICP scale, not test signal.",
    status: "draft",
  },
  {
    slug: "generalist",
    channel: "newsletter",
    destination: "/firstlook",
    utm: {
      source: "thegeneralist",
      medium: "sponsorship",
      campaign: "newsletter-2026-q3",
    },
    hypothesis:
      "The Generalist (~150k VC-curious), purest investor-side ICP we can buy on a single drop.",
    status: "draft",
  },

  // ───────────────────────────────────── FACEBOOK / META (Tier 1.6) ────
  // Anonymity-compatible: data-viz creative, no founder face/voice. Each
  // ad-set lands on /from/facebook (platform-native pre-frame) which then
  // funnels to /firstlook with the same UTM payload preserved.
  //
  // Brunson Traffic Secrets §2 Ch 8, Facebook layer. Why we run paid here
  // despite the "no persona" rule: retargeting site visitors who already
  // self-qualified via /pricing, /firstlook, /walkthrough is the cheapest
  // CPA in the funnel (~€2-4 vs ~€15 cold). The 6 ad-sets below split
  // 70% retargeting / 30% lookalike-cold.
  {
    slug: "fb-retargeting-pricing",
    channel: "facebook",
    destination: "/from/facebook?ref=rt-pricing",
    utm: {
      source: "facebook",
      medium: "cpc",
      campaign: "fb-rt-2026-q3",
      content: "retarget-pricing",
    },
    hypothesis:
      "Retarget /pricing visitors (last 30d) with the €7 First Look bait. Lowest expected CPA in funnel, visitor already self-qualified by hitting pricing.",
    status: "draft",
  },
  {
    slug: "fb-retargeting-firstlook",
    channel: "facebook",
    destination: "/from/facebook?ref=rt-firstlook",
    utm: {
      source: "facebook",
      medium: "cpc",
      campaign: "fb-rt-2026-q3",
      content: "retarget-firstlook-abandon",
    },
    hypothesis:
      "Retarget /firstlook visitors who didn't checkout (cart abandoners proxy). Recovery sequence: €7 → free Sunday digest → 30-day guarantee reminder.",
    status: "draft",
  },
  {
    slug: "fb-retargeting-walkthrough",
    channel: "facebook",
    destination: "/from/facebook?ref=rt-walkthrough",
    utm: {
      source: "facebook",
      medium: "cpc",
      campaign: "fb-rt-2026-q3",
      content: "retarget-walkthrough-incomplete",
    },
    hypothesis:
      "Retarget /walkthrough viewers (>30s engagement, scroll-depth >50%). Lead with proof: SSRN n=219, 21-47d lead, then €7 close.",
    status: "draft",
  },
  {
    slug: "fb-lookalike-investor",
    channel: "facebook",
    destination: "/from/facebook?ref=lal-investor",
    utm: {
      source: "facebook",
      medium: "cpc",
      campaign: "fb-lal-2026-q3",
      content: "lookalike-investor-1pct",
    },
    hypothesis:
      "1% lookalike of paid Insider subscribers (Meta seed list ~50 emails). EU+US, age 28-55, interests: Y Combinator, Crunchbase, AngelList, Lenny's Newsletter.",
    status: "draft",
  },
  {
    slug: "fb-lookalike-engineer",
    channel: "facebook",
    destination: "/from/facebook?ref=lal-engineer",
    utm: {
      source: "facebook",
      medium: "cpc",
      campaign: "fb-lal-2026-q3",
      content: "lookalike-engineer-2pct",
    },
    hypothesis:
      "2% lookalike of /firstlook buyers, broader reach. Engineering-investor crossover targeting: GitHub Pro/Team subscribers, dev.to readers, MCP/Claude users.",
    status: "draft",
  },
  {
    slug: "fb-cold-interest",
    channel: "facebook",
    destination: "/from/facebook?ref=cold-interest",
    utm: {
      source: "facebook",
      medium: "cpc",
      campaign: "fb-cold-2026-q3",
      content: "cold-interest-targeting",
    },
    hypothesis:
      "Cold interest stack: 'Venture capital' + 'Software development' + 'Angel investor' + 'Crunchbase'. EU+US, English-only. Lead with data-viz creative (chart, no face). Floor budget €5/day to feed the pixel.",
    status: "draft",
  },
];

/** Build a fully-qualified destination URL with UTMs appended. */
export function buildDestination(c: Campaign): string {
  const url = new URL(c.destination, SITE);
  url.searchParams.set("utm_source", c.utm.source);
  url.searchParams.set("utm_medium", c.utm.medium);
  url.searchParams.set("utm_campaign", c.utm.campaign);
  if (c.utm.content) url.searchParams.set("utm_content", c.utm.content);
  return url.toString();
}

/** Lookup by slug.  Used by `/r/[campaign]/page.tsx`. */
export function findCampaign(slug: string): Campaign | undefined {
  return CAMPAIGNS.find((c) => c.slug === slug);
}

/** Active campaigns only, used by the public changelog endpoint. */
export function liveCampaigns(): Campaign[] {
  return CAMPAIGNS.filter((c) => c.status === "live");
}
