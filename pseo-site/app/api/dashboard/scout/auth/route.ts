import { NextRequest, NextResponse } from "next/server";
import { verifyToken, verifyVerifyToken } from "@/lib/verify-token";
import {
  createScoutSessionToken,
  scoutSessionCookieOptions,
} from "@/lib/scout-session";
import { isValidEmail } from "@/lib/validation";

/**
 * GET /api/dashboard/scout/auth?email=...&token=...
 *
 * Trades a verify-token URL credential (v2 payload-bound, or legacy
 * deterministic-HMAC for grace-period compatibility) for an httpOnly
 * gdf_scout session cookie, then redirects to /dashboard/scout.
 *
 * This route exists because Server Components cannot write cookies; the
 * dashboard page redirects URL-token visits here so the token gets out of
 * the browser history / referer chain on first hit.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const email = (url.searchParams.get("email") || "").trim().toLowerCase();
  const token = url.searchParams.get("token") || "";

  const dashboardUrl = new URL("/dashboard/scout", request.url);
  const gateInvalidUrl = new URL(
    "/dashboard/scout?gate=invalid",
    request.url,
  );

  if (!email || !isValidEmail(email) || !token) {
    return NextResponse.redirect(gateInvalidUrl);
  }

  const v2 = verifyVerifyToken(token, "scout-dashboard");
  let authedEmail: string | null = null;
  if (v2 && v2.email === email) {
    authedEmail = v2.email;
  } else if (verifyToken(email, token)) {
    authedEmail = email;
  }

  if (!authedEmail) {
    return NextResponse.redirect(gateInvalidUrl);
  }

  const sessionToken = await createScoutSessionToken({ email: authedEmail });
  const response = NextResponse.redirect(dashboardUrl);
  response.cookies.set(scoutSessionCookieOptions(sessionToken));
  return response;
}
