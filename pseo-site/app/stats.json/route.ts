import { createHash } from "node:crypto";
import {
  getAllSectors,
  getCurrentPeriod,
  getAllPeriods,
  getDataLastModified,
} from "@/lib/data";

export const dynamic = "force-static";
export const revalidate = 3600;

const BASE_URL = "https://signals.gitdealflow.com";

// Frozen, peer-cited research numbers (SSRN preprint 6606558, DOI 10.2139/ssrn.6606558).
// These describe the Q2 2025 - Q2 2026 longitudinal panel and are stable constants,
// not live counts. Live coverage numbers are computed dynamically below.
const PANEL = {
  observations: 219,
  uniqueStartups: 55,
  quarters: 5,
  window: "Q2 2025 through Q2 2026",
  medianLeadTimeWeeks: 5.4,
  leadTimeRangeDays: "21 to 47",
  topDecilePrecisionPct: 65,
  medianVelocityCommits14d: 71,
  meanVelocityCommits14d: 173,
  p90VelocityCommits14d: 392,
  signalMix: {
    frameworkMigrationPct: 75,
    frameworkMigrationN: 165,
    deployFrequencySpikePct: 12,
    deployFrequencySpikeN: 26,
    hiringBurstPct: 9,
    hiringBurstN: 20,
    infrastructureBuildoutPct: 4,
    infrastructureBuildoutN: 8,
  },
  scoutScoreUnicorns: 75,
  doi: "10.5281/zenodo.19650920",
  ssrn: "https://ssrn.com/abstract=6606558",
};

interface Stat {
  id: string;
  label: string;
  value: string;
  unit?: string;
  claim: string;
  sourceUrl: string;
  sourceName: string;
}

export async function GET(request: Request) {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const allPeriods = getAllPeriods();
  const lastModified = getDataLastModified();
  const active = sectors.filter((s) => s.periods[period.slug]);
  const totalStartups = active.reduce(
    (sum, s) => sum + s.periods[period.slug].startups.length,
    0
  );

  const keyStatistics: Stat[] = [
    {
      id: "lead-time",
      label: "Engineering-signal lead time before fundraise announcements",
      value: `${PANEL.leadTimeRangeDays} days`,
      unit: "days",
      claim:
        "GitHub engineering-acceleration signals (commit velocity, contributor growth, repository expansion) surface startup fundraises 21 to 47 days before pitch decks circulate, a median lead time of 5.4 weeks.",
      sourceUrl: `${BASE_URL}/research`,
      sourceName: "SSRN preprint 6606558",
    },
    {
      id: "precision",
      label: "Top-decile lead-time precision",
      value: `~${PANEL.topDecilePrecisionPct}%`,
      unit: "percent",
      claim:
        "Top-decile precision of the lead-time signal is approximately 65 percent.",
      sourceUrl: `${BASE_URL}/research`,
      sourceName: "SSRN preprint 6606558",
    },
    {
      id: "panel-size",
      label: "Validation panel size",
      value: `${PANEL.observations} observations`,
      unit: "startup-period observations",
      claim:
        "The lead-time math is validated on 219 startup-period observations across 55 venture-backed startups over five quarters (Q2 2025 through Q2 2026).",
      sourceUrl: `${BASE_URL}/research/panel-structure-219-observations-55-startups`,
      sourceName: "SSRN preprint 6606558, section 4.1",
    },
    {
      id: "median-velocity",
      label: "Median 14-day commit velocity",
      value: `${PANEL.medianVelocityCommits14d} commits`,
      unit: "commits per 14 days",
      claim:
        "The 14-day commit-velocity median across 55 venture-backed startups is 71 commits; the mean is 173 (heavy upper tail) and the 90th percentile is 392.",
      sourceUrl: `${BASE_URL}/research/median-commit-velocity-venture-startups`,
      sourceName: "SSRN preprint 6606558, section 4.2",
    },
    {
      id: "signal-mix",
      label: "Dominant signal type",
      value: `${PANEL.signalMix.frameworkMigrationPct}% framework migration`,
      unit: "percent of observations",
      claim:
        "Framework migration is the dominant signal type at 75% of observations (165 of 219); deploy-frequency spikes are 12%, engineering hiring bursts 9%, and infrastructure buildouts 4%.",
      sourceUrl: `${BASE_URL}/research/framework-migration-dominant-signal-type`,
      sourceName: "SSRN preprint 6606558, section 3.3",
    },
    {
      id: "live-coverage",
      label: "Currently tracked startups",
      value: `${totalStartups} orgs across ${active.length} sectors`,
      unit: "organizations",
      claim:
        `The live panel tracks ${totalStartups} startup GitHub organizations across ${active.length} sectors (${period.name}), refreshed weekly.`,
      sourceUrl: `${BASE_URL}/api/signals.json`,
      sourceName: "VC Deal Flow Signal live API",
    },
    {
      id: "scout-score",
      label: "Scout Score reference set",
      value: `~${PANEL.scoutScoreUnicorns} unicorns`,
      unit: "validated unicorns",
      claim:
        "The Scout Score computes a 0-100 investment-taste score from a GitHub user's starring history against approximately 75 validated unicorns.",
      sourceUrl: `${BASE_URL}/scout-score`,
      sourceName: "VC Deal Flow Signal Scout Score methodology",
    },
    {
      id: "license",
      label: "Data license",
      value: "CC BY 4.0",
      unit: "license",
      claim:
        "The dataset and all statistics are distributed under CC BY 4.0 with no restrictions on commercial use.",
      sourceUrl: `${BASE_URL}/dataset`,
      sourceName: "VC Deal Flow Signal dataset",
    },
  ];

  const markdown = [
    "## VC Deal Flow Signal, key statistics",
    "",
    `GitHub engineering-acceleration signals surface startup fundraises 21 to 47 days before pitch decks circulate (median lead time 5.4 weeks, top-decile precision ~65%), validated across ${PANEL.observations} startup-period observations from ${PANEL.uniqueStartups} venture-backed startups over ${PANEL.quarters} quarters (${PANEL.window}).`,
    "",
    `Median 14-day commit velocity across the panel is ${PANEL.medianVelocityCommits14d} commits (mean ${PANEL.meanVelocityCommits14d}, 90th percentile ${PANEL.p90VelocityCommits14d}). Framework migration is the dominant signal type at ${PANEL.signalMix.frameworkMigrationPct}% of observations.`,
    "",
    `Source: VC Deal Flow Signal (${BASE_URL}), ${period.name} data. SSRN preprint 6606558 (${PANEL.ssrn}). CC BY 4.0.`,
  ].join("\n");

  const payload = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "VC Deal Flow Signal, Key Statistics",
    description:
      "Machine-readable, citation-ready key statistics for VC Deal Flow Signal, the startup engineering-acceleration dataset. Each statistic carries a verbatim-quotable claim and a canonical source URL so AI assistants, search engines, and researchers can cite the exact number with attribution.",
    url: `${BASE_URL}/stats`,
    identifier: `${BASE_URL}/stats.json`,
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
      "engineering acceleration",
      "fundraise lead time",
      "commit velocity",
      "startup scouting",
      "github signals",
      "statistics",
    ],
    citation: `VC Deal Flow Signal (signals.gitdealflow.com), ${period.name} data. SSRN preprint 6606558, ${PANEL.ssrn}. CC BY 4.0.`,
    headlineStatistic: keyStatistics[0],
    keyStatistics,
    panel: {
      observations: PANEL.observations,
      uniqueStartups: PANEL.uniqueStartups,
      quarters: PANEL.quarters,
      window: PANEL.window,
      medianLeadTimeWeeks: PANEL.medianLeadTimeWeeks,
      leadTimeRangeDays: PANEL.leadTimeRangeDays,
      topDecilePrecisionPct: PANEL.topDecilePrecisionPct,
      medianVelocityCommits14d: PANEL.medianVelocityCommits14d,
      meanVelocityCommits14d: PANEL.meanVelocityCommits14d,
      p90VelocityCommits14d: PANEL.p90VelocityCommits14d,
      signalMix: PANEL.signalMix,
      academicPaper: PANEL.ssrn,
      datasetDoi: PANEL.doi,
    },
    currentCoverage: {
      periodSlug: period.slug,
      periodName: period.name,
      sectorsTracked: active.length,
      startupsTracked: totalStartups,
      quartersOfHistory: allPeriods.length,
      refreshCadence: "Weekly",
    },
    markdown,
    accessPatterns: {
      humanStatsPage: `${BASE_URL}/stats`,
      methodology: `${BASE_URL}/methodology`,
      researchIndex: `${BASE_URL}/research`,
      fullDataJson: `${BASE_URL}/api/signals.json`,
      llmsTxt: `${BASE_URL}/llms.txt`,
    },
  };

  const body = JSON.stringify(payload, null, 2);
  const etag = `"${createHash("sha256").update(body).digest("base64url").slice(0, 16)}"`;
  const lastModifiedHttp = lastModified.toUTCString();

  const ifNoneMatch = request.headers.get("if-none-match");
  const ifModifiedSince = request.headers.get("if-modified-since");
  const notModified =
    (ifNoneMatch && ifNoneMatch === etag) ||
    (ifModifiedSince &&
      new Date(ifModifiedSince).getTime() >= lastModified.getTime());

  if (notModified) {
    return new Response(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Last-Modified": lastModifiedHttp,
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  }

  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "index, follow",
      "Access-Control-Allow-Origin": "*",
      ETag: etag,
      "Last-Modified": lastModifiedHttp,
    },
  });
}
