/**
 * /api/agent-card, REST-style alias for /.well-known/agent-card.json.
 *
 * Some agent runtimes resolve discovery endpoints under /api/* rather
 * than /.well-known/*. Body and headers mirror the upstream; canonical
 * URL, declared via `Link: rel=canonical`, remains at
 * /.well-known/agent-card.json.
 */

import { GET as AgentCardJson } from "@/app/.well-known/agent-card.json/route";

export const dynamic = "force-static";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await AgentCardJson();
  const headers = new Headers(upstream.headers);
  headers.set(
    "Link",
    `<${SITE}/.well-known/agent-card.json>; rel="canonical"`,
  );
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
