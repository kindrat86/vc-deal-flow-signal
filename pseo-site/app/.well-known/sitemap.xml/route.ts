/**
 * /.well-known/sitemap.xml — sitemap-discovery alias.
 *
 * Some crawlers and AEO probes look for `.well-known/sitemap.xml` as a
 * quick sitemap-index handle without inspecting robots.txt or host-meta
 * first. We serve the sitemap-index body directly (200, not 308) because
 * some bots skip the redirect hop on .well-known probes.
 *
 * NOTE: must NOT use dynamic = "force-static" — alias-via-import silently
 * breaks under force-static when the upstream is dynamic
 * (durable memory: feedback_no_force_static_on_alias_via_import).
 * Upstream /sitemap.xml does conditional 304 negotiation; we forward
 * the status (including 304) and validators verbatim, then add the
 * canonical Link header.
 */

import { GET as RootSitemap } from "@/app/sitemap.xml/route";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET(request: Request) {
  const upstream = await RootSitemap(request);
  const headers = new Headers(upstream.headers);
  headers.set("Link", "<" + SITE + "/sitemap.xml>; rel=\"canonical\"");
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
