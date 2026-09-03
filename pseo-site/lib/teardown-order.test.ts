import { strict as assert } from "node:assert";
import test from "node:test";
import type Stripe from "stripe";

import {
  TEARDOWN_CONFIRMATION_BCC,
  TEARDOWN_CONFIRMATION_FROM,
  TEARDOWN_CONFIRMATION_REPLY_TO,
  TEARDOWN_PAYMENT_LINK_ID,
  buildTeardownConfirmation,
  buildTeardownOrder,
  parseStartupCustomField,
} from "./teardown-order";
import { processTeardownConfirmation } from "./teardown-order-handler";

function session(overrides: Record<string, unknown> = {}): Stripe.Checkout.Session {
  return {
    id: "cs_live_teardown_fixture",
    object: "checkout.session",
    amount_total: 100,
    currency: "eur",
    created: 1_800_000_000,
    livemode: true,
    status: "complete",
    payment_status: "paid",
    payment_link: TEARDOWN_PAYMENT_LINK_ID,
    customer_details: { email: "buyer@example.org" },
    custom_fields: [
      {
        key: "startup",
        label: { custom: "Startup", type: "custom" },
        optional: false,
        type: "text",
        text: { value: "  Acme Labs  " },
      },
    ],
    metadata: { existing: "preserved" },
    ...overrides,
  } as unknown as Stripe.Checkout.Session;
}

test("exact-link complete paid EUR 1 checkout produces a ready teardown order", () => {
  const result = buildTeardownOrder(session());
  assert.equal(result.status, "ready");
  if (result.status !== "ready") return;
  assert.equal(result.order.startup, "Acme Labs");
  assert.equal(result.order.startupRaw, "  Acme Labs  ");
  assert.equal(result.order.dueAt, "2027-01-16T08:00:00.000Z");
  assert.match(result.order.ticketRef, /^TT-[A-F0-9]{10}$/);
});

test("startup parser trims outer whitespace and preserves the raw value", () => {
  assert.deepEqual(parseStartupCustomField(session().custom_fields), {
    raw: "  Acme Labs  ",
    value: "Acme Labs",
  });
  assert.equal(
    parseStartupCustomField(session({
      custom_fields: [{ key: "startup", type: "text", text: { value: "x".repeat(201) } }],
    }).custom_fields),
    null,
  );
  assert.equal(
    parseStartupCustomField(session({
      custom_fields: [{ key: "startup", type: "text", text: { value: "Acme\r\nBcc: other@example.org" } }],
    }).custom_fields),
    null,
  );
});

test("foreign same-price checkout and wrong trusted-link payment details are rejected", () => {
  assert.equal(buildTeardownOrder(session({ payment_link: "plink_foreign" })).status, "rejected");
  assert.equal(buildTeardownOrder(session({ amount_total: 101 })).status, "rejected");
  assert.equal(buildTeardownOrder(session({ currency: "usd" })).status, "rejected");
  assert.equal(buildTeardownOrder(session({ status: "open" })).status, "rejected");
  assert.equal(buildTeardownOrder(session({ payment_status: "unpaid" })).status, "rejected");
});

test("internal QA metadata and owner-controlled recipients are not customer orders", () => {
  assert.equal(buildTeardownOrder(session({ metadata: { internal_qa: "true" } })).status, "internal_qa");
  assert.equal(
    buildTeardownOrder(session({ customer_details: { email: "signals@gitdealflow.com" } })).status,
    "internal_qa",
  );
});

test("missing startup needs clarification rather than refund", () => {
  const result = buildTeardownOrder(session({ custom_fields: [] }));
  assert.equal(result.status, "needs_clarification");
  assert.ok(!JSON.stringify(result).toLowerCase().includes("refund"));
});

test("confirmation is canonical plain text and never asks for the captured startup again", () => {
  const result = buildTeardownOrder(session());
  assert.equal(result.status, "ready");
  if (result.status !== "ready") return;

  const confirmation = buildTeardownConfirmation(result.order);
  assert.equal(confirmation.from, TEARDOWN_CONFIRMATION_FROM);
  assert.equal(confirmation.replyTo, TEARDOWN_CONFIRMATION_REPLY_TO);
  assert.equal(confirmation.bcc, TEARDOWN_CONFIRMATION_BCC);
  assert.equal(confirmation.to, "buyer@example.org");
  assert.ok(confirmation.text.startsWith("Hi,"));
  assert.match(confirmation.text, /Startup: Acme Labs/);
  assert.match(confirmation.text, /Delivery due: 2027-01-16T08:00:00.000Z/);
  assert.match(confirmation.text, /No reply is required\./);
  assert.match(confirmation.text, /Optional: reply with the public GitHub organization URL or one sentence/);
  assert.match(confirmation.text, /\nMaryan K\.\n$/);
  assert.ok(!("html" in confirmation));
  assert.doesNotMatch(confirmation.text, /reply with the startup|automatic refund|four business hours|founder writes/i);
});

test("stable provider idempotency and recorded provider ID suppress replay", async () => {
  const checkout = session();
  const accepted = new Map<string, string>();
  let sendCalls = 0;
  const deps = {
    send: async (_payload: unknown, idempotencyKey: string) => {
      sendCalls += 1;
      const id = accepted.get(idempotencyKey) ?? "re_fixture";
      accepted.set(idempotencyKey, id);
      return { id };
    },
    record: async (_sessionId: string, metadata: Record<string, string>) => {
      checkout.metadata = { ...checkout.metadata, ...metadata };
    },
  };

  const first = await processTeardownConfirmation(checkout, deps);
  const replay = await processTeardownConfirmation(checkout, deps);
  assert.equal(first.status, "sent");
  assert.equal(first.providerId, "re_fixture");
  assert.equal(replay.status, "already_sent");
  assert.equal(sendCalls, 1);
  assert.equal(checkout.metadata?.existing, "preserved");
  assert.equal(checkout.metadata?.teardown_confirmation_resend_id, "re_fixture");
});

test("transient pre-acceptance failure remains retryable", async () => {
  const checkout = session();
  let attempts = 0;
  const keys: string[] = [];
  const deps = {
    send: async (_payload: unknown, idempotencyKey: string) => {
      attempts += 1;
      keys.push(idempotencyKey);
      if (attempts === 1) throw new Error("resend temporarily unavailable");
      return { id: "re_after_retry" };
    },
    record: async (_sessionId: string, metadata: Record<string, string>) => {
      checkout.metadata = { ...checkout.metadata, ...metadata };
    },
  };

  await assert.rejects(processTeardownConfirmation(checkout, deps), /temporarily unavailable/);
  assert.notEqual(checkout.metadata?.teardown_confirmation_status, "sent");
  const retried = await processTeardownConfirmation(checkout, deps);
  assert.equal(retried.status, "sent");
  assert.equal(attempts, 2);
  assert.equal(keys[0], keys[1]);
});

test("sending state is durable before provider invocation", async () => {
  const checkout = session();
  const order: string[] = [];
  await processTeardownConfirmation(checkout, {
    record: async (_sessionId, metadata) => {
      order.push(`record:${metadata.teardown_confirmation_status}`);
      checkout.metadata = { ...checkout.metadata, ...metadata };
    },
    send: async () => {
      order.push(`send:${checkout.metadata?.teardown_confirmation_status}`);
      return { id: "re_durable_start" };
    },
    now: () => new Date("2026-09-02T12:00:00.000Z"),
  });
  assert.deepEqual(order, ["record:sending", "send:sending", "record:sent"]);
});

test("post-acceptance metadata failure reuses the same provider key", async () => {
  const checkout = session();
  const keys: string[] = [];
  let failFinalRecord = true;
  const deps = {
    now: () => new Date("2026-09-02T12:00:00.000Z"),
    send: async (_payload: unknown, key: string) => {
      keys.push(key);
      return { id: "re_same_acceptance" };
    },
    record: async (_sessionId: string, metadata: Record<string, string>) => {
      if (metadata.teardown_confirmation_status === "sent" && failFinalRecord) {
        failFinalRecord = false;
        throw new Error("stripe metadata unavailable");
      }
      checkout.metadata = { ...checkout.metadata, ...metadata };
    },
  };
  await assert.rejects(processTeardownConfirmation(checkout, deps), /metadata unavailable/);
  assert.equal(checkout.metadata?.teardown_confirmation_status, "sending");
  const retry = await processTeardownConfirmation(checkout, deps);
  assert.equal(retry.status, "sent");
  assert.equal(keys.length, 2);
  assert.equal(keys[0], keys[1]);
});

test("stale uncertain provider acceptance never blind-resends", async () => {
  const checkout = session({
    metadata: {
      teardown_confirmation_status: "sending",
      teardown_confirmation_started_at: "2026-09-01T10:00:00.000Z",
      teardown_confirmation_idempotency_key: "teardown-confirmation-v2-cs_live_teardown_fixture",
    },
  });
  let sent = false;
  const result = await processTeardownConfirmation(checkout, {
    now: () => new Date("2026-09-02T12:00:01.000Z"),
    send: async () => {
      sent = true;
      return { id: "re_forbidden_duplicate" };
    },
    record: async (_sessionId, metadata) => {
      checkout.metadata = { ...checkout.metadata, ...metadata };
    },
  });
  assert.equal(result.status, "reconciliation_required");
  assert.equal(sent, false);
  assert.equal(checkout.metadata?.teardown_confirmation_status, "reconciliation_required");
});

test("missing startup records clarification state without sending", async () => {
  const checkout = session({ custom_fields: [] });
  let sent = false;
  const recorded: Array<Record<string, string>> = [];
  const result = await processTeardownConfirmation(checkout, {
    send: async () => {
      sent = true;
      return { id: "unexpected" };
    },
    record: async (_sessionId, metadata) => {
      recorded.push(metadata);
    },
  });

  assert.equal(result.status, "needs_clarification");
  assert.equal(sent, false);
  assert.equal(recorded[0]?.teardown_confirmation_status, "needs_clarification");
});
