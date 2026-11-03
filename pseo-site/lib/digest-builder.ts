import startupsData from "../data/startups.json";
import partnerRecs from "../data/partner-recommendations.json";
import {
  renderDigestEmail,
  type DigestData,
  type DigestSector,
  type DigestStartup,
} from "./digest-email";
import { isInvestorLane, laneIntro } from "./investor-lanes";

/**
 * Shared "latest Signal Digest" builder.
 *
 * Two consumers:
 *   1. /api/verify: sends the latest issue immediately on email verification,
 *      closing the up-to-7-day TTV gap (a verified subscriber used to wait
 *      until the next Sunday broadcast for the Top-5 data the verification
 *      email promises). Added 2026-08-19 per the conversion-audit Top-10 win.
 *   2. scripts/generate-signal-digest-email.ts: renders the weekly broadcast
 *      HTML files (emails/signal-digest-<date>.html + -latest.html).
 *
 * Uses RELATIVE imports (not the @/ alias) so it resolves identically under
 * the Next.js runtime (bundled JSON module) and `npx tsx` (weekly script).
 * The ranking logic below was lifted verbatim from
 * scripts/generate-signal-digest-email.ts; keep the two in sync.
 */

interface Startup {
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
  websiteUrl?: string;
  lastSeen?: string;
  linkedinUrl?: string;
  slug?: string;
}

interface SectorSnapshot {
  intro: string;
  startups: Startup[];
  faqs: Array<{ question: string; answer: string }>;
}

interface Sector {
  slug: string;
  name: string;
  description: string;
  relatedSlugs: string[];
  periods: Record<string, SectorSnapshot>;
}

interface Period {
  slug: string;
  name: string;
  current: boolean;
}

interface StartupsData {
  periods: Period[];
  sectors: Sector[];
  meta?: { issueNumber?: number };
}

function parseVelocityChange(s: string): number {
  return parseInt(s.replace(/[^0-9-]/g, ""), 10) || 0;
}

// Measured jumps rank above "no baseline" entries (zero commits in the prior
// window), which have no comparable percentage at all.
function byMeasuredChange(a: { commitVelocityChange: string }, b: { commitVelocityChange: string }): number {
  const na = isNoBaseline(a.commitVelocityChange), nb = isNoBaseline(b.commitVelocityChange);
  if (na !== nb) return na ? 1 : -1;
  return parseVelocityChange(b.commitVelocityChange) - parseVelocityChange(a.commitVelocityChange);
}

// --- description sanitization -------------------------------------------
// Repo descriptions are scraped from public GitHub and routinely carry junk
// that has no business in a subscriber email: chat-group recruitment spam
// ("…QQ群1600800…"), emoji walls, and promo links. Strip the noise, then drop
// anything that isn't usable English so a reader-facing card never renders
// garbage. A dropped description renders as no paragraph at all (see template).
const EMOJI = /[\u2190-\u21ff\u2300-\u27bf\u2b00-\u2bff\ufe0f\u200d\u{1f000}-\u{1faff}]/gu;
const PROMO_URL = /\b(?:https?:\/\/|www\.)\S+/gi;
const GROUP_SPAM = /(群|QQ|微信|公众号|加入|加群|t\.me\/|telegram|discord\.gg)/i;
const NON_LATIN_SCRIPT = /[\u3000-\u9fff\uac00-\ud7af\uff00-\uffef\u0400-\u04ff\u0600-\u06ff]/;
const MAX_DESC = 140;

// Template text an old pipeline wrote when an org had no description
// ("aphp is ahealthcare pre-seed startup based in EU, investing in ...").
// It is generated, not sourced, and has been wrong (AP-HP is the Paris public
// hospital system), so it never reaches a reader.
const SYNTHETIC_DESC = /\bis an? ?[a-z&\- ]*\b(pre-seed|seed|series a\/b|growth)(-stage)? startup\b/i;

// Orgs that are not startups (public institutions, university projects,
// non-profit institutes). Kept out of every digest ranking; the fetch
// pipeline BLOCKLIST carries the same names for future refreshes.
export const NON_STARTUP_ORGS = new Set(["aphp", "stanfordspezi", "vectorinstitute"]);

// fetch-github-data.ts writes "+999%" when the prior 14 days had zero commits.
// That is "no baseline", not a 999% jump, so it is never shown as a number.
export const NO_BASELINE = "+999%";
export function isNoBaseline(change: string): boolean {
  return change.trim() === NO_BASELINE;
}

function sanitizeDescription(raw: string): string {
  if (!raw) return "";
  if (SYNTHETIC_DESC.test(raw)) return "";
  let t = raw
    .normalize("NFC")
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(EMOJI, " ")
    .replace(PROMO_URL, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!t) return "";
  if (GROUP_SPAM.test(t)) return "";
  if (NON_LATIN_SCRIPT.test(t)) return "";
  if (t.length > MAX_DESC) {
    t = t.slice(0, MAX_DESC).replace(/\s+\S*$/, "").trim() + "…";
  }
  return t;
}

const SIGNAL_LABELS: Record<string, string> = {
  "Deploy frequency spike": "Shipping faster than usual",
  "Infrastructure buildout": "Building out their infrastructure",
  "Framework migration": "Rebuilding under the hood",
  "Engineering hiring burst": "Hiring engineers fast",
};

function humanizeSignalType(s: string): string {
  return SIGNAL_LABELS[s] ?? s;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Data measurement date (startups.json _meta.fetchedAt), falls back to now. */
export function dataDate(): Date {
  const f = (startupsData as { _meta?: { fetchedAt?: string } })._meta?.fetchedAt;
  const d = f ? new Date(f) : new Date();
  return isNaN(d.getTime()) ? new Date() : d;
}

function formatWeekOf(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function buildHeadline(topSectors: DigestSector[]): string {
  if (!topSectors.length) return "This week's engineering acceleration report.";
  const names = topSectors.slice(0, 3).map((s) => s.name);
  if (names.length === 1) return `${names[0]} is accelerating fastest this week.`;
  if (names.length === 2) return `${names[0]} and ${names[1]} are accelerating fastest this week.`;
  return `${names[0]}, ${names[1]}, and ${names[2]} are accelerating fastest this week.`;
}

export interface LatestDigest {
  subject: string;
  html: string;
  totalStartups: number;
  sectorCount: number;
}

/**
 * Return the next recurring Sunday issue after `now`.
 *
 * On Sunday itself the weekly broadcast may already have gone out, so the
 * next recurring issue is seven days away, never "0 days / this Sunday".
 * Exported for deterministic boundary tests.
 */
export function nextSundayTiming(now: Date = new Date()): {
  daysUntilSunday: number;
  nextSundayISO: string;
} {
  const rawDays = (7 - now.getUTCDay()) % 7;
  const daysUntilSunday = rawDays === 0 ? 7 : rawDays;
  const nextSunday = new Date(now);
  nextSunday.setUTCDate(now.getUTCDate() + daysUntilSunday);
  return {
    daysUntilSunday,
    nextSundayISO: nextSunday.toISOString().slice(0, 10),
  };
}

// Maryan 2026-11-03: no GitDealFlow email may carry data older than ~8 days.
export const FRESH_DAYS = 8;

function freshStartups<T extends { lastSeen?: string }>(list: T[], now = Date.now()): T[] {
  return list.filter((s) => s.lastSeen && now - Date.parse(`${s.lastSeen}T00:00:00Z`) <= FRESH_DAYS * 86_400_000);
}

/** Startups in the current period measured within FRESH_DAYS (weekly-digest send guard). */
export function countFreshCurrentStartups(): number {
  const raw = startupsData as unknown as StartupsData;
  const period = raw.periods.find((p) => p.current) ?? raw.periods[0];
  if (!period) return 0;
  const all: Startup[] = [];
  for (const sector of raw.sectors) all.push(...(sector.periods[period.slug]?.startups ?? []));
  return freshStartups(all).length;
}

/** Same rule as the Sunday cron guard: data measured within FRESH_DAYS and >= 5 fresh startups. */
export function isDigestDataFresh(now = Date.now()): boolean {
  const f = (startupsData as { _meta?: { fetchedAt?: string } })._meta?.fetchedAt;
  const age = f ? (now - Date.parse(f)) / 86_400_000 : Infinity;
  return age <= FRESH_DAYS && countFreshCurrentStartups() >= 5;
}

/** Freshness facts for send gates (never throws). */
export function digestFreshness(now = Date.now()): { fresh: boolean; fetchedAt: string | null; ageDays: number; freshCount: number } {
  const f = (startupsData as { _meta?: { fetchedAt?: string } })._meta?.fetchedAt ?? null;
  const ageDays = f ? (now - Date.parse(f)) / 86_400_000 : Infinity;
  const freshCount = countFreshCurrentStartups();
  return { fresh: ageDays <= FRESH_DAYS && freshCount >= 5, fetchedAt: f, ageDays, freshCount };
}

/**
 * True when every "Week of <Mon> <D>" label in `text` is within FRESH_DAYS of
 * the data measurement date (and there is at least one label). A digest
 * labelled "Week of Nov 3" that carries August numbers fails this.
 */
export function weekLabelMatchesData(text: string, data: Date = dataDate()): boolean {
  const labels = [...text.matchAll(/Week of ([A-Z][a-z]{2}) (\d{1,2})/g)];
  if (!labels.length) return false;
  return labels.every((m) => {
    const y = data.getUTCFullYear();
    const best = [y - 1, y, y + 1]
      .map((yy) => Math.abs(Date.parse(`${m[1]} ${m[2]}, ${yy} 00:00:00 UTC`) - data.getTime()))
      .filter((x) => !isNaN(x));
    return best.length > 0 && Math.min(...best) / 86_400_000 <= FRESH_DAYS;
  });
}

export function buildLatestDigest(lane?: string, opts?: { firstIssue?: boolean }): LatestDigest {
  const raw = startupsData as unknown as StartupsData;
  const period = raw.periods.find((p) => p.current) ?? raw.periods[0];
  if (!period) throw new Error("No current period in startups.json.");

  const allStartups: Array<Startup & { sectorName: string; sectorSlug: string }> = [];
  const sectorStats: DigestSector[] = [];

  for (const sector of raw.sectors) {
    const snapshot = sector.periods[period.slug];
    if (!snapshot || !snapshot.startups.length) continue;

    const eligible = snapshot.startups.filter((s) => !NON_STARTUP_ORGS.has(s.name.toLowerCase()));
    if (!eligible.length) continue;
    for (const s of eligible) {
      allStartups.push({ ...s, sectorName: sector.name, sectorSlug: sector.slug });
    }

    const sorted = [...eligible].sort(byMeasuredChange);
    const avg = Math.round(
      eligible.reduce((sum, s) => sum + s.commitVelocity14d, 0) / eligible.length,
    );
    sectorStats.push({
      name: sector.name,
      topStartup: sorted[0].name,
      topChange: sorted[0].commitVelocityChange,
      count: eligible.length,
      avgVelocity: avg,
    });
  }

  // Real data only: rank just the startups whose numbers were (re)measured
  // in the last FRESH_DAYS (lastSeen is stamped by fetch-github-data.ts).
  // Entries merged forward from older runs keep stale velocity numbers and
  // must not appear as "this week's" movers. Legacy files with no lastSeen
  // at all fall back to the full list.
  const freshPool = freshStartups(allStartups);
  const rankPool = freshPool.length >= 5 ? freshPool : allStartups;
  const topStartups: DigestStartup[] = [...rankPool]
    .sort(byMeasuredChange)
    .slice(0, 5)
    .map((s, i) => ({
      rank: i + 1,
      name: s.name,
      sectorName: s.sectorName,
      sectorSlug: s.sectorSlug,
      description: sanitizeDescription(s.description),
      commitVelocityChange: s.commitVelocityChange,
      commitVelocity14d: s.commitVelocity14d,
      contributors: s.contributors,
      signalType: humanizeSignalType(s.signalType),
      slug: s.slug ?? slugify(s.name),
    }));

  const hottestSectors = [...sectorStats].sort((a, b) => b.avgVelocity - a.avgVelocity).slice(0, 3);

  // Partner-recommendation slot (§45): rotate through
  // data/partner-recommendations.json. Preference: status === "featured" (the
  // current swap partner being courted), else the first "queued" entry.
  let partnerPick: DigestData["partnerPick"];
  try {
    const partners = partnerRecs as Array<{
      status?: string;
      name: string;
      author: string;
      url: string;
      blurb: string;
    }>;
    const pick = partners.find((p) => p.status === "featured") ?? partners[0];
    if (pick?.name && pick?.url) {
      partnerPick = { name: pick.name, author: pick.author, url: pick.url, blurb: pick.blurb };
    }
  } catch {
    // malformed partner data: render digest without the slot, never fail on it
  }

  const today = new Date();

  // Panel-size claim: locked "350+" floor (AGENTS.md / CLAIMS-LEDGER.md).
  // allStartups.length is a raw sector-sum, not the unique-org count.
  const panelClaim = allStartups.length >= 350 ? "350+" : String(allStartups.length);

  const digest: DigestData = {
    issueNumber: raw.meta?.issueNumber ?? 1,
    weekOf: formatWeekOf(dataDate()),
    heroHeadline: buildHeadline(hottestSectors),
    heroIntro: `We tracked ${panelClaim} startups across ${sectorStats.length} sectors this week. ${topStartups
      .filter((s) => !isNoBaseline(s.commitVelocityChange) && parseVelocityChange(s.commitVelocityChange) >= 100)
      .length} of them more than doubled how fast they're shipping code versus their own normal pace, the kind of jump that usually shows up 3-6 weeks before a funding announcement.`,
    statStartups: panelClaim,
    statSectors: sectorStats.length,
    statTopMover: topStartups[0] ? (isNoBaseline(topStartups[0].commitVelocityChange) ? "New" : topStartups[0].commitVelocityChange) : "",
    topStartups,
    hottestSectors,
    ...(lane && isInvestorLane(lane) ? { laneIntro: laneIntro(lane) } : {}),
    ...(partnerPick ? { partnerPick } : {}),
  };

  // First-issue block (on-verify instant digest): sets expectations so the
  // instant issue reads as a welcome gift, not a re-sent broadcast.
  if (opts?.firstIssue) {
    digest.firstIssueIntro = nextSundayTiming();
  }

  const html = renderDigestEmail(digest);

  // Subject lives in the <title> tag (same extraction as
  // email-api/send-weekly-digest.mjs) so the on-verify send and the weekly
  // broadcast always share one subject source.
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const broadcastSubject = titleMatch
    ? titleMatch[1].trim()
    : `Signal Digest: Week of ${digest.weekOf}`;
  // The on-verify send is a DIFFERENT animal from the Sunday broadcast even
  // when both render the same panel: a subscriber who confirms on Saturday
  // would otherwise receive two near-identical subjects 24h apart (and the
  // broadcast subject would headline a name they already saw). Distinct
  // subject keeps the first touch unmistakable in the inbox.
  const subject = opts?.firstIssue
    ? `Your first five: ${topStartups[0]?.name ?? "this week's fastest"} + the 4 more accelerating right now`
    : broadcastSubject;

  return {
    subject,
    html,
    totalStartups: allStartups.length,
    sectorCount: sectorStats.length,
  };
}
