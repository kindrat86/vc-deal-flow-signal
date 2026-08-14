import { NextResponse } from "next/server";
import { extractBearer, parseApiKeyV2 } from "@/lib/api-key";
import { consumeCredit, getCredits } from "@/lib/credits";
import { buildDeepSignal } from "@/lib/deep-signal-core";

const PURCHASE_URL = "https://signals.gitdealflow.com/agents/credits";
const X402_URL = "https://signals.gitdealflow.com/api/agent/deep-signal/x402";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
} as const;

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { ...CORS, "Access-Control-Max-Age": "86400" },
  });
}

interface DeepSignalRequest {
  name?: string;
}

export async function POST(request: Request) {
  const token = extractBearer(request.headers.get("authorization"));
  if (!token) {
    return NextResponse.json(
      {
        error: "missing_api_key",
        message:
          "Send Authorization: Bearer gdf_v2.<customerId>.<hmac>. Buy 100 credits for €19 at " +
          PURCHASE_URL +
          ", or pay per call in USDC on Base via " +
          X402_URL,
        purchaseUrl: PURCHASE_URL,
        x402Url: X402_URL,
      },
      { status: 401, headers: CORS }
    );
  }

  const parsed = parseApiKeyV2(token);
  if (!parsed) {
    return NextResponse.json(
      {
        error: "invalid_api_key",
        message:
          "API key signature did not validate. Re-check the value from the welcome email or get a fresh key at " +
          PURCHASE_URL,
        purchaseUrl: PURCHASE_URL,
      },
      { status: 401, headers: CORS }
    );
  }

  let body: DeepSignalRequest;
  try {
    body = (await request.json()) as DeepSignalRequest;
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "POST body must be JSON: { name: 'startup-name' }" },
      { status: 400, headers: CORS }
    );
  }

  const name = (body.name ?? "").trim();
  if (!name || name.length > 100) {
    return NextResponse.json(
      { error: "invalid_name", message: "Required: { name: string, 1-100 chars }" },
      { status: 400, headers: CORS }
    );
  }

  // Pre-flight balance check, return 402 BEFORE consuming so callers can top up.
  const credits = await getCredits(parsed.customerId);
  if (credits.balance < 1) {
    return NextResponse.json(
      {
        error: "insufficient_credits",
        message: `Out of credits. Balance: ${credits.balance}. Buy 100 more for €19 at ${PURCHASE_URL}.`,
        balance: credits.balance,
        purchaseUrl: PURCHASE_URL,
      },
      { status: 402, headers: CORS }
    );
  }

  const result = buildDeepSignal(name);

  // Only consume on a real hit. Misses are free, agents shouldn't pay for "not found".
  if (!result.found) {
    return NextResponse.json(
      { ...result, balance: credits.balance, charged: 0 },
      { status: 200, headers: { ...CORS, "X-Credits-Balance": String(credits.balance) } }
    );
  }

  const consume = await consumeCredit(parsed.customerId);
  if (!consume.ok) {
    return NextResponse.json(
      {
        error: "insufficient_credits",
        message: `Out of credits. Buy 100 more for €19 at ${PURCHASE_URL}.`,
        balance: 0,
        purchaseUrl: PURCHASE_URL,
      },
      { status: 402, headers: CORS }
    );
  }

  return NextResponse.json(
    { ...result, balance: consume.balance, charged: 1 },
    {
      status: 200,
      headers: {
        ...CORS,
        "X-Credits-Balance": String(consume.balance),
        "Cache-Control": "no-store",
      },
    }
  );
}
