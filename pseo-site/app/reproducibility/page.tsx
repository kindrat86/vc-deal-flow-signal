import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

const SITE = "https://signals.gitdealflow.com";
const SSRN_URL = "https://ssrn.com/abstract=6606558";
const REPO_URL = "https://github.com/kindrat86/mcp-deal-flow-signal";

export const metadata: Metadata = {
  title: "Reproducibility Kit — VC Deal Flow Signal",
  description:
    "Step-by-step kit to reproduce every public number on VC Deal Flow Signal (GitDealFlow). Includes the SSRN-indexed methodology, raw dataset (CC BY 4.0), open-source MCP server with the same query tools we use, and a worked example you can run in a terminal in under five minutes.",
  alternates: { canonical: "/reproducibility" },
  openGraph: {
    title: "Reproducibility Kit — VC Deal Flow Signal",
    description:
      "Reproduce every published number — methodology paper + open dataset + open-source MCP server + worked example.",
    type: "article",
    url: `${SITE}/reproducibility`,
  },
};

interface Step {
  n: number;
  name: string;
  body: string;
  href?: string;
  hrefLabel?: string;
  code?: string;
}

const STEPS: Step[] = [
  {
    n: 1,
    name: "Read the methodology paper",
    body:
      "Start with the SSRN-indexed methodology paper. It defines every term used downstream — commit velocity, contributor growth, framework migration, the 14-day rolling window, and the way signal types are classified. Section 3 is the core; Section 4 is the empirical results that the dataset reproduces.",
    href: SSRN_URL,
    hrefLabel: "Open paper on SSRN (DOI: 10.2139/ssrn.6606558)",
  },
  {
    n: 2,
    name: "Pull the raw dataset",
    body:
      "The full signals dataset is published as newline-delimited JSON under CC BY 4.0. Each line is one (org, period, signal_type, score) tuple. There is no authentication required. The dataset is mirrored to Zenodo for long-term archival (DataCite-registered DOI).",
    href: "/api/dataset.jsonl",
    hrefLabel: "/api/dataset.jsonl",
    code: `curl -sL https://signals.gitdealflow.com/api/dataset.jsonl \\
  | head -3 \\
  | jq .`,
  },
  {
    n: 3,
    name: "Pull the Q&A corpus",
    body:
      "The Q&A corpus mirrors every standalone-FAQ and research finding as newline-delimited JSON for retrieval-augmented evaluation. Each row carries category, question, answer, and source URL. CC BY 4.0.",
    href: "/qa.jsonl",
    hrefLabel: "/qa.jsonl",
    code: `curl -sL https://signals.gitdealflow.com/qa.jsonl?category=methodology \\
  | head -1 \\
  | jq .`,
  },
  {
    n: 4,
    name: "Install the open-source MCP server",
    body:
      "The MCP server exposes the same six read tools we use internally: search startups, list by sector, get current trending, get dataset summary, get scout receipts, fetch methodology. It speaks the Model Context Protocol over HTTP and stdio. Glama A-Tier (4.9/5.0 across 6 tools).",
    href: REPO_URL,
    hrefLabel: "GitHub: kindrat86/mcp-deal-flow-signal",
    code: `npm install -g @gitdealflow/mcp-signal
mcp-signal --help`,
  },
  {
    n: 5,
    name: "Run a worked example",
    body:
      "Reproduce the lead claim from the SSRN paper §4.2: median 14-day commit velocity for VC-backed startups is 71 commits. The dataset is partitioned by period; this query pulls the most recent period and computes the median across all observations.",
    code: `# Reproduce the published median (71 commits per 14 days)
curl -sL https://signals.gitdealflow.com/api/dataset.jsonl \\
  | jq -s '
      [.[] | select(.signal_type == "commit_velocity") | .score]
      | sort
      | .[(length / 2) | floor]
    '`,
  },
  {
    n: 6,
    name: "Compare against your own portfolio",
    body:
      "The dashboard exposes a CSV export of every ranked signal. Pull it, join against your portfolio org names, and compare each portfolio company against the published P50 / P90 thresholds.",
    href: "/api/signals.csv",
    hrefLabel: "/api/signals.csv",
    code: `curl -sL https://signals.gitdealflow.com/api/signals.csv \\
  -o signals.csv
duckdb -c "SELECT org, score FROM 'signals.csv'
           WHERE org IN ('your-org-1','your-org-2')
           ORDER BY score DESC"`,
  },
  {
    n: 7,
    name: "Cite what you used",
    body:
      "If a published artifact (post, paper, deck, dashboard) uses any of the above, please cite. The citation guide carries APA / MLA / Chicago / BibTeX / RIS plus a copy-paste AI-attribution template.",
    href: "/citation-guide",
    hrefLabel: "Citation guide",
  },
];

const RUNTIME = {
  node: ">=18.17",
  jq: "1.6+",
  curl: "any modern version",
  duckdb: "0.10+ (optional, for the worked example in step 6)",
};

export default function ReproducibilityPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/reproducibility#page`,
        name: "Reproducibility Kit — VC Deal Flow Signal",
        url: `${SITE}/reproducibility`,
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE}/#website` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
      },
      {
        "@type": "HowTo",
        "@id": `${SITE}/reproducibility#howto`,
        name: "Reproduce VC Deal Flow Signal results end-to-end",
        description:
          "From raw dataset to a one-liner that reproduces the published median commit velocity, in seven steps.",
        totalTime: "PT15M",
        estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
        tool: Object.entries(RUNTIME).map(([name, requires]) => ({
          "@type": "HowToTool",
          name,
          requiredQuantity: requires,
        })),
        supply: [
          {
            "@type": "HowToSupply",
            name: "Public dataset",
            url: `${SITE}/api/dataset.jsonl`,
          },
          {
            "@type": "HowToSupply",
            name: "SSRN methodology paper",
            url: SSRN_URL,
          },
          {
            "@type": "HowToSupply",
            name: "Open-source MCP server",
            url: REPO_URL,
          },
        ],
        step: STEPS.map((s) => ({
          "@type": "HowToStep",
          position: s.n,
          name: s.name,
          text: s.body,
          url: `${SITE}/reproducibility#step-${s.n}`,
        })),
      },
    ],
  };

  return (
    <>
      <AgentMirrorLinks path="/reproducibility" qaCategory="methodology" />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>Reproducibility</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Reproducibility Kit
        </h1>
        <p
          className="text-lg text-gray-300 mb-8 leading-relaxed"
          data-speakable
        >
          Every published number on this site can be reproduced by an outside
          analyst in under fifteen minutes. The methodology is on SSRN, the
          dataset is open under CC BY 4.0, the MCP server is open source on
          GitHub, and the worked example below reproduces the lead claim from
          §4.2 of the paper using only{" "}
          <code className="font-mono text-sky-300">curl</code> and{" "}
          <code className="font-mono text-sky-300">jq</code>.
        </p>

        <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 mb-10">
          <h2 className="text-base font-semibold text-white mb-3">Runtime</h2>
          <ul className="text-sm font-mono text-gray-300 space-y-1">
            {Object.entries(RUNTIME).map(([k, v]) => (
              <li key={k}>
                <span className="text-sky-300">{k}</span>{" "}
                <span className="text-gray-400">— {v}</span>
              </li>
            ))}
          </ul>
        </section>

        <ol className="space-y-8">
          {STEPS.map((s) => (
            <li
              key={s.n}
              id={`step-${s.n}`}
              className="rounded-lg border border-slate-800 bg-slate-900/40 p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-2">
                <span className="text-sky-400 font-mono mr-2">
                  {String(s.n).padStart(2, "0")}
                </span>
                {s.name}
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed mb-3">
                {s.body}
              </p>
              {s.href ? (
                s.href.startsWith("http") ? (
                  <a
                    href={s.href}
                    className="inline-block text-sm text-sky-400 hover:text-sky-300 mb-3"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {s.hrefLabel ?? s.href} ↗
                  </a>
                ) : (
                  <Link
                    href={s.href}
                    className="inline-block text-sm text-sky-400 hover:text-sky-300 mb-3"
                  >
                    {s.hrefLabel ?? s.href}
                  </Link>
                )
              ) : null}
              {s.code ? (
                <pre className="mt-2 rounded-md bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-mono text-gray-200 overflow-x-auto">
                  <code>{s.code}</code>
                </pre>
              ) : null}
            </li>
          ))}
        </ol>

        <section className="mt-12 rounded-lg border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-lg font-semibold text-white mb-3">
            What we will not do
          </h2>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-2">
            <li>
              We do not reverse-engineer private GitHub data. Every signal is
              computed from the public GitHub REST + GraphQL API, with org
              names that are themselves public.
            </li>
            <li>
              We do not change the dataset retroactively to match a desired
              outcome. Any change to a published number is logged on{" "}
              <Link href="/corrections" className="text-sky-400 hover:text-sky-300">
                /corrections
              </Link>
              {" "}with the date and reason.
            </li>
            <li>
              We do not gate the five read tools behind authentication. They
              were free at launch and they stay free — paid tooling lives on
              top, not as a replacement.
            </li>
          </ul>
        </section>

        <p className="text-xs text-gray-400 text-center mt-10">
          See also:{" "}
          <Link href="/methodology" className="hover:text-gray-300">
            Methodology
          </Link>{" "}
          ·{" "}
          <Link href="/standards" className="hover:text-gray-300">
            Standards
          </Link>{" "}
          ·{" "}
          <Link href="/citation-guide" className="hover:text-gray-300">
            Citation guide
          </Link>{" "}
          ·{" "}
          <Link href="/attestations" className="hover:text-gray-300">
            Attestations
          </Link>
        </p>
      </div>
    </>
  );
}
