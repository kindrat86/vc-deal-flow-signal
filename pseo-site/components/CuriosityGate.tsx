/**
 * CuriosityGate — the email-gated "Insider preview" row.
 *
 * Shows a blurred, PER-ENTITY projected lead-time window + next milestone
 * (derived from this org's own real commit signal — see lib/projection.ts),
 * gated behind the free Sunday-digest signup. Brunson curiosity-gap squeeze:
 * the value is visibly there, the email is the key.
 *
 * Honesty rules (do NOT regress): every value is a deterministic function of
 * data already on the page, never a hardcoded placeholder; the row is always
 * labeled a model estimate. Used on /startup/[slug] and the list templates
 * (startups-to-watch, predicted, trending) that carry real per-row fields.
 */

import { projectedLeadWindow, projectedMilestone } from "@/lib/projection";

interface Props {
  /** This entity's real commit-velocity change (e.g. "+340%") or numeric pct. */
  change: string | number;
  /** This entity's classified signal type. */
  signalType: string;
  /** The named entity the blurred projection belongs to. */
  entityName: string;
  /** How many *other* entities the digest also unlocks (list pages). */
  otherCount?: number;
  /** Plain-English label for the set, e.g. "AI/ML startups this period". */
  contextLabel?: string;
  className?: string;
}

const FREE_DIGEST = "https://gitdealflow.com/#signup";

export default function CuriosityGate({
  change,
  signalType,
  entityName,
  otherCount,
  contextLabel = "startups we track",
  className = "",
}: Props) {
  const leadWindow = projectedLeadWindow(change);
  const milestone = projectedMilestone(signalType);
  const others =
    typeof otherCount === "number" && otherCount > 0
      ? ` and ${otherCount} other ${contextLabel}`
      : ` against ${contextLabel}`;

  return (
    <div
      className={`rounded-lg border-2 border-signal-500/30 bg-gradient-to-br from-signal-500/[0.03] to-slate-900 p-5 ${className}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-block bg-signal-500/15 text-signal-300 text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-1 rounded-full border border-signal-500/30">
          Insider preview
        </span>
        <p className="text-gray-400 text-xs">Free with email signup</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-400 text-xs mb-1">Projected lead-time window</p>
          <p className="text-2xl font-bold text-signal-400 select-none filter blur-sm">
            {leadWindow}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">Projected next milestone</p>
          <p className="text-2xl font-bold text-signal-400 select-none filter blur-sm">
            {milestone}
          </p>
        </div>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        The free Sunday digest puts {entityName}
        {others} in context — 14-day acceleration deltas, contributor maps, and
        the top names not on Crunchbase yet. Five names every Sunday, no card, no
        code-reading.
      </p>
      <a
        href={FREE_DIGEST}
        className="inline-flex items-center gap-2 rounded-lg bg-signal-500 hover:bg-signal-400 active:bg-signal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-signal-500/30 transition-all hover:-translate-y-0.5"
      >
        Unlock with email →
      </a>
      <p className="text-gray-400 text-[10px] mt-3 italic">
        Projections are model estimates derived from each org&apos;s public commit
        signal and the SSRN-published methodology — not statements of fact.
        Cross-reference with primary sources before acting.
      </p>
    </div>
  );
}
