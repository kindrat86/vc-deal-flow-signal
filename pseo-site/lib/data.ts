import "server-only";
import * as fs from "fs";
import * as path from "path";
import { slugify } from "@/lib/slugify";
import startupsData from "@/data/startups.json";
import enrichmentData from "@/data/enrichment.json";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Startup {
  name: string;
  description: string;
  stage: string;
  geography: string;
  commitVelocity14d: number;
  commitVelocityChange: string;
  contributors: number;
  contributorGrowth: string;
  newRepos: number;
  signalType: string;
  githubUrl: string;
  // Enrichment fields (Insider-only)
  fundingTotal?: string;
  lastRoundType?: string;
  teamSize?: number;
  foundedYear?: number;
}

const enrichment = enrichmentData as Record<string, {
  fundingTotal?: string;
  lastRoundType?: string;
  teamSize?: number;
  foundedYear?: number;
}>;

/** Merge enrichment data into a startup record */
export function enrichStartup(startup: Startup): Startup {
  const extra = enrichment[startup.name];
  if (!extra) return startup;
  return { ...startup, ...extra };
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface SectorSnapshot {
  intro: string;
  startups: Startup[];
  faqs: FAQ[];
}

export interface Sector {
  slug: string;
  name: string;
  description: string;
  relatedSlugs: string[];
  periods: Record<string, SectorSnapshot>;
}

export interface Period {
  slug: string;
  name: string;
  current: boolean;
}

interface StartupsData {
  sectors: Sector[];
  periods: Period[];
}

const data = startupsData as unknown as StartupsData;

// ---------------------------------------------------------------------------
// Sector + period queries
// ---------------------------------------------------------------------------

export function getAllSectors(): Sector[] {
  return data.sectors;
}

export function getCurrentPeriod(): Period {
  return data.periods.find((p) => p.current) ?? data.periods[0];
}

export function getAllPeriods(): Period[] {
  return data.periods;
}

/**
 * Returns all page slugs in the format `{sector}-{period}`.
 * E.g. "ai-ml-q2-2026"
 */
export function getAllPageSlugs(): string[] {
  const slugs: string[] = [];
  for (const sector of data.sectors) {
    for (const periodSlug of Object.keys(sector.periods)) {
      slugs.push(`${sector.slug}-${periodSlug}`);
    }
  }
  return slugs;
}

/**
 * Parses a combined slug like "ai-ml-q2-2026" into its sector and period parts.
 * Returns null if no match is found.
 */
export function parsePageSlug(slug: string): {
  sector: Sector;
  period: Period;
  snapshot: SectorSnapshot;
} | null {
  // Try matching each sector slug — the period slug is whatever remains after removing
  // the sector slug prefix + the separator dash.
  // Sort sectors by slug length descending so "data-infrastructure" matches before "data".
  const sorted = [...data.sectors].sort(
    (a, b) => b.slug.length - a.slug.length
  );

  for (const sector of sorted) {
    const prefix = `${sector.slug}-`;
    if (slug.startsWith(prefix)) {
      const periodSlug = slug.slice(prefix.length);
      const snapshot = sector.periods[periodSlug];
      const period = data.periods.find((p) => p.slug === periodSlug);
      if (snapshot && period) {
        return { sector, period, snapshot };
      }
    }
  }
  return null;
}

export function getSortedStartups(startups: Startup[]): Startup[] {
  return [...startups].sort((a, b) => {
    const aVal = parseInt(a.commitVelocityChange.replace(/[^0-9-]/g, ""), 10) || 0;
    const bVal = parseInt(b.commitVelocityChange.replace(/[^0-9-]/g, ""), 10) || 0;
    return bVal - aVal;
  });
}

/**
 * Returns related sectors with a link to the same period.
 */
export function getRelatedSectors(
  sector: Sector,
  periodSlug: string
): { name: string; slug: string; startupCount: number }[] {
  return sector.relatedSlugs
    .map((relSlug) => {
      const rel = data.sectors.find((s) => s.slug === relSlug);
      if (!rel || !rel.periods[periodSlug]) return null;
      return {
        name: rel.name,
        slug: `${rel.slug}-${periodSlug}`,
        startupCount: rel.periods[periodSlug].startups.length,
      };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null)
    .slice(0, 3);
}

/**
 * Generates a self-contained key takeaway summary for a sector snapshot.
 * Designed to be extractable by AI models without surrounding context.
 */
export function getKeyTakeaway(
  sectorName: string,
  periodName: string,
  snapshot: SectorSnapshot
): string {
  const startups = [...snapshot.startups].sort((a, b) => {
    const aVal =
      parseInt(a.commitVelocityChange.replace(/[^0-9-]/g, ""), 10) || 0;
    const bVal =
      parseInt(b.commitVelocityChange.replace(/[^0-9-]/g, ""), 10) || 0;
    return bVal - aVal;
  });

  if (startups.length === 0) return "";

  const top = startups[0];
  const positive = startups.filter(
    (s) =>
      s.commitVelocityChange.startsWith("+") &&
      s.commitVelocityChange !== "+0%"
  ).length;
  const avgVelocity = Math.round(
    startups.reduce((s, x) => s + x.commitVelocity14d, 0) / startups.length
  );

  const signals: Record<string, number> = {};
  for (const s of startups) {
    signals[s.signalType] = (signals[s.signalType] || 0) + 1;
  }
  const topSignal = Object.entries(signals).sort(
    ([, a], [, b]) => b - a
  )[0][0];

  return `In ${periodName}, ${positive} of ${startups.length} tracked ${sectorName.toLowerCase()} startups show positive engineering acceleration. ${top.name} leads with ${top.commitVelocity14d} commits over 14 days (${top.commitVelocityChange} change). The dominant signal pattern is "${topSignal}". Average sector commit velocity is ${avgVelocity} commits per 14-day window. These engineering momentum signals have historically preceded fundraise announcements by six to twelve weeks.`;
}

// ---------------------------------------------------------------------------
// Geography pages
// ---------------------------------------------------------------------------

const GEO_DEFINITIONS = [
  { slug: "us", name: "United States", match: "US" },
  { slug: "uk", name: "United Kingdom", match: "UK" },
  { slug: "europe", name: "Europe", match: "EU" },
  { slug: "apac", name: "Asia-Pacific", match: "APAC" },
  { slug: "canada", name: "Canada", match: "Canada" },
  { slug: "latam", name: "Latin America", match: "LATAM" },
  { slug: "mena", name: "Middle East & North Africa", match: "MENA" },
] as const;

export interface GeoPageData {
  geoSlug: string;
  geoName: string;
  sector: Sector;
  period: Period;
  startups: Startup[];
}

/**
 * Returns all geo page slugs in format `{sector}-{geo}-{period}`.
 * Only generates pages where at least 2 startups match the geography.
 */
export function getAllGeoPageSlugs(): string[] {
  const slugs: string[] = [];
  for (const sector of data.sectors) {
    for (const [periodSlug, snapshot] of Object.entries(sector.periods)) {
      for (const geo of GEO_DEFINITIONS) {
        const matching = snapshot.startups.filter(
          (s) => s.geography === geo.match
        );
        if (matching.length >= 2) {
          slugs.push(`${sector.slug}-${geo.slug}-${periodSlug}`);
        }
      }
    }
  }
  return slugs;
}

/**
 * Parses a geo page slug like "ai-ml-us-q2-2026" into its components.
 */
export function parseGeoPageSlug(slug: string): GeoPageData | null {
  const sorted = [...data.sectors].sort(
    (a, b) => b.slug.length - a.slug.length
  );

  for (const sector of sorted) {
    const prefix = `${sector.slug}-`;
    if (!slug.startsWith(prefix)) continue;

    const rest = slug.slice(prefix.length);
    for (const geo of GEO_DEFINITIONS) {
      const geoPrefix = `${geo.slug}-`;
      if (!rest.startsWith(geoPrefix)) continue;

      const periodSlug = rest.slice(geoPrefix.length);
      const snapshot = sector.periods[periodSlug];
      const period = data.periods.find((p) => p.slug === periodSlug);
      if (!snapshot || !period) continue;

      const startups = snapshot.startups.filter(
        (s) => s.geography === geo.match
      );
      if (startups.length < 2) continue;

      return {
        geoSlug: geo.slug,
        geoName: geo.name,
        sector,
        period,
        startups,
      };
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Signal-type aggregation
// ---------------------------------------------------------------------------

export const SIGNAL_TYPES = [
  {
    slug: "hiring-burst",
    name: "Engineering Hiring Burst",
    match: "Engineering hiring burst",
    description:
      "Startups whose contributor growth rate exceeds 50%, indicating rapid team expansion — often following a recent funding round.",
    investorInsight:
      "If you are seeing a hiring burst signal, you may be too late for the current round but well-positioned for the next one. The team expansion suggests the company has capital to deploy and is building toward a product milestone.",
  },
  {
    slug: "infrastructure-buildout",
    name: "Infrastructure Buildout",
    match: "Infrastructure buildout",
    description:
      "Startups that created 3+ new public repositories in 30 days, expanding their technical surface area with new microservices, SDKs, or platform components.",
    investorInsight:
      "Infrastructure buildout is classic Series A behavior: the core product works, and the team is building the platform around it. This pattern requires capital and reflects confidence in the product direction.",
  },
  {
    slug: "deploy-frequency-spike",
    name: "Deploy Frequency Spike",
    match: "Deploy frequency spike",
    description:
      "Startups whose commit velocity increased 150%+ versus baseline — the team is shipping code at an unusually high rate.",
    investorInsight:
      "Deploy frequency spikes indicate a product launch, rapid iteration on customer feedback, or a competitive response. All are potential indicators of product-market fit and interesting timing for investors.",
  },
  {
    slug: "framework-migration",
    name: "Framework Migration",
    match: "Framework migration",
    description:
      "Startups showing general engineering acceleration that indicates a technology stack transition — moving from prototype to production infrastructure.",
    investorInsight:
      "Framework migrations are the subtlest signal type but can indicate the shift from exploration to exploitation — a key milestone in startup development that often precedes fundraising.",
  },
] as const;

export type SignalTypeSlug = (typeof SIGNAL_TYPES)[number]["slug"];

export interface SignalTypePageData {
  slug: string;
  name: string;
  description: string;
  investorInsight: string;
  startups: (Startup & { sectorName: string; sectorSlug: string })[];
  totalAcrossSectors: number;
  topSectors: { name: string; count: number }[];
}

export function getSignalTypeData(slug: string): SignalTypePageData | null {
  const signalDef = SIGNAL_TYPES.find((s) => s.slug === slug);
  if (!signalDef) return null;

  const period = getCurrentPeriod();
  const sectors = getAllSectors();
  const activeSectors = sectors.filter((s) => s.periods[period.slug]);

  const startups: SignalTypePageData["startups"] = [];
  const sectorCounts: Record<string, number> = {};

  for (const sector of activeSectors) {
    const snapshot = sector.periods[period.slug];
    for (const s of snapshot.startups) {
      if (s.signalType === signalDef.match) {
        startups.push({ ...s, sectorName: sector.name, sectorSlug: sector.slug });
        sectorCounts[sector.name] = (sectorCounts[sector.name] || 0) + 1;
      }
    }
  }

  const sorted = getSortedStartups(startups) as SignalTypePageData["startups"];

  const topSectors = Object.entries(sectorCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return {
    slug: signalDef.slug,
    name: signalDef.name,
    description: signalDef.description,
    investorInsight: signalDef.investorInsight,
    startups: sorted,
    totalAcrossSectors: startups.length,
    topSectors,
  };
}

// ---------------------------------------------------------------------------
// "Best [sector] startups" pages
// ---------------------------------------------------------------------------

export interface BestSectorPageData {
  sector: Sector;
  period: Period;
  snapshot: SectorSnapshot;
  year: string;
}

export function getAllBestSectorSlugs(): string[] {
  const period = getCurrentPeriod();
  const year = period.name.match(/\d{4}/)?.[0] ?? "2026";
  return data.sectors
    .filter((s) => s.periods[period.slug])
    .map((s) => `${s.slug}-${year}`);
}

export function parseBestSectorSlug(slug: string): BestSectorPageData | null {
  const yearMatch = slug.match(/-(\d{4})$/);
  if (!yearMatch) return null;
  const year = yearMatch[1];
  const sectorSlug = slug.slice(0, -(year.length + 1));

  const sector = data.sectors.find((s) => s.slug === sectorSlug);
  if (!sector) return null;

  const period = getCurrentPeriod();
  const snapshot = sector.periods[period.slug];
  if (!snapshot) return null;

  return { sector, period, snapshot, year };
}

// ---------------------------------------------------------------------------
// Trend pages (period-over-period comparison)
// ---------------------------------------------------------------------------

export interface TrendPageData {
  sector: Sector;
  periodA: Period;
  periodB: Period;
  snapshotA: SectorSnapshot;
  snapshotB: SectorSnapshot;
}

/**
 * Returns trend page slugs for sectors with 2+ consecutive periods.
 * Format: `{sector}-{periodA}-vs-{periodB}`
 */
export function getAllTrendSlugs(): string[] {
  const slugs: string[] = [];
  const periodSlugs = data.periods.map((p) => p.slug);

  for (const sector of data.sectors) {
    for (let i = 0; i < periodSlugs.length - 1; i++) {
      const a = periodSlugs[i];
      const b = periodSlugs[i + 1];
      if (sector.periods[a] && sector.periods[b]) {
        slugs.push(`${sector.slug}-${a}-vs-${b}`);
      }
    }
  }
  return slugs;
}

export function parseTrendSlug(slug: string): TrendPageData | null {
  const vsMatch = slug.match(/^(.+)-(q\d-\d{4})-vs-(q\d-\d{4})$/);
  if (!vsMatch) return null;

  const [, sectorSlug, periodASlug, periodBSlug] = vsMatch;
  const sector = data.sectors.find((s) => s.slug === sectorSlug);
  if (!sector) return null;

  const periodA = data.periods.find((p) => p.slug === periodASlug);
  const periodB = data.periods.find((p) => p.slug === periodBSlug);
  if (!periodA || !periodB) return null;

  const snapshotA = sector.periods[periodASlug];
  const snapshotB = sector.periods[periodBSlug];
  if (!snapshotA || !snapshotB) return null;

  return { sector, periodA, periodB, snapshotA, snapshotB };
}

/** Returns the mtime of data/startups.json as the "last modified" date for all pSEO pages. */
export function getDataLastModified(): Date {
  try {
    const filePath = path.join(process.cwd(), "data", "startups.json");
    const stat = fs.statSync(filePath);
    return stat.mtime;
  } catch {
    return new Date();
  }
}

// ---------------------------------------------------------------------------
// Individual startup pages
// ---------------------------------------------------------------------------

// Use shared slugify() from @/lib/slugify
const toSlug = slugify;

export interface StartupPeriodEntry {
  periodSlug: string;
  periodName: string;
  sectorSlug: string;
  sectorName: string;
  commitVelocity14d: number;
  commitVelocityChange: string;
  contributors: number;
  contributorGrowth: string;
  newRepos: number;
  signalType: string;
  stage: string;
  geography: string;
}

export interface StartupProfile {
  slug: string;
  name: string;
  description: string;
  githubUrl: string;
  sectors: string[];
  latestStage: string;
  latestGeography: string;
  history: StartupPeriodEntry[];
}

/**
 * Builds a de-duplicated map of all startups across every sector and period.
 * Keyed by URL slug derived from the startup name.
 */
function buildStartupIndex(): Map<string, StartupProfile> {
  const index = new Map<string, StartupProfile>();

  for (const sector of data.sectors) {
    for (const [periodSlug, snapshot] of Object.entries(sector.periods)) {
      const period = data.periods.find((p) => p.slug === periodSlug);
      if (!period) continue;

      for (const s of snapshot.startups) {
        const slug = toSlug(s.name);
        let profile = index.get(slug);

        if (!profile) {
          profile = {
            slug,
            name: s.name,
            description: s.description,
            githubUrl: s.githubUrl,
            sectors: [],
            latestStage: s.stage,
            latestGeography: s.geography,
            history: [],
          };
          index.set(slug, profile);
        }

        if (!profile.sectors.includes(sector.name)) {
          profile.sectors.push(sector.name);
        }

        profile.history.push({
          periodSlug,
          periodName: period.name,
          sectorSlug: sector.slug,
          sectorName: sector.name,
          commitVelocity14d: s.commitVelocity14d,
          commitVelocityChange: s.commitVelocityChange,
          contributors: s.contributors,
          contributorGrowth: s.contributorGrowth,
          newRepos: s.newRepos,
          signalType: s.signalType,
          stage: s.stage,
          geography: s.geography,
        });
      }
    }
  }

  // Sort each startup's history by period (most recent first)
  const periodOrder = data.periods.map((p) => p.slug);
  for (const profile of index.values()) {
    profile.history.sort(
      (a, b) => periodOrder.indexOf(a.periodSlug) - periodOrder.indexOf(b.periodSlug)
    );
    // Update latest fields from the most recent entry
    const latest = profile.history[0];
    if (latest) {
      profile.latestStage = latest.stage;
      profile.latestGeography = latest.geography;
    }
  }

  return index;
}

let _startupIndex: Map<string, StartupProfile> | null = null;
function getStartupIndex(): Map<string, StartupProfile> {
  if (!_startupIndex) _startupIndex = buildStartupIndex();
  return _startupIndex;
}

export function getAllStartupSlugs(): string[] {
  return Array.from(getStartupIndex().keys());
}

export function getStartupProfile(slug: string): StartupProfile | undefined {
  return getStartupIndex().get(slug);
}
