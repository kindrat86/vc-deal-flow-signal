import Link from "next/link";

/**
 * IdentityBanner, Brunson DotCom Secrets Ch 4 (Three Core Markets / Desires).
 *
 * The core move: pick ONE primary market (Wealth) and layer in the secondary
 * (Status) as identity transformation. The buyer doesn't just want a tool -
 * they want to *become* the investor who's early on purpose: the one who moves
 * on a translated signal before the deck exists (avatar = Marcus, a non-coder
 * dealmaker, see lib/data-nerd.ts tribe).
 *
 * Surfaces above ThreeDoorHero on the home page so the identity declaration
 * frames every door beneath it. Also reused on /identity for the long-form
 * "who you become" page.
 *
 * Static RSC (no hooks, no client state). All copy hoisted to module scope
 * so the array is allocated once at build (server-hoist-static-io rule).
 */

const WEALTH_OUTCOMES = [
  "First investor on three breakouts a quarter, at €5-50k cheque sizes that survive a partner meeting because they're the talked-about deals.",
  "Reply rate ~4× the warm-intro template, because you led with what the engineering team is shipping, not what the deck claims.",
  "First-meeting-to-term-sheet timeline compressed from months to weeks, because the round opened *after* you were already in the conversation.",
] as const;

const STATUS_OUTCOMES = [
  "You notice the breakout while everyone else is still waiting for the familiar database update.",
  "You send the email while the window is still calm enough to matter.",
  "You carry a clearer timing signal into the conversation instead of repeating what the market already knows.",
];

export default function IdentityBanner() {
  return (
    <section
      aria-label="Who you become"
      className="bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 border border-amber-700/40 rounded-xl p-6 sm:p-8 my-6"
    >
      <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
        Who you become · The identity shift
      </p>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-100 leading-tight tracking-tight mb-5">
        You stop hearing the story late and start seeing the change earlier.
      </h2>
      <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
        This shift is not about sounding smarter. It is about seeing what changed
        while the window is still calm enough to matter. Instead of relying on
        the same crowded surfaces as everyone else, you start with a public signal
        that gives you a cleaner read on timing before the round feels obvious.
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
        {" "}, who the buyer was before, who they are after, and the seven shifts
        that take you from one to the other.
      </p>
    </section>
  );
}
