/**
 * /api/v1/dataset — extension-stripped alias for /api/v1/dataset.jsonl.
 *
 * Note: the canonical surface is NDJSON (.jsonl). The stripped alias serves
 * the same NDJSON payload and content-type so dataset consumers (HF Datasets,
 * Kaggle pipelines) that pin to /api/v1/<resource> can still parse it.
 *
 * See /api/v1/signals/route.ts for the broader alias rationale.
 */

import { GET as Upstream } from "@/app/api/v1/dataset.jsonl/route";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET(request: Request) {
  const upstream = await Upstream(request);
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/api/v1/dataset.jsonl>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
