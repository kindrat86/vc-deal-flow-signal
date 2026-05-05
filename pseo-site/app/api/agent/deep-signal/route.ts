import { NextResponse } from "next/server";
import {
  getAllSectors,
  getCurrentPeriod,
  getSortedStartups,
  getStartupProfile,
  type Startup,
} from "@/lib/data";
import { slugify } from "@/lib/slugify";
import { extractBearer, parseApiKeyV2 } from "@/lib/api-key";
import { consumeCredit, getCredits } from "@/lib/credits";

const BASE_URL = "https://signals.gitdealflow.com";
const PURCHASE_URL = "https://signals.gitdealflow.com/agents/credits";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
} as const;

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { ...CORS, "Access-Control-Max-Age": "86400" },
  });
}

interface DeepSignalRequest {
  name?: string;
}

function parsePercent(s: string): number {
  const n = parseInt(s.replace(/[^0-9-]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function scoreVelocity(velocityChangePercent: number): number {
  // -50% → 0, 0% → 50, +200% → 100. Linear inside, clamped outside.
  return clamp01(50 + velocityChangePercent / 4);
}

function scoreGrowth(growthPercent: number): number {
  // -25% → 0, 0% → 50, +100% → 100.
  return clamp01(50 + growthPercent / 2);
}

function scoreNovelty(newRepos: number): number {
  // 0 repos → 0, 5 → 75, 10+ → 100. Diminishing returns.
  return clamp01(100 * (1 - Math.pow(0.85, newRepos)));
}

function thesisFor(s: Startup, sectorName: string, scores: {
  velocity: number;
  growth: number;
  novelty: number;
  composite: number;
}): string {
  const lead = s.signalType === "breakout"
    ? `${s.name} is in active breakout`
    : s.signalType === "acceleration"
    ? `${s.name} is sustaining acceleration`
    : s.signalType === "cooling"
    ? `${s.name} is cooling`
    : `${s.name} is steady-state`;
  const dominant =
    scores.velocity >= Math.max(scores.growth, scores.novelty)
      ? `commit velocity (${s.commitVelocityChange})`
      : scores.growth >= scores.novelty
      ? `contributor growth (${s.contributorGrowth})`
      : `repo expansion (${s.newRepos} new repos in 30d)`;
  const stageBit = s.stage && s.stage !== "Unknown" ? ` at ${s.stage}` : "";
  const closing = scores.composite >= 70
    ? `Worth diligence this week.`
    : scores.composite >= 50
    ? `Watch-list candidate; revisit if velocity holds.`
    : `Below median for ${sectorName}; pass unless thesis-aligned.`;
  return `${lead}${stageBit} in ${sectorName} — driven primarily by ${dominant}. ${closing}`;
}

interface DeepSignal {
  name: string;
  found: true;
  sector: string;
  stage: string;
  geography: string;
  signalType: string;
  commitVelocity14d: number;
  commitVelocityChange: string;
  contributors: number;
  contributorGrowth: string;
  newRepos: number;
  scores: {
    velocity: number;
    growth: number;
    novelty: number;
    composite: number;
  };
  rank: {
    inSector: number;
    sectorTotal: number;
    sectorPercentile: number;
  };
  thesis: string;
  comparables: Array<{ name: string; commitVelocityChange: string; signalType: string }>;
  history: Array<{
    period: string;
    commitVelocity14d: number;
    commitVelocityChange: string;
    contributors: number;
    signalType: string;
  }>;
  links: {
    githubUrl: string;
    websiteUrl?: string;
    linkedinUrl?: string;
    profileUrl: string;
  };
  citation: string;
  source: string;
}

function buildDeepSignal(name: string): DeepSignal | { found: false; suggestion: string } {
  const slug = slugify(name);
  const period = getCurrentPeriod();
  const sectors = getAllSectors();

  let foundStartup: Startup | null = null;
  let foundSector: { slug: string; name: string } | null = null;

  for (const sector of sectors) {
    const snap = sector.periods[period.slug];
    if (!snap) continue;
    const match = snap.startups.find((st) => slugify(st.name) === slug);
    if (match) {
      foundStartup = match;
      foundSector = { slug: sector.slug, name: sector.name };
      break;
    }
  }

  if (!foundStartup || !foundSector) {
    return {
      found: false,
      suggestion:
        "Use the free /api/signal endpoint or get_trending_startups MCP tool to discover the correct name.",
    };
  }

  const sector = sectors.find((s) => s.slug === foundSector!.slug)!;
  const sectorStartups = getSortedStartups(sector.periods[period.slug].startups);
  const sectorTotal = sectorStartups.length;
  const sectorRank =
    sectorStartups.findIndex((s) => slugify(s.name) === slug) + 1;
  const sectorPercentile =
    sectorTotal > 0 ? Math.round(((sectorTotal - sectorRank + 1) / sectorTotal) * 100) : 0;

  const velocityPct = parsePercent(foundStartup.commitVelocityChange);
  const growthPct = parsePercent(foundStartup.contributorGrowth);
  const novelty = scoreNovelty(foundStartup.newRepos);
  const velocity = scoreVelocity(velocityPct);
  const growth = scoreGrowth(growthPct);
  const composite = clamp01(0.5 * velocity + 0.3 * growth + 0.2 * novelty);

  const scores = { velocity, growth, novelty, composite };

  const comparables = sectorStartups
    .filter((s) => slugify(s.name) !== slug)
    .slice(0, 3)
    .map((s) => ({
      name: s.name,
      commitVelocityChange: s.commitVelocityChange,
      signalType: s.signalType,
    }));

  const profile = getStartupProfile(slug);
  const history =
    profile?.history.slice(0, 6).map((h) => ({
      period: h.periodName,
      commitVelocity14d: h.commitVelocity14d,
      commitVelocityChange: h.commitVelocityChange,
      contributors: h.contributors,
      signalType: h.signalType,
    })) ?? [];

  return {
    name: foundStartup.name,
    found: true,
    sector: foundSector.name,
    stage: foundStartup.stage,
    geography: foundStartup.geography,
    signalType: foundStartup.signalType,
    commitVelocity14d: foundStartup.commitVelocity14d,
    commitVelocityChange: foundStartup.commitVelocityChange,
    contributors: foundStartup.contributors,
    contributorGrowth: foundStartup.contributorGrowth,
    newRepos: foundStartup.newRepos,
    scores,
    rank: {
      inSector: sectorRank,
      sectorTotal,
      sectorPercentile,
    },
    thesis: thesisFor(foundStartup, foundSector.name, scores),
    comparables,
    history,
    links: {
      githubUrl: foundStartup.githubUrl,
      ...(foundStartup.websiteUrl ? { websiteUrl: foundStartup.websiteUrl } : {}),
      ...(foundStartup.linkedinUrl ? { linkedinUrl: foundStartup.linkedinUrl } : {}),
      profileUrl: `${BASE_URL}/startup/${slug}`,
    },
    citation: `VC Deal Flow Signal (signals.gitdealflow.com), ${period.name} data — deep signal v1.`,
    source: BASE_URL,
  };
}

export async function POST(request: Request) {
  const token = extractBearer(request.headers.get("authorization"));
  if (!token) {
    return NextResponse.json(
      {
        error: "missing_api_key",
        message:
          "Send Authorization: Bearer gdf_v2.<customerId>.<hmac>. Buy 100 credits for €19 at " +
          PURCHASE_URL,
        purchaseUrl: PURCHASE_URL,
      },
      { status: 401, headers: CORS }
    );
  }

  const parsed = parseApiKeyV2(token);
  if (!parsed) {
    return NextResponse.json(
      {
        error: "invalid_api_key",
        message:
          "API key signature did not validate. Re-check the value from the welcome email or get a fresh key at " +
          PURCHASE_URL,
        purchaseUrl: PURCHASE_URL,
      },
      { status: 401, headers: CORS }
    );
  }

  let body: DeepSignalRequest;
  try {
    body = (await request.json()) as DeepSignalRequest;
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "POST body must be JSON: { name: 'startup-name' }" },
      { status: 400, headers: CORS }
    );
  }

  const name = (body.name ?? "").trim();
  if (!name || name.length > 100) {
    return NextResponse.json(
      { error: "invalid_name", message: "Required: { name: string, 1-100 chars }" },
      { status: 400, headers: CORS }
    );
  }

  // Pre-flight balance check — return 402 BEFORE consuming so callers can top up.
  const credits = await getCredits(parsed.customerId);
  if (credits.balance < 1) {
    return NextResponse.json(
      {
        error: "insufficient_credits",
        message: `Out of credits. Balance: ${credits.balance}. Buy 100 more for €19 at ${PURCHASE_URL}.`,
        balance: credits.balance,
        purchaseUrl: PURCHASE_URL,
      },
      { status: 402, headers: CORS }
    );
  }

  const result = buildDeepSignal(name);

  // Only consume on a real hit. Misses are free — agents shouldn't pay for "not found".
  if (!result.found) {
    return NextResponse.json(
      { ...result, balance: credits.balance, charged: 0 },
      { status: 200, headers: { ...CORS, "X-Credits-Balance": String(credits.balance) } }
    );
  }

  const consume = await consumeCredit(parsed.customerId);
  if (!consume.ok) {
    return NextResponse.json(
      {
        error: "insufficient_credits",
        message: `Out of credits. Buy 100 more for €19 at ${PURCHASE_URL}.`,
        balance: 0,
        purchaseUrl: PURCHASE_URL,
      },
      { status: 402, headers: CORS }
    );
  }

  return NextResponse.json(
    { ...result, balance: consume.balance, charged: 1 },
    {
      status: 200,
      headers: {
        ...CORS,
        "X-Credits-Balance": String(consume.balance),
        "Cache-Control": "no-store",
      },
    }
  );
}
