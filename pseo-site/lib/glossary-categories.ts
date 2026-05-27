/**
 * Category buckets for glossary terms — used by /define/[term] to render
 * a "related terms" grid and by /define (index) to group by family.
 *
 * Mirrors the section comments inside content/glossary.ts:
 *   1. Code-Side Sourcing (the named category)
 *   2. Engineering acceleration metrics
 *   3. Discoverability surfaces (programmatic SEO + AEO/GEO/AIO)
 *   4. Agent infrastructure (MCP, A2A, payments, identity)
 *   5. Academic citation infrastructure
 *   6. Venture vocabulary
 *
 * Kept here rather than inline on GlossaryTerm so the existing /glossary,
 * /api/v1/glossary.json, and any other consumers of the source array
 * remain unchanged.
 */

import { glossaryTerms } from "@/content/glossary";

export type GlossaryCategory =
  | "code-side-sourcing"
  | "engineering-acceleration"
  | "discoverability"
  | "agent-infrastructure"
  | "academic-citation"
  | "venture-vocabulary";

export interface CategoryMeta {
  slug: GlossaryCategory;
  label: string;
  blurb: string;
}

export const CATEGORY_META: Record<GlossaryCategory, CategoryMeta> = {
  "code-side-sourcing": {
    slug: "code-side-sourcing",
    label: "Code-Side Sourcing",
    blurb: "The named category VC Deal Flow Signal defines.",
  },
  "engineering-acceleration": {
    slug: "engineering-acceleration",
    label: "Engineering acceleration",
    blurb: "Metrics, signal types, and decision rules from the methodology.",
  },
  discoverability: {
    slug: "discoverability",
    label: "Discoverability surfaces",
    blurb: "Programmatic SEO, AEO, GEO, AIO, and the schemas behind them.",
  },
  "agent-infrastructure": {
    slug: "agent-infrastructure",
    label: "Agent infrastructure",
    blurb: "MCP, A2A, micropayments, identity, federation.",
  },
  "academic-citation": {
    slug: "academic-citation",
    label: "Academic citation",
    blurb: "SSRN, Zenodo, OpenAlex, DOIs, licenses.",
  },
  "venture-vocabulary": {
    slug: "venture-vocabulary",
    label: "Venture vocabulary",
    blurb: "Stage names, instruments, and core financial metrics.",
  },
};

const TERM_CATEGORY: Record<string, GlossaryCategory> = {
  "code-side-sourcing": "code-side-sourcing",

  "commit-velocity-acceleration-engine": "engineering-acceleration",
  "commit-velocity": "engineering-acceleration",
  "commit-velocity-change": "engineering-acceleration",
  "engineering-acceleration": "engineering-acceleration",
  "deal-flow-signal": "engineering-acceleration",
  "contributor-growth": "engineering-acceleration",
  "engineering-hiring-burst": "engineering-acceleration",
  "infrastructure-buildout": "engineering-acceleration",
  "deploy-frequency-spike": "engineering-acceleration",
  "framework-migration": "engineering-acceleration",
  "bot-filter": "engineering-acceleration",
  "two-period-confirmation": "engineering-acceleration",
  "top-contributor-concentration": "engineering-acceleration",

  pseo: "discoverability",
  geo: "discoverability",
  indexnow: "discoverability",
  aeo: "discoverability",
  aio: "discoverability",
  "speakable-schema": "discoverability",
  "json-ld": "discoverability",
  "faqpage-schema": "discoverability",
  "qapage-schema": "discoverability",
  "howto-schema": "discoverability",
  "breadcrumblist-schema": "discoverability",
  "defined-term-set": "discoverability",
  hreflang: "discoverability",
  "canonical-url": "discoverability",
  "robots-txt": "discoverability",
  "sitemap-xml": "discoverability",
  "openapi-3-1": "discoverability",
  "x-mcp-tool": "discoverability",
  "discover-json": "discoverability",
  "ai-policy": "discoverability",
  "qa-jsonl": "discoverability",
  "llms-txt": "discoverability",
  "llms-full-txt": "discoverability",
  "schema-org": "discoverability",
  "claim-review": "discoverability",
  "quotation-schema": "discoverability",

  mcp: "agent-infrastructure",
  "a2a-agent-card": "agent-infrastructure",
  "streamable-http": "agent-infrastructure",
  "json-rpc-2": "agent-infrastructure",
  x402: "agent-infrastructure",
  webfinger: "agent-infrastructure",
  did: "agent-infrastructure",
  nodeinfo: "agent-infrastructure",

  "scout-score": "academic-citation",
  "ssrn-preprint": "academic-citation",
  "zenodo-doi": "academic-citation",
  openalex: "academic-citation",
  datacite: "academic-citation",
  orcid: "academic-citation",
  doi: "academic-citation",
  "cc-by-4-0": "academic-citation",
  datafeed: "academic-citation",

  "pre-seed": "venture-vocabulary",
  "seed-round": "venture-vocabulary",
  "series-a": "venture-vocabulary",
  "series-b": "venture-vocabulary",
  "lead-investor": "venture-vocabulary",
  "term-sheet": "venture-vocabulary",
  safe: "venture-vocabulary",
  "convertible-note": "venture-vocabulary",
  "valuation-cap": "venture-vocabulary",
  "burn-rate": "venture-vocabulary",
  runway: "venture-vocabulary",
  "cap-table": "venture-vocabulary",
};

/** Categorize a glossary term ID. Falls back to "discoverability" — the
 *  largest bucket — for any unmapped term so the build never crashes if
 *  glossary.ts adds a term without a category mapping. */
export function getCategoryFor(termId: string): GlossaryCategory {
  return TERM_CATEGORY[termId] ?? "discoverability";
}

/** All term IDs that share a category, in source order. */
export function getTermsInCategory(category: GlossaryCategory): string[] {
  return glossaryTerms
    .filter((t) => getCategoryFor(t.id) === category)
    .map((t) => t.id);
}

/** Cross-link to /signals/define/[type] where a term has a formal signal
 *  primitive counterpart. Mirrors the table in app/glossary/page.tsx. */
const SIGNAL_SLUG_MAP: Record<string, string> = {
  "commit-velocity": "commit-velocity",
  "commit-velocity-change": "commit-velocity-change",
  "engineering-acceleration": "commit-velocity-change",
  "contributor-growth": "contributor-growth",
  "engineering-hiring-burst": "engineering-hiring-burst",
  "framework-migration": "framework-migration",
  "infrastructure-buildout": "infrastructure-buildout",
};

export function getSignalPrimitiveSlug(termId: string): string | undefined {
  return SIGNAL_SLUG_MAP[termId];
}

/** Cross-link to a /tools/* calculator where a term is the subject of one.
 *  Lets /define/[term] render a "Use this in:" CTA that converts the
 *  definitional page into a funnel for the calculators. */
export interface ToolCrossLink {
  slug: string;
  name: string;
  blurb: string;
}

const TOOL_LINK_MAP: Record<string, ToolCrossLink> = {
  safe: {
    slug: "safe-calculator",
    name: "SAFE Calculator",
    blurb:
      "Model what a SAFE will convert to at the next priced round under both the cap and the discount.",
  },
  "valuation-cap": {
    slug: "safe-calculator",
    name: "SAFE Calculator",
    blurb:
      "See exactly when the cap binds vs the discount in a post-money SAFE.",
  },
  runway: {
    slug: "runway-calculator",
    name: "Runway Calculator",
    blurb:
      "Cash / net-burn → months of runway, with headcount scenarios.",
  },
  "burn-rate": {
    slug: "runway-calculator",
    name: "Runway Calculator",
    blurb:
      "Gross vs net burn fed straight into months-of-runway with fundraise-timing bands.",
  },
};

export function getToolCrossLink(termId: string): ToolCrossLink | undefined {
  return TOOL_LINK_MAP[termId];
}
