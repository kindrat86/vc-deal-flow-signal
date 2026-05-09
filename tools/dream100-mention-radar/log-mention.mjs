#!/usr/bin/env node
/**
 * Manual mention logger — for platforms the auto-scanner can't reach
 * (Twitter/X, LinkedIn, Substack comments, podcasts, private DMs).
 *
 * Adds an entry with the same shape as scan.mjs output, dedupes by URL,
 * appends to marketing/dream100-mentions-log.md with 4h SLA timestamp.
 *
 * Usage:
 *   node log-mention.mjs --where twitter --who "@swyx" \
 *     --url "https://x.com/swyx/status/123" \
 *     --quote "Just saw gitdealflow predict the Series A on day 31"
 *
 * Required: --where --who --url
 * Optional: --quote --title --keyword (defaults to 'manual')
 */
import { readFile, writeFile, appendFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const STATE_PATH = join(__dirname, "state.json");
const LOG_PATH = join(REPO_ROOT, "marketing", "dream100-mentions-log.md");

const FOUR_HOURS_MS = 4 * 3600_000;

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

function isoSlice(ms) {
  return new Date(ms).toISOString().slice(0, 16).replace("T", " ") + "Z";
}
function dateSlice(ms) {
  return new Date(ms).toISOString().slice(0, 10);
}

async function main() {
  const where = arg("where");
  const who = arg("who");
  const url = arg("url");
  const quote = arg("quote", "");
  const title = arg("title", "");
  const keyword = arg("keyword", "manual");

  if (!where || !who || !url) {
    console.error(
      "usage: node log-mention.mjs --where <platform> --who <handle> --url <link> [--quote <text>] [--title <text>] [--keyword <kw>]"
    );
    process.exit(2);
  }

  const state = existsSync(STATE_PATH)
    ? JSON.parse(await readFile(STATE_PATH, "utf8"))
    : { version: 1, lastRun: null, seen: [] };

  if ((state.seen || []).some((s) => s.url === url)) {
    console.log(`✓ already logged: ${url}`);
    return;
  }

  const now = Date.now();
  const replyBy = isoSlice(now + FOUR_HOURS_MS);
  const detected = isoSlice(now);
  const day = dateSlice(now);
  const platformLabel = where.charAt(0).toUpperCase() + where.slice(1);

  const entry = [
    `- **${platformLabel} — ${who}** — ${title || "(manual entry)"}`,
    `  - URL: ${url}`,
    `  - Posted: — · Detected: ${detected} · Reply-by (4h SLA): **${replyBy}**`,
    quote ? `  - Quote: > ${quote.replace(/\s+/g, " ").trim()}` : null,
    `  - Status: \`pending\` — keyword: \`${keyword}\``,
    `  - Reply: _none yet_`,
    "",
  ]
    .filter(Boolean)
    .join("\n");

  const existing = existsSync(LOG_PATH) ? await readFile(LOG_PATH, "utf8") : "";
  const toAppend = existing.includes(`### ${day}`) ? "\n" + entry : `\n### ${day}\n\n` + entry;
  await appendFile(LOG_PATH, toAppend);

  state.seen = [...(state.seen || []), { url, firstSeen: now }];
  state.lastRun = now;
  await writeFile(STATE_PATH, JSON.stringify(state, null, 2) + "\n");

  console.log(`✓ logged ${platformLabel} mention from ${who}`);
  console.log(`  Reply by ${replyBy} (4h SLA)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
