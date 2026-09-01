import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "x402-next";
import type { FacilitatorConfig } from "x402/types";
import { createCdpAuthHeaders } from "@coinbase/x402";
import { buildDeepSignal } from "@/lib/deep-signal-core";
import {
  decorateLegacyResponseForV2,
  paymentSignatureV2ToV1,
} from "@/lib/x402-v2-bridge";

const COINBASE_FACILITATOR_URL =
  "https://api.cdp.coinbase.com/platform/v2/x402" as const;
const X402_DEFAULT_FACILITATOR_URL = "https://x402.org/facilitator" as const;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PURCHASE_URL = "https://signals.gitdealflow.com/agents/credits";
const PRICE_USD = process.env.X402_PRICE ?? "$0.19";
const NETWORK = (process.env.X402_NETWORK ?? "base") as "base" | "base-sepolia";
const PAY_TO = process.env.X402_PAY_TO_ADDRESS as `0x${string}` | undefined;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-PAYMENT, PAYMENT-SIGNATURE",
  "Access-Control-Expose-Headers":
    "X-PAYMENT-RESPONSE, PAYMENT-REQUIRED, PAYMENT-RESPONSE",
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

const handler = async (request: NextRequest): Promise<NextResponse> => {
  let body: DeepSignalRequest;
  try {
    body = (await request.json()) as DeepSignalRequest;
  } catch {
    return NextResponse.json(
      {
        error: "invalid_json",
        message: "POST body must be JSON: { name: 'startup-name' }",
      },
      { status: 400, headers: CORS },
    );
  }

  const name = (body.name ?? "").trim();
  if (!name || name.length > 100) {
    return NextResponse.json(
      { error: "invalid_name", message: "Required: { name: string, 1-100 chars }" },
      { status: 400, headers: CORS },
    );
  }

  const result = buildDeepSignal(name);

  if (!result.found) {
    return NextResponse.json(
      { ...result, charged: 0, paymentMethod: "x402" },
      {
        status: 404,
        headers: {
          ...CORS,
          "X-Charged": "0",
          "Cache-Control": "no-store",
        },
      },
    );
  }

  return NextResponse.json(
    { ...result, charged: 1, paymentMethod: "x402", network: NETWORK },
    {
      status: 200,
      headers: {
        ...CORS,
        "X-Charged": "1",
        "X-Payment-Network": NETWORK,
        "Cache-Control": "no-store",
      },
    },
  );
};

const notConfiguredHandler = async (): Promise<NextResponse> =>
  NextResponse.json(
    {
      error: "x402_not_configured",
      message:
        "x402 payment is not yet configured. Set X402_PAY_TO_ADDRESS (and optionally X402_NETWORK, X402_PRICE) on the server, or buy credits at " +
        PURCHASE_URL,
      purchaseUrl: PURCHASE_URL,
      docs: "https://x402.org",
    },
    { status: 503, headers: CORS },
  );

// Coinbase mainnet facilitator wraps requests with CDP-signed JWT auth headers.
// For testnet (base-sepolia) the public x402.org facilitator is permissionless.
const facilitator: FacilitatorConfig =
  NETWORK === "base"
    ? {
        url: COINBASE_FACILITATOR_URL,
        createAuthHeaders: createCdpAuthHeaders(
          process.env.CDP_API_KEY_ID,
          process.env.CDP_API_KEY_SECRET,
        ),
      }
    : { url: X402_DEFAULT_FACILITATOR_URL };

const legacyPOST = PAY_TO
  ? withX402(
      handler,
      PAY_TO,
      {
        price: PRICE_USD,
        network: NETWORK,
        config: {
          description:
            "VC Deal Flow Signal, deep_signal lookup (commit velocity, contributor growth, sector rank, thesis sentence) for one named startup. Misses return 404 with no settlement.",
          mimeType: "application/json",
          maxTimeoutSeconds: 30,
        },
      },
      facilitator,
    )
  : notConfiguredHandler;

export async function POST(request: NextRequest): Promise<Response> {
  const paymentSignature = request.headers.get("PAYMENT-SIGNATURE");
  if (!paymentSignature) {
    return decorateLegacyResponseForV2(await legacyPOST(request), false);
  }

  let legacyRequest: NextRequest;
  try {
    const headers = new Headers(request.headers);
    headers.set("X-PAYMENT", paymentSignatureV2ToV1(paymentSignature, NETWORK));
    legacyRequest = new NextRequest(request, { headers });
  } catch {
    // Invalid or unsupported v2 payload: return a fresh dual-protocol challenge.
    return decorateLegacyResponseForV2(await legacyPOST(request), false);
  }

  return decorateLegacyResponseForV2(await legacyPOST(legacyRequest), true);
}
