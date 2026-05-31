/**
 * FunnelTeardown — Brunson-style structural teardown of a competitor funnel.
 *
 * Server Component (no 'use client'): renders inline SVG step-strip and
 * static markup. No hydration cost, prints cleanly, indexable by agents.
 *
 * Visual structure:
 *   1. Header — competitor name + tagline + source notes
 *   2. Step strip — horizontal numbered chevrons (CSS, wraps to vertical
 *      on mobile via flex-wrap)
 *   3. Per-step detail cards — three columns (Their Mechanic / Brunson Note /
 *      Our Move) per step
 *   4. Analysis triptych — What they do right / Where they leak / Our move
 *
 * Why not literal screenshots:
 *   See competitor-teardowns.ts header — anonymity rule + IP risk.
 *   Structural teardowns of publicly-observable funnel mechanics carry the
 *   same persuasive intent without the trademark friction.
 */

import type { CompetitorTeardown } from "@/content/competitor-teardowns";

// Hoisted regex (js-hoist-regexp): strips leading "N — " or "N - " from step
// labels so the chevron renders the label without a duplicate step number.
const STEP_PREFIX = /^\d+\s*[—-]\s*/;

interface FunnelTeardownProps {
  teardown: CompetitorTeardown;
  /** When true, renders an anchor `id` so the section is link-targetable. */
  withAnchor?: boolean;
}

export function FunnelTeardown({ teardown, withAnchor = true }: FunnelTeardownProps) {
  const anchorId = withAnchor ? `teardown-${teardown.key}` : undefined;

  return (
    <section
      id={anchorId}
      aria-labelledby={`${anchorId}-title`}
      className="my-12 rounded-xl border border-amber-900/40 bg-gradient-to-br from-slate-950 to-slate-900 p-6 sm:p-8 scroll-mt-24"
    >
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400/80 mb-2">
          Funnel Teardown
        </p>
        <h2
          id={`${anchorId}-title`}
          className="text-2xl sm:text-3xl font-bold text-gray-100 mb-2 leading-tight"
        >
          {teardown.competitor}
          <span className="text-gray-500 font-normal"> — funnel architecture</span>
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
          {teardown.tagline}
        </p>
      </div>

      {/* Step strip — horizontal chevrons, wraps responsively */}
      <ol
        className="flex flex-wrap gap-2 mb-8"
        aria-label={`${teardown.competitor} funnel steps, in order`}
      >
        {teardown.funnelArch.map((step, idx) => {
          const stepNumber = idx + 1;
          const stepLabel = step.step.replace(STEP_PREFIX, "");
          return (
            <li
              key={step.step}
              className="flex-1 min-w-[140px] sm:min-w-[160px] relative"
            >
              <a
                href={`#${anchorId}-step-${stepNumber}`}
                className="block h-full rounded-md border border-slate-700 bg-slate-800/50 hover:border-amber-700/60 hover:bg-slate-800 transition-colors px-3 py-3 group"
              >
                <span
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-900/50 text-amber-300 text-xs font-bold mb-1.5 group-hover:bg-amber-800/70"
                  aria-hidden="true"
                >
                  {stepNumber}
                </span>
                <span className="block text-gray-200 text-sm font-medium leading-tight">
                  {stepLabel}
                </span>
              </a>
            </li>
          );
        })}
      </ol>

      {/* Per-step detail cards */}
      <div className="space-y-5 mb-8">
        {teardown.funnelArch.map((step, idx) => {
          const stepNumber = idx + 1;
          return (
            <article
              key={step.step}
              id={`${anchorId}-step-${stepNumber}`}
              className="rounded-lg border border-slate-800 bg-slate-900/60 p-5 scroll-mt-24"
            >
              <header className="mb-4 flex items-start gap-3">
                <span
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-900/50 text-amber-300 text-xs font-bold shrink-0"
                  aria-hidden="true"
                >
                  {stepNumber}
                </span>
                <h3 className="text-gray-100 font-semibold text-base leading-tight pt-0.5">
                  {step.step.replace(STEP_PREFIX, "")}
                </h3>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {/* Their mechanic */}
                <div className="rounded-md border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500 mb-2">
                    Their Mechanic
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    {step.theirMechanic}
                  </p>
                </div>

                {/* Mechanic note (highlighted middle column) */}
                <div className="rounded-md border border-amber-900/40 bg-amber-950/20 p-4">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-amber-400/80 mb-2">
                    Mechanic Read
                  </p>
                  <p className="text-amber-100/90 leading-relaxed italic">
                    {step.brunsonNote}
                  </p>
                </div>

                {/* Our move */}
                <div className="rounded-md border border-sky-900/40 bg-sky-950/20 p-4">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-sky-400/80 mb-2">
                    Our Move
                  </p>
                  <p className="text-sky-100/90 leading-relaxed">
                    {step.ourMove}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Analysis triptych */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg border border-emerald-900/40 bg-emerald-950/15 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-400 mb-2">
            What they do right
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {teardown.whatTheyDoRight}
          </p>
        </div>
        <div className="rounded-lg border border-rose-900/40 bg-rose-950/15 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-rose-400 mb-2">
            Where they leak
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {teardown.whereTheyLeak}
          </p>
        </div>
        <div className="rounded-lg border border-sky-900/40 bg-sky-950/15 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-sky-400 mb-2">
            How we differ, in one line
          </p>
          <p className="text-gray-300 text-sm leading-relaxed font-medium">
            {teardown.ourMoveSummary}
          </p>
        </div>
      </div>

      {/* Sources footnote (rendering-conditional-render: ternary, not &&) */}
      {teardown.sources.length > 0 ? (
        <p className="text-xs text-gray-500 leading-relaxed">
          <span className="font-medium text-gray-400">Sources observed:</span>{" "}
          {teardown.sources.join(" · ")}. All step descriptions reflect
          publicly-available, logged-out funnel mechanics — no insider access,
          no leaked screenshots, no NDA material.
        </p>
      ) : null}
    </section>
  );
}

export default FunnelTeardown;
