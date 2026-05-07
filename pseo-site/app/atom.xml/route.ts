/**
 * /atom.xml — Atom 1.0 feed (companion to /rss.xml + /feed.xml + /feed.json).
 *
 * Some feed readers (Feedly, Reeder, NetNewsWire) resolve /atom.xml before
 * /rss.xml when both are advertised, and many AI agents probing for newsroom
 * freshness default to the Atom path. Format follows RFC 4287.
 *
 * Conditional negotiation (RFC 9110 §13): honors If-Modified-Since and
 * If-None-Match for crawl-budget efficiency.
 */

import { posts } from "@/content/posts";
import { getDataLastModified } from "@/lib/data";
import {
  isNotModified,
  makeETag,
  notModifiedResponse,
  withConditionalHeaders,
} from "@/lib/http-conditional";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";
const CACHE_CONTROL =
  "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400";
const LINK_HEADER = "<" + SITE + "/atom.xml>; rel=\"self\", <" + SITE + "/feed.xml>; rel=\"alternate\"";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(request: Request) {
  const lastModified = getDataLastModified();
  const etag = makeETag("feed-atom", posts.length, lastModified.getTime());

  if (isNotModified(request, lastModified, etag)) {
    return notModifiedResponse(lastModified, etag, CACHE_CONTROL, {
      Link: LINK_HEADER,
    });
  }

  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const updated = lastModified.toISOString();

  const entries = sorted
    .map((p) => {
      const url = SITE + "/blog/" + p.slug;
      const isoDate = new Date(p.date).toISOString();
      return (
        "  <entry>\n" +
        "    <title>" + escapeXml(p.title) + "</title>\n" +
        "    <link href=\"" + url + "\" rel=\"alternate\" type=\"text/html\"/>\n" +
        "    <id>" + url + "</id>\n" +
        "    <updated>" + isoDate + "</updated>\n" +
        "    <published>" + isoDate + "</published>\n" +
        "    <summary>" + escapeXml(p.description) + "</summary>\n" +
        "    <author><name>VC Deal Flow Signal</name></author>\n" +
        "  </entry>"
      );
    })
    .join("\n");

  const feed =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<feed xmlns="http://www.w3.org/2005/Atom">\n' +
    "  <title>VC Deal Flow Signal — Blog</title>\n" +
    "  <subtitle>Engineering acceleration signals for startup investors.</subtitle>\n" +
    "  <link href=\"" + SITE + "/atom.xml\" rel=\"self\" type=\"application/atom+xml\"/>\n" +
    "  <link href=\"" + SITE + "/blog\" rel=\"alternate\" type=\"text/html\"/>\n" +
    "  <id>" + SITE + "/atom.xml</id>\n" +
    "  <updated>" + updated + "</updated>\n" +
    "  <rights>CC BY 4.0 — VC Deal Flow Signal</rights>\n" +
    "  <generator uri=\"" + SITE + "\">VC Deal Flow Signal</generator>\n" +
    entries +
    "\n</feed>";

  return withConditionalHeaders(feed, {
    contentType: "application/atom+xml; charset=utf-8",
    lastModified,
    etag,
    cacheControl: CACHE_CONTROL,
    extraHeaders: { Link: LINK_HEADER },
  });
}
