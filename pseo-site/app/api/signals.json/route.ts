import { NextRequest } from "next/server";
import {
  getAllSectors,
  getCurrentPeriod,
  getAllPeriods,
  getSortedStartups,
  getDataLastModified,
  enrichStartup,
} from "@/lib/data";
import { generateApiKey, verifyApiKeyFormat } from "@/lib/api-key";
import { stripe } from "@/lib/stripe";
import { slugify } from "@/lib/slugify";

const BASE_URL = "https://signals.gitdealflow.com";

// Cache API key -> customer mapping to avoid O(n) Stripe calls per request
let _apiKeyCache: Map<string, string> | null = null;
let _apiKeyCacheExpiry = 0;
const API_KEY_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function buildApiKeyCache(): Promise<Map<string, string>> {
  const cache = new Map<string, string>();
  try {
    let hasMore = true;
    let startingAfter: string | undefined;
    while (hasMore) {
      const params: { limit: number; starting_after?: string } = { limit: 100 };
      if (startingAfter) params.starting_after = startingAfter;
      const customers = await stripe.customers.list(params);
      for (const customer of customers.data) {
        cache.set(generateApiKey(customer.id), customer.id);
      }
      hasMore = customers.has_more;
      if (customers.data.length > 0) {
        startingAfter = customers.data[customers.data.length - 1].id;
      }
    }
  } catch {
    // If Stripe isn't configured, return empty cache
  }
  return cache;
}

async function authenticateApiKey(key: string): Promise<boolean> {
  if (!verifyApiKeyFormat(key)) return false;
  try {
    // Use cached mapping — rebuild if expired
    if (!_apiKeyCache || Date.now() > _apiKeyCacheExpiry) {
      _apiKeyCache = await buildApiKeyCache();
      _apiKeyCacheExpiry = Date.now() + API_KEY_CACHE_TTL;
    }
    const customerId = _apiKeyCache.get(key);
    if (!customerId) return false;

    // Verify active subscription (single Stripe call)
    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    return subs.data.length > 0;
  } catch {
    // If Stripe isn't configured, fall through to public access
  }
  return false;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const apiKey = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const isAuthenticated = apiKey ? await authenticateApiKey(apiKey) : false;
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const allPeriods = getAllPeriods();
  const lastModified = getDataLastModified();
  const activeSectors = sectors.filter((s) => s.periods[period.slug]);

  // Build sector summaries
  const sectorSummaries = activeSectors.map((s) => {
    const snapshot = s.periods[period.slug];
    const sorted = getSortedStartups(snapshot.startups);

    return {
      name: s.name,
      slug: s.slug,
      description: s.description,
      url: `${BASE_URL}/startups-to-watch/${s.slug}-${period.slug}`,
      startupCount: snapshot.startups.length,
      startups: sorted.map((st) => {
        const enriched = isAuthenticated ? enrichStartup(st) : st;
        return {
          name: enriched.name,
          description: enriched.description,
          stage: enriched.stage,
          geography: enriched.geography,
          commitVelocity14d: enriched.commitVelocity14d,
          commitVelocityChange: enriched.commitVelocityChange,
          contributors: enriched.contributors,
          contributorGrowth: enriched.contributorGrowth,
          newRepos: enriched.newRepos,
          signalType: enriched.signalType,
          githubUrl: enriched.githubUrl,
          profileUrl: `${BASE_URL}/startup/${slugify(enriched.name)}`,
          ...(isAuthenticated && enriched.fundingTotal ? {
            fundingTotal: enriched.fundingTotal,
            lastRoundType: enriched.lastRoundType,
            teamSize: enriched.teamSize,
            foundedYear: enriched.foundedYear,
          } : {}),
        };
      }),
    };
  });

  // Build global top 20
  const allStartups = activeSectors.flatMap((s) =>
    s.periods[period.slug].startups.map((st) => ({
      ...st,
      sectorName: s.name,
      sectorSlug: s.slug,
    }))
  );
  const globalTop20 = getSortedStartups(allStartups)
    .slice(0, 20)
    .map((st) => ({
      name: st.name,
      description: st.description,
      stage: st.stage,
      geography: st.geography,
      commitVelocity14d: st.commitVelocity14d,
      commitVelocityChange: st.commitVelocityChange,
      contributors: st.contributors,
      contributorGrowth: st.contributorGrowth,
      newRepos: st.newRepos,
      signalType: st.signalType,
      githubUrl: st.githubUrl,
    }));

  const payload = {
    meta: {
      name: "VC Deal Flow Signal",
      description:
        "Startup engineering acceleration data from public GitHub activity. Commit velocity, contributor growth, and breakout signals across startup sectors.",
      website: BASE_URL,
      methodology: `${BASE_URL}/methodology`,
      period: {
        slug: period.slug,
        name: period.name,
      },
      availablePeriods: allPeriods.map((p) => ({
        slug: p.slug,
        name: p.name,
        current: p.current,
      })),
      lastUpdated: lastModified.toISOString(),
      totalSectors: activeSectors.length,
      totalStartups: allStartups.length,
      license:
        "Free for personal and editorial use. Attribution required: cite as 'VC Deal Flow Signal (signals.gitdealflow.com)'. Commercial redistribution prohibited.",
      citation:
        "VC Deal Flow Signal (signals.gitdealflow.com), " + period.name + " data.",
    },
    trending: globalTop20,
    sectors: sectorSummaries,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
