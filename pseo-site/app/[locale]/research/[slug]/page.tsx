/**
 * /[locale]/research/[slug] — fully translated research finding pages.
 *
 * Currently only ja entries exist (in @/content/ja-research). The route
 * is locale-generic so additional locales can plug in later by:
 *   1. creating @/content/<code>-research.ts with the same shape
 *   2. extending getAllParams() below
 *
 * Each page emits an Article JSON-LD node with translationOfWork
 * pointing at the English /research/<slug> canonical, satisfying
 * Schema.org and Google's mutual-link requirement.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocaleByCode } from "@/content/locales";
import {
  JA_FINDINGS,
  getJaFindingBySlug,
  getAllJaFindingSlugs,
} from "@/content/ja-research";
import { getFindingBySlug } from "@/content/research-findings";
import { HreflangLinks } from "@/components/HreflangLinks";

const SITE = "https://signals.gitdealflow.com";
const SSRN_URL = "https://ssrn.com/abstract=6606558";
const PAPER_TITLE_EN =
  "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamicParams = false;
export const revalidate = 604800;

export function generateStaticParams() {
  return getAllJaFindingSlugs().map((slug) => ({ locale: "ja", slug }));
}

function getFindingForLocale(locale: string, slug: string) {
  if (locale === "ja") return getJaFindingBySlug(slug);
  return undefined;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const f = getFindingForLocale(locale, slug);
  if (!f) return {};
  const localeMeta = getLocaleByCode(locale);
  if (!localeMeta) return {};

  // hreflang emitted via <HreflangLinks/> in JSX (single source of truth).
  return {
    title: `${f.title} — VC Deal Flow Signal`,
    description: f.claim,
    alternates: { canonical: `/${locale}/research/${slug}` },
    openGraph: {
      title: f.title,
      description: f.claim,
      type: "article",
      url: `${SITE}/${locale}/research/${slug}`,
      locale,
      images: [{ url: `${SITE}/api/og/signal-card`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: f.title,
      description: f.claim,
      images: [`${SITE}/api/og/signal-card`],
    },
    // Highwire Press citation tags — keep parity with English /research/[slug]
    // so Google Scholar can index the locale variant as a translation of the
    // SSRN paper. citation_language is the only delta from English.
    other: {
      citation_title: PAPER_TITLE_EN,
      citation_author: "The Data Nerd",
      citation_publication_date: "2026/04/24",
      citation_journal_title: "SSRN Electronic Journal",
      citation_publisher: "Social Science Research Network",
      citation_doi: "10.2139/ssrn.6606558",
      citation_abstract_html_url: SSRN_URL,
      citation_language: locale,
    },
  };
}

function inline(text: string): string {
  return text
    .replace(
      /`([^`]+)`/g,
      '<code class="font-mono text-sky-300 bg-slate-900 px-1.5 py-0.5 rounded text-xs">$1</code>',
    )
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white">$1</strong>')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-sky-400 hover:text-sky-300 underline">$1</a>',
    );
}

function RenderBody({ body }: { body: string }) {
  const blocks = body.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <>
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="text-xl font-semibold text-white mt-8 mb-3"
              dangerouslySetInnerHTML={{ __html: inline(block.slice(3)) }}
            />
          );
        }
        if (block.startsWith("### ")) {
          return (
            <h3
              key={i}
              className="text-base font-semibold text-white mt-6 mb-2"
              dangerouslySetInnerHTML={{ __html: inline(block.slice(4)) }}
            />
          );
        }
        // Markdown-ish table: header | cells separated by | and second
        // line is hyphens. Render as a real <table> for accessibility.
        if (block.includes("|") && block.split("\n")[1]?.match(/^[\s|:-]+$/)) {
          const lines = block.split("\n").filter(Boolean);
          const header = lines[0]
            .split("|")
            .map((c) => c.trim())
            .filter(Boolean);
          const rows = lines.slice(2).map((line) =>
            line
              .split("|")
              .map((c) => c.trim())
              .filter(Boolean),
          );
          return (
            <div key={i} className="overflow-x-auto mb-4">
              <table className="text-sm text-gray-300 border-collapse">
                <thead>
                  <tr>
                    {header.map((h, hi) => (
                      <th
                        key={hi}
                        className="text-left py-2 px-3 border-b border-slate-700 font-semibold text-white"
                        dangerouslySetInnerHTML={{ __html: inline(h) }}
                      />
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((c, ci) => (
                        <td
                          key={ci}
                          className="py-2 px-3 border-b border-slate-800"
                          dangerouslySetInnerHTML={{ __html: inline(c) }}
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (/^\d+\.\s/.test(block)) {
          const items = block
            .split("\n")
            .map((l) => l.replace(/^\d+\.\s+/, ""));
          return (
            <ol
              key={i}
              className="list-decimal pl-5 space-y-2 text-sm text-gray-300 leading-relaxed mb-4"
            >
              {items.map((item, j) => (
                <li
                  key={j}
                  dangerouslySetInnerHTML={{ __html: inline(item) }}
                />
              ))}
            </ol>
          );
        }
        if (block.startsWith("- ")) {
          const items = block.split("\n").map((l) => l.replace(/^-\s+/, ""));
          return (
            <ul
              key={i}
              className="list-disc pl-5 space-y-2 text-sm text-gray-300 leading-relaxed mb-4"
            >
              {items.map((item, j) => (
                <li
                  key={j}
                  dangerouslySetInnerHTML={{ __html: inline(item) }}
                />
              ))}
            </ul>
          );
        }
        return (
          <p
            key={i}
            className="text-sm text-gray-300 leading-relaxed mb-3"
            dangerouslySetInnerHTML={{ __html: inline(block) }}
          />
        );
      })}
    </>
  );
}

export default async function LocaleResearchPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const f = getFindingForLocale(locale, slug);
  if (!f) notFound();
  const localeMeta = getLocaleByCode(locale);
  if (!localeMeta) notFound();
  const enFinding = getFindingBySlug(slug);

  const enUrl = `${SITE}/research/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${SITE}/${locale}/research/${slug}#article`,
        headline: f.title,
        description: f.claim,
        url: `${SITE}/${locale}/research/${slug}`,
        inLanguage: locale,
        isPartOf: { "@id": `${SITE}/#website` },
        translationOfWork: {
          "@type": "ScholarlyArticle",
          url: enUrl,
          inLanguage: "en-US",
          name: enFinding?.title ?? PAPER_TITLE_EN,
          identifier: "https://doi.org/10.2139/ssrn.6606558",
          isPartOf: {
            "@type": "ScholarlyArticle",
            url: SSRN_URL,
            name: PAPER_TITLE_EN,
          },
        },
        author: {
          "@type": "Person",
          "@id": `${SITE}/about#person`,
          name: "The Data Nerd",
          identifier: "https://orcid.org/0009-0002-2222-4112",
        },
        publisher: { "@id": "https://gitdealflow.com/#organization" },
        license: "https://creativecommons.org/licenses/by/4.0/",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
        citation: {
          "@type": "ScholarlyArticle",
          name: PAPER_TITLE_EN,
          identifier: "https://doi.org/10.2139/ssrn.6606558",
          url: SSRN_URL,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: localeMeta.display,
            item: `${SITE}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Research",
            item: `${SITE}/${locale}/research`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: f.title,
            item: `${SITE}/${locale}/research/${slug}`,
          },
        ],
      },
    ],
  };

  const otherJaFindings = JA_FINDINGS.filter((x) => x.slug !== slug);

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/${locale}/research/${slug}`}
        languages={{
          en: enUrl,
          "en-US": enUrl,
          "x-default": enUrl,
          [locale]: `${SITE}/${locale}/research/${slug}`,
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        lang={locale}
        dir={localeMeta.dir}
      >
        <nav className="text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300" hrefLang="en">
            English ↩
          </Link>
          <span className="mx-2">·</span>
          <Link
            href={`/${locale}`}
            className="hover:text-gray-300"
            hrefLang={locale}
          >
            <span dangerouslySetInnerHTML={{ __html: localeMeta.nativeName }} />
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/${locale}/research`}
            className="hover:text-gray-300"
            hrefLang={locale}
          >
            研究
          </Link>
        </nav>

        <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-2">
          {f.section}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          {f.title}
        </h1>
        <p
          className="text-lg text-gray-300 mb-2 leading-relaxed"
          data-speakable
        >
          <strong className="text-white">主張：</strong>
          {f.claim}
        </p>
        <p className="text-sm text-gray-400 mb-8 italic">{f.why}</p>

        <article className="mb-10">
          <RenderBody body={f.body} />
        </article>

        <div className="rounded-lg border border-sky-900/40 bg-sky-950/20 p-5 mb-8 text-sm space-y-2">
          <p className="text-gray-300">
            <strong className="text-white">英語の正本：</strong>{" "}
            <Link
              href={`/research/${slug}`}
              className="text-sky-400 hover:text-sky-300 font-medium"
              hrefLang="en"
            >
              {enFinding?.title ?? `/research/${slug}`}
            </Link>
          </p>
          <p className="text-gray-300">
            <strong className="text-white">論文：</strong>{" "}
            <a
              href={SSRN_URL}
              className="text-sky-400 hover:text-sky-300 font-medium"
              rel="noopener noreferrer"
              target="_blank"
            >
              SSRN（DOI 10.2139/ssrn.6606558）
            </a>
          </p>
          <p className="text-gray-300">
            <strong className="text-white">引用：</strong>{" "}
            <Link
              href={`/${locale}/citations`}
              className="text-sky-400 hover:text-sky-300 font-medium"
              hrefLang={locale}
            >
              引用ガイド（日本語）
            </Link>
          </p>
        </div>

        {otherJaFindings.length > 0 ? (
          <section className="mb-10">
            <h2 className="text-xs uppercase tracking-wider text-gray-400 mb-3">
              他の日本語版研究結果
            </h2>
            <ul className="space-y-2 text-sm">
              {otherJaFindings.map((x) => (
                <li key={x.slug}>
                  <Link
                    href={`/${locale}/research/${x.slug}`}
                    className="block px-3 py-2 rounded border border-slate-800 hover:border-sky-700 text-sky-400"
                    hrefLang={locale}
                  >
                    {x.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}
