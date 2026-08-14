/**
 * Book manifest, single source of truth for /book pages, PDF/EPUB build,
 * sitemap entries, schema.org/Book LD+JSON, and download surfaces.
 *
 * Title intentionally matches the SSRN-indexed paper anchor so a search for
 * "7 GitHub signals" finds both the academic preprint and the trade book.
 */
export interface BookChapter {
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  summary: string;
  file: string;
  estimatedReadMinutes: number;
}

export interface BookManifest {
  title: string;
  subtitle: string;
  authorName: string;
  authorRole: string;
  isbn: string;
  edition: string;
  publishedDate: string;
  language: string;
  pages: number;
  wordCount: number;
  cover: string;
  description: string;
  chapters: BookChapter[];
}

export const BOOK: BookManifest = {
  title: "The 7 GitHub Signals That Predict Series A Rounds",
  subtitle:
    "How to read engineering acceleration weeks before the press release, a field manual for investors who want to move first",
  authorName: "The Data Nerd",
  authorRole: "Founder, GitDealFlow",
  isbn: "979-8-9876543-1-7",
  edition: "First edition",
  publishedDate: "2026-05-06",
  language: "en",
  pages: 104,
  wordCount: 31200,
  cover: "/downloads/seven-signals-cover.svg",
  description:
    "A working investor's field manual for using public GitHub data to identify Series-A-bound startups three to six weeks before the announcement. Seven signals, a replication appendix, and the SSRN-indexed methodology behind every claim. Free to read online, free to download as PDF and EPUB.",
  chapters: [
    {
      slug: "introduction",
      number: 0,
      title: "Introduction",
      subtitle: "Why public data beats private intros",
      summary:
        "Why a free, public, auditable signal stack outperforms relationship-driven sourcing for the long-tail Series A, and how to read this book.",
      file: "00-introduction.md",
      estimatedReadMinutes: 9,
    },
    {
      slug: "signal-1-commit-velocity",
      number: 1,
      title: "Signal 1, Commit Velocity Acceleration",
      subtitle: "The 14-day window that fires before everything",
      summary:
        "Why 14-day commit-velocity acceleration with two-period confirmation is the single highest-yield Series A predictor in public data.",
      file: "01-commit-velocity.md",
      estimatedReadMinutes: 14,
    },
    {
      slug: "signal-2-contributor-influx",
      number: 2,
      title: "Signal 2, Contributor Influx",
      subtitle: "When four new names appear in two weeks",
      summary:
        "Contributor influx is the hire signal that arrives weeks before LinkedIn updates. Read it correctly and you read the term sheet.",
      file: "02-contributor-influx.md",
      estimatedReadMinutes: 12,
    },
    {
      slug: "signal-3-infra-buildout",
      number: 3,
      title: "Signal 3, Infrastructure Repository Buildout",
      subtitle: "The repos a startup ships before it ships",
      summary:
        "New infrastructure repositories, terraform, helm, ops, are the architectural confessions of a company about to scale. Decode them.",
      file: "03-infra-buildout.md",
      estimatedReadMinutes: 11,
    },
    {
      slug: "signal-4-star-detachment",
      number: 4,
      title: "Signal 4, Star-Velocity Detachment",
      subtitle: "When attention decouples from the work",
      summary:
        "When a repo's star-velocity decouples from its commit-velocity, something off-platform is happening. Find out what.",
      file: "04-star-detachment.md",
      estimatedReadMinutes: 10,
    },
    {
      slug: "signal-5-issue-cadence",
      number: 5,
      title: "Signal 5, Issue Closure Cadence",
      subtitle: "The metric founders cannot fake",
      summary:
        "Median time-to-close on issues is a leadership-quality signal that is impossible to fake without breaking the product. Use it as your tie-breaker.",
      file: "05-issue-cadence.md",
      estimatedReadMinutes: 11,
    },
    {
      slug: "signal-6-dependency-adoption",
      number: 6,
      title: "Signal 6, Downstream Dependency Adoption",
      subtitle: "When other people's package.json says yes",
      summary:
        "If real builders are adding the package to their package.json, lock files, and Dockerfiles, the company is one push of distribution from category leadership.",
      file: "06-dependency-adoption.md",
      estimatedReadMinutes: 10,
    },
    {
      slug: "signal-7-founding-team-visibility",
      number: 7,
      title: "Signal 7, Founding-Team Public Visibility",
      subtitle: "When the engineers stop being invisible",
      summary:
        "Engineering blog posts, conference talks, and OSS maintenance are the founding team's public market for trust. Watch the inflection point.",
      file: "07-founding-team-visibility.md",
      estimatedReadMinutes: 12,
    },
    {
      slug: "methodology",
      number: 8,
      title: "Methodology",
      subtitle: "How to compute every signal yourself",
      summary:
        "The full computation procedure, every endpoint, every formula, every threshold, re-derivable from public GitHub data with no licence and no scraping.",
      file: "08-methodology.md",
      estimatedReadMinutes: 13,
    },
    {
      slug: "replication-appendix",
      number: 9,
      title: "Appendix, A 90-Minute Replication Walkthrough",
      subtitle: "Replicate one rank from the leaderboard, end to end",
      summary:
        "A complete 90-minute walkthrough that takes you from a fresh GitHub token to a verified rank against the live leaderboard. Bring a laptop and a curl.",
      file: "09-replication-appendix.md",
      estimatedReadMinutes: 18,
    },
    {
      slug: "conclusion",
      number: 10,
      title: "Conclusion",
      subtitle: "What to do on Monday morning",
      summary:
        "A one-page checklist, three honest failure modes, and the case for treating public data as the new private network.",
      file: "10-conclusion.md",
      estimatedReadMinutes: 7,
    },
  ],
};
