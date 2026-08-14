/**
 * /sitemap-llm.xml — curated high-information-density sitemap for AI crawlers.
 *
 * Why a SECOND sitemap
 * --------------------
 * /sitemap.xml (and its shards under /sitemap/*.xml) enumerates the full
 * ~4,800-URL pSEO fleet for Google/Bing: 2,290 startup profiles, 1,700
 * quarterly variants, comparisons, blog posts, i18n stubs. Most of that is
 * repetitive template content. AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
 * OAI-SearchBot, Google-Extended) that follow robots.txt `Sitemap:` directives
 * then spend crawl budget on the long tail instead of the pages that actually
 * matter for RAG ingestion and answer-engine citation.
 *
 * This file lists ONLY the highest-information-density pages, grouped into the
 * three families an LLM should cite from this site:
 *   1. Methodology + canonical definition cluster (the "how" + the named
 *      category / metric / signal primitives / SSRN findings)
 *   2. Glossary — every /define/[term] DefinedTerm page
 *   3. Sector deep-dives — curated /sector/[slug] hubs + the
 *      /startups-to-watch/{sector}-{period} ranking pages
 *
 * Discovery: robots.txt, llms.txt, and agents.txt all point here. This file is
 * deliberately NOT listed in the /sitemap.xml index — that index is the
 * search-engine crawl map; this one is the AI/RAG crawl map. The two stay
 * separate so a search-engine change (e.g. dropping a shard) never silently
 * changes what AI crawlers ingest, and vice-versa.
 *
 * force-dynamic (NOT force-static+revalidate): dotted-path route handlers get
 * their Vercel edge cache non-deterministically poisoned to a 404 after the
 * first background revalidation (~2h post-deploy). Same fix as /sitemap/*.xml
 * (commit 76a10b9) and /api/*.json.
 */

import {
  getDataLastModified,
  getAllPageSlugs,
  SIGNAL_TYPES,
} from "@/lib/data";
import { glossaryTerms } from "@/content/glossary";
import { getAllSectorSlugs } from "@/content/sectors";
import { PRIMITIVES } from "@/content/signal-primitives";
import { FINDINGS as RESEARCH_FINDINGS } from "@/content/research-findings";

export const dynamic = "force-dynamic";

const BASE_URL = "https://signals.gitdealflow.com";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface Entry {
  url: string;
  lastmod: string;
  changefreq: string;
  priority: number;
}

export async function GET() {
  const lastmod = getDataLastModified().toISOString();
  const entries: Entry[] = [];

  // ── 1. Methodology + canonical definition cluster ────────────────────────
  const methodology: Array<[string, string, number]> = [
    ["/methodology", "monthly", 1.0],
    ["/mechanism", "monthly", 0.9],
    ["/code-side-sourcing", "monthly", 0.9],
    ["/scout-score", "monthly", 0.9],
    ["/signals", "monthly", 0.9],
    ["/knowledge", "monthly", 0.85],
    ["/standards", "monthly", 0.8],
    ["/reproducibility", "monthly", 0.85],
    ["/data-sources", "monthly", 0.8],
    ["/citations", "monthly", 0.85],
    ["/citation-guide", "monthly", 0.85],
    ["/dataset", "weekly", 0.85],
    ["/research", "weekly", 0.9],
  ];
  for (const [path, changefreq, priority] of methodology) {
    entries.push({ url: `${BASE_URL}${path}`, lastmod, changefreq, priority });
  }

  // Signal primitives — the six atomic definitions (pillar + define pages).
  for (const s of SIGNAL_TYPES) {
    entries.push({
      url: `${BASE_URL}/signals/${s.slug}`,
      lastmod,
      changefreq: "monthly",
      priority: 0.8,
    });
  }
  for (const p of PRIMITIVES) {
    entries.push({
      url: `${BASE_URL}/signals/define/${p.slug}`,
      lastmod,
      changefreq: "monthly",
      priority: 0.8,
    });
  }

  // SSRN-anchored research findings — citation-ready, one URL per number.
  for (const f of RESEARCH_FINDINGS) {
    entries.push({
      url: `${BASE_URL}/research/${f.slug}`,
      lastmod,
      changefreq: "monthly",
      priority: 0.8,
    });
  }

  // ── 2. Glossary — hub + every DefinedTerm page ───────────────────────────
  entries.push({
    url: `${BASE_URL}/glossary`,
    lastmod,
    changefreq: "monthly",
    priority: 0.85,
  });
  for (const t of glossaryTerms) {
    entries.push({
      url: `${BASE_URL}/define/${t.id}`,
      lastmod,
      changefreq: "monthly",
      priority: 0.8,
    });
  }

  // ── 3. Sector deep-dives ────────────────────────────────────────────────
  // Curated /sector/[slug] hubs (unique analyst note + aggregated corpora).
  entries.push({
    url: `${BASE_URL}/sector`,
    lastmod,
    changefreq: "weekly",
    priority: 0.85,
  });
  for (const slug of getAllSectorSlugs()) {
    entries.push({
      url: `${BASE_URL}/sector/${slug}`,
      lastmod,
      changefreq: "weekly",
      priority: 0.85,
    });
  }
  // /startups-to-watch/{sector}-{period} ranking pages (all periods).
  for (const slug of getAllPageSlugs()) {
    entries.push({
      url: `${BASE_URL}/startups-to-watch/${slug}`,
      lastmod,
      changefreq: "weekly",
      priority: 0.8,
    });
  }

  const urlsXml = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${esc(e.url)}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`
    )
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlsXml}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "index, follow",
    },
  });
}
