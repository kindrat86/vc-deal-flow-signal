// Brunson Expert Secrets Ch 14 — Trial Closes. Russell's rule: every 2–3
// paragraphs of a webinar / VSL / sales letter, the speaker drops a
// micro-question that the reader silently answers "yes" to. Each yes is a
// micro-commitment; by the time the close arrives the reader has already
// said yes 6–8 times in their head.
//
// Use sparingly per page (Russell's number: 6–10). Each one MUST be a
// different phrase — repeating "make sense?" eight times reads as a tic.
// Visual treatment: italicized, muted, slight left-rail accent. Not a
// border-clutter banner; a "speaker pause" beat in the typography flow.
//
// Usage:
//   <TrialClose tone="amber">
//     Make sense so far?
//   </TrialClose>
//
// Server-component-safe (no client hooks). Renders as a <p> for natural
// document flow inside articles.

const TONE_CLASSES: Record<string, { rail: string; text: string }> = {
  amber: { rail: "border-amber-500/50", text: "text-amber-300/90" },
  violet: { rail: "border-violet-500/50", text: "text-violet-300/90" },
  cyan: { rail: "border-cyan-500/50", text: "text-cyan-300/90" },
  emerald: { rail: "border-emerald-500/50", text: "text-emerald-300/90" },
  sky: { rail: "border-sky-500/50", text: "text-sky-300/90" },
  rose: { rail: "border-rose-500/50", text: "text-rose-300/90" },
};

export default function TrialClose({
  children,
  tone = "amber",
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONE_CLASSES;
}) {
  const t = TONE_CLASSES[tone] ?? TONE_CLASSES.amber;
  return (
    <p
      role="note"
      aria-label="Trial close"
      className={`my-5 italic text-sm sm:text-base leading-relaxed border-l-2 ${t.rail} ${t.text} pl-4 py-1`}
    >
      <span aria-hidden="true" className="not-italic mr-1.5 opacity-60">
        ↳
      </span>
      {children}
    </p>
  );
}
