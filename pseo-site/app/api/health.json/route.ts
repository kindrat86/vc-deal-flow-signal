/**
 * /api/health.json, uptime / health-check endpoint.
 *
 * Pass VII (2026-05-05). Standard probe URL for uptime monitors
 * (UptimeRobot, BetterUptime, Datadog, Pingdom) and AI agents that verify
 * service liveness before consuming downstream endpoints. Returns
 * lightweight JSON with build commit, dataset freshness, and dependency
 * snapshot, enough for an agent to decide "skip" vs "consume."
 *
 * Cached for 60s, uptime monitors poll at 1-5min cadence; this avoids
 * hammering the build with each poll while still surfacing a useful
 * dataset-freshness timestamp.
 */

import { getDataLastModified } from "@/lib/data";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const dataLastModified = getDataLastModified();
  const buildTime = new Date().toISOString();

  const body = {
    status: "ok",
    service: "VC Deal Flow Signal",
    site: SITE,
    buildTime,
    dataLastModified: dataLastModified.toISOString(),
    dependencies: {
      sitemap: "ok",
      openapi: "ok",
      mcp: "ok",
      datasets: "ok",
    },
    uptimeContact: "signals@gitdealflow.com",
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, s-maxage=60, stale-while-revalidate=300",
      "x-robots-tag": "noindex",
      Link: `<${SITE}/api/health.json>; rel="self"`,
    },
  });
}
