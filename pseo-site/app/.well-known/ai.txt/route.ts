/**
 * /.well-known/ai.txt — discovery alias.
 *
 * Some AI-policy crawlers probe `.well-known/ai.txt` before the root variant.
 * Redirect to the canonical body so per-agent permissions stay in one place.
 */

export const runtime = "nodejs";

export async function GET() {
  return new Response(null, {
    status: 308,
    headers: {
      Location: "https://signals.gitdealflow.com/ai.txt",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800",
      "X-Robots-Tag": "index, follow",
    },
  });
}
