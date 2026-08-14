/**
 * /api/v1/openapi.json, versioned alias for /api/openapi.json.
 *
 * Pass VII (2026-05-05). Companion to /api/v1/{signals,agents,answers,
 * changelog,dataset,pricing}.json. OpenAPI consumers that pin to v1 paths
 * (procurement automations, AI Action builders) need the spec at the same
 * version path as the endpoints it documents.
 */

import { GET as ApiOpenapiJson } from "@/app/api/openapi.json/route";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await ApiOpenapiJson();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/api/openapi.json>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
