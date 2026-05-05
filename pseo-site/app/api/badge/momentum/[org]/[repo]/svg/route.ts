import { getAllSectors, getCurrentPeriod, type Startup } from "@/lib/data";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  renderMomentumBadge,
  renderPendingBadge,
  tierFromVelocityChange,
} from "@/lib/badge-svg";

export const runtime = "nodejs";

const SVG_HEADERS_OK: Record<string, string> = {
  "Content-Type": "image/svg+xml; charset=utf-8",
  "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
};

const SVG_HEADERS_PENDING: Record<string, string> = {
  "Content-Type": "image/svg+xml; charset=utf-8",
  "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
};

function svg200(body: string, headers: Record<string, string>, etag?: string): Response {
  return new Response(body, {
    status: 200,
    headers: etag ? { ...headers, ETag: etag } : headers,
  });
}

const ALLOWED_SEG = /^[A-Za-z0-9._-]{1,100}$/;

function findStartupByGithubPath(orgSlash: string): Startup | null {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const target = `github.com/${orgSlash.toLowerCase()}`;
  for (const sector of sectors) {
    const snap = sector.periods[period.slug];
    if (!snap) continue;
    for (const startup of snap.startups) {
      const url = (startup.githubUrl || "").toLowerCase();
      if (!url) continue;
      // githubUrl can be "https://github.com/org" or "https://github.com/org/repo"
      const stripped = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
      if (stripped === target) return startup;
      // Also match if user passed only org and we track org (not specific repo).
      if (stripped === `github.com/${orgSlash.split("/")[0].toLowerCase()}`) return startup;
    }
  }
  return null;
}

export async function GET(
  request: Request,
  ctx: { params: Promise<{ org: string; repo: string }> },
) {
  const { org: rawOrg, repo: rawRepo } = await ctx.params;
  const org = String(rawOrg || "").trim();
  const repo = String(rawRepo || "").trim();

  if (!ALLOWED_SEG.test(org) || !ALLOWED_SEG.test(repo)) {
    return svg200(renderPendingBadge("momentum", "invalid"), SVG_HEADERS_PENDING);
  }

  const ip = getClientIp(request);
  const rl = checkRateLimit(`badge-momentum:${ip}`, 30, 60_000);
  if (!rl.allowed) {
    return svg200(renderPendingBadge("momentum", "rate limit"), SVG_HEADERS_PENDING);
  }

  try {
    const startup = findStartupByGithubPath(`${org}/${repo}`);
    if (!startup) {
      return svg200(
        renderPendingBadge("momentum", "untracked"),
        SVG_HEADERS_PENDING,
      );
    }

    const tier = tierFromVelocityChange(startup.commitVelocityChange);
    const etag = `"${org}/${repo}:${tier}:${startup.commitVelocityChange}"`;

    if (request.headers.get("if-none-match") === etag) {
      return new Response(null, {
        status: 304,
        headers: { ...SVG_HEADERS_OK, ETag: etag },
      });
    }

    return svg200(
      renderMomentumBadge({
        org,
        repo,
        tier,
        velocityChange: startup.commitVelocityChange,
      }),
      SVG_HEADERS_OK,
      etag,
    );
  } catch (err) {
    console.error("[badge/momentum] error:", err);
    return svg200(renderPendingBadge("momentum", "pending"), SVG_HEADERS_PENDING);
  }
}
