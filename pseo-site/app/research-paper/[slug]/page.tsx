import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  RESEARCH_PAPERS,
  getAllResearchPaperSlugs,
  getResearchPaper,
} from "@/content/research-papers";
import { glossaryTerms } from "@/content/glossary";
import { HreflangLinks } from "@/components/HreflangLinks";
import SeoCta from "@/components/SeoCta";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllResearchPaperSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const p = getResearchPaper(slug);
  if (!p) return {};

  return {
    title: p.metaTitle,
    description: p.metaDescription,
    openGraph: { title: p.metaTitle, description: p.metaDescription, type: "article", url: `/research-paper/${slug}` },
    twitter: { card: "summary_large_image", title: p.metaTitle, description: p.metaDescription },
    alternates: { canonical: `/research-paper/${slug}` },
  };
}

export default async function ResearchPaperPage({ params }: PageProps) {
  const { slug } = await params;
  const paper = getResearchPaper(slug);

  if (!paper) {
    notFound();
  }

  const pageUrl = `https://signals.gitdealflow.com/research-paper/${slug}`;
  const otherPapers = RESEARCH_PAPERS.filter((o) => o.slug !== slug).slice(0, 6);
  const relatedTerms = glossaryTerms.filter((g) =>
    paper.relatedGlossaryIds.includes(g.id),
  );

  const authorAffiliations = Array.from(
    new Set(paper.authors.map((a) => a.affiliation).filter(Boolean)),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ScholarlyArticle",
        headline: paper.title,
        name: paper.title,
        description: paper.abstractSummary,
        datePublished: `${paper.year}-01-01`,
        author: paper.authors.map((a) => ({
          "@type": "Person",
          name: a.name,
          ...(a.affiliation
            ? {
                affiliation: {
                  "@type": "Organization",
                  name: a.affiliation,
                },
              }
            : {}),
        })),
        publisher: {
          "@type": "Organization",
          name: paper.venue,
        },
        sameAs: paper.sameAs,
        ...(paper.doi ? { identifier: [{ "@type": "PropertyValue", propertyID: "DOI", value: paper.doi }] } : {}),
        url: pageUrl,
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
            item: "https://signals.gitdealflow.com/research-paper",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: paper.title,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: paper.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={pageUrl}
        languages={{ en: pageUrl, "en-US": pageUrl, "x-default": pageUrl }}
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
          <Link href="/research-paper" className="hover:text-gray-300 transition-colors">
            Research Papers
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{paper.title}</span>
        </nav>

        <p className="text-sky-400 text-xs uppercase tracking-wider font-medium mb-3">
          {paper.venue} &middot; {paper.year}
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          {paper.title}
        </h1>
        <p className="text-gray-300 text-sm leading-relaxed mb-3">
          {paper.authors.map((a) => a.name).join(", ")}
        </p>
        {authorAffiliations.length > 0 && (
          <p className="text-gray-500 text-xs leading-relaxed mb-6">
            {authorAffiliations.join(" · ")}
          </p>
        )}

        {/* Read the paper.
            These pages rank on page 1 for the papers themselves and drew 17,884
            impressions in 28 days at a 0.02% CTR -- they promised a summary and
            offered no route to the source. The arxiv/doi/sameAs fields were
            already in content/research-papers.ts; nothing rendered them. */}
        {(paper.arxiv || paper.doi || paper.sameAs?.length > 0) && (
          <div className="mb-10 flex flex-wrap items-center gap-3 text-sm">
            <span className="text-gray-500">Read the paper:</span>
            {paper.arxiv && (
              <a
                href={`https://arxiv.org/abs/${paper.arxiv}`}
                rel="noopener"
                className="text-sky-400 underline underline-offset-2 hover:text-sky-300 transition-colors"
              >
                arXiv:{paper.arxiv}
              </a>
            )}
            {paper.doi && (
              <a
                href={`https://doi.org/${paper.doi}`}
                rel="noopener"
                className="text-sky-400 underline underline-offset-2 hover:text-sky-300 transition-colors"
              >
                DOI
              </a>
            )}
            {paper.semanticScholar && (
              <a
                href={`https://www.semanticscholar.org/paper/${paper.semanticScholar}`}
                rel="noopener"
                className="text-sky-400 underline underline-offset-2 hover:text-sky-300 transition-colors"
              >
                Semantic Scholar
              </a>
            )}
          </div>
        )}

        <section className="mb-10" aria-label="Abstract summary">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">Abstract summary</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {paper.abstractSummary}
          </p>
          <p className="text-gray-500 text-xs mt-3 italic">
            Our summary in our own words — see the canonical source links below for the
            original abstract.
          </p>
        </section>

        <section className="mb-10" aria-label="Our context">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            Why we cite this paper
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">{paper.ourContext}</p>
        </section>

        <section className="mb-10" aria-label="Key findings">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Key findings</h2>
          <ul className="space-y-3">
            {paper.keyFindings.map((finding, i) => (
              <li
                key={i}
                className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-gray-300 text-sm leading-relaxed flex items-start gap-3"
              >
                <span className="rounded-full bg-sky-950 text-sky-300 text-xs font-mono w-6 h-6 flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10" aria-label="Canonical sources">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Canonical sources</h2>
          <div className="space-y-2">
            {paper.sameAs.map((url) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-slate-800 bg-slate-900 p-3 text-sky-400 hover:text-sky-300 hover:border-sky-900/50 text-sm font-mono break-all transition-all"
              >
                {url}
              </a>
            ))}
          </div>
        </section>

        {relatedTerms.length > 0 && (
          <section className="mb-10" aria-label="Related glossary terms">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Related glossary terms
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedTerms.map((g) => (
                <Link
                  key={g.id}
                  href={`/define/${g.id}`}
                  className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-gray-300 hover:border-slate-600 hover:text-sky-400 transition-all"
                >
                  {g.term}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-12" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {paper.faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-lg border border-slate-800 bg-slate-900"
              >
                <summary className="cursor-pointer p-5 text-gray-100 font-medium flex items-center justify-between">
                  {faq.question}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform ml-2">
                    &#9662;
                  </span>
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <SeoCta className="mb-12" />

        <section className="mb-12" aria-label="Other research papers">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Other research papers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherPapers.map((o) => (
              <Link
                key={o.slug}
                href={`/research-paper/${o.slug}`}
                className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
              >
                <p className="text-xs text-sky-400 mb-1">
                  {o.venue} &middot; {o.year}
                </p>
                <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                  {o.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
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
      </div>
    </>
  );
}
