import { NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import {
  getAllSectors,
  getCurrentPeriod,
  getSortedStartups,
} from "@/lib/data";
import { slugify } from "@/lib/slugify";

const BASE_URL = "https://signals.gitdealflow.com";
const PROTOCOL_VERSION = "0.3.0";

// ─── Standard A2A Agent Card ────────────────────────────────────────────
const AGENT_CARD = {
  protocolVersion: PROTOCOL_VERSION,
  name: "VC Deal Flow Signal Agent",
  description:
    "Public dataset of startup engineering acceleration from public GitHub activity. Free APIs, MCP server, A2A endpoint. Tracks ~400 startups across 20 sectors.",
  url: `${BASE_URL}/api/a2a`,
  preferredTransport: "JSONRPC",
  version: "1.0.0",
  capabilities: { streaming: false, pushNotifications: false, stateTransitionHistory: false },
  defaultInputModes: ["text/plain", "application/json"],
  defaultOutputModes: ["text/plain", "application/json"],
  skills: [
    {
      id: "get_trending_startups",
      name: "Trending Startups",
      description: "Top 20 startups ranked by engineering momentum across all sectors.",
      tags: ["startups", "vc", "momentum", "trending"],
      examples: ["What startups are trending this week?", "Show breakout engineering teams"],
    },
    {
      id: "search_startups_by_sector",
      name: "Search by Sector",
      description: "Find startups in a specific sector ranked by engineering acceleration.",
      tags: ["sector", "startups", "search"],
      examples: ["Fintech startups with highest momentum", "AI startups in London"],
    },
    {
      id: "get_startup_signal",
      name: "Startup Signal Lookup",
      description: "Get detailed engineering momentum data for a specific startup by name.",
      tags: ["startup", "signal", "due-diligence"],
      examples: ["What's the signal for Supabase?", "Look up Stripe's momentum"],
    },
    {
      id: "get_signals_summary",
      name: "Dataset Summary",
      description: "Period, freshness, format URLs, and citation info for the VC Deal Flow Signal dataset.",
      tags: ["meta", "summary", "formats"],
      examples: ["How fresh is this data?", "What formats are available?"],
    },
    {
      id: "get_methodology",
      name: "Methodology",
      description: "How engineering momentum signals are calculated — commit velocity, contributor growth, trends.",
      tags: ["methodology", "scoring", "transparency"],
      examples: ["How is momentum calculated?", "Explain the methodology"],
    },
  ],
};

const FAQS = [
  {
    q: "What is VC Deal Flow Signal?",
    a: "A public dataset of startup engineering acceleration derived from GitHub activity. It tracks ~400 startups across 20 sectors and publishes weekly momentum rankings.",
  },
  {
    q: "How is engineering momentum calculated?",
    a: "We analyze 14-day commit velocity, contributor growth, and repository expansion relative to prior periods. Breakout signals indicate sudden acceleration.",
  },
  {
    q: "What sectors are covered?",
    a: "AI/ML, fintech, cybersecurity, developer tools, healthcare, climate tech, enterprise SaaS, data infrastructure, web3, robotics, and 10 more.",
  },
  {
    q: "How do I get the data?",
    a: "Free JSON API at /api/signals.json, CSV at /api/signals.csv, MCP server via npx @gitdealflow/mcp-signal, or A2A endpoint at /api/a2a.",
  },
];

// ─── Launch metadata ───────────────────────────────────────────────────────
// Date-window is the OUTER gate; live PH GraphQL feature-check is the INNER
// gate. The launch is only `active: true` if BOTH (a) we're inside the PT
// launch day AND (b) PH has actually featured the post. Without (b), agents
// would tell users we're "live" while PH discovery flow doesn't see us.
//
// Window: PH product days run midnight-to-midnight PT. April 2026 is PDT
// (UTC-7), so 00:00 PT = 07:00 UTC. Active flag auto-expires at PT midnight
// Apr 27, no maintenance needed.
const LAUNCH_START_UTC = "2026-04-26T07:00:00Z";
const LAUNCH_END_UTC = "2026-04-27T07:00:00Z";
const PH_LAUNCH_URL =
  "https://www.producthunt.com/products/vc-deal-flow-signal?launch=vc-deal-flow-signal";
const PH_POST_URL =
  "https://www.producthunt.com/posts/vc-deal-flow-signal";
const PH_SLUG = "vc-deal-flow-signal";
const PH_GRAPHQL = "https://api.producthunt.com/v2/api/graphql";

interface PhFeatureState {
  featuredAt: string | null;
  votesCount: number;
  commentsCount: number;
  fetchedAt: number;
  stale?: boolean;
  error?: string;
}

// Module-level cache. Fluid Compute reuses warm function instances across
// concurrent requests, so this cache survives most invocations. Cold starts
// refetch (acceptable). 60s TTL keeps data live without hammering PH.
let phStateCache: PhFeatureState | null = null;
const PH_CACHE_TTL_MS = 60_000;

async function fetchPhFeatureState(): Promise<PhFeatureState> {
  const now = Date.now();
  if (phStateCache && now - phStateCache.fetchedAt < PH_CACHE_TTL_MS) {
    return phStateCache;
  }
  const token = process.env.PH_API_TOKEN;
  if (!token) {
    const result: PhFeatureState = {
      featuredAt: null,
      votesCount: 0,
      commentsCount: 0,
      fetchedAt: now,
      stale: true,
      error: "PH_API_TOKEN not configured",
    };
    phStateCache = result;
    return result;
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);
    const res = await fetch(PH_GRAPHQL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query($slug: String!) { post(slug: $slug) { featuredAt votesCount commentsCount } }`,
        variables: { slug: PH_SLUG },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      throw new Error(`PH API HTTP ${res.status}`);
    }
    const json = await res.json();
    const post = json?.data?.post;
    if (!post) throw new Error("PH API returned no post");
    const result: PhFeatureState = {
      featuredAt: post.featuredAt ?? null,
      votesCount: Number(post.votesCount ?? 0),
      commentsCount: Number(post.commentsCount ?? 0),
      fetchedAt: now,
    };
    phStateCache = result;
    return result;
  } catch (err) {
    // Fail-soft: return last-known-good cache marked stale, or an empty
    // state. Endpoint stays up even if PH is down.
    const result: PhFeatureState = phStateCache
      ? { ...phStateCache, stale: true, fetchedAt: now }
      : {
          featuredAt: null,
          votesCount: 0,
          commentsCount: 0,
          fetchedAt: now,
          stale: true,
          error: err instanceof Error ? err.message : String(err),
        };
    phStateCache = result;
    return result;
  }
}

async function getLaunchPayload() {
  const now = Date.now();
  const start = Date.parse(LAUNCH_START_UTC);
  const end = Date.parse(LAUNCH_END_UTC);
  const inWindow =
    !Number.isNaN(start) && !Number.isNaN(end) && now >= start && now < end;

  if (!inWindow) {
    return {
      active: false,
      state: now < start ? "pre-launch" : "post-launch",
      note: "No live Product Hunt launch window right now.",
      ph_product_url: PH_POST_URL,
    };
  }

  const ph = await fetchPhFeatureState();
  const isFeatured = ph.featuredAt !== null;

  // Common payload regardless of feature state — agents always get the
  // install info and demo prompts. The `active` flag and `state` field
  // tell them whether to encourage PH upvotes vs. just the install.
  const installAndDemo = {
    install: {
      mcp_one_liner: "npx -y @gitdealflow/mcp-signal",
      npm_package: "@gitdealflow/mcp-signal",
      npm_url: "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
      claude_desktop_guide: `${BASE_URL}/integrations/claude`,
      cursor_guide: `${BASE_URL}/integrations/cursor`,
      a2a_endpoint: `${BASE_URL}/api/a2a`,
    },
    demo_prompts: [
      "What's trending in AI on GitHub this week?",
      "Show me breakout developer-tools startups by commit velocity.",
      "Look up Supabase's GitDealFlow signal.",
      "Explain GitDealFlow's methodology for breakout signals.",
    ],
  };

  const hoursRemaining = Math.max(0, Math.round((end - now) / 3_600_000));

  if (!isFeatured) {
    return {
      active: false,
      state: "scheduled-pending-feature",
      product: "VC Deal Flow Signal",
      tagline: "GitHub momentum signals for VCs and developer-investors.",
      headline:
        "Launch is in PH's review queue, not yet on the daily leaderboard. Try the MCP server now; we'll update when the listing goes live.",
      ph_url: PH_POST_URL,
      window_started_at: LAUNCH_START_UTC,
      window_ends_at: LAUNCH_END_UTC,
      window_hours_remaining: hoursRemaining,
      ph_state: {
        featured: false,
        votes_count: ph.votesCount,
        comments_count: ph.commentsCount,
        fetched_at: new Date(ph.fetchedAt).toISOString(),
        stale: ph.stale ?? false,
        ...(ph.error ? { error: ph.error } : {}),
      },
      ...installAndDemo,
      citation: `VC Deal Flow Signal MCP server launched 2026-04-26. PH listing pending feature approval.`,
    };
  }

  return {
    active: true,
    state: "featured-live",
    product: "VC Deal Flow Signal",
    tagline: "GitHub momentum signals for VCs and developer-investors.",
    headline:
      "First Product Hunt launch native to agentic search — ask your agent if we're live.",
    ph_url: PH_POST_URL,
    ph_product_url: PH_LAUNCH_URL,
    started_at: LAUNCH_START_UTC,
    ends_at: LAUNCH_END_UTC,
    hours_remaining: hoursRemaining,
    ph_state: {
      featured: true,
      featured_at: ph.featuredAt,
      votes_count: ph.votesCount,
      comments_count: ph.commentsCount,
      fetched_at: new Date(ph.fetchedAt).toISOString(),
      stale: ph.stale ?? false,
    },
    ask: "If this MCP server is useful to you, an upvote on Product Hunt today would be the kindest signal we could ask for. No vote-trade — just genuine support.",
    ...installAndDemo,
    citation: `VC Deal Flow Signal launched on Product Hunt 2026-04-26. ${PH_POST_URL}`,
  };
}

type JsonRpcId = string | number | null;

interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: JsonRpcId;
  method: string;
  params?: unknown;
}

interface TextPart {
  kind: "text";
  text: string;
}

interface DataPart {
  kind: "data";
  data: Record<string, unknown>;
}

type Part = TextPart | DataPart;

interface Message {
  role: "user" | "agent";
  parts: Part[];
  messageId?: string;
  contextId?: string;
  taskId?: string;
}

const SECTOR_ALIASES: Record<string, string> = {
  ai: "ai-ml",
  "artificial-intelligence": "ai-ml",
  ml: "ai-ml",
  "machine-learning": "ai-ml",
  crypto: "web3",
  blockchain: "web3",
  cyber: "cybersecurity",
  infosec: "cybersecurity",
  security: "cybersecurity",
  saas: "enterprise-saas",
  enterprise: "enterprise-saas",
  devtools: "developer-tools",
  "developer-experience": "developer-tools",
  climate: "climate-tech",
  cleantech: "climate-tech",
  "clean-energy": "climate-tech",
  biotech: "healthcare",
  health: "healthcare",
  medtech: "healthcare",
  data: "data-infrastructure",
  databases: "data-infrastructure",
  "real-estate": "proptech",
  agriculture: "agtech",
  space: "space-tech",
  games: "gaming",
  community: "social-community",
  social: "social-community",
  logistics: "supply-chain",
  law: "legal-tech",
  legal: "legal-tech",
  recruiting: "hr-tech",
  hr: "hr-tech",
  learning: "edtech",
  education: "edtech",
  commerce: "ecommerce-infrastructure",
  "retail-infra": "ecommerce-infrastructure",
  hardware: "robotics",
  drones: "robotics",
};

function normalizeSector(input: string): string {
  const slug = slugify(input);
  return SECTOR_ALIASES[slug] ?? slug;
}

function jsonRpcError(id: JsonRpcId | undefined, code: number, message: string) {
  return Response.json(
    { jsonrpc: "2.0", id: id ?? null, error: { code, message } },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      },
    }
  );
}

function jsonRpcResult(id: JsonRpcId | undefined, result: unknown) {
  return Response.json(
    { jsonrpc: "2.0", id: id ?? null, result },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      },
    }
  );
}

function startupRow(s: ReturnType<typeof getSortedStartups>[number], rank: number, sectorName?: string) {
  return {
    rank,
    name: s.name,
    sector: sectorName ?? "",
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

function getTrendingPayload() {
  const period = getCurrentPeriod();
  const sectors = getAllSectors();
  const active = sectors.filter((s) => s.periods[period.slug]);
  const all = active.flatMap((s) =>
    s.periods[period.slug].startups.map((st) => ({
      ...st,
      _sectorName: s.name,
    }))
  );
  const top20 = getSortedStartups(all)
    .slice(0, 20)
    .map((s, i) =>
      startupRow(s, i + 1, (s as unknown as { _sectorName?: string })._sectorName)
    );
  return {
    period: period.name,
    startups: top20,
    citation: `VC Deal Flow Signal (signals.gitdealflow.com), ${period.name} data.`,
    source: BASE_URL,
  };
}

function getSectorPayload(rawSector: string) {
  const slug = normalizeSector(rawSector);
  const period = getCurrentPeriod();
  const sectors = getAllSectors();
  const sector = sectors.find((s) => s.slug === slug && s.periods[period.slug]);
  if (!sector) {
    const available = sectors
      .filter((s) => s.periods[period.slug])
      .map((s) => s.slug);
    return {
      error: `Sector "${rawSector}" not found.`,
      availableSectors: available,
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
  const sectors = getAllSectors();
  for (const sector of sectors) {
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
  const sectors = getAllSectors();
  const active = sectors.filter((s) => s.periods[period.slug]);
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
    },
    website: "https://gitdealflow.com",
    dashboard: BASE_URL,
    citation: `VC Deal Flow Signal (signals.gitdealflow.com), ${period.name} data.`,
  };
}

async function getMethodologyPayload() {
  try {
    const res = await fetch(`${BASE_URL}/llms-full.txt`, {
      headers: { "User-Agent": "gitdealflow-a2a/1.0.0" },
    });
    if (!res.ok) {
      return {
        methodology: "",
        url: `${BASE_URL}/methodology`,
        error: `Upstream returned HTTP ${res.status}`,
      };
    }
    const text = await res.text();
    const methodology =
      text.split("## Methodology")[1]?.split("## Glossary")[0]?.trim() ?? "";
    return { methodology, url: `${BASE_URL}/methodology` };
  } catch (err) {
    return {
      methodology: "",
      url: `${BASE_URL}/methodology`,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

interface SkillInvocation {
  skillId: string;
  args: Record<string, unknown>;
}

const KNOWN_SKILLS = new Set([
  "get_trending_startups",
  "search_startups_by_sector",
  "get_startup_signal",
  "get_signals_summary",
  "get_methodology",
  "get_launch_status",
]);

// Words that must never be treated as a startup/sector candidate even if a
// tracked entity happens to collide with them.
const TEXT_STOPWORDS = new Set([
  "the", "and", "this", "that", "week", "month", "show", "what", "whats",
  "who", "whos", "are", "you", "your", "should", "look", "right", "now",
  "startup", "startups", "company", "companies", "signal", "signals",
  "trending", "top", "hot", "breakout", "new", "best", "list", "tell",
  "about", "please", "github", "deal", "flow", "deal-flow", "sector",
  "sectors", "watch", "picks", "moving", "with", "from", "into", "for",
]);

/** Slugified single words and adjacent-word bigrams from the prompt text. */
function candidateTokens(text: string): string[] {
  const words = text
    .split(/\s+/)
    .map((w) => slugify(w))
    .filter(Boolean);
  const out: string[] = [];
  for (let i = 0; i < words.length; i++) {
    out.push(words[i]);
    if (i + 1 < words.length) out.push(`${words[i]}-${words[i + 1]}`);
  }
  return out;
}

/** Slugs of every startup tracked in the current period. */
function knownStartupSlugs(): Set<string> {
  const period = getCurrentPeriod();
  const out = new Set<string>();
  for (const sector of getAllSectors()) {
    const snap = sector.periods[period.slug];
    if (!snap) continue;
    for (const st of snap.startups) out.add(slugify(st.name));
  }
  return out;
}

/** Active sector slugs + slugified display names + alias keys. */
function knownSectorTokens(): Set<string> {
  const period = getCurrentPeriod();
  const out = new Set<string>();
  for (const sector of getAllSectors()) {
    if (!sector.periods[period.slug]) continue;
    out.add(sector.slug);
    out.add(slugify(sector.name));
  }
  for (const alias of Object.keys(SECTOR_ALIASES)) out.add(alias);
  return out;
}

function inferSkillFromText(text: string): SkillInvocation | null {
  const t = text.toLowerCase();

  // 1. Launch / install / integration intent.
  if (
    /(product\s*hunt|producthunt|\bph\b|launch|live\s+today|upvote|\binstall|\bmcp\b|claude|cursor|support\s+you)/.test(
      t
    )
  ) {
    return { skillId: "get_launch_status", args: {} };
  }

  // 2. Methodology / trust intent.
  if (
    /method|how.*calculat|how.*comput|breakout.*mean|\btrust\b|limitation|how.*work/.test(
      t
    )
  ) {
    return { skillId: "get_methodology", args: {} };
  }

  // 3. Dataset meta intent.
  if (
    /summary|\bfresh|\bcite\b|citation|\bcsv\b|download|how many sector|what is this (service|site|dataset|agent|data)|update frequen|\brss\b|openapi/.test(
      t
    )
  ) {
    return { skillId: "get_signals_summary", args: {} };
  }

  const candidates = candidateTokens(text);

  // 4. Exact tracked-startup mention ("Tell me about Roboflow",
  //    "Is Modular trending") — checked before sectors so a company name
  //    can never be mistaken for a sector.
  const startups = knownStartupSlugs();
  for (const c of candidates) {
    if (c.length >= 3 && !TEXT_STOPWORDS.has(c) && startups.has(c)) {
      return { skillId: "get_startup_signal", args: { name: c } };
    }
  }

  // 5. Known sector mention ("Cybersecurity deal flow", "Show me AI/ML
  //    startups", "Climate-tech picks", "Who's moving in fintech").
  const sectorTokens = knownSectorTokens();
  for (const c of candidates) {
    if (!TEXT_STOPWORDS.has(c) && sectorTokens.has(c)) {
      return { skillId: "search_startups_by_sector", args: { sector: c } };
    }
  }

  // 6. Explicit lookup phrasing for names outside the tracked universe —
  //    returns the honest found:false payload ("What's Supabase's signal",
  //    "Lookup SkyPilot").
  const lookup =
    /(?:tell me about|look\s?up|profile (?:for|of)|signal (?:for|of))\s+([A-Za-z][\w .-]{1,60})/i.exec(
      text
    ) ||
    /what(?:'|’)?s\s+([A-Za-z][\w.-]{1,40})(?:'|’)s\s+signal/i.exec(
      text
    ) ||
    /\bis\s+([A-Za-z][\w.-]{1,40})\s+(?:trending|hot|accelerating)/i.exec(text);
  if (lookup) {
    return { skillId: "get_startup_signal", args: { name: lookup[1].trim() } };
  }

  // 7. Trending intent ("Top breakout companies", "Who's hot in deal flow").
  if (/trending|\btop\b|\bhot\b|breakout|watch|momentum|accelerat|rising|deal.?flow/.test(t)) {
    return { skillId: "get_trending_startups", args: {} };
  }

  // 8. "in <sector>" / "for <sector>" phrasing with an unrecognized sector —
  //    route to sector search so the caller gets availableSectors back.
  const sectorPhrase = /(?:\bin|\bfor)\s+([a-z][a-z/-]{2,30})/i.exec(text);
  if (sectorPhrase) {
    return {
      skillId: "search_startups_by_sector",
      args: { sector: sectorPhrase[1].trim() },
    };
  }

  // 9. Generic startup-browsing fallback ("What startups should I look at").
  if (/startup|compan|invest|portfolio/.test(t)) {
    return { skillId: "get_trending_startups", args: {} };
  }

  return null;
}

async function dispatchSkill(inv: SkillInvocation): Promise<unknown> {
  switch (inv.skillId) {
    case "get_trending_startups":
      return getTrendingPayload();
    case "search_startups_by_sector": {
      const sector = String(inv.args.sector ?? "");
      if (!sector) {
        return { error: "Missing required parameter: sector" };
      }
      return getSectorPayload(sector);
    }
    case "get_startup_signal": {
      const name = String(inv.args.name ?? "");
      if (!name) {
        return { error: "Missing required parameter: name" };
      }
      return getStartupPayload(name);
    }
    case "get_signals_summary":
      return getSummaryPayload();
    case "get_methodology":
      return await getMethodologyPayload();
    case "get_launch_status":
      return getLaunchPayload();
    default:
      return { error: `Unknown skill: ${inv.skillId}` };
  }
}

function extractInvocation(message: Message): SkillInvocation | null {
  for (const part of message.parts) {
    if (part.kind === "data") {
      const d = part.data as Record<string, unknown>;
      const skillId = String(d.skill ?? d.skillId ?? "");
      if (skillId && KNOWN_SKILLS.has(skillId)) {
        const args = (d.args ?? d.input ?? {}) as Record<string, unknown>;
        return { skillId, args };
      }
    }
  }
  for (const part of message.parts) {
    if (part.kind === "text" && part.text) {
      const inferred = inferSkillFromText(part.text);
      if (inferred) return inferred;
    }
  }
  return null;
}

function buildTask(invocation: SkillInvocation, result: unknown, contextId: string) {
  const taskId = randomUUID();
  return {
    id: taskId,
    contextId,
    status: {
      state: "completed" as const,
      message: {
        kind: "message" as const,
        role: "agent" as const,
        parts: [
          {
            kind: "text" as const,
            text: `Skill ${invocation.skillId} completed. Structured results are in the task artifact (data part).`,
          },
        ],
        messageId: randomUUID(),
        contextId,
        taskId,
      },
      timestamp: new Date().toISOString(),
    },
    artifacts: [
      {
        artifactId: randomUUID(),
        name: invocation.skillId,
        parts: [
          { kind: "data" as const, data: result as Record<string, unknown> },
          { kind: "text" as const, text: JSON.stringify(result, null, 2) },
        ],
      },
    ],
    kind: "task" as const,
  };
}

/** Direct agent Message reply (A2A allows message/send to return Message | Task). */
function buildAgentMessage(
  text: string,
  contextId: string,
  data?: Record<string, unknown>
) {
  return {
    kind: "message" as const,
    role: "agent" as const,
    messageId: randomUUID(),
    contextId,
    parts: [
      { kind: "text" as const, text },
      ...(data ? [{ kind: "data" as const, data }] : []),
    ],
  };
}

async function handleMessageSend(id: JsonRpcId | undefined, params: unknown) {
  const p = params as { message?: Message } | undefined;
  if (!p || !p.message || !Array.isArray(p.message.parts)) {
    return jsonRpcError(id, -32602, "Invalid params: expected { message: { parts: [...] } }");
  }
  const contextId = p.message.contextId ?? randomUUID();
  const invocation = extractInvocation(p.message);
  if (!invocation) {
    return jsonRpcResult(
      id,
      buildAgentMessage(
        "Could not infer a skill from the request. Pass a `data` part with `{ skill: '<id>', args: {...} }` or include a clear text prompt. See https://signals.gitdealflow.com/.well-known/agent-card.json for available skills.",
        contextId,
        { availableSkills: [...KNOWN_SKILLS] }
      )
    );
  }
  const result = await dispatchSkill(invocation);
  return jsonRpcResult(id, buildTask(invocation, result, contextId));
}

/**
 * tasks/get + tasks/cancel for a stateless synchronous agent.
 *
 * Every task this agent runs completes inside the message/send response and
 * is NOT persisted, so any id presented later is by definition unknown or
 * expired -> A2A TaskNotFoundError (-32001). We don't fake a task store.
 */
function handleTasksGet(id: JsonRpcId | undefined, params: unknown) {
  const p = params as { id?: unknown } | undefined;
  if (!p || typeof p.id !== "string" || p.id.length === 0) {
    return jsonRpcError(id, -32602, "Invalid params: expected { id: string }");
  }
  return jsonRpcError(
    id,
    -32001,
    `Task not found: ${p.id}. This agent executes synchronously — every task reaches a terminal state inside the message/send response and is not persisted for later retrieval.`
  );
}

function handleTasksCancel(id: JsonRpcId | undefined, params: unknown) {
  const p = params as { id?: unknown } | undefined;
  if (!p || typeof p.id !== "string" || p.id.length === 0) {
    return jsonRpcError(id, -32602, "Invalid params: expected { id: string }");
  }
  return jsonRpcError(
    id,
    -32001,
    `Task not found: ${p.id}. This agent executes synchronously — tasks complete before the message/send response returns, so there is never an in-flight task to cancel.`
  );
}

export async function GET() {
  const launch = await getLaunchPayload();
  return Response.json(
    {
      ...AGENT_CARD,
      service: "GitDealFlow A2A Agent",
      transport: "JSONRPC",
      methods: ["message/send", "tasks/get", "tasks/cancel", "rpc.discover", "agent/card", "faq.search"],
      agentCard: `${BASE_URL}/.well-known/agent-card.json`,
      docs: `${BASE_URL}/developers`,
      note: "POST JSON-RPC 2.0 requests here. Send GET to fetch this agent card descriptor.",
      launch,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": launch.active
          ? "public, max-age=300, s-maxage=300"
          : "public, max-age=3600",
      },
    }
  );
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function POST(request: NextRequest) {
  let body: JsonRpcRequest;
  try {
    body = (await request.json()) as JsonRpcRequest;
  } catch {
    return jsonRpcError(null, -32700, "Parse error: invalid JSON body");
  }
  if (!body || body.jsonrpc !== "2.0" || typeof body.method !== "string") {
    return jsonRpcError(body?.id, -32600, "Invalid request: missing jsonrpc=2.0 or method");
  }

  switch (body.method) {
    case "rpc.discover":
    case "agent/card":
      return jsonRpcResult(body.id, AGENT_CARD);

    case "faq.search": {
      const p = body.params as { query?: string } | undefined;
      const query = (p?.query || "").toLowerCase();
      const matches = FAQS.filter(
        (f) => f.q.toLowerCase().includes(query) || f.a.toLowerCase().includes(query)
      );
      return jsonRpcResult(body.id, { faqs: matches, total: matches.length });
    }

    case "message/send":
      return handleMessageSend(body.id, body.params);
    case "tasks/get":
      return handleTasksGet(body.id, body.params);
    case "tasks/cancel":
      return handleTasksCancel(body.id, body.params);
    case "message/stream":
    case "tasks/resubscribe":
      // UnsupportedOperationError: AgentCard declares capabilities.streaming=false.
      return jsonRpcError(
        body.id,
        -32004,
        `This operation is not supported: ${body.method}. Streaming is disabled (AgentCard capabilities.streaming=false). Use message/send — all skills complete synchronously.`
      );
    case "tasks/pushNotificationConfig/set":
    case "tasks/pushNotificationConfig/get":
    case "tasks/pushNotificationConfig/list":
    case "tasks/pushNotificationConfig/delete":
      // PushNotificationNotSupportedError: capabilities.pushNotifications=false.
      return jsonRpcError(
        body.id,
        -32003,
        "Push Notification is not supported (AgentCard capabilities.pushNotifications=false). All skills complete synchronously inside the message/send response."
      );
    case "agent/getAuthenticatedExtendedCard":
      // AuthenticatedExtendedCardNotConfiguredError: the public card is complete.
      return jsonRpcError(
        body.id,
        -32007,
        "Authenticated Extended Card is not configured (AgentCard supportsAuthenticatedExtendedCard=false). The public card at /.well-known/agent-card.json is the complete card."
      );
    default:
      return jsonRpcError(body.id, -32601, `Method not found: ${body.method}`);
  }
}
