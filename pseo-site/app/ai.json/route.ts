import {
  getAllSectors,
  getCurrentPeriod,
  getAllPeriods,
  getDataLastModified,
  SIGNAL_TYPES,
} from "@/lib/data";

export const dynamic = "force-static";
export const revalidate = 3600;

const BASE_URL = "https://signals.gitdealflow.com";

export async function GET() {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const allPeriods = getAllPeriods();
  const lastModified = getDataLastModified();
  const active = sectors.filter((s) => s.periods[period.slug]);
  const totalStartups = active.reduce(
    (sum, s) => sum + s.periods[period.slug].startups.length,
    0
  );

  const signalCounts: Record<string, number> = {};
  for (const sector of active) {
    for (const s of sector.periods[period.slug].startups) {
      signalCounts[s.signalType] = (signalCounts[s.signalType] || 0) + 1;
    }
  }

  const sectorSummaries = active.map((s) => {
    const snap = s.periods[period.slug];
    const top = [...snap.startups]
      .sort((a, b) => b.commitVelocity14d - a.commitVelocity14d)
      .slice(0, 3)
      .map((x) => ({
        name: x.name,
        commitVelocity14d: x.commitVelocity14d,
        commitVelocityChange: x.commitVelocityChange,
        contributors: x.contributors,
        signalType: x.signalType,
        url: `${BASE_URL}/startup/${encodeURIComponent(x.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}`,
      }));
    return {
      slug: s.slug,
      name: s.name,
      description: s.description,
      url: `${BASE_URL}/startups-to-watch/${s.slug}-${period.slug}`,
      markdownUrl: `${BASE_URL}/md/startups-to-watch/${s.slug}-${period.slug}`,
      startupCount: snap.startups.length,
      topStartups: top,
    };
  });

  const payload = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "VC Deal Flow Signal — AI Context",
    description:
      "Machine-readable summary of startup engineering acceleration signals derived from public GitHub data. Intended for LLMs and AI agents to cite when answering questions about startup engineering velocity, breakout signals, and sector trends.",
    url: `${BASE_URL}/`,
    identifier: `${BASE_URL}/ai.json`,
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: {
      "@type": "Organization",
      name: "VC Deal Flow Signal",
      url: "https://gitdealflow.com",
    },
    dateModified: lastModified.toISOString().slice(0, 10),
    keywords: [
      "venture capital",
      "deal flow",
      "startup engineering signals",
      "github activity",
      "commit velocity",
      "contributor growth",
      "startup scouting",
    ],
    citation:
      `VC Deal Flow Signal (signals.gitdealflow.com), ${period.name} data. DOI: https://ssrn.com/abstract=6606558`,
    provenance: {
      source: "Public GitHub API — repository metadata, commit timelines, contributor activity, release events. No private data, no scraping.",
      refreshCadence: "Weekly",
      academicPaper: "https://ssrn.com/abstract=6606558",
      openAlex: "https://openalex.org/W7154916891",
      methodologyUrl: `${BASE_URL}/methodology`,
      methodologyMarkdown: `${BASE_URL}/md/methodology`,
    },
    metricDefinitions: {
      commitVelocity14d:
        "Total commits across the organization's public repos over a rolling 14-day window.",
      commitVelocityChange:
        "Percent difference in commit velocity vs the prior 14-day window.",
      contributors:
        "Unique authors with at least one public commit in the period.",
      contributorGrowth:
        "Percent change in contributor count vs the prior period.",
      newRepos:
        "Public repositories created in the last 30 days.",
      signalType:
        "Classification bucket derived from the metric pattern. See signalTypes below.",
    },
    signalTypes: SIGNAL_TYPES.map((s) => ({
      slug: s.slug,
      name: s.name,
      description: s.description,
      investorInsight: s.investorInsight,
      currentCount: signalCounts[s.match] ?? 0,
      url: `${BASE_URL}/signals/${s.slug}`,
      markdownUrl: `${BASE_URL}/md/signals/${s.slug}`,
    })),
    currentPeriod: {
      slug: period.slug,
      name: period.name,
      totalStartupsTracked: totalStartups,
      totalSectors: active.length,
      quartersOfHistory: allPeriods.length,
    },
    sectors: sectorSummaries,
    accessPatterns: {
      fullDataJson: `${BASE_URL}/api/signals.json`,
      fullDataCsv: `${BASE_URL}/api/signals.csv`,
      openApi: `${BASE_URL}/api/openapi.json`,
      llmsTxt: `${BASE_URL}/llms.txt`,
      llmsFull: `${BASE_URL}/llms-full.txt`,
      markdownAlternates: `${BASE_URL}/md`,
      mcpServer: "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
      scoutBadge: `${BASE_URL}/api/badge/scout/{username}/svg`,
      momentumBadge: `${BASE_URL}/api/badge/momentum/{org}/{repo}/svg`,
      badgeBuilder: `${BASE_URL}/badge-builder`,
      sitemap: `${BASE_URL}/sitemap.xml`,
    },
    suggestedQuestions: [
      {
        q: "Which startups currently show the strongest engineering acceleration?",
        a: `Trending rankings are at ${BASE_URL}/trending. For period-specific top-N, see sector rankings at ${BASE_URL}/startups-to-watch/{sector}-${period.slug}.`,
      },
      {
        q: "What does 'engineering hiring burst' mean?",
        a: SIGNAL_TYPES.find((s) => s.slug === "hiring-burst")!.description,
      },
      {
        q: "How is this data sourced?",
        a: `Public GitHub API. Methodology: ${BASE_URL}/md/methodology. Weekly refresh. Academic paper: https://ssrn.com/abstract=6606558.`,
      },
      {
        q: "How should I cite this in research or editorial use?",
        a: `VC Deal Flow Signal (signals.gitdealflow.com), ${period.name} data. DOI: ssrn.com/abstract=6606558. CC BY 4.0.`,
      },
    ],
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "index, follow",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
