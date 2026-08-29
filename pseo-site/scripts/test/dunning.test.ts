import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  buildFailedPaymentEmail,
  isGitDealFlowSubscription,
  subscriptionIdFromInvoice,
} from "../../lib/dunning";

const gdfMetadataSubscription = {
  id: "sub_gdf_metadata",
  metadata: { tier: "dashboard", flow: "entry_checkout" },
  items: { data: [] },
};
assert.equal(isGitDealFlowSubscription(gdfMetadataSubscription), true);

const gdfProductSubscription = {
  id: "sub_gdf_product",
  metadata: {},
  items: {
    data: [
      { price: { product: { id: "prod_gdf", name: "GitDealFlow Dashboard" } } },
    ],
  },
};
assert.equal(isGitDealFlowSubscription(gdfProductSubscription), true);

const otherProductSubscription = {
  id: "sub_other",
  metadata: {},
  items: {
    data: [
      { price: { product: { id: "prod_other", name: "FunnelFixer Pro" } } },
    ],
  },
};
assert.equal(isGitDealFlowSubscription(otherProductSubscription), false);

assert.equal(
  subscriptionIdFromInvoice({ subscription: "sub_legacy" }),
  "sub_legacy",
);
assert.equal(
  subscriptionIdFromInvoice({
    parent: {
      type: "subscription_details",
      subscription_details: { subscription: "sub_parent" },
    },
  }),
  "sub_parent",
);
assert.equal(
  subscriptionIdFromInvoice({
    lines: {
      data: [
        {
          parent: {
            type: "subscription_item_details",
            subscription_item_details: { subscription: "sub_line" },
          },
        },
      ],
    },
  }),
  "sub_line",
);
assert.equal(subscriptionIdFromInvoice({}), null);

const email = buildFailedPaymentEmail({
  portalLoginUrl: "https://billing.stripe.com/p/login/test",
});
assert.equal(email.subject, "Action needed: update your GitDealFlow payment method");
assert.match(email.html, /Stripe could not collect your GitDealFlow subscription payment/);
assert.match(email.html, /https:\/\/billing\.stripe\.com\/p\/login\/test/);
assert.match(email.html, /Your access remains active while Stripe retries the payment/);
assert.doesNotMatch(email.subject + email.html, /[^\x00-\x7F]/);

const here = fileURLToPath(new URL(".", import.meta.url));
const webhookRoute = readFileSync(
  new URL("../../app/api/webhook/stripe/route.ts", import.meta.url),
  "utf8",
);
assert.match(webhookRoute, /event\.type === "invoice\.payment_failed"/);
assert.match(webhookRoute, /isGitDealFlowSubscription\(subscription\)/);
assert.match(webhookRoute, /DUNNING_PORTAL_LOGIN_URL/);
assert.match(webhookRoute, /buildFailedPaymentEmail/);
assert.match(webhookRoute, /payment_failed_rescue_sent/);
assert.match(webhookRoute, /invoice\.attempt_count \?\? 0\) > 1/);

const regressionGuard = readFileSync(
  new URL("../verify-no-regressions.ts", import.meta.url),
  "utf8",
);
assert.match(regressionGuard, /Failed-payment dunning rescue/);
assert.match(regressionGuard, /invoice\.payment_failed/);
assert.match(regressionGuard, /non_gdf_subscription/);
assert.match(regressionGuard, /DUNNING_PORTAL_LOGIN_URL/);
assert.match(regressionGuard, /payment_failed_rescue_sent/);

assert.ok(here.endsWith("scripts/test/"));

console.log("dunning unit test passed");
