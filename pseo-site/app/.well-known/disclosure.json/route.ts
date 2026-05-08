/**
 * /.well-known/disclosure.json — coordinated vulnerability disclosure policy.
 *
 * F38 (2026-05-08). The JSON companion to /.well-known/security.txt and
 * /.well-known/security-policy.json. Where security.txt is the canonical
 * RFC 9116 contact, this document is the *policy* that governs how a
 * researcher should report, what they can expect in response, and what
 * scope is in/out.
 *
 * Format aligns with disclose.io's machine-readable schema (the de-facto
 * coordinated-disclosure registry) so disclose.io can ingest this
 * descriptor into its public directory.
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 86400;

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  return NextResponse.json(
    {
      "@context": "https://schema.org",
      "@type": "DigitalDocument",
      "@id": `${SITE}/.well-known/disclosure.json`,
      name: "Coordinated Vulnerability Disclosure Policy — VC Deal Flow Signal",
      description:
        "Policy that governs how security researchers report, escalate, and disclose vulnerabilities affecting VC Deal Flow Signal services. Aligned with the disclose.io core terms; companion to /.well-known/security.txt and /.well-known/security-policy.json.",
      license: "https://creativecommons.org/licenses/by/4.0/",
      publisher: {
        "@type": "Organization",
        "@id": "https://gitdealflow.com/#organization",
      },
      dateModified: new Date().toISOString().slice(0, 10),
      contractVersion: "2026-05-08.f38",

      // disclose.io core fields
      "disclose-io": {
        version: "1.0",
        program_name: "VC Deal Flow Signal Coordinated Disclosure",
        program_url: `${SITE}/disclosure`,
        contact_email: "signal@gitdealflow.com",
        contact_form_url: `${SITE}/disclosure`,
        encryption_key_url: null,
        languages: ["en"],
        bounty: {
          enabled: false,
          notes:
            "Pre-revenue solo operation. We can't yet pay cash bounties but offer attribution in /security/hall-of-fame, a free Sharp Tier subscription for the year following responsible disclosure, and a personal thank-you note from the founder.",
        },
        safe_harbor: {
          terms: "disclose.io core",
          url: "https://github.com/disclose/disclose.io/blob/master/data/core-terms.md",
          summary:
            "We will not initiate legal action against researchers who in good faith follow this policy: do not access more data than necessary, avoid degrading service for other users, do not modify or destroy data, and give us reasonable time to respond before public disclosure.",
        },
      },

      // Scope
      scope: {
        in_scope: [
          "https://signals.gitdealflow.com (apex + all subpaths)",
          "https://gitdealflow.com (apex + all subpaths)",
          "https://gitdealflow-pb.fly.dev (PocketBase backend)",
          "@gitdealflow/mcp-signal (npm package)",
          "https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn (Chrome extension)",
        ],
        out_of_scope: [
          "Subprocessor systems (Stripe, Vercel, Resend, etc.) — please report via their own disclosure programs",
          "Findings on /content/* SEO copy ('we recommend X over Y' and similar editorial)",
          "Self-XSS and clickjacking on pages without sensitive actions",
          "Issues that require physical access to a victim's device or social engineering",
          "Rate-limit-only issues without a security impact",
          "Reports from automated scanners without manual validation",
          "Best-practice nits (missing security headers on static pages, weak ciphers we can't change due to TLS-13-pinning Vercel handles, etc.)",
        ],
      },

      // Acceptance categories
      accepted_classes: [
        "Authentication / authorisation bypass on /api/account/* or share-token endpoints",
        "Server-side request forgery via image proxies",
        "Stored XSS executable in a victim's authenticated context",
        "Remote code execution / command injection",
        "Information disclosure of subscriber PII or Stripe metadata",
        "Insecure direct object reference on share-token / receipts surfaces",
        "Subdomain takeover affecting any in-scope hostname",
      ],

      // Response SLAs
      sla: {
        ackHours: 72,
        triageBusinessDays: 5,
        fixMedianBusinessDays: 14,
        publicDisclosureCoordinatedDays: 90,
      },

      // Hall of Fame
      hallOfFame: {
        url: `${SITE}/security/hall-of-fame`,
        attributionPolicy:
          "Researchers may opt in to attribution by name + handle + URL on the public hall-of-fame page; opting out is honoured silently.",
        currentEntries: 0,
      },

      relatedSurfaces: [
        `${SITE}/disclosure`,
        `${SITE}/.well-known/security.txt`,
        `${SITE}/.well-known/security-policy.json`,
        `${SITE}/.well-known/transparency.json`,
      ],
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "Access-Control-Allow-Origin": "*",
        "X-Robots-Tag": "index, follow",
        Link: `<${SITE}/.well-known/security.txt>; rel="canonical"`,
      },
    },
  );
}
