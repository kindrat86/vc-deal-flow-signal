import Link from "next/link";
import { ARCHETYPES, type Archetype } from "@/content/archetypes";

/**
 * Three compact archetype cards. Used on the homepage above the FOR/NOT-FOR
 * section and on /about as a "who we built for" callout. Each card links to
 * /who-this-is-for#<id> for the full archetype profile, plus a direct CTA to
 * the entry tier so a confident buyer can skip the hub page.
 *
 * Audit 2026-05-09 (Brunson Traffic Secrets Ch 1 split): replaces the single
 * "developer-investor" composite with three named buying motions. Internal
 * source: brunson/08-dream-customer.md §8.
 */

const ACCENT_CLASSES: Record<
  Archetype["accent"],
  {
    border: string;
    chip: string;
    underline: string;
    cta: string;
    secondary: string;
    ring: string;
  }
> = {
  sky: {
    border:
      "border-sky-500/30 bg-gradient-to-br from-sky-950/40 via-sky-950/10 to-transparent hover:border-sky-400/50",
    chip: "bg-sky-500/15 text-sky-300 ring-sky-400/30",
    underline: "decoration-sky-400/40 hover:decoration-sky-300",
    cta: "bg-sky-600 hover:bg-sky-500 text-white shadow-sky-500/30",
    secondary:
      "border-sky-700/50 bg-sky-950/30 hover:bg-sky-900/40 text-sky-100",
    ring: "ring-sky-400/30",
  },
  amber: {
    border:
      "border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-amber-950/10 to-transparent hover:border-amber-400/50",
    chip: "bg-amber-500/15 text-amber-300 ring-amber-400/30",
    underline: "decoration-amber-400/40 hover:decoration-amber-300",
    cta: "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30",
    secondary:
      "border-amber-700/50 bg-amber-950/30 hover:bg-amber-900/40 text-amber-100",
    ring: "ring-amber-400/30",
  },
  emerald: {
    border:
      "border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-emerald-950/10 to-transparent hover:border-emerald-400/50",
    chip: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
    underline: "decoration-emerald-400/40 hover:decoration-emerald-300",
    cta: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/30",
    secondary:
      "border-emerald-700/50 bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-100",
    ring: "ring-emerald-400/30",
  },
};

interface Props {
  /**
   * Header eyebrow text shown above the cards. Default suits homepage; the
   * /about page uses a slightly different framing.
   */
  eyebrow?: string;
  /**
   * Optional kicker headline. If omitted, no headline is rendered (the parent
   * provides one — common for the homepage).
   */
  headline?: string;
  /**
   * Optional sub-copy under the headline.
   */
  intro?: string;
  /**
   * Whether to render a "see full archetype profiles" link at the bottom.
   * Default true. Disable on /who-this-is-for itself to avoid recursive linking.
   */
  showHubLink?: boolean;
}

export default function ArchetypeCardsPreview({
  eyebrow = "Three readers we built for",
  headline,
  intro,
  showHubLink = true,
}: Props) {
  return (
    <section
      aria-label="Reader archetypes"
      className="my-12 space-y-6"
    >
      {(eyebrow || headline || intro) && (
        <div className="space-y-2.5">
          {eyebrow && (
            <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em]">
              {eyebrow}
            </p>
          )}
          {headline && (
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
              {headline}
            </h2>
          )}
          {intro && (
            <p className="text-gray-300 text-base leading-relaxed max-w-3xl">
              {intro}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {ARCHETYPES.map((arch) => {
          const accent = ACCENT_CLASSES[arch.accent];
          return (
            <article
              key={arch.id}
              className={`group relative flex flex-col gap-4 overflow-hidden rounded-2xl border p-6 transition-colors ${accent.border}`}
            >
              <div className="space-y-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ring-1 ${accent.chip}`}
                >
                  {arch.shortLabel}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-gray-100 leading-snug">
                  {arch.label}
                </h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {arch.oneLiner}
              </p>
              <div className="space-y-1.5 border-t border-slate-800/80 pt-3 text-xs text-gray-400">
                <p className="font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Entry tier
                </p>
                <p className="text-gray-200">
                  <span className="font-semibold">{arch.entryTier.name}</span>{" "}
                  <span className="text-gray-500">·</span>{" "}
                  <span className="text-gray-300">{arch.entryTier.price}</span>
                </p>
              </div>
              <div className="mt-auto flex flex-col gap-2 pt-2">
                {arch.entryCta.external ? (
                  <a
                    href={arch.entryCta.href}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold shadow-lg transition-colors ${accent.cta}`}
                  >
                    {arch.entryCta.label}{" "}
                    <span aria-hidden="true">→</span>
                  </a>
                ) : (
                  <Link
                    href={arch.entryCta.href}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold shadow-lg transition-colors ${accent.cta}`}
                  >
                    {arch.entryCta.label}{" "}
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
                <Link
                  href={`/who-this-is-for#${arch.id}`}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-medium transition-colors ${accent.secondary}`}
                >
                  See the full profile
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {showHubLink && (
        <p className="text-gray-400 text-sm leading-relaxed">
          Not sure which one fits?{" "}
          <Link
            href="/quiz"
            className="text-sky-300 underline decoration-sky-400/40 decoration-dotted underline-offset-[3px] hover:text-sky-200 hover:decoration-sky-300"
          >
            The 90-second avatar quiz
          </Link>{" "}
          asks five questions and routes you to the right tier — and the right
          archetype profile. Or read{" "}
          <Link
            href="/who-this-is-for"
            className="text-sky-300 underline decoration-sky-400/40 decoration-dotted underline-offset-[3px] hover:text-sky-200 hover:decoration-sky-300"
          >
            all three profiles side-by-side
          </Link>
          .
        </p>
      )}
    </section>
  );
}
