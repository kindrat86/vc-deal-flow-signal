import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SafeCalculator } from "@/components/SafeCalculator";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";

const SITE = "https://signals.gitdealflow.com";
const PAGE_URL = `${SITE}/tools/safe-calculator`;

const SAFE_PARAM_KEYS = ["amount", "cap", "discount", "pre", "invest"] as const;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Dynamic OG: each shared URL gets its own preview card. The OG image
 * route at /api/og/tools/safe-calculator reads the same params and
 * renders the computed result, so a paste to Twitter/Slack/LinkedIn
 * shows the actual ownership %, not a generic image.
 */
export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const ogParams = new URLSearchParams();
  for (const key of SAFE_PARAM_KEYS) {
    const v = sp[key];
    if (typeof v === "string" && v.length > 0) {
      ogParams.set(key, v);
    }
  }
  const ogQuery = ogParams.toString();
  const ogImage = `${SITE}/api/og/tools/safe-calculator${ogQuery ? `?${ogQuery}` : ""}`;

  return {
    title:
      "SAFE Calculator — Post-Money Conversion, Cap vs Discount, Dilution",
    description:
      "Free SAFE calculator. Model YC 2018+ post-money SAFE conversion under both the valuation cap and the discount, see your effective ownership at the next priced round, and share the calculation via URL.",
    alternates: { canonical: "/tools/safe-calculator" },
    openGraph: {
      title: "SAFE Calculator — VC Deal Flow Signal",
      description:
        "Post-money SAFE conversion math, cap-vs-discount comparison, URL-shareable results.",
      type: "website",
      url: PAGE_URL,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "SAFE Calculator — VC Deal Flow Signal",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "SAFE Calculator — VC Deal Flow Signal",
      description: "Free post-money SAFE calculator with shareable URLs.",
      images: [ogImage],
    },
    keywords: [
      "SAFE calculator",
      "post-money SAFE",
      "SAFE conversion calculator",
      "valuation cap calculator",
      "SAFE discount calculator",
      "startup dilution calculator",
      "YC SAFE math",
      "convertible note vs SAFE",
    ],
  };
}

const FAQS: { question: string; answer: string }[] = [
  {
    question: "How does this SAFE calculator work?",
    answer:
      "It models the YC 2018+ post-money SAFE. You enter the SAFE amount, the valuation cap (post-money), and a discount. Optionally model a next priced round — the calculator compares conversion under the cap versus under the discount and shows whichever gives the SAFE holder more ownership, which is how a post-money SAFE actually converts.",
  },
  {
    question: "What does post-money SAFE mean?",
    answer:
      "A post-money SAFE caps the company's valuation after the SAFE itself (and any other SAFEs) have converted. Your post-money ownership = SAFE amount / valuation cap. Pre-money SAFEs (the older 2013–2018 variant) calculate differently because the cap excludes the SAFEs themselves.",
  },
  {
    question: "When does the cap apply vs the discount?",
    answer:
      "The cap applies when the next round prices at or above the cap (the cap protects you from being diluted at a higher valuation). The discount applies when the next round prices below the cap (the cap is no longer binding, so the SAFE just converts at the next-round price with the discount). The SAFE holder always gets whichever is more favorable to them — the lower conversion price, equivalent to higher ownership.",
  },
  {
    question: "Why is the cap-only ownership different from the effective ownership?",
    answer:
      "Cap-only ownership assumes the cap binds. If you also model a next round and the discounted next-round price gives you MORE ownership than the cap (which happens when the cap is high relative to the next round), the SAFE converts on the discount instead and your effective ownership is higher.",
  },
  {
    question: "Is this calculator legal or tax advice?",
    answer:
      "No — it's an educational tool. Real SAFE conversions depend on the exact document language (post-money vs pre-money, MFN, pro-rata, option-pool adjustments, side letters, and any subsequent SAFEs). Always run real numbers with your lawyer.",
  },
  {
    question: "Can I share my calculation with someone?",
    answer:
      "Yes — every input is encoded in the URL. The 'Copy share link' button copies the current URL to your clipboard. Anyone you send it to opens the calculator with the same numbers pre-filled.",
  },
];

export default function SafeCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${PAGE_URL}#tool`,
        name: "SAFE Calculator",
        url: PAGE_URL,
        applicationCategory: "FinanceApplication",
        applicationSubCategory: "Startup financing calculator",
        operatingSystem: "Web",
        description:
          "Free post-money SAFE conversion calculator. Models cap vs discount, shows effective ownership at the next priced round, and supports URL-based result sharing.",
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
          "Post-money SAFE conversion math",
          "Cap vs discount comparison",
          "Optional next-round modeling",
          "URL-shareable calculations",
          "No signup required",
        ],
      },
      {
        "@type": "HowTo",
        "@id": `${PAGE_URL}#howto`,
        name: "How to calculate post-money SAFE conversion",
        description:
          "Five-step calculation of post-money SAFE ownership at the next priced round.",
        totalTime: "PT2M",
        estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: 0 },
        tool: { "@id": `${PAGE_URL}#tool` },
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Enter SAFE amount",
            text: "Enter the dollar amount the investor put in via the SAFE.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Enter valuation cap",
            text: "Enter the post-money valuation cap from the SAFE document.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Enter discount",
            text: "Enter the discount percentage (e.g., 20 means the SAFE converts at 80% of the next round price).",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Model next round (optional)",
            text: "Enter the next priced round's pre-money valuation and round size to see how cap vs discount play against each other.",
          },
          {
            "@type": "HowToStep",
            position: 5,
            name: "Read the effective ownership",
            text: "Effective ownership = max(cap ownership, discount ownership) — the SAFE always converts at the more favorable basis.",
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
          {
            "@type": "ListItem",
            position: 2,
            name: "Tools",
            item: `${SITE}/tools`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "SAFE Calculator",
            item: PAGE_URL,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": PAGE_URL,
        url: PAGE_URL,
        name: "SAFE Calculator — Post-Money Conversion, Cap vs Discount, Dilution",
        description:
          "Free SAFE calculator. Model YC 2018+ post-money SAFE conversion under both the valuation cap and the discount.",
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
      <AgentMirrorLinks path="/tools/safe-calculator" qaCategory="venture-vocabulary" />

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
          <span className="text-gray-400">SAFE Calculator</span>
        </nav>

        <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-2">
          Free tool
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          SAFE Calculator
        </h1>
        <p
          className="text-lg text-gray-300 leading-relaxed mb-10"
          data-speakable
        >
          Find out what a post-money SAFE will convert to at the next priced
          round. Models the YC 2018+ instrument, compares conversion under the
          valuation cap versus under the discount, and supports URL-based
          sharing so you can send a colleague the exact calculation.
        </p>

        <Suspense
          fallback={
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 text-gray-400 text-sm">
              Loading calculator…
            </div>
          }
        >
          <SafeCalculator />
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
            href="/define/safe"
            className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 transition-all"
          >
            <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-1">
              Definition
            </p>
            <h3 className="text-gray-100 font-medium text-base group-hover:text-sky-300 transition-colors mb-1">
              What is a SAFE?
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Read the canonical definition with cross-references to the rest
              of the venture vocabulary.
            </p>
          </Link>
          <Link
            href="/define/valuation-cap"
            className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 transition-all"
          >
            <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-1">
              Definition
            </p>
            <h3 className="text-gray-100 font-medium text-base group-hover:text-sky-300 transition-colors mb-1">
              What is a valuation cap?
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The cap is the worst-case price you'll convert at — here's what
              that means in practice.
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
              href="/firstlook"
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
      </div>
    </>
  );
}
