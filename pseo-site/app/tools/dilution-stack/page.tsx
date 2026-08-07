import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DilutionStackCalculator } from "@/components/DilutionStackCalculator";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import EmbedThisCard from "@/components/EmbedThisCard";
import { HreflangLinks } from "@/components/HreflangLinks";

const SITE = "https://signals.gitdealflow.com";
const PAGE_URL = `${SITE}/tools/dilution-stack`;

const PARAM_KEYS = [
  "s1a",
  "s1c",
  "s2a",
  "s2c",
  "s3a",
  "s3c",
  "pre",
  "invest",
  "pool",
] as const;

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
  const ogImage = `${SITE}/api/og/tools/dilution-stack${ogQuery ? `?${ogQuery}` : ""}`;

  return {
    title:
      "Dilution Stack Calculator — Multiple SAFEs + Series A + Option Pool",
    description:
      "Free dilution-stack calculator. Model up to 3 stacked post-money SAFEs converting at Series A, with option pool refresh, and see the final founder ownership. URL-shareable for board decks and term-sheet discussions.",
    alternates: { canonical: "/tools/dilution-stack" },
    openGraph: {
      title: "Dilution Stack Calculator",
      description:
        "Multi-SAFE stacking + Series A + option pool refresh. URL-shareable founder-dilution math.",
      type: "website",
      url: PAGE_URL,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Dilution Stack Calculator — VC Deal Flow Signal",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Dilution Stack Calculator",
      description:
        "Free multi-SAFE + Series A dilution stack with shareable URLs.",
      images: [ogImage],
    },
    keywords: [
      "dilution calculator",
      "dilution stack calculator",
      "multi SAFE stack",
      "founder dilution calculator",
      "Series A dilution",
      "option pool refresh calculator",
      "SAFE stacking math",
      "cap table calculator",
      "post-money SAFE conversion",
    ],
  };
}

const FAQS: { question: string; answer: string }[] = [
  {
    question: "What does the dilution-stack calculator do?",
    answer:
      "It models the cap-table outcome when you raise multiple post-money SAFEs and then a priced Series A with an option pool refresh. Each SAFE converts at its own post-money cap, the Series A investor takes their priced percentage, the option pool is sized to the target post-round, and the residual is your founder ownership at close.",
  },
  {
    question: "Why only 3 SAFEs?",
    answer:
      "Most early-stage companies raise 2-3 SAFEs before a priced round; 3 slots covers the realistic range. If you have more, sum smaller SAFEs that share a cap into a single row (the math is identical), or open the calculator multiple times to compare scenarios. A future v2 may extend to N SAFEs.",
  },
  {
    question: "What assumption is the calculator making about discounts?",
    answer:
      "v1 assumes each SAFE converts at its post-money cap (the cap-binding case). It does not model discount conversion. For cap-vs-discount math on a single SAFE, use the dedicated /tools/safe-calculator — it shows when the cap binds, when the discount binds, and the resulting effective valuation.",
  },
  {
    question: "How is the option pool refresh modelled?",
    answer:
      "v1 sets the option pool as a target percentage of the post-round cap table and dilutes everyone proportionally — founders, SAFE holders, and Series A investors. The YC standard 'option pool comes out of pre-money' is an approximation that requires an iterative SAFE-and-pool waterfall; v1 simplifies for legibility. The difference is meaningful at large pool refreshes (>15%) and should be confirmed with your lawyer.",
  },
  {
    question: "What does 'over-diluted' mean?",
    answer:
      "When SAFE ownership + Series A percentage + option pool sum to more than 100% of the post-round cap table, the founders' residual is negative — mathematically impossible in a real cap table. This usually means the SAFE caps are too low relative to the Series A pre-money, the SAFE amounts are too large for the caps, or the option pool target is too aggressive. The calculator flags this with a red band so you can adjust inputs.",
  },
  {
    question: "Can I share the cap-table scenario?",
    answer:
      "Yes — every SAFE row + the entire Series A is encoded in the URL. The 'Copy share link' button copies the current URL to your clipboard. Send it to your co-founder, board, or lawyer and they open the calculator with the same numbers ready to inspect.",
  },
];

export default function DilutionStackPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${PAGE_URL}#tool`,
        name: "Dilution Stack Calculator",
        url: PAGE_URL,
        applicationCategory: "FinanceApplication",
        applicationSubCategory: "Startup cap-table modeller",
        operatingSystem: "Web",
        description:
          "Free multi-SAFE dilution stack calculator with Series A conversion and option pool refresh. Inputs: up to 3 post-money SAFEs, Series A pre-money + investment + option pool target. URL-shareable.",
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
          "Up to 3 stacked post-money SAFEs",
          "Series A with option pool refresh",
          "Founder ownership band classification",
          "Over-dilution detection",
          "Per-row cap table visualisation",
          "URL-shareable scenarios",
          "No signup required",
        ],
      },
      {
        "@type": "HowTo",
        "@id": `${PAGE_URL}#howto`,
        name: "How to model your dilution stack",
        description:
          "Four-step calculation of founder ownership after multiple SAFEs convert at a Series A with option pool refresh.",
        totalTime: "PT2M",
        estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: 0 },
        tool: { "@id": `${PAGE_URL}#tool` },
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Enter each SAFE",
            text: "For each post-money SAFE you raised, enter the amount and the post-money cap. Each SAFE converts at amount / cap = ownership percentage.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Enter Series A pre-money",
            text: "Enter the pre-money valuation of the priced round. Series A post-money = pre-money + investment.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Enter Series A investment",
            text: "Enter how much the Series A round raises. The investor's percentage = investment / post-money.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Set option pool target",
            text: "Investors typically push for 10-15% post-round option pool. Founders = 100% - SAFE total - Series A - pool.",
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
            name: "Dilution Stack Calculator",
            item: PAGE_URL,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": PAGE_URL,
        url: PAGE_URL,
        name: "Dilution Stack Calculator — Multiple SAFEs + Series A + Option Pool",
        description:
          "Free multi-SAFE dilution-stack calculator with shareable URLs.",
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
      <AgentMirrorLinks path="/tools/dilution-stack" qaCategory="venture-vocabulary" />

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
          <span className="text-gray-400">Dilution Stack</span>
        </nav>

        <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-2">
          Free tool
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Dilution Stack Calculator
        </h1>
        <p
          className="text-lg text-gray-300 leading-relaxed mb-10"
          data-speakable
        >
          Model up to 3 stacked post-money SAFEs converting at a priced Series
          A, with an option pool refresh, and see your final founder
          ownership at close. Each SAFE row + the entire Series A encodes
          into the URL — share the exact scenario with your co-founder, board,
          or lawyer without retyping a number.
        </p>

        <Suspense
          fallback={
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 text-gray-400 text-sm">
              Loading calculator…
            </div>
          }
        >
          <DilutionStackCalculator />
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
            href="/tools/safe-calculator"
            className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 transition-all"
          >
            <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-1">
              Single-SAFE math
            </p>
            <h3 className="text-gray-100 font-medium text-base group-hover:text-sky-300 transition-colors mb-1">
              SAFE Calculator &rarr;
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Cap vs discount conversion for one SAFE. Pair with this stack
              calculator when you need to know which mode binds.
            </p>
          </Link>
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
              The canonical definition with cross-references to the rest of
              the venture vocabulary.
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
          <p className="text-sm text-gray-400 leading-relaxed">Drop the live dilution stack calculator into a newsletter, blog, or portal. The snippet ships a visible source credit linking back here.</p>
          <EmbedThisCard embedPath="/embed/tools/dilution-stack" sourcePath="/tools/dilution-stack" label="Dilution Stack Calculator" height={560} />
        </div>
      </div>
      </div>
    </>
  );
}
