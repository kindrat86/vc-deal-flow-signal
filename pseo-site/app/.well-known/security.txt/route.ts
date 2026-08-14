/**
 * RFC 9116, `/.well-known/security.txt`
 *
 * Standard machine-readable contact for security disclosures. Some agents
 * (and security-conscious crawlers) check this before scraping; publishing
 * it signals that the site is maintained and reachable.
 */

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

function expiresOneYearFromBuild(): string {
  const d = new Date();
  d.setUTCFullYear(d.getUTCFullYear() + 1);
  return d.toISOString();
}

export async function GET() {
  const body = `# Security disclosure policy for VC Deal Flow Signal
# https://signals.gitdealflow.com
#
# Report security issues by email. We aim to acknowledge within 72 hours.
# Please do not file public GitHub issues for security findings.

Contact: mailto:signals@gitdealflow.com
Expires: ${expiresOneYearFromBuild()}
Preferred-Languages: en
Canonical: ${SITE}/.well-known/security.txt
Policy: ${SITE}/about

# This service exposes a public, no-auth read-only API. There is no user
# authentication, no session storage, and no sensitive PII. Findings of
# interest are typically: SSRF in image proxies, prototype pollution in
# our build pipeline, or social-engineering vectors via our public APIs.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
