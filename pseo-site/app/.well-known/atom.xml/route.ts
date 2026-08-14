/**
 * /.well-known/atom.xml, alias for /atom.xml.
 *
 * Some discovery agents and feed-aware bots probe `/.well-known/atom.xml`
 * (mirrored alongside the other /.well-known surfaces) before falling back
 * to /atom.xml. We re-export the upstream GET so both paths return identical
 * RFC 4287 bodies with `application/atom+xml`.
 *
 * Per feedback_no_force_static_on_alias_via_import.md (Pass VIII): do NOT set
 * dynamic="force-static" on alias-via-import routes. The upstream /atom.xml
 * declares its own static config; force-static here breaks the build.
 */

import { GET as AtomXml } from "@/app/atom.xml/route";

export const runtime = "nodejs";
export const revalidate = 3600;

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await AtomXml();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/atom.xml>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
