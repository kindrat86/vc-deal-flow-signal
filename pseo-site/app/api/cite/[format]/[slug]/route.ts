/**
 * /api/cite/[format]/[slug], single-finding citation generator.
 *
 * Format options: bibtex, ris, apa, mla, chicago, wikipedia
 * Slug options: any /research/[slug] finding slug, or "paper" for the SSRN paper itself
 *
 * Returns text/plain so reference managers, scrapers, and Wikipedia editors
 * can curl it directly. Force-static, no per-request data.
 */

import { FINDINGS, getFindingBySlug } from "@/content/research-findings";

export const dynamic = "force-static";

const SITE = "https://signals.gitdealflow.com";
const SSRN_URL = "https://ssrn.com/abstract=6606558";
const PAPER_TITLE =
  "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups";

const FORMATS = ["bibtex", "ris", "apa", "mla", "chicago", "wikipedia"] as const;
type Format = (typeof FORMATS)[number];

export function generateStaticParams() {
  const slugs = ["paper", "dataset", ...FINDINGS.map((f) => f.slug)];
  const out: { format: string; slug: string }[] = [];
  for (const format of FORMATS) {
    for (const slug of slugs) out.push({ format, slug });
  }
  return out;
}

interface CiteSubject {
  slug: string;
  title: string;
  isFinding: boolean;
  section?: string;
  url: string;
}

function resolveSubject(slug: string): CiteSubject | null {
  if (slug === "paper") {
    return {
      slug: "paper",
      title: PAPER_TITLE,
      isFinding: false,
      url: SSRN_URL,
    };
  }
  if (slug === "dataset") {
    return {
      slug: "dataset",
      title:
        "VC Deal Flow Signal, Public Engineering-Velocity Panel (NDJSON, CC BY 4.0)",
      isFinding: false,
      url: `${SITE}/api/dataset.jsonl`,
    };
  }
  const f = getFindingBySlug(slug);
  if (!f) return null;
  return {
    slug: f.slug,
    title: f.title,
    isFinding: true,
    section: f.section,
    url: `${SITE}/research/${f.slug}`,
  };
}

function bibtex(s: CiteSubject): string {
  const key = `datanerd2026${s.slug.replace(/-/g, "")}`;
  if (s.slug === "dataset") {
    return `@misc{${key},
  title        = {${s.title}},
  author       = {The Data Nerd},
  year         = {2026},
  howpublished = {Dataset},
  url          = {${s.url}},
  note         = {ORCID: 0009-0002-2222-4112. CC BY 4.0.},
}`;
  }
  // Paper + per-finding (each finding cites the parent paper via crossref)
  const sectionNote = s.section ? `Section ${s.section} of: ` : "";
  return `@article{${key},
  title        = {${s.title}},
  author       = {The Data Nerd},
  year         = {2026},
  journal      = {SSRN Electronic Journal},
  doi          = {10.2139/ssrn.6606558},
  url          = {${s.url}},
  publisher    = {VC Deal Flow Signal (GitDealFlow)},
  note         = {${sectionNote}ORCID: 0009-0002-2222-4112. CC BY 4.0.},
}`;
}

function ris(s: CiteSubject): string {
  const ty = s.slug === "dataset" ? "DATA" : "JOUR";
  const lines = [
    `TY  - ${ty}`,
    `AU  - The Data Nerd`,
    `TI  - ${s.title}`,
    `PY  - 2026`,
    `UR  - ${s.url}`,
    `PB  - VC Deal Flow Signal (GitDealFlow)`,
    `KW  - venture capital`,
    `KW  - GitHub`,
    `KW  - commit velocity`,
    `KW  - alternative data`,
  ];
  if (s.slug !== "dataset") {
    lines.splice(4, 0, "JO  - SSRN Electronic Journal");
    lines.splice(5, 0, "DO  - 10.2139/ssrn.6606558");
  }
  if (s.section) lines.push(`N1  - Section ${s.section}`);
  lines.push("ER  -");
  return lines.join("\n");
}

function apa(s: CiteSubject): string {
  if (s.slug === "dataset") {
    return `The Data Nerd. (2026). *${s.title}* [Data set]. VC Deal Flow Signal (GitDealFlow). ${s.url}`;
  }
  return `The Data Nerd. (2026). *${s.title}* (SSRN Working Paper No. 6606558). VC Deal Flow Signal (GitDealFlow). https://doi.org/10.2139/ssrn.6606558`;
}

function mla(s: CiteSubject): string {
  if (s.slug === "dataset") {
    return `The Data Nerd. *${s.title}*. VC Deal Flow Signal (GitDealFlow), 2026, ${s.url}.`;
  }
  return `The Data Nerd. "${s.title}." *SSRN Electronic Journal*, 2026, ${s.url}.`;
}

function chicago(s: CiteSubject): string {
  if (s.slug === "dataset") {
    return `The Data Nerd. 2026. ${s.title}. Dataset. VC Deal Flow Signal (GitDealFlow). ${s.url}.`;
  }
  return `The Data Nerd. 2026. "${s.title}." SSRN Electronic Journal. ${s.url}.`;
}

/**
 * Wikipedia template syntax, copy-paste-ready for Wikipedia editors.
 * Uses {{cite journal}} for the paper, {{cite web}} for the dataset, and
 * {{cite journal}} pointing to the section for findings. Each carries the
 * ORCID + DOI in the appropriate field.
 */
function wikipedia(s: CiteSubject): string {
  if (s.slug === "dataset") {
    return `<ref>{{cite web |last=The Data Nerd |title=${s.title} |publisher=VC Deal Flow Signal (GitDealFlow) |year=2026 |url=${s.url} |format=NDJSON |access-date={{subst:CURRENTDATE}}}}</ref>`;
  }
  const sectionField = s.section ? ` |at=${s.section}` : "";
  return `<ref>{{cite journal |last=The Data Nerd |title=${s.title} |journal=SSRN Electronic Journal |year=2026 |doi=10.2139/ssrn.6606558 |url=${s.url} |publisher=VC Deal Flow Signal (GitDealFlow) |orcid=0009-0002-2222-4112${sectionField}}}</ref>`;
}

const RENDERERS: Record<Format, (s: CiteSubject) => string> = {
  bibtex,
  ris,
  apa,
  mla,
  chicago,
  wikipedia,
};

interface RouteContext {
  params: Promise<{ format: string; slug: string }>;
}

export async function GET(_req: Request, ctx: RouteContext) {
  const { format, slug } = await ctx.params;
  if (!FORMATS.includes(format as Format)) {
    return new Response(
      `Unknown format "${format}". Supported: ${FORMATS.join(", ")}.`,
      {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    );
  }
  const subject = resolveSubject(slug);
  if (!subject) {
    return new Response(
      `Unknown slug "${slug}". Use "paper", "dataset", or any /research/[slug] finding slug.`,
      {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    );
  }
  const body = RENDERERS[format as Format](subject);
  // BibTeX gets x-bibtex MIME for proper handling by Zotero/Mendeley.
  // RIS gets application/x-research-info-systems.
  const contentType =
    format === "bibtex"
      ? "application/x-bibtex; charset=utf-8"
      : format === "ris"
        ? "application/x-research-info-systems; charset=utf-8"
        : "text/plain; charset=utf-8";
  return new Response(body + "\n", {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
      "X-License": "https://creativecommons.org/licenses/by/4.0/",
      "X-Attribution": "VC Deal Flow Signal (GitDealFlow)",
    },
  });
}
