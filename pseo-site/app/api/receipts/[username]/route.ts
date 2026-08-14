import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { fetchUserStars, isValidGithubUsername } from "@/lib/github-stars";
import { computeScoutScore, generateTastePersonality } from "@/lib/scout-score";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ username: string }>;
}

export async function GET(request: Request, ctx: RouteContext) {
  const { username: rawUsername } = await ctx.params;
  const username = String(rawUsername || "").trim();

  if (!isValidGithubUsername(username)) {
    return NextResponse.json(
      { error: "Invalid GitHub username format" },
      { status: 400 },
    );
  }

  // Per-IP rate limit: 10 receipts per minute is enough for one human, blocks scrape loops.
  const ip = getClientIp(request);
  const rl = checkRateLimit(`receipts:${ip}`, 10, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many lookups in a short window. Slow down." },
      { status: 429, headers: rateLimitHeaders(rl) },
    );
  }

  try {
    const fetched = await fetchUserStars(username);
    const result = computeScoutScore(fetched.stars);
    const personality = generateTastePersonality(result);

    return NextResponse.json(
      {
        username,
        ...result,
        personality,
        truncated: fetched.truncated,
        from_cache: fetched.fromCache,
        generated_at: new Date().toISOString(),
      },
      {
        headers: {
          // Browser cache 5 min, CDN cache 24h, SWR 7d, cards stay fast even at viral spikes.
          "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
        },
      },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("not found")) {
      return NextResponse.json(
        { error: `GitHub user @${username} not found.` },
        { status: 404 },
      );
    }
    if (msg.includes("rate limit")) {
      return NextResponse.json(
        { error: "We hit GitHub's rate limit. Try again in a minute." },
        { status: 503 },
      );
    }
    console.error("[api/receipts] error:", err);
    return NextResponse.json(
      { error: "Could not generate receipts right now. Try again in a moment." },
      { status: 500 },
    );
  }
}
