import "server-only";
import * as fs from "fs";
import * as path from "path";

export interface Top100Crossover {
  slug: string;
  name: string;
}

export interface Top100Row {
  rank: number;
  name: string;
  description: string;
  stage: string;
  geography: string;
  sectorSlug: string;
  sectorName: string;
  commitVelocity14d: number;
  commitVelocityChange: string;
  contributors: number;
  contributorGrowth: string;
  newRepos: number;
  signalType: string;
  githubUrl: string;
  websiteUrl: string;
  accelScore: number;
  contribScore: number;
  scaleScore: number;
  teamScore: number;
  signalScore: number;
  alsoInSectors: Top100Crossover[];
}

export interface Top100Snapshot {
  isoWeek: string;
  generatedAt: string;
  period: string;
  methodology: string;
  summary: {
    totalRanked: number;
    totalTracked: number;
    sectorsCovered: number;
    topSignalScore: number;
    medianSignalScore: number;
  };
  rankings: Top100Row[];
  /** Substack mirror URL for this edition (set after publish). */
  substackUrl?: string;
  /** ISO timestamp of when the Substack mirror was published. */
  publishedAt?: string;
}

const DIR = path.join(process.cwd(), "data", "top-100");

/**
 * Lists every weekly Top-100 slug (e.g. "2026-w18") that has a snapshot file.
 * Sorted newest-first by ISO week tuple.
 */
export function getAllTop100Slugs(): string[] {
  if (!fs.existsSync(DIR)) return [];
  const slugs = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".json") && f !== "latest.json")
    .map((f) => f.replace(/\.json$/, ""));
  return slugs.sort((a, b) => b.localeCompare(a));
}

/** Returns the snapshot for a given ISO-week slug, or null if missing. */
export function getTop100(slug: string): Top100Snapshot | null {
  const file = path.join(DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as Top100Snapshot;
  } catch {
    return null;
  }
}

export function getLatestTop100(): Top100Snapshot | null {
  const slugs = getAllTop100Slugs();
  return slugs.length ? getTop100(slugs[0]) : null;
}

/** Format ISO-week slug like "2026-w18" into "Week 18, 2026". */
export function formatIsoWeekLabel(slug: string): string {
  const m = /^(\d{4})-w(\d{2})$/.exec(slug);
  if (!m) return slug;
  return `Week ${parseInt(m[2], 10)}, ${m[1]}`;
}

/** Convert an ISO-week slug into the date of that week's Monday (UTC). */
export function isoWeekToMonday(slug: string): Date | null {
  const m = /^(\d{4})-w(\d{2})$/.exec(slug);
  if (!m) return null;
  const year = parseInt(m[1], 10);
  const week = parseInt(m[2], 10);
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4Day = jan4.getUTCDay() || 7;
  const week1Monday = new Date(jan4);
  week1Monday.setUTCDate(jan4.getUTCDate() - jan4Day + 1);
  const target = new Date(week1Monday);
  target.setUTCDate(week1Monday.getUTCDate() + (week - 1) * 7);
  return target;
}

// ---------------------------------------------------------------------------
// Week-over-week movers (/weekly/top-100/{slug}/movers)
// ---------------------------------------------------------------------------
//
// Diffs a week's ranking against the immediately preceding snapshot file
// (by sort order of `getAllTop100Slugs()`, not by parsing the ISO week
// number — this stays correct even across a missed week). Matches rows by
// `name` since ranks change but org identity doesn't. Every rendered field
// (prevRank, newRank, delta, velocity, sector) comes straight from the two
// week files — no fabrication, no interpolation for gaps.

/** Minimum combined mover count (climbers + fallers + new entrants) required
 * to publish a week's movers page — mirrors MIN_PSEO_CELL_SIZE (3) used
 * elsewhere for Cartesian pSEO cells, applied here to a single family. */
const MIN_MOVERS_CELL_SIZE = 3;

export interface Top100Mover extends Top100Row {
  previousRank: number;
  rankDelta: number; // positive = climbed (lower rank number), negative = fell
}

export interface Top100MoversData {
  slug: string;
  weekLabel: string;
  previousSlug: string;
  previousWeekLabel: string;
  climbers: Top100Mover[];
  fallers: Top100Mover[];
  newEntrants: Top100Row[];
  droppedOut: Top100Row[];
}

/** The snapshot slug immediately preceding `slug`, or null if `slug` is the
 * oldest snapshot on file (or unknown). */
export function getPreviousTop100Slug(slug: string): string | null {
  const slugs = getAllTop100Slugs(); // newest-first
  const idx = slugs.indexOf(slug);
  if (idx === -1 || idx === slugs.length - 1) return null;
  return slugs[idx + 1];
}

export function getTop100Movers(slug: string): Top100MoversData | null {
  const current = getTop100(slug);
  if (!current) return null;
  const previousSlug = getPreviousTop100Slug(slug);
  if (!previousSlug) return null;
  const previous = getTop100(previousSlug);
  if (!previous) return null;

  const prevByName = new Map(previous.rankings.map((r) => [r.name, r]));
  const currByName = new Map(current.rankings.map((r) => [r.name, r]));

  const climbers: Top100Mover[] = [];
  const fallers: Top100Mover[] = [];
  const newEntrants: Top100Row[] = [];

  for (const row of current.rankings) {
    const prevRow = prevByName.get(row.name);
    if (!prevRow) {
      newEntrants.push(row);
      continue;
    }
    const rankDelta = prevRow.rank - row.rank; // positive = climbed
    if (rankDelta > 0) {
      climbers.push({ ...row, previousRank: prevRow.rank, rankDelta });
    } else if (rankDelta < 0) {
      fallers.push({ ...row, previousRank: prevRow.rank, rankDelta });
    }
  }

  const droppedOut: Top100Row[] = previous.rankings.filter(
    (r) => !currByName.has(r.name)
  );

  climbers.sort((a, b) => b.rankDelta - a.rankDelta);
  fallers.sort((a, b) => a.rankDelta - b.rankDelta);

  return {
    slug,
    weekLabel: formatIsoWeekLabel(slug),
    previousSlug,
    previousWeekLabel: formatIsoWeekLabel(previousSlug),
    climbers,
    fallers,
    newEntrants,
    droppedOut,
  };
}

/** Slugs eligible for a /movers page: has a previous snapshot AND the
 * combined climbers+fallers+newEntrants count clears the thin-content
 * floor. Computed generically off whatever week files exist on disk —
 * never hardcodes specific ISO weeks. */
export function getAllTop100MoverSlugs(): string[] {
  const slugs: string[] = [];
  for (const slug of getAllTop100Slugs()) {
    const d = getTop100Movers(slug);
    if (!d) continue;
    if (d.climbers.length + d.fallers.length + d.newEntrants.length >= MIN_MOVERS_CELL_SIZE) {
      slugs.push(slug);
    }
  }
  return slugs;
}
