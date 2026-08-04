import type { Metadata } from "next";
import Link from "next/link";
import { getDataLastModified } from "@/lib/data";
import { AgentSummary } from "@/components/AgentSummary";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

export const dynamic = "force-static";

const SITE = "https://signals.gitdealflow.com";
const PAGE_URL = `${SITE}/markets/methodology`;

export const metadata: Metadata = {
  title:
    "Markets Methodology — How Implied Odds Are Computed",
  description:
    "Public methodology for the Series A Race 2026 prediction market and any future seeded market. Composite signal score, resolver criteria, candidate selection, refresh cadence, conflict-of-interest disclosures.",
  alternates: { canonical: "/markets/methodology" },
};

export default function MarketsMethodologyPage() {
  const asOf = getDataLastModified().toISOString().slice(0, 10);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${PAGE_URL}#article`,
        headline: "Markets Methodology",
        url: PAGE_URL,
        datePublished: "2026-05-03",
        dateModified: asOf,
        inLanguage: "en-US",
        author: { "@id": `${SITE}/about#person` },
        publisher: { "@id": "https://gitdealflow.com/#organization" },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", ".speakable", "[data-agent-summary]"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Markets",
            item: `${SITE}/markets`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Methodology",
            item: PAGE_URL,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/markets/methodology" qaCategory="markets" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose-invert">
        <nav className="text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-sky-400">
            Home
          </Link>{" "}
          <span className="text-gray-700">/</span>{" "}
          <Link href="/markets" className="hover:text-sky-400">
            Markets
          </Link>{" "}
          <span className="text-gray-700">/</span> Methodology
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-3">
            Markets methodology
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            How candidates are selected, how implied odds are computed, how
            markets resolve, and what conflicts of interest we disclose. This
            page applies to every market under{" "}
            <Link href="/markets" className="text-sky-400 hover:underline">
              /markets
            </Link>
            .
          </p>
        </header>

        <AgentSummary
          tldr="VC Deal Flow Signal Markets are seeded prediction markets — we publish the question, the candidate set, the implied odds (model output), and the resolver criteria. We don't operate an exchange, don't take positions, and don't profit from outcomes. Composite signal score = 0.40 × normalized 14-day commit velocity + 0.30 × commit-velocity change + 0.20 × contributor growth + 0.10 × new repos."
          pageUrl={PAGE_URL}
          asOf={asOf}
          citeAs={`VC Deal Flow Signal — Markets Methodology (signals.gitdealflow.com/markets/methodology), ${asOf}.`}
        />

        <section className="space-y-6 text-gray-300 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              1. Candidate selection
            </h2>
            <p>
              Each market starts from the current quarterly dataset (e.g.{" "}
              <code className="text-sky-300 bg-slate-900 px-1 py-0.5 rounded">
                q2-2026
              </code>
              ) of ~4,200 tracked startup GitHub orgs. For a Series A market,
              the eligible pool is filtered to:
            </p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
              <li>
                Stage label of <code>Pre-seed</code> or <code>Seed</code> in the
                enrichment dataset (post-Series-A, Growth, Public, and Mature
                excluded).
              </li>
              <li>
                Minimum base rate of 30 commits in the trailing 14-day window
                (to filter out abandoned repos and tiny projects).
              </li>
              <li>
                Sorted by composite engineering-acceleration score; top N (5
                for Series A Race 2026) become the candidate set.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              2. Composite signal score
            </h2>
            <pre className="text-xs bg-slate-950 border border-slate-800 rounded p-3 text-gray-300 font-mono whitespace-pre-wrap">
              {`composite_score =
    0.40 × normalize(commit_velocity_14d, max=600)
  + 0.30 × clip(commit_velocity_change_pct, -50, 200)
  + 0.20 × clip(contributor_growth_pct, -50, 300)
  + 0.10 × (new_repos × 5)`}
            </pre>
            <p className="text-sm mt-2">
              Weights reflect the empirical signal strength observed in our
              historical receipts dataset (
              <Link
                href="/receipts"
                className="text-sky-400 hover:underline"
              >
                /receipts
              </Link>
              ): commit velocity is the strongest single predictor, followed
              by velocity change, then contributor growth.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              3. Implied probabilities
            </h2>
            <p className="text-sm">
              Composite scores across the candidate set are softmax-normalized
              and scaled so the candidates plus a residual NO bucket sum to
              1.0. The residual NO bucket reflects base-rate timing risk: in
              any 7-month window, fewer than half of seed-stage startups
              actually close a Series A. We round to the nearest whole percent
              for display; raw values are in the JSON.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              4. Resolver
            </h2>
            <p className="text-sm">
              A candidate resolves YES on the first publicly disclosed primary
              Series A round. Acceptable sources, in order:
            </p>
            <ol className="mt-2 space-y-1 list-decimal list-inside text-sm">
              <li>SEC Form D (US) or equivalent public filing.</li>
              <li>Crunchbase or PitchBook funding-round entry.</li>
              <li>Company press release on a controlled domain.</li>
              <li>
                Coverage in TechCrunch, Sifted, The Information, or
                FinSMEs (corroborated by at least one of the three above).
              </li>
            </ol>
            <p className="text-sm mt-2">
              <strong className="text-gray-100">Excluded:</strong> bridge
              rounds, SAFEs, convertible notes, secondary transactions, and
              extensions of an existing seed round (even if &gt; $5M).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              5. Refresh cadence
            </h2>
            <p className="text-sm">
              The candidate set is locked at market open. Implied odds refresh
              with each quarterly dataset release (q1, q2, q3, q4) and on
              material funding news. Each refresh is logged in{" "}
              <Link
                href="/changelog"
                className="text-sky-400 hover:underline"
              >
                /changelog
              </Link>
              ; superseded JSON snapshots remain accessible via{" "}
              <Link
                href="/corrections"
                className="text-sky-400 hover:underline"
              >
                /corrections
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              6. Conflict-of-interest disclosure
            </h2>
            <p className="text-sm">
              The author and publisher do not hold equity, advisory, or
              consulting positions in any of the candidate startups listed in
              any market. We do not accept payment to add, remove, or
              re-weight candidates. We do not propose markets on platforms
              where we hold the source-of-truth dataset (Polymarket /
              Kalshi-style real-money markets) — only on play-money venues
              like Manifold where the resolver conflict is bounded.
            </p>
            <p className="text-sm mt-2">
              If a candidate startup later becomes a paying GitDealFlow
              customer, we disclose the relationship on the market page and
              offer the user an opt-out from the candidate set at the next
              quarterly refresh.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              7. Not investment advice
            </h2>
            <p className="text-sm">
              Implied probabilities are model output from a public dataset.
              They are not a recommendation to fund, short, or otherwise
              transact in any of the listed companies. Anyone using this data
              for investment decisions assumes full responsibility for those
              decisions.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
