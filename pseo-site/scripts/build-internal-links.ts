#!/usr/bin/env npx tsx
/**
 * build-internal-links.ts — generates the pSEO internal-link graph for
 * signals.gitdealflow.com from the site's OWN sitemaps (every URL is real).
 *
 * Output: data/internal-links.json  ->  { [pathname]: RelatedGroup[] }
 * Consumed by lib/related-links.ts + the /explore hub + (Phase 2) page templates.
 *
 * Fail-safe: aborts if it can't collect a meaningful URL set.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.LINKS_BASE || "https://signals.gitdealflow.com";
const SITEMAP_IDS = ["core", "high-intent", "sectors", "crossings", "startups", "content"];

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

// ---- build graph -----------------------------------------------------------
const graph: Record<string, RelatedGroup[]> = {};
const MAX_PER_GROUP = 6;

for (const p of paths) {
  const section = sectionOf(p);
  const groups: RelatedGroup[] = [];

  // Group 1 — siblings in the same section, ranked by token similarity
  const siblings = (bySection.get(section) || [])
    .filter((q) => q !== p)
    .map((q) => ({ q, score: overlap(p, q) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_PER_GROUP)
    .filter((x) => x.score > 0);
  if (siblings.length >= 2)
    groups.push({ title: `More in ${titleCase("/" + section)}`, links: siblings.map((x) => ({ href: x.q, label: titleCase(x.q) })) });

  // Group 2 — cross-section pages sharing slug tokens (semantic neighbors)
  const cross = paths
    .filter((q) => q !== p && sectionOf(q) !== section)
    .map((q) => ({ q, score: overlap(p, q) }))
    .filter((x) => x.score >= 0.34)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_PER_GROUP);
  if (cross.length >= 2)
    groups.push({ title: "Related topics", links: cross.map((x) => ({ href: x.q, label: titleCase(x.q) })) });

  // Group 3 — always offer a path up to the section hub + explore
  const hub: Link[] = [];
  if (paths.includes(`/${section}`)) hub.push({ href: `/${section}`, label: `All ${titleCase("/" + section)}` });
  hub.push({ href: "/explore", label: "Explore all signals" });
  groups.push({ title: "Browse", links: hub });

  if (groups.some((g) => g.links.length > 0)) graph[p] = groups;
}

writeFileSync(join(process.cwd(), "data/internal-links.json"), JSON.stringify(graph, null, 0));
console.log(`✓ internal-links: ${Object.keys(graph).length} pages linked, from ${urls.length} sitemap URLs across ${bySection.size} sections.`);
}

main();
