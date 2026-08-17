import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getLocaleTopic,
  getAllLocaleTopicPairs,
  LOCALE_TOPICS,
  isLocaleTopicSummary,
} from "@/content/locale-topics";
import { LOCALES, getLocaleByCode } from "@/content/locales";
import { topicEnPath } from "@/lib/hreflang";
import { HreflangLinks } from "@/components/HreflangLinks";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { withEditorialOverride } from "@/lib/metadata";

const SITE = "https://signals.gitdealflow.com";

interface PageProps {
  params: Promise<{ locale: string; topic: string }>;
}

export const dynamicParams = false;
export const revalidate = 604800;

export function generateStaticParams() {
  return getAllLocaleTopicPairs();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, topic } = await params;
  const t = getLocaleTopic(locale, topic);
  if (!t) return {};
  const localeMeta = getLocaleByCode(locale);
  if (!localeMeta) return {};
  const summary = isLocaleTopicSummary(locale, topic);
  const enPath = topicEnPath(topic);
  // hreflang emitted via <HreflangLinks/> in JSX (single source of truth).
  return withEditorialOverride({
    // absolute: titles that already name the brand (11 localized About pages)
    // bypass the "| VC Deal Flow Signal" template, otherwise the brand doubles.
    title: t.title.includes("VC Deal Flow Signal")
      ? { absolute: t.title }
      : t.title,
    description: t.intro,
    // A summary page is noindexed and points its canonical at the English
    // source of truth, so it can never compete with /<topic> for the same
    // query (thin/duplicate-content + canonical ambiguity, see /translations).
    alternates: {
      canonical: summary && enPath ? enPath : `/${locale}/${topic}`,
    },
    ...(summary ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: t.title,
      description: t.intro,
      type: "article",
      url: `${SITE}/${locale}/${topic}`,
      locale,
    },
  });
}

/**
 * Markdown-ish renderer for locale-topics.ts content:
 *   "## " → h2; "### " → h3
 *   "1. " / "2. " → <ol>; "- " → <ul>
 *   pipe-tables → <table>
 *   inline `code`, **bold**, [link](url)
 * Hand-rolled because the body is short and trusted.
 */
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
        // pipe-table: header row | --- | rows
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
        // numbered list (lines starting "1. ", "2. ", ...)
        if (/^\d+\.\s/.test(block)) {
          const items = block.split("\n").map((l) => l.replace(/^\d+\.\s+/, ""));
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
        // bullet list (lines starting "- ")
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

export default async function LocaleTopicPage({ params }: PageProps) {
  const { locale, topic } = await params;
  const t = getLocaleTopic(locale, topic);
  if (!t) notFound();
  const localeMeta = getLocaleByCode(locale);
  if (!localeMeta) notFound();

  const englishCanonical = topicEnPath(topic);
  const summary = isLocaleTopicSummary(locale, topic);
  // Sibling locales that have THIS topic as a full translation (for the
  // inter-locale switcher). Summary siblings are excluded: a noindexed page
  // must not be advertised as a language alternate.
  const siblings = LOCALE_TOPICS.filter(
    (x) =>
      x.topic === topic && x.locale !== locale && !isLocaleTopicSummary(x.locale, x.topic),
  );

  // Hreflang map: Next 16 drops metadata.alternates.languages, so we
  // emit <link rel="alternate" hreflang> directly in the page tree.
  // A summary page advertises NO alternates (it is noindexed and canonicalized
  // to English); a full translation advertises English + every full sibling.
  const hreflangMap: Record<string, string> = {};
  if (!summary) {
    if (englishCanonical) {
      hreflangMap.en = `${SITE}${englishCanonical}`;
      hreflangMap["en-US"] = `${SITE}${englishCanonical}`;
      hreflangMap["x-default"] = `${SITE}${englishCanonical}`;
    } else {
      hreflangMap["x-default"] = `${SITE}/${locale}/${topic}`;
    }
    // Add every full-translation locale that has this topic (incl. self).
    for (const x of LOCALE_TOPICS.filter(
      (y) => y.topic === topic && !isLocaleTopicSummary(y.locale, y.topic),
    )) {
      hreflangMap[x.locale] = `${SITE}/${x.locale}/${topic}`;
    }
  }

  // Article schema. Only include translationOfWork when an English
  // canonical exists, ja-only topics (pricing) are originals, not
  // translations, and Schema.org translationOfWork should not point
  // at a 404.
  const articleNode: Record<string, unknown> = {
    "@type": "Article",
    "@id": `${SITE}/${locale}/${topic}#article`,
    headline: t.title,
    description: t.intro,
    url: `${SITE}/${locale}/${topic}`,
    inLanguage: locale,
    isPartOf: { "@id": `${SITE}/#website` },
    author: DATA_NERD_AUTHOR_REF,
    publisher: { "@id": "https://gitdealflow.com/#organization" },
    license: "https://creativecommons.org/licenses/by/4.0/",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "[data-speakable]"],
    },
  };
  if (englishCanonical) {
    articleNode.translationOfWork = {
      "@type": "Article",
      url: `${SITE}${englishCanonical}`,
      inLanguage: "en-US",
    };
  }
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [articleNode],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/${locale}/${topic}`}
        languages={hreflangMap}
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
          <span>{topic}</span>
        </nav>

        <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-2">
          {t.readTimeLabel}
        </p>
        <h1
          className="text-3xl sm:text-4xl font-bold text-white mb-4"
          dangerouslySetInnerHTML={{ __html: t.title }}
        />
        <p
          className="text-lg text-gray-300 mb-8 leading-relaxed"
          data-speakable
        >
          {t.intro}
        </p>

        <article className="mb-10">
          <RenderBody body={t.body} />
        </article>

        <section
          className="rounded-xl border border-sky-900/50 bg-sky-950/20 p-5 mb-8"
          aria-label="Subscribe"
        >
          <a
            href="https://gitdealflow.com/#signup"
            hrefLang="en"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-signal-500 hover:bg-signal-600 text-slate-950 text-sm font-medium"
          >
            <span
              dangerouslySetInnerHTML={{ __html: localeMeta.signalReportLabel }}
            />
          </a>
        </section>

        <DataNerdSignoff variant="compact" className="mb-8" />

        {englishCanonical ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 mb-8 text-sm">
            <Link
              href={englishCanonical}
              className="text-sky-400 hover:text-sky-300 font-medium"
              hrefLang="en"
            >
              → {t.englishLinkLabel}
            </Link>
          </div>
        ) : null}

        {siblings.length > 0 ? (
          <p className="text-xs text-gray-400 text-center">
            {siblings.map((s, i) => (
              <span key={s.locale}>
                {i > 0 ? <span className="mx-2">·</span> : null}
                <Link
                  href={`/${s.locale}/${topic}`}
                  className="hover:text-gray-300"
                  hrefLang={s.locale}
                >
                  {LOCALES.find((l) => l.code === s.locale)?.display ??
                    s.locale}
                </Link>
              </span>
            ))}
          </p>
        ) : null}
      </div>
    </>
  );
}
