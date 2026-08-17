/**
 * Quotable definition block, replicated across every pSEO template head
 * (2026-08-19, audit item "quotable/extractable structure 68").
 *
 * Mirrors the [data-direct-answer] block the /answers template already ships,
 * so every indexable template head carries ONE 40-60 word, self-contained,
 * AI-extractable definition: an answer an LLM, Google, or an answer engine
 * can lift verbatim without parsing the rest of the page.
 *
 * Extraction attributes (all three, so every consumer finds it):
 *  - data-direct-answer : the Speakable + snippet anchor (first-match wins)
 *  - data-speakable      : SpeakableSpecification cssSelector target
 *  - data-agent-summary  : agent-mirror / agent-summary extraction target
 */
export default function DefinitionBlock({
  text,
  label = "Direct answer",
}: {
  text: string;
  label?: string;
}) {
  if (!text) return null;
  return (
    <div
      data-direct-answer
      data-speakable="definition"
      data-agent-summary
      className="mb-6 rounded-xl border border-slate-700 bg-slate-900/70 px-5 py-4 sm:px-6 sm:py-5"
    >
      <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider mb-2">
        {label}
      </p>
      <p className="text-gray-100 text-base sm:text-lg leading-relaxed">{text}</p>
    </div>
  );
}
