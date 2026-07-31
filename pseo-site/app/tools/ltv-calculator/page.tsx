import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LtvCalculator } from "@/components/LtvCalculator";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import EmbedThisCard from "@/components/EmbedThisCard";
import { HreflangLinks } from "@/components/HreflangLinks";

const SITE = "https://signals.gitdealflow.com";
const PAGE_URL = `${SITE}/tools/ltv-calculator`;

const PARAM_KEYS = ["arpc", "gm", "churn", "cac"] as const;

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
  const ogImage = `${SITE}/api/og/tools/ltv-calculator${ogQuery ? `?${ogQuery}` : ""}`;

  return {
    title:
      "LTV Calculator — Customer Lifetime Value, LTV:CAC Ratio, Standard Bands",
    description:
      "Free SaaS LTV calculator. (ARPC/12) × gross margin × customer lifetime in months. Optional CAC input gives the LTV:CAC ratio with industry-standard bands (>5× exceptional, 3-5× healthy, 2-3× OK, 1-2× suspect, <1× bad). URL-shareable.",
    alternates: { canonical: "/tools/ltv-calculator" },
    openGraph: {
      title: "LTV Calculator",
      description:
        "Customer lifetime value with optional LTV:CAC ratio and standard bands. URL-shareable.",
      type: "website",
      url: PAGE_URL,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "LTV Calculator — VC Deal Flow Signal",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "LTV Calculator",
      description:
        "Free SaaS LTV calculator with LTV:CAC ratio and shareable URLs.",
      images: [ogImage],
    },
    keywords: [
      "LTV calculator",
      "customer lifetime value calculator",
      "LTV CAC ratio calculator",
      "SaaS LTV",
      "SaaS unit economics",
      "ICONIQ LTV CAC",
      "churn rate calculator",
      "gross margin LTV",
    ],
  };
}

const FAQS: { question: string; answer: string }[] = [
  {
    question: "What is LTV (customer lifetime value)?",
    answer:
      "LTV is the total gross profit a customer will produce over the time they stay subscribed. Simple formula: (annual ARPC / 12) × gross margin × customer lifetime in months, where customer lifetime = 1 / monthly churn rate. So a $12k/yr customer at 75% GM and 2% monthly churn produces ~$37,500 of LTV over a 50-month average lifetime.",
  },
  {
    question: "What is the standard LTV:CAC band?",
    answer:
      "Industry consensus (SaaStr, ICONIQ, Bessemer): >5× exceptional (likely under-investing in growth), 3-5× healthy (the textbook target), 2-3× OK (typical at growth stage, watch margin/churn), 1-2× suspect (each customer barely profitable), <1× bad (losing money per customer). The 3× number is the most-cited target — it builds in margin for CAC inflation and lengthening payback at scale.",
  },
  {
    question: "Why does churn matter so much?",
    answer:
      "Churn is the single biggest LTV lever. Lifetime is 1/monthly_churn, so dropping monthly churn from 3% to 1.5% doubles the lifetime (33 → 67 months) and doubles the LTV. ARPC and gross margin improvements are linear; churn improvements are hyperbolic. Most SaaS efficiency gains come from churn reduction, not pricing or cost cutting.",
  },
  {
    question: "When does this simple formula break down?",
    answer:
      "When churn isn't constant. Real cohorts show heavy early churn that flattens out — month-12 retention is much higher than month-1 retention would predict using a flat churn rate. Use this calculator for back-of-envelope; use cohort-by-cohort retention curves (and net dollar retention) for diligence.",
  },
  {
    question: "Why use gross contribution and not revenue?",
    answer:
      "Revenue is not what pays back CAC — gross profit is. A customer paying $1,000/mo at 40% gross margin contributes $400/mo of gross profit, not $1,000. The cost of revenue (hosting, support, payment processing, licensing) comes out first. LTV with raw revenue overstates by 1/(gross margin), which is significant for low-margin SaaS.",
  },
  {
    question: "Can I share my calculation?",
    answer:
      "Yes — every input is encoded in the URL. The 'Copy share link' button copies the current URL to your clipboard. Send it to your board, head of growth, or investor and they open the calculator with the same numbers.",
  },
];

export default function LtvPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${PAGE_URL}#tool`,
        name: "LTV Calculator",
        url: PAGE_URL,
        applicationCategory: "FinanceApplication",
        applicationSubCategory: "SaaS unit economics calculator",
        operatingSystem: "Web",
        description:
          "Free SaaS LTV calculator with optional LTV:CAC ratio and industry-standard bands. Inputs: ARPC annual, gross margin, monthly churn, optional CAC. URL-shareable.",
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
          "LTV = (ARPC/12) × GM% × lifetime months",
          "Optional LTV:CAC ratio with standard bands",
          "Customer lifetime derived from monthly churn",
          "Gross-contribution-aware (not raw revenue)",
          "URL-shareable calculations",
          "No signup required",
        ],
      },
      {
        "@type": "HowTo",
        "@id": `${PAGE_URL}#howto`,
        name: "How to calculate LTV and LTV:CAC ratio",
        description:
          "Four-step calculation of SaaS customer lifetime value with optional LTV:CAC ratio.",
        totalTime: "PT1M",
        estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: 0 },
        tool: { "@id": `${PAGE_URL}#tool` },
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Enter annual ARPC",
            text: "Enter average annual revenue per customer. The calculator divides by 12 for monthly ARPC.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Enter gross margin",
            text: "Enter gross margin percentage. Healthy SaaS sits at 70-80%. LTV uses gross contribution, not raw revenue.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Enter monthly churn",
            text: "Enter monthly churn rate. Customer lifetime = 1 / monthly_churn (in months). 2% monthly churn = ~50-month lifetime.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Add CAC (optional)",
            text: "Enter CAC to see the LTV:CAC ratio classified into the standard bands (>5× exceptional, 3-5× healthy, 2-3× OK, 1-2× suspect, <1× bad).",
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
            name: "LTV Calculator",
            item: PAGE_URL,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": PAGE_URL,
        url: PAGE_URL,
        name: "LTV Calculator — Customer Lifetime Value, LTV:CAC Ratio",
        description:
          "Free SaaS LTV calculator with LTV:CAC ratio bands and shareable URLs.",
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
      <AgentMirrorLinks path="/tools/ltv-calculator" qaCategory="venture-vocabulary" />

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
          <span className="text-gray-400">LTV Calculator</span>
        </nav>

        <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-2">
          Free tool
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          LTV Calculator
        </h1>
        <p
          className="text-lg text-gray-300 leading-relaxed mb-10"
          data-speakable
        >
          Customer lifetime value with the optional LTV:CAC ratio every
          investor will compute when they see your model. LTV = (ARPC/12) ×
          gross margin × customer lifetime, where lifetime is the reciprocal
          of monthly churn. Add a CAC and the calculator classifies the ratio
          into the industry-standard bands (&gt;5× exceptional · 3-5× healthy
          · 2-3× OK · 1-2× suspect · &lt;1× bad).
        </p>

        <Suspense
          fallback={
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 text-gray-400 text-sm">
              Loading calculator…
            </div>
          }
        >
          <LtvCalculator />
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
            Pair LTV with the rest of the suite. Healthy companies score well
            on all four; discrepancies are diagnostic.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/tools/cac-payback-calculator"
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 transition-all"
            >
              <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-1">
                Companion view
              </p>
              <h3 className="text-gray-100 font-medium text-base group-hover:text-sky-300 transition-colors mb-1">
                CAC Payback &rarr;
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Same CAC denominator as the LTV:CAC ratio, but expressed in
                months-to-payback instead of multiple.
              </p>
            </Link>
            <Link
              href="/tools/burn-multiple-calculator"
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 transition-all"
            >
              <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-1">
                Whole-company view
              </p>
              <h3 className="text-gray-100 font-medium text-base group-hover:text-sky-300 transition-colors mb-1">
                Burn Multiple &rarr;
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Total burn / net new ARR. Per-customer healthy ≠ whole-company
                healthy.
              </p>
            </Link>
            <Link
              href="/tools/magic-number-calculator"
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 transition-all"
            >
              <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-1">
                Per-cohort view
              </p>
              <h3 className="text-gray-100 font-medium text-base group-hover:text-sky-300 transition-colors mb-1">
                Magic Number &rarr;
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Annualized net new ARR / quarterly S&M. The GTM-motion
                efficiency view.
              </p>
            </Link>
            <Link
              href="/tools/runway-calculator"
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 transition-all"
            >
              <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-1">
                Time view
              </p>
              <h3 className="text-gray-100 font-medium text-base group-hover:text-sky-300 transition-colors mb-1">
                Runway &rarr;
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Efficiency tells you whether to invest. Runway tells you how
                long you have to decide.
              </p>
            </Link>
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
          <p className="text-sm text-gray-400 leading-relaxed">Drop the live ltv calculator into a newsletter, blog, or portal. The snippet ships a visible source credit linking back here.</p>
          <EmbedThisCard embedPath="/embed/tools/ltv-calculator" sourcePath="/tools/ltv-calculator" label="LTV Calculator" height={520} />
        </div>
      </div>
      </div>
    </>
  );
}
