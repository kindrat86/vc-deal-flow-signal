/**
 * Root-level alias for /.well-known/ai-policy.json.
 *
 * Several /head/ rel=alternate links and crawler conventions probe the apex
 * /ai-policy.json before /.well-known/. We serve content directly (200, not
 * 308) because some AI bots don't follow redirects. Canonical URL is
 * advertised via the `Link: rel=canonical` header.
 */

import { GET as WellKnownAiPolicy } from "@/app/.well-known/ai-policy.json/route";

export const dynamic = "force-static";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await WellKnownAiPolicy();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/.well-known/ai-policy.json>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
