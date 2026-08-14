import "server-only";
import ideasData from "@/data/ideas-of-the-day.json";

export interface IdeaSignalReading {
  metric: string;
  reading: string;
}

export interface IdeaRepo {
  name: string;
  githubUrl: string;
  stage: string;
  geography: string;
  sector: string;
  sectorSlug: string;
  signalType: string;
  commitVelocity14d: number;
  commitVelocityChange: string;
  contributors: number;
  contributorGrowth: string;
  newRepos: number;
  description: string;
}

export interface IdeaOfTheDay {
  date: string; // ISO date, YYYY-MM-DD
  slug: string; // mirrors date, present so future renames don't break URLs
  headline: string;
  hook: string;
  repo: IdeaRepo;
  ideaThesis: string;
  buildAngles: string[];
  distributionPlay: string;
  signalReading: IdeaSignalReading[];
  publishedAt: string; // ISO 8601 timestamp
}

interface IdeasFile {
  _doc?: string;
  entries: IdeaOfTheDay[];
}

const data = ideasData as IdeasFile;

/**
 * All entries, sorted newest-first.
 *
 * The on-disk JSON is sorted oldest-first for diff-friendliness; readers
 * downstream want newest-first because the archive renders in reverse-chron.
 */
export function getAllIdeas(): IdeaOfTheDay[] {
  return [...data.entries].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
  );
}

/** All known slugs (= ISO dates), oldest → newest. Drives generateStaticParams. */
export function getAllIdeaSlugs(): string[] {
  return [...data.entries].map((e) => e.slug).sort();
}

/** Single entry by date slug, or null if absent. */
export function getIdeaBySlug(slug: string): IdeaOfTheDay | null {
  return data.entries.find((e) => e.slug === slug) ?? null;
}

/**
 * The current "idea of today", the entry whose date is the latest published
 * (i.e. ≤ today, UTC). Falls back to the newest entry on file if nothing
 * matches (shouldn't happen with a daily cron, but defensive for first-run
 * test envs where the seed runs in the future).
 */
export function getTodayIdea(now: Date = new Date()): IdeaOfTheDay | null {
  const todayIso = now.toISOString().slice(0, 10);
  const sorted = getAllIdeas(); // newest-first
  // Prefer the entry dated exactly today.
  const exact = sorted.find((e) => e.date === todayIso);
  if (exact) return exact;
  // Otherwise: most recent entry on or before today.
  const past = sorted.find((e) => e.date <= todayIso);
  if (past) return past;
  // Last resort: the newest entry regardless of date (test envs only).
  return sorted[0] ?? null;
}

/**
 * Neighbour lookup for prev/next nav on the dated page.
 * Returns the entries adjacent in the chronological sequence.
 */
export function getNeighbours(slug: string): {
  prev: IdeaOfTheDay | null;
  next: IdeaOfTheDay | null;
} {
  const sorted = [...data.entries].sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? 1 : 0,
  );
  const idx = sorted.findIndex((e) => e.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? sorted[idx - 1] : null,
    next: idx < sorted.length - 1 ? sorted[idx + 1] : null,
  };
}

/**
 * Group entries by calendar month for the calendar/archive view.
 * Returns months newest-first; each month's entries are oldest-first
 * within the month so the calendar grid reads left-to-right top-to-bottom.
 */
export interface IdeaMonth {
  key: string; // "2026-05"
  label: string; // "May 2026"
  entries: IdeaOfTheDay[];
}

export function getIdeasByMonth(): IdeaMonth[] {
  const map = new Map<string, IdeaOfTheDay[]>();
  for (const e of data.entries) {
    const key = e.date.slice(0, 7);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(e);
  }
  const months: IdeaMonth[] = [];
  for (const [key, entries] of map) {
    entries.sort((a, b) => (a.date < b.date ? -1 : 1));
    const [y, m] = key.split("-").map(Number);
    const label = new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
    months.push({ key, label, entries });
  }
  months.sort((a, b) => (a.key < b.key ? 1 : -1));
  return months;
}

/** Long-form date, "Friday, May 22, 2026". */
export function formatLongDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
