import "server-only";
import { createHash } from "crypto";
import { getStripe } from "./stripe";

/**
 * Replay protection for Solana credit top-ups.
 *
 * A Solana transaction signature is public and permanent on-chain, so without
 * a guard the same payment proof could be submitted repeatedly to mint credits
 * over and over. We record each redeemed signature so it can only grant credits
 * once.
 *
 * Storage: a bounded CSV of signature hashes on the paying customer's Stripe
 * metadata, same "Stripe metadata is the only store" posture as lib/credits.ts.
 *
 * ⚠️ SCOPE LIMITATION (devnet-grade): this is *per-customer*. It stops the
 * common case, a customer double-submitting their own proof, but does NOT
 * stop cross-customer replay (customer B submitting customer A's public
 * signature). Before enabling a mainnet pay-to wallet, move this ledger to a
 * shared global store (Upstash Redis via the Vercel Marketplace, keyed by the
 * raw signature). Tracked the same way credits.ts flags its own scaling cliff.
 */

const META_KEY = "sol_redeemed";
// Stripe caps a metadata value at 500 chars. 16-hex hashes + commas → keep a
// bounded most-recent window well under that.
const MAX_TRACKED = 25;

function sigHash(signature: string): string {
  return createHash("sha256").update(signature).digest("hex").slice(0, 16);
}

function parseList(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw.split(",").filter(Boolean);
}

export async function isSignatureRedeemed(
  customerId: string,
  signature: string,
): Promise<boolean> {
  const customer = await getStripe().customers.retrieve(customerId);
  if (customer.deleted) return false;
  const list = parseList(customer.metadata?.[META_KEY]);
  return list.includes(sigHash(signature));
}

export async function markSignatureRedeemed(
  customerId: string,
  signature: string,
): Promise<void> {
  const customer = await getStripe().customers.retrieve(customerId);
  if (customer.deleted) return;
  const list = parseList(customer.metadata?.[META_KEY]);
  const hash = sigHash(signature);
  if (list.includes(hash)) return;
  // Append, then trim to the most-recent window.
  const next = [...list, hash].slice(-MAX_TRACKED);
  await getStripe().customers.update(customerId, {
    metadata: { [META_KEY]: next.join(",") },
  });
}
