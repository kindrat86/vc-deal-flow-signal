import type { Metadata } from "next";
import Link from "next/link";
import { AgentSummary } from "@/components/AgentSummary";
import { getDataLastModified } from "@/lib/data";
import { FRESH_YEAR } from "@/lib/freshness-year";
import PSEOFooterNav from "@/components/PSEOFooterNav";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import SharpScarcityBadge from "@/components/SharpScarcityBadge";
import TrialClose from "@/components/TrialClose";

export const metadata: Metadata = {
  // CTR hook wave 5 (zero-click, 2026-08-16): 171 imps/90d at pos 6.3, 1
  // click on a generic title. The apex twin carries a price-ladder title
  // (live-verified 08-16); mirror that form here with the EUR tiers.
  title: {
    absolute:
      "GitDealFlow Pricing: Free Weekly Digest, EUR 49 Dashboard, EUR 197 Insider",
  },
  description:
    "VC Deal Flow Signal pricing, start free, test one sector, move to the full field, or go deeper only when the question justifies it. Founding-member rates locked. 30-day Signal-or-It's-Free guarantee on every paid plan above €1.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    // F5, explicit og:url so the field reaches the rendered <head>.
    // (Layout-default openGraph is replaced wholesale when a child page
    // sets its own openGraph object, so no inheritance for url here.)
    url: "https://signals.gitdealflow.com/pricing",
    title:
      "Pricing, Start free, go deeper only when you need it",
    description:
      "VC Deal Flow Signal pricing, start free, test one sector, work the full field, or go deeper only when the question gets expensive. Research partnership layers sit above the weekly workflow, not in front of it.",
    type: "website",
  },
};

const STRIPE_DASHBOARD = "https://buy.stripe.com/4gMbJ07kTaJy7kqg6s0x20b";
const STRIPE_INSIDER = "https://buy.stripe.com/bJeaEWfRpcRG6gm2fC0x20d";
const STRIPE_SWEEP = "/api/checkout/session?tier=sector_sweep";
// `||` not `??`, Vercel env entries can be empty strings, which `??`
// would NOT replace. We want the hardcoded canonical URL whenever the
// env var is missing OR empty.
const STRIPE_DASHBOARD_ANNUAL =
  process.env.NEXT_PUBLIC_STRIPE_DASHBOARD_ANNUAL_LINK ||
  "https://buy.stripe.com/aFa5kC34DeZOawC6vS0x20c";
const STRIPE_INSIDER_ANNUAL =
  process.env.NEXT_PUBLIC_STRIPE_INSIDER_ANNUAL_LINK ||
  "https://buy.stripe.com/cNieVc34DbNCcEK2fC0x20e";
const SIGNUP_URL = "https://gitdealflow.com/#signup";
// Sharp Tier, application-gated, capped at 8 funds in 2026. The mailto includes a structured intake template so the reply is immediate-prioritised.
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
      "Five breakout startups in your inbox every Monday, the same data the paid tiers see, narrowed to the top five.",
    forWho:
      "Use this if you want to feel the signal first and keep your weekly read simple.",
    bullets: [
      "Weekly email, five startups ranked by engineering acceleration",
      "Signal type per startup (hiring burst, infra buildout, shipping sprint)",
      "Direct GitHub link + sector tag",
      "No tracker pixels beyond basic open rate",
      "Free MCP server for Claude / Cursor / Windsurf, five tools, never gated",
    ],
    ctaLabel: "Get the Free Digest",
    ctaHref: SIGNUP_URL,
    highlight: false,
  },
  {
    slug: "book",
    name: "The Book, 7 GitHub Signals",
    priceLabel: "€0.99",
    priceCadence: "one-time",
    rrpLabel: "Free PDF + EPUB",
    oneLine:
      "104-page operational field manual on the seven public-data signals that precede Series A rounds, read free on the open web, free PDF/EPUB download, or €0.99 Kindle copy with three bonus emails.",
    forWho:
      "Use this if you want to understand the signal fully before you decide on a recurring workflow.",
    bullets: [
      "Eleven chapters: introduction, seven signal chapters, methodology, replication appendix, conclusion",
      "Replication appendix takes you from a fresh laptop to a verified leaderboard rank in 90 minutes",
      "Free downloads: PDF, EPUB, Markdown, plain text",
      "€0.99 Kindle copy adds three bonus emails (most-recent-catch walkthrough, investor interviews, 30-day direct line)",
      "ISBN 979-8-9876543-1-7 · CC-BY-4.0 license",
    ],
    ctaLabel: "Get the Book",
    ctaHref: "/book",
    highlight: false,
  },
  {
    slug: "tweet-teardown",
    name: "Tweet Teardown",
    priceLabel: "€1",
    priceCadence: "one-time",
    rrpLabel: "Buyer-threshold breaker · 24-hour delivery",
    oneLine:
      "Pay €1 once, name one venture-backed startup, and within 24 hours get a tweet-length (≤280 char) teardown of its GitHub momentum, signal type, 14-day acceleration %, and the kicker insight.",
    forWho:
      "Use this if you want one fast low-friction test before you trust the signal with more money.",
    bullets: [
      "Tweet-length (≤280 char) teardown of one startup you name",
      "Signal classification + 14-day acceleration delta + the kicker insight",
      "Hand-written by the founder, not LLM-generated",
      "Delivered to your inbox within 24h on weekdays",
      "€1 credited toward First Look Pass if you upgrade within 7 days",
      "No PDF, no CSV, no call, pure signal compression",
    ],
    ctaLabel: "Buy the Teardown, €1",
    ctaHref: "/teardown",
    highlight: false,
  },
  {
    slug: "first-look-pass",
    name: "First Look Pass",
    priceLabel: "€7",
    priceCadence: "one-time",
    rrpLabel: "€19 after launch",
    oneLine:
      "Pay €7 once and get a Sector Deep Dive on the sector you pick, full GitHub momentum table, 14-day acceleration deltas, and the top three names not yet on Crunchbase.",
    forWho:
      "Use this if one sector already matters and you want a sharper answer before you subscribe.",
    bullets: [
      "Full GitHub momentum table for one sector of your choice",
      "14-day commit velocity deltas with two-period confirmation",
      "Top three breakout names not yet on Crunchbase",
      "Contributor map and founding-team signals",
      "Delivered to your inbox within 24 hours",
      "€7 credited toward Dashboard if you upgrade within 14 days",
    ],
    ctaLabel: "Get the Pass, €7",
    ctaHref: "/firstlook",
    highlight: false,
  },
  {
    slug: "dashboard-beta",
    name: "Dashboard Beta",
    priceLabel: "€49",
    priceCadence: "/mo",
    rrpLabel: "Founding rate €9.97/mo, window closed 2026-06-30",
    oneLine:
      "140 startups ranked across 15 sectors, refreshed weekly, with sector filters and historical period comparisons.",
    forWho:
      "Use this if five names are no longer enough and you want the full field every week.",
    bullets: [
      "140 ranked startups across 15 sectors, refreshed weekly",
      "Sector filters with five-quarter historical comparison",
      "All four signal types per startup (hiring burst, shipping sprint, infrastructure buildout, platform migration)",
      "Watchlists and saved filters",
      "Free Chrome extensions, Crunchbase + Wellfound badge and GitHub-native hover lookup",
      "30-day Signal-or-It's-Free guarantee",
    ],
    ctaLabel: "Get the Dashboard",
    ctaHref: STRIPE_DASHBOARD,
    highlight: true,
  },
  {
    slug: "insider-circle",
    name: "Insider Circle",
    priceLabel: "€197",
    priceCadence: "/mo",
    rrpLabel: "Founding rate €97/mo, window closed 2026-06-30",
    oneLine:
      "Private Telegram group, live briefings, custom watchlists, JSON API, and bulk CSV pulls, every part of the signal that doesn't fit a public dashboard.",
    forWho:
      "Use this if you want closer context, live briefings, and a more serious operating rhythm around the signal.",
    bullets: [
      "Everything in Dashboard Beta",
      "Private Insider Circle Telegram group with live briefings",
      "Custom watchlists co-built around your investment thesis",
      "Insider API access, JSON endpoints + bulk CSV pulls (€1,200/yr value)",
      "Webhook delivery on threshold triggers (route into Slack / Discord / internal tooling)",
      "Monthly Insider Drop, first Tuesday, net-new sector deep-dive / methodology / essay / tool (12-month forward calendar at /continuity)",
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
      "Everything in Insider Circle plus the parts of the work that don't scale, quarterly portfolio review call, custom thesis-aligned watchlist co-built with you, white-labeled API endpoint at /api/v1/sharp/<your-fund>, and direct access to the methodology source code.",
    forWho:
      "Use this if the signal needs to support an active fund workflow, not just your own weekly reading.",
    bullets: [
      "Everything in Insider Circle",
      "Quarterly 60-minute portfolio review call, map existing holdings against the live signal",
      "Custom thesis-aligned watchlist (co-built with you)",
      "White-labeled API endpoint and data feed at /api/v1/sharp/<your-fund>",
      "Same-day signal questions answered (no SLA, but typically <4h)",
      "Data-room exports formatted for LP updates",
      "All future paid MCP tools included, no per-tool upcharge",
      "Direct access to the methodology source code (private repo invite)",
      "Capped at 8 funds in 2026, applications reviewed within 48h",
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
      "A custom written report on one sector you pick, engineering momentum across every venture-backed startup in that sector, ranked, with diligence prompts and the top three early-stage targets.",
    forWho:
      "Use this if one sector question is already expensive enough to justify a serious one-time pass.",
    bullets: [
      "40-page custom Sector Sweep PDF, every venture-backed startup in your sector ranked over the last four quarters (analyst-report equivalent: €4,500)",
      "Raw CSV, every org × every metric, license-friendly to drop into your CRM (data-license equivalent: €1,200)",
      "Written walkthrough, 60 minutes of reading, methodology + top-5 deep dives + thesis-specific surprises (analyst-hour equivalent: €600)",
      "Diligence prompts for each top-10 startup, paste-ready into your IC memo (custom diligence work: €800)",
      "Three early-stage targets not on Crunchbase or PitchBook, surfaced via the same engine (sourcing-fee equivalent: €2,000)",
      "14-day email Q&A window, unlimited follow-up, additional cuts on demand (4-6 analyst emails: €1,400)",
      "Reproducible methodology audit trail, every metric you can re-derive from public GitHub data (audit deliverable: €500)",
      "BONUS, €1,997 100% credited toward an Insider Circle subscription if you upgrade within 60 days (your first ~20 months of Insider, paid)",
      "30-day Signal-or-It's-Free guarantee on the Sweep itself",
    ],
    ctaLabel: "Commission a Sector Sweep",
    ctaHref: STRIPE_SWEEP,
    highlight: false,
  },
  {
    slug: "methodology-partnership",
    name: "Methodology Partnership",
    priceLabel: "€14,997",
    priceCadence: "/yr",
    rrpLabel:
      "Founding-rate locked through end of 2027 · 5-fund cap in 2026 · Async-only",
    oneLine:
      "Done-with-you methodology engagement: custom panel construction trained on your fund's anonymized portfolio outcomes, bespoke 50-org watchlist with monthly rebuild, white-labeled fund subdomain, quarterly synthetic founder talk, async-only methodology Q&A. The done-with-you rung above Sharp Tier.",
    forWho:
      "Use this if you want the methodology adapted to your own portfolio and internal workflow.",
    bullets: [
      "Everything in Sharp Tier (€4,970/yr value)",
      "Custom panel construction, your fund's regression model trained on anonymized portfolio outcomes",
      "Bespoke 50-org watchlist tuned to your written thesis, monthly rebuild against the live signal feed",
      "White-labeled fund subdomain, signal.yourfund.com returns the same dataset behind your auth",
      "Quarterly synthetic founder talk, 6-min Remotion video on your fund's specific thesis (4/yr)",
      "Async methodology Q&A, unlimited via dedicated email channel, 24h weekday turn",
      "Quarterly anonymized fund-as-case-study published to /press (attribution opt-in)",
      "Annual fund-only methodology brief, 30-min synthetic-voice walkthrough + 40-page PDF",
      "Founding-rate locked through end of 2027. After 2026: €29,997/yr. Capped at 5 funds in 2026.",
    ],
    ctaLabel: "Apply for Methodology Partnership",
    ctaHref: "/methodology-partnership",
    highlight: false,
  },
  {
    slug: "vault",
    name: "The Vault",
    priceLabel: "€49,997",
    priceCadence: "/yr",
    rrpLabel:
      "Founding-rate locked through end of 2028 · 2-fund cap in 2026 · Top of the ladder",
    oneLine:
      "Top rung. Methodology Partnership plus: co-development access to the panel-construction pipeline, pre-publication SSRN preview six months early, 72-hour signal head-start over the public Dashboard, methodology source repo (fund-only fork license), Signal-of-the-Quarter co-investment alerts.",
    forWho:
      "Funds intending to make GitHub-momentum signal a multi-year sourcing advantage, funds who want to own the methodology, not license the output. Most Vault funds enter via Methodology Partnership for 6-12 months first.",
    bullets: [
      "Everything in Methodology Partnership (€68,000+ stack value)",
      "Co-development access, your analysts submit signal hypotheses to the panel-construction pipeline, ~24 senior-engineering hours/mo equivalent",
      "Pre-publication SSRN preview, read next year's successor paper 6 months before public release, opt-in author credit (initials)",
      "72-hour signal head-start, every flag delivered to Vault funds 72h before the public Dashboard (~12 flags/yr)",
      "Annual async methodology summit, 8-hour Remotion-rendered keynote + fund-branded artifacts, no live attendance required",
      "Methodology source repo, private fork, MIT-license to your fund only, panel construction + regression engine + ETL pipeline",
      "Signal-of-the-Quarter co-investment alerts, 4 deep written analyses per year on the highest-conviction events",
      "Founding-rate locked through end of 2028. After 2026: €99,997/yr. Capped at 2 funds in 2026.",
    ],
    ctaLabel: "Apply for the Vault",
    ctaHref: "/vault",
    highlight: false,
  },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "How much does VC Deal Flow Signal cost?",
    a: "Pricing has ten tiers. The Signal Digest is free forever, a weekly email with five ranked startups. The Book is €0.99 one-time (or free PDF/EPUB) for the 104-page operational field manual on the seven public-data signals that precede Series A rounds. The Tweet Teardown is €1 one-time and delivers a tweet-length (≤280 char) momentum teardown of one startup you name, hand-written by the founder, within 24 hours. The First Look Pass is €7 one-time and delivers a full sector deep dive within 24 hours. The Dashboard Beta is €49 per month (the €9.97/mo founding rate closed 2026-06-30; existing founding members keep it for life) and ranks 140 startups across 15 sectors with weekly refresh. The Insider Circle is €197 per month (founding rate was €97/mo, same closed cohort) and adds a private Telegram group, custom watchlists, and JSON / CSV API access. The Sharp Tier is €497 per month or €4,970 per year for active funds and syndicates, quarterly portfolio review brief, custom thesis-aligned watchlist co-built with the fund, white-labeled API endpoint at /api/v1/sharp/<your-fund>, methodology source code access, application-gated and capped at 8 funds in 2026. The Custom Sector Sweep is €1,997 one-time for a written report on one sector of your choice. The Methodology Partnership is €14,997 per year (founding rate, going to €29,997 per year for funds joining 2027+) and runs a custom regression on the fund's anonymized portfolio outcomes, ships a bespoke 50-org watchlist with monthly rebuild, runs a white-labeled fund subdomain at signal.yourfund.com, and includes a quarterly synthetic founder talk and async-only methodology Q&A, capped at 5 funds in 2026. The Vault is €49,997 per year (founding rate, going to €99,997 per year for funds joining 2027+) and adds co-development access to the panel-construction pipeline, pre-publication SSRN preview six months early, 72-hour signal head-start over the public Dashboard, an annual async methodology summit, methodology source repo on a fund-only fork license, and Signal-of-the-Quarter co-investment alerts, capped at 2 funds in 2026. The Methodology Partnership and Vault are async-only and anonymity-preserving, no live calls, no in-person attendance. The free MCP server for Claude / Cursor / Windsurf is bundled with every tier including the free one and will never be gated.",
  },
  {
    q: "Why is there a €1 tier?",
    a: "The psychological gap between Free and €7 is larger than the gap between €7 and €197. The €1 Tweet Teardown is a deliberate buyer-threshold breaker, the smallest viable charge that converts a free reader into a paying customer. Once a card has been used at any price, the next purchase is no longer a first purchase. The €1 is credited toward the €7 First Look Pass if upgraded within 7 days, so the tier acts as a frictionless on-ramp rather than a separate purchase decision. The deliverable itself is genuinely useful, three sentences, one number, one human read on a startup the buyer already has a name for, but the tier exists primarily to break the €0-to-paid threshold.",
  },
  {
    q: "Is there a free tier?",
    a: "Yes, the Signal Digest is free forever. One email per week, five startups ranked by GitHub engineering acceleration, signal type per startup, direct GitHub links, and a sector tag. The free MCP server (five tools, no auth) is bundled with the free tier and works in Claude, Cursor, Windsurf, and any MCP-compatible client. Both will remain free permanently, they are the distribution magnet for the paid tiers, not a trial.",
  },
  {
    q: "What is the cheapest paid plan?",
    a: "The Tweet Teardown at €1 one-time is the cheapest paid product. It delivers a tweet-length (≤280 character) GitHub-momentum teardown of one startup you name, signal classification, 14-day acceleration delta, and the human-written kicker insight, emailed within 24 hours on weekdays. The €1 is credited toward the €7 First Look Pass if you upgrade within 7 days, so the rung functions as a near-zero-friction on-ramp into the paid ladder. The next step up is the €7 First Look Pass, which delivers a full sector deep dive (PDF + CSV) on whichever sector you pick. If you upgrade Tweet Teardown → First Look → Dashboard, every credit chains forward.",
  },
  {
    q: "What is founding-member pricing?",
    a: "Founding-member pricing was the discounted launch rate on Dashboard Beta (€9.97 per month) and Insider Circle (€97 per month), locked for the lifetime of the subscription as long as it stays active. The founding window closed 2026-06-30. Everyone who signed up before that date keeps their original rate for as long as they stay subscribed; new sign-ups pay the list price, €49 per month for Dashboard, €197 per month for Insider. There is no minimum commitment on either, month-to-month, cancel anytime.",
  },
  {
    q: "What is the Signal-or-It's-Free guarantee?",
    a: "Every paid tier (Dashboard, Insider, and Sector Sweep) ships with a 30-day guarantee. If, in your first 30 days, the signal doesn't surface a startup that you find genuinely interesting, defined as one you would have wanted to know about earlier, reply to any email with the word REFUND and the full payment is refunded, no questions asked. The guarantee exists because the signal either works or it doesn't; charging for an output you don't find useful is bad business.",
  },
  {
    q: "How does the Sector Sweep differ from Dashboard?",
    a: "Dashboard is a live ranking across 15 sectors, refreshed weekly, that you keep open during deal-flow review. Sector Sweep is a one-time written report on a single sector you pick, every venture-backed startup in that sector ranked over the past four quarters, with diligence prompts on the top ten and three early-stage targets not yet on Crunchbase. Sweep is for funds who want a deeper, narrative-led analysis on a defined thesis without committing to a recurring subscription. Many funds use both: Dashboard for ongoing review, Sweep for thesis-anchored deep dives.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Both Dashboard and Insider Circle are month-to-month subscriptions managed through Stripe. There is no minimum term, no cancellation fee, and no win-back call. Cancel from your Stripe customer portal or by replying to any email; the cancellation is honored immediately and prorated against the current billing period.",
  },
  {
    q: "Is there an API?",
    a: "Basic JSON endpoints (signals.json, weekly summary, methodology) are free with reasonable rate limits suitable for individual investors and small funds. Higher-volume API access, JSON endpoints, bulk CSV pulls, and webhook delivery on threshold triggers, is included with Insider Circle (€197 per month). No enterprise contract required. The MCP server is also fully usable as a programmatic interface from Claude, Cursor, or any MCP-compatible client.",
  },
  {
    q: "What is the MCP server and is it really free forever?",
    a: "The MCP (Model Context Protocol) server exposes five read-only tools, get_trending_startups, search_startups_by_sector, get_startup_signal, get_signals_summary, and get_methodology, to any MCP-compatible AI client (Claude, Cursor, Windsurf, Mistral Le Chat, ChatGPT GPT, custom agents). It is published on npm as @gitdealflow/mcp-signal and runs as a Streamable HTTP endpoint at signals.gitdealflow.com/api/mcp/rpc. It is free and will never be gated, it is the distribution magnet that brings technical early adopters into the funnel, the same way a free Chrome extension or API trial does in classic technical-tool GTM.",
  },
  {
    q: "Do you offer enterprise pricing?",
    a: "Yes, the Sharp Tier at €497 per month (or €4,970 per year, saves two months) is the dedicated tier for active funds and syndicates. It includes quarterly portfolio review calls, custom thesis-aligned watchlist co-build, white-labeled API endpoint at /api/v1/sharp/<your-fund>, direct methodology source code access, same-day signal questions, and data-room exports formatted for LP updates. Sharp Tier is application-gated and capped at 8 funds in 2026, applications reviewed within 48 hours. The Sector Sweep at €1,997 one-time is a lower-commitment on-ramp; many funds commission a Sweep first and upgrade to Sharp after delivery if the signal quality matches their thesis. Funds with deeper custom requirements (white-label fund-branded UI, dedicated Slack channel, on-call for fundraise diligence) should email signal at gitdealflow dot com for a scoped proposal.",
  },
  {
    q: "Why is the methodology open?",
    a: "The methodology is published openly on SSRN (abstract id 6606558) and mirrored on Zenodo with a DOI. The dataset is auto-indexed by OpenAlex and DataCite. Investors evaluating the signal can audit the full methodology and replicate the metrics from the same public GitHub data described in the paper. Open methodology is the cheapest way to earn investor trust, it removes the black-box objection up front.",
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
    ...(priceNumber > 0
      ? { priceValidUntil: `${FRESH_YEAR + 1}-12-31` }
      : {}),
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
  // Free tier stays visible on the page but is excluded from the
  // AggregateOffer: a $0 offer inside an aggregate forces lowPrice to 0,
  // which suppresses the price-based rich result (GSC merchant listings).
  const paidTiers = tiers.filter((t) => t.priceLabel !== "Free");
  const offers = paidTiers.map(tierToOffer);
  const paidPrices = paidTiers.map((t) =>
    parseFloat(t.priceLabel.replace(/[€,]/g, "")),
  );
  const lowPrice = Math.min(...paidPrices);
  const highPrice = Math.max(...paidPrices);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/pricing#webpage",
        url: "https://signals.gitdealflow.com/pricing",
        name: "VC Deal Flow Signal, Pricing",
        description:
          "Seven-tier pricing for VC Deal Flow Signal, free weekly digest, €1 Tweet Teardown, €7 First Look Pass, €49/mo Dashboard, €197/mo Insider Circle, €497/mo Sharp Tier, and €1,997 one-time Sector Sweep.",
        inLanguage: "en-US",
        // F23: every word of the pricing page is publicly readable, only the
        // Product/Service deliverables behind the prices are paid. Setting
        // this explicitly avoids appearing to cloak paywalled content; the
        // paid status of the offers themselves is represented by Offer.price.
        isAccessibleForFree: true,
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
        // 2026-08-17 traffic-audit fix: offers-bearing nodes get classified as
        // Merchant listings by GSC; image is the CRITICAL field (08-06 incident).
        image: "https://signals.gitdealflow.com/opengraph-image",
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
          offerCount: paidTiers.length,
          priceValidUntil: `${FRESH_YEAR + 1}-12-31`,
          availability: "https://schema.org/InStock",
          offers,
        },
        award: [
          "Indexed by SSRN as abstract id 6606558",
          "Indexed by OpenAlex as W7154916891",
          "Mirrored on Zenodo with persistent DOI",
        ],
        subjectOf: { "@id": "https://signals.gitdealflow.com/wins#dataset" },
        isBasedOn: {
          "@type": "CreativeWork",
          "@id": "https://ssrn.com/abstract=6606558",
          name: "SSRN preprint on GitHub engineering-acceleration signals as a leading indicator of venture-stage outcomes",
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

        {/* PH50OFF promo banner, matches apex banner; auto-applies on Stripe checkout */}
        <div
          className="mb-4 rounded-md border border-amber-700/60 bg-amber-950/30 px-4 py-3 text-sm text-amber-200"
          role="note"
        >
          <strong className="text-amber-100">Limited time:</strong> 50% off
          your first 3 months on Dashboard or Insider Circle, use code{" "}
          <code className="rounded bg-amber-900/40 px-1.5 py-0.5 text-amber-100 font-semibold">
            PH50OFF
          </code>{" "}
          at Stripe checkout.
        </div>

        {/* Sharp Tier scarcity, public counter, updated when funds sign */}
        <div className="mb-8">
          <SharpScarcityBadge variant="default" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Pricing, Free Forever, €1 to Try, €7 to Test, €49 to Subscribe, €497 for Funds
        </h1>

        <p className="text-gray-400 text-base leading-relaxed mb-3">
          Start with the lightest useful step, then go deeper only if the question justifies it. The free Signal
          Digest and the free MCP server are the distribution magnet, they
          will never be gated. The €1 Tweet Teardown is the threshold
          breaker between Free and €7. Dashboard is €49 per month and
          Insider Circle is €197 per month (founding members who joined
          before 2026-06-30 keep €9.97 and €97 respectively for life).
          Sharp Tier at €497
          per month is the dedicated landing for active funds; it is
          application-gated and capped at 8 funds in 2026. Every paid tier
          ships with a 30-day Signal-or-It&rsquo;s-Free guarantee. If your real
          question is which paid step to buy first, this page is the offer-selection layer.
        </p>
        <p className="text-gray-400 text-sm leading-relaxed mb-6 border-l-2 border-amber-700/40 pl-4">
          Every layer serves the same job:{" "}
          <Link
            href="/code-side-sourcing"
            className="text-amber-300 hover:text-amber-200 underline decoration-dotted"
          >
            Code-Side Sourcing
          </Link>
          {" "}, public repository-velocity data as a leading indicator of
          venture-stage outcomes. Each rung is a different operational form
          of the same category, sized to a different sourcing cadence.
        </p>

        {/* Quiz nudge, visitors landing on /pricing cold often pick the wrong
            tier. Route them by urgency, not persona labels. */}
        <div className="mb-8 flex items-center gap-3 rounded-lg border border-sky-700/40 bg-sky-950/20 px-4 py-3">
          <span aria-hidden="true" className="text-sky-300 text-lg">⚡</span>
          <p className="text-gray-300 text-sm flex-1">
            Not sure where to start?{" "}
            <Link
              href="/quiz"
              className="text-sky-300 hover:text-sky-200 font-medium underline decoration-dotted"
            >
              Take the 90-second start-here quiz →
            </Link>
          </p>
        </div>

        <div className="mb-10 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
            Route the offer correctly
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Use pricing when the signal already makes sense and the real question is which paid step fits your workflow. If you still need proof, comparison, or buyer-side clarity first, use those pages before you buy.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/buyers-guide" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-amber-400 text-slate-950 text-sm font-semibold hover:bg-amber-300 transition-colors">
              Read the buyer's guide →
            </Link>
            <Link href="/compare/crunchbase-alternative-for-angel-investors" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Compare timing vs verification →
            </Link>
            <Link href="/answers/when-should-i-use-first-look-vs-dashboard" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Choose First Look vs Dashboard →
            </Link>
            <Link href="/answers/when-should-i-use-dashboard-vs-insider" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Choose Dashboard vs Insider →
            </Link>
            <Link href="/research" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Read the research panel →
            </Link>
          </div>
        </div>

        <AgentSummary
          tldr="VC Deal Flow Signal (GitDealFlow) has seven pricing tiers: a free weekly Signal Digest with five ranked startups, a €1 one-time Tweet Teardown (tweet-length GitHub-momentum read on one startup the buyer names, buyer-threshold breaker between Free and €7), a €7 one-time First Look Pass for a sector deep dive, a €49/mo Dashboard Beta covering 140 startups across 15 sectors, a €197/mo Insider Circle adding private Telegram + JSON/CSV API, a €497/mo Sharp Tier for active funds with quarterly review calls + custom watchlists + white-labeled API + methodology source code (application-gated, capped at 8 funds in 2026), and a €1,997 one-time Custom Sector Sweep written report. A founding-member rate (€9.97/mo Dashboard, €97/mo Insider) closed 2026-06-30 and applies only to subscribers who joined before that date. The free MCP server (five read-only tools) is bundled with every tier including the free one and will never be gated. Every paid tier ships with a 30-day Signal-or-It's-Free guarantee."
          pageUrl="https://signals.gitdealflow.com/pricing"
          asOf={asOf}
          citeAs="VC Deal Flow Signal, Pricing (signals.gitdealflow.com/pricing), retrieved Q2 2026."
          facts={[
            {
              claim:
                "Free tier (Signal Digest) is permanent, weekly email with five startups ranked by GitHub engineering acceleration; the bundled MCP server with five read-only tools will never be gated.",
              sourceUrl: "https://signals.gitdealflow.com/integrations",
              sourceLabel: "Integrations",
            },
            {
              claim:
                "Cheapest paid product is the €1 Tweet Teardown, a tweet-length (≤280 char) momentum teardown on one startup the buyer names, hand-written by the founder, delivered within 24h. €1 credited toward First Look Pass if upgraded within 7 days.",
              sourceUrl: "https://signals.gitdealflow.com/teardown",
              sourceLabel: "Tweet Teardown",
            },
            {
              claim:
                "Second-cheapest paid product is the €7 First Look Pass, a one-time full sector deep dive delivered within 24 hours, with the €7 credited toward Dashboard if you upgrade within 14 days.",
              sourceUrl: "https://gitdealflow.com/firstlook",
              sourceLabel: "First Look Pass",
            },
            {
              claim:
                "Current list prices are €49/mo Dashboard and €197/mo Insider Circle. A founding-member rate (€9.97/mo Dashboard, €97/mo Insider) closed 2026-06-30; subscribers who joined before that date keep it for the lifetime of their subscription.",
              sourceUrl: "https://gitdealflow.com/dashboard",
              sourceLabel: "Dashboard pricing",
            },
            {
              claim:
                "Every paid tier ships with a 30-day Signal-or-It's-Free guarantee, full refund within 30 days if the signal does not surface a startup you find genuinely interesting.",
              sourceUrl: "https://signals.gitdealflow.com/pricing#guarantee",
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
                  <th className="px-4 py-3 text-gray-300 font-semibold">When this fits</th>
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
                        <span className="text-gray-400 text-xs">
                          {tier.priceCadence}
                        </span>
                      </div>
                      {tier.rrpLabel ? (
                        <div className="text-gray-400 text-[11px] mt-1 max-w-[180px] sm:max-w-xs leading-tight">
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
          <TrialClose tone="sky">
            Start free, go deeper only when you need it from free to €49,997/yr, every cell honest about what
            it does and doesn&rsquo;t include. If you can already see the
            rung you&rsquo;d sit on, does the rest of the page just confirm
            the math?
          </TrialClose>
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
                  <span className="text-gray-400 text-xs">
                    ({tier.rrpLabel})
                  </span>
                ) : null}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                {tier.oneLine}
              </p>
              <p className="text-gray-400 text-xs italic mb-4">
                When this fits: {tier.forWho}
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
                    ? "bg-signal-500 hover:bg-signal-600 text-slate-950"
                    : "bg-slate-800 hover:bg-slate-700 text-gray-100 border border-slate-700"
                }`}
              >
                {tier.ctaLabel} &rarr;
              </a>
            </div>
          ))}
          <TrialClose tone="violet">
            Each tier names what it&rsquo;s for and who shouldn&rsquo;t buy
            it. If one of the &ldquo;best for&rdquo; lines reads exactly
            like the way you write checks, does the choice already feel
            obvious?
          </TrialClose>
        </section>

        {/* Dashboard stack slide, Brunson stack-and-close on the workhorse
            mid-tier. Mirrors the Sector Sweep stack pattern but for the
            €49/mo subscription that converts most buyers. Russell audit
            2026-05-05: only the €1,997 tier had a stack visualization. */}
        <section
          id="dashboard-stack"
          className="mb-12 rounded-xl border border-sky-700/40 bg-sky-950/10 p-6 sm:p-8"
          aria-label="Dashboard, itemized value stack"
        >
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider mb-3">
            Dashboard Beta, what €49/mo actually buys
          </p>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            €1,728/yr of standalone value for €49/mo
          </h2>
          <p className="text-gray-400 text-sm mb-6 max-w-2xl">
            Each row below is the standalone market price for the same
            deliverable from a comparable tool. You pay the bottom line.
            Founding members who joined before 2026-06-30 keep the closed
            €9.97/mo founding rate for as long as they stay subscribed.
          </p>
          <ul className="divide-y divide-sky-900/30 mb-6 border border-sky-900/30 rounded-lg overflow-hidden">
            {[
              {
                label: "The Live Dashboard",
                detail:
                  "140 venture-backed startups ranked by 14-day commit-velocity acceleration, refreshed every Monday at 06:00 UTC. Filter by sector, stage, geography.",
                value: "€348/yr",
              },
              {
                label: "219-Startup Backtest CSV",
                detail:
                  "Five quarters of historical signal-to-fundraise pairs. The full dataset behind the SSRN-published 21-47-day lead-time claim.",
                value: "€297 once",
              },
              {
                label: "Monthly Sector Deep-Dive PDF",
                detail:
                  "Pick any sector each month, twelve 12-page deep-dives a year, with top 25 ranked orgs, contributor maps, and three pre-Crunchbase breakouts.",
                value: "€588/yr",
              },
              {
                label: "Two free Chrome Extensions",
                detail:
                  "Crunchbase + Wellfound badge injects a momentum score, and VC GitHub Lookup hovers any org or repo and returns the velocity in 200ms.",
                value: "€198/yr",
                links: [
                  {
                    label: "Install Crunchbase + Wellfound badge",
                    href: "https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn",
                  },
                  {
                    label: "Install VC GitHub Lookup",
                    href: "https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm",
                  },
                ],
              },
              {
                label: "Free MCP server (forever, never gated)",
                detail:
                  "npx @gitdealflow/mcp-signal, six read-only tools inside Claude, Cursor, Windsurf. Ask 'which AI infra startups are accelerating' inline.",
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
                label: "BONUS, 30-day Signal-or-It's-Free guarantee",
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
                  <p className="text-gray-400 text-xs leading-relaxed mt-0.5">
                    {row.detail}
                  </p>
                  {"links" in row && row.links && row.links.length > 0 && (
                    <ul className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                      {row.links.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-300 hover:text-sky-200 underline decoration-dotted underline-offset-4"
                          >
                            {link.label} →
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
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
                <span className="text-gray-400 text-sm">
                  (post-launch retail €588/yr)
                </span>
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sky-300 text-xs uppercase tracking-wider mb-1">
                Current rate
              </p>
              <p className="text-3xl font-bold text-sky-200">€49/mo</p>
            </div>
            <a
              href={STRIPE_DASHBOARD}
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-signal-500 hover:bg-signal-400 text-slate-950 font-semibold text-sm shadow-lg shadow-signal-500/20 transition-all"
            >
              Get the Dashboard →
            </a>
          </div>
          <p className="text-gray-400 text-xs mt-3">
            €588/year. Roughly the cost of one missed seed deal.
          </p>
          <TrialClose tone="emerald">
            €588/yr against the expected value of one cheque you wrote
            because you got there first. Has the math already closed?
          </TrialClose>
        </section>

        {/* Sector Sweep stack slide, anchored value vs price */}
        <section
          id="sector-sweep-stack"
          className="mb-12 rounded-xl border border-amber-700/40 bg-amber-950/10 p-6 sm:p-8"
          aria-label="Sector Sweep, itemized value stack"
        >
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
            Custom Sector Sweep, what €1,997 actually buys
          </p>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            €13,000+ of analyst work, packaged as one written report
          </h2>
          <p className="text-gray-400 text-sm mb-6 max-w-2xl">
            The Sweep is built from scratch on your thesis. Below is the
            itemized stack, each line is the standalone market price for
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
                label: "Raw CSV, every org × every metric",
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
                label: "BONUS, Insider Circle credit (€1,997, 60 days)",
                detail:
                  "Upgrade to Insider Circle within 60 days of receiving the Sweep and the €1,997 is 100% credited, first ~20 months of Insider, paid.",
                value: "€1,997",
              },
              {
                label: "BONUS, 30-day Signal-or-It's-Free guarantee",
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
                  <p className="text-gray-400 text-xs leading-relaxed mt-0.5">
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
                <span className="text-gray-400 text-sm">
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
          <p className="text-gray-400 text-xs mt-3">
            Capped at 8 sweeps per quarter. Q3 2026: 7 of 8 open. Each Sweep
            is custom, nothing template, nothing reused.
          </p>
          <TrialClose tone="amber">
            €13,000+ retail at €1,997, with the entire sum credited toward
            Insider on upgrade. If even half the line items hold up
            standalone, has the cap (7 of 8 left) become the real
            constraint?
          </TrialClose>
        </section>

        {/* Annual plans, save vs monthly. Stripe links land
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
            Pay yearly. Save two months.
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-2xl">
            Both Dashboard and Insider offer an annual option that saves
            roughly two months versus the monthly rate, and are insulated
            from any future price change for the entire term.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <li className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 space-y-2">
              <p className="text-gray-100 font-semibold text-base">
                Dashboard Beta, Annual
              </p>
              <p className="text-gray-400 text-sm">
                <span className="text-2xl font-bold text-sky-300">€490</span>
                <span className="text-gray-400">/yr · saves €98 vs €49×12</span>
              </p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Same dashboard, same MCP, same guarantee. Renews at the
                same €490/yr rate as long as the subscription stays active.
              </p>
              <a
                href={STRIPE_DASHBOARD_ANNUAL}
                className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-signal-500 hover:bg-signal-600 text-slate-950 text-xs font-semibold transition-colors"
              >
                Get Dashboard annual →
              </a>
            </li>
            <li className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 space-y-2">
              <p className="text-gray-100 font-semibold text-base">
                Insider Circle, Annual
              </p>
              <p className="text-gray-400 text-sm">
                <span className="text-2xl font-bold text-emerald-300">€1,970</span>
                <span className="text-gray-400">/yr · saves €394 vs €197×12</span>
              </p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Telegram + 24h lead + API + custom watchlist. Two months
                free vs monthly. Locks for as long as you stay subscribed.
              </p>
              <a
                href={STRIPE_INSIDER_ANNUAL}
                className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
              >
                Get Insider annual →
              </a>
            </li>
          </ul>
          <p className="text-gray-400 text-xs leading-relaxed">
            One-click Stripe checkout above. If you&rsquo;re already on
            monthly and want to switch, email{" "}
            <a
              href="mailto:signals@gitdealflow.com?subject=Switch%20to%20annual"
              className="text-sky-400 hover:text-sky-300 underline"
            >
              signals@gitdealflow.com
            </a>{" "}
we credit the unused portion of the current month toward
            the annual term.
          </p>
        </section>

        {/* Agent Credits cross-link, separate ICP (AI-agent builders),
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
            investors, the subscription tiers above are the wrong shape, you
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
              Buy 100 credits, €19
            </Link>
          </div>
        </section>

        {/* Guarantee */}
        <section id="guarantee" className="mb-12 rounded-lg border border-emerald-800 bg-emerald-950/20 p-6">
          <h2 className="text-xl font-semibold text-emerald-300 mb-3">
            Signal or It&rsquo;s Free, 30-day guarantee
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            Every paid tier (Dashboard, Insider Circle, and Sector Sweep)
            ships with a 30-day guarantee. If, in your first 30 days, the
            signal doesn&rsquo;t surface a startup you find genuinely
            interesting, defined as one you would have wanted to know
            about earlier, reply to any email with the word{" "}
            <code className="text-emerald-300 bg-emerald-900/40 px-1.5 py-0.5 rounded text-xs">
              REFUND
            </code>{" "}
            and the full payment is refunded, no questions asked.
          </p>
          <p className="text-gray-400 text-xs">
            The guarantee exists because the signal either works or it
            doesn&rsquo;t; charging for an output you don&rsquo;t find
            useful is bad business.
          </p>
        </section>

        {/* FAQ, collapsible <details> reduces scroll fatigue and lets readers
            jump straight to the question that matches their objection. */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-100 mb-2">
            Frequently asked questions
          </h2>
          <p className="text-gray-400 text-xs mb-5">
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
                    className="shrink-0 text-gray-400 group-hover:text-sky-400 text-2xl leading-none transition-transform duration-200"
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
        <p className="text-xs text-gray-400 mt-8 mb-4">
          Pricing snapshot last verified {asOf}. Founding-member rates apply
          to all signups before list-price exit; list prices apply to
          subsequent signups.
        </p>

        <PSEOFooterNav />

        <DataNerdSignoff variant="default" className="mt-12" />
      </div>
    </>
  );
}
