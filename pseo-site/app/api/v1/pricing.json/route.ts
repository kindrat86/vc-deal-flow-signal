import { getDataLastModified } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE = "https://signals.gitdealflow.com";

interface AnnualOption {
  priceEur: number;
  priceLabel: string;
  ctaHref: string;
}

interface PricingTier {
  slug: string;
  name: string;
  priceEur: number;
  priceCadence: "free" | "one-time" | "monthly";
  priceLabel: string;
  annual?: AnnualOption;
  oneLine: string;
  forWho: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string | null;
}

// Public facts here are constrained by docs/conversion-offer-contract.md.
const tiers: PricingTier[] = [
  {
    slug: "signal-digest",
    name: "Sunday Signal Digest",
    priceEur: 0,
    priceCadence: "free",
    priceLabel: "€0",
    oneLine: "Five accelerating startups every Sunday.",
    forWho: "People who want a weekly public-GitHub signal shortlist.",
    bullets: ["Weekly email", "Five accelerating startups"],
    ctaLabel: "Get the free digest",
    ctaHref: "https://gitdealflow.com/#signup",
  },
  {
    slug: "tweet-teardown",
    name: "Tweet Teardown",
    priceEur: 1,
    priceCadence: "one-time",
    priceLabel: "€1 one-time",
    oneLine: "Short, actionable public-GitHub signal verdict.",
    forWho: "People who want to test the signal on one startup.",
    bullets: ["One public-GitHub signal verdict"],
    ctaLabel: "Get the teardown",
    ctaHref: "https://buy.stripe.com/bJe5kC48H2d2cEKg6s0x209",
  },
  {
    slug: "first-look-pass",
    name: "First Look Pass",
    priceEur: 7,
    priceCadence: "one-time",
    priceLabel: "€7 one-time",
    oneLine: "One sector deep dive and ranked shortlist within 24 hours.",
    forWho: "People who want to inspect one sector before subscribing.",
    bullets: [
      "One sector deep dive",
      "Ranked shortlist",
      "14-day Dashboard upgrade-credit window",
    ],
    ctaLabel: "Get the First Look Pass",
    ctaHref: "https://signals.gitdealflow.com/api/checkout/session?tier=firstlook",
  },
  {
    slug: "dashboard",
    name: "GitDealFlow Dashboard",
    priceEur: 49,
    priceCadence: "monthly",
    priceLabel: "€49/mo",
    annual: {
      priceEur: 490,
      priceLabel: "€490/yr",
      ctaHref: "https://buy.stripe.com/aFa5kC34DeZOawC6vS0x20c",
    },
    oneLine: "Full ranked field across 15 sectors, refreshed weekly.",
    forWho: "People who want the full ranked field rather than the free shortlist.",
    bullets: ["Full ranked field across 15 sectors", "Weekly refresh"],
    ctaLabel: "Start Dashboard",
    ctaHref: "https://buy.stripe.com/4gMbJ07kTaJy7kqg6s0x20b",
  },
  {
    slug: "insider-circle",
    name: "GitDealFlow Insider Circle",
    priceEur: 197,
    priceCadence: "monthly",
    priceLabel: "€197/mo",
    annual: {
      priceEur: 1970,
      priceLabel: "€1,970/yr",
      ctaHref: "https://buy.stripe.com/cNieVc34DbNCcEK2fC0x20e",
    },
    oneLine: "Dashboard plus the documented Insider delivery calendar and briefing artifact.",
    forWho: "People who want the documented Insider briefing layer alongside Dashboard.",
    bullets: ["Dashboard", "Documented Insider delivery calendar", "Briefing artifact"],
    ctaLabel: "Join Insider Circle",
    ctaHref: "https://buy.stripe.com/bJeaEWfRpcRG6gm2fC0x20d",
  },
  {
    slug: "sector-sweep",
    name: "Custom Sector Sweep",
    priceEur: 1997,
    priceCadence: "one-time",
    priceLabel: "€1,997 one-time after review",
    oneLine: "Custom thesis-driven sector report.",
    forWho: "People who need a custom sector report.",
    bullets: ["Custom thesis-driven sector report"],
    ctaLabel: "Available after review",
    ctaHref: null,
  },
  {
    slug: "agent-credits",
    name: "Deep-signal credits",
    priceEur: 19,
    priceCadence: "one-time",
    priceLabel: "€19 one-time",
    oneLine: "100 deep-signal calls.",
    forWho: "Agents and builders who need deep-signal calls.",
    bullets: ["100 deep-signal calls"],
    ctaLabel: "Buy deep-signal credits",
    ctaHref: "https://buy.stripe.com/00w4gyfRpg3SbAGcUg0x205",
  },
];

export async function GET() {
  const lastModified = getDataLastModified();

  const body = {
    version: "1.3.0",
    name: "GitDealFlow pricing",
    description:
      "Machine-readable public pricing for GitDealFlow. This endpoint only includes offer facts verified in docs/conversion-offer-contract.md.",
    site: SITE,
    canonicalHumanPage: `${SITE}/pricing`,
    currency: "EUR",
    tiers,
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
