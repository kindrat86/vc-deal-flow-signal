import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Scout session, issued after a valid v2 dashboard URL token is presented at
// /dashboard/scout. Lets the dashboard route accept a cookie on subsequent
// visits instead of forcing the URL token to live forever in browser history,
// referer logs, mailbox archives, etc.
//
// Separate from the paid-tier session in lib/auth.ts because scouts may not
// have a Stripe customer (the free tier does not require payment).

const COOKIE_NAME = "gdf_scout";

function getSecret(): Uint8Array {
  const base = process.env.AUTH_SECRET;
  if (!base) throw new Error("AUTH_SECRET environment variable is not set");
  return new TextEncoder().encode(`scout-session:${base}`);
}

interface ScoutSessionPayload {
  email: string;
}

export async function createScoutSessionToken(
  payload: ScoutSessionPayload,
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyScoutSessionToken(
  token: string,
): Promise<ScoutSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.email !== "string") return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export async function getScoutSession(): Promise<ScoutSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyScoutSessionToken(token);
}

export const SCOUT_SESSION_COOKIE_NAME = COOKIE_NAME;

export function scoutSessionCookieOptions(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  };
}
