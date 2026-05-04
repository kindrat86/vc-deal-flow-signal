import type { Metadata } from "next";
import Link from "next/link";
import { AgentSummary } from "@/components/AgentSummary";
import { getDataLastModified } from "@/lib/data";
import PSEOFooterNav from "@/components/PSEOFooterNav";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

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
const SHARP_APPLY_URL =
  "mailto:signal@gitdealflow.com?subject=Sharp%20Tier%20Application%20%E2%80%94%20%5BYour%20Fund%5D&body=Hi%20%E2%80%94%0A%0AFund%2Fsyndicate%20name%3A%20%0AAUM%20or%20deals%2Fyear%3A%20%0AThesis%20focus%3A%20%0AHow%20you%20heard%20about%20us%3A%20%0A%0AOne%20thing%20you%27d%20want%20the%20quarterly%20review%20call%20to%20cover%3A%20%0A%0AThanks%2C%0A";

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
    ctaHref: "https://gitdealflow.com/#firstlook",
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
    rrpLabel: null,
    oneLine:
      "A custom written report on one sector you pick — engineering momentum across every venture-backed startup in that sector, ranked, with diligence prompts and the top three early-stage targets.",
    forWho:
      "Funds investing seven-figure cheques into a defined sector who want a one-off, deeper-than-Dashboard analysis without a yearly contract.",
    bullets: [
      "Full sector audit — every venture-backed startup in the sector you pick",
      "Engineering acceleration ranked over the past four quarters",
      "Diligence prompts for each top-ten startup",
      "Three early-stage targets not yet on Crunchbase or PitchBook",
      "Delivered as a written report within 7 business days",
      "One 30-minute clarifications call after delivery",
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

export default function PricingPage() {
  const asOf = getDataLastModified().toISOString().slice(0, 10);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/pricing#webpage",
        url: "https://signals.gitdealflow.com/pricing",
        name: "VC Deal Flow Signal — Pricing",
        description:
          "Five-tier pricing for VC Deal Flow Signal — free weekly digest, €7 First Look Pass, €9.97/mo Dashboard, €97/mo Insider Circle, and €1,997 one-time Sector Sweep.",
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
          className="mb-8 rounded-md border border-amber-700/60 bg-amber-950/30 px-4 py-3 text-sm text-amber-200"
          role="note"
        >
          <strong className="text-amber-100">Limited time:</strong> 50% off
          your first 3 months on Dashboard or Insider Circle &mdash; use code{" "}
          <code className="rounded bg-amber-900/40 px-1.5 py-0.5 text-amber-100 font-semibold">
            PH50OFF
          </code>{" "}
          at Stripe checkout. Stacks on top of founding-member pricing.
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
        <section className="mb-12 overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Tier comparison
          </h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-left">
                <th className="px-3 py-3 text-gray-300 font-semibold">Tier</th>
                <th className="px-3 py-3 text-gray-300 font-semibold">Price</th>
                <th className="px-3 py-3 text-gray-300 font-semibold">For who</th>
                <th className="px-3 py-3 text-gray-300 font-semibold">CTA</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier) => (
                <tr key={tier.slug} className="border-b border-slate-800">
                  <td className="px-3 py-4 text-gray-200 font-medium align-top">
                    <a
                      href={`#${tier.slug}`}
                      className="hover:text-sky-400 transition-colors"
                    >
                      {tier.name}
                    </a>
                  </td>
                  <td className="px-3 py-4 text-gray-300 align-top whitespace-nowrap">
                    <span className="font-semibold text-gray-100">
                      {tier.priceLabel}
                    </span>{" "}
                    <span className="text-gray-500 text-xs">
                      {tier.priceCadence}
                    </span>
                    {tier.rrpLabel ? (
                      <div className="text-gray-500 text-xs mt-1">
                        {tier.rrpLabel}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-3 py-4 text-gray-400 align-top">
                    {tier.forWho}
                  </td>
                  <td className="px-3 py-4 align-top">
                    <a
                      href={tier.ctaHref}
                      className="text-sky-400 hover:text-sky-300 transition-colors text-sm font-medium"
                    >
                      {tier.ctaLabel} &rarr;
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {faqs.map((f, i) => (
              <div key={i}>
                <h3 className="text-base font-semibold text-gray-200 mb-2">
                  {f.q}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
              </div>
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
