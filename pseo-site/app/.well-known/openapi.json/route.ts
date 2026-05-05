/**
 * /.well-known/openapi.json — discovery alias.
 *
 * RFC-track convention some agents probe before checking /api/openapi.json.
 * Redirect keeps one canonical spec body.
 */

export const runtime = "nodejs";

export async function GET() {
  return new Response(null, {
    status: 308,
    headers: {
      Location: "https://signals.gitdealflow.com/api/openapi.json",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800",
      "X-Robots-Tag": "index, follow",
    },
  });
}
