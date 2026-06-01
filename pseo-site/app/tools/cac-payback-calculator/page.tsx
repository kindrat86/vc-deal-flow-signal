import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CacPaybackCalculator } from "@/components/CacPaybackCalculator";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import EmbedThisCard from "@/components/EmbedThisCard";
import { HreflangLinks } from "@/components/HreflangLinks";

const SITE = "https://signals.gitdealflow.com";
const PAGE_URL = `${SITE}/tools/cac-payback-calculator`;

const PARAM_KEYS = ["spend", "customers", "arpc", "gm"] as const;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const ogParams = new URLSearchParams();
  for (const key of PARAM_KEYS) {
    const v = sp[key];
    if (typeof v === "string" && v.length > 0) {
      ogParams.set(key, v);
    }
  }
  const ogQuery = ogParams.toString();
  const ogImage = `${SITE}/api/og/tools/cac-payback-calculator${ogQuery ? `?${ogQuery}` : ""}`;

  return {
    title:
      "CAC Payback Calculator — Customer Acquisition Cost in Months",
    description:
      "Free CAC payback calculator. CAC / (monthly ARPC × gross margin %) in months, classified into the standard SaaS bands (<6mo exceptional / 6-12 great / 12-18 good / 18-24 OK / >24 bad). URL-shareable.",
    alternates: { canonical: "/tools/cac-payback-calculator" },
    openGraph: {
      title: "CAC Payback Calculator — VC Deal Flow Signal",
      description:
        "Customer-acquisition-cost payback in months, with the standard SaaS bands.",
      type: "website",
      url: PAGE_URL,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "CAC Payback Calculator — VC Deal Flow Signal",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "CAC Payback Calculator — VC Deal Flow Signal",
      description:
        "Free SaaS CAC payback calculator with shareable URLs and standard bands.",
      images: [ogImage],
    },
    keywords: [
      "CAC payback calculator",
      "customer acquisition cost",
      "CAC payback months",
      "SaaS CAC payback",
      "Bessemer CAC payback",
      "ARPC calculator",
      "gross margin calculator",
      "SaaS unit economics",
    ],
  };
}

const FAQS: { question: string; answer: string }[] = [
  {
    question: "What is CAC payback?",
    answer:
      "CAC payback is how many months it takes for the gross profit from a customer to repay the cost of acquiring them. Formula: CAC / (monthly ARPC × gross margin %). Lower is better. It is the customer-level efficiency metric in the same family as magic number (cohort-level) and burn multiple (company-level).",
  },
  {
    question: "What are the standard bands?",
    answer:
      "Roughly: <6 months exceptional (best-in-class PLG and infra SaaS), 6-12 months great (top quartile), 12-18 months good (typical Series B+ enterprise SaaS), 18-24 months OK (acceptable at scale, watch trajectory), >24 months bad (most growth-stage investors will pass). Enterprise SaaS sits at the longer end; PLG / infra SaaS pulls toward the shorter end.",
  },
  {
    question: "How does this relate to magic number and burn multiple?",
    answer:
      "All three measure SaaS efficiency from different angles: CAC payback is per-customer, magic number is per-cohort GTM input, burn multiple is the whole company's burn vs ARR. Healthy companies score well on all three. Discrepancies are diagnostic — great burn multiple + 25-month CAC payback means efficient on average but reliant on unhealthy long-tail customers; great CAC payback + poor magic number means each customer is profitable but the motion isn't scaling.",
  },
  {
    question: "Why gross margin matters",
    answer:
      "Revenue ≠ profit. A customer paying $1,000/mo at 75% gross margin contributes $750/mo of gross profit; at 40% margin only $400/mo. Payback uses gross contribution, not revenue, because cost of revenue (hosting, support, payment processing, licensing) has to come out before any of it can pay back CAC. Healthy SaaS gross margin sits at 70-80%; lower margins push payback out proportionally.",
  },
  {
    question: "What if I don't acquire any new customers?",
    answer:
      "CAC is undefined when zero new customers were acquired — there is no cost per customer to compute. The calculator flags this state explicitly. If you find yourself there, the diagnostic question is whether the spend produced no customers or whether the period was just too short to see them land.",
  },
  {
    question: "Can I share my calculation?",
    answer:
      "Yes — every input is encoded in the URL. The 'Copy share link' button copies the current URL to your clipboard. Send it to your board, head of sales, or growth-stage investor and they open the calculator with the same numbers.",
  },
];

export default function CacPaybackPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${PAGE_URL}#tool`,
        name: "CAC Payback Calculator",
        url: PAGE_URL,
        applicationCategory: "FinanceApplication",
        applicationSubCategory: "SaaS unit economics calculator",
        operatingSystem: "Web",
        description:
          "Free SaaS CAC payback calculator with standard band classification. Inputs: S&M spend, new customers acquired, ARPC, gross margin. URL-shareable.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
        },
        creator: {
          "@type": "Organization",
          "@id": "https://gitdealflow.com/#organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        featureList: [
          "CAC payback in months",
          "Gross-contribution-aware (uses ARPC × GM%, not raw revenue)",
          "Standard band classification (Bessemer / OpenView)",
          "Undefined-state handling",
          "URL-shareable calculations",
          "No signup required",
        ],
      },
      {
        "@type": "HowTo",
        "@id": `${PAGE_URL}#howto`,
        name: "How to calculate CAC payback",
        description:
          "Four-step calculation of customer-acquisition-cost payback in months.",
        totalTime: "PT1M",
        estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: 0 },
        tool: { "@id": `${PAGE_URL}#tool` },
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Enter S&M spend",
            text: "Enter total sales + marketing spend over the measurement period.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Enter new customers acquired",
            text: "Enter net new paying customers acquired in the same period. CAC = S&M spend / new customers.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Enter ARPC (annual)",
            text: "Enter average annual revenue per customer. The calculator divides by 12 for monthly ARPC.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Enter gross margin",
            text: "Enter gross margin percentage. Healthy SaaS sits at 70-80%. Payback = CAC / (monthly ARPC × gross margin %).",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${PAGE_URL}#faq`,
        url: PAGE_URL,
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE}/tools` },
          {
            "@type": "ListItem",
            position: 3,
            name: "CAC Payback Calculator",
            item: PAGE_URL,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": PAGE_URL,
        url: PAGE_URL,
        name: "CAC Payback Calculator — Customer Acquisition Cost in Months",
        description:
          "Free SaaS CAC payback calculator with standard-band classification and shareable URLs.",
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE}/#website` },
        mainEntity: { "@id": `${PAGE_URL}#tool` },
        license: "https://creativecommons.org/licenses/by/4.0/",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[data-speakable]"],
        },
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
      <AgentMirrorLinks path="/tools/cac-payback-calculator" qaCategory="venture-vocabulary" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/tools" className="hover:text-gray-300 transition-colors">
            Tools
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">CAC Payback Calculator</span>
        </nav>

        <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-2">
          Free tool
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          CAC Payback Calculator
        </h1>
        <p
          className="text-lg text-gray-300 leading-relaxed mb-10"
          data-speakable
        >
          How many months does it take for a new customer's gross profit to
          repay the cost of acquiring them? Customer-acquisition-cost payback
          is the canonical per-customer SaaS efficiency metric. Classified
          into the standard bands (&lt;6mo exceptional · 6-12 great · 12-18
          good · 18-24 OK · &gt;24 bad), with gross-margin built in so the
          number reflects actual contribution, not raw revenue.
        </p>

        <Suspense
          fallback={
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 text-gray-400 text-sm">
              Loading calculator…
            </div>
          }
        >
          <CacPaybackCalculator />
        </Suspense>

        <section className="mt-16" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.question}
                className="group rounded-lg border border-slate-800 bg-slate-900"
              >
                <summary className="cursor-pointer p-5 text-gray-100 font-medium flex items-center justify-between gap-4">
                  <span>{f.question}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0">
                    &#9662;
                  </span>
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {f.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            SaaS efficiency suite
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Healthy companies score well on all three. Discrepancies are
            diagnostic.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href="/tools/burn-multiple-calculator"
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 transition-all"
            >
              <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-1">
                Whole-company
              </p>
              <h3 className="text-gray-100 font-medium text-base group-hover:text-sky-300 transition-colors mb-1">
                Burn Multiple
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Total burn / net new ARR. Sacks bands.
              </p>
            </Link>
            <Link
              href="/tools/magic-number-calculator"
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 transition-all"
            >
              <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-1">
                Per-cohort GTM
              </p>
              <h3 className="text-gray-100 font-medium text-base group-hover:text-sky-300 transition-colors mb-1">
                Magic Number
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Annualized net new ARR / quarterly S&M. Bessemer bands.
              </p>
            </Link>
            <div className="rounded-lg border border-sky-700/50 bg-sky-950/30 p-5">
              <p className="text-xs uppercase tracking-wider text-sky-300 font-medium mb-1">
                Per-customer · you are here
              </p>
              <h3 className="text-sky-200 font-medium text-base mb-1">
                CAC Payback
              </h3>
              <p className="text-sky-300/80 text-sm leading-relaxed">
                CAC / (monthly ARPC × GM%). Standard bands.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-12 rounded-xl border border-sky-700/30 bg-gradient-to-br from-sky-950/40 to-slate-900 p-6 sm:p-8 text-center">
          <p className="text-xs uppercase tracking-wider text-sky-300 font-semibold mb-2">
            Sunday digest · free
          </p>
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Plug these numbers into real companies
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            Every Sunday: the 5 startups with the highest GitHub
            commit-velocity acceleration this week, with the underlying
            signals you can pressure-test in these tools. Free, no spam,
            one-click unsubscribe.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link
              href="https://gitdealflow.com/#signup"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-sm font-semibold transition-colors"
            >
              Get the Sunday digest &rarr;
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-300 text-sm font-medium transition-colors"
            >
              Browse Signals
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-300 text-sm font-medium transition-colors"
            >
              More Tools
            </Link>
          </div>
        </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-2">Embed this calculator</h2>
          <p className="text-sm text-gray-400 leading-relaxed">Drop the live cac payback calculator into a newsletter, blog, or portal. The snippet ships a visible source credit linking back here.</p>
          <EmbedThisCard embedPath="/embed/tools/cac-payback-calculator" sourcePath="/tools/cac-payback-calculator" label="CAC Payback Calculator" height={540} />
        </div>
      </div>
      </div>
    </>
  );
}
