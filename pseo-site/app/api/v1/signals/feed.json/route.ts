/**
 * /api/v1/signals/feed.json — lightweight CORS-enabled feed for the embeddable ticker widget.
 *
 * Returns the top N trending startups with minimal fields optimized for
 * the live deal-flow ticker. Always public, no auth required.
 *
 * Query params:
 *   limit  — max results (default 10, max 20)
 *   sector — filter by sector slug (optional)
 */
import { NextRequest } from "next/server";
import { getAllSectors, getCurrentPeriod, getDataLastModified } from "@/lib/data";
import type { Startup } from "@/lib/data";

export const runtime = "nodejs";

const BASE_URL = "https://signals.gitdealflow.com";
const MAX_LIMIT = 20;
const DEFAULT_LIMIT = 10;

type SignalEntry = Startup & {
  sectorName: string;
  sectorSlug: string;
};

type FeedItem = {
  name: string;
  sector: string;
  sectorSlug: string;
  stage: string;
  geography: string;
  velocity: number;
  velocityChange: string;
  signalType: string;
  profileUrl: string;
  websiteUrl?: string;
};

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const limit = Math.min(
    Math.max(
      parseInt(url.searchParams.get("limit") || String(DEFAULT_LIMIT), 10),
      1
    ),
    MAX_LIMIT
  );
  const sectorFilter = url.searchParams.get("sector");

  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const lastModified = getDataLastModified();
  const activeSectors = sectors.filter((s) => s.periods[period.slug]);

  const filteredSectors = sectorFilter
    ? activeSectors.filter((s) => s.slug === sectorFilter)
    : activeSectors;

  // Flatten all startups with sector metadata
  const allStartups: SignalEntry[] = [];
  for (const s of filteredSectors) {
    for (const st of s.periods[period.slug].startups) {
      allStartups.push({
        ...st,
        sectorName: s.name,
        sectorSlug: s.slug,
      });
    }
  }

  // Sort by commit velocity descending (same as getSortedStartups)
  allStartups.sort((a, b) => (b.commitVelocity14d ?? 0) - (a.commitVelocity14d ?? 0));

  const top: FeedItem[] = allStartups.slice(0, limit).map((st) => ({
    name: st.name,
    sector: st.sectorName,
    sectorSlug: st.sectorSlug,
    stage: st.stage,
    geography: st.geography,
    velocity: st.commitVelocity14d,
    velocityChange: st.commitVelocityChange,
    signalType: st.signalType,
    profileUrl: `${BASE_URL}/startup/${encodeURIComponent(
      st.name.toLowerCase().replace(/\s+/g, "-")
    )}`,
    ...(st.websiteUrl ? { websiteUrl: st.websiteUrl } : {}),
  }));

  const payload = {
    meta: {
      period: period.name,
      lastUpdated: lastModified.toISOString(),
      totalStartups: allStartups.length,
      citation: `VC Deal Flow Signal (signals.gitdealflow.com), ${period.name} data.`,
    },
    signals: top,
  };

  return new Response(JSON.stringify(payload), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=600",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
