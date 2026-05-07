// POST /api/mcp/share-approval
//
// Issues a short-lived (10 min) HMAC-signed approval token bound to a
// proposed `summary` string. Required by the share_result MCP tool (F21) to
// gate user-facing publishing-adjacent actions behind explicit human consent.
//
// This endpoint is INTENDED to be called from the user-facing /share-approve
// page after the user clicks "Approve". It also accepts CORS preflight from
// the same origin. We do NOT require authentication — the security property
// comes from the token being bound to a SHA-256 prefix of the summary, with
// a tight TTL.

import { NextRequest, NextResponse } from "next/server";
import { issueApprovalToken } from "@/lib/mcp/share-approval-token";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SAME_ORIGIN = "https://signals.gitdealflow.com";

function corsHeaders(origin: string | null): Record<string, string> {
  // Approval token issuance is same-site by default. We allow the canonical
  // host plus localhost for development.
  const allowed = [SAME_ORIGIN, "https://gitdealflow.com", "http://localhost:3000"];
  const allow = origin && allowed.includes(origin) ? origin : SAME_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "600",
    Vary: "Origin",
  };
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

export async function POST(req: NextRequest) {
  const cors = corsHeaders(req.headers.get("origin"));
  let summary = "";
  const contentType = req.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      const body = (await req.json()) as { summary?: unknown };
      summary = String(body?.summary ?? "").trim();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const params = new URLSearchParams(await req.text());
      summary = (params.get("summary") || "").trim();
    } else if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      summary = String(form.get("summary") || "").trim();
    } else {
      return NextResponse.json(
        {
          error: "invalid_request",
          error_description:
            "Content-Type must be application/json, application/x-www-form-urlencoded, or multipart/form-data",
        },
        { status: 400, headers: cors },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "invalid_request", error_description: "Body could not be parsed" },
      { status: 400, headers: cors },
    );
  }

  if (summary.length < 10 || summary.length > 200) {
    return NextResponse.json(
      {
        error: "invalid_request",
        error_description: "summary must be 10-200 characters",
      },
      { status: 400, headers: cors },
    );
  }

  const { token, expiresAt, ttlSeconds } = issueApprovalToken(summary);
  return NextResponse.json(
    {
      approval_token: token,
      expires_at: expiresAt,
      expires_in: ttlSeconds,
      kind: "share_result",
      // The agent must pass BOTH summary (verbatim) and approval_token to
      // share_result. The token only validates if the summary still hashes
      // to the value baked into the token.
      bound_to: "summary",
    },
    { status: 200, headers: cors },
  );
}
