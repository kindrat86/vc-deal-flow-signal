/**
 * /sitemap-index.xml, alias for /sitemap.xml.
 *
 * Pass IX (2026-05-08). Some legacy crawlers and SEO probes assume the
 * sitemap-index naming convention (`sitemap-index.xml`) for the
 * top-level index file. We serve the same body as /sitemap.xml directly
 * (200, not 308) so non-redirect-following crawlers don't 404.
 *
 * Canonical URL is /sitemap.xml, declared via `Link: rel=canonical`.
 */

import { GET as Upstream } from "@/app/sitemap.xml/route";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await Upstream();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/sitemap.xml>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
