import "server-only";
import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    _stripe = new Stripe(stripeKey);
  }
  return _stripe;
}

// Re-export as a getter for convenience
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Map Stripe price amounts (in cents) to internal tier names
const TIER_BY_AMOUNT: Record<number, "dashboard" | "insider"> = {
  997: "dashboard", // EUR 9.97
  9700: "insider", // EUR 97.00
};

export function getTierFromSession(session: Stripe.Checkout.Session): "dashboard" | "insider" {
  const lineItems = session.line_items?.data ?? [];
  for (const item of lineItems) {
    const amount = item.price?.unit_amount ?? 0;
    if (TIER_BY_AMOUNT[amount]) return TIER_BY_AMOUNT[amount];
  }
  // Default to dashboard if we can't determine
  return "dashboard";
}
