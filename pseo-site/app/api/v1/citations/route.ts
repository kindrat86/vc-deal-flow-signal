/**
 * /api/v1/citations — extension-stripped alias for /api/v1/citations.json.
 *
 * Pass IX (2026-05-08). Generic agents that infer "stripped" REST paths
 * (without the .json suffix) hit 404 — this alias serves the JSON body
 * directly. Canonical URL — declared via `Link: rel=canonical` —
 * remains at /api/v1/citations.json.
 */

import { GET as Upstream } from "@/app/api/v1/citations.json/route";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await Upstream();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/api/v1/citations.json>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
