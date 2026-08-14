import { createHmac, timingSafeEqual } from "crypto";

function getSecret(): string {
  const s = process.env.SHARE_TOKEN_SECRET || process.env.VERIFY_SECRET;
  if (!s) {
    throw new Error(
      "SHARE_TOKEN_SECRET (or VERIFY_SECRET) environment variable is not set",
    );
  }
  return s;
}

export interface SharePayload {
  /** Anonymous sharer identifier, handle, email hash, or "anon". */
  s: string;
  /** Expiration unix-ms. */
  e: number;
  /** Kind of share: "signal-card" | "scout" | "predict". */
  k: string;
}

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

export function signSharePayload(payload: SharePayload): string {
  const body = b64url(JSON.stringify(payload));
  const sig = createHmac("sha256", getSecret()).update(body).digest("hex");
  return `${body}.${sig}`;
}

export function verifyShareToken(token: string): SharePayload | null {
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", getSecret()).update(body).digest("hex");
  if (expected.length !== sig.length) return null;
  try {
    if (!timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(sig, "hex"))) return null;
  } catch {
    return null;
  }
  let payload: SharePayload;
  try {
    payload = JSON.parse(fromB64url(body).toString("utf8")) as SharePayload;
  } catch {
    return null;
  }
  if (typeof payload.e !== "number" || payload.e < Date.now()) return null;
  return payload;
}

/** Generate a share token that expires in `daysValid` days. */
export function generateShareToken(sharer: string, kind: SharePayload["k"], daysValid = 7): string {
  return signSharePayload({
    s: sharer || "anon",
    e: Date.now() + daysValid * 86_400_000,
    k: kind,
  });
}
