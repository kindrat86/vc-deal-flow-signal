/**
 * Root-level alias for /.well-known/agent-card.json.
 *
 * Some discovery agents probe `/agent-card.json` at the apex before checking
 * the well-known prefix. We serve the same body here directly (200, not 308)
 * because some AI bots don't follow redirects. The canonical URL, declared
 * via the `Link: rel=canonical` header, remains under /.well-known so
 * dedupers see the two surfaces as one resource.
 */

import { GET as WellKnownAgentCard } from "@/app/.well-known/agent-card.json/route";

export const dynamic = "force-static";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET(request: Request) {
  const upstream = await WellKnownAgentCard();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/.well-known/agent-card.json>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
