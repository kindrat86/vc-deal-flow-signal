/**
 * /api/schema.json — alias of /api/openapi.json.
 *
 * Several MCP catalogs and AI Action builders probe `schema.json` (older
 * convention) while OpenAPI 3.x adopters use `openapi.json`. Serving both at
 * the same content avoids the failure mode where a discovery scanner skips
 * us because it's looking under a different filename.
 *
 * This route 308-redirects to the canonical /api/openapi.json so caches stay
 * unified and a single body is the source of truth.
 */

import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.redirect(
    "https://signals.gitdealflow.com/api/openapi.json",
    308,
  );
}
