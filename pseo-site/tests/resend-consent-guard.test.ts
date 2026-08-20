import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

import { getResendConsentStatus } from "../lib/resend-consent";

type FetchLike = typeof fetch;

function response(status: number, body: Record<string, unknown> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

test("a global suppression blocks contact lookup and all later mail", async () => {
  const calls: string[] = [];
  const fakeFetch: FetchLike = async (input) => {
    calls.push(String(input));
    return response(200, { object: "suppression", origin: "manual" });
  };

  const status = await getResendConsentStatus(
    "blocked+tag@example.com",
    "test-key",
    fakeFetch,
  );

  assert.equal(status, "suppressed");
  assert.deepEqual(calls, [
    "https://api.resend.com/suppressions/blocked%2Btag%40example.com",
  ]);
});

test("an unsubscribed contact stays unsubscribed", async () => {
  const fakeFetch: FetchLike = async (input) => {
    const url = String(input);
    if (url.includes("/suppressions/")) return response(404, { statusCode: 404 });
    return response(200, { object: "contact", unsubscribed: true });
  };

  assert.equal(
    await getResendConsentStatus("opted-out@example.com", "test-key", fakeFetch),
    "unsubscribed",
  );
});

test("a new address with no suppression is clear", async () => {
  const fakeFetch: FetchLike = async () => response(404, { statusCode: 404 });

  assert.equal(
    await getResendConsentStatus("new@example.com", "test-key", fakeFetch),
    "clear",
  );
});

test("a Resend lookup failure fails closed", async () => {
  const fakeFetch: FetchLike = async () => response(503, { statusCode: 503 });

  assert.equal(
    await getResendConsentStatus("unknown@example.com", "test-key", fakeFetch),
    "unknown",
  );
});

test("the verification route never reactivates an opted-out contact", () => {
  const route = readFileSync(
    resolve(process.cwd(), "app/api/verify/route.ts"),
    "utf8",
  );

  assert.match(route, /getResendConsentStatus/);
  assert.match(route, /consentStatus\s*!==\s*"clear"/);
  assert.doesNotMatch(route, /unsubscribed:\s*false/);
  assert.doesNotMatch(route, /PATCH unsubscribed:false/);
});
