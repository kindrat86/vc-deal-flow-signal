/**
 * Receipts of the Week — Wed cadence in Greg Isenberg's 30-day distribution
 * play. Picks one notable developer from a curated seed list, fetches their
 * /receipts data via the live API, and writes a distribution-ready markdown
 * doc with Twitter / Telegram / Substack / LinkedIn copy.
 *
 * No auto-posting — per division-of-labor rules, Reddit + LinkedIn + HN are
 * user-only. This script produces drafts.
 *
 * Usage:
 *   npx tsx scripts/generate-receipts-of-the-week.ts          # picks for next Wed
 *   npx tsx scripts/generate-receipts-of-the-week.ts --user=sindresorhus
 *   npx tsx scripts/generate-receipts-of-the-week.ts --date=2026-05-06
 *
 * Output: marketing/receipts-of-the-week/YYYY-MM-DD.md
 */

import * as fs from "fs";
import * as path from "path";

const SITE = "https://signals.gitdealflow.com";

// Seed list rotated weekly. Each is a notable dev whose receipts already
// produce visible "Curious / Scout / Sharp / Elite / Oracle" outputs against
// the validated unicorn database. Order is rotation order — date-deterministic
// pick so the same seed reappears every ~14 weeks.
const SEED_DEVS: readonly string[] = [
  "sindresorhus",
  "tj",
  "gaearon",
  "jaredpalmer",
  "leerob",
  "shadcn",
  "kentcdodds",
  "jamonholmgren",
  "hkirat",
  "swyx",
  "yyx990803", // Evan You
  "rauchg",
  "tannerlinsley",
  "wesbos",
];

interface TopWin {
  org: string;
  repo: string;
  name: string;
  event: string;
  event_date: string;
  starred_at: string;
  months_early: number;
  weight: number;
  points: number;
}

interface ReceiptResponse {
  username: string;
  score: number;
  rank: "curious" | "scout" | "sharp" | "elite" | "oracle" | string;
  total_stars: number;
  matched_count: number;
  early_count: number;
  top_wins: TopWin[];
  personality?: string;
  truncated?: boolean;
  from_cache?: boolean;
  generated_at?: string;
}

const RANK_LABEL: Record<string, string> = {
  curious: "Curious",
  scout: "Scout",
  sharp: "Sharp",
  elite: "Elite",
  oracle: "Oracle",
};

interface CliArgs {
  user?: string;
  date?: string;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {};
  for (const a of argv) {
    if (a.startsWith("--user=")) args.user = a.slice(7);
    else if (a.startsWith("--date=")) args.date = a.slice(7);
  }
  return args;
}

function nextWednesdayISO(from = new Date()): string {
  const d = new Date(from);
  const dow = d.getUTCDay(); // 0=Sun ... 3=Wed
  const offset = (3 - dow + 7) % 7 || 7;
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

function pickSeedForDate(isoDate: string): string {
  const n = parseInt(isoDate.replace(/-/g, ""), 10);
  return SEED_DEVS[n % SEED_DEVS.length];
}

async function fetchReceipts(username: string): Promise<ReceiptResponse> {
  const url = `${SITE}/api/receipts/${encodeURIComponent(username)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "GitDealFlow-RoTW-generator" },
  });
  if (!res.ok) {
    throw new Error(`receipts fetch failed for ${username}: ${res.status}`);
  }
  return (await res.json()) as ReceiptResponse;
}

function formatMonthsEarly(monthsEarly: number): string {
  if (monthsEarly < 1) return `${Math.round(monthsEarly * 30)}d`;
  if (monthsEarly < 12) return `${monthsEarly.toFixed(1)}mo`;
  return `${(monthsEarly / 12).toFixed(1)}yr`;
}

function buildTwitterThread(r: ReceiptResponse): string[] {
  const handle = r.username;
  const top = r.top_wins.slice(0, 3);
  const rankLabel = RANK_LABEL[r.rank] ?? r.rank;

  const t1 =
    `@${handle}'s GitHub stars are receipts.\n\n` +
    `We ran them through our unicorn database. ` +
    `${r.matched_count} validated wins, ${r.early_count} called early.\n\n` +
    `Rank: ${rankLabel} (${Math.round(r.score)} pts)\n\n` +
    `Score yours: ${SITE}/receipts/${handle}`;

  const t2 = top
    .map(
      (p, i) =>
        `${i + 1}/ ${p.name} — starred ${formatMonthsEarly(p.months_early)} before ${p.event}`,
    )
    .join("\n");

  const t3 =
    `Pattern: pre-fundraise breakouts have a GitHub fingerprint. ` +
    `Commit-velocity acceleration leads the deck by 21–47 days. ` +
    `SSRN-indexed methodology: ssrn.com/abstract=6606558\n\n` +
    `Receipts (backwards) → ${SITE}/receipts\n` +
    `Scout (forwards) → ${SITE}/predict`;

  return [t1, t2, t3];
}

function buildTelegramPost(r: ReceiptResponse): string {
  const top = r.top_wins
    .slice(0, 3)
    .map(
      (p, i) =>
        `${i + 1}. ${p.name} — ${formatMonthsEarly(p.months_early)} early (${p.event})`,
    )
    .join("\n");
  const rankLabel = RANK_LABEL[r.rank] ?? r.rank;
  return (
    `📜 **Receipts of the Week — @${r.username}**\n\n` +
    `Rank: ${rankLabel} (${Math.round(r.score)} pts)\n` +
    `${r.matched_count} validated wins · ${r.early_count} called early\n\n` +
    `Top calls:\n${top}\n\n` +
    `Score your own: ${SITE}/receipts`
  );
}

function buildSubstackNote(r: ReceiptResponse): string {
  const rankLabel = RANK_LABEL[r.rank] ?? r.rank;
  return (
    `@${r.username}'s GitHub stars contain receipts. ` +
    `${r.matched_count} validated wins, ${r.early_count} called early. ` +
    `Rank: ${rankLabel}. Score yours: ${SITE}/receipts/${r.username}`
  );
}

function buildLinkedinDraft(r: ReceiptResponse): string {
  const rankLabel = RANK_LABEL[r.rank] ?? r.rank;
  const top = r.top_wins
    .slice(0, 3)
    .map(
      (p) =>
        `· ${p.name} — starred ${formatMonthsEarly(p.months_early)} before ${p.event}`,
    )
    .join("\n");
  return (
    `Receipts of the Week: @${r.username}.\n\n` +
    `We score developers by what they starred before the news broke. ` +
    `Today's pick has a ${rankLabel} rank with ${r.matched_count} validated wins ` +
    `(${r.early_count} called early).\n\n` +
    `Top calls:\n${top}\n\n` +
    `What's your Scout Score? Free, 30 seconds, no signup: ${SITE}/receipts\n\n` +
    `Methodology (SSRN-indexed): ssrn.com/abstract=6606558`
  );
}

function renderDoc(args: {
  date: string;
  username: string;
  receipts: ReceiptResponse;
  twitter: string[];
  telegram: string;
  substack: string;
  linkedin: string;
}): string {
  const { date, username, receipts, twitter, telegram, substack, linkedin } = args;
  const rankLabel = RANK_LABEL[receipts.rank] ?? receipts.rank;
  const top = receipts.top_wins
    .slice(0, 5)
    .map(
      (p) =>
        `- **${p.name}** (\`${p.repo}\`) — starred ${new Date(p.starred_at).toISOString().slice(0, 10)} ` +
        `(${formatMonthsEarly(p.months_early)} before *${p.event}*)`,
    )
    .join("\n");

  return `# Receipts of the Week — ${date}

**Featured developer:** @${username}
**Rank:** ${rankLabel} (${Math.round(receipts.score)} pts)
**Validated wins:** ${receipts.matched_count}
**Called early:** ${receipts.early_count}
**Total stars scanned:** ${receipts.total_stars}
**Permalink:** ${SITE}/receipts/${username}
**Generated:** ${new Date().toISOString()}

## Top 5 calls

${top || "(no top wins available)"}

---

## Twitter thread (auto-postable)

**Tweet 1**
${twitter[0]}

**Tweet 2 (reply to Tweet 1)**
${twitter[1] || "(no top picks to feature)"}

**Tweet 3 (reply to Tweet 2)**
${twitter[2]}

---

## Telegram post (auto-postable on @gitdealflow)

${telegram}

---

## Substack Note (auto-postable)

${substack}

---

## LinkedIn draft (USER POSTS MANUALLY — per division-of-labor rule)

${linkedin}

---

## Distribution checklist

- [ ] Twitter thread — auto-post via tools/twitter
- [ ] Telegram channel post — paste manually if low subs (memory: feedback_telegram_low_sub_skip.md)
- [ ] Substack Note — auto-post via tools/substack
- [ ] LinkedIn — USER posts manually, no automation
- [ ] Reddit — DO NOT POST
- [ ] HN — skip

## Why this dev

Rotation: deterministic by-date pick from \`SEED_DEVS\` in
\`pseo-site/scripts/generate-receipts-of-the-week.ts\`. Override with
\`--user=<github-handle>\`.
`;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const isoDate = args.date ?? nextWednesdayISO();
  const username = args.user ?? pickSeedForDate(isoDate);

  console.log(`[ROTW] generating Receipts of the Week for ${isoDate} → @${username}`);

  let receipts: ReceiptResponse;
  try {
    receipts = await fetchReceipts(username);
  } catch (err) {
    console.error(`[ROTW] failed to fetch receipts for ${username}:`, err);
    process.exit(1);
  }

  if (receipts.matched_count === 0 && receipts.score < 1) {
    console.warn(
      `[ROTW] WARN: @${username} has thin receipts (${receipts.score} pts). ` +
        `Consider a different seed.`,
    );
  }

  const twitter = buildTwitterThread(receipts);
  const telegram = buildTelegramPost(receipts);
  const substack = buildSubstackNote(receipts);
  const linkedin = buildLinkedinDraft(receipts);

  const doc = renderDoc({
    date: isoDate,
    username,
    receipts,
    twitter,
    telegram,
    substack,
    linkedin,
  });

  const outDir = path.resolve(
    __dirname,
    "..",
    "..",
    "marketing",
    "receipts-of-the-week",
  );
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${isoDate}.md`);

  if (fs.existsSync(outFile)) {
    // Don't clobber a hand-edited draft — reroute to -fresh.md per the
    // never-clobber-user-drafts memory rule.
    const freshFile = outFile.replace(/\.md$/, "-fresh.md");
    fs.writeFileSync(freshFile, doc);
    console.log(`[ROTW] existing draft preserved; new copy at ${freshFile}`);
    return;
  }

  fs.writeFileSync(outFile, doc);
  console.log(`[ROTW] wrote ${outFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
