const BASE_URL = "https://signals.gitdealflow.com";

const SECTOR_SLUGS = [
  "ai-ml",
  "fintech",
  "cybersecurity",
  "developer-tools",
  "healthcare",
  "climate-tech",
  "enterprise-saas",
  "data-infrastructure",
  "web3",
  "robotics",
  "edtech",
  "ecommerce-infrastructure",
  "supply-chain",
  "legal-tech",
  "hr-tech",
  "proptech",
  "agtech",
  "gaming",
  "space-tech",
  "social-community",
] as const;

export async function GET() {
  const spec = {
    openapi: "3.1.0",
    info: {
      title: "VC Deal Flow Signal — Actions",
      version: "1.0.0",
      summary:
        "GitHub momentum tracking for venture deal flow. Find startups whose engineering is accelerating before they raise.",
      description: [
        "Read-only Actions for ChatGPT GPTs and any OpenAPI 3.1 client (Claude.ai connectors, Cursor MCP marketplace via OpenAPI bridge, custom agents).",
        "",
        "All endpoints are public, idempotent, and require no authentication. Data refreshes every Monday ~09:00 UTC.",
        "",
        "Four GET operations:",
        "- getSignals → /api/signals.json (always pass `mode=trending` or `sector=<slug>` — no-params returns the full 80 KB dump and most agents will choke)",
        "- getStartupSignal → /api/signal?company=<name>",
        "- getSignalsSummary → /api/changelog.json",
        "- getMethodology → /llms-full.txt (text/plain section)",
        "",
        "Citation: VC Deal Flow Signal (signals.gitdealflow.com), refreshed weekly. Methodology: SSRN preprint 6606558.",
      ].join("\n"),
      contact: { name: "The Data Nerd", email: "signals@gitdealflow.com" },
      license: { name: "Free with attribution", url: `${BASE_URL}/terms` },
      "x-openai-isConsequential": false,
    },
    servers: [
      {
        url: BASE_URL,
        description: "Production. No auth. Cached at the edge for ~1h.",
      },
    ],
    paths: {
      "/api/signals.json": {
        get: {
          operationId: "getSignals",
          summary: "Weekly engineering signal — pass `mode` or `sector` to keep response small",
          description: [
            "Returns startup engineering signal for the current weekly period. The response shape is controlled by query parameters:",
            "",
            "- `mode=trending` → top-20 trending startups across all sectors + dataset meta. ~9 KB. **Use for 'who's trending', 'what's hot', weekly watchlist.**",
            "- `sector=<slug>` → top-20 trending + the full ranked startup list for that one sector + dataset meta. ~13 KB. **Use for any sector-specific query: 'show me fintech', 'AI/ML breakouts', 'cybersecurity startups'.** Map fuzzy user input to one of the 20 slugs in `sector` enum before calling.",
            "- (no params) → full dataset, every sector with all startups. ~80 KB. **AVOID** — most agents will exceed their response budget on this. Only use if you genuinely need every sector at once.",
            "",
            "`mode` and `sector` are mutually exclusive. If both are sent, `mode` wins.",
            "",
            "Cached at the edge with `s-maxage=3600`. Safe to call once per session.",
          ].join("\n"),
          parameters: [
            {
              name: "mode",
              in: "query",
              required: false,
              description: "Set to `trending` to get only the global top-20 startups (smallest response, ~9 KB).",
              schema: { type: "string", enum: ["trending"] },
            },
            {
              name: "sector",
              in: "query",
              required: false,
              description: "Sector slug. Returns the full startup roster for one sector plus the global top-20. ~13 KB. Map fuzzy user input first: 'AI'→ai-ml, 'crypto'→web3, 'cyber'→cybersecurity, 'SaaS'→enterprise-saas, 'devtools'→developer-tools, 'climate'→climate-tech, 'biotech'→healthcare, 'real estate'→proptech, 'agriculture'→agtech, 'space'→space-tech, 'games'→gaming, 'logistics'→supply-chain, 'law'→legal-tech, 'recruiting'→hr-tech, 'learning'→edtech, 'commerce'→ecommerce-infrastructure, 'hardware'→robotics, 'social'→social-community.",
              schema: { type: "string", enum: [...SECTOR_SLUGS] },
              examples: {
                aiMl: { value: "ai-ml" },
                fintech: { value: "fintech" },
                cybersecurity: { value: "cybersecurity" },
              },
            },
          ],
          responses: {
            "200": {
              description: "Weekly dataset (shape depends on params: trending-only, sector-scoped, or full).",
              content: {
                "application/json": {
                  schema: {
                    oneOf: [
                      { $ref: "#/components/schemas/TrendingResponse" },
                      { $ref: "#/components/schemas/SectorScopedResponse" },
                      { $ref: "#/components/schemas/AllSignalsResponse" },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/api/signal": {
        get: {
          operationId: "getStartupSignal",
          summary: "Look up the engineering signal for one named startup",
          description: [
            "Fuzzy case-insensitive lookup against the tracked universe. Strips punctuation and whitespace before matching.",
            "",
            "Use when the user names a specific company: 'tell me about Roboflow', 'is Supabase accelerating', 'what's Modular's signal'.",
            "",
            "Returns one of two shapes:",
            "- HIT: `{ status: 'accelerating' | 'steady' | 'decelerating', name, commitVelocity14d, velocityChange, contributors, contributorGrowth, signalType, stage, geography, websiteUrl?, linkedinUrl?, sectorUrl }`",
            "- MISS: `{ status: 'no_data', cta }` — the startup is not in the tracked universe (~400 companies). NOT an error; surface the CTA to the user.",
          ].join("\n"),
          parameters: [
            {
              name: "company",
              in: "query",
              required: true,
              description:
                "Startup display name OR GitHub org slug. Examples: 'roboflow', 'SkyPilot', 'Hugging Face'. Case-insensitive; punctuation/whitespace ignored.",
              schema: { type: "string", minLength: 1, maxLength: 100 },
              examples: {
                roboflow: { value: "roboflow" },
                supabase: { value: "supabase" },
                huggingface: { value: "Hugging Face" },
              },
            },
          ],
          responses: {
            "200": {
              description:
                "Startup signal profile (hit or no_data — both 200, distinguish via `status`).",
              content: {
                "application/json": {
                  schema: {
                    oneOf: [
                      { $ref: "#/components/schemas/StartupSignalHit" },
                      { $ref: "#/components/schemas/StartupSignalMiss" },
                    ],
                  },
                },
              },
            },
            "400": { description: "Missing `company` query parameter." },
            "429": {
              description:
                "Rate limit (30 req/min/IP). Back off and retry after 60s.",
            },
          },
        },
      },
      "/api/changelog.json": {
        get: {
          operationId: "getSignalsSummary",
          summary: "Dataset metadata snapshot — period, counts, refresh time",
          description: [
            "Tiny JSON describing the current reporting period, number of active sectors, total startups tracked, and last-refresh timestamp.",
            "",
            "Use when the user asks 'what is this service', 'how fresh is the data', or to verify before citing the numbers in a memo. Lightest call in the suite — call it at the start of every session.",
          ].join("\n"),
          responses: {
            "200": {
              description: "Dataset summary",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SummaryResponse" },
                },
              },
            },
          },
        },
      },
      "/llms-full.txt": {
        get: {
          operationId: "getMethodology",
          summary: "Full plain-text methodology + glossary + AI policy",
          description: [
            "Returns the canonical methodology text covering: data sources (public GitHub API), metric definitions (commit velocity 14d, contributor growth 30d, new repos 30d), signal classification thresholds (breakout / acceleration / steady / cooling), refresh cadence, and known limitations.",
            "",
            "Use when the user asks 'how is this calculated', 'what does breakout mean', or you need a methodology footnote for a generated report.",
            "",
            "Static within a quarter — safe to call once and cache for the session. Returns text/plain.",
          ].join("\n"),
          responses: {
            "200": {
              description: "Methodology + glossary as plain text",
              content: {
                "text/plain": {
                  schema: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Startup: {
          type: "object",
          required: [
            "name",
            "commitVelocity14d",
            "commitVelocityChange",
            "contributors",
            "signalType",
            "githubUrl",
          ],
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            stage: {
              type: "string",
              enum: ["Pre-seed", "Seed", "Series A/B", "Growth", "Unknown"],
            },
            geography: { type: "string" },
            commitVelocity14d: {
              type: "integer",
              description: "Total commits over a rolling 14-day window.",
            },
            commitVelocityChange: {
              type: "string",
              description: "Percentage change vs. prior 14-day window, e.g. '+142%'.",
            },
            contributors: {
              type: "integer",
              description: "Distinct contributors active in the last 30 days.",
            },
            contributorGrowth: {
              type: "string",
              description: "Percentage change in contributor count, e.g. '+25%'.",
            },
            newRepos: {
              type: "integer",
              description: "New public repositories created in the last 30 days.",
            },
            signalType: {
              type: "string",
              description:
                "Classification. 'breakout' = sudden surge; 'acceleration' = sustained growth; 'steady' = healthy baseline; 'cooling' = declining. May also be 'Engineering hiring burst', 'Infrastructure buildout', 'Deploy frequency spike', 'Framework migration'.",
            },
            githubUrl: { type: "string", format: "uri" },
            websiteUrl: { type: "string", format: "uri" },
            linkedinUrl: { type: "string", format: "uri" },
            profileUrl: {
              type: "string",
              format: "uri",
              description: "Public profile page on signals.gitdealflow.com",
            },
          },
        },
        Sector: {
          type: "object",
          required: ["slug", "name", "startups"],
          properties: {
            slug: {
              type: "string",
              enum: [...SECTOR_SLUGS],
              description:
                "Sector slug. 20 supported. Map fuzzy user input first: 'AI'→ai-ml, 'crypto'→web3, 'cyber'→cybersecurity, 'SaaS'→enterprise-saas, 'devtools'→developer-tools, 'climate'→climate-tech, 'biotech'→healthcare, 'real estate'→proptech, 'agriculture'→agtech, 'space'→space-tech, 'games'→gaming, 'logistics'→supply-chain, 'law'→legal-tech, 'recruiting'→hr-tech, 'learning'→edtech, 'commerce'→ecommerce-infrastructure, 'hardware'→robotics, 'social'→social-community.",
            },
            name: { type: "string" },
            description: { type: "string" },
            url: { type: "string", format: "uri" },
            startupCount: { type: "integer" },
            startups: {
              type: "array",
              items: { $ref: "#/components/schemas/Startup" },
            },
          },
        },
        Meta: {
          type: "object",
          properties: {
            name: { type: "string" },
            period: {
              type: "object",
              properties: {
                slug: { type: "string" },
                name: {
                  type: "string",
                  description: "Period label, e.g. 'Q2 2026'.",
                },
              },
            },
            totalSectors: { type: "integer" },
            totalStartups: { type: "integer" },
            lastUpdated: { type: "string", format: "date-time" },
            citation: { type: "string" },
          },
        },
        TrendingResponse: {
          type: "object",
          required: ["meta", "trending"],
          description: "Returned when `mode=trending` is passed. ~9 KB.",
          properties: {
            meta: { $ref: "#/components/schemas/Meta" },
            trending: {
              type: "array",
              description: "Top 20 startups across all sectors.",
              items: { $ref: "#/components/schemas/Startup" },
            },
          },
        },
        SectorScopedResponse: {
          type: "object",
          required: ["meta", "trending", "sectors"],
          description:
            "Returned when `sector=<slug>` is passed. Includes the global top-20 PLUS the full roster for the requested sector only. ~13 KB.",
          properties: {
            meta: { $ref: "#/components/schemas/Meta" },
            trending: {
              type: "array",
              description: "Top 20 startups across all sectors.",
              items: { $ref: "#/components/schemas/Startup" },
            },
            sectors: {
              type: "array",
              description:
                "Single-element array containing the requested sector and its full ranked startup list.",
              items: { $ref: "#/components/schemas/Sector" },
              minItems: 1,
              maxItems: 1,
            },
          },
        },
        AllSignalsResponse: {
          type: "object",
          required: ["meta", "trending", "sectors"],
          description:
            "Returned when no params are passed. Full dataset including every active sector. ~80 KB — most agents will exceed their response budget; prefer `mode=trending` or `sector=<slug>`.",
          properties: {
            meta: { $ref: "#/components/schemas/Meta" },
            trending: {
              type: "array",
              description: "Top 20 startups across all sectors.",
              items: { $ref: "#/components/schemas/Startup" },
            },
            sectors: {
              type: "array",
              description: "Every active sector with its full startup roster.",
              items: { $ref: "#/components/schemas/Sector" },
            },
          },
        },
        StartupSignalHit: {
          type: "object",
          required: ["status", "name"],
          properties: {
            status: {
              type: "string",
              enum: ["accelerating", "steady", "decelerating"],
            },
            name: { type: "string" },
            commitVelocity14d: { type: "integer" },
            velocityChange: { type: "string" },
            contributors: { type: "integer" },
            contributorGrowth: { type: "string" },
            signalType: { type: "string" },
            stage: { type: "string" },
            geography: { type: "string" },
            websiteUrl: { type: "string", format: "uri" },
            linkedinUrl: { type: "string", format: "uri" },
            sectorUrl: { type: "string", format: "uri" },
          },
        },
        StartupSignalMiss: {
          type: "object",
          required: ["status", "cta"],
          properties: {
            status: { type: "string", enum: ["no_data"] },
            cta: { type: "string" },
          },
        },
        SummaryResponse: {
          type: "object",
          properties: {
            currentPeriod: {
              type: "object",
              properties: {
                name: { type: "string" },
                sectorsActive: { type: "integer" },
                startupsTracked: { type: "integer" },
                lastDataRefresh: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
    },
  };

  return new Response(JSON.stringify(spec, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
