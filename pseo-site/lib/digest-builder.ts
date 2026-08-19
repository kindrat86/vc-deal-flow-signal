import startupsData from "../data/startups.json";
import partnerRecs from "../data/partner-recommendations.json";
import {
  renderDigestEmail,
  type DigestData,
  type DigestSector,
  type DigestStartup,
} from "./digest-email";

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

function sanitizeDescription(raw: string): string {
  if (!raw) return "";
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

export function buildLatestDigest(): LatestDigest {
  const raw = startupsData as unknown as StartupsData;
  const period = raw.periods.find((p) => p.current) ?? raw.periods[0];
  if (!period) throw new Error("No current period in startups.json.");

  const allStartups: Array<Startup & { sectorName: string; sectorSlug: string }> = [];
  const sectorStats: DigestSector[] = [];

  for (const sector of raw.sectors) {
    const snapshot = sector.periods[period.slug];
    if (!snapshot || !snapshot.startups.length) continue;

    for (const s of snapshot.startups) {
      allStartups.push({ ...s, sectorName: sector.name, sectorSlug: sector.slug });
    }

    const sorted = [...snapshot.startups].sort(
      (a, b) => parseVelocityChange(b.commitVelocityChange) - parseVelocityChange(a.commitVelocityChange),
    );
    const avg = Math.round(
      snapshot.startups.reduce((sum, s) => sum + s.commitVelocity14d, 0) / snapshot.startups.length,
    );
    sectorStats.push({
      name: sector.name,
      topStartup: sorted[0].name,
      topChange: sorted[0].commitVelocityChange,
      count: snapshot.startups.length,
      avgVelocity: avg,
    });
  }

  const topStartups: DigestStartup[] = [...allStartups]
    .sort(
      (a, b) =>
        parseVelocityChange(b.commitVelocityChange) - parseVelocityChange(a.commitVelocityChange),
    )
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
    weekOf: formatWeekOf(today),
    heroHeadline: buildHeadline(hottestSectors),
    heroIntro: `We tracked ${panelClaim} startups across ${sectorStats.length} sectors this week. ${topStartups
      .filter((s) => parseVelocityChange(s.commitVelocityChange) >= 100)
      .length} of them more than doubled how fast they're shipping code versus their own normal pace, the kind of jump that usually shows up 3-6 weeks before a funding announcement.`,
    statStartups: panelClaim,
    statSectors: sectorStats.length,
    statTopMover: topStartups[0]?.commitVelocityChange ?? "",
    topStartups,
    hottestSectors,
    ...(partnerPick ? { partnerPick } : {}),
  };

  const html = renderDigestEmail(digest);

  // Subject lives in the <title> tag (same extraction as
  // email-api/send-weekly-digest.mjs) so the on-verify send and the weekly
  // broadcast always share one subject source.
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const subject = titleMatch
    ? titleMatch[1].trim()
    : `Signal Digest: Week of ${digest.weekOf}`;

  return {
    subject,
    html,
    totalStartups: allStartups.length,
    sectorCount: sectorStats.length,
  };
}
