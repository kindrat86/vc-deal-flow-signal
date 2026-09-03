import type Stripe from "stripe";

import {
  TEARDOWN_OFFER_VERSION,
  buildTeardownConfirmation,
  buildTeardownOrder,
  teardownIdempotencyKey,
  type TeardownConfirmationPayload,
} from "./teardown-order";

interface TeardownConfirmationDependencies {
  send(payload: TeardownConfirmationPayload, idempotencyKey: string): Promise<{ id: string }>;
  record(sessionId: string, metadata: Record<string, string>): Promise<void>;
  now?: () => Date;
}

const RESEND_IDEMPOTENCY_WINDOW_MS = 24 * 60 * 60 * 1000;

export type TeardownConfirmationResult =
  | { status: "sent"; providerId: string; ticketRef: string }
  | { status: "already_sent"; providerId: string | null }
  | { status: "reconciliation_required"; ticketRef: string }
  | { status: "needs_clarification"; ticketRef: string }
  | { status: "ignored"; reason: string };

async function requireReconciliation(
  sessionId: string,
  ticketRef: string,
  deps: TeardownConfirmationDependencies,
): Promise<TeardownConfirmationResult> {
  await deps.record(sessionId, {
    teardown_offer_version: TEARDOWN_OFFER_VERSION,
    teardown_ticket_ref: ticketRef,
    teardown_confirmation_status: "reconciliation_required",
  });
  return { status: "reconciliation_required", ticketRef };
}

export async function processTeardownConfirmation(
  session: Stripe.Checkout.Session,
  deps: TeardownConfirmationDependencies,
): Promise<TeardownConfirmationResult> {
  const parsed = buildTeardownOrder(session);
  if (parsed.status === "rejected" || parsed.status === "internal_qa") {
    return { status: "ignored", reason: parsed.reason };
  }
  if (parsed.status === "needs_clarification") {
    await deps.record(session.id, {
      teardown_offer_version: TEARDOWN_OFFER_VERSION,
      teardown_due_at: parsed.dueAt,
      teardown_confirmation_status: "needs_clarification",
    });
    return { status: "needs_clarification", ticketRef: parsed.ticketRef };
  }

  if (session.metadata?.teardown_confirmation_status === "sent") {
    return {
      status: "already_sent",
      providerId: session.metadata.teardown_confirmation_resend_id ?? null,
    };
  }

  if (session.metadata?.teardown_confirmation_status === "reconciliation_required") {
    return { status: "reconciliation_required", ticketRef: parsed.order.ticketRef };
  }

  const payload = buildTeardownConfirmation(parsed.order);
  const idempotencyKey = teardownIdempotencyKey(session.id);
  const currentTime = (deps.now ?? (() => new Date()))();
  const sendingStatus = session.metadata?.teardown_confirmation_status === "sending";

  if (sendingStatus) {
    const persistedKey = session.metadata?.teardown_confirmation_idempotency_key;
    const persistedStart = session.metadata?.teardown_confirmation_started_at;
    const startedAt = persistedStart ? Date.parse(persistedStart) : Number.NaN;
    if (
      persistedKey !== idempotencyKey ||
      !Number.isFinite(startedAt) ||
      currentTime.getTime() - startedAt >= RESEND_IDEMPOTENCY_WINDOW_MS
    ) {
      return requireReconciliation(session.id, parsed.order.ticketRef, deps);
    }
  } else {
    await deps.record(session.id, {
      teardown_offer_version: TEARDOWN_OFFER_VERSION,
      teardown_ticket_ref: parsed.order.ticketRef,
      teardown_due_at: parsed.order.dueAt,
      teardown_confirmation_idempotency_key: idempotencyKey,
      teardown_confirmation_started_at: currentTime.toISOString(),
      teardown_confirmation_status: "sending",
    });
  }

  const provider = await deps.send(payload, idempotencyKey);
  if (!provider.id) throw new Error("Resend accepted teardown confirmation without an email ID");

  await deps.record(session.id, {
    teardown_offer_version: TEARDOWN_OFFER_VERSION,
    teardown_ticket_ref: parsed.order.ticketRef,
    teardown_due_at: parsed.order.dueAt,
    teardown_confirmation_idempotency_key: idempotencyKey,
    teardown_confirmation_started_at:
      session.metadata?.teardown_confirmation_started_at ?? currentTime.toISOString(),
    teardown_confirmation_resend_id: provider.id,
    teardown_confirmation_status: "sent",
  });

  return { status: "sent", providerId: provider.id, ticketRef: parsed.order.ticketRef };
}
