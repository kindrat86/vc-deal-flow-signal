/**
 * /api/v1/playbooks.json, versioned alias for /api/playbooks.json.
 *
 * Stable v1 path for the operator-playbook corpus. Body and headers mirror
 * the upstream; canonical URL, declared via `Link: rel=canonical`, remains
 * at /api/playbooks.json.
 */

import { GET as ApiPlaybooksJson } from "@/app/api/playbooks.json/route";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await ApiPlaybooksJson();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/api/playbooks.json>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
