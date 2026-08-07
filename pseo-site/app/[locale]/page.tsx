import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  LOCALES,
  getLocaleByCode,
  getAllLocaleCodes,
} from "@/content/locales";
import { LOCALE_TOPICS } from "@/content/locale-topics";
import { JA_FINDINGS } from "@/content/ja-research";
import { HreflangLinks } from "@/components/HreflangLinks";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";

const SITE = "https://signals.gitdealflow.com";
const SSRN_URL = "https://ssrn.com/abstract=6606558";

interface PageProps {
  params: Promise<{ locale: string }>;
}

// Lock to declared locales only. Without this, any single-segment path that
// doesn't match a static route (e.g. /random) would render this template
// before notFound() fires — slower 404 + risk of soft-404 indexing.
export const dynamicParams = false;
export const revalidate = 604800;

export function generateStaticParams() {
  return getAllLocaleCodes().map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const l = getLocaleByCode(locale);
  if (!l) return {};

  return {
    title: `VC Deal Flow Signal — ${l.nativeName.replace(/&amp;/g, "&")} (${l.display})`,
    description: l.intro.slice(0, 200),
    // hreflang emitted via <HreflangLinks/> in JSX (single source of truth).
    alternates: { canonical: `/${locale}` },
    openGraph: {
      title: `VC Deal Flow Signal — ${l.display}`,
      description: l.intro.slice(0, 160),
      type: "website",
      url: `${SITE}/${locale}`,
      locale: locale,
      images: [
        {
          url: `${SITE}/api/og/locale/${locale}`,
          width: 1200,
          height: 630,
          alt: `${l.display} — VC Deal Flow Signal`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [`${SITE}/api/og/locale/${locale}`],
    },
  };
}

export default async function LocaleLandingPage({ params }: PageProps) {
  const { locale } = await params;
  const l = getLocaleByCode(locale);
  if (!l) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/${locale}#page`,
        name: `VC Deal Flow Signal — ${l.display}`,
        url: `${SITE}/${locale}`,
        inLanguage: l.code,
        isPartOf: { "@id": `${SITE}/#website` },
        translationOfWork: { "@id": `${SITE}/#about` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
      },
    ],
  };

  // Hreflang: this is the locale landing. Canonical = /[locale]; the
  // English alternate is the site root. Every other locale's landing is
  // also advertised. Direct emission because Next 16 drops metadata.alternates.languages.
  const hreflangMap: Record<string, string> = {
    en: SITE,
    "en-US": SITE,
    "x-default": SITE,
  };
  for (const x of LOCALES) {
    hreflangMap[x.code] = `${SITE}/${x.code}`;
  }

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/${locale}`}
        languages={hreflangMap}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        lang={l.code}
        dir={l.dir}
      >
        <nav className="text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300" hrefLang="en">
            English ↩
          </Link>
          <span className="mx-2">·</span>
          <span dangerouslySetInnerHTML={{ __html: l.nativeName }} />
        </nav>

        <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-2">
          <span dangerouslySetInnerHTML={{ __html: l.region }} />
        </p>
        <h1
          className="text-3xl sm:text-4xl font-bold text-white mb-6"
          dangerouslySetInnerHTML={{ __html: l.nativeName }}
        />
        <p
          className="text-lg text-gray-300 mb-8 leading-relaxed"
          data-speakable
        >
          {l.intro}
        </p>

        <div className="flex flex-wrap gap-3 mb-10">
          <Link
            href="/methodology"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-signal-500 hover:bg-signal-600 text-slate-950 text-sm font-medium"
            hrefLang="en"
          >
            <span dangerouslySetInnerHTML={{ __html: l.methodologyLabel }} />
          </Link>
          <a
            href="https://gitdealflow.com/#signup"
            className="inline-flex items-center px-5 py-2.5 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-200 text-sm font-medium"
            hrefLang="en"
          >
            <span dangerouslySetInnerHTML={{ __html: l.signalReportLabel }} />
          </a>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 mb-10 text-sm text-gray-400">
          <p>{l.englishCanonicalNote}</p>
        </div>

        {LOCALE_TOPICS.filter((t) => t.locale === locale).length > 0 ? (
          <section className="mb-10">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
              {l.code === "zh"
                ? "本地化页面"
                : l.code === "ja"
                  ? "日本語ページ"
                  : l.code === "de"
                    ? "Lokalisierte Seiten"
                    : l.code === "es"
                      ? "Páginas localizadas"
                      : l.code === "fr"
                        ? "Pages localisées"
                        : "Páginas localizadas"}
            </p>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm">
              {LOCALE_TOPICS.filter((t) => t.locale === locale).map((t) => (
                <li key={t.topic}>
                  <Link
                    href={`/${locale}/${t.topic}`}
                    className="block px-3 py-2 rounded border border-slate-800 hover:border-sky-700 text-sky-400"
                    hrefLang={locale}
                    dangerouslySetInnerHTML={{ __html: t.title }}
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {locale === "ja" && JA_FINDINGS.length > 0 ? (
          <section className="mb-10">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
              日本語版の研究結果
            </p>
            <ul className="space-y-2 text-sm">
              {JA_FINDINGS.map((f) => (
                <li key={f.slug}>
                  <Link
                    href={`/ja/research/${f.slug}`}
                    className="block px-3 py-2 rounded border border-slate-800 hover:border-sky-700 text-sky-400"
                    hrefLang="ja"
                  >
                    {f.title}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-gray-400">
              他の 24 件は{" "}
              <Link
                href="/research"
                className="hover:text-gray-300 underline"
                hrefLang="en"
              >
                英語版
              </Link>
              でご覧いただけます。
            </p>
          </section>
        ) : null}

        <section className="mb-10">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
            English canonical surfaces
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm">
            <li>
              <Link
                href="/"
                className="block px-3 py-2 rounded border border-slate-800 hover:border-sky-700 text-sky-400"
                hrefLang="en"
              >
                Live dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/methodology"
                className="block px-3 py-2 rounded border border-slate-800 hover:border-sky-700 text-sky-400"
                hrefLang="en"
              >
                Methodology
              </Link>
            </li>
            <li>
              <Link
                href="/research"
                className="block px-3 py-2 rounded border border-slate-800 hover:border-sky-700 text-sky-400"
                hrefLang="en"
              >
                Research findings
              </Link>
            </li>
            <li>
              <Link
                href="/signals"
                className="block px-3 py-2 rounded border border-slate-800 hover:border-sky-700 text-sky-400"
                hrefLang="en"
              >
                Signal vocabulary
              </Link>
            </li>
            <li>
              <Link
                href="/glossary"
                className="block px-3 py-2 rounded border border-slate-800 hover:border-sky-700 text-sky-400"
                hrefLang="en"
              >
                Glossary
              </Link>
            </li>
            <li>
              <a
                href={SSRN_URL}
                className="block px-3 py-2 rounded border border-slate-800 hover:border-sky-700 text-sky-400"
                rel="noopener noreferrer"
                target="_blank"
              >
                SSRN paper (DOI 10.2139/ssrn.6606558)
              </a>
            </li>
          </ul>
        </section>

        <DataNerdSignoff variant="compact" className="mt-4 mb-8" />

        <p className="text-xs text-gray-400 text-center">
          {LOCALES.map((x, i) => (
            <span key={x.code}>
              {i > 0 ? <span className="mx-2">·</span> : null}
              {x.code === locale ? (
                <span dangerouslySetInnerHTML={{ __html: x.nativeName }} />
              ) : (
                <Link
                  href={`/${x.code}`}
                  className="hover:text-gray-300"
                  hrefLang={x.code}
                  dangerouslySetInnerHTML={{ __html: x.nativeName }}
                />
              )}
            </span>
          ))}
          <span className="mx-2">·</span>
          <Link href="/" className="hover:text-gray-300" hrefLang="en">
            English
          </Link>
        </p>
      </div>
    </>
  );
}
