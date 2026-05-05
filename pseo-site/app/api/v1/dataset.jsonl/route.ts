/**
 * /api/v1/dataset.jsonl — versioned alias for /api/dataset.jsonl.
 *
 * Stable v1 path for the full NDJSON signal panel referenced by
 * /.well-known/dataset.json (DCAT 3) and the SSRN paper. Body and headers
 * mirror the upstream; canonical URL — declared via `Link: rel=canonical`
 * — remains at /api/dataset.jsonl.
 */

import { GET as ApiDatasetJsonl } from "@/app/api/dataset.jsonl/route";

export const dynamic = "force-static";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET(request: Request) {
  const upstream = await ApiDatasetJsonl(request);
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/api/dataset.jsonl>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
