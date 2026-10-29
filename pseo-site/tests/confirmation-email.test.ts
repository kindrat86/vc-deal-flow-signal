import assert from "node:assert/strict";

import {
  verificationEmailHtml,
  verificationEmailSubject,
} from "../lib/confirmation-email";

const url = "https://signals.gitdealflow.com/api/verify?email=a%40b.c&token=T&cohort=soap-opera";
const OLD_AFTER =
  "After you confirm, you'll also start receiving weekly signal updates, the top startups showing unusual engineering acceleration. No spam, unsubscribe anytime.";

// Default signals.gitdealflow.com path: approved text, word for word (t361u).
const html = verificationEmailHtml(url, "soap-opera");
assert.equal(verificationEmailSubject("soap-opera"), "Confirm to get this week's 5 startups");
for (const needle of [
  "One click. Your Top 5 lands right away, then five short emails and the Sunday digest.",
  "One click and this week's five are yours.",
  "<p>Confirm your email below and <strong>This Week's Top 5 Breakout Startups</strong> land in your inbox straight away: the five teams whose public GitHub is speeding up the most right now, each with one plain sentence on why it is moving.</p>",
  "<p>Here is exactly what comes after that, and nothing else:</p>",
  "<li>Five short emails over your first week (in about 30 minutes, then on day 1, 3, 5 and 7): why you get five names and not fifty, where the idea came from, how my public picks have actually scored so far (misses included), and what the paid options are if you ever want more.</li>",
  "<li>The free Signal Digest every Sunday. Five names a week.</li>",
  "<p>No countdowns and no daily blasts. Every email has a one-click unsubscribe.</p>",
  "Confirm and get my 5 &rarr;",
  "After you confirm, the Sunday digest keeps coming every week until you unsubscribe. No spam, unsubscribe anytime.",
  "Button not working? Paste this into your browser:",
  "If you didn't sign up, you can safely ignore this email.",
]) {
  assert.ok(html.includes(needle), `default confirmation is missing: ${needle}`);
}
assert.equal(html.split(url).length - 1, 4, "confirm button (VML + HTML) and fallback link (href + text) keep the verify URL");
for (const banned of [/missed/i, /21 to 47/, /fintech/i, /Series A/, /went to bed/]) {
  assert.doesNotMatch(html, banned, `default confirmation still contains ${banned}`);
}
assert.doesNotMatch(verificationEmailSubject("soap-opera"), /missed/i);
assert.ok(!html.includes(OLD_AFTER), "default path uses its own line under the button");

// Challenge and launch keep their original text, including the shared line.
const challenge = verificationEmailHtml(url, "challenge");
assert.equal(verificationEmailSubject("challenge"), "Confirm your email, your 7-Day Reset starts now");
assert.ok(challenge.includes("Confirm your email, your 7-Day Reset starts immediately"));
assert.ok(challenge.includes("Start the Challenge &rarr;"));
assert.ok(challenge.includes(OLD_AFTER), "challenge lost its 'After you confirm' line");

const launch = verificationEmailHtml(url, "launch");
assert.equal(verificationEmailSubject("launch"), "Confirm your email, Agent Credits launch starts now");
assert.ok(launch.includes("Confirm your email, launch sequence starts in 30 minutes"));
assert.ok(launch.includes("Start the Launch Sequence &rarr;"));
assert.ok(launch.includes(OLD_AFTER), "launch lost its 'After you confirm' line");

for (const other of [challenge, launch]) {
  assert.ok(!other.includes("One click and this week's five are yours."), "new default text leaked into another cohort");
}

console.log("confirmation-email: ok");
