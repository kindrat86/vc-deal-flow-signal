/**
 * /.well-known/agent.json, singular alias for agent-card discovery.
 *
 * The A2A spec settled on `agent-card.json` but a number of early adopters
 * probe `agent.json`. Serves content directly (200, not 308) because some
 * agent runtimes don't follow redirects on JSON descriptor probes. The
 * canonical URL, declared via the `Link: rel=canonical` header, remains
 * at /.well-known/agent-card.json.
 */

import { GET as AgentCardJson } from "@/app/.well-known/agent-card.json/route";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await AgentCardJson();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/.well-known/agent-card.json>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
