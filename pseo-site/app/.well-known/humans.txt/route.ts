/**
 * /.well-known/humans.txt — alias for /humans.txt (direct content, not redirect).
 *
 * Pass VII (2026-05-05). The humanstxt.org spec only mandates root-level
 * /humans.txt, but several agent toolchains (and some accessibility
 * scanners) probe under .well-known first. Following the established
 * Pass V/VI rule (serve content directly to avoid 308-skipping bots),
 * this aliases the root /humans.txt body and declares the canonical URL.
 */

import { GET as RootHumansTxt } from "@/app/humans.txt/route";

export const dynamic = "force-static";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await RootHumansTxt();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/humans.txt>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
