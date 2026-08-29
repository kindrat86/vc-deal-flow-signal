import assert from "node:assert/strict";
import test from "node:test";
import {
  parseCustomerVoice,
  posthogProperties,
  voiceEmailHtml,
  voiceSubject,
} from "./customer-voice";

test("feedback captures the job, blocker, frequency, source, and contact consent", () => {
  const result = parseCustomerVoice("feedback", {
    tryingToDo: "Shortlist fintech teams before partner meeting",
    blocker: "I could not filter by geography",
    frequency: "weekly",
    email: "reader@example.com",
    contactOk: true,
    source: "sunday",
  });
  assert.equal(result.ok, true);
  if (!result.ok || !("value" in result)) assert.fail("expected parsed feedback");
  assert.deepEqual(result.value, {
    kind: "feedback",
    tryingToDo: "Shortlist fintech teams before partner meeting",
    blocker: "I could not filter by geography",
    frequency: "weekly",
    email: "reader@example.com",
    contactOk: true,
    source: "sunday",
  });
});

test("support requires a valid reply email and a bounded message", () => {
  assert.equal(parseCustomerVoice("support", {
    email: "not-an-email",
    topic: "login",
    message: "The login email did not arrive",
  }).ok, false);
  assert.equal(parseCustomerVoice("support", {
    email: "reader@example.com",
    topic: "login",
    message: "The login email did not arrive",
  }).ok, true);
});

test("pulse accepts a 0-10 recommendation score and rejects out-of-range scores", () => {
  const valid = parseCustomerVoice("pulse", {
    score: 7,
    usefulLead: "not_yet",
    reason: "The signal is clear but not in my geography",
    raiseOnePoint: "Add geography filtering",
    email: "",
    contactOk: false,
    source: "footer",
  });
  assert.equal(valid.ok, true);
  assert.equal(parseCustomerVoice("pulse", {
    score: 11,
    usefulLead: "yes",
    reason: "Useful",
    raiseOnePoint: "Nothing",
  }).ok, false);
});

test("customer voice output is structured, escaped, and does not put PII in the subject", () => {
  const parsed = parseCustomerVoice("feedback", {
    tryingToDo: "Compare <five> teams",
    blocker: "CSV export & filters",
    frequency: "every_deal",
    email: "reader@example.com",
    contactOk: true,
    source: "dashboard",
  });
  assert.equal(parsed.ok, true);
  if (!parsed.ok || !("value" in parsed)) assert.fail("expected parsed feedback");
  const subject = voiceSubject(parsed.value);
  assert.match(subject, /^VOC feedback:/);
  assert.doesNotMatch(subject, /reader@example\.com/);
  const html = voiceEmailHtml(parsed.value);
  assert.match(html, /Compare &lt;five&gt; teams/);
  assert.match(html, /CSV export &amp; filters/);
  const props = posthogProperties(parsed.value);
  assert.equal(props.product, "gitdealflow");
  assert.equal(props.voice_kind, "feedback");
  assert.equal(props.source, "dashboard");
});

test("PostHog properties remove email addresses from free text", () => {
  const parsed = parseCustomerVoice("feedback", {
    tryingToDo: "Contact analyst@example.com about the shortlist",
    blocker: "Email me at analyst@example.com",
    frequency: "weekly",
  });
  assert.equal(parsed.ok, true);
  if (!parsed.ok || !("value" in parsed)) assert.fail("expected parsed feedback");
  assert.doesNotMatch(JSON.stringify(posthogProperties(parsed.value)), /analyst@example\.com/);
  assert.match(JSON.stringify(posthogProperties(parsed.value)), /\[email\]/);
});

test("honeypot submissions are accepted as no-op spam", () => {
  const result = parseCustomerVoice("feedback", {
    tryingToDo: "Spam",
    blocker: "Spam",
    frequency: "once",
    website: "https://spam.example",
  });
  assert.deepEqual(result, { ok: true, spam: true });
});
