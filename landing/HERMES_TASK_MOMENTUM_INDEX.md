# HERMES TASK — gitdealflow.com: GitHub Startup Momentum Index (live data asset)

> **Runbook for:** Hermes Agent running DeepSeek v4 Pro
> **Mode:** FULLY AUTONOMOUS — build, validate, commit, and deploy without human intervention, subject to the fail-safes in §1. If a fail-safe trips, STOP and do not deploy.
> **Repo:** `~/signals-gitdealflow/landing` (static HTML site, git repo, author `sales@sipiteno.com`)
> **Deploy:** Vercel CLI upload — `vercel --prod --yes` from the repo root (project `landing`, `.vercel/project.json` already correct). NO build step (`outputDirectory: "."`).
> **Author of runbook:** Claude (2026-07-21), grounded in a live audit of the repo.
> **Node:** v22 (global `fetch` available — no dependencies needed).

---

## 0. What you are building and why

gitdealflow.com is already heavily optimized: 1,454 pages, pSEO, free calculators, `agents.txt`/`ai.txt`, `knowledge-graph.json`, i18n, and a `/data/` "Research Datasets" hub (CC BY 4.0). But every dataset in `/data/` is a **static, hand-written HTML page**. There is **no live, auto-refreshing, real-data asset with a page per entity** anywhere on the site.

That is the single highest-ceiling organic lever this site is missing. You will build a **GitHub Startup Momentum Index**: a public, weekly-refreshing leaderboard computed from **real GitHub public API data**, with:

- A ranked **index page** (`/data/momentum-index/`)
- A **detail page per startup** (`/data/momentum-index/{owner}-{repo}`) — these are the long-tail, indexable, linkable pages that drive organic
- A **downloadable dataset** (`/data/momentum-index/data.json`, CC BY 4.0) — the backlink surface (datasets get cited)
- **Dataset + ItemList + FAQ + Breadcrumb JSON-LD** — so Google and AI engines can ingest and cite it
- A **history file** so week-over-week momentum deltas are real, not invented
- Registration in the sitemaps + the existing `/data/feed.json`

**Why this skyrockets organic (mechanism):** proprietary, regularly-updated data indexes are the most reliable backlink + AI-citation magnet in 2026 (the "data study" playbook). GitDealFlow has a natural monopoly on the GitHub-signal angle. Each startup's detail page targets long-tail queries ("{startup} github momentum", "is {startup} growing", "{startup} engineering activity"), and the index itself is inherently citable ("according to GitDealFlow's Momentum Index…").

---

## 1. 🚨 HARD GUARDRAILS + FAIL-SAFES — READ FIRST

### 1a. NEVER fabricate. Rule #1.
- Every number on every page must come from the **live GitHub API response** or be **deterministically computed** from those numbers by the documented formula in §3. No invented stars, growth rates, rankings, or dates.
- The **methodology must be printed on the index page** (the exact score formula). Transparency is the whole point — a black-box score readers can't verify is worthless and untrustworthy.
- This project has a documented history of fabricated-stat incidents ("2,400+", "3,200 contractors"). Do not add to it.

### 1b. Not investment advice.
- The Momentum Score measures **software-engineering activity signals only** (stars, commits recency, contributor growth). It is **NOT** a buy/sell/valuation signal.
- Every page MUST carry this exact disclaimer: *"The Momentum Score reflects public software-engineering activity only. It is not investment advice, a valuation, or a recommendation to buy, sell, or fund any company."*

### 1c. FAIL-SAFES — if any trips, DO NOT DEPLOY, and report:
1. **Data completeness:** if fewer than **80%** of seed repos fetch successfully, `_build_momentum_index.mjs` exits non-zero. Do not deploy a partial index.
2. **Non-empty:** never write an index with 0 entries. The script refuses.
3. **Validity:** all generated JSON-LD must `JSON.parse` (validation in §6). If any fails, do not deploy.
4. **Deploy verification:** after `vercel --prod`, curl the live URL and confirm a known marker string is present. If not present after 3 deploy attempts, STOP and report — do NOT loop indefinitely (memory: Vercel CLI deploys are flaky/UNKNOWN-stuck ~half the time).

### 1d. Rate limits.
- Unauthenticated GitHub API = **60 requests/hour per IP**. The script uses **exactly one request per repo**. Keep the seed list ≤ 50 when unauthenticated.
- If an environment variable `GITHUB_TOKEN` is present, the script uses it (5,000/hr) and you may grow the seed list later. Check with `echo ${GITHUB_TOKEN:+set}`. A token is optional; the default 40-repo seed works unauthenticated.

### 1e. Site gotchas.
- This is a **static** site: no build, no bundler. Generated files are plain `.html`/`.json` uploaded as-is.
- Do **not** touch the SPA/Vite gotchas from other repos — they don't apply here, but also do not restructure existing files. You only **add** a new folder `data/momentum-index/` plus small, marker-guarded, idempotent edits to `sitemap-index.xml`, a new `sitemap-momentum.xml`, `data/feed.json`, and one card in `data/index.html`.
- Idempotent: re-running the whole task must not create duplicates or double-append.

---

## 2. Deliverable A — seed list `data/momentum-index/seed.json`

Create this file exactly. These are all **real, public** GitHub repositories of well-known startups/dev-tools. The script fetches live data for each; any that 404 are skipped safely.

```json
{
  "note": "Seed list for the GitHub Startup Momentum Index. Real public repos only. Owner may edit/extend. One API call per repo — keep <=50 unless GITHUB_TOKEN is set.",
  "repos": [
    "vercel/next.js", "supabase/supabase", "calcom/cal.com", "PostHog/posthog",
    "denoland/deno", "oven-sh/bun", "tauri-apps/tauri", "langchain-ai/langchain",
    "run-llama/llama_index", "appwrite/appwrite", "nocodb/nocodb", "twentyhq/twenty",
    "medusajs/medusa", "novuhq/novu", "triggerdotdev/trigger.dev", "windmill-labs/windmill",
    "unkeyed/unkey", "documenso/documenso", "formbricks/formbricks", "pocketbase/pocketbase",
    "go-gitea/gitea", "coollabsio/coolify", "immich-app/immich", "plausible/analytics",
    "umami-software/umami", "n8n-io/n8n", "directus/directus", "strapi/strapi",
    "meilisearch/meilisearch", "qdrant/qdrant", "weaviate/weaviate", "chroma-core/chroma",
    "mindsdb/mindsdb", "ollama/ollama", "activepieces/activepieces", "typesense/typesense",
    "hoppscotch/hoppscotch", "appsmithorg/appsmith", "refinedev/refine", "cline/cline"
  ]
}
```

---

## 3. Deliverable B — generator `data/momentum-index/_build_momentum_index.mjs`

Create this file exactly. It fetches real data, computes the score, writes all pages + dataset + sitemap, and updates history. Self-contained Node ESM, no dependencies.

```js
#!/usr/bin/env node
/**
 * GitHub Startup Momentum Index generator for gitdealflow.com.
 * Real public GitHub API data only. Fully documented, deterministic score.
 * Fail-safe: aborts (exit 1) if <80% of seeds fetch or index would be empty.
 *
 * Run from repo root:  node data/momentum-index/_build_momentum_index.mjs
 * Optional: GITHUB_TOKEN env for 5000/hr rate limit.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));           // .../data/momentum-index
const ROOT = join(HERE, '..', '..');                            // repo root
const BASE = 'https://gitdealflow.com';
const PATH = '/data/momentum-index';
const TODAY = process.env.BUILD_DATE || new Date().toISOString().slice(0, 10); // YYYY-MM-DD
const TOKEN = process.env.GITHUB_TOKEN || '';
const DISCLAIMER = 'The Momentum Score reflects public software-engineering activity only. It is not investment advice, a valuation, or a recommendation to buy, sell, or fund any company.';

const seed = JSON.parse(readFileSync(join(HERE, 'seed.json'), 'utf8')).repos;

// ---- helpers ---------------------------------------------------------------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clamp = (n, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));
const slugify = (full) => full.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const daysBetween = (a, b) => Math.max(0, (a - b) / 86400000);

async function ghFetch(full) {
  const headers = { 'Accept': 'application/vnd.github+json', 'User-Agent': 'gitdealflow-momentum-index' };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;
  const r = await fetch(`https://api.github.com/repos/${full}`, { headers });
  if (r.status === 404) return { skip: true, reason: 'not found' };
  if (r.status === 403) return { skip: true, reason: 'rate limited' };
  if (!r.ok) return { skip: true, reason: 'http ' + r.status };
  const d = await r.json();
  return {
    full, slug: slugify(full),
    name: d.name, owner: d.owner?.login || full.split('/')[0],
    stars: d.stargazers_count || 0, forks: d.forks_count || 0,
    issues: d.open_issues_count || 0, watchers: d.subscribers_count || 0,
    pushedAt: d.pushed_at, createdAt: d.created_at,
    description: d.description || '', language: d.language || '',
    homepage: d.homepage || '', license: d.license?.spdx_id || '',
  };
}

// ---- history (for real week-over-week deltas) ------------------------------
const HIST = join(HERE, 'history.json');
let history = existsSync(HIST) ? JSON.parse(readFileSync(HIST, 'utf8')) : { snapshots: [] };
const prev = history.snapshots.length ? history.snapshots[history.snapshots.length - 1] : null;
const prevOnDifferentDay = prev && prev.date !== TODAY ? prev : (history.snapshots.length >= 2 && prev.date === TODAY ? history.snapshots[history.snapshots.length - 2] : null);

// ---- score -----------------------------------------------------------------
// Documented, deterministic. Printed on the page (methodology section).
//   traction  = 100 * log10(stars+1) / 5           (100k stars -> 100)
//   recency   = piecewise on days since last push
//   velocity  = 50 + 600 * (weekly star growth rate); falls back to traction on 1st run
//   SCORE     = round(0.40*traction + 0.35*recency + 0.25*velocity)
function recencyScore(pushedAt) {
  const d = daysBetween(Date.parse(TODAY + 'T00:00:00Z'), Date.parse(pushedAt));
  if (d <= 2) return 100; if (d <= 7) return 88; if (d <= 30) return 68;
  if (d <= 90) return 40; if (d <= 180) return 22; return 8;
}
function compute(rec) {
  const traction = clamp(100 * Math.log10(rec.stars + 1) / 5);
  const recency = recencyScore(rec.pushedAt);
  let velocity = traction, weeklyGrowthPct = null, deltaStars = null;
  if (prevOnDifferentDay && prevOnDifferentDay.repos[rec.slug] != null) {
    const before = prevOnDifferentDay.repos[rec.slug].stars;
    const weeks = Math.max(1 / 7, daysBetween(Date.parse(TODAY), Date.parse(prevOnDifferentDay.date)) / 7);
    deltaStars = rec.stars - before;
    const rate = before > 0 ? (deltaStars / before) / weeks : 0;
    weeklyGrowthPct = before > 0 ? (deltaStars / before / weeks) * 100 : null;
    velocity = clamp(50 + 600 * rate);
  }
  const score = Math.round(0.40 * traction + 0.35 * recency + 0.25 * velocity);
  return { ...rec, traction: Math.round(traction), recency, velocity: Math.round(velocity), score, deltaStars, weeklyGrowthPct };
}

// ---- fetch all -------------------------------------------------------------
const results = [];
for (const full of seed) {
  try {
    const rec = await ghFetch(full);
    if (rec.skip) { console.warn(`  skip ${full}: ${rec.reason}`); continue; }
    results.push(compute(rec));
  } catch (e) { console.warn(`  skip ${full}: ${e.message}`); }
}

// FAIL-SAFES
const ratio = results.length / seed.length;
if (results.length === 0) { console.error('FAIL: 0 repos fetched — refusing to write empty index.'); process.exit(1); }
if (ratio < 0.8) { console.error(`FAIL: only ${results.length}/${seed.length} fetched (<80%). Set GITHUB_TOKEN or check network. Not writing.`); process.exit(1); }

results.sort((a, b) => b.score - a.score || b.stars - a.stars);
results.forEach((r, i) => r.rank = i + 1);

// ---- persist history (one snapshot per calendar day) -----------------------
const snap = { date: TODAY, repos: {} };
for (const r of results) snap.repos[r.slug] = { stars: r.stars, forks: r.forks, score: r.score };
if (prev && prev.date === TODAY) history.snapshots[history.snapshots.length - 1] = snap;
else history.snapshots.push(snap);
if (history.snapshots.length > 60) history.snapshots = history.snapshots.slice(-60);
writeFileSync(HIST, JSON.stringify(history, null, 2));

// ---- shared page chrome ----------------------------------------------------
const CSS = `<style>
:root{color-scheme:dark}body{margin:0;background:#0f172a;color:#e2e8f0;font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
.wrap{max-width:1000px;margin:0 auto;padding:2rem 1.25rem}a{color:#fb923c;text-decoration:none}a:hover{text-decoration:underline}
h1{font-size:2rem;margin:.2rem 0}h2{margin-top:2.5rem}.muted{color:#94a3b8}.pill{display:inline-block;background:#1e293b;border:1px solid #334155;border-radius:999px;padding:.15rem .6rem;font-size:.8rem;color:#cbd5e1}
table{width:100%;border-collapse:collapse;margin:1rem 0}th,td{text-align:left;padding:.6rem .5rem;border-bottom:1px solid #1e293b;font-size:.95rem}
th{color:#94a3b8;font-weight:600;font-size:.8rem;text-transform:uppercase;letter-spacing:.03em}
.score{font-weight:700;color:#fb923c}.up{color:#34d399}.down{color:#f87171}.card{background:#1e293b;border:1px solid #334155;border-radius:.6rem;padding:1.25rem;margin:1rem 0}
.disc{font-size:.85rem;color:#94a3b8;border-top:1px solid #1e293b;margin-top:2.5rem;padding-top:1rem}
.crumb{font-size:.85rem;color:#64748b;margin-bottom:1rem}
</style>`;
function shell({ title, desc, canonical, body, jsonld }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website"><meta property="og:url" content="${canonical}">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">
${CSS}
${jsonld.map(j => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
</head><body><div class="wrap">${body}
<p class="disc"><strong>Methodology & disclaimer.</strong> ${esc(DISCLAIMER)} Data source: GitHub public REST API, refreshed as of ${TODAY}. Score = round(0.40·traction + 0.35·recency + 0.25·velocity), where traction=100·log10(stars+1)/5, recency is a step function of days since last push, and velocity reflects week-over-week star growth (falls back to traction on first snapshot). Full dataset: <a href="${PATH}/data.json">data.json</a> (CC BY 4.0).</p>
<p class="disc"><a href="/data/">← GitDealFlow Research Datasets</a> · <a href="/">gitdealflow.com</a></p>
</div></body></html>`;
}

// ---- detail pages ----------------------------------------------------------
mkdirSync(HERE, { recursive: true });
for (const r of results) {
  const title = `${r.owner}/${r.name} — GitHub Momentum Score ${r.score}/100 | GitDealFlow`;
  const desc = `${r.name}: ${r.stars.toLocaleString()} stars, momentum score ${r.score}/100 as of ${TODAY}. Real GitHub engineering-activity signals from GitDealFlow.`;
  const canonical = `${BASE}${PATH}/${r.slug}`;
  const deltaTxt = r.deltaStars == null ? '<span class="muted">baseline (first snapshot)</span>'
    : `<span class="${r.deltaStars >= 0 ? 'up' : 'down'}">${r.deltaStars >= 0 ? '+' : ''}${r.deltaStars.toLocaleString()} stars/week${r.weeklyGrowthPct != null ? ` (${r.weeklyGrowthPct >= 0 ? '+' : ''}${r.weeklyGrowthPct.toFixed(1)}%)` : ''}</span>`;
  const faq = {
    '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
      { '@type': 'Question', name: `What is ${r.name}'s GitHub Momentum Score?`, acceptedAnswer: { '@type': 'Answer', text: `As of ${TODAY}, ${r.owner}/${r.name} has a GitDealFlow Momentum Score of ${r.score} out of 100, based on ${r.stars.toLocaleString()} stars, ${r.forks.toLocaleString()} forks, and its recent commit activity. ${DISCLAIMER}` } },
      { '@type': 'Question', name: `How active is ${r.name}'s development?`, acceptedAnswer: { '@type': 'Answer', text: `${r.name}'s last public push was recorded on ${String(r.pushedAt).slice(0, 10)}, giving it a recency sub-score of ${r.recency}/100. Its primary language is ${r.language || 'unspecified'}.` } },
    ],
  };
  const crumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'GitDealFlow', item: BASE + '/' },
    { '@type': 'ListItem', position: 2, name: 'Momentum Index', item: BASE + PATH },
    { '@type': 'ListItem', position: 3, name: `${r.owner}/${r.name}`, item: canonical } ] };
  const body = `<div class="crumb"><a href="/">Home</a> › <a href="${PATH}">Momentum Index</a> › ${esc(r.owner)}/${esc(r.name)}</div>
<span class="pill">Rank #${r.rank} of ${results.length}</span> ${r.language ? `<span class="pill">${esc(r.language)}</span>` : ''}
<h1>${esc(r.owner)}/${esc(r.name)}</h1>
<p class="muted">${esc(r.description)}</p>
<div class="card"><div style="font-size:3rem" class="score">${r.score}<span style="font-size:1rem;color:#94a3b8">/100</span></div>
<p>Momentum score as of ${TODAY}. Weekly change: ${deltaTxt}</p></div>
<table><tr><th>Metric</th><th>Value</th><th>Sub-score</th></tr>
<tr><td>Stars</td><td>${r.stars.toLocaleString()}</td><td>traction ${r.traction}/100</td></tr>
<tr><td>Forks</td><td>${r.forks.toLocaleString()}</td><td>—</td></tr>
<tr><td>Open issues</td><td>${r.issues.toLocaleString()}</td><td>—</td></tr>
<tr><td>Last push</td><td>${String(r.pushedAt).slice(0, 10)}</td><td>recency ${r.recency}/100</td></tr>
<tr><td>Weekly velocity</td><td>${r.deltaStars == null ? 'baseline' : (r.deltaStars >= 0 ? '+' : '') + r.deltaStars + ' stars'}</td><td>velocity ${r.velocity}/100</td></tr></table>
${r.homepage ? `<p><a href="${esc(r.homepage)}" rel="nofollow noopener" target="_blank">Project site ↗</a> · <a href="https://github.com/${esc(r.full)}" rel="nofollow noopener" target="_blank">GitHub repo ↗</a></p>` : `<p><a href="https://github.com/${esc(r.full)}" rel="nofollow noopener" target="_blank">GitHub repo ↗</a></p>`}
<p class="muted" style="margin-top:2rem">Want signals like this for your own deal flow, automatically? <a href="/">See how GitDealFlow works →</a></p>`;
  writeFileSync(join(HERE, `${r.slug}.html`), shell({ title, desc, canonical, body, jsonld: [faq, crumb] }));
}

// ---- index / leaderboard ---------------------------------------------------
const rows = results.map(r => {
  const d = r.deltaStars == null ? '<span class="muted">—</span>'
    : `<span class="${r.deltaStars >= 0 ? 'up' : 'down'}">${r.deltaStars >= 0 ? '+' : ''}${r.deltaStars.toLocaleString()}</span>`;
  return `<tr><td>${r.rank}</td><td><a href="${PATH}/${r.slug}">${esc(r.owner)}/${esc(r.name)}</a></td><td class="score">${r.score}</td><td>${r.stars.toLocaleString()}</td><td>${d}</td><td>${esc(r.language)}</td></tr>`;
}).join('\n');
const itemList = { '@context': 'https://schema.org', '@type': 'ItemList', name: 'GitHub Startup Momentum Index', itemListOrder: 'https://schema.org/ItemListOrderDescending',
  numberOfItems: results.length, itemListElement: results.map(r => ({ '@type': 'ListItem', position: r.rank, url: `${BASE}${PATH}/${r.slug}`, name: `${r.owner}/${r.name}` })) };
const dataset = { '@context': 'https://schema.org', '@type': 'Dataset', name: 'GitHub Startup Momentum Index', description: 'Weekly momentum ranking of notable startup and developer-tool GitHub repositories, computed from public GitHub engineering-activity signals.',
  url: `${BASE}${PATH}`, license: 'https://creativecommons.org/licenses/by/4.0/', creator: { '@type': 'Organization', name: 'GitDealFlow', url: BASE }, dateModified: TODAY,
  distribution: [{ '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: `${BASE}${PATH}/data.json` }] };
const indexBody = `<div class="crumb"><a href="/">Home</a> › <a href="/data/">Datasets</a> › Momentum Index</div>
<h1>GitHub Startup Momentum Index</h1>
<p class="muted">A weekly ranking of ${results.length} notable startup &amp; dev-tool repositories by real GitHub engineering-activity signals. Updated ${TODAY}.</p>
<table><tr><th>#</th><th>Startup / Repo</th><th>Score</th><th>Stars</th><th>Δ stars/wk</th><th>Language</th></tr>
${rows}</table>
<h2>How the score works</h2>
<p>The Momentum Score (0–100) blends three transparent, public signals: <strong>traction</strong> (star count, log-scaled), <strong>recency</strong> (days since last push), and <strong>velocity</strong> (week-over-week star growth). The exact formula is printed at the bottom of every page. Nothing here is proprietary or hidden — reproduce it yourself from the <a href="${PATH}/data.json">dataset</a>.</p>`;
writeFileSync(join(HERE, 'index.html'), shell({
  title: `GitHub Startup Momentum Index — ${results.length} repos ranked | GitDealFlow`,
  desc: `Weekly momentum ranking of ${results.length} notable startup & dev-tool GitHub repos by real engineering-activity signals. Updated ${TODAY}. Free dataset, CC BY 4.0.`,
  canonical: BASE + PATH, body: indexBody, jsonld: [dataset, itemList],
}));

// ---- machine-readable dataset ---------------------------------------------
writeFileSync(join(HERE, 'data.json'), JSON.stringify({
  name: 'GitHub Startup Momentum Index', license: 'CC BY 4.0', source: 'GitHub public REST API',
  disclaimer: DISCLAIMER, updated: TODAY, count: results.length,
  methodology: 'score = round(0.40*traction + 0.35*recency + 0.25*velocity); traction=100*log10(stars+1)/5; recency=step(days since push); velocity=50+600*weekly_star_growth_rate (fallback=traction on first snapshot)',
  items: results.map(r => ({ rank: r.rank, repo: r.full, score: r.score, stars: r.stars, forks: r.forks, open_issues: r.issues, last_push: r.pushedAt, language: r.language, delta_stars_week: r.deltaStars, weekly_growth_pct: r.weeklyGrowthPct })),
}, null, 2));

// ---- sitemap-momentum.xml + register in sitemap-index.xml ------------------
const urls = [PATH, ...results.map(r => `${PATH}/${r.slug}`)];
const sm = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url><loc>${BASE}${u}</loc><lastmod>${TODAY}</lastmod><changefreq>weekly</changefreq></url>`).join('\n') +
  `\n</urlset>\n`;
writeFileSync(join(ROOT, 'sitemap-momentum.xml'), sm);

const siPath = join(ROOT, 'sitemap-index.xml');
if (existsSync(siPath)) {
  let si = readFileSync(siPath, 'utf8');
  if (!si.includes('sitemap-momentum.xml')) {
    si = si.replace('</sitemapindex>', `  <sitemap>\n    <loc>${BASE}/sitemap-momentum.xml</loc>\n    <lastmod>${TODAY}</lastmod>\n  </sitemap>\n</sitemapindex>`);
    writeFileSync(siPath, si);
  }
}

console.log(`✓ momentum-index: ${results.length} repos, ${urls.length} URLs, snapshot ${TODAY}. Fetch ratio ${(ratio * 100).toFixed(0)}%.`);
```

---

## 4. Deliverable C — link it in (crawlability, idempotent)

Add a discovery link from the `/data/` hub so crawlers reach the new pages. Edit `data/index.html`: insert this card **once** (guard on the marker so re-runs don't duplicate). If the file's structure makes safe insertion unclear, insert it immediately after the first `<h1>...</h1>`; if that also fails, skip this step (non-fatal — the sitemap still exposes the pages).

Marker check: only insert if `data/index.html` does NOT already contain `momentum-index-card`.

```html
<div id="momentum-index-card" style="background:#1e293b;border:1px solid #334155;border-radius:.6rem;padding:1.25rem;margin:1.5rem 0">
  <a href="/data/momentum-index/" style="color:#fb923c;font-weight:700;font-size:1.1rem;text-decoration:none">GitHub Startup Momentum Index →</a>
  <p style="color:#94a3b8;margin:.4rem 0 0">Weekly ranking of notable startup &amp; dev-tool repos by real GitHub engineering-activity signals. Free dataset, CC BY 4.0, refreshed weekly.</p>
</div>
```

Also append a dataset entry to `data/feed.json` (it's a JSON Feed 1.1 `items` array). Add this object to `items` **only if** no existing item has this `id` (idempotent):

```json
{
  "id": "https://gitdealflow.com/data/momentum-index/",
  "url": "https://gitdealflow.com/data/momentum-index/",
  "title": "GitHub Startup Momentum Index",
  "content_text": "Weekly momentum ranking of notable startup and developer-tool GitHub repositories, computed from public GitHub engineering-activity signals. Free, CC BY 4.0.",
  "date_published": "2026-07-21T00:00:00Z"
}
```
Validate `data/feed.json` still parses after editing (`node -e "JSON.parse(require('fs').readFileSync('data/feed.json','utf8'))"`).

---

## 5. RUN IT

```bash
cd ~/signals-gitdealflow/landing
# Optional but recommended if available: export GITHUB_TOKEN=<token>   # 5000/hr instead of 60/hr
node data/momentum-index/_build_momentum_index.mjs
```
Expected stdout ends with: `✓ momentum-index: <N> repos, <N+1> URLs, snapshot 2026-07-21. Fetch ratio <>%`. If it prints `FAIL:` and exits non-zero, a fail-safe tripped — do NOT deploy; report the reason (likely rate limit → set `GITHUB_TOKEN` and re-run).

---

## 6. VALIDATE (all must pass before deploy)

```bash
cd ~/signals-gitdealflow/landing
# a) index + at least 30 detail pages exist
ls data/momentum-index/*.html | wc -l          # expect >= 31

# b) every JSON-LD block on the index parses
node -e "const h=require('fs').readFileSync('data/momentum-index/index.html','utf8');[...h.matchAll(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/g)].forEach(m=>JSON.parse(m[1]));console.log('✓ index JSON-LD valid')"

# c) dataset + feed parse
node -e "JSON.parse(require('fs').readFileSync('data/momentum-index/data.json','utf8'));JSON.parse(require('fs').readFileSync('data/feed.json','utf8'));console.log('✓ data.json + feed.json valid')"

# d) disclaimer present on a detail page (not-investment-advice guard)
grep -c "not investment advice" data/momentum-index/index.html   # expect >= 1

# e) sitemap registered
grep -c "sitemap-momentum.xml" sitemap-index.xml                 # expect 1
node -e "const x=require('fs').readFileSync('sitemap-momentum.xml','utf8');if(!x.includes('<loc>'))throw 'empty';console.log('✓ sitemap ok')"

# f) NO fabricated-looking placeholder leaked (scores must be real numbers)
grep -Rn "undefined\|NaN\|{{" data/momentum-index/ && echo "FAIL: placeholder leaked" || echo "✓ no placeholders"
```
If any check fails, fix and re-run §5. Do not deploy a failing build.

---

## 7. COMMIT + DEPLOY (autonomous, with verification)

```bash
cd ~/signals-gitdealflow/landing
git config user.email    # must print a team email; it is sales@sipiteno.com here. If blank, run: git config user.email sales@sipiteno.com
git add data/momentum-index sitemap-momentum.xml sitemap-index.xml data/feed.json data/index.html
git commit -m "Add GitHub Startup Momentum Index (live data asset)"

# Deploy: static upload to Vercel project 'landing'. Retry up to 3x (CLI is flaky).
ok=0
for i in 1 2 3; do
  echo "Deploy attempt $i…"
  vercel --prod --yes && ok=1 && break
  sleep 20
done
[ "$ok" = 1 ] || { echo "DEPLOY FAILED after 3 attempts — STOP and report."; exit 1; }

# Verify live (marker check). Allow propagation.
sleep 25
for i in 1 2 3; do
  if curl -s "https://gitdealflow.com/data/momentum-index/" | grep -q "GitHub Startup Momentum Index"; then
    echo "✓ LIVE: momentum index verified"; break
  fi
  echo "not live yet, retry $i…"; sleep 20
  [ "$i" = 3 ] && { echo "WARN: not verified live after retries — report for manual check."; }
done
```

---

## 8. POST-DEPLOY (accelerate indexing + set up the weekly refresh)

1. **Search Console:** resubmit `https://gitdealflow.com/sitemap-index.xml`; URL-inspect + request indexing on the index page and 5 top detail pages.
2. **Bing Webmaster:** resubmit sitemap.
3. **Schedule the weekly refresh** — this asset's power is that it stays fresh. Add a launchd/cron job (or a Hermes weekly task) that runs, every Monday:
   ```bash
   cd ~/signals-gitdealflow/landing && \
   GITHUB_TOKEN=<token> node data/momentum-index/_build_momentum_index.mjs && \
   git add -A && git commit -m "Weekly momentum refresh $(date +%F)" && vercel --prod --yes
   ```
   The `history.json` accumulates snapshots so week-over-week deltas become real after the second run. (Do not run more than once/day — the script dedupes per calendar day anyway.)

---

## 9. Expected results (honest, mechanism-based — estimates, not guarantees)

**This is a compounding data-asset play.** The first deploy plants ~41 indexable pages + a citable dataset; value grows as it refreshes weekly and earns links.

| Effect | Mechanism | Realistic outcome | When |
|---|---|---|---|
| **New long-tail indexable pages** | ~40 detail pages targeting "{startup} github momentum / growth / activity" | Incremental organic entries the site couldn't rank for before; low competition, high intent | 2–6 weeks to index & start ranking |
| **Backlinks / citations** | A free, CC BY 4.0, regularly-updated dataset is the #1 reliable link magnet; rankings get referenced by newsletters, blogs, other tools | The highest-ceiling effect. Even a handful of quality links to a data asset lifts the **whole domain's** authority → all 1,454 pages benefit | 1–4 months (needs light promotion — see below) |
| **AI-engine citation** | `Dataset` + `ItemList` schema + machine-readable `data.json` are exactly what LLMs ingest and cite | Being named as the source in ChatGPT/Perplexity answers about startup/repo momentum | 2–4 months |
| **Freshness signal** | Weekly refresh + `dateModified` + `<changefreq>weekly` | Google re-crawls more often; fresh data outranks stale competitors on trend queries | compounding |
| **Funnel top** | Each detail page CTAs to the product ("signals like this, automatically") | On-brand traffic that actually converts vs. generic visitors | ongoing |

**Straight talk:**
- Publishing alone gets you the indexable pages and schema. The **backlink magnet only fires if the dataset is seen** — after deploy, the single highest-ROI follow-up is light promotion: one post to r/startups or Hacker News ("I built a free weekly GitHub momentum index"), a mention in the GitDealFlow newsletter, and submission to dataset directories (Data.world, Kaggle, Google Dataset Search picks it up via the `Dataset` schema automatically). Note this for the owner; it's the multiplier.
- 40 repos is the seed. Growing to 150–300 (needs `GITHUB_TOKEN`) multiplies the long-tail surface — do that after the pilot proves out.
- This does not replace the product funnel; it feeds it with qualified, on-topic organic traffic and domain authority.

---

## 10. Rollback
Everything new lives under `data/momentum-index/` plus additive edits to 4 files. To roll back: `git revert` the commit and `vercel --prod --yes`. `history.json` can be kept (harmless) or reverted with the rest.

### Definition of done
- [ ] `seed.json` + `_build_momentum_index.mjs` created; script runs and prints the ✓ line with fetch ratio ≥ 80%.
- [ ] ≥ 31 pages generated; all JSON-LD/JSON valid; disclaimer present; no placeholders leaked (§6 all green).
- [ ] `sitemap-momentum.xml` created + registered in `sitemap-index.xml`; `/data/` hub links to it; `feed.json` updated & valid.
- [ ] Committed, deployed via `vercel --prod --yes`, and verified live at `https://gitdealflow.com/data/momentum-index/`.
- [ ] Weekly refresh job noted for setup (§8.3).
- [ ] Zero fabricated data anywhere — every number came from the GitHub API or the documented formula. (Re-read §1a.)
