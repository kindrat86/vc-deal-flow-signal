import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { HreflangLinks } from "@/components/HreflangLinks";
import { glossaryTerms, type GlossaryTerm } from "@/content/glossary";
import SeoCta from "@/components/SeoCta";
import DefinitionBlock from "@/components/DefinitionBlock";
import CitableStat from "@/components/CitableStat";
import { citableStat } from "@/lib/citable-stats";
import { withEditorialOverride } from "@/lib/metadata";

// CTR hook (GSC 90d: 537 imps, 0 clicks, pos 12.3): old title + suffix
// brand-doubled to 72ch. Count is computed from the content source.
const pageTitle = `VC & Startup Glossary: ${glossaryTerms.length} Terms (Deal Flow, Signals)`;

export const metadata: Metadata = withEditorialOverride({
  title: { absolute: pageTitle },
  description:
    "Definitions of key terms used in startup deal flow signal analysis: commit velocity, engineering acceleration, contributor growth, signal types, and more. A reference for investors using GitHub data for deal sourcing.",
  // hreflang emitted via <HreflangLinks/> in JSX (single source of truth).
  alternates: { canonical: "/glossary" },
});

type Term = GlossaryTerm;

const terms: Term[] = glossaryTerms;

export default function GlossaryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTermSet",
        name: "VC Deal Flow Signal Glossary",
        description:
          "Definitions of key terms used in startup deal flow signal analysis.",
        hasDefinedTerm: terms.map((t) => ({
          "@type": "DefinedTerm",
          name: `What is ${t.term}?`,
          description: t.definition,
          url: `https://signals.gitdealflow.com/glossary#${t.id}`,
          inDefinedTermSet: "https://signals.gitdealflow.com/glossary",
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "All Sectors",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Glossary",
            item: "https://signals.gitdealflow.com/glossary",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://signals.gitdealflow.com/glossary#faq",
        url: "https://signals.gitdealflow.com/glossary",
        inLanguage: "en-US",
        mainEntity: terms.map((t) => ({
          "@type": "Question",
          name: `What is ${t.term}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: t.snippet ?? t.definition,
            url: `https://signals.gitdealflow.com/glossary#${t.id}`,
          },
        })),
      },
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/glossary#webpage",
        url: "https://signals.gitdealflow.com/glossary",
        name: "Glossary, VC Deal Flow Signal Terms & Definitions",
        description:
          "Definitions of key terms used in startup deal flow signal analysis: commit velocity, engineering acceleration, contributor growth, Scout Score, MCP, A2A, llms.txt, AEO, AIO and more.",
        inLanguage: "en-US",
        isPartOf: { "@id": "https://signals.gitdealflow.com/#website" },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [
            "[data-speakable]",
            "h1",
            "h2",
            ".speakable",
            "[data-agent-summary]",
          ],
        },
        relatedLink: [
          "https://signals.gitdealflow.com/methodology",
          "https://signals.gitdealflow.com/faq",
          "https://signals.gitdealflow.com/research",
          "https://signals.gitdealflow.com/citations",
          "https://signals.gitdealflow.com/answers",
          "https://signals.gitdealflow.com/data-sources",
        ],
        significantLink: [
          "https://signals.gitdealflow.com/qa.jsonl",
          "https://signals.gitdealflow.com/llms-full.txt",
          "https://ssrn.com/abstract=6606558",
        ],
      },
      // DefinedTermSet, gives glossary terms a controlled-vocabulary
      // identity that retrieval pipelines can consume independently of the
      // FAQPage. Cross-links matching terms to /signals/[type] so the
      // glossary acts as a hub into the formal signal definitions.
      {
        "@type": "DefinedTermSet",
        "@id": "https://signals.gitdealflow.com/glossary#vocabulary",
        name: "VC Deal Flow Signal, controlled vocabulary",
        description:
          "Canonical definitions of every term used in VC Deal Flow Signal research, methodology, and dashboard. Each term has a stable @id anchor and, where applicable, a cross-link to its formal signal definition.",
        url: "https://signals.gitdealflow.com/glossary",
        inLanguage: "en-US",
        publisher: { "@id": "https://gitdealflow.com/#organization" },
        license: "https://creativecommons.org/licenses/by/4.0/",
        hasDefinedTerm: terms.map((t) => {
          // Map glossary anchors to their formal /signals/[type] pages where
          // a primitive exists. Only terms that map to a signal primitive
          // get the cross-link; the rest are pure glossary entries.
          const signalSlugMap: Record<string, string> = {
            "commit-velocity": "commit-velocity",
            "commit-velocity-change": "commit-velocity-change",
            "engineering-acceleration": "commit-velocity-change",
            "contributor-growth": "contributor-growth",
            "engineering-hiring-burst": "engineering-hiring-burst",
            "framework-migration": "framework-migration",
            "infrastructure-buildout": "infrastructure-buildout",
          };
          const signalSlug = signalSlugMap[t.id];
          return {
            "@type": "DefinedTerm",
            "@id": `https://signals.gitdealflow.com/glossary#${t.id}`,
            name: t.term,
            url: `https://signals.gitdealflow.com/glossary#${t.id}`,
            description: t.definition,
            termCode: t.id,
            inDefinedTermSet: {
              "@id":
                "https://signals.gitdealflow.com/glossary#vocabulary",
            },
            ...(signalSlug
              ? {
                  sameAs: `https://signals.gitdealflow.com/signals/define/${signalSlug}`,
                }
              : {}),
          };
        }),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/glossary"
        languages={getHreflangLanguages("/glossary")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/glossary" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Glossary</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Glossary of Deal Flow Signal Terms
        </h1>
        <DefinitionBlock
          text={`This glossary defines the terms behind VC Deal Flow Signal: commit velocity, engineering acceleration, contributor growth, and the signal types investors read from public GitHub data. Each term links to its formal definition where one exists.`}
        />
        <CitableStat {...citableStat("glossary")} template="glossary" />
        <aside
          className="mb-4 rounded-xl border border-sky-500/25 bg-sky-500/5 px-5 py-4"
          aria-label="At a glance"
        >
          <h2 className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">
            At a glance
          </h2>
          <p className="text-sky-100 text-sm leading-relaxed">
            TL;DR, {glossaryTerms.length} self-contained definitions covering
            one metric family: how public GitHub activity (commit velocity,
            contributor growth, signal types) is turned into an early
            startup-momentum signal for investors.
          </p>
        </aside>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          Key terms used in startup engineering signal analysis. Each
          definition is self-contained, useful for investors evaluating
          GitHub-based deal flow data for the first time.
        </p>

        <section className="mb-10 rounded-2xl border border-cyan-700/30 bg-cyan-950/20 p-6 sm:p-8">
          <p className="text-cyan-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
            Read VC content anywhere · don&rsquo;t come back here for every term
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Install the <strong className="text-gray-100">VC Term Highlighter</strong> Chrome extension. It underlines every term in this glossary, SAFE, ARR, burn multiple, magic number, all {terms.length}, on any article you read. Hover for the definition, click to jump back here. No telemetry, no remote calls.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-500 transition-colors"
            >
              Install the extension →
            </a>
            <Link
              href="/install"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium"
            >
              See all install paths →
            </Link>
          </div>
        </section>


        {/* Quick navigation */}
        <div className="mb-10 flex flex-wrap gap-2">
          {terms.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
            >
              {t.term}
            </a>
          ))}
        </div>

        {/* Definitions */}
        <div className="space-y-6">
          {terms.map((t) => (
            <div
              key={t.id}
              id={t.id}
              className="rounded-lg border border-slate-800 bg-slate-900 p-6 scroll-mt-20"
              itemScope
              itemType="https://schema.org/DefinedTerm"
            >
              <h2
                className="speakable text-gray-100 font-semibold text-lg mb-3"
                itemProp="name"
              >
                What is {t.term}?
              </h2>
              {t.snippet ? (
                <p
                  className="text-gray-200 text-base leading-relaxed mb-2"
                  data-speakable
                >
                  {t.snippet}
                </p>
              ) : null}
              <p
                className="text-gray-400 text-sm leading-relaxed"
                itemProp="description"
                data-speakable
              >
                {t.definition}
              </p>
              {/* Term deep pages (/define/[id]) retired 2026-08-16 (§22);
                  the entry above IS the full entry. Permalink scrolls to
                  the anchored entry and is the shareable/citable URL. */}
              <a
                href={`#${t.id}`}
                className="mt-3 inline-block text-sky-400 text-sm font-medium hover:text-sky-300 transition-colors"
              >
                Permalink to this term →
              </a>
              <link
                itemProp="url"
                href={`https://signals.gitdealflow.com/glossary#${t.id}`}
              />
            </div>
          ))}
        </div>

        {/* Sister hub to the signal primitives (the /define category index
            was retired with the term pages, 2026-08-16 §22). */}
        <p className="mt-10 text-sm text-gray-400">
          Prefer signal deep-dives?{" "}
          <Link
            href="/signals"
            className="text-sky-400 font-medium hover:text-sky-300 transition-colors"
          >
            See the six atomic signals, each formally defined →
          </Link>
        </p>

        {/* CTA */}
        <div className="mt-12">
          <SeoCta
            secondary={{ label: "Browse sectors", href: "/" }}
            signoffIndex={2}
          />
        </div>
      </div>
    </>
  );
}
