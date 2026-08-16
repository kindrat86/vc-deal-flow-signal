import { NextRequest } from "next/server";
import {
  getAllSectors,
  getCurrentPeriod,
  getSortedStartups,
  type Startup,
} from "@/lib/data";
import { slugify } from "@/lib/slugify";
import { buildDossier } from "@/lib/diligence";
import { bearerFromHeader, verifyToken } from "@/lib/oauth/jwt";
import {
  approvalUrlFor,
  verifyApprovalToken,
  type ApprovalVerifyError,
} from "@/lib/mcp/share-approval-token";

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
      "Top 20 startups by engineering acceleration across all 15 sectors for the current weekly period. Read-only, idempotent.",
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
      "Every tracked startup within a sector, ranked by engineering acceleration. Sector slug must be one of 15 enumerated values.",
    inputSchema: {
      type: "object",
      properties: {
        sector: {
          type: "string",
          enum: [...SECTOR_SLUGS],
          description:
            "Sector slug from the enumerated list. Map fuzzy user input to the closest slug (e.g. 'crypto' → 'web3', 'SaaS' → 'enterprise-saas').",
          examples: ["healthcare", "web3", "gaming", "edtech"],
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
    name: "get_diligence_dossier",
    title: "Company Diligence Dossier",
    description:
      "Public-source diligence dossier for a company or entity in one cited object: who acquired it (M&A history), which funds publicly backed it, and its published engineering-acceleration signal. Use mid-diligence for 'who acquired X', 'which funds backed Y', 'what's the signal on Z'. Sources are press-release / SEC-filing / both-sides-disclosed only; returns found:false (an expected outcome, not an error) with honest notes when the entity is outside the tracked corpus, never guesses.",
    inputSchema: {
      type: "object",
      properties: {
        company: {
          type: "string",
          minLength: 1,
          maxLength: 100,
          description:
            "Company or entity name (target, acquirer, or tracked startup). Case-insensitive, normalization-tolerant.",
          examples: ["Figma", "Supabase", "Broadcom", "Auth0"],
        },
      },
      required: ["company"],
      additionalProperties: false,
    },
    outputSchema: {
      type: "object" as const,
      properties: {
        entity: { type: "string", description: "Resolved canonical entity name." },
        found: {
          type: "boolean",
          description:
            "True when at least one grounded fact exists; false is an expected outcome, not an error.",
        },
        acquiredBy: {
          type: "array",
          description: "Public acquisitions where this entity was the target.",
          items: {
            type: "object",
            properties: {
              acquirer: { type: "string" },
              year: { type: "integer" },
              announcedAmount: { type: "string" },
              note: { type: "string" },
              acquirerUrl: { type: "string", format: "uri" },
            },
          },
        },
        acquisitionsMade: {
          type: "array",
          description:
            "If the entity is itself an acquirer: notable companies it has publicly bought.",
          items: {
            type: "object",
            properties: {
              target: { type: "string" },
              year: { type: "integer" },
              announcedAmount: { type: "string" },
              note: { type: "string" },
            },
          },
        },
        backedBy: {
          type: "array",
          description:
            "Funds in our tracked corpus that publicly disclosed backing this entity.",
          items: {
            type: "object",
            properties: {
              fund: { type: "string" },
              fundUrl: { type: "string", format: "uri" },
            },
          },
        },
        signal: {
          type: ["object", "null"],
          description:
            "Published engineering-acceleration signal, when the entity is in the tracked corpus.",
        },
        notes: {
          type: "array",
          description: "Plain-language notes on what is and isn't known.",
          items: { type: "string" },
        },
      },
      required: ["entity", "found"],
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
      "PAID per-request, €0.19/call, 100 credits = €19 at https://signals.gitdealflow.com/agents/credits. Returns enriched signal beyond the free get_startup_signal: composite score (0-100), velocity/growth/novelty sub-scores, in-sector rank + percentile, plain-English investment thesis, top-3 sector comparables, and multi-period history. Requires Authorization: Bearer gdf_v2.cus_xxx.<hmac>. 1 credit consumed only on a successful match; misses are FREE. Credits never expire.",
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
      "- Posting on the user's behalf, this tool only composes the text + intent URLs. The user must click and confirm in the destination network.",
      "- Generating fake or speculative results, pass real data the agent received from another tool call.",
      "",
      "BEHAVIOR (two-step approval flow, see `approval_token`):",
      "- Step 1: call this tool with `summary` only. The server replies with an error (-32602) containing a `/share-approve?summary=...` URL the user must open.",
      "- Step 2: the user reads the proposed summary on that page, clicks Approve, and pastes the resulting 10-minute token back into the chat. Retry the tool with `approval_token` filled in and the SAME `summary` verbatim.",
      "- The token is bound to a hash of `summary`; if the agent rewrites the summary between approval and the retry, the call is rejected.",
      "- Composes platform-specific posts (Twitter ≤275 chars, Bluesky ≤295, Mastodon ≤495, LinkedIn ≤695, Telegram ≤995) with a consistent hook + insight + install URL.",
      "- Returns intent URLs (e.g. https://x.com/intent/post?text=...) so the user/agent can open the destination network with the post pre-filled.",
      "- Always includes the canonical install command `npx @gitdealflow/mcp-signal` and the SSRN paper link for credibility.",
      "",
      "PARAMETERS:",
      "- `summary` (string, required, 10-200 chars), the one-line takeaway to share.",
      "- `approval_token` (string, required after first call), the 10-minute token returned by the /share-approve page.",
      "- `network` (string, optional), 'twitter' | 'bluesky' | 'mastodon' | 'linkedin' | 'telegram' | 'all' (default: 'all').",
      "- `mention_handle` (boolean, optional, default false), include @sipiteno attribution (twitter/bluesky/mastodon only).",
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
        approval_token: {
          type: "string",
          minLength: 16,
          maxLength: 512,
          description:
            "10-minute HMAC-signed token bound to a hash of `summary`. Obtain it by directing the user to https://signals.gitdealflow.com/share-approve?summary=<urlencoded-summary>they review and click Approve, then paste the resulting token back. The first call with no token will return an error containing the exact URL to send the user to.",
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
          description: "Include @sipiteno attribution. Only applied to twitter/bluesky/mastodon.",
        },
      },
      required: ["summary", "approval_token"],
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
  {
    name: "predict_funding",
    title: "Predict Funding Likelihood (with provenance)",
    description: [
      "Transparent, scored funding-likelihood claim for one tracked startup, with the full evidence chain and citable provenance. Instead of an opaque number, returns the score, every component that produced it, a confidence level, honest caveats, and links to the methodology + SSRN paper so the derivation can be cited.",
      "",
      "IS a deterministic heuristic over public GitHub engineering-acceleration signals; IS NOT an ML black box, a guarantee of any financing event, or based on private/cap-table data. The disclaimer is returned in every response.",
      "",
      "SCORING (also returned in evidence.scoreBreakdown): velocity ≤40 (saturates +300%), contributorGrowth ≤25 (saturates +200%), newRepos ≤15 (saturates 10), signalType ≤20 (Deploy frequency spike 20 / Engineering hiring burst 17 / Infrastructure buildout 14 / Framework migration 8). Total 0-100 → >=70 high, 45-69 elevated, 25-44 moderate, <25 low.",
      "",
      "PARAMETERS: { name }, display name or GitHub org slug (case-insensitive). On no match returns { found: false, suggestion } (expected, not an error).",
    ].join("\n"),
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Startup display name or GitHub org slug. Case-insensitive.",
          minLength: 1,
          maxLength: 100,
        },
      },
      required: ["name"],
      additionalProperties: false,
    },
    outputSchema: {
      type: "object",
      properties: {
        found: { type: "boolean" },
        company: { type: "object" },
        prediction: {
          type: "object",
          properties: {
            claim: { type: "string" },
            raiseLikelihood: { type: "string", enum: ["high", "elevated", "moderate", "low"] },
            accelerationScore: { type: "integer", minimum: 0, maximum: 100 },
            estimatedWindow: { type: "string" },
            confidence: { type: "string", enum: ["high", "moderate", "low"] },
          },
        },
        evidence: { type: "object" },
        caveats: { type: "array", items: { type: "string" } },
        provenance: {
          type: "object",
          properties: {
            methodologyUrl: { type: "string", format: "uri" },
            researchPaperUrl: { type: "string", format: "uri" },
            citation: { type: "string" },
            source: { type: "string", format: "uri" },
            period: { type: "string" },
          },
          required: ["methodologyUrl", "researchPaperUrl", "citation", "source"],
        },
        disclaimer: { type: "string" },
        suggestion: { type: "string" },
      },
      required: ["found", "provenance", "disclaimer"],
    },
    annotations: READ_ONLY_ANNOTATIONS,
  },
  {
    name: "shortlist_signals",
    title: "Shortlist Strongest Signals",
    description: [
      "Return a ranked shortlist of the strongest engineering-acceleration signals matching a set of filters, the whole sourcing workflow in ONE call (e.g. 'the 5 strongest signals in healthcare in the EU'). Scans the full tracked universe, scores each with the transparent engine (same scoring as predict_funding), filters, sorts by accelerationScore desc, returns the top `limit`.",
      "",
      "GEOGRAPHY IS REGION-LEVEL ONLY, values are US / EU / UK / APAC / LATAM / Canada / Unknown. City/country aliases ('NYC', 'New York', 'London', 'Berlin', 'Singapore') normalize up to the enclosing region and the response `notes` says so. There is no city-level filtering.",
      "",
      "PARAMETERS (all optional): sector (one of 20 slugs), geography (region token or alias), signalType (exact label), minAccelerationScore (0-100), minVelocityChangePct (integer percent), limit (1-25, default 5).",
    ].join("\n"),
    inputSchema: {
      type: "object",
      properties: {
        sector: { type: "string", enum: [...SECTOR_SLUGS] },
        geography: {
          type: "string",
          description:
            "Region token (US/EU/UK/APAC/LATAM/Canada) or a city/country alias normalized up to the region.",
        },
        signalType: {
          type: "string",
          enum: [
            "Deploy frequency spike",
            "Engineering hiring burst",
            "Infrastructure buildout",
            "Framework migration",
          ],
        },
        minAccelerationScore: { type: "integer", minimum: 0, maximum: 100 },
        minVelocityChangePct: { type: "integer" },
        limit: { type: "integer", minimum: 1, maximum: 25, default: 5 },
      },
      additionalProperties: false,
    },
    outputSchema: {
      type: "object",
      properties: {
        query: { type: "object" },
        period: { type: "string" },
        consideredCount: { type: "integer" },
        matchedCount: { type: "integer" },
        results: { type: "array", items: { type: "object" } },
        notes: { type: "array", items: { type: "string" } },
        citation: { type: "string" },
        source: { type: "string", format: "uri" },
        methodologyUrl: { type: "string", format: "uri" },
        disclaimer: { type: "string" },
      },
      required: ["query", "period", "matchedCount", "results", "citation"],
    },
    annotations: READ_ONLY_ANNOTATIONS,
  },
  {
    name: "compare_signals",
    title: "Compare Signals Head-to-Head",
    description: [
      "Score and rank 2-5 named startups side by side, returning each one's acceleration score, evidence, and raise-likelihood band plus a single recommendation for which warrants deeper diligence. Same transparent scoring as predict_funding / shortlist_signals.",
      "",
      "Names that don't resolve are returned in `notFound` (expected, not an error). The recommendation is computed only over resolved companies; if fewer than 2 resolve it explains that no comparison was possible.",
      "",
      "PARAMETERS: { names: string[] }, 2 to 5 display names or GitHub org slugs (case-insensitive).",
    ].join("\n"),
    inputSchema: {
      type: "object",
      properties: {
        names: {
          type: "array",
          items: { type: "string", minLength: 1, maxLength: 100 },
          minItems: 2,
          maxItems: 5,
        },
      },
      required: ["names"],
      additionalProperties: false,
    },
    outputSchema: {
      type: "object",
      properties: {
        period: { type: "string" },
        compared: { type: "array", items: { type: "object" } },
        notFound: { type: "array", items: { type: "string" } },
        recommendation: { type: "string" },
        citation: { type: "string" },
        source: { type: "string", format: "uri" },
        methodologyUrl: { type: "string", format: "uri" },
        disclaimer: { type: "string" },
      },
      required: ["period", "compared", "recommendation", "citation"],
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
      "Sector intelligence brief, top movers, dark horses, thesis follow-ups.",
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
  {
    name: "sourcing_session",
    description:
      "Run a full sourcing session in one pass, the corp-dev / scout workflow. Shortlists the strongest engineering-acceleration signals (optionally by sector/region), then attaches a transparent, citable funding-likelihood read to each pick. Pulls live data via shortlist_signals + predict_funding.",
    arguments: [
      { name: "sector", description: "Optional sector slug to focus the shortlist (e.g. 'healthcare'). Omit to scan all.", required: false },
      { name: "geography", description: "Optional region filter (US/EU/UK/APAC/LATAM/Canada). Aliases normalize up to the region.", required: false },
      { name: "count", description: "How many companies to shortlist and score. Default 5.", required: false },
    ],
  },
  {
    name: "diligence_brief",
    description:
      "Assemble a cited one-page diligence brief for a named company: public-source dossier (M&A, backers, signal), a transparent funding-likelihood read with its evidence chain, and the methodology behind the score. Pulls live data via get_diligence_dossier + predict_funding + get_methodology.",
    arguments: [
      { name: "name", description: "Company display name or GitHub org slug.", required: true },
    ],
  },
];

const FOOTER = ", Powered by gitdealflow.com";

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

// ---------------------------------------------------------------------------
// Transparent scoring engine, shared by predict_funding / shortlist_signals /
// compare_signals. Mirrors the stdio server (@gitdealflow/mcp-signal). Every
// component and weight is returned in the response so the score is auditable.
// ---------------------------------------------------------------------------
const METHODOLOGY_URL = `${BASE_URL}/methodology`;
const RESEARCH_PAPER_URL = "https://ssrn.com/abstract=6606558";
const PREDICTION_DISCLAIMER =
  "Derived solely from public GitHub engineering-acceleration signals (commit velocity, contributor growth, new-repo creation, signal classification). This is a transparent heuristic, NOT investment advice, NOT a guarantee of any financing event, and NOT based on private, cap-table, or revenue data. Every input is returned in the evidence chain so the score can be audited and cited. See the methodology and SSRN paper for the full derivation.";

const SIGNAL_TYPE_WEIGHT: Record<string, number> = {
  "deploy frequency spike": 20,
  "engineering hiring burst": 17,
  "infrastructure buildout": 14,
  "framework migration": 8,
  breakout: 20,
  acceleration: 14,
  steady: 6,
  cooling: 0,
};

const GEO_REGIONS = ["US", "EU", "UK", "APAC", "LATAM", "Canada", "Unknown"] as const;
const GEO_ALIASES: Record<string, string> = {
  us: "US", usa: "US", "u.s.": "US", "u.s.a.": "US", america: "US",
  "united states": "US", "north america": "US", "new york": "US", nyc: "US",
  "san francisco": "US", sf: "US", "bay area": "US", "silicon valley": "US",
  boston: "US", austin: "US", seattle: "US", "los angeles": "US", la: "US",
  chicago: "US", denver: "US", miami: "US", california: "US",
  eu: "EU", europe: "EU", european: "EU", germany: "EU", berlin: "EU",
  france: "EU", paris: "EU", amsterdam: "EU", netherlands: "EU", spain: "EU",
  sweden: "EU", stockholm: "EU", ireland: "EU", dublin: "EU", lisbon: "EU",
  portugal: "EU", italy: "EU", poland: "EU", helsinki: "EU", finland: "EU",
  uk: "UK", "united kingdom": "UK", britain: "UK", england: "UK", london: "UK",
  scotland: "UK",
  apac: "APAC", asia: "APAC", "asia-pacific": "APAC", singapore: "APAC",
  india: "APAC", bangalore: "APAC", bengaluru: "APAC", china: "APAC",
  japan: "APAC", tokyo: "APAC", australia: "APAC", sydney: "APAC", korea: "APAC",
  canada: "Canada", toronto: "Canada", vancouver: "Canada", montreal: "Canada",
  latam: "LATAM", "latin america": "LATAM", brazil: "LATAM", "são paulo": "LATAM",
  mexico: "LATAM", argentina: "LATAM", chile: "LATAM", colombia: "LATAM",
};

function normalizeGeography(raw: string): { region: string | null; matchedAlias: boolean } {
  const t = raw.trim().toLowerCase();
  if (!t) return { region: null, matchedAlias: false };
  const direct = GEO_REGIONS.find((r) => r.toLowerCase() === t);
  if (direct) return { region: direct, matchedAlias: false };
  if (GEO_ALIASES[t]) return { region: GEO_ALIASES[t], matchedAlias: true };
  return { region: null, matchedAlias: false };
}

function parsePercent(raw: unknown): number | null {
  const m = /^\s*([+-]?\d+(?:\.\d+)?)/.exec(String(raw ?? ""));
  return m ? Number(m[1]) : null;
}

function clampNum(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

interface ScoreBreakdown {
  velocity: number;
  contributorGrowth: number;
  newRepos: number;
  signalType: number;
  total: number;
}

interface SignalScore {
  accelerationScore: number;
  raiseLikelihood: "high" | "elevated" | "moderate" | "low";
  estimatedWindow: string;
  confidence: "high" | "moderate" | "low";
  breakdown: ScoreBreakdown;
  velocityChangePct: number | null;
  contributorGrowthPct: number | null;
}

function scoreStartup(s: Startup): SignalScore {
  const vel = parsePercent(s.commitVelocityChange);
  const cg = parsePercent(s.contributorGrowth);
  const repos = Number.isFinite(s.newRepos) ? s.newRepos : 0;
  const velocity = vel === null ? 0 : (clampNum(vel, 0, 300) / 300) * 40;
  const contributorGrowth = cg === null ? 0 : (clampNum(cg, 0, 200) / 200) * 25;
  const newRepos = (clampNum(repos, 0, 10) / 10) * 15;
  const signalType = SIGNAL_TYPE_WEIGHT[(s.signalType ?? "").toLowerCase()] ?? 6;
  const breakdown: ScoreBreakdown = {
    velocity: Math.round(velocity * 10) / 10,
    contributorGrowth: Math.round(contributorGrowth * 10) / 10,
    newRepos: Math.round(newRepos * 10) / 10,
    signalType,
    total: 0,
  };
  const total = Math.round(velocity + contributorGrowth + newRepos + signalType);
  breakdown.total = total;
  const raiseLikelihood =
    total >= 70 ? "high" : total >= 45 ? "elevated" : total >= 25 ? "moderate" : "low";
  const estimatedWindow =
    raiseLikelihood === "high"
      ? "3-6 months (heuristic)"
      : raiseLikelihood === "elevated"
        ? "6-9 months (heuristic)"
        : raiseLikelihood === "moderate"
          ? "9-12 months (heuristic)"
          : "12+ months or no near-term signal (heuristic)";
  const missing = (vel === null ? 1 : 0) + (cg === null ? 1 : 0);
  let confidence: "high" | "moderate" | "low" = "moderate";
  if (missing === 0 && (s.contributors ?? 0) >= 5) confidence = "high";
  if (missing >= 1 || (s.contributors ?? 0) < 3) confidence = "low";
  return {
    accelerationScore: total,
    raiseLikelihood,
    estimatedWindow,
    confidence,
    breakdown,
    velocityChangePct: vel,
    contributorGrowthPct: cg,
  };
}

type UniverseRow = Startup & { sectorName: string; sectorSlug: string };

function getUniverseWithSector(): { periodName: string; citation: string; rows: UniverseRow[] } {
  const period = getCurrentPeriod();
  const active = getActiveSectors();
  const seen = new Set<string>();
  const rows: UniverseRow[] = [];
  for (const sector of active) {
    for (const st of sector.periods[period.slug].startups) {
      const key = slugify(st.name);
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({ ...st, sectorName: sector.name, sectorSlug: sector.slug });
    }
  }
  return {
    periodName: period.name,
    citation: `VC Deal Flow Signal (signals.gitdealflow.com), ${period.name} data.`,
    rows,
  };
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
      `${s.rank}. ${s.name}, ${s.commitVelocityChange} velocity change, ${s.contributors} contributors, signal: ${s.signalType}`
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
      `${s.rank}. ${s.name}, ${s.commitVelocityChange} velocity change, ${s.contributors} contributors, signal: ${s.signalType}`
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
    `${s.name}, Engineering Signal Profile`,
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

function rpcError(
  id: JsonRpcId | undefined,
  code: number,
  message: string,
  data?: unknown,
) {
  // Per JSON-RPC 2.0 §5.1, `data` is an OPTIONAL value that contains
  // additional information about the error. We use it for machine-readable
  // hints (e.g. an `approval_url` for the share_result tool).
  const error: { code: number; message: string; data?: unknown } = { code, message };
  if (data !== undefined) error.data = data;
  return Response.json(
    { jsonrpc: "2.0", id: id ?? null, error },
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
        `VC Deal Flow Signal, Data Summary`,
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
    case "get_diligence_dossier": {
      const entity = String(args.company ?? args.entity ?? args.name ?? "").trim();
      if (!entity) {
        return rpcError(id, -32602, "Missing required parameter: company");
      }
      const d = buildDossier(entity);
      const lines: string[] = [`Diligence dossier, ${d.entity}`, ``];
      if (d.acquiredBy.length) {
        lines.push(
          `Acquired by: ${d.acquiredBy
            .map(
              (a) =>
                `${a.acquirer} (${a.year}${a.announcedAmount ? `, ${a.announcedAmount}` : ""})`,
            )
            .join("; ")}`,
        );
      }
      if (d.acquisitionsMade.length) {
        lines.push(
          `Notable acquisitions made: ${d.acquisitionsMade.length} (e.g. ${d.acquisitionsMade
            .slice(0, 3)
            .map((x) => x.target)
            .join(", ")})`,
        );
      }
      if (d.backedBy.length) {
        lines.push(`Backed by: ${d.backedBy.map((b) => b.fund).join(", ")}`);
      }
      if (d.signal) {
        lines.push(
          `Engineering signal (published): ${d.signal.momentum} · ${d.signal.sector} · ${d.signal.stage}`,
        );
      }
      if (!d.found) {
        lines.push(
          `No grounded facts, "${entity}" is outside the tracked corpus. We do not guess.`,
        );
      }
      for (const n of d.notes) lines.push(``, n);
      lines.push(``, FOOTER);
      return rpcResult(id, {
        content: [{ type: "text", text: lines.join("\n") }],
        structuredContent: {
          entity: d.entity,
          found: d.found,
          acquiredBy: d.acquiredBy,
          acquisitionsMade: d.acquisitionsMade,
          backedBy: d.backedBy,
          signal: d.signal,
          notes: d.notes,
        },
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
            `${i + 1}. ${w.name}, starred ${w.months_early.toFixed(0)}mo before ${w.event} (+${Math.round(w.points)} pts)`
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
      const text = `VC Deal Flow Signal, Methodology\n\n${structured.methodology}\n\nFull details: ${structured.url}\n\n${FOOTER}`;
      return rpcResult(id, {
        content: [{ type: "text", text }],
        structuredContent: structured,
      });
    }
    case "get_deep_signal": {
      // Paid tool, forward to /api/agent/deep-signal which owns auth + credit
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
        lines.push(`${data.name as string}, Deep Signal (paid)`);
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
      const approvalToken = typeof args.approval_token === "string" ? args.approval_token.trim() : "";
      if (summary.length < 10 || summary.length > 200) {
        return rpcError(id, -32602, "summary must be 10-200 chars");
      }

      // F21: gate composition behind explicit human approval. The agent must
      // (a) send the user to /share-approve?summary=..., (b) the user clicks
      // Approve, (c) the agent retries with the resulting `approval_token`.
      if (!approvalToken) {
        const url = approvalUrlFor(summary, BASE_URL);
        return rpcError(
          id,
          -32602,
          `share_result requires an explicit human approval. Ask the user to open this URL, click Approve, and paste the resulting token back. Then retry share_result with the SAME summary plus approval_token.\n\n${url}`,
          { approval_required: true, approval_url: url, ttl_seconds: 600 },
        );
      }
      const verdict = verifyApprovalToken(approvalToken, summary);
      if (!verdict.ok) {
        const explain: Record<ApprovalVerifyError, string> = {
          missing: "approval_token is required",
          malformed: "approval_token is malformed",
          bad_signature: "approval_token signature did not verify",
          wrong_kind: "approval_token is not a share_result token",
          expired:
            "approval_token has expired (10-minute TTL). Ask the user to re-approve at /share-approve.",
          summary_mismatch:
            "approval_token does not match this summary. The token is bound to a hash of the summary the user approved, pass the SAME summary verbatim, or re-approve with the new wording.",
        };
        const url = approvalUrlFor(summary, BASE_URL);
        return rpcError(
          id,
          -32602,
          `${explain[verdict.reason]} Re-approve at: ${url}`,
          { approval_required: true, reason: verdict.reason, approval_url: url, ttl_seconds: 600 },
        );
      }

      const handleAttr = mentionHandle ? " (h/t @sipiteno)" : "";
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
        const body = `${summary}${handleAttr}\n\nFrom GitDealFlow MCP, install: ${installCommand}\nMethodology: ${ssrn}`.slice(0, 275);
        posts.push({
          network: "twitter",
          body,
          charCount: body.length,
          intentUrl: `https://x.com/intent/post?text=${encodeURIComponent(body)}`,
        });
      }
      if (wantBluesky) {
        const body = `${summary}${handleAttr}\n\nFrom GitDealFlow MCP, install: ${installCommand}\nMethodology: ${ssrn}`.slice(0, 295);
        posts.push({
          network: "bluesky",
          body,
          charCount: body.length,
          intentUrl: `https://bsky.app/intent/compose?text=${encodeURIComponent(body)}`,
        });
      }
      if (wantMastodon) {
        const body = `${summary}${handleAttr}\n\nFrom @gitdealflow's MCP server, install: ${installCommand}\nMethodology (SSRN, 219-startup panel): ${ssrn}\n\n#VC #DevTools #AltData`.slice(0, 495);
        posts.push({
          network: "mastodon",
          body,
          charCount: body.length,
          intentUrl: `https://mastodon.social/share?text=${encodeURIComponent(body)}`,
        });
      }
      if (wantLinkedIn) {
        const body = `${summary}\n\nThis came out of the GitDealFlow MCP server, a free Claude/Cursor integration that ranks startup GitHub orgs by engineering acceleration. The methodology behind it (SSRN-published, 219-startup panel) found commit velocity preceded fundraises by 21-47 days.\n\nInstall: ${installCommand}\nPaper: ${ssrn}\nProduct: ${site}`.slice(0, 695);
        posts.push({
          network: "linkedin",
          body,
          charCount: body.length,
          intentUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(site)}&summary=${encodeURIComponent(body)}`,
        });
      }
      if (wantTelegram) {
        const body = `${summary}\n\nFrom the GitDealFlow MCP server, free, install with: ${installCommand}\n\nThe methodology is published on SSRN with a 219-startup panel: ${ssrn}\nProduct: ${site}\n\nGitDealFlow tracks 400+ startup GitHub orgs and ranks them by commit velocity acceleration, weekly. The pattern preceded confirmed fundraises by 21 to 47 days.`.slice(0, 995);
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
    case "predict_funding": {
      const inputName = String(args.name ?? "");
      const { periodName, citation, rows } = getUniverseWithSector();
      const target = slugify(inputName);
      const match = rows.find((r) => slugify(r.name) === target);
      const provenance = {
        methodologyUrl: METHODOLOGY_URL,
        researchPaperUrl: RESEARCH_PAPER_URL,
        citation,
        source: BASE_URL,
        period: periodName,
      };
      if (!match) {
        return rpcResult(id, {
          content: [
            {
              type: "text",
              text: `"${inputName}" is not in the tracked universe, so no signal-based prediction can be made. Use shortlist_signals or get_trending_startups to browse tracked companies, then retry with an exact name.\n\n${FOOTER}`,
            },
          ],
          structuredContent: {
            found: false,
            suggestion:
              "Not in the tracked universe. Browse via shortlist_signals or get_trending_startups, then retry with the exact name or GitHub org slug.",
            provenance,
            disclaimer: PREDICTION_DISCLAIMER,
          },
        });
      }
      const sc = scoreStartup(match);
      const claim =
        `Based on public GitHub engineering signals, ${match.name} shows ${sc.raiseLikelihood.toUpperCase()} near-term funding-round likelihood ` +
        `(acceleration score ${sc.accelerationScore}/100, estimated window ${sc.estimatedWindow}), ` +
        `driven by a ${match.commitVelocityChange} commit-velocity change` +
        (match.signalType ? ` and a "${match.signalType}" signal` : "") +
        `. Confidence: ${sc.confidence}. This is a transparent heuristic over open-source activity, not a guarantee.`;
      const caveats: string[] = [
        "Score reflects engineering acceleration only, it does not see funding rounds, revenue, cap table, or team.",
        "The estimated window is a heuristic band, not a forecast date.",
      ];
      if (sc.confidence === "low") {
        caveats.push(
          "Low confidence: a key growth metric was unparseable or the contributor base is very small, treat the score as directional."
        );
      }
      if ((match.geography ?? "Unknown") === "Unknown") {
        caveats.push("Geography is Unknown for this company in the feed.");
      }
      const text = [
        `${match.name}, Funding-Likelihood Prediction`,
        ``,
        claim,
        ``,
        `Evidence chain:`,
        `- Signal type: ${match.signalType}`,
        `- Commit velocity (14d): ${match.commitVelocity14d} (${match.commitVelocityChange})`,
        `- Contributors: ${match.contributors} (${match.contributorGrowth})`,
        `- New repos (30d): ${match.newRepos}`,
        `- Score breakdown: velocity ${sc.breakdown.velocity} + contributorGrowth ${sc.breakdown.contributorGrowth} + newRepos ${sc.breakdown.newRepos} + signalType ${sc.breakdown.signalType} = ${sc.breakdown.total}/100`,
        ``,
        `Methodology: ${METHODOLOGY_URL}`,
        `Research paper: ${RESEARCH_PAPER_URL}`,
        `Citation: ${citation}`,
        ``,
        PREDICTION_DISCLAIMER,
        ``,
        FOOTER,
      ].join("\n");
      return rpcResult(id, {
        content: [{ type: "text", text }],
        structuredContent: {
          found: true,
          company: {
            name: match.name,
            sector: match.sectorName,
            stage: match.stage,
            geography: match.geography,
            githubUrl: match.githubUrl,
            ...(match.websiteUrl ? { websiteUrl: match.websiteUrl } : {}),
            profileUrl: `${BASE_URL}/startup/${slugify(match.name)}`,
          },
          prediction: {
            claim,
            raiseLikelihood: sc.raiseLikelihood,
            accelerationScore: sc.accelerationScore,
            estimatedWindow: sc.estimatedWindow,
            confidence: sc.confidence,
          },
          evidence: {
            signalType: match.signalType,
            commitVelocity14d: match.commitVelocity14d,
            commitVelocityChange: match.commitVelocityChange,
            contributors: match.contributors,
            contributorGrowth: match.contributorGrowth,
            newRepos: match.newRepos,
            scoreBreakdown: sc.breakdown,
          },
          caveats,
          provenance,
          disclaimer: PREDICTION_DISCLAIMER,
        },
      });
    }
    case "shortlist_signals": {
      const limit = clampNum(Math.floor(Number(args.limit ?? 5)), 1, 25);
      const { periodName, citation, rows } = getUniverseWithSector();
      const notes: string[] = [];

      const sectorArg = typeof args.sector === "string" ? args.sector : undefined;
      const signalTypeArg = typeof args.signalType === "string" ? args.signalType : undefined;
      const geoArg = typeof args.geography === "string" ? args.geography : undefined;
      const minScore = args.minAccelerationScore !== undefined ? Number(args.minAccelerationScore) : undefined;
      const minVel = args.minVelocityChangePct !== undefined ? Number(args.minVelocityChangePct) : undefined;

      let geoRegion: string | null = null;
      if (geoArg && geoArg.trim()) {
        const norm = normalizeGeography(geoArg);
        geoRegion = norm.region;
        if (!geoRegion) {
          notes.push(
            `Geography "${geoArg}" did not map to a known region (US/EU/UK/APAC/LATAM/Canada); geography filter was ignored.`
          );
        } else if (norm.matchedAlias) {
          notes.push(
            `Geography is region-level only, "${geoArg}" was normalized to "${geoRegion}". There is no city-level data in the feed.`
          );
        }
      }
      const sectorActive =
        sectorArg && rows.some((r) => r.sectorSlug === sectorArg) ? sectorArg : null;
      if (sectorArg && !sectorActive) {
        notes.push(`Sector "${sectorArg}" not found or inactive; sector filter was ignored.`);
      }

      const consideredCount = rows.length;
      let candidates = rows.map((r) => ({ row: r, score: scoreStartup(r) }));
      if (sectorActive) candidates = candidates.filter((c) => c.row.sectorSlug === sectorActive);
      if (geoRegion) candidates = candidates.filter((c) => c.row.geography === geoRegion);
      if (signalTypeArg)
        candidates = candidates.filter(
          (c) => (c.row.signalType ?? "").toLowerCase() === signalTypeArg.toLowerCase()
        );
      if (minScore !== undefined && !Number.isNaN(minScore))
        candidates = candidates.filter((c) => c.score.accelerationScore >= minScore);
      if (minVel !== undefined && !Number.isNaN(minVel))
        candidates = candidates.filter(
          (c) => c.score.velocityChangePct !== null && c.score.velocityChangePct >= minVel
        );

      candidates.sort((x, y) => y.score.accelerationScore - x.score.accelerationScore);
      const matchedCount = candidates.length;
      const results = candidates.slice(0, limit).map((c, i) => ({
        rank: i + 1,
        name: c.row.name,
        sector: c.row.sectorName,
        stage: c.row.stage,
        geography: c.row.geography,
        accelerationScore: c.score.accelerationScore,
        raiseLikelihood: c.score.raiseLikelihood,
        signalType: c.row.signalType,
        commitVelocityChange: c.row.commitVelocityChange,
        contributorGrowth: c.row.contributorGrowth,
        contributors: c.row.contributors,
        newRepos: c.row.newRepos,
        githubUrl: c.row.githubUrl,
        profileUrl: `${BASE_URL}/startup/${slugify(c.row.name)}`,
        rationale: `Score ${c.score.accelerationScore}/100 (${c.score.raiseLikelihood}), ${c.row.commitVelocityChange} velocity, ${c.row.contributorGrowth} contributor growth, ${c.row.signalType}.`,
      }));

      const query = {
        sector: sectorActive,
        geography: geoRegion,
        signalType: signalTypeArg ?? null,
        minAccelerationScore: minScore ?? null,
        minVelocityChangePct: minVel ?? null,
        limit,
      };
      const lines = results.map(
        (r) =>
          `${r.rank}. ${r.name} (${r.sector}, ${r.geography}), ${r.accelerationScore}/100 ${r.raiseLikelihood}, ${r.commitVelocityChange} velocity, ${r.signalType}`
      );
      const text = [
        `Shortlist, strongest signals (${periodName})`,
        `Filters: ${JSON.stringify(query)}`,
        `${matchedCount} matched of ${consideredCount} tracked; showing top ${results.length}.`,
        ``,
        lines.join("\n") || "(no companies matched these filters)",
        notes.length ? `\nNotes:\n- ${notes.join("\n- ")}` : "",
        ``,
        `Methodology: ${METHODOLOGY_URL}`,
        `Citation: ${citation}`,
        ``,
        PREDICTION_DISCLAIMER,
        ``,
        FOOTER,
      ]
        .filter((l) => l !== "")
        .join("\n");
      return rpcResult(id, {
        content: [{ type: "text", text }],
        structuredContent: {
          query,
          period: periodName,
          consideredCount,
          matchedCount,
          results,
          notes,
          citation,
          source: BASE_URL,
          methodologyUrl: METHODOLOGY_URL,
          disclaimer: PREDICTION_DISCLAIMER,
        },
      });
    }
    case "compare_signals": {
      const rawNames = Array.isArray(args.names) ? (args.names as unknown[]) : [];
      const wanted = rawNames.map((n) => String(n)).filter((n) => n.trim().length > 0);
      const { periodName, citation, rows } = getUniverseWithSector();

      const compared: Array<Record<string, unknown>> = [];
      const notFound: string[] = [];
      for (const w of wanted) {
        const target = slugify(w);
        const match = rows.find((r) => slugify(r.name) === target);
        if (!match) {
          notFound.push(w);
          continue;
        }
        const sc = scoreStartup(match);
        compared.push({
          name: match.name,
          sector: match.sectorName,
          stage: match.stage,
          geography: match.geography,
          accelerationScore: sc.accelerationScore,
          raiseLikelihood: sc.raiseLikelihood,
          confidence: sc.confidence,
          signalType: match.signalType,
          commitVelocityChange: match.commitVelocityChange,
          contributorGrowth: match.contributorGrowth,
          contributors: match.contributors,
          newRepos: match.newRepos,
          githubUrl: match.githubUrl,
          scoreBreakdown: sc.breakdown,
          _score: sc.accelerationScore,
        });
      }
      compared.sort((x, y) => (y._score as number) - (x._score as number));
      compared.forEach((c, i) => {
        c.rank = i + 1;
        delete c._score;
      });

      let recommendation: string;
      if (compared.length < 2) {
        recommendation =
          compared.length === 0
            ? "No comparison possible, none of the supplied names are in the tracked universe."
            : `Only ${(compared[0] as { name: string }).name} resolved to a tracked company, so no head-to-head was possible. The others are not tracked.`;
      } else {
        const winner = compared[0] as { name: string; accelerationScore: number; raiseLikelihood: string };
        const runnerUp = compared[1] as { name: string; accelerationScore: number };
        const gap = winner.accelerationScore - runnerUp.accelerationScore;
        recommendation =
          gap >= 10
            ? `${winner.name} warrants deeper diligence first, it leads on acceleration score (${winner.accelerationScore} vs ${runnerUp.accelerationScore}, ${winner.raiseLikelihood} likelihood), a clear ${gap}-point margin.`
            : `${winner.name} edges ahead (${winner.accelerationScore} vs ${runnerUp.accelerationScore}), but the ${gap}-point margin is narrow, treat them as roughly comparable and diligence both.`;
      }

      const lines = compared.map(
        (c) =>
          `${c.rank}. ${c.name} (${c.sector}), ${c.accelerationScore}/100 ${c.raiseLikelihood}, ${c.commitVelocityChange} velocity, ${c.signalType}`
      );
      const text = [
        `Head-to-head signal comparison (${periodName})`,
        ``,
        lines.join("\n") || "(no tracked companies among the supplied names)",
        notFound.length ? `\nNot tracked: ${notFound.join(", ")}` : "",
        ``,
        `Recommendation: ${recommendation}`,
        ``,
        `Methodology: ${METHODOLOGY_URL}`,
        `Citation: ${citation}`,
        ``,
        PREDICTION_DISCLAIMER,
        ``,
        FOOTER,
      ]
        .filter((l) => l !== "")
        .join("\n");
      return rpcResult(id, {
        content: [{ type: "text", text }],
        structuredContent: {
          period: periodName,
          compared,
          notFound,
          recommendation,
          citation,
          source: BASE_URL,
          methodologyUrl: METHODOLOGY_URL,
          disclaimer: PREDICTION_DISCLAIMER,
        },
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
    const md = `# VC Deal Flow Signal, Methodology\n\n${data.methodology}\n\nFull details: ${data.url}\n\n${FOOTER}`;
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
        "Step 3: List the top 10, one per line: `<rank>. <name> (<sector>), <commitVelocityChange> velocity, <signalType>. <one-sentence rationale>`.",
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
    case "sourcing_session": {
      const sector = a.sector;
      const geography = a.geography;
      const count = a.count || "5";
      const shortlistArgs = [
        sector ? `sector="${sector}"` : null,
        geography ? `geography="${geography}"` : null,
        `limit=${count}`,
      ]
        .filter(Boolean)
        .join(", ");
      messageText = [
        `You are running a sourcing session${sector ? ` for ${sector}` : ""}${geography ? ` in ${geography}` : ""}, a corp-dev / scout watchlist grounded in engineering-acceleration signals.`,
        "",
        `Step 1: Call \`shortlist_signals\` with ${shortlistArgs}. Returns the top ${count} companies ranked by acceleration score, each with a rationale.`,
        "Step 2: Surface the `notes` from the response verbatim if present (e.g. geography normalized to a region) so the reader knows the filter semantics.",
        "Step 3: For EACH shortlisted company, call `predict_funding` with its name to attach a funding-likelihood read (score, band, window, confidence) + evidence chain. Run in parallel.",
        "Step 4: Produce a ranked watchlist: `<rank>. <name> (<sector>, <geography>), accel <score>/100, raise likelihood <band> (<window>), conf <confidence>. <one-line rationale>.`",
        "Step 5: Footer 'How to read this': heuristics over public GitHub activity, not investment advice; cite the methodology + SSRN links from predict_funding provenance.",
        "",
        "Tone: factual, terse, investor-grade. Use only what the tools return; never invent companies or numbers. If the shortlist is empty, say so and suggest loosening the filters.",
      ].join("\n");
      break;
    }
    case "diligence_brief": {
      const companyName = a.name;
      if (!companyName) return rpcError(id, -32602, "Missing required argument: name");
      messageText = [
        `You are assembling a one-page diligence brief for ${companyName}.`,
        "",
        `Step 1: Call \`get_diligence_dossier\` with name="${companyName}" for the public-source record (M&A history, backers, published signal). If not found, surface that and continue with the other tools.`,
        `Step 2: Call \`predict_funding\` with name="${companyName}" for the scored funding-likelihood read + evidence chain.`,
        "Step 3: Call `get_methodology` once to frame how the score was derived.",
        "Step 4: Draft the brief (one page max): TL;DR; Public Record (acquirer/M&A with year + amount, backing funds, all cited); Funding-Likelihood Read (score/100, band, window, confidence) with the evidence chain; How the score was derived (one sentence); Open Questions (3-5).",
        "",
        "Tone: factual, investor-grade. Cite every claim to the tool that produced it. End with the methodology + SSRN provenance and the disclaimer that this is a heuristic over public data, not investment advice.",
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
  // - If absent, request is allowed anyway, preserves backward compat for
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
