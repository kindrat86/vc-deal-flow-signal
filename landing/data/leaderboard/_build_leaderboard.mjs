#!/usr/bin/env node
/**
 * Startup Velocity Leaderboard generator for gitdealflow.com (apex).
 *
 * Successor to the retired /tmp/leaderboard_gen3.py from the 2026-07-30
 * traffic blitz (that script lived in a deleted checkout and was lost with
 * it). This version is committed to the repo so the Monday regenerate
 * leaderboard cron is self-sufficient:
 *
 *   node data/leaderboard/_build_leaderboard.mjs
 *
 * Reads LIVE data from https://signals.gitdealflow.com/api/signals.json and
 * renders 19 static pages under leaderboard/:
 *   /leaderboard                          all startups ranked by 14d commit velocity
 *   /leaderboard/velocity                 top 100 by commit velocity
 *   /leaderboard/breakout                 top 100 by week over week velocity change
 *   /leaderboard/acceleration             top 100 by contributor growth
 *   /leaderboard/sector/<slug>            per sector ranking (15 sectors)
 *
 * Guardrails (all enforced, matching repo rules):
 *   - fail-safe: abort if the API fetch fails or fewer than 80% of the
 *     expected panel size is returned
 *   - canonical claims only: "350+" panel floor, "15" sectors, period name
 *     read from the API meta (never a hardcoded count)
 *   - no em dash or en dash anywhere in generated copy (site-wide rule,
 *     enforced by scripts/verify-no-dashes.mjs on deploy)
 *   - >= 500 visible words per indexable page (scripts/verify-word-floor.mjs)
 *   - valid JSON-LD (scripts/verify-jsonld.mjs), author identity footer
 *     (The Data Nerd, ORCID 0009-0002-2222-4112, SSRN 6606558)
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url)); // data/leaderboard
const ROOT = join(HERE, "..", ".."); // landing repo root
const OUT = join(ROOT, "leaderboard");
const API = "https://signals.gitdealflow.com/api/signals.json";
const BASE = "https://gitdealflow.com";
const TODAY = process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);
const PANEL_FLOOR = "350+";
const ORCID = "0009-0002-2222-4112";
const SSRN = "6606558";

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Parse "+999%" / "-12%" -> 999 / -12 ; non numeric -> 0
const pct = (s) => {
  const m = String(s ?? "").match(/(-?\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : 0;
};
const num = (s) => {
  const m = String(s ?? "").match(/(-?\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : 0;
};

const CSS = `:root{color-scheme:dark}body{margin:0;background:#0f172a;color:#e2e8f0;font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
.wrap{max-width:1000px;margin:0 auto;padding:2rem 1.25rem}a{color:#fb923c;text-decoration:none}a:hover{text-decoration:underline}
h1{font-size:2rem;margin:.2rem 0}h2{margin-top:2.5rem}.muted{color:#94a3b8}.pill{display:inline-block;background:#1e293b;border:1px solid #334155;border-radius:999px;padding:.15rem .6rem;font-size:.8rem;color:#cbd5e1}
table{width:100%;border-collapse:collapse;margin:1rem 0}th,td{text-align:left;padding:.6rem .5rem;border-bottom:1px solid #1e293b;font-size:.95rem}
th{color:#94a3b8;font-weight:600;font-size:.8rem;text-transform:uppercase;letter-spacing:.03em}
.score{font-weight:700;color:#fb923c}.up{color:#34d399}.down{color:#f87171}.card{background:#1e293b;border:1px solid #334155;border-radius:.6rem;padding:1.25rem;margin:1rem 0}
.disc{font-size:.85rem;color:#94a3b8;border-top:1px solid #1e293b;margin-top:2.5rem;padding-top:1rem}
.crumb{font-size:.85rem;color:#64748b;margin-bottom:1rem}.nv{margin:1rem 0;display:flex;flex-wrap:wrap;gap:.5rem}
.nv a{background:#1e293b;border:1px solid #334155;border-radius:.5rem;padding:.3rem .8rem;font-size:.85rem;color:#cbd5e1;text-decoration:none}
.nv a:hover{border-color:#fb923c;color:#fb923c}`;

const fmtPct = (v) => (v >= 0 ? "+" : "") + v + "%";
const fmtInt = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

async function main() {
  const r = await fetch(API, { headers: { "User-Agent": "gitdealflow-leaderboard" } });
  if (!r.ok) {
    console.error(`leaderboard: API fetch failed (HTTP ${r.status}). Aborting.`);
    process.exit(1);
  }
  const api = await r.json();
  const sectors = Array.isArray(api.sectors) ? api.sectors : [];
  const period = (api.meta && api.meta.period && api.meta.period.name) || "Q3 2026";
  const all = [];
  for (const s of sectors) {
    for (const st of s.startups || []) {
      all.push({
        name: st.name,
        sector: s.name,
        sectorSlug: s.slug,
        velocity: num(st.commitVelocity14d),
        change: pct(st.commitVelocityChange),
        growth: pct(st.contributorGrowth),
        contributors: num(st.contributors),
        newRepos: num(st.newRepos),
        signal: st.signalType || "",
        stage: st.stage || "",
        geo: st.geography || "",
        url: st.profileUrl || st.githubUrl || "",
        desc: st.description || "",
      });
    }
  }
  // Fail-safe: panel floor is 350+; abort if we got less than 80% of it.
  const expected = parseInt(PANEL_FLOOR, 10) * 0.8; // 280
  if (all.length < expected) {
    console.error(`leaderboard: only ${all.length} startups returned (floor ${expected}). Aborting.`);
    process.exit(1);
  }
  const byVelocity = [...all].sort((a, b) => b.velocity - a.velocity || b.change - a.change);
  const byChange = [...all].sort((a, b) => b.change - a.change || b.velocity - a.velocity);
  const byGrowth = [...all].sort((a, b) => b.growth - a.growth || b.velocity - a.velocity);
  const signalTypes = [...new Set(all.map((x) => x.signal).filter(Boolean))].sort();

  mkdirSync(OUT, { recursive: true });

  const page = (opts) => {
    const {
      path, title, desc, h1, intro, crumb, rows, extraBody = "",
      itemList = [], itemCount,
    } = opts;
    const rowsHtml = rows
      .map(
        (x, i) =>
          `<tr><td>${i + 1}</td><td><a href="${esc(x.url)}">${esc(x.name)}</a></td>` +
          (x.sectorCell ? `<td>${esc(x.sectorCell)}</td>` : "") +
          `<td class="score">${fmtInt(x.velocity)}</td>` +
          `<td class="${x.change >= 0 ? "up" : "down"}">${fmtPct(x.change)}</td>` +
          `<td class="${x.growth >= 0 ? "up" : "down"}">${fmtPct(x.growth)}</td>` +
          `<td>${esc(x.signal)}</td></tr>`
      )
      .join("\n");
    const ld = [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        url: BASE + path,
        name: title,
        description: desc,
        inLanguage: "en-US",
        dateModified: TODAY,
        isPartOf: { "@type": "WebSite", name: "GitDealFlow", url: BASE + "/" },
      },
      {
        "@context": "https://schema.org",
        "@type": "Dataset",
        name: "VC Deal Flow Signal",
        description: "Startup engineering acceleration data from public GitHub activity, ranked by commit velocity, breakout signals, and contributor growth.",
        url: "https://signals.gitdealflow.com",
        license: "https://creativecommons.org/licenses/by/4.0/",
        dateModified: TODAY,
        creator: { "@type": "Organization", name: "GitDealFlow", url: BASE },
      },
    ];
    if (itemList.length) {
      ld.push({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: title,
        numberOfItems: itemCount,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        itemListElement: itemList.map((x, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: x.name,
          url: x.url,
        })),
      });
    }
    const jsonld = ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n");
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${BASE}${path}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website"><meta property="og:url" content="${BASE}${path}">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">
<style>${CSS}</style>
${jsonld}
</head><body><div class="wrap"><div class="crumb">${crumb}</div>
<h1>${esc(h1)}</h1>
<p class="muted">${esc(intro)}</p>
<div class="nv"><a href="/leaderboard">All</a><a href="/leaderboard/velocity">Velocity</a><a href="/leaderboard/breakout">Breakouts</a><a href="/leaderboard/acceleration">Acceleration</a></div>
${extraBody}
<table><tr><th>#</th><th>Startup</th>${rows[0] && rows[0].sectorCell ? "<th>Sector</th>" : ""}<th>Velocity</th><th>Δ velocity</th><th>Δ contributors</th><th>Signal</th></tr>
${rowsHtml}
</table>
<h2>How to read this ranking</h2>
<p>Every row is one startup from the public VC Deal Flow Signal panel, which tracks engineering output across ${PANEL_FLOOR} venture-backed startups in ${sectors.length} sectors using only public GitHub activity. Velocity is the number of commits pushed to public repositories in the trailing 14 days. Delta velocity is the week over week change in that pace. Delta contributors is the week over week change in active contributor count. Signal is the dominant engineering pattern detected for the org, for example ${signalTypes.slice(0, 3).join(", ")}.</p>
<h2>What the signals mean</h2>
<p>Breakout signals flag orgs whose engineering output accelerated sharply: a deploy frequency spike, an infrastructure buildout, a burst of new repositories, or an engineering hiring wave. Acceleration captures contributor growth, which tends to lead product expansion. These are directional signals, not guarantees: a quiet week can follow a spike, and rankings move every Monday when the dataset refreshes.</p>
<h2>Methodology and data</h2>
<p>Rankings are computed from the live dataset at signals.gitdealflow.com/api/signals.json, refreshed weekly. The underlying methodology is documented on the signals site and in the SSRN working paper (abstract ${SSRN}): engineering velocity spikes precede fundraise announcements by a median of 31 days, which is what makes public commit activity a useful early indicator for deal flow research. All data is public; no private or paid datasets are used, and nothing here is investment advice.</p>
<h2>Frequently asked questions</h2>
<p><strong>How often is the leaderboard updated?</strong> Every week, from the live VC Deal Flow Signal dataset. The refresh date for this page is ${TODAY}.</p>
<p><strong>What counts as velocity?</strong> Commits pushed to public repositories in the trailing 14 days for the orgs tracked in the panel. The metric is computed from GitHub activity only.</p>
<p><strong>Why track engineering velocity at all?</strong> The SSRN preprint (abstract ${SSRN}) documents a median lead of 31 days between an engineering velocity spike and a fundraise announcement, making public engineering data a leading indicator for investors and operators.</p>
<p class="disc"><strong>Methodology and disclaimer.</strong> Rankings reflect public software-engineering activity only, refreshed as of ${TODAY}, ${period} data. The Momentum Score and velocity figures are not investment advice, a valuation, or a recommendation to buy, sell, or fund any company. Full dataset: <a href="https://signals.gitdealflow.com/api/signals.json">signals.gitdealflow.com/api/signals.json</a> (CC BY 4.0).</p>
<p class="disc"><a href="/leaderboard">Leaderboard</a> · <a href="/data/">GitDealFlow Research Datasets</a> · <a href="/">gitdealflow.com</a></p>
<p class="disc">By <a href="https://signals.gitdealflow.com/data-nerd" rel="author">The Data Nerd</a> · <a href="https://orcid.org/${ORCID}" rel="me author">ORCID ${ORCID}</a> · <a href="https://ssrn.com/abstract=${SSRN}">SSRN preprint</a></p>
</div></body></html>`;
    const rel = path === "/leaderboard" ? "" : path.replace(/^\/leaderboard\//, "");
    const destDir = join(OUT, rel);
    mkdirSync(destDir, { recursive: true });
    writeFileSync(join(destDir, "index.html"), html);
    console.log(`leaderboard: wrote ${path} (${rows.length} rows)`);
  };

  const crumbBase = '<a href="/">Home</a> › <a href="/leaderboard">Leaderboard</a>';

  // 1. All startups
  page({
    path: "/leaderboard",
    title: `Startup Velocity Leaderboard, ${PANEL_FLOOR} Startups Ranked | GitDealFlow`,
    desc: `Live leaderboard ranking ${PANEL_FLOOR} venture-backed startups by 14 day commit velocity, breakout signals, and contributor growth. Updated ${TODAY}.`,
    h1: "Startup Velocity Leaderboard",
    intro: `All ${PANEL_FLOOR} tracked startups ranked by public GitHub engineering velocity, refreshed ${TODAY} (${period} data).`,
    crumb: crumbBase,
    rows: byVelocity.map((x) => ({ ...x, sectorCell: x.sector })),
    itemCount: all.length,
    itemList: byVelocity.slice(0, 50).map((x) => ({ name: x.name, url: x.url })),
  });

  // 2. Velocity top 100
  page({
    path: "/leaderboard/velocity",
    title: "Top 100 Startups by Commit Velocity | GitDealFlow",
    desc: `The 100 fastest engineering teams in the panel: most commits to public repos in 14 days. Updated ${TODAY}.`,
    h1: "Top 100 by Commit Velocity",
    intro: `The ${all.length} orgs with the most public commits in the trailing 14 days, refreshed ${TODAY} (${period} data).`,
    crumb: crumbBase + " › Velocity",
    rows: byVelocity.slice(0, 100).map((x) => ({ ...x, sectorCell: x.sector })),
    itemCount: all.length,
    itemList: byVelocity.slice(0, 50).map((x) => ({ name: x.name, url: x.url })),
  });

  // 3. Breakouts top 100
  page({
    path: "/leaderboard/breakout",
    title: "Top 100 Startup Breakouts by Velocity Spike | GitDealFlow",
    desc: `Startups whose public commit velocity spiked hardest week over week: the breakout board. Updated ${TODAY}.`,
    h1: "Top 100 Breakouts",
    intro: `Ranked by week over week commit velocity change: the sharpest accelerations in public engineering output, refreshed ${TODAY} (${period} data).`,
    crumb: crumbBase + " › Breakouts",
    rows: byChange.slice(0, 100).map((x) => ({ ...x, sectorCell: x.sector })),
    itemCount: all.length,
    itemList: byChange.slice(0, 50).map((x) => ({ name: x.name, url: x.url })),
  });

  // 4. Acceleration top 100
  page({
    path: "/leaderboard/acceleration",
    title: "Top 100 Startups by Contributor Growth | GitDealFlow",
    desc: `The fastest growing engineering teams by contributor count: where headcount signal leads product expansion. Updated ${TODAY}.`,
    h1: "Top 100 by Contributor Growth",
    intro: `Ranked by week over week contributor growth across the ${PANEL_FLOOR} startup panel, refreshed ${TODAY} (${period} data).`,
    crumb: crumbBase + " › Acceleration",
    rows: byGrowth.slice(0, 100).map((x) => ({ ...x, sectorCell: x.sector })),
    itemCount: all.length,
    itemList: byGrowth.slice(0, 50).map((x) => ({ name: x.name, url: x.url })),
  });

  // 5. Per sector (15 pages)
  const secLinks = sectors
    .map((s) => `<a href="/leaderboard/sector/${esc(s.slug)}">${esc(s.name)}</a>`)
    .join("");
  for (const s of sectors) {
    const rows = all
      .filter((x) => x.sectorSlug === s.slug)
      .sort((a, b) => b.velocity - a.velocity || b.change - a.change);
    page({
      path: `/leaderboard/sector/${s.slug}`,
      title: `${s.name} Startup Velocity Leaderboard | GitDealFlow`,
      desc: `${s.name} startups ranked by public GitHub commit velocity and breakout signals. ${rows.length} orgs tracked, updated ${TODAY}.`,
      h1: `${s.name} Startup Velocity Leaderboard`,
      intro: `${rows.length} ${s.name} startups in the panel ranked by public engineering velocity, refreshed ${TODAY} (${period} data).`,
      crumb: crumbBase + " › " + s.name,
      rows: rows.map((x) => ({ ...x, sectorCell: null })),
      itemCount: rows.length,
      itemList: rows.slice(0, 50).map((x) => ({ name: x.name, url: x.url })),
      extraBody: `<div class="nv">${secLinks}</div>`,
    });
  }

  console.log(`leaderboard: done, ${all.length} startups, ${sectors.length} sectors, ${signalTypes.length} signal types`);
}

main().catch((e) => {
  console.error("leaderboard: fatal", e);
  process.exit(1);
});
