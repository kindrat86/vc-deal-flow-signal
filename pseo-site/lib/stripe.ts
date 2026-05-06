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

// Map Stripe price amounts (in cents) to internal tier names
const TIER_BY_AMOUNT: Record<number, TierKey> = {
  100: "teardown", // EUR 1.00 one-time — Tweet Teardown micro-tripwire / €0→€7 bridge (Brunson DCS Ch 18)
  99: "book", // EUR 0.99 one-time — The 7 GitHub Signals book (Brunson Secret 17)
  700: "firstlook", // EUR 7.00 one-time
  997: "dashboard", // EUR 9.97/mo
  1900: "agent_credits_100", // EUR 19 one-time, 100 deep-signal calls
  9700: "insider", // EUR 97.00/mo
  199700: "sector_sweep", // EUR 1,997 one-time (Russell audit 2026-05-02)
};

// Pack sizes for credit-based tiers (consumed by webhook handler).
export const CREDIT_PACK_SIZES: Record<Extract<TierKey, `agent_credits_${string}`>, number> = {
  agent_credits_100: 100,
};

export function getTierFromSession(session: Stripe.Checkout.Session): TierKey {
  const lineItems = session.line_items?.data ?? [];
  for (const item of lineItems) {
    const amount = item.price?.unit_amount ?? 0;
    if (TIER_BY_AMOUNT[amount]) return TIER_BY_AMOUNT[amount];
  }
  // Default to dashboard if we can't determine
  return "dashboard";
}
