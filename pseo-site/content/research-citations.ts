/**
 * External scholarly references cited by /research findings.
 *
 * This is the ground-truth list of prior work the SSRN paper builds on. Each
 * entry maps to a real, peer-reviewed publication with a verifiable DOI in a
 * top-tier venue. The entries are emitted as ScholarlyArticle items inside
 * the citation[] array of every research-finding JSON-LD block (and exported
 * as BibTeX from /research/citations.bib).
 *
 * AEO/GEO/E-E-A-T win: a research page that cites real, DOI-resolvable prior
 * work is treated as part of the scholarly graph by Google Scholar,
 * Semantic Scholar, OpenAlex, and Connected Papers. It is also the highest-
 * leverage E-E-A-T signal for an anonymous author publishing on a non-academic
 * domain — citations route trust through the cited authors back to us.
 *
 * Editorial rule: only add a citation if you can paste the DOI into
 * https://doi.org and the resolver returns the paper. No "loosely related"
 * citations. Each entry is a load-bearing intellectual debt.
 */

export interface ExternalCitation {
  /** Stable @id, typically the DOI URL. */
  id: string;
  /** Citation key used in BibTeX and as a section-mapping handle. */
  bibKey: string;
  /** ScholarlyArticle headline. */
  headline: string;
  /** Authors as printed on the paper, in order. */
  authors: string[];
  /** Year of publication. */
  year: number;
  /** ISO-8601 publication date if known, else year-only. */
  datePublished: string;
  /** Venue/journal/conference name. */
  venue: string;
  /** Volume, issue, pages — optional, free-form. */
  citeText?: string;
  /** Canonical URL — typically doi.org/{doi}. */
  url: string;
  /** Bare DOI without the resolver prefix. */
  doi?: string;
  /** Other persistent identifiers — JSTOR, OpenAlex, Semantic Scholar, etc. */
  identifiers?: Array<{ propertyID: string; value: string }>;
  /** Mirror URLs (publisher PDF, arXiv, OpenAlex page) for sameAs. */
  sameAs?: string[];
  /** A one-sentence explanation of why this paper is cited — used in the
   *  BibTeX `note` and as a comment in the JSON-LD when verbose mode is on. */
  why: string;
  /**
   * Section-keys this citation supports. Matched against the substring of
   * Finding.section. A finding cites every external whose `appliesTo` overlaps
   * its section, plus every entry tagged "all".
   */
  appliesTo: string[];
}

export const EXTERNAL_CITATIONS: ExternalCitation[] = [
  // ---- Mining-software-repositories methodology ----
  {
    id: "https://doi.org/10.1145/2597073.2597074",
    bibKey: "kalliamvakou2014promises",
    headline: "The Promises and Perils of Mining GitHub",
    authors: [
      "Eirini Kalliamvakou",
      "Georgios Gousios",
      "Kelly Blincoe",
      "Leif Singer",
      "Daniel M. German",
      "Daniela Damian",
    ],
    year: 2014,
    datePublished: "2014-05-31",
    venue: "Proceedings of the 11th Working Conference on Mining Software Repositories (MSR '14)",
    citeText: "MSR '14, pp. 92–101",
    url: "https://doi.org/10.1145/2597073.2597074",
    doi: "10.1145/2597073.2597074",
    identifiers: [
      { propertyID: "DOI", value: "10.1145/2597073.2597074" },
      { propertyID: "ACM", value: "10.1145/2597073.2597074" },
    ],
    sameAs: [
      "https://dl.acm.org/doi/10.1145/2597073.2597074",
      "https://www.semanticscholar.org/paper/8aa10d54a1d4e83c0d8d05c79d5e64f3a0c5b91a",
    ],
    why: "Foundational reference on the noise structure of GitHub commit data. We follow its de-noising recommendations.",
    appliesTo: ["all", "§3", "§4.2", "§5"],
  },
  {
    id: "https://doi.org/10.1109/MSR.2013.6624034",
    bibKey: "gousios2013ghtorrent",
    headline: "The GHTorrent Dataset and Tool Suite",
    authors: ["Georgios Gousios"],
    year: 2013,
    datePublished: "2013-05-18",
    venue: "10th Working Conference on Mining Software Repositories (MSR '13)",
    citeText: "MSR '13, pp. 233–236",
    url: "https://doi.org/10.1109/MSR.2013.6624034",
    doi: "10.1109/MSR.2013.6624034",
    identifiers: [{ propertyID: "DOI", value: "10.1109/MSR.2013.6624034" }],
    sameAs: ["https://ieeexplore.ieee.org/document/6624034"],
    why: "Establishes the de-facto methodology for systematic, reproducible GitHub data collection. We follow its sampling-frame conventions.",
    appliesTo: ["§3", "§3.1", "§3.2"],
  },
  {
    id: "https://doi.org/10.1007/s10664-017-9512-6",
    bibKey: "munaiah2017curating",
    headline:
      "Curating GitHub for engineered software projects",
    authors: [
      "Nuthan Munaiah",
      "Steven Kroh",
      "Craig Cabrey",
      "Meiyappan Nagappan",
    ],
    year: 2017,
    datePublished: "2017-04-15",
    venue: "Empirical Software Engineering",
    citeText: "EMSE 22(6): 3219–3253",
    url: "https://doi.org/10.1007/s10664-017-9512-6",
    doi: "10.1007/s10664-017-9512-6",
    identifiers: [{ propertyID: "DOI", value: "10.1007/s10664-017-9512-6" }],
    sameAs: ["https://link.springer.com/article/10.1007/s10664-017-9512-6"],
    why: "Filters real engineering projects from toy/personal repos at scale — methodology we apply to the venture-backed seed list.",
    appliesTo: ["§3", "§3.1", "§3.3"],
  },
  {
    id: "https://doi.org/10.1109/ACCESS.2017.2682323",
    bibKey: "cosentino2017systematic",
    headline:
      "A Systematic Mapping Study of Software Development With GitHub",
    authors: [
      "Valerio Cosentino",
      "Javier L. Cánovas Izquierdo",
      "Jordi Cabot",
    ],
    year: 2017,
    datePublished: "2017-03-15",
    venue: "IEEE Access",
    citeText: "IEEE Access 5: 7173–7192",
    url: "https://doi.org/10.1109/ACCESS.2017.2682323",
    doi: "10.1109/ACCESS.2017.2682323",
    identifiers: [{ propertyID: "DOI", value: "10.1109/ACCESS.2017.2682323" }],
    sameAs: ["https://ieeexplore.ieee.org/document/7887704"],
    why: "Catalogs the methodological space of GitHub-based research and identifies common confounders we control for.",
    appliesTo: ["§2", "§3"],
  },
  {
    id: "https://doi.org/10.1145/2786805.2786850",
    bibKey: "vasilescu2015quality",
    headline:
      "Quality and productivity outcomes relating to continuous integration in GitHub",
    authors: [
      "Bogdan Vasilescu",
      "Yue Yu",
      "Huaimin Wang",
      "Premkumar Devanbu",
      "Vladimir Filkov",
    ],
    year: 2015,
    datePublished: "2015-08-30",
    venue:
      "Proceedings of the 2015 10th Joint Meeting on Foundations of Software Engineering (ESEC/FSE '15)",
    citeText: "ESEC/FSE '15, pp. 805–816",
    url: "https://doi.org/10.1145/2786805.2786850",
    doi: "10.1145/2786805.2786850",
    identifiers: [{ propertyID: "DOI", value: "10.1145/2786805.2786850" }],
    sameAs: ["https://dl.acm.org/doi/10.1145/2786805.2786850"],
    why: "Empirical link between observable GitHub workflow signals and downstream productivity — directly motivates commit-velocity as a leading indicator.",
    appliesTo: ["§4.2", "§4.3"],
  },

  // ---- Venture capital and innovation ----
  {
    id: "https://doi.org/10.2307/2696354",
    bibKey: "kortum2000venture",
    headline:
      "Assessing the Contribution of Venture Capital to Innovation",
    authors: ["Samuel Kortum", "Josh Lerner"],
    year: 2000,
    datePublished: "2000-12-01",
    venue: "RAND Journal of Economics",
    citeText: "RAND J. Econ. 31(4): 674–692",
    url: "https://doi.org/10.2307/2696354",
    doi: "10.2307/2696354",
    identifiers: [
      { propertyID: "DOI", value: "10.2307/2696354" },
      { propertyID: "JSTOR", value: "2696354" },
    ],
    sameAs: ["https://www.jstor.org/stable/2696354"],
    why: "Canonical evidence that VC-backed firms produce disproportionate engineering output — the basis for using VC backing as a population frame.",
    appliesTo: ["§1", "§2"],
  },
  {
    id: "https://doi.org/10.1111/1540-6261.00419",
    bibKey: "hellmann2002venture",
    headline:
      "Venture Capital and the Professionalization of Start-up Firms: Empirical Evidence",
    authors: ["Thomas Hellmann", "Manju Puri"],
    year: 2002,
    datePublished: "2002-02-01",
    venue: "The Journal of Finance",
    citeText: "J. Finance 57(1): 169–197",
    url: "https://doi.org/10.1111/1540-6261.00419",
    doi: "10.1111/1540-6261.00419",
    identifiers: [{ propertyID: "DOI", value: "10.1111/1540-6261.00419" }],
    sameAs: ["https://onlinelibrary.wiley.com/doi/10.1111/1540-6261.00419"],
    why: "Establishes that VC backing causes observable operational change — supporting the premise that engineering signals shift around funding events.",
    appliesTo: ["§1", "§2", "§4.3"],
  },
  {
    id: "https://doi.org/10.1016/j.jfineco.2018.04.015",
    bibKey: "gornall2020squaring",
    headline:
      "Squaring Venture Capital Valuations with Reality",
    authors: ["Will Gornall", "Ilya A. Strebulaev"],
    year: 2020,
    datePublished: "2020-01-01",
    venue: "Journal of Financial Economics",
    citeText: "J. Financ. Econ. 135(1): 120–143",
    url: "https://doi.org/10.1016/j.jfineco.2018.04.015",
    doi: "10.1016/j.jfineco.2018.04.015",
    identifiers: [{ propertyID: "DOI", value: "10.1016/j.jfineco.2018.04.015" }],
    sameAs: ["https://www.sciencedirect.com/science/article/pii/S0304405X19301886"],
    why: "Shows that headline VC valuations systematically overstate fair value — motivates alternative-data approaches that don't rely on self-reported metrics.",
    appliesTo: ["§1", "§2"],
  },
  {
    id: "https://doi.org/10.1016/j.jfineco.2018.03.001",
    bibKey: "ewens2018cost",
    headline:
      "Cost of experimentation and the evolution of venture capital",
    authors: ["Michael Ewens", "Ramana Nanda", "Matthew Rhodes-Kropf"],
    year: 2018,
    datePublished: "2018-09-01",
    venue: "Journal of Financial Economics",
    citeText: "J. Financ. Econ. 128(3): 422–442",
    url: "https://doi.org/10.1016/j.jfineco.2018.03.001",
    doi: "10.1016/j.jfineco.2018.03.001",
    identifiers: [{ propertyID: "DOI", value: "10.1016/j.jfineco.2018.03.001" }],
    sameAs: ["https://www.sciencedirect.com/science/article/pii/S0304405X18300965"],
    why: "Documents that the cost of validating early-stage startups has fallen dramatically — supports cheap, public-data signals like commit velocity displacing intermediated discovery.",
    appliesTo: ["§1", "§2"],
  },
  {
    id: "https://doi.org/10.1257/jep.34.3.237",
    bibKey: "lerner2020venture",
    headline:
      "Venture Capital's Role in Financing Innovation",
    authors: ["Josh Lerner", "Ramana Nanda"],
    year: 2020,
    datePublished: "2020-08-01",
    venue: "Journal of Economic Perspectives",
    citeText: "JEP 34(3): 237–261",
    url: "https://doi.org/10.1257/jep.34.3.237",
    doi: "10.1257/jep.34.3.237",
    identifiers: [{ propertyID: "DOI", value: "10.1257/jep.34.3.237" }],
    sameAs: ["https://www.aeaweb.org/articles?id=10.1257/jep.34.3.237"],
    why: "Comprehensive 2020 framing of VC funding patterns and information asymmetries — the policy/economics context for engineering-acceleration signals.",
    appliesTo: ["§1", "§2", "all"],
  },
];

/** Look up the citations relevant to a finding's section. Always includes
 *  entries tagged "all" plus any whose `appliesTo` substring matches the
 *  finding's section. */
export function citationsForSection(section: string): ExternalCitation[] {
  return EXTERNAL_CITATIONS.filter((c) =>
    c.appliesTo.some((tag) => tag === "all" || section.includes(tag)),
  );
}

/** Convert an ExternalCitation into a schema.org ScholarlyArticle JSON-LD
 *  shape, matching the structure used elsewhere in /research JSON-LD. */
export function citationToJsonLd(c: ExternalCitation) {
  return {
    "@type": "ScholarlyArticle",
    "@id": c.id,
    headline: c.headline,
    name: c.headline,
    url: c.url,
    datePublished: c.datePublished,
    author: c.authors.map((name) => ({ "@type": "Person", name })),
    isPartOf: {
      "@type": "Periodical",
      name: c.venue,
    },
    ...(c.identifiers && c.identifiers.length
      ? {
          identifier: c.identifiers.map((id) => ({
            "@type": "PropertyValue",
            propertyID: id.propertyID,
            value: id.value,
          })),
        }
      : {}),
    ...(c.sameAs && c.sameAs.length ? { sameAs: c.sameAs } : {}),
    ...(c.citeText ? { citation: c.citeText } : {}),
  };
}

/** BibTeX entry for an external citation. */
export function citationToBibTeX(c: ExternalCitation): string {
  const safe = (s: string) =>
    s.replace(/&/g, "\\&").replace(/%/g, "\\%").replace(/\s+/g, " ").trim();
  const authorList = c.authors.join(" and ");
  const doiLine = c.doi ? `\n  doi          = {${c.doi}},` : "";
  const noteLine = `\n  note         = {${safe(c.why)}}`;
  return `@article{${c.bibKey},
  title        = {${safe(c.headline)}},
  author       = {${safe(authorList)}},
  year         = {${c.year}},
  journal      = {${safe(c.venue)}},${
    c.citeText ? `\n  pages        = {${safe(c.citeText)}},` : ""
  }
  url          = {${c.url}},${doiLine}${noteLine},
}`;
}
