import type { Metadata } from "next";
import Link from "next/link";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title: "Pricing — VC Deal Flow Signal",
  description:
    "Free MCP server with 5 read-only tools (forever free). Pay-as-you-go agents from €0.10 per call. Insider Circle monthly subscription €29 — unlimited agent calls, full dashboard, Scout Game predictions.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing — VC Deal Flow Signal",
    description:
      "Free → Pay-as-you-go → Insider Circle. The 5 free MCP tools never get gated.",
    url: `${SITE}/pricing`,
  },
};

const FREE_INCLUDES = [
  "5 MCP tools (read-only) — forever free",
  "Public REST/JSON/CSV endpoints",
  "Weekly Signal Report email",
  "Public Scout Receipts at /receipts",
  "Embeddable SVG badges",
  "ChatGPT plugin manifest, A2A, NLWeb",
];

const PAYG_INCLUDES = [
  "Everything in Free, forever",
  "Paid agent tools (research_company, compose_thesis, deep_dive_scan)",
  "Per-call pricing — €0.10 / call",
  "€19 minimum top-up (≈ 190 calls)",
  "No subscription, no commitment",
  "Balance never expires",
];

const INSIDER_INCLUDES = [
  "Everything in Free + PAYG",
  "Unlimited agent tool calls (fair use, 1k/day)",
  "Full universe filter — sector, stage, geography",
  "10 Scout Game predictions / month",
  "Watchlist alerts (email + Telegram)",
  "Founder contact data on Insider rows",
  "Cancel anytime — no annual lock-in",
];

const FAQ = [
  {
    q: "Will the 5 free MCP tools ever become paid?",
    a: "No. The free tools (list_signals, get_startup, top_breakouts, sector reads) stay free forever. Paid tiers unlock additional agent tools, never gate the existing five.",
  },
  {
    q: "Do I need to reinstall the MCP server to upgrade?",
    a: "No. Same npm package, same install command. Add GITDEALFLOW_API_KEY to your MCP config and the paid tools become available — free tools keep working with or without a key.",
  },
  {
    q: "What happens when my PAYG balance runs out?",
    a: "Free tools keep working. Paid tools return an inline message asking you to top up at /dashboard/billing. No surprise charges, no auto-debit unless you opt in.",
  },
  {
    q: "Why is monthly cheaper than PAYG at scale?",
    a: "PAYG is built for low-volume try-it traffic. If you make more than ~290 paid calls/month, Insider Circle is cheaper — and you also get the dashboard, alerts, and Scout predictions on top.",
  },
  {
    q: "Is there a refund or risk reversal?",
    a: "Insider Circle is monthly with no annual commitment — cancel any time and you keep access through the end of the billing period. PAYG balances are non-refundable but never expire.",
  },
  {
    q: "How do I cancel?",
    a: "Click 'Manage subscription' in the dashboard — opens Stripe billing portal. One click. No call, no email, no friction.",
  },
];

export default function PricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/pricing#webpage`,
        url: `${SITE}/pricing`,
        name: "Pricing — VC Deal Flow Signal",
        description:
          "Three-tier pricing: free MCP server, pay-as-you-go agent calls, Insider Circle monthly subscription.",
        inLanguage: "en-US",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".speakable", "h1", "[data-pricing-summary]"],
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE },
            { "@type": "ListItem", position: 2, name: "Pricing", item: `${SITE}/pricing` },
          ],
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "VC Deal Flow Signal",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, MCP (stdio + Streamable HTTP)",
        url: SITE,
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "EUR",
          lowPrice: "0",
          highPrice: "29",
          offerCount: 3,
          offers: [
            {
              "@type": "Offer",
              name: "Free",
              price: "0",
              priceCurrency: "EUR",
              category: "Free",
              url: `${SITE}/pricing#free`,
              availability: "https://schema.org/InStock",
            },
            {
              "@type": "Offer",
              name: "Pay as you go",
              price: "0.10",
              priceCurrency: "EUR",
              category: "PayPerCall",
              url: `${SITE}/pricing#payg`,
              availability: "https://schema.org/InStock",
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: "0.10",
                priceCurrency: "EUR",
                unitCode: "C62",
                unitText: "agent call",
              },
            },
            {
              "@type": "Offer",
              name: "Insider Circle",
              price: "29",
              priceCurrency: "EUR",
              category: "Subscription",
              url: `${SITE}/pricing#insider`,
              availability: "https://schema.org/InStock",
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: "29",
                priceCurrency: "EUR",
                referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
                billingDuration: "P1M",
              },
            },
          ],
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hook */}
      <header className="text-center mb-12 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 speakable">
          Start free. Scale by call. Commit when it pays for itself.
        </h1>
        <p
          className="text-gray-400 text-lg leading-relaxed"
          data-pricing-summary
        >
          The 5 MCP tools that built our distribution are free forever. Pay only
          for the agent tools that do real work — by the call, or unlimited
          monthly when the math flips.
        </p>
      </header>

      {/* Tier grid — Goldilocks: Free (anchor) | PAYG (decoy) | Insider (hero) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16 items-stretch">
        {/* FREE — anchor */}
        <article
          id="free"
          className="rounded-2xl border border-slate-700 bg-slate-900 p-6 flex flex-col"
        >
          <div className="mb-6">
            <h2 className="text-gray-200 text-lg font-semibold mb-1">Free</h2>
            <p className="text-gray-500 text-sm">
              For solo investors, side-project devs, AI agents.
            </p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-100">€0</span>
            <span className="text-gray-500 ml-2">forever</span>
          </div>
          <ul className="space-y-2 mb-6 flex-1">
            {FREE_INCLUDES.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/agents"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-slate-600 hover:border-slate-500 text-gray-200 hover:text-white text-sm font-medium transition-colors"
          >
            Install free MCP →
          </Link>
        </article>

        {/* PAYG — decoy (deliberately middle, calls scale fast) */}
        <article
          id="payg"
          className="rounded-2xl border border-slate-700 bg-slate-900 p-6 flex flex-col"
        >
          <div className="mb-6">
            <h2 className="text-gray-200 text-lg font-semibold mb-1">
              Pay as you go
            </h2>
            <p className="text-gray-500 text-sm">
              Try paid agents without committing.
            </p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-100">€0.10</span>
            <span className="text-gray-500 ml-2">/ agent call</span>
            <p className="text-gray-600 text-xs mt-1">€19 minimum top-up</p>
          </div>
          <ul className="space-y-2 mb-6 flex-1">
            {PAYG_INCLUDES.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/api/billing/checkout?plan=payg-19"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-slate-600 hover:border-slate-500 text-gray-200 hover:text-white text-sm font-medium transition-colors"
          >
            Get an API key
          </Link>
        </article>

        {/* INSIDER — hero (highlighted, scaled, badge) */}
        <article
          id="insider"
          className="relative rounded-2xl border-2 border-sky-500 bg-slate-900 p-6 flex flex-col lg:scale-[1.03] shadow-[0_0_40px_-15px_rgba(14,165,233,0.5)]"
        >
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center px-3 py-1 rounded-full bg-sky-500 text-white text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
            Most popular
          </span>
          <div className="mb-6">
            <h2 className="text-gray-100 text-lg font-semibold mb-1">
              Insider Circle
            </h2>
            <p className="text-gray-400 text-sm">
              For active deal-flow investors and dev-investor ops.
            </p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-100">€29</span>
            <span className="text-gray-400 ml-2">/ month</span>
            <p className="text-emerald-400 text-xs mt-1 font-medium">
              Beats PAYG after ~290 calls/month
            </p>
          </div>
          <ul className="space-y-2 mb-6 flex-1">
            {INSIDER_INCLUDES.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-200">
                <span className="text-sky-400 mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/api/billing/checkout?plan=insider"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold transition-colors"
          >
            Start Insider Circle →
          </Link>
          <p className="text-gray-500 text-xs mt-3 text-center">
            Cancel any time. No annual commitment.
          </p>
        </article>
      </section>

      {/* Decision math — Brunson "stack slide" reframed as a value calc */}
      <section className="rounded-xl border border-slate-700 bg-slate-950 p-6 mb-16">
        <h2 className="text-gray-200 text-sm font-semibold uppercase tracking-wider mb-4">
          Quick math — when does monthly win?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500 mb-1">100 paid calls / month</p>
            <p className="text-gray-200">
              PAYG <span className="text-emerald-400">€10</span> ✓
            </p>
            <p className="text-gray-500 text-xs mt-1">PAYG wins</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">300 paid calls / month</p>
            <p className="text-gray-200">
              PAYG €30 vs Monthly{" "}
              <span className="text-sky-400">€29</span> ✓
            </p>
            <p className="text-gray-500 text-xs mt-1">tipping point</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">1,000 paid calls / month</p>
            <p className="text-gray-200">
              PAYG €100 vs Monthly{" "}
              <span className="text-sky-400">€29</span> ✓
            </p>
            <p className="text-gray-500 text-xs mt-1">save €71 + dashboard</p>
          </div>
        </div>
      </section>

      {/* Risk reversal */}
      <section className="rounded-xl border border-emerald-700/40 bg-emerald-950/20 p-6 mb-16">
        <h2 className="text-emerald-300 font-semibold mb-2">
          Three things that won't happen
        </h2>
        <ul className="space-y-1.5 text-sm text-gray-300">
          <li>
            <span className="text-emerald-400 mr-2">✓</span>
            We won't gate the 5 free MCP tools. Ever.
          </li>
          <li>
            <span className="text-emerald-400 mr-2">✓</span>
            We won't auto-charge your card without a fresh top-up click.
          </li>
          <li>
            <span className="text-emerald-400 mr-2">✓</span>
            We won't trap you — Insider cancels in one click via Stripe portal.
          </li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-gray-100 text-2xl font-semibold mb-6">
          Pricing FAQ
        </h2>
        <div className="space-y-4">
          {FAQ.map(({ q, a }) => (
            <details
              key={q}
              className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-4 group"
            >
              <summary className="cursor-pointer text-gray-200 font-medium list-none flex items-start justify-between gap-4">
                <span>{q}</span>
                <span className="text-gray-500 group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="text-gray-400 text-sm mt-3 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Closing CTA — Brunson "summary close" */}
      <section className="text-center rounded-xl border border-slate-700 bg-slate-900 p-8">
        <h2 className="text-gray-100 text-xl font-semibold mb-2">
          Still deciding? Start free.
        </h2>
        <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
          The free MCP tools are the same ones that surfaced 91 venture-backed
          startups before they raised. Install in 30 seconds. Upgrade when the
          math flips.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/agents"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-600 hover:border-slate-500 text-gray-200 hover:text-white text-sm font-medium transition-colors"
          >
            Browse free MCP tools
          </Link>
          <Link
            href="/api/billing/checkout?plan=insider"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold transition-colors"
          >
            Start Insider Circle →
          </Link>
        </div>
      </section>
    </main>
  );
}
