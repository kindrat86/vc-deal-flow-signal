import Link from "next/link";

// Brunson DotCom Secrets Ch 12 + Expert Secrets Ch 13, the Stack Slide.
// Russell-Brunson HSO audit 2026-05-08 flagged that the full priced
// stack lives on /firstlook (VALUE_STACK) and /walkthrough
// (STACK_ITEMS) but never on the home page. Most traffic never gets
// to those sub-pages. The Brunson rule: the stack belongs at the
// buying moment, not one click away.
//
// Numbers mirror /walkthrough STACK_ITEMS so the anchor is
// consistent across every surface a reader might compare against.

type StackLine = {
  readonly label: string;
  readonly anchor: string;
  readonly priced: number; // 0 = bonus / open / bundled, excluded from total
};

const STACK: readonly StackLine[] = [
  {
    label: "Live Dashboard, 400+ ranked orgs, refreshed Mondays 06:00 UTC",
    anchor: "€348 / yr",
    priced: 348,
  },
  {
    label: "219-Startup Backtest CSV, the full SSRN panel, five quarters",
    anchor: "€297 once",
    priced: 297,
  },
  {
    label: "Monthly Sector Deep-Dive PDF, 12 issues per year, your sector",
    anchor: "€588 / yr",
    priced: 588,
  },
  {
    label: "Two Free Chrome Extensions, Crunchbase badge + VC GitHub Lookup",
    anchor: "€198 / yr value",
    priced: 198,
  },
  {
    label: "Async Watchlist Build, 10 orgs matching your written thesis",
    anchor: "€297 once",
    priced: 297,
  },
  {
    label: "Free MCP Server, 6 tools inside Claude / Cursor / Windsurf",
    anchor: "Bundled, never gated",
    priced: 0,
  },
  {
    label: "Methodology Vault, SSRN preprint + regression code, CC BY 4.0",
    anchor: "Open by default",
    priced: 0,
  },
  {
    label: "30-Day Signal-or-It's-Free Guarantee, reply REFUND, no clawback",
    anchor: "Risk-reversal bonus",
    priced: 0,
  },
] as const;

const PRICED_TOTAL = STACK.reduce((sum, item) => sum + item.priced, 0);

export default function HomeOfferStack() {
  return (
    <section
      aria-label="What 49 EUR per month unlocks, the priced stack"
      className="rounded-2xl border border-emerald-700/40 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 p-6 sm:p-8"
    >
      <div className="max-w-3xl">
        <p className="text-emerald-300 text-[11px] uppercase tracking-wider font-semibold mb-2">
          The stack &middot; Founding-member rate
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-3 leading-tight tracking-tight">
          €{PRICED_TOTAL.toLocaleString()} of priced artefacts.{" "}
          <span className="text-emerald-400">
            €9.97 / month, locked forever.
          </span>
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mb-6 leading-relaxed">
          Each line is anchored against what the same artefact costs elsewhere
Pitchbook for the dashboard tier, McKinsey-grade for the deep
          dives, hand-built for the watchlist. The total below is what a fund
          would spend assembling each piece standalone. The founding
          rate is what you pay once to lock the whole stack
          in before the public price hike.
        </p>
        <ul className="space-y-1 mb-6">
          {STACK.map((item) => (
            <li
              key={item.label}
              className="flex items-start justify-between gap-3 py-2.5 border-b border-slate-800 last:border-0"
            >
              <span className="text-gray-200 text-sm leading-snug flex-1">
                <span aria-hidden className="text-emerald-400 mr-1.5">
                  &#10003;
                </span>
                {item.label}
              </span>
              <span className="text-gray-400 text-xs sm:text-sm tabular-nums whitespace-nowrap shrink-0">
                {item.anchor}
              </span>
            </li>
          ))}
        </ul>
        <dl className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-4 border-t-2 border-emerald-700/40 mb-6">
          <div className="flex items-baseline justify-between sm:justify-start gap-3 sm:flex-1">
            <dt className="text-gray-400 text-sm">Total priced value</dt>
            <dd className="text-gray-300 text-base sm:text-lg font-semibold tabular-nums line-through decoration-rose-500/50">
              €{PRICED_TOTAL.toLocaleString()}
            </dd>
          </div>
          <div className="flex items-baseline justify-between sm:justify-end gap-3 sm:flex-1">
            <dt className="text-emerald-300 text-sm font-semibold">
              You pay
            </dt>
            <dd className="text-emerald-300 text-2xl sm:text-3xl font-bold tabular-nums">
              €49
              <span className="text-emerald-400/70 text-sm font-normal">
                /mo
              </span>
            </dd>
          </div>
        </dl>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/walkthrough"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 text-sm font-semibold transition-colors shadow-sm shadow-emerald-500/20"
          >
            See the full pitch (12-min) &rarr;
          </Link>
          <Link
            href="/firstlook"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-600/50 hover:border-amber-500 hover:bg-amber-950/20 text-amber-300 hover:text-amber-200 px-5 py-3 text-sm font-semibold transition-colors"
          >
            Or test on your sector for €7 &rarr;
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg text-gray-400 hover:text-gray-200 px-3 py-3 text-sm font-medium transition-colors"
          >
            All 6 tiers &rarr;
          </Link>
        </div>
        <p className="mt-4 text-[11px] text-gray-500 leading-relaxed">
          Founding rate locked for the lifetime of your subscription. Public
          rate will rise to €49 / month once the founding cohort closes.
          Cancel anytime, guarantee covers the first 30 days, no questions.
        </p>
      </div>
    </section>
  );
}
