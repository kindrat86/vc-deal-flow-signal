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
