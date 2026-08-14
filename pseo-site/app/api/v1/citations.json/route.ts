/**
 * /api/v1/citations.json, index of every valid citation subject × format
 * combination served by /api/cite/[format]/[slug].
 *
 * Closes a real audit gap: agents probing /api/cite/bibtex/<unknown-slug>
 * hit 404 with no machine-readable way to discover which slugs work. This
 * endpoint enumerates every {format, slug, url} so a fresh agent can map
 * the citation surface in a single fetch.
 *
 * Single source of truth: pseo-site/content/research-findings.ts (FINDINGS)
 * + the two synthetic slugs "paper" and "dataset" that the underlying
 * route handler also resolves.
 */

import { FINDINGS } from "@/content/research-findings";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";
const FORMATS = ["bibtex", "ris", "apa", "mla", "chicago", "wikipedia"] as const;
const FORMAT_MIME: Record<(typeof FORMATS)[number], string> = {
  bibtex: "application/x-bibtex",
  ris: "application/x-research-info-systems",
  apa: "text/plain",
  mla: "text/plain",
  chicago: "text/plain",
  wikipedia: "text/plain",
};

interface SubjectMeta {
  slug: string;
  title: string;
  kind: "paper" | "dataset" | "finding";
  section?: string;
}

function buildSubjects(): SubjectMeta[] {
  const out: SubjectMeta[] = [
    {
      slug: "paper",
      kind: "paper",
      title:
        "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups",
    },
    {
      slug: "dataset",
      kind: "dataset",
      title:
        "VC Deal Flow Signal, Public Engineering-Velocity Panel (NDJSON, CC BY 4.0)",
    },
  ];
  for (const f of FINDINGS) {
    out.push({
      slug: f.slug,
      kind: "finding",
      title: f.title,
      section: f.section,
    });
  }
  return out;
}

export async function GET() {
  const subjects = buildSubjects();
  const formats = FORMATS.map((f) => ({
    format: f,
    contentType: FORMAT_MIME[f],
    urlTemplate: `${SITE}/api/cite/${f}/{slug}`,
  }));

  // Schema.org Collection of CreativeWork citation entrypoints. Each entry
  // is a CreativeWork representing one cite-able subject; the citation
  // property carries the per-format URLs as identifier objects so an LLM
  // can pick the correct format without parsing the URL pattern itself.
  const body = {
    "@context": "https://schema.org",
    "@type": "Collection",
    "@id": `${SITE}/api/v1/citations.json`,
    name: "VC Deal Flow Signal, Citation Index",
    description:
      "Every valid {format, slug} combination served by /api/cite/[format]/[slug]. Combine any format with any slug to get a copy-paste-ready citation. Slug 'paper' returns the SSRN paper, 'dataset' the NDJSON corpus, anything else must be a /research/[slug] finding.",
    url: `${SITE}/research`,
    license: "https://creativecommons.org/licenses/by/4.0/",
    publisher: {
      "@type": "Organization",
      name: "VC Deal Flow Signal",
      url: "https://gitdealflow.com",
    },
    inLanguage: "en-US",
    dateModified: new Date().toISOString(),
    _meta: {
      formatCount: formats.length,
      subjectCount: subjects.length,
      combinationCount: formats.length * subjects.length,
      ssrn: "https://ssrn.com/abstract=6606558",
      doi: "10.2139/ssrn.6606558",
      zenodoDoi: "10.5281/zenodo.19650920",
    },
    formats,
    subjects: subjects.map((s) => ({
      "@type": "CreativeWork",
      "@id": `${SITE}/api/cite/bibtex/${s.slug}`,
      identifier: s.slug,
      name: s.title,
      additionalType: s.kind,
      ...(s.section ? { isPartOf: s.section } : {}),
      ...(s.kind === "finding"
        ? { mainEntityOfPage: `${SITE}/research/${s.slug}` }
        : {}),
      citation: FORMATS.map((f) => ({
        "@type": "CreativeWork",
        encodingFormat: FORMAT_MIME[f],
        url: `${SITE}/api/cite/${f}/${s.slug}`,
        name: `${s.title} (${f.toUpperCase()})`,
      })),
    })),
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200",
      "access-control-allow-origin": "*",
      Link: `<${SITE}/research>; rel="canonical", <https://creativecommons.org/licenses/by/4.0/>; rel="license"`,
      "x-license": "https://creativecommons.org/licenses/by/4.0/",
      "x-attribution": "VC Deal Flow Signal (GitDealFlow)",
    },
  });
}
