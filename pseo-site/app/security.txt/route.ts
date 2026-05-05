/**
 * Root-level alias for /.well-known/security.txt (RFC 9116).
 *
 * RFC 9116 §3 makes /.well-known/security.txt the canonical location, but
 * legacy crawlers and many vulnerability scanners still probe the apex
 * /security.txt first. We serve identical content here (not a redirect) so
 * either probe succeeds. Canonical URL is advertised via the `Canonical:`
 * field within the file body and a `Link: rel=canonical` header.
 */

import { GET as WellKnownSecurity } from "@/app/.well-known/security.txt/route";

export const dynamic = "force-static";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await WellKnownSecurity();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/.well-known/security.txt>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
