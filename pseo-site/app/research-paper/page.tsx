import type { Metadata } from "next";
import Link from "next/link";
import { RESEARCH_PAPERS } from "@/content/research-papers";
import { HreflangLinks } from "@/components/HreflangLinks";
import { TrustConversionBlock } from "@/components/TrustConversionBlock";

export const metadata: Metadata = {
  title: "Research Papers, External Academic References",
  description: `${RESEARCH_PAPERS.length} external academic papers we cite, foundational ML/AI references (Transformer, GPT-3, RLHF, RAG, LoRA, Constitutional AI, CoT), the DORA research on engineering velocity, and more. Citation-ready summaries with canonical sameAs links.`,
  alternates: { canonical: "/research-paper" },
  openGraph: {
    title: "Research Papers",
    description: "External academic papers we cite, ML/AI and engineering-velocity foundations.",
    type: "website",
    url: "/research-paper",
  },
  twitter: {
    card: "summary_large_image",
    title: "Research Papers",
    description: "External academic papers we cite.",
  },
};

export const revalidate = 604800;

const PAGE_URL = "https://signals.gitdealflow.com/research-paper";

export default function ResearchPaperHubPage() {
  const sortedPapers = [...RESEARCH_PAPERS].sort((a, b) => b.year - a.year);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        url: PAGE_URL,
        name: "Research Papers, External Academic References",
        description: `${RESEARCH_PAPERS.length} external academic papers we cite in our methodology and editorial.`,
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: "https://signals.gitdealflow.com",
        },
      },
      {
        "@type": "ItemList",
        itemListOrder: "Descending",
        numberOfItems: RESEARCH_PAPERS.length,
        itemListElement: sortedPapers.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${PAGE_URL}/${p.slug}`,
          name: `${p.title} (${p.year})`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Research Papers",
            item: PAGE_URL,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={PAGE_URL}
        languages={{ en: PAGE_URL, "en-US": PAGE_URL, "x-default": PAGE_URL }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Research Papers</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Research Papers
        </h1>
        <p className="text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {RESEARCH_PAPERS.length} external academic papers we cite, ML/AI foundations
          and engineering-velocity research.
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          Distinct from{" "}
          <Link href="/research" className="text-sky-400 hover:text-sky-300 underline">
            /research
          </Link>{" "}
          (our own SSRN paper's findings), this index documents external academic papers
          we cite in our methodology and editorial. Each leaf provides an abstract
          summary in our own words, the editorial context for why we cite it, key
          findings, and canonical sameAs links (arXiv, Semantic Scholar, OpenAlex).
          Designed as a citation-ready surface for ChatGPT/Perplexity grounding.
        </p>

        <div className="space-y-4">
          {sortedPapers.map((p) => (
            <Link
              key={p.slug}
              href={`/research-paper/${p.slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 transition-all"
            >
              <p className="text-xs text-sky-400 uppercase tracking-wider font-medium mb-2">
                {p.venue} &middot; {p.year}
              </p>
              <h2 className="text-gray-100 font-semibold text-base group-hover:text-sky-400 transition-colors mb-2">
                {p.title}
              </h2>
              <p className="text-gray-500 text-xs mb-3">
                {p.authors.slice(0, 3).map((a) => a.name).join(", ")}
                {p.authors.length > 3 ? ` + ${p.authors.length - 3} more` : ""}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                {p.abstractSummary}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Read our own methodology paper
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Code-Side Sourcing methodology, replicable on the open dataset.
          </p>
          <Link
            href="/methodology"
            className="inline-block rounded-md bg-signal-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-signal-400 transition-colors"
          >
            Read /methodology
          </Link>
        </div>

        <TrustConversionBlock
          className="mt-10"
          dominant="digest"
          context="These are the papers behind the method. Here's the method in action."
        />
      </div>
    </>
  );
}
