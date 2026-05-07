/**
 * Root-level alias for /feed.xml.
 *
 * Many feed readers and AI bots probe `/rss.xml` by convention before
 * checking /feed.xml. We serve the same RSS 2.0 body directly (200, not
 * 308) because some readers don't follow redirects on feed URLs. The
 * canonical URL is /feed.xml — advertised via the Link: rel=canonical
 * header.
 *
 * NOTE: must NOT use dynamic = "force-static" here — alias-via-import
 * silently breaks under force-static if the upstream is dynamic
 * (durable memory: feedback_no_force_static_on_alias_via_import).
 * Upstream /feed.xml does its own conditional negotiation; we forward
 * the status (including 304 Not Modified) and validators verbatim.
 */

import { GET as FeedXml } from "@/app/feed.xml/route";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET(request: Request) {
  const upstream = await FeedXml(request);
  const headers = new Headers(upstream.headers);
  headers.set("Link", "<" + SITE + "/feed.xml>; rel=\"canonical\"");
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
