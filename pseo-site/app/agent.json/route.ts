/**
 * Root-level alias for /.well-known/agent-card.json (singular agent.json name).
 *
 * F6 audit fix: some A2A clients probe /agent.json (singular, no "-card"
 * suffix) before checking /agent-card.json or the well-known prefix. Existing
 * surfaces:
 *   - /.well-known/agent-card.json (canonical)
 *   - /.well-known/agent.json     (308 redirect)
 *   - /agent-card.json            (root alias, 200 direct body)
 *   - /agent.json                 (this file, 200 direct body)
 *   - /agents.json                (plural — different shape, skill catalog)
 *
 * We serve the agent-card body directly (200, not 308) for parity with
 * /agent-card.json — some AI bots don't follow redirects. The canonical URL
 * is declared via `Link: rel=canonical` so dedupers see all aliases as one
 * resource.
 *
 * Pattern note: `force-static` is safe here because the upstream
 * /.well-known/agent-card.json/route.ts is also `force-static` (static-on-
 * static alias). Per the durable rule, this only breaks when the upstream
 * is dynamic.
 */

import { GET as WellKnownAgentCard } from "@/app/.well-known/agent-card.json/route";

export const dynamic = "force-static";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await WellKnownAgentCard();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/.well-known/agent-card.json>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
