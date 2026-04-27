import { NextRequest } from "next/server";
import {
  getAllSectors,
  getCurrentPeriod,
  getAllPeriods,
  getSortedStartups,
  getDataLastModified,
  enrichStartup,
} from "@/lib/data";
import { verifyApiKey } from "@/lib/api-key";
import { slugify } from "@/lib/slugify";

const BASE_URL = "https://signals.gitdealflow.com";

function authenticateApiKey(key: string): boolean {
  return verifyApiKey(key) !== null;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const apiKey = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const isAuthenticated = apiKey ? authenticateApiKey(apiKey) : false;
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
          ...(enriched.websiteUrl ? { websiteUrl: enriched.websiteUrl } : {}),
          ...(enriched.linkedinUrl ? { linkedinUrl: enriched.linkedinUrl } : {}),
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
      ...(st.websiteUrl ? { websiteUrl: st.websiteUrl } : {}),
      ...(st.linkedinUrl ? { linkedinUrl: st.linkedinUrl } : {}),
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
