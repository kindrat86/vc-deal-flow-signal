import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FINDINGS, getFindingBySlug, getAllFindingSlugs } from "@/content/research-findings";
import { getJaFindingBySlug } from "@/content/ja-research";
import { getDataLastModified } from "@/lib/data";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";

const SITE = "https://signals.gitdealflow.com";
const SSRN_URL = "https://ssrn.com/abstract=6606558";
const PAPER_TITLE =
  "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllFindingSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const finding = getFindingBySlug(slug);
  if (!finding) return {};

  const title = `${finding.title} — VC Deal Flow Signal Research`;
  const description = `${finding.claim} ${finding.why} From the SSRN-indexed methodology paper by VC Deal Flow Signal (GitDealFlow): ${PAPER_TITLE}. Section ${finding.section}.`;

  // hreflang emitted via <HreflangLinks/> in the page body (Next 16 +
  // explicit <head> in layout double-emit when both metadata + JSX set it).
  return {
    title,
    description,
    alternates: { canonical: `/research/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE}/research/${slug}`,
      images: [{ url: `${SITE}/api/og/signal-card`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE}/api/og/signal-card`],
    },
    // Highwire Press / Google Scholar citation tags. These are the de-facto
    // standard meta tags Scholar uses to detect academic papers; emitting
    // them on each finding page lets Scholar index every sub-finding as a
    // citable subdivision of the SSRN paper.
    other: {
      citation_title: PAPER_TITLE,
      citation_author: "The Data Nerd",
      citation_publication_date: "2026/04/24",
      citation_journal_title: "SSRN Electronic Journal",
      citation_publisher: "Social Science Research Network",
      citation_doi: "10.2139/ssrn.6606558",
      citation_abstract_html_url: SSRN_URL,
      citation_pdf_url: "https://papers.ssrn.com/sol3/Delivery.cfm/SSRN_ID6606558_code1234567.pdf",
      citation_online_date: "2026/04/24",
      citation_language: "en",
      citation_keywords:
        "venture capital; alternative data; GitHub; commit velocity; engineering acceleration; deal flow",
      citation_section: finding.section,
      "DC.title": finding.title,
      "DC.creator": "The Data Nerd",
      "DC.identifier": `doi:10.2139/ssrn.6606558`,
      "DC.publisher": "VC Deal Flow Signal (GitDealFlow)",
      "DC.subject":
        "venture capital, alternative data, GitHub commit velocity, engineering acceleration",
      "DC.rights": "Creative Commons Attribution 4.0 International",
    },
  };
}

const GROUP_LABELS: Record<"A" | "B" | "C", string> = {
  A: "Numerical finding",
  B: "Methodology / structural",
  C: "Open question",
};

export default async function ResearchFindingPage({ params }: PageProps) {
  const { slug } = await params;
  const finding = getFindingBySlug(slug);
  if (!finding) notFound();

  // Adjacent findings for prev/next nav
  const idx = FINDINGS.findIndex((f) => f.slug === slug);
  const prev = idx > 0 ? FINDINGS[idx - 1] : null;
  const next = idx < FINDINGS.length - 1 ? FINDINGS[idx + 1] : null;

  // Cross-finding citations: every finding is part of the same SSRN paper, so
  // they cite each other. Building this graph at render time turns
  // `/research/*` from a flat list into a connected knowledge subgraph that
  // AI retrieval engines can traverse.
  const siblingCitations = FINDINGS.filter((f) => f.slug !== slug)
    .slice(0, 12)
    .map((f) => ({
      "@type": "ScholarlyArticle",
      "@id": `${SITE}/research/${f.slug}#article`,
      headline: f.title,
      name: f.title,
      url: `${SITE}/research/${f.slug}`,
      isPartOf: {
        "@type": "ScholarlyArticle",
        "@id": SSRN_URL,
        url: SSRN_URL,
      },
    }));

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "@id": `${SITE}/research/${slug}#article`,
    headline: finding.title,
    name: finding.title,
    description: finding.claim,
    abstract: finding.why,
    isPartOf: {
      "@type": "ScholarlyArticle",
      "@id": SSRN_URL,
      headline: PAPER_TITLE,
      url: SSRN_URL,
    },
    citation: [
      {
        "@type": "ScholarlyArticle",
        "@id": SSRN_URL,
        headline: PAPER_TITLE,
        url: SSRN_URL,
        identifier: [
          { "@type": "PropertyValue", propertyID: "DOI", value: "10.2139/ssrn.6606558" },
          { "@type": "PropertyValue", propertyID: "OpenAlex", value: "W7154916891" },
          { "@type": "PropertyValue", propertyID: "SSRN", value: "6606558" },
          { "@type": "PropertyValue", propertyID: "Semantic Scholar", value: "4dd7b11e79757f68e0c4107252514cbfdfbb0462" },
          { "@type": "PropertyValue", propertyID: "Semantic Scholar Corpus ID", value: "287646103" },
          { "@type": "PropertyValue", propertyID: "Zenodo", value: "10.5281/zenodo.19650920" },
        ],
        sameAs: [
          SSRN_URL,
          "https://openalex.org/works/W7154916891",
          "https://zenodo.org/records/19650920",
          "https://api.crossref.org/works/10.2139/ssrn.6606558",
          "https://www.semanticscholar.org/paper/4dd7b11e79757f68e0c4107252514cbfdfbb0462",
          "https://www.connectedpapers.com/main/4dd7b11e79757f68e0c4107252514cbfdfbb0462",
          "https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal",
        ],
      },
      ...siblingCitations,
    ],
    citationCount: siblingCitations.length + 1,
    author: {
      "@type": "Person",
      "@id": `${SITE}/about#author`,
      name: "The Data Nerd",
      url: `${SITE}/about`,
      sameAs: [
        "https://orcid.org/0009-0002-2222-4112",
        "https://x.com/data_nerd",
        "https://github.com/kindrat86",
      ],
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://gitdealflow.com/#organization",
      name: "VC Deal Flow Signal",
      alternateName: "GitDealFlow",
      url: "https://gitdealflow.com",
      sameAs: ["https://www.wikidata.org/wiki/Q139376302"],
    },
    reviewedBy: {
      "@type": "Organization",
      "@id": "https://gitdealflow.com/#organization",
      name: "VC Deal Flow Signal Editorial",
      url: "https://gitdealflow.com",
    },
    editor: {
      "@type": "Organization",
      "@id": "https://gitdealflow.com/#organization",
      name: "VC Deal Flow Signal Editorial",
      url: `${SITE}/about`,
    },
    accountablePerson: {
      "@type": "Person",
      "@id": `${SITE}/about#person`,
      name: "The Data Nerd",
      url: `${SITE}/about`,
      sameAs: ["https://orcid.org/0009-0002-2222-4112"],
    },
    creditText: `The Data Nerd, "${PAPER_TITLE}", VC Deal Flow Signal (GitDealFlow), 2026, DOI 10.2139/ssrn.6606558, CC BY 4.0.`,
    copyrightHolder: { "@id": "https://gitdealflow.com/#organization" },
    copyrightYear: 2026,
    sdPublisher: { "@id": "https://gitdealflow.com/#organization" },
    sdLicense: "https://creativecommons.org/licenses/by/4.0/",
    sdDatePublished: "2026-04-19",
    // Provenance + verifiability surfaces. Each one is independently
    // checkable and gives an E-E-A-T-aware crawler a direct path from this
    // claim to the standards we follow, the data we used, and the third
    // parties that have indexed our work.
    subjectOf: [
      {
        "@type": "WebPage",
        name: "Standards conformance",
        url: `${SITE}/standards`,
      },
      {
        "@type": "WebPage",
        name: "Reproducibility kit",
        url: `${SITE}/reproducibility`,
      },
      {
        "@type": "WebPage",
        name: "Third-party attestations",
        url: `${SITE}/attestations`,
      },
      {
        "@type": "WebPage",
        name: "Corrections policy and log",
        url: `${SITE}/corrections`,
      },
    ],
    isBasedOn: [
      {
        "@type": "Dataset",
        "@id": `${SITE}/api/dataset.jsonl#dataset`,
        name: "VC Deal Flow Signal — public signals dataset",
        description:
          "Public weekly panel of GitHub-derived engineering signals across 20+ startup sectors. Each NDJSON record encodes commit-velocity rank, contributor growth, infrastructure-buildout flags, and sector-relative momentum for one startup-week. Source for every research finding on this site. CC BY 4.0.",
        url: `${SITE}/api/dataset.jsonl`,
        license: "https://creativecommons.org/licenses/by/4.0/",
      },
      {
        "@type": "ScholarlyArticle",
        "@id": SSRN_URL,
        url: SSRN_URL,
      },
    ],
    datePublished: "2026-04-19",
    dateModified: getDataLastModified().toISOString().slice(0, 10),
    inLanguage: "en",
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    url: `${SITE}/research/${slug}`,
    keywords:
      "venture capital, alternative data, GitHub, engineering velocity, startup analytics, panel data, GitDealFlow",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE}/research/${slug}`,
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE}/research/${slug}#faq`,
    url: `${SITE}/research/${slug}`,
    inLanguage: "en-US",
    mainEntity: [
      {
        "@type": "Question",
        name: finding.title.endsWith("?") ? finding.title : `${finding.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${finding.claim} ${finding.why} Source: ${finding.section}, "${PAPER_TITLE}" (SSRN abstract=6606558, CC BY 4.0).`,
          url: `${SITE}/research/${slug}`,
        },
      },
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Research", item: `${SITE}/research` },
      { "@type": "ListItem", position: 3, name: finding.title, item: `${SITE}/research/${slug}` },
    ],
  };

  const speakableJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: finding.title,
    url: `${SITE}/research/${slug}`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[data-speakable]", "h1", "[data-claim]"],
    },
  };

  // ClaimReview — only for group A (numerical) findings, since these state a
  // discrete factual claim that an answer engine may want to verify. Group B
  // (methodology / structural) and group C (open questions) are excluded.
  const claimReviewJsonLd =
    finding.group === "A"
      ? {
          "@context": "https://schema.org",
          "@type": "ClaimReview",
          "@id": `${SITE}/research/${slug}#claim`,
          url: `${SITE}/research/${slug}`,
          datePublished: "2026-04-19",
          inLanguage: "en",
          claimReviewed: finding.claim,
          itemReviewed: {
            "@type": "Claim",
            datePublished: "2026-04-19",
            appearance: SSRN_URL,
            firstAppearance: SSRN_URL,
            author: {
              "@type": "Person",
              name: "The Data Nerd",
              url: `${SITE}/about`,
              sameAs: ["https://orcid.org/0009-0002-2222-4112"],
            },
          },
          author: {
            "@type": "Organization",
            name: "VC Deal Flow Signal",
            url: "https://gitdealflow.com",
            sameAs: ["https://www.wikidata.org/wiki/Q139376302"],
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: 5,
            bestRating: 5,
            alternateName: "Verified — derived from SSRN-indexed methodology paper",
          },
        }
      : null;

  // Reciprocal hreflang. Only emit ja alternate if a translation exists.
  const enUrlForFinding = `${SITE}/research/${slug}`;
  const hreflangMap: Record<string, string> = {
    en: enUrlForFinding,
    "en-US": enUrlForFinding,
    "x-default": enUrlForFinding,
  };
  if (getJaFindingBySlug(slug)) {
    hreflangMap.ja = `${SITE}/ja/research/${slug}`;
  }

  return (
    <>
      <HreflangLinks
        canonical={enUrlForFinding}
        languages={hreflangMap}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {claimReviewJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(claimReviewJsonLd) }}
        />
      )}
      <AgentMirrorLinks path={`/research/${slug}`} qaCategory="research-finding" />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/research" className="hover:text-gray-300 transition-colors">
            Research
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Finding {finding.n}</span>
        </nav>

        <header className="mb-10">
          <p className="text-sky-400 text-xs font-semibold mb-3 uppercase tracking-wider">
            Finding {finding.n} of 30 · {GROUP_LABELS[finding.group]}
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold text-gray-100 mb-5 leading-tight"
            data-speakable
          >
            {finding.title}
          </h1>
          <p className="text-xs text-gray-500">
            From{" "}
            <a
              className="text-sky-400 hover:text-sky-300"
              href={SSRN_URL}
              target="_blank"
              rel="noopener"
            >
              {PAPER_TITLE} (SSRN)
            </a>
            , section {finding.section}. CC BY 4.0.
          </p>
        </header>

        <section className="mb-10 rounded-xl border border-sky-500/25 bg-sky-500/5 px-6 py-5">
          <p className="text-sky-300 text-xs uppercase tracking-wider font-semibold mb-3">
            The finding
          </p>
          <p
            className="text-gray-100 text-base sm:text-lg leading-relaxed"
            data-claim
          >
            {finding.claim}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-100 mb-3">
            Why it matters
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            {finding.why}
          </p>
        </section>

        <section className="mb-10 rounded-lg border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-3">
            Provenance
          </h2>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>
              <strong className="text-gray-200">Paper:</strong>{" "}
              <a
                className="text-sky-400 hover:text-sky-300"
                href={SSRN_URL}
                target="_blank"
                rel="noopener"
              >
                {PAPER_TITLE}
              </a>{" "}
              — SSRN abstract 6606558.
            </li>
            <li>
              <strong className="text-gray-200">Section:</strong>{" "}
              {finding.section}
            </li>
            <li>
              <strong className="text-gray-200">Dataset DOI:</strong>{" "}
              <a
                className="text-sky-400 hover:text-sky-300"
                href="https://doi.org/10.5281/zenodo.19650920"
                target="_blank"
                rel="noopener"
              >
                10.5281/zenodo.19650920
              </a>
            </li>
            <li>
              <strong className="text-gray-200">License:</strong> CC BY 4.0 —
              free for any use with attribution.
            </li>
            <li>
              <strong className="text-gray-200">Author:</strong> The Data Nerd
              (ORCID{" "}
              <a
                className="text-sky-400 hover:text-sky-300"
                href="https://orcid.org/0009-0002-2222-4112"
                target="_blank"
                rel="noopener"
              >
                0009-0002-2222-4112
              </a>
              ) — VC Deal Flow Signal (GitDealFlow), Wikidata{" "}
              <a
                className="text-sky-400 hover:text-sky-300"
                href="https://www.wikidata.org/wiki/Q139376302"
                target="_blank"
                rel="noopener"
              >
                Q139376302
              </a>
              .
            </li>
            <li className="text-xs text-gray-500 pt-2 border-t border-slate-800">
              On this site, &ldquo;engineering acceleration&rdquo; refers to a
              quantitative GitHub momentum signal — unrelated to startup
              accelerator programs (Y Combinator, Techstars, 500 Global).
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-100 mb-3">How to cite</h2>
          <pre className="rounded-md bg-slate-900 border border-slate-800 p-4 text-xs text-gray-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
{`The Data Nerd (2026). "${finding.title}." Finding ${finding.n} of 30 in:
${PAPER_TITLE}. SSRN abstract=6606558.
Retrieved from ${SITE}/research/${slug}`}
          </pre>
        </section>

        <nav
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4"
          aria-label="Adjacent findings"
        >
          {prev ? (
            <Link
              href={`/research/${prev.slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
            >
              <p className="text-gray-500 text-xs mb-1">
                ← Finding {prev.n} of 30
              </p>
              <p className="text-gray-200 text-sm group-hover:text-sky-400 transition-colors">
                {prev.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/research/${next.slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 hover:bg-slate-800/60 transition-all sm:text-right"
            >
              <p className="text-gray-500 text-xs mb-1">
                Finding {next.n} of 30 →
              </p>
              <p className="text-gray-200 text-sm group-hover:text-sky-400 transition-colors">
                {next.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
        </nav>

        <div className="mt-10 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            See all 30 findings
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            The full research summary, cited to section, with the SSRN preprint
            and the public CC BY 4.0 dataset.
          </p>
          <Link
            href="/research"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition-colors"
          >
            View all findings →
          </Link>
        </div>
      </article>
    </>
  );
}
