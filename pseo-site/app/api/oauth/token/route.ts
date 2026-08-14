// OAuth 2.1 token endpoint, RFC 6749 §4.4 client_credentials grant.
//
// Issues short-lived bearer tokens for the public MCP server at /api/mcp/rpc.
// No client authentication is required, this endpoint is open. The OAuth layer
// exists purely to satisfy directory compliance (Anthropic Connectors etc.).
//
// Spec compliance:
// - Accepts application/x-www-form-urlencoded per RFC 6749
// - Returns RFC 6749 §5.1 success response shape
// - 1-hour token TTL
// - Optional scope param ignored beyond echoing back

import { NextRequest, NextResponse } from "next/server";
import { issueToken } from "@/lib/oauth/jwt";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED_GRANTS = new Set(["client_credentials"]);

function corsHeaders(origin: string | null): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

export async function POST(req: NextRequest) {
  const cors = corsHeaders(req.headers.get("origin"));
  let params: URLSearchParams;
  const contentType = req.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/x-www-form-urlencoded")) {
      params = new URLSearchParams(await req.text());
    } else if (contentType.includes("application/json")) {
      const body = await req.json();
      params = new URLSearchParams(body as Record<string, string>);
    } else {
      return NextResponse.json(
        { error: "invalid_request", error_description: "Content-Type must be application/x-www-form-urlencoded or application/json" },
        { status: 400, headers: cors }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "invalid_request", error_description: "malformed body" },
      { status: 400, headers: cors }
    );
  }

  const grantType = params.get("grant_type");
  if (!grantType || !ALLOWED_GRANTS.has(grantType)) {
    return NextResponse.json(
      { error: "unsupported_grant_type", error_description: "Only client_credentials is supported" },
      { status: 400, headers: cors }
    );
  }

  const requestedScope = params.get("scope") || "mcp:read";
  const token = issueToken(requestedScope);
  return NextResponse.json(token, { status: 200, headers: cors });
}

export async function GET(req: NextRequest) {
  return NextResponse.json(
    {
      error: "method_not_allowed",
      error_description: "Use POST with grant_type=client_credentials. See /.well-known/oauth-authorization-server for metadata.",
    },
    { status: 405, headers: corsHeaders(req.headers.get("origin")) }
  );
}
