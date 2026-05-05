import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

const PREFIX_V1 = "gdf_";
const PREFIX_V2 = "gdf_v2.";

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET environment variable is not set");
  // `vercel env pull` historically writes \n inside quoted values which
  // dotenv parses as a real trailing newline. Trim defensively so HMACs
  // computed at issue time match HMACs at validation time even if the env
  // value was added with stray whitespace.
  return secret.trim();
}

export function generateApiKey(customerId: string): string {
  const hmac = createHmac("sha256", getSecret())
    .update(`api-key:${customerId}`)
    .digest("hex")
    .slice(0, 32);
  return `${PREFIX_V1}${hmac}`;
}

export function verifyApiKeyFormat(key: string): boolean {
  return key.startsWith(PREFIX_V1) && key.length === PREFIX_V1.length + 32;
}

/**
 * v2 API key — reversible, embeds the Stripe customer ID so the server can
 * authenticate per-request without iterating the customer list.
 *
 * Format: `gdf_v2.<customerId>.<hmac16>`
 *   customerId — literal Stripe customer ID (e.g. `cus_NffrFeUfNV2Hib`)
 *   hmac16     — first 16 hex chars of HMAC-SHA256(secret, "api-key-v2:" + customerId)
 *
 * Used for the per-request agent tier. v1 keys remain valid for legacy callers.
 */
export function generateApiKeyV2(customerId: string): string {
  const tag = createHmac("sha256", getSecret())
    .update(`api-key-v2:${customerId}`)
    .digest("hex")
    .slice(0, 16);
  return `${PREFIX_V2}${customerId}.${tag}`;
}

export interface ParsedApiKeyV2 {
  customerId: string;
}

export function parseApiKeyV2(key: string): ParsedApiKeyV2 | null {
  if (!key.startsWith(PREFIX_V2)) return null;
  const rest = key.slice(PREFIX_V2.length);
  const lastDot = rest.lastIndexOf(".");
  if (lastDot <= 0) return null;
  const customerId = rest.slice(0, lastDot);
  const tag = rest.slice(lastDot + 1);
  if (!/^cus_[A-Za-z0-9]+$/.test(customerId)) return null;
  if (!/^[a-f0-9]{16}$/.test(tag)) return null;

  // Without a secret, no key can validate. Return null (→ 401) instead of throwing (→ 500).
  if (!process.env.AUTH_SECRET) return null;

  const expected = createHmac("sha256", getSecret())
    .update(`api-key-v2:${customerId}`)
    .digest("hex")
    .slice(0, 16);
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(tag, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return { customerId };
}

/** Pull a bearer token out of an `Authorization` header value. */
export function extractBearer(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const m = authHeader.match(/^Bearer\s+(\S+)$/i);
  return m ? m[1] : null;
}
