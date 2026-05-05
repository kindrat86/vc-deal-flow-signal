/**
 * /api/v1/agents.json — versioned alias for /api/agents.json.
 *
 * Stable v1 path for the agent-tool catalog so agent runtimes that pin
 * to v1 don't 404. Body and headers mirror the upstream; canonical URL —
 * declared via `Link: rel=canonical` — remains at /api/agents.json.
 */

import { GET as ApiAgentsJson } from "@/app/api/agents.json/route";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await ApiAgentsJson();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/api/agents.json>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
