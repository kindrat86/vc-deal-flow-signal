/**
 * Root-level alias for /api/agents.json.
 *
 * Some discovery agents expect a top-level descriptor rather than an /api/
 * path. We serve content directly (200, not 308) because some AI bots
 * don't follow redirects on JSON descriptor probes. The canonical URL -
 * declared via the `Link: rel=canonical` header, remains under /api/.
 */

import { GET as ApiAgentsJson } from "@/app/api/agents.json/route";

export const dynamic = "force-static";
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
