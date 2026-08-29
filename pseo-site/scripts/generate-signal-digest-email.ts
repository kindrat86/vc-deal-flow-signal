/**
 * Render the weekly Signal Digest email from data/startups.json.
 *
 * Sibling to generate-signal-report.ts, same data source, same ranking logic,
 * different output surface (HTML email instead of blog post).
 *
 * Usage:
 *   npx tsx scripts/generate-signal-digest-email.ts              # default
 *   npx tsx scripts/generate-signal-digest-email.ts --esp=resend # (kept for back-compat; same output)
 *
 * Note: the --esp flag used to inject ESP-specific unsubscribe template
 * tokens ({{{RESEND_UNSUBSCRIBE_URL}}} / %unsubscribe_url%). Those only
 * substitute via Resend Broadcasts; this digest is sent via /emails
 * (per-recipient), so the placeholders leaked through as literal text.
 * The renderer now always emits a real mailto: unsubscribe link, and
 * one-click unsub is supplied via the List-Unsubscribe header set by
 * email-api/send-weekly-digest.mjs.
 *
 * Writes:
 *   emails/signal-digest-<YYYY-MM-DD>.html  (dated issue, committed weekly)
 *   emails/signal-digest-latest.html         (always overwritten, tracked for quick preview)
 */

import * as fs from "fs";
import * as path from "path";
import {
  renderDigestEmail,
  type DigestData,
  type DigestOptions,
  type DigestSector,
  type DigestStartup,
} from "../lib/digest-email";

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
// anything that isn't usable English so a Marcus-facing card never renders
// garbage. A dropped description renders as no paragraph at all (see template).
const EMOJI = /[\u2190-\u21ff\u2300-\u27bf\u2b00-\u2bff\ufe0f\u200d\u{1f000}-\u{1faff}]/gu;
const PROMO_URL = /\b(?:https?:\/\/|www\.)\S+/gi;
// Group-/channel-recruitment markers (Chinese QQ/WeChat groups, Telegram/Discord invites).
const GROUP_SPAM = /(群|QQ|微信|公众号|加入|加群|t\.me\/|telegram|discord\.gg)/i;
// Scripts we never want in this email, strong junk signal, never legit here.
const NON_LATIN_SCRIPT = /[\u3000-\u9fff\uac00-\ud7af\uff00-\uffef\u0400-\u04ff\u0600-\u06ff]/;
const MAX_DESC = 140;

function sanitizeDescription(raw: string): string {
  if (!raw) return "";
  let t = raw
    .normalize("NFC")
    .replace(/[\u0000-\u001f\u007f]+/g, " ") // control chars
    .replace(EMOJI, " ")
    .replace(PROMO_URL, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!t) return "";
  if (GROUP_SPAM.test(t)) return ""; // chat-group recruitment spam
  if (NON_LATIN_SCRIPT.test(t)) return ""; // CJK/Cyrillic/Arabic-dominant, not Marcus-facing
  if (t.length > MAX_DESC) {
    t = t.slice(0, MAX_DESC).replace(/\s+\S*$/, "").trim() + "…";
  }
  return t;
}

// Plain-English labels for the internal signal-type taxonomy. Marcus reads
// these on the card chip; "Deploy frequency spike" means nothing to him.
const SIGNAL_LABELS: Record<string, string> = {
  "Deploy frequency spike": "Shipping faster than usual",
  "Infrastructure buildout": "Building out their infrastructure",
  "Framework migration": "Rebuilding under the hood",
  "Engineering hiring burst": "Hiring engineers fast",
};

function humanizeSignalType(s: string): string {
  return SIGNAL_LABELS[s] ?? s;
}

function parseEsp(argv: string[]): DigestOptions["esp"] {
  const arg = argv.find((a) => a.startsWith("--esp="));
  if (!arg) return "generic";
  const value = arg.split("=")[1];
  return value === "resend" ? "resend" : "generic";
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

function main() {
  const dataPath = path.join(process.cwd(), "data", "startups.json");
  if (!fs.existsSync(dataPath)) {
    console.error(`No data file at ${dataPath}. Run fetch-github-data.ts first.`);
    process.exit(1);
  }

  const raw: StartupsData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const period = raw.periods.find((p) => p.current) ?? raw.periods[0];
  if (!period) {
    console.error("No current period in data.");
    process.exit(1);
  }

  const allStartups: Array<Startup & { sectorName: string; sectorSlug: string }> = [];
  const sectorStats: DigestSector[] = [];

  for (const sector of raw.sectors) {
    const snapshot = sector.periods[period.slug];
    if (!snapshot || !snapshot.startups.length) continue;

    for (const s of snapshot.startups) {
      allStartups.push({ ...s, sectorName: sector.name, sectorSlug: sector.slug });
    }

    const sorted = [...snapshot.startups].sort(
      (a, b) => parseVelocityChange(b.commitVelocityChange) - parseVelocityChange(a.commitVelocityChange)
    );
    const avg = Math.round(
      snapshot.startups.reduce((sum, s) => sum + s.commitVelocity14d, 0) / snapshot.startups.length
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
        parseVelocityChange(b.commitVelocityChange) - parseVelocityChange(a.commitVelocityChange)
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

  // Partner-recommendation slot (§45): rotate through data/partner-recommendations.json.
  // Preference: status === "featured" (the current swap partner being courted),
  // else the first "queued" entry. Absent file => no slot rendered.
  let partnerPick: DigestData["partnerPick"];
  const partnerPath = path.join(process.cwd(), "data", "partner-recommendations.json");
  if (fs.existsSync(partnerPath)) {
    try {
      const partners: Array<{ status?: string; name: string; author: string; url: string; blurb: string }> =
        JSON.parse(fs.readFileSync(partnerPath, "utf8"));
      const pick = partners.find((p) => p.status === "featured") ?? partners[0];
      if (pick?.name && pick?.url) {
        partnerPick = { name: pick.name, author: pick.author, url: pick.url, blurb: pick.blurb };
      }
    } catch {
      // malformed file: render digest without the slot, never fail the send on it
    }
  }

  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);

  // Optional date-bounded P.S. note. Draft entries are inert: only an entry
  // explicitly marked status="approved" can render into an outbound digest.
  let psNote: DigestData["psNote"];
  const psPath = path.join(process.cwd(), "data", "ps-notes.json");
  if (fs.existsSync(psPath)) {
    try {
      const notes: Array<{ status?: "draft" | "approved"; activeFrom?: string; activeThrough?: string; title?: string; body?: string; ctaLabel?: string; ctaUrl?: string }> =
        JSON.parse(fs.readFileSync(psPath, "utf8"));
      const pick = notes.find((n) =>
        n.status === "approved" &&
        (n.activeFrom ?? "9999-99-99") <= dateStr &&
        (n.activeThrough ?? "0000-00-00") >= dateStr
      );
      if (pick?.title && pick?.body) {
        psNote = { title: pick.title, body: pick.body, ctaLabel: pick.ctaLabel, ctaUrl: pick.ctaUrl };
      }
    } catch {
      // malformed file: render digest without the note, never fail the send on it
    }
  }


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
    ...(psNote ? { psNote } : {}),
  };

  const esp = parseEsp(process.argv.slice(2));
  const html = renderDigestEmail(digest, { esp });

  const outDir = path.resolve(process.cwd(), "..", "emails");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const datedPath = path.join(outDir, `signal-digest-${dateStr}.html`);
  const latestPath = path.join(outDir, "signal-digest-latest.html");
  fs.writeFileSync(datedPath, html, "utf8");
  fs.writeFileSync(latestPath, html, "utf8");

  console.log(`Rendered ${datedPath} (${allStartups.length} startups, ${sectorStats.length} sectors, esp=${esp})`);
  console.log(`Also updated ${latestPath}`);
}

main();
