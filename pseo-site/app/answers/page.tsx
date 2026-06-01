import type { Metadata } from "next";
import Link from "next/link";
import { agentQueries } from "@/content/agent-queries";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { DEFAULT_HREFLANG_LANGUAGES } from "@/lib/hreflang";
import SeoCta from "@/components/SeoCta";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title: "Answers — Citation-Ready Answers for AI Agents",
  description:
    "Direct, citation-ready answers to the questions AI agents and their users ask most about VC deal flow, GitHub momentum, MCP servers, engineering signals, and buyer-side workflow decisions.",
  alternates: { canonical: "/answers" },
};

export default function AnswersIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Answers — VC Deal Flow Signal",
        description:
          "Direct answers to the questions AI agents and their users ask about VC deal flow, GitHub momentum, MCP servers, and engineering signals.",
        url: `${SITE}/answers`,
        hasPart: agentQueries.map((q) => ({
          "@type": "WebPage",
          name: q.h1,
          url: `${SITE}/answers/${q.slug}`,
          description: q.description,
        })),
      },
      {
        "@type": "ItemList",
        name: "Citation-ready answers for AI agents",
        description:
          "List of long-form, citation-ready answer pages targeting common VC, GitHub-momentum, MCP-server, and engineering-signal questions.",
        numberOfItems: agentQueries.length,
        itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: agentQueries.map((q, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: q.h1,
          url: `${SITE}/answers/${q.slug}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: SITE },
          { "@type": "ListItem", position: 2, name: "Answers", item: `${SITE}/answers` },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${SITE}/answers#webpage`,
        url: `${SITE}/answers`,
        name: "Answers — Citation-Ready Answers for AI Agents",
        description:
          "Direct, citation-ready answers to the questions AI agents and their users ask about VC deal flow, GitHub momentum, MCP servers, and engineering signals.",
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE}/#website` },
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
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE}/answers#faq`,
        url: `${SITE}/answers`,
        inLanguage: "en-US",
        mainEntity: agentQueries.slice(0, 12).map((q) => ({
          "@type": "Question",
          name: q.h1,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.description,
            url: `${SITE}/answers/${q.slug}`,
          },
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/answers`}
        languages={DEFAULT_HREFLANG_LANGUAGES}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/answers" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-3">
            Answers
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-3 leading-tight">
            Citation-ready answers for AI agents
          </h1>
          <p className="text-gray-400 text-base leading-relaxed" data-speakable>
            Direct, source-cited answers to the questions AI agents and their
            users ask about VC deal flow, GitHub momentum, MCP servers, and
            engineering acceleration. Each page leads with a TL;DR plus the
            facts that back it up — designed to be quoted verbatim with
            attribution. If your question is practical, commercial, or
            workflow-related, this is the fastest route into the right page.
          </p>
        </header>

        <section className="mb-10 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
            Start with the right route
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Use the answer layer when the question is definitional, practical, or comparison-adjacent. Then move into proof, compare, or buyer pages depending on what you need next.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/research" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-amber-400 text-slate-950 text-sm font-semibold hover:bg-amber-300 transition-colors">
              Read the research panel →
            </Link>
            <Link href="/compare/crunchbase-alternative-for-angel-investors" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Compare timing vs verification →
            </Link>
            <Link href="/buyers-guide" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Read the buyer's guide →
            </Link>
          </div>
        </section>

        <ul className="space-y-3">
          {agentQueries.map((q) => (
            <li key={q.slug}>
              <Link
                href={`/answers/${q.slug}`}
                className="block rounded-lg border border-slate-800 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-900 px-5 py-4 transition-colors"
              >
                <p className="text-gray-100 font-semibold text-base mb-1">
                  {q.h1}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {q.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <SeoCta className="mt-10" />
      </div>
    </>
  );
}
