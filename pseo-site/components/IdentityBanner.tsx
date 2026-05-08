import Link from "next/link";

/**
 * IdentityBanner — Brunson DotCom Secrets Ch 4 (Three Core Markets / Desires).
 *
 * The core move: pick ONE primary market (Wealth) and layer in the secondary
 * (Status) as identity transformation. The buyer doesn't just want a tool —
 * they want to *become* the partner who reads the code, not the deck.
 *
 * Surfaces above ThreeDoorHero on the home page so the identity declaration
 * frames every door beneath it. Also reused on /identity for the long-form
 * "who you become" page.
 *
 * Static RSC (no hooks, no client state). All copy hoisted to module scope
 * so the array is allocated once at build (server-hoist-static-io rule).
 */

const WEALTH_OUTCOMES = [
  "First investor on three breakouts a quarter — at €5–50k cheque sizes that survive a partner meeting because they're the talked-about deals.",
  "Reply rate ~4× the warm-intro template, because you led with what the engineering team is shipping, not what the deck claims.",
  "First-meeting-to-term-sheet timeline compressed from months to weeks, because the round opened *after* you were already in the conversation.",
] as const;

const STATUS_OUTCOMES = [
  "The analyst at the partner meeting who saw the breakout 21–47 days before it hit the deck stage.",
  "The partner who closes their inbox at 09:30 because they already wrote three founder emails before everyone else opened Crunchbase.",
  "The fund whose pipeline note begins \"GitHub commit-velocity flagged this on 2026-04-12\" — instead of \"warm intro from Marc on Tuesday.\"",
] as const;

export default function IdentityBanner() {
  return (
    <section
      aria-label="Who you become"
      className="bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 border border-amber-700/40 rounded-xl p-6 sm:p-8 my-6"
    >
      <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
        Who you become · The identity shift
      </p>

      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-100 leading-snug tracking-tight mb-4">
        You become <span className="text-amber-300">the partner who reads the code, not the deck.</span>
      </h2>

      <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
        The before-and-after isn't a feature list. It's an identity. The investor
        who ships this stack stops chasing pitch decks across a warm-intro
        rolodex — and starts arriving on the founder's inbox{" "}
        <span className="text-gray-100 font-semibold">21 to 47 days earlier</span>{" "}
        than every analyst still working off the lagging surface.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-slate-900/60 border border-emerald-700/30 rounded-lg p-4">
          <p className="text-emerald-400 text-[11px] uppercase tracking-wider font-semibold mb-2">
            The Wealth outcome
          </p>
          <p className="text-gray-200 text-sm font-semibold mb-3 leading-snug">
            Better deals, written earlier, at cheque sizes that compound.
          </p>
          <ul className="space-y-2">
            {WEALTH_OUTCOMES.map((line) => (
              <li key={line} className="text-gray-400 text-sm leading-relaxed flex gap-2">
                <span aria-hidden="true" className="text-emerald-500 mt-0.5">▸</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900/60 border border-violet-700/30 rounded-lg p-4">
          <p className="text-violet-400 text-[11px] uppercase tracking-wider font-semibold mb-2">
            The Status outcome
          </p>
          <p className="text-gray-200 text-sm font-semibold mb-3 leading-snug">
            The reputation of the analyst who calls it before the deck lands.
          </p>
          <ul className="space-y-2">
            {STATUS_OUTCOMES.map((line) => (
              <li key={line} className="text-gray-400 text-sm leading-relaxed flex gap-2">
                <span aria-hidden="true" className="text-violet-500 mt-0.5">▸</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-gray-400 text-sm leading-relaxed mt-6">
        Read the long version on{" "}
        <Link
          href="/identity"
          className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
        >
          /identity
        </Link>
        {" "}— who the buyer was before, who they are after, and the seven shifts
        that take you from one to the other.
      </p>
    </section>
  );
}
