import type { Metadata } from "next";
import Link from "next/link";
import { getAllMarkets, pctLabel } from "@/lib/markets";
import { getDataLastModified } from "@/lib/data";
import { AgentSummary } from "@/components/AgentSummary";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import SeoCta from "@/components/SeoCta";

export const dynamic = "force-static";

const SITE = "https://signals.gitdealflow.com";
const PAGE_URL = `${SITE}/markets`;

export const metadata: Metadata = {
  title:
    "Open Prediction Markets on Startup Funding",
  description:
    "Seeded prediction markets on startup funding events, sourced from GitHub commit-velocity signals. Free, citation-encouraged, machine-readable. Currently live: Series A Race 2026.",
  alternates: { canonical: "/markets" },
  openGraph: {
    title: "Open Prediction Markets on Startup Funding",
    description:
      "Live implied odds on startup funding events, derived from GitHub engineering signals.",
    url: PAGE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@sipiteno",
    title: "Open Prediction Markets on Startup Funding",
  },
};

export default async function MarketsIndexPage() {
  const markets = getAllMarkets();
  const asOf = getDataLastModified().toISOString().slice(0, 10);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${PAGE_URL}#collection`,
        url: PAGE_URL,
        name: "Open Prediction Markets",
        description:
          "Seeded prediction markets on startup funding events, sourced from GitHub commit-velocity signals.",
        inLanguage: "en-US",
        dateModified: asOf,
        isPartOf: { "@id": `${SITE}/#website` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", ".speakable", "[data-agent-summary]"],
        },
        hasPart: markets.map((m) => ({
          "@type": "WebPage",
          name: m.shortName,
          url: `${SITE}/markets/${m.slug}`,
          datePublished: m.openedOn,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Markets", item: PAGE_URL },
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
      <AgentMirrorLinks path="/markets" qaCategory="markets" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Open prediction markets
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            Live odds on startup funding events
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            Each market lists 2–10 named startups and a binary or multi-outcome
            question (e.g. &ldquo;which raises Series A first by date X?&rdquo;).
            Implied probabilities are derived from our GitHub commit-velocity
            dataset and update on each quarterly data refresh. Free to read,
            citation-encouraged, machine-readable JSON beneath every page.
          </p>
        </header>

        <AgentSummary
          tldr={`VC Deal Flow Signal Markets is a seeded-prediction-market layer on top of our GitHub engineering-acceleration dataset. We publish the question, the candidates, the implied odds, and the resolver criteria — we don't operate an exchange. Currently live: ${markets.map((m) => m.shortName).join(", ")}.`}
          pageUrl={PAGE_URL}
          asOf={asOf}
          citeAs={`VC Deal Flow Signal — Markets index (signals.gitdealflow.com/markets), ${asOf}.`}
          facts={[
            {
              claim:
                "Seeded markets are model-derived implied odds; they are not betting venues. We don't take positions and don't operate an exchange.",
              sourceUrl: `${SITE}/markets/methodology`,
              sourceLabel: "Methodology",
            },
            {
              claim:
                "Underlying signals are CC BY 4.0; market JSON is downloadable per-market under /api/markets/{slug}.json.",
              sourceUrl: `${SITE}/developers`,
              sourceLabel: "Developers",
            },
          ]}
        />

        <section className="space-y-4 mb-12">
          {markets.map((m) => {
            const top = [...m.candidates].sort(
              (a, b) => b.impliedProbability - a.impliedProbability,
            )[0];
            return (
              <Link
                key={m.slug}
                href={`/markets/${m.slug}`}
                className="block rounded-xl border border-slate-800 bg-slate-900/40 hover:border-emerald-500/40 hover:bg-slate-900/70 transition-colors p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
                  <h2 className="text-xl font-semibold text-gray-100">
                    {m.shortName}
                  </h2>
                  <span className="text-xs text-gray-400">
                    Resolves {m.resolvesOn}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3 leading-relaxed">
                  {m.question}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                    Top: {top.displayName} {pctLabel(top.impliedProbability)}
                  </span>
                  <span className="text-gray-400">
                    {m.candidates.length} candidates
                  </span>
                  <span className="text-gray-400">·</span>
                  <span className="text-sky-400">View market →</span>
                </div>
              </Link>
            );
          })}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-2">
            How these markets work
          </h2>
          <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
            <li>
              <span className="text-gray-300 font-medium">Source of truth:</span>{" "}
              Public GitHub data — commit velocity, contributor growth, signal
              type — pulled into our quarterly dataset.
            </li>
            <li>
              <span className="text-gray-300 font-medium">Resolver:</span>{" "}
              Public funding databases (Crunchbase, PitchBook, SEC Form D) plus
              company press releases. Each market specifies its own resolver.
            </li>
            <li>
              <span className="text-gray-300 font-medium">No real money:</span>{" "}
              We publish the question and the model output. We don&rsquo;t
              operate an exchange and we don&rsquo;t hold positions.
            </li>
            <li>
              <span className="text-gray-300 font-medium">Free to mirror:</span>{" "}
              Manifold Markets, Polymarket, Kalshi — anyone can replicate a
              market under the same resolver. We&rsquo;ll link mirrors when
              they go live.
            </li>
          </ul>
          <p className="text-xs text-gray-400 mt-4">
            Methodology:{" "}
            <Link
              href="/markets/methodology"
              className="text-sky-400 hover:underline"
            >
              /markets/methodology
            </Link>
          </p>
        </section>

        <SeoCta signoffIndex={0} className="mt-12" />
      </div>
    </>
  );
}
