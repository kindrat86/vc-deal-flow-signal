import "server-only";

/**
 * Solana payment verification — raw JSON-RPC, no SDK.
 *
 * We deliberately do NOT depend on `@solana/web3.js`. The JSON-RPC wire
 * protocol (`getTransaction` with `jsonParsed` encoding) is stable across
 * cluster versions, whereas the SDK surface drifts release-to-release. A few
 * `fetch` calls keep the dependency footprint at zero and the behaviour
 * predictable.
 *
 * Flow (parallel to the Base/x402 rail in
 * app/api/agent/deep-signal/x402/route.ts):
 *   1. Caller pays USDC-SPL to our recipient wallet on the configured cluster.
 *   2. Caller submits the resulting transaction signature to the /solana route.
 *   3. We pull the confirmed transaction and confirm that at least the required
 *      amount of the configured USDC mint actually landed in our wallet.
 *
 * Verification reads the token-balance deltas in transaction metadata rather
 * than parsing instructions — that way it works identically for `transfer`,
 * `transferChecked`, and any future transfer shape, and can't be fooled by a
 * no-op instruction that merely *mentions* our address.
 */

export interface SolanaPayConfig {
  /** Cluster RPC endpoint, e.g. https://api.devnet.solana.com */
  rpcUrl: string;
  /** Human label for the cluster, surfaced in 402 instructions. */
  cluster: string;
  /** SPL mint address of the accepted stablecoin (USDC). */
  usdcMint: string;
  /** Recipient wallet (token-account *owner*) base58 address. */
  payTo: string;
  /** Required payment amount in whole USDC (e.g. 19). */
  priceUsdc: number;
  /** Credits granted per successful payment. */
  creditsPerPurchase: number;
}

/**
 * Read configuration from the environment. Returns null if any required value
 * is missing so the route can answer 503 "not configured" instead of throwing
 * — mirroring the x402 rail's `notConfiguredHandler`.
 */
export function getSolanaPayConfig(): SolanaPayConfig | null {
  const rpcUrl = process.env.SOLANA_RPC_URL?.trim();
  const usdcMint = process.env.SOLANA_USDC_MINT?.trim();
  const payTo = process.env.SOLANA_PAY_TO?.trim();
  if (!rpcUrl || !usdcMint || !payTo) return null;

  const priceUsdc = Number(process.env.SOLANA_CREDITS_PRICE_USDC ?? "19");
  const creditsPerPurchase = Number(process.env.SOLANA_CREDITS_PER_PURCHASE ?? "100");
  if (!Number.isFinite(priceUsdc) || priceUsdc <= 0) return null;
  if (!Number.isInteger(creditsPerPurchase) || creditsPerPurchase <= 0) return null;

  return {
    rpcUrl,
    cluster: process.env.SOLANA_CLUSTER?.trim() || "devnet",
    usdcMint,
    payTo,
    priceUsdc,
    creditsPerPurchase,
  };
}

/** A Solana transaction signature is base58 and ~87–88 chars long. */
export function isValidSignature(sig: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{64,96}$/.test(sig);
}

export type SolanaVerifyResult =
  | { ok: true; signature: string; amountUsdc: number; payer: string | null }
  | {
      ok: false;
      reason:
        | "not_found"
        | "failed"
        | "insufficient_amount"
        | "wrong_recipient"
        | "rpc_error";
      received?: number;
      detail?: string;
    };

interface TokenBalance {
  accountIndex: number;
  mint: string;
  owner?: string;
  uiTokenAmount: { amount: string; decimals: number; uiAmount: number | null };
}

interface RpcTransaction {
  meta: {
    err: unknown;
    preTokenBalances?: TokenBalance[];
    postTokenBalances?: TokenBalance[];
  } | null;
  transaction: {
    message: { accountKeys: Array<{ pubkey: string; signer: boolean }> };
  };
}

/**
 * Verify that `signature` represents a confirmed payment of at least the
 * required USDC amount into our recipient wallet. Network/RPC failures and
 * not-yet-confirmed transactions both return a structured `{ ok: false }` —
 * callers retry rather than crashing.
 */
export async function verifySolanaPayment(
  signature: string,
  cfg: SolanaPayConfig,
): Promise<SolanaVerifyResult> {
  let tx: RpcTransaction | null;
  try {
    const res = await fetch(cfg.rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTransaction",
        params: [
          signature,
          {
            encoding: "jsonParsed",
            commitment: "confirmed",
            maxSupportedTransactionVersion: 0,
          },
        ],
      }),
    });
    if (!res.ok) {
      return { ok: false, reason: "rpc_error", detail: `RPC HTTP ${res.status}` };
    }
    const json = (await res.json()) as { result: RpcTransaction | null; error?: { message: string } };
    if (json.error) return { ok: false, reason: "rpc_error", detail: json.error.message };
    tx = json.result;
  } catch (err) {
    return { ok: false, reason: "rpc_error", detail: err instanceof Error ? err.message : String(err) };
  }

  // Null result = signature unknown to this cluster, or not yet confirmed.
  if (!tx) return { ok: false, reason: "not_found" };
  if (!tx.meta) return { ok: false, reason: "not_found" };
  if (tx.meta.err) return { ok: false, reason: "failed" };

  const pre = tx.meta.preTokenBalances ?? [];
  const post = tx.meta.postTokenBalances ?? [];

  // Map pre-balances by token account so we can diff against post-balances for
  // the exact accounts owned by us holding the accepted mint.
  //
  // Amounts are token base units (USDC = 6 decimals). We use Number, not BigInt:
  // even billions of USDC stay far below Number.MAX_SAFE_INTEGER (2^53), and the
  // project's TS target predates BigInt literals.
  const preByIndex = new Map<number, number>();
  let decimals = 6; // USDC default; overridden by the real balance entries below.
  for (const b of pre) {
    if (b.mint === cfg.usdcMint && b.owner === cfg.payTo) {
      preByIndex.set(b.accountIndex, Number(b.uiTokenAmount.amount));
      decimals = b.uiTokenAmount.decimals;
    }
  }

  let received = 0;
  let matchedRecipient = false;
  for (const b of post) {
    if (b.mint === cfg.usdcMint && b.owner === cfg.payTo) {
      matchedRecipient = true;
      decimals = b.uiTokenAmount.decimals;
      const before = preByIndex.get(b.accountIndex) ?? 0;
      const delta = Number(b.uiTokenAmount.amount) - before;
      if (delta > 0) received += delta;
    }
  }

  if (!matchedRecipient) {
    return { ok: false, reason: "wrong_recipient" };
  }

  const required = Math.round(cfg.priceUsdc * 10 ** decimals);
  const receivedUsdc = received / 10 ** decimals;
  if (received < required) {
    return { ok: false, reason: "insufficient_amount", received: receivedUsdc };
  }

  const payer = tx.transaction.message.accountKeys.find((k) => k.signer)?.pubkey ?? null;
  return { ok: true, signature, amountUsdc: receivedUsdc, payer };
}
