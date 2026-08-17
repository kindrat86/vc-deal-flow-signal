#!/usr/bin/env npx tsx
/**
 * build-internal-links.ts, generates the pSEO internal-link graph for
 * signals.gitdealflow.com from the site's OWN sitemaps (every URL is real).
 *
 * Output: data/internal-links.json  ->  { [pathname]: RelatedGroup[] }
 * Consumed by lib/related-links.ts + the /explore hub + page templates.
 *
 * Three-pass design:
 *  Pass 1 builds sibling + cross-section groups by token overlap and
 *  measures per-URL in-degree.
 *  Pass 2 adds the entity-cluster group, ranking candidates by ASCENDING
 *  base in-degree so the weakest /vs/ pages receive the most new in-links
 *  (equity-aware internal linking; token overlap alone left 5 of 12
 *  harmonic pages with <=4 in-links).
 *  Pass 3 (audit "striking distance" fix, 2026-08-18): reads the GSC-derived
 *  data/striking-distance.json (56 URLs at pos 6.5-12.5, 38.7K imps/90d) and
 *  guarantees each a floor of in-links from the most token-overlapping donor
 *  pages that actually RENDER the graph. Fixes the zero-in-link families:
 *  /acquirer/*, /from-stars-to-seed/*, /signal/* single-token slugs that
 *  token overlap can never match.
 *
 * Fail-safe: aborts if it can't collect a meaningful URL set.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.LINKS_BASE || "https://signals.gitdealflow.com";
const SITEMAP_IDS = ["core", "sectors", "crossings", "startups", "content"];

interface Link { href: string; label: string }
interface RelatedGroup { title: string; links: Link[] }

// ---- collect real URLs from the site's sitemaps ----------------------------
async function fetchText(url: string): Promise<string | null> {
  try {
    const r = await fetch(url, { headers: { "User-Agent": "gdf-linkgraph" } });
    if (!r.ok) return null;
    return await r.text();
  } catch { return null; }
}
function extractLocs(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function main() {
const allUrls = new Set<string>();
for (const id of SITEMAP_IDS) {
  const xml = await fetchText(`${BASE}/sitemap/${id}.xml`);
  if (!xml) { console.warn(`  (skip sitemap ${id})`); continue; }
  for (const loc of extractLocs(xml)) if (loc.startsWith(BASE)) allUrls.add(loc);
}
// also try the flat sitemap.xml as a fallback source
const flat = await fetchText(`${BASE}/sitemap.xml`);
if (flat) for (const sm of extractLocs(flat)) {
  if (sm.endsWith(".xml")) { const x = await fetchText(sm); if (x) for (const l of extractLocs(x)) if (l.startsWith(BASE)) allUrls.add(l); }
}

const urls = [...allUrls];
if (urls.length < 100) {
  console.error(`FAIL: only ${urls.length} URLs collected from sitemaps (<100). Is the site up? Not writing.`);
  process.exit(1);
}

// ---- helpers ---------------------------------------------------------------
const pathOf = (u: string) => { try { return new URL(u).pathname.replace(/\/$/, "") || "/"; } catch { return "/"; } };
const sectionOf = (p: string) => (p === "/" ? "home" : p.split("/").filter(Boolean)[0]);
const tokensOf = (p: string) =>
  new Set(p.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 2 && !["the", "and", "for", "vs", "www", "com"].includes(t)));
const titleCase = (slug: string) =>
  slug.split("/").filter(Boolean).pop()!.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bVs\b/g, "vs");

const paths = [...new Set(urls.map(pathOf))].filter((p) => p !== "/" && !p.endsWith(".xml") && !p.endsWith(".txt") && !p.endsWith(".json"));
const bySection = new Map<string, string[]>();
for (const p of paths) { const s = sectionOf(p); (bySection.get(s) || bySection.set(s, []).get(s)!).push(p); }

const tokenCache = new Map<string, Set<string>>();
const toks = (p: string) => tokenCache.get(p) || tokenCache.set(p, tokensOf(p)).get(p)!;
function overlap(a: string, b: string): number {
  const ta = toks(a), tb = toks(b); let n = 0; for (const t of ta) if (tb.has(t)) n++;
  return n / Math.max(1, Math.min(ta.size, tb.size));
}

// ---- pass 1: sibling + cross-section groups, then base in-degree -----------
const MAX_PER_GROUP = 6;
const graph: Record<string, RelatedGroup[]> = {};
const indeg = new Map<string, number>();
for (const p of paths) indeg.set(p, 0);

for (const p of paths) {
  const section = sectionOf(p);
  const groups: RelatedGroup[] = [];

  // Group 1, siblings in the same section, ranked by token similarity with an
  // equity tie-break: on equal score (single-token families like /acquirer/*
  // all tie at 0.5), ASCENDING in-degree wins so weak pages get link slots
  // instead of the first-6-in-sitemap-order hogging every sibling group.
  const siblings = (bySection.get(section) || [])
    .filter((q) => q !== p)
    .map((q) => ({ q, score: overlap(p, q) }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        (indeg.get(a.q) || 0) - (indeg.get(b.q) || 0) ||
        a.q.localeCompare(b.q),
    )
    .slice(0, MAX_PER_GROUP)
    .filter((x) => x.score > 0);
  if (siblings.length >= 2)
    groups.push({ title: `More in ${titleCase("/" + section)}`, links: siblings.map((x) => ({ href: x.q, label: titleCase(x.q) })) });

  // Group 2, cross-section pages sharing slug tokens (semantic neighbors)
  const cross = paths
    .filter((q) => q !== p && sectionOf(q) !== section)
    .map((q) => ({ q, score: overlap(p, q) }))
    .filter((x) => x.score >= 0.34)
    .sort(
      (a, b) =>
        b.score - a.score ||
        (indeg.get(a.q) || 0) - (indeg.get(b.q) || 0) ||
        a.q.localeCompare(b.q),
    )
    .slice(0, MAX_PER_GROUP);
  if (cross.length >= 2)
    groups.push({ title: "Related topics", links: cross.map((x) => ({ href: x.q, label: titleCase(x.q) })) });

  graph[p] = groups;
  for (const g of groups) for (const l of g.links) indeg.set(l.href, (indeg.get(l.href) || 0) + 1);
}

// ---- pass 2: entity-cluster groups, equity-aware (weak pages first) --------
// Every page whose path mentions a tracked competitor entity gets explicit
// head-to-head links to that entity's /vs/ pages. Candidates are ranked by
// ASCENDING base in-degree (pages with fewest in-links win slots first),
// then brand-first slugs outrank reverse-direction slugs, then token overlap,
// then alphabetical for determinism.
const ENTITY_TOKENS = ["harmonic", "pitchbook", "crunchbase", "dealroom", "tracxn", "cb-insights", "affinity", "forager", "specter", "signalrank", "openvc"];
const mentionsEntity = (q: string, e: string) => q.toLowerCase().includes(e);

for (const p of paths) {
  const groups = graph[p];
  const seenHrefs = new Set<string>();
  for (const g of groups) for (const l of g.links) seenHrefs.add(l.href);
  const entityLinks: Link[] = [];
  for (const e of ENTITY_TOKENS) {
    if (!mentionsEntity(p, e)) continue;
    const candidates = paths
      .filter((q) => q !== p && q.startsWith("/vs/") && mentionsEntity(q, e))
      .map((q) => ({
        q,
        rank: indeg.get(q) || 0,
        brand: q.startsWith(`/vs/${e}`) ? 1 : 0,
        score: overlap(p, q),
      }))
      .sort((a, b) => a.rank - b.rank || b.brand - a.brand || b.score - a.score || a.q.localeCompare(b.q))
      .slice(0, MAX_PER_GROUP);
    for (const c of candidates) {
      if (!seenHrefs.has(c.q)) {
        entityLinks.push({ href: c.q, label: titleCase(c.q) });
        seenHrefs.add(c.q);
      }
    }
  }
  if (entityLinks.length >= 2)
    groups.push({ title: "Head-to-head comparisons", links: entityLinks.slice(0, MAX_PER_GROUP) });

  // Group 3, always offer a path up to the section hub + explore
  const hub: Link[] = [];
  if (paths.includes(`/${sectionOf(p)}`)) hub.push({ href: `/${sectionOf(p)}`, label: `All ${titleCase("/" + sectionOf(p))}` });
  hub.push({ href: "/explore", label: "Explore all signals" });
  groups.push({ title: "Browse", links: hub });

  if (groups.some((g) => g.links.length > 0)) graph[p] = groups;
}

// ---- pass 3: striking-distance floor (GSC pos 6.5-12.5 cohort) -------------
// The 56 URLs in data/striking-distance.json sit one hop from page 1
// (38.7K impressions/90d). Several families have ZERO in-links because
// token overlap cannot match single-token slugs (/acquirer/stripe has
// tokens {acquirer,stripe}, /acquirer/cloudflare shares only "acquirer" ->
// overlap 1/2 = 0.5 passes 0.34, but /signal/clickhouse vs peers often
// shares nothing). For each cohort page below its floor, add links from the
// most token-overlapping donor pages (overlap desc, then donor in-degree
// desc so strong pages pass equity), skipping donors that already link it.
//
// Donors are restricted to sections whose templates RENDER the graph
// (RelatedLinks), so every added edge is visible in HTML, not just JSON.
const RENDER_SECTIONS = new Set([
  "research", "vs", "continuity", "acquirer", "answers", "blog", "explore",
  "compare", "alternatives", "topics", "from-stars-to-seed", "best",
  "research-paper", "signal",
  // Founder/solo-founder pages render the graph in HTML (verified live
  // 2026-08-17: /founder/tj ships the /founder/leerob link) and are the only
  // token-overlapping donors for founder cohorts, which otherwise exhaust the
  // render-section pool and drop below their striking-distance floor.
  "founder", "solo-founder-tracker",
]);
const MAX_NEW_LINKS_PER_DONOR = 4; // keep any one donor from turning into a farm
const donorLoad = new Map<string, number>();

let cohort: Array<{ href: string; floor: number; imps?: number }> = [];
try {
  cohort = JSON.parse(
    readFileSync(join(process.cwd(), "data/striking-distance.json"), "utf8"),
  ) as typeof cohort;
} catch {
  console.warn("  (striking-distance.json missing/unparsable - pass 3 skipped)");
}

for (const t of cohort) {
  const need = (t.floor ?? 8) - (indeg.get(t.href) || 0);
  if (need <= 0) continue;
  const targetPath = t.href;
  const donors = paths
    .filter(
      (q) =>
        q !== targetPath &&
        RENDER_SECTIONS.has(sectionOf(q)) &&
        !(graph[q] || []).some((g) => g.links.some((l) => l.href === targetPath)),
    )
    .map((q) => ({ q, score: overlap(q, targetPath), rank: indeg.get(q) || 0 }))
    .filter((x) => x.score >= 0.3)
    .sort((a, b) => b.score - a.score || b.rank - a.rank || a.q.localeCompare(b.q));

  let added = 0;
  for (const d of donors) {
    if (added >= need) break;
    if ((donorLoad.get(d.q) || 0) >= MAX_NEW_LINKS_PER_DONOR) continue;
    const groups = graph[d.q];
    if (!groups) continue;
    let g = groups.find((x) => x.title === "Related topics");
    if (!g) {
      g = { title: "Related topics", links: [] };
      groups.push(g);
    }
    if (g.links.length >= 6) continue; // respect the group cap
    g.links.push({ href: targetPath, label: titleCase(targetPath) });
    donorLoad.set(d.q, (donorLoad.get(d.q) || 0) + 1);
    indeg.set(targetPath, (indeg.get(targetPath) || 0) + 1);
    added++;
  }

  // Fallback tier (2026-08-17): token overlap cannot match sibling pages inside
  // multi-token families (two research papers share only "research"+"paper" =
  // 0.25 < 0.3), so the heaviest cohort leaves stalled under their floors.
  // Same-SECTION donors are topically adjacent by construction; rank them by
  // donor in-degree (strong pages pass equity), same caps as the main tier.
  if (added < need) {
    const targetSection = sectionOf(targetPath);
    const fallback = paths
      .filter(
        (q) =>
          q !== targetPath &&
          sectionOf(q) === targetSection &&
          RENDER_SECTIONS.has(targetSection) &&
          !(graph[q] || []).some((g) => g.links.some((l) => l.href === targetPath)),
      )
      .map((q) => ({ q, rank: indeg.get(q) || 0 }))
      .sort((a, b) => b.rank - a.rank || a.q.localeCompare(b.q));
    for (const d of fallback) {
      if (added >= need) break;
      if ((donorLoad.get(d.q) || 0) >= MAX_NEW_LINKS_PER_DONOR) continue;
      const groups = graph[d.q];
      if (!groups) continue;
      let g = groups.find((x) => x.title === "Related topics");
      if (!g) {
        g = { title: "Related topics", links: [] };
        groups.push(g);
      }
      if (g.links.length >= 6) continue;
      g.links.push({ href: targetPath, label: titleCase(targetPath) });
      donorLoad.set(d.q, (donorLoad.get(d.q) || 0) + 1);
      indeg.set(targetPath, (indeg.get(targetPath) || 0) + 1);
      added++;
    }
  }
  if (added < need) {
    console.warn(
      `  (striking-distance: ${targetPath} floor ${t.floor}, added ${added}/${need} in-links)`,
    );
  }
}

writeFileSync(join(process.cwd(), "data/internal-links.json"), JSON.stringify(graph, null, 0));
console.log(`✓ internal-links: ${Object.keys(graph).length} pages linked, from ${urls.length} sitemap URLs across ${bySection.size} sections.`);
}

main();
