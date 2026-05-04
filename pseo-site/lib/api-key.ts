import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

const PREFIX_V1 = "gdf_";
const PREFIX_V2 = "gdf_v2_";

function hmacFor(customerId: string, length: number): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET environment variable is not set");
  return createHmac("sha256", secret)
    .update(`api-key:${customerId}`)
    .digest("hex")
    .slice(0, length);
}

function safeHmacFor(customerId: string, length: number): string | null {
  try { return hmacFor(customerId, length); } catch { return null; }
}

function b64urlEncode(str: string): string {
  return Buffer.from(str, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlDecode(str: string): string | null {
  try {
    const padded = str.replace(/-/g, "+").replace(/_/g, "/");
    return Buffer.from(padded, "base64").toString("utf8");
  } catch {
    return null;
  }
}

/**
 * Generate a deterministic API key from a Stripe customer ID.
 * v2 format: gdf_v2_<base64url(customerId)>.<hmac16>
 *   — embeds customerId so verifyApiKey can reverse-lookup without a database
 */
export function generateApiKey(customerId: string): string {
  const enc = b64urlEncode(customerId);
  const sig = hmacFor(customerId, 16);
  return `${PREFIX_V2}${enc}.${sig}`;
}

/**
 * Legacy v1 generator — deterministic 32-char HMAC, no embedded customer.
 * Kept for backward compatibility with any existing keys printed before v2.
 */
export function generateLegacyApiKey(customerId: string): string {
  const sig = hmacFor(customerId, 32);
  return `${PREFIX_V1}${sig}`;
}

export function verifyApiKeyFormat(key: string): boolean {
  if (key.startsWith(PREFIX_V2)) {
    const rest = key.slice(PREFIX_V2.length);
    const dot = rest.lastIndexOf(".");
    if (dot < 1) return false;
    const enc = rest.slice(0, dot);
    const sig = rest.slice(dot + 1);
    return /^[A-Za-z0-9_-]+$/.test(enc) && /^[a-f0-9]{16}$/.test(sig);
  }
  if (key.startsWith(PREFIX_V1)) {
    return key.length === PREFIX_V1.length + 32;
  }
  return false;
}

/**
 * Verify an API key and recover the Stripe customer ID it encodes.
 * Returns the customerId if the HMAC matches, null otherwise.
 *
 * Only v2 keys can be reversed without a database lookup.
 * v1 keys return null (no embedded customer info — would need a key→customer
 * mapping in a real DB).
 */
export function verifyApiKey(key: string): { customerId: string } | null {
  if (!verifyApiKeyFormat(key)) return null;
  if (!key.startsWith(PREFIX_V2)) return null;

  const rest = key.slice(PREFIX_V2.length);
  const dot = rest.lastIndexOf(".");
  const enc = rest.slice(0, dot);
  const sig = rest.slice(dot + 1);
  const customerId = b64urlDecode(enc);
  if (!customerId) return null;

  const expected = safeHmacFor(customerId, 16);
  if (!expected) return null;
  if (sig.length !== expected.length) return null;
  let equal = true;
  try {
    equal = timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return null;
  }
  if (!equal) return null;
  return { customerId };
}
