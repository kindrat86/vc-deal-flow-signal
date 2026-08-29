import assert from "node:assert/strict";
import test from "node:test";
import { laneOfferRoute, resolveOfferRoute } from "./investor-lanes";

test("fund and corpdev lanes qualify directly to Dashboard", () => {
  assert.equal(laneOfferRoute("fund"), "D");
  assert.equal(laneOfferRoute("corpdev"), "D");
});

test("angel and scout lanes get the low-risk First Look route", () => {
  assert.equal(laneOfferRoute("angel"), "T");
  assert.equal(laneOfferRoute("scout"), "T");
});

test("builder, other, and unknown lanes keep the free route", () => {
  assert.equal(laneOfferRoute("builder"), "F");
  assert.equal(laneOfferRoute("other"), "F");
  assert.equal(laneOfferRoute(""), "F");
  assert.equal(laneOfferRoute("bogus"), "F");
});

test("an explicit avatar route wins, otherwise the investor lane qualifies the offer", () => {
  assert.equal(resolveOfferRoute("I", "fund"), "I");
  assert.equal(resolveOfferRoute("T", "corpdev"), "T");
  assert.equal(resolveOfferRoute("", "fund"), "D");
  assert.equal(resolveOfferRoute("", "angel"), "T");
  assert.equal(resolveOfferRoute("", ""), "");
});
