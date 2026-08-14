"use client";

import { useEffect, useState } from "react";
import type { FunnelSlug } from "@/content/funnel-slugs";

/**
 * Live-activity badge rendered next to each funnel card on /funnels.
 *
 * Brunson Traffic Secrets §3 Ch 12, Funnel Hub social-proof multiplier.
 * Reads from /api/funnel-activity, polls every 45s (overlaps the
 * server-side 5s cache for a near-fresh feel without stampeding).
 *
 * Display rules (degrades gracefully when a funnel has zero traffic):
 *   - activeNow ≥ 1: amber pulse "🔴 N looking right now"
 *   - lastHour ≥ 1: emerald "N viewed this hour"
 *   - last24h ≥ 1: slate "N viewed today"
 *   - else: nothing rendered (no fake activity)
 *
 * On mount, the parent page fires a single tracking ping so the funnel
 * the visitor is currently looking at registers as "active". A daily-
 * rotated session id keeps the dedupe accurate across page reloads
 * without breaking anonymity (no cookies, just sessionStorage).
 */

type Counts = {
  activeNow: number;
  lastHour: number;
  last24h: number;
  lastSeenAt: number | null;
};

type ActivityResponse = {
  asOf: string;
  funnels: Record<string, Counts>;
  total24h: number;
  totalActive: number;
};

const POLL_MS = 45_000;

// Shared in-tab fetch promise so multiple <FunnelLiveActivity/> instances
// on the same page (one per funnel card) only hit the API once per poll.
let inflight: Promise<ActivityResponse | null> | null = null;
let lastFetched = 0;
let lastResponse: ActivityResponse | null = null;

async function fetchActivity(): Promise<ActivityResponse | null> {
  const now = Date.now();
  // Reuse a recent response within 4s to coalesce the per-card fetch storm
  // when the page first mounts.
  if (lastResponse && now - lastFetched < 4_000) return lastResponse;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const res = await fetch("/api/funnel-activity", {
        cache: "no-store",
        credentials: "omit",
      });
      if (!res.ok) return null;
      const data = (await res.json()) as ActivityResponse;
      lastResponse = data;
      lastFetched = Date.now();
      return data;
    } catch {
      return null;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

export function FunnelLiveActivity({ slug }: { slug: FunnelSlug }) {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      const data = await fetchActivity();
      if (cancelled || !data) return;
      setCounts(data.funnels[slug] ?? null);
    };
    void tick();
    const id = window.setInterval(() => void tick(), POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [slug]);

  if (!counts) return null;

  // Render priority: active > hour > day > nothing.
  if (counts.activeNow >= 1) {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-300"
        title={`${counts.activeNow} viewing right now (${counts.last24h} in the last 24h)`}
        aria-label={`${counts.activeNow} viewing this funnel right now`}
      >
        <LivePulse />
        {counts.activeNow} looking now
      </span>
    );
  }
  if (counts.lastHour >= 1) {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-300"
        title={`${counts.lastHour} viewed this funnel in the last hour (${counts.last24h} in 24h)`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        {counts.lastHour} viewed this hour
      </span>
    );
  }
  if (counts.last24h >= 1) {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400"
        title={`${counts.last24h} viewed this funnel in the last 24h`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
        {counts.last24h} viewed today
      </span>
    );
  }
  return null;
}

/**
 * Aggregate banner, sum across every funnel. Rendered once at the top of
 * /funnels so even when individual cards show nothing the visitor sees the
 * overall pulse of the hub.
 */
export function FunnelHubLiveBanner() {
  const [data, setData] = useState<ActivityResponse | null>(null);
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      const next = await fetchActivity();
      if (!cancelled) setData(next);
    };
    void tick();
    const id = window.setInterval(() => void tick(), POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  if (!data) return null;
  const { totalActive, total24h } = data;
  if (total24h === 0 && totalActive === 0) return null;

  return (
    <div
      className="inline-flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-gray-300 border-l-2 border-emerald-500/60 pl-4 py-1.5"
      aria-live="polite"
    >
      {totalActive > 0 ? (
        <span className="inline-flex items-center gap-1.5 text-amber-300 font-medium">
          <LivePulse />
          <span>
            <span className="font-mono tabular-nums">{totalActive}</span> looking
            right now
          </span>
        </span>
      ) : null}
      {total24h > 0 ? (
        <span className="text-gray-300">
          <span className="font-mono tabular-nums text-emerald-300">{total24h}</span>{" "}
          funnel views in the last 24h
        </span>
      ) : null}
    </div>
  );
}

function LivePulse() {
  return (
    <span className="relative inline-flex h-2 w-2" aria-hidden="true">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
    </span>
  );
}
