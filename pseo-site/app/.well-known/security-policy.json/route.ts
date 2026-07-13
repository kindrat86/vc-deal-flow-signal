/**
 * /.well-known/security-policy.json — JSON-structured companion to security.txt.
 *
 * Pass VII (2026-05-05). RFC 9116 (security.txt) is the canonical format,
 * but several AI agents and automated scanners default to JSON descriptors
 * for policy probes. Mirroring the same fields in JSON-LD lets bots resolve
 * disclosure contact in one fetch without parsing the security.txt syntax.
 *
 * Schema is informal (no formal RFC for JSON-form security.txt); we follow
 * the field names from RFC 9116 to keep tooling consistent.
 */

export const runtime = "nodejs";
export const dynamic = "force-static";

const SITE = "https://signals.gitdealflow.com";

function expiresOneYearFromBuild(): string {
  const d = new Date();
  d.setUTCFullYear(d.getUTCFullYear() + 1);
  return d.toISOString();
}

export async function GET() {
  const body = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VC Deal Flow Signal",
    url: SITE,
    contact: "mailto:signals@gitdealflow.com",
    expires: expiresOneYearFromBuild(),
    preferredLanguages: ["en"],
    canonical: `${SITE}/.well-known/security.txt`,
    policy: `${SITE}/about`,
    encryption: null,
    acknowledgments: null,
    hiring: null,
    csaf: null,
    notes: [
      "Public, no-auth read-only API. No user authentication, no session storage, no sensitive PII.",
      "Aim to acknowledge security disclosures within 72 hours.",
      "Do not file public GitHub issues for security findings; use email.",
    ],
    scopeOfInterest: [
      "SSRF in image proxies",
      "Prototype pollution in build pipeline",
      "Social-engineering vectors via public APIs",
    ],
    cleanCanonical: `${SITE}/.well-known/security-policy.json`,
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
      "x-robots-tag": "noindex",
      Link: `<${SITE}/.well-known/security.txt>; rel="canonical"`,
    },
  });
}
