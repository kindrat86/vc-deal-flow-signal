/**
 * Root-level alias for /api/openapi.json.
 *
 * Some discovery agents and OpenAPI tools default to a root-level
 * `/openapi.json` rather than the /api/ path. We serve content directly
 * (200, not 308) because some AI bots don't follow redirects on OpenAPI
 * descriptor probes. The canonical URL — declared via the `Link:
 * rel=canonical` header — remains under /api/.
 */

import { GET as ApiOpenApiJson } from "@/app/api/openapi.json/route";

export const dynamic = "force-static";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await ApiOpenApiJson();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/api/openapi.json>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
