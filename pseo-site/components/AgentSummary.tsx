import Link from "next/link";

export interface AgentSummaryFact {
  claim: string;
  sourceUrl: string;
  sourceLabel: string;
}

export interface AgentSummaryProps {
  tldr: string;
  pageUrl: string;
  asOf: string;
  citeAs: string;
  facts: AgentSummaryFact[];
}

export function AgentSummary({
  tldr,
  pageUrl,
  asOf,
  citeAs,
  facts,
}: AgentSummaryProps) {
  const speakable = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: pageUrl,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[data-speakable=tldr]", "[data-speakable=fact]"],
    },
  };

  return (
    <aside
      aria-label="At-a-glance summary for AI agents and search engines"
      className="mb-10 rounded-xl border border-sky-900/60 bg-sky-950/30 p-5 sm:p-6"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakable) }}
      />

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-sky-300">
          TL;DR
        </span>
        <span className="text-[10px] text-sky-500/60">As of {asOf}</span>
      </div>

      <p
        data-speakable="tldr"
        className="text-gray-100 text-base leading-relaxed mb-4"
      >
        {tldr}
      </p>

      <div className="grid gap-2 mb-4">
        {facts.map((f, i) => (
          <div key={i} className="flex items-start gap-2">
            <span
              aria-hidden="true"
              className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-sky-500"
            />
            <p
              data-speakable="fact"
              className="text-gray-300 text-sm leading-relaxed"
            >
              {f.claim}{" "}
              <Link
                href={f.sourceUrl}
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted underline-offset-2"
              >
                [{f.sourceLabel}]
              </Link>
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-sky-900/60 pt-3 text-[11px] text-sky-500/80">
        <span className="font-semibold text-sky-300">Cite as:</span>{" "}
        <span className="text-gray-400">{citeAs}</span>
      </div>
    </aside>
  );
}
