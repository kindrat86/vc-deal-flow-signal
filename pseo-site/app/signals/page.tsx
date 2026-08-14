import type { Metadata } from "next";
import Link from "next/link";
import { PRIMITIVES } from "@/content/signal-primitives";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { HreflangLinks } from "@/components/HreflangLinks";
import SeoCta from "@/components/SeoCta";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title: "Signal Vocabulary, Every Primitive Defined &amp; Linked",
  description:
    "The six atomic signal primitives VC Deal Flow Signal computes from public GitHub data, commit velocity, commit velocity change, contributor growth, engineering hiring burst, framework migration, infrastructure buildout. Each links to its formula, decision rule, common pitfall, and the empirical findings that depend on it.",
  // hreflang emitted via <HreflangLinks/> in JSX (single source of truth).
  alternates: { canonical: "/signals" },
  openGraph: {
    title: "Signal Vocabulary",
    description:
      "Six atomic signal primitives. Formula + decision rule + pitfall + linked findings for each.",
    type: "article",
    url: `${SITE}/signals`,
  },
};

export default function SignalsIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}/signals#page`,
        name: "Signal vocabulary",
        url: `${SITE}/signals`,
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE}/#website` },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE}/signals#list`,
        numberOfItems: PRIMITIVES.length,
        itemListElement: PRIMITIVES.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE}/signals/define/${p.slug}`,
          name: p.name,
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/signals`}
        languages={getHreflangLanguages("/signals")}
      />
      <AgentMirrorLinks path="/signals" qaCategory="signal-definition" />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>Signals</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Signal Vocabulary
        </h1>
        <p
          className="text-lg text-gray-300 mb-10 leading-relaxed"
          data-speakable
        >
          The six atomic signal primitives. Each one is a single, well-defined
          measurement on public GitHub data with a stated formula, a stated
          decision rule, and the most common way it can mislead someone who
          skips the methodology. If you already care more about proof, comparison,
          or buyer-side fit than definitions, start with the sharper routes below.
        </p>

        <section className="mb-10 rounded-2xl border border-sky-700/30 bg-sky-950/20 p-6 sm:p-8">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
            Start with the highest-intent routes
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Use the signal vocabulary when you want definitions. But if your real question is proof, timing, or how the signal fits an investing workflow, start with the sharper pages first.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/research" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-signal-500 text-slate-950 text-sm font-semibold hover:bg-signal-600 transition-colors">
              Read the research panel →
            </Link>
            <Link href="/answers/deal-flow-timing-vs-verification" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Timing vs verification →
            </Link>
            <Link href="/buyers-guide" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Read the buyer's guide →
            </Link>
          </div>
        </section>

        <ul className="grid sm:grid-cols-2 gap-4">
          {PRIMITIVES.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/signals/define/${p.slug}`}
                className="block rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 hover:border-slate-700 p-5 transition-colors h-full"
              >
                <p className="text-xs text-sky-400 font-mono mb-1">
                  {p.shortName}
                </p>
                <h2 className="text-base font-semibold text-white mb-2">
                  {p.name}
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed mb-2">
                  Window: {p.window}
                </p>
                <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                  {p.interpretation}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        {/* In-body editorial cross-links, moves PageRank to high-value
            destinations and helps Yandex / Google escape the "low-value"
            classifier on signal-adjacent pages (2026-05-02 audit). */}
        <section className="mt-12 rounded-lg border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-base font-semibold text-white mb-3">
            Where these primitives show up in practice
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            Each primitive feeds at least one of the workflows below.
            Decision rules, attribution chains, and reproducibility steps
            are documented in the linked pages.
          </p>
          <ul className="grid sm:grid-cols-2 gap-3 text-sm">
            <li>
              <Link
                href="/weekly"
                className="block rounded border border-slate-800 bg-slate-950 p-3 hover:border-slate-600 hover:bg-slate-900 transition-colors"
              >
                <span className="block text-white font-medium mb-0.5">
                  Weekly leaderboard &rarr;
                </span>
                <span className="text-xs text-gray-400 leading-relaxed">
                  Top 10 momentum movers ranked by commit-velocity change.
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/signal-of-the-week"
                className="block rounded border border-slate-800 bg-slate-950 p-3 hover:border-slate-600 hover:bg-slate-900 transition-colors"
              >
                <span className="block text-white font-medium mb-0.5">
                  Signal of the week &rarr;
                </span>
                <span className="text-xs text-gray-400 leading-relaxed">
                  Single sharpest break this week with the 14-day chart.
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/research"
                className="block rounded border border-slate-800 bg-slate-950 p-3 hover:border-slate-600 hover:bg-slate-900 transition-colors"
              >
                <span className="block text-white font-medium mb-0.5">
                  30 research findings &rarr;
                </span>
                <span className="text-xs text-gray-400 leading-relaxed">
                  Each finding cites which primitive it depends on.
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/reproducibility"
                className="block rounded border border-slate-800 bg-slate-950 p-3 hover:border-slate-600 hover:bg-slate-900 transition-colors"
              >
                <span className="block text-white font-medium mb-0.5">
                  Reproducibility &rarr;
                </span>
                <span className="text-xs text-gray-400 leading-relaxed">
                  Step-by-step HowTo to re-derive every primitive on the
                  public dataset.
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/standards"
                className="block rounded border border-slate-800 bg-slate-950 p-3 hover:border-slate-600 hover:bg-slate-900 transition-colors"
              >
                <span className="block text-white font-medium mb-0.5">
                  Standards alignment &rarr;
                </span>
                <span className="text-xs text-gray-400 leading-relaxed">
                  Which W3C / IETF / schema.org specs each primitive
                  conforms to.
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/attestations"
                className="block rounded border border-slate-800 bg-slate-950 p-3 hover:border-slate-600 hover:bg-slate-900 transition-colors"
              >
                <span className="block text-white font-medium mb-0.5">
                  Attestations &rarr;
                </span>
                <span className="text-xs text-gray-400 leading-relaxed">
                  Every claim made on this page has a ClaimReview record.
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/alternatives"
                className="block rounded border border-slate-800 bg-slate-950 p-3 hover:border-slate-600 hover:bg-slate-900 transition-colors"
              >
                <span className="block text-white font-medium mb-0.5">
                  Alternatives &rarr;
                </span>
                <span className="text-xs text-gray-400 leading-relaxed">
                  How Harmonic / Forager / Beacon compute (or don&rsquo;t
                  compute) the same primitives.
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="block rounded border border-slate-800 bg-slate-950 p-3 hover:border-slate-600 hover:bg-slate-900 transition-colors"
              >
                <span className="block text-white font-medium mb-0.5">
                  FAQ &rarr;
                </span>
                <span className="text-xs text-gray-400 leading-relaxed">
                  Common edge cases: vendored code, monorepos, generated
                  files, branch noise.
                </span>
              </Link>
            </li>
          </ul>
        </section>

        <SeoCta signoffIndex={4} className="mt-12" />

        <p className="text-xs text-gray-400 text-center mt-10">
          See also:{" "}
          <Link href="/knowledge" className="hover:text-gray-300">
            Knowledge graph
          </Link>{" "}
          ·{" "}
          <Link href="/glossary" className="hover:text-gray-300">
            Glossary
          </Link>{" "}
          ·{" "}
          <Link href="/methodology" className="hover:text-gray-300">
            Methodology
          </Link>{" "}
          ·{" "}
          <Link href="/citation-guide" className="hover:text-gray-300">
            Citation guide
          </Link>{" "}
          ·{" "}
          <Link href="/corrections" className="hover:text-gray-300">
            Corrections
          </Link>
        </p>
      </div>
    </>
  );
}
