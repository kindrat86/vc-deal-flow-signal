"use client";

import { TEASER_VISIBLE, TEASER_LOCKED_COUNT } from "@/lib/teaser-signals";
import LeadConversionEvent from "@/components/LeadConversionEvent";

// Brunson "Almost there" bridge page, shared by HomeSqueezeForm and the
// /squeeze SqueezeForm. It replaces the old thin "One last step / check your
// inbox" card and does the four jobs of a real bridge page:
//   1. Restate the prize (and pay part of it out NOW, close the value gap).
//   2. Give the literal instruction (open the email, click confirm, whitelist).
//   3. Seed the story loop the confirmation email + email 1 of the SOS close.
//   4. Make the ascension offer (don't wait for Sunday).
//
// `route` is the F/T/D/I investor self-select, used only to bias which
// ascension rung we lead with. Anything falsy leads with First Look.

const FIRSTLOOK_URL = "https://gitdealflow.com/firstlook";
const DASHBOARD_URL = "https://gitdealflow.com/dashboard";

export default function SqueezeSuccess({
  email,
  route = "",
}: {
  email: string;
  route?: string;
}) {
  // Operators / "something else" tend to want the full field; everyone else
  // gets the lower-friction €7 First Look as the lead ascension step.
  const leadDashboard = route === "D" || route === "I";

  return (
    <div className="space-y-5">
      <LeadConversionEvent />
      {/* 1 + value-gap payoff: real names, right now */}
      <div className="rounded-xl border border-emerald-700/40 bg-emerald-950/30 p-6 sm:p-8 space-y-4">
        <div className="space-y-1">
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-[0.14em]">
            You&rsquo;re in
          </p>
          <h3 className="text-gray-100 font-semibold text-2xl leading-tight">
            Here&rsquo;s a taste while your inbox loads.
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            A sample from a recent Sunday issue, the kind of names the
            signal flags 21 to 47 days before the deck circulates. Your
            own first issue is being generated now.
          </p>
        </div>

        <ul className="space-y-2.5">
          {TEASER_VISIBLE.map((s, i) => (
            <li
              key={s.name}
              className="flex items-center gap-3 rounded-lg border border-slate-700/70 bg-slate-900/60 px-3.5 py-3"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600/20 text-emerald-300 text-sm font-bold">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="text-gray-100 font-semibold truncate">
                    {s.name}
                  </span>
                  <span className="text-gray-500 text-xs">{s.sector}</span>
                </span>
                <span className="text-emerald-400/80 text-xs">
                  {s.signalType}
                </span>
              </span>
              <span className="shrink-0 text-emerald-400 font-bold text-sm tabular-nums">
                {s.momentum}
              </span>
            </li>
          ))}

          {/* Locked rows, the dopamine gap the confirm-click closes */}
          {Array.from({ length: TEASER_LOCKED_COUNT }).map((_, i) => (
            <li
              key={`locked-${i}`}
              className="flex items-center gap-3 rounded-lg border border-dashed border-slate-700/70 bg-slate-900/30 px-3.5 py-3"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700/40 text-slate-400 text-sm font-bold">
                {TEASER_VISIBLE.length + i + 1}
              </span>
              <span
                aria-hidden="true"
                className="min-w-0 flex-1 select-none text-slate-500 font-semibold blur-[5px]"
              >
                {i === 0 ? "stealth-ai-infra" : "n6-protocol"}
              </span>
              <span className="shrink-0 inline-flex items-center gap-1 text-slate-400 text-xs font-medium">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Locked
              </span>
            </li>
          ))}
        </ul>

        <p className="text-emerald-200/90 text-sm font-medium leading-relaxed">
          Confirm your email to unlock the full five, and so next Sunday&rsquo;s
          issue lands in your inbox instead of you coming back here.
        </p>
      </div>

      {/* 2 + 3: literal instruction and the story seed */}
      <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-6 sm:p-7 space-y-4">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-[0.14em]">
          One click left
        </p>
        <ol className="space-y-3 text-sm leading-relaxed">
          <li className="text-gray-300">
            <span className="text-gray-100 font-semibold">
              1. Open the email from The Data Nerd.
            </span>{" "}
            We just sent the confirmation link to{" "}
            <strong className="text-emerald-200 break-all">{email}</strong>.
          </li>
          <li className="text-gray-300">
            <span className="text-gray-100 font-semibold">
              2. Click the confirm button.
            </span>{" "}
            That unlocks the full five and starts the Sunday rhythm.
          </li>
          <li className="text-gray-300">
            <span className="text-gray-100 font-semibold">
              3. The first thing you&rsquo;ll read
            </span>{" "}
            is the deal I missed by one night&rsquo;s sleep, it raised a
            $4M Series A three weeks later, and the system I built so you
            don&rsquo;t repeat it.
          </li>
        </ol>
        <p className="text-gray-500 text-xs leading-relaxed">
          Don&rsquo;t see it in 5 minutes? Check spam / Promotions and
          whitelist{" "}
          <code className="text-emerald-200 bg-emerald-900/40 px-1.5 py-0.5 rounded text-xs">
            signals@gitdealflow.com
          </code>
          .
        </p>
      </div>

      {/* 4: the ascension offer */}
      <div className="rounded-xl border border-sky-700/40 bg-sky-950/20 p-6 sm:p-7 space-y-3">
        <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em]">
          Already have a live thesis?
        </p>
        <p className="text-gray-300 text-sm leading-relaxed">
          {leadDashboard
            ? "Five names help. The full ranked field, 60+ accelerating startups in your sectors, re-ranked weekly, changes how you work. Don't wait for Sunday."
            : "If you already know the sector you want answered, don't wait for Sunday. Pick one, pay €7, and get the full ranked deep-dive in 24 hours."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={leadDashboard ? DASHBOARD_URL : FIRSTLOOK_URL}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-signal-500 hover:bg-signal-600 px-4 py-2.5 text-slate-950 text-sm font-semibold transition-colors"
          >
            {leadDashboard
              ? "See the Dashboard →"
              : "Get a €7 First Look →"}
          </a>
          <a
            href={leadDashboard ? FIRSTLOOK_URL : DASHBOARD_URL}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-700 hover:border-slate-500 px-4 py-2.5 text-gray-200 text-sm font-medium transition-colors"
          >
            {leadDashboard ? "Or a €7 First Look" : "Or see the Dashboard"}
          </a>
        </div>
        <p className="text-gray-500 text-xs">
          No pressure, your free Sunday issue is already on its way.
        </p>
      </div>
    </div>
  );
}
