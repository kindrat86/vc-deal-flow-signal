import Link from "next/link";

// Brunson Expert Secrets Ch 7 + Ch 9, the Epiphany Bridge Script
// reduced to the 5-step shift. Russell-Brunson HSO audit 2026-05-08
// flagged that the full Hero's Two Journeys lives on /origin (8-min
// read) but the home page never surfaces the bridge for the reader
// who won't click a sub-page. This component fixes that, the same
// 5-step pattern, in 5 short pills, above the fold.
//
// Step labels mirror Brunson's canonical sequence:
//   Backstory -> Desire -> External Struggle -> Internal Shift -> New Opportunity
//
// Copy is sourced from /origin (sections 01-06) and the Day 3.5 email
// in lib/emails.ts so the language is consistent across surfaces.
//
// Russell audit V11 2026-05-09, Ch 7 Epiphany Bridge scored 96/100
// with the note: "the home version is condensed, the bridge works
// best when you walk the reader emotionally, not just enumerate. Let
// the home version breathe one more sentence per pill." Each pill now
// carries (a) the headline beat (existing line) plus (b) a second
// sentence with sensory / situational / numerical detail so the bridge
// loads as a mental movie, not as a checklist. Voice rules from
// lib/data-nerd.ts: specific over general, code metaphors over
// business metaphors, number-then-claim, admit-what-we-don't-know.
// Layout unchanged, the existing one-paragraph shape per pill
// accommodates the longer body without grid changes.

type StepColor = "amber" | "rose" | "emerald";

type Step = {
  readonly n: 1 | 2 | 3 | 4 | 5;
  readonly color: StepColor;
  readonly title: string;
  readonly body: string;
};

const STEPS: readonly Step[] = [
  {
    n: 1,
    color: "amber",
    title: "Backstory",
    body: "Ten years writing €5k-€50k angel cheques through warm intros, Athens, not San Francisco. Most mornings looked the same: laptop open, three Substack tabs, the WhatsApp group where deals showed up about a week after they had already closed.",
  },
  {
    n: 2,
    color: "amber",
    title: "Desire",
    body: "Be the first investor in the room. Not the third one shown the deck. The first cheque earns the founder remembering you when the round oversubscribes; the third cheque is a wire transfer with no memory attached.",
  },
  {
    n: 3,
    color: "rose",
    title: "External wall",
    body: "By the time a deck reached me through any warm intro, three other investors were already in. I told myself it was geography, network seniority, conference attendance, every explanation I could find that did not force me to change my method.",
  },
  {
    n: 4,
    color: "rose",
    title: "Internal shift",
    body: "Stopped networking. Started reading commit graphs the way quants read SEC filings. Same public data everyone else had, a lens almost nobody was using, and that asymmetry, not a better rolodex, turned out to be the whole opportunity.",
  },
  {
    n: 5,
    color: "emerald",
    title: "New opportunity",
    body: "Code-side acceleration leads the deck by 21-47 days. The data is public. The lens was missing. Twenty-one to forty-seven days is the window where one Tuesday morning email lands in a founder's inbox before any other investor in any rolodex has the company on their radar.",
  },
] as const;

const COLOR_CLASSES: Record<
  StepColor,
  { dot: string; pill: string; ring: string }
> = {
  amber: {
    dot: "bg-amber-500",
    pill: "text-amber-300 border-amber-700/40 bg-amber-950/30",
    ring: "border-amber-700/30",
  },
  rose: {
    dot: "bg-rose-500",
    pill: "text-rose-300 border-rose-700/40 bg-rose-950/30",
    ring: "border-rose-700/30",
  },
  emerald: {
    dot: "bg-emerald-500",
    pill: "text-emerald-300 border-emerald-700/40 bg-emerald-950/30",
    ring: "border-emerald-700/30",
  },
};

export default function EpiphanyBridgeCondensed() {
  return (
    <section
      aria-label="The 5-step shift behind GitDealFlow"
      className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-5 sm:p-6"
    >
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
        <div>
          <p className="text-sky-400 text-[11px] uppercase tracking-wider font-semibold">
            The 5-step shift &middot; The discovery moment
          </p>
          <h2 className="text-gray-100 font-semibold text-base sm:text-lg mt-1 leading-snug">
            How a late story became an earlier signal.
          </h2>
        </div>
        <Link
          href="/origin"
          className="text-xs text-gray-400 hover:text-sky-300 underline decoration-dotted whitespace-nowrap"
        >
          Long version (8-min read) &rarr;
        </Link>
      </div>
      <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {STEPS.map((s) => {
          const c = COLOR_CLASSES[s.color];
          return (
            <li
              key={s.n}
              className={`rounded-lg border ${c.ring} bg-slate-950/40 p-3 space-y-2`}
            >
              <div
                className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${c.pill}`}
              >
                <span
                  aria-hidden
                  className={`w-1.5 h-1.5 rounded-full ${c.dot}`}
                />
                Step {s.n} &middot; {s.title}
              </div>
              <p className="text-gray-300 text-xs sm:text-sm leading-snug">
                {s.body}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
