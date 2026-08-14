// OAuth 2.0 Authorization Server Metadata, RFC 8414.
//
// Discovery endpoint for OAuth-aware MCP clients (Anthropic Connectors, etc.).
// Advertises only what we actually implement: client_credentials grant, no
// authorization endpoint, no client registration, no introspection.

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-static";
export const runtime = "nodejs";

const ISSUER = "https://signals.gitdealflow.com";

function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, max-age=86400",
    "Content-Type": "application/json",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    {
      issuer: ISSUER,
      token_endpoint: `${ISSUER}/api/oauth/token`,
      grant_types_supported: ["client_credentials"],
      response_types_supported: [],
      scopes_supported: ["mcp:read"],
      token_endpoint_auth_methods_supported: ["none"],
      service_documentation: `${ISSUER}/AGENTS.md`,
      ui_locales_supported: ["en"],
    },
    { headers: corsHeaders() }
  );
}
