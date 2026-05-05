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
