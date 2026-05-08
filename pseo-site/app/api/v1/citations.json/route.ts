/**
 * /api/v1/citations.json — discoverable index of every valid citation URL.
 *
 * Closes audit gap 2026-05-08: agents that want to cite a finding could
 * only discover valid (format, slug) pairs by trial and error against
 * /api/cite/[format]/[slug]. This index enumerates them up-front so a
 * fresh agent can map the citation surface in one fetch.
 *
 * For each subject (paper, dataset, every research-finding slug) we emit:
 *   - canonical: the human-readable URL
 *   - citations: the six format-specific URLs (bibtex/ris/apa/mla/chicago/wikipedia)
 *   - schema.org `Citation` envelope so the surface itself is machine-typed
 *
 * Force-static: regenerates on build. Underlying findings list lives in
 * content/research-findings.ts and changes only on merge.
 */

import { FINDINGS } from "@/content/research-findings";

export const dynamic = "force-static";
export const runtime = "nodejs";
export const revalidate = 86400;

const SITE = "https://signals.gitdealflow.com";
const FORMATS = ["bibtex", "ris", "apa", "mla", "chicago", "wikipedia"] as const;

interface CitationEntry {
  slug: string;
  title: string;
  kind: "paper" | "dataset" | "finding";
  canonical: string;
  section?: string;
  citations: Record<(typeof FORMATS)[number], string>;
}

function buildEntry(
  slug: string,
  title: string,
  kind: CitationEntry["kind"],
  canonical: string,
  section?: string,
): CitationEntry {
  const citations = Object.fromEntries(
    FORMATS.map((f) => [f, `${SITE}/api/cite/${f}/${slug}`]),
  ) as CitationEntry["citations"];
  return { slug, title, kind, canonical, section, citations };
}

export async function GET() {
  const entries: CitationEntry[] = [
    buildEntry(
      "paper",
      "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups",
      "paper",
      "https://ssrn.com/abstract=6606558",
    ),
    buildEntry(
      "dataset",
      "VC Deal Flow Signal — Public Engineering-Velocity Panel (NDJSON, CC BY 4.0)",
      "dataset",
      `${SITE}/api/dataset.jsonl`,
    ),
    ...FINDINGS.map((f) =>
      buildEntry(
        f.slug,
        f.title,
        "finding",
        `${SITE}/research/${f.slug}`,
        f.section,
      ),
    ),
  ];

  const body = {
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    "@id": `${SITE}/api/v1/citations.json`,
    name: "VC Deal Flow Signal — Citation Index",
    description:
      "Discoverable index of every valid citation URL exposed under /api/cite/[format]/[slug]. Each subject (paper, dataset, every research finding) is enumerated with its six format-specific URLs (BibTeX, RIS, APA, MLA, Chicago, Wikipedia) so reference managers and AI agents can resolve citations without probing.",
    url: `${SITE}/api/v1/citations.json`,
    license: "https://creativecommons.org/licenses/by/4.0/",
    publisher: { "@type": "Organization", name: "VC Deal Flow Signal" },
    citation: "VC Deal Flow Signal (signals.gitdealflow.com), Q2 2026 data.",
    inLanguage: "en-US",
    summary: {
      totalSubjects: entries.length,
      formats: FORMATS,
      formatCount: FORMATS.length,
      totalCitationUrls: entries.length * FORMATS.length,
    },
    formatMimeTypes: {
      bibtex: "application/x-bibtex",
      ris: "application/x-research-info-systems",
      apa: "text/plain",
      mla: "text/plain",
      chicago: "text/plain",
      wikipedia: "text/plain",
    },
    formatDescriptions: {
      bibtex: "BibTeX — for LaTeX bibliographies and Zotero/Mendeley imports.",
      ris: "RIS — for EndNote, RefWorks, and most reference managers.",
      apa: "APA 7th edition — for psychology/social-science manuscripts.",
      mla: "MLA 9th edition — for humanities manuscripts.",
      chicago: "Chicago author-date — for history/economics manuscripts.",
      wikipedia: "Wikipedia <ref> {{cite journal}} / {{cite web}} markup — paste-ready.",
    },
    subjects: entries,
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200",
      "access-control-allow-origin": "*",
      Link: `<${SITE}/research>; rel="canonical"`,
      "X-License": "https://creativecommons.org/licenses/by/4.0/",
    },
  });
}
