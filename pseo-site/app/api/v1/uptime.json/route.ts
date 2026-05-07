// /api/v1/uptime.json — public status manifest (F35).
//
// Mirrors the standard public-status-page shape used by statuspage.io et al.
// (page / status / components / incidents) and adds Schema.org `Service`
// blocks per component so AEO/AIO crawlers can ingest the same data without
// custom adapters. Components and incidents are sourced from lib/uptime.ts —
// shared with the human-facing /uptime page for single-source-of-truth.

import { NextResponse } from "next/server";
import { buildUptimeManifest } from "@/lib/uptime";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const m = buildUptimeManifest();

  // Schema.org wrapper — every component is a Service whose serviceOperator
  // is our Organization. The status indicator maps to ActionStatusType.
  const schemaServices = m.components.map((c) => ({
    "@type": "Service",
    "@id": `${SITE}/uptime#${c.id}`,
    name: c.name,
    description: c.description,
    url: c.url,
    serviceType: c.group,
    additionalProperty: {
      "@type": "PropertyValue",
      name: "status",
      value: c.status,
    },
  }));

  const body = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${SITE}/api/v1/uptime.json`,
    headline: m.page.name,
    description: m.page.description,
    dateModified: m.generatedAt,
    publisher: {
      "@type": "Organization",
      "@id": "https://gitdealflow.com/#organization",
      name: "VC Deal Flow Signal",
      alternateName: "GitDealFlow",
      url: "https://gitdealflow.com",
    },
    page: m.page,
    status: m.status,
    metrics: m.metrics,
    components: m.components,
    incidents: m.incidents,
    services: schemaServices,
  };

  return NextResponse.json(body, {
    headers: {
      "Content-Type": "application/ld+json; charset=utf-8",
      // Re-validate every minute at the edge — status state can change
      // mid-day if we declare an incident; downstream caches may keep a
      // stale-while-revalidate copy for an hour.
      "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=3600",
      "X-Robots-Tag": "index, follow",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
