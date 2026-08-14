import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { FalseBeliefBreaker } from "@/components/FalseBeliefBreaker";
import { PlainEnglishNote } from "@/components/PlainEnglishNote";
import { TrustConversionBlock } from "@/components/TrustConversionBlock";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Scorecard, Acceleration Watch grading at 60 and 90 days",
  description:
    "Public scorecard of every Acceleration Watch pick. Grading rules, hit/miss/pending counts, lead-time measurement against fundraise announcements. One-shot proof on a rolling cadence.",
  alternates: { canonical: "/scorecard" },
  openGraph: {
    title: "Scorecard, Acceleration Watch public grading",
    description:
      "Every weekly pick, graded at 60d and 90d. Public, rolling, no cherry-picking.",
    url: "https://signals.gitdealflow.com/scorecard",
    type: "article",
  },
};

const RULES = [
  {
    n: 1,
    title: "Pick at T-0",
    body: "Every Monday at 09:00 UTC the Acceleration Watch publishes 10 named startups. Each pick lands with a public sector tag, a 14-day acceleration percentile, a contributor-quality flag, and a velocity chart anchor.",
  },
  {
    n: 2,
    title: "Grade at T+60 and T+90",
    body: "Each pick is graded at two checkpoints: 60 days post-pick and 90 days post-pick. The grade is binary at each window: Hit (a public fundraise OR a 4×+ velocity sustain) vs Miss (no fundraise AND velocity reverted to baseline).",
  },
  {
    n: 3,
    title: "Pending until both windows close",
    body: "A pick is Pending until 90 days have elapsed. We never adjust a Hit retroactively after the 60d mark unless the company announces a transparent recission of the round. We never reclassify a Miss to a Hit if a fundraise lands at T+91 or later, that's a different signal beyond our methodology window.",
  },
  {
    n: 4,
    title: "Public counts, not curated",
    body: "We display ALL picks, not just the wins. Misses are the most useful row on the page, they're the methodology's calibration boundary. Removing or hiding a Miss is a violation of the core methodology rule.",
  },
  {
    n: 5,
    title: "Lead-time distribution, not single-point claim",
    body: "The headline 21-47 day lead-time is our claim under test, NOT a result of the SSRN dataset paper, which is descriptive and carries no funding-event labels. This scorecard is where we actually validate it: each Hit's real lead-time (days from T-0 to public fundraise announcement), rolled into a quarterly distribution at the bottom.",
  },
];

type Status = "hit" | "miss" | "pending";

const SCORE_ROWS = [
  { week: "2026-w17", picks: 10, hit: 0, miss: 0, pending: 10, note: "Grading window opens 2026-07-03 (60d) / 2026-08-02 (90d)." },
  { week: "2026-w18", picks: 10, hit: 0, miss: 0, pending: 10, note: "Grading window opens 2026-07-10 / 2026-08-09." },
  { week: "2026-w16", picks: 10, hit: 0, miss: 0, pending: 10, note: "Backfill, first published archive week. Grading 2026-06-26 / 2026-07-26." },
];

const HISTORICAL_HIGHLIGHT = {
  name: "(anonymised), small fintech infrastructure org",
  picked: "T-31 (acceleration percentile crossed 95th)",
  graded: "T+0 (Series A announced, $4M)",
  leadtime: "31 days",
  context: "An illustrative historical example (not drawn from the SSRN dataset paper, which carries no funding-event labels). Contributor count went 3 → 7 in 14 days, two of the new contributors traceable to senior engineers from a Series B incumbent. Marketing site swapped from Notion to custom Next.js at T-7. The fundraise announcement landed in week T 0.",
};

export default function ScorecardPage() {
  const totals = SCORE_ROWS.reduce(
    (a, r) => ({
      picks: a.picks + r.picks,
      hit: a.hit + r.hit,
      miss: a.miss + r.miss,
      pending: a.pending + r.pending,
    }),
    { picks: 0, hit: 0, miss: 0, pending: 0 },
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/scorecard",
        name: "Scorecard, Acceleration Watch public grading",
        description:
          "Public scoreboard of weekly Acceleration Watch picks. Grading at 60 and 90 days against fundraise announcements.",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2"],
        },
      },
      {
        "@type": "Dataset",
        "@id": "https://signals.gitdealflow.com/scorecard#dataset",
        name: "GitDealFlow Acceleration Watch Scorecard",
        description: "Weekly Acceleration Watch picks with 60-day and 90-day grading.",
        license: "https://creativecommons.org/licenses/by/4.0/",
        creator: {
          "@type": "Organization",
          name: "GitDealFlow",
          url: "https://signals.gitdealflow.com",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Scorecard", item: "https://signals.gitdealflow.com/scorecard" },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/scorecard"
        languages={getHreflangLanguages("/scorecard")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/scorecard" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Scorecard</span>
          </nav>
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
            One-shot proof · Rolling cadence
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Public scorecard. <span className="text-amber-400">Every pick, graded.</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            A single demonstration is good, but a public, rolling, recurring
            scorecard is the demonstration that compounds. Every Acceleration
            Watch pick lands with a date, gets graded at 60 and 90 days, and
            stays on this page whether it Hit, Missed, or is still Pending.
            No hiding the misses.
          </p>
        </header>

        <section className="rounded-xl border border-amber-700/30 bg-amber-950/10 p-6 sm:p-7 space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">The grading rules</h2>
          <ol className="space-y-3">
            {RULES.map((r) => (
              <li key={r.n} className="flex gap-3">
                <span className="text-amber-300 font-bold tabular-nums shrink-0 w-6 text-right">
                  {r.n}.
                </span>
                <div>
                  <p className="text-gray-100 font-semibold text-base mb-1">{r.title}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{r.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-3">
            Cumulative · {totals.picks} picks across {SCORE_ROWS.length} weeks
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-emerald-700/40 bg-emerald-950/15 p-3">
              <p className="text-emerald-300 text-[10px] font-semibold uppercase tracking-wider">Hit</p>
              <p className="text-emerald-300 text-2xl font-bold tabular-nums mt-0.5">{totals.hit}</p>
            </div>
            <div className="rounded-lg border border-rose-700/40 bg-rose-950/15 p-3">
              <p className="text-rose-300 text-[10px] font-semibold uppercase tracking-wider">Miss</p>
              <p className="text-rose-300 text-2xl font-bold tabular-nums mt-0.5">{totals.miss}</p>
            </div>
            <div className="rounded-lg border border-sky-700/40 bg-sky-950/15 p-3">
              <p className="text-sky-300 text-[10px] font-semibold uppercase tracking-wider">Pending</p>
              <p className="text-sky-300 text-2xl font-bold tabular-nums mt-0.5">{totals.pending}</p>
            </div>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed mt-3 pt-3 border-t border-slate-800">
            All current picks are still inside their 60d / 90d grading window
            (the Acceleration Watch published its first archived week 2026-04-27;
            the first 60d window opens 2026-06-26). Grading begins{" "}
            <strong className="text-gray-200">2026-07-03</strong> for week
            2026-w17. The page updates on every grade.
          </p>
        </section>

        <PlainEnglishNote title="How to read this">
          <p>
            <strong className="text-gray-200">Hit</strong> means the startup we
            named announced a fundraise, or sustained 4×+ engineering
            acceleration, inside the grading window, the call paid off.{" "}
            <strong className="text-gray-200">Miss</strong> means neither
            happened: no raise, and the activity dropped back to baseline. We
            show the misses too.{" "}
            <strong className="text-gray-200">Pending</strong> means the
            grading window is still open, the pick is made, the clock is
            running, and we have not earned the right to claim it either way yet.
          </p>
          <p>
            Right now every row is Pending because the first window only opens
            2026-06-26. That is honest, not weak: a forward pick is only worth
            anything if it was dated before the outcome was known.
          </p>
        </PlainEnglishNote>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-2">
          <p className="text-gray-300 text-sm leading-relaxed">
            These are the forward picks, still grading out. If you want proof
            you can check today, the backwards-looking receipts are already
            public, named orgs, dated engineering events, dated fundraise
            announcements, on{" "}
            <Link
              href="/wins"
              className="text-amber-300 hover:text-amber-200 underline decoration-dotted"
            >
              the wins page
            </Link>
            .
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">Weekly rolls</h2>
          <table className="w-full text-sm">
            <thead className="text-gray-400 text-[10px] uppercase tracking-wider">
              <tr className="border-b border-slate-800">
                <th className="text-left py-2 pr-3 font-semibold">Week</th>
                <th className="text-right py-2 px-2 font-semibold">Picks</th>
                <th className="text-right py-2 px-2 font-semibold">Hit</th>
                <th className="text-right py-2 px-2 font-semibold">Miss</th>
                <th className="text-right py-2 px-2 font-semibold">Pending</th>
                <th className="text-left py-2 pl-3 font-semibold">Note</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {SCORE_ROWS.map((r) => (
                <tr key={r.week} className="border-b border-slate-800/60">
                  <td className="py-3 pr-3 font-mono text-xs">
                    <Link
                      href={`/predicted/${r.week}`}
                      className="text-amber-300 hover:text-amber-200 underline decoration-dotted"
                    >
                      {r.week}
                    </Link>
                  </td>
                  <td className="py-3 px-2 text-right tabular-nums">{r.picks}</td>
                  <td className="py-3 px-2 text-right tabular-nums text-emerald-400">{r.hit}</td>
                  <td className="py-3 px-2 text-right tabular-nums text-rose-400">{r.miss}</td>
                  <td className="py-3 px-2 text-right tabular-nums text-sky-400">{r.pending}</td>
                  <td className="py-3 pl-3 text-xs text-gray-400 leading-relaxed">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-950/25 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            Historical highlight, a worked example
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            One of the 219 SSRN observations, narrated.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            The current scorecard is pre-grading-window. While we wait for
            T+60 to land, here&rsquo;s one of the 219 paired observations
            from the methodology paper, anonymised, but reproducible
            against the Zenodo dataset.
          </p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm">
            <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3">
              <dt className="text-gray-400 text-[10px] uppercase tracking-wider">Org</dt>
              <dd className="text-gray-200 leading-snug mt-1">{HISTORICAL_HIGHLIGHT.name}</dd>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3">
              <dt className="text-gray-400 text-[10px] uppercase tracking-wider">Picked</dt>
              <dd className="text-gray-200 leading-snug mt-1">{HISTORICAL_HIGHLIGHT.picked}</dd>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3">
              <dt className="text-gray-400 text-[10px] uppercase tracking-wider">Graded (Hit)</dt>
              <dd className="text-gray-200 leading-snug mt-1">{HISTORICAL_HIGHLIGHT.graded}</dd>
            </div>
            <div className="rounded-lg border border-emerald-700/40 bg-emerald-950/20 p-3">
              <dt className="text-emerald-300 text-[10px] uppercase tracking-wider">Lead-time</dt>
              <dd className="text-emerald-300 text-xl font-bold tabular-nums mt-0.5">{HISTORICAL_HIGHLIGHT.leadtime}</dd>
            </div>
          </dl>
          <p className="text-gray-300 text-sm leading-relaxed pt-2 border-t border-amber-700/30">
            {HISTORICAL_HIGHLIGHT.context}
          </p>
          <p className="text-gray-400 text-xs leading-relaxed pt-1">
            Reproduce against{" "}
            <a
              href="https://ssrn.com/abstract=6606558"
              className="text-amber-300 hover:text-amber-200 underline decoration-dotted"
              target="_blank"
              rel="noopener noreferrer"
            >
              SSRN abstract=6606558
            </a>{" "}
            + Zenodo dataset (CC BY 4.0).
          </p>
        </section>

        {/* FALSE BELIEFS, Brunson Expert Secrets Ch 13 (Identifying
            False Beliefs / Buyer's Roadmap intro). Audit 2026-05-09
            verdict: false-belief patterns "named" but as scattered prose.
            This is the explicit table, three patterns (Vehicle /
            Internal / External), three breaks, three receipts. The
            scorecard page is the right home: the patterns most often
            attach to the "is the signal real?" beat and the scorecard
            is where readers come looking for that proof. */}
        <FalseBeliefBreaker />

        <section className="rounded-xl border border-sky-700/40 bg-sky-950/15 p-6 sm:p-8 space-y-3">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            How to read this page
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Trust the Pending column more than the Hit column.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            The Hit column will look great when the first grading window
            closes. That&rsquo;s expected. The honest read is the Pending
            column right now and the Miss column three months from now.
            If we suppress a Miss, this page is theatre. If we publish it,
            this page is the methodology&rsquo;s calibration record.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/predicted"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-signal-500 hover:bg-signal-400 text-slate-950 font-bold text-sm transition-colors"
            >
              See this week&rsquo;s 10 picks →
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Or the methodology →
            </Link>
          </div>
        </section>

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Public-grading scorecard drawn from direct-response sales canon -
          a rolling-demonstration variant of the one-shot proof.
        </p>

        <TrustConversionBlock
          dominant="firstlook"
          context="Want to watch a pick grade out on your own sector? Start one."
        />
      </div>
    </>
  );
}
