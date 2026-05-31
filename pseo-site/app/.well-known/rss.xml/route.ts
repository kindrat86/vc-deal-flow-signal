/**
 * /.well-known/rss.xml — alias for /rss.xml (which itself aliases /feed.xml).
 *
 * Mirror of the root /rss.xml so discovery agents probing under /.well-known
 * find the feed at the conventional location alongside agent-card.json,
 * llms.txt, openapi.json, etc.
 *
 * Per feedback_no_force_static_on_alias_via_import.md (Pass VIII): do NOT set
 * dynamic="force-static" on alias-via-import routes.
 */

import { GET as RssXml } from "@/app/rss.xml/route";

export const runtime = "nodejs";
export const revalidate = 3600;

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await RssXml();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/rss.xml>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
