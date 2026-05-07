import { getDataLastModified } from "@/lib/data";
import {
  isNotModified,
  makeETag,
  notModifiedResponse,
  withConditionalHeaders,
} from "@/lib/http-conditional";

export const runtime = "nodejs";

const BASE_URL = "https://signals.gitdealflow.com";
const CACHE_CONTROL =
  "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400";
const SITEMAPS = ["core", "sectors", "crossings", "startups", "content"];

export async function GET(request: Request) {
  const lastModified = getDataLastModified();
  const etag = makeETag("sitemap-index", lastModified.getTime());

  if (isNotModified(request, lastModified, etag)) {
    return notModifiedResponse(lastModified, etag, CACHE_CONTROL);
  }

  const lastModIso = lastModified.toISOString();
  const entries = [
    ...SITEMAPS.map(
      (id) =>
        "  <sitemap>\n    <loc>" + BASE_URL + "/sitemap/" + id + ".xml</loc>\n    <lastmod>" + lastModIso + "</lastmod>\n  </sitemap>",
    ),
    "  <sitemap>\n    <loc>" + BASE_URL + "/news-sitemap.xml</loc>\n    <lastmod>" + lastModIso + "</lastmod>\n  </sitemap>",
    "  <sitemap>\n    <loc>" + BASE_URL + "/sitemap-images.xml</loc>\n    <lastmod>" + lastModIso + "</lastmod>\n  </sitemap>",
    "  <sitemap>\n    <loc>" + BASE_URL + "/sitemap-i18n.xml</loc>\n    <lastmod>" + lastModIso + "</lastmod>\n  </sitemap>",
  ].join("\n");

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries +
    "\n</sitemapindex>\n";

  return withConditionalHeaders(body, {
    contentType: "application/xml; charset=utf-8",
    lastModified,
    etag,
    cacheControl: CACHE_CONTROL,
    extraHeaders: { "X-Robots-Tag": "index, follow" },
  });
}
