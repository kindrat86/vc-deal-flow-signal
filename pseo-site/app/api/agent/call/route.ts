import { NextRequest } from "next/server";
import {
  getAllSectors,
  getCurrentPeriod,
  getSortedStartups,
  type Startup,
} from "@/lib/data";
import { slugify } from "@/lib/slugify";
import { verifyApiKey } from "@/lib/api-key";
import {
  decrementCustomerBalanceCents,
  getCustomerBalanceCents,
  resolveTierForCustomer,
  stripe,
} from "@/lib/stripe";

const BASE_URL = "https://signals.gitdealflow.com";

const PAID_TOOLS = new Set([
  "research_company",
  "compose_thesis",
  "deep_dive_scan",
]);
const PAID_CALL_COST_CENTS = 10;
const INSIDER_DAILY_QUOTA = 1000;

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
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
} as const;

function unauthorizedResponse(reason: string) {
  return Response.json(
    {
      error: reason,
      hint: "Get an API key at https://signals.gitdealflow.com/pricing — €19 starts you with 190 paid agent calls. Free tools work without any auth.",
      paidTools: Array.from(PAID_TOOLS),
    },
    { status: 401, headers: CORS_HEADERS }
  );
}

function paymentRequiredResponse(reason: string, balanceCents: number) {
  return Response.json(
    {
      error: reason,
      balanceEur: (balanceCents / 100).toFixed(2),
      topUpUrl: `${BASE_URL}/dashboard/billing`,
      hint: "Top up at /dashboard/billing or upgrade to Insider Circle for unlimited calls.",
    },
    { status: 402, headers: CORS_HEADERS }
  );
}

function quotaExceededResponse(used: number) {
  return Response.json(
    {
      error: `Daily fair-use quota reached (${used}/${INSIDER_DAILY_QUOTA} calls today).`,
      hint: "Insider quota resets at 00:00 UTC. Free tools keep working.",
    },
    { status: 429, headers: CORS_HEADERS }
  );
}

function todayKey(): string {
  return `gdf_calls_${new Date().toISOString().slice(0, 10)}`;
}

async function meterPaidCall(
  customerId: string
): Promise<
  | { ok: true; tier: "payg" | "insider"; balanceCents?: number; callsToday?: number }
  | { ok: false; response: Response }
> {
  const tier = await resolveTierForCustomer(customerId);
  if (tier === "dashboard") {
    const balance = await getCustomerBalanceCents(customerId);
    return {
      ok: false,
      response: paymentRequiredResponse(
        "No active subscription and zero PAYG balance.",
        balance
      ),
    };
  }
  if (tier === "insider") {
    // Best-effort daily quota tracking via Stripe customer metadata.
    // NOTE: Race-prone under concurrent requests; acceptable until we move metering to a real DB.
    const customer = await stripe.customers.retrieve(customerId);
    if (!customer || (customer as { deleted?: boolean }).deleted) {
      return {
        ok: false,
        response: paymentRequiredResponse("Customer not found.", 0),
      };
    }
    const meta = (customer as { metadata?: Record<string, string> }).metadata ?? {};
    const key = todayKey();
    const used = parseInt(meta[key] ?? "0", 10) || 0;
    if (used >= INSIDER_DAILY_QUOTA) {
      return { ok: false, response: quotaExceededResponse(used) };
    }
    const next = used + 1;
    await stripe.customers.update(customerId, {
      metadata: { ...meta, [key]: String(next) },
    });
    return { ok: true, tier, callsToday: next };
  }
  // PAYG: try to debit
  const result = await decrementCustomerBalanceCents(customerId, PAID_CALL_COST_CENTS);
  if (!result.ok) {
    return {
      ok: false,
      response: paymentRequiredResponse(
        `Insufficient balance (need €${(PAID_CALL_COST_CENTS / 100).toFixed(2)}, have €${(result.balance / 100).toFixed(2)}).`,
        result.balance
      ),
    };
  }
  return { ok: true, tier, balanceCents: result.balance };
}

function meterFooter(meter: { tier: "payg" | "insider"; balanceCents?: number; callsToday?: number }) {
  if (meter.tier === "payg") {
    return {
      tier: "payg",
      costEur: (PAID_CALL_COST_CENTS / 100).toFixed(2),
      balanceEur: typeof meter.balanceCents === "number" ? (meter.balanceCents / 100).toFixed(2) : null,
    };
  }
  return {
    tier: "insider",
    callsToday: meter.callsToday ?? null,
    dailyQuota: INSIDER_DAILY_QUOTA,
  };
}

function researchCompanyPayload(name: string) {
  const target = slugify(name);
  const period = getCurrentPeriod();
  for (const sector of getAllSectors()) {
    const snap = sector.periods[period.slug];
    if (!snap) continue;
    const match = snap.startups.find((st) => slugify(st.name) === target);
    if (!match) continue;
    const sorted = getSortedStartups(snap.startups);
    const rank = sorted.findIndex((s) => slugify(s.name) === target) + 1;
    const peers = sorted
      .filter((s) => slugify(s.name) !== target)
      .slice(0, 5)
      .map((s, i) => startupRow(s, i + 1, sector.name));
    return {
      startup: startupRow(match, rank, sector.name),
      sectorRank: { rank, of: sorted.length },
      peers,
      period: period.name,
      citation: `VC Deal Flow Signal — research_company (paid agent tool), ${period.name} data.`,
    };
  }
  return {
    found: false,
    suggestion:
      "Use search_startups_by_sector to browse, then call research_company with an exact match.",
  };
}

function composeThesisPayload(name: string) {
  const research = researchCompanyPayload(name);
  if ("found" in research && research.found === false) return research;
  const r = research as ReturnType<typeof researchCompanyPayload> & {
    startup: ReturnType<typeof startupRow>;
    sectorRank: { rank: number; of: number };
    peers: ReturnType<typeof startupRow>[];
    period: string;
  };
  const s = r.startup;
  const strengths: string[] = [];
  if (parseFloat(String(s.commitVelocityChange).replace(/[+%]/g, "")) > 0) {
    strengths.push(`Commit velocity ${s.commitVelocityChange} vs prior period.`);
  }
  if (parseFloat(String(s.contributorGrowth).replace(/[+%]/g, "")) > 0) {
    strengths.push(`Contributor growth ${s.contributorGrowth} — team scaling.`);
  }
  if (s.newRepos > 0) {
    strengths.push(`${s.newRepos} new repos in window — infra buildout.`);
  }
  return {
    company: s.name,
    sector: s.sector,
    snapshot: s.description,
    signalType: s.signalType,
    sectorRank: r.sectorRank,
    strengths,
    peers: r.peers,
    period: r.period,
    citation: `VC Deal Flow Signal — compose_thesis (paid agent tool), ${r.period} data.`,
  };
}

function deepDiveScanPayload(sectorSlug: string) {
  const period = getCurrentPeriod();
  const sector = getAllSectors().find(
    (s) => s.slug === sectorSlug && s.periods[period.slug]
  );
  if (!sector) {
    return {
      error: `Sector "${sectorSlug}" not found.`,
      availableSectors: getAllSectors()
        .filter((s) => s.periods[period.slug])
        .map((s) => s.slug),
    };
  }
  const sorted = getSortedStartups(sector.periods[period.slug].startups);
  const breakouts = sorted.filter((s) => /breakout|hot/i.test(s.signalType ?? ""));
  const cold = sorted.filter((s) => /cold|declining/i.test(s.signalType ?? ""));
  return {
    sector: { slug: sector.slug, name: sector.name, description: sector.description },
    period: period.name,
    summary: {
      total: sorted.length,
      breakouts: breakouts.length,
      cold: cold.length,
    },
    breakouts: breakouts.slice(0, 10).map((s, i) => startupRow(s, i + 1, sector.name)),
    cold: cold.slice(0, 5).map((s, i) => startupRow(s, i + 1, sector.name)),
    top10ByCommitVelocity: sorted.slice(0, 10).map((s, i) => startupRow(s, i + 1, sector.name)),
    citation: `VC Deal Flow Signal — deep_dive_scan (paid agent tool), ${period.name} data.`,
  };
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
        freeTools: [
          "get_trending_startups",
          "search_startups_by_sector",
          "get_startup_signal",
          "get_signals_summary",
          "get_methodology",
        ],
        paidTools: Array.from(PAID_TOOLS),
      },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  // Paid tool gate: verify API key, resolve tier, debit balance / check quota.
  let paidMeter: { tier: "payg" | "insider"; balanceCents?: number; callsToday?: number } | null = null;
  if (PAID_TOOLS.has(name)) {
    const auth = request.headers.get("authorization") ?? "";
    const match = auth.match(/^Bearer\s+(.+)$/i);
    const key = match?.[1]?.trim() ?? "";
    if (!key) {
      return unauthorizedResponse(
        "Paid tool requires an API key. Pass it as 'Authorization: Bearer gdf_v2_...'."
      );
    }
    const verified = verifyApiKey(key);
    if (!verified) {
      return unauthorizedResponse("Invalid API key.");
    }
    const meter = await meterPaidCall(verified.customerId);
    if (!meter.ok) return meter.response;
    paidMeter = {
      tier: meter.tier,
      balanceCents: meter.balanceCents,
      callsToday: meter.callsToday,
    };
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

    case "research_company": {
      const companyName = String(args.name ?? args.company ?? "").trim();
      if (!companyName) {
        return Response.json(
          { error: "Missing required parameter: name (company name)" },
          { status: 400, headers: CORS_HEADERS }
        );
      }
      return Response.json(
        { ...researchCompanyPayload(companyName), _meter: paidMeter ? meterFooter(paidMeter) : null },
        { headers: { ...CORS_HEADERS, "Cache-Control": "no-store" } }
      );
    }

    case "compose_thesis": {
      const companyName = String(args.name ?? args.company ?? "").trim();
      if (!companyName) {
        return Response.json(
          { error: "Missing required parameter: name (company name)" },
          { status: 400, headers: CORS_HEADERS }
        );
      }
      return Response.json(
        { ...composeThesisPayload(companyName), _meter: paidMeter ? meterFooter(paidMeter) : null },
        { headers: { ...CORS_HEADERS, "Cache-Control": "no-store" } }
      );
    }

    case "deep_dive_scan": {
      const sector = String(args.sector ?? "").trim();
      if (!sector) {
        return Response.json(
          { error: "Missing required parameter: sector (slug)" },
          { status: 400, headers: CORS_HEADERS }
        );
      }
      return Response.json(
        { ...deepDiveScanPayload(sector), _meter: paidMeter ? meterFooter(paidMeter) : null },
        { headers: { ...CORS_HEADERS, "Cache-Control": "no-store" } }
      );
    }

    default:
      return Response.json(
        {
          error: `Unknown tool: "${name}"`,
          freeTools: [
            "get_trending_startups",
            "search_startups_by_sector",
            "get_startup_signal",
            "get_signals_summary",
            "get_scout_receipts",
            "get_methodology",
          ],
          paidTools: Array.from(PAID_TOOLS),
        },
        { status: 404, headers: CORS_HEADERS }
      );
  }
}
