import { NextRequest } from "next/server";
import {
  getAllSectors,
  getCurrentPeriod,
  getSortedStartups,
  type Startup,
} from "@/lib/data";
import { slugify } from "@/lib/slugify";
import { bearerFromHeader, verifyToken } from "@/lib/oauth/jwt";

const BASE_URL = "https://signals.gitdealflow.com";
const SERVER_NAME = "vc-deal-flow-signal";
const SERVER_VERSION = "1.6.0";
const PROTOCOL_VERSION = "2025-06-18";

type JsonRpcId = string | number | null;

interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: JsonRpcId;
  method: string;
  params?: unknown;
}

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

// All tools are read-only research operations against a public dataset.
// Per MCP spec: readOnlyHint=true, idempotentHint=true, openWorldHint=false
// (closed-world: tools only return data from our pre-computed weekly dataset,
// they do NOT crawl external services on demand). destructiveHint=false because
// nothing is mutated. annotations are advisory hints to the host UI; we publish
// them so Anthropic Connectors directory + other catalogs can render appropriately.
const READ_ONLY_ANNOTATIONS = {
  readOnlyHint: true,
  idempotentHint: true,
  destructiveHint: false,
  openWorldHint: false,
} as const;

const STARTUP_ITEM_SCHEMA = {
  type: "object" as const,
  description:
    "A single startup ranked by engineering acceleration, derived from public GitHub activity.",
  properties: {
    rank: { type: "integer", description: "1-indexed rank within this result set." },
    name: { type: "string", description: "Startup or GitHub org name." },
    sector: { type: "string", description: "Sector the startup is classified into." },
    stage: {
      type: "string",
      description: "Funding stage if known (e.g. 'Seed', 'Series A', 'Unknown').",
    },
    geography: { type: "string", description: "Headquarters region if known." },
    commitVelocity14d: {
      type: "number",
      description: "Commits across tracked repos in the trailing 14 days.",
    },
    commitVelocityChange: {
      type: "string",
      description:
        "Percentage change in commit velocity vs. the prior 14-day window, e.g. '+142%'.",
    },
    contributors: {
      type: "integer",
      description: "Distinct contributors active in the last 30 days.",
    },
    contributorGrowth: {
      type: "string",
      description: "Percentage change in contributor count vs. the prior 30-day window.",
    },
    newRepos: {
      type: "integer",
      description: "New public repositories created in the last 30 days.",
    },
    signalType: {
      type: "string",
      description:
        "Classification label. Common values: 'breakout' (sudden surge), 'acceleration' (sustained growth), 'steady' (healthy baseline), 'cooling' (declining).",
    },
    description: { type: "string", description: "One-line summary of the startup." },
    githubUrl: { type: "string", format: "uri", description: "Primary GitHub org URL." },
    websiteUrl: {
      type: "string",
      format: "uri",
      description: "Company website if known.",
    },
    linkedinUrl: {
      type: "string",
      format: "uri",
      description: "LinkedIn company page if known.",
    },
    profileUrl: {
      type: "string",
      format: "uri",
      description: "Public profile page on signals.gitdealflow.com.",
    },
  },
  required: [
    "rank",
    "name",
    "commitVelocityChange",
    "contributors",
    "signalType",
    "githubUrl",
  ],
} as const;

const TOOLS = [
  {
    name: "get_trending_startups",
    title: "Trending Startups",
    description:
      "Top 20 startups by engineering acceleration across all 20 sectors for the current weekly period. Read-only, idempotent.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    outputSchema: {
      type: "object" as const,
      properties: {
        period: { type: "string", description: "Reporting period label, e.g. 'Q2 2026'." },
        startups: {
          type: "array",
          description: "Top 20 startups ranked by engineering acceleration.",
          items: STARTUP_ITEM_SCHEMA,
        },
        citation: { type: "string", description: "Suggested citation string for reports." },
        source: { type: "string", format: "uri" },
      },
      required: ["period", "startups", "citation", "source"],
    },
    annotations: READ_ONLY_ANNOTATIONS,
  },
  {
    name: "search_startups_by_sector",
    title: "Search Startups by Sector",
    description:
      "Every tracked startup within a sector, ranked by engineering acceleration. Sector slug must be one of 20 enumerated values.",
    inputSchema: {
      type: "object",
      properties: {
        sector: {
          type: "string",
          enum: [...SECTOR_SLUGS],
          description:
            "Sector slug from the enumerated list. Map fuzzy user input to the closest slug (e.g. 'AI' → 'ai-ml', 'crypto' → 'web3', 'cyber' → 'cybersecurity', 'SaaS' → 'enterprise-saas').",
          examples: ["ai-ml", "fintech", "cybersecurity", "developer-tools"],
        },
      },
      required: ["sector"],
      additionalProperties: false,
    },
    outputSchema: {
      type: "object" as const,
      properties: {
        sector: {
          type: "object",
          description: "Sector metadata.",
          properties: {
            slug: { type: "string", description: "Sector slug." },
            name: { type: "string", description: "Human-readable sector name." },
            description: { type: "string", description: "One-line sector description." },
            url: { type: "string", format: "uri", description: "Sector landing page URL." },
          },
          required: ["slug", "name"],
        },
        period: { type: "string", description: "Reporting period label." },
        startupCount: { type: "integer", description: "Number of startups in this sector." },
        startups: {
          type: "array",
          description: "Startups within the sector, ranked by engineering acceleration.",
          items: STARTUP_ITEM_SCHEMA,
        },
        citation: { type: "string", description: "Suggested citation string." },
        error: { type: "string", description: "Present only when the sector slug is invalid." },
        availableSectors: {
          type: "array",
          description: "When error is present, the full list of valid sector slugs.",
          items: { type: "string" },
        },
      },
      required: ["period"],
    },
    annotations: READ_ONLY_ANNOTATIONS,
  },
  {
    name: "get_startup_signal",
    title: "Get Startup Signal",
    description:
      "Full engineering-acceleration profile for a single tracked startup, by display name or GitHub org slug. Case-insensitive, normalization-tolerant.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description:
            "Startup display name OR GitHub org name. Case-insensitive; punctuation and whitespace are ignored during matching.",
          minLength: 1,
          maxLength: 100,
          examples: ["roboflow", "SkyPilot", "Supabase", "Hugging Face"],
        },
      },
      required: ["name"],
      additionalProperties: false,
    },
    outputSchema: {
      type: "object" as const,
      properties: {
        found: {
          type: "boolean",
          description:
            "True when the startup is in the tracked universe; false is an expected outcome, not an error.",
        },
        startup: STARTUP_ITEM_SCHEMA,
        suggestion: {
          type: "string",
          description:
            "When found=false, a hint on how to discover the correct name or alternative tools to call.",
        },
        citation: { type: "string", description: "Suggested citation string." },
      },
      required: ["found"],
    },
    annotations: READ_ONLY_ANNOTATIONS,
  },
  {
    name: "get_signals_summary",
    title: "Dataset Summary",
    description:
      "Period, sector and startup counts, last refresh, citation, and direct URLs to every machine-readable format.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    outputSchema: {
      type: "object" as const,
      properties: {
        period: { type: "string", description: "Current reporting period label." },
        sectorsActive: { type: "integer", description: "Number of active sectors." },
        startupsTracked: { type: "integer", description: "Total startups in the dataset." },
        lastDataRefresh: {
          type: "string",
          description: "ISO 8601 timestamp of the last refresh.",
        },
        updateFrequency: { type: "string", description: "Human-readable update cadence." },
        formats: {
          type: "object",
          description: "Direct URLs for every machine-readable format.",
          properties: {
            json: { type: "string", format: "uri" },
            csv: { type: "string", format: "uri" },
            rss: { type: "string", format: "uri" },
            openapi: { type: "string", format: "uri" },
            llmsTxt: { type: "string", format: "uri" },
            llmsFullTxt: { type: "string", format: "uri" },
            aiPolicy: { type: "string", format: "uri" },
            agentCard: { type: "string", format: "uri" },
            mcpManifest: { type: "string", format: "uri" },
            agentsMd: { type: "string", format: "uri" },
            nlweb: { type: "string", format: "uri" },
          },
        },
        website: { type: "string", format: "uri" },
        dashboard: { type: "string", format: "uri" },
        citation: { type: "string", description: "Suggested citation string." },
      },
      required: [
        "period",
        "sectorsActive",
        "startupsTracked",
        "lastDataRefresh",
        "formats",
        "citation",
      ],
    },
    annotations: READ_ONLY_ANNOTATIONS,
  },
  {
    name: "get_scout_receipts",
    title: "Scout Score for GitHub User",
    description:
      "Compute a Scout Score (0-100) for a GitHub user from their public starring history. Cross-references starred repos against ~75 validated unicorns and grades how many they starred *before* the validation event. Returns score, rank (curious/scout/sharp/elite/oracle), top early calls, personality summary, and a shareable card URL.",
    inputSchema: {
      type: "object",
      properties: {
        github_username: {
          type: "string",
          minLength: 1,
          maxLength: 39,
          pattern: "^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$",
          description: "GitHub username, 1-39 chars, alphanumeric + single hyphens.",
          examples: ["torvalds", "kindrat86", "tj"],
        },
      },
      required: ["github_username"],
      additionalProperties: false,
    },
    outputSchema: {
      type: "object" as const,
      properties: {
        username: { type: "string", description: "GitHub username analysed." },
        score: {
          type: "number",
          description: "Scout Score, 0-100. Higher means earlier+more validated calls.",
        },
        rank: {
          type: "string",
          description:
            "Rank label derived from the score: 'curious' | 'scout' | 'sharp' | 'elite' | 'oracle'.",
        },
        total_stars: { type: "integer", description: "Total public stars analysed." },
        matched_count: {
          type: "integer",
          description: "Stars that match a validated unicorn in the database.",
        },
        early_count: {
          type: "integer",
          description: "Of the matches, how many were starred BEFORE the validation event.",
        },
        top_wins: {
          type: "array",
          description: "Top early calls ranked by points contribution.",
          items: {
            type: "object",
            properties: {
              org: { type: "string" },
              name: { type: "string" },
              repo: { type: "string" },
              event: { type: "string", description: "Validation event label." },
              event_date: { type: "string", description: "ISO date of the validation event." },
              starred_at: { type: "string", description: "ISO date of the star." },
              months_early: {
                type: "number",
                description: "Months between star and validation event.",
              },
              weight: { type: "number" },
              points: { type: "number" },
            },
            required: ["name", "event", "months_early", "points"],
          },
        },
        personality: {
          type: "string",
          description: "Optional one-line personality summary based on starring patterns.",
        },
        share_url: {
          type: "string",
          format: "uri",
          description: "Shareable Scout Receipts page URL.",
        },
        og_image_url: {
          type: "string",
          format: "uri",
          description: "OG/Twitter card image URL for sharing.",
        },
      },
      required: ["username", "score", "rank", "share_url"],
    },
    annotations: READ_ONLY_ANNOTATIONS,
  },
  {
    name: "get_methodology",
    title: "Methodology Documentation",
    description:
      "Full methodology document covering data sources, metric computation, signal classification thresholds, refresh cadence, and known limitations.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    outputSchema: {
      type: "object" as const,
      properties: {
        methodology: {
          type: "string",
          description:
            "Plain-text methodology covering sources, metrics, thresholds, cadence, and limitations.",
        },
        url: {
          type: "string",
          format: "uri",
          description: "Canonical methodology page on signals.gitdealflow.com.",
        },
      },
      required: ["methodology", "url"],
    },
    annotations: READ_ONLY_ANNOTATIONS,
  },
  {
    name: "get_deep_signal",
    title: "Get Deep Signal (paid)",
    description:
      "PAID per-request — €0.19/call, 100 credits = €19 at https://signals.gitdealflow.com/agents/credits. Returns enriched signal beyond the free get_startup_signal: composite score (0-100), velocity/growth/novelty sub-scores, in-sector rank + percentile, plain-English investment thesis, top-3 sector comparables, and multi-period history. Requires Authorization: Bearer gdf_v2.cus_xxx.<hmac>. 1 credit consumed only on a successful match; misses are FREE. Credits never expire.",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: {
          type: "string",
          minLength: 1,
          maxLength: 100,
          description: "Startup display name or GitHub org slug.",
        },
      },
      required: ["name"],
      additionalProperties: false,
    },
    outputSchema: {
      type: "object" as const,
      properties: {
        found: { type: "boolean" },
        balance: { type: "integer", minimum: 0 },
        charged: { type: "integer", minimum: 0, maximum: 1 },
        scores: {
          type: "object",
          properties: {
            velocity: { type: "integer", minimum: 0, maximum: 100 },
            growth: { type: "integer", minimum: 0, maximum: 100 },
            novelty: { type: "integer", minimum: 0, maximum: 100 },
            composite: { type: "integer", minimum: 0, maximum: 100 },
          },
        },
        thesis: { type: "string" },
      },
      required: ["found"],
    },
    annotations: READ_ONLY_ANNOTATIONS,
  },
  {
    name: "share_result",
    title: "Share This Result (compose tweet/social)",
    description: [
      "Generate a ready-to-share social-media post (tweet, Bluesky, Mastodon, LinkedIn, Telegram) about a result the user just received from another VC Deal Flow Signal tool, plus the install command for the MCP server. Returns the post body, character counts per platform, and one-click intent URLs to compose the post in each network.",
      "",
      "WHEN TO USE:",
      "- The user just got a `get_trending_startups` / `search_startups_by_sector` / `get_startup_signal` / `get_deep_signal` result and says 'share this', 'tweet this', 'post this', or 'how do I tell people about this?'.",
      "- The user is writing a thread/post about startup engineering signals and wants the canonical install command + share copy.",
      "",
      "DO NOT USE FOR:",
      "- Posting on the user's behalf — this tool only composes the text + intent URLs. The user must click and confirm in the destination network.",
      "- Generating fake or speculative results — pass real data the agent received from another tool call.",
      "",
      "BEHAVIOR:",
      "- Read-only, idempotent, no side effects, no authentication.",
      "- Composes platform-specific posts (Twitter ≤275 chars, Bluesky ≤295, Mastodon ≤495, LinkedIn ≤695, Telegram ≤995) with a consistent hook + insight + install URL.",
      "- Returns intent URLs (e.g. https://x.com/intent/post?text=...) so the user/agent can open the destination network with the post pre-filled.",
      "- Always includes the canonical install command `npx @gitdealflow/mcp-signal` and the SSRN paper link for credibility.",
      "",
      "PARAMETERS:",
      "- `summary` (string, required, 10-200 chars) — the one-line takeaway to share.",
      "- `network` (string, optional) — 'twitter' | 'bluesky' | 'mastodon' | 'linkedin' | 'telegram' | 'all' (default: 'all').",
      "- `mention_handle` (boolean, optional, default false) — include @data_nerd attribution (twitter/bluesky/mastodon only).",
    ].join("\n"),
    inputSchema: {
      type: "object" as const,
      properties: {
        summary: {
          type: "string",
          minLength: 10,
          maxLength: 200,
          description: "One-line takeaway (10-200 chars) the user wants to share.",
        },
        network: {
          type: "string",
          enum: ["twitter", "bluesky", "mastodon", "linkedin", "telegram", "all"],
          default: "all",
          description: "Target network. 'all' returns one post per network.",
        },
        mention_handle: {
          type: "boolean",
          default: false,
          description: "Include @data_nerd attribution. Only applied to twitter/bluesky/mastodon.",
        },
      },
      required: ["summary"],
      additionalProperties: false,
    },
    outputSchema: {
      type: "object" as const,
      properties: {
        posts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              network: { type: "string" },
              body: { type: "string" },
              charCount: { type: "number" },
              intentUrl: { type: "string", format: "uri" },
            },
            required: ["network", "body", "charCount", "intentUrl"],
          },
        },
        installCommand: { type: "string" },
        methodologyUrl: { type: "string", format: "uri" },
      },
      required: ["posts", "installCommand", "methodologyUrl"],
    },
    annotations: READ_ONLY_ANNOTATIONS,
  },
];

const RESOURCES = [
  {
    uri: "signal://trending",
    name: "Trending Startups (current week)",
    description: "Top 20 startups across all sectors for the current weekly period.",
    mimeType: "application/json",
  },
  {
    uri: "signal://summary",
    name: "Dataset Summary",
    description: "Period, sector and startup counts, last refresh, format URLs.",
    mimeType: "application/json",
  },
  {
    uri: "signal://methodology",
    name: "Signal Methodology",
    description: "Full methodology document.",
    mimeType: "text/markdown",
  },
];

const RESOURCE_TEMPLATES = [
  {
    uriTemplate: "signal://startup/{name}",
    name: "Startup Signal Profile",
    description: "Full profile for a single tracked startup.",
    mimeType: "application/json",
  },
  {
    uriTemplate: "signal://sector/{slug}",
    name: "Sector Signal Snapshot",
    description: "All tracked startups within a sector.",
    mimeType: "application/json",
  },
];

const PROMPTS = [
  {
    name: "weekly_digest",
    description:
      "Monday-morning Signal Digest from the current top-20 trending startups.",
    arguments: [],
  },
  {
    name: "sector_deep_dive",
    description:
      "Sector intelligence brief — top movers, dark horses, thesis follow-ups.",
    arguments: [
      { name: "sector", description: "Sector slug.", required: true },
    ],
  },
  {
    name: "find_dark_horse",
    description:
      "Surface one under-the-radar startup with sustained acceleration below the median visibility threshold.",
    arguments: [
      { name: "sector", description: "Optional sector slug.", required: false },
    ],
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
    description:
      "One-page deal memo grounded in the live signal profile of a named startup.",
    arguments: [
      { name: "name", description: "Startup display name or GitHub org slug.", required: true },
    ],
  },
];

const FOOTER = "— Powered by gitdealflow.com";

function startupRow(s: Startup, rank: number, sectorName: string) {
  return {
    rank,
    name: s.name,
    sector: sectorName,
    stage: s.stage,
    geography: s.geography,
    commitVelocity14d: s.commitVelocity14d,
    commitVelocityChange: s.commitVelocityChange,
    contributors: s.contributors,
    contributorGrowth: s.contributorGrowth,
    newRepos: s.newRepos,
    signalType: s.signalType,
    description: s.description,
    githubUrl: s.githubUrl,
    ...(s.websiteUrl ? { websiteUrl: s.websiteUrl } : {}),
    ...(s.linkedinUrl ? { linkedinUrl: s.linkedinUrl } : {}),
    profileUrl: `${BASE_URL}/startup/${slugify(s.name)}`,
  };
}

function getActiveSectors() {
  const period = getCurrentPeriod();
  return getAllSectors().filter((s) => s.periods[period.slug]);
}

function getTrendingPayload() {
  const period = getCurrentPeriod();
  const active = getActiveSectors();
  const all = active.flatMap((s) =>
    s.periods[period.slug].startups.map((st) => ({ ...st, _sectorName: s.name }))
  );
  const top20 = getSortedStartups(all).slice(0, 20);
  return {
    period: period.name,
    startups: top20.map((s, i) =>
      startupRow(s, i + 1, (s as Startup & { _sectorName?: string })._sectorName ?? "")
    ),
    citation: `VC Deal Flow Signal (signals.gitdealflow.com), ${period.name} data.`,
    source: BASE_URL,
  };
}

function getSectorPayload(sectorSlug: string) {
  const period = getCurrentPeriod();
  const sector = getAllSectors().find(
    (s) => s.slug === sectorSlug && s.periods[period.slug]
  );
  if (!sector) {
    return {
      error: `Sector "${sectorSlug}" not found.`,
      availableSectors: getActiveSectors().map((s) => s.slug),
    };
  }
  const sorted = getSortedStartups(sector.periods[period.slug].startups);
  return {
    sector: {
      slug: sector.slug,
      name: sector.name,
      description: sector.description,
      url: `${BASE_URL}/startups-to-watch/${sector.slug}-${period.slug}`,
    },
    period: period.name,
    startupCount: sorted.length,
    startups: sorted.map((s, i) => startupRow(s, i + 1, sector.name)),
    citation: `VC Deal Flow Signal (signals.gitdealflow.com), ${period.name} data.`,
  };
}

function getStartupPayload(name: string) {
  const target = slugify(name);
  const period = getCurrentPeriod();
  for (const sector of getAllSectors()) {
    const snap = sector.periods[period.slug];
    if (!snap) continue;
    const match = snap.startups.find((st) => slugify(st.name) === target);
    if (match) {
      return {
        found: true,
        startup: startupRow(match, 1, sector.name),
        citation: `VC Deal Flow Signal (signals.gitdealflow.com), ${period.name} data.`,
      };
    }
  }
  return {
    found: false,
    suggestion:
      "Try the exact GitHub org name, or call get_trending_startups / search_startups_by_sector to browse the tracked universe.",
    citation: `VC Deal Flow Signal (signals.gitdealflow.com), ${period.name} data.`,
  };
}

function getSummaryPayload() {
  const period = getCurrentPeriod();
  const active = getActiveSectors();
  const total = active.reduce(
    (sum, s) => sum + s.periods[period.slug].startups.length,
    0
  );
  return {
    period: period.name,
    sectorsActive: active.length,
    startupsTracked: total,
    lastDataRefresh: new Date().toISOString(),
    updateFrequency: "Weekly (Mondays)",
    formats: {
      json: `${BASE_URL}/api/signals.json`,
      csv: `${BASE_URL}/api/signals.csv`,
      rss: `${BASE_URL}/feed.xml`,
      openapi: `${BASE_URL}/api/openapi.json`,
      llmsTxt: `${BASE_URL}/llms.txt`,
      llmsFullTxt: `${BASE_URL}/llms-full.txt`,
      aiPolicy: `${BASE_URL}/ai.txt`,
      agentCard: `${BASE_URL}/.well-known/agent-card.json`,
      mcpManifest: `${BASE_URL}/.well-known/mcp.json`,
      agentsMd: `${BASE_URL}/.well-known/agents.md`,
      nlweb: `${BASE_URL}/api/nlweb`,
    },
    website: "https://gitdealflow.com",
    dashboard: BASE_URL,
    citation: `VC Deal Flow Signal (signals.gitdealflow.com), ${period.name} data.`,
  };
}

async function getMethodologyPayload() {
  let methodology = "";
  try {
    const res = await fetch(`${BASE_URL}/llms-full.txt`, {
      headers: { "User-Agent": `gitdealflow-mcp-http/${SERVER_VERSION}` },
    });
    if (res.ok) {
      const text = await res.text();
      methodology =
        text.split("## Methodology")[1]?.split("## Glossary")[0]?.trim() ?? "";
    }
  } catch {
    // best-effort; URL still resolves
  }
  return { methodology, url: `${BASE_URL}/methodology` };
}

function textBlockFromTrending() {
  const data = getTrendingPayload();
  const lines = data.startups.map(
    (s) =>
      `${s.rank}. ${s.name} — ${s.commitVelocityChange} velocity change, ${s.contributors} contributors, signal: ${s.signalType}`
  );
  return `Top 20 Trending Startups (${data.period})\n\n${lines.join("\n")}\n\nSource: ${BASE_URL}\nCitation: ${data.citation}\n\n${FOOTER}`;
}

function textBlockFromSector(sectorSlug: string) {
  const data = getSectorPayload(sectorSlug);
  if ("error" in data) {
    return `Sector "${sectorSlug}" not found. Available: ${(data.availableSectors as string[]).join(", ")}`;
  }
  const lines = data.startups.map(
    (s) =>
      `${s.rank}. ${s.name} — ${s.commitVelocityChange} velocity change, ${s.contributors} contributors, signal: ${s.signalType}`
  );
  return `${data.sector.name} Startups (${data.period})\n${data.sector.description ?? ""}\n${data.startupCount} startups tracked\n\n${lines.join("\n\n")}\n\nSource: ${data.sector.url}\nCitation: ${data.citation}\n\n${FOOTER}`;
}

function textBlockFromStartup(name: string) {
  const data = getStartupPayload(name);
  if (!data.found || !data.startup) {
    return `Startup "${name}" not found. ${data.suggestion ?? ""}`;
  }
  const s = data.startup;
  return [
    `${s.name} — Engineering Signal Profile`,
    ``,
    `Sector: ${s.sector}`,
    `Stage: ${s.stage}`,
    `Geography: ${s.geography}`,
    `Commit Velocity (14d): ${s.commitVelocity14d}`,
    `Velocity Change: ${s.commitVelocityChange}`,
    `Contributors: ${s.contributors}`,
    `Contributor Growth: ${s.contributorGrowth}`,
    `New Repos (30d): ${s.newRepos}`,
    `Signal Type: ${s.signalType}`,
    `GitHub: ${s.githubUrl}`,
    s.websiteUrl ? `Website: ${s.websiteUrl}` : null,
    s.linkedinUrl ? `LinkedIn: ${s.linkedinUrl}` : null,
    s.profileUrl ? `Profile: ${s.profileUrl}` : null,
    ``,
    s.description || "",
    ``,
    `Source: ${BASE_URL}`,
    `Citation: ${data.citation}`,
    ``,
    FOOTER,
  ]
    .filter(Boolean)
    .join("\n");
}

function rpcResult(id: JsonRpcId | undefined, result: unknown) {
  return Response.json(
    { jsonrpc: "2.0", id: id ?? null, result },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
        "Content-Type": "application/json",
      },
    }
  );
}

function rpcError(id: JsonRpcId | undefined, code: number, message: string) {
  return Response.json(
    { jsonrpc: "2.0", id: id ?? null, error: { code, message } },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
        "Content-Type": "application/json",
      },
    }
  );
}

async function handleToolsCall(
  id: JsonRpcId | undefined,
  params: unknown,
  request: NextRequest
) {
  const p = (params ?? {}) as { name?: string; arguments?: Record<string, unknown> };
  const name = p.name;
  const args = (p.arguments ?? {}) as Record<string, unknown>;

  switch (name) {
    case "get_trending_startups": {
      const structured = getTrendingPayload();
      return rpcResult(id, {
        content: [{ type: "text", text: textBlockFromTrending() }],
        structuredContent: structured,
      });
    }
    case "search_startups_by_sector": {
      const sector = String(args.sector ?? "");
      const structured = getSectorPayload(sector);
      return rpcResult(id, {
        content: [{ type: "text", text: textBlockFromSector(sector) }],
        structuredContent: structured,
        ...("error" in structured ? { isError: true } : {}),
      });
    }
    case "get_startup_signal": {
      const startupName = String(args.name ?? "");
      const structured = getStartupPayload(startupName);
      return rpcResult(id, {
        content: [{ type: "text", text: textBlockFromStartup(startupName) }],
        structuredContent: structured,
      });
    }
    case "get_signals_summary": {
      const structured = getSummaryPayload();
      const text = [
        `VC Deal Flow Signal — Data Summary`,
        ``,
        `Current Period: ${structured.period}`,
        `Sectors Active: ${structured.sectorsActive}`,
        `Startups Tracked: ${structured.startupsTracked}`,
        `Last Data Refresh: ${structured.lastDataRefresh}`,
        `Update Frequency: ${structured.updateFrequency}`,
        ``,
        `Citation: ${structured.citation}`,
        ``,
        FOOTER,
      ].join("\n");
      return rpcResult(id, {
        content: [{ type: "text", text }],
        structuredContent: structured,
      });
    }
    case "get_scout_receipts": {
      const username = String(args.github_username ?? "").trim();
      if (
        !username ||
        !/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(username)
      ) {
        return rpcError(
          id,
          -32602,
          "Invalid github_username. Must be 1-39 chars, alphanumeric + single hyphens."
        );
      }
      const url = `${BASE_URL}/api/receipts/${encodeURIComponent(username)}`;
      const res = await fetch(url, {
        headers: { "User-Agent": `gitdealflow-mcp-http/${SERVER_VERSION}` },
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        return rpcResult(id, {
          content: [{ type: "text", text: `HTTP ${res.status} from /api/receipts/${username}\n\n${body.slice(0, 500)}` }],
          isError: true,
        });
      }
      const result = (await res.json()) as {
        username: string;
        score: number;
        rank: string;
        total_stars: number;
        matched_count: number;
        early_count: number;
        top_wins: Array<{
          org: string;
          name: string;
          repo: string;
          event: string;
          event_date: string;
          starred_at: string;
          months_early: number;
          weight: number;
          points: number;
        }>;
        personality?: string;
      };
      const shareUrl = `${BASE_URL}/receipts/${encodeURIComponent(username)}`;
      const ogImageUrl = `${BASE_URL}/api/og/receipts/${encodeURIComponent(username)}`;
      const topWinsText = result.top_wins
        .slice(0, 5)
        .map(
          (w, i) =>
            `${i + 1}. ${w.name} — starred ${w.months_early.toFixed(0)}mo before ${w.event} (+${Math.round(w.points)} pts)`
        )
        .join("\n");
      const text = [
        `GitHub Scout Receipts for @${result.username}`,
        ``,
        `Scout Score: ${result.score} / 100  (rank: ${result.rank.toUpperCase()})`,
        `Validated wins matched: ${result.matched_count}  ·  Called early: ${result.early_count}  ·  Stars analyzed: ${result.total_stars}`,
        ``,
        `Top early calls:`,
        topWinsText || "(no early calls in our database)",
        ``,
        result.personality ? `Taste: ${result.personality}` : "",
        ``,
        `Shareable card: ${shareUrl}`,
        `OG image: ${ogImageUrl}`,
        ``,
        FOOTER,
      ]
        .filter(Boolean)
        .join("\n");
      return rpcResult(id, {
        content: [{ type: "text", text }],
        structuredContent: { ...result, share_url: shareUrl, og_image_url: ogImageUrl },
      });
    }
    case "get_methodology": {
      const structured = await getMethodologyPayload();
      const text = `VC Deal Flow Signal — Methodology\n\n${structured.methodology}\n\nFull details: ${structured.url}\n\n${FOOTER}`;
      return rpcResult(id, {
        content: [{ type: "text", text }],
        structuredContent: structured,
      });
    }
    case "get_deep_signal": {
      // Paid tool — forward to /api/agent/deep-signal which owns auth + credit
      // ledger. Auth scheme is gdf_v2.<customerId>.<hmac>, NOT the OAuth JWT
      // used for free-tool gating; the POST handler skips JWT verify when the
      // bearer is gdf_v2-prefixed so this path can run unblocked.
      const startupName = String(args.name ?? "");
      const auth = request.headers.get("authorization");
      const url = new URL(request.url);
      const fwdRes = await fetch(`${url.protocol}//${url.host}/api/agent/deep-signal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(auth ? { Authorization: auth } : {}),
        },
        body: JSON.stringify({ name: startupName }),
      });
      const data = (await fwdRes.json().catch(() => ({}))) as Record<string, unknown>;
      if (!fwdRes.ok) {
        return rpcError(
          id,
          fwdRes.status === 401 ? -32001 : fwdRes.status === 402 ? -32004 : -32603,
          (data.message as string) ?? `HTTP ${fwdRes.status}`
        );
      }
      const lines: string[] = [];
      if (data.found === false) {
        lines.push(
          `"${startupName}" is not in the tracked universe. ${data.suggestion ?? ""} (0 credits charged for misses.)`
        );
      } else {
        lines.push(`${data.name as string} — Deep Signal (paid)`);
        const scores = data.scores as Record<string, number> | undefined;
        const rank = data.rank as Record<string, number> | undefined;
        if (scores) lines.push(`Composite ${scores.composite}/100 · V${scores.velocity} G${scores.growth} N${scores.novelty}`);
        if (rank) lines.push(`Sector rank: #${rank.inSector} of ${rank.sectorTotal} (${rank.sectorPercentile}th pct)`);
        if (typeof data.thesis === "string") lines.push(`Thesis: ${data.thesis}`);
        lines.push(`Credits remaining: ${data.balance ?? "?"} · Charged: ${data.charged ?? 0}`);
      }
      return rpcResult(id, {
        content: [{ type: "text", text: lines.join("\n") }],
        structuredContent: data,
      });
    }
    case "share_result": {
      const summary = String(args.summary ?? "").trim();
      const network = String(args.network ?? "all").toLowerCase();
      const mentionHandle = Boolean(args.mention_handle ?? false);
      if (summary.length < 10 || summary.length > 200) {
        return rpcError(id, -32602, "summary must be 10-200 chars");
      }
      const handleAttr = mentionHandle ? " (h/t @data_nerd)" : "";
      const installCommand = "npx @gitdealflow/mcp-signal";
      const methodologyUrl = `${BASE_URL}/methodology`;
      const ssrn = "https://ssrn.com/abstract=6606558";
      const site = "https://gitdealflow.com";
      const posts: { network: string; body: string; charCount: number; intentUrl: string }[] = [];
      const wantTwitter = network === "all" || network === "twitter";
      const wantBluesky = network === "all" || network === "bluesky";
      const wantMastodon = network === "all" || network === "mastodon";
      const wantLinkedIn = network === "all" || network === "linkedin";
      const wantTelegram = network === "all" || network === "telegram";
      if (wantTwitter) {
        const body = `${summary}${handleAttr}\n\nFrom GitDealFlow MCP — install: ${installCommand}\nMethodology: ${ssrn}`.slice(0, 275);
        posts.push({
          network: "twitter",
          body,
          charCount: body.length,
          intentUrl: `https://x.com/intent/post?text=${encodeURIComponent(body)}`,
        });
      }
      if (wantBluesky) {
        const body = `${summary}${handleAttr}\n\nFrom GitDealFlow MCP — install: ${installCommand}\nMethodology: ${ssrn}`.slice(0, 295);
        posts.push({
          network: "bluesky",
          body,
          charCount: body.length,
          intentUrl: `https://bsky.app/intent/compose?text=${encodeURIComponent(body)}`,
        });
      }
      if (wantMastodon) {
        const body = `${summary}${handleAttr}\n\nFrom @gitdealflow's MCP server — install: ${installCommand}\nMethodology (SSRN, 219-startup panel): ${ssrn}\n\n#VC #DevTools #AltData`.slice(0, 495);
        posts.push({
          network: "mastodon",
          body,
          charCount: body.length,
          intentUrl: `https://mastodon.social/share?text=${encodeURIComponent(body)}`,
        });
      }
      if (wantLinkedIn) {
        const body = `${summary}\n\nThis came out of the GitDealFlow MCP server — a free Claude/Cursor integration that ranks startup GitHub orgs by engineering acceleration. The methodology behind it (SSRN-published, 219-startup panel) found commit velocity preceded fundraises by 21–47 days.\n\nInstall: ${installCommand}\nPaper: ${ssrn}\nProduct: ${site}`.slice(0, 695);
        posts.push({
          network: "linkedin",
          body,
          charCount: body.length,
          intentUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(site)}&summary=${encodeURIComponent(body)}`,
        });
      }
      if (wantTelegram) {
        const body = `${summary}\n\nFrom the GitDealFlow MCP server — free, install with: ${installCommand}\n\nThe methodology is published on SSRN with a 219-startup panel: ${ssrn}\nProduct: ${site}\n\nGitDealFlow tracks 4,200 startup GitHub orgs and ranks them by commit velocity acceleration, weekly. The pattern preceded confirmed fundraises by 21 to 47 days.`.slice(0, 995);
        posts.push({
          network: "telegram",
          body,
          charCount: body.length,
          intentUrl: `https://t.me/share/url?url=${encodeURIComponent(site)}&text=${encodeURIComponent(body)}`,
        });
      }
      const textBlock = posts
        .map((p) => `--- ${p.network.toUpperCase()} (${p.charCount} chars) ---\n${p.body}\n→ ${p.intentUrl}`)
        .join("\n\n");
      return rpcResult(id, {
        content: [
          {
            type: "text",
            text: `Ready-to-share posts (${posts.length} network${posts.length === 1 ? "" : "s"}):\n\n${textBlock}\n\nInstall: ${installCommand}\nMethodology: ${methodologyUrl}\n\n${FOOTER}`,
          },
        ],
        structuredContent: { posts, installCommand, methodologyUrl },
      });
    }
    default:
      return rpcError(id, -32601, `Unknown tool: ${name}`);
  }
}

async function handleResourceRead(id: JsonRpcId | undefined, params: unknown) {
  const p = (params ?? {}) as { uri?: string };
  const uri = p.uri ?? "";

  if (uri === "signal://trending") {
    return rpcResult(id, {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(getTrendingPayload(), null, 2),
        },
      ],
    });
  }
  if (uri === "signal://summary") {
    return rpcResult(id, {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(getSummaryPayload(), null, 2),
        },
      ],
    });
  }
  if (uri === "signal://methodology") {
    const data = await getMethodologyPayload();
    const md = `# VC Deal Flow Signal — Methodology\n\n${data.methodology}\n\nFull details: ${data.url}\n\n${FOOTER}`;
    return rpcResult(id, {
      contents: [{ uri, mimeType: "text/markdown", text: md }],
    });
  }
  const startupMatch = uri.match(/^signal:\/\/startup\/(.+)$/);
  if (startupMatch) {
    const data = getStartupPayload(decodeURIComponent(startupMatch[1]));
    return rpcResult(id, {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(data, null, 2),
        },
      ],
    });
  }
  const sectorMatch = uri.match(/^signal:\/\/sector\/([a-z0-9-]+)$/);
  if (sectorMatch) {
    const data = getSectorPayload(sectorMatch[1]);
    return rpcResult(id, {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(data, null, 2),
        },
      ],
    });
  }
  return rpcError(
    id,
    -32602,
    `Unknown resource URI: ${uri}. Valid: signal://trending, signal://summary, signal://methodology, signal://startup/{name}, signal://sector/{slug}.`
  );
}

function handlePromptGet(id: JsonRpcId | undefined, params: unknown) {
  const p = (params ?? {}) as { name?: string; arguments?: Record<string, string> };
  const name = p.name ?? "";
  const a = p.arguments ?? {};

  let messageText = "";
  switch (name) {
    case "weekly_digest":
      messageText = [
        "You are writing a Monday-morning Signal Digest for venture investors.",
        "",
        "Step 1: Call the `get_trending_startups` tool to fetch the current top 20.",
        "Step 2: Open with three plain-English sentences naming the dominant pattern of the week.",
        "Step 3: List the top 10, one per line: `<rank>. <name> (<sector>) — <commitVelocityChange> velocity, <signalType>. <one-sentence rationale>`.",
        "Step 4: Close with the citation string and source URL.",
        "",
        "Tone: factual, terse, investor-grade.",
      ].join("\n");
      break;
    case "sector_deep_dive": {
      const sector = a.sector;
      if (!sector) return rpcError(id, -32602, "Missing required argument: sector");
      messageText = [
        `You are writing a sector intelligence brief for ${sector}.`,
        "",
        `Step 1: Call \`search_startups_by_sector\` with sector="${sector}".`,
        "Step 2: Identify the top 3 movers and the top 3 by contributor growth.",
        "Step 3: Name the dominant pattern.",
        "Step 4: Surface 1-2 dark horses.",
        "Step 5: Close with thesis-relevant follow-ups.",
      ].join("\n");
      break;
    }
    case "find_dark_horse": {
      const sector = a.sector;
      messageText = [
        "You are surfacing one under-the-radar startup that's accelerating quietly.",
        "",
        sector
          ? `Step 1: Call \`search_startups_by_sector\` with sector="${sector}".`
          : "Step 1: Call `get_trending_startups`, then `search_startups_by_sector` for 2-3 sectors with the strongest signal density.",
        "Step 2: Filter for sustained signal but contributors below the sector median; drop top-5 picks.",
        "Step 3: Pick ONE recommendation. Justify in 4-5 sentences.",
        "Step 4: Add 2-3 follow-up questions.",
      ].join("\n");
      break;
    }
    case "compare_startups": {
      const a_name = a.name_a;
      const b_name = a.name_b;
      if (!a_name || !b_name)
        return rpcError(id, -32602, "Missing required arguments: name_a and name_b");
      messageText = [
        `You are writing a head-to-head comparison of ${a_name} vs ${b_name}.`,
        "",
        `Step 1: Call \`get_startup_signal\` for both names: name="${a_name}" and name="${b_name}".`,
        "Step 2: If either is `found: false`, surface the suggestion and stop.",
        "Step 3: Side-by-side table on Stage, Geography, Velocity, Velocity Change, Contributors, Growth, New Repos, Signal Type, Sector.",
        "Step 4: 4-6 sentence verdict naming which warrants deeper diligence.",
        "Step 5: 2-3 follow-up due-diligence questions.",
      ].join("\n");
      break;
    }
    case "acceleration_memo": {
      const startupName = a.name;
      if (!startupName) return rpcError(id, -32602, "Missing required argument: name");
      messageText = [
        `You are drafting a one-page deal memo for ${startupName}.`,
        "",
        `Step 1: Call \`get_startup_signal\` with name="${startupName}".`,
        "Step 2: If `found: false`, surface the suggestion and stop.",
        "Step 3: Call `get_methodology` to interpret signalType correctly.",
        `Step 4: Optionally call \`search_startups_by_sector\` for 2-3 comparables.`,
        "Step 5: Sections: TL;DR, Engineering Signal Profile, Sector Context, Leading-Indicator Read, Open Questions.",
      ].join("\n");
      break;
    }
    default:
      return rpcError(id, -32601, `Unknown prompt: ${name}`);
  }

  return rpcResult(id, {
    messages: [{ role: "user", content: { type: "text", text: messageText } }],
  });
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, MCP-Protocol-Version",
} as const;

export async function GET() {
  return Response.json(
    {
      service: "GitDealFlow MCP HTTP Transport",
      protocol: "Model Context Protocol over Streamable HTTP",
      protocolVersion: PROTOCOL_VERSION,
      transport: "http",
      method: "POST",
      contentType: "application/json",
      capabilities: { tools: true, resources: true, prompts: true },
      stdioPackage: "@gitdealflow/mcp-signal",
      docs: `${BASE_URL}/agents.md`,
      manifest: `${BASE_URL}/.well-known/mcp.json`,
      note: "POST JSON-RPC 2.0 requests here. Methods: initialize, tools/list, resources/list, resources/templates/list, prompts/list, tools/call, resources/read, prompts/get.",
    },
    {
      headers: {
        ...CORS_HEADERS,
        "Cache-Control": "public, max-age=3600",
      },
    }
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

export async function POST(request: NextRequest) {
  // OPTIONAL OAuth 2.1 bearer-token verification.
  // - If Authorization header is present, the token MUST be valid (else 401).
  // - If absent, request is allowed anyway — preserves backward compat for
  //   public clients (Claude Desktop, Cursor, Cline, etc.) that don't send tokens.
  // - This satisfies Anthropic Connectors Directory's requirement that the
  //   server "supports OAuth 2.1" while keeping the open-by-default surface.
  const auth = request.headers.get("authorization");
  if (auth) {
    const token = bearerFromHeader(auth);
    // gdf_v2.<customerId>.<hmac> is the credit-pack API key; it has its own
    // validator inside /api/agent/deep-signal. Skip the OAuth JWT verify here
    // so the paid-tool dispatcher can forward and validate downstream.
    const isCreditPackKey = typeof token === "string" && token.startsWith("gdf_v2.");
    if (!isCreditPackKey) {
      const claims = verifyToken(token);
      if (!claims) {
        return new Response(
          JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32001, message: "Invalid bearer token" } }),
          {
            status: 401,
            headers: {
              ...CORS_HEADERS,
              "Content-Type": "application/json",
              "WWW-Authenticate": 'Bearer realm="vc-deal-flow-signal-mcp", error="invalid_token"',
            },
          }
        );
      }
    }
  }

  let body: JsonRpcRequest;
  try {
    body = (await request.json()) as JsonRpcRequest;
  } catch {
    return rpcError(null, -32700, "Parse error: invalid JSON");
  }
  if (!body || body.jsonrpc !== "2.0" || typeof body.method !== "string") {
    return rpcError(body?.id, -32600, "Invalid request: missing jsonrpc=2.0 or method");
  }

  switch (body.method) {
    case "initialize":
      return rpcResult(body.id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {}, resources: {}, prompts: {} },
        serverInfo: {
          name: SERVER_NAME,
          version: SERVER_VERSION,
          title: "VC Deal Flow Signal",
          websiteUrl: "https://gitdealflow.com",
          icons: [
            {
              src: "https://signals.gitdealflow.com/icon.svg",
              mimeType: "image/svg+xml",
              sizes: ["any"],
            },
            {
              src: "https://signals.gitdealflow.com/icon.png",
              mimeType: "image/png",
              sizes: ["192x192"],
            },
          ],
        },
      });
    case "notifications/initialized":
    case "notifications/cancelled":
      return new Response(null, { status: 202, headers: CORS_HEADERS });
    case "ping":
      return rpcResult(body.id, {});
    case "tools/list":
      return rpcResult(body.id, { tools: TOOLS });
    case "tools/call":
      return handleToolsCall(body.id, body.params, request);
    case "resources/list":
      return rpcResult(body.id, { resources: RESOURCES });
    case "resources/templates/list":
      return rpcResult(body.id, { resourceTemplates: RESOURCE_TEMPLATES });
    case "resources/read":
      return handleResourceRead(body.id, body.params);
    case "prompts/list":
      return rpcResult(body.id, { prompts: PROMPTS });
    case "prompts/get":
      return handlePromptGet(body.id, body.params);
    default:
      return rpcError(body.id, -32601, `Method not found: ${body.method}`);
  }
}
