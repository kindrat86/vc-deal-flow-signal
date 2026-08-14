// OpenID Connect Discovery 1.0 alias for our OAuth 2.1 server.
//
// This server is OAuth 2.1 with the client_credentials grant, NOT a full
// OpenID Connect Provider. There is no id_token, no userinfo endpoint,
// no JWKS (tokens are HMAC-SHA256 signed; symmetric key only).
//
// We expose this path because many MCP/agent clients (Anthropic Connectors,
// Smithery, generic OIDC libraries) probe BOTH
// /.well-known/oauth-authorization-server AND
// /.well-known/openid-configuration before falling back. Mirroring the
// metadata at both paths maximizes compatibility without misrepresenting
// capability, OIDC-only fields are advertised as empty arrays so strict
// parsers see "unsupported" rather than failing to load the document.
//
// Self-contained: this is NOT an alias-via-import (durable rule:
// force-static + alias-via-import has bitten us before, see
// feedback_no_force_static_on_alias_via_import.md). Constants are
// duplicated from oauth-authorization-server/route.ts on purpose.

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
      subject_types_supported: ["public"],
      id_token_signing_alg_values_supported: [],
      response_modes_supported: [],
      claims_supported: ["sub", "aud", "iss", "iat", "exp", "scope", "jti"],
      "x-oauth-authorization-server": `${ISSUER}/.well-known/oauth-authorization-server`,
    },
    { headers: corsHeaders() }
  );
}
