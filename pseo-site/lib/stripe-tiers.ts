import "server-only";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

export type EntryTierKey =
  | "firstlook"
  | "dashboard"
  | "insider"
  | "sector_sweep"
  | "summit";

export type OtoKey =
  | "sector_sweep_oto1"
  | "insider_oto2"
  | "extra_sector_oto3";

// Brunson DotCom Ch 18 — true order bump. A SECOND, smaller line item the
// buyer adds to the base €7 with a checkbox. Different from the OTO chain
// (post-purchase) — this happens IN-cart, before card capture, so the
// bumped checkout sets up the saved card for OTOs the same way the base
// cart does.
export type BumpKey =
  | "methodology_vault"
  | "dashboard_playbook"
  | "summit_sector_sweep";

export type BumpConfig = {
  productName: string;
  unitAmount: number;
  currency: "eur";
  description: string;
};

export type EntryTierConfig = {
  mode: "payment" | "subscription";
  productName: string;
  unitAmount: number;
  currency: "eur";
  successUrl: string;
  cancelUrl: string;
  description?: string;
  interval?: "month" | "year";
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
    mode: "payment",
    productName: "First Look Pass",
    unitAmount: 700,
    currency: "eur",
    successUrl: "https://signals.gitdealflow.com/firstlook/thanks?session_id={CHECKOUT_SESSION_ID}",
    cancelUrl: "/firstlook?cancelled=1",
    description:
      "One-sector engineering-acceleration deep dive. PDF + raw CSV + JSON dump within 24h.",
  },
  dashboard: {
    mode: "subscription",
    productName: "Dashboard",
    unitAmount: 4900,
    currency: "eur",
    interval: "month",
    successUrl: "https://gitdealflow.com/dashboard-thanks?session_id={CHECKOUT_SESSION_ID}",
    cancelUrl: "/dashboard?cancelled=1",
    description:
      "Weekly ranked field for active angel sourcing. Cancel anytime.",
  },
  insider: {
    mode: "subscription",
    productName: "Insider Circle",
    unitAmount: 19700,
    currency: "eur",
    interval: "month",
    successUrl: "https://gitdealflow.com/insider-thanks?session_id={CHECKOUT_SESSION_ID}",
    cancelUrl: "/insider?cancelled=1",
    description:
      "Closer room around the signal: steadier context, conviction, and access.",
  },
  sector_sweep: {
    mode: "payment",
    productName: "Sector Sweep",
    unitAmount: 199700,
    currency: "eur",
    successUrl: "https://gitdealflow.com/sector-sweep-thanks?session_id={CHECKOUT_SESSION_ID}",
    cancelUrl: "/sector-sweep?cancelled=1",
    description:
      "One sector. One thesis. One serious custom pass you can act on.",
  },
  summit: {
    mode: "payment",
    productName: "VC Engineering Acceleration Summit — All-Access Pass",
    unitAmount: 9700,
    currency: "eur",
    successUrl: "/summit/thanks?session_id={CHECKOUT_SESSION_ID}",
    cancelUrl: "/summit/all-access?cancelled=1",
    description:
      "Lifetime access to all 20 summit talks, full transcripts, slide decks, and the 219-startup backtest CSV.",
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
    unitAmount: 19700,
    currency: "eur",
    interval: "month",
    // v2 lookup key — v1 resolves to the retired €97/mo founding price in
    // Stripe; reusing it would silently charge the old amount.
    lookupKey: "insider_monthly_v2_197",
    firstInvoiceCouponAmountOff: 2000,
    firstInvoiceCouponLookupKey: "insider_firstlook_oto_first_month_off_v1",
    description:
      "Private investor Telegram, monthly briefing call, custom watchlists, API access, direct line to me. €197/mo — €20 off the first month from this offer only.",
    welcomeSubject: "Welcome to the Insider Circle",
  },
  // Brunson DotCom Ch 18 — last-chance OTO. Surface ONLY after the buyer
  // has declined both Sector Sweep (€1,797) and Insider (€97/mo). The price
  // (€17) is one-third of standalone (€7 × 2 = €14 — €17 captures a small
  // premium the bump buyer is willing to pay for not having to come back
  // and check out twice). The deliverable is a second sector report
  // following the same 24-hour cadence as the base First Look.
  extra_sector_oto3: {
    kind: "one_time",
    productName: "Extra Sector — second First Look deep dive",
    unitAmount: 1700,
    currency: "eur",
    description:
      "Add a second sector to your First Look. Same 24-hour intake, same PDF + CSV deliverable. €17 from this page only — last-chance rung after Sector Sweep + Insider declined.",
    welcomeSubject: "Second sector pick — quick intake",
  },
};

// True Brunson order-bump — added IN-cart BEFORE Stripe capture, so the
// saved card flows through the same setup_future_usage path the base
// product does. Each bump is a separate Checkout line item / invoice
// item, not a price swap. Lifts AOV without disrupting the OTO ladder.
export const BUMPS: Record<BumpKey, BumpConfig> = {
  methodology_vault: {
    productName: "Methodology Vault — full PDF",
    unitAmount: 1900,
    currency: "eur",
    description:
      "The 38-page Methodology Vault PDF — the SSRN methodology operationalized: annotated commentary on every signal definition and regression coefficient, plus ready-to-run checklists for the three confounder checks, so you apply the paper instead of re-deriving it. Delivered as an instant download link in your First Look intake email.",
  },
  // Brunson DotCom Ch 14 — Dashboard order bump. Works for BOTH payment
  // and subscription tiers: on payment it becomes a second line_item; on
  // subscription it becomes an add_invoice_item on the first invoice.
  dashboard_playbook: {
    productName: "The Deal Flow Playbook — 42-page PDF",
    unitAmount: 700,
    currency: "eur",
    description:
      "42-page PDF: how to turn the weekly field into a sourcing workflow — the 15-minute Monday ritual, the 3-question diligence filter, the sector rotation calendar, and the tracking template for first-touch outreach. Instant download link in your welcome email. Normally €47 — add it now for €7.",
  },
  // Brunson Summit playbook — in-cart bump on the All-Access Pass. Deep
  // discount honors the €297 summit-attendee rate advertised on
  // /summit/all-access (standalone Sector Sweep sells at €1,997).
  summit_sector_sweep: {
    productName: "Custom Sector Sweep — Summit Attendee Rate",
    unitAmount: 29700,
    currency: "eur",
    description:
      "One full sector deep-dive on a sector of your choice — top 25 ranked GitHub orgs, contributor maps, three pre-Crunchbase breakouts, raw CSV, and a 14-page written walkthrough. €297 summit-attendee rate (standalone €1,997).",
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
