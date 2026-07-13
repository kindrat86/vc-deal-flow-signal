/**
 * /.well-known/subprocessors.json — machine-readable subprocessor registry.
 *
 * F38 (2026-05-08). TrustSEO push: enterprise procurement and AI-agent
 * compliance probes consume this format directly so legal/security teams
 * can inventory data flow without a sales call. Mirrors the human page at
 * /subprocessors and the inline list inside /.well-known/compliance.json
 * but in a stable, agent-friendly DCAT-style descriptor.
 *
 * Entries are ordered by data-sensitivity tier (Stripe-grade payment
 * handlers first, analytics last). Each entry carries: legal name, role,
 * data classes processed, DPA URL, processing region, certification
 * footprint, and an `isPii` flag for fast filtering.
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 86400;

const SITE = "https://signals.gitdealflow.com";

interface Subprocessor {
  name: string;
  legalName: string;
  role: string;
  url: string;
  dpa: string;
  dataClasses: string[];
  isPii: boolean;
  region: string[];
  certifications: string[];
  notes?: string;
}

const SUBPROCESSORS: Subprocessor[] = [
  {
    name: "Stripe",
    legalName: "Stripe Payments Europe, Ltd.",
    role: "Payment processor (cards + ACH); subscription billing; tax",
    url: "https://stripe.com",
    dpa: "https://stripe.com/legal/dpa",
    dataClasses: ["payment_card_pan", "billing_email", "subscriber_name", "billing_address"],
    isPii: true,
    region: ["EU", "US"],
    certifications: ["PCI-DSS Level 1", "SOC 2 Type II", "ISO 27001"],
    notes:
      "We never see PAN; Stripe.js tokenises card data client-side. Subscriber email + tax address pass through us briefly during checkout but are stored only on Stripe.",
  },
  {
    name: "Vercel",
    legalName: "Vercel Inc.",
    role: "Hosting, CDN, edge compute, log retention",
    url: "https://vercel.com",
    dpa: "https://vercel.com/legal/dpa",
    dataClasses: ["request_logs", "ip_address", "user_agent"],
    isPii: true,
    region: ["EU (fra1 primary)", "US (iad1 failover)"],
    certifications: ["SOC 2 Type II", "ISO 27001", "GDPR-aligned"],
    notes:
      "Default 30-day log retention; we run no PII collection in app logs (subscriber email only flows to Resend/Stripe, not to Vercel logs).",
  },
  {
    name: "Resend",
    legalName: "Resend Software Inc.",
    role: "Transactional email + audience management",
    url: "https://resend.com",
    dpa: "https://resend.com/legal/dpa",
    dataClasses: ["subscriber_email", "engagement_events"],
    isPii: true,
    region: ["US (Tigris primary)", "EU"],
    certifications: ["SOC 2 Type II"],
    notes:
      "All weekly digest, drip and book-funnel email flows. Audience hygiene gated by lib/excluded-emails.mjs.",
  },
  {
    name: "PocketBase (self-hosted)",
    legalName: "GitDealFlow (operator); Hetzner Online GmbH (infra)",
    role: "Subscriber records, share-tokens, scout sessions",
    url: "https://hetzner.com",
    dpa: "https://www.hetzner.com/legal/data-processing-agreement",
    dataClasses: ["subscriber_email", "stripe_customer_id", "share_tokens"],
    isPii: true,
    region: ["EU (Hetzner Helsinki)"],
    certifications: ["ISO 27001 (Hetzner)", "GDPR-aligned"],
    notes:
      "Hosted on a single Hetzner VPS with full-disk encryption + TLS-only access. Backup snapshots retained 7 days inside the same region.",
  },
  {
    name: "Coinbase Developer Platform",
    legalName: "Coinbase, Inc.",
    role: "x402 facilitator + CDP Server Wallet for paid agent endpoint",
    url: "https://www.coinbase.com",
    dpa: "https://www.coinbase.com/legal/privacy",
    dataClasses: ["wallet_addresses", "transaction_metadata"],
    isPii: false,
    region: ["US"],
    certifications: ["SOC 1 Type II", "SOC 2 Type II"],
    notes:
      "Used only by /api/agent/deep-signal/x402 — wallets are paying agents, not human end users. No PII passes through this leg.",
  },
  {
    name: "PostHog (EU Cloud)",
    legalName: "PostHog Inc.",
    role: "Product analytics; no PII; person profiles identified-only",
    url: "https://posthog.com",
    dpa: "https://posthog.com/dpa",
    dataClasses: ["pseudonymous_session_id", "page_view_events"],
    isPii: false,
    region: ["EU (Frankfurt)"],
    certifications: ["SOC 2 Type II", "GDPR-aligned"],
    notes:
      "EU instance only; persistence: 'memory' (no localStorage cookies); person_profiles: 'identified_only' (anon visitors never get a profile).",
  },
  {
    name: "GitHub",
    legalName: "GitHub, Inc.",
    role: "Source data: public commit + actor + repo events",
    url: "https://github.com",
    dpa: "https://docs.github.com/en/site-policy/privacy-policies",
    dataClasses: ["public_github_events"],
    isPii: false,
    region: ["US"],
    certifications: ["SOC 1 Type II", "SOC 2 Type II", "ISO 27001"],
    notes:
      "We consume the public GitHub events API only — no private repo access, no OAuth-scoped user data.",
  },
  {
    name: "Cloudflare",
    legalName: "Cloudflare, Inc.",
    role: "DNS resolver + DDoS shield in front of apex marketing site",
    url: "https://cloudflare.com",
    dpa: "https://www.cloudflare.com/cloudflare-customer-dpa/",
    dataClasses: ["request_metadata", "ip_address"],
    isPii: true,
    region: ["Global anycast"],
    certifications: ["SOC 2 Type II", "ISO 27001", "PCI-DSS"],
    notes:
      "Apex (gitdealflow.com) sits behind Cloudflare DNS only; signals.gitdealflow.com is Vercel-direct.",
  },
  {
    name: "Anthropic",
    legalName: "Anthropic PBC",
    role: "LLM inference for /api/answer + /api/ask summarisation",
    url: "https://anthropic.com",
    dpa: "https://www.anthropic.com/legal/dpa",
    dataClasses: ["query_text"],
    isPii: false,
    region: ["US"],
    certifications: ["SOC 2 Type II", "ISO 27001"],
    notes:
      "Public Q&A queries only. Zero retention via API workspace setting; user data never used for training (Anthropic API ToS).",
  },
];

export async function GET() {
  const body = {
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    "@id": `${SITE}/.well-known/subprocessors.json`,
    name: "Subprocessor Registry — VC Deal Flow Signal",
    description:
      "Machine-readable list of every third-party processor that handles VC Deal Flow Signal data, ordered by sensitivity tier. Companion to the human-readable page at /subprocessors and the GDPR posture in /.well-known/compliance.json.",
    license: "https://creativecommons.org/licenses/by/4.0/",
    publisher: { "@type": "Organization", "@id": "https://gitdealflow.com/#organization" },
    dateModified: new Date().toISOString().slice(0, 10),
    contractVersion: "2026-05-08.f38",
    notificationPolicy: {
      method: "Email to all paid subscribers",
      channel: "signals@gitdealflow.com → audience broadcast",
      noticePeriodDays: 30,
      changelogUrl: `${SITE}/changelog`,
      details:
        "We will email all paid subscribers at least 30 days before any new subprocessor that processes subscriber PII is engaged, except in cases of emergency security or fraud response (in which case notice is best-effort and within 7 days).",
    },
    summary: {
      total: SUBPROCESSORS.length,
      processingPii: SUBPROCESSORS.filter((s) => s.isPii).length,
      euResidencyPrimary: SUBPROCESSORS.filter((s) =>
        s.region.some((r) => r.toLowerCase().includes("eu")),
      ).length,
    },
    subprocessors: SUBPROCESSORS,
    relatedSurfaces: [
      `${SITE}/.well-known/compliance.json`,
      `${SITE}/.well-known/dpa.json`,
      `${SITE}/.well-known/transparency.json`,
      `${SITE}/subprocessors`,
      `${SITE}/dpa`,
      `${SITE}/privacy`,
    ],
  };
  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "index, follow",
      Link: `<${SITE}/subprocessors>; rel="alternate"; type="text/html"`,
    },
  });
}
