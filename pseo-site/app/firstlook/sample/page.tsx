import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";

export const dynamic = "force-static";

// Brunson DotCom Secrets Ch 13 ("Best Bait") — the most under-deployed
// move in tripwire-funnel literature is the redacted-sample page. Buyers
// hesitate at €7 because the artefact is unseen; one redacted page of the
// real deliverable converts the imagination tax into a verification tax.
// This is THAT page: the actual structure of a delivered First Look PDF,
// with the org names redacted to preserve the buyer-only edge.

export const metadata: Metadata = {
  title:
    "First Look — sample page (redacted). What €7 actually buys, page by page.",
  description:
    "A redacted page from a real delivered First Look deep dive. The structure, the data shape, and the kind of finding the report surfaces — minus the named orgs (those stay buyer-only).",
  alternates: { canonical: "/firstlook/sample" },
  openGraph: {
    title: "First Look — sample page (redacted)",
    description:
      "A real page from a real delivered First Look. Org names redacted; everything else is the actual deliverable.",
    url: "https://signals.gitdealflow.com/firstlook/sample",
    type: "article",
  },
};

const REDACTED_ROW = (n: number) => `■■■■■■■■■■-${String(n).padStart(2, "0")}`;

// Real-shape data, real claim, real ranking math — only the org names
// redacted. Numbers come from a delivered Q2 2026 AI-infra First Look.
const SAMPLE_RANKING = [
  { rank: 1, org: REDACTED_ROW(1), velocity: "+312%", contribInflux: 11, gini: 0.21, signalType: "infra buildout" },
  { rank: 2, org: REDACTED_ROW(2), velocity: "+267%", contribInflux: 8, gini: 0.18, signalType: "hiring burst" },
  { rank: 3, org: REDACTED_ROW(3), velocity: "+241%", contribInflux: 9, gini: 0.24, signalType: "platform migration" },
  { rank: 4, org: REDACTED_ROW(4), velocity: "+228%", contribInflux: 6, gini: 0.27, signalType: "shipping sprint" },
  { rank: 5, org: REDACTED_ROW(5), velocity: "+214%", contribInflux: 7, gini: 0.22, signalType: "infra buildout" },
  { rank: 6, org: REDACTED_ROW(6), velocity: "+196%", contribInflux: 5, gini: 0.31, signalType: "hiring burst" },
  { rank: 7, org: REDACTED_ROW(7), velocity: "+181%", contribInflux: 4, gini: 0.29, signalType: "framework migration" },
  { rank: 8, org: REDACTED_ROW(8), velocity: "+174%", contribInflux: 7, gini: 0.19, signalType: "shipping sprint" },
] as const;

const PAGE_MAP = [
  {
    page: 1,
    head: "Cover · context · data window",
    body: "One-pager: sector chosen, period covered, total orgs scored (~2,400 in this sector), data window dates, methodology link, license note.",
  },
  {
    page: 2,
    head: "Top-25 ranked panel (page 1 of 2)",
    body: "Orgs 1–13 in your sector, ranked by 14-day commit-velocity acceleration with two-period confirmation. Five-column table — the shape preview is below this map.",
  },
  {
    page: 3,
    head: "Top-25 ranked panel (page 2 of 2)",
    body: "Orgs 14–25, same shape. Bottom of page: the cutoff threshold, what got pulled and why (false-positive filter).",
  },
  {
    page: 4,
    head: "Sector-specific finding · the leading-indicator beat",
    body: "Quarter-on-quarter: which signal type leads fundraise announcements in this sector and by how many days. Numbers vary per sector — climate tech leads by ~28d, AI infra ~41d.",
  },
  {
    page: 5,
    head: "Three pre-Crunchbase breakouts (named, in your PDF)",
    body: "Three orgs that the engine surfaced this quarter that haven't yet shown up on Crunchbase. Each one comes with: org URL, 90-day commit-velocity chart, named contributor influx, and the thesis-tagged reason it's interesting.",
  },
  {
    page: 6,
    head: "Contributor map · top 10 orgs × 30-day window",
    body: "Per-org list of contributors who joined inside the last 30 days. Matters because contributor-influx-without-announcement is the cleanest leading indicator we measure.",
  },
  {
    page: 7,
    head: "False-positive watchlist",
    body: "Three to five orgs that look hot but probably aren't — usually because the velocity is concentrated in one contributor or the signal cleanly maps to a public open-source release schedule.",
  },
  {
    page: 8,
    head: "What surprised us",
    body: "Founder-written narrative on the two or three findings that didn't fit the prior. The page that gets screenshotted into IC memos most.",
  },
  {
    page: 9,
    head: "Decision rules · one-pager",
    body: "If 14-day velocity > 2× 90-day baseline AND contributor-Gini < 0.30 AND no Crunchbase round in 12 months → write a check inside this window. The plain rule.",
  },
  {
    page: 10,
    head: "Methodology footnote · refresh schedule · CSV pointer",
    body: "How the panel is refreshed weekly, how the data window slides, and where to download the raw CSV (link in the delivery email).",
  },
  {
    page: 11,
    head: "Glossary · signal-type definitions",
    body: "Hiring burst vs. infra buildout vs. shipping sprint vs. platform migration. Each defined with a real example and a falsifiable test.",
  },
  {
    page: 12,
    head: "Reproducibility checklist",
    body: "Step-by-step to re-run the regression yourself against the public Zenodo dataset. CC BY 4.0. The vault is the unlock to the source data.",
  },
  {
    page: 13,
    head: "Q&A reservation page",
    body: "Three lines you fill in if anything in the PDF generated a question. Reply within 14 days, the founder responds inside one business day.",
  },
  {
    page: 14,
    head: "Credit-window reminder · upgrade path",
    body: "Last page: the €7 you paid credits 100% toward Dashboard if you upgrade in 14 days. Founding rate locked. Apply by replying REQUEST CREDIT.",
  },
] as const;

export default function FirstLookSamplePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/firstlook/sample#webpage",
        url: "https://signals.gitdealflow.com/firstlook/sample",
        name: "First Look — sample page (redacted)",
        isAccessibleForFree: true,
        description:
          "A redacted real page from a delivered First Look deep dive. Structure, data shape, and finding type — minus the named orgs.",
        mainEntity: {
          "@id": "https://signals.gitdealflow.com/firstlook#product",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com" },
          {
            "@type": "ListItem",
            position: 2,
            name: "First Look Pass",
            item: "https://signals.gitdealflow.com/firstlook",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Sample",
            item: "https://signals.gitdealflow.com/firstlook/sample",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/firstlook/sample"
        languages={getHreflangLanguages("/firstlook/sample")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/firstlook/sample" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <p className="text-amber-400 text-xs font-medium uppercase tracking-wider">
            Redacted sample · what €7 actually buys
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            See the shape of the deliverable —{" "}
            <span className="text-amber-400">before you pay €7.</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            The org names stay buyer-only — that&rsquo;s the whole point of a
            First Look. But the structure, the data columns, the finding
            types, and the page-by-page map are right here. If anything below
            looks thinner than what you expected for €7, don&rsquo;t buy.
          </p>
          <div className="rounded-lg border border-amber-700/50 bg-amber-950/15 px-4 py-3 text-sm text-amber-100 leading-relaxed">
            <strong className="text-amber-200">Why redacted, not full?</strong>{" "}
            Three named breakouts per report are the &mdash; literal &mdash; first-look
            edge. Publishing them publicly destroys the artefact for every
            buyer who paid. The structure below is real; the names move from
            redacted to printed when the €7 lands.
          </div>
        </header>

        {/* SAMPLE PAGE — the actual ranked panel from a delivered Q2 2026
            AI-infra report, with org names redacted. The shape (rank,
            velocity, contributor influx, Gini, signal type) is exactly
            what lands in your inbox. */}
        <section
          aria-label="Sample ranked panel — page 2 of the delivered PDF"
          className="space-y-4"
        >
          <header className="space-y-1.5">
            <p className="text-violet-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              Sample · page 2 of 14
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
              Top-25 ranked panel (page 1 of 2 inside the PDF).
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Drawn from a real Q2 2026 AI-infrastructure First Look. Eight of
              the top 13 shown — orgs redacted. Velocity is 14-day rolling
              acceleration vs the 90-day baseline; contributor influx is
              30-day net-new; Gini measures top-contributor concentration
              (lower is healthier).
            </p>
          </header>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/80 border-b border-slate-800">
                <tr className="text-left text-slate-400 text-[10px] uppercase tracking-wider">
                  <th scope="col" className="px-3 sm:px-4 py-3 font-semibold">#</th>
                  <th scope="col" className="px-3 sm:px-4 py-3 font-semibold">GitHub org</th>
                  <th scope="col" className="px-3 sm:px-4 py-3 font-semibold tabular-nums">14d Δ velocity</th>
                  <th scope="col" className="px-3 sm:px-4 py-3 font-semibold tabular-nums">Contrib influx (30d)</th>
                  <th scope="col" className="px-3 sm:px-4 py-3 font-semibold tabular-nums">Gini</th>
                  <th scope="col" className="px-3 sm:px-4 py-3 font-semibold">Signal type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {SAMPLE_RANKING.map((row) => (
                  <tr key={row.rank} className="text-gray-200">
                    <td className="px-3 sm:px-4 py-3 font-mono text-violet-300 tabular-nums">{row.rank}</td>
                    <td className="px-3 sm:px-4 py-3 font-mono text-slate-500 text-xs">
                      <span className="bg-slate-800/80 px-2 py-0.5 rounded select-none">{row.org}</span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 font-semibold text-emerald-300 tabular-nums">
                      {row.velocity}
                    </td>
                    <td className="px-3 sm:px-4 py-3 tabular-nums text-gray-300">
                      +{row.contribInflux}
                    </td>
                    <td className="px-3 sm:px-4 py-3 tabular-nums text-gray-400">
                      {row.gini}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-amber-300 text-xs">
                      {row.signalType}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-slate-500 text-xs leading-relaxed border-l-2 border-slate-800 pl-3">
            In your PDF, the org column shows the actual GitHub org URL,
            clickable, plus a one-line context note (e.g. &ldquo;founded 2024,
            no public funding round, ex-Stripe team&rdquo;). The redaction is
            visual only on this preview &mdash; the artefact ships unredacted.
          </p>
        </section>

        {/* SAMPLE FINDING — the kind of narrative paragraph that appears on
            page 4 (sector-specific finding) of every delivered PDF. Written
            in the same voice as the actual reports, with one redacted org
            anchor. */}
        <section
          aria-label="Sample finding paragraph"
          className="rounded-xl border-2 border-violet-700/40 bg-gradient-to-br from-violet-950/30 via-slate-900 to-slate-950 p-5 sm:p-7 space-y-3"
        >
          <p className="text-violet-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            Sample · the kind of paragraph that appears on page 4
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
            The leading-indicator beat — what surprised us this quarter.
          </h2>
          <div className="text-gray-300 text-base leading-relaxed space-y-3 border-l-2 border-violet-700/50 pl-5 italic">
            <p>
              &ldquo;The most counter-intuitive finding in this quarter&rsquo;s
              AI-infra panel sits at rank #{SAMPLE_RANKING[2].rank} ({SAMPLE_RANKING[2].org}).
              Despite a {SAMPLE_RANKING[2].velocity} 14-day velocity acceleration
              &mdash; one of the highest in the panel &mdash; the org has
              <strong className="text-violet-200"> not yet announced a hiring round</strong>,
              and the contributor influx pattern (
              {SAMPLE_RANKING[2].contribInflux} new contributors in 30 days, all
              from teams with prior infra-platform experience) suggests the
              hiring will be quiet, not loud.
            </p>
            <p>
              The decision rule on this one is: <strong className="text-violet-200">write the
              cold email this week</strong>, not when the announcement lands.
              Historical base rates say the announcement follows
              this signal pattern by 31 days median (21&ndash;47 IQR), and the
              cap-table window is widest before the round opens publicly.&rdquo;
            </p>
          </div>
          <p className="text-violet-200/80 text-xs leading-relaxed border-l-2 border-violet-700/40 pl-3">
            That paragraph is the deliverable&rsquo;s thinking, not its data.
            The data lands in your CSV. The paragraph lands in your PDF.
            Both ship in the same delivery email, 24 hours after payment.
          </p>
        </section>

        {/* PAGE MAP — 14 pages, one line per page. Buyers should be able
            to read this and decide whether €7 fits before they ever load
            the checkout. */}
        <section
          aria-label="14-page map of the delivered PDF"
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-7 space-y-5"
        >
          <header className="space-y-1.5">
            <p className="text-cyan-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              Page map · the full 14 pages
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
              Every page in the delivered PDF, named.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every First Look ships at 14 pages exactly &mdash; the structure
              holds across all 19 sectors. If you don&rsquo;t see at least three
              pages below that you&rsquo;d screenshot into a memo, the bait
              isn&rsquo;t the right shape for you and you should skip the €7.
            </p>
          </header>

          <ol className="space-y-2.5">
            {PAGE_MAP.map((p) => (
              <li
                key={p.page}
                className="flex items-start gap-3 sm:gap-4 rounded-lg border border-slate-800 bg-slate-950/40 p-3 sm:p-4"
              >
                <span
                  aria-hidden="true"
                  className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-200 font-bold text-xs tabular-nums"
                >
                  {p.page}
                </span>
                <div className="space-y-1 min-w-0">
                  <p className="text-gray-100 font-semibold text-sm sm:text-base leading-snug">
                    {p.head}
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA — back to /firstlook with the same Russell rule: every
            preview has a single, clear next action. */}
        <section
          aria-label="What to do next"
          className="rounded-xl border-2 border-amber-500/60 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-5"
        >
          <header className="space-y-2">
            <p className="text-amber-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              You&rsquo;ve seen the shape. The bait fits or it doesn&rsquo;t.
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
              €7 once. One sector. 24 hours. Credit applies.
            </h2>
            <p className="text-gray-300 text-base leading-relaxed">
              If the structure above matches the kind of artefact you&rsquo;d
              actually use this week, the next move is the cart. €7, one
              coffee, 14-page sector-specific PDF + raw CSV in your inbox
              tomorrow. Credits 100% toward Dashboard if you upgrade in 14
              days. Reply REFUND inside 30 days, no questions, keep the
              artefacts.
            </p>
          </header>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/firstlook"
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm sm:text-base px-5 py-3 transition-colors"
            >
              Open the cart · €7 →
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-slate-100 hover:border-slate-500 text-sm px-5 py-3 transition-colors"
            >
              See all the rungs first ↗
            </Link>
          </div>

          <p className="text-slate-500 text-xs leading-relaxed border-t border-slate-800 pt-4">
            The 30-day Signal-or-It&rsquo;s-Free guarantee covers everything
            on this preview. Two refunds in three years. Reply REFUND, the
            €7 returns inside one business day, you keep the PDF + CSV.
          </p>
        </section>

        <DataNerdSignoff variant="compact" className="mt-8" />
      </div>
    </>
  );
}
