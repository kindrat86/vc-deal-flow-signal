"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Renders its children only when the current path is NOT an iframe-embed
 * surface. Used in the root layout to gate the site chrome (Header, Footer,
 * LaunchBanner, GuidedConcierge, PixelManager, PostHog/RefGrow scripts,
 * WebVitalsReporter, CookieNotice) off for `/embed/<widget>/...` paths so
 * the calculator widgets fit inside a Substack / Ghost / WordPress column
 * without bleeding the host-site chrome into the embedder.
 *
 * Why a client gate (and not a server-side `headers()` read in the layout):
 * reading `headers()` in the root layout would make every page in the site
 * fully dynamic, killing the static-prerender wins on the pSEO surfaces.
 * `usePathname()` is read at hydration time; the chrome is rendered server-
 * side (so static prerender is preserved) and then unmounted in embed
 * contexts on hydration. The page itself also injects a no-FOUC CSS
 * backstop that hides the chrome before hydration.
 *
 * `/embed` (the docs index) keeps the chrome — the regex matches only
 * nested `/embed/<segment>/...` paths.
 */
export function NotInEmbed({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname && /^\/embed\/[^/]/.test(pathname)) {
    return null;
  }
  return <>{children}</>;
}
