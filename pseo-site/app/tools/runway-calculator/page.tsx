import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { RunwayCalculator } from "@/components/RunwayCalculator";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import EmbedThisCard from "@/components/EmbedThisCard";
import { HreflangLinks } from "@/components/HreflangLinks";

const SITE = "https://signals.gitdealflow.com";
const PAGE_URL = `${SITE}/tools/runway-calculator`;

const RUNWAY_PARAM_KEYS = ["cash", "burn", "rev", "hires", "salary"] as const;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Dynamic OG: each shared URL gets its own preview card with band
 * color (danger / warning / safe / infinite). See the matching OG
 * route at /api/og/tools/runway-calculator.
 */
export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const ogParams = new URLSearchParams();
  for (const key of RUNWAY_PARAM_KEYS) {
    const v = sp[key];
    if (typeof v === "string" && v.length > 0) {
      ogParams.set(key, v);
    }
  }
  const ogQuery = ogParams.toString();
  const ogImage = `${SITE}/api/og/tools/runway-calculator${ogQuery ? `?${ogQuery}` : ""}`;

  return {
    title:
      "Runway Calculator — Cash, Burn, Headcount Scenarios for Startups",
    description:
      "Free startup runway calculator. Cash divided by net burn equals months of runway. Model headcount scenarios — see how many months each engineer costs you. URL-shareable results.",
    alternates: { canonical: "/tools/runway-calculator" },
    openGraph: {
      title: "Runway Calculator",
      description:
        "Cash, burn, headcount scenarios. URL-shareable startup runway math.",
      type: "website",
      url: PAGE_URL,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Runway Calculator — VC Deal Flow Signal",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Runway Calculator",
      description:
        "Free startup runway calculator with headcount scenarios and shareable URLs.",
      images: [ogImage],
    },
    keywords: [
      "runway calculator",
      "startup runway",
      "burn rate calculator",
      "cash runway calculator",
      "months of runway",
      "fundraise timing",
      "headcount cost calculator",
      "startup financial model",
    ],
  };
}

const FAQS: { question: string; answer: string }[] = [
  {
    question: "How is runway calculated?",
    answer:
      "Runway in months = cash on hand divided by net monthly burn. Net burn = gross burn minus monthly revenue. If revenue covers burn (net burn is zero or negative), runway is effectively infinite — the company is cashflow-positive.",
  },
  {
    question: "When should I start fundraising?",
    answer:
      "Conventional wisdom: start raising at 12 months of runway and close by 6 months. Below 6 months, you are negotiating from weakness. The calculator's danger band reflects this rule of thumb.",
  },
  {
    question: "How is the per-engineer cost computed?",
    answer:
      "Per-engineer monthly cost = base salary × 1.3 / 12. The 1.3 multiplier covers employer-side payroll taxes (FICA, FUTA, state), healthcare, equipment, and tools. If your loaded cost differs (e.g., remote-only with no benefits ≈ 1.15, or NYC office with full benefits ≈ 1.4), adjust the salary input upward or downward.",
  },
  {
    question: "Does this account for new revenue from those hires?",
    answer:
      "No — this is a strict cost-side model. New engineering hires usually take 6 to 18 months to contribute revenue, and attributing future revenue to specific headcount is notoriously hard. The conservative move is to model their cost without their revenue contribution and treat any revenue uplift as upside.",
  },
  {
    question: "What about one-off expenses or seasonal burn?",
    answer:
      "The calculator uses a steady-state monthly burn. If you have lumpy expenses (annual SaaS renewals, end-of-quarter marketing pushes, contractor invoices), either average them into the monthly burn or use this calculator as a baseline and adjust for known events separately.",
  },
  {
    question: "Can I share my calculation?",
    answer:
      "Yes — every input is encoded in the URL. The 'Copy share link' button copies the current URL to your clipboard. Send it to your co-founder, board, or investor and they open the calculator with the same numbers.",
  },
];

export default function RunwayCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${PAGE_URL}#tool`,
        name: "Runway Calculator",
        url: PAGE_URL,
        applicationCategory: "FinanceApplication",
        applicationSubCategory: "Startup runway calculator",
        operatingSystem: "Web",
        description:
          "Free startup runway calculator with headcount scenarios. Cash divided by net burn, with the option to model adding engineers at a loaded cost (salary × 1.3 / 12).",
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
          "Cash / net burn math",
          "Headcount scenario modelling",
          "Loaded-cost engineer calculations",
          "Fundraise-timing bands (danger / warning / safe)",
          "URL-shareable calculations",
          "No signup required",
        ],
      },
      {
        "@type": "HowTo",
        "@id": `${PAGE_URL}#howto`,
        name: "How to calculate startup runway",
        description:
          "Five-step calculation of months of runway with optional headcount scenario.",
        totalTime: "PT2M",
        estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: 0 },
        tool: { "@id": `${PAGE_URL}#tool` },
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Enter cash on hand",
            text: "Enter total bank balance plus committed but unspent capital.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Enter gross monthly burn",
            text: "Enter total monthly cash out — salaries, infrastructure, tools, marketing, everything.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Enter monthly revenue",
            text: "Enter MRR or equivalent recurring inflow. Leave at zero if pre-revenue.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Model headcount (optional)",
            text: "Enter how many engineers you're considering hiring and their average base salary. The calculator applies a 1.3 loaded-cost multiplier.",
          },
          {
            "@type": "HowToStep",
            position: 5,
            name: "Read the runway and band",
            text: "Runway in months = cash / total net burn. The band (danger / warning / safe) maps to fundraise-timing rules of thumb.",
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
            name: "Runway Calculator",
            item: PAGE_URL,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": PAGE_URL,
        url: PAGE_URL,
        name: "Runway Calculator — Cash, Burn, Headcount Scenarios for Startups",
        description:
          "Free startup runway calculator with headcount scenarios and shareable URLs.",
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
      <AgentMirrorLinks path="/tools/runway-calculator" qaCategory="venture-vocabulary" />

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
          <span className="text-gray-400">Runway Calculator</span>
        </nav>

        <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-2">
          Free tool
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Runway Calculator
        </h1>
        <p
          className="text-lg text-gray-300 leading-relaxed mb-10"
          data-speakable
        >
          How many months of runway do you have? Cash divided by net burn gives
          you the answer. Model new hires to see how each engineer compresses
          the timeline. URL-shareable so you can send the exact scenario to
          your co-founder or board.
        </p>

        <Suspense
          fallback={
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 text-gray-400 text-sm">
              Loading calculator…
            </div>
          }
        >
          <RunwayCalculator />
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

        <section className="mt-12 grid sm:grid-cols-2 gap-4">
          <Link
            href="/define/runway"
            className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 transition-all"
          >
            <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-1">
              Definition
            </p>
            <h3 className="text-gray-100 font-medium text-base group-hover:text-sky-300 transition-colors mb-1">
              What is runway?
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The canonical definition with cross-references to burn rate and
              fundraise-timing conventions.
            </p>
          </Link>
          <Link
            href="/define/burn-rate"
            className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 transition-all"
          >
            <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-1">
              Definition
            </p>
            <h3 className="text-gray-100 font-medium text-base group-hover:text-sky-300 transition-colors mb-1">
              What is burn rate?
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Gross vs net burn, what it means, and why investors care.
            </p>
          </Link>
        </section>

        <section className="mt-8">
          <Link
            href="/tools/safe-calculator"
            className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 transition-all"
          >
            <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-1">
              Companion tool
            </p>
            <h3 className="text-gray-100 font-medium text-base group-hover:text-sky-300 transition-colors mb-1">
              SAFE Calculator &rarr;
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Once your runway tells you it's time to raise, the SAFE
              calculator tells you what the SAFE will convert to at the next
              priced round.
            </p>
          </Link>
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
          <p className="text-sm text-gray-400 leading-relaxed">Drop the live runway calculator into a newsletter, blog, or portal. The snippet ships a visible source credit linking back here.</p>
          <EmbedThisCard embedPath="/embed/tools/runway-calculator" sourcePath="/tools/runway-calculator" label="Runway Calculator" height={560} />
        </div>
      </div>
      </div>
    </>
  );
}
