/**
 * Reddit Ads autonomous launch script.
 *
 * What this does:
 *   1. Reads CAMPAIGNS from lib/paid-acquisition.ts (six Reddit ad-sets).
 *   2. Calls Reddit Ads REST API to create:
 *        - 1 campaign (objective=TRAFFIC, daily budget €5/100¢ × 6 ad groups)
 *        - 6 ad groups (one per subreddit cluster)
 *        - 18 ads (3 creatives × 6 ad groups)
 *      All entities created in `PAUSED` state, the user must click
 *      "Activate" in Reddit Ads Manager UI before any spend starts.
 *   3. Prints a summary URL list so the user can spot-check before activation.
 *
 * Why PAUSED:
 *   - Memory durable rule: account/card/launch are user-only.  We can shape
 *     the campaign autonomously via API, but we never start spend without
 *     the user's hand on the wheel.  PAUSED state is the meeting-in-the-
 *     middle: zero clicks until user activates, but every other configuration
 *     step is done.
 *
 * Prereqs the user must have completed first:
 *   - Reddit Ads account created (ads.reddit.com)
 *   - Payment method linked
 *   - OAuth app registered → app id + secret + refresh token captured
 *   - Conversion pixel installed (auto via PixelManager once
 *     NEXT_PUBLIC_REDDIT_PIXEL_ID is set in Vercel)
 *
 * Env vars consumed (all server-side, never NEXT_PUBLIC_*):
 *   - REDDIT_ADS_OAUTH_TOKEN     short-lived bearer (refresh handled below)
 *   - REDDIT_ADS_OAUTH_REFRESH   long-lived refresh token (optional, used
 *                                if OAUTH_TOKEN is missing/expired)
 *   - REDDIT_ADS_OAUTH_CLIENT_ID
 *   - REDDIT_ADS_OAUTH_CLIENT_SECRET
 *   - REDDIT_ADS_ACCOUNT_ID      Reddit Ads account id (e.g. "a2_xxxxxxxx")
 *   - REDDIT_ADS_CREATIVE_BASE   default: https://signals.gitdealflow.com
 *
 * Usage:
 *   npx tsx scripts/reddit-ads-launch.ts            # dry-run (prints intended payloads)
 *   npx tsx scripts/reddit-ads-launch.ts --execute  # actually create on Reddit
 *
 * Reference: https://ads-api.reddit.com/docs/v3
 */

import { CAMPAIGNS, type Campaign } from "../pseo-site/lib/paid-acquisition";

const ACCOUNT_ID = process.env.REDDIT_ADS_ACCOUNT_ID || "";
const CREATIVE_BASE =
  process.env.REDDIT_ADS_CREATIVE_BASE || "https://signals.gitdealflow.com";
const DRY_RUN = !process.argv.includes("--execute");

const REDDIT_API = "https://ads-api.reddit.com/api/v3";

async function getAccessToken(): Promise<string> {
  const direct = process.env.REDDIT_ADS_OAUTH_TOKEN;
  if (direct) return direct;

  const refresh = process.env.REDDIT_ADS_OAUTH_REFRESH;
  const clientId = process.env.REDDIT_ADS_OAUTH_CLIENT_ID;
  const clientSecret = process.env.REDDIT_ADS_OAUTH_CLIENT_SECRET;
  if (!refresh || !clientId || !clientSecret) {
    throw new Error(
      "Reddit Ads auth not configured. Set REDDIT_ADS_OAUTH_TOKEN OR (REDDIT_ADS_OAUTH_REFRESH + CLIENT_ID + CLIENT_SECRET).",
    );
  }
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "vc-deal-flow-signal-launch/1.0",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh,
    }),
  });
  if (!res.ok) {
    throw new Error(`Reddit OAuth refresh failed (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function redditFetch<T>(
  path: string,
  init: RequestInit,
  token: string,
): Promise<T> {
  if (DRY_RUN) {
    console.log(`[dry-run] ${init.method || "GET"} ${path}`);
    if (init.body) {
      console.log("  body:", JSON.stringify(JSON.parse(String(init.body)), null, 2));
    }
    return { id: `dryrun-${path.split("/").pop()}` } as unknown as T;
  }
  const res = await fetch(`${REDDIT_API}${path}`, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "vc-deal-flow-signal-launch/1.0",
    },
  });
  if (!res.ok) {
    throw new Error(
      `Reddit API ${init.method || "GET"} ${path} failed (${res.status}): ${await res.text()}`,
    );
  }
  return (await res.json()) as T;
}

type CreatedEntity = { id: string };

const CREATIVES = [
  {
    variant: "v1",
    headline: "Your network is showing you yesterday's deals.",
    body: "In a panel of 219 confirmed Series A & B fundraises, commit-velocity acceleration showed up 21-47 days before the deck did. Pick a sector. €7 once. 24-hour Sector Deep-Dive PDF. €7 credited if you upgrade.",
    cta: "Pick my sector for €7",
    image: `${CREATIVE_BASE}/api/og/reddit/v1`,
  },
  {
    variant: "v2",
    headline: "The deal I missed because I trusted the deck.",
    body: "Founder I'd known for two years sent me a deck. I passed. Three weeks later they announced an oversubscribed round at 2× the valuation. I went back and looked at their GitHub. The signal was there 34 days early. For €7 I'll send you the same kind of deep-dive on any sector.",
    cta: "See the signal I missed",
    image: `${CREATIVE_BASE}/api/og/reddit/v2`,
  },
  {
    variant: "v3",
    headline: "219 fundraises. One signal. 21-47 days early.",
    body: "Open-access SSRN preprint. Reproducible methodology. Live ranking of 350+ venture-backed GitHub orgs. Pick a sector and we ship the 25-row deep-dive in 24 hours for €7. €7 credited toward Dashboard upgrade.",
    cta: "Read the panel + grab a sector",
    image: `${CREATIVE_BASE}/api/og/reddit/v3`,
  },
] as const;

const COMMUNITY_BY_CONTENT: Record<string, string> = {
  venturecapital: "venturecapital",
  angelinvestors: "AngelInvestors",
  startups: "startups",
  devtools: "devtools",
  programming: "programming",
  machinelearning: "MachineLearning",
};

function buildLandingUrl(c: Campaign, variant: string): string {
  const url = new URL(c.destination, CREATIVE_BASE);
  url.searchParams.set("utm_source", c.utm.source);
  url.searchParams.set("utm_medium", c.utm.medium);
  url.searchParams.set("utm_campaign", c.utm.campaign);
  url.searchParams.set("utm_content", `${c.utm.content || c.slug}-${variant}`);
  return url.toString();
}

async function main() {
  if (!ACCOUNT_ID) {
    console.error("REDDIT_ADS_ACCOUNT_ID is not set. Aborting.");
    process.exit(1);
  }

  console.log(
    `Reddit Ads launch, ${DRY_RUN ? "DRY-RUN (no writes)" : "EXECUTE (live writes)"}`,
  );
  console.log(`Account: ${ACCOUNT_ID}`);
  console.log(`Creative base: ${CREATIVE_BASE}`);
  console.log("");

  const token = DRY_RUN ? "dry-run-token" : await getAccessToken();

  const redditCampaigns = CAMPAIGNS.filter((c) => c.channel === "reddit");
  console.log(`Will create 1 campaign + ${redditCampaigns.length} ad groups + ${redditCampaigns.length * CREATIVES.length} ads.\n`);

  // 1. Create campaign (PAUSED, daily budget €5 = 500¢ split across ad groups)
  const campaign = await redditFetch<CreatedEntity>(
    `/me/accounts/${ACCOUNT_ID}/campaigns`,
    {
      method: "POST",
      body: JSON.stringify({
        data: {
          name: "VC Deal Flow Signal, First Look (auto, 2026-05)",
          objective: "TRAFFIC",
          configured_status: "PAUSED",
          spend_cap_basis: "DAILY",
          spend_cap: 500, // 500 cents = €5/day campaign-level cap
          funding_instrument_id: process.env.REDDIT_ADS_FUNDING_ID || "",
        },
      }),
    },
    token,
  );
  console.log(`✔ Campaign created (PAUSED): ${campaign.id}\n`);

  // 2. Create ad groups, one per cluster
  const adGroupIds: Array<{ slug: string; id: string; community: string }> = [];
  for (const c of redditCampaigns) {
    const community = COMMUNITY_BY_CONTENT[c.utm.content || c.slug] || c.slug;
    const adGroup = await redditFetch<CreatedEntity>(
      `/me/accounts/${ACCOUNT_ID}/ad_groups`,
      {
        method: "POST",
        body: JSON.stringify({
          data: {
            name: `r/${community}`,
            campaign_id: campaign.id,
            configured_status: "PAUSED",
            bid_strategy: "MAXIMUM_CPC",
            bid_value: 50, // 50¢ max CPC per the bundle
            optimization_goal: "CLICKS",
            start_time: new Date().toISOString(),
            // 30-day window from launch, bundle says €5/day × 30d
            end_time: new Date(Date.now() + 30 * 86_400_000).toISOString(),
            targeting: {
              communities: [community],
              geolocations: ["US", "GB", "DE", "NL", "FR", "SE", "FI", "IE", "AU", "CA"],
              devices: ["DESKTOP", "MOBILE"],
              excluded_communities: ["wallstreetbets", "cryptocurrency", "StockMarket"],
            },
          },
        }),
      },
      token,
    );
    adGroupIds.push({ slug: c.slug, id: adGroup.id, community });
    console.log(`✔ Ad group r/${community} (PAUSED): ${adGroup.id}`);
  }
  console.log("");

  // 3. Create ads (3 creatives × 6 ad groups)
  for (const ag of adGroupIds) {
    const c = redditCampaigns.find((rc) => rc.slug === ag.slug)!;
    for (const cr of CREATIVES) {
      const url = buildLandingUrl(c, cr.variant);
      const ad = await redditFetch<CreatedEntity>(
        `/me/accounts/${ACCOUNT_ID}/ads`,
        {
          method: "POST",
          body: JSON.stringify({
            data: {
              name: `${ag.community} · ${cr.variant}`,
              ad_group_id: ag.id,
              configured_status: "PAUSED",
              type: "IMAGE",
              headline: cr.headline,
              body: cr.body,
              click_url: url,
              cta_text: cr.cta,
              creative: { image_url: cr.image },
            },
          }),
        },
        token,
      );
      console.log(`  ✔ Ad ${ag.community}/${cr.variant} (PAUSED): ${ad.id}`);
    }
  }

  console.log("\n✓ All entities created in PAUSED state.");
  console.log(
    "→ User action: open https://ads.reddit.com → review creatives + landing URLs → click Activate on the campaign.",
  );
}

main().catch((err) => {
  console.error("Launch failed:", err instanceof Error ? err.stack : err);
  process.exit(1);
});
