import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";

const SITE = "https://signals.gitdealflow.com";
const PAGE_URL = `${SITE}/tools`;
const OG_IMAGE = `${SITE}/api/og/tools`;

export const metadata: Metadata = {
  title: "Free VC & Founder Tools — Calculators, Checkers, References",
  description:
    "Eight free calculators for founders and investors: SAFE conversion, dilution stack, runway, and the full SaaS efficiency suite (burn multiple, magic number, CAC payback, LTV, quick ratio). URL-shareable results, per-share OG cards, CC BY 4.0, no signup. Machine-readable catalog at /api/v1/tools.json.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Free VC & Founder Tools — VC Deal Flow Signal",
    description:
      "8 calculators: SAFE, dilution, runway, burn multiple, magic number, CAC payback, LTV, quick ratio. URL-shareable.",
    type: "website",
    url: PAGE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Free VC & Founder Tools — 8 calculators from VC Deal Flow Signal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free VC & Founder Tools — VC Deal Flow Signal",
    description:
      "8 free calculators with URL-shareable results and per-share OG cards.",
    images: [OG_IMAGE],
  },
};

interface Tool {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  badge: "live" | "soon";
  category: string;
}

const TOOLS: Tool[] = [
  {
    slug: "safe-calculator",
    name: "SAFE Calculator",
    tagline: "Post-money SAFE conversion math",
    description:
      "Model YC 2018+ post-money SAFE conversion under both the valuation cap and the discount. Compare effective ownership at the next priced round. Share calculations via URL.",
    badge: "live",
    category: "Financing math",
  },
  {
    slug: "runway-calculator",
    name: "Runway Calculator",
    tagline: "Cash, burn, headcount scenarios",
    description:
      "How many months of runway do you have? Cash divided by net burn, with the option to model adding engineers at loaded cost. Fundraise-timing bands built in. URL-shareable.",
    badge: "live",
    category: "Financial planning",
  },
  {
    slug: "burn-multiple-calculator",
    name: "Burn Multiple Calculator",
    tagline: "SaaS capital efficiency",
    description:
      "Total burn divided by net new ARR, classified into the David Sacks bands (exceptional / great / OK / suspect / bad). The single-number readout SaaS investors run during diligence. URL-shareable.",
    badge: "live",
    category: "SaaS metrics",
  },
  {
    slug: "magic-number-calculator",
    name: "Magic Number Calculator",
    tagline: "SaaS sales efficiency",
    description:
      "Annualized net new ARR divided by quarterly S&M spend, classified into the Bessemer / OpenView bands. Tells you whether the GTM motion is paying for itself. Companion to burn multiple.",
    badge: "live",
    category: "SaaS metrics",
  },
  {
    slug: "cac-payback-calculator",
    name: "CAC Payback Calculator",
    tagline: "Customer-acquisition-cost in months",
    description:
      "CAC divided by monthly gross contribution (ARPC × GM%) gives you the per-customer payback in months. Standard bands (<6 exceptional / 6-12 great / 12-18 good / 18-24 OK / >24 bad). Completes the SaaS efficiency triad with burn multiple and magic number.",
    badge: "live",
    category: "SaaS metrics",
  },
  {
    slug: "ltv-calculator",
    name: "LTV Calculator",
    tagline: "Customer lifetime value + LTV:CAC ratio",
    description:
      "(ARPC/12) × gross margin × customer lifetime, with optional CAC input for the LTV:CAC ratio classified into industry-standard bands (>5× exceptional, 3-5× healthy, 2-3× OK, 1-2× suspect, <1× bad). The canonical SaaS unit-economics view.",
    badge: "live",
    category: "SaaS metrics",
  },
  {
    slug: "dilution-stack",
    name: "Dilution Stack",
    tagline: "Multi-SAFE + Series A + option pool",
    description:
      "Model up to 3 stacked post-money SAFEs converting at a priced Series A with an option pool refresh. See the final cap table and founder ownership %, with over-dilution warnings when inputs don't fit. The financing-math companion to the single-SAFE calculator.",
    badge: "live",
    category: "Financing math",
  },
  {
    slug: "quick-ratio-calculator",
    name: "Quick Ratio Calculator",
    tagline: "SaaS growth efficiency",
    description:
      "(New ARR + expansion) divided by (churned + contracted). The Kleiner Perkins / Mamoon Hamid heuristic for SaaS growth efficiency. Captures gross-flow dynamics that NDR compresses away. Completes the five-metric SaaS efficiency suite.",
    badge: "live",
    category: "SaaS metrics",
  },
];

export default function ToolsIndexPage() {
  const liveTools = TOOLS.filter((t) => t.badge === "live");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": PAGE_URL,
        url: PAGE_URL,
        name: "Free VC & Founder Tools",
        description:
          "A growing collection of free calculators and references for founders and investors.",
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE}/#website` },
        hasPart: liveTools.map((t) => ({
          "@type": "SoftwareApplication",
          name: t.name,
          url: `${SITE}/tools/${t.slug}`,
          applicationCategory: "FinanceApplication",
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${PAGE_URL}#list`,
        name: "Free tools",
        numberOfItems: liveTools.length,
        itemListElement: liveTools.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.name,
          url: `${SITE}/tools/${t.slug}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Tools", item: PAGE_URL },
        ],
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
      <AgentMirrorLinks path="/tools" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Tools</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Free tools
        </h1>
        <p
          className="text-lg text-gray-300 leading-relaxed mb-10"
          data-speakable
        >
          A growing collection of calculators and references for founders and
          investors. No signup, no email gate, URL-shareable results, CC BY
          4.0. Each tool is self-contained and runs entirely in your browser.
        </p>

        <ul className="grid gap-4">
          {TOOLS.map((t) => (
            <li key={t.slug}>
              {t.badge === "live" ? (
                <Link
                  href={`/tools/${t.slug}`}
                  className="group block rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-slate-600 transition-all"
                >
                  <ToolCardContent tool={t} />
                </Link>
              ) : (
                <div className="block rounded-2xl border border-slate-800 bg-slate-900/40 p-6 cursor-not-allowed opacity-60">
                  <ToolCardContent tool={t} />
                </div>
              )}
            </li>
          ))}
        </ul>

        <section className="mt-12 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <h2 className="text-gray-100 font-semibold text-lg mb-3">
            More tools coming
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            New tools ship roughly weekly. On the near-term list: an NDR
            calculator, a co-investor graph viewer, and a paste-a-GitHub-repo
            signal scorer. If there's a tool you want and don't see, the
            fastest way to ask is through the Sunday digest.
          </p>
          <Link
            href="/firstlook"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
          >
            Get the Sunday digest
          </Link>
        </section>

        <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            See this week&apos;s breakout startups
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            VC Deal Flow Signal ranks startups by GitHub engineering
            acceleration.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
          >
            Browse Signals
          </Link>
        </div>
      </div>
    </>
  );
}

function ToolCardContent({ tool }: { tool: Tool }) {
  return (
    <>
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-1">
            {tool.category}
          </p>
          <h3 className="text-gray-100 font-semibold text-lg mb-1">
            {tool.name}
          </h3>
          <p className="text-gray-300 text-sm font-medium mb-2">
            {tool.tagline}
          </p>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full shrink-0 ${
            tool.badge === "live"
              ? "bg-sky-950/60 text-sky-300 border border-sky-900/60"
              : "bg-slate-800/60 text-gray-400 border border-slate-700"
          }`}
        >
          {tool.badge === "live" ? "Live" : "Soon"}
        </span>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed">
        {tool.description}
      </p>
    </>
  );
}
