/**
 * /favicon.svg — vector favicon.
 *
 * Yandex Webmaster (recheck 2026-05-02) flagged the missing SVG favicon as a
 * recommendation. Modern browsers (Chrome, Edge, Firefox, Safari Tech Preview)
 * prefer SVG over .ico for crisper display on high-DPI screens; AI engines
 * scrape /favicon.svg as the canonical brand mark.
 *
 * Geometry: a stylized "signal" — three vertical bars of increasing height,
 * representing engineering acceleration. Brand sky-500 on slate-950 ground.
 */

const SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="VC Deal Flow Signal">
  <title>VC Deal Flow Signal</title>
  <rect width="64" height="64" rx="12" fill="#0f172a"/>
  <rect x="12" y="38" width="8" height="14" rx="2" fill="#0ea5e9"/>
  <rect x="28" y="26" width="8" height="26" rx="2" fill="#38bdf8"/>
  <rect x="44" y="14" width="8" height="38" rx="2" fill="#7dd3fc"/>
</svg>`;

export const dynamic = "force-static";

export async function GET() {
  return new Response(SVG, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, immutable, s-maxage=604800",
      "X-Robots-Tag": "index, follow",
    },
  });
}
