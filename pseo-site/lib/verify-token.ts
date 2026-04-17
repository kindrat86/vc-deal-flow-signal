import { createHmac } from "crypto";

const SECRET = process.env.VERIFY_SECRET || "vcdfs-verify-2026";

/** Generate an HMAC-SHA256 verification token for an email address. */
export function generateToken(email: string): string {
  return createHmac("sha256", SECRET).update(email.toLowerCase()).digest("hex");
}

/** Verify that a token matches the expected HMAC for the given email. */
export function verifyToken(email: string, token: string): boolean {
  const expected = generateToken(email);
  // Constant-time comparison
  if (expected.length !== token.length) return false;
  let result = 0;
  for (let i = 0; i < expected.length; i++) {
    result |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return result === 0;
}
