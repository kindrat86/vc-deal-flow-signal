import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

const PREFIX = "gdf_";

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET environment variable is not set");
  return secret;
}

/**
 * Generate a signed API key embedding email + customerId.
 * Format: gdf_<base64url(json)>.<hmac32>
 */
export function generateApiKey(customerId: string, email: string): string {
  const secret = getSecret();
  const payload = Buffer.from(JSON.stringify({ c: customerId, e: email })).toString("base64url");
  const hmac = createHmac("sha256", secret)
    .update(`api-key:${payload}`)
    .digest("hex")
    .slice(0, 32);
  return `${PREFIX}${payload}.${hmac}`;
}

/**
 * Verify a signed API key and return the embedded identity.
 * Mirrors the algorithm used in generateApiKey.
 */
export function verifyApiKey(key: string): { customerId: string; email: string } | null {
  if (!key.startsWith(PREFIX)) return null;
  const rest = key.slice(PREFIX.length);
  const dotIdx = rest.lastIndexOf(".");
  if (dotIdx === -1) return null;
  const payload = rest.slice(0, dotIdx);
  const providedHmac = rest.slice(dotIdx + 1);
  if (providedHmac.length !== 32) return null;

  const secret = getSecret();
  const expectedHmac = createHmac("sha256", secret)
    .update(`api-key:${payload}`)
    .digest("hex")
    .slice(0, 32);

  try {
    if (!timingSafeEqual(Buffer.from(providedHmac, "utf8"), Buffer.from(expectedHmac, "utf8"))) {
      return null;
    }
  } catch {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Record<string, unknown>;
    if (typeof data.c !== "string" || typeof data.e !== "string") return null;
    return { customerId: data.c, email: data.e };
  } catch {
    return null;
  }
}

export function verifyApiKeyFormat(key: string): boolean {
  return key.startsWith(PREFIX) && key.includes(".");
}
