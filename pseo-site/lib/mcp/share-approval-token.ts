// HMAC-signed approval tokens for the `share_result` MCP tool.
//
// Why this exists (F21):
// `share_result` composes social-media post bodies and intent URLs. It does NOT
// post on behalf of the user — the destination network's compose UI is what
// finalizes the post. Even so, the tool is a *user-facing publishing surface*:
// a malicious or hallucinating agent could compose embarrassing or misleading
// copy and slip the intent URL into a chat with implicit confirmation. We want
// an explicit human-in-the-loop checkpoint.
//
// Mechanism: agent first calls share_result with no token → server returns a
// short-lived nonce + a `/share-approve?...` URL. The user opens the URL,
// reads the proposed summary on a server-rendered page, clicks Approve. The
// page fetches /api/mcp/share-approval (POST) which signs an approval token
// bound to a SHA-256 prefix of the proposed summary. The user pastes the
// token back to the agent. The agent retries share_result with the token.
// Server verifies signature, expiry, kind, and that the summary the agent
// passes still hashes to the same prefix.
//
// Token payload (compact, base64url-encoded JSON):
//   k  — kind, always "share_result"
//   h  — first 16 hex chars of SHA-256(summary), binds the token to the
//        approved content
//   e  — expiry (unix ms)
//   j  — random nonce (UUID), useful for future replay tracking
//
// Secret: reuses MCP_OAUTH_SECRET (already provisioned in prod for the OAuth
// token route). Distinct `kind` field prevents cross-namespace replay against
// /api/oauth/token.

import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const APPROVAL_TTL_MS = 10 * 60 * 1000; // 10 minutes

export interface ApprovalPayload {
  k: "share_result";
  h: string; // 16-hex-char SHA-256 prefix of summary
  e: number; // expiry unix ms
  j: string; // nonce
}

function getSecret(): string {
  const s =
    process.env.MCP_OAUTH_SECRET ||
    process.env.SHARE_TOKEN_SECRET ||
    process.env.VERIFY_SECRET;
  if (!s) {
    throw new Error(
      "MCP_OAUTH_SECRET (or SHARE_TOKEN_SECRET / VERIFY_SECRET) must be set",
    );
  }
  return s;
}

function b64url(buf: Buffer | string): string {
  return (typeof buf === "string" ? Buffer.from(buf) : buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromB64url(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

export function summaryHashPrefix(summary: string): string {
  return createHash("sha256").update(summary, "utf8").digest("hex").slice(0, 16);
}

export function issueApprovalToken(summary: string): {
  token: string;
  expiresAt: number;
  ttlSeconds: number;
} {
  const expiresAt = Date.now() + APPROVAL_TTL_MS;
  const payload: ApprovalPayload = {
    k: "share_result",
    h: summaryHashPrefix(summary),
    e: expiresAt,
    j: randomUUID(),
  };
  const body = b64url(JSON.stringify(payload));
  const sig = b64url(createHmac("sha256", getSecret()).update(body).digest());
  return {
    token: `${body}.${sig}`,
    expiresAt,
    ttlSeconds: Math.floor(APPROVAL_TTL_MS / 1000),
  };
}

export type ApprovalVerifyError =
  | "missing"
  | "malformed"
  | "bad_signature"
  | "wrong_kind"
  | "expired"
  | "summary_mismatch";

export type ApprovalVerifyResult =
  | { ok: true; payload: ApprovalPayload }
  | { ok: false; reason: ApprovalVerifyError };

export function verifyApprovalToken(
  token: string | undefined | null,
  expectedSummary: string,
): ApprovalVerifyResult {
  if (!token || typeof token !== "string") return { ok: false, reason: "missing" };
  const dot = token.indexOf(".");
  if (dot <= 0) return { ok: false, reason: "malformed" };
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expected = b64url(createHmac("sha256", getSecret()).update(body).digest());
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(sig);
  if (expectedBuf.length !== actualBuf.length) return { ok: false, reason: "bad_signature" };
  try {
    if (!timingSafeEqual(expectedBuf, actualBuf)) return { ok: false, reason: "bad_signature" };
  } catch {
    return { ok: false, reason: "bad_signature" };
  }

  let payload: ApprovalPayload;
  try {
    payload = JSON.parse(fromB64url(body).toString("utf8")) as ApprovalPayload;
  } catch {
    return { ok: false, reason: "malformed" };
  }
  if (payload.k !== "share_result") return { ok: false, reason: "wrong_kind" };
  if (typeof payload.e !== "number" || payload.e < Date.now()) {
    return { ok: false, reason: "expired" };
  }
  if (payload.h !== summaryHashPrefix(expectedSummary)) {
    return { ok: false, reason: "summary_mismatch" };
  }
  return { ok: true, payload };
}

export function approvalUrlFor(summary: string, baseUrl: string): string {
  // Pre-fills the /share-approve page with the proposed summary so the user
  // can review before minting a token.
  const u = new URL("/share-approve", baseUrl);
  u.searchParams.set("summary", summary);
  return u.toString();
}
