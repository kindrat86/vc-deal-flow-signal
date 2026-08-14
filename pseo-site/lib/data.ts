import "server-only";
import * as fs from "fs";
import * as path from "path";
import { slugify } from "@/lib/slugify";
import startupsData from "@/data/startups.json";
import enrichmentData from "@/data/enrichment.json";
import linksData from "@/data/links.json";

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
  // Outbound links, websiteUrl comes from the GitHub crawler when the org
  // exposes a `blog` field; linkedinUrl is populated by the Apollo gap-fill
  // pass. Both sit in data/links.json (name-keyed) and get merged in via
  // enrichLinks() below, mirroring the enrichment.json pattern.
  websiteUrl?: string;
  linkedinUrl?: string;
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

const links = linksData as Record<string, {
  websiteUrl?: string;
  linkedinUrl?: string;
}>;

/** Merge enrichment data into a startup record */
export function enrichStartup(startup: Startup): Startup {
  const extra = enrichment[startup.name];
  if (!extra) return startup;
  return { ...startup, ...extra };
}

/**
 * Merge outbound-link data into a startup record. Existing non-empty fields
 * on the startup (e.g. websiteUrl harvested from GitHub's `blog` field) take
 * precedence over the Apollo cache, the cache is a fallback, not an override.
 */
export function enrichLinks(startup: Startup): Startup {
  const extra = links[startup.name];
  if (!extra) return startup;
  return {
    ...startup,
    websiteUrl: startup.websiteUrl || extra.websiteUrl,
    linkedinUrl: startup.linkedinUrl || extra.linkedinUrl,
  };
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

// Merge data/links.json into every startup record once at module load so any
// consumer iterating `data.sectors[*].periods[*].startups` sees websiteUrl +
// linkedinUrl without having to call enrichLinks() themselves. websiteUrl on
// the raw record (harvested by the GitHub crawler) always wins over the Apollo
// cache, see enrichLinks() above for the precedence rule.
for (const sector of data.sectors) {
  for (const snapshot of Object.values(sector.periods)) {
    snapshot.startups = snapshot.startups.map(enrichLinks);
  }
}

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
  // Try matching each sector slug, the period slug is whatever remains after removing
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

export interface TopMover extends Startup {
  sectorName: string;
  sectorSlug: string;
  velocityChangePct: number;
}

/**
 * Returns the top-N movers across every sector for the current period,
 * ranked by commitVelocityChange. Used by the homepage hero so visitors
 * see live, named startups instead of an abstract pitch.
 *
 * Applies a minimum-base-rate filter (default: 30 commits in the 14-day
 * window) so a startup that goes from 1 → 6 commits doesn't dominate the
 * homepage with a meaningless +999%. The floor is generous enough to keep
 * legitimately small-but-active orgs eligible while filtering pure noise.
 */
export function getTopMoversThisWeek(
  limit = 3,
  minCommits14d = 30
): TopMover[] {
  const period = getCurrentPeriod();
  const all: TopMover[] = [];
  for (const sector of data.sectors) {
    const snap = sector.periods[period.slug];
    if (!snap) continue;
    for (const s of snap.startups) {
      if (s.commitVelocity14d < minCommits14d) continue;
      const pct =
        parseInt(s.commitVelocityChange.replace(/[^0-9-]/g, ""), 10) || 0;
      all.push({
        ...s,
        sectorName: sector.name,
        sectorSlug: sector.slug,
        velocityChangePct: pct,
      });
    }
  }
  return all
    .sort((a, b) => b.velocityChangePct - a.velocityChangePct)
    .slice(0, limit);
}

/**
 * Total tracked startup count for the current period, used for the
 * social-proof bar and homepage credibility chips.
 */
export function getTotalTrackedThisWeek(): number {
  const period = getCurrentPeriod();
  return data.sectors.reduce((sum, sector) => {
    const snap = sector.periods[period.slug];
    return snap ? sum + snap.startups.length : sum;
  }, 0);
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

  return `In ${periodName}, ${positive} of ${startups.length} tracked ${sectorName.toLowerCase()} startups show positive engineering acceleration. ${top.name} leads with ${top.commitVelocity14d} commits over 14 days (${top.commitVelocityChange} change). The dominant signal pattern is "${topSignal}". Average sector commit velocity is ${avgVelocity} commits per 14-day window. These engineering momentum signals have historically preceded fundraise announcements by three to six weeks.`;
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
 *
 * Emits ONLY slugs that `parseGeoPageSlug` will accept. A candidate is kept iff
 * round-tripping it back through the parser yields a non-null page, which
 * guarantees the generated set (used for both `generateStaticParams` and the
 * sitemap) can never diverge from what the route can actually render.
 *
 * Previously this used `matching.length >= 1` while the parser required
 * `>= 2`, so every single-startup geo combo became an indexable soft-404:
 * prerendered + sitemap-listed, HTTP 200 / index,follow, but `parseGeoPageSlug`
 * returned null so the page fell back to the default (home) title with no
 * FAQ/Article schema. That stranded 81 of 131 geo URLs. Deriving the list from
 * the parser makes the threshold a single source of truth.
 */
export function getAllGeoPageSlugs(): string[] {
  const slugs: string[] = [];
  for (const sector of data.sectors) {
    for (const periodSlug of Object.keys(sector.periods)) {
      for (const geo of GEO_DEFINITIONS) {
        const slug = `${sector.slug}-${geo.slug}-${periodSlug}`;
        if (parseGeoPageSlug(slug) !== null) {
          slugs.push(slug);
        }
      }
    }
  }
  return slugs;
}

// ---------------------------------------------------------------------------
// Region-only pages (all sectors rolled up by geography)
// ---------------------------------------------------------------------------

export interface RegionPageData {
  geoSlug: string;
  geoName: string;
  period: Period;
  startups: (Startup & { sectorName: string; sectorSlug: string })[];
  sectorBreakdown: { name: string; slug: string; count: number }[];
}

/**
 * Returns region-only page slugs in format `{geo}-{period}`.
 * Rolls up all sectors in a geography, gives /startups-to-watch/region/us-q2-2026.
 */
export function getAllRegionPageSlugs(): string[] {
  const slugs: string[] = [];
  const periodSlugs = data.periods.map((p) => p.slug);

  for (const periodSlug of periodSlugs) {
    for (const geo of GEO_DEFINITIONS) {
      let total = 0;
      for (const sector of data.sectors) {
        const snapshot = sector.periods[periodSlug];
        if (!snapshot) continue;
        total += snapshot.startups.filter((s) => s.geography === geo.match).length;
      }
      if (total >= 3) {
        slugs.push(`${geo.slug}-${periodSlug}`);
      }
    }
  }
  return slugs;
}

export function parseRegionPageSlug(slug: string): RegionPageData | null {
  for (const geo of GEO_DEFINITIONS) {
    const prefix = `${geo.slug}-`;
    if (!slug.startsWith(prefix)) continue;
    const periodSlug = slug.slice(prefix.length);
    const period = data.periods.find((p) => p.slug === periodSlug);
    if (!period) continue;

    const startups: RegionPageData["startups"] = [];
    const sectorCounts: Record<string, { name: string; slug: string; count: number }> = {};

    for (const sector of data.sectors) {
      const snapshot = sector.periods[periodSlug];
      if (!snapshot) continue;
      const matching = snapshot.startups.filter((s) => s.geography === geo.match);
      if (matching.length === 0) continue;

      sectorCounts[sector.slug] = {
        name: sector.name,
        slug: `${sector.slug}-${periodSlug}`,
        count: matching.length,
      };
      for (const s of matching) {
        startups.push({ ...s, sectorName: sector.name, sectorSlug: sector.slug });
      }
    }

    if (startups.length < 3) return null;

    const sectorBreakdown = Object.values(sectorCounts).sort(
      (a, b) => b.count - a.count
    );

    return {
      geoSlug: geo.slug,
      geoName: geo.name,
      period,
      startups,
      sectorBreakdown,
    };
  }
  return null;
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
// Stage-axis pages (pre-seed, seed, series-a-b, growth)
// ---------------------------------------------------------------------------

const STAGE_DEFINITIONS = [
  {
    slug: "pre-seed",
    name: "Pre-Seed",
    match: ["Pre-Seed", "Pre-seed", "PreSeed"],
    description:
      "Earliest-stage technical startups, typically before any institutional round. Engineering activity at this stage is the clearest leading indicator because there is little press, no fundraise announcement, and few public breadcrumbs other than the code itself.",
    investorInsight:
      "At pre-seed, the GitHub commit graph is often the only public signal of product velocity. Founders are heads-down shipping. A pre-seed startup showing sustained engineering acceleration over a multi-week window is a high-conviction outbound target before the seed round is live.",
  },
  {
    slug: "seed",
    name: "Seed",
    match: ["Seed"],
    description:
      "Seed-stage startups, typically post-angel/accelerator, pre-Series A. Engineering signals here often correlate with the first production build-out and the earliest customer-facing launches.",
    investorInsight:
      "Seed-stage acceleration is the sweet spot for scouts and solo GPs. Deploy-frequency spikes and infrastructure buildouts at this stage usually precede the Series A announcement by 6-12 weeks. The window to get in before the round is competitive is narrow but real.",
  },
  {
    slug: "series-a-b",
    name: "Series A / Series B",
    match: ["Series A", "Series A/B", "Series B", "A/B"],
    description:
      "Growth-stage technical startups that have closed institutional rounds. Engineering signals at this stage are less about discovery and more about validation of trajectory.",
    investorInsight:
      "At Series A/B, engineering acceleration is a trajectory signal rather than a discovery signal. A hiring burst or platform buildout often precedes the next round. Institutional investors use these signals to prioritize outreach and refine conviction before a lead term sheet.",
  },
  {
    slug: "growth",
    name: "Growth",
    match: ["Growth", "Late Stage", "Series C+", "Series C"],
    description:
      "Growth-stage startups at Series C and beyond. Engineering signals at this scale indicate platform expansion, new product line development, or preparation for an IPO or major strategic milestone.",
    investorInsight:
      "At growth stage, engineering signals indicate strategic direction, a major deploy-frequency spike often maps to a product launch; an infrastructure buildout often signals a new business line. Useful for secondary investors, growth funds, and corporate development teams benchmarking targets.",
  },
] as const;

export type StageSlug = (typeof STAGE_DEFINITIONS)[number]["slug"];

export interface StagePageData {
  slug: string;
  name: string;
  description: string;
  investorInsight: string;
  startups: (Startup & { sectorName: string; sectorSlug: string })[];
  sectorBreakdown: { name: string; slug: string; count: number }[];
  period: Period;
}

export function getAllStageSlugs(): string[] {
  return STAGE_DEFINITIONS.map((s) => s.slug);
}

export function getStagePageData(slug: string): StagePageData | null {
  const stageDef = STAGE_DEFINITIONS.find((s) => s.slug === slug);
  if (!stageDef) return null;

  // If the current period has no matching startups (e.g. fresh period rollover
  // before the discover-startups pipeline has populated stage data), fall back
  // through prior periods so the page always serves real content instead of a
  // not-found boundary. Returns null only when zero periods have any data.
  const periods = data.periods;
  const currentPeriod = getCurrentPeriod();
  const periodOrder = [currentPeriod, ...periods.filter((p) => p !== currentPeriod)];

  for (const period of periodOrder) {
    const startups: StagePageData["startups"] = [];
    const sectorCounts: Record<string, { name: string; slug: string; count: number }> = {};

    for (const sector of data.sectors) {
      const snapshot = sector.periods[period.slug];
      if (!snapshot) continue;
      const matching = snapshot.startups.filter((s) =>
        (stageDef.match as readonly string[]).some((m) => s.stage === m || s.stage.includes(m))
      );
      if (matching.length === 0) continue;

      sectorCounts[sector.slug] = {
        name: sector.name,
        slug: `${sector.slug}-${period.slug}`,
        count: matching.length,
      };
      for (const s of matching) {
        startups.push({ ...s, sectorName: sector.name, sectorSlug: sector.slug });
      }
    }

    if (startups.length === 0) continue; // try next period

    const sectorBreakdown = Object.values(sectorCounts).sort(
      (a, b) => b.count - a.count
    );

    return {
      slug: stageDef.slug,
      name: stageDef.name,
      description: stageDef.description,
      investorInsight: stageDef.investorInsight,
      startups: getSortedStartups(startups) as StagePageData["startups"],
      sectorBreakdown,
      period,
    };
  }

  return null; // genuinely no data in any period
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
      "Startups whose contributor growth rate exceeds 50%, indicating rapid team expansion, often following a recent funding round.",
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
      "Startups whose commit velocity increased 150%+ versus baseline, the team is shipping code at an unusually high rate.",
    investorInsight:
      "Deploy frequency spikes indicate a product launch, rapid iteration on customer feedback, or a competitive response. All are potential indicators of product-market fit and interesting timing for investors.",
  },
  {
    slug: "framework-migration",
    name: "Framework Migration",
    match: "Framework migration",
    description:
      "Startups showing general engineering acceleration that indicates a technology stack transition, moving from prototype to production infrastructure.",
    investorInsight:
      "Framework migrations are the subtlest signal type but can indicate the shift from exploration to exploitation, a key milestone in startup development that often precedes fundraising.",
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

// Vercel's build system resets file mtimes to 2018-10-20 (known platform
// quirk). If the raw mtime is older than this floor, fall back to the build
// timestamp so we never publish a 2018 "last modified" to LLMs or search
// engines.
const MTIME_FLOOR = new Date("2024-01-01T00:00:00.000Z").getTime();

export function getDataLastModified(): Date {
  try {
    const filePath = path.join(process.cwd(), "data", "startups.json");
    const stat = fs.statSync(filePath);
    if (stat.mtime.getTime() >= MTIME_FLOOR) return stat.mtime;
  } catch {
    // ignore
  }
  return new Date();
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
  websiteUrl?: string;
  linkedinUrl?: string;
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
          const withLinks = enrichLinks(s);
          profile = {
            slug,
            name: s.name,
            description: s.description,
            githubUrl: s.githubUrl,
            websiteUrl: withLinks.websiteUrl,
            linkedinUrl: withLinks.linkedinUrl,
            sectors: [],
            latestStage: s.stage,
            latestGeography: s.geography,
            history: [],
          };
          index.set(slug, profile);
        } else if (!profile.websiteUrl || !profile.linkedinUrl) {
          const withLinks = enrichLinks(s);
          profile.websiteUrl = profile.websiteUrl || withLinks.websiteUrl;
          profile.linkedinUrl = profile.linkedinUrl || withLinks.linkedinUrl;
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

// ---------------------------------------------------------------------------
// Startup × period pages (/startup/{slug}/{period})
// ---------------------------------------------------------------------------

export interface StartupPeriodData {
  profile: StartupProfile;
  entry: StartupPeriodEntry;
  prevEntry?: StartupPeriodEntry;
  nextEntry?: StartupPeriodEntry;
  sectorRank: number;
  sectorTotal: number;
}

export function getStartupPeriodData(
  startupSlug: string,
  periodSlug: string
): StartupPeriodData | null {
  const profile = getStartupProfile(startupSlug);
  if (!profile) return null;

  const idx = profile.history.findIndex((h) => h.periodSlug === periodSlug);
  if (idx === -1) return null;
  const entry = profile.history[idx];
  const prevEntry = profile.history[idx + 1];
  const nextEntry = idx > 0 ? profile.history[idx - 1] : undefined;

  const sector = data.sectors.find((s) => s.slug === entry.sectorSlug);
  const snapshot = sector?.periods[periodSlug];
  let sectorRank = 0;
  let sectorTotal = 0;
  if (snapshot) {
    const sorted = getSortedStartups(snapshot.startups);
    sectorTotal = sorted.length;
    sectorRank = sorted.findIndex((s) => toSlug(s.name) === startupSlug) + 1;
  }

  return { profile, entry, prevEntry, nextEntry, sectorRank, sectorTotal };
}

export function getAllStartupPeriodPairs(): { slug: string; period: string }[] {
  const pairs: { slug: string; period: string }[] = [];
  for (const profile of getStartupIndex().values()) {
    for (const h of profile.history) {
      pairs.push({ slug: profile.slug, period: h.periodSlug });
    }
  }
  return pairs;
}

// ---------------------------------------------------------------------------
// Stage × sector pages (/stage/{stage}/{sector})
// ---------------------------------------------------------------------------

export interface StageSectorPageData {
  stageSlug: string;
  stageName: string;
  stageDescription: string;
  stageInvestorInsight: string;
  sector: Sector;
  period: Period;
  startups: Startup[];
}

/**
 * Thin-cell suppression threshold for Cartesian pSEO routes.
 *
 * Cells with fewer than this many startups would render near-empty
 * tables, Google flags those as thin content and downranks the entire
 * site. We hide them from `generateStaticParams` and return `null` from
 * the data getters so the route 404s cleanly under `dynamicParams=false`.
 *
 * Set to 3: aggressive enough to drop the worst 1-2-startup cells,
 * generous enough that we keep ~95% of the existing surface area.
 * Override via env if you need to tune (CI experiments, full-graph audits).
 */
export const MIN_PSEO_CELL_SIZE = Number(
  process.env.PSEO_MIN_CELL_SIZE ?? 3,
);

export function getStageSectorData(
  stageSlug: string,
  sectorSlug: string
): StageSectorPageData | null {
  const stageDef = STAGE_DEFINITIONS.find((s) => s.slug === stageSlug);
  if (!stageDef) return null;
  const sector = data.sectors.find((s) => s.slug === sectorSlug);
  if (!sector) return null;
  const period = getCurrentPeriod();
  const snapshot = sector.periods[period.slug];
  if (!snapshot) return null;

  const matching = snapshot.startups.filter((s) =>
    (stageDef.match as readonly string[]).some(
      (m) => s.stage === m || s.stage.includes(m)
    )
  );
  if (matching.length < MIN_PSEO_CELL_SIZE) return null;

  return {
    stageSlug: stageDef.slug,
    stageName: stageDef.name,
    stageDescription: stageDef.description,
    stageInvestorInsight: stageDef.investorInsight,
    sector,
    period,
    startups: getSortedStartups(matching),
  };
}

export function getAllStageSectorPairs(): { stage: string; sector: string }[] {
  const pairs: { stage: string; sector: string }[] = [];
  const period = getCurrentPeriod();
  for (const stageDef of STAGE_DEFINITIONS) {
    for (const sector of data.sectors) {
      const snapshot = sector.periods[period.slug];
      if (!snapshot) continue;
      const matchCount = snapshot.startups.reduce(
        (n, s) =>
          (stageDef.match as readonly string[]).some(
            (m) => s.stage === m || s.stage.includes(m),
          )
            ? n + 1
            : n,
        0,
      );
      if (matchCount >= MIN_PSEO_CELL_SIZE) {
        pairs.push({ stage: stageDef.slug, sector: sector.slug });
      }
    }
  }
  return pairs;
}

// ---------------------------------------------------------------------------
// Signal × sector pages (/signals/{signal}/{sector})
// ---------------------------------------------------------------------------

export interface SignalSectorPageData {
  signalSlug: string;
  signalName: string;
  signalDescription: string;
  signalInvestorInsight: string;
  sector: Sector;
  period: Period;
  startups: Startup[];
}

export function getSignalSectorData(
  signalSlug: string,
  sectorSlug: string
): SignalSectorPageData | null {
  const signalDef = SIGNAL_TYPES.find((s) => s.slug === signalSlug);
  if (!signalDef) return null;
  const sector = data.sectors.find((s) => s.slug === sectorSlug);
  if (!sector) return null;
  const period = getCurrentPeriod();
  const snapshot = sector.periods[period.slug];
  if (!snapshot) return null;

  const matching = snapshot.startups.filter(
    (s) => s.signalType === signalDef.match
  );
  if (matching.length < MIN_PSEO_CELL_SIZE) return null;

  return {
    signalSlug: signalDef.slug,
    signalName: signalDef.name,
    signalDescription: signalDef.description,
    signalInvestorInsight: signalDef.investorInsight,
    sector,
    period,
    startups: getSortedStartups(matching),
  };
}

export function getAllSignalSectorPairs(): { signal: string; sector: string }[] {
  const pairs: { signal: string; sector: string }[] = [];
  const period = getCurrentPeriod();
  for (const signalDef of SIGNAL_TYPES) {
    for (const sector of data.sectors) {
      const snapshot = sector.periods[period.slug];
      if (!snapshot) continue;
      const matchCount = snapshot.startups.reduce(
        (n, s) => (s.signalType === signalDef.match ? n + 1 : n),
        0,
      );
      if (matchCount >= MIN_PSEO_CELL_SIZE) {
        pairs.push({ signal: signalDef.slug, sector: sector.slug });
      }
    }
  }
  return pairs;
}

// ---------------------------------------------------------------------------
// Stage × signal pages (/stage/{stage}/signal/{signal})
// ---------------------------------------------------------------------------

export interface StageSignalPageData {
  stageSlug: string;
  stageName: string;
  stageDescription: string;
  stageInvestorInsight: string;
  signalSlug: string;
  signalName: string;
  signalDescription: string;
  signalInvestorInsight: string;
  period: Period;
  startups: (Startup & { sectorName: string; sectorSlug: string })[];
  sectorBreakdown: { name: string; slug: string; count: number }[];
}

export function getStageSignalData(
  stageSlug: string,
  signalSlug: string
): StageSignalPageData | null {
  const stageDef = STAGE_DEFINITIONS.find((s) => s.slug === stageSlug);
  if (!stageDef) return null;
  const signalDef = SIGNAL_TYPES.find((s) => s.slug === signalSlug);
  if (!signalDef) return null;

  const period = getCurrentPeriod();
  const startups: StageSignalPageData["startups"] = [];
  const sectorCounts: Record<string, { name: string; slug: string; count: number }> = {};

  for (const sector of data.sectors) {
    const snapshot = sector.periods[period.slug];
    if (!snapshot) continue;
    const matching = snapshot.startups.filter(
      (s) =>
        s.signalType === signalDef.match &&
        (stageDef.match as readonly string[]).some(
          (m) => s.stage === m || s.stage.includes(m)
        )
    );
    if (matching.length === 0) continue;

    sectorCounts[sector.slug] = {
      name: sector.name,
      slug: `${sector.slug}-${period.slug}`,
      count: matching.length,
    };
    for (const s of matching) {
      startups.push({ ...s, sectorName: sector.name, sectorSlug: sector.slug });
    }
  }

  if (startups.length < MIN_PSEO_CELL_SIZE) return null;

  return {
    stageSlug: stageDef.slug,
    stageName: stageDef.name,
    stageDescription: stageDef.description,
    stageInvestorInsight: stageDef.investorInsight,
    signalSlug: signalDef.slug,
    signalName: signalDef.name,
    signalDescription: signalDef.description,
    signalInvestorInsight: signalDef.investorInsight,
    period,
    startups: getSortedStartups(startups) as StageSignalPageData["startups"],
    sectorBreakdown: Object.values(sectorCounts).sort((a, b) => b.count - a.count),
  };
}

export function getAllStageSignalPairs(): { stage: string; signal: string }[] {
  const pairs: { stage: string; signal: string }[] = [];
  for (const stageDef of STAGE_DEFINITIONS) {
    for (const signalDef of SIGNAL_TYPES) {
      const d = getStageSignalData(stageDef.slug, signalDef.slug);
      if (d && d.startups.length > 0) {
        pairs.push({ stage: stageDef.slug, signal: signalDef.slug });
      }
    }
  }
  return pairs;
}

// ---------------------------------------------------------------------------
// Stage × period sitemap entries (/stage/{stage}-{period})
// ---------------------------------------------------------------------------

export function getAllStagePageSlugs(): string[] {
  const slugs: string[] = [];
  for (const stageDef of STAGE_DEFINITIONS) {
    for (const period of data.periods) {
      let has = false;
      for (const sector of data.sectors) {
        const snapshot = sector.periods[period.slug];
        if (!snapshot) continue;
        if (
          snapshot.startups.some((s) =>
            (stageDef.match as readonly string[]).some(
              (m) => s.stage === m || s.stage.includes(m)
            )
          )
        ) {
          has = true;
          break;
        }
      }
      if (has) slugs.push(`${stageDef.slug}-${period.slug}`);
    }
  }
  return slugs;
}

// ---------------------------------------------------------------------------
// Related startups (same sector, current period)
// ---------------------------------------------------------------------------

export interface RelatedStartup {
  name: string;
  slug: string;
  stage: string;
  signalType: string;
  commitVelocity14d: number;
  commitVelocityChange: string;
  contributorGrowth: string;
  githubUrl: string;
  description: string;
}

/**
 * Returns related startups from the same sector, excluding the given
 * startup. Sorted by commit velocity change descending.
 *
 * Period selection (2026-08-14 fix): use the SECTOR's most recent snapshot,
 * not the global current period. Sector snapshots advance on the crawler's
 * schedule, so the global current period (q3-2026) only exists for 10/20
 * sectors. The old hard requirement on getCurrentPeriod() made the module
 * silently render nothing on every ai-ml / fintech / climate-tech /
 * developer-tools / cybersecurity startup page (~half of the 2,290-page
 * long tail, including huggingface and langchain). Using the sector's own
 * latest snapshot means related links render wherever the sector has data.
 */
export function getRelatedStartups(
  startupSlug: string,
  sectorSlug: string,
  limit = 6,
  periodSlug?: string
): RelatedStartup[] {
  const sector = data.sectors.find((s) => s.slug === sectorSlug);
  if (!sector) return [];

  // Prefer the sector's freshest snapshot that actually exists.
  const periodOrder = data.periods.map((p) => p.slug);
  const fallbackPeriod = Object.keys(sector.periods)
    .filter((p) => periodOrder.includes(p))
    .sort((a, b) => periodOrder.indexOf(a) - periodOrder.indexOf(b))[0];
  // A period override (history pages) wins when that snapshot exists.
  const chosenPeriod =
    periodSlug && sector.periods[periodSlug] ? periodSlug : fallbackPeriod;
  if (!chosenPeriod) return [];

  const snapshot = sector.periods[chosenPeriod];

  const toSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const sorted = getSortedStartups(snapshot.startups);
  return sorted
    .filter((s) => toSlug(s.name) !== startupSlug)
    .slice(0, limit)
    .map((s) => ({
      name: s.name,
      slug: toSlug(s.name),
      stage: s.stage,
      signalType: s.signalType,
      commitVelocity14d: s.commitVelocity14d,
      commitVelocityChange: s.commitVelocityChange,
      contributorGrowth: s.contributorGrowth,
      githubUrl: s.githubUrl,
      description: s.description,
    }));
}

/**
 * The sector's most recent period that actually has a snapshot. Used to
 * label the related-startups module honestly (e.g. "Q2 2026 cohort" on
 * sectors the crawler has not refreshed for the global current period).
 */
export function getSectorLatestPeriod(sectorSlug: string): Period | null {
  const sector = data.sectors.find((s) => s.slug === sectorSlug);
  if (!sector) return null;
  const periodOrder = data.periods.map((p) => p.slug);
  const latest = Object.keys(sector.periods)
    .filter((p) => periodOrder.includes(p))
    .sort((a, b) => periodOrder.indexOf(a) - periodOrder.indexOf(b))[0];
  if (!latest) return null;
  return data.periods.find((p) => p.slug === latest) ?? null;
}

export interface CrossSectorPeer {
  name: string;
  slug: string;
  stage: string;
  sectorName: string;
  sectorSlug: string;
  signalType: string;
  commitVelocityChange: string;
}

/**
 * Returns startups from OTHER sectors that share this startup's stage,
 * preferring the sector's declared adjacent sectors (sector.relatedSlugs).
 *
 * Why this exists: the related-startups module links each startup to 6
 * same-sector peers, which leaves the long tail as ~20 disconnected sector
 * clusters. This module links each startup to same-stage peers in adjacent
 * sectors, so an investor can traverse from a Seed AI/ML startup to a Seed
 * Developer Tools startup (cross-sector + same-stage is the strongest
 * "similar momentum" signal) and the clusters become one connected graph.
 */
export function getCrossSectorPeers(
  startupSlug: string,
  limit = 3
): CrossSectorPeer[] {
  const index = getStartupIndex();
  const profile = index.get(startupSlug);
  if (!profile) return [];

  const primary = profile.history[0];
  if (!primary) return [];

  // All sectors this startup belongs to: exclude same-sector candidates
  // (they already surface via getRelatedStartups).
  const mySectorSlugs = new Set(profile.history.map((h) => h.sectorSlug));

  // The sector's declared adjacent sectors are the preferred cross-sector pool.
  const sector = data.sectors.find((s) => s.slug === primary.sectorSlug);
  const relatedSectorSlugs = new Set(sector?.relatedSlugs ?? []);

  const targetStage = profile.latestStage;

  const scored: Array<CrossSectorPeer & { score: number }> = [];
  for (const [slug, other] of index) {
    if (slug === startupSlug) continue;
    const otherPrimary = other.history[0];
    if (!otherPrimary) continue;
    if (other.history.some((h) => mySectorSlugs.has(h.sectorSlug))) continue;

    const otherStage = other.latestStage;
    let score = 0;
    if (relatedSectorSlugs.has(otherPrimary.sectorSlug)) score += 2;
    if (otherStage === targetStage) score += 1;

    scored.push({
      name: other.name,
      slug,
      stage: otherStage,
      sectorName: otherPrimary.sectorName,
      sectorSlug: otherPrimary.sectorSlug,
      signalType: otherPrimary.signalType,
      commitVelocityChange: otherPrimary.commitVelocityChange,
      score,
    });
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const aV =
      parseInt(a.commitVelocityChange.replace(/[^0-9-]/g, ""), 10) || 0;
    const bV =
      parseInt(b.commitVelocityChange.replace(/[^0-9-]/g, ""), 10) || 0;
    return bV - aV;
  });

  return scored.slice(0, limit).map((p) => ({
    name: p.name,
    slug: p.slug,
    stage: p.stage,
    sectorName: p.sectorName,
    sectorSlug: p.sectorSlug,
    signalType: p.signalType,
    commitVelocityChange: p.commitVelocityChange,
  }));
}

/**
 * The latest period that has a valid geo snapshot for a sector+geo combo.
 * Resolves from data.periods (newest-first), so it self-maintains as quarters
 * ship: the moment a new geo quarter is generated, older ones re-point to it.
 */
export function getGeoLatestPeriod(sectorSlug: string, geoSlug: string): Period | null {
  const periodOrder = data.periods.map((p) => p.slug);
  for (const periodSlug of periodOrder) {
    if (parseGeoPageSlug(`${sectorSlug}-${geoSlug}-${periodSlug}`) !== null) {
      return data.periods.find((p) => p.slug === periodSlug) ?? null;
    }
  }
  return null;
}

/**
 * The latest period that has a valid region rollup for a geography.
 * Same self-maintaining semantics as getGeoLatestPeriod.
 */
export function getRegionLatestPeriod(geoSlug: string): Period | null {
  const periodOrder = data.periods.map((p) => p.slug);
  for (const periodSlug of periodOrder) {
    if (parseRegionPageSlug(`${geoSlug}-${periodSlug}`) !== null) {
      return data.periods.find((p) => p.slug === periodSlug) ?? null;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Velocity score (0-100)
// ---------------------------------------------------------------------------

/**
 * Compute a 0-100 velocity score from raw metrics.
 * Weighted combination of:
 *  - Commit velocity change magnitude (0-40 points)
 *  - Absolute commit velocity 14d (0-30 points)
 *  - Contributor growth (0-20 points)
 *  - New repos (0-10 points)
 */
export function computeVelocityScore(profile: StartupProfile): number {
  const latest = profile.history[0];
  if (!latest) return 0;

  const changePct =
    parseInt(latest.commitVelocityChange.replace(/[^0-9-]/g, ""), 10) || 0;
  const contribGrowthPct =
    parseInt(latest.contributorGrowth.replace(/[^0-9-]/g, ""), 10) || 0;

  const changeScore = Math.min(Math.abs(changePct) / 2.5, 40);
  const absScore = Math.min(latest.commitVelocity14d / 0.5, 30);
  const contribScore = Math.min(contribGrowthPct / 5, 20);
  const repoScore = Math.min(latest.newRepos * 10, 10);

  return Math.min(Math.round(changeScore + absScore + contribScore + repoScore), 100);
}

/**
 * Returns a quality label for a velocity score.
 */
export function getVelocityLabel(score: number): string {
  if (score >= 80) return "Exceptional";
  if (score >= 60) return "Strong";
  if (score >= 40) return "Moderate";
  if (score >= 20) return "Mild";
  return "Quiet";
}
