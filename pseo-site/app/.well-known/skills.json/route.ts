/**
 * /.well-known/skills.json — Anthropic-style skills card.
 *
 * Stable manifest of agent-callable "skills" exposed by this site. Each
 * entry maps to an MCP prompt (name + arguments + invoke contract) so a
 * fresh agent can enumerate every available skill in a single fetch
 * without parsing the full /api/openapi.json (1,000+ lines) or probing
 * the MCP server.
 *
 * Companion surfaces:
 *   /.well-known/mcp.json           — MCP server descriptor (tools)
 *   /.well-known/agent-card.json    — A2A AgentCard
 *   /api/openapi.json               — REST + MCP unified contract
 *   /api/mcp/rpc                    — JSON-RPC entrypoint
 *
 * Mirrored at /skills.json (root alias).
 */

import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const runtime = "nodejs";
export const revalidate = 86400;

const SITE = "https://signals.gitdealflow.com";

const SKILLS = [
  {
    name: "weekly_digest",
    title: "Monday Signal Digest",
    description:
      "Compose a Monday-morning intel brief from the current top-20 trending startups: each entry includes commit-velocity change, signal classification, and a one-line investor takeaway.",
    type: "mcp.prompt",
    arguments: [],
    tags: ["digest", "trending", "weekly", "investor-brief"],
    invoke: {
      transport: "mcp",
      method: "prompts/get",
      params: { name: "weekly_digest" },
    },
    httpAnalog: { method: "GET", path: "/api/v1/signals.json" },
    rateLimit: { requestsPerMinute: 60, scope: "ip" },
    cost: { type: "free" },
  },
  {
    name: "sector_deep_dive",
    title: "Sector Deep Dive",
    description:
      "Sector intelligence brief — top movers, dark horses, and thesis follow-ups for a single named sector. Grounded in live signal data plus the SSRN methodology paper.",
    type: "mcp.prompt",
    arguments: [
      {
        name: "sector",
        description:
          "Sector slug (e.g. 'devtools', 'ai-infrastructure', 'fintech', 'climate'). See /api/v1/signals.json sectors[].slug for the full list.",
        required: true,
      },
    ],
    tags: ["sector", "deep-dive", "thesis"],
    invoke: {
      transport: "mcp",
      method: "prompts/get",
      params: { name: "sector_deep_dive" },
    },
    httpAnalog: {
      method: "GET",
      path: "/api/signals.json",
      projection: "sectors[?slug=={sector}]",
    },
    rateLimit: { requestsPerMinute: 60, scope: "ip" },
    cost: { type: "free" },
  },
  {
    name: "find_dark_horse",
    title: "Find a Dark Horse",
    description:
      "Surface one under-the-radar startup with sustained engineering acceleration but low public visibility. Optionally constrained to a sector.",
    type: "mcp.prompt",
    arguments: [
      {
        name: "sector",
        description: "Optional sector slug to constrain the search.",
        required: false,
      },
    ],
    tags: ["dark-horse", "discovery", "alpha"],
    invoke: {
      transport: "mcp",
      method: "prompts/get",
      params: { name: "find_dark_horse" },
    },
    httpAnalog: { method: "GET", path: "/api/signals.json" },
    rateLimit: { requestsPerMinute: 60, scope: "ip" },
    cost: { type: "free" },
  },
  {
    name: "compare_startups",
    title: "Head-to-Head Compare",
    description:
      "Investor-grade comparison of two named startups across velocity, contributor growth, signal type, stage, and geography. Output is a markdown table plus a one-paragraph thesis differential.",
    type: "mcp.prompt",
    arguments: [
      { name: "name_a", description: "First startup display name or GitHub org slug.", required: true },
      { name: "name_b", description: "Second startup display name or GitHub org slug.", required: true },
    ],
    tags: ["compare", "diligence", "head-to-head"],
    invoke: {
      transport: "mcp",
      method: "prompts/get",
      params: { name: "compare_startups" },
    },
    httpAnalog: { method: "GET", path: "/api/signal", note: "Two calls, one per startup." },
    rateLimit: { requestsPerMinute: 30, scope: "ip" },
    cost: { type: "free" },
  },
  {
    name: "diligence_dossier",
    title: "Company Diligence Dossier",
    description:
      "One cited, public-source dossier for a company or entity: who acquired it (M&A history), which funds publicly backed it, and its published engineering-acceleration signal. Mid-diligence grounding for 'who acquired X', 'which funds backed Y', 'what's the signal on Z'. Returns found:false with an honest note when the entity is outside the tracked corpus — never guesses.",
    type: "mcp.tool",
    arguments: [
      {
        name: "company",
        description:
          "Company or entity name (target, acquirer, or tracked startup). Examples: 'Figma', 'Supabase', 'Broadcom', 'Auth0'.",
        required: true,
      },
    ],
    tags: ["diligence", "m&a", "investors", "grounding", "dossier"],
    invoke: {
      transport: "mcp",
      method: "tools/call",
      params: { name: "get_diligence_dossier" },
    },
    httpAnalog: {
      method: "GET",
      path: "/api/diligence.json",
      projection: "?company={company}",
    },
    rateLimit: { requestsPerMinute: 60, scope: "ip" },
    cost: { type: "free" },
  },
  {
    name: "acceleration_memo",
    title: "Acceleration Deal Memo",
    description:
      "One-page deal memo for a named startup: composite Scout Score, sector percentile, plain-English thesis, three comparables, and a recommended next action. Grounded in the live deep-signal profile.",
    type: "mcp.prompt",
    arguments: [
      {
        name: "name",
        description: "Startup display name or GitHub org slug.",
        required: true,
      },
    ],
    tags: ["memo", "deal-memo", "diligence", "deep-signal"],
    invoke: {
      transport: "mcp",
      method: "prompts/get",
      params: { name: "acceleration_memo" },
    },
    httpAnalog: { method: "POST", path: "/api/agent/deep-signal", auth: "creditPackKey | x402" },
    rateLimit: { requestsPerMinute: 30, scope: "credit-pack-key" },
    cost: {
      type: "paid",
      pricePerInvocation: { amount: "0.19", currency: "EUR" },
      paymentRails: ["creditPackKey", "x402-usdc-base"],
      purchaseUrl: `${SITE}/agents/credits`,
    },
  },
];

export async function GET() {
  const body = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE}/.well-known/skills.json`,
    name: "VC Deal Flow Signal — Skills Manifest",
    description:
      "Stable manifest of agent-callable skills exposed by this site. Each skill maps to an MCP prompt with a fully-specified invoke contract (transport + method + params), an optional REST httpAnalog for non-MCP agents, declared rate limits, and explicit free/paid cost. A fresh agent can enumerate every skill in one fetch without parsing the full OpenAPI document.",
    contractVersion: "2026-05-08.f37",
    version: "1.0.0",
    publisher: {
      "@type": "Organization",
      "@id": "https://gitdealflow.com/#organization",
      name: "VC Deal Flow Signal",
      alternateName: "GitDealFlow",
      url: "https://gitdealflow.com",
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    citation:
      "VC Deal Flow Signal (signals.gitdealflow.com), Q2 2026 data. SSRN: 6606558.",
    links: {
      mcpServer: `${SITE}/.well-known/mcp.json`,
      mcpRpc: `${SITE}/api/mcp/rpc`,
      agentCard: `${SITE}/.well-known/agent-card.json`,
      openapi: `${SITE}/api/openapi.json`,
      discover: `${SITE}/.well-known/discover.json`,
    },
    summary: {
      totalSkills: SKILLS.length,
      freeSkills: SKILLS.filter((s) => s.cost.type === "free").length,
      paidSkills: SKILLS.filter((s) => s.cost.type === "paid").length,
      transports: ["mcp.streamable-http", "mcp.stdio"],
    },
    itemListElement: SKILLS.map((skill, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "HowTo",
        "@id": `${SITE}/.well-known/skills.json#${skill.name}`,
        ...skill,
        // Override after spread so the schema.org-friendly title/description win:
        name: skill.title,
        description: skill.description,
      },
    })),
    skills: SKILLS,
  };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200",
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "index, follow",
      Link: `<${SITE}/.well-known/skills.json>; rel="canonical"`,
    },
  });
}
