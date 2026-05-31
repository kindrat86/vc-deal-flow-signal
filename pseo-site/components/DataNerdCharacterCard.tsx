/**
 * DataNerdCharacterCard — compact AC surface for embedding on key pages.
 *
 * Brunson Expert Secrets Ch 2 (Charismatic Leader): the founder character
 * appears on every conversion-critical page in compressed form. The
 * /walkthrough, /firstlook, /pricing, /sector-sweep, /apply pages all
 * benefit from a single-card reminder of who is selling — archetype,
 * one polarity, one catchphrase, one parable link.
 *
 * Picks a deterministic-by-page polarity + parable so each surface
 * displays a different slice. Reader navigating the site sees the
 * character compound across surfaces instead of seeing the same four
 * pillars on every page.
 *
 * Server component (no client-side interactivity).
 */

import Link from "next/link";
import {
  DATA_NERD_NAME,
  DATA_NERD_ARCHETYPE,
  DATA_NERD_POLARITY,
  DATA_NERD_PARABLES,
  DATA_NERD_CATCHPHRASES,
} from "@/lib/data-nerd";

interface Props {
  /** Stable seed string — typically the page slug. Determines which slice is shown. */
  seed: string;
  className?: string;
  /** Hide the parable teaser if the page already deep-links to one. */
  showParable?: boolean;
}

// Deterministic small-string hash so the same seed always picks the same
// slice. Not cryptographic — just stable rotation across surfaces.
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function DataNerdCharacterCard({
  seed,
  className = "",
  showParable = true,
}: Props) {
  const polarity =
    DATA_NERD_POLARITY[hash(seed + "p") % DATA_NERD_POLARITY.length];
  const parable =
    DATA_NERD_PARABLES[hash(seed + "b") % DATA_NERD_PARABLES.length];
  const catchphrase =
    DATA_NERD_CATCHPHRASES[hash(seed + "c") % DATA_NERD_CATCHPHRASES.length];

  return (
    <aside
      className={`rounded-xl border border-amber-700/30 bg-gradient-to-br from-amber-950/15 via-slate-900 to-slate-950 p-5 sm:p-6 space-y-4 ${className}`}
      aria-label={`Who's writing this — ${DATA_NERD_NAME}`}
    >
      <header className="space-y-1.5">
        <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
          Who&rsquo;s writing this
        </p>
        <p className="text-gray-100 text-base font-semibold leading-snug">
          <Link
            href="/data-nerd"
            className="hover:text-amber-200 underline decoration-dotted"
          >
            {DATA_NERD_NAME}
          </Link>{" "}
          ·{" "}
          <span className="text-amber-300">
            {DATA_NERD_ARCHETYPE.label}
          </span>
        </p>
        <p className="text-gray-400 text-sm leading-relaxed italic">
          &ldquo;{catchphrase}&rdquo;
        </p>
      </header>

      <div className="border-t border-slate-800 pt-3 space-y-2">
        <p className="text-emerald-300 text-[10px] font-semibold uppercase tracking-wider">
          One belief
        </p>
        <p className="text-gray-200 text-sm leading-relaxed">
          <strong className="text-emerald-300">For:</strong> {polarity.for}
        </p>
        <p className="text-gray-400 text-sm leading-relaxed">
          {polarity.body}
        </p>
      </div>

      {showParable ? (
        <div className="border-t border-slate-800 pt-3 space-y-2">
          <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
            One parable
          </p>
          <p className="text-gray-200 text-sm font-semibold leading-snug">
            <Link
              href={`/parables/${parable.slug}`}
              className="hover:text-amber-200 underline decoration-dotted"
            >
              {parable.title} →
            </Link>
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            {parable.lesson}
          </p>
        </div>
      ) : null}

      <div className="border-t border-slate-800 pt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        <Link
          href="/data-nerd"
          className="text-amber-300 hover:text-amber-200 underline decoration-dotted font-semibold"
        >
          Character bible
        </Link>
        <Link
          href="/now"
          className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted font-semibold"
        >
          /now
        </Link>
        <Link
          href="/parables"
          className="text-amber-300 hover:text-amber-200 underline decoration-dotted font-semibold"
        >
          All 6 parables
        </Link>
        <Link
          href="/manifesto"
          className="text-rose-300 hover:text-rose-200 underline decoration-dotted font-semibold"
        >
          Manifesto
        </Link>
      </div>
    </aside>
  );
}

export default DataNerdCharacterCard;
