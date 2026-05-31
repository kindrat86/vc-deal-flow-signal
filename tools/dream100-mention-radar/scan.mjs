#!/usr/bin/env node
/**
 * Dream 100 inbound-mention radar.
 *
 * Scans free public APIs (HN Algolia, Reddit, Lobsters, GitHub) for third-party
 * mentions of our brand keywords. Dedupes against state.json. Appends new
 * mentions to marketing/dream100-mentions-log.md with 4h reply SLA timestamps.
 *
 * Designed for unattended runs in GH Actions:
 *  - All sources are auth-free, except GitHub which uses GITHUB_TOKEN if set.
 *  - One source failing does not abort the run (we want the others).
 *  - Idempotent: re-running with no new mentions is a no-op (no log writes).
 *
 * Usage:
 *   node scan.mjs                # scan all sources
 *   node scan.mjs --dry          # report only, no writes
 *   node scan.mjs --since 7d     # widen window (default 2d)
 *   node scan.mjs --source hn    # scan one source
 *
 * Brunson framework: this closes the inbound side of Traffic Secrets Ch 5
 * (The Dream 100). The outbound side already lives in
 * marketing/dream-100-engagement-log.md and dream-100-tier-1-action-queue.md.
 */
import { readFile, writeFile, appendFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const KEYWORDS_PATH = join(__dirname, "keywords.json");
const STATE_PATH = join(__dirname, "state.json");
const LOG_PATH = join(REPO_ROOT, "marketing", "dream100-mentions-log.md");

const args = process.argv.slice(2);
const argv = {
  dry: args.includes("--dry"),
  since: extractArg("--since") || "2d",
  source: extractArg("--source"), // optional: hn|reddit|lobsters|github
};

function extractArg(flag) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : null;
}

const SINCE_MS = parseSince(argv.since);
function parseSince(v) {
  const m = /^(\d+)([dh])$/.exec(v || "");
  if (!m) return 2 * 24 * 3600 * 1000;
  const [, n, u] = m;
  return Number(n) * (u === "h" ? 3600_000 : 86_400_000);
}

const NOW = Date.now();
const FOUR_HOURS_MS = 4 * 3600_000;

function isoSlice(ms) {
  return new Date(ms).toISOString().slice(0, 16).replace("T", " ") + "Z";
}
function dateSlice(ms) {
  return new Date(ms).toISOString().slice(0, 10);
}

async function loadJson(p, fallback) {
  if (!existsSync(p)) return fallback;
  return JSON.parse(await readFile(p, "utf8"));
}
async function writeJson(p, obj) {
  await writeFile(p, JSON.stringify(obj, null, 2) + "\n");
}

function matchesKeyword(haystack, kws) {
  if (!haystack) return null;
  const h = haystack.toLowerCase();
  for (const k of kws.strong) if (h.includes(k.toLowerCase())) return { kw: k, strength: "strong" };
  for (const k of kws.soft) if (h.includes(k.toLowerCase())) return { kw: k, strength: "soft" };
  return null;
}

function isExcluded(url, kws) {
  if (!url) return false;
  return kws.exclude_domains.some((d) => url.toLowerCase().includes(d.toLowerCase()));
}

function isExcludedAuthor(author, kws) {
  if (!author) return false;
  const list = kws.exclude_authors || [];
  const a = author.toLowerCase();
  return list.some((x) => a === x.toLowerCase() || a.includes(x.toLowerCase()));
}

async function safeFetch(url, opts = {}) {
  try {
    const r = await fetch(url, {
      ...opts,
      headers: {
        "User-Agent": "gitdealflow-mention-radar/1.0 (+https://signals.gitdealflow.com)",
        Accept: "application/json",
        ...(opts.headers || {}),
      },
    });
    if (!r.ok) {
      console.warn(`[fetch] ${r.status} ${url}`);
      return null;
    }
    return await r.json();
  } catch (e) {
    console.warn(`[fetch] error ${url}: ${e.message}`);
    return null;
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Source: HN Algolia (free, no auth)
// ──────────────────────────────────────────────────────────────────────────────
async function scanHN(kws) {
  const out = [];
  for (const kw of [...kws.strong, ...kws.soft]) {
    const since = Math.floor((NOW - SINCE_MS) / 1000);
    const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(kw)}&numericFilters=created_at_i>${since}&hitsPerPage=20`;
    const j = await safeFetch(url);
    if (!j?.hits) continue;
    for (const hit of j.hits) {
      const itemUrl = hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`;
      if (isExcluded(itemUrl, kws)) continue;
      if (isExcludedAuthor(hit.author, kws)) continue;
      const text =
        [hit.title, hit.story_text, hit.comment_text, hit.url].filter(Boolean).join(" ") || "";
      const m = matchesKeyword(text, kws);
      if (!m) continue;
      out.push({
        platform: "HN",
        who: hit.author || "anon",
        title: hit.title || (hit.comment_text || "").slice(0, 120),
        url: itemUrl,
        quote: (hit.comment_text || hit.story_text || hit.title || "").slice(0, 280),
        detectedAt: NOW,
        keyword: m.kw,
        strength: m.strength,
        rawCreatedAt: hit.created_at_i ? hit.created_at_i * 1000 : NOW,
      });
    }
  }
  return out;
}

// ──────────────────────────────────────────────────────────────────────────────
// Source: Reddit JSON (free, User-Agent required)
// ──────────────────────────────────────────────────────────────────────────────
async function scanReddit(kws) {
  const out = [];
  for (const kw of kws.strong) {
    // strong only — Reddit search is noisy on soft terms
    const url = `https://www.reddit.com/search.json?q=${encodeURIComponent('"' + kw + '"')}&sort=new&t=week&limit=25`;
    const j = await safeFetch(url);
    const children = j?.data?.children || [];
    for (const c of children) {
      const d = c.data || {};
      const itemUrl = `https://reddit.com${d.permalink || ""}`;
      if (isExcluded(d.url || itemUrl, kws)) continue;
      if (isExcludedAuthor(d.author, kws)) continue;
      const text = [d.title, d.selftext, d.body, d.url].filter(Boolean).join(" ") || "";
      const m = matchesKeyword(text, kws);
      if (!m) continue;
      out.push({
        platform: "Reddit",
        who: `u/${d.author || "anon"}` + (d.subreddit ? ` in r/${d.subreddit}` : ""),
        title: d.title || (d.selftext || "").slice(0, 120),
        url: itemUrl,
        quote: (d.selftext || d.body || d.title || "").slice(0, 280),
        detectedAt: NOW,
        keyword: m.kw,
        strength: m.strength,
        rawCreatedAt: d.created_utc ? d.created_utc * 1000 : NOW,
      });
    }
  }
  return out;
}

// ──────────────────────────────────────────────────────────────────────────────
// Source: dev.to (free, no auth)
// ──────────────────────────────────────────────────────────────────────────────
async function scanDevTo(kws) {
  const out = [];
  // dev.to has no full-text search via API; we pull recent articles tagged with
  // venturecapital, sourcing, devtools, ai, mcp, github, then keyword-filter
  // bodies. Cheap and gives us coverage of the dev-investor cohort.
  const tags = ["venturecapital", "startup", "ai", "github", "mcp", "devtools"];
  for (const tag of tags) {
    const url = `https://dev.to/api/articles?tag=${encodeURIComponent(tag)}&per_page=30`;
    const j = await safeFetch(url);
    if (!Array.isArray(j)) continue;
    for (const it of j) {
      if (isExcluded(it.url, kws)) continue;
      if (isExcludedAuthor(it.user?.username, kws)) continue;
      const created = it.published_at ? Date.parse(it.published_at) : NOW;
      if (NOW - created > SINCE_MS) continue;
      const text = [it.title, it.description, it.tag_list?.join(" ")].filter(Boolean).join(" ");
      const m = matchesKeyword(text, kws);
      if (!m) continue;
      out.push({
        platform: "dev.to",
        who: it.user?.username || "anon",
        title: it.title,
        url: it.url,
        quote: (it.description || it.title || "").slice(0, 280),
        detectedAt: NOW,
        keyword: m.kw,
        strength: m.strength,
        rawCreatedAt: created,
      });
    }
  }
  return out;
}

// ──────────────────────────────────────────────────────────────────────────────
// Source: GitHub (search code + issues + commits) — uses GITHUB_TOKEN when set
// ──────────────────────────────────────────────────────────────────────────────
async function scanGitHub(kws) {
  const out = [];
  const token = process.env.GITHUB_TOKEN || process.env.GH_PAT;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  for (const kw of kws.strong) {
    // search issues + PRs (covers public repos referencing us)
    const u = `https://api.github.com/search/issues?q=${encodeURIComponent(kw)}+in:title,body&sort=created&order=desc&per_page=15`;
    const j = await safeFetch(u, { headers });
    const items = j?.items || [];
    for (const it of items) {
      if (isExcluded(it.html_url, kws)) continue;
      if (isExcludedAuthor(it.user?.login, kws)) continue;
      const created = it.created_at ? Date.parse(it.created_at) : NOW;
      if (NOW - created > SINCE_MS) continue;
      const text = [it.title, it.body].filter(Boolean).join(" ");
      const m = matchesKeyword(text, kws);
      if (!m) continue;
      out.push({
        platform: "GitHub",
        who: it.user?.login || "anon",
        title: it.title,
        url: it.html_url,
        quote: (it.body || it.title || "").slice(0, 280),
        detectedAt: NOW,
        keyword: m.kw,
        strength: m.strength,
        rawCreatedAt: created,
      });
    }
  }
  return out;
}

// ──────────────────────────────────────────────────────────────────────────────
// Logging
// ──────────────────────────────────────────────────────────────────────────────
function entryToMarkdown(m) {
  const replyBy = isoSlice(m.detectedAt + FOUR_HOURS_MS);
  const detected = isoSlice(m.detectedAt);
  const posted = m.rawCreatedAt && m.rawCreatedAt < m.detectedAt ? isoSlice(m.rawCreatedAt) : "—";
  const quote = (m.quote || "").replace(/\s+/g, " ").trim();
  const tag = m.strength === "strong" ? "" : ` _(soft match: \`${m.keyword}\`)_`;
  return [
    `- **${m.platform} — ${m.who}** — ${m.title?.slice(0, 140) || "(no title)"}` + tag,
    `  - URL: ${m.url}`,
    `  - Posted: ${posted} · Detected: ${detected} · Reply-by (4h SLA): **${replyBy}**`,
    quote ? `  - Quote: > ${quote}` : null,
    `  - Status: \`pending\` — keyword: \`${m.keyword}\``,
    `  - Reply: _none yet_`,
    "",
  ]
    .filter(Boolean)
    .join("\n");
}

async function appendToLog(mentions) {
  if (!mentions.length) return;
  // Group by date (UTC day of detection)
  const byDay = new Map();
  for (const m of mentions) {
    const day = dateSlice(m.detectedAt);
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day).push(m);
  }
  // Append day-grouped sections at the END of the file
  const existing = await readFile(LOG_PATH, "utf8");
  let toAppend = "";
  for (const [day, list] of [...byDay.entries()].sort()) {
    if (existing.includes(`### ${day}`)) {
      // Day already exists — just append entries (no new heading)
      toAppend += "\n" + list.map(entryToMarkdown).join("\n");
    } else {
      toAppend += `\n### ${day}\n\n` + list.map(entryToMarkdown).join("\n");
    }
  }
  await appendFile(LOG_PATH, toAppend);
}

// ──────────────────────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────────────────────
async function main() {
  const kws = await loadJson(KEYWORDS_PATH);
  const state = await loadJson(STATE_PATH, { version: 1, lastRun: null, seen: [] });
  const seenSet = new Set((state.seen || []).map((s) => s.url));

  const sources = argv.source ? [argv.source] : ["hn", "reddit", "devto", "github"];
  const all = [];
  for (const s of sources) {
    let r = [];
    try {
      if (s === "hn") r = await scanHN(kws);
      else if (s === "reddit") r = await scanReddit(kws);
      else if (s === "devto") r = await scanDevTo(kws);
      else if (s === "github") r = await scanGitHub(kws);
    } catch (e) {
      console.warn(`[scan ${s}] ${e.message}`);
    }
    console.log(`[${s}] found ${r.length} candidate(s)`);
    all.push(...r);
  }

  // Dedup
  const fresh = [];
  for (const m of all) {
    if (seenSet.has(m.url)) continue;
    seenSet.add(m.url);
    fresh.push(m);
  }
  console.log(`[total] ${all.length} scanned · ${fresh.length} new`);

  if (argv.dry) {
    console.log(JSON.stringify(fresh, null, 2));
    return;
  }

  if (fresh.length) {
    await appendToLog(fresh);
    state.seen = [
      ...(state.seen || []),
      ...fresh.map((m) => ({ url: m.url, firstSeen: m.detectedAt })),
    ];
  }
  state.lastRun = NOW;
  await writeJson(STATE_PATH, state);

  if (fresh.length) {
    console.log(`✓ logged ${fresh.length} new mention(s) to marketing/dream100-mentions-log.md`);
    console.log(`  Reply window: 4h from detection. Run 'gh pr list' or check the log.`);
  } else {
    console.log("✓ no new mentions this run");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
