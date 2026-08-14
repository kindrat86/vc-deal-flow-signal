/**
 * /.well-known/gpc.json, Global Privacy Control signal advertisement.
 *
 * Publishers that respect the GPC header (`Sec-GPC: 1`) can advertise
 * their support via this well-known file per the W3C / GPC spec. The
 * file declares whether the publisher honors the signal and links to a
 * human-readable privacy policy that elaborates the implementation.
 *
 * Audit 2026-05-08 added this surface to dimension 17 Crawl/Bot governance.
 * Pairs with the existing /.well-known/compliance.json (broader posture)
 * and /.well-known/security-policy.json (security disclosures).
 *
 * Spec: https://globalprivacycontrol.github.io/gpc-spec/
 */

import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const runtime = "nodejs";

const BASE_URL = "https://signals.gitdealflow.com";

export async function GET() {
  return NextResponse.json(
    {
      // Required field, boolean flag that the site honors GPC signals.
      gpc: true,
      // Required ISO-8601 date of the most recent update.
      lastUpdate: new Date().toISOString().slice(0, 10),
      // Optional but encouraged, link to the human-readable privacy
      // policy with full GPC implementation details.
      version: 1,
      policy: `${BASE_URL}/privacy`,
      compliance: `${BASE_URL}/.well-known/compliance.json`,
      contact: "signals@gitdealflow.com",
    },
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800",
        "Access-Control-Allow-Origin": "*",
        "X-Robots-Tag": "index, follow",
      },
    },
  );
}
