import { getDataLastModified } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 3600;

const SITE = "https://signals.gitdealflow.com";

interface PricingTier {
  slug: string;
  name: string;
  priceEur: number | null;
  priceCadence:
    | "free"
    | "one-time"
    | "monthly"
    | "yearly"
    | "monthly-or-yearly";
  priceLabel: string;
  listPriceEur: number | null;
  listPriceCadence: PricingTier["priceCadence"] | null;
  foundingMember: boolean;
  applicationGated: boolean;
  capacity: string | null;
  oneLine: string;
  forWho: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  guarantee: string | null;
  promoCode: string | null;
}

const tiers: PricingTier[] = [
  {
    slug: "signal-digest",
    name: "Signal Digest",
    priceEur: 0,
    priceCadence: "free",
    priceLabel: "Free forever",
    listPriceEur: null,
    listPriceCadence: null,
    foundingMember: false,
    applicationGated: false,
    capacity: null,
    oneLine:
      "Five breakout startups in your inbox every Monday — the same data the paid tiers see, narrowed to the top five.",
    forWho:
      "Angel investors and developers who want one shortlist a week without paying.",
    bullets: [
      "Weekly email — five startups ranked by engineering acceleration",
      "Signal type per startup (hiring burst, infra buildout, shipping sprint)",
      "Direct GitHub link + sector tag",
      "Free MCP server for Claude / Cursor / Windsurf — five tools, never gated",
    ],
    ctaLabel: "Get the Free Digest",
    ctaHref: "https://gitdealflow.com/#signup",
    guarantee: null,
    promoCode: null,
  },
  {
    slug: "first-look-pass",
    name: "First Look Pass",
    priceEur: 7,
    priceCadence: "one-time",
    priceLabel: "€7 one-time",
    listPriceEur: 19,
    listPriceCadence: "one-time",
    foundingMember: false,
    applicationGated: false,
    capacity: null,
    oneLine:
      "Pay €7 once and get a Sector Deep Dive on the sector you pick — full GitHub momentum table, 14-day acceleration deltas, and the top three names not yet on Crunchbase.",
    forWho:
      "Investors who want to test the data on one specific sector before committing to a subscription.",
    bullets: [
      "Full GitHub momentum table for one sector of your choice",
      "14-day commit velocity deltas with two-period confirmation",
      "Top three breakout names not yet on Crunchbase",
      "Delivered to inbox within 24 hours",
      "€7 credited toward Dashboard if you upgrade within 14 days",
    ],
    ctaLabel: "Get the Pass",
    ctaHref: "https://gitdealflow.com/#firstlook",
    guarantee: null,
    promoCode: null,
  },
  {
    slug: "dashboard-beta",
    name: "Dashboard Beta",
    priceEur: 9.97,
    priceCadence: "monthly",
    priceLabel: "€9.97/mo",
    listPriceEur: 49,
    listPriceCadence: "monthly",
    foundingMember: true,
    applicationGated: false,
    capacity: null,
    oneLine:
      "109 startups ranked across 19 sectors, refreshed weekly, with sector filters and historical period comparisons.",
    forWho:
      "Active investors and small funds who want the full ranking, not just the top five.",
    bullets: [
      "109 ranked startups across 19 sectors, refreshed weekly",
      "Sector filters with five-quarter historical comparison",
      "All four signal types (hiring burst, shipping sprint, infrastructure buildout, platform migration)",
      "Watchlists and saved filters",
      "Free Chrome extensions — Crunchbase + Wellfound badge and GitHub-native hover lookup",
    ],
    ctaLabel: "Lock In Founding Price",
    ctaHref: "https://buy.stripe.com/28E7sK48H04U8ou07u0x200",
    guarantee: "30-day Signal-or-It's-Free — full refund within 30 days",
    promoCode: "PH50OFF",
  },
  {
    slug: "insider-circle",
    name: "Insider Circle",
    priceEur: 97,
    priceCadence: "monthly",
    priceLabel: "€97/mo",
    listPriceEur: 197,
    listPriceCadence: "monthly",
    foundingMember: true,
    applicationGated: false,
    capacity: null,
    oneLine:
      "Private Telegram group, live briefings, custom watchlists, JSON API, and bulk CSV pulls.",
    forWho:
      "Active investors syndicating six or more deals per year, plus small funds running structured deal-flow pipelines.",
    bullets: [
      "Everything in Dashboard Beta",
      "Private Insider Circle Telegram group with live briefings",
      "Custom watchlists co-built around your investment thesis",
      "JSON API + bulk CSV pulls (€1,200/yr value)",
      "Webhook delivery on threshold triggers",
      "Direct line to the founder for diligence questions",
    ],
    ctaLabel: "Join the Insider Circle",
    ctaHref: "https://buy.stripe.com/4gM00ifRpcRG2069I40x202",
    guarantee: "30-day Signal-or-It's-Free — full refund within 30 days",
    promoCode: "PH50OFF",
  },
  {
    slug: "sharp-tier",
    name: "Sharp Tier",
    priceEur: 497,
    priceCadence: "monthly-or-yearly",
    priceLabel: "€497/mo or €4,970/yr (saves two months)",
    listPriceEur: null,
    listPriceCadence: null,
    foundingMember: false,
    applicationGated: true,
    capacity: "8 funds in 2026",
    oneLine:
      "Everything in Insider Circle plus quarterly portfolio review call, custom thesis-aligned watchlist, white-labeled API endpoint, and methodology source-code access.",
    forWho:
      "Active VC funds and syndicates deploying €5M+/yr who want a tooling partner, not just a data subscription.",
    bullets: [
      "Everything in Insider Circle",
      "Quarterly 60-minute portfolio review call",
      "Custom thesis-aligned watchlist (co-built)",
      "White-labeled API endpoint and data feed at /api/v1/sharp/<your-fund>",
      "Same-day signal questions answered (typically <4h)",
      "Data-room exports formatted for LP updates",
      "All future paid MCP tools included, no per-tool upcharge",
      "Direct access to the methodology source code (private repo invite)",
      "Capped at 8 funds in 2026 — applications reviewed within 48h",
    ],
    ctaLabel: "Apply for Sharp Tier",
    ctaHref:
      "mailto:signal@gitdealflow.com?subject=Sharp%20Tier%20Application%20%E2%80%94%20%5BYour%20Fund%5D",
    guarantee: "30-day Signal-or-It's-Free — full refund within 30 days",
    promoCode: null,
  },
  {
    slug: "sector-sweep",
    name: "Custom Sector Sweep",
    priceEur: 1997,
    priceCadence: "one-time",
    priceLabel: "€1,997 one-time",
    listPriceEur: null,
    listPriceCadence: null,
    foundingMember: false,
    applicationGated: false,
    capacity: null,
    oneLine:
      "A custom written report on one sector — engineering momentum across every venture-backed startup in that sector, ranked, with diligence prompts and three early-stage targets.",
    forWho:
      "Funds investing seven-figure cheques into a defined sector who want a one-off, deeper-than-Dashboard analysis without a yearly contract.",
    bullets: [
      "Full sector audit — every venture-backed startup in the sector you pick",
      "Engineering acceleration ranked over the past four quarters",
      "Diligence prompts for each top-ten startup",
      "Three early-stage targets not yet on Crunchbase or PitchBook",
      "Delivered as written report within 7 business days",
      "One 30-minute clarifications call after delivery",
    ],
    ctaLabel: "Commission a Sector Sweep",
    ctaHref: "https://buy.stripe.com/bJe14m34DbNC6gm1by0x204",
    guarantee: "30-day Signal-or-It's-Free — full refund within 30 days",
    promoCode: null,
  },
];

export async function GET() {
  const lastModified = getDataLastModified();

  const body = {
    version: "1.0.0",
    name: "VC Deal Flow Signal — Pricing",
    description:
      "Machine-readable pricing for VC Deal Flow Signal (GitDealFlow). Six published tiers with founding-member rates, application-gated Sharp Tier, and a 30-day Signal-or-It's-Free guarantee on every paid plan. Designed for AI agents, MCP clients, and procurement automations that need pricing in JSON form.",
    site: SITE,
    canonicalHumanPage: `${SITE}/pricing`,
    license: {
      identifier: "CC-BY-4.0",
      url: "https://creativecommons.org/licenses/by/4.0/",
      attribution:
        "VC Deal Flow Signal (GitDealFlow), https://signals.gitdealflow.com",
    },
    citation:
      "VC Deal Flow Signal — Pricing (signals.gitdealflow.com/pricing), retrieved Q2 2026.",
    contact: {
      email: "signal@gitdealflow.com",
      preferredFormat: "email-only",
    },
    currency: "EUR",
    promoCode: {
      code: "PH50OFF",
      effect: "50% off first 3 months",
      appliesTo: ["dashboard-beta", "insider-circle"],
      stacksWithFoundingMember: true,
    },
    guarantee: {
      window: "30 days",
      label: "Signal-or-It's-Free",
      mechanism:
        "Reply REFUND to any email within first 30 days for full refund, no questions asked.",
      appliesTo: [
        "dashboard-beta",
        "insider-circle",
        "sharp-tier",
        "sector-sweep",
      ],
    },
    foundingMemberPolicy: {
      tiers: ["dashboard-beta", "insider-circle"],
      effect:
        "Founding-member rate locks in for the lifetime of the subscription as long as the subscription stays active.",
      sunsets: "On exit-from-beta date (TBA); list price applies to new sign-ups.",
    },
    cancellationPolicy: {
      monthToMonth: true,
      cancellationFee: 0,
      portal: "Stripe customer portal or reply to any email",
      proration: "Prorated against current billing period",
    },
    enterprise: {
      tier: "sharp-tier",
      applicationUrl:
        "mailto:signal@gitdealflow.com?subject=Sharp%20Tier%20Application%20%E2%80%94%20%5BYour%20Fund%5D",
      capacityRemaining: "8 funds capped in 2026; applications reviewed within 48h",
      humanPage: `${SITE}/enterprise`,
    },
    tiers,
    relatedDocs: {
      humanPricingPage: `${SITE}/pricing`,
      buyersGuide: `${SITE}/buyers-guide`,
      enterprisePage: `${SITE}/enterprise`,
      methodology: `${SITE}/methodology`,
      llmsIndex: `${SITE}/llms.txt`,
      llmsFull: `${SITE}/llms-full.txt`,
    },
    lastModified: lastModified.toISOString(),
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "index, follow",
      "Last-Modified": lastModified.toUTCString(),
    },
  });
}
