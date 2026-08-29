import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

const needles = {
  "app/feedback/page.tsx": [
    "Request a feature or report a problem",
    "robots: { index: false, follow: false }",
  ],
  "app/feedback/FeedbackForm.tsx": [
    "What were you trying to do?",
    "What stopped you?",
    "How often would you use it?",
  ],
  "app/support/page.tsx": [
    "Customer support",
  ],
  "app/support/SupportForm.tsx": [
    "Data or signal quality",
  ],
  "app/pulse/PulseForm.tsx": [
    "How likely are you to recommend GitDealFlow to another investor?",
    "What is the main reason for your score?",
    "What would raise it by one point?",
  ],
  "components/Footer.tsx": [
    'href="/support"',
    'href="/feedback"',
    'href="/pulse"',
  ],
  "lib/digest-email.ts": [
    "What would make this signal more useful in your next deal decision?",
    "https://signals.gitdealflow.com/feedback?source=sunday",
  ],
  "app/cancel/CancelFlow.tsx": [
    "What would have made you stay for one more month?",
    "May we ask two follow-up questions?",
    "followUpOk",
  ],
  "app/api/cancel/route.ts": [
    "follow_up_ok",
    "stayReason",
  ],
  "app/api/webhook/stripe/route.ts": [
    "cancellation_follow_up_ok",
    "cancellation_stay_reason",
  ],
  "app/privacy/page.tsx": [
    "customer feedback",
    "satisfaction responses",
  ],
};

for (const [relative, expected] of Object.entries(needles)) {
  test(`${relative} exposes the customer-truth contract`, () => {
    const source = read(relative);
    for (const needle of expected) assert.ok(source.includes(needle), `${relative} missing ${needle}`);
  });
}

test("support keeps a one-business-day response commitment", () => {
  const normalized = read("app/support/page.tsx")
    .toLowerCase()
    .replace(/\b1\b/g, "one");
  assert.match(normalized, /\brepl(?:y|ies) within one business day\b/);
});

test("the customer-voice contract runs in the release gate", () => {
  const packageJson = read("package.json");
  assert.ok(packageJson.includes('"test:customer-voice"'));
  assert.ok(packageJson.includes("node --test scripts/test/customer-voice-surfaces.test.mjs"));
});

test("a single structured endpoint receives feedback, support, and pulse submissions", () => {
  const api = read("app/api/customer-voice/route.ts");
  for (const needle of ["parseCustomerVoice", "customer_voice_submitted", "voiceEmailHtml", "voiceSubject"]) {
    assert.ok(api.includes(needle), `customer voice API missing ${needle}`);
  }
});
