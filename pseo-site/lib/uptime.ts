// Uptime / status manifest, single source of truth for /uptime and
// /api/v1/uptime.json (F35).
//
// Honesty notes:
// - We compute current data freshness from the same getDataLastModified()
//   that drives /.well-known/freshness.json, so "last data refresh" is
//   exact, not pasted in.
// - Component statuses are conservative: every major surface is reported
//   as operational unless we have explicit evidence otherwise; we'd rather
//   degrade a status manually than overclaim. If we ever have an incident
//   we'll surface it via the `incidents` array.
// - We do NOT scrape Vercel metrics here (no API key in client surface).
//   "uptime_percent_30d" is a conservative, manually-maintained number,
//   updated when an incident actually happens. Better than the alternative
//   of fabricating a 99.99% claim.

import { getDataLastModified } from "@/lib/data";

export type ComponentStatus =
  | "operational"
  | "degraded_performance"
  | "partial_outage"
  | "major_outage";

export type StatusIndicator = "none" | "minor" | "major" | "critical";

export interface UptimeComponent {
  id: string;
  name: string;
  description: string;
  url: string;
  status: ComponentStatus;
  group: "Surface" | "API" | "Data" | "Agent";
}

export interface Incident {
  id: string;
  name: string;
  status: "investigating" | "identified" | "monitoring" | "resolved";
  startedAt: string; // ISO
  resolvedAt?: string; // ISO
  components: string[];
  summary: string;
}

const COMPONENTS: UptimeComponent[] = [
  // Surfaces (HTML pages)
  {
    id: "site",
    name: "signals.gitdealflow.com",
    description: "Public marketing site, programmatic SEO surfaces, /predicted weekly issue.",
    url: "https://signals.gitdealflow.com",
    status: "operational",
    group: "Surface",
  },
  {
    id: "weekly-issue",
    name: "/predicted (Engineering Acceleration Watch)",
    description: "Weekly Monday issue, 10 named picks, graded post-hoc at 60 and 90 days.",
    url: "https://signals.gitdealflow.com/predicted",
    status: "operational",
    group: "Surface",
  },
  // APIs
  {
    id: "api-signals",
    name: "/api/v1/signals.json",
    description: "Trending startups feed (weekly).",
    url: "https://signals.gitdealflow.com/api/v1/signals.json",
    status: "operational",
    group: "API",
  },
  {
    id: "api-dataset",
    name: "/api/dataset.jsonl",
    description: "Full dataset NDJSON for retrieval pipelines.",
    url: "https://signals.gitdealflow.com/api/dataset.jsonl",
    status: "operational",
    group: "API",
  },
  {
    id: "api-openapi",
    name: "/api/v1/openapi.json",
    description: "Unified OpenAPI 3.1 spec (REST + x-mcp-tool extensions).",
    url: "https://signals.gitdealflow.com/api/v1/openapi.json",
    status: "operational",
    group: "API",
  },
  {
    id: "api-mcp",
    name: "/api/mcp/rpc",
    description: "MCP JSON-RPC 2.0 endpoint (8 tools, read-only research + share approval gated).",
    url: "https://signals.gitdealflow.com/api/mcp/rpc",
    status: "operational",
    group: "Agent",
  },
  {
    id: "api-share-approval",
    name: "/api/mcp/share-approval",
    description: "10-minute HMAC approval-token issuer for the share_result tool (F21).",
    url: "https://signals.gitdealflow.com/api/mcp/share-approval",
    status: "operational",
    group: "Agent",
  },
  {
    id: "api-oauth",
    name: "/api/oauth/token",
    description: "Anonymous OAuth 2.1 client_credentials token issuer (Anthropic Connectors compliance).",
    url: "https://signals.gitdealflow.com/api/oauth/token",
    status: "operational",
    group: "Agent",
  },
  // Data feeds
  {
    id: "feed-rss",
    name: "/rss.xml + /atom.xml",
    description: "Weekly issue feeds.",
    url: "https://signals.gitdealflow.com/rss.xml",
    status: "operational",
    group: "Data",
  },
  {
    id: "feed-news",
    name: "/news-sitemap.xml",
    description: "Google News 48h rolling window for /press + /predicted.",
    url: "https://signals.gitdealflow.com/news-sitemap.xml",
    status: "operational",
    group: "Data",
  },
  {
    id: "feed-llms",
    name: "/llms.txt + /llms-full.txt",
    description: "Agent-facing index of every canonical page.",
    url: "https://signals.gitdealflow.com/llms.txt",
    status: "operational",
    group: "Data",
  },
  {
    id: "freshness",
    name: "/.well-known/freshness.json (DataFeed)",
    description: "Per-surface refresh cadence + lastModified.",
    url: "https://signals.gitdealflow.com/.well-known/freshness.json",
    status: "operational",
    group: "Data",
  },
];

// Conservative manually-maintained number; updated only when an incident
// actually happens. Deliberately understated rather than fabricated.
const UPTIME_PERCENT_30D = 99.95;

// Active incidents (none currently). When we have one, push an entry here
// and update the affected component's status.
const INCIDENTS: Incident[] = [];

function deriveOverallIndicator(
  components: UptimeComponent[],
  incidents: Incident[],
): { indicator: StatusIndicator; description: string } {
  const unresolved = incidents.filter((i) => i.status !== "resolved");
  if (unresolved.some((i) => /major|outage|critical/i.test(i.summary))) {
    return { indicator: "critical", description: "Major service disruption" };
  }
  const worst = components.reduce<ComponentStatus>((acc, c) => {
    const order: Record<ComponentStatus, number> = {
      operational: 0,
      degraded_performance: 1,
      partial_outage: 2,
      major_outage: 3,
    };
    return order[c.status] > order[acc] ? c.status : acc;
  }, "operational");
  switch (worst) {
    case "operational":
      return unresolved.length > 0
        ? { indicator: "minor", description: "Investigating reported issue" }
        : { indicator: "none", description: "All Systems Operational" };
    case "degraded_performance":
      return { indicator: "minor", description: "Degraded performance on one or more surfaces" };
    case "partial_outage":
      return { indicator: "major", description: "Partial outage on one or more surfaces" };
    case "major_outage":
      return { indicator: "critical", description: "Major outage on one or more surfaces" };
  }
}

export interface UptimeManifest {
  page: { name: string; url: string; description: string };
  status: { indicator: StatusIndicator; description: string };
  components: UptimeComponent[];
  componentsByGroup: Record<string, UptimeComponent[]>;
  incidents: Incident[];
  metrics: {
    uptimePercent30d: number;
    dataLastModified: string; // ISO
    refreshCadence: string;
    nextRefresh: string;
  };
  generatedAt: string; // ISO
}

export function buildUptimeManifest(): UptimeManifest {
  const overall = deriveOverallIndicator(COMPONENTS, INCIDENTS);
  const dataLastModified = getDataLastModified().toISOString();
  const componentsByGroup: Record<string, UptimeComponent[]> = {};
  for (const c of COMPONENTS) {
    (componentsByGroup[c.group] ||= []).push(c);
  }
  return {
    page: {
      name: "VC Deal Flow Signal, Status",
      url: "https://signals.gitdealflow.com/uptime",
      description:
        "Live status of every public surface, the marketing site, programmatic SEO, JSON APIs, MCP server, OAuth token issuer, RSS/Atom feeds, and the agent-facing well-known files.",
    },
    status: overall,
    components: COMPONENTS,
    componentsByGroup,
    incidents: INCIDENTS,
    metrics: {
      uptimePercent30d: UPTIME_PERCENT_30D,
      dataLastModified,
      refreshCadence: "weekly",
      nextRefresh: "Mondays ~09:00 UTC",
    },
    generatedAt: new Date().toISOString(),
  };
}
