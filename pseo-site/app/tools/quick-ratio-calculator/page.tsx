import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { QuickRatioCalculator } from "@/components/QuickRatioCalculator";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";

const SITE = "https://signals.gitdealflow.com";
const PAGE_URL = `${SITE}/tools/quick-ratio-calculator`;

const PARAM_KEYS = ["new", "exp", "churn", "contract"] as const;

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
  const ogImage = `${SITE}/api/og/tools/quick-ratio-calculator${ogQuery ? `?${ogQuery}` : ""}`;

  return {
    title:
      "SaaS Quick Ratio Calculator — Growth Efficiency, Kleiner Perkins Bands",
    description:
      "Free SaaS quick ratio calculator. (New ARR + expansion) divided by (churned + contracted), classified into the Kleiner Perkins / Mamoon Hamid bands (≥4 exceptional, 2-4 healthy, 1.5-2 OK, 1-1.5 concerning, <1 bad). URL-shareable.",
    alternates: { canonical: "/tools/quick-ratio-calculator" },
    openGraph: {
      title: "Quick Ratio Calculator — VC Deal Flow Signal",
      description:
        "Growth-efficiency ratio in one number. Kleiner Perkins bands, URL-shareable.",
      type: "website",
      url: PAGE_URL,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "SaaS Quick Ratio Calculator — VC Deal Flow Signal",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Quick Ratio Calculator — VC Deal Flow Signal",
      description:
        "Free SaaS quick ratio calculator with Kleiner Perkins efficiency bands.",
      images: [ogImage],
    },
    keywords: [
      "quick ratio calculator",
      "SaaS quick ratio",
      "Kleiner Perkins quick ratio",
      "Mamoon Hamid quick ratio",
      "SaaS growth efficiency",
      "NDR companion metric",
      "expansion ARR calculator",
      "churned ARR calculator",
    ],
  };
}

const FAQS: { question: string; answer: string }[] = [
  {
    question: "What is the SaaS quick ratio?",
    answer:
      "Quick ratio is the gross-flows view of growth efficiency: (new ARR + expansion ARR) divided by (churned ARR + contracted ARR). It expresses how many dollars of gross new ARR the business adds for every dollar of ARR it loses. Higher is better. >4 is best-in-class; <1 means the business is shrinking.",
  },
  {
    question: "Who originated the metric?",
    answer:
      "Mamoon Hamid (Kleiner Perkins) is broadly credited with popularising quick ratio as a SaaS-investor heuristic. It became standard in growth-stage diligence because it captures dynamics that NDR (net dollar retention) compresses away — two companies with the same NDR can have very different quick ratios.",
  },
  {
    question: "What are the standard bands?",
    answer:
      "≥4 exceptional (best-in-class growth efficiency), 2-4 healthy (top quartile), 1.5-2 OK (typical at scale), 1-1.5 concerning (net churn is dominating growth, investors will dig in), <1 bad (net ARR is shrinking — fix retention before scaling acquisition).",
  },
  {
    question: "How is this different from NDR?",
    answer:
      "NDR compresses (expansion - churn - contraction) into a single multiplier on the starting ARR base. Quick ratio looks at the gross flows separately: how much you're winning AND how much you're losing. A company with 100% NDR and quick ratio of 4 is growing through both acquisition and retention; a company with 100% NDR and quick ratio of 1.2 is barely staying ahead of its own churn. Both look identical in NDR.",
  },
  {
    question: "How should I pick the measurement period?",
    answer:
      "Monthly is right at early stage where churn dynamics matter quarter-over-quarter. Quarterly is right at scale where monthly noise dominates. Annual smooths over short-term churn dynamics you actually want to see — avoid unless you have a multi-year dataset.",
  },
  {
    question: "Can I share my calculation?",
    answer:
      "Yes — every input is encoded in the URL. The 'Copy share link' button copies the current URL to your clipboard. Send it to your board, head of growth, or investor and they open the calculator with the same numbers.",
  },
];

export default function QuickRatioPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${PAGE_URL}#tool`,
        name: "SaaS Quick Ratio Calculator",
        url: PAGE_URL,
        applicationCategory: "FinanceApplication",
        applicationSubCategory: "SaaS growth efficiency calculator",
        operatingSystem: "Web",
        description:
          "Free SaaS quick ratio calculator with Kleiner Perkins / Mamoon Hamid bands. Inputs: new customer ARR, expansion ARR, churned ARR, contracted ARR. URL-shareable.",
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
          "Quick ratio = gained ARR / lost ARR",
          "Kleiner Perkins / Mamoon Hamid band classification",
          "Net new ARR breakdown (positive vs negative growth)",
          "Infinite-ratio handling (no losses yet)",
          "URL-shareable calculations",
          "No signup required",
        ],
      },
      {
        "@type": "HowTo",
        "@id": `${PAGE_URL}#howto`,
        name: "How to calculate SaaS quick ratio",
        description:
          "Four-step calculation of SaaS quick ratio with band classification.",
        totalTime: "PT1M",
        estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: 0 },
        tool: { "@id": `${PAGE_URL}#tool` },
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Enter new customer ARR",
            text: "Enter ARR added by net new customers acquired in the period.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Enter expansion ARR",
            text: "Enter ARR uplift from existing customers (upsells, cross-sells, seat growth).",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Enter churned ARR",
            text: "Enter ARR from customers who cancelled in the period.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Enter contracted ARR",
            text: "Enter ARR lost from existing customers who downgraded but didn't cancel. Quick ratio = (new + expansion) / (churned + contracted).",
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
            name: "Quick Ratio Calculator",
            item: PAGE_URL,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": PAGE_URL,
        url: PAGE_URL,
        name: "SaaS Quick Ratio Calculator — Growth Efficiency, Kleiner Perkins Bands",
        description:
          "Free SaaS quick ratio calculator with Kleiner Perkins band classification and shareable URLs.",
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
      <AgentMirrorLinks path="/tools/quick-ratio-calculator" qaCategory="venture-vocabulary" />

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
          <span className="text-gray-400">Quick Ratio Calculator</span>
        </nav>

        <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-2">
          Free tool
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          SaaS Quick Ratio Calculator
        </h1>
        <p
          className="text-lg text-gray-300 leading-relaxed mb-10"
          data-speakable
        >
          Growth efficiency in one number. (New ARR + expansion) divided by
          (churned + contracted) tells you whether your gains are outpacing
          your losses, and by how much. Classified into the Kleiner Perkins /
          Mamoon Hamid bands (≥4 exceptional · 2-4 healthy · 1.5-2 OK · 1-1.5
          concerning · &lt;1 bad), with explicit handling for the
          no-losses-yet edge case at early stage.
        </p>

        <Suspense
          fallback={
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 text-gray-400 text-sm">
              Loading calculator…
            </div>
          }
        >
          <QuickRatioCalculator />
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
            Quick ratio completes the five SaaS metrics every growth-stage
            investor runs in diligence. Healthy companies score well on all
            five; discrepancies are diagnostic.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/tools/burn-multiple-calculator"
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
            >
              <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-1">
                Whole-company
              </p>
              <h3 className="text-gray-100 font-medium text-sm group-hover:text-sky-300 transition-colors">
                Burn Multiple
              </h3>
            </Link>
            <Link
              href="/tools/magic-number-calculator"
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
            >
              <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-1">
                Per-cohort GTM
              </p>
              <h3 className="text-gray-100 font-medium text-sm group-hover:text-sky-300 transition-colors">
                Magic Number
              </h3>
            </Link>
            <Link
              href="/tools/cac-payback-calculator"
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
            >
              <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-1">
                Per-customer
              </p>
              <h3 className="text-gray-100 font-medium text-sm group-hover:text-sky-300 transition-colors">
                CAC Payback
              </h3>
            </Link>
            <Link
              href="/tools/ltv-calculator"
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
            >
              <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-1">
                Lifetime + ratio
              </p>
              <h3 className="text-gray-100 font-medium text-sm group-hover:text-sky-300 transition-colors">
                LTV / LTV:CAC
              </h3>
            </Link>
            <div className="rounded-lg border border-sky-700/50 bg-sky-950/30 p-4">
              <p className="text-xs uppercase tracking-wider text-sky-300 font-medium mb-1">
                Growth efficiency · you are here
              </p>
              <h3 className="text-sky-200 font-medium text-sm">
                Quick Ratio
              </h3>
            </div>
            <Link
              href="/tools/runway-calculator"
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
            >
              <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-1">
                Time view
              </p>
              <h3 className="text-gray-100 font-medium text-sm group-hover:text-sky-300 transition-colors">
                Runway
              </h3>
            </Link>
          </div>
        </section>

        <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            See this week&apos;s breakout startups
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            VC Deal Flow Signal ranks startups by GitHub engineering
            acceleration.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
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
      </div>
    </>
  );
}
