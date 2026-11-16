/**
 * Sitemap hygiene for the signals-merge redirects (2026-11-12).
 *
 * The 55 signals-merge paths in data/signals-merge-redirects.json 308 to
 * gitdealflow.com (next.config.ts redirects()). A sitemap must not advertise
 * URLs that redirect, so GSC flagged them as "Page with redirect". Every
 * sitemap generator drops a URL whose path is a merge-redirect source. The
 * redirects themselves are unchanged; this only affects what sitemaps list.
 */
import signalsMergeRedirects from "@/data/signals-merge-redirects.json";

const SIGNALS_HOST = "signals.gitdealflow.com";

const REDIRECTED_PATHS: ReadonlySet<string> = new Set(
  (signalsMergeRedirects as { redirects: { source: string }[] }).redirects.map(
    (r) => normalizePath(r.source),
  ),
);

function normalizePath(p: string): string {
  const clean = p.split("#")[0].split("?")[0] || "/";
  return clean.length > 1 && clean.endsWith("/") ? clean.slice(0, -1) : clean;
}

/** True when `url` (absolute signals URL or a path) 308s off-host via the merge map. */
export function isMergeRedirectedUrl(url: string): boolean {
  let pathname: string;
  try {
    const u = new URL(url, `https://${SIGNALS_HOST}`);
    if (u.hostname !== SIGNALS_HOST) return false;
    pathname = u.pathname;
  } catch {
    return false;
  }
  return REDIRECTED_PATHS.has(normalizePath(pathname));
}

/**
 * Off-host destination for a merge-redirected signals URL, or null when the
 * URL does not redirect. Used where a feed must keep one required link (RSS
 * <channel><link>) but should point at the final 200 URL, not a 308 hop.
 */
export function mergeRedirectDestination(url: string): string | null {
  if (!isMergeRedirectedUrl(url)) return null;
  const pathname = normalizePath(new URL(url, `https://${SIGNALS_HOST}`).pathname);
  const hit = (signalsMergeRedirects as { redirects: { source: string; destination: string }[] }).redirects.find(
    (r) => normalizePath(r.source) === pathname,
  );
  return hit ? hit.destination : null;
}
