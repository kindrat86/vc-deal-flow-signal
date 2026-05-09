/**
 * DataNerdPolarityCard — 4-pillar polarity teaser.
 *
 * Brunson DCS Ch 7 + Expert Secrets Ch 5 (Cult-ure): the Attractive Character
 * polarizes. The reader has to know within ~10 seconds whether they agree.
 * This card shows the four polarities in tight "for / against" pairs so the
 * reader self-qualifies before they hit the conversion path.
 */

import Link from "next/link";
import { DATA_NERD_POLARITY, DATA_NERD_NAME } from "@/lib/data-nerd";

interface Props {
  className?: string;
  showLink?: boolean;
}

export function DataNerdPolarityCard({
  className = "",
  showLink = true,
}: Props) {
  return (
    <section
      className={`rounded-xl border border-amber-700/30 bg-gradient-to-br from-amber-950/15 via-slate-900 to-slate-950 p-6 sm:p-8 ${className}`}
      aria-label={`What ${DATA_NERD_NAME} believes`}
    >
      <header className="space-y-2 mb-5">
        <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
          What {DATA_NERD_NAME} believes
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
          Four polarities. If you nod through them, you&rsquo;re my reader.
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          The founder character has to take a side. These are mine. If any
          of them feels wrong, this product is probably wrong for you and
          that&rsquo;s honest.
        </p>
      </header>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DATA_NERD_POLARITY.map((p) => (
          <li
            key={p.n}
            className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 space-y-2"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-amber-300 font-bold tabular-nums shrink-0 text-sm">
                {p.n}.
              </span>
              <p className="text-emerald-300 text-sm font-bold leading-snug">
                For: {p.for}
              </p>
            </div>
            <p className="text-rose-300 text-xs font-semibold leading-snug pl-5">
              Against: {p.against}
            </p>
            <p className="text-gray-400 text-xs leading-relaxed pl-5">
              {p.body}
            </p>
          </li>
        ))}
      </ul>

      {showLink && (
        <p className="text-xs text-gray-400 leading-relaxed pt-5 mt-5 border-t border-slate-800">
          More on the character behind the methodology —{" "}
          <Link
            href="/data-nerd"
            className="text-amber-300 hover:text-amber-200 underline decoration-dotted font-semibold"
          >
            the {DATA_NERD_NAME} character bible
          </Link>{" "}
          (parables, voice rules, where you&rsquo;ll meet me).
        </p>
      )}
    </section>
  );
}

export default DataNerdPolarityCard;
