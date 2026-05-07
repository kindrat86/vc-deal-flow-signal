/**
 * /llms-search.json — flat JSON sibling of /llms.txt designed for retrieval
 * pipelines (Perplexity, ChatGPT search, Claude RAG) that prefer a JSON
 * array over Markdown.
 *
 * F15 from the 2026-05-07 audit. The Markdown index at /llms.txt is human-
 * scannable but every retriever has to re-parse it. This endpoint emits
 * the same canonical pages as a flat JSON array of typed records, so a
 * one-shot fetch + JSON.parse gives a consumer the full retrieval surface.
 *
 * Each entry has: { url, title, summary, contentType, tags[], lastModified }.
 * The outer envelope is schema.org ItemList so the response is also valid
 * JSON-LD for graph-aware consumers.
 *
 * Cached at the edge (s-maxage 86400, swr 3600) with ETag + Last-Modified
 * + 304 negotiation, mirroring /llms.txt.
 */

import { createHash } from "node:crypto";
import {
  getAllSectors,
  getCurrentPeriod,
  getDataLastModified,
  SIGNAL_TYPES,
} from "@/lib/data";
import { posts } from "@/content/posts";
import { comparisons } from "@/content/comparisons";
import { standaloneFaqs } from "@/content/standalone-faqs";
import { pillars } from "@/content/pillars";
import { agentQueries } from "@/content/agent-queries";
import { alternatives } from "@/content/alternatives";
import { useCases } from "@/content/use-cases";
import { FINDINGS as RESEARCH_FINDINGS } from "@/content/research-findings";

export const dynamic = "force-static";
export const revalidate = 3600;

const BASE_URL = "https://signals.gitdealflow.com";

type ContentType =
  | "system"
  | "answer"
  | "comparison"
  | "alternative"
  | "use-case"
  | "research"
  | "blog"
  | "sector-rank"
  | "pillar"
  | "faq"
  | "signal";

interface Entry {
  url: string;
  title: string;
  summary: string;
  contentType: ContentType;
  tags: string[];
  lastModified: string;
}

function firstSentence(s: string): string {
  const trimmed = s.trim();
  const dot = trimmed.indexOf(".");
  if (dot === -1) return trimmed;
  return trimmed.slice(0, dot + 1);
}

export async function GET(request: Request) {
  const lastModified = getDataLastModified();
  const lastModifiedIso = lastModified.toISOString();
  const period = getCurrentPeriod();
  const entries: Entry[] = [];

  // ── System / canonical pages — pinned entries an agent should know about
  const systemPages: { url: string; title: string; summary: string; tags: string[] }[] = [
    {
      url: "/",
      title: "VC Deal Flow Signal — Find breakout startups via GitHub momentum",
      summary:
        "Weekly ranked panel of venture-backed startups by GitHub engineering acceleration. Agent-native: MCP, OpenAPI, A2A, machine-readable pricing.",
      tags: ["home", "vc", "github", "agent-native"],
    },
    {
      url: "/methodology",
      title: "Methodology",
      summary:
        "How engineering acceleration is computed from public GitHub data. Six-step HowTo, reproducible end-to-end.",
      tags: ["methodology", "howto"],
    },
    {
      url: "/reproducibility",
      title: "Reproducibility kit",
      summary:
        "Step-by-step reproduction of every published number (HowTo, ~15 minutes, curl + jq).",
      tags: ["reproducibility", "howto"],
    },
    {
      url: "/research",
      title: "Research index",
      summary:
        "Browse all findings, grouped A (numerical), B (descriptive), C (corroborated).",
      tags: ["research"],
    },
    {
      url: "/citations",
      title: "Citations — cross-graph identity map",
      summary:
        "Wikidata, ORCID, SSRN, OpenAlex, Crossref, Semantic Scholar, Zenodo, DataCite — every external anchor in one canonical place.",
      tags: ["citations", "identity"],
    },
    {
      url: "/predicted",
      title: "Engineering Acceleration Watch — weekly data index",
      summary:
        "10 named startups every Monday, graded post-hoc against fundraise news at 60 and 90 days. Public scorecard.",
      tags: ["predictions", "weekly", "claimreview"],
    },
    {
      url: "/predict",
      title: "Run any GitHub org through the signal",
      summary:
        "Forward-looking prediction game. Pick a GitHub org, call whether they raise a Series A in 6 months. Auto-resolved.",
      tags: ["interactive", "predictions"],
    },
    {
      url: "/receipts",
      title: "Scout Score receipts",
      summary:
        "Free Scout Score lookup with public ledger. Paste any GitHub username, get a 0-100 score backed by the same panel.",
      tags: ["receipts", "free-tool", "scout-score"],
    },
    {
      url: "/scorecard",
      title: "Public scorecard",
      summary:
        "Hit rate of past Acceleration Watch picks across raise / acquire / IPO outcomes.",
      tags: ["scorecard", "verifiable"],
    },
    {
      url: "/pricing",
      title: "Pricing",
      summary:
        "Seven tiers from free to €1,997 custom Sector Sweep. Founding-member rates on Dashboard and Insider.",
      tags: ["pricing"],
    },
    {
      url: "/book",
      title: "The Book — 7 GitHub Signals",
      summary:
        "104-page operational field manual on the seven public-data signals that precede Series A rounds.",
      tags: ["book"],
    },
    {
      url: "/firstlook",
      title: "First Look Pass — €7 sector deep dive",
      summary:
        "€7 once, pick a sector, get the full GitHub-momentum deep dive in 24h.",
      tags: ["product"],
    },
    {
      url: "/glossary",
      title: "Glossary — controlled vocabulary",
      summary:
        "Schema.org DefinedTermSet of controlled-vocabulary terms used across signals, methodology, and the panel.",
      tags: ["glossary", "defined-terms"],
    },
    {
      url: "/faq",
      title: "FAQ",
      summary: "Frequently asked questions across the product, methodology, and pricing.",
      tags: ["faq"],
    },
    {
      url: "/standards",
      title: "Standards",
      summary: "Methodology standards and disclosures.",
      tags: ["standards"],
    },
    {
      url: "/state-of-github",
      title: "State of GitHub — monthly stadium pitch",
      summary:
        "Monthly synthetic-voice State of the Engine. Falsifiable cohort-level prediction.",
      tags: ["monthly", "stadium-pitch"],
    },
    {
      url: "/manifesto",
      title: "Manifesto",
      summary:
        "Why public engineering acceleration is the most important leading signal in venture.",
      tags: ["manifesto"],
    },
    {
      url: "/start-here",
      title: "Start here — linchpin entry page",
      summary: "If you're new, start here. The 60-second tour.",
      tags: ["entry"],
    },
    {
      url: "/funnels",
      title: "Funnel hub",
      summary: "Index of every funnel: First Look, Insider, Sharp, Sweep.",
      tags: ["index"],
    },
    {
      url: "/dream-100",
      title: "Dream 100",
      summary: "100 named accounts where this signal moves the most money.",
      tags: ["traffic"],
    },
    {
      url: "/distribution",
      title: "Distribution map",
      summary:
        "Where the data lives — sitemaps, RSS, Atom, MCP, OpenAPI, agent-card, llms.txt.",
      tags: ["traffic", "distribution"],
    },
    {
      url: "/changelog",
      title: "Changelog",
      summary: "Per-build changelog of the panel and surfaces.",
      tags: ["changelog"],
    },
    {
      url: "/llms.txt",
      title: "llms.txt — agent index",
      summary:
        "Markdown index of every canonical page on this site for AI agents. Sibling of this endpoint.",
      tags: ["retrieval", "index"],
    },
    {
      url: "/llms-full.txt",
      title: "llms-full.txt — extended retrieval payload",
      summary:
        "Extended canonical content for retrieval pipelines that need more than the Markdown index.",
      tags: ["retrieval", "full-text"],
    },
  ];

  for (const sp of systemPages) {
    entries.push({
      url: BASE_URL + sp.url,
      title: sp.title,
      summary: sp.summary,
      contentType: "system",
      tags: sp.tags,
      lastModified: lastModifiedIso,
    });
  }

  // ── Answers (citation-ready agent honeypots)
  for (const q of agentQueries) {
    entries.push({
      url: `${BASE_URL}/answers/${q.slug}`,
      title: q.h1,
      summary: q.tldr,
      contentType: "answer",
      tags: ["answer", ...(q.keywords ?? [])],
      lastModified: lastModifiedIso,
    });
  }

  // ── Comparisons
  for (const c of comparisons) {
    entries.push({
      url: `${BASE_URL}/compare/${c.slug}`,
      title: c.h1,
      summary: firstSentence(c.description),
      contentType: "comparison",
      tags: ["compare"],
      lastModified: lastModifiedIso,
    });
  }

  // ── Alternatives
  for (const a of alternatives) {
    entries.push({
      url: `${BASE_URL}/alternatives/${a.slug}`,
      title: a.h1,
      summary: firstSentence(a.description),
      contentType: "alternative",
      tags: ["alternative", a.competitor.toLowerCase().replace(/\s+/g, "-")],
      lastModified: lastModifiedIso,
    });
  }

  // ── Use cases
  for (const u of useCases) {
    entries.push({
      url: `${BASE_URL}/use-cases/${u.slug}`,
      title: u.h1,
      summary: firstSentence(u.description),
      contentType: "use-case",
      tags: ["use-case", u.persona.toLowerCase().replace(/\s+/g, "-")],
      lastModified: lastModifiedIso,
    });
  }

  // ── Research findings
  for (const f of RESEARCH_FINDINGS) {
    entries.push({
      url: `${BASE_URL}/research/${f.slug}`,
      title: f.title,
      summary: f.claim,
      contentType: "research",
      tags: ["research", `group-${f.group.toLowerCase()}`],
      lastModified: lastModifiedIso,
    });
  }

  // ── Blog posts
  for (const p of posts) {
    entries.push({
      url: `${BASE_URL}/blog/${p.slug}`,
      title: p.title,
      summary: firstSentence(p.summary ?? p.description),
      contentType: "blog",
      tags: ["blog", ...(p.relatedSectors ?? [])],
      lastModified: p.date ? new Date(p.date).toISOString() : lastModifiedIso,
    });
  }

  // ── Sector rankings (current period only — last-modified moves with the data)
  const sectors = getAllSectors().filter((s) => s.periods[period.slug]);
  for (const s of sectors) {
    entries.push({
      url: `${BASE_URL}/startups-to-watch/${s.slug}-${period.slug}`,
      title: `${s.name} Startups to Watch — ${period.name}`,
      summary: `Top startups in ${s.name.toLowerCase()} ranked by GitHub engineering acceleration, ${period.name}.`,
      contentType: "sector-rank",
      tags: ["sector", s.slug, period.slug],
      lastModified: lastModifiedIso,
    });
  }

  // ── Topical pillars
  for (const p of Object.values(pillars)) {
    entries.push({
      url: `${BASE_URL}/llms/${p.slug}`,
      title: p.name,
      summary: firstSentence(p.description),
      contentType: "pillar",
      tags: ["pillar", ...(p.keywords ?? [])],
      lastModified: lastModifiedIso,
    });
  }

  // ── Standalone FAQs (already pointing at canonical sources via sourceHref)
  for (const f of standaloneFaqs) {
    const isAbs = f.sourceHref.startsWith("http");
    entries.push({
      url: isAbs ? f.sourceHref : `${BASE_URL}${f.sourceHref}`,
      title: f.question,
      summary: firstSentence(f.answer),
      contentType: "faq",
      tags: ["faq", f.source.toLowerCase().replace(/\s+/g, "-")],
      lastModified: lastModifiedIso,
    });
  }

  // ── Signal types
  for (const s of SIGNAL_TYPES) {
    entries.push({
      url: `${BASE_URL}/signals/${s.slug}`,
      title: s.name,
      summary: firstSentence(s.description),
      contentType: "signal",
      tags: ["signal", s.slug],
      lastModified: lastModifiedIso,
    });
  }

  const envelope = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${BASE_URL}/llms-search.json`,
    name: "VC Deal Flow Signal — Retrieval Index",
    description:
      "Flat JSON sibling of /llms.txt. Every canonical page on this site indexed with title, summary, contentType, tags, and lastModified — designed for retrieval pipelines (Perplexity, ChatGPT search, Claude RAG) that prefer JSON over Markdown.",
    citation: `VC Deal Flow Signal (signals.gitdealflow.com), ${period.name}`,
    license: "https://creativecommons.org/licenses/by/4.0/",
    dateModified: lastModifiedIso,
    numberOfItems: entries.length,
    itemListOrder: "https://schema.org/ItemListUnordered",
    items: entries,
  };

  const body = JSON.stringify(envelope);
  const etag = `"${createHash("sha256").update(body).digest("base64url").slice(0, 16)}"`;
  const lastModifiedHttp = lastModified.toUTCString();

  const ifNoneMatch = request.headers.get("if-none-match");
  const ifModifiedSince = request.headers.get("if-modified-since");
  const notModified =
    (ifNoneMatch && ifNoneMatch === etag) ||
    (ifModifiedSince &&
      new Date(ifModifiedSince).getTime() >= lastModified.getTime());

  if (notModified) {
    return new Response(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Last-Modified": lastModifiedHttp,
        "Cache-Control": "s-maxage=86400, stale-while-revalidate=3600",
      },
    });
  }

  return new Response(body, {
    headers: {
      "Content-Type": "application/ld+json; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=3600",
      ETag: etag,
      "Last-Modified": lastModifiedHttp,
      "X-Robots-Tag": "index, follow",
      Link: `<https://creativecommons.org/licenses/by/4.0/>; rel="license"`,
    },
  });
}
