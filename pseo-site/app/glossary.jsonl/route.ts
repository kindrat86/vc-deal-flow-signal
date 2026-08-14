/**
 * Apex alias for /api/v1/glossary.jsonl.
 *
 * Background: HuggingFace dataset auto-loaders, retrieval pipelines, and
 * AI crawlers often probe the bare /glossary.jsonl path, the natural
 * sibling of /qa.jsonl and /dataset.jsonl which are themselves apex
 * routes. Without this alias the request fell through to Next 16's
 * [topic] catch-all and was served as text/html, breaking NDJSON
 * consumers (same root cause as Pass X audit gap #1 for /dataset.jsonl).
 *
 * Mirrors the established wrapper pattern: content served directly (200,
 * not 308) because some AI bots don't follow redirects on dataset
 * probes, with `Link: rel=canonical` pointing at /api/v1/glossary.jsonl.
 */

import { GET as ApiGlossaryJsonl } from "@/app/api/v1/glossary.jsonl/route";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await ApiGlossaryJsonl();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/api/v1/glossary.jsonl>; rel="canonical"`);
  headers.set("Content-Type", "application/x-ndjson; charset=utf-8");
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
