/**
 * RFC 7033 — WebFinger
 *
 * Discovery endpoint that maps an `acct:` URI (or any URI) to a JSON Resource
 * Descriptor (JRD) with links to canonical resources for the subject.
 *
 * Picked up by Mastodon / fediverse agents, IndieWeb crawlers, and a handful
 * of API-discovery agents that follow ActivityPub conventions. Cheap to
 * publish; signals the site is structured and reachable.
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";
const APEX = "gitdealflow.com";

const CANONICAL_HANDLE_RESOURCE = {
  subject: `acct:gitdealflow@${APEX}`,
  aliases: [
    `https://${APEX}`,
    SITE,
    `${SITE}/about`,
    `${SITE}/AGENTS.md`,
    `acct:signal@${APEX}`,
    `acct:vcdealflowsignal@${APEX}`,
    `acct:thedatanerd@${APEX}`,
    "https://orcid.org/0009-0002-2222-4112",
    "https://www.wikidata.org/wiki/Q139376302",
  ],
  properties: {
    "http://schema.org/name": "VC Deal Flow Signal",
    "http://schema.org/alternateName": "GitDealFlow",
  },
  links: [
    { rel: "http://webfinger.net/rel/profile-page", type: "text/html", href: SITE },
    { rel: "http://schema.org/identifier", href: "https://www.wikidata.org/wiki/Q139376302" },
    { rel: "self", type: "application/json", href: `${SITE}/api/agents.json` },
    { rel: "http://docs.oasis-open.org/ns/xri/xrd-1.0", type: "application/json", href: `${SITE}/.well-known/api-catalog` },
    { rel: "http://www.opengis.net/spec/sla/1.0/sla", type: "application/json", href: `${SITE}/.well-known/agent-card.json` },
    { rel: "http://schema.org/EntryPoint", type: "application/json", href: `${SITE}/api/openapi.json` },
    { rel: "alternate", type: "text/markdown", href: `${SITE}/AGENTS.md` },
    { rel: "alternate", type: "text/plain", href: `${SITE}/llms.txt` },
    { rel: "alternate", type: "application/feed+json", href: `${SITE}/feed.json` },
    { rel: "alternate", type: "application/json", href: `${SITE}/.well-known/nodeinfo` },
  ],
};

const KNOWN_RESOURCES: Record<string, object> = {
  [`acct:gitdealflow@${APEX}`]: CANONICAL_HANDLE_RESOURCE,
  // Aliased handles all resolve to the same canonical descriptor (with the
  // `subject` swapped at request time below). Lets agents probing any of
  // signal@/vcdealflowsignal@/thedatanerd@ resolve to one entity.
  [`acct:signal@${APEX}`]: CANONICAL_HANDLE_RESOURCE,
  [`acct:vcdealflowsignal@${APEX}`]: CANONICAL_HANDLE_RESOURCE,
  [`acct:thedatanerd@${APEX}`]: CANONICAL_HANDLE_RESOURCE,
  [SITE]: {
    subject: SITE,
    aliases: [`https://${APEX}`, `acct:gitdealflow@${APEX}`],
    links: [
      { rel: "http://schema.org/name", value: "VC Deal Flow Signal" },
      { rel: "self", type: "application/json", href: `${SITE}/api/agents.json` },
      { rel: "alternate", type: "text/markdown", href: `${SITE}/AGENTS.md` },
      { rel: "alternate", type: "text/plain", href: `${SITE}/llms.txt` },
      { rel: "http://docs.oasis-open.org/ns/xri/xrd-1.0", href: `${SITE}/.well-known/api-catalog` },
    ],
  },
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const resource = url.searchParams.get("resource");

  if (!resource) {
    return NextResponse.json(
      {
        error: "Missing required query parameter `resource`. Try ?resource=acct:gitdealflow@gitdealflow.com",
      },
      { status: 400 },
    );
  }

  const jrd =
    KNOWN_RESOURCES[resource] ??
    (resource.startsWith(SITE) ? KNOWN_RESOURCES[SITE] : null);

  if (!jrd) {
    return NextResponse.json(
      { error: `Unknown resource: ${resource}` },
      { status: 404 },
    );
  }

  return NextResponse.json(jrd, {
    headers: {
      "Content-Type": "application/jrd+json; charset=utf-8",
      "Cache-Control":
        "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
