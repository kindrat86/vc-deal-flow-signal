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
const TIER_BY_AMOUNT: Record<number, "dashboard" | "insider" | "payg"> = {
  997: "dashboard", // EUR 9.97 (legacy beta)
  9700: "insider", // EUR 97.00 (legacy)
  2900: "insider", // EUR 29.00 (current)
  1900: "payg", // EUR 19.00 PAYG top-up
  10000: "payg", // EUR 100.00 PAYG top-up
};

export type Plan = "payg-19" | "payg-100" | "insider";

export const PLAN_CONFIG: Record<
  Plan,
  { priceEnv: string; mode: "payment" | "subscription"; label: string }
> = {
  "payg-19": {
    priceEnv: "STRIPE_PRICE_PAYG_19",
    mode: "payment",
    label: "Pay-as-you-go €19 top-up",
  },
  "payg-100": {
    priceEnv: "STRIPE_PRICE_PAYG_100",
    mode: "payment",
    label: "Pay-as-you-go €100 top-up",
  },
  insider: {
    priceEnv: "STRIPE_PRICE_INSIDER_29",
    mode: "subscription",
    label: "Insider Circle €29/mo",
  },
};

export function isValidPlan(value: string): value is Plan {
  return value in PLAN_CONFIG;
}

export function getTierFromSession(
  session: Stripe.Checkout.Session
): "dashboard" | "insider" | "payg" {
  const planMeta = session.metadata?.gdf_plan;
  if (planMeta && isValidPlan(planMeta)) {
    return planMeta.startsWith("payg-") ? "payg" : "insider";
  }
  const lineItems = session.line_items?.data ?? [];
  for (const item of lineItems) {
    const amount = item.price?.unit_amount ?? 0;
    if (TIER_BY_AMOUNT[amount]) return TIER_BY_AMOUNT[amount];
  }
  return "dashboard";
}

const BALANCE_KEY = "gdf_balance_cents";

export async function getCustomerBalanceCents(customerId: string): Promise<number> {
  const customer = await stripe.customers.retrieve(customerId);
  if (!customer || (customer as Stripe.DeletedCustomer).deleted) return 0;
  const meta = (customer as Stripe.Customer).metadata ?? {};
  return parseInt(meta[BALANCE_KEY] ?? "0", 10) || 0;
}

export async function incrementCustomerBalanceCents(
  customerId: string,
  cents: number
): Promise<number> {
  const current = await getCustomerBalanceCents(customerId);
  const next = current + cents;
  await stripe.customers.update(customerId, {
    metadata: { [BALANCE_KEY]: String(next) },
  });
  return next;
}

export async function decrementCustomerBalanceCents(
  customerId: string,
  cents: number
): Promise<{ ok: boolean; balance: number }> {
  const current = await getCustomerBalanceCents(customerId);
  if (current < cents) return { ok: false, balance: current };
  const next = current - cents;
  await stripe.customers.update(customerId, {
    metadata: { [BALANCE_KEY]: String(next) },
  });
  return { ok: true, balance: next };
}

export async function resolveTierForCustomer(
  customerId: string
): Promise<"dashboard" | "insider" | "payg"> {
  const subs = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
    limit: 1,
  });
  if (subs.data.length > 0) return "insider";
  const balance = await getCustomerBalanceCents(customerId);
  if (balance > 0) return "payg";
  return "dashboard";
}
