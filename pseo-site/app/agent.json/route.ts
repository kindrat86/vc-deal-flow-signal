/**
 * Root-level alias for /.well-known/agent-card.json (legacy filename).
 *
 * Some A2A discovery clients probe `/agent.json` (the older convention) before
 * checking `/agent-card.json` or the well-known prefix. We serve the same body
 * here directly (200, not 308) because some agent runtimes don't follow
 * redirects. The canonical URL — declared via the `Link: rel=canonical`
 * header — remains under /.well-known so dedupers see the surfaces as one.
 *
 * Mirrors /agent-card.json's pattern. Both upstream and this alias are
 * force-static; this matches the existing working alias and avoids the
 * dynamic-upstream + static-alias regression class.
 */

import { GET as WellKnownAgentCard } from "@/app/.well-known/agent-card.json/route";

export const dynamic = "force-static";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET(_request: Request) {
  const upstream = await WellKnownAgentCard();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/.well-known/agent-card.json>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
