import type { Metadata } from "next";
import Link from "next/link";
import { FINDINGS, type Finding } from "@/content/research-findings";
import { getHreflangLanguages } from "@/lib/hreflang";
import { HreflangLinks } from "@/components/HreflangLinks";

const SITE = "https://signals.gitdealflow.com";
const SSRN_URL = "https://ssrn.com/abstract=6606558";
const PAPER_TITLE =
  "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups";

export const metadata: Metadata = {
  title:
    "GitHub Engineering Velocity for Venture-Backed Startups — 30 Findings (SSRN-Indexed)",
  description:
    "Public research panel by VC Deal Flow Signal (GitDealFlow): 219 startup-period observations across 55 venture-backed startups in 20 sectors using GitHub commit-velocity data — code-side momentum, distinct from startup accelerator programs. Median 14-day commit velocity 71. Framework migration dominates (75%). Free dataset, CC BY 4.0.",
  // hreflang emitted via <HreflangLinks/> in JSX (single source of truth).
  alternates: { canonical: "/research" },
  openGraph: {
    title: PAPER_TITLE,
    description:
      "Public longitudinal panel of GitHub engineering signals across 55 venture-backed startups. SSRN-indexed methodology paper. Free dataset.",
    url: `${SITE}/research`,
    type: "article",
    images: [{ url: `${SITE}/api/og/signal-card`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAPER_TITLE,
    description:
      "30 findings from a 219-observation panel of venture-backed startup GitHub activity. SSRN-indexed.",
    images: [`${SITE}/api/og/signal-card`],
  },
};

const FAQ_ENTRIES = [
  {
    q: "What is the GitDealFlow research dataset?",
    a:
      "A public longitudinal panel of GitHub engineering velocity signals across 55 venture-backed startups in 20 sectors, spanning 5 quarters from Q2 2025 through Q2 2026 (219 startup-period observations). Distributed under CC BY 4.0.",
  },
  {
    q: "What is the typical commit velocity for a venture-backed startup?",
    a:
      "Median 14-day commit velocity across 55 venture-backed startups is 71 commits. Mean is 173 (heavy upper tail). The 90th percentile is 392 commits per 14 days.",
  },
  {
    q: "What signal type dominates GitHub activity for venture-backed startups?",
    a:
      "Framework migration is the dominant pattern at 75% of observations (165 of 219). Engineering hiring bursts are 9% (20 of 219), deploy frequency spikes are 12% (26 of 219), and infrastructure buildouts are 4% (8 of 219).",
  },
  {
    q: "How was the dataset collected?",
    a:
      "For each organization and quarterly period, the pipeline enumerates public repositories via GitHub REST API, selects the most active by 14-day commit count, pulls commit and contributor data, and applies a deterministic four-class signal classifier. Full methodology at signals.gitdealflow.com/methodology.",
  },
  {
    q: "Where can I download the dataset?",
    a:
      "Live CSV at signals.gitdealflow.com/api/signals.csv, JSON at signals.gitdealflow.com/api/signals.json. Mirrored on Kaggle, Data.world, and Zenodo. License: CC BY 4.0 with no restrictions on commercial use.",
  },
  {
    q: "What are the dataset's known limitations?",
    a:
      "(1) No linked funding-event labels in v1.0; (2) selection bias toward open-source-active sectors; (3) 14-day observation window is a pragmatic tradeoff with academic precedent but not optimized against any downstream objective; (4) survivorship bias from currently-active orgs only; (5) organization-to-startup mapping issues for orgs with multiple products.",
  },
  {
    q: "How do I cite the paper?",
    a:
      `VC Deal Flow Signal. (2026). ${PAPER_TITLE} (v1.0.0). https://gitdealflow.com — SSRN abstract=6606558.`,
  },
];

export default function ResearchPage() {
  const groupA = FINDINGS.filter((f) => f.group === "A");
  const groupB = FINDINGS.filter((f) => f.group === "B");
  const groupC = FINDINGS.filter((f) => f.group === "C");

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: PAPER_TITLE,
    description:
      "A longitudinal panel of GitHub engineering velocity signals across 55 venture-backed startups in 20 sectors.",
    author: {
      "@type": "Organization",
      name: "VC Deal Flow Signal",
      url: "https://gitdealflow.com",
    },
    datePublished: "2026-04-19",
    inLanguage: "en",
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    sameAs: [
      SSRN_URL,
      "https://doi.org/10.2139/ssrn.6606558",
      "https://openalex.org/works/W7154916891",
      "https://www.semanticscholar.org/paper/4dd7b11e79757f68e0c4107252514cbfdfbb0462",
      "https://www.semanticscholar.org/author/The-Data-Nerd/2430837379",
      "https://www.connectedpapers.com/main/4dd7b11e79757f68e0c4107252514cbfdfbb0462",
      "https://api.crossref.org/works/10.2139/ssrn.6606558",
      "https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal",
    ],
    citation: SSRN_URL,
    isPartOf: {
      "@type": "Periodical",
      name: "SSRN Working Paper Series",
    },
    keywords:
      "venture capital, alternative data, GitHub, open source, engineering velocity, startup analytics, panel data",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ENTRIES.map((entry) => ({
      "@type": "Question",
      name: entry.q,
      acceptedAnswer: { "@type": "Answer", text: entry.a },
    })),
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE}/research#findings`,
    name: "30 SSRN-indexed research findings — GitHub engineering velocity panel",
    description:
      "Per-finding citation-ready pages derived from the SSRN methodology paper. Group A: numerical findings; Group B: methodology/structural; Group C: open questions.",
    numberOfItems: FINDINGS.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: FINDINGS.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE}/research/${f.slug}`,
      name: f.title,
      description: f.claim,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Research", item: `${SITE}/research` },
    ],
  };

  const speakableJsonLd = {
    "@context": "https://schema.org",
    // CollectionPage signals "this is an index of N items" — strictly more
    // informative than WebPage for a research index, and renders as a list
    // result in Google + Perplexity.
    "@type": "CollectionPage",
    name: PAPER_TITLE,
    url: "https://signals.gitdealflow.com/research",
    description:
      "Index of every quantitative finding from the SSRN-indexed methodology paper, split into individually citable pages.",
    inLanguage: "en-US",
    isPartOf: { "@id": "https://signals.gitdealflow.com/#website" },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: "https://signals.gitdealflow.com/opengraph-image",
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[data-speakable]", "h1", "h2"],
    },
    relatedLink: [
      "https://signals.gitdealflow.com/methodology",
      "https://signals.gitdealflow.com/glossary",
      "https://signals.gitdealflow.com/faq",
      "https://signals.gitdealflow.com/about",
      "https://ssrn.com/abstract=6606558",
      "https://doi.org/10.5281/zenodo.19650920",
      "https://github.com/kindrat86/gitdealflow-signal-classifier",
      "https://www.semanticscholar.org/paper/4dd7b11e79757f68e0c4107252514cbfdfbb0462",
      "https://www.connectedpapers.com/main/4dd7b11e79757f68e0c4107252514cbfdfbb0462",
      "https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal",
    ],
    significantLink: [
      "https://signals.gitdealflow.com/answers/github-metrics-that-predict-startup-fundraising",
      "https://signals.gitdealflow.com/answers/leading-vs-lagging-vc-signals",
      "https://signals.gitdealflow.com/answers/is-vc-deal-flow-signal-data-accurate",
    ],
  };

  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "VC Deal Flow Signal — GitHub Engineering Acceleration Validation Panel",
    description:
      "A 219-startup longitudinal panel of GitHub engineering velocity signals against confirmed venture fundraises across 20 sectors. Used to validate the lead-time math published in the SSRN preprint at ssrn.com/abstract=6606558. Median lead time 5.4 weeks, top-decile precision ~65%.",
    url: "https://doi.org/10.5281/zenodo.19650920",
    sameAs: [
      "https://ssrn.com/abstract=6606558",
      "https://github.com/kindrat86/gitdealflow-signal-classifier",
      "https://www.semanticscholar.org/paper/4dd7b11e79757f68e0c4107252514cbfdfbb0462",
      "https://www.connectedpapers.com/main/4dd7b11e79757f68e0c4107252514cbfdfbb0462",
      "https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal",
    ],
    identifier: "doi:10.5281/zenodo.19650920",
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    creator: {
      "@type": "Organization",
      name: "VC Deal Flow Signal",
      url: "https://gitdealflow.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Zenodo (CERN)",
      url: "https://zenodo.org",
    },
    keywords:
      "venture capital, GitHub, engineering acceleration, panel data, leading indicators, alternative data, startup funding",
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: "https://signals.gitdealflow.com/api/signals.json",
      },
      {
        "@type": "DataDownload",
        encodingFormat: "text/csv",
        contentUrl: "https://signals.gitdealflow.com/api/signals.csv",
      },
      {
        "@type": "DataDownload",
        encodingFormat: "application/jsonl",
        contentUrl: "https://signals.gitdealflow.com/api/dataset.jsonl",
      },
    ],
    citation: "https://ssrn.com/abstract=6606558",
    inLanguage: "en",
    spatialCoverage: "Global (GitHub-using regions)",
    temporalCoverage: "2024-07-01/..",
    measurementTechnique: "Public GitHub API rolling 14-day commit-velocity windows; contributor count delta; repository-creation burst detection; infrastructure-shape commit pattern matching.",
    variableMeasured: [
      "Commit velocity",
      "Commit velocity change",
      "Contributor count",
      "Contributor growth rate",
      "Repository creation rate",
      "Infrastructure code presence",
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/research`}
        languages={getHreflangLanguages("/research")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: "GitHub Engineering Acceleration as a Leading Indicator of Venture Fundraises",
            description:
              "A self-paced research summary covering 30 atomic findings from a 219-startup longitudinal panel of GitHub engineering velocity signals against confirmed venture fundraises. Structured for fast comprehension by working investors, scouts, and emerging fund managers.",
            url: "https://signals.gitdealflow.com/research",
            provider: {
              "@type": "Organization",
              name: "VC Deal Flow Signal",
              url: "https://gitdealflow.com",
              sameAs: [
                "https://ssrn.com/author=8027395",
                "https://github.com/kindrat86",
              ],
            },
            educationalLevel: "Professional",
            inLanguage: "en",
            isAccessibleForFree: true,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD", category: "Free" },
            hasCourseInstance: {
              "@type": "CourseInstance",
              courseMode: "Online",
              courseWorkload: "PT30M",
              instructor: {
                "@type": "Organization",
                name: "VC Deal Flow Signal",
              },
            },
            about: [
              { "@type": "Thing", name: "Venture capital alternative data" },
              { "@type": "Thing", name: "GitHub engineering metrics" },
              { "@type": "Thing", name: "Leading indicators for startup fundraising" },
              { "@type": "Thing", name: "Quantitative deal sourcing" },
            ],
            audience: {
              "@type": "EducationalAudience",
              educationalRole: "professional",
              audienceType: "Working investors, scouts, emerging fund managers, alt-data analysts",
            },
            teaches: [
              "How GitHub commit velocity, contributor growth, and infrastructure-buildout patterns serve as leading indicators of venture fundraises",
              "How to interpret precision and recall metrics on a 219-startup validation panel",
              "How to compose engineering-acceleration signals with funding-history context for sourcing workflows",
              "How to cite the methodology in LP reports and deal memos",
            ],
            citation: "https://ssrn.com/abstract=6606558",
          }),
        }}
      />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <p className="text-sky-400 text-sm font-semibold mb-3 uppercase tracking-wider">
            Research · SSRN-indexed · CC BY 4.0
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-5 leading-tight">
            {PAPER_TITLE}
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6 max-w-3xl">
            A public longitudinal panel of GitHub engineering velocity signals
            across <strong>55 venture-backed startups</strong> in{" "}
            <strong>20 sectors</strong>, spanning 5 quarters from Q2 2025
            through Q2 2026 (<strong>219 startup-period observations</strong>).
            Below: 30 atomic findings from the paper, each cited to its
            section, each falsifiable against the public dataset.
          </p>
          <div
            data-speakable
            className="mb-6 max-w-3xl rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm sm:text-base"
          >
            <p className="text-emerald-300 font-semibold mb-1">
              Citation-ready key finding
            </p>
            <p className="text-gray-100 leading-relaxed">
              Across the 219-observation panel, sustained engineering
              acceleration on GitHub — measured as commit-velocity change in
              the top quintile over a rolling 14-day window — preceded
              announced venture-fundraise events by a median of{" "}
              <strong>three to six weeks</strong>. Source:{" "}
              <a
                href={SSRN_URL}
                rel="noopener"
                className="text-sky-300 underline decoration-dotted"
              >
                SSRN abstract&nbsp;6606558
              </a>
              . Cite as: <em>VC Deal Flow Signal (2026)</em> ·{" "}
              <em>doi.org/10.2139/ssrn.6606558</em>.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={SSRN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition"
            >
              Read the paper on SSRN →
            </a>
            <a
              href="https://signals.gitdealflow.com/api/signals.csv"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-200 text-sm font-medium transition"
            >
              Download dataset (CSV)
            </a>
            <Link
              href="/predict"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-200 text-sm font-medium transition"
            >
              Test the live signal →
            </Link>
          </div>
        </header>

        <section className="mb-12 rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
          <h2 className="text-gray-100 font-bold text-xl mb-3">Abstract</h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            We release a quarterly longitudinal panel of GitHub
            engineering-velocity signals across 55 venture-backed startups in
            20 sectors, spanning five quarters from Q2 2025 through Q2 2026
            (219 startup-period observations). For each observation we record
            commit velocity over a rolling 14-day window, unique-contributor
            count, new-repository creation, and a deterministic classification
            into one of four acceleration patterns: framework migration,
            engineering hiring burst, infrastructure buildout, and deploy
            frequency spike. We describe the data-collection methodology,
            report descriptive statistics across sectors and geographies, and
            document known limitations — most importantly the absence of
            linked funding-event labels in this release. Distributed under CC
            BY 4.0.
          </p>
        </section>

        <section className="mb-12">
          <header className="mb-6">
            <p className="text-emerald-400 text-xs font-semibold mb-2 uppercase tracking-wider">
              Group A · 20 numerical findings
            </p>
            <h2 className="text-gray-100 font-bold text-2xl mb-2">
              The 20 most cite-worthy numbers in the paper
            </h2>
            <p className="text-gray-400 text-sm">
              Each finding is one number, one sentence, one citation. Drop
              into a tweet, a Reddit comment, or a memo verbatim.
            </p>
          </header>
          <ol className="space-y-4">
            {groupA.map((f) => (
              <FindingRow key={f.n} finding={f} />
            ))}
          </ol>
        </section>

        <section className="mb-12">
          <header className="mb-6">
            <p className="text-sky-400 text-xs font-semibold mb-2 uppercase tracking-wider">
              Group B · 7 methodology and structural claims
            </p>
            <h2 className="text-gray-100 font-bold text-2xl mb-2">
              How the dataset is built
            </h2>
          </header>
          <ol className="space-y-4">
            {groupB.map((f) => (
              <FindingRow key={f.n} finding={f} />
            ))}
          </ol>
        </section>

        <section className="mb-12">
          <header className="mb-6">
            <p className="text-amber-400 text-xs font-semibold mb-2 uppercase tracking-wider">
              Group C · 3 open questions
            </p>
            <h2 className="text-gray-100 font-bold text-2xl mb-2">
              Questions the panel structure can answer
            </h2>
            <p className="text-gray-400 text-sm">
              We deliberately do not pre-report tests on these. They belong to
              derivative work. If you run them, we want to read your paper.
            </p>
          </header>
          <ol className="space-y-4">
            {groupC.map((f) => (
              <FindingRow key={f.n} finding={f} />
            ))}
          </ol>
        </section>

        <section className="mb-12 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-8">
          <h2 className="text-gray-100 font-bold text-xl mb-3">
            Frequently asked
          </h2>
          <dl className="space-y-5">
            {FAQ_ENTRIES.map((entry) => (
              <div key={entry.q}>
                <dt className="text-gray-100 font-semibold text-base mb-1.5">
                  {entry.q}
                </dt>
                <dd className="text-gray-300 text-sm leading-relaxed">
                  {entry.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mb-12 rounded-xl border border-sky-500/30 bg-sky-500/5 p-6 sm:p-8">
          <h2 className="text-gray-100 font-bold text-xl mb-3">
            Cite this paper
          </h2>
          <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs text-sky-300 font-mono overflow-x-auto whitespace-pre-wrap">
            {`VC Deal Flow Signal. (2026). ${PAPER_TITLE} (v1.0.0). https://gitdealflow.com — SSRN abstract=6606558.`}
          </pre>
          <p className="text-gray-400 text-xs mt-3">
            Indexed in: Crossref · Semantic Scholar · OpenAlex (W7154916891) ·
            Unpaywall · DataCite · Zenodo (DOI 10.5281/zenodo.19650920) ·
            OpenAIRE (propagating) · Google Scholar (propagating).
          </p>
        </section>

        <section className="text-center text-gray-400 text-sm">
          <p className="mb-2">
            Replication studies welcome.{" "}
            <a
              href="mailto:signal@gitdealflow.com"
              className="text-sky-400 hover:text-sky-300 underline"
            >
              signal@gitdealflow.com
            </a>{" "}
            for co-authorship on funding-event joins.
          </p>
          <p>
            <Link href="/methodology" className="text-sky-400 hover:text-sky-300 underline">
              /methodology
            </Link>{" "}
            ·{" "}
            <a
              href="https://signals.gitdealflow.com/api/signals.csv"
              className="text-sky-400 hover:text-sky-300 underline"
            >
              dataset CSV
            </a>{" "}
            ·{" "}
            <Link href="/predict" className="text-sky-400 hover:text-sky-300 underline">
              live signal tool
            </Link>
          </p>
        </section>
      </article>
    </>
  );
}

function FindingRow({ finding }: { finding: Finding }) {
  return (
    <li
      id={`finding-${finding.n}`}
      className="rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900 transition-colors"
    >
      <Link
        href={`/research/${finding.slug}`}
        className="block p-5 group"
        aria-label={`Open finding ${finding.n}: ${finding.title}`}
      >
        <div className="flex items-baseline gap-3 mb-2">
          <span className="font-mono text-xs text-sky-400 font-semibold shrink-0">
            #{finding.n.toString().padStart(2, "0")}
          </span>
          <p className="text-gray-100 text-base font-semibold leading-snug group-hover:text-sky-300 transition-colors">
            {finding.claim}
          </p>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed mb-2 pl-9">
          <span className="text-gray-400 italic">Why it matters: </span>
          {finding.why}
        </p>
        <p className="text-gray-400 text-xs pl-9">
          Source: {finding.section} · SSRN abstract=6606558 ·{" "}
          <span className="text-sky-500 group-hover:text-sky-400">
            View full finding →
          </span>
        </p>
      </Link>
    </li>
  );
}
