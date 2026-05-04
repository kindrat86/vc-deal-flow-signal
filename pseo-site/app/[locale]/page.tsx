import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LOCALES, getAllLocaleCodes, getLocaleByCode } from "@/content/locales";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHomepageHreflang } from "@/lib/hreflang";

const SITE = "https://signals.gitdealflow.com";
const APEX = "https://gitdealflow.com";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return getAllLocaleCodes().map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const l = getLocaleByCode(locale);
  if (!l) return {};

  const title = `VC Deal Flow Signal — ${l.nativeName} (${l.display})`;
  const description = l.intro.length > 200 ? l.intro.slice(0, 197) + "..." : l.intro;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: l.code,
      images: ["/opengraph-image"],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
    alternates: { canonical: `/${locale}` },
  };
}

export default async function LocalePage({ params }: PageProps) {
  const { locale } = await params;
  const l = getLocaleByCode(locale);
  if (!l) notFound();

  const canonical = `${SITE}/${locale}`;
  const hreflangMap: Record<string, string> = {
    "en-US": SITE,
    en: SITE,
    "x-default": SITE,
  };
  for (const other of LOCALES) {
    hreflangMap[other.code] = `${SITE}/${other.code}`;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: `VC Deal Flow Signal — ${l.nativeName}`,
        description: l.intro,
        inLanguage: l.code,
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${APEX}/#organization` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE}/opengraph-image`,
        },
      },
      {
        "@type": "Organization",
        "@id": `${APEX}/#organization`,
        name: "VC Deal Flow Signal",
        alternateName: ["GitDealFlow"],
        url: APEX,
        logo: { "@type": "ImageObject", url: `${SITE}/icon`, width: 192, height: 192 },
        sameAs: [
          "https://t.me/gitdealflow",
          "https://x.com/data_nerd",
          "https://www.linkedin.com/company/gitdealflow",
          "https://www.wikidata.org/wiki/Q139376302",
          "https://ssrn.com/abstract=6606558",
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: l.nativeName, item: canonical },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks canonical={canonical} languages={hreflangMap} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        lang={l.code}
        dir={l.dir}
      >
        <header className="mb-10">
          <p className="text-sky-400 text-sm font-medium mb-3 uppercase tracking-wider">
            {l.nativeName} · {l.display}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-6 leading-tight">
            VC Deal Flow Signal — {l.nativeName}
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">
            {l.intro}
          </p>
        </header>

        <section className="mb-10">
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-slate-700 pl-4">
            {l.englishCanonicalNote}
          </p>
        </section>

        <section className="mb-10 grid grid-cols-1 gap-3">
          <Link
            href="/methodology"
            className="block rounded-lg border border-slate-800 bg-slate-900 px-5 py-4 hover:border-slate-600 transition-colors"
            hrefLang="en"
          >
            <span className="text-gray-100 font-medium">{l.methodologyLabel}</span>
            <span className="block text-gray-500 text-xs mt-1">→ {SITE}/methodology</span>
          </Link>
          <Link
            href={`${APEX}/#signup`}
            className="block rounded-lg border border-sky-900/50 bg-sky-950/30 px-5 py-4 hover:border-sky-700 transition-colors"
            hrefLang="en"
          >
            <span className="text-gray-100 font-medium">{l.signalReportLabel}</span>
            <span className="block text-gray-500 text-xs mt-1">→ {APEX}/#signup</span>
          </Link>
          <Link
            href="/"
            className="block rounded-lg border border-slate-800 bg-slate-900 px-5 py-4 hover:border-slate-600 transition-colors"
            hrefLang="en"
          >
            <span className="text-gray-100 font-medium">All Sectors</span>
            <span className="block text-gray-500 text-xs mt-1">→ {SITE}/</span>
          </Link>
        </section>

        <section className="mb-10">
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            Other languages
          </h2>
          <div className="flex flex-wrap gap-2">
            {LOCALES.filter((other) => other.code !== l.code).map((other) => (
              <Link
                key={other.code}
                href={`/${other.code}`}
                hrefLang={other.code}
                className="text-xs text-gray-400 hover:text-sky-400 border border-slate-800 hover:border-slate-600 rounded px-2 py-1 transition-colors"
              >
                {other.nativeName}
              </Link>
            ))}
            <Link
              href="/"
              hrefLang="en"
              className="text-xs text-gray-400 hover:text-sky-400 border border-slate-800 hover:border-slate-600 rounded px-2 py-1 transition-colors"
            >
              English
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
