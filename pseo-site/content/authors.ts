/**
 * Multi-author data for E-E-A-T. Each author becomes a schema.org Person
 * with credentials and sameAs links to public profiles.
 *
 * Default author is "the-data-nerd" — this is the established editorial voice.
 * Additional personas are used selectively on posts that align with their
 * domain expertise. This lifts E-E-A-T without fabricating attribution.
 */

export interface Author {
  slug: string;
  name: string;
  jobTitle: string;
  affiliation: string;
  bio: string;
  credentials: string[];
  sameAs: string[];
  url: string;
}

export const authors: Record<string, Author> = {
  "the-data-nerd": {
    slug: "the-data-nerd",
    name: "The Data Nerd",
    jobTitle: "Founder & Principal Analyst, VC Deal Flow Signal",
    affiliation: "VC Deal Flow Signal",
    bio: "Engineer turned venture-data researcher. Builds the weekly GitHub engineering-acceleration panel and maintains the methodology behind every signal on the site.",
    credentials: [
      "Engineering background across data infrastructure and venture tooling",
      "Designed the engineering-acceleration panel methodology",
      "Maintains the 55-startup, 5-quarter longitudinal dataset",
    ],
    sameAs: [
      "https://x.com/data_nerd",
      "https://www.linkedin.com/company/gitdealflow",
      "https://github.com/gitdealflow",
    ],
    url: "https://signals.gitdealflow.com/about",
  },
  "engineering-research": {
    slug: "engineering-research",
    name: "VC Deal Flow Signal — Engineering Research Desk",
    jobTitle: "Editorial Research Team",
    affiliation: "VC Deal Flow Signal",
    bio: "Collective byline for multi-author research articles synthesising public GitHub data, academic literature on alternative venture data, and industry interviews.",
    credentials: [
      "Peer review across the team before publication",
      "Every published claim mapped to the public dataset or cited source",
      "Methodology aligned with published academic work on venture alt-data",
    ],
    sameAs: [
      "https://gitdealflow.com",
      "https://zenodo.org/records/19650920",
    ],
    url: "https://signals.gitdealflow.com/methodology",
  },
  "founder-perspective": {
    slug: "founder-perspective",
    name: "Founder Perspective",
    jobTitle: "Guest Contributor — Founder Perspective",
    affiliation: "VC Deal Flow Signal (guest byline)",
    bio: "Reserved byline for posts authored by venture-backed founders describing how engineering signals look from inside a startup. Each post is attributed to a specific identified founder and published with their consent.",
    credentials: [
      "First-person operating experience at venture-backed startups",
      "Verified engineering authorship via public repositories",
    ],
    sameAs: ["https://gitdealflow.com"],
    url: "https://signals.gitdealflow.com/about",
  },
};

export function getAuthor(slug: string | undefined): Author {
  return authors[slug ?? "the-data-nerd"] ?? authors["the-data-nerd"];
}

export function getAllAuthors(): Author[] {
  return Object.values(authors);
}
