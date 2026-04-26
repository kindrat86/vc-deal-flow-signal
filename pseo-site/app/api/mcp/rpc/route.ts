import { NextRequest } from "next/server";
import {
  getAllSectors,
  getCurrentPeriod,
  getSortedStartups,
  type Startup,
} from "@/lib/data";
import { slugify } from "@/lib/slugify";

const BASE_URL = "https://signals.gitdealflow.com";
const SERVER_NAME = "vc-deal-flow-signal";
const SERVER_VERSION = "1.4.0";
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

const TOOLS = [
  {
    name: "get_trending_startups",
    description:
      "Top 20 startups by engineering acceleration across all 20 sectors for the current weekly period. Read-only, idempotent.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "search_startups_by_sector",
    description:
      "Every tracked startup within a sector, ranked by engineering acceleration. Sector slug must be one of 20 enumerated values.",
    inputSchema: {
      type: "object",
      properties: {
        sector: {
          type: "string",
          enum: [...SECTOR_SLUGS],
          description: "Sector slug from the enumerated list.",
        },
      },
      required: ["sector"],
      additionalProperties: false,
    },
  },
  {
    name: "get_startup_signal",
    description:
      "Full engineering-acceleration profile for a single tracked startup, by display name or GitHub org slug. Case-insensitive, normalization-tolerant.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", minLength: 1, maxLength: 100 },
      },
      required: ["name"],
      additionalProperties: false,
    },
  },
  {
    name: "get_signals_summary",
    description:
      "Period, sector and startup counts, last refresh, citation, and direct URLs to every machine-readable format.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_methodology",
    description:
      "Full methodology document covering data sources, metric computation, signal classification thresholds, refresh cadence, and known limitations.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
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

async function handleToolsCall(id: JsonRpcId | undefined, params: unknown) {
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
    case "get_methodology": {
      const structured = await getMethodologyPayload();
      const text = `VC Deal Flow Signal — Methodology\n\n${structured.methodology}\n\nFull details: ${structured.url}\n\n${FOOTER}`;
      return rpcResult(id, {
        content: [{ type: "text", text }],
        structuredContent: structured,
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
        serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
      });
    case "notifications/initialized":
    case "notifications/cancelled":
      return new Response(null, { status: 202, headers: CORS_HEADERS });
    case "ping":
      return rpcResult(body.id, {});
    case "tools/list":
      return rpcResult(body.id, { tools: TOOLS });
    case "tools/call":
      return handleToolsCall(body.id, body.params);
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
