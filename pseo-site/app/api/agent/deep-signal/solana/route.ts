import { NextResponse } from "next/server";
import { extractBearer, parseApiKeyV2 } from "@/lib/api-key";
import { addCredits, getCredits } from "@/lib/credits";
import {
  getSolanaPayConfig,
  isValidSignature,
  verifySolanaPayment,
  type SolanaPayConfig,
} from "@/lib/solana-pay";
import { isSignatureRedeemed, markSignatureRedeemed } from "@/lib/solana-redeem";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PURCHASE_URL = "https://signals.gitdealflow.com/agents/credits";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
} as const;

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { ...CORS, "Access-Control-Max-Age": "86400" },
  });
}

/** Machine-readable instructions an agent needs to pay and redeem. */
function paymentInstructions(cfg: SolanaPayConfig) {
  return {
    scheme: "solana-spl-transfer",
    network: cfg.cluster,
    cluster: cfg.cluster,
    asset: cfg.usdcMint,
    assetSymbol: "USDC",
    amount: cfg.priceUsdc,
    amountLabel: `${cfg.priceUsdc} USDC`,
    payTo: cfg.payTo,
    credits: cfg.creditsPerPurchase,
    howTo:
      `Transfer ${cfg.priceUsdc} USDC (SPL mint ${cfg.usdcMint}) to ${cfg.payTo} ` +
      `on Solana ${cfg.cluster}, then POST { "signature": "<txSignature>" } to this ` +
      `endpoint with header Authorization: Bearer gdf_v2.<customerId>.<hmac> to ` +
      `receive ${cfg.creditsPerPurchase} deep-signal credits.`,
  };
}

const notConfigured = () =>
  NextResponse.json(
    {
      error: "solana_not_configured",
      message:
        "Solana payment is not configured on this server. Set SOLANA_RPC_URL, " +
        "SOLANA_USDC_MINT and SOLANA_PAY_TO (optionally SOLANA_CLUSTER, " +
        "SOLANA_CREDITS_PRICE_USDC, SOLANA_CREDITS_PER_PURCHASE), or buy credits at " +
        PURCHASE_URL,
      purchaseUrl: PURCHASE_URL,
    },
    { status: 503, headers: CORS },
  );

// GET, discovery. Returns how to pay without requiring a key.
export async function GET() {
  const cfg = getSolanaPayConfig();
  if (!cfg) return notConfigured();
  return NextResponse.json(
    { accepts: [paymentInstructions(cfg)] },
    { status: 200, headers: CORS },
  );
}

interface RedeemRequest {
  signature?: string;
}

export async function POST(request: Request) {
  const cfg = getSolanaPayConfig();
  if (!cfg) return notConfigured();

  // Authenticate the caller, credits are granted to this customer.
  const token = extractBearer(request.headers.get("authorization"));
  const parsed = token ? parseApiKeyV2(token) : null;
  if (!parsed) {
    return NextResponse.json(
      {
        error: "invalid_api_key",
        message:
          "Send Authorization: Bearer gdf_v2.<customerId>.<hmac>. Credits are added to that account.",
        accepts: [paymentInstructions(cfg)],
      },
      { status: 401, headers: CORS },
    );
  }

  let body: RedeemRequest;
  try {
    body = (await request.json()) as RedeemRequest;
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: 'POST body must be JSON: { "signature": "<txSignature>" }' },
      { status: 400, headers: CORS },
    );
  }

  const signature = (body.signature ?? "").trim();
  if (!signature || !isValidSignature(signature)) {
    return NextResponse.json(
      {
        error: "invalid_signature",
        message: 'Required: { "signature": "<base58 Solana tx signature>" }',
        accepts: [paymentInstructions(cfg)],
      },
      { status: 400, headers: CORS },
    );
  }

  // Replay guard before spending an RPC round-trip.
  if (await isSignatureRedeemed(parsed.customerId, signature)) {
    const credits = await getCredits(parsed.customerId);
    return NextResponse.json(
      {
        error: "already_redeemed",
        message: "This signature has already been credited.",
        balance: credits.balance,
      },
      { status: 409, headers: CORS },
    );
  }

  const result = await verifySolanaPayment(signature, cfg);
  if (!result.ok) {
    switch (result.reason) {
      case "rpc_error":
        return NextResponse.json(
          { error: "rpc_error", message: "Could not reach the Solana cluster. Retry shortly.", detail: result.detail },
          { status: 502, headers: CORS },
        );
      case "not_found":
        return NextResponse.json(
          {
            error: "payment_not_found",
            message: "No confirmed transaction for that signature yet. Wait for confirmation and retry.",
            accepts: [paymentInstructions(cfg)],
          },
          { status: 402, headers: CORS },
        );
      case "failed":
        return NextResponse.json(
          { error: "transaction_failed", message: "That transaction failed on-chain; no credits granted." },
          { status: 422, headers: CORS },
        );
      case "wrong_recipient":
        return NextResponse.json(
          {
            error: "wrong_recipient",
            message: `That transaction did not pay ${cfg.payTo} in USDC.`,
            accepts: [paymentInstructions(cfg)],
          },
          { status: 422, headers: CORS },
        );
      case "insufficient_amount":
        return NextResponse.json(
          {
            error: "insufficient_amount",
            message: `Payment of ${result.received ?? 0} USDC is below the required ${cfg.priceUsdc} USDC.`,
            received: result.received ?? 0,
            required: cfg.priceUsdc,
            accepts: [paymentInstructions(cfg)],
          },
          { status: 402, headers: CORS },
        );
    }
  }

  // Reserve the signature first so a concurrent double-submit can't double-grant.
  // If the credit write then fails we surface 500; the buyer can retry (the
  // mark is idempotent and the grant hasn't happened).
  await markSignatureRedeemed(parsed.customerId, signature);

  let balance: number;
  try {
    const state = await addCredits(parsed.customerId, cfg.creditsPerPurchase);
    balance = state.balance;
  } catch (err) {
    console.error("solana top-up: addCredits failed after verification", {
      customerId: parsed.customerId,
      signature,
      err,
    });
    return NextResponse.json(
      { error: "credit_ledger_write_failed", message: "Payment verified but crediting failed. Contact support with your signature." },
      { status: 500, headers: CORS },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      credited: cfg.creditsPerPurchase,
      balance,
      amountUsdc: result.ok ? result.amountUsdc : cfg.priceUsdc,
      network: cfg.cluster,
      signature,
    },
    { status: 200, headers: { ...CORS, "Cache-Control": "no-store" } },
  );
}
