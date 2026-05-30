import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { glossaryTerms } from "@/content/glossary";
import {
  CATEGORY_META,
  getCategoryFor,
  getSignalPrimitiveSlug,
  getTermsInCategory,
  getToolCrossLink,
} from "@/lib/glossary-categories";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import EmbedThisCard from "@/components/EmbedThisCard";

const SITE = "https://signals.gitdealflow.com";
const SSRN_URL = "https://ssrn.com/abstract=6606558";

interface PageProps {
  params: Promise<{ term: string }>;
}

export function generateStaticParams() {
  return glossaryTerms.map((t) => ({ term: t.id }));
}

export const dynamicParams = false;
export const revalidate = 604800;

function getTerm(id: string) {
  return glossaryTerms.find((t) => t.id === id);
}

function firstSentence(text: string): string {
  const match = text.match(/^[^.]+\./);
  return (match ? match[0] : text).trim();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { term } = await params;
  const t = getTerm(term);
  if (!t) return {};

  const lede = firstSentence(t.definition);
  const title = `${t.term} — Definition, Context & Related Terms`;
  const description = `${lede} Part of the VC Deal Flow Signal glossary, cross-referenced to the SSRN methodology paper and the signal primitives.`;
  const ogImage = `${SITE}/api/og/define/${term}`;

  return {
    title,
    description,
    alternates: { canonical: `/define/${term}` },
    openGraph: {
      title: `${t.term} — VC Deal Flow Signal`,
      description: lede,
      type: "article",
      url: `${SITE}/define/${term}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${t.term} — VC Deal Flow Signal glossary`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t.term} — VC Deal Flow Signal`,
      description: lede,
      images: [ogImage],
    },
    keywords: [
      t.term,
      `${t.term} definition`,
      `what is ${t.term.toLowerCase()}`,
      `${t.term} venture capital`,
      `${t.term} startup`,
      "VC glossary",
      "deal flow signal",
    ],
  };
}

export default async function DefineTermPage({ params }: PageProps) {
  const { term } = await params;
  const t = getTerm(term);
  if (!t) notFound();

  const pageUrl = `${SITE}/define/${term}`;
  const category = getCategoryFor(t.id);
  const categoryMeta = CATEGORY_META[category];
  const signalSlug = getSignalPrimitiveSlug(t.id);
  const toolLink = getToolCrossLink(t.id);

  // Related terms = other terms in the same category, capped at 8.
  const relatedIds = getTermsInCategory(category)
    .filter((id) => id !== t.id)
    .slice(0, 8);
  const related = relatedIds
    .map((id) => glossaryTerms.find((g) => g.id === id))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const lede = firstSentence(t.definition);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        "@id": `${pageUrl}#term`,
        name: t.term,
        description: t.definition,
        termCode: t.id,
        inDefinedTermSet: {
          "@type": "DefinedTermSet",
          "@id": `${SITE}/glossary#vocabulary`,
          name: "VC Deal Flow Signal — controlled vocabulary",
          url: `${SITE}/glossary`,
        },
        url: pageUrl,
        sameAs: [
          `${SITE}/glossary#${t.id}`,
          ...(signalSlug ? [`${SITE}/signals/define/${signalSlug}`] : []),
        ],
        subjectOf: {
          "@type": "ScholarlyArticle",
          "@id": SSRN_URL,
          url: SSRN_URL,
        },
      },
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: `${t.term} — definition and context`,
        description: lede,
        url: pageUrl,
        inLanguage: "en-US",
        about: { "@id": `${pageUrl}#term` },
        articleSection: categoryMeta.label,
        author: {
          "@type": "Person",
          "@id": `${SITE}/about#person`,
          name: "The Data Nerd",
          url: `${SITE}/about`,
          sameAs: ["https://orcid.org/0009-0002-2222-4112"],
        },
        publisher: {
          "@type": "Organization",
          "@id": "https://gitdealflow.com/#organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        license: "https://creativecommons.org/licenses/by/4.0/",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[data-speakable]"],
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        url: pageUrl,
        mainEntity: [
          {
            "@type": "Question",
            name: `What is ${t.term}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: t.definition,
            },
          },
          {
            "@type": "Question",
            name: `Where does ${t.term} fit in venture deal sourcing?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${t.term} belongs to the ${categoryMeta.label.toLowerCase()} family in the VC Deal Flow Signal glossary. ${categoryMeta.blurb}`,
            },
          },
          ...(signalSlug
            ? [
                {
                  "@type": "Question",
                  name: `Is ${t.term} a formal signal primitive?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `Yes — ${t.term} has a formal signal definition with a published formula, decision rule, and pitfall analysis at ${SITE}/signals/define/${signalSlug}.`,
                  },
                },
              ]
            : []),
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Glossary",
            item: `${SITE}/glossary`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: t.term,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: `${t.term} — Definition, Context & Related Terms`,
        description: lede,
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE}/#website` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        mainEntity: { "@id": `${pageUrl}#term` },
        license: "https://creativecommons.org/licenses/by/4.0/",
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={pageUrl}
        languages={{
          en: pageUrl,
          "en-US": pageUrl,
          "x-default": pageUrl,
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/define/${term}`} qaCategory="glossary" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/glossary"
            className="hover:text-gray-300 transition-colors"
          >
            Glossary
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{t.term}</span>
        </nav>

        <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-2">
          {categoryMeta.label}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          {t.term}
        </h1>
        <p
          className="text-lg text-gray-300 leading-relaxed mb-10"
          data-speakable
        >
          {t.definition}
        </p>

        {signalSlug ? (
          <section className="mb-10 rounded-lg border border-sky-700/40 bg-sky-950/30 p-6">
            <p className="text-xs uppercase tracking-wider text-sky-300 font-semibold mb-2">
              Formal signal definition
            </p>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              {t.term} is also a formal signal primitive in the VC Deal Flow
              Signal methodology, with a published formula, decision rule, and
              pitfall analysis.
            </p>
            <Link
              href={`/signals/define/${signalSlug}`}
              className="inline-flex items-center text-sky-300 hover:text-sky-200 text-sm font-medium"
            >
              Read the signal definition &rarr;
            </Link>
          </section>
        ) : null}

        {toolLink ? (
          <section className="mb-10 rounded-lg border border-emerald-700/40 bg-emerald-950/30 p-6">
            <p className="text-xs uppercase tracking-wider text-emerald-300 font-semibold mb-2">
              Use it in a free tool
            </p>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              {toolLink.blurb}
            </p>
            <Link
              href={`/tools/${toolLink.slug}`}
              className="inline-flex items-center text-emerald-300 hover:text-emerald-200 text-sm font-medium"
            >
              Open the {toolLink.name} &rarr;
            </Link>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Related terms in {categoryMeta.label}
            </h2>
            <p className="text-sm text-gray-400 mb-4">{categoryMeta.blurb}</p>
            <ul className="grid sm:grid-cols-2 gap-3">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/define/${r.id}`}
                    className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                  >
                    <h3 className="text-gray-100 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                      {r.term}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                      {firstSentence(r.definition)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mb-12 rounded-lg border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-3">
            Citation
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-3">
            This definition is published under{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              className="text-sky-400 hover:text-sky-300"
              rel="noopener noreferrer"
              target="_blank"
            >
              CC BY 4.0
            </a>
            . Cite as:
          </p>
          <pre className="text-xs font-mono text-gray-300 bg-slate-950/60 rounded p-4 overflow-x-auto whitespace-pre-wrap">
            {`The Data Nerd. "${t.term}." VC Deal Flow Signal Glossary, ${pageUrl}.`}
          </pre>
          <EmbedThisCard embedPath={`/embed/define/${term}`} label={t.term} />
        </section>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            See the signals in action
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            Browse this week&apos;s top startups ranked by engineering
            acceleration. Free, no signup required.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
            >
              Browse Signals
            </Link>
            <Link
              href="/glossary"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-300 text-sm font-medium transition-colors"
            >
              All Definitions
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
