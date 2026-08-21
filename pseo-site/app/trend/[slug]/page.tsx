import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  TRENDS,
  getAllTrendLeaderboardSlugs,
  getTrendLeaderboard,
  getCompaniesForTrendLeaderboard,
} from "@/content/trend-leaderboards";
import { getSector } from "@/content/sectors";
import { HreflangLinks } from "@/components/HreflangLinks";
import SeoCta from "@/components/SeoCta";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import { buildSourceTruthDataset } from "@/lib/dataset-schema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllTrendLeaderboardSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const t = getTrendLeaderboard(slug);
  if (!t) return {};

  return {
    title: t.title,
    description: t.metaDescription,
    openGraph: { title: t.title, description: t.metaDescription, type: "article", url: `/trend/${slug}` },
    twitter: { card: "summary_large_image", title: t.title, description: t.metaDescription },
    alternates: { canonical: `/trend/${slug}` },
  };
}

export default async function TrendLeaderboardPage({ params }: PageProps) {
  const { slug } = await params;
  const trend = getTrendLeaderboard(slug);

  if (!trend) {
    notFound();
  }

  const pageUrl = `https://signals.gitdealflow.com/trend/${slug}`;
  const trackedCompanies = getCompaniesForTrendLeaderboard(slug);
  const sectorObjs = trend.relatedSectors.map((s) => getSector(s)).filter(Boolean);
  const otherTrends = TRENDS.filter((o) => o.slug !== slug).slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: trend.h1,
        description: trend.metaDescription,
        datePublished: "2026-05-27",
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        about: {
          "@type": "Thing",
          name: trend.name,
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".tagline", ".intro", ".why-now"],
        },
      },
      {
        "@type": "ItemList",
        name: `${trend.name}, ${trend.period} Leaderboard`,
        itemListOrder: "Descending",
        numberOfItems: trackedCompanies.length,
        itemListElement: trackedCompanies.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://signals.gitdealflow.com/signal/${c.slug}`,
          name: c.name,
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
            name: "Trends",
            item: "https://signals.gitdealflow.com/trend",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: trend.name,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: trend.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      buildSourceTruthDataset({
        url: pageUrl,
        name: `${trend.name}, ${trend.period} Leaderboard Dataset`,
        description: `Ranked ${trend.name} leaderboard for ${trend.period}, derived from the VC Deal Flow Signal (GitDealFlow) GitHub engineering-velocity panel. ${trend.metaDescription}`,
        variableMeasured: [
          { name: "Ranked companies", value: trackedCompanies.length },
          { name: "Related sectors", value: trend.relatedSectors.length },
        ],
        temporalCoverage: trend.period,
      }),
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
          <Link href="/trend" className="hover:text-gray-300 transition-colors">
            Trends
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{trend.name}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          {trend.h1}
        </h1>
        <p className="tagline text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {trend.tagline}
        </p>
        <p className="intro text-gray-400 text-base leading-relaxed mb-10">
          {trend.intro}
        </p>

        {trackedCompanies.length > 0 && (
          <section className="mb-10" aria-label="Leaderboard">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              {trackedCompanies.length} companies leading {trend.name.toLowerCase()} in{" "}
              {trend.period}
            </h2>
            <ol className="space-y-3" type="1">
              {trackedCompanies.map((c, i) => (
                <li key={c.slug}>
                  <Link
                    href={`/signal/${c.slug}`}
                    className="group flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                  >
                    <span className="rounded-full bg-sky-950 text-sky-300 text-xs font-mono w-7 h-7 flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-100 font-medium text-sm group-hover:text-sky-400 transition-colors">
                        {c.name}
                      </h3>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {c.sector} &middot; {c.stage.replace("-", " ")} &middot;{" "}
                        {c.publicSignal.languageBias}
                      </p>
                      <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                        {c.tagline}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="mb-10 why-now" aria-label="Why this trend now">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            Why this trend, why now
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">{trend.whyItMattersNow}</p>
        </section>

        <section className="mb-10" aria-label="What to watch">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">What to watch next</h2>
          <p className="text-gray-400 text-sm leading-relaxed">{trend.whatToWatch}</p>
        </section>

        {sectorObjs.length > 0 && (
          <section className="mb-10" aria-label="Related sectors">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">Related sectors</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sectorObjs.map((s) =>
                s ? (
                  <Link
                    key={s.slug}
                    href={`/sector/${s.slug}`}
                    className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                  >
                    <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                      {s.name}
                    </h3>
                    <p className="text-gray-400 text-xs">{s.tagline}</p>
                  </Link>
                ) : null,
              )}
            </div>
          </section>
        )}

        <section className="mb-12" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {trend.faqs.map((faq) => (
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

        <section className="mb-12" aria-label="Other trends">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Other 2026 trends</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherTrends.map((o) => (
              <Link
                key={o.slug}
                href={`/trend/${o.slug}`}
                className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
              >
                <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                  {o.name}
                </h3>
                <p className="text-gray-400 text-xs">
                  {o.period} &middot; {o.companySlugs.length} tracked
                </p>
              </Link>
            ))}
          </div>
        </section>

        <SeoCta secondary={{ label: "See a €7 First Look sample", href: "/firstlook" }} />
      </div>
    </>
  );
}
