import assert from "node:assert/strict";
import test from "node:test";
import crypto from "node:crypto";
import {
  aggregateDailyMetrics,
  verifyRefgrowSignature,
  type ReferralEvent,
} from "./refgrow-analytics";

const secret = "test-refgrow-webhook-secret";
const body = JSON.stringify({
  id: "evt_signed_1",
  type: "referral_converted",
  data: {
    referral_id: "ref_1",
    affiliate_id: "aff_1",
    conversion_id: "conv_1",
    value: 49,
    currency: "EUR",
    occurred_at: "2026-08-21T08:00:00.000Z",
  },
});

function signature(payload: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

test("rejects an invalid webhook signature", () => {
  assert.equal(verifyRefgrowSignature(body, "bad", secret), false);
});

test("accepts the expected SHA-256 HMAC signature", () => {
  assert.equal(verifyRefgrowSignature(body, signature(body), secret), true);
});

test("calculates K-factor from one referrer, three referrals, and two paid conversions", () => {
  const events: ReferralEvent[] = [
    { eventId: "1", eventType: "referral_signed_up", affiliateId: "a", referralId: "r1", status: "accepted", occurredAt: "2026-08-21T01:00:00.000Z" },
    { eventId: "2", eventType: "referral_signed_up", affiliateId: "a", referralId: "r2", status: "accepted", occurredAt: "2026-08-21T02:00:00.000Z" },
    { eventId: "3", eventType: "referral_signed_up", affiliateId: "a", referralId: "r3", status: "pending", occurredAt: "2026-08-21T03:00:00.000Z" },
    { eventId: "4", eventType: "referral_converted", affiliateId: "a", referralId: "r1", conversionId: "c1", conversionValue: 49, currency: "EUR", status: "paid", occurredAt: "2026-08-21T04:00:00.000Z" },
    { eventId: "5", eventType: "referral_converted", affiliateId: "a", referralId: "r2", conversionId: "c2", conversionValue: 49, currency: "EUR", status: "paid", occurredAt: "2026-08-21T05:00:00.000Z" },
  ];
  assert.deepEqual(aggregateDailyMetrics(events), {
    activeReferrers: 1,
    referralsCreated: 3,
    acceptedReferrals: 2,
    paidConversions: 2,
    referralConversionRate: 2 / 3,
    invitesPerActiveReferrer: 3,
    kFactor: 2,
    referredRevenue: { EUR: 98 },
  });
});

test("a cancellation reverses the matching paid conversion and its revenue", () => {
  const events: ReferralEvent[] = [
    { eventId: "1", eventType: "referral_signed_up", affiliateId: "a", referralId: "r1", status: "accepted", occurredAt: "2026-08-21T01:00:00.000Z" },
    { eventId: "2", eventType: "referral_converted", affiliateId: "a", referralId: "r1", conversionId: "c1", conversionValue: 49, currency: "EUR", status: "paid", occurredAt: "2026-08-21T02:00:00.000Z" },
    { eventId: "3", eventType: "referral_canceled", affiliateId: "a", referralId: "r1", conversionId: "c1", cancellationState: "canceled", occurredAt: "2026-08-21T03:00:00.000Z" },
  ];
  const metrics = aggregateDailyMetrics(events);
  assert.equal(metrics.paidConversions, 0);
  assert.deepEqual(metrics.referredRevenue, {});
});

test("deduplicates repeated webhook delivery by event id", () => {
  const event: ReferralEvent = { eventId: "same", eventType: "referral_signed_up", affiliateId: "a", referralId: "r1", status: "accepted", occurredAt: "2026-08-21T01:00:00.000Z" };
  assert.equal(aggregateDailyMetrics([event, event]).referralsCreated, 1);
});
