// Minimal OAuth 2.1 token issuance and verification for the public MCP server.
//
// Anthropic Connectors Directory requires OAuth 2.1 for HTTPS MCP servers, even
// for read-only public APIs. This module implements the smallest viable surface:
//
// - Anonymous "client_credentials" grant: any client can request a token; no auth needed.
// - Tokens are HMAC-SHA256 signed JWTs (no asymmetric keys; rotated via env var).
// - 1-hour TTL.
// - Optional scope claim for future per-tool gating.
//
// This is a public read-only API, the OAuth layer is purely for directory compliance.
// Do NOT add real authorization logic without revisiting the threat model.

import { createHmac, timingSafeEqual } from "node:crypto";

function getSecret(): string {
  const s = process.env.MCP_OAUTH_SECRET;
  if (!s) throw new Error("MCP_OAUTH_SECRET environment variable is not set");
  return s;
}
const ISSUER = "https://signals.gitdealflow.com";
const AUDIENCE = "vc-deal-flow-signal-mcp";
const TTL_SECONDS = 3600; // 1 hour

function base64url(input: Buffer | string): string {
  return (typeof input === "string" ? Buffer.from(input) : input)
    .toString("base64")
    .replace(/=+$/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function fromBase64url(input: string): Buffer {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(input.length + ((4 - (input.length % 4)) % 4), "=");
  return Buffer.from(b64, "base64");
}

export interface TokenClaims {
  iss: string;
  aud: string;
  sub: string; // anonymous client identifier (random per token)
  scope: string;
  iat: number;
  exp: number;
  jti: string;
}

export function issueToken(scope = "mcp:read"): { access_token: string; token_type: "Bearer"; expires_in: number; scope: string } {
  const now = Math.floor(Date.now() / 1000);
  const claims: TokenClaims = {
    iss: ISSUER,
    aud: AUDIENCE,
    sub: `anon:${crypto.randomUUID()}`,
    scope,
    iat: now,
    exp: now + TTL_SECONDS,
    jti: crypto.randomUUID(),
  };

  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64url(JSON.stringify(claims));
  const signing = `${header}.${payload}`;
  const signature = base64url(createHmac("sha256", getSecret()).update(signing).digest());

  return {
    access_token: `${signing}.${signature}`,
    token_type: "Bearer",
    expires_in: TTL_SECONDS,
    scope,
  };
}

export function verifyToken(token: string | undefined | null): TokenClaims | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;

  const expected = base64url(createHmac("sha256", getSecret()).update(`${header}.${payload}`).digest());
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(signature);
  if (expectedBuf.length !== actualBuf.length) return null;
  if (!timingSafeEqual(expectedBuf, actualBuf)) return null;

  let claims: TokenClaims;
  try {
    claims = JSON.parse(fromBase64url(payload).toString("utf-8"));
  } catch {
    return null;
  }

  if (claims.iss !== ISSUER || claims.aud !== AUDIENCE) return null;

  const now = Math.floor(Date.now() / 1000);
  if (claims.exp < now) return null;
  if (claims.iat > now + 60) return null; // small clock-skew tolerance

  return claims;
}

export function bearerFromHeader(authorization: string | null | undefined): string | null {
  if (!authorization) return null;
  const m = authorization.match(/^Bearer\s+([^\s]+)$/i);
  return m ? m[1] : null;
}
