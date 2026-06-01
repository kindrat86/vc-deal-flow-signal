import { createHmac, randomBytes, timingSafeEqual } from "crypto";

function getSecret(): string {
  const s = process.env.VERIFY_SECRET;
  if (!s) throw new Error("VERIFY_SECRET environment variable is not set");
  return s;
}

/**
 * @deprecated Use signVerifyToken() / verifyVerifyToken() for new emissions.
 * Retained ONLY to keep already-emailed dashboard links working until they
 * naturally churn out of inboxes. Do not call from new code.
 */
export function generateToken(email: string): string {
  return createHmac("sha256", getSecret())
    .update(email.toLowerCase())
    .digest("hex");
}

/**
 * @deprecated Use verifyVerifyToken() for new code. Retained for grace-period
 * compatibility with the deterministic email-only HMAC tokens emitted before
 * the v2 payload-bound format was introduced.
 */
export function verifyToken(email: string, token: string): boolean {
  const expected = generateToken(email);
  if (expected.length !== token.length) return false;
  let result = 0;
  for (let i = 0; i < expected.length; i++) {
    result |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return result === 0;
}

// ---------------------------------------------------------------------------
// v2: payload-bound token. email + purpose + exp + nonce signed inside the
// HMAC, so leaked URLs expire and a single token can be revoked without
// rotating the global secret.
// ---------------------------------------------------------------------------

export type VerifyPurpose = "verify-subscribe" | "scout-dashboard" | "unsubscribe";

interface VerifyPayload {
  e: string; // email (lowercased)
  p: VerifyPurpose;
  x: number; // expiry (unix ms)
  n: string; // nonce (16 hex)
}

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromB64url(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

/**
 * Sign a payload-bound verification token. The returned `body.sig` string is
 * URL-safe and contains the email, purpose, expiry, and a unique nonce. The
 * nonce lets the consumer enforce single-use semantics.
 *
 * Default TTL: 7 days. Use shorter for sensitive purposes.
 */
export function signVerifyToken(opts: {
  email: string;
  purpose: VerifyPurpose;
  ttlSeconds?: number;
}): { token: string; nonce: string } {
  const ttl = (opts.ttlSeconds ?? 7 * 86_400) * 1000;
  const payload: VerifyPayload = {
    e: opts.email.toLowerCase(),
    p: opts.purpose,
    x: Date.now() + ttl,
    n: randomBytes(8).toString("hex"),
  };
  const body = b64url(JSON.stringify(payload));
  const sig = createHmac("sha256", getSecret()).update(body).digest("hex");
  return { token: `${body}.${sig}`, nonce: payload.n };
}

/**
 * Verify a v2 payload-bound token and return the bound email + nonce on
 * success. Returns null on bad signature, expired token, mismatched purpose,
 * or any parse failure.
 */
export function verifyVerifyToken(
  token: string,
  expectedPurpose: VerifyPurpose,
): { email: string; nonce: string } | null {
  if (typeof token !== "string") return null;
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!/^[0-9a-f]+$/i.test(sig)) return null;

  const expected = createHmac("sha256", getSecret())
    .update(body)
    .digest("hex");
  if (expected.length !== sig.length) return null;
  try {
    if (
      !timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(sig, "hex"))
    )
      return null;
  } catch {
    return null;
  }

  let payload: VerifyPayload;
  try {
    payload = JSON.parse(fromB64url(body).toString("utf8")) as VerifyPayload;
  } catch {
    return null;
  }
  if (
    typeof payload.e !== "string" ||
    typeof payload.p !== "string" ||
    typeof payload.x !== "number" ||
    typeof payload.n !== "string"
  ) {
    return null;
  }
  if (payload.p !== expectedPurpose) return null;
  if (payload.x < Date.now()) return null;
  return { email: payload.e, nonce: payload.n };
}
