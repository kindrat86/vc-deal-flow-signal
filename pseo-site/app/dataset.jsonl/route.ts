/**
 * Apex alias for /api/dataset.jsonl.
 *
 * Background: agents and HF Datasets pipelines often reach for the bare
 * /dataset.jsonl path (the natural sibling of /qa.jsonl, which is itself
 * an apex route). Without this alias, the request fell through to the
 * Next 16 [topic] catch-all and was served as text/html, breaking
 * NDJSON consumers and triggering the "wrong content-type" SEO regression
 * flagged in the Pass X audit (gap #1).
 *
 * Mirrors the established wrapper pattern used by /agents.json,
 * /.well-known/openapi.json, etc. — content served directly (200, not
 * 308) because some AI bots don't follow redirects on dataset probes,
 * with a `Link: rel=canonical` header pointing at the /api/ original.
 */

import { GET as ApiDatasetJsonl } from "@/app/api/dataset.jsonl/route";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET(request: Request) {
  const upstream = await ApiDatasetJsonl(request);
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/api/dataset.jsonl>; rel="canonical"`);
  // Belt-and-braces: the canonical handler already sets the right
  // content-type, but make this explicit so future refactors of the
  // upstream don't silently regress the apex alias.
  headers.set("Content-Type", "application/x-ndjson; charset=utf-8");
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
