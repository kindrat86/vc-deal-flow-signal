#!/usr/bin/env node
/**
 * repurpose-digest.mjs — 1-to-many the weekly Sunday Signal Digest.
 *
 * Input:  emails/signal-digest-latest.html (regenerated weekly by
 *         pseo-site/scripts/generate-signal-digest-email.ts before send)
 * Output: tools/repurposing/out/<date>/
 *           telegram.md      — channel broadcast (Bot API ready)
 *           x-thread.md      — 6-8 tweet thread, ASCII only, no em-dashes
 *           linkedin.md      — company-page post (no personal profile)
 *           bluesky.json     — entries to append to tools/bluesky/post-queue.json
 *           blog.md          — monthly blog cross-post skeleton
 *           summary.json     — what was parsed + generated
 *
 * Fail-closed rules:
 *   - Reads ONLY the real rendered digest. If the file is missing or older
 *     than 6 days, exits 1 (never fabricate an issue).
 *   - No fabricated names/numbers: every startup line traces to the parsed
 *     HTML. Canonical claims only: 350+, 15 sectors, 21-47 days.
 *   - ASCII-only output (plain apostrophes, hyphens; no em-dashes, mojibake).
 *
 * Usage: node tools/repurposing/repurpose-digest.mjs [--check]
 *   --check: parse-only mode, prints summary, writes nothing (gate for cron).
 */
import { readFileSync, writeFileSync, mkdirSync, statSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";
import { createHash } from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..", "..");
const DIGEST = join(REPO, "emails", "signal-digest-latest.html");
const OUTDIR = join(REPO, "tools", "repurposing", "out");

const CHECK = process.argv.includes("--check");
const campaignArg = process.argv.find((a) => a.startsWith("--campaign="));

// ---------- digest parsing (fragile-HTML tolerant) ----------
const html = (() => {
  try {
    return readFileSync(DIGEST, "utf8");
  } catch {
    console.error(`FAIL: digest not found at ${DIGEST}`);
    process.exit(1);
  }
})();

const mtime = statSync(DIGEST).mtime;

const stripTags = (s) => s
  .replace(/<style[\s\S]*?<\/style>/gi, "")
  .replace(/<[^>]+>/g, " ")
  .replace(/&amp;/g, "&").replace(/&rarr;|&#8594;/g, "->")
  .replace(/&nbsp;/g, " ").replace(/&hellip;/g, "...")
  .replace(/&#8217;|&rsquo;/g, "'").replace(/&#8220;|&ldquo;|&#8221;|&rdquo;/g, '"')
  .replace(/&[a-z#0-9]+;/gi, "")
  .replace(/\s+/g, " ").trim();

const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
const issueTitle = titleMatch ? stripTags(titleMatch[1]) : "";
const weekMatch = issueTitle.match(/Week of ([A-Z][a-z]{2}) (\d{1,2})/);
if (!weekMatch) {
  console.error(`FAIL: digest title has no parseable "Week of Mon D" date: ${issueTitle || "<empty>"}`);
  process.exit(1);
}
let contentDate = new Date(`${weekMatch[1]} ${weekMatch[2]}, ${new Date().getUTCFullYear()} 00:00:00 UTC`);
if (Number.isNaN(contentDate.getTime())) {
  console.error(`FAIL: digest title date is invalid: ${weekMatch[0]}`);
  process.exit(1);
}
// Around New Year, a December issue parsed in January belongs to the prior year.
if (contentDate.getTime() > Date.now() + 31 * 86400000) {
  contentDate = new Date(Date.UTC(contentDate.getUTCFullYear() - 1, contentDate.getUTCMonth(), contentDate.getUTCDate()));
}
const ageDays = (Date.now() - contentDate.getTime()) / 86400000;
if (ageDays > 6 || ageDays < -1) {
  console.error(`FAIL: digest content is ${ageDays.toFixed(1)} days old (title ${weekMatch[0]}, mtime ${mtime.toISOString()}). Regenerate before repurposing.`);
  process.exit(1);
}
const issue = {
  title: issueTitle,
  date: contentDate.toISOString().slice(0, 10),
};
const CAMPAIGN = campaignArg?.slice("--campaign=".length) || `gdf-weekly-${issue.date.slice(0, 7)}`;
if (!/^[a-z0-9-]+$/.test(CAMPAIGN)) {
  console.error(`FAIL: invalid campaign slug: ${CAMPAIGN}`);
  process.exit(1);
}

// Top-5 startup cards from the digest-email template: each card carries
// a "#N" rank badge, a tx-mut sector cell, a tx-pri name div, and a green
// "+NNN%" velocity cell captioned "vs. usual pace".
const startups = [];
const cardRe = /class="tx-pri"[^>]*>([^<]{2,40})<\/div>[\s\S]{0,900}?color:#22c55e[^>]*>([+-]\d{1,5}%)/gi;
let cm;
while ((cm = cardRe.exec(html)) && startups.length < 5) {
  const name = stripTags(cm[1]).trim();
  if (!name) continue;
  startups.push({
    rank: startups.length + 1,
    name,
    velocityChange: cm[2],
    sector: "",
  });
}
// attach sectors: tx-mut uppercase sector cell appears right before each tx-pri name
const sectorRe = /class="tx-mut"[^>]*>([^<]{2,30})<\/td>[\s\S]{0,600}?class="tx-pri"[^>]*>([^<]{2,40})<\/div>/gi;
let sm;
while ((sm = sectorRe.exec(html))) {
  const sec = stripTags(sm[1]).trim();
  const nm = stripTags(sm[2]).trim();
  const hit = startups.find((x) => x.name === nm);
  if (hit && !hit.sector) hit.sector = sec;
}

// Fallback: first 5 lines of the plain text with a % pattern, ranked.
if (startups.length === 0) {
  const text = stripTags(html);
  const lineRe = /([A-Za-z0-9][A-Za-z0-9 .&-]{1,30})[^\n]{0,80}?([+-]\d{1,5}%)/g;
  let lm;
  const seen = new Set();
  while ((lm = lineRe.exec(text)) && startups.length < 5) {
    const name = lm[1].trim().replace(/^(?:The\s+)?(?:top|movers?|startups?).*$/i, "").trim();
    if (name.length < 2 || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    startups.push({ rank: startups.length + 1, name, velocityChange: lm[2], sector: "" });
  }
}

if (startups.length !== 5) {
  console.error(`FAIL: expected exactly 5 startups from the digest, parsed ${startups.length}. Inspect the HTML structure.`);
  process.exit(1);
}

// ---------- asset rendering (ASCII-only, no em-dashes) ----------
const ascii = (s) => s
  .replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')
  .replace(/\u2013|\u2014/g, "-").replace(/\u2192/g, "->")
  .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "");
const top = startups[0];
const sList = (n) => startups.slice(0, n).map((s) => `${s.rank}. ${s.name}${s.sector ? ` (${s.sector})` : ""}: commit velocity ${s.velocityChange}`).join("\n");

const urlFor = (source, medium, content, path = "/") =>
  `https://gitdealflow.com${path}?utm_source=${source}&utm_medium=${medium}&utm_campaign=${CAMPAIGN}&utm_content=${content}`;
const telegramUrl = urlFor("telegram", "social", "signal-of-week");
const xUrl = urlFor("x", "organic", "thread");
const linkedinUrl = urlFor("linkedin", "organic", "company-page");
const blueskyUrl = urlFor("bluesky", "organic", "top-mover");
const blogUrl = urlFor("syndication", "article", "weekly-digest");

const telegram = ascii(
`Signal of the Week: ${top.name}${top.sector ? ` (${top.sector})` : ""}

Commit velocity ${top.velocityChange} versus its own baseline. The documented examples show the pattern 21 to 47 days before public fundraise announcements.

This Sunday's five, ranked, in the free email:
${telegramUrl}

The board, methodology, and open dataset: https://signals.gitdealflow.com
Not investment advice. Naming a company means its public building activity matched the pattern.`);

const xTweets = [
  `1/8 Five startups accelerated on GitHub this week. ${top.name} shipped ${top.velocityChange} versus its own normal pace. We read public engineering activity across 350+ startup orgs so investors can notice the build-out before it reaches the press.`,
  ...startups.slice(0, 5).map((s, i) => `${i + 2}/8 ${s.rank}. ${s.name}${s.sector ? ` (${s.sector})` : ""}: commit velocity ${s.velocityChange} versus its own baseline.`),
  `7/8 Why this matters: the documented examples show this acceleration pattern 21 to 47 days before public fundraise announcements. The SSRN preprint, CC BY 4.0 dataset, and MIT-licensed engine make the method reproducible.`,
  `8/8 Every Sunday: five names with the plain-English why, free. No card. One click to leave. Not investment advice.\n\n${xUrl}`,
].map(ascii);
if (xTweets.some((tweet) => tweet.length > 280)) {
  console.error(`FAIL: X thread has an over-limit tweet: ${xTweets.map((t) => t.length).join(", ")}`);
  process.exit(1);
}
const xThread = xTweets.join("\n\n---\n\n");

const linkedin = ascii(
`Where do you look for deal flow before the round is public?

We read public GitHub engineering activity across 350+ startup organizations in 15 sectors. This week's fastest mover: ${top.name}${top.sector ? `, ${top.sector}` : ""}, with commit velocity ${top.velocityChange} versus its own baseline.

The documented pattern: engineering acceleration shows up 21 to 47 days before public fundraise announcements. The methodology is open (SSRN preprint, CC BY 4.0 dataset, MIT-licensed reference engine), and every pick is graded in public.

Free Sunday email, five names with the plain-English why:
${linkedinUrl}

Not investment advice. Naming a company means its public building activity matched the pattern, not that it is raising.`);

const blueskyPosts = [
  {
    id: `digest-${issue.date}-top-mover`,
    text: ascii(`${top.name} is shipping ${top.velocityChange} versus its own baseline. The documented examples show the pattern 21-47 days before public fundraise announcements.\n\nFive names every Sunday, free:\n${blueskyUrl}`),
    tags: ["digest", "repurpose", issue.date],
    use_count: 0,
  },
  {
    id: `digest-${issue.date}-methodology`,
    text: ascii(`The computation is open source and the dataset is CC BY 4.0. Every number re-derivable. The lead time claim is documented: 21 to 47 days before public announcements.\n\nsignals.gitdealflow.com/methodology`),
    tags: ["digest", "repurpose", issue.date, "evergreen"],
    use_count: 0,
  },
];

const blog = ascii(
`# Where deal flow hides before the round: this week's GitHub acceleration (week of ${issue.date})

<!-- Monthly blog cross-post skeleton. Fill the narrative from the digest, keep the claims canonical. -->
<!-- Canonical claims ONLY: 350+ orgs, 15 sectors, 21-47 days, 219 startup-period observations across 55 startups. -->

${top.name} tops this week's read with commit velocity ${top.velocityChange} versus its own baseline${top.sector ? ` in ${top.sector}` : ""}.

This week's five:

${sList(5)}

## Why engineering momentum is a leading indicator

[2-3 paragraphs: the panel, the lead time, the honest caveats. Link the methodology and the scorecard.]

## How to verify any of this yourself

[The open dataset, the MIT engine, the public prediction ledger. Zero-click value: give the reader the method even if they never subscribe.]

## Get the Sunday read

Five names, plain-English why, free: ${blogUrl}
`);

const summary = {
  generatedForIssue: issue.date,
  sourceDigestSha256: createHash("sha256").update(html).digest("hex"),
  digestFile: "emails/signal-digest-latest.html",
  issueTitle: issue.title,
  campaign: CAMPAIGN,
  xTweetLengths: xTweets.map((tweet) => tweet.length),
  parsedStartups: startups,
  outputs: CHECK ? [] : ["telegram.md", "x-thread.md", "linkedin.md", "bluesky.json", "blog.md"],
};

if (CHECK) {
  console.log(JSON.stringify(summary, null, 2));
  console.log("CHECK OK: digest parsed, assets renderable.");
  process.exit(0);
}

mkdirSync(join(OUTDIR, issue.date), { recursive: true });
const D = join(OUTDIR, issue.date);
writeFileSync(join(D, "telegram.md"), telegram, "utf8");
writeFileSync(join(D, "x-thread.md"), xThread, "utf8");
writeFileSync(join(D, "linkedin.md"), linkedin, "utf8");
writeFileSync(join(D, "bluesky.json"), JSON.stringify(blueskyPosts, null, 2), "utf8");
writeFileSync(join(D, "blog.md"), blog, "utf8");
writeFileSync(join(D, "summary.json"), JSON.stringify(summary, null, 2), "utf8");

console.log(`OK: wrote 5 assets to ${D}`);
console.log(`Parsed ${startups.length} startups; top: ${top.name} (${top.velocityChange})`);
