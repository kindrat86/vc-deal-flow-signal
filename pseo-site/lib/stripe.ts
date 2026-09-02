import "server-only";
import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    // `vercel env pull` historically writes \n inside quoted values which
    // dotenv parses as a real trailing newline. Stripe rejects keys with
    // trailing whitespace as "Invalid API Key provided". Trim defensively.
    _stripe = new Stripe(stripeKey.trim());
  }
  return _stripe;
}

// Re-export as a getter for convenience
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export type TierKey =
  | "teardown"
  | "book"
  | "firstlook"
  | "dashboard"
  | "insider"
  | "sector_sweep"
  | "agent_credits_100";

// Checkout events are account-wide: every webhook endpoint in the shared
// Stripe account receives every completed checkout. Ownership must therefore
// be established before price/amount data can participate in fulfillment.
//
// Static Payment Links are allowlisted by their immutable Stripe IDs. Dynamic
// checkouts created by /api/checkout/session carry one of the trusted `flow`
// markers below and a server-generated tier value.
const TIER_BY_PAYMENT_LINK: Record<string, TierKey> = {
  plink_1TTNNgCwGoUDklRemY4MIWkM: "agent_credits_100",
  plink_1TQV5KCwGoUDklRe9OEWwFlO: "firstlook",
  plink_1TLpQOCwGoUDklReLVnZDwDl: "dashboard",
  plink_1TLqrLCwGoUDklRedQvsJlpS: "insider",
  plink_1ToVseCwGoUDklReawit1CDX: "dashboard",
  plink_1TTlOfCwGoUDklReJ1Q1q6dJ: "insider",
  plink_1TTlOcCwGoUDklReKTHw91yA: "dashboard",
  plink_1ToVshCwGoUDklReWfgi9LG7: "dashboard",
  plink_1TSe7ZCwGoUDklReyJHCM2GA: "sector_sweep",
  plink_1TU4ZvCwGoUDklReEjuprkH0: "teardown",
  plink_1ToVskCwGoUDklReJCeO3cly: "insider",
  plink_1TU0E4CwGoUDklReSOEB8JYz: "book",
  plink_1ToVsnCwGoUDklReXTm28msm: "insider",
  plink_1TLpSHCwGoUDklRe61h1bhej: "dashboard",
  plink_1TUuyICwGoUDklReGFxnGn9Q: "book",
  plink_1TvEpvCwGoUDklReCvmq6XRn: "dashboard",
};

const TRUSTED_ENTRY_FLOWS = new Set(["entry_checkout", "entry_checkout_get"]);

const TIER_BY_METADATA: Record<string, TierKey> = {
  teardown: "teardown",
  book: "book",
  book_pack: "book",
  firstlook: "firstlook",
  dashboard: "dashboard",
  dashboard_49: "dashboard",
  dashboard_annual: "dashboard",
  dashboard_annual_490: "dashboard",
  insider: "insider",
  insider_197: "insider",
  insider_annual: "insider",
  insider_annual_1970: "insider",
  sector_sweep: "sector_sweep",
  agent_credits_100: "agent_credits_100",
};

// Legacy amount mapping is used only after a trusted dynamic checkout flow has
// established ownership. It is intentionally never consulted for an
// unrecognized or foreign Payment Link.
const TIER_BY_AMOUNT: Record<number, TierKey> = {
  100: "teardown",
  99: "book",
  700: "firstlook",
  997: "dashboard",
  1900: "agent_credits_100",
  9700: "insider",
  199700: "sector_sweep",
};

// Pack sizes for credit-based tiers (consumed by webhook handler).
export const CREDIT_PACK_SIZES: Record<Extract<TierKey, `agent_credits_${string}`>, number> = {
  agent_credits_100: 100,
};

export function getTierFromSession(session: Stripe.Checkout.Session): TierKey | null {
  const paymentLink =
    typeof session.payment_link === "string"
      ? session.payment_link
      : session.payment_link?.id ?? null;

  // A Checkout Session attached to a Payment Link must match the explicit
  // GitDealFlow allowlist. Do not let metadata or a coincidental amount turn a
  // different portfolio product into a GitDealFlow fulfillment.
  if (paymentLink) {
    return TIER_BY_PAYMENT_LINK[paymentLink] ?? null;
  }

  const metadata = session.metadata ?? {};
  if (!TRUSTED_ENTRY_FLOWS.has(metadata.flow ?? "")) return null;

  const metadataTier = TIER_BY_METADATA[metadata.tier ?? ""];
  if (metadataTier) return metadataTier;

  // Preserve classification for legacy GitDealFlow-created sessions whose
  // trusted flow marker predates the current metadata tier vocabulary.
  const lineItems = session.line_items?.data ?? [];
  for (const item of lineItems) {
    const amount = item.price?.unit_amount ?? 0;
    if (TIER_BY_AMOUNT[amount]) return TIER_BY_AMOUNT[amount];
  }

  return null;
}
