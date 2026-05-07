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
 * F2 (2026-05-07) — every Surface now carries a stable `name` (kebab-slug)
 * and canonical API surfaces carry a populated `endpoints[]` array with
 * method+path+description tuples so a fresh agent can map operations in
 * one fetch instead of probing each endpoint. Adds the previously-missing
 * /api/cite/{format}/{slug} formatter surface that was reachable but not
 * advertised in this manifest.
 *
 * Designed for retrieval pipelines that want a one-shot "what does this site
 * expose?" probe before deciding which detailed surface to fetch.
 */

import { NextResponse } from "next/server";
import { getDataLastModified } from "@/lib/data";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

interface Endpoint {
  method: string;
  path: string;
  description?: string;
  params?: string[];
  contentType?: string;
}

interface Surface {
  name: string;
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

const SURFACES: Surface[] = [
  // ── Agent / MCP discovery ──────────────────────────────
  {
    name: "agent-card-wellknown",
    url: `${SITE}/.well-known/agent-card.json`,
    format: "application/json",
    category: "agent",
    description: "A2A AgentCard — canonical agent descriptor with skills, transports, capabilities",
    endpoints: [{ method: "GET", path: "/.well-known/agent-card.json", description: "Fetch the canonical A2A AgentCard payload" }],
  },
  {
    name: "agent-card-legacy",
    url: `${SITE}/.well-known/agent.json`,
    format: "application/json",
    category: "agent",
    description: "Legacy alias for agent-card.json (some early A2A adopters probe this name)",
    endpoints: [{ method: "GET", path: "/.well-known/agent.json", description: "Same body as /.well-known/agent-card.json" }],
  },
  {
    name: "agents-wellknown",
    url: `${SITE}/.well-known/agents.json`,
    format: "application/json",
    category: "agent",
    description: "Toolkit-style agent surface index (mirrors /agents.json)",
    endpoints: [{ method: "GET", path: "/.well-known/agents.json", description: "List of agent toolkits and their capabilities" }],
  },
  {
    name: "mcp-discovery",
    url: `${SITE}/.well-known/mcp.json`,
    format: "application/json",
    category: "agent",
    description: "Model Context Protocol discovery manifest — install snippet, tools list",
    endpoints: [{ method: "GET", path: "/.well-known/mcp.json", description: "MCP server discovery manifest" }],
  },
  {
    name: "agents-root",
    url: `${SITE}/agents.json`,
    format: "application/json",
    category: "agent",
    description: "Root agent toolkit catalog — same body as well-known mirror",
    endpoints: [{ method: "GET", path: "/agents.json", description: "Same body as /.well-known/agents.json" }],
  },
  {
    name: "agents-policy-text",
    url: `${SITE}/agents.txt`,
    format: "text/plain",
    category: "agent",
    description: "Human-readable agent policy summary",
  },
  {
    name: "agent-card-root",
    url: `${SITE}/agent-card.json`,
    format: "application/json",
    category: "agent",
    description: "Root alias for /.well-known/agent-card.json",
    endpoints: [{ method: "GET", path: "/agent-card.json", description: "Same body as /.well-known/agent-card.json" }],
  },
  {
    name: "api-catalog-linkset",
    url: `${SITE}/.well-known/api-catalog`,
    format: "application/linkset+json",
    category: "agent",
    description: "RFC 9727 Linkset of every agent surface",
    endpoints: [{ method: "GET", path: "/.well-known/api-catalog", description: "RFC 9727 Linkset linking every agent + API surface" }],
  },
  {
    name: "mcp-rpc",
    url: `${SITE}/api/mcp/rpc`,
    format: "application/json",
    category: "agent",
    description: "Streamable MCP JSON-RPC 2.0 endpoint — 7 free tools + 1 paid (x402 €0.19 USDC)",
    endpoints: [
      { method: "POST", path: "/api/mcp/rpc", description: "JSON-RPC 2.0 envelope; method=initialize" },
      { method: "POST", path: "/api/mcp/rpc", description: "JSON-RPC method=tools/list — enumerate available tools" },
      { method: "POST", path: "/api/mcp/rpc", description: "JSON-RPC tools/call name=get_trending_startups (read-only)", params: ["sector?", "limit?"] },
      { method: "POST", path: "/api/mcp/rpc", description: "JSON-RPC tools/call name=search_startups_by_sector", params: ["sector", "limit?"] },
      { method: "POST", path: "/api/mcp/rpc", description: "JSON-RPC tools/call name=get_startup_signal", params: ["slug"] },
      { method: "POST", path: "/api/mcp/rpc", description: "JSON-RPC tools/call name=get_signals_summary" },
      { method: "POST", path: "/api/mcp/rpc", description: "JSON-RPC tools/call name=get_scout_receipts", params: ["github_username"] },
      { method: "POST", path: "/api/mcp/rpc", description: "JSON-RPC tools/call name=get_methodology" },
      { method: "POST", path: "/api/mcp/rpc", description: "JSON-RPC tools/call name=get_deep_signal (paid, x402 €0.19 USDC on Base)", params: ["slug"] },
      { method: "POST", path: "/api/mcp/rpc", description: "JSON-RPC tools/call name=share_result (requires user approval token)", params: ["payload", "userApprovalToken"] },
    ],
  },
  // ── API discovery ──────────────────────────────────────
  { name: "openapi-api", url: `${SITE}/api/openapi.json`, format: "application/json", category: "api", description: "OpenAPI 3.1 spec — full API contract with paths, schemas, examples", endpoints: [{ method: "GET", path: "/api/openapi.json", description: "OpenAPI 3.1 contract for every public REST endpoint" }] },
  { name: "openapi-wellknown", url: `${SITE}/.well-known/openapi.json`, format: "application/json", category: "api", description: "Well-known alias for /api/openapi.json", endpoints: [{ method: "GET", path: "/.well-known/openapi.json", description: "Same body as /api/openapi.json" }] },
  { name: "openapi-root", url: `${SITE}/openapi.json`, format: "application/json", category: "api", description: "Root alias for /api/openapi.json", endpoints: [{ method: "GET", path: "/openapi.json", description: "Same body as /api/openapi.json" }] },
  { name: "openapi-v1", url: `${SITE}/api/v1/openapi.json`, format: "application/json", category: "api", description: "Versioned alias for /api/openapi.json (v1-pinned consumers)", endpoints: [{ method: "GET", path: "/api/v1/openapi.json", description: "v1-pinned OpenAPI 3.1 contract" }] },
  { name: "pricing-v1", url: `${SITE}/api/v1/pricing.json`, format: "application/json", category: "api", description: "Machine-readable pricing — six tiers, founding-member rates, guarantees", endpoints: [{ method: "GET", path: "/api/v1/pricing.json", description: "Pricing tiers with priceCurrency, availability, validUntil" }] },
  { name: "glossary-v1", url: `${SITE}/api/v1/glossary.json`, format: "application/ld+json", category: "api", description: "Schema.org DefinedTermSet of 18 controlled-vocabulary terms", endpoints: [{ method: "GET", path: "/api/v1/glossary.json", description: "Full DefinedTermSet (Schema.org JSON-LD)" }] },
  { name: "faq-v1", url: `${SITE}/api/v1/faq.json`, format: "application/ld+json", category: "api", description: "Schema.org FAQPage with 100+ Q&A entries", endpoints: [{ method: "GET", path: "/api/v1/faq.json", description: "Full FAQPage (Schema.org JSON-LD)" }] },
  { name: "methodology-v1", url: `${SITE}/api/v1/methodology.json`, format: "application/ld+json", category: "api", description: "Schema.org HowTo of the 6-step signal computation methodology", endpoints: [{ method: "GET", path: "/api/v1/methodology.json", description: "Six-step HowTo describing how Scout Score is computed" }] },
  { name: "signals-v1", url: `${SITE}/api/v1/signals.json`, format: "application/json", category: "api", description: "Versioned alias for /api/signals.json (full signal panel)", endpoints: [{ method: "GET", path: "/api/v1/signals.json", description: "Full ranked signal panel — refresh weekly Mondays ~09:00 UTC", params: ["sector?", "limit?", "offset?"] }] },
  { name: "agents-v1", url: `${SITE}/api/v1/agents.json`, format: "application/json", category: "api", description: "Versioned alias for /api/agents.json", endpoints: [{ method: "GET", path: "/api/v1/agents.json", description: "Same body as /agents.json (versioned)" }] },
  { name: "answers-v1", url: `${SITE}/api/v1/answers.json`, format: "application/json", category: "api", description: "Versioned alias for /api/answers.json (citation-ready answer corpus)", endpoints: [{ method: "GET", path: "/api/v1/answers.json", description: "Citation-ready answer corpus, anchored back to /answers/{slug}" }] },
  { name: "changelog-v1", url: `${SITE}/api/v1/changelog.json`, format: "application/json", category: "api", description: "Versioned alias for /api/changelog.json", endpoints: [{ method: "GET", path: "/api/v1/changelog.json", description: "Granular release notes per surface" }] },
  { name: "dataset-jsonl-v1", url: `${SITE}/api/v1/dataset.jsonl`, format: "application/x-ndjson", category: "api", description: "Versioned alias for /api/dataset.jsonl (HF Datasets compatible)", endpoints: [{ method: "GET", path: "/api/v1/dataset.jsonl", description: "NDJSON dump of the full signal panel; HF Datasets ready" }] },
  { name: "health", url: `${SITE}/api/health.json`, format: "application/json", category: "api", description: "Service health probe — uptime, last data refresh, surface readiness", endpoints: [{ method: "GET", path: "/api/health.json", description: "Liveness + freshness probe" }] },
  { name: "catalog", url: `${SITE}/api/catalog.json`, format: "application/json", category: "api", description: "Browseable catalog of every public surface", endpoints: [{ method: "GET", path: "/api/catalog.json", description: "Browseable catalog of every public surface" }] },
  { name: "schema-payload", url: `${SITE}/api/schema.json`, format: "application/schema+json", category: "schema", description: "JSON Schema for the signals payload", endpoints: [{ method: "GET", path: "/api/schema.json", description: "JSON Schema describing /api/v1/signals.json items" }] },
  { name: "answer-live", url: `${SITE}/api/answer`, format: "application/json", category: "api", description: "Live citation-ready answer endpoint with usage envelope", endpoints: [{ method: "GET", path: "/api/answer", description: "Live citation-ready answer; returns 400 with usage envelope when q is empty", params: ["q"] }] },
  { name: "ask-live", url: `${SITE}/api/ask`, format: "application/json", category: "api", description: "Live ask-anything endpoint over the answer corpus", endpoints: [{ method: "GET", path: "/api/ask", description: "Free-form ask; returns 400 with usage envelope when q is empty", params: ["q"] }] },
  {
    name: "cite-formatter",
    url: `${SITE}/api/cite/{format}/{slug}`,
    format: "text/plain",
    category: "api",
    description: "Per-finding citation formatter — emits BibTeX, APA, or MLA for any /research, /answers, or /receipts slug",
    endpoints: [
      { method: "GET", path: "/api/cite/bibtex/{slug}", description: "BibTeX citation for the named slug", params: ["slug"], contentType: "text/x-bibtex" },
      { method: "GET", path: "/api/cite/apa/{slug}", description: "APA-style citation for the named slug", params: ["slug"], contentType: "text/plain" },
      { method: "GET", path: "/api/cite/mla/{slug}", description: "MLA-style citation for the named slug", params: ["slug"], contentType: "text/plain" },
    ],
  },
  // ── Retrieval / LLM ────────────────────────────────────
  { name: "llms-index", url: `${SITE}/llms.txt`, format: "text/plain", category: "retrieval", description: "llms.txt — agent index of every canonical page (172KB)" },
  { name: "llms-index-wellknown", url: `${SITE}/.well-known/llms.txt`, format: "text/plain", category: "retrieval", description: "Well-known alias for /llms.txt" },
  { name: "llms-full", url: `${SITE}/llms-full.txt`, format: "text/plain", category: "retrieval", description: "llms-full.txt — extended canonical content for retrieval pipelines" },
  { name: "llms-full-wellknown", url: `${SITE}/.well-known/llms-full.txt`, format: "text/plain", category: "retrieval", description: "Well-known alias for /llms-full.txt" },
  { name: "llms-search-manifest", url: `${SITE}/llms-search.json`, format: "application/json", category: "retrieval", description: "llms-search.json — flat retrieval manifest of every canonical page (JSON twin of llms.txt; { url, title, summary, contentType, tags, lastModified })", endpoints: [{ method: "GET", path: "/llms-search.json", description: "Returns _meta + count + items[] flat array of every canonical page; use this when ingesting the corpus once for retrieval" }] },
  { name: "qa-jsonl", url: `${SITE}/qa.jsonl`, format: "application/x-ndjson", category: "retrieval", description: "Q&A NDJSON corpus — citation-ready, RAG-friendly" },
  { name: "qa-jsonl-wellknown", url: `${SITE}/.well-known/qa.jsonl`, format: "application/x-ndjson", category: "retrieval", description: "Well-known alias for /qa.jsonl" },
  { name: "markdown-mirror", url: `${SITE}/md/`, format: "text/markdown", category: "retrieval", description: "Markdown mirror — every page available at /md/{path}" },
  // ── Policy / governance ────────────────────────────────
  { name: "ai-policy", url: `${SITE}/.well-known/ai-policy.json`, format: "application/json", category: "policy", description: "Machine-readable AI access policy — per-agent allow/disallow + use modes" },
  { name: "ai-policy-shortname", url: `${SITE}/.well-known/ai.json`, format: "application/json", category: "policy", description: "Short-name alias for ai-policy.json" },
  { name: "ai-policy-text", url: `${SITE}/ai.txt`, format: "text/plain", category: "policy", description: "Human-readable AI access policy (analog to robots.txt)" },
  { name: "ai-policy-text-wellknown", url: `${SITE}/.well-known/ai.txt`, format: "text/plain", category: "policy", description: "Well-known alias for /ai.txt" },
  { name: "security-txt", url: `${SITE}/.well-known/security.txt`, format: "text/plain", category: "policy", description: "RFC 9116 security disclosure contact" },
  { name: "security-policy", url: `${SITE}/.well-known/security-policy.json`, format: "application/json", category: "policy", description: "Machine-readable security disclosure policy" },
  { name: "security-txt-root", url: `${SITE}/security.txt`, format: "text/plain", category: "policy", description: "Root alias for /.well-known/security.txt" },
  { name: "robots", url: `${SITE}/robots.txt`, format: "text/plain", category: "policy", description: "Crawler access rules" },
  // ── Sitemaps ──────────────────────────────────────────
  { name: "sitemap-index", url: `${SITE}/sitemap.xml`, format: "application/xml", category: "sitemap", description: "Root sitemapindex — points to 5 sub-sitemaps + news + i18n + images + videos" },
  { name: "sitemap-wellknown", url: `${SITE}/.well-known/sitemap.xml`, format: "application/xml", category: "sitemap", description: "Well-known alias for /sitemap.xml" },
  { name: "sitemap-text", url: `${SITE}/sitemap.txt`, format: "text/plain", category: "sitemap", description: "Plain-text sitemap (one URL per line)" },
  { name: "sitemap-i18n", url: `${SITE}/sitemap-i18n.xml`, format: "application/xml", category: "sitemap", description: "i18n sitemap with hreflang annotations across 12 locales" },
  { name: "sitemap-images", url: `${SITE}/sitemap-images.xml`, format: "application/xml", category: "sitemap", description: "Image sitemap with captions" },
  { name: "sitemap-videos", url: `${SITE}/sitemap-videos.xml`, format: "application/xml", category: "sitemap", description: "Video sitemap" },
  { name: "sitemap-news", url: `${SITE}/news-sitemap.xml`, format: "application/xml", category: "sitemap", description: "Google News sitemap (recent posts only)" },
  // ── Feeds ─────────────────────────────────────────────
  { name: "rss", url: `${SITE}/rss.xml`, format: "application/rss+xml", category: "feed", description: "RSS 2.0 feed of recent posts" },
  { name: "atom", url: `${SITE}/atom.xml`, format: "application/atom+xml", category: "feed", description: "Atom 1.0 feed of recent posts" },
  // ── Dataset / freshness ───────────────────────────────
  { name: "dataset-descriptor", url: `${SITE}/.well-known/dataset.json`, format: "application/ld+json", category: "schema", description: "DCAT 3 dataset descriptor — distributions, license, cadence" },
  { name: "dataset-descriptor-root", url: `${SITE}/dataset.json`, format: "application/ld+json", category: "schema", description: "Root alias for /.well-known/dataset.json" },
  { name: "freshness", url: `${SITE}/.well-known/freshness.json`, format: "application/ld+json", category: "schema", description: "DataFeed manifest — last modified timestamp, refresh cadence per surface" },
  // ── Identity / federation ─────────────────────────────
  { name: "did-configuration", url: `${SITE}/.well-known/did-configuration.json`, format: "application/json", category: "identity", description: "DID Configuration — verifiable identity binding" },
  { name: "webfinger", url: `${SITE}/.well-known/webfinger`, format: "application/jrd+json", category: "identity", description: "WebFinger account discovery (RFC 7033)", endpoints: [{ method: "GET", path: "/.well-known/webfinger", description: "Account discovery via resource= query parameter", params: ["resource"] }] },
  { name: "host-meta", url: `${SITE}/.well-known/host-meta`, format: "application/xml", category: "identity", description: "RFC 9079 host metadata" },
  { name: "host-meta-json", url: `${SITE}/.well-known/host-meta.json`, format: "application/json", category: "identity", description: "JSON form of host-meta" },
  { name: "nodeinfo", url: `${SITE}/.well-known/nodeinfo`, format: "application/json", category: "identity", description: "NodeInfo discovery for Fediverse compatibility" },
  { name: "oauth-authorization-server", url: `${SITE}/.well-known/oauth-authorization-server`, format: "application/json", category: "identity", description: "OAuth 2.0 authorization server metadata (RFC 8414)" },
  { name: "openai-search", url: `${SITE}/.well-known/openai-search.json`, format: "application/json", category: "schema", description: "OpenAI search policy + agent-card pointer" },
  { name: "model-descriptor", url: `${SITE}/.well-known/model.json`, format: "application/json", category: "schema", description: "Model.json descriptor — capabilities, sources, license" },
  { name: "compliance", url: `${SITE}/.well-known/compliance.json`, format: "application/json", category: "schema", description: "Machine-readable compliance posture" },
  // ── Human-readable ─────────────────────────────────────
  { name: "humans-wellknown", url: `${SITE}/.well-known/humans.txt`, format: "text/plain", category: "human", description: "Human attribution — author, ORCID, contact" },
  { name: "humans-root", url: `${SITE}/humans.txt`, format: "text/plain", category: "human", description: "Root alias for /.well-known/humans.txt" },
];

export async function GET() {
  try {
    const lastModified = getDataLastModified();

    const counts = SURFACES.reduce<Record<string, number>>((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1;
      return acc;
    }, {});

    const totalEndpoints = SURFACES.reduce(
      (acc, s) => acc + (s.endpoints?.length ?? 0),
      0,
    );

    const body = {
      "@context": "https://schema.org",
      "@type": "DataCatalog",
      "@id": `${SITE}/.well-known/discover.json`,
      name: "VC Deal Flow Signal — Discovery Manifest",
      description:
        "Umbrella manifest of every well-known, root-level, and /api/v1/* surface this site exposes for AI agents, retrieval pipelines, and machine consumers. Each surface carries a stable `name` (kebab-slug) and canonical API surfaces carry a populated `endpoints[]` array with method+path+description tuples so a fresh agent can map operations in one fetch.",
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
        totalEndpoints,
        byCategory: counts,
        coverage:
          "Agent/MCP, OpenAPI, retrieval (llms.txt + qa.jsonl + markdown mirror), policy (ai-policy + security), sitemaps, RSS/Atom feeds, dataset descriptors, identity (DID + WebFinger + NodeInfo), and human attribution.",
      },
      surfaces: SURFACES,
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
  } catch (err) {
    console.error("[discover.json] failed to build manifest", err);
    return NextResponse.json(
      {
        "@context": "https://schema.org",
        "@type": "DataCatalog",
        "@id": `${SITE}/.well-known/discover.json`,
        error: "discover_manifest_unavailable",
        message: "Discovery manifest temporarily unavailable.",
        totalSurfaces: SURFACES.length,
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/ld+json; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Robots-Tag": "noindex",
        },
      },
    );
  }
}
