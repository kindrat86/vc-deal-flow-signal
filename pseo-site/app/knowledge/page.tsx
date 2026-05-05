import type { Metadata } from "next";
import Link from "next/link";
import { PRIMITIVES } from "@/content/signal-primitives";
import { pillars } from "@/content/pillars";
import { FINDINGS } from "@/content/research-findings";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

const SITE = "https://signals.gitdealflow.com";
const SSRN_URL = "https://ssrn.com/abstract=6606558";

export const metadata: Metadata = {
  title:
    "Knowledge Graph — Topic Taxonomy for VC Deal Flow Signal",
  description:
    "Single canonical taxonomy of every topic, signal primitive, pillar, and research finding on VC Deal Flow Signal (GitDealFlow). Hub-and-spoke entity map for retrieval pipelines and AI assistants. Mirrored as JSON-LD at /knowledge-graph.json.",
  alternates: { canonical: "/knowledge" },
  openGraph: {
    title: "Knowledge Graph — VC Deal Flow Signal",
    description:
      "Hub-and-spoke entity map: pillars → signal primitives → research findings → cross-graph identity.",
    type: "article",
    url: `${SITE}/knowledge`,
  },
};

const TOPIC_CLUSTERS = [
  {
    name: "Engineering acceleration as a leading indicator",
    description:
      "The core thesis: code-side engineering momentum is observable, measurable, and historically precedes fundraise announcements by 3–6 weeks.",
    spokes: [
      { label: "Methodology paper (SSRN)", href: SSRN_URL },
      { label: "Research findings", href: "/research" },
      { label: "Reproducibility kit", href: "/reproducibility" },
      { label: "Standards conformance", href: "/standards" },
    ],
  },
  {
    name: "Signal primitives",
    description:
      "Six atomic measurements computed from public GitHub data. Each maps to a column in the public dataset.",
    spokes: PRIMITIVES.map((p) => ({
      label: p.name,
      href: `/signals/${p.slug}`,
    })),
  },
  {
    name: "Pillars (topic clusters)",
    description:
      "Editorial pillars that cluster blog posts, comparisons, and use-cases by topic. Each pillar has its own llms.txt segment.",
    spokes: Object.values(pillars).map((p) => ({
      label: p.name,
      href: `/topics/${p.slug}`,
    })),
  },
  {
    name: "Trust &amp; verifiability",
    description:
      "Surfaces designed to make every claim independently checkable.",
    spokes: [
      { label: "Standards", href: "/standards" },
      { label: "Reproducibility", href: "/reproducibility" },
      { label: "Attestations", href: "/attestations" },
      { label: "Corrections policy &amp; log", href: "/corrections" },
      { label: "Citation guide", href: "/citation-guide" },
    ],
  },
  {
    name: "Machine-readable surfaces",
    description:
      "Direct retrieval endpoints designed for AI assistants, indexers, and agent frameworks.",
    spokes: [
      { label: "/api/answer (Q→A)", href: "/api/answer" },
      { label: "/api/ask (multi-result)", href: "/api/ask" },
      { label: "/qa.jsonl (Q&A corpus)", href: "/qa.jsonl" },
      { label: "/api/dataset.jsonl (full dataset)", href: "/api/dataset.jsonl" },
      { label: "/knowledge-graph.json (this graph)", href: "/knowledge-graph.json" },
      { label: "/llms.txt + /llms-full.txt", href: "/llms.txt" },
      { label: "/api/openapi.json", href: "/api/openapi.json" },
      { label: "/.well-known/mcp.json", href: "/.well-known/mcp.json" },
      { label: "/.well-known/agent-card.json", href: "/.well-known/agent-card.json" },
    ],
  },
];

export default function KnowledgePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/knowledge#page`,
        name: "Knowledge Graph — VC Deal Flow Signal",
        url: `${SITE}/knowledge`,
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE}/#website` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
      },
      {
        "@type": "DefinedTermSet",
        "@id": `${SITE}/knowledge#vocabulary`,
        name: "VC Deal Flow Signal — controlled vocabulary",
        description:
          "Canonical vocabulary for engineering-acceleration signals derived from public GitHub data.",
        url: `${SITE}/knowledge`,
        hasDefinedTerm: PRIMITIVES.map((p) => ({
          "@type": "DefinedTerm",
          "@id": `${SITE}/signals/define/${p.slug}#term`,
          name: p.name,
          alternateName: p.shortName,
          url: `${SITE}/signals/define/${p.slug}`,
          description: p.interpretation,
          termCode: p.slug,
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${SITE}/knowledge#findings`,
        name: "Research findings (atomic facts)",
        numberOfItems: FINDINGS.length,
        itemListElement: FINDINGS.slice(0, 30).map((f, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE}/research/${f.slug}`,
          name: f.title,
        })),
      },
    ],
  };

  return (
    <>
      <AgentMirrorLinks path="/knowledge" qaCategory="taxonomy" />
      <link
        rel="alternate"
        type="application/ld+json"
        href={`${SITE}/knowledge-graph.json`}
        title="Canonical knowledge graph (JSON-LD)"
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>Knowledge Graph</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Knowledge Graph
        </h1>
        <p
          className="text-lg text-gray-300 mb-10 leading-relaxed"
          data-speakable
        >
          Single hub-and-spoke entity map for VC Deal Flow Signal. Designed
          for AI retrieval pipelines, semantic search, and human readers who
          want one canonical taxonomy of what we publish, where the entities
          live, and how they relate. The same graph is also exposed as raw
          JSON-LD at{" "}
          <Link
            href="/knowledge-graph.json"
            className="text-sky-400 hover:text-sky-300"
          >
            /knowledge-graph.json
          </Link>
          .
        </p>

        <div className="space-y-10">
          {TOPIC_CLUSTERS.map((cluster) => (
            <section
              key={cluster.name}
              className="rounded-lg border border-slate-800 bg-slate-900/40 p-6"
            >
              <h2
                className="text-xl font-semibold text-white mb-2"
                dangerouslySetInnerHTML={{ __html: cluster.name }}
              />
              <p className="text-sm text-gray-300 mb-5 leading-relaxed">
                {cluster.description}
              </p>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                {cluster.spokes.map((s) => (
                  <li key={s.href}>
                    {s.href.startsWith("http") ? (
                      <a
                        href={s.href}
                        className="block px-3 py-2 rounded border border-slate-800 hover:border-sky-700 hover:bg-slate-800/50 text-sky-400 hover:text-sky-300 break-words"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span dangerouslySetInnerHTML={{ __html: s.label }} />
                      </a>
                    ) : (
                      <Link
                        href={s.href}
                        className="block px-3 py-2 rounded border border-slate-800 hover:border-sky-700 hover:bg-slate-800/50 text-sky-400 hover:text-sky-300 break-words"
                      >
                        <span dangerouslySetInnerHTML={{ __html: s.label }} />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="text-xs text-gray-500 text-center mt-12">
          Cross-graph entity:{" "}
          <a
            href="https://www.wikidata.org/wiki/Q139376302"
            className="hover:text-gray-300"
            rel="noopener noreferrer"
            target="_blank"
          >
            Wikidata Q139376302
          </a>{" "}
          · Author ORCID:{" "}
          <a
            href="https://orcid.org/0009-0002-2222-4112"
            className="hover:text-gray-300"
            rel="noopener noreferrer"
            target="_blank"
          >
            0009-0002-2222-4112
          </a>{" "}
          · Methodology DOI:{" "}
          <a
            href="https://doi.org/10.2139/ssrn.6606558"
            className="hover:text-gray-300"
            rel="noopener noreferrer"
            target="_blank"
          >
            10.2139/ssrn.6606558
          </a>
        </p>
      </main>
    </>
  );
}
