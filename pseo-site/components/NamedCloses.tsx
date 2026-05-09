/**
 * Brunson Expert Secrets §3 Ch 13 — The Stack and the Closes.
 *
 * Russell teaches that high-ticket offers need at least three differentiated
 * close patterns landing in sequence:
 *
 *   1. Money close — "the price isn't the cost. The cost is the deal you miss."
 *   2. Identity close — "this is for the person who already is X, not the one
 *       trying to become X."
 *   3. Urgency close — "the window isn't the discount. The window is the cap."
 *
 * /walkthrough already ships the four-close stack (Money / Identity / Pricing /
 * Urgency). /apply and /sector-sweep had several scattered TrialClose blocks
 * but never the named, formally-stacked three closes. This component fills
 * that gap as a single self-contained block both pages can import.
 *
 * Anonymity rule applies: no founder face, no founder voice. Customer copy
 * uses plain English. The Brunson framework name is in this comment, never
 * on the rendered page.
 */

interface CloseLine {
  readonly kind: "money" | "identity" | "urgency";
  readonly tag: string;
  readonly question: string;
  readonly answer: string;
}

interface Props {
  readonly variant?: "default" | "compact";
  readonly closes: readonly [CloseLine, CloseLine, CloseLine];
}

const TONE_BY_KIND: Record<
  CloseLine["kind"],
  { eyebrow: string; border: string; bg: string }
> = {
  money: {
    eyebrow: "text-emerald-400",
    border: "border-emerald-700/40",
    bg: "bg-emerald-950/10",
  },
  identity: {
    eyebrow: "text-sky-400",
    border: "border-sky-700/40",
    bg: "bg-sky-950/10",
  },
  urgency: {
    eyebrow: "text-rose-400",
    border: "border-rose-700/40",
    bg: "bg-rose-950/10",
  },
};

const KIND_LABEL: Record<CloseLine["kind"], string> = {
  money: "If it's a money question",
  identity: "If it's an identity question",
  urgency: "If it's a timing question",
};

export function NamedCloses({ variant = "default", closes }: Props) {
  const isCompact = variant === "compact";

  return (
    <section
      aria-label="Three reasons people buy at this rung"
      className={
        isCompact
          ? "space-y-3"
          : "rounded-xl border border-slate-800 bg-slate-900/30 p-6 sm:p-8 space-y-5"
      }
    >
      {!isCompact ? (
        <header className="space-y-1">
          <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
            Three reasons people buy at this rung
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
            One of these is yours.
          </h2>
        </header>
      ) : null}

      <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {closes.map((c) => {
          const tone = TONE_BY_KIND[c.kind];
          return (
            <li
              key={c.kind}
              className={`rounded-lg border ${tone.border} ${tone.bg} p-4 sm:p-5 space-y-2`}
            >
              <p
                className={`${tone.eyebrow} text-[10px] font-semibold uppercase tracking-wider`}
              >
                {KIND_LABEL[c.kind]}
              </p>
              <h3 className="text-gray-100 font-semibold text-sm sm:text-base leading-snug">
                {c.question}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                <span className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mr-2">
                  {c.tag}
                </span>
                {c.answer}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
