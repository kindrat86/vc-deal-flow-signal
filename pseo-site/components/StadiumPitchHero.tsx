"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StadiumPitchCountdown from "./StadiumPitchCountdown";
import StadiumPitchRsvp from "./StadiumPitchRsvp";
import {
  formatDropTimeUtc,
  formatMonthLabel,
  getStadiumPhase,
  type StadiumPhase,
} from "@/lib/stadium-pitch-schedule";

/**
 * Stadium Pitch, phase-aware event hero.
 *
 * Renders one of two banners based on whether the page is currently inside
 * the 48-hour live window of the latest published address:
 *
 *   - "live"  , JUST DROPPED, read it now while it's live, countdown to
 *                end of live window.
 *   - "replay", REPLAY of latest address, countdown to next drop, RSVP
 *                form to be on the list for the next moment.
 *
 * Why client-side: the phase depends on the current wall clock and ticks
 * every second. SSR renders a phase-neutral placeholder banner; on mount,
 * the right phase paints in. The placeholder occupies the same vertical
 * space (no layout shift on hydration).
 */

type Props = {
  /** Date string (YYYY-MM-DD) of the latest address's publishDate. */
  latestPublishDate: string;
  /** Title of the latest address, surfaced in "live" mode. */
  latestTitle: string;
  /** Display label (e.g. "May 2026") of the latest address. */
  latestMonth: string;
};

type PhaseSnapshot = {
  phase: StadiumPhase;
  msToTransition: number;
  recentDropIso: string;
  nextDropIso: string;
};

export default function StadiumPitchHero({
  latestPublishDate,
  latestTitle,
  latestMonth,
}: Props) {
  // Hydration-safe snapshot. SSR + first-paint shows a neutral framework
  // (RSVP + "next drop in [calendar slot]" line). On mount we resolve the
  // exact phase against the wall clock.
  const [snapshot, setSnapshot] = useState<PhaseSnapshot | null>(null);

  useEffect(() => {
    function refresh() {
      setSnapshot(getStadiumPhase(new Date(), latestPublishDate));
    }
    refresh();
    // The phase only transitions every ~48 hours or at month boundary -
    // a 60-second tick is plenty. The countdown ticker inside
    // StadiumPitchCountdown updates the visible numbers every second.
    const id = setInterval(refresh, 60_000);
    return () => clearInterval(id);
  }, [latestPublishDate]);

  // SSR placeholder, no phase, just frame.
  if (!snapshot) {
    return <PlaceholderHero latestMonth={latestMonth} />;
  }

  if (snapshot.phase === "live") {
    return (
      <LiveHero
        latestTitle={latestTitle}
        latestMonth={latestMonth}
        liveWindowEndsIso={new Date(
          new Date(snapshot.recentDropIso).getTime() + snapshot.msToTransition,
        ).toISOString()}
      />
    );
  }

  return (
    <ReplayHero
      latestMonth={latestMonth}
      nextDropIso={snapshot.nextDropIso}
    />
  );
}

/* ── Sub-components, hoisted to module scope (no inline-component anti-pattern) ── */

function PlaceholderHero({ latestMonth }: { latestMonth: string }) {
  return (
    <section className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-5 sm:p-6 space-y-3">
      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
        Stadium Pitch · monthly cadence
      </p>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
        The {latestMonth} address is live below, next drop ships first
        Wednesday of next month, 09:00 UTC.
      </h2>
      <div
        aria-hidden="true"
        className="h-6 w-48 rounded bg-slate-800/40"
      />
    </section>
  );
}

function LiveHero({
  latestTitle,
  latestMonth,
  liveWindowEndsIso,
}: {
  latestTitle: string;
  latestMonth: string;
  liveWindowEndsIso: string;
}) {
  return (
    <section className="rounded-xl border-2 border-emerald-500/60 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 p-5 sm:p-7 space-y-4 shadow-lg shadow-emerald-900/20">
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"
          aria-hidden="true"
        />
        <p className="text-emerald-300 text-xs font-bold uppercase tracking-[0.18em]">
          Just dropped · Live window
        </p>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
        The {latestMonth} address is live now. Read it before the public
        window closes.
      </h2>
      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
        {latestTitle}
      </p>
      <div className="space-y-2">
        <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wider">
          Live window closes in
        </p>
        <StadiumPitchCountdown
          targetIso={liveWindowEndsIso}
          accentClass="text-emerald-300"
        />
      </div>
      <p className="text-gray-400 text-xs leading-relaxed pt-1">
        After the window, the page enters replay, still public, but Sunday
        RSVP subscribers always get the next drop in their inbox first.
      </p>
    </section>
  );
}

function ReplayHero({
  latestMonth,
  nextDropIso,
}: {
  latestMonth: string;
  nextDropIso: string;
}) {
  const nextMonth = formatMonthLabel(nextDropIso);
  const nextDropLabel = formatDropTimeUtc(new Date(nextDropIso));
  return (
    <section className="rounded-xl border border-sky-700/50 bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-950 p-5 sm:p-7 space-y-5">
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full bg-slate-500"
          aria-hidden="true"
        />
        <p className="text-sky-300 text-xs font-bold uppercase tracking-[0.18em]">
          Replay · {latestMonth}
        </p>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
        Next live drop, {nextMonth}.
      </h2>
      <div className="space-y-2">
        <p className="text-sky-200 text-xs font-semibold uppercase tracking-wider">
          Drops in
        </p>
        <StadiumPitchCountdown
          targetIso={nextDropIso}
          accentClass="text-sky-300"
        />
        <p className="text-gray-400 text-xs">
          {nextDropLabel} · first Wednesday of every month
        </p>
      </div>
      <StadiumPitchRsvp source="state-of-github-replay" />
      <p className="text-gray-400 text-xs leading-relaxed pt-1">
        Or keep reading, the {latestMonth} replay is below, free and public.{" "}
        <Link
          href="/funnels"
          className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
        >
          Every door
        </Link>
        .
      </p>
    </section>
  );
}
