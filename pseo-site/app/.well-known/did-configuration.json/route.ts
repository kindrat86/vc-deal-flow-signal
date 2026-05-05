/**
 * /.well-known/did-configuration.json — DIF Well-Known DID Configuration.
 *
 * Pass VII (2026-05-05). Decentralized Identity Foundation (DIF) spec for
 * proving that a domain (signals.gitdealflow.com) controls a DID
 * (did:web:signals.gitdealflow.com). Companion to /.well-known/did.json.
 *
 * Used by AI agents and verifiable-credential issuers to confirm domain
 * authority before consuming claims signed by the DID. Without this, any
 * Bluesky / Microsoft Entra Verified ID / W3C VC consumer cannot bind
 * credential claims to the domain identity.
 *
 * Spec: https://identity.foundation/.well-known/resources/did-configuration/
 *
 * NOTE — This is the "minimal" form. A full proof requires a signed
 * domainLinkageCredential (JWT) with the DID's private key. We don't yet
 * issue VCs from this DID, so the linked-DIDs list alone is sufficient for
 * AI-agent discovery; a future pass can add the JWT once the keypair is
 * managed.
 */

export const runtime = "nodejs";
export const dynamic = "force-static";

const DID = "did:web:signals.gitdealflow.com";

export async function GET() {
  const body = {
    "@context":
      "https://identity.foundation/.well-known/did-configuration/v1",
    linked_dids: [DID],
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
