/**
 * Leaderboard Friday recap, Fri cadence in Greg Isenberg's 30-day
 * distribution play. Reads the top 3 Scouts from PocketBase and writes a
 * distribution-ready markdown doc with Twitter / Telegram / Substack /
 * LinkedIn copy. Public ranking creates competition; competition creates
 * retention.
 *
 * No auto-posting, drafts only, per division-of-labor rules.
 *
 * Usage:
 *   npx tsx scripts/generate-leaderboard-friday.ts          # next Friday
 *   npx tsx scripts/generate-leaderboard-friday.ts --date=2026-05-08
 *
 * Output: marketing/leaderboard-friday/YYYY-MM-DD.md
 */

import * as fs from "fs";
import * as path from "path";

const SITE = "https://signals.gitdealflow.com";
const PB_URL = process.env.POCKETBASE_URL ?? "https://gitdealflow-pb.fly.dev";
const PB_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const PB_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

interface PbScout {
  id: string;
  handle: string;
  points: number;
  rank: string;
  predictions_correct?: number;
  predictions_wrong?: number;
  predictions_pending?: number;
}

interface CliArgs {
  date?: string;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {};
  for (const a of argv) {
    if (a.startsWith("--date=")) args.date = a.slice(7);
  }
  return args;
}

function nextFridayISO(from = new Date()): string {
  const d = new Date(from);
  const dow = d.getUTCDay(); // 0=Sun ... 5=Fri
  const offset = (5 - dow + 7) % 7 || 7;
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

const RANK_LABEL: Record<string, string> = {
  curious: "Curious",
  scout: "Scout",
  sharp: "Sharp",
  elite: "Elite",
  oracle: "Oracle",
};

async function pbAuth(): Promise<string> {
  if (!PB_EMAIL || !PB_PASSWORD) {
    throw new Error(
      "PocketBase admin creds not set: POCKETBASE_ADMIN_EMAIL / POCKETBASE_ADMIN_PASSWORD",
    );
  }
  const res = await fetch(`${PB_URL}/api/admins/auth-with-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity: PB_EMAIL, password: PB_PASSWORD }),
  });
  if (!res.ok) {
    throw new Error(`PB auth failed: ${res.status} ${await res.text()}`);
  }
  const j = (await res.json()) as { token: string };
  return j.token;
}

async function fetchTopScouts(limit = 5): Promise<PbScout[]> {
  const token = await pbAuth();
  const url =
    `${PB_URL}/api/collections/scouts/records?` +
    `perPage=${limit}&sort=-points&filter=` +
    encodeURIComponent("points > 0");
  const res = await fetch(url, {
    headers: { Authorization: token },
  });
  if (!res.ok) {
    throw new Error(`leaderboard fetch failed: ${res.status}`);
  }
  const j = (await res.json()) as { items: PbScout[] };
  return j.items;
}

function buildTwitterThread(scouts: PbScout[], date: string): string[] {
  const top = scouts.slice(0, 3);
  if (top.length === 0) return [];

  const t1 =
    `Scout Leaderboard, week of ${date}.\n\n` +
    `Top 3 devs calling startup fundraises from public GitHub signals:\n\n` +
    top
      .map(
        (s, i) =>
          `${i + 1}. @${s.handle}, ${Math.round(s.points)} pts (${RANK_LABEL[s.rank] ?? s.rank})`,
      )
      .join("\n") +
    `\n\nFull leaderboard: ${SITE}/leaderboard`;

  const t2 =
    `How it works:\n\n` +
    `Pick any GitHub org. Predict whether they raise a Series A in 6 months. ` +
    `Confidence 50-99%. Auto-resolves at the 6-month mark.\n\n` +
    `Correct call: +confidence/10 pts. Wrong call: -confidence/20 pts.\n\n` +
    `Play: ${SITE}/predict`;

  const t3 =
    `Top 1% earn an Oracle badge. The leaderboard refreshes every Friday.\n\n` +
    `Free tier: 3 predictions / month.\n` +
    `Dashboard (€9.97/mo): 10 / month + Sharp / Elite / Oracle eligibility.\n\n` +
    `Why it works: SSRN-indexed methodology, ssrn.com/abstract=6606558`;

  return [t1, t2, t3];
}

function buildTelegramPost(scouts: PbScout[], date: string): string {
  const top = scouts.slice(0, 3);
  if (top.length === 0) {
    return `📊 **Leaderboard recap, ${date}**\n\nQuiet week, no scoring picks resolved yet. Play the Scout Game: ${SITE}/predict`;
  }
  const ranking = top
    .map(
      (s, i) =>
        `${i + 1}. @${s.handle}, ${Math.round(s.points)} pts (${RANK_LABEL[s.rank] ?? s.rank})`,
    )
    .join("\n");
  return (
    `📊 **Leaderboard recap, ${date}**\n\n` +
    `Top 3 Scouts this week:\n\n${ranking}\n\n` +
    `Full ranking: ${SITE}/leaderboard\n` +
    `Play: ${SITE}/predict`
  );
}

function buildSubstackNote(scouts: PbScout[], date: string): string {
  const top = scouts[0];
  if (!top) {
    return `Scout leaderboard quiet this week. Play the Scout Game and get on next Friday's ranking: ${SITE}/predict`;
  }
  return (
    `Scout Leaderboard, ${date}. Top spot: @${top.handle} with ${Math.round(top.points)} ` +
    `points calling fundraises from GitHub signals. Top 1% earn Oracle. Play: ${SITE}/predict`
  );
}

function buildLinkedinDraft(scouts: PbScout[], date: string): string {
  const top = scouts.slice(0, 3);
  if (top.length === 0) {
    return (
      `Scout Game, week of ${date}. No resolved scoring picks this week.\n\n` +
      `The game: predict whether a startup raises a Series A in 6 months from their GitHub signals. ` +
      `Free tier 3 picks / month, public leaderboard, Oracle badge for top 1%.\n\n` +
      `Try it: ${SITE}/predict`
    );
  }
  const ranking = top
    .map(
      (s, i) =>
        `${i + 1}. @${s.handle}, ${Math.round(s.points)} points (${RANK_LABEL[s.rank] ?? s.rank})`,
    )
    .join("\n");
  return (
    `Scout Leaderboard, week of ${date}.\n\n` +
    `Top 3 developers calling startup fundraises from public GitHub engineering signals:\n\n${ranking}\n\n` +
    `The game: pick any GitHub org, predict whether they raise a Series A in 6 months. ` +
    `Auto-resolves at the 6-month window. Top 1% earn an Oracle badge.\n\n` +
    `Free 3 picks / month: ${SITE}/predict\n` +
    `Methodology (SSRN-indexed): ssrn.com/abstract=6606558`
  );
}

function renderDoc(args: {
  date: string;
  scouts: PbScout[];
  twitter: string[];
  telegram: string;
  substack: string;
  linkedin: string;
}): string {
  const { date, scouts, twitter, telegram, substack, linkedin } = args;
  const fullList = scouts
    .map(
      (s, i) =>
        `${i + 1}. @${s.handle}, ${Math.round(s.points)} pts (${RANK_LABEL[s.rank] ?? s.rank})` +
        (s.predictions_correct
          ? ` · ${s.predictions_correct}W ${s.predictions_wrong ?? 0}L`
          : ""),
    )
    .join("\n");

  return `# Leaderboard Friday, ${date}

**Permalink:** ${SITE}/leaderboard
**Top scouts shown:** ${scouts.length}
**Generated:** ${new Date().toISOString()}

## Full ranking (this run)

${fullList || "(no scouts with positive points yet)"}

---

## Twitter thread (auto-postable)

${twitter
  .map((t, i) => `**Tweet ${i + 1}${i === 0 ? "" : " (reply to previous)"}**\n${t}`)
  .join("\n\n")}

---

## Telegram post (auto-postable on @gitdealflow)

${telegram}

---

## Substack Note (auto-postable)

${substack}

---

## LinkedIn draft (USER POSTS MANUALLY, per division-of-labor rule)

${linkedin}

---

## Distribution checklist

- [ ] Twitter thread, auto-post via tools/twitter
- [ ] Telegram channel post, auto-post via tools/anthropic-extension-watcher Telegram pipeline (or paste manually if low subs)
- [ ] Substack Note, auto-post via tools/substack
- [ ] LinkedIn, USER posts manually, no automation
- [ ] Reddit, DO NOT POST
- [ ] HN, skip

## Notes

Generator: \`pseo-site/scripts/generate-leaderboard-friday.ts\`
Reads top scouts from PocketBase \`scouts\` collection, sorted by points desc, points > 0.
Override with \`--date=YYYY-MM-DD\`.
`;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const isoDate = args.date ?? nextFridayISO();

  console.log(`[LBF] generating Leaderboard Friday for ${isoDate}`);

  let scouts: PbScout[] = [];
  try {
    scouts = await fetchTopScouts(5);
  } catch (err) {
    console.warn(`[LBF] PB unavailable; rendering empty-state recap. ${err}`);
  }

  const twitter = buildTwitterThread(scouts, isoDate);
  const telegram = buildTelegramPost(scouts, isoDate);
  const substack = buildSubstackNote(scouts, isoDate);
  const linkedin = buildLinkedinDraft(scouts, isoDate);

  const doc = renderDoc({
    date: isoDate,
    scouts,
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
    "leaderboard-friday",
  );
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${isoDate}.md`);

  if (fs.existsSync(outFile)) {
    const freshFile = outFile.replace(/\.md$/, "-fresh.md");
    fs.writeFileSync(freshFile, doc);
    console.log(`[LBF] existing draft preserved; new copy at ${freshFile}`);
    return;
  }

  fs.writeFileSync(outFile, doc);
  console.log(`[LBF] wrote ${outFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
