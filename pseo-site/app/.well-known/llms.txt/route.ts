/**
 * /.well-known/llms.txt, direct content, not a redirect.
 *
 * Per the proposed convention, agents may probe `/.well-known/llms.txt`
 * before falling back to root `/llms.txt`. We previously 308-redirected to
 * keep one source of truth, but some AI crawlers don't reliably follow
 * 308s on text/plain, and any redirect is one extra hop. We now re-export
 * the same GET handler used by `/llms.txt`, so both routes serve the same
 * dynamically-built body with the same ETag/Last-Modified semantics, no
 * forwarding tax. A `Link: rel=canonical` header points back to the root
 * variant so retrieval pipelines that dedupe on canonical see them as one
 * resource.
 */

import { GET as LlmsTxtGET } from "@/app/llms.txt/route";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET(request: Request) {
  const upstream = await LlmsTxtGET(request);
  // Pass through the upstream response, augmenting headers with a canonical
  // Link so dedupers know /llms.txt is the authoritative URL.
  const headers = new Headers(upstream.headers);
  headers.set(
    "Link",
    '<https://signals.gitdealflow.com/llms.txt>; rel="canonical"',
  );
  headers.set("X-Robots-Tag", "index, follow");
  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
