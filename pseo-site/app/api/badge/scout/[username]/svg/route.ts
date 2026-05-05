import { fetchUserStars, isValidGithubUsername } from "@/lib/github-stars";
import { computeScoutScore } from "@/lib/scout-score";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  renderScoutBadge,
  renderPendingBadge,
  type ScoutRank,
} from "@/lib/badge-svg";

export const runtime = "nodejs";

const SVG_HEADERS_OK: Record<string, string> = {
  "Content-Type": "image/svg+xml; charset=utf-8",
  "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
};

const SVG_HEADERS_PENDING: Record<string, string> = {
  "Content-Type": "image/svg+xml; charset=utf-8",
  // Shorter cache on transient/pending states so a real score replaces it within the hour.
  "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
};

function svg200(body: string, headers: Record<string, string>, etag?: string): Response {
  return new Response(body, {
    status: 200,
    headers: etag ? { ...headers, ETag: etag } : headers,
  });
}

export async function GET(
  request: Request,
  ctx: { params: Promise<{ username: string }> },
) {
  const { username: rawUsername } = await ctx.params;
  const username = String(rawUsername || "").trim();

  if (!isValidGithubUsername(username)) {
    return svg200(renderPendingBadge("scout score", "invalid"), SVG_HEADERS_PENDING);
  }

  // Per-IP origin protection. CDN absorbs most repeats; this guards cache-miss spikes.
  const ip = getClientIp(request);
  const rl = checkRateLimit(`badge-scout:${ip}`, 30, 60_000);
  if (!rl.allowed) {
    return svg200(renderPendingBadge("scout score", "rate limit"), SVG_HEADERS_PENDING);
  }

  try {
    const fetched = await fetchUserStars(username);
    const result = computeScoutScore(fetched.stars);
    const etag = `"${username}:${result.score}:${result.rank}"`;

    if (request.headers.get("if-none-match") === etag) {
      return new Response(null, {
        status: 304,
        headers: { ...SVG_HEADERS_OK, ETag: etag },
      });
    }

    return svg200(
      renderScoutBadge({
        username,
        score: result.score,
        rank: result.rank as ScoutRank,
      }),
      SVG_HEADERS_OK,
      etag,
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("not found")) {
      return svg200(renderPendingBadge("scout score", "no data"), SVG_HEADERS_PENDING);
    }
    if (msg.includes("rate limit")) {
      return svg200(renderPendingBadge("scout score", "retry"), SVG_HEADERS_PENDING);
    }
    console.error("[badge/scout] error:", err);
    return svg200(renderPendingBadge("scout score", "pending"), SVG_HEADERS_PENDING);
  }
}
