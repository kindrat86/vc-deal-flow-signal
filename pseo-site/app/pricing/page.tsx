import type { Metadata } from "next";
import Link from "next/link";
import { getDataLastModified } from "@/lib/data";
import { FRESH_YEAR } from "@/lib/freshness-year";
import PSEOFooterNav from "@/components/PSEOFooterNav";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { withEditorialOverride } from "@/lib/metadata";
import { PRE_ROUND_PATH } from "@/lib/pre-round";

// 2026-10 pricing simplification (draft branch feat/pricing-4-steps).
// Four steps instead of eleven: Free digest -> EUR 49 Pre-Round Report ->
// EUR 49/mo Dashboard -> EUR 197/mo Insider Circle. Every price and link on
// this page already exists in Stripe (stripe/payment-links.md, verified
// 2026-07-13; Pre-Round link created 2026-10-24). No promo code and no
// capacity counters: neither could be verified from data on the box.
// Lower-priority products (Tweet Teardown, First Look, Book, Agent Credits,
// Sector Sweep, fund tiers) keep their own pages and are linked at the end.

export const metadata: Metadata = withEditorialOverride({
  title: {
    absolute:
      "GitDealFlow Pricing: Free Weekly Digest, EUR 49 Dashboard, EUR 197 Insider",
  },
  description:
    "Four steps. Five startups free every Sunday, the 25-name Pre-Round Report for EUR 49, the full ranked field weekly on the EUR 49/mo Dashboard, or Insider Circle with API and webhooks. 30-day Signal-or-It's-Free guarantee on every paid step.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    url: "https://signals.gitdealflow.com/pricing",
    title: "Pricing: start free, pay only when five names are not enough",
    description:
      "Free weekly digest, EUR 49 Pre-Round Report, EUR 49/mo Dashboard, EUR 197/mo Insider Circle. 30-day Signal-or-It's-Free guarantee.",
    type: "website",
  },
});

const STRIPE_DASHBOARD = "https://buy.stripe.com/4gMbJ07kTaJy7kqg6s0x20b";
const STRIPE_DASHBOARD_ANNUAL = "https://buy.stripe.com/aFa5kC34DeZOawC6vS0x20c";
const STRIPE_INSIDER = "https://buy.stripe.com/bJeaEWfRpcRG6gm2fC0x20d";
const STRIPE_INSIDER_ANNUAL = "https://buy.stripe.com/cNieVc34DbNCcEK2fC0x20e";
const SIGNUP_URL = "https://gitdealflow.com/#signup";

interface Step {
  slug: string;
  rung: string;
  name: string;
  price: number;
  priceLabel: string;
  cadence: string;
  oneLine: string;
  forWho: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  highlight: boolean;
}

const steps: Step[] = [
  {
    slug: "signal-digest",
    rung: "Step 1 · Free",
    name: "Signal Digest",
    price: 0,
    priceLabel: "Free",
    cadence: "every Sunday",
    oneLine:
      "Five startups with the strongest engineering acceleration, in your inbox every Sunday, each with a plain-English reason.",
    forWho: "Start here if you want to see the signal before you pay for anything.",
    bullets: [
      "Five ranked startups per issue, with signal type and sector",
      "Direct GitHub link for each name",
      "Free MCP server for Claude, Cursor and Windsurf, never gated",
      "Unsubscribe in one click",
    ],
    ctaLabel: "Get the 5 names free",
    ctaHref: SIGNUP_URL,
    highlight: false,
  },
  {
    slug: "pre-round-report",
    rung: "Step 2 · One payment",
    name: "Pre-Round Report",
    price: 49,
    priceLabel: "€49",
    cadence: "one-time",
    oneLine:
      "The 25 startups with the strongest pre-round engineering pattern this month, with the evidence behind each name. PDF + CSV within 48 hours.",
    forWho: "Buy this when five names are not enough but a subscription is more than you need today.",
    bullets: [
      "25 ranked startups, all sectors or the one of 15 you pick at checkout",
      "Signal type, 14-day velocity change, contributor growth and last public round per name",
      "GitHub, website and public founder links for a first-touch email the same day",
      "€49 credited in full toward Dashboard if you upgrade within 14 days",
    ],
    ctaLabel: "Get the Report, €49",
    ctaHref: PRE_ROUND_PATH,
    highlight: false,
  },
  {
    slug: "dashboard",
    rung: "Step 3 · Core plan",
    name: "Dashboard",
    price: 49,
    priceLabel: "€49",
    cadence: "/mo",
    oneLine:
      "The full ranked field across 15 sectors, refreshed every week, with filters, history and watchlists.",
    forWho: "Pick this if you source every week and want the whole field, not a monthly snapshot.",
    bullets: [
      "Full ranked field across 15 sectors (350+ startup orgs tracked), refreshed weekly",
      "All five signal types per startup, including deceleration",
      "Sector filters with five-quarter history, watchlists and saved filters",
      "Free Chrome extensions: Crunchbase and Wellfound badge, GitHub hover lookup",
      "€490/yr option, two months free",
    ],
    ctaLabel: "Start Dashboard, €49/mo",
    ctaHref: STRIPE_DASHBOARD,
    highlight: true,
  },
  {
    slug: "insider-circle",
    rung: "Step 4 · Deeper",
    name: "Insider Circle",
    price: 197,
    priceLabel: "€197",
    cadence: "/mo",
    oneLine:
      "Everything in Dashboard plus API access, webhooks, custom watchlists and a direct line to the founder.",
    forWho: "Pick this if the signal feeds a pipeline, a CRM or a syndicate, not just your own weekly read.",
    bullets: [
      "Everything in Dashboard",
      "JSON API and bulk CSV pulls",
      "Webhook delivery on threshold triggers, into Slack, Discord or your own tools",
      "Custom watchlists built around your thesis",
      "Private Insider group with briefings and a direct line for diligence questions",
      "€1,970/yr option, two months free",
    ],
    ctaLabel: "Join Insider Circle, €197/mo",
    ctaHref: STRIPE_INSIDER,
    highlight: false,
  },
];

const stack: { item: string; note: string }[] = [
  { item: "The full ranked field, every week", note: "4 to 5 weekly reads a month instead of one monthly list of 25" },
  { item: "All five signal types, including deceleration", note: "so you also see who is slowing down" },
  { item: "Five-quarter sector history", note: "check whether a spike is new or normal for that team" },
  { item: "Watchlists and saved filters", note: "follow the names you already care about" },
  { item: "Bonus: Chrome extensions", note: "signal badge inside Crunchbase, Wellfound and GitHub" },
  { item: "Bonus: free MCP server", note: "ask Claude or Cursor about any tracked startup" },
  { item: "Bonus: your €49 Report credited", note: "first month at no extra cost if you bought the Report in the last 14 days" },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "How much does GitDealFlow cost?",
    a: "Four steps. The Signal Digest is free, five startups every Sunday. The Pre-Round Report is €49 one-time for 25 ranked startups with evidence, PDF + CSV within 48 hours. The Dashboard is €49 per month (or €490 per year) for the full ranked field across 15 sectors, refreshed weekly. Insider Circle is €197 per month (or €1,970 per year) and adds API, webhooks and custom watchlists. Founding members who joined before 2026-06-30 keep €9.97 and €97 for life.",
  },
  {
    q: "Should I buy the Report or the Dashboard?",
    a: "The Report is one snapshot of 25 names this month. The Dashboard is the full field every week for the same €49 per month. If you buy the Report and decide within 14 days that you want it weekly, the €49 is credited in full toward your first Dashboard month.",
  },
  {
    q: "What does the guarantee cover?",
    a: "Every paid step ships with the 30-day Signal-or-It's-Free guarantee. If the signal does not surface a startup you find genuinely interesting, one you would have wanted to know about earlier, reply REFUND within 30 days and you get the full payment back.",
  },
  {
    q: "Is this a prediction that a company will raise?",
    a: "No. These are engineering signals from public GitHub data. In a documented panel of 219 startup-period observations across 55 startups, the signal appeared 21 to 47 days before the public fundraise announcement. It is evidence to investigate, not proof of a future round. The prediction ledger publishes the misses too.",
  },
  {
    q: "I run a fund. Is there a fund plan?",
    a: "Fund workflows (white-labeled API, portfolio reviews, a custom sector sweep) are scoped by application. Send the short form at /apply and you get a reply within 48 hours.",
  },
  {
    q: "Can I cancel?",
    a: "Yes. Monthly plans cancel any time from the Stripe receipt or by emailing signals@gitdealflow.com. Annual plans can be switched from monthly; the unused part of the current month is credited.",
  },
];

function tierToOffer(step: Step) {
  const offer: Record<string, unknown> = {
    "@type": "Offer",
    name: step.name,
    description: step.oneLine,
    price: step.price,
    priceCurrency: "EUR",
    url: `https://signals.gitdealflow.com/pricing#${step.slug}`,
    availability: "https://schema.org/InStock",
    category: step.cadence === "/mo" ? "subscription" : "one-time",
    seller: { "@id": "https://gitdealflow.com/#organization" },
    priceValidUntil: `${FRESH_YEAR + 1}-12-31`,
  };
  if (step.cadence === "/mo") {
    offer.priceSpecification = {
      "@type": "UnitPriceSpecification",
      price: step.price,
      priceCurrency: "EUR",
      billingDuration: "P1M",
      unitCode: "MON",
    };
  }
  return offer;
}

export default function PricingPage() {
  const asOf = getDataLastModified().toISOString().slice(0, 10);
  const tiers = steps;
  const paidTiers = tiers.filter((s) => s.price > 0);
  const offers = paidTiers.map(tierToOffer);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/pricing#webpage",
        url: "https://signals.gitdealflow.com/pricing",
        name: "GitDealFlow, Pricing",
        description:
          "Four-step pricing: free weekly Signal Digest, €49 Pre-Round Report, €49/mo Dashboard, €197/mo Insider Circle.",
        inLanguage: "en-US",
        isAccessibleForFree: true,
        isPartOf: { "@id": "https://signals.gitdealflow.com/#website" },
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://signals.gitdealflow.com/#softwareapplication",
        name: "VC Deal Flow Signal",
        alternateName: "GitDealFlow",
        image: "https://signals.gitdealflow.com/opengraph-image",
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Investment Research",
        operatingSystem: "Web, MCP-compatible AI clients (Claude, Cursor, Windsurf)",
        url: "https://signals.gitdealflow.com",
        provider: { "@id": "https://gitdealflow.com/#organization" },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "EUR",
          lowPrice: Math.min(...paidTiers.map((s) => s.price)),
          highPrice: Math.max(...paidTiers.map((s) => s.price)),
          offerCount: paidTiers.length,
          offers,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Pricing", item: "https://signals.gitdealflow.com/pricing" },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/pricing"
        languages={getHreflangLanguages("/pricing")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Pricing</span>
        </nav>

        {/* Hook */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Reach technical founders before the round is public
        </h1>
        <p className="text-gray-300 text-base leading-relaxed mb-3 max-w-3xl">
          Four steps. Start with five free names a week. Pay only when five is
          not enough. Every paid step carries the same 30-day
          Signal-or-It&rsquo;s-Free guarantee.
        </p>
        <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-3xl">
          In a documented panel of 219 startup-period observations across 55
          startups, the GitHub signal appeared 21 to 47 days before the public
          fundraise announcement. It is evidence to investigate, not proof of a
          future round.{" "}
          <Link href="/methodology" className="text-sky-400 hover:text-sky-300 underline">
            Read the methodology
          </Link>
          .
        </p>

        {/* Value ladder */}
        <section aria-label="Pricing steps" className="mb-14 grid gap-5 sm:grid-cols-2 text-left">
          {steps.map((s) => (
            <div
              key={s.slug}
              id={s.slug}
              className={`flex flex-col rounded-xl border p-5 ${
                s.highlight
                  ? "border-sky-500/70 bg-sky-950/30"
                  : "border-slate-800 bg-slate-900/40"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                {s.rung}
                {s.highlight ? <span className="ml-2 text-sky-300">· recommended</span> : null}
              </p>
              <h2 className="text-lg font-semibold text-gray-100 mb-1">{s.name}</h2>
              <p className="mb-3">
                <span className="text-3xl font-bold text-gray-100">{s.priceLabel}</span>
                <span className="text-gray-400 text-sm ml-1">{s.cadence}</span>
              </p>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">{s.oneLine}</p>
              <ul className="space-y-1.5 text-gray-400 text-sm mb-4 flex-1">
                {s.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span aria-hidden="true" className="text-emerald-400">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-500 text-xs mb-4">{s.forWho}</p>
              <a
                href={s.ctaHref}
                className={`inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  s.highlight
                    ? "bg-sky-500 hover:bg-sky-400 text-slate-950"
                    : "border border-slate-600 hover:border-slate-400 text-gray-100"
                }`}
              >
                {s.ctaLabel} →
              </a>
            </div>
          ))}
        </section>

        {/* Offer stack for the core plan */}
        <section className="mb-14 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 text-left">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
            What €49 a month gets you
          </p>
          <h2 className="text-2xl font-bold text-gray-100 mb-4">
            The Dashboard, item by item
          </h2>
          <table className="w-full text-sm border-collapse mb-5 text-left">
            <tbody>
              {stack.map((r) => (
                <tr key={r.item} className="border-b border-slate-800 last:border-0">
                  <td className="py-2.5 pr-4 text-gray-100 font-medium align-top">{r.item}</td>
                  <td className="py-2.5 text-gray-400 align-top">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-gray-300 text-sm leading-relaxed mb-2">
            The anchor: the Pre-Round Report is €49 for one monthly list of 25
            names. The Dashboard is the same €49 for the whole ranked field,
            every week. Insider Circle at €197 is there for teams that need the
            API and webhooks.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            Prefer to pay yearly?{" "}
            <a href={STRIPE_DASHBOARD_ANNUAL} className="text-sky-400 hover:text-sky-300 underline">
              Dashboard €490/yr
            </a>{" "}
            or{" "}
            <a href={STRIPE_INSIDER_ANNUAL} className="text-sky-400 hover:text-sky-300 underline">
              Insider €1,970/yr
            </a>
            , two months free in both cases.
          </p>
          <a
            href={STRIPE_DASHBOARD}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-sm font-semibold transition-colors"
          >
            Start Dashboard, €49/mo →
          </a>
        </section>

        {/* Guarantee */}
        <section id="guarantee" className="mb-14 rounded-lg border border-emerald-800 bg-emerald-950/20 p-6">
          <h2 className="text-xl font-semibold text-emerald-300 mb-3">
            Signal or It&rsquo;s Free, 30-day guarantee
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            Every paid step (Pre-Round Report, Dashboard and Insider Circle)
            ships with the same guarantee. If, in your first 30 days, the signal
            does not surface a startup you find genuinely interesting, defined as
            one you would have wanted to know about earlier, reply to any email
            with the word{" "}
            <code className="text-emerald-300 bg-emerald-900/40 px-1.5 py-0.5 rounded text-xs">
              REFUND
            </code>{" "}
            and the full payment comes back.
          </p>
          <p className="text-gray-400 text-xs">
            The prediction ledger publishes the misses as well as the hits, so
            you can judge the signal before you pay.{" "}
            <Link href="/predicted" className="text-sky-400 hover:text-sky-300 underline">
              See the public ledger
            </Link>
            .
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-100 mb-5">
            Questions before you buy
          </h2>
          <div className="divide-y divide-slate-800 rounded-lg border border-slate-800 bg-slate-900/40">
            {faqs.map((f, i) => (
              <details key={i} className="group px-5 py-4">
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                  <h3 className="text-base font-semibold text-gray-100 group-hover:text-sky-400 transition-colors">
                    {f.q}
                  </h3>
                  <span aria-hidden="true" className="shrink-0 text-gray-400 text-2xl leading-none">+</span>
                </summary>
                <p className="text-gray-400 text-sm leading-relaxed mt-3 pr-8">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Everything else, off the ladder */}
        <section className="mb-10 text-sm text-gray-400">
          <h2 className="text-base font-semibold text-gray-200 mb-2">Also available</h2>
          <ul className="space-y-1">
            <li>
              Running a fund or syndicate?{" "}
              <Link href="/apply" className="text-sky-400 hover:text-sky-300 underline">Apply for a fund workflow</Link>
              , reply within 48 hours.
            </li>
            <li>
              Building an AI agent?{" "}
              <Link href="/agents/credits" className="text-sky-400 hover:text-sky-300 underline">100 deep-signal calls for €19</Link>
              , misses are free.
            </li>
            <li>
              Want the method first?{" "}
              <Link href="/book" className="text-sky-400 hover:text-sky-300 underline">The 7 GitHub Signals book</Link>
              , free PDF.
            </li>
          </ul>
        </section>

        <p className="text-xs text-gray-400 mt-8 mb-4">
          Pricing last verified {asOf}. Founding members who joined before
          2026-06-30 keep their rates for life.
        </p>

        <PSEOFooterNav />
        <DataNerdSignoff variant="default" className="mt-12" />
      </div>
    </>
  );
}
