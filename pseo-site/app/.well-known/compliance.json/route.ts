/**
 * /.well-known/compliance.json — enterprise-procurement compliance descriptor.
 *
 * Many AI-procurement and enterprise-security workflows now probe a
 * .well-known/compliance.json (or security.json) before approving an external
 * data source. This file enumerates exactly what compliance posture this
 * service has, so legal/security teams can evaluate without a sales call.
 *
 * Public-data-only architecture means most compliance regimes (HIPAA, PCI,
 * GDPR-as-controller-of-PII) are inapplicable. We disclose that fact
 * explicitly rather than leave it ambiguous.
 */

import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const runtime = "nodejs";
export const revalidate = 86400;

const BASE_URL = "https://signals.gitdealflow.com";

export async function GET() {
  return NextResponse.json(
    {
      service: {
        name: "VC Deal Flow Signal (GitDealFlow)",
        url: BASE_URL,
        operator: "GitDealFlow",
        contact: "signals@gitdealflow.com",
        security: `${BASE_URL}/.well-known/security.txt`,
        privacyPolicy: `${BASE_URL}/.well-known/ai-policy.json`,
      },

      // Data-handling posture
      dataPosture: {
        processesPii: false,
        processesEndUserPii: false,
        publicDataOnly: true,
        notes:
          "All ranked entities are corporate GitHub orgs and public-domain venture entities. Inputs are public GitHub events. No end-user records are stored beyond email + Stripe customer ID for paid subscribers (handled by Stripe and Resend; we do not collect KYC-grade PII).",
        sourcesOfTruth: [
          "GitHub public events API",
          "Wikidata public dump",
          "SSRN preprint repository",
        ],
      },

      // Regulatory regimes
      gdpr: {
        status: "applicable_low_risk",
        controllerForPaidSubscriberPii: true,
        processors: ["Stripe (payments)", "Resend (transactional email)", "Vercel (hosting)"],
        legalBasis:
          "Legitimate interest for public-data processing (Art. 6(1)(f)); contract for paid subscribers (Art. 6(1)(b))",
        dpa: "Available on request from signals@gitdealflow.com",
        dataResidency: ["EU (Vercel fra1, primary)", "US (Vercel iad1, failover)"],
        rightsContact: "signals@gitdealflow.com",
        retentionDefaults: {
          subscriberEmail: "Until unsubscribe + 12 months",
          stripeCustomerRecord: "Lifetime of subscription + 7 years (tax law)",
          analytics: "PostHog default 30 days, no PII",
        },
      },

      ccpa: {
        status: "applicable_low_risk",
        sellOrShare: false,
        opt_out_url: `${BASE_URL}/privacy`,
      },

      hipaa: {
        status: "not_applicable",
        reason: "No protected health information processed",
      },

      pci: {
        status: "not_applicable_offloaded",
        reason: "All card data handled by Stripe (PCI-DSS Level 1). We never see card numbers.",
      },

      soc2: {
        status: "not_certified",
        notes:
          "Sub-scale operation; SOC 2 Type II is on the roadmap once we have an enterprise pipeline. For interim assurance, we lean on Vercel SOC 2 Type II + Stripe SOC 2 Type II (data processors).",
        compensatingControls: [
          "Vercel-managed hosting + automatic deploys (Vercel SOC 2 Type II covers infra)",
          "Stripe-managed payments (Stripe SOC 2 Type II covers card data)",
          "Public-data-only inputs eliminate insider-threat exfiltration risk",
        ],
      },

      iso27001: {
        status: "not_certified",
        notes: "Same posture as SOC 2 — relying on subprocessor certifications.",
      },

      // AI / training posture
      aiUsage: {
        userDataUsedForTraining: false,
        modelInferenceProviders: [
          "Anthropic (occasional, for /api/ask + /api/answer summarisation; no user data persisted)",
        ],
        botPolicy: `${BASE_URL}/.well-known/ai-policy.json`,
        agentEntrypoints: `${BASE_URL}/.well-known/agent-card.json`,
      },

      // Subprocessors
      subprocessors: [
        { name: "Vercel", role: "Hosting + edge", url: "https://vercel.com/legal/dpa" },
        { name: "Stripe", role: "Payments", url: "https://stripe.com/legal/dpa" },
        { name: "Resend", role: "Transactional email", url: "https://resend.com/legal/dpa" },
        { name: "PostHog (EU)", role: "Product analytics, no PII", url: "https://posthog.com/dpa" },
        { name: "PocketBase (self-hosted Hetzner)", role: "Subscriber records", url: "https://hetzner.com/legal/" },
      ],

      // Incident response
      incidentResponse: {
        breachNotificationSla: "72 hours from confirmed breach (GDPR Art. 33)",
        responseEmail: "signals@gitdealflow.com",
        publicLog: `${BASE_URL}/corrections`,
        statusPage: BASE_URL,
      },

      // Vendor-questionnaire shortcuts
      enterprise: {
        contractsAndDpa: "signals@gitdealflow.com",
        ssoOptions: "Available on Sharp Tier (€497/mo) and custom enterprise scopes",
        offboarding:
          "Self-serve at /account or by emailing signals@gitdealflow.com. Subscriber data deleted within 30 days; Stripe records retained per tax law.",
      },

      // Document version
      complianceDocumentVersion: "1.0",
      lastReviewed: new Date().toISOString().slice(0, 10),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "Access-Control-Allow-Origin": "*",
        "X-Robots-Tag": "index, follow",
      },
    },
  );
}
