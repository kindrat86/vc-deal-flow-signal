/**
 * /.well-known/ai.txt, AI access policy direct alias.
 *
 * Some AI-policy crawlers probe `.well-known/ai.txt` before the root variant.
 * Serves the body directly (200, not 308) because several AI bots don't
 * follow redirects on AI-policy probes. The canonical URL, declared via
 * the `Link: rel=canonical` header, remains at /ai.txt.
 */

import { GET as RootAiTxt } from "@/app/ai.txt/route";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await RootAiTxt();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/ai.txt>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
