/**
 * Brunson Expert Secrets §4 Ch 16+17 — The Setter and the Closer.
 *
 * The async-only setter+closer flow on /apply and /sector-sweep removes a
 * lot of friction (no calendar invite, no live commitment) but introduces
 * a different friction: the buyer doesn't know what the response artefact
 * looks like before they commit time to the brief or application.
 *
 * This component shows a sample 1-page fit assessment in a collapsed
 * <details> element, so the buyer sees the exact shape of what lands in
 * their inbox without needing to submit anything first. It removes the
 * "what will I get back" friction at the moment of decision.
 *
 * Server component. No interactivity required — the native <details>
 * disclosure handles the show/hide and is fully accessible without
 * JavaScript.
 *
 * Internal-only Brunson reference; customer copy uses plain English.
 */

interface Section {
  readonly heading: string;
  readonly body: string;
}

interface Props {
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly sections: readonly Section[];
  readonly footnote: string;
}

export function FitAssessmentPreview({
  eyebrow,
  title,
  subtitle,
  sections,
  footnote,
}: Props) {
  return (
    <section
      aria-label="Sample of what you'll receive"
      className="rounded-xl border border-sky-700/40 bg-sky-950/10 p-6 sm:p-8 space-y-4"
    >
      <header className="space-y-1.5">
        <p className="text-sky-300 text-[11px] font-semibold uppercase tracking-wider">
          {eyebrow}
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
          {title}
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">{subtitle}</p>
      </header>

      <details className="group rounded-lg border border-slate-800 bg-slate-900/40 p-4 sm:p-5 [&>summary::-webkit-details-marker]:hidden">
        <summary className="cursor-pointer list-none flex items-center justify-between gap-3 text-gray-200 text-sm font-medium">
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="text-sky-400 text-base">
              📄
            </span>
            View the sample 1-page reply (anonymised)
          </span>
          <span
            aria-hidden="true"
            className="text-gray-500 text-xs transition-transform group-open:rotate-180"
          >
            ▾
          </span>
        </summary>

        <div className="mt-4 pt-4 border-t border-slate-800 space-y-4">
          <div className="rounded-md bg-slate-950/60 border border-slate-800 p-4 sm:p-5 font-mono text-[13px] text-gray-300 leading-relaxed space-y-3 whitespace-pre-wrap">
            {sections.map((s) => (
              <div key={s.heading} className="space-y-1">
                <p className="text-amber-300 text-[11px] font-semibold uppercase tracking-wider">
                  {s.heading}
                </p>
                <p className="text-gray-300 text-[13px] leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
            <p className="text-gray-500 text-[11px] pt-2 border-t border-slate-800">
              — The Data Nerd
            </p>
          </div>
          <p className="text-gray-500 text-xs leading-relaxed italic">
            {footnote}
          </p>
        </div>
      </details>
    </section>
  );
}
