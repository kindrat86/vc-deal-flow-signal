import test from "node:test";
import assert from "node:assert/strict";
import riskModule from "../pseo-site/lib/customer-health-risk.ts";

const {
  classifyCustomerRisk,
  decodeCustomerHealth,
} = riskModule;

const NOW = new Date("2026-08-29T12:00:00.000Z");
const state = (overrides = {}) => ({
  v: 1,
  tier: "dashboard",
  customerId: "cus_test",
  startedAt: "2026-07-01T12:00:00.000Z",
  ...overrides,
});

test("decodes the versioned health token", () => {
  const decoded = decodeCustomerHealth(`gdf-health-v1:${JSON.stringify(state())}`);
  assert.equal(decoded.customerId, "cus_test");
  assert.equal(decoded.tier, "dashboard");
});

test("new customers get a seven-day activation grace period", () => {
  assert.equal(classifyCustomerRisk(state({ startedAt: "2026-08-25T12:00:00.000Z" }), NOW).level, "healthy");
});

test("flags a paid customer who has not reached first value after seven days", () => {
  const result = classifyCustomerRisk(state(), NOW);
  assert.equal(result.level, "critical");
  assert.match(result.reasons.join(" "), /first value/i);
});

test("flags a customer whose meaningful activity stopped for 21 days", () => {
  const result = classifyCustomerRisk(state({ lastMeaningfulActivityAt: "2026-08-01T12:00:00.000Z" }), NOW);
  assert.equal(result.level, "at_risk");
  assert.match(result.reasons.join(" "), /21 days/i);
});

test("billing-portal activity is critical even when usage is recent", () => {
  const result = classifyCustomerRisk(state({
    lastMeaningfulActivityAt: "2026-08-28T12:00:00.000Z",
    billingPortalOpenedAt: "2026-08-29T10:00:00.000Z",
  }), NOW);
  assert.equal(result.level, "critical");
  assert.match(result.reasons.join(" "), /billing portal/i);
});

test("cancelled customers are excluded from proactive retention", () => {
  assert.equal(classifyCustomerRisk(state({ cancelledAt: "2026-08-28T12:00:00.000Z" }), NOW).level, "excluded");
});
