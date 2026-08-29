import { buildLatestDigest } from "../lib/digest-builder";

function assert(ok: unknown, message: string): asserts ok {
  if (!ok) throw new Error(message);
}

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
