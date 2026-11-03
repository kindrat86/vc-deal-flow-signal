import { isDigestDataFresh } from "./digest-builder";

/**
 * Welcome email 1 links to the live signals page and says "this week's five".
 * When the signal data is older than the digest freshness window, that claim
 * is false, so swap the two phrases for neutral wording (no new claims).
 * Fresh data: html is returned unchanged.
 */
export function honestSignalsCopy(html: string, fresh: boolean = isDigestDataFresh()): string {
  if (fresh) return html;
  return html
    .replace(/pick one name from this week(?:'|&#39;|&rsquo;|\u2019)s five/g, "pick one name from the latest five")
    .replace(/Open this week(?:'|&#39;|&rsquo;|\u2019)s signals/g, "Open the latest signals");
}
