import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/content/posts";
import { getAllSectors, getCurrentPeriod } from "@/lib/data";
import PSEOFooterNav from "@/components/PSEOFooterNav";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — VC Deal Flow Signal",
  description:
    "Answers to common questions about GitHub engineering signals, startup deal sourcing, commit velocity, engineering acceleration, and how investors use VC Deal Flow Signal to find breakout startups.",
  alternates: {
    canonical: "/faq",
  },
};

interface FAQEntry {
  question: string;
  answer: string;
  source: string;
  sourceHref: string;
}

// Standalone PAA-targeted FAQs (not in any blog post)
const standaloneFaqs: FAQEntry[] = [
  {
    question: "What is VC Deal Flow Signal?",
    answer:
      "VC Deal Flow Signal is a data product that tracks startup engineering acceleration using public GitHub data. It monitors commit velocity, contributor growth, and repository expansion across 20 startup sectors to surface breakout engineering teams before they appear on the funding radar. Engineering acceleration signals have historically preceded fundraise announcements by three to six weeks.",
    source: "About",
    sourceHref: "/about",
  },
  {
    question: "How much does VC Deal Flow Signal cost?",
    answer:
      "VC Deal Flow Signal offers a free Signal Report — this week's top 5 breakout startups delivered free after email confirmation, then weekly updates. The Dashboard beta is EUR 9.97/month and gives access to 50+ ranked startups across all 20 sectors with filtering by stage, geography, and signal type. There is no annual commitment required.",
    source: "Pricing",
    sourceHref: "https://gitdealflow.com/#signup",
  },
  {
    question: "How often is the data updated?",
    answer:
      "Data is refreshed every Monday morning. The GitHub API is queried for commit activity, contributor counts, and repository metadata across all tracked sectors. Rankings, signal classifications, and trending pages are regenerated with each weekly data refresh.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "How many startups does VC Deal Flow Signal track?",
    answer:
      "VC Deal Flow Signal currently tracks startups across 20 sectors including AI & Machine Learning, Fintech, Cybersecurity, Developer Tools, and more. The dataset covers 5 quarters of historical data, allowing investors to compare current signals against the startup's own baseline.",
    source: "All Sectors",
    sourceHref: "/",
  },
  {
    question: "Is VC Deal Flow Signal investment advice?",
    answer:
      "No. VC Deal Flow Signal provides engineering acceleration data as a leading indicator for deal sourcing. It is not investment advice. Engineering signals should be one input among many in an investment decision — combined with market analysis, founder evaluation, and customer reference checks.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "What is the difference between VC Deal Flow Signal and Crunchbase?",
    answer:
      "Crunchbase tracks funding announcements, team changes, and company profiles — all lagging indicators that appear after a round closes. VC Deal Flow Signal tracks engineering acceleration from public GitHub data — a leading indicator that typically appears 6-12 weeks before the fundraise announcement. The two are complementary: use VC Deal Flow Signal for early sourcing, Crunchbase for verification.",
    source: "Comparison",
    sourceHref: "/compare/github-signals-vs-crunchbase-alerts",
  },
];

export default function FAQPage() {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const activeSectors = sectors.filter((s) => s.periods[period.slug]);

  // Collect all blog FAQs with source attribution
  const blogFaqs: FAQEntry[] = posts.flatMap((post) =>
    post.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
      source: post.title,
      sourceHref: `/blog/${post.slug}`,
    }))
  );

  const allFaqs = [...standaloneFaqs, ...blogFaqs];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        name: "VC Deal Flow Signal — Frequently Asked Questions",
        description:
          "Answers to common questions about GitHub engineering signals, startup deal sourcing, and how investors use engineering acceleration data.",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[itemtype$='Question']", "[itemtype$='Answer']"],
        },
        mainEntity: allFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "All Sectors",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "FAQ",
            item: "https://signals.gitdealflow.com/faq",
          },
        ],
      },
    ],
  };

  return (
    <>
      <AgentMirrorLinks path="/faq" qaCategory="general" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">FAQ</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-4">
          Answers to common questions about GitHub engineering signals, startup
          deal sourcing, commit velocity, and how investors use VC Deal Flow
          Signal. Currently tracking {activeSectors.length} sectors with data
          refreshed weekly.
        </p>

        {/* Quick stats for AI extraction */}
        <div className="mb-10 flex flex-wrap gap-4 text-xs text-gray-500">
          <span>{activeSectors.length} sectors tracked</span>
          <span className="text-slate-700">|</span>
          <span>{allFaqs.length} questions answered</span>
          <span className="text-slate-700">|</span>
          <span>Data: {period.name}</span>
        </div>

        {/* General questions */}
        <section className="mb-12" aria-label="General questions">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            About VC Deal Flow Signal
          </h2>
          <div className="space-y-4">
            {standaloneFaqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-lg border border-slate-800 bg-slate-900"
              >
                <summary className="cursor-pointer p-5 text-gray-100 font-medium flex items-center justify-between">
                  {faq.question}
                  <span className="text-gray-600 group-open:rotate-180 transition-transform ml-2">
                    &#9662;
                  </span>
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                  <Link
                    href={faq.sourceHref}
                    className="inline-block mt-3 text-xs text-sky-500 hover:text-sky-400 transition-colors"
                  >
                    Learn more: {faq.source} &rarr;
                  </Link>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Blog-sourced questions grouped by post */}
        <section aria-label="Questions from our guides">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Engineering Signals &amp; Deal Sourcing
          </h2>
          <div className="space-y-4">
            {blogFaqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-lg border border-slate-800 bg-slate-900"
              >
                <summary className="cursor-pointer p-5 text-gray-100 font-medium flex items-center justify-between">
                  {faq.question}
                  <span className="text-gray-600 group-open:rotate-180 transition-transform ml-2">
                    &#9662;
                  </span>
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                  <Link
                    href={faq.sourceHref}
                    className="inline-block mt-3 text-xs text-sky-500 hover:text-sky-400 transition-colors"
                  >
                    From: {faq.source} &rarr;
                  </Link>
                </div>
              </details>
            ))}
          </div>
        </section>

        <PSEOFooterNav excludeHrefs={["/faq"]} />

        {/* CTA */}
        <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Still have questions?
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            Browse the sector rankings to see engineering signals in action, or
            read the methodology for the full technical breakdown.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
            >
              Browse Sectors
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-300 text-sm font-medium transition-colors"
            >
              Read Methodology
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
