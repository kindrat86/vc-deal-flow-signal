/**
 * ThirtyDayQuickstart, Brunson Expert Secrets Ch 22 (Decade in a Day /
 * Fast Implementation).
 *
 * Audit 2026-05-09 verdict (Ch 22, score 92/100):
 *   "Could add a more visible '30-day quickstart' CTA on the page itself."
 *
 * /decade-in-a-day teaches a 12-module curriculum but the buyer's takeaway
 * was just "pick one module and live in it for a week", too soft. Brunson's
 * Decade-in-a-Day chapter is explicit: the reader needs a literal calendar,
 * not an aspiration. This component delivers it: 30 dated beats, day-by-week,
 * tied to the existing modules, with a single CTA at the bottom.
 *
 * Server Component, pure presentation. Wires into /decade-in-a-day below
 * the module list, replacing the soft "What to do tomorrow" block.
 *
 * The 30 days are calendar-relative (Day 1 = the day the reader lands), not
 * absolute dates, this lets the same component work for every visitor
 * without a stale "Jan 12" timestamp.
 */

import Link from "next/link";

interface DayBeat {
  /** Day number 1-30. */
  day: number;
  /** Estimated minutes for this beat. */
  min: number;
  /** Imperative action title. */
  action: string;
  /** What changes after the action. */
  outcome: string;
  /** Linked surface where the action happens. */
  href?: string;
}

const WEEK1_FOUNDATION: DayBeat[] = [
  { day: 1, min: 7, action: "Take the avatar quiz.", outcome: "You name the buyer you actually are, Operator, Capital, or Curator.", href: "/quiz" },
  { day: 2, min: 10, action: "Read the manifesto end-to-end.", outcome: "You can recite the Enemy ('warm-intro roulette') from memory.", href: "/manifesto" },
  { day: 3, min: 15, action: "Read /methodology and click through to the SSRN paper abstract.", outcome: "You know the IQR (21-47 days) and can defend the n=219 panel size.", href: "/methodology" },
  { day: 4, min: 8, action: "Install the free MCP server in your IDE.", outcome: "Five free read-only tools live inside your daily Cursor/Claude session.", href: "/install" },
  { day: 5, min: 10, action: "Run the Sunday Acceleration Watch through the MCP.", outcome: "You see 10 ranked startups before the public dashboard renders them.", href: "/predicted" },
  { day: 6, min: 5, action: "Open /target-list and pick the three GPs whose feeds you'll watch.", outcome: "Your Dream-100 starts at three names, Brunson rule, no shortcut.", href: "/target-list" },
  { day: 7, min: 12, action: "Write a one-paragraph thesis statement using the Conversion Story template.", outcome: "Old way → new vehicle → external → internal → frameworks. Your own version, in your own ICP.", href: "/walkthrough#conversion-story" },
];

const WEEK2_TEST: DayBeat[] = [
  { day: 8, min: 7, action: "Buy the €7 First Look Pass for the sector closest to your active checks.", outcome: "You have a deep-dive PDF + CSV in your inbox by Day 9.", href: "/firstlook" },
  { day: 9, min: 20, action: "Read the First Look brief during one working session.", outcome: "Three pre-Crunchbase breakouts named, see if you'd have written a check on any of them six months ago.", href: "/firstlook" },
  { day: 10, min: 5, action: "Reply to the delivery email with your verdict (one sentence).", outcome: "You join the buyer-side feedback loop. We use it to calibrate next month's brief.", href: "/firstlook" },
  { day: 11, min: 10, action: "Open the Sunday Seinfeld digest. Read the Wednesday Data Nerd Brief.", outcome: "You feel the cadence, what twice-weekly contact looks like inside your inbox.", href: "/data-nerd" },
  { day: 12, min: 8, action: "Subscribe to the free Acceleration Watch (separate from the digest).", outcome: "Mondays 09:00 UTC: 10 named startups land in your inbox before the public web sees them.", href: "/" },
  { day: 13, min: 6, action: "Forward one digest to a peer with the line: 'curious if you'd have known these.'", outcome: "Earned distribution. The peer either replies or doesn't, both are signal.", href: "/distribution" },
  { day: 14, min: 15, action: "Compare your Day 9 verdict against the public scorecard at T+30 (when it grades).", outcome: "You verify the 21-47 day claim against your own brief. Either it stands or it doesn't, for you.", href: "/scorecard" },
];

const WEEK3_DECIDE: DayBeat[] = [
  { day: 15, min: 12, action: "Read /pricing top-to-bottom. Note which tier matches your check cadence.", outcome: "Operator → Dashboard. Capital → Insider or Sharp. Curator → Sector Sweep.", href: "/pricing" },
  { day: 16, min: 8, action: "Read the Risk Reversal card on the matching tier's page.", outcome: "You can recite the 30-day Signal-or-It's-Free guarantee in your own words.", href: "/pricing#guarantee" },
  { day: 17, min: 10, action: "Open /walkthrough and read the Stack Slide.", outcome: "You see eight items totalling €1,728/yr against a €119.64/yr lock-in price. The 14× anchor lands.", href: "/walkthrough" },
  { day: 18, min: 6, action: "Read /experiments, pick the one test result you find most damaging to our claim.", outcome: "You earn skepticism, not assume it. The most damaging finding is publicly logged.", href: "/experiments" },
  { day: 19, min: 5, action: "Skim /predict, call one Series-A bet on the leaderboard.", outcome: "You stake a public position. Free.", href: "/predict" },
  { day: 20, min: 7, action: "Read /receipts, paste your GitHub username.", outcome: "You see which historical unicorns you starred early. Memory, made falsifiable.", href: "/receipts" },
  { day: 21, min: 15, action: "Decide: Dashboard, Insider, or wait. The €7 credits 1:1 if you upgrade by Day 21.", outcome: "Your first recurring cheque inside the system. The founding rate locks to today.", href: "/pricing" },
];

const WEEK4_OPERATIONALIZE: DayBeat[] = [
  { day: 22, min: 25, action: "Set a Monday calendar block: 'Acceleration Watch read, 25 min.'", outcome: "The cadence becomes a kept habit, not an aspirational one. Brunson rule: the cadence is the product.", href: "/" },
  { day: 23, min: 15, action: "Set a Wednesday calendar block: 'Filter, five startups to research deeper.'", outcome: "Two-pass workflow: discover Monday, filter Wednesday, decide Friday.", href: "/predicted" },
  { day: 24, min: 20, action: "Pick one company from this week's Watch. Open its GitHub, read the contributor graph.", outcome: "You read commit graphs the way SEC filings get read. Internal-shift practice.", href: "/methodology" },
  { day: 25, min: 10, action: "Reply to one digest with a thesis disagreement. Substantive, not snarky.", outcome: "Two-way relationship with the dataset. The reply makes you a participant, not a consumer." },
  { day: 26, min: 30, action: "Read one /answers entry on a buyer-objection you privately still hold.", outcome: "False belief named, externally addressed. Brunson Ch 13.", href: "/answers" },
  { day: 27, min: 12, action: "Forward your Day 21 decision to one peer. Ask if they'd have made the same call.", outcome: "Ascension behaviour, you become the carrier of the signal in your own network.", href: "/distribution" },
  { day: 28, min: 20, action: "End-of-month review: which Day-1-to-30 beats actually changed how you source?", outcome: "The honest answer is the only one that matters. Skipping this beat is how the curriculum stops working." },
  { day: 29, min: 8, action: "If the cadence didn't earn its place, reply REFUND. Full refund inside two business days.", outcome: "You owed it to yourself to test, not to commit. The guarantee exists for exactly this beat.", href: "/pricing#guarantee" },
  { day: 30, min: 15, action: "If the cadence did earn its place, schedule Month 2's Sunday read in your calendar.", outcome: "Months 2-12: same beat, lower friction. The decade compresses because the cadence is locked." },
];

const ALL_BEATS = [...WEEK1_FOUNDATION, ...WEEK2_TEST, ...WEEK3_DECIDE, ...WEEK4_OPERATIONALIZE];

const TOTAL_MIN = ALL_BEATS.reduce((s, b) => s + b.min, 0);

interface WeekBlock {
  label: string;
  intent: string;
  beats: DayBeat[];
  accent: string;
}

const WEEKS: WeekBlock[] = [
  {
    label: "Week 1 · Foundation",
    intent: "Name the buyer you are. Read the methodology. Wire the free tools.",
    beats: WEEK1_FOUNDATION,
    accent: "violet",
  },
  {
    label: "Week 2 · Test",
    intent: "Spend €7. Earn skepticism on your own thesis. Verify against scorecard.",
    beats: WEEK2_TEST,
    accent: "sky",
  },
  {
    label: "Week 3 · Decide",
    intent: "Compare tiers against your check cadence. Use the credit. Stake a public bet.",
    beats: WEEK3_DECIDE,
    accent: "amber",
  },
  {
    label: "Week 4 · Operationalize",
    intent: "Lock the cadence. Or refund. Either is a Day-30 win.",
    beats: WEEK4_OPERATIONALIZE,
    accent: "emerald",
  },
];

const ACCENT_CLASSES: Record<string, { border: string; text: string; bg: string }> = {
  violet: { border: "border-violet-700/40", text: "text-violet-300", bg: "bg-violet-950/20" },
  sky: { border: "border-sky-700/40", text: "text-sky-300", bg: "bg-sky-950/20" },
  amber: { border: "border-amber-700/40", text: "text-amber-300", bg: "bg-amber-950/20" },
  emerald: { border: "border-emerald-700/40", text: "text-emerald-300", bg: "bg-emerald-950/20" },
};

export function ThirtyDayQuickstart() {
  return (
    <section
      id="quickstart-30"
      aria-label="30-day quickstart roadmap"
      className="space-y-6"
    >
      <header className="space-y-3">
        <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          30-day quickstart · {ALL_BEATS.length} dated beats · {Math.round(TOTAL_MIN / 60)}h total
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-tight">
          Don&rsquo;t pick one module. Run the literal 30-day plan.
        </h2>
        <p className="text-gray-300 text-base leading-relaxed">
          The curriculum compresses a decade. The quickstart compresses the
          curriculum into a calendar. Day 1 is the day you read this; Day 30
          is the day you either lock the cadence or hit refund. Both are
          wins, the only failure mode is opening this page and doing
          nothing.
        </p>
      </header>

      <div className="space-y-5">
        {WEEKS.map((wk) => {
          const a = ACCENT_CLASSES[wk.accent]!;
          return (
            <article
              key={wk.label}
              className={`rounded-xl border ${a.border} ${a.bg} p-5 sm:p-6 space-y-4`}
            >
              <header className="space-y-1">
                <p className={`${a.text} text-xs font-semibold uppercase tracking-wider`}>
                  {wk.label}
                </p>
                <p className="text-gray-200 text-sm leading-relaxed italic">
                  {wk.intent}
                </p>
              </header>
              <ol className="space-y-2">
                {wk.beats.map((b) => (
                  <li
                    key={b.day}
                    className="flex items-start gap-3 rounded-md border border-slate-800/60 bg-slate-900/40 px-3 py-2.5"
                  >
                    <span
                      aria-hidden="true"
                      className={`shrink-0 w-10 h-10 rounded-md ${a.bg} border ${a.border} ${a.text} text-xs font-bold flex flex-col items-center justify-center leading-none`}
                    >
                      <span className="text-[9px] opacity-70">DAY</span>
                      <span className="text-base">{b.day}</span>
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-3 flex-wrap">
                        <p className="text-gray-100 font-semibold text-sm">
                          {b.href ? (
                            <Link
                              href={b.href}
                              className="hover:underline decoration-dotted underline-offset-2"
                            >
                              {b.action}
                            </Link>
                          ) : (
                            b.action
                          )}
                        </p>
                        <p className="text-gray-500 text-[10px] uppercase tracking-wider whitespace-nowrap">
                          {b.min} min
                        </p>
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed mt-0.5">
                        {b.outcome}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          );
        })}
      </div>

      <footer className="rounded-xl border border-emerald-700/40 bg-emerald-950/20 p-5 sm:p-6 space-y-3">
        <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          Day 1 starts the day you click
        </p>
        <p className="text-gray-200 text-base leading-relaxed">
          The plan is calendar-relative. There is no &ldquo;next cohort&rdquo;
          to wait for. The quickstart presupposes the free tier, runs through
          one €7 spend, and resolves on Day 30 with either a locked recurring
          tier or a refund. Both are calibrated outcomes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors"
          >
            Day 1 · Take the avatar quiz →
          </Link>
          <Link
            href="/install"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
          >
            Or skip to Day 4 · Install the MCP
          </Link>
        </div>
      </footer>
    </section>
  );
}
