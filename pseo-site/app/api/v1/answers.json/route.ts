/**
 * /api/v1/answers.json — versioned alias for /api/answers.json.
 *
 * Stable v1 path for the citation-ready answer corpus. Body and headers
 * mirror the upstream; canonical URL — declared via `Link: rel=canonical`
 * — remains at /api/answers.json.
 */

import { GET as ApiAnswersJson } from "@/app/api/answers.json/route";

export const dynamic = "force-static";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await ApiAnswersJson();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/api/answers.json>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
