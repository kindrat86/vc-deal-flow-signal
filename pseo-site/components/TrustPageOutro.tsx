/**
 * TrustPageOutro, shared bottom block for the legal / trust / procurement pages
 * (/privacy, /terms, /dpa, /security, /subprocessors, /disclosure, /standards).
 *
 * Brunson doctrine: there is no such thing as a non-funnel page. A buyer reading
 * a DPA or a security overview is doing vendor diligence, i.e. they are at HIGH
 * intent, yet these pages historically dead-ended with a bare footer. This block
 * fixes all three audit lenses at once:
 *   - Rapport (Marcus ↔ The Data Nerd): a first-person `acNote` ties the legal
 *     topic to one of the character's polarities/flaws, plus the AC signoff so the
 *     page doesn't read as faceless boilerplate.
 *   - Brunson convertibility: an honest "cleared diligence → low-risk next step"
 *     bridge to the free Sunday digest. The page now ENDS on a CTA instead of a
 *     dead end. No fake urgency, no value stack, that would burn trust on a legal
 *     page, which is the opposite of the job.
 *   - Marcus fit: the next-step copy explicitly reassures the non-coding buyer
 *     ("you never have to read a line of code", "nothing here auto-charges").
 *
 * The free-digest CTA points at the apex `#signup` to match the site-wide
 * free-subscribe convention.
 */

import Link from "next/link";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";

interface TrustPageOutroProps {
  /**
   * One or two sentences in The Data Nerd's first-person voice that connect THIS
   * page's trust topic to a canonical polarity/flaw. Page-specific, this is the
   * line that creates rapport, so it must not read like the other six.
   */
  acNote: string;
  /**
   * Procurement/contract surfaces (DPA, security, terms, privacy, attestations)
   * are read by a fund's legal or IC team mid-diligence. When true, the next-step
   * block reframes for an institutional buyer and adds a higher-rung CTA to the
   * application-gated Sharp tier (/enterprise), so the value ladder's high end is
   * offered where the highest-intent buyer is actually standing, and the block
   * stops reading like the same consumer nudge on every page.
   */
  institutional?: boolean;
  className?: string;
}

export function TrustPageOutro({
  acNote,
  institutional = false,
  className = "",
}: TrustPageOutroProps) {
  return (
    <section className={`mt-12 space-y-6 ${className}`} aria-label="A note from the desk and your next step">
      {/* Rapport, the character's own take on this trust topic */}
      <aside className="rounded-xl border border-amber-700/30 bg-amber-950/15 p-5 sm:p-6">
        <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider mb-2">
          A note from the desk
        </p>
        <p className="text-gray-300 text-sm leading-relaxed italic">{acNote}</p>
      </aside>

      {/* Identity anchor, whose voice the reader was just reading */}
      <DataNerdSignoff variant="compact" />

      {/* Honest next-step bridge, convert the diligence moment, end on the CTA */}
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6 space-y-3">
        <h2 className="text-emerald-300 font-semibold">
          {institutional
            ? "Clearing this for a fund? Here’s the path, and the no-card way to start."
            : "Cleared the diligence? Here’s the low-risk next step."}
        </h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          {institutional
            ? "Your legal or IC team can clear this page without an engineer in the room, that’s the point. When they’re done, most funds start on the free Sunday digest to pressure-test the signal, then move to the application-gated Sharp tier once it’s earning its seat. No card to read the digest, and nothing on this site auto-charges."
            : "You came here to vet us, fair. If it checks out, the calmest way in is the free Sunday digest: five accelerating startups a week, no card, one-click unsubscribe, and you never have to read a line of code. Nothing on this site auto-charges, and the methodology behind every pick is public."}
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://gitdealflow.com/#signup"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition-colors"
          >
            Get the free Sunday digest →
          </a>
          {institutional ? (
            <Link
              href="/enterprise"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium"
            >
              See the fund tier (Sharp) →
            </Link>
          ) : (
            <Link
              href="/buyers-guide"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium"
            >
              How to evaluate a deal-flow tool →
            </Link>
          )}
          <Link
            href="/methodology"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium"
          >
            Read the methodology →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default TrustPageOutro;
