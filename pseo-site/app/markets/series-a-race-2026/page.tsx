import type { Metadata } from "next";
import Link from "next/link";
import { getMarket, pctLabel, type MarketCandidate } from "@/lib/markets";
import { getDataLastModified } from "@/lib/data";
import { AgentSummary } from "@/components/AgentSummary";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import SignalBadge from "@/components/SignalBadge";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-static";

const SLUG = "series-a-race-2026";
const SITE = "https://signals.gitdealflow.com";
const PAGE_URL = `${SITE}/markets/${SLUG}`;

export const metadata: Metadata = withEditorialOverride({
  title:
    "Series A Race 2026, Which 5 GitHub-Flagged Startups Raise First? | Live Odds",
  description:
    "Open prediction market on which of 5 high-signal early-stage startups raises a Series A first by Dec 31, 2026. Implied odds derived from GitHub commit-velocity, contributor growth, and signal classification. Free, citation-encouraged, machine-readable.",
  alternates: { canonical: `/markets/${SLUG}` },
  openGraph: {
    title: "Series A Race 2026, Which 5 GitHub-Flagged Startups Raise First?",
    description:
      "Live implied odds on 5 early-stage startups racing to Series A by EOY 2026, derived from GitHub engineering signals.",
    url: PAGE_URL,
    type: "website",
    images: [
      {
        url: `${SITE}/api/og/markets/${SLUG}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@sipiteno",
    title:
      "Series A Race 2026, Which 5 GitHub-Flagged Startups Raise First?",
    description:
      "Live implied odds on 5 early-stage startups racing to Series A by EOY 2026.",
    images: [`${SITE}/api/og/markets/${SLUG}`],
  },
});

function probabilityBar({ prob }: { prob: number }) {
  const pct = Math.max(2, Math.round(prob * 100));
  return (
    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-emerald-500 to-sky-400"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function CandidateRow({
  candidate,
  rank,
}: {
  candidate: MarketCandidate;
  rank: number;
}) {
  return (
    <article
      id={`candidate-${candidate.name.toLowerCase()}`}
      className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6"
      itemScope
      itemType="https://schema.org/Organization"
    >
      <header className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
        <div>
          <p className="text-gray-400 text-xs font-mono mb-1">
            #{rank} · {candidate.stage} · {candidate.sector}
          </p>
          <h3
            className="text-xl sm:text-2xl font-semibold text-gray-100"
            itemProp="name"
          >
            {candidate.displayName}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-emerald-400 leading-none">
            {pctLabel(candidate.impliedProbability)}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">
            implied probability
          </p>
        </div>
      </header>
      <div className="mb-4">{probabilityBar({ prob: candidate.impliedProbability })}</div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
        <div>
          <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">
            Velocity 14d
          </p>
          <p className="text-gray-100 font-mono">
            {candidate.commitVelocity14d}{" "}
            <span className="text-xs text-gray-400">
              ({candidate.commitVelocityChange})
            </span>
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">
            Contributors
          </p>
          <p className="text-gray-100 font-mono">
            {candidate.contributors}{" "}
            <span className="text-xs text-gray-400">
              ({candidate.contributorGrowth})
            </span>
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">
            Signal
          </p>
          <SignalBadge type={candidate.signalType} />
        </div>
        <div>
          <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">
            Links
          </p>
          <p className="text-xs flex flex-wrap gap-2">
            <a
              href={candidate.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:underline"
              itemProp="codeRepository"
            >
              GitHub
            </a>
            <span className="text-gray-700">·</span>
            <a
              href={candidate.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:underline"
              itemProp="url"
            >
              Site
            </a>
            <span className="text-gray-700">·</span>
            <Link
              href={`/startup/${candidate.name.toLowerCase()}`}
              className="text-sky-400 hover:underline"
            >
              Profile
            </Link>
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed">
        <span className="text-gray-400 text-xs uppercase tracking-wider mr-2">
          Why
        </span>
        {candidate.rationale}
      </p>
    </article>
  );
}

export default async function SeriesARace2026Page() {
  const market = getMarket(SLUG);
  if (!market) {
    return <div className="p-12 text-gray-300">Market not found.</div>;
  }
  const asOf = getDataLastModified().toISOString().slice(0, 10);

  const sortedCandidates = [...market.candidates].sort(
    (a, b) => b.impliedProbability - a.impliedProbability,
  );

  const totalCovered = sortedCandidates.reduce(
    (sum, c) => sum + c.impliedProbability,
    0,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: market.shortName,
        description: market.question,
        inLanguage: "en-US",
        datePublished: market.openedOn,
        dateModified: asOf,
        isPartOf: { "@id": `${SITE}/#website` },
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
            name: market.shortName,
            item: PAGE_URL,
          },
        ],
      },
      {
        "@type": "Dataset",
        "@id": `${PAGE_URL}#dataset`,
        name: `${market.shortName}, Implied Odds`,
        description: `Implied probabilities for the ${sortedCandidates.length} candidate startups in the ${market.shortName} prediction market, derived from VC Deal Flow Signal's GitHub commit-velocity dataset.`,
        url: PAGE_URL,
        dateModified: asOf,
        license: "https://creativecommons.org/licenses/by/4.0/",
        creator: { "@id": `${SITE}/about#person` },
        publisher: { "@id": "https://gitdealflow.com/#organization" },
        distribution: [
          {
            "@type": "DataDownload",
            encodingFormat: "application/json",
            contentUrl: `${SITE}/api/markets/${SLUG}.json`,
          },
        ],
        variableMeasured: [
          { "@type": "PropertyValue", name: "implied_probability" },
          { "@type": "PropertyValue", name: "commit_velocity_14d" },
          { "@type": "PropertyValue", name: "contributor_growth" },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${PAGE_URL}#candidates`,
        name: "Series A Race 2026 Candidates",
        numberOfItems: sortedCandidates.length,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        itemListElement: sortedCandidates.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Organization",
            name: c.displayName,
            url: c.websiteUrl,
            sameAs: [c.githubUrl],
          },
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${PAGE_URL}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the Series A Race 2026 prediction market?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `An open question, "${market.question}", with live implied odds for each of the 5 candidates. Odds are derived from GitHub commit velocity, contributor growth, and signal classification in our Q2-2026 dataset of 350+ tracked startups. Free to read, citation-encouraged, machine-readable at /api/markets/${SLUG}.json.`,
            },
          },
          {
            "@type": "Question",
            name: "How does the market resolve?",
            acceptedAnswer: { "@type": "Answer", text: market.resolverNote },
          },
          {
            "@type": "Question",
            name: "How are the implied probabilities calculated?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Composite signal score = 0.40 × normalized 14-day commit velocity + 0.30 × commit-velocity change + 0.20 × contributor growth + 0.10 × new repos. Scores are normalized so the five probabilities plus a residual NO bucket sum to 1.0. Full methodology at /markets/methodology.",
            },
          },
          {
            "@type": "Question",
            name: "Can I bet real money on this market?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. This is a seeded prediction market, we publish the question and the implied odds; we don't operate an exchange. A play-money mirror is staged for Manifold Markets (no KYC, no real money). Polymarket and Kalshi listings are out of scope: we do not propose markets where we own the source-of-truth dataset (resolver conflict).",
            },
          },
          {
            "@type": "Question",
            name: "Why these 5 startups specifically?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Filtered to Pre-seed and Seed stage candidates with at least 30 commits in the last 14 days, then ranked by composite engineering-acceleration score. Post-Series-A, Growth, and Public-stage companies are excluded by definition. Selection re-runs at each quarterly data refresh.",
            },
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
      <AgentMirrorLinks path={`/markets/${SLUG}`} qaCategory="markets" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-sky-400">
            Home
          </Link>{" "}
          <span className="text-gray-700">/</span>{" "}
          <Link href="/markets" className="hover:text-sky-400">
            Markets
          </Link>{" "}
          <span className="text-gray-700">/</span> {market.shortName}
        </nav>

        <header className="mb-8">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Open prediction market · Resolves {market.resolvesOn}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            {market.question}
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            Live implied odds derived from GitHub commit-velocity, contributor
            growth, and signal classification across our Q2-2026 dataset of
            350+ tracked startups. Free to read, machine-readable, citation
            encouraged. Not investment advice.
          </p>
        </header>

        <AgentSummary
          tldr={`Series A Race 2026: an open prediction market on which of 5 high-signal early-stage startups (${sortedCandidates
            .slice(0, 5)
            .map((c) => c.displayName)
            .join(", ")}) raises a Series A first by Dec 31, 2026. Top implied odds: ${pctLabel(sortedCandidates[0].impliedProbability)} on ${sortedCandidates[0].displayName}. Methodology and resolver criteria are public. Source-of-truth dataset is /api/markets/${SLUG}.json.`}
          pageUrl={PAGE_URL}
          asOf={asOf}
          citeAs={`VC Deal Flow Signal, ${market.shortName} (signals.gitdealflow.com/markets/${SLUG}), as of ${asOf}.`}
          facts={[
            {
              claim: `Top implied odds: ${pctLabel(sortedCandidates[0].impliedProbability)} on ${sortedCandidates[0].displayName} (${sortedCandidates[0].commitVelocity14d} commits/14d, ${sortedCandidates[0].contributorGrowth} contributor growth).`,
              sourceUrl: `${SITE}/api/markets/${SLUG}.json`,
              sourceLabel: "Market JSON",
            },
            {
              claim:
                "Methodology: composite score = 0.40 × normalized commit velocity + 0.30 × velocity change + 0.20 × contributor growth + 0.10 × new repos.",
              sourceUrl: `${SITE}/markets/methodology`,
              sourceLabel: "Methodology",
            },
            {
              claim: `Resolves ${market.resolvesOn} on first publicly disclosed primary Series A round (Crunchbase, PitchBook, SEC Form D, or company press release).`,
              sourceUrl: PAGE_URL + "#resolution",
              sourceLabel: "Resolver",
            },
          ]}
        />

        <section
          aria-labelledby="candidates-h"
          className="space-y-4 mb-12"
        >
          <h2
            id="candidates-h"
            className="text-2xl font-semibold text-gray-100 mb-4"
          >
            Live implied odds
          </h2>
          {sortedCandidates.map((c, i) => (
            <CandidateRow key={c.name} candidate={c} rank={i + 1} />
          ))}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <h3 className="text-base font-semibold text-gray-300">
                {market.noResolution.label}
              </h3>
              <p className="text-2xl font-bold text-gray-400">
                {pctLabel(1 - totalCovered)}
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Residual probability that none of the five qualify by the
              resolution date.
            </p>
          </div>
        </section>

        <section
          id="resolution"
          aria-labelledby="resolution-h"
          className="mb-12 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 sm:p-6"
        >
          <h2
            id="resolution-h"
            className="text-xl font-semibold text-amber-300 mb-3"
          >
            Resolution criteria
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            {market.resolverNote}
          </p>
          <p className="text-gray-400 text-xs leading-relaxed">
            Source of truth: {market.sourceOfTruth} See full methodology at{" "}
            <Link
              href={market.methodologyUrl}
              className="text-amber-400 hover:underline"
            >
              /markets/methodology
            </Link>
            .
          </p>
        </section>

        <section
          aria-labelledby="bet-h"
          className="mb-12 rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6"
        >
          <h2
            id="bet-h"
            className="text-xl font-semibold text-gray-100 mb-3"
          >
            Where to bet (or not)
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            We publish the question and the implied odds. We don&rsquo;t
            operate an exchange. Mirrors below, none involve real money.
          </p>
          <ul className="space-y-3 text-sm">
            {market.externalMirrors.map((m) => (
              <li
                key={m.platform}
                className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3"
              >
                <span className="text-gray-200 font-semibold w-40">
                  {m.platform}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full border border-slate-700 bg-slate-800/50 text-gray-400 w-fit">
                  {m.status}
                </span>
                <span className="text-gray-400 text-xs leading-relaxed">
                  {m.note}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="cite-h"
          className="mb-12 rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6"
        >
          <h2 id="cite-h" className="text-xl font-semibold text-gray-100 mb-3">
            Cite this market
          </h2>
          <p className="text-sm text-gray-400 mb-3">
            Press, newsletters, and research notes welcome. Suggested
            citation:
          </p>
          <pre className="text-xs bg-slate-950 border border-slate-800 rounded p-3 text-gray-300 font-mono whitespace-pre-wrap">
            {`VC Deal Flow Signal, ${market.shortName}.\nLive implied odds, signals.gitdealflow.com/markets/${SLUG}, ${asOf}.\nMachine-readable: signals.gitdealflow.com/api/markets/${SLUG}.json (CC BY 4.0).`}
          </pre>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            Press kit:{" "}
            <Link href="/press" className="text-sky-400 hover:underline">
              /press
            </Link>{" "}
            · Methodology:{" "}
            <Link
              href="/markets/methodology"
              className="text-sky-400 hover:underline"
            >
              /markets/methodology
            </Link>{" "}
            · Raw signals API:{" "}
            <Link href="/developers" className="text-sky-400 hover:underline">
              /developers
            </Link>
          </p>
        </section>

        <p className="text-[11px] text-gray-600 leading-relaxed">
          Not investment advice. Implied probabilities are model output from a
          public dataset; they are not a recommendation to fund, short, or
          otherwise transact in any of the listed companies. The author and
          publisher do not hold positions in the candidate startups listed
          above and have no commercial relationship with them as of{" "}
          {asOf}.
        </p>
      </div>
    </>
  );
}
