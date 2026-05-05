const BASE_URL = "https://signals.gitdealflow.com";

export const dynamic = "force-static";
export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  const spec = {
    openapi: "3.1.0",
    info: {
      title: "VC Deal Flow Signal API",
      version: "1.1.0",
      description:
        "Public API for startup engineering acceleration data. Weekly-updated rankings of startups by GitHub commit velocity, contributor growth, and signal classification across 20 sectors. CC BY 4.0 attribution. No auth required for free endpoints; the paid Deep Signal endpoint uses a per-request credit-pack key delivered after Stripe checkout.",
      contact: { email: "signal@gitdealflow.com" },
      license: {
        name: "Free with attribution (CC BY 4.0)",
        url: "https://creativecommons.org/licenses/by/4.0/",
      },
      "x-citation":
        "VC Deal Flow Signal (signals.gitdealflow.com), Q2 2026 data. SSRN: 6606558.",
    },
    servers: [{ url: BASE_URL }],
    tags: [
      { name: "signals", description: "Startup engineering acceleration data" },
      { name: "agents", description: "Agent / MCP discovery surfaces" },
      { name: "answer", description: "Citation-ready Q&A retrieval" },
      { name: "search", description: "On-site search across all content" },
      { name: "scout", description: "Scout score receipts and prediction" },
      { name: "markets", description: "Open prediction markets" },
      { name: "citation", description: "Reference-manager exports" },
      { name: "badges", description: "SVG badges for embeds" },
      { name: "deep-signal", description: "Paid per-request enriched signals" },
      { name: "meta", description: "Pricing, changelog, dataset" },
    ],
    paths: {
      "/api/signals.json": {
        get: {
          tags: ["signals"],
          operationId: "getSignals",
          summary: "Full snapshot of startup engineering signals (free)",
          description:
            "Returns the current period's data: meta, top-20 trending, and per-sector rankings with commit velocity, contributor growth, and signal classification.",
          responses: {
            "200": {
              description: "Successful response with all signal data",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SignalsResponse" },
                },
              },
            },
          },
        },
      },
      "/api/signals.csv": {
        get: {
          tags: ["signals"],
          operationId: "getSignalsCSV",
          summary: "Same data as signals.json in CSV form",
          responses: {
            "200": {
              description: "CSV file with all startup signals",
              content: { "text/csv": { schema: { type: "string" } } },
            },
          },
        },
      },
      "/api/signal": {
        get: {
          tags: ["signals"],
          operationId: "getSingleSignal",
          summary: "Single startup signal by company name",
          parameters: [
            {
              name: "company",
              in: "query",
              required: true,
              schema: { type: "string", minLength: 1, maxLength: 80 },
              description: "Display name or GitHub org slug. Case-insensitive fuzzy match.",
            },
          ],
          responses: {
            "200": {
              description: "Best-match startup or { found: false }.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Startup" },
                },
              },
            },
            "400": { description: "Missing company parameter." },
            "429": { description: "Rate limited (30/min/IP)." },
          },
        },
      },
      "/api/answer": {
        get: {
          tags: ["answer"],
          operationId: "getAnswer",
          summary: "Single best answer to a question (citation-ready)",
          description:
            "Single-shot retrieval over the agent-query corpus + standalone FAQs. Returns the best match with confidence, supporting facts, and a canonical URL for verification. Designed for ChatGPT custom GPTs, Claude tool use, Perplexity actions.",
          parameters: [
            { name: "q", in: "query", required: true, schema: { type: "string", maxLength: 280 } },
          ],
          responses: {
            "200": {
              description: "Top answer hit",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AnswerHit" },
                },
              },
            },
          },
        },
      },
      "/api/ask": {
        get: {
          tags: ["answer"],
          operationId: "askQuestion",
          summary: "Top-N ranked candidates for a question",
          description:
            "Sibling of /api/answer. Returns ranked candidates instead of a single best match, for autocomplete UX or comparison.",
          parameters: [
            { name: "q", in: "query", required: true, schema: { type: "string", maxLength: 280 } },
            { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 20, default: 5 } },
          ],
          responses: {
            "200": {
              description: "Ranked candidates",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      query: { type: "string" },
                      hits: {
                        type: "array",
                        items: { $ref: "#/components/schemas/AnswerHit" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/llms-search": {
        get: {
          tags: ["search"],
          operationId: "llmsSearch",
          summary: "Site-wide semantic-ish search across all content",
          description:
            "Token-overlap search across startups, sectors, blog posts, comparisons, agent queries, FAQs, and research findings. Returns ranked URLs with snippets for LLM retrieval.",
          parameters: [
            { name: "q", in: "query", required: true, schema: { type: "string", maxLength: 280 } },
            { name: "type", in: "query", required: false, schema: { type: "string", enum: ["startup", "sector", "blog", "comparison", "answer", "faq", "research"] } },
            { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 10 } },
          ],
          responses: {
            "200": {
              description: "Ranked search hits",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      query: { type: "string" },
                      total: { type: "integer" },
                      hits: { type: "array", items: { $ref: "#/components/schemas/SearchHit" } },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/agents.json": {
        get: {
          tags: ["agents"],
          operationId: "getAgentsCatalog",
          summary: "MCP / A2A skill catalog",
          description: "Mirror of /.well-known/agent-card.json — full skill list with examples and tags.",
          responses: {
            "200": {
              description: "Agent skill catalog",
              content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
            },
          },
        },
      },
      "/api/agent/tools": {
        get: {
          tags: ["agents"],
          operationId: "getAgentTools",
          summary: "JSON-Schema tool definitions for direct LLM tool-use",
          description: "Tool definitions in OpenAI / Anthropic tool-use format — drop into your agent runtime as-is.",
          responses: {
            "200": {
              description: "Array of tool definitions",
              content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
            },
          },
        },
      },
      "/api/answers.json": {
        get: {
          tags: ["answer"],
          operationId: "getAnswersCorpus",
          summary: "Full Q&A corpus (agent-queries + FAQs)",
          description: "Bulk dump of every agent query and standalone FAQ for offline embedding / fine-tuning.",
          responses: {
            "200": {
              description: "Q&A corpus",
              content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
            },
          },
        },
      },
      "/api/changelog.json": {
        get: {
          tags: ["meta"],
          operationId: "getChangelog",
          summary: "Machine-readable changelog",
          responses: {
            "200": {
              description: "Changelog entries",
              content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
            },
          },
        },
      },
      "/api/dataset.jsonl": {
        get: {
          tags: ["signals"],
          operationId: "getDatasetJsonl",
          summary: "Full per-startup dataset (NDJSON)",
          description:
            "Newline-delimited JSON dump suitable for streaming into pandas, DuckDB, or a training pipeline. CC BY 4.0.",
          responses: {
            "200": {
              description: "JSONL stream",
              content: { "application/x-ndjson": { schema: { type: "string" } } },
            },
          },
        },
      },
      "/api/receipts/{username}": {
        get: {
          tags: ["scout"],
          operationId: "getScoutReceipts",
          summary: "Scout Score for a GitHub user (0-100)",
          description:
            "Backwards-looking proof of taste: how many validated unicorns did this user star *before* the funding/$1B/acquisition event?",
          parameters: [
            { name: "username", in: "path", required: true, schema: { type: "string", minLength: 1, maxLength: 39 } },
          ],
          responses: {
            "200": {
              description: "Scout score with personality + breakdown",
              content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
            },
            "400": { description: "Invalid GitHub username." },
            "429": { description: "Rate limited (10/min/IP)." },
          },
        },
      },
      "/api/markets/{slug}": {
        get: {
          tags: ["markets"],
          operationId: "getMarket",
          summary: "Open prediction market with candidates",
          description:
            "Returns the market question, resolver, source-of-truth, and ranked candidates with current signal data.",
          parameters: [
            { name: "slug", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": {
              description: "Market payload",
              content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
            },
            "404": { description: "Market not found — response includes the available list." },
          },
        },
      },
      "/api/cite/{format}/{slug}": {
        get: {
          tags: ["citation"],
          operationId: "getCitation",
          summary: "Reference-manager export for a finding or the SSRN paper",
          description:
            "Reference-manager export. Use slug=paper for the SSRN paper, slug=dataset for the dataset, or any /research/[slug] finding slug.",
          parameters: [
            { name: "format", in: "path", required: true, schema: { type: "string", enum: ["bibtex", "ris", "apa", "mla", "chicago", "wikipedia"] } },
            { name: "slug", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": {
              description: "Citation as plain text",
              content: { "text/plain": { schema: { type: "string" } } },
            },
            "404": { description: "Unknown format or slug." },
          },
        },
      },
      "/api/v1/pricing.json": {
        get: {
          tags: ["meta"],
          operationId: "getPricing",
          summary: "Versioned pricing table (machine-readable)",
          description:
            "Stable v1 pricing surface for affiliates, partner directories, and AI agents. Tier slugs are stable; price values may change.",
          responses: {
            "200": {
              description: "Pricing tiers + currency + as-of timestamp",
              content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
            },
          },
        },
      },
      "/api/badge/scout/{username}/svg": {
        get: {
          tags: ["badges"],
          operationId: "getScoutBadge",
          summary: "Scout-Score SVG badge for a GitHub user",
          parameters: [
            { name: "username", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "SVG badge", content: { "image/svg+xml": { schema: { type: "string" } } } },
          },
        },
      },
      "/api/badge/built-with/svg": {
        get: {
          tags: ["badges"],
          operationId: "getBuiltWithBadge",
          summary: "\"Built with VC Deal Flow Signal\" SVG badge",
          responses: {
            "200": { description: "SVG badge", content: { "image/svg+xml": { schema: { type: "string" } } } },
          },
        },
      },
      "/api/badge/momentum/{org}/{repo}/svg": {
        get: {
          tags: ["badges"],
          operationId: "getMomentumBadge",
          summary: "Repo momentum SVG badge",
          parameters: [
            { name: "org", in: "path", required: true, schema: { type: "string" } },
            { name: "repo", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "SVG badge", content: { "image/svg+xml": { schema: { type: "string" } } } },
          },
        },
      },
      "/api/agent/deep-signal": {
        post: {
          tags: ["deep-signal"],
          operationId: "getDeepSignal",
          summary: "Get deep enriched signal (paid, per-request)",
          description:
            "PAID per-request endpoint — €0.19/call, sold in 100-credit packs at €19. Returns enriched signal beyond /api/signal: composite score, sector percentile, plain-English thesis, comparables, multi-period history. 1 credit consumed only on a successful match; misses are FREE. Credits never expire. Buy at https://signals.gitdealflow.com/agents/credits — API key delivered by email after Stripe checkout.",
          security: [{ creditPackKey: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      minLength: 1,
                      maxLength: 100,
                      description: "Startup display name or GitHub org slug.",
                    },
                  },
                  required: ["name"],
                },
              },
            },
          },
          responses: {
            "200": {
              description:
                "Deep signal payload (or { found: false } for an untracked startup, charged: 0).",
              headers: {
                "X-Credits-Balance": {
                  description: "Remaining credit balance after this call.",
                  schema: { type: "integer", minimum: 0 },
                },
              },
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/DeepSignal" },
                },
              },
            },
            "401": { description: "Missing or invalid API key." },
            "402": { description: "Insufficient credits." },
          },
        },
      },
      "/api/agent/deep-signal/x402": {
        post: {
          tags: ["deep-signal"],
          operationId: "getDeepSignalX402",
          summary: "Get deep enriched signal (x402 — pay-per-call USDC on Base)",
          description:
            "Same payload as /api/agent/deep-signal but priced and authenticated via the x402 protocol (HTTP 402 micropayments). $0.19 USDC per successful call on Base mainnet. No signup, no API key — agents pay per request via the X-PAYMENT header (EIP-3009 transferWithAuthorization). Misses (404) are not charged. Settled by the Coinbase x402 facilitator. See https://x402.org for client implementations.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      minLength: 1,
                      maxLength: 100,
                      description: "Startup display name or GitHub org slug.",
                    },
                  },
                  required: ["name"],
                },
              },
            },
          },
          responses: {
            "200": {
              description:
                "Deep signal payload, settled. Response includes X-PAYMENT-RESPONSE header with transaction reference.",
              headers: {
                "X-PAYMENT-RESPONSE": {
                  description:
                    "Base64-encoded JSON with on-chain settlement details (txHash, network, payer).",
                  schema: { type: "string" },
                },
              },
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/DeepSignal" },
                },
              },
            },
            "402": {
              description:
                "Payment Required. Response body lists supported payment requirements (network, asset, payTo, price). Agent signs an EIP-3009 authorization and retries with X-PAYMENT header.",
            },
            "404": {
              description: "Startup not in tracked universe — no settlement performed.",
            },
            "503": {
              description: "x402 endpoint not configured (X402_PAY_TO_ADDRESS env var missing).",
            },
          },
        },
      },
      "/api/account/credits": {
        get: {
          tags: ["deep-signal"],
          operationId: "getCredits",
          summary: "Check credit balance for an API key",
          security: [{ creditPackKey: [] }],
          responses: {
            "200": {
              description: "Current credit state.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      balance: { type: "integer", minimum: 0 },
                      purchased: { type: "integer", minimum: 0 },
                      consumed: { type: "integer", minimum: 0 },
                      lastConsumedAt: { type: ["string", "null"], format: "date-time" },
                      purchaseUrl: { type: "string", format: "uri" },
                    },
                  },
                },
              },
            },
            "401": { description: "Missing or invalid API key." },
          },
        },
      },
      "/api/scout/predict": {
        get: {
          tags: ["scout"],
          operationId: "getScoutPrediction",
          summary: "Forward-looking scout prediction (experimental)",
          description: "Predicts which currently-tracked startups a given GitHub user is most likely to bet on next, using their starring history.",
          parameters: [
            { name: "username", in: "query", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": {
              description: "Ranked predictions",
              content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        SignalsResponse: {
          type: "object",
          properties: {
            meta: {
              type: "object",
              properties: {
                name: { type: "string" },
                period: {
                  type: "object",
                  properties: {
                    slug: { type: "string" },
                    name: { type: "string" },
                  },
                },
                totalSectors: { type: "integer" },
                totalStartups: { type: "integer" },
                lastUpdated: { type: "string", format: "date-time" },
                citation: { type: "string" },
              },
            },
            trending: { type: "array", items: { $ref: "#/components/schemas/Startup" } },
            sectors: { type: "array", items: { $ref: "#/components/schemas/Sector" } },
          },
        },
        Startup: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            stage: { type: "string", enum: ["Pre-seed", "Seed", "Series A/B", "Growth"] },
            geography: { type: "string" },
            commitVelocity14d: { type: "integer", description: "Total commits over a rolling 14-day window" },
            commitVelocityChange: { type: "string", description: "Percentage change vs. prior 14-day window (e.g., '+120%')" },
            contributors: { type: "integer" },
            contributorGrowth: { type: "string" },
            newRepos: { type: "integer" },
            signalType: {
              type: "string",
              enum: [
                "Engineering hiring burst",
                "Infrastructure buildout",
                "Deploy frequency spike",
                "Framework migration",
              ],
            },
            githubUrl: { type: "string", format: "uri" },
            websiteUrl: { type: "string", format: "uri" },
            linkedinUrl: { type: "string", format: "uri" },
          },
        },
        Sector: {
          type: "object",
          properties: {
            name: { type: "string" },
            slug: { type: "string" },
            description: { type: "string" },
            url: { type: "string", format: "uri" },
            startupCount: { type: "integer" },
            startups: { type: "array", items: { $ref: "#/components/schemas/Startup" } },
          },
        },
        AnswerHit: {
          type: "object",
          properties: {
            question: { type: "string" },
            answer: { type: "string" },
            url: { type: "string", format: "uri" },
            source: { type: "string", enum: ["agent-query", "faq"] },
            confidence: { type: "number", minimum: 0, maximum: 1 },
            facts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  claim: { type: "string" },
                  sourceUrl: { type: "string", format: "uri" },
                },
              },
            },
            related: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  url: { type: "string", format: "uri" },
                },
              },
            },
          },
        },
        SearchHit: {
          type: "object",
          properties: {
            url: { type: "string", format: "uri" },
            title: { type: "string" },
            snippet: { type: "string" },
            type: { type: "string", enum: ["startup", "sector", "blog", "comparison", "answer", "faq", "research"] },
            score: { type: "number" },
          },
        },
        DeepSignal: {
          type: "object",
          properties: {
            found: { type: "boolean" },
            name: { type: "string" },
            sector: { type: "string" },
            stage: { type: "string" },
            geography: { type: "string" },
            signalType: { type: "string" },
            scores: {
              type: "object",
              properties: {
                velocity: { type: "integer", minimum: 0, maximum: 100 },
                growth: { type: "integer", minimum: 0, maximum: 100 },
                novelty: { type: "integer", minimum: 0, maximum: 100 },
                composite: { type: "integer", minimum: 0, maximum: 100 },
              },
            },
            rank: {
              type: "object",
              properties: {
                inSector: { type: "integer" },
                sectorTotal: { type: "integer" },
                sectorPercentile: { type: "integer", minimum: 0, maximum: 100 },
              },
            },
            thesis: { type: "string" },
            comparables: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  commitVelocityChange: { type: "string" },
                  signalType: { type: "string" },
                },
              },
            },
            balance: { type: "integer", minimum: 0 },
            charged: { type: "integer", minimum: 0, maximum: 1 },
            citation: { type: "string" },
          },
          required: ["found"],
        },
      },
      securitySchemes: {
        creditPackKey: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "gdf_v2.<customerId>.<hmac>",
          description:
            "Per-request credit-pack API key delivered by email after Stripe checkout. Format: `gdf_v2.<stripe_customer_id>.<hmac16>`. Buy at https://signals.gitdealflow.com/agents/credits.",
        },
      },
    },
    "x-mcp": {
      rpcEndpoint: `${BASE_URL}/api/mcp/rpc`,
      manifestUrl: `${BASE_URL}/.well-known/mcp.json`,
      protocolVersion: "2025-06-18",
    },
    "x-a2a": {
      agentCardUrl: `${BASE_URL}/.well-known/agent-card.json`,
      jsonrpcEndpoint: `${BASE_URL}/api/a2a`,
      protocolVersion: "0.3.0",
    },
  };

  return new Response(JSON.stringify(spec, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=3600",
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "index, follow",
    },
  });
}
