/**
 * HTTP conditional-request helpers — Last-Modified + ETag with 304 negotiation.
 *
 * RFC 9110 §13 (Conditional Requests). Used by data + feed routes to
 * answer If-Modified-Since / If-None-Match without rebuilding the body.
 */

export function makeETag(...parts: Array<string | number | boolean | undefined>): string {
  const safe = parts.map((p) => (p === undefined ? "_" : String(p))).join(":");
  return `"${safe}"`;
}

export function parseHttpDate(header: string | null): Date | null {
  if (!header) return null;
  const t = Date.parse(header);
  return Number.isFinite(t) ? new Date(t) : null;
}

export function isNotModified(
  request: Request,
  lastModified: Date,
  etag: string,
): boolean {
  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch) {
    const tags = ifNoneMatch.split(",").map((s) => s.trim());
    if (tags.includes(etag) || tags.includes("*")) return true;
    return false;
  }
  const ims = parseHttpDate(request.headers.get("if-modified-since"));
  if (ims) {
    const lmSec = Math.floor(lastModified.getTime() / 1000);
    const imsSec = Math.floor(ims.getTime() / 1000);
    if (lmSec <= imsSec) return true;
  }
  return false;
}

export function notModifiedResponse(
  lastModified: Date,
  etag: string,
  cacheControl?: string,
  extraHeaders?: Record<string, string>,
): Response {
  return new Response(null, {
    status: 304,
    headers: {
      ETag: etag,
      "Last-Modified": lastModified.toUTCString(),
      ...(cacheControl ? { "Cache-Control": cacheControl } : {}),
      ...extraHeaders,
    },
  });
}

export function withConditionalHeaders(
  body: BodyInit | null,
  opts: {
    contentType: string;
    lastModified: Date;
    etag: string;
    cacheControl?: string;
    status?: number;
    extraHeaders?: Record<string, string>;
  },
): Response {
  const headers: Record<string, string> = {
    "Content-Type": opts.contentType,
    ETag: opts.etag,
    "Last-Modified": opts.lastModified.toUTCString(),
    ...(opts.cacheControl ? { "Cache-Control": opts.cacheControl } : {}),
    ...opts.extraHeaders,
  };
  return new Response(body, { status: opts.status ?? 200, headers });
}
