import type { Metadata } from "next";
import Link from "next/link";
import { agentQueries } from "@/content/agent-queries";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title: "Answers — Citation-Ready Answers for AI Agents",
  description:
    "Direct, citation-ready answers to the questions AI agents and their users ask most about VC deal flow, GitHub momentum, MCP servers, and engineering signals.",
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
            attribution.
          </p>
        </header>

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
      </div>
    </>
  );
}
