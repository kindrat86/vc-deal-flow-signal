import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  RESEARCH_PAPERS,
  getAllResearchPaperSlugs,
  getResearchPaper,
} from "@/content/research-papers";
import { glossaryTerms } from "@/content/glossary";
import { getSector } from "@/content/sectors";
import { researchPaperLeafIndexable } from "@/content/research-paper-policy";
import { HreflangLinks } from "@/components/HreflangLinks";
import SeoCta from "@/components/SeoCta";
import RelatedLinks from "@/components/RelatedLinks";
import DefinitionBlock from "@/components/DefinitionBlock";
import { getRelatedGroups } from "@/lib/related-links";
import CitableStat from "@/components/CitableStat";
import { citableStat } from "@/lib/citable-stats";

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
    // `absolute` bypasses the "| VC Deal Flow Signal" template suffix. The
    // research-paper leaves serve a scholarly/technical audience searching for
    // paper names (RAG, LoRA, InstructGPT, …), where a VC-branded suffix is a
    // CTR deterrent: the exact audience we lose to zero-click skips at 0% CTR.
    title: { absolute: p.metaTitle },
    description: p.metaDescription,
    openGraph: { title: p.metaTitle, description: p.metaDescription, type: "article", url: `/research-paper/${slug}` },
    twitter: { card: "summary_large_image", title: p.metaTitle, description: p.metaDescription },
    alternates: { canonical: `/research-paper/${slug}` },
    // §54: data-driven noindex (content/research-paper-policy.ts). Inert while
    // decision = "retain"; the evaluator cron flips it on the pre-registered
    // post-lede CTR rule (>= 3000 imps AND < 0.20% CTR). noindex,follow with
    // self-canonical: unique content, link equity keeps flowing to siblings.
    robots: researchPaperLeafIndexable(slug)
      ? { index: true, follow: true }
      : { index: false, follow: true },
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
  const relatedSectors = paper.relatedSectors
    .map((slug) => {
      const s = getSector(slug);
      return s ? { slug, name: s.name } : null;
    })
    .filter((x): x is { slug: string; name: string } => x !== null);

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

        {/* Investor-angle lede (search-intent fix 2026-08-16). GSC 90d: these
            pages drew ~19K impressions at ~0 clicks on citation-hunter queries
            (author-year-venue strings, "bibtex", "pages 1877-1901"), so the
            arriving audience is ML researchers, not our ICP. Two changes:
            (1) the ICP that does land gets an investor frame in the first
            screenful instead of below the fold; (2) the researcher still gets
            the paper facts. Investor voice is grounded in the paper's
            ourContext, no invented claims. */}
        <aside
          className="mb-8 rounded-xl border border-signal-500/30 bg-signal-500/5 p-5 sm:p-6"
          aria-label="Why investors care"
        >
          <p className="text-signal-400 text-xs uppercase tracking-wider font-semibold mb-2">
            Why investors care
          </p>
          <p className="text-gray-200 text-sm leading-relaxed">
            {paper.investorAngle}
          </p>
        </aside>

        <CitableStat {...citableStat("research-paper")} template="research-paper" />

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

        {/* Quotable direct answer (2026-08-17, audit win #3 striking-distance
            push). The research-paper cluster holds ~20K impressions/28d at
            position 8-10 with near-zero clicks; the one element every
            snippet/AIO study rewards, a self-contained 40-60 word answer
            lifted verbatim, was missing from the head. Renders ABOVE the
            abstract; the abstract paragraph below stays plain prose.
            Pinned by verify-no-regressions §65 (render) and the 40-60w
            window check on every paper.definition. */}
        <DefinitionBlock text={paper.definition} label="What this paper is" />

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
          {/* data-direct-answer moved to the DefinitionBlock above (single
              extraction anchor per page; the abstract is supporting prose). */}
          <p className="text-gray-400 text-sm leading-relaxed">
            {paper.abstractSummary}
          </p>
          <p className="text-gray-500 text-xs mt-3 italic">
            Our summary in our own words, see the canonical source links below for the
            original abstract.
          </p>
        </section>

        <section className="mb-10" aria-label="Our context">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            Why we cite this paper
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">{paper.ourContext}</p>
        </section>

        {relatedSectors.length > 0 && (
          <section className="mb-10" aria-label="Related sectors">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Where this matters for deal flow
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedSectors.map((s) => (
                <Link
                  key={s.slug}
                  href={`/sector/${s.slug}`}
                  className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-gray-300 hover:border-slate-600 hover:text-sky-400 transition-all"
                >
                  {s.name} sector
                </Link>
              ))}
            </div>
          </section>
        )}

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
                  href={`/glossary#${g.id}`}
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

        {/* Sector-aware CTA (search-intent fix 2026-08-16): the old generic
            digest block wasted the warmest moment on the page (an investor who
            just read why the paper matters). Route to the deal-flow surface
            the paper actually informs, then keep the digest capture below. */}
        {relatedSectors.length > 0 && (
          <section
            className="mb-8 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8"
            aria-label="Apply this to deal flow"
          >
            <h2 className="text-gray-100 font-semibold text-lg mb-2 leading-snug">
              See who is building on this, before the round prices it in
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-2xl">
              We track engineering acceleration across the{" "}
              {relatedSectors.map((s) => s.name).join(" and ")} sector
              {relatedSectors.length > 1 ? "s" : ""} this paper informs: commit
              velocity, contributor influx, and repo-creation pulse, surfacing
              breakout teams 21 to 47 days before the fundraise is public.
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
              {relatedSectors.map((s) => (
                <Link
                  key={s.slug}
                  href={`/sector/${s.slug}`}
                  className="inline-block rounded-md bg-signal-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-signal-400 transition-colors"
                >
                  {s.name} sector →
                </Link>
              ))}
            </div>
          </section>
        )}

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

        <RelatedLinks groups={getRelatedGroups(`/research-paper/${slug}`)} heading="Related papers" />
      </div>
    </>
  );
}
