/**
 * Root-level alias for /.well-known/model.json.
 *
 * AI procurement scanners probe both /.well-known/model.json and the apex
 * /model.json. We serve content directly (200, not 308) because some bots
 * don't follow redirects. Canonical URL is the well-known one, advertised
 * via the `Link: rel=canonical` header.
 */

import { GET as WellKnownModel } from "@/app/.well-known/model.json/route";

export const dynamic = "force-static";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await WellKnownModel();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/.well-known/model.json>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
