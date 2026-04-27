import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { verifyApiKey } from "@/lib/api-key";

const COOKIE_NAME = "gdf_session";

function getBaseSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET environment variable is not set');
  return secret;
}

/** Derived key for session tokens — separate from magic link key for defense in depth. */
function getSessionSecret() {
  return new TextEncoder().encode(`session:${getBaseSecret()}`);
}

/** Derived key for magic link tokens — separate from session key. */
function getMagicLinkSecret() {
  return new TextEncoder().encode(`magic-link:${getBaseSecret()}`);
}

export interface SessionPayload {
  email: string;
  tier: "dashboard" | "insider";
  customerId: string;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSessionSecret());
}

export async function createMagicLinkToken(email: string): Promise<string> {
  return new SignJWT({ email, purpose: "magic-link" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(getMagicLinkSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    if (payload.purpose) return null; // Reject magic-link tokens
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function verifyMagicLinkToken(
  token: string
): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getMagicLinkSecret());
    if (payload.purpose !== "magic-link") return null;
    return { email: payload.email as string };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;

/**
 * Resolve the authenticated user from a request.
 * Tries the session cookie first, then falls back to Bearer API key.
 */
export async function getEmailFromRequest(
  req: NextRequest
): Promise<{ email: string; tier: "dashboard" | "insider" } | null> {
  const session = await getSession();
  if (session) return { email: session.email, tier: session.tier };

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const verified = verifyApiKey(token);
  if (!verified) return null;
  return { email: verified.email, tier: "insider" };
}

export function sessionCookieOptions(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  };
}
