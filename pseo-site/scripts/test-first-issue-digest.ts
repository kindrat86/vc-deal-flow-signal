import { buildLatestDigest, nextSundayTiming } from "../lib/digest-builder";

function assert(ok: unknown, message: string): asserts ok {
  if (!ok) throw new Error(message);
}

const saturday = nextSundayTiming(new Date("2026-08-29T12:00:00Z"));
assert(saturday.daysUntilSunday === 1, "Saturday must point one day ahead");
assert(saturday.nextSundayISO === "2026-08-30", "Saturday next-Sunday date is wrong");

const sunday = nextSundayTiming(new Date("2026-08-30T12:00:00Z"));
assert(sunday.daysUntilSunday === 7, "Sunday must point to the following Sunday, not zero days");
assert(sunday.nextSundayISO === "2026-09-06", "Sunday next-Sunday date is wrong");

const first = buildLatestDigest("angel", { firstIssue: true });
assert(first.subject.startsWith("Your first five:"), "first issue needs a distinct welcome subject");
assert(first.subject.includes("+ the 4 more accelerating right now"), "first issue subject needs the remaining-four promise");
assert(first.html.includes("You just joined. Here are the five accelerating fastest on the panel right now."), "first issue intro missing");
assert(first.html.includes("first full Sunday issue lands"), "Sunday expectation missing");
assert(first.html.includes("Tuned for you"), "lane tailoring regressed");

const weekly = buildLatestDigest("angel");
assert(weekly.subject.startsWith("Signal Digest"), "weekly broadcast subject regressed");
assert(!weekly.html.includes("You just joined. Here are the five accelerating fastest on the panel right now."), "weekly broadcast must not render first-issue intro");

console.log(`✓ first-issue digest: ${first.subject}`);
console.log(`✓ weekly digest: ${weekly.subject}`);
