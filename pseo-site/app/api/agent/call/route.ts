import { NextRequest } from "next/server";
import {
  getAllSectors,
  getCurrentPeriod,
  getSortedStartups,
  getDataLastModified,
  type Startup,
} from "@/lib/data";
import { slugify } from "@/lib/slugify";
import { buildDossier, dossierEnvelope } from "@/lib/diligence";

const BASE_URL = "https://signals.gitdealflow.com";

interface CallRequest {
  name?: string;
  arguments?: Record<string, unknown>;
}

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

function trendingPayload() {
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

function sectorPayload(sectorSlug: string) {
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

function startupPayload(name: string) {
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

function summaryPayload() {
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
      mcpHttp: `${BASE_URL}/api/mcp/rpc`,
    },
    website: "https://gitdealflow.com",
    dashboard: BASE_URL,
    citation: `VC Deal Flow Signal (signals.gitdealflow.com), ${period.name} data.`,
  };
}

async function methodologyPayload() {
  let methodology = "";
  try {
    const res = await fetch(`${BASE_URL}/llms-full.txt`, {
      headers: { "User-Agent": "gitdealflow-agent/1.4.0" },
    });
    if (res.ok) {
      const text = await res.text();
      methodology =
        text.split("## Methodology")[1]?.split("## Glossary")[0]?.trim() ?? "";
    }
  } catch {
    // best-effort
  }
  return { methodology, url: `${BASE_URL}/methodology` };
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

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
  let body: CallRequest;
  try {
    body = (await request.json()) as CallRequest;
  } catch {
    return Response.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const name = body.name;
  const args = (body.arguments ?? {}) as Record<string, unknown>;

  if (!name) {
    return Response.json(
      {
        error: "Missing 'name' field. Send { name: '<tool_name>', arguments: {...} }.",
        availableTools: [
          "get_trending_startups",
          "search_startups_by_sector",
          "get_startup_signal",
          "get_diligence_dossier",
          "get_signals_summary",
          "get_methodology",
        ],
      },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  switch (name) {
    case "get_trending_startups":
      return Response.json(trendingPayload(), {
        headers: { ...CORS_HEADERS, "Cache-Control": "no-store" },
      });

    case "search_startups_by_sector": {
      const sector = String(args.sector ?? "");
      if (!sector) {
        return Response.json(
          { error: "Missing required parameter: sector" },
          { status: 400, headers: CORS_HEADERS }
        );
      }
      const data = sectorPayload(sector);
      return Response.json(data, {
        status: "error" in data ? 404 : 200,
        headers: { ...CORS_HEADERS, "Cache-Control": "no-store" },
      });
    }

    case "get_startup_signal": {
      const startupName = String(args.name ?? "");
      if (!startupName) {
        return Response.json(
          { error: "Missing required parameter: name" },
          { status: 400, headers: CORS_HEADERS }
        );
      }
      return Response.json(startupPayload(startupName), {
        headers: { ...CORS_HEADERS, "Cache-Control": "no-store" },
      });
    }

    case "get_signals_summary":
      return Response.json(summaryPayload(), {
        headers: { ...CORS_HEADERS, "Cache-Control": "no-store" },
      });

    case "get_diligence_dossier": {
      const entity = String(args.company ?? args.entity ?? args.name ?? "").trim();
      if (!entity) {
        return Response.json(
          { error: "Missing required parameter: company" },
          { status: 400, headers: CORS_HEADERS }
        );
      }
      const asOf = getDataLastModified().toISOString().slice(0, 10);
      const dossier = buildDossier(entity);
      return Response.json(dossierEnvelope(dossier, entity, asOf), {
        status: dossier.found ? 200 : 404,
        headers: { ...CORS_HEADERS, "Cache-Control": "no-store" },
      });
    }

    case "get_scout_receipts": {
      const username = String(args.github_username ?? "").trim();
      if (
        !username ||
        !/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(username)
      ) {
        return Response.json(
          {
            error:
              "Invalid github_username. Must be 1-39 chars, alphanumeric + single hyphens.",
          },
          { status: 400, headers: CORS_HEADERS }
        );
      }
      const url = `${BASE_URL}/api/receipts/${encodeURIComponent(username)}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "gitdealflow-agent/1.5.0" },
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        return Response.json(
          { error: `HTTP ${res.status} from /api/receipts/${username}`, detail: body.slice(0, 500) },
          { status: res.status, headers: CORS_HEADERS }
        );
      }
      const data = await res.json();
      const enriched = {
        ...data,
        share_url: `${BASE_URL}/receipts/${encodeURIComponent(username)}`,
        og_image_url: `${BASE_URL}/api/og/receipts/${encodeURIComponent(username)}`,
      };
      return Response.json(enriched, {
        headers: { ...CORS_HEADERS, "Cache-Control": "no-store" },
      });
    }

    case "get_methodology":
      return Response.json(await methodologyPayload(), {
        headers: { ...CORS_HEADERS, "Cache-Control": "no-store" },
      });

    case "get_deep_signal": {
      // Paid per-request tool, forward to the dedicated /api/agent/deep-signal
      // route that owns auth + credit decrement + enrichment. Keeping that route
      // as the single source of truth avoids divergence.
      const startupName = String(args.name ?? "");
      const auth = request.headers.get("authorization");
      const url = new URL(request.url);
      const forwardUrl = `${url.protocol}//${url.host}/api/agent/deep-signal`;
      const fwdRes = await fetch(forwardUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(auth ? { Authorization: auth } : {}),
        },
        body: JSON.stringify({ name: startupName }),
      });
      const fwdBody = await fwdRes.text();
      return new Response(fwdBody, {
        status: fwdRes.status,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": fwdRes.headers.get("content-type") ?? "application/json",
          "Cache-Control": "no-store",
          ...(fwdRes.headers.get("x-credits-balance")
            ? { "X-Credits-Balance": fwdRes.headers.get("x-credits-balance")! }
            : {}),
        },
      });
    }

    default:
      return Response.json(
        {
          error: `Unknown tool: "${name}"`,
          availableTools: [
            "get_trending_startups",
            "search_startups_by_sector",
            "get_startup_signal",
            "get_signals_summary",
            "get_scout_receipts",
            "get_methodology",
            "get_deep_signal",
          ],
        },
        { status: 404, headers: CORS_HEADERS }
      );
  }
}
