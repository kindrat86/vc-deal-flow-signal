const BASE_URL = "https://signals.gitdealflow.com";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const spec = {
    openapi: "3.1.0",
    info: {
      title: "VC Deal Flow Signal API",
      version: "1.4.0",
      description:
        "Unified OpenAPI 3.1 + MCP descriptor for startup engineering-acceleration data. Documents the public REST surface (signals, answers, citations, badges, deep signals, scout receipts, prediction markets) AND the MCP server tools, resources, prompts. Operations that have an MCP analog carry an `x-mcp-tool` vendor extension; the full MCP server is enumerated under the top-level `x-mcp-server` block. Default rate limits are declared at the `info.x-rate-limit` level; operations that override the default carry their own `x-rate-limit` block. CC BY 4.0 attribution. No auth required for free endpoints; the paid Deep Signal endpoint uses a per-request credit-pack key delivered after Stripe checkout, OR x402 USDC pay-per-call on Base.",
      contact: { email: "signal@gitdealflow.com" },
      license: {
        name: "Free with attribution (CC BY 4.0)",
        url: "https://creativecommons.org/licenses/by/4.0/",
      },
      "x-citation":
        "VC Deal Flow Signal (signals.gitdealflow.com), Q2 2026 data. SSRN: 6606558.",
      "x-revision-date": "2026-05-08",
      "x-mcp-tool-count": 8,
      "x-rest-operation-count": 25,
      "x-rate-limit": {
        default: {
          requestsPerMinute: 60,
          scope: "ip",
          burst: 120,
          onExceeded: { status: 429, header: "Retry-After" },
          notes:
            "Per-IP default for free, read-only routes. Static .json/.jsonl/.txt surfaces are edge-cached and effectively unlimited. Operations that override the default carry their own `x-rate-limit` extension. Paid /api/agent/deep-signal* routes are scoped to credit-pack key, not IP.",
        },
        retryAfter: {
          mechanism: "header",
          header: "Retry-After",
          unit: "seconds",
        },
        documentation: `${BASE_URL}/api/v1/changelog.json`,
      },
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
      { name: "v1", description: "Versioned, machine-readable mirrors of agent surfaces (stable URL contract)" },
      { name: "methodology", description: "Reproducible signal-computation methodology" },
      { name: "glossary", description: "Controlled-vocabulary term definitions" },
    ],
    paths: {
      "/api/signals.json": {
        get: {
          tags: ["signals"],
          operationId: "getSignals",
          summary: "Full snapshot of startup engineering signals (free)",
          description:
            "Returns the current period's data: meta, top-20 trending, and per-sector rankings with commit velocity, contributor growth, and signal classification.",
          "x-mcp-tool": {
            name: "get_signals_summary",
            description:
              "MCP analog projects this response to the meta + format-URL summary; full data is reachable as the `signal://summary` MCP resource and the `signal://trending` MCP resource.",
            relation: "superset",
            annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
          },
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
          "x-mcp-tool": {
            name: "get_startup_signal",
            description:
              "1:1 MCP analog. The `name` MCP arg maps to the `company` query parameter. Reachable via the `signal://startup/{name}` MCP resource template.",
            relation: "exact",
            argumentMapping: { name: "company" },
            annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
          },
          parameters: [
            {
              name: "company",
              in: "query",
              required: true,
              schema: { type: "string", minLength: 1, maxLength: 80 },
              description: "Display name or GitHub org slug. Case-insensitive fuzzy match.",
            },
          ],
          "x-rate-limit": {
            requestsPerMinute: 30,
            scope: "ip",
            burst: 60,
            onExceeded: { status: 429, header: "Retry-After" },
          },
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
            "429": { description: "Rate limited (30/min/IP). Retry after the `Retry-After` header." },
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
      "/api/diligence.json": {
        get: {
          tags: ["answer"],
          operationId: "getDiligenceDossier",
          summary: "Public-source diligence dossier for a company/entity",
          description:
            "One cited dossier per entity: who acquired it (M&A history), which funds publicly backed it, and its published engineering-acceleration signal. Sources are press-release / SEC-filing / both-sides-disclosed only; returns found:false (404) with honest notes when the entity is outside the tracked corpus — never guesses. Same payload as the get_diligence_dossier MCP tool. Human mirror at /diligence.",
          parameters: [
            { name: "company", in: "query", required: false, schema: { type: "string", maxLength: 100 }, description: "Company or entity name (target, acquirer, or tracked startup). Aliases: entity, q. Omit for a usage envelope listing the answerable universe." },
          ],
          responses: {
            "200": {
              description: "Dossier with at least one grounded fact (or usage envelope when no company param)",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      "@type": { type: "string", example: "Dataset" },
                      dossier: {
                        type: "object",
                        properties: {
                          entity: { type: "string" },
                          found: { type: "boolean" },
                          acquiredBy: { type: "array", items: { type: "object" } },
                          acquisitionsMade: { type: "array", items: { type: "object" } },
                          backedBy: { type: "array", items: { type: "object" } },
                          signal: { type: "object", nullable: true },
                          notes: { type: "array", items: { type: "string" } },
                        },
                      },
                      citation: { type: "array", items: { type: "object" } },
                    },
                  },
                },
              },
            },
            "404": {
              description: "found:false — entity outside the tracked corpus (an expected outcome, not an error)",
            },
          },
          "x-mcp-tool": "get_diligence_dossier",
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
          "x-mcp-tool": {
            name: "get_scout_receipts",
            description:
              "1:1 MCP analog. The `github_username` MCP arg maps to the `username` path parameter.",
            relation: "exact",
            argumentMapping: { github_username: "username" },
            annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
          },
          parameters: [
            { name: "username", in: "path", required: true, schema: { type: "string", minLength: 1, maxLength: 39 } },
          ],
          "x-rate-limit": {
            requestsPerMinute: 10,
            scope: "ip",
            burst: 20,
            onExceeded: { status: 429, header: "Retry-After" },
            notes:
              "Tighter than the default because the scoring step calls the GitHub API and is bursty by nature.",
          },
          responses: {
            "200": {
              description: "Scout score with personality + breakdown",
              content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
            },
            "400": { description: "Invalid GitHub username." },
            "429": { description: "Rate limited (10/min/IP). Retry after the `Retry-After` header." },
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
          "x-mcp-tool": {
            name: "get_deep_signal",
            description:
              "1:1 MCP analog (credit-pack-key flavour). The MCP server reuses the same handler. Pricing parity: €0.19/call. The x402 (USDC pay-per-call) flavour is documented under POST /api/agent/deep-signal/x402.",
            relation: "exact",
            paid: true,
            unitPrice: "EUR 0.19",
            annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
          },
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
          "x-mcp-tool": {
            name: "get_deep_signal",
            description:
              "x402 variant — same MCP tool, no API key, USDC on Base. The MCP server picks the right pricing rail based on caller context.",
            relation: "exact",
            paid: true,
            unitPrice: "USDC 0.19",
            paymentProtocol: "x402",
            annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
          },
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
      "/api/agent/deep-signal/solana": {
        get: {
          tags: ["deep-signal"],
          operationId: "getDeepSignalSolanaTerms",
          summary: "Solana credit top-up — payment instructions",
          description:
            "Returns the Solana payment requirements (cluster, USDC mint, payTo, amount, credits granted) so an agent knows how to pay. No auth required for discovery.",
          responses: {
            "200": {
              description: "Payment requirements under an `accepts` array.",
            },
            "503": {
              description: "Solana endpoint not configured (SOLANA_RPC_URL / SOLANA_USDC_MINT / SOLANA_PAY_TO env vars missing).",
            },
          },
        },
        post: {
          tags: ["deep-signal"],
          operationId: "redeemDeepSignalSolana",
          summary: "Redeem a Solana USDC payment for deep-signal credits",
          description:
            "Pay USDC (SPL) to the configured wallet on Solana, then POST the transaction signature with your credit-pack key to add credits to that account. The server verifies the on-chain transfer via Solana JSON-RPC (getTransaction) and grants the configured credit pack. Each signature can be redeemed once. Defaults: 19 USDC → 100 credits. Cluster defaults to devnet until a mainnet wallet is configured.",
          security: [{ creditPackKey: [] }],
          "x-mcp-tool": {
            name: "get_deep_signal",
            description:
              "Solana variant — top up the same credit balance with USDC on Solana, then call get_deep_signal as usual.",
            relation: "related",
            paid: true,
            unitPrice: "USDC 19 / 100 credits",
            paymentProtocol: "solana-spl-transfer",
            annotations: { readOnlyHint: false, idempotentHint: false, openWorldHint: false },
          },
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    signature: {
                      type: "string",
                      description: "Base58 Solana transaction signature of the USDC transfer.",
                    },
                  },
                  required: ["signature"],
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Payment verified; credits added. Returns new balance.",
            },
            "401": { description: "Missing or invalid credit-pack key." },
            "402": {
              description: "Payment not yet found/confirmed, or amount below the required price.",
            },
            "409": { description: "Signature already redeemed." },
            "422": { description: "Transaction failed on-chain or paid the wrong recipient." },
            "503": {
              description: "Solana endpoint not configured.",
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
      "/api/v1/signals.json": {
        get: {
          tags: ["v1", "signals"],
          operationId: "getSignalsV1",
          summary: "Versioned alias of /api/signals.json",
          description:
            "Stable v1 path for procurement automations and agents that pin to a versioned URL. Body identical to /api/signals.json. Canonical URL declared via Link rel=canonical header.",
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
      "/api/v1/agents.json": {
        get: {
          tags: ["v1", "agents"],
          operationId: "getAgentsV1",
          summary: "Versioned alias of /api/agents.json (MCP / A2A skill catalog)",
          responses: {
            "200": {
              description: "Agent skill catalog",
              content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
            },
          },
        },
      },
      "/api/v1/members.json": {
        get: {
          tags: ["v1", "community"],
          operationId: "getMembersV1",
          summary: "Charter Cohort 2026 — member-side ledger (roster + leaderboard + grading rules)",
          description:
            "Programmatic mirror of /members. Returns the full Charter Cohort roster with derived per-member stats, a pre-sorted leaderboard array using the same ranking semantics as /members/leaderboard (hits → closed windows → picks → handle), aggregate cohort stats, and the public 60d/90d grading rules. Pseudonymous handles welcome under the same anonymity rule as the founder. Cached at the edge for 1 hour.",
          responses: {
            "200": {
              description: "Charter Cohort roster + leaderboard + aggregate stats",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      schema: { type: "string", format: "uri" },
                      version: { type: "string" },
                      license: { type: "string", format: "uri" },
                      cohort: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          total_seats: { type: "integer" },
                          seats_claimed: { type: "integer" },
                          seats_open: { type: "integer" },
                          hub_url: { type: "string", format: "uri" },
                          leaderboard_url: { type: "string", format: "uri" },
                          apply_url: { type: "string", format: "uri" },
                          anonymity_rule: { type: "string" },
                        },
                      },
                      aggregate: {
                        type: "object",
                        properties: {
                          total_picks: { type: "integer" },
                          total_hits: { type: "integer" },
                          total_closed_windows: { type: "integer" },
                          cohort_hit_rate_pct: { type: ["integer", "null"] },
                        },
                      },
                      members: { type: "array", items: { type: "object", additionalProperties: true } },
                      leaderboard: { type: "array", items: { type: "object", additionalProperties: true } },
                      grading_rules: {
                        type: "object",
                        properties: {
                          hit: { type: "string" },
                          miss: { type: "string" },
                          pending: { type: "string" },
                        },
                      },
                      last_modified: { type: "string", format: "date" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/affiliates.json": {
        get: {
          tags: ["v1", "business-model"],
          operationId: "getAffiliatesV1",
          summary: "Affiliate program — terms, leaderboard snapshot, swipe-kit templates",
          description:
            "Programmatic mirror of /affiliates. Returns commission terms (20% lifetime, €399/Sweep, €19.40/mo/Insider, 60-day cookie), pseudonymized top-10 leaderboard, six clone-ready swipe-kit content templates (tweet thread, LinkedIn post, blog post, newsletter mention, podcast script, 3-email sequence), aggregate program stats, and the Refgrow signup URL. Updated monthly. Cached at the edge for 1 hour.",
          responses: {
            "200": {
              description: "Affiliate program metadata + leaderboard + swipe kit",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      schema_version: { type: "string" },
                      program_name: { type: "string" },
                      last_updated: { type: "string", format: "date" },
                      landing_page: { type: "string", format: "uri" },
                      leaderboard_page: { type: "string", format: "uri" },
                      swipe_kit_page: { type: "string", format: "uri" },
                      signup_url: { type: "string", format: "uri" },
                      terms: { type: "object", additionalProperties: true },
                      bait: { type: "object", additionalProperties: true },
                      program_stats: { type: "object", additionalProperties: true },
                      leaderboard: { type: "array", items: { type: "object", additionalProperties: true } },
                      swipe_kit: { type: "object", additionalProperties: true },
                      prohibited_channels: { type: "array", items: { type: "string" } },
                      contact: { type: "object", additionalProperties: true },
                      license: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/social-mascot.json": {
        get: {
          tags: ["v1", "brand"],
          operationId: "getSocialMascotV1",
          summary: "Data Nerd mascot bible — voice, pillars, cadence, sample batch",
          description:
            "Anonymity-respecting brand bible for the GitDealFlow social mascot. Returns channel handles + status, voice/tone rules, content pillars with target ratios, posting cadence + UTC slots, hashtag bank, and a 5-post sample batch with channel-specific bodies. Used by cross-posters, partner accounts, and AI agents that surface our content. Cached at the edge for 1 hour.",
          responses: {
            "200": {
              description: "Mascot bible + sample batch",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      schema_version: { type: "string" },
                      mascot_name: { type: "string" },
                      bible_page: { type: "string", format: "uri" },
                      handles: { type: "object", additionalProperties: { type: "string" } },
                      handle_status: { type: "object", additionalProperties: { type: "string" } },
                      voice: { type: "object", additionalProperties: true },
                      tone: { type: "object", additionalProperties: true },
                      pillars: { type: "array", items: { type: "object", additionalProperties: true } },
                      cadence: { type: "object", additionalProperties: true },
                      posting_hours_utc: { type: "object", additionalProperties: true },
                      hashtag_bank: { type: "object", additionalProperties: true },
                      sample_batch: { type: "object", additionalProperties: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/answers.json": {
        get: {
          tags: ["v1", "answer"],
          operationId: "getAnswersV1",
          summary: "Versioned alias of /api/answers.json (full Q&A corpus)",
          responses: {
            "200": {
              description: "Q&A corpus",
              content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
            },
          },
        },
      },
      "/api/v1/changelog.json": {
        get: {
          tags: ["v1", "meta"],
          operationId: "getChangelogV1",
          summary: "Versioned alias of /api/changelog.json",
          responses: {
            "200": {
              description: "Changelog entries",
              content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
            },
          },
        },
      },
      "/api/v1/dataset.jsonl": {
        get: {
          tags: ["v1", "signals"],
          operationId: "getDatasetJsonlV1",
          summary: "Versioned alias of /api/dataset.jsonl (NDJSON dataset)",
          responses: {
            "200": {
              description: "NDJSON stream of every tracked startup × period.",
              content: { "application/x-ndjson": { schema: { type: "string" } } },
            },
          },
        },
      },
      "/api/v1/faq.json": {
        get: {
          tags: ["v1", "answer"],
          operationId: "getFaqV1",
          summary: "Standalone FAQ corpus (101 entries)",
          description:
            "Curated FAQ corpus separate from the agent-query firehose. Stable answer slugs — safe to cite.",
          responses: {
            "200": {
              description: "FAQ entries",
              content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
            },
          },
        },
      },
      "/api/v1/methodology.json": {
        get: {
          tags: ["v1", "methodology"],
          operationId: "getMethodologyV1",
          summary: "Reproducible signal-computation methodology (HowTo)",
          description:
            "Schema.org HowTo describing the 6-step signal pipeline (collect, filter, normalise, accelerate, classify, rank). Companion to the human-facing /methodology page and the SSRN write-up (DOI 10.2139/ssrn.6606558).",
          "x-mcp-tool": {
            name: "get_methodology",
            description:
              "1:1 MCP analog. The MCP tool returns the same HowTo + summary metadata.",
            relation: "exact",
            annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
          },
          responses: {
            "200": {
              description: "Methodology HowTo + metadata",
              content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
            },
          },
        },
      },
      "/api/v1/glossary.json": {
        get: {
          tags: ["v1", "glossary"],
          operationId: "getGlossaryV1",
          summary: "Controlled-vocabulary glossary (DefinedTermSet)",
          description:
            "Schema.org DefinedTermSet of 18 controlled-vocabulary terms used across signals, sectors, and methodology.",
          responses: {
            "200": {
              description: "Glossary as DefinedTermSet",
              content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
            },
          },
        },
      },
      "/api/v1/openapi.json": {
        get: {
          tags: ["v1", "agents"],
          operationId: "getOpenapiV1",
          summary: "This document — versioned alias of /api/openapi.json",
          description:
            "Self-referential. Some agents pin to versioned URLs for the descriptor itself.",
          responses: {
            "200": {
              description: "OpenAPI 3.1 spec (this document)",
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
      skillsManifest: `${BASE_URL}/.well-known/skills.json`,
      protocolVersion: "2025-06-18",
    },
    "x-mcp-server": {
      protocolVersion: "2025-06-18",
      server: {
        name: "vc-deal-flow-signal",
        title: "VC Deal Flow Signal",
        version: "1.2.0",
        instructions:
          "Read-only signal data on startup engineering acceleration. All data CC BY 4.0 — cite signals.gitdealflow.com when used in derivative work.",
      },
      transports: [
        {
          type: "streamable-http",
          url: `${BASE_URL}/api/mcp/rpc`,
          authentication: "none-for-free-tools; bearer gdf_v2 for get_deep_signal",
        },
        {
          type: "stdio",
          npm: "@gitdealflow/mcp-signal",
          command: "npx -y @gitdealflow/mcp-signal",
        },
      ],
      directories: [
        { name: "Smithery", url: "https://smithery.ai/servers/kindrat86/mcp-deal-flow-signal" },
        { name: "Glama", url: "https://glama.ai/mcp/servers/kindrat86/mcp-deal-flow-signal" },
      ],
      skillsManifest: `${BASE_URL}/.well-known/skills.json`,
      tools: [
        {
          name: "get_trending_startups",
          description: "Top 20 startups across all sectors for the current weekly period.",
          httpAnalog: { method: "GET", path: "/api/signals.json", projection: "trending[]" },
          inputSchema: { type: "object", properties: {}, additionalProperties: false },
          annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
        },
        {
          name: "search_startups_by_sector",
          description: "Startups within a single sector ranked by engineering acceleration.",
          httpAnalog: { method: "GET", path: "/api/signals.json", projection: "sectors[?slug==input.sector_slug]" },
          inputSchema: {
            type: "object",
            properties: {
              sector_slug: { type: "string", description: "Sector slug (e.g. 'devtools', 'ai-infrastructure')." },
            },
            required: ["sector_slug"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
        },
        {
          name: "get_startup_signal",
          description: "Full profile for a single tracked startup by display name or GitHub org slug.",
          httpAnalog: { method: "GET", path: "/api/signal", argumentMapping: { name: "company" } },
          inputSchema: {
            type: "object",
            properties: {
              name: { type: "string", description: "Startup display name or GitHub org slug." },
            },
            required: ["name"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
        },
        {
          name: "get_signals_summary",
          description: "Period, sector and startup counts, last refresh, format URLs.",
          httpAnalog: { method: "GET", path: "/api/signals.json", projection: "meta + format URLs" },
          inputSchema: { type: "object", properties: {}, additionalProperties: false },
          annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
        },
        {
          name: "get_scout_receipts",
          description: "Scout Score (0-100) for a GitHub user — backwards-looking proof of taste.",
          httpAnalog: { method: "GET", path: "/api/receipts/{username}", argumentMapping: { github_username: "username" } },
          inputSchema: {
            type: "object",
            properties: {
              github_username: {
                type: "string",
                pattern: "^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$",
                description: "GitHub username, 1-39 chars, alphanumeric + single hyphens.",
              },
            },
            required: ["github_username"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
        },
        {
          name: "get_methodology",
          description: "Full reproducible signal-computation methodology (HowTo).",
          httpAnalog: { method: "GET", path: "/api/v1/methodology.json" },
          inputSchema: { type: "object", properties: {}, additionalProperties: false },
          annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
        },
        {
          name: "get_deep_signal",
          description: "PAID — €0.19/call (or USDC 0.19 via x402). Returns enriched signal: composite score, sector percentile, plain-English thesis, comparables, multi-period history.",
          httpAnalog: [
            { method: "POST", path: "/api/agent/deep-signal", auth: "creditPackKey", paid: true, unitPrice: "EUR 0.19" },
            { method: "POST", path: "/api/agent/deep-signal/x402", auth: "x402", paid: true, unitPrice: "USDC 0.19" },
          ],
          inputSchema: {
            type: "object",
            properties: {
              name: { type: "string", description: "Startup display name or GitHub org slug." },
            },
            required: ["name"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
          paid: true,
        },
        {
          name: "share_result",
          description: "Compose a sharable post for X / Bluesky / Mastodon / LinkedIn / Telegram from a signal takeaway.",
          httpAnalog: null,
          requiresUserApproval: true,
          inputSchema: {
            type: "object",
            properties: {
              text: { type: "string", minLength: 10, maxLength: 200 },
              network: {
                type: "string",
                enum: ["all", "twitter", "bluesky", "mastodon", "linkedin", "telegram"],
                default: "all",
              },
              includeAttribution: { type: "boolean", default: true },
            },
            required: ["text"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
        },
      ],
      resources: [
        {
          uri: "signal://trending",
          name: "Trending Startups (current week)",
          description: "Top 20 startups across all sectors for the current weekly period.",
          mimeType: "application/json",
          httpAnalog: "GET /api/signals.json",
        },
        {
          uri: "signal://summary",
          name: "Dataset Summary",
          description: "Period, sector and startup counts, last refresh, format URLs.",
          mimeType: "application/json",
          httpAnalog: "GET /api/v1/signals.json (meta sub-object)",
        },
        {
          uri: "signal://methodology",
          name: "Signal Methodology",
          description: "Full methodology document.",
          mimeType: "text/markdown",
          httpAnalog: "GET /api/v1/methodology.json",
        },
      ],
      resourceTemplates: [
        {
          uriTemplate: "signal://startup/{name}",
          name: "Startup Signal Profile",
          description: "Full profile for a single tracked startup.",
          mimeType: "application/json",
          httpAnalog: "GET /api/signal?company={name}",
        },
        {
          uriTemplate: "signal://sector/{slug}",
          name: "Sector Signal Snapshot",
          description: "All tracked startups within a sector.",
          mimeType: "application/json",
          httpAnalog: "GET /api/signals.json (sectors[slug])",
        },
      ],
      prompts: [
        {
          name: "weekly_digest",
          description: "Monday-morning Signal Digest from the current top-20 trending startups.",
          arguments: [],
        },
        {
          name: "sector_deep_dive",
          description: "Sector intelligence brief — top movers, dark horses, thesis follow-ups.",
          arguments: [{ name: "sector", description: "Sector slug.", required: true }],
        },
        {
          name: "find_dark_horse",
          description: "Surface one under-the-radar startup with sustained acceleration.",
          arguments: [{ name: "sector", description: "Optional sector slug.", required: false }],
        },
        {
          name: "compare_startups",
          description: "Head-to-head investor comparison of two named startups.",
          arguments: [
            { name: "name_a", description: "First startup.", required: true },
            { name: "name_b", description: "Second startup.", required: true },
          ],
        },
        {
          name: "acceleration_memo",
          description: "One-page deal memo grounded in the live signal profile of a named startup.",
          arguments: [{ name: "name", description: "Startup display name or GitHub org slug.", required: true }],
        },
      ],
    },
    "x-a2a": {
      agentCardUrl: `${BASE_URL}/.well-known/agent-card.json`,
      jsonrpcEndpoint: `${BASE_URL}/api/a2a`,
      protocolVersion: "0.3.0",
    },
    "x-changelog": [
      {
        version: "1.3.0",
        date: "2026-05-08",
        changes: [
          "Added `info.x-rate-limit` default (60/min/IP, burst 120) so paid agents discover throttling without hitting 429.",
          "Added per-operation `x-rate-limit` overrides on /api/signal (30/min/IP) and /api/receipts/{username} (10/min/IP).",
          "Added `x-mcp.skillsManifest` and `x-mcp-server.skillsManifest` pointing to /.well-known/skills.json — Anthropic-style skills card enumerating the 5 MCP prompts as agent-callable skills with explicit invoke contracts.",
          "Added 11 extension-stripped /api/v1/<resource> aliases (signals, faq, methodology, glossary, answers, openapi, agents, changelog, dataset, pricing, uptime) for agents that strip file extensions; canonical URLs remain at .json/.jsonl variants.",
        ],
      },
      {
        version: "1.2.0",
        date: "2026-05-07",
        changes: [
          "Added x-mcp-tool extensions to 6 operations with MCP analogs (get_signals_summary, get_startup_signal, get_scout_receipts, get_methodology, get_deep_signal x2 variants).",
          "Added top-level x-mcp-server with full tool/resource/prompt enumeration including HTTP analog mapping.",
          "Documented 9 /api/v1/* versioned endpoints (signals, agents, answers, changelog, dataset, faq, methodology, glossary, openapi).",
        ],
      },
      { version: "1.1.0", date: "2026-04-22", changes: ["Initial public spec."] },
    ],
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
