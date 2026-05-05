import {
  getAllSectors,
  getCurrentPeriod,
  getSortedStartups,
  getStartupProfile,
  type Startup,
} from "@/lib/data";
import { slugify } from "@/lib/slugify";

const BASE_URL = "https://signals.gitdealflow.com";

function parsePercent(s: string): number {
  const n = parseInt(s.replace(/[^0-9-]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function scoreVelocity(velocityChangePercent: number): number {
  return clamp01(50 + velocityChangePercent / 4);
}

function scoreGrowth(growthPercent: number): number {
  return clamp01(50 + growthPercent / 2);
}

function scoreNovelty(newRepos: number): number {
  return clamp01(100 * (1 - Math.pow(0.85, newRepos)));
}

function thesisFor(
  s: Startup,
  sectorName: string,
  scores: { velocity: number; growth: number; novelty: number; composite: number },
): string {
  const lead =
    s.signalType === "breakout"
      ? `${s.name} is in active breakout`
      : s.signalType === "acceleration"
      ? `${s.name} is sustaining acceleration`
      : s.signalType === "cooling"
      ? `${s.name} is cooling`
      : `${s.name} is steady-state`;
  const dominant =
    scores.velocity >= Math.max(scores.growth, scores.novelty)
      ? `commit velocity (${s.commitVelocityChange})`
      : scores.growth >= scores.novelty
      ? `contributor growth (${s.contributorGrowth})`
      : `repo expansion (${s.newRepos} new repos in 30d)`;
  const stageBit = s.stage && s.stage !== "Unknown" ? ` at ${s.stage}` : "";
  const closing =
    scores.composite >= 70
      ? `Worth diligence this week.`
      : scores.composite >= 50
      ? `Watch-list candidate; revisit if velocity holds.`
      : `Below median for ${sectorName}; pass unless thesis-aligned.`;
  return `${lead}${stageBit} in ${sectorName} — driven primarily by ${dominant}. ${closing}`;
}

export interface DeepSignal {
  name: string;
  found: true;
  sector: string;
  stage: string;
  geography: string;
  signalType: string;
  commitVelocity14d: number;
  commitVelocityChange: string;
  contributors: number;
  contributorGrowth: string;
  newRepos: number;
  scores: {
    velocity: number;
    growth: number;
    novelty: number;
    composite: number;
  };
  rank: {
    inSector: number;
    sectorTotal: number;
    sectorPercentile: number;
  };
  thesis: string;
  comparables: Array<{ name: string; commitVelocityChange: string; signalType: string }>;
  history: Array<{
    period: string;
    commitVelocity14d: number;
    commitVelocityChange: string;
    contributors: number;
    signalType: string;
  }>;
  links: {
    githubUrl: string;
    websiteUrl?: string;
    linkedinUrl?: string;
    profileUrl: string;
  };
  citation: string;
  source: string;
}

export type DeepSignalMiss = { found: false; suggestion: string };
export type DeepSignalResult = DeepSignal | DeepSignalMiss;

export function buildDeepSignal(name: string): DeepSignalResult {
  const slug = slugify(name);
  const period = getCurrentPeriod();
  const sectors = getAllSectors();

  let foundStartup: Startup | null = null;
  let foundSector: { slug: string; name: string } | null = null;

  for (const sector of sectors) {
    const snap = sector.periods[period.slug];
    if (!snap) continue;
    const match = snap.startups.find((st) => slugify(st.name) === slug);
    if (match) {
      foundStartup = match;
      foundSector = { slug: sector.slug, name: sector.name };
      break;
    }
  }

  if (!foundStartup || !foundSector) {
    return {
      found: false,
      suggestion:
        "Use the free /api/signal endpoint or get_trending_startups MCP tool to discover the correct name.",
    };
  }

  const sector = sectors.find((s) => s.slug === foundSector!.slug)!;
  const sectorStartups = getSortedStartups(sector.periods[period.slug].startups);
  const sectorTotal = sectorStartups.length;
  const sectorRank = sectorStartups.findIndex((s) => slugify(s.name) === slug) + 1;
  const sectorPercentile =
    sectorTotal > 0 ? Math.round(((sectorTotal - sectorRank + 1) / sectorTotal) * 100) : 0;

  const velocityPct = parsePercent(foundStartup.commitVelocityChange);
  const growthPct = parsePercent(foundStartup.contributorGrowth);
  const novelty = scoreNovelty(foundStartup.newRepos);
  const velocity = scoreVelocity(velocityPct);
  const growth = scoreGrowth(growthPct);
  const composite = clamp01(0.5 * velocity + 0.3 * growth + 0.2 * novelty);

  const scores = { velocity, growth, novelty, composite };

  const comparables = sectorStartups
    .filter((s) => slugify(s.name) !== slug)
    .slice(0, 3)
    .map((s) => ({
      name: s.name,
      commitVelocityChange: s.commitVelocityChange,
      signalType: s.signalType,
    }));

  const profile = getStartupProfile(slug);
  const history =
    profile?.history.slice(0, 6).map((h) => ({
      period: h.periodName,
      commitVelocity14d: h.commitVelocity14d,
      commitVelocityChange: h.commitVelocityChange,
      contributors: h.contributors,
      signalType: h.signalType,
    })) ?? [];

  return {
    name: foundStartup.name,
    found: true,
    sector: foundSector.name,
    stage: foundStartup.stage,
    geography: foundStartup.geography,
    signalType: foundStartup.signalType,
    commitVelocity14d: foundStartup.commitVelocity14d,
    commitVelocityChange: foundStartup.commitVelocityChange,
    contributors: foundStartup.contributors,
    contributorGrowth: foundStartup.contributorGrowth,
    newRepos: foundStartup.newRepos,
    scores,
    rank: {
      inSector: sectorRank,
      sectorTotal,
      sectorPercentile,
    },
    thesis: thesisFor(foundStartup, foundSector.name, scores),
    comparables,
    history,
    links: {
      githubUrl: foundStartup.githubUrl,
      ...(foundStartup.websiteUrl ? { websiteUrl: foundStartup.websiteUrl } : {}),
      ...(foundStartup.linkedinUrl ? { linkedinUrl: foundStartup.linkedinUrl } : {}),
      profileUrl: `${BASE_URL}/startup/${slug}`,
    },
    citation: `VC Deal Flow Signal (signals.gitdealflow.com), ${period.name} data — deep signal v1.`,
    source: BASE_URL,
  };
}
