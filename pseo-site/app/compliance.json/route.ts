/**
 * Root-level alias for /.well-known/compliance.json.
 *
 * Many enterprise-procurement scanners probe both /.well-known/compliance.json
 * and the apex /compliance.json before approving an external data source. We
 * serve content directly (200, not 308) because some scanners don't follow
 * redirects. The canonical URL — declared via the `Link: rel=canonical` header
 * — remains under /.well-known.
 */

import { GET as WellKnownCompliance } from "@/app/.well-known/compliance.json/route";

export const dynamic = "force-static";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await WellKnownCompliance();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/.well-known/compliance.json>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
