import type { Metadata } from "next";
import Link from "next/link";
import { glossaryTerms } from "@/content/glossary";
import {
  CATEGORY_META,
  type GlossaryCategory,
  getCategoryFor,
} from "@/lib/glossary-categories";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import SeoCta from "@/components/SeoCta";

const SITE = "https://signals.gitdealflow.com";
const PAGE_URL = `${SITE}/define`;

export const revalidate = 604800;

// Index OG: reuse the same per-term route with the anchor term that
// best represents the whole collection (code-side-sourcing is the
// named category that defines the site). Falls back gracefully if the
// route can't render, the page itself is still indexable.
const INDEX_OG = `${SITE}/api/og/define/code-side-sourcing`;

export const metadata: Metadata = {
  title: "Definitions, VC Deal Flow Signal Vocabulary by Category",
  description:
    "Every term in the VC Deal Flow Signal vocabulary, grouped into six families: code-side sourcing, engineering acceleration, discoverability surfaces, agent infrastructure, academic citation, and venture vocabulary. Each term has its own definition page with cross-references to the SSRN methodology paper.",
  alternates: { canonical: "/define" },
  openGraph: {
    title: "VC Deal Flow Signal Definitions",
    description:
      "Browse the controlled vocabulary by category. 62 terms, each with its own page.",
    type: "website",
    url: PAGE_URL,
    images: [
      {
        url: INDEX_OG,
        width: 1200,
        height: 630,
        alt: "VC Deal Flow Signal Definitions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VC Deal Flow Signal Definitions",
    description:
      "Browse the controlled vocabulary by category. 62 terms, each with its own page.",
    images: [INDEX_OG],
  },
};

const CATEGORY_ORDER: GlossaryCategory[] = [
  "code-side-sourcing",
  "engineering-acceleration",
  "discoverability",
  "agent-infrastructure",
  "academic-citation",
  "venture-vocabulary",
];

function firstSentence(text: string): string {
  const match = text.match(/^[^.]+\./);
  return (match ? match[0] : text).trim();
}

export default function DefineIndexPage() {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    meta: CATEGORY_META[cat],
    terms: glossaryTerms.filter((t) => getCategoryFor(t.id) === cat),
  })).filter((g) => g.terms.length > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": PAGE_URL,
        url: PAGE_URL,
        name: "VC Deal Flow Signal Definitions",
        description:
          "62 controlled-vocabulary terms grouped into six families.",
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE}/#website` },
        hasPart: glossaryTerms.map((t) => ({
          "@type": "DefinedTerm",
          name: t.term,
          url: `${SITE}/define/${t.id}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Definitions",
            item: PAGE_URL,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${PAGE_URL}#list`,
        name: "All defined terms",
        numberOfItems: glossaryTerms.length,
        itemListElement: glossaryTerms.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.term,
          url: `${SITE}/define/${t.id}`,
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={PAGE_URL}
        languages={{
          en: PAGE_URL,
          "en-US": PAGE_URL,
          "x-default": PAGE_URL,
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/define" qaCategory="glossary" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Definitions</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Definitions
        </h1>
        <p
          className="text-lg text-gray-300 leading-relaxed mb-2"
          data-speakable
        >
          {glossaryTerms.length} controlled-vocabulary terms used across the VC
          Deal Flow Signal site, grouped into six families. Each term has its
          own dedicated page with cross-references to the SSRN methodology
          paper and the formal signal primitives.
        </p>
        <p className="text-sm text-gray-400 mb-10">
          For the flat alphabetic listing with all definitions on one page,
          see{" "}
          <Link
            href="/glossary"
            className="text-sky-400 hover:text-sky-300"
          >
            /glossary
          </Link>
          .
        </p>

        <div className="space-y-12">
          {grouped.map((group) => (
            <section key={group.meta.slug} aria-labelledby={`cat-${group.meta.slug}`}>
              <h2
                id={`cat-${group.meta.slug}`}
                className="text-xl font-semibold text-gray-100 mb-2"
              >
                {group.meta.label}{" "}
                <span className="text-gray-500 text-sm font-normal">
                  ({group.terms.length})
                </span>
              </h2>
              <p className="text-sm text-gray-400 mb-4">{group.meta.blurb}</p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {group.terms.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/define/${t.id}`}
                      className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                    >
                      <h3 className="text-gray-100 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                        {t.term}
                      </h3>
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                        {firstSentence(t.definition)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <SeoCta className="mt-12" signoffIndex={1} />
      </div>
    </>
  );
}
