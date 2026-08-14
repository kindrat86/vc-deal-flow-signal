/**
 * /.well-known/sitemap.xml, sitemap-discovery alias.
 *
 * RFC 9079 lays out a `.well-known/host-meta` discovery pattern; some
 * crawlers and AEO probes look for `.well-known/sitemap.xml` as a quick
 * sitemap-index handle without inspecting robots.txt or host-meta first.
 *
 * Serves the sitemap-index body directly (200, not 308) because some bots
 * skip the redirect hop on .well-known probes. Canonical URL remains at
 * /sitemap.xml, declared via the `Link: rel=canonical` header.
 */

import { GET as RootSitemap } from "@/app/sitemap.xml/route";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await RootSitemap();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/sitemap.xml>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
