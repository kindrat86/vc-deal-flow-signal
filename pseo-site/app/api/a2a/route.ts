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

function inferSkillFromText(text: string): SkillInvocation | null {
  const t = text.toLowerCase();
  if (
    /(product\s*hunt|producthunt|\bph\b|launch|launching|live\s+today|upvote)/.test(
      t
    )
  ) {
    return { skillId: "get_launch_status", args: {} };
  }
  if (/method|how.*calcul|breakout.*mean|trust|how.*work/.test(t)) {
    return { skillId: "get_methodology", args: {} };
  }
  if (/summary|fresh|cite|citation|csv|download|how many sector/.test(t)) {
    return { skillId: "get_signals_summary", args: {} };
  }
  const sectorPattern = /(?:in|for|about)\s+([a-z][a-z\- /]{2,40})/i.exec(text);
  if (sectorPattern) {
    return {
      skillId: "search_startups_by_sector",
      args: { sector: sectorPattern[1].trim() },
    };
  }
  const lookupPattern = /(?:about|tell me about|profile|signal for|lookup)\s+([A-Za-z][\w \-.]{1,80})/i.exec(text);
  if (lookupPattern) {
    return {
      skillId: "get_startup_signal",
      args: { name: lookupPattern[1].trim() },
    };
  }
  if (/trending|top|hot|breakout|who.*watch/.test(t)) {
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

function buildTask(invocation: SkillInvocation | null, result: unknown, contextId: string) {
  const taskId = randomUUID();
  const summaryText =
    invocation && KNOWN_SKILLS.has(invocation.skillId)
      ? `Skill ${invocation.skillId} completed.`
      : "Could not infer a skill from the request. Pass a `data` part with `{ skill: '<id>', args: {...} }` or include a clear text prompt. See https://signals.gitdealflow.com/.well-known/agent-card.json for available skills.";

  const artifacts = invocation
    ? [
        {
          artifactId: randomUUID(),
          name: invocation.skillId,
          parts: [
            { kind: "data" as const, data: result as Record<string, unknown> },
            {
              kind: "text" as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        },
      ]
    : [];

  return {
    id: taskId,
    contextId,
    status: {
      state: invocation ? "completed" : "failed",
      message: {
        role: "agent" as const,
        parts: [{ kind: "text" as const, text: summaryText }],
        messageId: randomUUID(),
        contextId,
        taskId,
      },
      timestamp: new Date().toISOString(),
    },
    artifacts,
    kind: "task" as const,
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
    return jsonRpcResult(id, buildTask(null, null, contextId));
  }
  const result = await dispatchSkill(invocation);
  return jsonRpcResult(id, buildTask(invocation, result, contextId));
}

export async function GET() {
  const launch = await getLaunchPayload();
  return Response.json(
    {
      service: "GitDealFlow A2A Agent",
      protocolVersion: PROTOCOL_VERSION,
      transport: "JSONRPC",
      methods: ["message/send"],
      agentCard: `${BASE_URL}/.well-known/agent-card.json`,
      docs: `${BASE_URL}/developers`,
      note: "POST JSON-RPC 2.0 requests here. Send GET to fetch this descriptor.",
      launch,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        // Short cache during active launch so the rolling hours_remaining
        // value stays current. Reverts to 1h when launch.active is false.
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
    case "message/send":
      return handleMessageSend(body.id, body.params);
    case "tasks/get":
      return jsonRpcError(
        body.id,
        -32004,
        "Tasks are not persisted by this stub agent. message/send returns terminal state synchronously."
      );
    case "tasks/cancel":
      return jsonRpcError(
        body.id,
        -32004,
        "Tasks are not persisted by this stub agent."
      );
    case "agent/getAuthenticatedExtendedCard":
      return jsonRpcError(
        body.id,
        -32601,
        "Authenticated extended card not supported. Fetch the public AgentCard at /.well-known/agent-card.json."
      );
    default:
      return jsonRpcError(body.id, -32601, `Method not found: ${body.method}`);
  }
}
