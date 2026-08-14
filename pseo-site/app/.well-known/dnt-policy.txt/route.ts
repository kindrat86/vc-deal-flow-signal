/**
 * /.well-known/dnt-policy.txt, EFF Do-Not-Track Policy v1.0 compliance statement.
 *
 * F38 (2026-05-08). The EFF's DNT Policy (https://www.eff.org/dnt-policy)
 * is the de-facto standard interpretation of the W3C Do Not Track header
 * (DNT: 1). Most browsers no longer ship DNT, but Firefox, Brave, and
 * agent UAs still set it; declaring policy compliance is a low-cost trust
 * signal, especially with privacy-aware AI agents that probe this path.
 *
 * Statement intentionally near-verbatim from the EFF template (which is
 * the contract, the magic of the DNT Policy is that it is identical
 * across all signatories).
 */

export const runtime = "nodejs";
export const dynamic = "force-static";

const POLICY = `Do Not Track Compliance Policy
Version 1.0

VC Deal Flow Signal (signals.gitdealflow.com, gitdealflow.com) complies
with the Electronic Frontier Foundation's Do Not Track Policy v1.0.

The terms of the policy are incorporated by reference. The canonical text
of the EFF Do Not Track Policy is at:

  https://www.eff.org/dnt-policy

Briefly:

  1. We honor Do Not Track headers from any user agent that sends
     "DNT: 1" in HTTP requests, by not retaining personalised analytics,
     not joining their visit to a person profile, and not setting
     persistent identifiers on their device beyond what is strictly
     necessary to deliver the requested page.

  2. Pseudonymous, aggregate analytics (page-view counts, sector
     popularity) are still collected, these are not "tracking" under
     the EFF DNT Policy.

  3. Logs that incidentally capture IP addresses and user agents are
     retained for the standard Vercel default of 30 days for security
     and operational purposes (e.g. abuse mitigation), and are not
     joined to a person identity.

  4. We do not share data collected from DNT-asserting visitors with
     third parties for the purposes of behavioural advertising or
     re-identification.

  5. This policy does not exempt us from honoring valid GDPR / CCPA
     access, deletion, or opt-out requests, those operate independently.

Contact for DNT-related questions: signals@gitdealflow.com
Reachable at: https://signals.gitdealflow.com/privacy

Last updated: ${new Date().toISOString().slice(0, 10)}
`;

export async function GET() {
  return new Response(POLICY, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
      "x-robots-tag": "noindex",
    },
  });
}
