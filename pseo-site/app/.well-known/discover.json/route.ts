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
 * F34 (2026-05-07 evening) — endpoints[] now carry RICH method+param
 * descriptors:
 *   - operationId cross-referenced with /api/openapi.json
 *   - parameters[] with name, in (query|path|header|body), type, required,
 *     description, example, enum, format
 *   - responses[] with status, contentType, description, example
 *   - security[] (none | x402 | user-approval | api-key | oauth2)
 *   - xPayment block for x402-paid endpoints (price, chain, asset, payTo)
 *   - xMcpTool back-reference for endpoints with an MCP-tool analog
 *   - since (ISO date the endpoint was added)
 *   - tags[] for grouping
 * The legacy F2 `params: string[]` field is auto-derived from `parameters[]`
 * and kept on every endpoint for back-compat with consumers that already
 * parse the F2 shape. summary.totalParameters, summary.byMethod, and
 * summary.paidEndpoints added. contractVersion field bumped.
 *
 * Designed for retrieval pipelines that want a one-shot "what does this site
 * expose?" probe before deciding which detailed surface to fetch.
 */

import { NextResponse } from "next/server";
import { getDataLastModified } from "@/lib/data";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";
const CONTRACT_VERSION = "2026-05-08.f39";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

interface EndpointParam {
  name: string;
  in: "query" | "path" | "header" | "body";
  type: "string" | "number" | "integer" | "boolean" | "array" | "object";
  required: boolean;
  description?: string;
  enum?: string[];
  example?: string | number | boolean;
  format?: string;
  default?: string | number | boolean | null;
}

interface EndpointResponse {
  status: number;
  description: string;
  contentType?: string;
  example?: string;
}

interface EndpointPayment {
  protocol: "x402";
  price: string;
  priceCurrency: "EUR" | "USD";
  assetSymbol: string;
  chain: string;
  payTo?: string;
}

interface Endpoint {
  method: HttpMethod;
  path: string;
  /** Cross-reference to operationId in /api/openapi.json (if exposed there) */
  operationId?: string;
  /** Short, menu-friendly title */
  summary?: string;
  /** Long-form description; also used as fallback when summary absent */
  description?: string;
  /** Rich, typed parameter list (F34). */
  parameters?: EndpointParam[];
  /**
   * Legacy F2 string-list of param names (ending in `?` for optional). Auto-
   * derived from `parameters` so existing F2 consumers continue to work.
   */
  params?: string[];
  /** Per-status response shapes (F34). */
  responses?: EndpointResponse[];
  /** Convenience shorthand for the success response content-type. */
  contentType?: string;
  /** Auth/payment requirements. `none` means anonymous public. */
  security?: ("none" | "x402" | "user-approval" | "api-key" | "oauth2")[];
  /** x402 payment metadata, only when security includes `x402`. */
  xPayment?: EndpointPayment;
  /** If this endpoint mirrors an MCP tool, the tool's name. */
  xMcpTool?: string;
  /** ISO date this endpoint was first exposed. */
  since?: string;
  /** Optional caching policy hint for downstream consumers. */
  cacheControl?: string;
  /** Tags for grouping in catalog UIs. */
  tags?: string[];
  /** True if the endpoint is being deprecated and will be removed. */
  deprecated?: boolean;
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

// ─────────────────────────────────────────────────────────
// Reusable parameter and response builders
// ─────────────────────────────────────────────────────────

const PARAM_SECTOR: EndpointParam = {
  name: "sector",
  in: "query",
  type: "string",
  required: false,
  description:
    "Filter to a single tracked sector slug (e.g. devtools, ai-infra, security). Omit for the full panel.",
  example: "ai-infra",
};

const PARAM_LIMIT: EndpointParam = {
  name: "limit",
  in: "query",
  type: "integer",
  required: false,
  description: "Max rows to return. Defaults to the full panel.",
  example: 20,
  default: null,
};

const PARAM_OFFSET: EndpointParam = {
  name: "offset",
  in: "query",
  type: "integer",
  required: false,
  description: "Row offset for pagination.",
  example: 0,
  default: 0,
};

const PARAM_Q: EndpointParam = {
  name: "q",
  in: "query",
  type: "string",
  required: true,
  description: "Free-form natural-language question (URL-encoded).",
  example: "what is a github scout score",
};

const PARAM_SLUG_PATH: EndpointParam = {
  name: "slug",
  in: "path",
  type: "string",
  required: true,
  description:
    "Stable kebab-slug of the underlying entity (research finding, answer, receipt, or startup).",
  example: "scout-score",
};

const PARAM_CITE_FORMAT: EndpointParam = {
  name: "format",
  in: "path",
  type: "string",
  required: true,
  description: "Citation style.",
  enum: ["bibtex", "apa", "mla"],
  example: "bibtex",
};

const RESP_200_JSON: EndpointResponse = {
  status: 200,
  description: "Successful response.",
  contentType: "application/json",
};

const RESP_200_LDJSON: EndpointResponse = {
  status: 200,
  description: "Successful Schema.org JSON-LD response.",
  contentType: "application/ld+json",
};

const RESP_400_USAGE: EndpointResponse = {
  status: 400,
  description:
    "Empty or malformed query. Body contains a `usage` envelope with the expected param shape so an agent can self-correct on first probe.",
  contentType: "application/json",
};

const RESP_404_SLUG: EndpointResponse = {
  status: 404,
  description: "Slug not found in the curated set.",
  contentType: "application/json",
};

const X402_PAYMENT: EndpointPayment = {
  protocol: "x402",
  price: "0.19",
  priceCurrency: "EUR",
  assetSymbol: "USDC",
  chain: "base",
  payTo: "0x3a5635b24Bb98899efeD2957318A59c469729dE9",
};

/**
 * Derive the F2-compatible `params: string[]` field from a rich parameter list.
 * Optional params get a trailing `?` so existing consumers can tell required
 * from optional from the legacy field alone.
 */
function legacyParams(parameters?: EndpointParam[]): string[] | undefined {
  if (!parameters || parameters.length === 0) return undefined;
  return parameters.map((p) => (p.required ? p.name : `${p.name}?`));
}

/**
 * Compose a fully-shaped Endpoint, auto-deriving the F2 `params` legacy field
 * from the rich `parameters` list.
 */
function ep(input: Omit<Endpoint, "params">): Endpoint {
  return {
    ...input,
    params: legacyParams(input.parameters),
  };
}

// ─────────────────────────────────────────────────────────
// Surface inventory
// ─────────────────────────────────────────────────────────

const SURFACES: Surface[] = [
  // ── Agent / MCP discovery ──────────────────────────────
  {
    name: "agent-card-wellknown",
    url: `${SITE}/.well-known/agent-card.json`,
    format: "application/json",
    category: "agent",
    description: "A2A AgentCard — canonical agent descriptor with skills, transports, capabilities",
    endpoints: [
      ep({
        method: "GET",
        path: "/.well-known/agent-card.json",
        operationId: "getAgentCard",
        summary: "A2A AgentCard",
        description:
          "Fetch the canonical A2A AgentCard payload — agent identity, skills, supported transports, signing keys.",
        responses: [RESP_200_JSON],
        contentType: "application/json",
        security: ["none"],
        since: "2026-04-22",
        tags: ["agent", "a2a"],
      }),
    ],
  },
  {
    name: "agent-card-legacy",
    url: `${SITE}/.well-known/agent.json`,
    format: "application/json",
    category: "agent",
    description: "Legacy alias for agent-card.json (some early A2A adopters probe this name)",
    endpoints: [
      ep({
        method: "GET",
        path: "/.well-known/agent.json",
        operationId: "getAgentCardLegacy",
        summary: "AgentCard (legacy filename)",
        description:
          "Same body as /.well-known/agent-card.json. Kept because some early A2A clients probe this filename.",
        responses: [RESP_200_JSON],
        contentType: "application/json",
        security: ["none"],
        since: "2026-05-06",
        tags: ["agent", "a2a", "alias"],
      }),
    ],
  },
  {
    name: "agents-wellknown",
    url: `${SITE}/.well-known/agents.json`,
    format: "application/json",
    category: "agent",
    description: "Toolkit-style agent surface index (mirrors /agents.json)",
    endpoints: [
      ep({
        method: "GET",
        path: "/.well-known/agents.json",
        operationId: "getAgentsCatalogWellknown",
        summary: "Agent toolkit catalog",
        description: "List of agent toolkits and their advertised capabilities.",
        responses: [RESP_200_JSON],
        contentType: "application/json",
        security: ["none"],
        since: "2026-05-04",
        tags: ["agent"],
      }),
    ],
  },
  {
    name: "mcp-discovery",
    url: `${SITE}/.well-known/mcp.json`,
    format: "application/json",
    category: "agent",
    description: "Model Context Protocol discovery manifest — install snippet, tools list",
    endpoints: [
      ep({
        method: "GET",
        path: "/.well-known/mcp.json",
        operationId: "getMcpDiscovery",
        summary: "MCP discovery manifest",
        description:
          "MCP server discovery manifest — protocolVersion, transports, tool list, install snippets for stdio and streamable-http.",
        responses: [RESP_200_JSON],
        contentType: "application/json",
        security: ["none"],
        since: "2026-05-04",
        tags: ["agent", "mcp"],
      }),
    ],
  },
  {
    name: "agents-root",
    url: `${SITE}/agents.json`,
    format: "application/json",
    category: "agent",
    description: "Root agent toolkit catalog — same body as well-known mirror",
    endpoints: [
      ep({
        method: "GET",
        path: "/agents.json",
        operationId: "getAgentsCatalog",
        summary: "Agent toolkit catalog (root alias)",
        description: "Same body as /.well-known/agents.json.",
        responses: [RESP_200_JSON],
        contentType: "application/json",
        security: ["none"],
        since: "2026-05-04",
        tags: ["agent", "alias"],
      }),
    ],
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
    endpoints: [
      ep({
        method: "GET",
        path: "/agent-card.json",
        operationId: "getAgentCardRoot",
        summary: "AgentCard (root alias)",
        description: "Same body as /.well-known/agent-card.json.",
        responses: [RESP_200_JSON],
        contentType: "application/json",
        security: ["none"],
        since: "2026-04-22",
        tags: ["agent", "alias"],
      }),
    ],
  },
  {
    name: "api-catalog-linkset",
    url: `${SITE}/.well-known/api-catalog`,
    format: "application/linkset+json",
    category: "agent",
    description: "RFC 9727 Linkset of every agent surface",
    endpoints: [
      ep({
        method: "GET",
        path: "/.well-known/api-catalog",
        operationId: "getApiCatalogLinkset",
        summary: "RFC 9727 Linkset",
        description:
          "RFC 9727 Linkset linking every agent + API surface. Useful for clients that prefer Link relations over a custom JSON envelope.",
        responses: [
          {
            status: 200,
            description: "RFC 9727 Linkset payload.",
            contentType: "application/linkset+json",
          },
        ],
        contentType: "application/linkset+json",
        security: ["none"],
        since: "2026-05-05",
        tags: ["agent", "discovery", "rfc9727"],
      }),
    ],
  },
  {
    name: "mcp-rpc",
    url: `${SITE}/api/mcp/rpc`,
    format: "application/json",
    category: "agent",
    description:
      "Streamable MCP JSON-RPC 2.0 endpoint — 7 free tools + 1 paid (x402 €0.19 USDC)",
    endpoints: [
      ep({
        method: "POST",
        path: "/api/mcp/rpc",
        operationId: "mcpInitialize",
        summary: "JSON-RPC initialize",
        description:
          "MCP handshake. Body: { jsonrpc: '2.0', id, method: 'initialize', params: { protocolVersion, capabilities, clientInfo } }.",
        parameters: [
          {
            name: "method",
            in: "body",
            type: "string",
            required: true,
            enum: ["initialize"],
            description: "JSON-RPC method name; must be `initialize` for this signature.",
            example: "initialize",
          },
          {
            name: "protocolVersion",
            in: "body",
            type: "string",
            required: true,
            description: "MCP protocol revision the client is offering.",
            example: "2025-06-18",
          },
        ],
        responses: [RESP_200_JSON],
        contentType: "application/json",
        security: ["none"],
        since: "2026-04-25",
        tags: ["mcp"],
      }),
      ep({
        method: "POST",
        path: "/api/mcp/rpc",
        operationId: "mcpToolsList",
        summary: "JSON-RPC tools/list",
        description: "Enumerate every tool the server exposes, with input schemas.",
        parameters: [
          {
            name: "method",
            in: "body",
            type: "string",
            required: true,
            enum: ["tools/list"],
            example: "tools/list",
          },
        ],
        responses: [RESP_200_JSON],
        contentType: "application/json",
        security: ["none"],
        since: "2026-04-25",
        tags: ["mcp"],
      }),
      ep({
        method: "POST",
        path: "/api/mcp/rpc",
        operationId: "mcpCallGetTrendingStartups",
        summary: "JSON-RPC tools/call get_trending_startups",
        description: "Read-only. Returns the current trending panel.",
        parameters: [
          {
            name: "name",
            in: "body",
            type: "string",
            required: true,
            enum: ["get_trending_startups"],
            example: "get_trending_startups",
          },
          { ...PARAM_SECTOR, in: "body" },
          { ...PARAM_LIMIT, in: "body" },
        ],
        responses: [RESP_200_JSON],
        contentType: "application/json",
        security: ["none"],
        xMcpTool: "get_trending_startups",
        since: "2026-04-25",
        tags: ["mcp", "read-only"],
      }),
      ep({
        method: "POST",
        path: "/api/mcp/rpc",
        operationId: "mcpCallSearchStartupsBySector",
        summary: "JSON-RPC tools/call search_startups_by_sector",
        description: "Filter the panel to a single tracked sector.",
        parameters: [
          {
            name: "name",
            in: "body",
            type: "string",
            required: true,
            enum: ["search_startups_by_sector"],
            example: "search_startups_by_sector",
          },
          { ...PARAM_SECTOR, in: "body", required: true },
          { ...PARAM_LIMIT, in: "body" },
        ],
        responses: [RESP_200_JSON],
        contentType: "application/json",
        security: ["none"],
        xMcpTool: "search_startups_by_sector",
        since: "2026-04-25",
        tags: ["mcp", "read-only"],
      }),
      ep({
        method: "POST",
        path: "/api/mcp/rpc",
        operationId: "mcpCallGetStartupSignal",
        summary: "JSON-RPC tools/call get_startup_signal",
        description: "Single-startup signal lookup by slug.",
        parameters: [
          {
            name: "name",
            in: "body",
            type: "string",
            required: true,
            enum: ["get_startup_signal"],
            example: "get_startup_signal",
          },
          { ...PARAM_SLUG_PATH, in: "body", description: "Startup slug (e.g. huggingface)." },
        ],
        responses: [RESP_200_JSON, RESP_404_SLUG],
        contentType: "application/json",
        security: ["none"],
        xMcpTool: "get_startup_signal",
        since: "2026-04-25",
        tags: ["mcp", "read-only"],
      }),
      ep({
        method: "POST",
        path: "/api/mcp/rpc",
        operationId: "mcpCallGetSignalsSummary",
        summary: "JSON-RPC tools/call get_signals_summary",
        description: "High-level signal stats — count, top sectors, last refresh.",
        parameters: [
          {
            name: "name",
            in: "body",
            type: "string",
            required: true,
            enum: ["get_signals_summary"],
            example: "get_signals_summary",
          },
        ],
        responses: [RESP_200_JSON],
        contentType: "application/json",
        security: ["none"],
        xMcpTool: "get_signals_summary",
        since: "2026-04-25",
        tags: ["mcp", "read-only"],
      }),
      ep({
        method: "POST",
        path: "/api/mcp/rpc",
        operationId: "mcpCallGetScoutReceipts",
        summary: "JSON-RPC tools/call get_scout_receipts",
        description: "Compute a Scout Score for a public GitHub username.",
        parameters: [
          {
            name: "name",
            in: "body",
            type: "string",
            required: true,
            enum: ["get_scout_receipts"],
            example: "get_scout_receipts",
          },
          {
            name: "github_username",
            in: "body",
            type: "string",
            required: true,
            description: "Public GitHub username (case-insensitive).",
            example: "torvalds",
          },
        ],
        responses: [RESP_200_JSON, RESP_404_SLUG],
        contentType: "application/json",
        security: ["none"],
        xMcpTool: "get_scout_receipts",
        since: "2026-04-25",
        tags: ["mcp", "read-only"],
      }),
      ep({
        method: "POST",
        path: "/api/mcp/rpc",
        operationId: "mcpCallGetMethodology",
        summary: "JSON-RPC tools/call get_methodology",
        description: "Return the 6-step Scout Score methodology as a HowTo payload.",
        parameters: [
          {
            name: "name",
            in: "body",
            type: "string",
            required: true,
            enum: ["get_methodology"],
            example: "get_methodology",
          },
        ],
        responses: [RESP_200_JSON],
        contentType: "application/json",
        security: ["none"],
        xMcpTool: "get_methodology",
        since: "2026-04-25",
        tags: ["mcp", "read-only"],
      }),
      ep({
        method: "POST",
        path: "/api/mcp/rpc",
        operationId: "mcpCallGetDeepSignal",
        summary: "JSON-RPC tools/call get_deep_signal (paid, x402)",
        description:
          "Premium per-startup deep signal. Charged via x402 challenge — first call returns HTTP 402 with payTo wallet, asset, and amount.",
        parameters: [
          {
            name: "name",
            in: "body",
            type: "string",
            required: true,
            enum: ["get_deep_signal"],
            example: "get_deep_signal",
          },
          { ...PARAM_SLUG_PATH, in: "body", description: "Startup slug." },
        ],
        responses: [
          RESP_200_JSON,
          {
            status: 402,
            description:
              "x402 payment challenge — body contains payTo, asset, amount, chain. Resubmit with X-PAYMENT header per x402 spec.",
            contentType: "application/json",
          },
        ],
        contentType: "application/json",
        security: ["x402"],
        xPayment: X402_PAYMENT,
        xMcpTool: "get_deep_signal",
        since: "2026-05-06",
        tags: ["mcp", "paid"],
      }),
      ep({
        method: "POST",
        path: "/api/mcp/rpc",
        operationId: "mcpCallShareResult",
        summary: "JSON-RPC tools/call share_result",
        description:
          "Side-effect: post a curated card to the user's chosen surface (Bluesky, Mastodon, Farcaster, etc.). Requires a short-lived approval token issued from the user-facing share page.",
        parameters: [
          {
            name: "name",
            in: "body",
            type: "string",
            required: true,
            enum: ["share_result"],
            example: "share_result",
          },
          {
            name: "payload",
            in: "body",
            type: "object",
            required: true,
            description: "Card payload — title, summary, citation URL, optional tags.",
          },
          {
            name: "userApprovalToken",
            in: "body",
            type: "string",
            required: true,
            description: "Short-lived token issued from the on-site share approval page.",
            example: "shr_2X3aB...",
          },
        ],
        responses: [
          RESP_200_JSON,
          {
            status: 401,
            description: "Missing or expired userApprovalToken.",
            contentType: "application/json",
          },
        ],
        contentType: "application/json",
        security: ["user-approval"],
        xMcpTool: "share_result",
        since: "2026-05-05",
        tags: ["mcp", "mutating"],
      }),
    ],
  },
  // ── API discovery ──────────────────────────────────────
  {
    name: "openapi-api",
    url: `${SITE}/api/openapi.json`,
    format: "application/json",
    category: "api",
    description: "OpenAPI 3.1 spec — full API contract with paths, schemas, examples",
    endpoints: [
      ep({
        method: "GET",
        path: "/api/openapi.json",
        operationId: "getOpenApi",
        summary: "OpenAPI 3.1 contract",
        description:
          "Full OpenAPI 3.1 contract for every public REST endpoint, including x-mcp-tool extensions that map operations to their MCP analogs.",
        responses: [RESP_200_JSON],
        contentType: "application/json",
        security: ["none"],
        since: "2026-04-22",
        tags: ["openapi", "spec"],
      }),
    ],
  },
  {
    name: "openapi-wellknown",
    url: `${SITE}/.well-known/openapi.json`,
    format: "application/json",
    category: "api",
    description: "Well-known alias for /api/openapi.json",
    endpoints: [
      ep({
        method: "GET",
        path: "/.well-known/openapi.json",
        operationId: "getOpenApiWellknown",
        summary: "OpenAPI 3.1 (well-known alias)",
        description: "Same body as /api/openapi.json.",
        responses: [RESP_200_JSON],
        contentType: "application/json",
        security: ["none"],
        since: "2026-05-05",
        tags: ["openapi", "alias"],
      }),
    ],
  },
  {
    name: "openapi-root",
    url: `${SITE}/openapi.json`,
    format: "application/json",
    category: "api",
    description: "Root alias for /api/openapi.json",
    endpoints: [
      ep({
        method: "GET",
        path: "/openapi.json",
        operationId: "getOpenApiRoot",
        summary: "OpenAPI 3.1 (root alias)",
        description: "Same body as /api/openapi.json.",
        responses: [RESP_200_JSON],
        contentType: "application/json",
        security: ["none"],
        since: "2026-05-05",
        tags: ["openapi", "alias"],
      }),
    ],
  },
  {
    name: "openapi-v1",
    url: `${SITE}/api/v1/openapi.json`,
    format: "application/json",
    category: "api",
    description: "Versioned alias for /api/openapi.json (v1-pinned consumers)",
    endpoints: [
      ep({
        method: "GET",
        path: "/api/v1/openapi.json",
        operationId: "getOpenApiV1",
        summary: "OpenAPI 3.1 (v1-pinned)",
        description: "v1-pinned OpenAPI 3.1 contract for consumers that want a stable API surface.",
        responses: [RESP_200_JSON],
        contentType: "application/json",
        security: ["none"],
        since: "2026-05-05",
        tags: ["openapi", "v1"],
      }),
    ],
  },
  {
    name: "pricing-v1",
    url: `${SITE}/api/v1/pricing.json`,
    format: "application/json",
    category: "api",
    description: "Machine-readable pricing — six tiers, founding-member rates, guarantees",
    endpoints: [
      ep({
        method: "GET",
        path: "/api/v1/pricing.json",
        operationId: "getPricing",
        summary: "Pricing tiers",
        description:
          "Pricing tiers with priceCurrency, availability, validUntil. Schema.org Product + AggregateOffer-compatible payload.",
        responses: [RESP_200_JSON],
        contentType: "application/json",
        security: ["none"],
        since: "2026-05-04",
        tags: ["pricing", "v1"],
      }),
    ],
  },
  {
    name: "glossary-v1",
    url: `${SITE}/api/v1/glossary.json`,
    format: "application/ld+json",
    category: "api",
    description: "Schema.org DefinedTermSet of 18 controlled-vocabulary terms",
    endpoints: [
      ep({
        method: "GET",
        path: "/api/v1/glossary.json",
        operationId: "getGlossary",
        summary: "Glossary (DefinedTermSet)",
        description: "Full DefinedTermSet (Schema.org JSON-LD) — 18 controlled-vocabulary terms.",
        responses: [RESP_200_LDJSON],
        contentType: "application/ld+json",
        security: ["none"],
        since: "2026-05-05",
        tags: ["v1", "glossary"],
      }),
    ],
  },
  {
    name: "faq-v1",
    url: `${SITE}/api/v1/faq.json`,
    format: "application/ld+json",
    category: "api",
    description: "Schema.org FAQPage with 100+ Q&A entries",
    endpoints: [
      ep({
        method: "GET",
        path: "/api/v1/faq.json",
        operationId: "getFaq",
        summary: "FAQ (FAQPage)",
        description: "Full FAQPage (Schema.org JSON-LD) — every Q&A pair anchored to a stable URL.",
        responses: [RESP_200_LDJSON],
        contentType: "application/ld+json",
        security: ["none"],
        since: "2026-05-05",
        tags: ["v1", "faq", "aeo"],
      }),
    ],
  },
  {
    name: "methodology-v1",
    url: `${SITE}/api/v1/methodology.json`,
    format: "application/ld+json",
    category: "api",
    description: "Schema.org HowTo of the 6-step signal computation methodology",
    endpoints: [
      ep({
        method: "GET",
        path: "/api/v1/methodology.json",
        operationId: "getMethodology",
        summary: "Methodology (HowTo)",
        description: "Six-step HowTo describing how Scout Score is computed.",
        responses: [RESP_200_LDJSON],
        contentType: "application/ld+json",
        security: ["none"],
        xMcpTool: "get_methodology",
        since: "2026-05-05",
        tags: ["v1", "methodology"],
      }),
    ],
  },
  {
    name: "signals-v1",
    url: `${SITE}/api/v1/signals.json`,
    format: "application/json",
    category: "api",
    description: "Versioned alias for /api/signals.json (full signal panel)",
    endpoints: [
      ep({
        method: "GET",
        path: "/api/v1/signals.json",
        operationId: "getSignalsV1",
        summary: "Full signal panel",
        description:
          "Full ranked signal panel — refreshes weekly Mondays ~09:00 UTC. Same body as /api/signals.json with v1 stability guarantee.",
        parameters: [PARAM_SECTOR, PARAM_LIMIT, PARAM_OFFSET],
        responses: [RESP_200_JSON],
        contentType: "application/json",
        security: ["none"],
        cacheControl: "public, max-age=900, s-maxage=3600",
        since: "2026-05-04",
        tags: ["v1", "signals"],
      }),
    ],
  },
  {
    name: "agents-v1",
    url: `${SITE}/api/v1/agents.json`,
    format: "application/json",
    category: "api",
    description: "Versioned alias for /api/agents.json",
    endpoints: [
      ep({
        method: "GET",
        path: "/api/v1/agents.json",
        operationId: "getAgentsV1",
        summary: "Agent toolkit catalog (v1)",
        description: "Same body as /agents.json (versioned).",
        responses: [RESP_200_JSON],
        contentType: "application/json",
        security: ["none"],
        since: "2026-05-05",
        tags: ["v1", "agent"],
      }),
    ],
  },
  {
    name: "answers-v1",
    url: `${SITE}/api/v1/answers.json`,
    format: "application/json",
    category: "api",
    description: "Versioned alias for /api/answers.json (citation-ready answer corpus)",
    endpoints: [
      ep({
        method: "GET",
        path: "/api/v1/answers.json",
        operationId: "getAnswersV1",
        summary: "Citation-ready answer corpus",
        description:
          "Citation-ready answer corpus, anchored back to /answers/{slug}. TL;DR + 3 supporting facts per entry.",
        responses: [RESP_200_JSON],
        contentType: "application/json",
        security: ["none"],
        since: "2026-05-05",
        tags: ["v1", "answers", "aeo"],
      }),
    ],
  },
  {
    name: "changelog-v1",
    url: `${SITE}/api/v1/changelog.json`,
    format: "application/json",
    category: "api",
    description: "Versioned alias for /api/changelog.json",
    endpoints: [
      ep({
        method: "GET",
        path: "/api/v1/changelog.json",
        operationId: "getChangelogV1",
        summary: "Granular release notes",
        description: "Granular release notes per surface, ordered newest-first.",
        responses: [RESP_200_JSON],
        contentType: "application/json",
        security: ["none"],
        since: "2026-05-05",
        tags: ["v1", "changelog"],
      }),
    ],
  },
  {
    name: "dataset-jsonl-v1",
    url: `${SITE}/api/v1/dataset.jsonl`,
    format: "application/x-ndjson",
    category: "api",
    description: "Versioned alias for /api/dataset.jsonl (HF Datasets compatible)",
    endpoints: [
      ep({
        method: "GET",
        path: "/api/v1/dataset.jsonl",
        operationId: "getDatasetJsonlV1",
        summary: "NDJSON dataset dump",
        description:
          "NDJSON dump of the full signal panel; HF Datasets ready. One JSON object per line.",
        responses: [
          {
            status: 200,
            description: "NDJSON stream of signal records.",
            contentType: "application/x-ndjson",
          },
        ],
        contentType: "application/x-ndjson",
        security: ["none"],
        since: "2026-05-05",
        tags: ["v1", "dataset"],
      }),
    ],
  },
  {
    name: "health",
    url: `${SITE}/api/health.json`,
    format: "application/json",
    category: "api",
    description: "Service health probe — uptime, last data refresh, surface readiness",
    endpoints: [
      ep({
        method: "GET",
        path: "/api/health.json",
        operationId: "getHealth",
        summary: "Liveness + freshness probe",
        description:
          "Liveness + freshness probe. Cheap; safe for monitoring agents to poll on a 30-60s cadence.",
        responses: [RESP_200_JSON],
        contentType: "application/json",
        security: ["none"],
        cacheControl: "no-store",
        since: "2026-05-05",
        tags: ["ops"],
      }),
    ],
  },
  {
    name: "catalog",
    url: `${SITE}/api/catalog.json`,
    format: "application/json",
    category: "api",
    description: "Browseable catalog of every public surface",
    endpoints: [
      ep({
        method: "GET",
        path: "/api/catalog.json",
        operationId: "getCatalog",
        summary: "Surface catalog",
        description:
          "Browseable catalog of every public surface. Smaller and friendlier to render than /.well-known/discover.json.",
        responses: [RESP_200_JSON],
        contentType: "application/json",
        security: ["none"],
        since: "2026-05-05",
        tags: ["catalog"],
      }),
    ],
  },
  {
    name: "schema-payload",
    url: `${SITE}/api/schema.json`,
    format: "application/schema+json",
    category: "schema",
    description: "JSON Schema for the signals payload",
    endpoints: [
      ep({
        method: "GET",
        path: "/api/schema.json",
        operationId: "getSchema",
        summary: "JSON Schema for signals",
        description: "JSON Schema describing /api/v1/signals.json items.",
        responses: [
          {
            status: 200,
            description: "JSON Schema document.",
            contentType: "application/schema+json",
          },
        ],
        contentType: "application/schema+json",
        security: ["none"],
        since: "2026-05-05",
        tags: ["schema"],
      }),
    ],
  },
  {
    name: "answer-live",
    url: `${SITE}/api/answer`,
    format: "application/json",
    category: "api",
    description: "Live citation-ready answer endpoint with usage envelope",
    endpoints: [
      ep({
        method: "GET",
        path: "/api/answer",
        operationId: "getAnswer",
        summary: "Citation-ready answer",
        description:
          "Live citation-ready answer; returns 400 with a `usage` envelope when q is empty so a fresh agent can self-correct on first probe.",
        parameters: [PARAM_Q],
        responses: [RESP_200_JSON, RESP_400_USAGE],
        contentType: "application/json",
        security: ["none"],
        since: "2026-05-05",
        tags: ["aeo", "answer"],
      }),
    ],
  },
  {
    name: "ask-live",
    url: `${SITE}/api/ask`,
    format: "application/json",
    category: "api",
    description: "Live ask-anything endpoint over the answer corpus",
    endpoints: [
      ep({
        method: "GET",
        path: "/api/ask",
        operationId: "askQuestion",
        summary: "Free-form ask",
        description:
          "Free-form ask over the answer corpus; returns 400 with a `usage` envelope when q is empty.",
        parameters: [PARAM_Q],
        responses: [RESP_200_JSON, RESP_400_USAGE],
        contentType: "application/json",
        security: ["none"],
        since: "2026-05-05",
        tags: ["aeo", "ask"],
      }),
    ],
  },
  {
    name: "cite-formatter",
    url: `${SITE}/api/cite/{format}/{slug}`,
    format: "text/plain",
    category: "api",
    description:
      "Per-finding citation formatter — emits BibTeX, APA, or MLA for any /research, /answers, or /receipts slug",
    endpoints: [
      ep({
        method: "GET",
        path: "/api/cite/bibtex/{slug}",
        operationId: "getCitationBibtex",
        summary: "BibTeX citation",
        description: "BibTeX citation for the named slug.",
        parameters: [{ ...PARAM_CITE_FORMAT, enum: ["bibtex"], example: "bibtex" }, PARAM_SLUG_PATH],
        responses: [
          {
            status: 200,
            description: "BibTeX citation block.",
            contentType: "text/x-bibtex",
            example: "@misc{scout-score,...}",
          },
          RESP_404_SLUG,
        ],
        contentType: "text/x-bibtex",
        security: ["none"],
        since: "2026-05-06",
        tags: ["citation", "bibtex"],
      }),
      ep({
        method: "GET",
        path: "/api/cite/apa/{slug}",
        operationId: "getCitationApa",
        summary: "APA citation",
        description: "APA-style citation for the named slug.",
        parameters: [{ ...PARAM_CITE_FORMAT, enum: ["apa"], example: "apa" }, PARAM_SLUG_PATH],
        responses: [
          { status: 200, description: "APA-formatted citation string.", contentType: "text/plain" },
          RESP_404_SLUG,
        ],
        contentType: "text/plain",
        security: ["none"],
        since: "2026-05-06",
        tags: ["citation", "apa"],
      }),
      ep({
        method: "GET",
        path: "/api/cite/mla/{slug}",
        operationId: "getCitationMla",
        summary: "MLA citation",
        description: "MLA-style citation for the named slug.",
        parameters: [{ ...PARAM_CITE_FORMAT, enum: ["mla"], example: "mla" }, PARAM_SLUG_PATH],
        responses: [
          { status: 200, description: "MLA-formatted citation string.", contentType: "text/plain" },
          RESP_404_SLUG,
        ],
        contentType: "text/plain",
        security: ["none"],
        since: "2026-05-06",
        tags: ["citation", "mla"],
      }),
    ],
  },
  // ── Retrieval / LLM ────────────────────────────────────
  { name: "llms-index", url: `${SITE}/llms.txt`, format: "text/plain", category: "retrieval", description: "llms.txt — agent index of every canonical page (172KB)" },
  { name: "llms-index-wellknown", url: `${SITE}/.well-known/llms.txt`, format: "text/plain", category: "retrieval", description: "Well-known alias for /llms.txt" },
  { name: "llms-full", url: `${SITE}/llms-full.txt`, format: "text/plain", category: "retrieval", description: "llms-full.txt — extended canonical content for retrieval pipelines" },
  { name: "llms-full-wellknown", url: `${SITE}/.well-known/llms-full.txt`, format: "text/plain", category: "retrieval", description: "Well-known alias for /llms-full.txt" },
  { name: "qa-jsonl", url: `${SITE}/qa.jsonl`, format: "application/x-ndjson", category: "retrieval", description: "Q&A NDJSON corpus — citation-ready, RAG-friendly" },
  { name: "qa-jsonl-wellknown", url: `${SITE}/.well-known/qa.jsonl`, format: "application/x-ndjson", category: "retrieval", description: "Well-known alias for /qa.jsonl" },
  { name: "markdown-mirror", url: `${SITE}/md/`, format: "text/markdown", category: "retrieval", description: "Markdown mirror — every page available at /md/{path}" },
  // ── Community / movement ───────────────────────────────
  // Brunson Expert Secrets §1 Ch 4 (Mass Movement Vehicle). The Charter
  // Cohort is the member-side ledger that pairs with /wins (startup-side).
  // Pseudonymous handles welcome under the same anonymity rule as the
  // founder. The JSON endpoint mirrors /members hub for agents, the human
  // web UI surfaces the same data with the seat-claim CTA.
  { name: "members-cohort", url: `${SITE}/api/v1/members.json`, format: "application/json", category: "community", description: "Charter Cohort 2026 — member roster + leaderboard + aggregate stats + 60d/90d grading rules" },
  { name: "members-hub", url: `${SITE}/members`, format: "text/html", category: "community", description: "Charter Cohort 2026 hub — 25-seat counter, archetype templates, claim-a-seat CTA" },
  { name: "members-leaderboard", url: `${SITE}/members/leaderboard`, format: "text/html", category: "community", description: "Public ranked roster of Charter Cohort members by 60d/90d hits" },
  { name: "members-apply", url: `${SITE}/members/join`, format: "text/html", category: "community", description: "Charter seat application form — pseudonymous handles welcome, 48h written review" },
  // ── Policy / governance ────────────────────────────────
  { name: "ai-policy", url: `${SITE}/.well-known/ai-policy.json`, format: "application/json", category: "policy", description: "Machine-readable AI access policy — per-agent allow/disallow + use modes" },
  { name: "ai-policy-shortname", url: `${SITE}/.well-known/ai.json`, format: "application/json", category: "policy", description: "Short-name alias for ai-policy.json" },
  { name: "ai-policy-text", url: `${SITE}/ai.txt`, format: "text/plain", category: "policy", description: "Human-readable AI access policy (analog to robots.txt)" },
  { name: "ai-policy-text-wellknown", url: `${SITE}/.well-known/ai.txt`, format: "text/plain", category: "policy", description: "Well-known alias for /ai.txt" },
  { name: "security-txt", url: `${SITE}/.well-known/security.txt`, format: "text/plain", category: "policy", description: "RFC 9116 security disclosure contact" },
  { name: "security-policy", url: `${SITE}/.well-known/security-policy.json`, format: "application/json", category: "policy", description: "Machine-readable security disclosure policy" },
  { name: "security-txt-root", url: `${SITE}/security.txt`, format: "text/plain", category: "policy", description: "Root alias for /.well-known/security.txt" },
  { name: "robots", url: `${SITE}/robots.txt`, format: "text/plain", category: "policy", description: "Crawler access rules" },
  { name: "tdm-reservation", url: `${SITE}/.well-known/tdm-reservation.json`, format: "application/json", category: "policy", description: "W3C TDM Reservation Protocol — machine-readable opt-in for text-and-data-mining (EU DSA / Copyright Directive Article 4)" },
  { name: "ai-content-license", url: `${SITE}/.well-known/ai-content-license.json`, format: "application/json", category: "policy", description: "Machine-readable AI training/inference/citation license — bridges CC BY 4.0 with per-use-mode permissions and exclusions" },
  { name: "gpc", url: `${SITE}/.well-known/gpc.json`, format: "application/json", category: "policy", description: "Global Privacy Control descriptor — publisher honors the Sec-GPC: 1 signal" },
  // ── Sitemaps ──────────────────────────────────────────
  { name: "sitemap-index", url: `${SITE}/sitemap.xml`, format: "application/xml", category: "sitemap", description: "Root sitemapindex — points to 5 sub-sitemaps + news + i18n + images + videos" },
  { name: "sitemap-wellknown", url: `${SITE}/.well-known/sitemap.xml`, format: "application/xml", category: "sitemap", description: "Well-known alias for /sitemap.xml" },
  { name: "sitemap-text", url: `${SITE}/sitemap.txt`, format: "text/plain", category: "sitemap", description: "Plain-text sitemap (one URL per line)" },
  { name: "sitemap-i18n", url: `${SITE}/sitemap-i18n.xml`, format: "application/xml", category: "sitemap", description: "i18n sitemap with hreflang annotations across 12 locales" },
  { name: "sitemap-images", url: `${SITE}/sitemap-images.xml`, format: "application/xml", category: "sitemap", description: "Image sitemap with captions" },
  { name: "sitemap-videos", url: `${SITE}/sitemap-videos.xml`, format: "application/xml", category: "sitemap", description: "Google Video sitemap — every VideoObject (YouTube + self-hosted) with thumbnail_loc, player_loc, duration, chapters, family-friendly + region whitelist" },
  { name: "videos-catalog", url: `${SITE}/api/v1/videos.json`, format: "application/ld+json", category: "api", description: "JSON-LD video catalog — every video with Clip[] chapters, transcripts, SeekToAction targets. Mirrors what /watch/[slug] HTML pages embed; agent-friendly shape." },
  { name: "videos-catalog-stripped", url: `${SITE}/api/v1/videos`, format: "application/ld+json", category: "api", description: "Extension-stripped alias for /api/v1/videos.json (matches F37 pattern)." },
  { name: "video-transcripts", url: `${SITE}/api/v1/transcripts/{slug}`, format: "text/vtt", category: "api", description: "WebVTT transcript per video, slug-keyed. Content-negotiates to text/plain when Accept asks. Cues align to chapter timing from content/videos.ts." },
  { name: "watch-pages", url: `${SITE}/watch`, format: "text/html", category: "human", description: "Human watch hub — links to every /watch/[slug] page with chapters + transcript. The silent-canvas /watch demo plus three synthetic-voice videos on YouTube and the self-hosted MCP screencast." },
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
  {
    name: "webfinger",
    url: `${SITE}/.well-known/webfinger`,
    format: "application/jrd+json",
    category: "identity",
    description: "WebFinger account discovery (RFC 7033)",
    endpoints: [
      ep({
        method: "GET",
        path: "/.well-known/webfinger",
        operationId: "getWebfinger",
        summary: "WebFinger account discovery",
        description: "RFC 7033 account discovery via the `resource=` query parameter.",
        parameters: [
          {
            name: "resource",
            in: "query",
            type: "string",
            required: true,
            description: "Account URI to resolve, in `acct:user@host` form.",
            example: "acct:gitdealflow@signals.gitdealflow.com",
            format: "uri",
          },
        ],
        responses: [
          {
            status: 200,
            description: "JRD payload describing the resource.",
            contentType: "application/jrd+json",
          },
          {
            status: 404,
            description: "Resource not found.",
            contentType: "application/json",
          },
        ],
        contentType: "application/jrd+json",
        security: ["none"],
        since: "2026-05-05",
        tags: ["identity", "rfc7033"],
      }),
    ],
  },
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
  // ── F38 Trust Center surfaces (2026-05-08) ─────────────
  // Net-new TrustSEO push: enterprise-procurement, AI-agent compliance, and
  // GDPR controllers all probe this set first. Each pair is HTML page +
  // machine-readable mirror under /.well-known/.
  { name: "trust-center", url: `${SITE}/trust`, format: "text/html", category: "policy", description: "Trust Center — single page linking every privacy/security/compliance/transparency surface" },
  { name: "privacy-policy", url: `${SITE}/privacy`, format: "text/html", category: "policy", description: "Privacy Policy — what we collect, retention, GDPR/CCPA rights, subprocessor pointer" },
  { name: "terms-of-service", url: `${SITE}/terms`, format: "text/html", category: "policy", description: "Terms of Service — license, acceptable use, paid-tier billing, liability cap" },
  { name: "security-overview", url: `${SITE}/security`, format: "text/html", category: "policy", description: "Security Overview — TLS, email auth, vuln-disclosure entry point" },
  { name: "dpa-html", url: `${SITE}/dpa`, format: "text/html", category: "policy", description: "Data Processing Agreement (GDPR Art. 28) — counter-signed PDF on request" },
  { name: "dpa-wellknown", url: `${SITE}/.well-known/dpa.json`, format: "application/json", category: "policy", description: "DPA pointer + SCCs metadata + processing scope (machine-readable)" },
  { name: "transparency-html", url: `${SITE}/transparency`, format: "text/html", category: "policy", description: "Annual Transparency Report — gov data requests, takedowns, breaches; warrant canary" },
  { name: "transparency-wellknown", url: `${SITE}/.well-known/transparency.json`, format: "application/json", category: "policy", description: "Transparency report machine-readable — yearly figures + standing policies" },
  { name: "disclosure-html", url: `${SITE}/disclosure`, format: "text/html", category: "policy", description: "Coordinated Vulnerability Disclosure — disclose.io core terms, scope, SLAs" },
  { name: "disclosure-wellknown", url: `${SITE}/.well-known/disclosure.json`, format: "application/json", category: "policy", description: "Disclosure policy machine-readable — disclose.io fields + scope + SLAs" },
  { name: "subprocessors-html", url: `${SITE}/subprocessors`, format: "text/html", category: "policy", description: "Subprocessor list — Stripe, Vercel, Resend, Hetzner/PocketBase, PostHog, GitHub, Cloudflare, Anthropic, Coinbase" },
  { name: "subprocessors-wellknown", url: `${SITE}/.well-known/subprocessors.json`, format: "application/json", category: "policy", description: "Subprocessor registry machine-readable — roles, regions, certifications, DPAs" },
  { name: "mta-sts-policy", url: `${SITE}/.well-known/mta-sts.txt`, format: "text/plain", category: "policy", description: "RFC 8461 MTA-STS — inbound mail must use TLS to advertised MX hosts" },
  { name: "dnt-policy", url: `${SITE}/.well-known/dnt-policy.txt`, format: "text/plain", category: "policy", description: "EFF Do-Not-Track Policy v1.0 compliance statement" },
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

    const totalParameters = SURFACES.reduce((acc, s) => {
      const eps = s.endpoints ?? [];
      return (
        acc +
        eps.reduce((inner, e) => inner + (e.parameters?.length ?? 0), 0)
      );
    }, 0);

    const byMethod = SURFACES.reduce<Record<string, number>>((acc, s) => {
      for (const e of s.endpoints ?? []) {
        acc[e.method] = (acc[e.method] || 0) + 1;
      }
      return acc;
    }, {});

    const paidEndpoints = SURFACES.reduce((acc, s) => {
      const eps = s.endpoints ?? [];
      return acc + eps.filter((e) => e.security?.includes("x402")).length;
    }, 0);

    const body = {
      "@context": "https://schema.org",
      "@type": "DataCatalog",
      "@id": `${SITE}/.well-known/discover.json`,
      name: "VC Deal Flow Signal — Discovery Manifest",
      description:
        "Umbrella manifest of every well-known, root-level, and /api/v1/* surface this site exposes for AI agents, retrieval pipelines, and machine consumers. Each surface carries a stable `name` (kebab-slug); canonical API surfaces carry a populated `endpoints[]` array with rich method+param descriptors (operationId, parameters, responses, security, x-mcp-tool cross-references, x402 payment metadata) so a fresh agent can map operations in a single fetch instead of probing each endpoint or pulling the full OpenAPI.",
      contractVersion: CONTRACT_VERSION,
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
        totalParameters,
        paidEndpoints,
        byCategory: counts,
        byMethod,
        coverage:
          "Agent/MCP, OpenAPI, retrieval (llms.txt + qa.jsonl + markdown mirror), policy (ai-policy + ai-content-license + tdm-reservation + gpc + security), sitemaps, RSS/Atom feeds, dataset descriptors, identity (DID + WebFinger + NodeInfo), and human attribution.",
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
        "X-Discover-Contract-Version": CONTRACT_VERSION,
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
