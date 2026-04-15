import "server-only";
import { createHmac } from "crypto";

const PREFIX = "gdf_";

/**
 * Generate a deterministic API key from a Stripe customer ID.
 * Same customer always gets the same key — no database needed.
 */
export function generateApiKey(customerId: string): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET environment variable is not set");
  const hmac = createHmac("sha256", secret)
    .update(`api-key:${customerId}`)
    .digest("hex")
    .slice(0, 32);
  return `${PREFIX}${hmac}`;
}

/**
 * Verify an API key by checking all active Stripe customers.
 * Returns the customer ID if valid, null otherwise.
 */
export function verifyApiKeyFormat(key: string): boolean {
  return key.startsWith(PREFIX) && key.length === PREFIX.length + 32;
}
