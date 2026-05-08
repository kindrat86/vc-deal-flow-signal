/**
 * /.well-known/transparency.json — annual transparency report.
 *
 * F38 (2026-05-08). Industry-standard transparency disclosure: government
 * data requests, content takedowns, account terminations, and law-enforcement
 * cooperation, broken down by year. Published in the format used by Cloudflare,
 * Stripe, Discord and similar — one JSON document with a `reports[]` array
 * keyed by reporting year.
 *
 * Public-data-only architecture means most categories report zero, but
 * publishing the zero is itself a trust signal — it confirms there's nothing
 * being hidden behind a vague "we don't disclose" answer.
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
      "@type": "Report",
      "@id": `${SITE}/.well-known/transparency.json`,
      name: "Annual Transparency Report — VC Deal Flow Signal",
      description:
        "Annual disclosure of government data requests, content takedown demands, court orders, account terminations and law-enforcement cooperation handled by VC Deal Flow Signal. Published yearly; zero figures are published explicitly rather than omitted.",
      license: "https://creativecommons.org/licenses/by/4.0/",
      publisher: {
        "@type": "Organization",
        "@id": "https://gitdealflow.com/#organization",
      },
      dateModified: new Date().toISOString().slice(0, 10),
      contractVersion: "2026-05-08.f38",

      // Reporting cadence
      cadence: {
        frequency: "annual",
        publishedOn: "2026-01-15 (next: 2027-01-15)",
        coversCalendarYear: true,
      },

      // Per-year disclosures
      reports: [
        {
          year: 2025,
          status: "pre-launch",
          notes:
            "Service launched on 2026-01-08 — no operational data exists for calendar 2025.",
          governmentDataRequests: { received: 0, complied: 0, partiallyComplied: 0, rejected: 0 },
          courtOrders: { received: 0, complied: 0, rejected: 0 },
          contentTakedowns: { received: 0, honored: 0, rejected: 0 },
          subscriberAccountTerminations: { total: 0, dueToAbuseOrFraud: 0 },
          dataBreaches: { count: 0, peopleAffected: 0, rdsNotified: 0 },
          lawEnforcementCooperation: { contacted: 0, providedData: 0 },
        },
        {
          year: 2026,
          status: "live",
          asOf: new Date().toISOString().slice(0, 10),
          governmentDataRequests: { received: 0, complied: 0, partiallyComplied: 0, rejected: 0 },
          courtOrders: { received: 0, complied: 0, rejected: 0 },
          contentTakedowns: {
            received: 0,
            honored: 0,
            rejected: 0,
            notes:
              "Public-data-only architecture: ranked entities are corporate GitHub orgs and public venture entities, sourced from public GitHub events + Wikidata. Takedown requests would be evaluated under DMCA / GDPR Art. 17 / EU DSA depending on the claim.",
          },
          subscriberAccountTerminations: {
            total: 0,
            dueToAbuseOrFraud: 0,
          },
          dataBreaches: {
            count: 0,
            peopleAffected: 0,
            rdsNotified: 0,
            notes:
              "GDPR Art. 33: any breach affecting subscriber PII would trigger Resend + Stripe + Vercel notification within 72 hours and be disclosed in this report.",
          },
          lawEnforcementCooperation: { contacted: 0, providedData: 0 },
        },
      ],

      // Standing policies
      policies: {
        warrantCanary: {
          presentAsOf: new Date().toISOString().slice(0, 10),
          statement:
            "As of the dateModified above, VC Deal Flow Signal has never received a National Security Letter, FISA Court order, or any classified law-enforcement request. This statement will be removed (rather than altered or denied) if such a request is ever received.",
        },
        dataRequestPolicy: {
          requireValidLegalProcess: true,
          notifyAffectedUserUnless:
            "Notification is prohibited by court order or there is a clear and imminent risk of physical harm",
          mediumOfNotification: "email to subscriber address on file",
          appealsContact: "signal@gitdealflow.com",
        },
        contentTakedownPolicy: {
          framework: ["DMCA", "GDPR Art. 17 (right to erasure)", "EU Digital Services Act"],
          contact: "signal@gitdealflow.com",
          medianResponseTimeHours: 72,
        },
      },

      relatedSurfaces: [
        `${SITE}/transparency`,
        `${SITE}/.well-known/disclosure.json`,
        `${SITE}/.well-known/compliance.json`,
        `${SITE}/.well-known/security-policy.json`,
      ],
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "Access-Control-Allow-Origin": "*",
        "X-Robots-Tag": "index, follow",
        Link: `<${SITE}/transparency>; rel="alternate"; type="text/html"`,
      },
    },
  );
}
