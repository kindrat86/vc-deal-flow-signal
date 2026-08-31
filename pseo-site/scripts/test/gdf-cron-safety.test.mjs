import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (relativePath) => readFileSync(new URL(relativePath, root), "utf8");

test("shared send gate fails closed when production config is absent", () => {
  const source = read("lib/send-gate.ts");
  assert.match(
    source,
    /if\s*\(!GATE_URL\s*\|\|\s*!GATE_SECRET\)\s*return\s+process\.env\.NODE_ENV\s*!==\s*["']production["']\s*;/,
  );
  assert.match(source, /return\s+res\.ok\s*&&\s*data\?\.allowed\s*===\s*true\s*;/);
  assert.doesNotMatch(source, /unreachable for \$\{email\}/);
});

test("drip dry-run requires cron auth and never returns raw recipient email", () => {
  const source = read("app/api/cron/drip-sender/route.ts");
  assert.doesNotMatch(source, /if\s*\(!dry\)\s*\{\s*const auth/);
  assert.match(source, /const auth = request\.headers\.get\(["']authorization["']\)/);
  assert.match(source, /recipientRef\(contact\.email\)/);
  assert.doesNotMatch(source, /sentLog\.push\(\{\s*email:\s*contact\.email/);
  assert.doesNotMatch(source, /sentLog:\s*\{\s*email:\s*string/);
});

test("daily Seinfeld manual recipient path is owner-address-only", () => {
  const source = read("app/api/cron/daily-seinfeld/route.ts");
  assert.match(source, /INTERNAL_TEST_RECIPIENTS/);
  assert.match(source, /INTERNAL_TEST_RECIPIENTS\.has\(testTo\.toLowerCase\(\)\)/);
  assert.match(source, /gateAllows\(testTo,\s*["']pseo:daily-seinfeld-test["']\)/);
});

test("daily Seinfeld provider failures do not expose the raw provider body", () => {
  const source = read("app/api/cron/daily-seinfeld/route.ts");
  assert.doesNotMatch(source, /console\.error\([^;]*,\s*body\s*\)/s);
  assert.doesNotMatch(source, /error:\s*body/);
  assert.match(source, /recipient_ref:\s*recipientRef\(testTo\)/);
  assert.match(source, /provider_status:\s*sendRes\.status/);
});

test("daily Seinfeld audience fan-out BCCs the portfolio archive", () => {
  const source = read("app/api/cron/daily-seinfeld/route.ts");
  const fanout = source.split("// Default: fan out to the audience")[1] ?? "";
  assert.match(
    fanout,
    /from:\s*FROM_EMAIL,\s*bcc:\s*["']sales@sipiteno\.com["'],\s*to:\s*\[addr\]/,
  );
});

test("native lifecycle email routes remain available but are not scheduled", () => {
  const config = JSON.parse(read("vercel.json"));
  const scheduledPaths = new Set(config.crons.map((cron) => cron.path));

  assert.doesNotThrow(() => read("app/api/cron/daily-seinfeld/route.ts"));
  assert.doesNotThrow(() => read("app/api/cron/drip-sender/route.ts"));
  assert.equal(scheduledPaths.has("/api/cron/daily-seinfeld"), false);
  assert.equal(scheduledPaths.has("/api/cron/drip-sender"), false);
});

test("unsubscribe diagnostics never expose recipient PII or provider bodies", () => {
  const source = read("app/api/unsubscribe/route.ts");

  assert.match(source, /import\s*\{\s*recipientRef\s*\}\s*from\s*["']@\/lib\/send-gate["']/);
  assert.doesNotMatch(source, /Resend PATCH failed[^;]*res\.text\(\)/s);
  assert.doesNotMatch(source, /queued emails for \$\{email\}/);
  assert.doesNotMatch(source, /distinct_id:\s*email/);
  assert.doesNotMatch(source, /Exit survey:[^`]*\$\{email\}/);
  assert.doesNotMatch(source, /Email:\s*\$\{email\}/);
  assert.match(source, /recipient_ref[^\n]*recipientRef\(email\)/);
});

test("production prebuild runs the cron safety suite", () => {
  const packageJson = JSON.parse(read("package.json"));
  assert.match(
    packageJson.scripts.prebuild,
    /node --test scripts\/test\/gdf-cron-safety\.test\.mjs/,
  );
});
