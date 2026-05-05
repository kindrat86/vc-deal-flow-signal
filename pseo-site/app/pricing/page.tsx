import type { Metadata } from "next";
import Link from "next/link";
import { AgentSummary } from "@/components/AgentSummary";
import { getDataLastModified } from "@/lib/data";
import PSEOFooterNav from "@/components/PSEOFooterNav";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import SharpScarcityBadge from "@/components/SharpScarcityBadge";

export const metadata: Metadata = {
  title: "Pricing — Free, €7 First Look, €9.97 Dashboard, €97 Insider, €497 Sharp, €1,997 Sweep",
  description:
    "VC Deal Flow Signal pricing — six tiers from a free weekly digest to a €4,970/yr Sharp Tier and €1,997 custom Sector Sweep. Founding-member rates on Dashboard (€9.97/mo) and Insider Circle (€97/mo). 30-day Signal-or-It's-Free guarantee.",
  alternates: {
    canonical: "/pricing",
  },
};

const STRIPE_DASHBOARD = "https://buy.stripe.com/28E7sK48H04U8ou07u0x200";
const STRIPE_INSIDER = "https://buy.stripe.com/4gM00ifRpcRG2069I40x202";
const STRIPE_SWEEP = "https://buy.stripe.com/bJe14m34DbNC6gm1by0x204";
const SIGNUP_URL = "https://gitdealflow.com/#signup";
// Sharp Tier — application-gated, capped at 8 funds in 2026. The mailto includes a structured intake template so the reply is immediate-prioritised.
// Russell audit 2026-05-05 PM: replaced mailto: with a proper application
// page (/apply). Mailto leaked the funnel to the user's email client and
// dropped 60%+ of intents. /apply is a real form posting to
// /api/sharp-application with the same field shape.
const SHARP_APPLY_URL = "/apply";

interface Tier {
  slug: string;
  name: string;
  priceLabel: string;
  priceCadence: string;
  rrpLabel: string | null;
  oneLine: string;
  forWho: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  highlight: boolean;
}

const tiers: Tier[] = [
  {
    slug: "signal-digest",
    name: "Signal Digest",
    priceLabel: "Free",
    priceCadence: "forever",
    rrpLabel: null,
    oneLine:
      "Five breakout startups in your inbox every Monday — the same data the paid tiers see, narrowed to the top five.",
    forWho:
      "Angel investors and developers who want one shortlist a week without paying.",
    bullets: [
      "Weekly email — five startups ranked by engineering acceleration",
      "Signal type per startup (hiring burst, infra buildout, shipping sprint)",
      "Direct GitHub link + sector tag",
      "No tracker pixels beyond basic open rate",
      "Free MCP server for Claude / Cursor / Windsurf — five tools, never gated",
    ],
    ctaLabel: "Get the Free Digest",
    ctaHref: SIGNUP_URL,
    highlight: false,
  },
  {
    slug: "first-look-pass",
    name: "First Look Pass",
    priceLabel: "€7",
    priceCadence: "one-time",
    rrpLabel: "€19 after launch",
    oneLine:
      "Pay €7 once and get a Sector Deep Dive on the sector you pick — full GitHub momentum table, 14-day acceleration deltas, and the top three names not yet on Crunchbase.",
    forWho:
      "Investors who want to test the data on one specific sector before committing to a subscription.",
    bullets: [
      "Full GitHub momentum table for one sector of your choice",
      "14-day commit velocity deltas with two-period confirmation",
      "Top three breakout names not yet on Crunchbase",
      "Contributor map and founding-team signals",
      "Delivered to your inbox within 24 hours",
      "€7 credited toward Dashboard if you upgrade within 14 days",
    ],
    ctaLabel: "Get the Pass — €7",
    ctaHref: "/firstlook",
    highlight: false,
  },
  {
    slug: "dashboard-beta",
    name: "Dashboard Beta",
    priceLabel: "€9.97",
    priceCadence: "/mo",
    rrpLabel: "Going to €49/mo permanently",
    oneLine:
      "109 startups ranked across 19 sectors, refreshed weekly, with sector filters and historical period comparisons.",
    forWho:
      "Active investors and small funds who want to see the full ranking, not just the top five.",
    bullets: [
      "109 ranked startups across 19 sectors, refreshed weekly",
      "Sector filters with five-quarter historical comparison",
      "All four signal types per startup (hiring burst, shipping sprint, infrastructure buildout, platform migration)",
      "Watchlists and saved filters",
      "Free Chrome extensions — Crunchbase + Wellfound badge and GitHub-native hover lookup",
      "30-day Signal-or-It's-Free guarantee",
    ],
    ctaLabel: "Lock In Founding Price",
    ctaHref: STRIPE_DASHBOARD,
    highlight: true,
  },
  {
    slug: "insider-circle",
    name: "Insider Circle",
    priceLabel: "€97",
    priceCadence: "/mo",
    rrpLabel: "Going to €197/mo permanently",
    oneLine:
      "Private Telegram group, live briefings, custom watchlists, JSON API, and bulk CSV pulls — every part of the signal that doesn't fit a public dashboard.",
    forWho:
      "Active investors syndicating six or more deals per year, plus small funds running structured deal-flow pipelines.",
    bullets: [
      "Everything in Dashboard Beta",
      "Private Insider Circle Telegram group with live briefings",
      "Custom watchlists co-built around your investment thesis",
      "Insider API access — JSON endpoints + bulk CSV pulls (€1,200/yr value)",
      "Webhook delivery on threshold triggers (route into Slack / Discord / internal tooling)",
      "Direct line to the founder for diligence questions",
      "30-day Signal-or-It's-Free guarantee",
    ],
    ctaLabel: "Join the Insider Circle",
    ctaHref: STRIPE_INSIDER,
    highlight: false,
  },
  {
    slug: "sharp-tier",
    name: "Sharp Tier",
    priceLabel: "€497",
    priceCadence: "/mo",
    rrpLabel: "€4,970/yr saves two months · application required · 8-fund cap 2026",
    oneLine:
      "Everything in Insider Circle plus the parts of the work that don't scale — quarterly portfolio review call, custom thesis-aligned watchlist co-built with you, white-labeled API endpoint at /api/v1/sharp/<your-fund>, and direct access to the methodology source code.",
    forWho:
      "Active VC funds and syndicates deploying €5M+/yr who want a tooling partner, not just a data subscription.",
    bullets: [
      "Everything in Insider Circle",
      "Quarterly 60-minute portfolio review call — map existing holdings against the live signal",
      "Custom thesis-aligned watchlist (co-built with you)",
      "White-labeled API endpoint and data feed at /api/v1/sharp/<your-fund>",
      "Same-day signal questions answered (no SLA, but typically <4h)",
      "Data-room exports formatted for LP updates",
      "All future paid MCP tools included, no per-tool upcharge",
      "Direct access to the methodology source code (private repo invite)",
      "Capped at 8 funds in 2026 — applications reviewed within 48h",
    ],
    ctaLabel: "Apply for Sharp Tier",
    ctaHref: SHARP_APPLY_URL,
    highlight: false,
  },
  {
    slug: "sector-sweep",
    name: "Custom Sector Sweep",
    priceLabel: "€1,997",
    priceCadence: "one-time",
    rrpLabel: "€13,000+ in itemized value · 8 seats per quarter",
    oneLine:
      "A custom written report on one sector you pick — engineering momentum across every venture-backed startup in that sector, ranked, with diligence prompts and the top three early-stage targets.",
    forWho:
      "Funds investing seven-figure cheques into a defined sector who want a one-off, deeper-than-Dashboard analysis without a yearly contract.",
    bullets: [
      "40-page custom Sector Sweep PDF — every venture-backed startup in your sector ranked over the last four quarters (analyst-report equivalent: €4,500)",
      "Raw CSV — every org × every metric, license-friendly to drop into your CRM (data-license equivalent: €1,200)",
      "Written walkthrough — 60 minutes of reading, methodology + top-5 deep dives + thesis-specific surprises (analyst-hour equivalent: €600)",
      "Diligence prompts for each top-10 startup, paste-ready into your IC memo (custom diligence work: €800)",
      "Three early-stage targets not on Crunchbase or PitchBook, surfaced via the same engine (sourcing-fee equivalent: €2,000)",
      "14-day email Q&A window — unlimited follow-up, additional cuts on demand (4-6 analyst emails: €1,400)",
      "Reproducible methodology audit trail — every metric you can re-derive from public GitHub data (audit deliverable: €500)",
      "BONUS — €1,997 100% credited toward an Insider Circle subscription if you upgrade within 60 days (your first ~20 months of Insider, paid)",
      "30-day Signal-or-It's-Free guarantee on the Sweep itself",
    ],
    ctaLabel: "Commission a Sector Sweep",
    ctaHref: STRIPE_SWEEP,
    highlight: false,
  },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "How much does VC Deal Flow Signal cost?",
    a: "Pricing has six tiers. The Signal Digest is free forever — a weekly email with five ranked startups. The First Look Pass is €7 one-time and delivers a full sector deep dive within 24 hours. The Dashboard Beta is €9.97 per month at founding-member pricing (going to €49 per month permanently) and ranks 109 startups across 19 sectors with weekly refresh. The Insider Circle is €97 per month at founding-member pricing (going to €197 per month) and adds a private Telegram group, custom watchlists, and JSON / CSV API access. The Sharp Tier is €497 per month or €4,970 per year for active funds and syndicates — quarterly portfolio review call, custom thesis-aligned watchlist co-built with the fund, white-labeled API endpoint at /api/v1/sharp/<your-fund>, methodology source code access, application-gated and capped at 8 funds in 2026. The Custom Sector Sweep is €1,997 one-time for a written report on one sector of your choice. The free MCP server for Claude / Cursor / Windsurf is bundled with every tier including the free one and will never be gated.",
  },
  {
    q: "Is there a free tier?",
    a: "Yes — the Signal Digest is free forever. One email per week, five startups ranked by GitHub engineering acceleration, signal type per startup, direct GitHub links, and a sector tag. The free MCP server (five tools, no auth) is bundled with the free tier and works in Claude, Cursor, Windsurf, and any MCP-compatible client. Both will remain free permanently — they are the distribution magnet for the paid tiers, not a trial.",
  },
  {
    q: "What is the cheapest paid plan?",
    a: "The First Look Pass at €7 one-time is the cheapest paid product. It delivers a full Sector Deep Dive on whichever sector you pick — the same momentum table, contributor maps, and breakout list that paid Dashboard subscribers see, focused on one sector. It is designed as a buyer-threshold breaker for investors who want to test the signal quality on a specific sector before subscribing. If you upgrade to Dashboard within 14 days, the €7 is credited toward the subscription.",
  },
  {
    q: "What is founding-member pricing?",
    a: "Founding-member pricing is the discounted launch rate on Dashboard Beta (€9.97 per month versus the €49 per month list price) and Insider Circle (€97 per month versus the €197 per month list price). Founding-member rates lock in for the lifetime of the subscription as long as the subscription stays active. Once we exit beta, list prices apply to new sign-ups; founding members keep their original rate. There is no minimum commitment — month-to-month, cancel anytime.",
  },
  {
    q: "What is the Signal-or-It's-Free guarantee?",
    a: "Every paid tier (Dashboard, Insider, and Sector Sweep) ships with a 30-day guarantee. If, in your first 30 days, the signal doesn't surface a startup that you find genuinely interesting — defined as one you would have wanted to know about earlier — reply to any email with the word REFUND and the full payment is refunded, no questions asked. The guarantee exists because the signal either works or it doesn't; charging for an output you don't find useful is bad business.",
  },
  {
    q: "How does the Sector Sweep differ from Dashboard?",
    a: "Dashboard is a live ranking across 19 sectors, refreshed weekly, that you keep open during deal-flow review. Sector Sweep is a one-time written report on a single sector you pick — every venture-backed startup in that sector ranked over the past four quarters, with diligence prompts on the top ten and three early-stage targets not yet on Crunchbase. Sweep is for funds who want a deeper, narrative-led analysis on a defined thesis without committing to a recurring subscription. Many funds use both: Dashboard for ongoing review, Sweep for thesis-anchored deep dives.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Both Dashboard and Insider Circle are month-to-month subscriptions managed through Stripe. There is no minimum term, no cancellation fee, and no win-back call. Cancel from your Stripe customer portal or by replying to any email; the cancellation is honored immediately and prorated against the current billing period.",
  },
  {
    q: "Is there an API?",
    a: "Basic JSON endpoints (signals.json, weekly summary, methodology) are free with reasonable rate limits suitable for individual investors and small funds. Higher-volume API access — JSON endpoints, bulk CSV pulls, and webhook delivery on threshold triggers — is included with Insider Circle (€97 per month). No enterprise contract required. The MCP server is also fully usable as a programmatic interface from Claude, Cursor, or any MCP-compatible client.",
  },
  {
    q: "What is the MCP server and is it really free forever?",
    a: "The MCP (Model Context Protocol) server exposes five read-only tools — get_trending_startups, search_startups_by_sector, get_startup_signal, get_signals_summary, and get_methodology — to any MCP-compatible AI client (Claude, Cursor, Windsurf, Mistral Le Chat, ChatGPT GPT, custom agents). It is published on npm as @gitdealflow/mcp-signal and runs as a Streamable HTTP endpoint at signals.gitdealflow.com/api/mcp/rpc. It is free and will never be gated — it is the distribution magnet that brings developer-investors into the funnel. New paid tools may be added as a separate paid tier; the existing five stay free permanently.",
  },
  {
    q: "Do you offer enterprise pricing?",
    a: "Yes — the Sharp Tier at €497 per month (or €4,970 per year, saves two months) is the dedicated tier for active funds and syndicates. It includes quarterly portfolio review calls, custom thesis-aligned watchlist co-build, white-labeled API endpoint at /api/v1/sharp/<your-fund>, direct methodology source code access, same-day signal questions, and data-room exports formatted for LP updates. Sharp Tier is application-gated and capped at 8 funds in 2026 — applications reviewed within 48 hours. The Sector Sweep at €1,997 one-time is a lower-commitment on-ramp; many funds commission a Sweep first and upgrade to Sharp after delivery if the signal quality matches their thesis. Funds with deeper custom requirements (white-label fund-branded UI, dedicated Slack channel, on-call for fundraise diligence) should email signal at gitdealflow dot com for a scoped proposal.",
  },
  {
    q: "Why is the methodology open?",
    a: "The methodology is published openly on SSRN (abstract id 6606558) and mirrored on Zenodo with a DOI. The dataset is auto-indexed by OpenAlex and DataCite. Investors evaluating the signal can audit the full methodology and replicate the metrics from the same public GitHub data described in the paper. Open methodology is the cheapest way to earn investor trust — it removes the black-box objection up front.",
  },
];

function tierToOffer(tier: Tier) {
  const priceNumber =
    tier.priceLabel === "Free"
      ? 0
      : parseFloat(tier.priceLabel.replace(/[€,]/g, ""));

  const offer: Record<string, unknown> = {
    "@type": "Offer",
    name: tier.name,
    description: tier.oneLine,
    price: priceNumber,
    priceCurrency: "EUR",
    url: `https://signals.gitdealflow.com/pricing#${tier.slug}`,
    availability: "https://schema.org/InStock",
    category: tier.priceCadence === "one-time" ? "one-time" : "subscription",
    seller: { "@id": "https://gitdealflow.com/#organization" },
  };

  if (tier.priceCadence === "/mo" || tier.priceCadence === "/yr") {
    offer.priceSpecification = {
      "@type": "UnitPriceSpecification",
      price: priceNumber,
      priceCurrency: "EUR",
      billingDuration: tier.priceCadence === "/mo" ? "P1M" : "P1Y",
      unitCode: "MON",
    };
  }

  return offer;
}

export default function PricingPage() {
  const asOf = getDataLastModified().toISOString().slice(0, 10);
  const offers = tiers.map(tierToOffer);
  const paidPrices = tiers
    .filter((t) => t.priceLabel !== "Free")
    .map((t) => parseFloat(t.priceLabel.replace(/[€,]/g, "")));
  const lowPrice = 0;
  const highPrice = Math.max(...paidPrices);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/pricing#webpage",
        url: "https://signals.gitdealflow.com/pricing",
        name: "VC Deal Flow Signal — Pricing",
        description:
          "Six-tier pricing for VC Deal Flow Signal — free weekly digest, €7 First Look Pass, €9.97/mo Dashboard, €97/mo Insider Circle, €497/mo Sharp Tier, and €1,997 one-time Sector Sweep.",
        inLanguage: "en-US",
        isPartOf: {
          "@id": "https://signals.gitdealflow.com/#website",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          xpath: ["/html/body//h1", "/html/body//h2"],
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://signals.gitdealflow.com/#softwareapplication",
        name: "VC Deal Flow Signal",
        alternateName: "GitDealFlow",
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Investment Research",
        operatingSystem: "Web, MCP-compatible AI clients (Claude, Cursor, Windsurf)",
        url: "https://signals.gitdealflow.com",
        description:
          "Engineering-acceleration signal for venture-backed startups, derived from public GitHub commit velocity, contributor growth, and shipping cadence. Delivered as weekly digests, a live dashboard, JSON/CSV API, and an MCP server.",
        provider: { "@id": "https://gitdealflow.com/#organization" },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "EUR",
          lowPrice,
          highPrice,
          offerCount: tiers.length,
          offers,
        },
        sameAs: [
          "https://www.wikidata.org/wiki/Q139376302",
          "https://ssrn.com/abstract=6606558",
          "https://orcid.org/0009-0002-2222-4112",
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "All Sectors",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Pricing",
            item: "https://signals.gitdealflow.com/pricing",
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "VC Deal Flow Signal pricing tiers",
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: tiers.length,
        itemListElement: tiers.map((tier, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: tier.name,
          url: `https://signals.gitdealflow.com/pricing#${tier.slug}`,
          description: tier.oneLine,
        })),
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
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Pricing</span>
        </nav>

        {/* PH50OFF promo banner — matches apex banner; auto-applies on Stripe checkout */}
        <div
          className="mb-4 rounded-md border border-amber-700/60 bg-amber-950/30 px-4 py-3 text-sm text-amber-200"
          role="note"
        >
          <strong className="text-amber-100">Limited time:</strong> 50% off
          your first 3 months on Dashboard or Insider Circle &mdash; use code{" "}
          <code className="rounded bg-amber-900/40 px-1.5 py-0.5 text-amber-100 font-semibold">
            PH50OFF
          </code>{" "}
          at Stripe checkout. Stacks on top of founding-member pricing.
        </div>

        {/* Sharp Tier scarcity — public counter, updated when funds sign */}
        <div className="mb-8">
          <SharpScarcityBadge variant="default" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Pricing — Free Forever, €7 to Test, €9.97 to Subscribe, €497 for Funds
        </h1>

        <p className="text-gray-400 text-base leading-relaxed mb-6">
          Six tiers, ordered cheapest to most expensive. The free Signal
          Digest and the free MCP server are the distribution magnet — they
          will never be gated. Dashboard at €9.97 per month and Insider
          Circle at €97 per month are at founding-member rates and lock in
          for the lifetime of the subscription. Sharp Tier at €497 per month
          is the dedicated landing for active funds; it is application-gated
          and capped at 8 funds in 2026. Every paid tier ships with a 30-day
          Signal-or-It&rsquo;s-Free guarantee.
        </p>

        {/* Quiz nudge — Russell audit 2026-05-05 PM: visitors landing on /pricing
            cold often pick the wrong tier. The 90-second avatar quiz routes
            them by self-identification. */}
        <div className="mb-8 flex items-center gap-3 rounded-lg border border-sky-700/40 bg-sky-950/20 px-4 py-3">
          <span aria-hidden="true" className="text-sky-300 text-lg">⚡</span>
          <p className="text-gray-300 text-sm flex-1">
            Not sure which tier fits the way you write checks?{" "}
            <Link
              href="/quiz"
              className="text-sky-300 hover:text-sky-200 font-medium underline decoration-dotted"
            >
              Take the 90-second avatar quiz →
            </Link>
          </p>
        </div>

        <AgentSummary
          tldr="VC Deal Flow Signal (GitDealFlow) has six pricing tiers: a free weekly Signal Digest with five ranked startups, a €7 one-time First Look Pass for a sector deep dive, a €9.97/mo Dashboard Beta covering 109 startups across 19 sectors at founding-member rates, a €97/mo Insider Circle adding private Telegram + JSON/CSV API at founding-member rates, a €497/mo Sharp Tier for active funds with quarterly review calls + custom watchlists + white-labeled API + methodology source code (application-gated, capped at 8 funds in 2026), and a €1,997 one-time Custom Sector Sweep written report. The free MCP server (five read-only tools) is bundled with every tier including the free one and will never be gated. Every paid tier ships with a 30-day Signal-or-It's-Free guarantee."
          pageUrl="https://signals.gitdealflow.com/pricing"
          asOf={asOf}
          citeAs="VC Deal Flow Signal — Pricing (signals.gitdealflow.com/pricing), retrieved Q2 2026."
          facts={[
            {
              claim:
                "Free tier (Signal Digest) is permanent — weekly email with five startups ranked by GitHub engineering acceleration; the bundled MCP server with five read-only tools will never be gated.",
              sourceUrl: "https://signals.gitdealflow.com/integrations",
              sourceLabel: "Integrations",
            },
            {
              claim:
                "Cheapest paid product is the €7 First Look Pass — a one-time full sector deep dive delivered within 24 hours, with the €7 credited toward Dashboard if you upgrade within 14 days.",
              sourceUrl: "https://gitdealflow.com/#firstlook",
              sourceLabel: "First Look Pass",
            },
            {
              claim:
                "Founding-member rates (€9.97/mo Dashboard, €97/mo Insider) lock in for the lifetime of the subscription; list prices are €49/mo and €197/mo respectively.",
              sourceUrl: "https://gitdealflow.com/#pricing",
              sourceLabel: "Apex pricing block",
            },
            {
              claim:
                "Every paid tier ships with a 30-day Signal-or-It's-Free guarantee — full refund within 30 days if the signal does not surface a startup you find genuinely interesting.",
              sourceUrl: "https://gitdealflow.com/#guarantee",
              sourceLabel: "Guarantee",
            },
          ]}
        />

        {/* Comparison table */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Tier comparison
          </h2>
          <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/40">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/60 text-left text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-gray-300 font-semibold">Tier</th>
                  <th className="px-4 py-3 text-gray-300 font-semibold">Price</th>
                  <th className="px-4 py-3 text-gray-300 font-semibold">For who</th>
                  <th className="px-4 py-3 text-gray-300 font-semibold text-right">CTA</th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((tier) => (
                  <tr
                    key={tier.slug}
                    className={`border-b border-slate-800 last:border-b-0 hover:bg-slate-900/60 transition-colors ${
                      tier.highlight ? "bg-sky-950/15" : ""
                    }`}
                  >
                    <td className="px-4 py-4 text-gray-100 font-medium align-top">
                      <a
                        href={`#${tier.slug}`}
                        className="inline-flex items-center gap-2 hover:text-sky-400 transition-colors"
                      >
                        {tier.name}
                        {tier.highlight && (
                          <span className="inline-block bg-sky-500 text-slate-950 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                            Popular
                          </span>
                        )}
                      </a>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-baseline gap-1 whitespace-nowrap">
                        <span className="font-bold text-gray-100 text-base tabular-nums">
                          {tier.priceLabel}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {tier.priceCadence}
                        </span>
                      </div>
                      {tier.rrpLabel ? (
                        <div className="text-gray-500 text-[11px] mt-1 max-w-[180px] sm:max-w-xs leading-tight">
                          {tier.rrpLabel}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 text-gray-400 align-top text-sm leading-snug">
                      {tier.forWho}
                    </td>
                    <td className="px-4 py-4 align-top text-right">
                      <a
                        href={tier.ctaHref}
                        className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 transition-colors text-sm font-medium whitespace-nowrap"
                      >
                        {tier.ctaLabel} <span aria-hidden="true">→</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tier detail cards */}
        <section className="mb-12 space-y-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            What each tier includes
          </h2>
          {tiers.map((tier) => (
            <div
              key={tier.slug}
              id={tier.slug}
              className={`rounded-lg border p-6 ${
                tier.highlight
                  ? "border-sky-700 bg-sky-950/30"
                  : "border-slate-800 bg-slate-900"
              }`}
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
                <h3 className="text-lg font-semibold text-gray-100">
                  {tier.name}
                </h3>
                <span className="text-2xl font-bold text-gray-100">
                  {tier.priceLabel}
                </span>
                <span className="text-gray-400 text-sm">
                  {tier.priceCadence}
                </span>
                {tier.rrpLabel ? (
                  <span className="text-gray-500 text-xs">
                    ({tier.rrpLabel})
                  </span>
                ) : null}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                {tier.oneLine}
              </p>
              <p className="text-gray-500 text-xs italic mb-4">
                Best for: {tier.forWho}
              </p>
              <ul className="space-y-2 mb-4">
                {tier.bullets.map((b, i) => (
                  <li
                    key={i}
                    className="text-gray-400 text-sm flex items-start gap-2"
                  >
                    <span className="text-sky-500 mt-0.5">&#10003;</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <a
                href={tier.ctaHref}
                className={`inline-block px-4 py-2 rounded-md text-sm font-semibold transition ${
                  tier.highlight
                    ? "bg-sky-600 hover:bg-sky-500 text-white"
                    : "bg-slate-800 hover:bg-slate-700 text-gray-100 border border-slate-700"
                }`}
              >
                {tier.ctaLabel} &rarr;
              </a>
            </div>
          ))}
        </section>

        {/* Dashboard stack slide — Brunson stack-and-close on the workhorse
            mid-tier. Mirrors the Sector Sweep stack pattern but for the
            €9.97/mo subscription that converts most buyers. Russell audit
            2026-05-05: only the €1,997 tier had a stack visualization. */}
        <section
          id="dashboard-stack"
          className="mb-12 rounded-xl border border-sky-700/40 bg-sky-950/10 p-6 sm:p-8"
          aria-label="Dashboard — itemized value stack"
        >
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider mb-3">
            Dashboard Beta — what €9.97/mo actually buys
          </p>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            €1,728/yr of standalone value, locked at the founder price
          </h2>
          <p className="text-gray-400 text-sm mb-6 max-w-2xl">
            Each row below is the standalone market price for the same
            deliverable from a comparable tool. You pay the bottom line, and
            the founder price stays €9.97/mo for as long as you stay
            subscribed — even after the public launch hike to €49/mo.
          </p>
          <ul className="divide-y divide-sky-900/30 mb-6 border border-sky-900/30 rounded-lg overflow-hidden">
            {[
              {
                label: "The Live Dashboard",
                detail:
                  "109 venture-backed startups ranked by 14-day commit-velocity acceleration, refreshed every Monday at 06:00 UTC. Filter by sector, stage, geography.",
                value: "€348/yr",
              },
              {
                label: "219-Startup Backtest CSV",
                detail:
                  "Five quarters of historical signal-to-fundraise pairs. The full dataset behind the SSRN-published 21–47-day lead-time claim.",
                value: "€297 once",
              },
              {
                label: "Monthly Sector Deep-Dive PDF",
                detail:
                  "Pick any sector each month — twelve 12-page deep-dives a year, with top 25 ranked orgs, contributor maps, and three pre-Crunchbase breakouts.",
                value: "€588/yr",
              },
              {
                label: "Two free Chrome Extensions",
                detail:
                  "Crunchbase + Wellfound badge injects a momentum score, and VC GitHub Lookup hovers any org or repo and returns the velocity in 200ms.",
                value: "€198/yr",
              },
              {
                label: "Free MCP server (forever, never gated)",
                detail:
                  "npx @gitdealflow/mcp-signal — six read-only tools inside Claude, Cursor, Windsurf. Ask 'which AI infra startups are accelerating' inline.",
                value: "Bundled",
              },
              {
                label: "Async Watchlist Build",
                detail:
                  "Send your thesis. Custom watchlist of the 10 highest-acceleration orgs comes back in 48h. One-time, kicks off the day you upgrade.",
                value: "€297 once",
              },
              {
                label: "Methodology Vault",
                detail:
                  "Full SSRN preprint, every signal definition, the regression code that produced the lead-time numbers. CC BY 4.0.",
                value: "Open",
              },
              {
                label: "BONUS — 30-day Signal-or-It's-Free guarantee",
                detail:
                  "If the signal doesn't surface a startup you find genuinely interesting in 30 days, reply REFUND. Full refund inside two business days.",
                value: "Priceless",
              },
            ].map((row) => (
              <li
                key={row.label}
                className="flex flex-col sm:flex-row sm:items-baseline gap-y-1 sm:gap-x-4 px-4 py-3 bg-slate-900/50"
              >
                <div className="flex-1">
                  <p className="text-gray-100 text-sm font-medium">
                    {row.label}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed mt-0.5">
                    {row.detail}
                  </p>
                </div>
                <p className="text-sky-300 text-sm font-mono font-semibold whitespace-nowrap sm:self-start">
                  {row.value}
                </p>
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-lg border border-sky-700/50 bg-sky-950/30 px-5 py-4">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                Standalone value
              </p>
              <p className="text-gray-300 text-base">
                <span className="line-through decoration-sky-400/60">
                  €1,728/yr
                </span>{" "}
                <span className="text-gray-500 text-sm">
                  (post-launch retail €588/yr)
                </span>
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sky-300 text-xs uppercase tracking-wider mb-1">
                Founder price, locked forever
              </p>
              <p className="text-3xl font-bold text-sky-200">€9.97/mo</p>
            </div>
            <a
              href={STRIPE_DASHBOARD}
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm shadow-lg shadow-sky-500/20 transition-all"
            >
              Lock founder price →
            </a>
          </div>
          <p className="text-gray-500 text-xs mt-3">
            €119.64/year. Roughly the cost of one missed seed deal. The price
            stays €9.97 for as long as you stay subscribed.
          </p>
        </section>

        {/* Sector Sweep stack slide — anchored value vs price */}
        <section
          id="sector-sweep-stack"
          className="mb-12 rounded-xl border border-amber-700/40 bg-amber-950/10 p-6 sm:p-8"
          aria-label="Sector Sweep — itemized value stack"
        >
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
            Custom Sector Sweep — what €1,997 actually buys
          </p>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            €13,000+ of analyst work, packaged as one written report
          </h2>
          <p className="text-gray-400 text-sm mb-6 max-w-2xl">
            The Sweep is built from scratch on your thesis. Below is the
            itemized stack — each line is the standalone market price for
            the same deliverable. You pay the bottom line, not the sum.
          </p>
          <ul className="divide-y divide-amber-900/30 mb-6 border border-amber-900/30 rounded-lg overflow-hidden">
            {[
              {
                label: "40-page custom Sector Sweep PDF",
                detail:
                  "Every venture-backed org in your sector, ranked over the past four quarters. Top-5 deep dives. Sub-sector cuts.",
                value: "€4,500",
              },
              {
                label: "Raw CSV — every org × every metric",
                detail:
                  "Commit velocity 14d/30d/90d, contributor delta, new-repo count, signal classification. License-friendly to drop into your CRM.",
                value: "€1,200",
              },
              {
                label: "Written walkthrough (60 min reading)",
                detail:
                  "Methodology, top-5 deep dives, the thesis-specific surprises. Async, re-readable, paste-able into your notes.",
                value: "€600",
              },
              {
                label: "Diligence prompts for the top-10 startups",
                detail:
                  "Paste-ready into your IC memo or first-call brief. Specific to your thesis, not generic.",
                value: "€800",
              },
              {
                label: "Three early-stage targets not on Crunchbase",
                detail:
                  "Net-new orgs surfaced by the same engine. Pre-deck, pre-press, pre-AngelList.",
                value: "€2,000",
              },
              {
                label: "14-day email Q&A window",
                detail:
                  "Unlimited follow-up. Request additional cuts, re-runs on a sub-thesis, or specific orgs. Same-week response.",
                value: "€1,400",
              },
              {
                label: "Reproducible methodology audit trail",
                detail:
                  "Every metric is re-derivable from public GitHub data. Methodology source on SSRN abstract 6606558.",
                value: "€500",
              },
              {
                label: "BONUS — Insider Circle credit (€1,997, 60 days)",
                detail:
                  "Upgrade to Insider Circle within 60 days of receiving the Sweep and the €1,997 is 100% credited — first ~20 months of Insider, paid.",
                value: "€1,997",
              },
              {
                label: "BONUS — 30-day Signal-or-It's-Free guarantee",
                detail:
                  "Reply with REFUND within 30 days if the Sweep doesn't surface three orgs you didn't already know about. No forms, no call.",
                value: "Priceless",
              },
            ].map((row) => (
              <li
                key={row.label}
                className="flex flex-col sm:flex-row sm:items-baseline gap-y-1 sm:gap-x-4 px-4 py-3 bg-slate-900/50"
              >
                <div className="flex-1">
                  <p className="text-gray-100 text-sm font-medium">
                    {row.label}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed mt-0.5">
                    {row.detail}
                  </p>
                </div>
                <p className="text-amber-300 text-sm font-mono font-semibold whitespace-nowrap sm:self-start">
                  {row.value}
                </p>
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-lg border border-amber-700/50 bg-amber-950/30 px-5 py-4">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                Itemized value
              </p>
              <p className="text-gray-300 text-base">
                <span className="line-through decoration-amber-400/60">
                  €13,000+
                </span>{" "}
                <span className="text-gray-500 text-sm">
                  (excluding bonuses)
                </span>
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-amber-300 text-xs uppercase tracking-wider mb-1">
                Today, one-time
              </p>
              <p className="text-3xl font-bold text-amber-200">€1,997</p>
            </div>
            <a
              href={STRIPE_SWEEP}
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm shadow-lg shadow-amber-500/20 transition-all"
            >
              Commission via Stripe →
            </a>
          </div>
          <p className="text-gray-500 text-xs mt-3">
            Capped at 8 sweeps per quarter. Q3 2026: 7 of 8 open. Each Sweep
            is custom — nothing template, nothing reused.
          </p>
        </section>

        {/* Annual plans — founder-locked, save vs monthly. Stripe links land
            via env when user creates them; otherwise a soft mailto-style
            instruction so we don't strand the visitor. */}
        <section
          id="annual-plans"
          className="mb-12 rounded-xl border border-sky-700/40 bg-sky-950/10 p-6 sm:p-8"
          aria-label="Annual plans"
        >
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider mb-2">
            Annual plans · save 17% on monthly
          </p>
          <h2 className="text-2xl font-bold text-gray-100 mb-3">
            Pay yearly. Lock the founder rate twice over.
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-2xl">
            Both founding-member tiers offer an annual option that saves
            roughly two months versus the monthly rate. Annual subscribers
            keep the founder lock indefinitely <em>and</em> are insulated
            from any future price change for the entire term.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <li className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 space-y-1.5">
              <p className="text-gray-100 font-semibold text-base">
                Dashboard Beta — Annual
              </p>
              <p className="text-gray-400 text-sm">
                <span className="text-2xl font-bold text-sky-300">€99</span>
                <span className="text-gray-500">/yr · saves €20.64 vs €9.97×12</span>
              </p>
              <p className="text-gray-500 text-xs leading-relaxed">
                Same dashboard, same MCP, same guarantee. Renews at the
                same €99/yr rate as long as the subscription stays active.
              </p>
            </li>
            <li className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 space-y-1.5">
              <p className="text-gray-100 font-semibold text-base">
                Insider Circle — Annual
              </p>
              <p className="text-gray-400 text-sm">
                <span className="text-2xl font-bold text-emerald-300">€970</span>
                <span className="text-gray-500">/yr · saves €194 vs €97×12</span>
              </p>
              <p className="text-gray-500 text-xs leading-relaxed">
                Telegram + 24h lead + API + custom watchlist. Two months
                free vs monthly. Locks for as long as you stay subscribed.
              </p>
            </li>
          </ul>
          <p className="text-gray-400 text-sm">
            To switch to annual, email{" "}
            <a
              href="mailto:signal@gitdealflow.com?subject=Annual%20plan"
              className="text-sky-400 hover:text-sky-300 underline"
            >
              signal@gitdealflow.com
            </a>{" "}
            with the subject &ldquo;Annual plan&rdquo; and the tier you
            want. We send back a Stripe link inside one business day. If
            you&rsquo;re already on monthly, the unused portion of the
            current month is credited toward the annual term.
          </p>
        </section>

        {/* Agent Credits cross-link — separate ICP (AI-agent builders),
            buried until now. Brunson "same product, new market" funnel. */}
        <section
          id="agent-credits"
          className="mb-12 rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8"
          aria-label="Agent credits cross-link"
        >
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            For AI-agent builders · Pay-as-you-go
          </p>
          <h2 className="text-2xl font-bold text-gray-100 mb-3">
            Building an agent? Pay per deep-signal call instead.
          </h2>
          <p className="text-gray-400 text-sm mb-4 max-w-2xl">
            If you&rsquo;re shipping an agent that scouts startups or briefs
            investors, the subscription tiers above are the wrong shape — you
            want per-call pricing on the deep-enrichment endpoint. €19 buys
            100 <code className="text-amber-300 font-mono">get_deep_signal</code>{" "}
            calls (€0.19 each). Misses are free. Credits never expire. Six
            other MCP tools stay free forever.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/for-builders"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-semibold transition-colors"
            >
              See the builder funnel →
            </Link>
            <Link
              href="/agents/credits"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-amber-700/40 hover:border-amber-500/60 text-amber-200 text-sm font-medium transition-colors"
            >
              Buy 100 credits — €19
            </Link>
          </div>
        </section>

        {/* Guarantee */}
        <section className="mb-12 rounded-lg border border-emerald-800 bg-emerald-950/20 p-6">
          <h2 className="text-xl font-semibold text-emerald-300 mb-3">
            Signal or It&rsquo;s Free — 30-day guarantee
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            Every paid tier (Dashboard, Insider Circle, and Sector Sweep)
            ships with a 30-day guarantee. If, in your first 30 days, the
            signal doesn&rsquo;t surface a startup you find genuinely
            interesting &mdash; defined as one you would have wanted to know
            about earlier &mdash; reply to any email with the word{" "}
            <code className="text-emerald-300 bg-emerald-900/40 px-1.5 py-0.5 rounded text-xs">
              REFUND
            </code>{" "}
            and the full payment is refunded, no questions asked.
          </p>
          <p className="text-gray-500 text-xs">
            The guarantee exists because the signal either works or it
            doesn&rsquo;t; charging for an output you don&rsquo;t find
            useful is bad business.
          </p>
        </section>

        {/* FAQ — collapsible <details> reduces scroll fatigue and lets readers
            jump straight to the question that matches their objection. */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-100 mb-2">
            Frequently asked questions
          </h2>
          <p className="text-gray-500 text-xs mb-5">
            Tap any question to expand. {faqs.length} answers.
          </p>
          <div className="divide-y divide-slate-800 rounded-lg border border-slate-800 bg-slate-900/40">
            {faqs.map((f, i) => (
              <details
                key={i}
                className="group px-5 py-4 [&[open]>summary>span:last-child]:rotate-45"
              >
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                  <h3 className="text-base font-semibold text-gray-100 group-hover:text-sky-400 transition-colors">
                    {f.q}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-gray-500 group-hover:text-sky-400 text-2xl leading-none transition-transform duration-200"
                  >
                    +
                  </span>
                </summary>
                <p className="text-gray-400 text-sm leading-relaxed mt-3 pr-8">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Cite */}
        <p className="text-xs text-gray-500 mt-8 mb-4">
          Pricing snapshot last verified {asOf}. Founding-member rates apply
          to all signups before list-price exit; list prices apply to
          subsequent signups.
        </p>

        <PSEOFooterNav />
      </div>
    </>
  );
}
