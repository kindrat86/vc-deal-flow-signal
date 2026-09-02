import { strict as assert } from "node:assert";
import test from "node:test";
import type Stripe from "stripe";

import { getTierFromSession } from "./stripe";

function checkoutSession({
  amount,
  metadata = {},
  paymentLink = null,
}: {
  amount: number;
  metadata?: Record<string, string>;
  paymentLink?: string | null;
}): Stripe.Checkout.Session {
  return {
    id: "cs_test_fixture",
    metadata,
    payment_link: paymentLink,
    line_items: {
      object: "list",
      data: [
        {
          id: "li_test_fixture",
          object: "item",
          amount_discount: 0,
          amount_subtotal: amount,
          amount_tax: 0,
          amount_total: amount,
          currency: "eur",
          description: "fixture",
          discounts: [],
          price: {
            id: "price_fixture",
            object: "price",
            active: true,
            billing_scheme: "per_unit",
            created: 0,
            currency: "eur",
            custom_unit_amount: null,
            livemode: false,
            lookup_key: null,
            metadata: {},
            nickname: null,
            product: "prod_fixture",
            recurring: null,
            tax_behavior: null,
            tiers_mode: null,
            transform_quantity: null,
            type: "one_time",
            unit_amount: amount,
            unit_amount_decimal: String(amount),
          },
          quantity: 1,
          taxes: [],
        },
      ],
      has_more: false,
      url: "/v1/checkout/sessions/cs_test_fixture/line_items",
    },
  } as unknown as Stripe.Checkout.Session;
}

test("foreign one-euro checkout is not classified as Tweet Teardown", () => {
  assert.equal(getTierFromSession(checkoutSession({ amount: 100 })), null);
});

test("foreign checkout with an unknown amount is not classified as Dashboard", () => {
  assert.equal(getTierFromSession(checkoutSession({ amount: 12345 })), null);
});

test("GitDealFlow entry checkout uses trusted tier metadata before amount", () => {
  const session = checkoutSession({
    amount: 100,
    metadata: { flow: "entry_checkout", tier: "dashboard" },
  });

  assert.equal(getTierFromSession(session), "dashboard");
});

test("known Tweet Teardown payment link maps to teardown", () => {
  const session = checkoutSession({
    amount: 100,
    paymentLink: "plink_1TU4ZvCwGoUDklReEjuprkH0",
  });

  assert.equal(getTierFromSession(session), "teardown");
});

test("known Readers Pack payment link maps to book fulfillment", () => {
  const session = checkoutSession({
    amount: 596,
    paymentLink: "plink_1TUuyICwGoUDklReGFxnGn9Q",
  });

  assert.equal(getTierFromSession(session), "book");
});

test("unrecognized payment link fails closed even with tier-like metadata", () => {
  const session = checkoutSession({
    amount: 100,
    metadata: { tier: "teardown" },
    paymentLink: "plink_foreign",
  });

  assert.equal(getTierFromSession(session), null);
});
