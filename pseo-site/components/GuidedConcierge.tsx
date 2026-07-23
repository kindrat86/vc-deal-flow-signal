"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * GuidedConcierge — route-aware "where to go next" panel.
 *
 * History worth knowing before editing: the original component was never
 * committed. `layout.tsx` began importing it in 4b41560, and 688d300d replaced
 * it with a stub returning null so the build would compile "until the real
 * implementation lands". It never landed, so from 2026-05-25 the site rendered
 * no concierge at all — 2,727 pageviews and zero concierge events in the 28 days
 * to 2026-07-23, on the portfolio's largest search surface. A null-returning
 * stub deploys perfectly happily, which is why it went unnoticed for two months.
 *
 * The event contract below reproduces what production actually emitted on
 * 2026-05-24/25, reconstructed from telemetry in
 * docs/guided-concierge-recovered-spec.md. Event names, property names and the
 * option_key -> destination pairs are deliberately identical to the originals:
 * that is what keeps the pre-stub data comparable with what ships now.
 *
 * Mounted inside <NotInEmbed> in the root layout, so it is already gated off
 * /embed/<widget>/... surfaces — do not add a second gate here.
 */

type Option = { key: string; label: string; href: string };

const VARIANT = "v1_default";
const STORAGE_KEY = "gd_concierge_dismissed_v1";

/** Hold the panel back briefly so it never competes with LCP. */
const APPEAR_DELAY_MS = 1200;

/** The five options the original offered, keyed by its `option_key` vocabulary. */
const OPTION = {
  weekly_shortlist: {
    key: "weekly_shortlist",
    label: "See this week's shortlist",
    href: "/weekly/top-100",
  },
  methodology: { key: "methodology", label: "How the signal works", href: "/methodology" },
  scout_score: { key: "scout_score", label: "Show me the receipts", href: "/receipts" },
  // `mcp_workflow` originally pointed at
  // /integrations/best-mcp-server-for-vc-research, which now 308-redirects to
  // the path below. The option_key is kept for telemetry continuity but the
  // href is the canonical target — a redirect hop costs a round trip for nothing.
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

/**
 * Route archetype -> options offered there. The `source_type` values and the
 * option_key/destination pairs are the ones production emitted.
 *
 * Only the first four source_types below (`landing_home`, `weekly_top_100`,
 * `receipts`, `compare`) appear in the 2026-05 telemetry — those are verbatim.
 * The rest were added because the observed set covers just 12% of this site's
 * pageviews: it is a ~4,000-page pSEO surface where the long tail IS the
 * traffic, so an archetype list without a catch-all leaves ~88% of visitors
 * with no next step at all. New source_types are additive and don't disturb
 * comparisons against the pre-stub data.
 *
 * First match wins, so specific prefixes precede general ones.
 */
const ROUTES: { match: (path: string) => boolean; sourceType: string; options: Option[] }[] = [
  {
    match: (p) => p === "/",
    sourceType: "landing_home",
    options: [OPTION.weekly_shortlist, OPTION.methodology, OPTION.scout_score],
  },
  {
    match: (p) => p.startsWith("/weekly/"),
    sourceType: "weekly_top_100",
    options: [OPTION.methodology, OPTION.scout_score],
  },
  {
    match: (p) => p === "/receipts" || p.startsWith("/receipts/"),
    sourceType: "receipts",
    options: [OPTION.mcp_workflow, OPTION.compare],
  },
  {
    // Note the exact-path arm: /compare is the #2 landing page on this site,
    // and a bare startsWith("/compare/") misses it entirely.
    match: (p) => p === "/compare" || p.startsWith("/compare/"),
    sourceType: "compare",
    options: [OPTION.methodology, OPTION.weekly_shortlist],
  },
  {
    match: (p) => p === "/methodology",
    sourceType: "methodology",
    options: [OPTION.scout_score, OPTION.weekly_shortlist, OPTION.mcp_workflow],
  },
  {
    match: (p) => p.startsWith("/vs/"),
    sourceType: "vs",
    options: [OPTION.methodology, OPTION.scout_score, OPTION.weekly_shortlist],
  },
  {
    match: (p) => p === "/alternatives" || p.startsWith("/alternatives/"),
    sourceType: "alternatives",
    options: [OPTION.weekly_shortlist, OPTION.scout_score, OPTION.methodology],
  },
  {
    match: (p) => p.startsWith("/answers/"),
    sourceType: "answers",
    options: [OPTION.weekly_shortlist, OPTION.mcp_workflow, OPTION.methodology],
  },
  {
    match: (p) => p.startsWith("/startups-to-watch/") || p.startsWith("/best/"),
    sourceType: "startups_to_watch",
    options: [OPTION.weekly_shortlist, OPTION.methodology],
  },
  {
    match: (p) => p.startsWith("/research-paper/") || p.startsWith("/from-stars-to-seed/"),
    sourceType: "research",
    options: [OPTION.methodology, OPTION.weekly_shortlist, OPTION.scout_score],
  },
];

/** Everything else on the long tail. Keeps coverage at ~100% rather than 12%. */
const FALLBACK = {
  sourceType: "other",
  options: [OPTION.weekly_shortlist, OPTION.scout_score, OPTION.methodology],
};

/**
 * Surfaces where a "where to go next" nudge is noise: app-like pages the
 * visitor reached deliberately, and the Markdown mirror. `/embed/<widget>/...`
 * is already gated by <NotInEmbed> in the layout and needs no entry here.
 */
function isSuppressed(path: string): boolean {
  return (
    path.startsWith("/account") ||
    path.startsWith("/dashboard") ||
    path.startsWith("/md/")
  );
}

type PostHog = { capture: (event: string, props?: Record<string, unknown>) => void };

function posthog(): PostHog | null {
  if (typeof window === "undefined") return null;
  const ph = (window as unknown as { posthog?: PostHog }).posthog;
  return ph && typeof ph.capture === "function" ? ph : null;
}

/** A telemetry failure must never break navigation. */
function capture(event: string, props: Record<string, unknown>): void {
  try {
    posthog()?.capture(event, props);
  } catch {
    /* no-op */
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
  // Store WHICH path the panel is open for rather than a bare boolean. A
  // client-side route change then hides it implicitly, with no synchronous
  // setState in the effect body (which would cascade renders).
  const [shownFor, setShownFor] = useState<string | null>(null);
  const visible = shownFor !== null && shownFor === pathname;

  const route = useMemo(() => {
    if (!pathname || isSuppressed(pathname)) return undefined;
    return ROUTES.find((entry) => entry.match(pathname)) ?? FALLBACK;
  }, [pathname]);

  useEffect(() => {
    if (!route || typeof window === "undefined") return;
    try {
      // Same opt-out CookieNotice honors: browsers sending DNT or GPC get no
      // analytics, and this panel exists to emit analytics.
      const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
      if (nav.doNotTrack === "1" || nav.globalPrivacyControl) return;
      if (window.localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      /* private mode — fall through and show it */
    }

    const timer = window.setTimeout(() => {
      setShownFor(pathname);
      // Fires on appearance rather than on click — that is how the original
      // behaved, and why `referrer_domain` is meaningful on this event.
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
      /* private mode — it just reappears next visit */
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
      className="fixed z-[98] bottom-6 left-6 right-6 sm:right-auto sm:max-w-sm
                 rounded-lg border border-sky-700 bg-sky-950/95 p-4
                 text-sky-100 shadow-xl backdrop-blur"
    >
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="absolute right-2 top-2 h-7 w-7 rounded text-sky-300
                   transition-colors hover:bg-sky-800 hover:text-white"
      >
        ×
      </button>

      <p className="pr-7 text-sm font-semibold leading-snug">Not sure where to start?</p>

      <ul className="mt-3 space-y-1.5">
        {route.options.map((option) => (
          <li key={option.key}>
            {/* A plain <a>, not next/link, and deliberately so: `capture` is
                fire-and-forget and PostHog batches on a timer, so a client-side
                route transition can tear the page down before the request
                leaves. A real navigation lets the beacon flush on pagehide.
                The query pair is the original's attribution convention. */}
            <a
              href={`${option.href}?src=concierge&intent=${option.key}`}
              onClick={() => onOption(option)}
              className="block rounded px-2 py-1.5 text-sm text-sky-200
                         transition-colors hover:bg-sky-800 hover:text-white"
            >
              {option.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
