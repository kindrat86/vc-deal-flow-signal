"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type PostHog = {
  capture: (event: string, props?: Record<string, unknown>) => void;
  __loaded?: boolean;
};

declare global {
  interface Window {
    posthog?: PostHog;
  }
}

export default function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ph = window.posthog;
    if (!ph?.capture || !ph.__loaded) return;

    const query = searchParams?.toString();
    const url = query ? `${window.location.origin}${pathname}?${query}` : `${window.location.origin}${pathname}`;
    let referrer = document.referrer || "$direct";
    // Strip self-referrals between gitdealflow apex and signals subdomain so
    // they don't pollute traffic-source attribution as fake external sources.
    try {
      if (referrer && referrer !== "$direct") {
        const host = new URL(referrer).hostname;
        if (/(^|\.)gitdealflow\.com$/i.test(host)) referrer = "$direct";
      }
    } catch {
    }

    try {
      ph.capture("$pageview", {
        $current_url: url,
        $pathname: pathname,
        $referrer: referrer,
      });
    } catch {
    }
  }, [pathname, searchParams]);

  return null;
}
