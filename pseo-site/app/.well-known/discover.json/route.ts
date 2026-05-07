/**
 * /.well-known/discover.json — umbrella manifest of every well-known and
 * root-level discovery surface in one machine-readable doc.
 *
 * Pass VIII (2026-05-05). Net-new AEO/AIO surface. Existing AI agents and
 * retrieval pipelines have to probe ~30 distinct .well-known and root URLs
 * to fully map the agent surface area. This endpoint emits the complete
 * inventory in one fetch — agent-card, openapi, llms.txt, sitemaps, RSS/
 * Atom, dataset descriptors, AI-policy, freshness manifest, mcp.json, etc.
 *
 * Designed for retrieval pipelines that want a one-shot "what does this site
 * expose?" probe before deciding which detailed surface to fetch.
 */

import { NextResponse } from "next/server";
import { getDataLastModified } from "@/lib/data";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

interface EndpointParam {
  name: string;
  in: "query" | "path" | "header" | "body";
  required?: boolean;
  description?: string;
}

interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE" | "HEAD";
  params?: EndpointParam[];
  contentType?: string;
  description?: string;
}

interface Surface {
  url: string;
  format: string;
  category:
    | "agent"
    | "api"
    | "policy"
    | "retrieval"
    | "sitemap"
    | "feed"
    | "identity"
    | "schema"
    | "human";
  description: string;
  endpoints?: Endpoint[];
}

// Default GET endpoint metadata for most surfaces (no params, plain HTTP GET).
const GET_ONLY: Endpoint[] = [{ method: "GET" }];

const SURFACES: Surface[] = [
  // ── Agent / MCP discovery ──────────────────────────────
  { url: `${SITE}/.well-known/agent-card.json`, format: "application/json", category: "agent", description: "A2A AgentCard — canonical agent descriptor with skills, transports, capabilities" },
  { url: `${SITE}/.well-known/agent.json`, format: "application/json", category: "agent", description: "Legacy alias for agent-card.json (some early A2A adopters probe this name)" },
  { url: `${SITE}/.well-known/agents.json`, format: "application/json", category: "agent", description: "Toolkit-style agent surface index (mirrors /agents.json)" },
  { url: `${SITE}/.well-known/mcp.json`, format: "application/json", category: "agent", description: "Model Context Protocol discovery manifest — install snippet, tools list" },
  { url: `${SITE}/agents.json`, format: "application/json", category: "agent", description: "Root agent toolkit catalog — same body as well-known mirror" },
  { url: `${SITE}/agents.txt`, format: "text/plain", category: "agent", description: "Human-readable agent policy summary" },
  { url: `${SITE}/agent-card.json`, format: "application/json", category: "agent", description: "Root alias for /.well-known/agent-card.json" },
  { url: `${SITE}/.well-known/api-catalog`, format: "application/linkset+json", category: "agent", description: "RFC 9727 Linkset of every agent surface" },
  // ── API discovery ──────────────────────────────────────
  { url: `${SITE}/api/openapi.json`, format: "application/json", category: "api", description: "OpenAPI 3.1 spec — full API contract with paths, schemas, examples" },
  { url: `${SITE}/.well-known/openapi.json`, format: "application/json", category: "api", description: "Well-known alias for /api/openapi.json" },
  { url: `${SITE}/openapi.json`, format: "application/json", category: "api", description: "Root alias for /api/openapi.json" },
  { url: `${SITE}/api/v1/openapi.json`, format: "application/json", category: "api", description: "Versioned alias for /api/openapi.json (v1-pinned consumers)" },
  { url: `${SITE}/api/v1/pricing.json`, format: "application/json", category: "api", description: "Machine-readable pricing — six tiers, founding-member rates, guarantees" },
  { url: `${SITE}/api/v1/glossary.json`, format: "application/ld+json", category: "api", description: "Schema.org DefinedTermSet of 18 controlled-vocabulary terms" },
  { url: `${SITE}/api/v1/faq.json`, format: "application/ld+json", category: "api", description: "Schema.org FAQPage with 100+ Q&A entries" },
  { url: `${SITE}/api/v1/methodology.json`, format: "application/ld+json", category: "api", description: "Schema.org HowTo of the 6-step signal computation methodology" },
  { url: `${SITE}/api/v1/signals.json`, format: "application/json", category: "api", description: "Versioned alias for /api/signals.json (full signal panel)" },
  { url: `${SITE}/api/v1/agents.json`, format: "application/json", category: "api", description: "Versioned alias for /api/agents.json" },
  { url: `${SITE}/api/v1/answers.json`, format: "application/json", category: "api", description: "Versioned alias for /api/answers.json (citation-ready answer corpus)" },
  { url: `${SITE}/api/v1/changelog.json`, format: "application/json", category: "api", description: "Versioned alias for /api/changelog.json" },
  { url: `${SITE}/api/v1/dataset.jsonl`, format: "application/x-ndjson", category: "api", description: "Versioned alias for /api/dataset.jsonl (HF Datasets compatible)" },
  { url: `${SITE}/api/health.json`, format: "application/json", category: "api", description: "Service health probe — uptime, last data refresh, surface readiness" },
  { url: `${SITE}/api/catalog.json`, format: "application/json", category: "api", description: "Browseable catalog of every public surface" },
  { url: `${SITE}/api/schema.json`, format: "application/schema+json", category: "schema", description: "JSON Schema for the signals payload" },
  { url: `${SITE}/api/answer`, format: "application/json", category: "api", description: "Live citation-ready answer endpoint with usage envelope" },
  { url: `${SITE}/api/ask`, format: "application/json", category: "api", description: "Live ask-anything endpoint over the answer corpus" },
  // ── Retrieval / LLM ────────────────────────────────────
  { url: `${SITE}/llms.txt`, format: "text/plain", category: "retrieval", description: "llms.txt — agent index of every canonical page (172KB)" },
  { url: `${SITE}/.well-known/llms.txt`, format: "text/plain", category: "retrieval", description: "Well-known alias for /llms.txt" },
  { url: `${SITE}/llms-full.txt`, format: "text/plain", category: "retrieval", description: "llms-full.txt — extended canonical content for retrieval pipelines" },
  { url: `${SITE}/.well-known/llms-full.txt`, format: "text/plain", category: "retrieval", description: "Well-known alias for /llms-full.txt" },
  { url: `${SITE}/qa.jsonl`, format: "application/x-ndjson", category: "retrieval", description: "Q&A NDJSON corpus — citation-ready, RAG-friendly" },
  { url: `${SITE}/.well-known/qa.jsonl`, format: "application/x-ndjson", category: "retrieval", description: "Well-known alias for /qa.jsonl" },
  { url: `${SITE}/md/`, format: "text/markdown", category: "retrieval", description: "Markdown mirror — every page available at /md/{path}" },
  // ── Policy / governance ────────────────────────────────
  { url: `${SITE}/.well-known/ai-policy.json`, format: "application/json", category: "policy", description: "Machine-readable AI access policy — per-agent allow/disallow + use modes" },
  { url: `${SITE}/.well-known/ai.json`, format: "application/json", category: "policy", description: "Short-name alias for ai-policy.json" },
  { url: `${SITE}/ai.txt`, format: "text/plain", category: "policy", description: "Human-readable AI access policy (analog to robots.txt)" },
  { url: `${SITE}/.well-known/ai.txt`, format: "text/plain", category: "policy", description: "Well-known alias for /ai.txt" },
  { url: `${SITE}/.well-known/security.txt`, format: "text/plain", category: "policy", description: "RFC 9116 security disclosure contact" },
  { url: `${SITE}/.well-known/security-policy.json`, format: "application/json", category: "policy", description: "Machine-readable security disclosure policy" },
  { url: `${SITE}/security.txt`, format: "text/plain", category: "policy", description: "Root alias for /.well-known/security.txt" },
  { url: `${SITE}/robots.txt`, format: "text/plain", category: "policy", description: "Crawler access rules" },
  // ── Sitemaps ──────────────────────────────────────────
  { url: `${SITE}/sitemap.xml`, format: "application/xml", category: "sitemap", description: "Root sitemapindex — points to 5 sub-sitemaps + news + i18n + images + videos" },
  { url: `${SITE}/.well-known/sitemap.xml`, format: "application/xml", category: "sitemap", description: "Well-known alias for /sitemap.xml" },
  { url: `${SITE}/sitemap.txt`, format: "text/plain", category: "sitemap", description: "Plain-text sitemap (one URL per line)" },
  { url: `${SITE}/sitemap-i18n.xml`, format: "application/xml", category: "sitemap", description: "i18n sitemap with hreflang annotations across 12 locales" },
  { url: `${SITE}/sitemap-images.xml`, format: "application/xml", category: "sitemap", description: "Image sitemap with captions" },
  { url: `${SITE}/sitemap-videos.xml`, format: "application/xml", category: "sitemap", description: "Video sitemap" },
  { url: `${SITE}/news-sitemap.xml`, format: "application/xml", category: "sitemap", description: "Google News sitemap (recent posts only)" },
  // ── Feeds ─────────────────────────────────────────────
  { url: `${SITE}/rss.xml`, format: "application/rss+xml", category: "feed", description: "RSS 2.0 feed of recent posts" },
  { url: `${SITE}/atom.xml`, format: "application/atom+xml", category: "feed", description: "Atom 1.0 feed of recent posts" },
  // ── Dataset / freshness ───────────────────────────────
  { url: `${SITE}/.well-known/dataset.json`, format: "application/ld+json", category: "schema", description: "DCAT 3 dataset descriptor — distributions, license, cadence" },
  { url: `${SITE}/dataset.json`, format: "application/ld+json", category: "schema", description: "Root alias for /.well-known/dataset.json" },
  { url: `${SITE}/.well-known/freshness.json`, format: "application/ld+json", category: "schema", description: "DataFeed manifest — last modified timestamp, refresh cadence per surface" },
  // ── Identity / federation ─────────────────────────────
  { url: `${SITE}/.well-known/did-configuration.json`, format: "application/json", category: "identity", description: "DID Configuration — verifiable identity binding" },
  { url: `${SITE}/.well-known/webfinger`, format: "application/jrd+json", category: "identity", description: "WebFinger account discovery (RFC 7033)" },
  { url: `${SITE}/.well-known/host-meta`, format: "application/xml", category: "identity", description: "RFC 9079 host metadata" },
  { url: `${SITE}/.well-known/host-meta.json`, format: "application/json", category: "identity", description: "JSON form of host-meta" },
  { url: `${SITE}/.well-known/nodeinfo`, format: "application/json", category: "identity", description: "NodeInfo discovery for Fediverse compatibility" },
  { url: `${SITE}/.well-known/oauth-authorization-server`, format: "application/json", category: "identity", description: "OAuth 2.0 authorization server metadata (RFC 8414)" },
  { url: `${SITE}/.well-known/openai-search.json`, format: "application/json", category: "schema", description: "OpenAI search policy + agent-card pointer" },
  { url: `${SITE}/.well-known/model.json`, format: "application/json", category: "schema", description: "Model.json descriptor — capabilities, sources, license" },
  { url: `${SITE}/.well-known/compliance.json`, format: "application/json", category: "schema", description: "Machine-readable compliance posture" },
  // ── Human-readable ─────────────────────────────────────
  { url: `${SITE}/.well-known/humans.txt`, format: "text/plain", category: "human", description: "Human attribution — author, ORCID, contact" },
  { url: `${SITE}/humans.txt`, format: "text/plain", category: "human", description: "Root alias for /.well-known/humans.txt" },
];

// Per-URL endpoint overrides for surfaces that take parameters or non-GET methods.
// Anything not listed here defaults to a single GET with no params.
const ENDPOINT_OVERRIDES: Record<string, Endpoint[]> = {
  [`${SITE}/api/mcp/rpc`]: [
    {
      method: "POST",
      contentType: "application/json",
      params: [
        { name: "jsonrpc", in: "body", required: true, description: "Must be '2.0'" },
        { name: "method", in: "body", required: true, description: "MCP method name (e.g. tools/list, tools/call)" },
        { name: "id", in: "body", required: true, description: "Request id" },
        { name: "params", in: "body", required: false, description: "Method-specific params object" },
      ],
      description: "JSON-RPC 2.0 over HTTPS — see /.well-known/mcp.json for the tool catalog",
    },
  ],
  [`${SITE}/api/answer`]: [
    {
      method: "GET",
      params: [
        { name: "q", in: "query", required: true, description: "Question string (1-500 chars)" },
        { name: "format", in: "query", required: false, description: "json|text|jsonl (default json)" },
      ],
    },
  ],
  [`${SITE}/api/ask`]: [
    {
      method: "GET",
      params: [
        { name: "q", in: "query", required: true, description: "Question string" },
      ],
    },
  ],
  [`${SITE}/api/v1/signals.json`]: [
    {
      method: "GET",
      params: [
        { name: "sector", in: "query", required: false, description: "Filter by sector slug (e.g. ai-ml)" },
        { name: "stage", in: "query", required: false, description: "Filter by stage (seed|series-a|series-b)" },
        { name: "limit", in: "query", required: false, description: "Max results (default 100)" },
      ],
    },
  ],
  [`${SITE}/api/v1/glossary.json`]: [
    {
      method: "GET",
      params: [
        { name: "term", in: "query", required: false, description: "Look up a single DefinedTerm by slug" },
      ],
    },
  ],
  [`${SITE}/md/`]: [
    {
      method: "GET",
      params: [
        { name: "path", in: "path", required: true, description: "Site path to mirror as markdown (e.g. /md/methodology)" },
      ],
    },
  ],
};

function endpointsFor(surface: Surface): Endpoint[] {
  const override = ENDPOINT_OVERRIDES[surface.url];
  if (override) return override;
  // Sitemaps, feeds, well-known, and root aliases all answer plain GET.
  return GET_ONLY;
}

export async function GET() {
  const lastModified = getDataLastModified();

  const counts = SURFACES.reduce<Record<string, number>>((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1;
    return acc;
  }, {});

  // Decorate every surface with its endpoint metadata so retrieval pipelines
  // know how to call it without fetching OpenAPI separately. Non-API surfaces
  // get the default `[{ method: "GET" }]`. (F2 — closes empty-endpoints gap.)
  const decoratedSurfaces = SURFACES.map((s) => ({
    ...s,
    endpoints: endpointsFor(s),
  }));

  const body = {
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    "@id": `${SITE}/.well-known/discover.json`,
    name: "VC Deal Flow Signal — Discovery Manifest",
    description:
      "Umbrella manifest of every well-known, root-level, and /api/v1/* surface this site exposes for AI agents, retrieval pipelines, and machine consumers. Designed as a one-shot probe so agents don't have to fan out across 60+ URLs to map the agent surface area.",
    publisher: {
      "@type": "Organization",
      "@id": "https://gitdealflow.com/#organization",
      name: "VC Deal Flow Signal",
      alternateName: "GitDealFlow",
      url: "https://gitdealflow.com",
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    citation: "VC Deal Flow Signal (signals.gitdealflow.com), Q2 2026 data.",
    dateModified: lastModified.toISOString(),
    summary: {
      totalSurfaces: SURFACES.length,
      byCategory: counts,
      coverage:
        "Agent/MCP, OpenAPI, retrieval (llms.txt + qa.jsonl + markdown mirror), policy (ai-policy + security), sitemaps, RSS/Atom feeds, dataset descriptors, identity (DID + WebFinger + NodeInfo), and human attribution.",
    },
    surfaces: decoratedSurfaces,
    relatedDocs: {
      llmsIndex: `${SITE}/llms.txt`,
      llmsFull: `${SITE}/llms-full.txt`,
      methodology: `${SITE}/methodology`,
      standards: `${SITE}/standards`,
      reproducibility: `${SITE}/reproducibility`,
      ssrnPaper: "https://ssrn.com/abstract=6606558",
    },
  };

  return NextResponse.json(body, {
    headers: {
      "Content-Type": "application/ld+json; charset=utf-8",
      "Cache-Control": "public, max-age=900, s-maxage=3600",
      "X-Robots-Tag": "index, follow",
      Link: `<https://creativecommons.org/licenses/by/4.0/>; rel="license"`,
    },
  });
}
