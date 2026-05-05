import "server-only";
import { getStripe } from "./stripe";

/**
 * Per-request agent-tier credit ledger.
 *
 * Source of truth: Stripe customer metadata. No separate DB.
 *
 *   metadata.api_credits           — current balance, integer string
 *   metadata.api_credits_purchased — lifetime credits purchased, integer string
 *   metadata.api_credits_consumed  — lifetime credits consumed, integer string
 *   metadata.api_credits_last_at   — ISO timestamp of last decrement
 *
 * v1 traffic is low enough that we don't need optimistic locking; if two
 * concurrent requests race on the same customer, one decrement may be lost.
 * Move to a shared store (Upstash Redis via Vercel Marketplace) before this
 * matters at scale.
 */

function intMeta(meta: Record<string, string | null> | null | undefined, key: string): number {
  const raw = meta?.[key];
  if (typeof raw !== "string") return 0;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export interface CreditState {
  balance: number;
  purchased: number;
  consumed: number;
  lastConsumedAt: string | null;
}

export async function getCredits(customerId: string): Promise<CreditState> {
  const customer = await getStripe().customers.retrieve(customerId);
  if (customer.deleted) {
    return { balance: 0, purchased: 0, consumed: 0, lastConsumedAt: null };
  }
  const m = customer.metadata ?? {};
  return {
    balance: intMeta(m, "api_credits"),
    purchased: intMeta(m, "api_credits_purchased"),
    consumed: intMeta(m, "api_credits_consumed"),
    lastConsumedAt: m["api_credits_last_at"] ?? null,
  };
}

export async function addCredits(
  customerId: string,
  amount: number
): Promise<CreditState> {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error(`addCredits: amount must be a positive integer (got ${amount})`);
  }
  const current = await getCredits(customerId);
  const next: CreditState = {
    balance: current.balance + amount,
    purchased: current.purchased + amount,
    consumed: current.consumed,
    lastConsumedAt: current.lastConsumedAt,
  };
  await getStripe().customers.update(customerId, {
    metadata: {
      api_credits: String(next.balance),
      api_credits_purchased: String(next.purchased),
    },
  });
  return next;
}

export type ConsumeResult =
  | { ok: true; balance: number }
  | { ok: false; reason: "insufficient_credits"; balance: 0 };

export async function consumeCredit(customerId: string): Promise<ConsumeResult> {
  const current = await getCredits(customerId);
  if (current.balance < 1) {
    return { ok: false, reason: "insufficient_credits", balance: 0 };
  }
  const newBalance = current.balance - 1;
  const newConsumed = current.consumed + 1;
  await getStripe().customers.update(customerId, {
    metadata: {
      api_credits: String(newBalance),
      api_credits_consumed: String(newConsumed),
      api_credits_last_at: new Date().toISOString(),
    },
  });
  return { ok: true, balance: newBalance };
}
