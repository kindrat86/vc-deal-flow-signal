import { NextResponse } from "next/server";
import { getAllSectors, getCurrentPeriod } from "@/lib/data";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";

/** Allowed origins for the signal API (Chrome extension + own sites). */
const SIGNAL_ALLOWED_ORIGINS = [
  "https://signals.gitdealflow.com",
  "https://gitdealflow.com",
  "https://www.gitdealflow.com",
  "https://www.crunchbase.com",
  "https://www.angellist.com",
  "https://wellfound.com",
  "https://www.wellfound.com",
];

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin") || "";
  // Allow Chrome extension requests (no origin header) and listed origins
  const allowOrigin = !origin || SIGNAL_ALLOWED_ORIGINS.includes(origin) ? origin || "*" : "";
  return {
    ...(allowOrigin ? { "Access-Control-Allow-Origin": allowOrigin } : {}),
    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
  };
}

export async function GET(request: Request) {
  // Rate limit: 30 requests per minute per IP (read-only, but prevent scraping)
  const ip = getClientIp(request);
  const rl = checkRateLimit(`signal:${ip}`, 30, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { ...corsHeaders(request), ...rateLimitHeaders(rl) } }
    );
  }

  const { searchParams } = new URL(request.url);
  const company = (searchParams.get("company") || "").trim().toLowerCase();

  if (!company) {
    return NextResponse.json({ error: "Missing company parameter" }, { status: 400 });
  }

  const sectors = getAllSectors();
  const period = getCurrentPeriod();

  // Search across all sectors for a fuzzy match
  for (const sector of sectors) {
    const snapshot = sector.periods[period.slug];
    if (!snapshot) continue;

    for (const startup of snapshot.startups) {
      const nameNorm = startup.name.toLowerCase().replace(/[^a-z0-9]/g, "");
      const queryNorm = company.replace(/[^a-z0-9]/g, "");

      // Exact or substring match
      if (nameNorm === queryNorm || nameNorm.includes(queryNorm) || queryNorm.includes(nameNorm)) {
        const velocityNum = parseInt(startup.commitVelocityChange.replace(/[^0-9-]/g, ""), 10) || 0;

        let status: "accelerating" | "steady" | "decelerating";
        if (velocityNum >= 50) status = "accelerating";
        else if (velocityNum >= -30) status = "steady";
        else status = "decelerating";

        return NextResponse.json({
          status,
          name: startup.name,
          commitVelocity14d: startup.commitVelocity14d,
          velocityChange: startup.commitVelocityChange,
          contributors: startup.contributors,
          contributorGrowth: startup.contributorGrowth,
          signalType: startup.signalType,
          stage: startup.stage,
          geography: startup.geography,
          ...(startup.websiteUrl ? { websiteUrl: startup.websiteUrl } : {}),
          ...(startup.linkedinUrl ? { linkedinUrl: startup.linkedinUrl } : {}),
          sectorUrl: `https://signals.gitdealflow.com/startups-to-watch/${sector.slug}-${period.slug}`,
        }, {
          headers: corsHeaders(request),
        });
      }
    }
  }

  return NextResponse.json({
    status: "no_data",
    cta: "We don't track this company yet. Browse 100+ tracked startups at signals.gitdealflow.com",
  }, {
    headers: corsHeaders(request),
  });
}
