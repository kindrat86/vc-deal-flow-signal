/**
 * DataNerdSignoff — Reusable Attractive Character bio chip.
 *
 * Drop near the bottom of any conversion-affecting surface so the reader
 * leaves the page knowing whose voice they were just reading. Brunson DCS
 * Ch 7: the Attractive Character is the connective tissue across surfaces;
 * if the reader can't picture the storyteller, the surfaces read as
 * disconnected SEO pages.
 *
 * Variants:
 *   compact — single-line strip, fits below a CTA
 *   default — 4-line card with a polarity hint and link to /data-nerd
 *   long    — adds the medium bio + a catchphrase, used on /manifesto +
 *             /perfect-webinar where the reader has time
 *
 * No founder face/voice anywhere. The "avatar" is a Greek-letter sigma
 * mark — the methodology glyph, not a person.
 */

import Link from "next/link";
import {
  DATA_NERD_NAME,
  DATA_NERD_BIO_SHORT,
  DATA_NERD_BIO_MEDIUM,
  DATA_NERD_CATCHPHRASES,
} from "@/lib/data-nerd";

type Variant = "compact" | "default" | "long";

interface Props {
  variant?: Variant;
  className?: string;
  catchphraseIndex?: number;
}

function Sigil({ size = 48 }: { size?: number }) {
  return (
    <div
      aria-hidden="true"
      className="shrink-0 rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <span className="text-amber-300 font-bold" style={{ fontSize: size * 0.5 }}>
        Σ
      </span>
    </div>
  );
}

export function DataNerdSignoff({
  variant = "default",
  className = "",
  catchphraseIndex,
}: Props) {
  const phrase =
    DATA_NERD_CATCHPHRASES[
      typeof catchphraseIndex === "number"
        ? catchphraseIndex % DATA_NERD_CATCHPHRASES.length
        : 0
    ];

  if (variant === "compact") {
    return (
      <div
        className={`inline-flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs text-gray-400 ${className}`}
      >
        <Sigil size={28} />
        <span>
          Signed{" "}
          <Link
            href="/data-nerd"
            className="text-amber-300 hover:text-amber-200 underline decoration-dotted font-semibold"
          >
            {DATA_NERD_NAME}
          </Link>{" "}
          · pseudonymous narrator · methodology over personality
        </span>
      </div>
    );
  }

  if (variant === "long") {
    return (
      <aside
        className={`rounded-xl border border-amber-700/30 bg-gradient-to-br from-amber-950/15 via-slate-900 to-slate-950 p-6 sm:p-7 ${className}`}
        aria-label={`Author signoff — ${DATA_NERD_NAME}`}
      >
        <div className="flex items-start gap-4">
          <Sigil size={56} />
          <div className="flex-1 space-y-3">
            <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
              Whose voice you were just reading
            </p>
            <h3 className="text-gray-100 font-bold text-lg leading-snug">
              — {DATA_NERD_NAME}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {DATA_NERD_BIO_MEDIUM}
            </p>
            <p className="text-amber-200 text-sm italic leading-relaxed">
              &ldquo;{phrase}&rdquo;
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/data-nerd"
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 hover:text-amber-200 underline decoration-dotted"
              >
                Character bible →
              </Link>
              <Link
                href="/about/founder"
                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-200 underline decoration-dotted"
              >
                Backstory + parables →
              </Link>
              <Link
                href="/manifesto"
                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-200 underline decoration-dotted"
              >
                Manifesto →
              </Link>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 ${className}`}
      aria-label={`Author signoff — ${DATA_NERD_NAME}`}
    >
      <div className="flex items-start gap-4">
        <Sigil />
        <div className="flex-1 space-y-2">
          <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
            Signed
          </p>
          <h3 className="text-gray-100 font-bold text-base">
            — {DATA_NERD_NAME}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {DATA_NERD_BIO_SHORT}
          </p>
          <Link
            href="/data-nerd"
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 hover:text-amber-200 underline decoration-dotted"
          >
            More about who&rsquo;s writing this →
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default DataNerdSignoff;
