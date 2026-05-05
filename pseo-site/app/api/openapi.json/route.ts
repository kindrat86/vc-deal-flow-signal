const BASE_URL = "https://signals.gitdealflow.com";

export async function GET() {
  const spec = {
    openapi: "3.1.0",
    info: {
      title: "VC Deal Flow Signal API",
      version: "1.0.0",
      description:
        "Public API for startup engineering acceleration data. Provides weekly-updated rankings of startups by GitHub commit velocity, contributor growth, and signal classification across 20 sectors.",
      contact: { email: "signal@gitdealflow.com" },
      license: {
        name: "Free with attribution",
        url: `${BASE_URL}/terms`,
      },
    },
    servers: [{ url: BASE_URL }],
    paths: {
      "/api/signals.json": {
        get: {
          operationId: "getSignals",
          summary: "Get all startup engineering signals",
          description:
            "Returns the current period's startup signals: trending top 20, sector-by-sector rankings with commit velocity, contributor growth, signal classification, and metadata.",
          responses: {
            "200": {
              description: "Successful response with all signal data",
              content: {
                "application/json": {
                  schema: {
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
                          lastUpdated: {
                            type: "string",
                            format: "date-time",
                          },
                          citation: { type: "string" },
                        },
                      },
                      trending: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Startup" },
                      },
                      sectors: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Sector" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/signals.csv": {
        get: {
          operationId: "getSignalsCSV",
          summary: "Get all startup signals as CSV",
          description:
            "Returns the same data as /api/signals.json in CSV format for spreadsheet and data science consumption.",
          responses: {
            "200": {
              description: "CSV file with all startup signals",
              content: {
                "text/csv": {
                  schema: { type: "string" },
                },
              },
            },
          },
        },
      },
      "/api/agent/deep-signal": {
        post: {
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
            "401": {
              description: "Missing or invalid API key (gdf_v2.<customerId>.<hmac>).",
            },
            "402": {
              description:
                "Insufficient credits. Top up at https://signals.gitdealflow.com/agents/credits.",
            },
          },
        },
      },
      "/api/account/credits": {
        get: {
          operationId: "getCredits",
          summary: "Check credit balance for an API key",
          description:
            "Returns the current balance plus lifetime purchased and consumed counters for the customer that owns the bearer token.",
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
                      lastConsumedAt: {
                        type: ["string", "null"],
                        format: "date-time",
                      },
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
    },
    components: {
      schemas: {
        Startup: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            stage: {
              type: "string",
              enum: ["Pre-seed", "Seed", "Series A/B", "Growth"],
            },
            geography: { type: "string" },
            commitVelocity14d: {
              type: "integer",
              description: "Total commits over a rolling 14-day window",
            },
            commitVelocityChange: {
              type: "string",
              description:
                "Percentage change vs. prior 14-day window (e.g., '+120%')",
            },
            contributors: {
              type: "integer",
              description: "Number of unique contributors",
            },
            contributorGrowth: {
              type: "string",
              description:
                "Contributor growth rate (e.g., '+25%')",
            },
            newRepos: {
              type: "integer",
              description: "New repositories created in the last 30 days",
            },
            signalType: {
              type: "string",
              enum: [
                "Engineering hiring burst",
                "Infrastructure buildout",
                "Deploy frequency spike",
                "Framework migration",
              ],
            },
            githubUrl: {
              type: "string",
              format: "uri",
            },
            websiteUrl: {
              type: "string",
              format: "uri",
              description:
                "Official company homepage, harvested from the GitHub org `blog` field when available.",
            },
            linkedinUrl: {
              type: "string",
              format: "uri",
              description:
                "LinkedIn company page URL, when known. May be absent for many records.",
            },
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
            startups: {
              type: "array",
              items: { $ref: "#/components/schemas/Startup" },
            },
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
  };

  return new Response(JSON.stringify(spec, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
