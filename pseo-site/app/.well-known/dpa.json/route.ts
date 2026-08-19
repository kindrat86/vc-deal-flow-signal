/**
 * /.well-known/dpa.json, Data Processing Agreement pointer.
 *
 * F38 (2026-05-08). Machine-readable answer to the enterprise-procurement
 * question "where is your DPA?" Since GDPR Art. 28 requires a written DPA
 * with every processor, paid subscribers (we are the controller for
 * subscriber email + Stripe customer ID) need a clear path to executing one.
 *
 * Format follows the de-facto convention used by Vercel, Stripe, Resend,
 * and similar SaaS, a single JSON document pointing to: (a) standard
 * unsigned template, (b) negotiation contact, (c) signed-template request
 * email, (d) referenced subprocessor list and security/compliance docs.
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
      "@id": `${SITE}/.well-known/dpa.json`,
      name: "Data Processing Agreement (DPA), VC Deal Flow Signal",
      description:
        "Pointer to the GDPR Article 28 Data Processing Agreement that governs subscriber-PII processing by VC Deal Flow Signal acting as Controller and any subprocessor acting as Processor. The DPA is the legal companion to the compliance posture published at /.well-known/compliance.json.",
      license: "https://creativecommons.org/licenses/by/4.0/",
      publisher: {
        "@type": "Organization",
        "@id": "https://gitdealflow.com/#organization",
      },
      dateModified: new Date().toISOString().slice(0, 10),
      contractVersion: "2026-05-08.f38",

      controller: {
        legalName: "VC Deal Flow Signal (GitDealFlow)",
        contact: "signals@gitdealflow.com",
        rolesScope: [
          "Controller for subscriber email, Stripe customer ID, share tokens, scout-session metadata",
          "Processor (none), we engage no upstream controllers",
        ],
      },

      // Standard DPA template
      template: {
        url: `${SITE}/dpa`,
        format: "text/html",
        signedFormat:
          "On request, emailing signals@gitdealflow.com with company legal name returns a counter-signed PDF within 5 business days",
        countersignContact: "signals@gitdealflow.com",
        appliesTo: [
          "Insider Tier (€97/mo)",
          "Sharp Tier (€497/mo)",
          "Sector Sweep (€1,997 one-time)",
          "Agent Credits (€19 / 100 calls)",
          "Custom enterprise scopes",
        ],
      },

      // Standard Contractual Clauses (SCCs), required for EU→US data flows
      sccs: {
        applicable: true,
        version: "EU 2021/914 Module Two (Controller-to-Processor)",
        url: "https://commission.europa.eu/system/files/2021-06/1_en_annexe_acte_autonome_cp_part1_v5_0.pdf",
        notes:
          "Modules invoked when subprocessors process subscriber PII outside the EEA. See /.well-known/subprocessors.json for residency per processor.",
      },

      // Subject matter and duration
      processing: {
        subjectMatter:
          "Hosting, billing, transactional email, and analytics for paid subscribers of VC Deal Flow Signal.",
        duration: "Lifetime of the subscription + 12 months retention",
        nature:
          "Subscriber identification, billing, transactional email delivery, and pseudonymous product analytics",
        purpose:
          "Service operation; compliance with tax law (Stripe records); auditability for paid-tier disputes",
        dataCategories: ["email", "stripe_customer_id", "share_tokens"],
        dataSubjectCategories: ["paid subscribers", "free subscribers (email-only)"],
      },

      // International transfers
      transfers: {
        primaryRegion: "EU (Vercel fra1, Hetzner Helsinki, PostHog Frankfurt)",
        failoverRegion: "US (Vercel iad1, Stripe US, Resend US, Coinbase US)",
        safeguards: [
          "Standard Contractual Clauses (Module Two) for non-EEA processors",
          "Data Processing Agreements with all PII-processing subprocessors",
          "Field-level encryption at rest (Stripe, Resend, PocketBase)",
        ],
      },

      // Sub-references
      relatedSurfaces: [
        `${SITE}/dpa`,
        `${SITE}/.well-known/subprocessors.json`,
        `${SITE}/.well-known/compliance.json`,
        `${SITE}/.well-known/transparency.json`,
        `${SITE}/.well-known/security-policy.json`,
      ],
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "Access-Control-Allow-Origin": "*",
        "X-Robots-Tag": "index, follow",
        Link: `<${SITE}/dpa>; rel="alternate"; type="text/html"`,
      },
    },
  );
}
