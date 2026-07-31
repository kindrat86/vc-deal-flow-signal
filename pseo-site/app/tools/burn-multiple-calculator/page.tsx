import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BurnMultipleCalculator } from "@/components/BurnMultipleCalculator";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import EmbedThisCard from "@/components/EmbedThisCard";
import { HreflangLinks } from "@/components/HreflangLinks";

const SITE = "https://signals.gitdealflow.com";
const PAGE_URL = `${SITE}/tools/burn-multiple-calculator`;

const PARAM_KEYS = ["start", "end", "burn", "months"] as const;

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
  const ogImage = `${SITE}/api/og/tools/burn-multiple-calculator${ogQuery ? `?${ogQuery}` : ""}`;

  return {
    title:
      "Burn Multiple Calculator — SaaS Capital Efficiency, Sacks Bands",
    description:
      "Free burn multiple calculator. Total burn divided by net new ARR, classified into the David Sacks bands (exceptional / great / OK / suspect / bad). URL-shareable results for board decks and investor updates.",
    alternates: { canonical: "/tools/burn-multiple-calculator" },
    openGraph: {
      title: "Burn Multiple Calculator",
      description:
        "SaaS capital efficiency in one number. URL-shareable, Sacks bands built in.",
      type: "website",
      url: PAGE_URL,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Burn Multiple Calculator — VC Deal Flow Signal",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Burn Multiple Calculator",
      description:
        "Free SaaS burn multiple calculator with Sacks efficiency bands.",
      images: [ogImage],
    },
    keywords: [
      "burn multiple calculator",
      "SaaS burn multiple",
      "David Sacks burn multiple",
      "capital efficiency calculator",
      "SaaS efficiency metric",
      "net new ARR calculator",
      "startup efficiency",
      "growth-stage diligence",
    ],
  };
}

const FAQS: { question: string; answer: string }[] = [
  {
    question: "What is burn multiple?",
    answer:
      "Burn multiple = total burn divided by net new ARR over the same period. It is the single-number heuristic SaaS investors use to gauge capital efficiency: how many dollars of burn produced one dollar of new annual recurring revenue. Lower is better.",
  },
  {
    question: "Who came up with it?",
    answer:
      "David Sacks popularised the metric in a 2020 essay arguing that growth alone is the wrong yardstick — the right yardstick is how efficiently a company is converting burn into ARR. Sacks proposed the bands (exceptional / great / OK / suspect / bad) the calculator uses below.",
  },
  {
    question: "What are the Sacks bands?",
    answer:
      "Burn multiple <1× is exceptional, 1–1.5× is great, 1.5–2× is OK and typical for the stage, 2–3× is suspect (investors will dig into unit economics), >3× is bad and most growth-stage investors will pass. Bands tighten at growth stage (Series C and later) and loosen at very early stage where ARR is small enough to be noisy.",
  },
  {
    question: "How do I pick the right period length?",
    answer:
      "The most common choices are quarterly (3 months) and annual (12 months). Quarterly is more reactive but can be noisy at low ARR. Annual smooths quarter-to-quarter lumpiness and is the period most investor benchmark reports (Bessemer, ICONIQ, OpenView) use. Pick the one that matches your audience.",
  },
  {
    question: "What if net new ARR is zero or negative?",
    answer:
      "Burn multiple is undefined if net new ARR is zero or negative. The team consumed cash but did not grow the revenue base, so any ratio you'd produce is misleading. The calculator says 'undefined' in this case and explains the failure mode. If you are in this state, focus on the underlying growth problem before defending the burn number.",
  },
  {
    question: "Does this account for gross margin?",
    answer:
      "No — burn multiple is a top-line metric. Two companies with the same burn multiple can have very different unit economics. Investors always pair burn multiple with gross margin (≥75% for healthy SaaS), CAC payback (≤24 months at scale), magic number (≥1 at growth stage), and net dollar retention (≥110% for best-in-class). Use burn multiple as the headline and the others as the supporting cast.",
  },
];

export default function BurnMultiplePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${PAGE_URL}#tool`,
        name: "Burn Multiple Calculator",
        url: PAGE_URL,
        applicationCategory: "FinanceApplication",
        applicationSubCategory: "SaaS efficiency calculator",
        operatingSystem: "Web",
        description:
          "Free SaaS burn-multiple calculator with David Sacks efficiency bands (exceptional / great / OK / suspect / bad). Inputs: starting ARR, ending ARR, total burn, period length. URL-shareable.",
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
          "Burn multiple = total burn / net new ARR",
          "Sacks band classification",
          "Monthly average burn breakdown",
          "URL-shareable calculations",
          "No signup required",
        ],
      },
      {
        "@type": "HowTo",
        "@id": `${PAGE_URL}#howto`,
        name: "How to calculate burn multiple",
        description:
          "Four-step calculation of SaaS burn multiple with Sacks-band classification.",
        totalTime: "PT1M",
        estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: 0 },
        tool: { "@id": `${PAGE_URL}#tool` },
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Enter starting ARR",
            text: "Enter the company's ARR at the beginning of the measurement period.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Enter ending ARR",
            text: "Enter the ARR at the end of the measurement period. Net new ARR = ending minus starting.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Enter total burn",
            text: "Enter total cash consumed over the period. Quarterly burn for a 3-month period, annual burn for a 12-month period.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Read the multiple and band",
            text: "Burn multiple = total burn / net new ARR. The band (exceptional / great / OK / suspect / bad) reflects the Sacks 2020 efficiency taxonomy.",
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
            name: "Burn Multiple Calculator",
            item: PAGE_URL,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": PAGE_URL,
        url: PAGE_URL,
        name: "Burn Multiple Calculator — SaaS Capital Efficiency, Sacks Bands",
        description:
          "Free SaaS burn-multiple calculator with Sacks band classification and shareable URLs.",
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
      <AgentMirrorLinks path="/tools/burn-multiple-calculator" qaCategory="venture-vocabulary" />

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
          <span className="text-gray-400">Burn Multiple Calculator</span>
        </nav>

        <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-2">
          Free tool
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Burn Multiple Calculator
        </h1>
        <p
          className="text-lg text-gray-300 leading-relaxed mb-10"
          data-speakable
        >
          Total burn divided by net new ARR gives you a single-number readout
          of SaaS capital efficiency. Classified into the David Sacks bands
          investors use during diligence: exceptional, great, OK, suspect,
          bad. URL-shareable so you can drop the link into a board deck or
          investor update without recreating the math.
        </p>

        <Suspense
          fallback={
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 text-gray-400 text-sm">
              Loading calculator…
            </div>
          }
        >
          <BurnMultipleCalculator />
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
              The underlying number that goes into burn multiple — gross vs
              net burn, and why investors care.
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
              Burn multiple tells you efficiency. Runway tells you how long
              before you need to raise.
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
          <p className="text-sm text-gray-400 leading-relaxed">Drop the live burn multiple calculator into a newsletter, blog, or portal. The snippet ships a visible source credit linking back here.</p>
          <EmbedThisCard embedPath="/embed/tools/burn-multiple-calculator" sourcePath="/tools/burn-multiple-calculator" label="Burn Multiple Calculator" height={520} />
        </div>
      </div>
      </div>
    </>
  );
}
