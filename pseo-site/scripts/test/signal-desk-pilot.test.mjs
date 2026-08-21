import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (relative) => {
  const path = join(root, relative);
  assert.ok(existsSync(path), `missing required file: ${relative}`);
  return readFileSync(path, "utf8");
};

const tiers = read("lib/stripe-tiers.ts");
const checkout = read("app/api/checkout/session/route.ts");
const offer = read("app/signal-desk/page.tsx");
const tracker = read("app/signal-desk/SignalDeskTracker.tsx");
const checkoutForm = read("app/signal-desk/SignalDeskCheckoutForm.tsx");
const intakeForm = read("app/signal-desk/SignalDeskIntakeForm.tsx");
const intake = read("app/api/signal-desk/intake/route.ts");
const success = read("app/signal-desk/success/page.tsx");
const activation = read("app/api/auth/activate/route.ts");
const pricing = read("app/pricing/page.tsx");
const combined = [tiers, checkout, offer, tracker, checkoutForm, intakeForm, intake, success, pricing].join("\n");

assert.match(tiers, /signal_desk_pilot/);
assert.match(tiers, /mode:\s*"payment"/);
assert.match(tiers, /unitAmount:\s*25000/);
assert.match(tiers, /currency:\s*"eur"/);
assert.match(tiers, /productName:\s*"GitDealFlow Signal Desk, 30-day pilot"/);
assert.match(tiers, /credit.*€490 annual Dashboard/i);
assert.match(tiers, /successUrl:\s*"https:\/\/signals\.gitdealflow\.com\/signal-desk\/success\?session_id=\{CHECKOUT_SESSION_ID\}"/);
assert.match(tiers, /cancelUrl:\s*"\/signal-desk\?cancelled=1"/);

assert.match(checkout, /offer:\s*"signal_desk_pilot"/);
assert.match(checkout, /pilot_duration_days:\s*"30"/);
assert.match(checkout, /credit_toward_dashboard_eur:\s*"490"/);
assert.match(checkout, /seat_limit:\s*"5"/);
assert.match(combined, /signal_desk_checkout_started/);

assert.match(offer, /€250/);
assert.match(offer, /€490 annual Dashboard/);
assert.match(offer, /30-day pilot/i);
assert.match(offer, /five founding pilot places/i);
assert.match(offer, /No investment recommendation/i);
assert.match(offer, /No guarantee that a company will raise/i);
assert.match(offer, /manual/i);
assert.match(offer, /SignalDeskTracker/);
assert.match(pricing, /Signal Desk pilot/i);

for (const event of [
  "signal_desk_offer_viewed",
  "signal_desk_cta_clicked",
  "signal_desk_checkout_started",
  "signal_desk_checkout_completed",
  "signal_desk_intake_submitted",
]) {
  assert.match(combined, new RegExp(event));
}

assert.match(success, /payment_status !== "paid"/);
assert.match(success, /metadata\?\.offer !== "signal_desk_pilot"/);
assert.match(intake, /payment_status !== "paid"/);
assert.match(intake, /metadata\?\.offer !== "signal_desk_pilot"/);
assert.match(intake, /isValidEmail/);
assert.match(intake, /investor_type/);
assert.match(intake, /sectors/);
assert.match(intake, /preferred_delivery_email/);
assert.match(intakeForm, /signal_desk_intake_submitted/);
assert.match(intake, /bcc:\s*"sales@sipiteno\.com"/);

assert.match(activation, /tier === "signal_desk_pilot"/);
assert.match(activation, /signal-desk\?status=paid/);
assert.match(pricing, /unitAmount:\s*4900|€490/);
const canonicalObservationCount = [2, 1, 9].join("");
const forbiddenFinancingClaim = new RegExp(
  `${canonicalObservationCount}\\s+(fund${"raises"}|fund${"ing\\s+events"})`,
  "i",
);
assert.doesNotMatch(combined, forbiddenFinancingClaim);
assert.doesNotMatch(combined, /\b(400\+|411|369|4,200\+)\b/);

console.log("Signal Desk pilot regression checks passed");
