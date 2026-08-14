const BASE_URL = "https://signals.gitdealflow.com";

const SECTOR_SLUGS = [
  "healthcare",
  "edtech",
  "ecommerce-infrastructure",
  "supply-chain",
  "web3",
  "enterprise-saas",
  "data-infrastructure",
  "robotics",
  "legal-tech",
  "hr-tech",
  "proptech",
  "agtech",
  "gaming",
  "space-tech",
  "social-community",
] as const;

const TOOL_DEFINITIONS = [
  {
    name: "get_trending_startups",
    description:
      "Top 20 startups by engineering acceleration across all 15 sectors for the current weekly period. Read-only, idempotent. Use for cross-sector 'what's hot this week' questions.",
    parameters: {
      type: "object" as const,
      properties: {} as Record<string, unknown>,
      required: [] as string[],
      additionalProperties: false,
    },
  },
  {
    name: "search_startups_by_sector",
    description:
      "Every tracked startup within a sector, ranked by engineering acceleration. Use when the user names a vertical (healthcare, web3, gaming, etc.). Map fuzzy input to one of the 15 enumerated sector slugs before calling.",
    parameters: {
      type: "object" as const,
      properties: {
        sector: {
          type: "string",
          enum: [...SECTOR_SLUGS],
          description:
            "Sector slug from the enumerated list. Map fuzzy input first: 'crypto'→web3, 'SaaS'→enterprise-saas.",
        },
      },
      required: ["sector"],
      additionalProperties: false,
    },
  },
  {
    name: "get_startup_signal",
    description:
      "Full engineering-acceleration profile for a single tracked startup, by display name or GitHub org slug. Case-insensitive, normalization-tolerant. Returns `found: false` (not an error) when the startup is not in the tracked universe.",
    parameters: {
      type: "object" as const,
      properties: {
        name: {
          type: "string",
          minLength: 1,
          maxLength: 100,
          description:
            "Startup display name or GitHub org slug. Examples: 'Roboflow', 'SkyPilot', 'Supabase'.",
        },
      },
      required: ["name"],
      additionalProperties: false,
    },
  },
  {
    name: "get_diligence_dossier",
    description:
      "Public-source diligence dossier for a company or entity, in one cited object: who acquired it (M&A history), which funds publicly backed it, and its published engineering-acceleration signal. Use mid-diligence for 'who acquired X', 'which funds backed Y', 'what's the signal on Z'. Sources are press-release / SEC-filing / both-sides-disclosed only; returns `found: false` (not an error) with honest notes when the entity is outside the tracked corpus, never guesses. Case-insensitive, normalization-tolerant.",
    parameters: {
      type: "object" as const,
      properties: {
        company: {
          type: "string",
          minLength: 1,
          maxLength: 100,
          description:
            "Company or entity name (target, acquirer, or tracked startup). Examples: 'Figma', 'Supabase', 'Broadcom', 'Auth0'.",
        },
      },
      required: ["company"],
      additionalProperties: false,
    },
  },
  {
    name: "get_signals_summary",
    description:
      "High-level dataset snapshot: current period, sector and startup counts, last refresh timestamp, citation, and direct URLs to every machine-readable format. Cheap, call once per session to orient.",
    parameters: {
      type: "object" as const,
      properties: {} as Record<string, unknown>,
      required: [] as string[],
      additionalProperties: false,
    },
  },
  {
    name: "get_scout_receipts",
    description:
      "Compute a Scout Score (0-100) for a GitHub user from their public starring history. Cross-references the user's starred repos against ~75 validated unicorns (Series A+, $1B+ valuations, acquisitions) and grades how many they starred *before* the validation event. Returns score, rank (curious/scout/sharp/elite/oracle), top early calls, personality summary, and a shareable card URL. Use when the user wants to evaluate a developer's investment taste retroactively, vet a potential angel/scout, or generate proof-of-taste content.",
    parameters: {
      type: "object" as const,
      properties: {
        github_username: {
          type: "string",
          minLength: 1,
          maxLength: 39,
          pattern: "^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$",
          description: "GitHub username, 1-39 chars, alphanumeric + single hyphens.",
        },
      },
      required: ["github_username"],
      additionalProperties: false,
    },
  },
  {
    name: "get_methodology",
    description:
      "Full methodology document covering data sources, metric computation, signal classification thresholds, refresh cadence, and known limitations. Use when the user asks 'how is this calculated' or wants a citation footnote.",
    parameters: {
      type: "object" as const,
      properties: {} as Record<string, unknown>,
      required: [] as string[],
      additionalProperties: false,
    },
  },
  {
    name: "get_deep_signal",
    description:
      "PAID per-request tool, €0.19/call, 100 credits = €19, sold at https://signals.gitdealflow.com/agents/credits. Returns a deeply enriched signal profile beyond the free get_startup_signal: composite score (0-100), velocity/growth/novelty sub-scores, in-sector rank + percentile, plain-English investment thesis, top-3 sector comparables, and multi-period history. Requires Authorization: Bearer gdf_v2.cus_xxx.<hmac> on the call (set GITDEALFLOW_API_KEY env var). 1 credit consumed only on a successful match; misses (startup not in our universe) are FREE. Credits never expire. The 6 free tools above stay free forever, credits only apply to this tool.",
    parameters: {
      type: "object" as const,
      properties: {
        name: {
          type: "string",
          minLength: 1,
          maxLength: 100,
          description:
            "Startup display name or GitHub org slug. Examples: 'Roboflow', 'SkyPilot', 'Supabase'.",
        },
      },
      required: ["name"],
      additionalProperties: false,
    },
  },
];

function openaiTools() {
  return TOOL_DEFINITIONS.map((t) => ({
    type: "function" as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters,
      strict: true,
    },
  }));
}

function anthropicTools() {
  return TOOL_DEFINITIONS.map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: t.parameters,
  }));
}

function geminiTools() {
  return [
    {
      function_declarations: TOOL_DEFINITIONS.map((t) => ({
        name: t.name,
        description: t.description,
        parameters: t.parameters,
      })),
    },
  ];
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const format = url.searchParams.get("format")?.toLowerCase();
  const callUrl = `${BASE_URL}/api/agent/call`;

  if (format === "openai") {
    return Response.json(
      { tools: openaiTools(), invoke: callUrl },
      { headers: { ...CORS_HEADERS, "Cache-Control": "public, max-age=3600" } }
    );
  }
  if (format === "anthropic") {
    return Response.json(
      { tools: anthropicTools(), invoke: callUrl },
      { headers: { ...CORS_HEADERS, "Cache-Control": "public, max-age=3600" } }
    );
  }
  if (format === "gemini") {
    return Response.json(
      { tools: geminiTools(), invoke: callUrl },
      { headers: { ...CORS_HEADERS, "Cache-Control": "public, max-age=3600" } }
    );
  }

  return Response.json(
    {
      service: "GitDealFlow Function-Calling Tools",
      description:
        "Provider-native function-calling tool definitions. Drop these directly into OpenAI / Anthropic / Google Gemini SDKs. Invoke via POST to `invoke`.",
      invoke: callUrl,
      formats: {
        openai: {
          url: `${BASE_URL}/api/agent/tools?format=openai`,
          example: "openai.responses.create({ tools, ... })",
        },
        anthropic: {
          url: `${BASE_URL}/api/agent/tools?format=anthropic`,
          example: "client.messages.create({ tools, ... })",
        },
        gemini: {
          url: `${BASE_URL}/api/agent/tools?format=gemini`,
          example: "model.generateContent({ tools, ... })",
        },
      },
      providers: {
        openai: openaiTools(),
        anthropic: anthropicTools(),
        gemini: geminiTools(),
      },
      docs: `${BASE_URL}/agents.md`,
      mcpAlternative: {
        stdio: "npx -y @gitdealflow/mcp-signal",
        http: `${BASE_URL}/api/mcp/rpc`,
        manifest: `${BASE_URL}/.well-known/mcp.json`,
      },
    },
    { headers: { ...CORS_HEADERS, "Cache-Control": "public, max-age=3600" } }
  );
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      ...CORS_HEADERS,
      "Access-Control-Max-Age": "86400",
    },
  });
}
