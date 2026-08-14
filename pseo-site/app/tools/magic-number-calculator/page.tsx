import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { MagicNumberCalculator } from "@/components/MagicNumberCalculator";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import EmbedThisCard from "@/components/EmbedThisCard";
import { HreflangLinks } from "@/components/HreflangLinks";

const SITE = "https://signals.gitdealflow.com";
const PAGE_URL = `${SITE}/tools/magic-number-calculator`;

// Static metadata: this route must prerender. Reading searchParams
// here forces per-request dynamic rendering (private, no-store) for
// every crawl of a sitemap'd page. The og:image endpoint accepts the
// same params, but the meta tag stays static; shared URLs still work
// (client hydrates values), the card just shows default values.
export function generateMetadata(): Metadata {
  const ogImage = `${SITE}/api/og/tools/magic-number-calculator`;

  return {
    title:
      "SaaS Magic Number Calculator, Sales Efficiency, Bessemer Bands",
    description:
      "Free SaaS magic number calculator. (Current ARR − prior ARR) × 4 / quarterly S&M spend, classified into the Bessemer / OpenView efficiency bands. URL-shareable for board decks and investor updates.",
    alternates: { canonical: "/tools/magic-number-calculator" },
    openGraph: {
      title: "Magic Number Calculator",
      description:
        "Sales-efficiency ratio in one number. Bessemer bands, URL-shareable.",
      type: "website",
      url: PAGE_URL,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Magic Number Calculator, VC Deal Flow Signal",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Magic Number Calculator",
      description:
        "Free SaaS magic number calculator with sales-efficiency bands.",
      images: [ogImage],
    },
    keywords: [
      "magic number calculator",
      "SaaS magic number",
      "sales efficiency calculator",
      "Bessemer magic number",
      "OpenView magic number",
      "S&M efficiency",
      "CAC efficiency",
      "growth-stage diligence",
    ],
  };
}

const FAQS: { question: string; answer: string }[] = [
  {
    question: "What is the SaaS magic number?",
    answer:
      "Magic number is the sales-efficiency ratio for SaaS businesses. The formula is (current-quarter ARR − prior-quarter ARR) × 4, divided by quarterly sales + marketing spend. The × 4 annualizes the quarterly net-new-ARR delta so the ratio compares full-year ARR added against the quarter's S&M input.",
  },
  {
    question: "What are the standard bands?",
    answer:
      "Bessemer and OpenView publish similar conventions: >1.5 exceptional (invest more aggressively), 1.0-1.5 good (continue investing), 0.75-1.0 OK (hold pace, watch trajectory), <0.75 bad (cut spend and find the bottleneck before investing more). Bands tighten at growth stage where the model should be tuned, and loosen at very early stage where quarterly noise dominates.",
  },
  {
    question: "How is this different from burn multiple?",
    answer:
      "Burn multiple is total burn / net new ARR, it includes everything that consumes cash (R&D, G&A, infra, plus S&M). Magic number is narrower: only S&M spend in the denominator. Magic number tells you whether the GTM motion is working; burn multiple tells you whether the company as a whole is converting burn into revenue efficiently.",
  },
  {
    question: "What if ARR shrank quarter over quarter?",
    answer:
      "Then magic number is negative, which means S&M spend is destroying value rather than producing ARR. The calculator flags this state explicitly. The right response is to stop investing in growth until the underlying retention or expansion problem is fixed, not to spend more on top of a contracting base.",
  },
  {
    question: "What if S&M spend is zero?",
    answer:
      "Magic number is undefined when S&M is zero, efficiency is a ratio and dividing by zero gives no signal. The calculator handles this case explicitly. Companies that grow with zero S&M (rare, usually product-led with strong virality) should look at growth rate alone rather than trying to compute an efficiency metric.",
  },
  {
    question: "Can I share my calculation?",
    answer:
      "Yes, every input is encoded in the URL. The 'Copy share link' button copies the current URL to your clipboard. Send it to your board, head of sales, or growth-stage investor and they open the calculator with the same numbers.",
  },
];

export default function MagicNumberPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${PAGE_URL}#tool`,
        name: "Magic Number Calculator",
        url: PAGE_URL,
        applicationCategory: "FinanceApplication",
        applicationSubCategory: "SaaS sales efficiency calculator",
        operatingSystem: "Web",
        description:
          "Free SaaS magic number calculator with Bessemer/OpenView efficiency bands (exceptional / good / OK / bad). Inputs: prior quarter ARR, current quarter ARR, quarterly S&M spend. URL-shareable.",
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
          "Magic number = annualized net new ARR / quarterly S&M",
          "Bessemer / OpenView band classification",
          "Negative-magic-number handling",
          "Undefined-state handling for zero S&M",
          "URL-shareable calculations",
          "No signup required",
        ],
      },
      {
        "@type": "HowTo",
        "@id": `${PAGE_URL}#howto`,
        name: "How to calculate SaaS magic number",
        description:
          "Three-step calculation of magic number with Bessemer-band classification.",
        totalTime: "PT1M",
        estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: 0 },
        tool: { "@id": `${PAGE_URL}#tool` },
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Enter prior-quarter ARR",
            text: "Enter the company's ARR at the END of the previous quarter.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Enter current-quarter ARR",
            text: "Enter the ARR at the END of the current quarter. Net new ARR = current minus prior.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Enter quarterly S&M spend",
            text: "Enter total sales + marketing spend across the current quarter. Magic number = net new ARR × 4 / quarterly S&M spend.",
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
            name: "Magic Number Calculator",
            item: PAGE_URL,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": PAGE_URL,
        url: PAGE_URL,
        name: "SaaS Magic Number Calculator, Sales Efficiency, Bessemer Bands",
        description:
          "Free SaaS magic number calculator with Bessemer-band classification and shareable URLs.",
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
      <AgentMirrorLinks path="/tools/magic-number-calculator" qaCategory="venture-vocabulary" />

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
          <span className="text-gray-400">Magic Number Calculator</span>
        </nav>

        <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-2">
          Free tool
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          SaaS Magic Number Calculator
        </h1>
        <p
          className="text-lg text-gray-300 leading-relaxed mb-10"
          data-speakable
        >
          The canonical sales-efficiency ratio for SaaS. Annualized net new ARR
          divided by quarterly S&amp;M spend tells you whether your GTM motion
          is paying for itself. Classified into the bands Bessemer and
          OpenView publish, with explicit handling for the contracting-ARR and
          zero-spend edge cases.
        </p>

        <Suspense
          fallback={
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 text-gray-400 text-sm">
              Loading calculator…
            </div>
          }
        >
          <MagicNumberCalculator />
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
            href="/tools/burn-multiple-calculator"
            className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 transition-all"
          >
            <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-1">
              Companion tool
            </p>
            <h3 className="text-gray-100 font-medium text-base group-hover:text-sky-300 transition-colors mb-1">
              Burn Multiple Calculator &rarr;
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Magic number measures GTM efficiency. Burn multiple measures
              whole-company efficiency. Use both during diligence.
            </p>
          </Link>
          <Link
            href="/tools/runway-calculator"
            className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 transition-all"
          >
            <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-1">
              Companion tool
            </p>
            <h3 className="text-gray-100 font-medium text-base group-hover:text-sky-300 transition-colors mb-1">
              Runway Calculator &rarr;
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Efficiency tells you whether to invest. Runway tells you how
              long you have to decide.
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
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-signal-500 hover:bg-signal-400 text-slate-950 text-sm font-semibold transition-colors"
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
          <p className="text-sm text-gray-400 leading-relaxed">Drop the live magic number calculator into a newsletter, blog, or portal. The snippet ships a visible source credit linking back here.</p>
          <EmbedThisCard embedPath="/embed/tools/magic-number-calculator" sourcePath="/tools/magic-number-calculator" label="Magic Number Calculator" height={500} />
        </div>
      </div>
      </div>
    </>
  );
}
