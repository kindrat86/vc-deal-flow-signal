import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  YEARS_IN_REVIEW,
  getAllYearInReviewSlugs,
  getYearInReview,
  getDealCountForYear,
} from "@/content/year-in-review";
import { getCompany } from "@/content/companies";
import { getAcquirer } from "@/content/acquirers";
import { getTrendLeaderboard } from "@/content/trend-leaderboards";
import { HreflangLinks } from "@/components/HreflangLinks";

interface PageProps {
  params: Promise<{ year: string }>;
}

export async function generateStaticParams() {
  return getAllYearInReviewSlugs().map((year) => ({ year }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params;
  const y = getYearInReview(year);
  if (!y) return {};

  return {
    title: y.title,
    description: y.metaDescription,
    openGraph: { title: y.title, description: y.metaDescription, type: "article", url: `/year-in-review/${year}` },
    twitter: { card: "summary_large_image", title: y.title, description: y.metaDescription },
    alternates: { canonical: `/year-in-review/${year}` },
  };
}

export default async function YearInReviewPage({ params }: PageProps) {
  const { year } = await params;
  const y = getYearInReview(year);

  if (!y) {
    notFound();
  }

  const pageUrl = `https://signals.gitdealflow.com/year-in-review/${year}`;
  const companies = y.signalCompaniesOfTheYear
    .map((s) => getCompany(s))
    .filter((c) => Boolean(c));
  const acquirers = y.notableAcquirers
    .map((s) => getAcquirer(s))
    .filter((a) => Boolean(a));
  const trends = y.emergentTrends
    .map((s) => getTrendLeaderboard(s))
    .filter((t) => Boolean(t));
  const dealCount = getDealCountForYear(y.year);
  const otherYears = YEARS_IN_REVIEW.filter((o) => o.slug !== year);

  const faqs = [
    {
      question: `What were the biggest engineering-signal shifts in ${y.year}?`,
      answer: y.overview,
    },
    {
      question: `What's likely to define ${y.year + 1}?`,
      answer: y.whatsNext,
    },
    {
      question: `How was this year-in-review sourced?`,
      answer: `The roundup combines our tracked signal corpus (49 curated companies in /signal), our documented M&A history across 20 public-company acquirers (with ${dealCount} deals documented for ${y.year}), and the ${y.emergentTrends.length} trend leaderboards that emerged or matured this year. Every fact cited is sourced from public press releases, SEC filings, or the public GitHub event data underlying our signal panel. No private information is published.`,
    },
    {
      question: `Where can I find the underlying data?`,
      answer: `The signal panel methodology is at /methodology and the underlying paper is at SSRN 6606558. Raw aggregates ship via the public MCP server at /api/v1. The full curated company corpus is at /signal, fund corpus at /fund, and trend leaderboards at /trend.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: y.h1,
        description: y.metaDescription,
        datePublished: `${y.year}-12-31`,
        author: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        about: {
          "@type": "Thing",
          name: `Engineering signals and venture patterns of ${y.year}`,
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".tagline", ".overview", ".whats-next"],
        },
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
            name: "Year in Review",
            item: "https://signals.gitdealflow.com/year-in-review",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: y.year.toString(),
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
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
          <Link href="/year-in-review" className="hover:text-gray-300 transition-colors">
            Year in Review
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{y.year}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          {y.h1}
        </h1>
        <p className="tagline text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {y.tagline}
        </p>
        <p className="overview text-gray-400 text-base leading-relaxed mb-10">
          {y.overview}
        </p>

        <div className="grid grid-cols-3 gap-3 mb-10">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
            <p className="text-2xl font-bold text-sky-400">{companies.length}</p>
            <p className="text-xs text-gray-400 mt-1">Companies of the year</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
            <p className="text-2xl font-bold text-sky-400">{dealCount}</p>
            <p className="text-xs text-gray-400 mt-1">Documented deals</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
            <p className="text-2xl font-bold text-sky-400">{trends.length}</p>
            <p className="text-xs text-gray-400 mt-1">Emergent trends</p>
          </div>
        </div>

        {y.sections.map((s) => (
          <section key={s.heading} className="mb-10" aria-label={s.heading}>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">{s.heading}</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{s.body}</p>
          </section>
        ))}

        {companies.length > 0 && (
          <section className="mb-10" aria-label="Companies of the year">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Companies that defined the year
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {companies.map((c) =>
                c ? (
                  <Link
                    key={c.slug}
                    href={`/signal/${c.slug}`}
                    className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                  >
                    <h3 className="text-gray-100 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                      {c.name}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      {c.sector} &middot; {c.stage.replace("-", " ")}
                    </p>
                  </Link>
                ) : null,
              )}
            </div>
          </section>
        )}

        {acquirers.length > 0 && (
          <section className="mb-10" aria-label="Notable acquirers">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Acquirers shaping the year
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {acquirers.map((a) =>
                a ? (
                  <Link
                    key={a.slug}
                    href={`/acquirer/${a.slug}`}
                    className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                  >
                    <h3 className="text-gray-100 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                      {a.name}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      {a.notableAcquisitions.length} documented deals
                    </p>
                  </Link>
                ) : null,
              )}
            </div>
          </section>
        )}

        {trends.length > 0 && (
          <section className="mb-10" aria-label="Emergent trends">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Emergent trends to follow
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trends.map((t) =>
                t ? (
                  <Link
                    key={t.slug}
                    href={`/trend/${t.slug}`}
                    className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                  >
                    <h3 className="text-gray-100 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                      {t.name}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      {t.period} &middot; {t.companySlugs.length} tracked
                    </p>
                  </Link>
                ) : null,
              )}
            </div>
          </section>
        )}

        <section className="mb-10 whats-next" aria-label="What's next">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            What's likely to define {y.year + 1}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">{y.whatsNext}</p>
        </section>

        <section className="mb-12" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
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

        {otherYears.length > 0 && (
          <section className="mb-12" aria-label="Other years">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">Other years</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {otherYears.map((o) => (
                <Link
                  key={o.slug}
                  href={`/year-in-review/${o.slug}`}
                  className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                >
                  <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                    {o.year} — Year in Review
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{o.tagline}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Get the weekly engineering signal
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Track the patterns that will define {y.year + 1}.
          </p>
          <Link
            href="/firstlook"
            className="inline-block rounded-md bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400 transition-colors"
          >
            See First Look
          </Link>
        </div>
      </div>
    </>
  );
}
