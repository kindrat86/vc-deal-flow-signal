/**
 * /.well-known/agents.json — agent toolkit discovery.
 *
 * Aliases the canonical /agents.json body so agent runtimes hitting either
 * location resolve to the same content.
 */

export const runtime = "nodejs";

export async function GET() {
  return new Response(null, {
    status: 308,
    headers: {
      Location: "https://signals.gitdealflow.com/agents.json",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800",
      "X-Robots-Tag": "index, follow",
    },
  });
}
