/**
 * /.well-known/openapi.json, OpenAPI 3.1 spec direct alias.
 *
 * RFC-track convention some agents probe before checking /api/openapi.json.
 * Serves the spec body directly (200, not 308) because several AI bots
 * (Perplexity, ChatGPT-with-search, Anthropic claude.ai search) don't
 * follow redirects on JSON descriptor probes. The canonical URL -
 * declared via the `Link: rel=canonical` header, remains under /api/.
 */

import { GET as ApiOpenApiJson } from "@/app/api/openapi.json/route";

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
