"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * GuidedConcierge, a route-aware "where to go next" panel.
 *
 * The event contract reproduces what production emitted before the component
 * was replaced with a null stub. Event names, property names, and option keys
 * stay stable so earlier telemetry remains comparable.
 *
 * Mounted inside <NotInEmbed> in the root layout, so it is already gated off
 * /embed/<widget>/... surfaces.
 */

type Option = { key: string; label: string; href: string };

const VARIANT = "v1_default";
const STORAGE_KEY = "gd_concierge_dismissed_v1";
const APPEAR_DELAY_MS = 1200;

const OPTION = {
  weekly_shortlist: {
    key: "weekly_shortlist",
    label: "See this week's shortlist",
    href: "/weekly/top-100",
  },
  methodology: {
    key: "methodology",
    label: "How the signal works",
    href: "/methodology",
  },
  scout_score: {
    key: "scout_score",
    label: "Show me the receipts",
    href: "/receipts",
  },
  mcp_workflow: {
    key: "mcp_workflow",
    label: "Use this from my own tools",
    href: "/answers/best-mcp-server-for-vc-research",
  },
  compare: {
    key: "compare",
    label: "Compare the alternatives",
    href: "/compare/best-startup-signal-tools-for-investors",
  },
} satisfies Record<string, Option>;

const ROUTES: {
  match: (path: string) => boolean;
  sourceType: string;
  options: Option[];
}[] = [
  {
    match: (path) => path === "/",
    sourceType: "landing_home",
    options: [OPTION.weekly_shortlist, OPTION.methodology, OPTION.scout_score],
  },
  {
    match: (path) => path.startsWith("/weekly/"),
    sourceType: "weekly_top_100",
    options: [OPTION.methodology, OPTION.scout_score],
  },
  {
    match: (path) => path === "/receipts" || path.startsWith("/receipts/"),
    sourceType: "receipts",
    options: [OPTION.mcp_workflow, OPTION.compare],
  },
  {
    match: (path) => path === "/compare" || path.startsWith("/compare/"),
    sourceType: "compare",
    options: [OPTION.methodology, OPTION.weekly_shortlist],
  },
  {
    match: (path) => path === "/methodology",
    sourceType: "methodology",
    options: [OPTION.scout_score, OPTION.weekly_shortlist, OPTION.mcp_workflow],
  },
  {
    match: (path) => path.startsWith("/vs/"),
    sourceType: "vs",
    options: [OPTION.methodology, OPTION.scout_score, OPTION.weekly_shortlist],
  },
  {
    match: (path) =>
      path === "/alternatives" || path.startsWith("/alternatives/"),
    sourceType: "alternatives",
    options: [OPTION.weekly_shortlist, OPTION.scout_score, OPTION.methodology],
  },
  {
    match: (path) => path.startsWith("/answers/"),
    sourceType: "answers",
    options: [OPTION.weekly_shortlist, OPTION.mcp_workflow, OPTION.methodology],
  },
  {
    match: (path) =>
      path.startsWith("/startups-to-watch/") || path.startsWith("/best/"),
    sourceType: "startups_to_watch",
    options: [OPTION.weekly_shortlist, OPTION.methodology],
  },
  {
    match: (path) =>
      path.startsWith("/research-paper/") ||
      path.startsWith("/from-stars-to-seed/"),
    sourceType: "research",
    options: [OPTION.methodology, OPTION.weekly_shortlist, OPTION.scout_score],
  },
];

const FALLBACK = {
  sourceType: "other",
  options: [OPTION.weekly_shortlist, OPTION.scout_score, OPTION.methodology],
};

function isSuppressed(path: string): boolean {
  return (
    path.startsWith("/account") ||
    path.startsWith("/dashboard") ||
    path.startsWith("/md/")
  );
}

type PostHog = {
  capture: (event: string, props?: Record<string, unknown>) => void;
};

function posthog(): PostHog | null {
  if (typeof window === "undefined") return null;
  const instance = (window as unknown as { posthog?: PostHog }).posthog;
  return instance && typeof instance.capture === "function" ? instance : null;
}

function capture(event: string, props: Record<string, unknown>): void {
  try {
    posthog()?.capture(event, props);
  } catch {
    // Analytics must never break navigation.
  }
}

function referrerDomain(): string {
  try {
    return document.referrer ? new URL(document.referrer).hostname : "";
  } catch {
    return "";
  }
}

function utm(param: string): string {
  try {
    return new URLSearchParams(window.location.search).get(param) ?? "";
  } catch {
    return "";
  }
}

export default function GuidedConcierge() {
  const pathname = usePathname();
  const [shownFor, setShownFor] = useState<string | null>(null);
  const visible = shownFor !== null && shownFor === pathname;

  const route = useMemo(() => {
    if (!pathname || isSuppressed(pathname)) return undefined;
    return ROUTES.find((entry) => entry.match(pathname)) ?? FALLBACK;
  }, [pathname]);

  useEffect(() => {
    if (!route || typeof window === "undefined") return;
    try {
      const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
      if (nav.doNotTrack === "1" || nav.globalPrivacyControl) return;
      if (window.localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      // Private mode can deny storage while still allowing the panel.
    }

    const timer = window.setTimeout(() => {
      setShownFor(pathname);
      capture("concierge_opened", {
        source_page: pathname,
        source_type: route.sourceType,
        variant: VARIANT,
        referrer_domain: referrerDomain(),
        utm_source: utm("utm_source"),
        utm_medium: utm("utm_medium"),
        utm_campaign: utm("utm_campaign"),
      });
    }, APPEAR_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [route, pathname]);

  const onDismiss = useCallback(() => {
    setShownFor(null);
    capture("concierge_dismissed", {
      source_page: pathname,
      source_type: route?.sourceType,
      variant: VARIANT,
    });
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // The panel may reappear on a later visit if storage is unavailable.
    }
  }, [pathname, route]);

  const onOption = useCallback(
    (option: Option) => {
      capture("concierge_option_clicked", {
        source_page: pathname,
        source_type: route?.sourceType,
        option_key: option.key,
        destination_page: option.href,
        variant: VARIANT,
      });
    },
    [pathname, route],
  );

  if (!route || !visible) return null;

  return (
    <aside
      role="complementary"
      aria-label="Where to go next"
      className="fixed z-[98] bottom-40 left-6 right-6 sm:bottom-6 sm:right-auto sm:max-w-sm rounded-lg border border-sky-700 bg-sky-950/95 p-4 text-sky-100 shadow-xl backdrop-blur"
    >
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="absolute right-2 top-2 h-7 w-7 rounded text-sky-300 transition-colors hover:bg-sky-800 hover:text-white"
      >
        ×
      </button>

      <p className="pr-7 text-sm font-semibold leading-snug">
        Not sure where to start?
      </p>

      <ul className="mt-3 space-y-1.5">
        {route.options.map((option) => (
          <li key={option.key}>
            <a
              href={`${option.href}?src=concierge&intent=${option.key}`}
              onClick={() => onOption(option)}
              className="block rounded px-2 py-1.5 text-sm text-sky-200 transition-colors hover:bg-sky-800 hover:text-white"
            >
              {option.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
