import { renderBuiltWithBadge } from "@/lib/badge-svg";

export const runtime = "nodejs";

const SVG_HEADERS: Record<string, string> = {
  "Content-Type": "image/svg+xml; charset=utf-8",
  // Static SVG. CDN-cache for a day, SWR for a week. ETag absorbs the rest.
  "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
};

const ETAG = '"built-with-v1"';

function pickVariant(value: string | null): "default" | "compact" | "long" {
  if (value === "compact" || value === "long") return value;
  return "default";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const variant = pickVariant(url.searchParams.get("variant"));
  const label = url.searchParams.get("label")?.slice(0, 40) || undefined;
  const etag = label || variant !== "default" ? `"built-with-v1:${variant}:${label ?? ""}"` : ETAG;

  if (request.headers.get("if-none-match") === etag) {
    return new Response(null, {
      status: 304,
      headers: { ...SVG_HEADERS, ETag: etag },
    });
  }

  const svg = renderBuiltWithBadge({ variant, label });
  return new Response(svg, {
    status: 200,
    headers: { ...SVG_HEADERS, ETag: etag },
  });
}
