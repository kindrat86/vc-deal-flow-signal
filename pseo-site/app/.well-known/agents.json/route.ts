/**
 * /.well-known/agents.json — agent toolkit discovery direct alias.
 *
 * Aliases the canonical /agents.json body so agent runtimes hitting either
 * location resolve to the same content. Serves directly (200, not 308)
 * because several AI bots don't follow redirects on JSON descriptor probes.
 * The canonical URL — declared via the `Link: rel=canonical` header —
 * remains at /agents.json.
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
