/**
 * /research/citations.bib, BibTeX export of the SSRN paper plus per-finding
 * stubs that academic readers can drop straight into their reference manager.
 *
 * AEO/GEO win: Google Scholar, ResearchRabbit, Connected Papers, and most
 * citation-graph crawlers prefer .bib over HTML cite blocks. Linked from
 * /research index + /citations + agents.txt. CC BY 4.0 attribution baked in.
 */

import { FINDINGS } from "@/content/research-findings";
import {
  EXTERNAL_CITATIONS,
  citationToBibTeX,
} from "@/content/research-citations";

export const dynamic = "force-static";

const PAPER_ENTRY = `@misc{datanerd2026engineering,
  title        = {Engineering Acceleration as a VC Deal Flow Signal: A Longitudinal GitHub Panel},
  author       = {The Data Nerd},
  year         = {2026},
  howpublished = {SSRN preprint},
  url          = {https://ssrn.com/abstract=6606558},
  doi          = {10.2139/ssrn.6606558},
  note         = {ORCID: 0009-0002-2222-4112. Wikidata: Q139376302. Licensed CC BY 4.0.},
  keywords     = {venture capital, alternative data, GitHub commits, engineering acceleration, deal flow},
}`;

const DATASET_ENTRY = `@misc{datanerd2026dataset,
  title        = {VC Deal Flow Signal, Q2 2026 GitHub Engineering Panel},
  author       = {The Data Nerd},
  year         = {2026},
  howpublished = {Dataset},
  url          = {https://signals.gitdealflow.com/api/dataset.jsonl},
  note         = {Newline-delimited JSON. 369 venture-backed startups across 15 sectors. Refreshed weekly. Licensed CC BY 4.0.},
  keywords     = {dataset, github, commit velocity, contributor growth},
}`;

const QA_ENTRY = `@misc{datanerd2026qa,
  title        = {VC Deal Flow Signal, Question/Answer Dataset},
  author       = {The Data Nerd},
  year         = {2026},
  howpublished = {Dataset},
  url          = {https://signals.gitdealflow.com/qa.jsonl},
  note         = {Newline-delimited JSON of citation-ready Q\\&A pairs. Mirror at /api/answers.json. Licensed CC BY 4.0.},
  keywords     = {dataset, faq, question answering, retrieval augmented generation},
}`;

function findingEntry(
  n: number,
  group: string,
  slug: string,
  title: string,
  claim: string,
  section: string,
): string {
  // Sanitize for BibTeX: escape % and & in title/claim, collapse whitespace.
  const safe = (s: string) =>
    s.replace(/&/g, "\\&").replace(/%/g, "\\%").replace(/\s+/g, " ").trim();
  return `@misc{datanerd2026finding${n},
  title        = {${safe(title)}},
  author       = {The Data Nerd},
  year         = {2026},
  howpublished = {VC Deal Flow Signal research note ${group}.${n}},
  url          = {https://signals.gitdealflow.com/research/${slug}},
  note         = {Section ${safe(section)}. Source: \\url{https://ssrn.com/abstract=6606558}. Claim: ${safe(claim)}},
  keywords     = {github, commit velocity, engineering acceleration, finding-${group.toLowerCase()}},
}`;
}

export async function GET() {
  const header = `% VC Deal Flow Signal, BibTeX citations
% Canonical:  https://signals.gitdealflow.com/research/citations.bib
% Paper:      https://ssrn.com/abstract=6606558
% Dataset:    https://signals.gitdealflow.com/api/dataset.jsonl
% License:    CC BY 4.0, https://creativecommons.org/licenses/by/4.0/
% Attribution: VC Deal Flow Signal (GitDealFlow), https://signals.gitdealflow.com
% Generated:  ${new Date().toISOString().slice(0, 10)}
%
% This file contains BibTeX entries for the SSRN paper, the Q2 2026 dataset,
% the Q&A dataset, and one entry per atomic finding. Drop into your reference
% manager (Zotero, Mendeley, BibDesk) and cite directly.

`;

  const findingEntries = FINDINGS.map((f) =>
    findingEntry(f.n, f.group, f.slug, f.title, f.claim, f.section),
  ).join("\n\n");

  // External, peer-reviewed prior work the SSRN paper builds on (F32). Each
  // entry has a verifiable DOI in a top-tier venue. Listed before per-finding
  // entries so reference managers index them as canonical sources.
  const externalEntries = EXTERNAL_CITATIONS.map(citationToBibTeX).join(
    "\n\n",
  );

  const body = `${header}${PAPER_ENTRY}\n\n${DATASET_ENTRY}\n\n${QA_ENTRY}\n\n% --- External references (peer-reviewed prior work) ---\n\n${externalEntries}\n\n% --- Per-finding entries ---\n\n${findingEntries}\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/x-bibtex; charset=utf-8",
      "Content-Disposition": 'inline; filename="vc-deal-flow-signal.bib"',
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "index, follow",
    },
  });
}
