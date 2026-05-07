import "server-only";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

export type EntryTierKey = "firstlook";

export type OtoKey =
  | "sector_sweep_oto1"
  | "insider_oto2";

export type EntryTierConfig = {
  productName: string;
  unitAmount: number;
  currency: "eur";
  successUrl: string;
  cancelUrl: string;
  description?: string;
};

export type OtoConfig =
  | {
      kind: "one_time";
      productName: string;
      unitAmount: number;
      currency: "eur";
      description: string;
      welcomeSubject: string;
    }
  | {
      kind: "subscription";
      productName: string;
      unitAmount: number;
      currency: "eur";
      interval: "month" | "year";
      description: string;
      lookupKey: string;
      firstInvoiceCouponAmountOff?: number;
      firstInvoiceCouponLookupKey?: string;
      welcomeSubject: string;
    };

export const ENTRY_TIERS: Record<EntryTierKey, EntryTierConfig> = {
  firstlook: {
    productName: "First Look Pass",
    unitAmount: 700,
    currency: "eur",
    successUrl: "/firstlook/thanks?session_id={CHECKOUT_SESSION_ID}",
    cancelUrl: "/firstlook?cancelled=1",
    description:
      "One-sector engineering-acceleration deep dive. PDF + raw CSV + JSON dump within 24h.",
  },
};

export const OTO_TIERS: Record<OtoKey, OtoConfig> = {
  sector_sweep_oto1: {
    kind: "one_time",
    productName: "Sector Sweep — First Look bump",
    unitAmount: 179700,
    currency: "eur",
    description:
      "Full venture-backed panel for one sector, three time windows, 60-minute walkthrough call. Standalone €1,997 — €200 off when added to a First Look Pass.",
    welcomeSubject: "Custom Sector Sweep — your thesis intake form",
  },
  insider_oto2: {
    kind: "subscription",
    productName: "Insider Circle",
    unitAmount: 9700,
    currency: "eur",
    interval: "month",
    lookupKey: "insider_monthly_v1",
    firstInvoiceCouponAmountOff: 2000,
    firstInvoiceCouponLookupKey: "insider_firstlook_oto_first_month_off_v1",
    description:
      "Private investor Telegram, monthly briefing call, custom watchlists, API access, direct line to me. €97/mo — €20 off the first month from this offer only.",
    welcomeSubject: "Welcome to the Insider Circle",
  },
};

const _priceCache = new Map<string, Stripe.Price>();
const _couponCache = new Map<string, Stripe.Coupon>();

export async function getOrCreateRecurringPrice(opts: {
  lookupKey: string;
  productName: string;
  unitAmount: number;
  currency: "eur";
  interval: "month" | "year";
}): Promise<Stripe.Price> {
  const cached = _priceCache.get(opts.lookupKey);
  if (cached) return cached;

  const existing = await stripe.prices.list({
    lookup_keys: [opts.lookupKey],
    expand: ["data.product"],
    limit: 1,
  });
  if (existing.data[0]) {
    _priceCache.set(opts.lookupKey, existing.data[0]);
    return existing.data[0];
  }

  const product = await stripe.products.create({ name: opts.productName });
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: opts.unitAmount,
    currency: opts.currency,
    lookup_key: opts.lookupKey,
    recurring: { interval: opts.interval },
  });
  _priceCache.set(opts.lookupKey, price);
  return price;
}

export async function getOrCreateOnceCoupon(opts: {
  lookupKey: string;
  amountOff: number;
  currency: "eur";
  name: string;
}): Promise<Stripe.Coupon> {
  const cached = _couponCache.get(opts.lookupKey);
  if (cached) return cached;

  const existing = await stripe.coupons.list({ limit: 100 });
  const found = existing.data.find((c) => c.metadata?.lookup_key === opts.lookupKey);
  if (found) {
    _couponCache.set(opts.lookupKey, found);
    return found;
  }

  const coupon = await stripe.coupons.create({
    amount_off: opts.amountOff,
    currency: opts.currency,
    duration: "once",
    name: opts.name,
    metadata: { lookup_key: opts.lookupKey },
  });
  _couponCache.set(opts.lookupKey, coupon);
  return coupon;
}
