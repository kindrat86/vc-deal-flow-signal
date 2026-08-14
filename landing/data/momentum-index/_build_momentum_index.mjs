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
  let recency = recencyScore(rec.pushedAt);
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
if (results.length === 0) { console.error('FAIL: 0 repos fetched, refusing to write empty index.'); process.exit(1); }
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
  const title = `${r.owner}/${r.name}, GitHub Momentum Score ${r.score}/100 | GitDealFlow`;
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
<tr><td>Forks</td><td>${r.forks.toLocaleString()}</td><td></td></tr>
<tr><td>Open issues</td><td>${r.issues.toLocaleString()}</td><td></td></tr>
<tr><td>Last push</td><td>${String(r.pushedAt).slice(0, 10)}</td><td>recency ${r.recency}/100</td></tr>
<tr><td>Weekly velocity</td><td>${r.deltaStars == null ? 'baseline' : (r.deltaStars >= 0 ? '+' : '') + r.deltaStars + ' stars'}</td><td>velocity ${r.velocity}/100</td></tr></table>
${r.homepage ? `<p><a href="${esc(r.homepage)}" rel="nofollow noopener" target="_blank">Project site ↗</a> · <a href="https://github.com/${esc(r.full)}" rel="nofollow noopener" target="_blank">GitHub repo ↗</a></p>` : `<p><a href="https://github.com/${esc(r.full)}" rel="nofollow noopener" target="_blank">GitHub repo ↗</a></p>`}
<p class="muted" style="margin-top:2rem">Want signals like this for your own deal flow, automatically? <a href="/">See how GitDealFlow works →</a></p>`;
  writeFileSync(join(HERE, `${r.slug}.html`), shell({ title, desc, canonical, body, jsonld: [faq, crumb] }));
}

// ---- index / leaderboard ---------------------------------------------------
const rows = results.map(r => {
  const d = r.deltaStars == null ? '<span class="muted"></span>'
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
<p>The Momentum Score (0-100) blends three transparent, public signals: <strong>traction</strong> (star count, log-scaled), <strong>recency</strong> (days since last push), and <strong>velocity</strong> (week-over-week star growth). The exact formula is printed at the bottom of every page. Nothing here is proprietary or hidden, reproduce it yourself from the <a href="${PATH}/data.json">dataset</a>.</p>`;
writeFileSync(join(HERE, 'index.html'), shell({
  title: `GitHub Startup Momentum Index, ${results.length} repos ranked | GitDealFlow`,
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
