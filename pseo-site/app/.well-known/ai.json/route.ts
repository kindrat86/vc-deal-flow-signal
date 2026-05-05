/**
 * /.well-known/ai.json — short-name alias for ai-policy.json.
 *
 * Some discovery agents probe `.well-known/ai.json` (parallel to
 * `.well-known/ai.txt`) before checking the canonical `ai-policy.json`.
 * Serves the body directly (200, not 308) because several AI bots don't
 * follow redirects on AI-policy probes. The canonical URL — declared via
 * the `Link: rel=canonical` header — remains at /.well-known/ai-policy.json.
 */

import { GET as AiPolicyJson } from "@/app/.well-known/ai-policy.json/route";

export const dynamic = "force-static";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await AiPolicyJson();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/.well-known/ai-policy.json>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
