type JsonObject = Record<string, unknown>;
type LegacyNetwork = "base" | "base-sepolia";

const V1_TO_V2_NETWORK: Record<LegacyNetwork, string> = {
  base: "eip155:8453",
  "base-sepolia": "eip155:84532",
};

function object(value: unknown, label: string): JsonObject {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as JsonObject;
}

function nonEmptyString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
  return value;
}

function positiveNumber(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be a positive number`);
  }
  return value;
}

function encodePaymentHeader(value: unknown): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
}

export function decodePaymentHeader(encoded: string): unknown {
  if (!encoded || !/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)) {
    throw new Error("payment header must be valid base64");
  }
  try {
    return JSON.parse(Buffer.from(encoded, "base64").toString("utf8")) as unknown;
  } catch {
    throw new Error("payment header must contain valid JSON");
  }
}

export function encodeV2PaymentRequiredFromV1(value: unknown): string {
  const challenge = object(value, "v1 payment-required body");
  if (challenge.x402Version !== 1) {
    throw new Error("payment-required body must use x402Version 1");
  }
  if (!Array.isArray(challenge.accepts) || challenge.accepts.length === 0) {
    throw new Error("payment-required body must include at least one accepted payment");
  }

  const accepts = challenge.accepts.map((raw, index) => {
    const requirement = object(raw, `accepts[${index}]`);
    const network = nonEmptyString(requirement.network, `accepts[${index}].network`);
    if (!(network in V1_TO_V2_NETWORK)) {
      throw new Error(`unsupported legacy x402 network: ${network}`);
    }

    const converted: JsonObject = {
      scheme: nonEmptyString(requirement.scheme, `accepts[${index}].scheme`),
      network: V1_TO_V2_NETWORK[network as LegacyNetwork],
      amount: nonEmptyString(
        requirement.maxAmountRequired,
        `accepts[${index}].maxAmountRequired`,
      ),
      asset: nonEmptyString(requirement.asset, `accepts[${index}].asset`),
      payTo: nonEmptyString(requirement.payTo, `accepts[${index}].payTo`),
      maxTimeoutSeconds: positiveNumber(
        requirement.maxTimeoutSeconds,
        `accepts[${index}].maxTimeoutSeconds`,
      ),
    };
    if (requirement.extra !== undefined && requirement.extra !== null) {
      converted.extra = object(requirement.extra, `accepts[${index}].extra`);
    }
    return converted;
  });

  const first = object(challenge.accepts[0], "accepts[0]");
  const paymentRequired: JsonObject = {
    x402Version: 2,
    resource: {
      url: nonEmptyString(first.resource, "accepts[0].resource"),
      description: typeof first.description === "string" ? first.description : undefined,
      mimeType: typeof first.mimeType === "string" ? first.mimeType : undefined,
    },
    accepts,
  };
  if (typeof challenge.error === "string") {
    paymentRequired.error = challenge.error.replace("X-PAYMENT", "PAYMENT-SIGNATURE");
  }

  return encodePaymentHeader(paymentRequired);
}

export function paymentSignatureV2ToV1(
  encoded: string,
  network: LegacyNetwork,
): string {
  const payment = object(decodePaymentHeader(encoded), "PAYMENT-SIGNATURE");
  if (payment.x402Version !== 2) {
    throw new Error("PAYMENT-SIGNATURE must use x402Version 2");
  }

  const accepted = object(payment.accepted, "PAYMENT-SIGNATURE.accepted");
  if (accepted.scheme !== "exact" || accepted.network !== V1_TO_V2_NETWORK[network]) {
    throw new Error("PAYMENT-SIGNATURE does not select the configured exact network");
  }

  const payload = object(payment.payload, "PAYMENT-SIGNATURE.payload");
  if (typeof payload.signature !== "string" || !payload.authorization) {
    throw new Error("PAYMENT-SIGNATURE must contain an EIP-3009 payload");
  }
  object(payload.authorization, "PAYMENT-SIGNATURE.payload.authorization");

  return encodePaymentHeader({
    x402Version: 1,
    scheme: "exact",
    network,
    payload,
  });
}

export function paymentResponseV1ToV2(encoded: string): string {
  const response = object(decodePaymentHeader(encoded), "X-PAYMENT-RESPONSE");
  const network = nonEmptyString(response.network, "X-PAYMENT-RESPONSE.network");
  if (!(network in V1_TO_V2_NETWORK)) {
    throw new Error(`unsupported legacy x402 network: ${network}`);
  }

  return encodePaymentHeader({
    ...response,
    network: V1_TO_V2_NETWORK[network as LegacyNetwork],
  });
}

function exposePaymentHeaders(headers: Headers): void {
  const exposed = new Map<string, string>();
  for (const name of (headers.get("Access-Control-Expose-Headers") ?? "").split(",")) {
    const trimmed = name.trim();
    if (trimmed) exposed.set(trimmed.toLowerCase(), trimmed);
  }
  for (const name of ["PAYMENT-REQUIRED", "PAYMENT-RESPONSE", "X-PAYMENT-RESPONSE"]) {
    exposed.set(name.toLowerCase(), name);
  }
  headers.set("Access-Control-Expose-Headers", [...exposed.values()].join(", "));
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, X-PAYMENT, PAYMENT-SIGNATURE",
  );
}

export async function decorateLegacyResponseForV2(
  response: Response,
  bridgedV2Signature: boolean,
): Promise<Response> {
  const headers = new Headers(response.headers);
  exposePaymentHeaders(headers);

  if (response.status === 402) {
    try {
      const body = (await response.clone().json()) as unknown;
      const paymentRequired = object(body, "legacy 402 body");
      if (paymentRequired.x402Version === 1) {
        headers.set("PAYMENT-REQUIRED", encodeV2PaymentRequiredFromV1(paymentRequired));
        headers.set("Cache-Control", "no-store");
      }
    } catch {
      // Preserve non-JSON or non-x402 402 responses unchanged.
    }
  }

  if (bridgedV2Signature) {
    const legacyPaymentResponse = headers.get("X-PAYMENT-RESPONSE");
    if (legacyPaymentResponse) {
      headers.set("PAYMENT-RESPONSE", paymentResponseV1ToV2(legacyPaymentResponse));
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
