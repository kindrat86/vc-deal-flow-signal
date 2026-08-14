/**
 * Root-level alias for /feed.xml.
 *
 * Many feed readers and AI bots probe `/rss.xml` by convention before
 * checking /feed.xml. We serve the same RSS 2.0 body directly (200, not
 * 308) because some readers don't follow redirects on feed URLs. The
 * canonical URL is /feed.xml, advertised via the `Link: rel=canonical`
 * header.
 */

import { GET as FeedXml } from "@/app/feed.xml/route";

export const dynamic = "force-static";
export const revalidate = 3600;
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await FeedXml();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/feed.xml>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
