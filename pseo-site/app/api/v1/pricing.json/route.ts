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
    slug: "tweet-teardown",
    name: "Tweet Teardown",
    priceEur: 1,
    priceCadence: "one-time",
    priceLabel: "€1 one-time",
    listPriceEur: null,
    listPriceCadence: null,
    foundingMember: false,
    applicationGated: false,
    capacity: null,
    oneLine:
      "Pay €1 once, name one venture-backed startup, and within 24 hours get a tweet-length (≤280 char) teardown of its GitHub momentum — signal type, 14-day acceleration delta, and the kicker insight. Buyer-threshold breaker between Free and €7.",
    forWho:
      "Curious investors who want to feel the signal quality on a startup they already know before paying real money.",
    bullets: [
      "Tweet-length (≤280 char) teardown of one startup you name",
      "Signal classification + 14-day acceleration delta + kicker insight",
      "Hand-written by the founder, not LLM-generated",
      "Delivered within 24h on weekdays",
      "€1 credited toward First Look Pass if you upgrade within 7 days",
    ],
    ctaLabel: "Buy the Teardown",
    ctaHref: "https://signals.gitdealflow.com/teardown",
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
      "140 startups ranked across 20 sectors, refreshed weekly, with sector filters and historical period comparisons.",
    forWho:
      "Active investors and small funds who want the full ranking, not just the top five.",
    bullets: [
      "140 ranked startups across 20 sectors, refreshed weekly",
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
  // Brunson Audit 2026-05-08 — Value Ladder ding fix. The two rungs above
  // €1,997: a done-with-you Methodology Partnership and the top-rung Vault
  // (methodology source license + 72h signal head-start). Both async-only,
  // anonymity-preserving, application-gated.
  {
    slug: "methodology-partnership",
    name: "Methodology Partnership",
    priceEur: 14997,
    priceCadence: "yearly",
    priceLabel: "€14,997/yr",
    listPriceEur: 29997,
    listPriceCadence: "yearly",
    foundingMember: true,
    applicationGated: true,
    capacity: "5 funds in 2026",
    oneLine:
      "Done-with-you methodology engagement — custom panel construction trained on your fund's anonymized portfolio outcomes, bespoke 50-org watchlist with monthly rebuild, white-labeled fund subdomain, quarterly synthetic State-of-the-Engine talk, async-only methodology Q&A.",
    forWho:
      "Active VC funds with 5+ years of historical investment outcomes who want the regression trained on their portfolio — not the public 219-startup panel — and a fund-branded data feed integrated into their CRM.",
    bullets: [
      "Everything in Sharp Tier (€4,970/yr value)",
      "Custom panel construction — fund-specific regression on your anonymized portfolio outcomes",
      "Bespoke 50-org watchlist tuned to your written thesis, monthly rebuild",
      "White-labeled fund subdomain — signal.yourfund.com",
      "Quarterly synthetic State-of-the-Engine talk (4/yr) — 6-min Remotion video on your thesis",
      "Async methodology Q&A — unlimited dedicated email channel, 24h weekday turn",
      "Quarterly anonymized fund-as-case-study published to /press",
      "Annual fund-only methodology brief (synthetic-voice walkthrough + 40-page PDF)",
      "Founding-rate locked through end of 2027; capped at 5 funds in 2026",
    ],
    ctaLabel: "Apply for Methodology Partnership",
    ctaHref: "https://signals.gitdealflow.com/methodology-partnership",
    guarantee:
      "Async-only, no live calls. 30-day pro-rata refund window from contract start.",
    promoCode: null,
  },
  {
    slug: "vault",
    name: "The Vault",
    priceEur: 49997,
    priceCadence: "yearly",
    priceLabel: "€49,997/yr",
    listPriceEur: 99997,
    listPriceCadence: "yearly",
    foundingMember: true,
    applicationGated: true,
    capacity: "2 funds in 2026",
    oneLine:
      "Top rung. Methodology Partnership plus: co-development access to the panel-construction pipeline, pre-publication SSRN preview six months early, 72-hour signal head-start over the public Dashboard, methodology source repo (fund-only fork license), Signal-of-the-Quarter co-investment alerts.",
    forWho:
      "Funds intending to make GitHub-momentum signal a multi-year sourcing advantage — funds who want to own the methodology, not license the output. Most Vault funds enter via Methodology Partnership for 6–12 months first.",
    bullets: [
      "Everything in Methodology Partnership (€68,000+ stack value)",
      "Co-development access to the panel-construction pipeline (~24 senior-engineering hours/mo equivalent)",
      "Pre-publication SSRN preview — read next year's successor paper 6 months before public release",
      "72-hour signal head-start — every flag delivered to Vault funds 72h before public Dashboard (~12 flags/yr)",
      "Annual async methodology summit — 8-hour Remotion-rendered keynote + fund-branded artifacts",
      "Methodology source repo — private fork, MIT-license to your fund only",
      "Signal-of-the-Quarter co-investment alerts (4/yr deep written analyses)",
      "Founding-rate locked through end of 2028; capped at 2 funds in 2026",
    ],
    ctaLabel: "Apply for the Vault",
    ctaHref: "https://signals.gitdealflow.com/vault",
    guarantee:
      "Async-only, no live attendance. 30-day pro-rata refund window from contract start.",
    promoCode: null,
  },
];

export async function GET() {
  const lastModified = getDataLastModified();

  const body = {
    version: "1.1.0",
    name: "VC Deal Flow Signal — Pricing",
    description:
      "Machine-readable pricing for VC Deal Flow Signal (GitDealFlow). Nine published priced tiers plus the free Signal Digest (Tweet Teardown €1, First Look Pass €7, Dashboard Beta €9.97/mo, Insider Circle €97/mo, Sharp Tier €4,970/yr, Sector Sweep €1,997 one-time, Methodology Partnership €14,997/yr, Vault €49,997/yr) with founding-member rates, application-gated Sharp Tier / Methodology Partnership / Vault, and a 30-day Signal-or-It's-Free guarantee on every paid plan above €1. The high-ticket research-partnership rungs (Methodology Partnership and Vault) are async-only and anonymity-preserving — no live calls, no in-person attendance. Designed for AI agents, MCP clients, and procurement automations that need pricing in JSON form.",
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
      excludes: ["tweet-teardown", "first-look-pass"],
      excludesReason:
        "€1 Tweet Teardown and €7 First Look Pass are one-time micro-deliverables — refund window is 24h after delivery, not 30 days. Tweet Teardown auto-refunds if no public GitHub data is available for the named org.",
    },
    upgradeCredits: {
      "tweet-teardown": {
        creditsToward: ["first-look-pass"],
        amountEur: 1,
        windowDays: 7,
        note: "€1 credited toward First Look Pass if upgraded within 7 days. Reply REQUEST CREDIT to delivery email; founder applies manually.",
      },
      "first-look-pass": {
        creditsToward: ["dashboard-beta"],
        amountEur: 7,
        windowDays: 14,
        note: "€7 credited toward first month of Dashboard Beta if upgraded within 14 days. Credits chain — Tweet Teardown → First Look → Dashboard.",
      },
      "sector-sweep": {
        creditsToward: ["insider-circle"],
        amountEur: 1997,
        windowDays: 60,
        note: "€1,997 credited toward Insider Circle if upgraded within 60 days — first ~20 months of Insider, paid.",
      },
      "methodology-partnership": {
        creditsToward: ["vault"],
        amountEur: 14997,
        windowDays: 365,
        note: "Methodology Partnership rate credited 1:1 (pro-rata) toward Vault rate on upgrade during the 12-month engagement.",
      },
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
