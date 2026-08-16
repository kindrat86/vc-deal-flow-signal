import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFund } from "@/content/funds";
import {
  getFundPortfolio,
  getAllFundsWithPortfolio,
} from "@/content/fund-portfolio";
import { HreflangLinks } from "@/components/HreflangLinks";
import SeoCta from "@/components/SeoCta";
import { FRESH_YEAR_STR } from "@/lib/freshness-year";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllFundsWithPortfolio().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const fund = getFund(slug);
  if (!fund) return {};

  const portfolio = getFundPortfolio(slug);
  const title = `${fund.name} Portfolio, Companies We Track ${FRESH_YEAR_STR} | VC Deal Flow Signal`;
  const description = `${portfolio.length} companies from ${fund.name}'s publicly disclosed portfolio that we track in the VC Deal Flow Signal engineering-signal panel. Independent, sources are press releases and Crunchbase only.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "article", url: `/fund/${slug}/portfolio` },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `/fund/${slug}/portfolio` },
  };
}

export default async function FundPortfolioPage({ params }: PageProps) {
  const { slug } = await params;
  const fund = getFund(slug);

  if (!fund) {
    notFound();
  }

  const portfolio = getFundPortfolio(slug);

  if (portfolio.length === 0) {
    notFound();
  }

  const pageUrl = `https://signals.gitdealflow.com/fund/${slug}/portfolio`;

  // Sector breakdown of the portfolio
  const sectorCounts = new Map<string, number>();
  for (const { company } of portfolio) {
    sectorCounts.set(company.sector, (sectorCounts.get(company.sector) ?? 0) + 1);
  }
  const sectorBreakdown = Array.from(sectorCounts.entries())
    .sort((a, b) => b[1] - a[1]);

  // Stage breakdown
  const stageCounts = new Map<string, number>();
  for (const { company } of portfolio) {
    stageCounts.set(company.stage, (stageCounts.get(company.stage) ?? 0) + 1);
  }
  const stageBreakdown = Array.from(stageCounts.entries())
    .sort((a, b) => b[1] - a[1]);

  const faqs = [
    {
      question: `How many ${fund.name} portfolio companies does VC Deal Flow Signal track?`,
      answer: `We track ${portfolio.length} ${fund.name} portfolio companies in our /signal/ corpus, these are companies where ${fund.name} has publicly disclosed their investor relationship via press release, the fund's own portfolio page, or both. ${fund.name}'s full portfolio is larger; this page only shows the intersection with our curated tracked set.`,
    },
    {
      question: `How was this portfolio list sourced?`,
      answer: `Conservative public-source threshold: every listed company was either (a) on ${fund.name}'s own portfolio page, (b) named in a widely-reported press release naming ${fund.name} as an investor, or (c) documented on Crunchbase with ${fund.name} listed as an investor. We do not list rumored investments, fund-of-fund LP positions, or anything not publicly disclosed by both sides.`,
    },
    {
      question: `Is this page affiliated with ${fund.name}?`,
      answer: `No. This page is an independent intersection of ${fund.name}'s publicly disclosed portfolio with our /signal/ corpus. ${fund.name} has not endorsed, paid for, or reviewed this page. For ${fund.name}'s full and authoritative portfolio, see ${fund.homepageUrl}.`,
    },
    {
      question: `What engineering signals do you publish for these companies?`,
      answer: `Each linked /signal/[company] page tracks commit velocity, contributor influx, repo creation pulse, and language bias from public GitHub events. The methodology is at /methodology and the underlying paper is at SSRN 6606558. Raw aggregates ship via the public MCP server at /api/v1.`,
    },
    {
      question: `How can LPs or emerging managers use this page?`,
      answer: `Two workflows. (1) Thesis validation: compare ${fund.name}'s public portfolio concentration (sector and stage breakdowns above) against the fund's stated thesis on the parent /fund/${slug} page. (2) Engineering benchmarking: each portfolio company's /signal/ page shows their engineering-acceleration trajectory, useful as a comparator when modeling your own portfolio's velocity profile.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        url: pageUrl,
        name: `${fund.name} Portfolio, Companies We Track`,
        description: `${portfolio.length} ${fund.name} portfolio companies tracked in the VC Deal Flow Signal engineering-signal panel.`,
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: "https://signals.gitdealflow.com",
        },
        about: {
          "@type": "Organization",
          name: fund.name,
          url: fund.homepageUrl,
        },
      },
      {
        "@type": "ItemList",
        name: `${fund.name}, Portfolio Companies (Tracked Subset)`,
        itemListOrder: "Unordered",
        numberOfItems: portfolio.length,
        itemListElement: portfolio.map(({ company }, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://signals.gitdealflow.com/signal/${company.slug}`,
          name: company.name,
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
            name: "Funds",
            item: "https://signals.gitdealflow.com/fund",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: fund.name,
            item: `https://signals.gitdealflow.com/fund/${slug}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "Portfolio",
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
          <Link href="/fund" className="hover:text-gray-300 transition-colors">
            Funds
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/fund/${slug}`} className="hover:text-gray-300 transition-colors">
            {fund.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Portfolio</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          {fund.name}, Portfolio Companies We Track
        </h1>
        <p className="text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {portfolio.length} publicly disclosed {fund.name} portfolio companies in the
          VC Deal Flow Signal engineering-signal corpus.
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          This page is the intersection of {fund.name}'s publicly disclosed portfolio
          and our curated /signal/ corpus. Every link below resolves to a per-company
          engineering-acceleration signal page. For {fund.name}'s full and authoritative
          portfolio, see their site at{" "}
          <a
            href={fund.homepageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300 underline"
          >
            {fund.homepageUrl.replace(/^https?:\/\//, "")}
          </a>
          .
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
            <p className="text-2xl font-bold text-sky-400">{portfolio.length}</p>
            <p className="text-xs text-gray-400 mt-1">Tracked portfolio cos</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
            <p className="text-2xl font-bold text-sky-400">{sectorBreakdown.length}</p>
            <p className="text-xs text-gray-400 mt-1">Distinct sectors</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
            <p className="text-2xl font-bold text-sky-400">{stageBreakdown.length}</p>
            <p className="text-xs text-gray-400 mt-1">Distinct stages</p>
          </div>
        </div>

        <section className="mb-10" aria-label="Portfolio companies">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Portfolio companies (tracked subset)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {portfolio.map(({ company }) => (
              <Link
                key={company.slug}
                href={`/signal/${company.slug}`}
                className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
              >
                <h3 className="text-gray-100 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                  {company.name}
                </h3>
                <p className="text-gray-400 text-xs">
                  {company.sector} &middot; {company.stage.replace("-", " ")}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <section aria-label="Sector concentration">
            <h2 className="text-base font-semibold text-gray-100 mb-3">
              Sector concentration
            </h2>
            <div className="space-y-2">
              {sectorBreakdown.map(([sector, count]) => (
                <Link
                  key={sector}
                  href={`/sector/${sector}`}
                  className="group flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 hover:border-slate-600 transition-all"
                >
                  <span className="text-gray-300 text-sm group-hover:text-sky-400 transition-colors">
                    {sector}
                  </span>
                  <span className="text-sky-400 text-sm font-medium">{count}</span>
                </Link>
              ))}
            </div>
          </section>
          <section aria-label="Stage breakdown">
            <h2 className="text-base font-semibold text-gray-100 mb-3">
              Stage breakdown
            </h2>
            <div className="space-y-2">
              {stageBreakdown.map(([stage, count]) => (
                <div
                  key={stage}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-4 py-2"
                >
                  <span className="text-gray-300 text-sm">
                    {stage.replace("-", " ")}
                  </span>
                  <span className="text-sky-400 text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

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

        <SeoCta secondary={{ label: "See a €7 First Look sample", href: "/firstlook" }} />
      </div>
    </>
  );
}
