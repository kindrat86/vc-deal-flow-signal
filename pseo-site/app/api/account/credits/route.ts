import { NextResponse } from "next/server";
import { extractBearer, parseApiKeyV2 } from "@/lib/api-key";
import { getCredits } from "@/lib/credits";

const PURCHASE_URL = "https://signals.gitdealflow.com/agents/credits";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization",
} as const;

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { ...CORS, "Access-Control-Max-Age": "86400" },
  });
}

export async function GET(request: Request) {
  const token = extractBearer(request.headers.get("authorization"));
  if (!token) {
    return NextResponse.json(
      {
        error: "missing_api_key",
        message: "Send Authorization: Bearer gdf_v2.<customerId>.<hmac>",
        purchaseUrl: PURCHASE_URL,
      },
      { status: 401, headers: CORS }
    );
  }

  const parsed = parseApiKeyV2(token);
  if (!parsed) {
    return NextResponse.json(
      { error: "invalid_api_key", purchaseUrl: PURCHASE_URL },
      { status: 401, headers: CORS }
    );
  }

  const credits = await getCredits(parsed.customerId);
  return NextResponse.json(
    {
      balance: credits.balance,
      purchased: credits.purchased,
      consumed: credits.consumed,
      lastConsumedAt: credits.lastConsumedAt,
      purchaseUrl: PURCHASE_URL,
    },
    {
      status: 200,
      headers: {
        ...CORS,
        "X-Credits-Balance": String(credits.balance),
        "Cache-Control": "no-store",
      },
    }
  );
}
