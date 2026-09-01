import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  decodePaymentHeader,
  decorateLegacyResponseForV2,
  encodeV2PaymentRequiredFromV1,
  paymentSignatureV2ToV1,
  paymentResponseV1ToV2,
} from "../lib/x402-v2-bridge";

const V1_REQUIREMENT = {
  scheme: "exact",
  network: "base",
  maxAmountRequired: "190000",
  resource: "https://signals.gitdealflow.com/api/agent/deep-signal/x402",
  description: "VC Deal Flow Signal deep_signal lookup",
  mimeType: "application/json",
  payTo: "0xe30f9cf88d8Aa89b7265685318a7ab085D8e4b85",
  maxTimeoutSeconds: 30,
  asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  extra: { name: "USD Coin", version: "2" },
};

function base64Json(value: unknown): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
}

test("encodes the legacy 402 body as a valid x402 v2 PAYMENT-REQUIRED header", () => {
  const encoded = encodeV2PaymentRequiredFromV1({
    x402Version: 1,
    error: "X-PAYMENT header is required",
    accepts: [V1_REQUIREMENT],
  });

  assert.deepEqual(decodePaymentHeader(encoded), {
    x402Version: 2,
    error: "PAYMENT-SIGNATURE header is required",
    resource: {
      url: V1_REQUIREMENT.resource,
      description: V1_REQUIREMENT.description,
      mimeType: V1_REQUIREMENT.mimeType,
    },
    accepts: [
      {
        scheme: "exact",
        network: "eip155:8453",
        amount: "190000",
        asset: V1_REQUIREMENT.asset,
        payTo: V1_REQUIREMENT.payTo,
        maxTimeoutSeconds: 30,
        extra: V1_REQUIREMENT.extra,
      },
    ],
  });
});

test("translates an EIP-3009 v2 PAYMENT-SIGNATURE envelope to legacy X-PAYMENT", () => {
  const payload = {
    signature: "0xdeadbeef",
    authorization: {
      from: "0x1111111111111111111111111111111111111111",
      to: V1_REQUIREMENT.payTo,
      value: "190000",
      validAfter: "0",
      validBefore: "9999999999",
      nonce: `0x${"00".repeat(32)}`,
    },
  };
  const v2 = base64Json({
    x402Version: 2,
    resource: { url: V1_REQUIREMENT.resource },
    accepted: {
      scheme: "exact",
      network: "eip155:8453",
      amount: "190000",
      asset: V1_REQUIREMENT.asset,
      payTo: V1_REQUIREMENT.payTo,
      maxTimeoutSeconds: 30,
      extra: V1_REQUIREMENT.extra,
    },
    payload,
  });

  assert.deepEqual(decodePaymentHeader(paymentSignatureV2ToV1(v2, "base")), {
    x402Version: 1,
    scheme: "exact",
    network: "base",
    payload,
  });
});

test("rejects a non-v2 or non-EIP-3009 payment signature before the facilitator", () => {
  assert.throws(
    () => paymentSignatureV2ToV1(base64Json({ x402Version: 1 }), "base"),
    /x402Version 2/,
  );
  assert.throws(
    () =>
      paymentSignatureV2ToV1(
        base64Json({
          x402Version: 2,
          accepted: { scheme: "exact", network: "eip155:8453" },
          payload: { permit2Authorization: {} },
        }),
        "base",
      ),
    /EIP-3009/,
  );
});

test("mirrors a v1 settlement result as a v2 PAYMENT-RESPONSE header", () => {
  const v1 = base64Json({
    success: true,
    payer: "0x1111111111111111111111111111111111111111",
    transaction: `0x${"ab".repeat(32)}`,
    network: "base",
  });

  assert.deepEqual(decodePaymentHeader(paymentResponseV1ToV2(v1)), {
    success: true,
    payer: "0x1111111111111111111111111111111111111111",
    transaction: `0x${"ab".repeat(32)}`,
    network: "eip155:8453",
  });
});

test("adds PAYMENT-REQUIRED and browser-readable CORS exposure to a legacy 402", async () => {
  const response = new Response(
    JSON.stringify({
      x402Version: 1,
      error: "X-PAYMENT header is required",
      accepts: [V1_REQUIREMENT],
    }),
    {
      status: 402,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "X-PAYMENT-RESPONSE",
      },
    },
  );

  const decorated = await decorateLegacyResponseForV2(response, false);
  assert.equal(decorated.status, 402);
  assert.deepEqual(await decorated.json(), {
    x402Version: 1,
    error: "X-PAYMENT header is required",
    accepts: [V1_REQUIREMENT],
  });
  const header = decorated.headers.get("PAYMENT-REQUIRED");
  assert.ok(header);
  assert.equal((decodePaymentHeader(header) as { x402Version: number }).x402Version, 2);
  assert.match(decorated.headers.get("Access-Control-Expose-Headers") ?? "", /PAYMENT-REQUIRED/);
  assert.match(decorated.headers.get("Access-Control-Expose-Headers") ?? "", /PAYMENT-RESPONSE/);
  assert.equal(decorated.headers.get("Access-Control-Allow-Origin"), "*");
  assert.match(decorated.headers.get("Access-Control-Allow-Headers") ?? "", /PAYMENT-SIGNATURE/);
});

test("adds PAYMENT-RESPONSE to a successful v2-bridged settlement", async () => {
  const legacySettlement = base64Json({
    success: true,
    transaction: `0x${"cd".repeat(32)}`,
    network: "base",
  });
  const response = new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "X-PAYMENT-RESPONSE": legacySettlement },
  });

  const decorated = await decorateLegacyResponseForV2(response, true);
  assert.equal(decorated.status, 200);
  assert.deepEqual(await decorated.json(), { ok: true });
  assert.deepEqual(decodePaymentHeader(decorated.headers.get("PAYMENT-RESPONSE") ?? ""), {
    success: true,
    transaction: `0x${"cd".repeat(32)}`,
    network: "eip155:8453",
  });
});

test("the deep-signal x402 route wires the dual-protocol bridge", () => {
  const source = readFileSync(
    new URL("../app/api/agent/deep-signal/x402/route.ts", import.meta.url),
    "utf8",
  );
  assert.match(source, /paymentSignatureV2ToV1/);
  assert.match(source, /decorateLegacyResponseForV2/);
  assert.match(source, /const legacyPOST =/);
  assert.match(source, /export async function POST/);
  assert.match(source, /PAYMENT-SIGNATURE/);
});
