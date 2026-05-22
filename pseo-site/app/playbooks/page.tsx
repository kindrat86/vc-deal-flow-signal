import type { Metadata } from "next";
import Link from "next/link";
import { playbooks } from "@/content/playbooks";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { DEFAULT_HREFLANG_LANGUAGES } from "@/lib/hreflang";

const SITE = "https://signals.gitdealflow.com";

export const dynamic = "force-static";
export const revalidate = 604800;

export const metadata: Metadata = {
  title:
    "Playbooks — operator how-tos for VC deal flow via GitHub signals",
  description:
    "Reproducible how-tos for operator-investors, scouts, solo founders, and angels. Each playbook ships a fixed time-budget, a step-by-step rubric, and a CTA into the live product.",
  alternates: { canonical: "/playbooks" },
  openGraph: {
    title:
      "Playbooks — operator how-tos for VC deal flow via GitHub signals",
    description:
      "Reproducible how-tos for operator-investors, scouts, solo founders, and angels. Step-by-step rubrics with citable facts and CTAs into the live product.",
    url: `${SITE}/playbooks`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Playbooks — operator how-tos for VC deal flow",
    description:
      "Reproducible how-tos for operator-investors, scouts, solo founders, and angels.",
  },
};

const DIFFICULTY_BADGE: Record<
  "beginner" | "intermediate" | "advanced",
  string
> = {
  beginner:
    "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  intermediate: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  advanced: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

function formatDuration(iso: string): string {
  // Lightweight ISO-8601 duration formatter for the common subset
  // emitted by playbooks.ts. We only handle PT[H]H[M]M so a hand-rolled
  // parser keeps us off the third-party dependency surface.
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?$/);
  if (!m) return iso;
  const h = m[1] ? Number(m[1]) : 0;
  const min = m[2] ? Number(m[2]) : 0;
  if (h && min) return `${h}h ${min}m`;
  if (h) return `${h}h`;
  return `${min}m`;
}

export default function PlaybooksIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Playbooks — operator how-tos for VC deal flow",
        description:
          "Reproducible how-tos for operator-investors, scouts, solo founders, and angels. Each playbook ships a fixed time-budget, a step-by-step rubric, and a CTA into the live product.",
        url: `${SITE}/playbooks`,
        hasPart: playbooks.map((p) => ({
          "@type": "HowTo",
          name: p.h1,
          url: `${SITE}/playbooks/${p.slug}`,
          description: p.description,
          totalTime: p.totalTime,
        })),
      },
      {
        "@type": "ItemList",
        name: "Playbooks — operator how-tos",
        description:
          "List of reproducible operator-investor playbooks ranging from 15-minute qualification rubrics to 18-month relationship-compounding mechanics.",
        numberOfItems: playbooks.length,
        itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: playbooks.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.h1,
          url: `${SITE}/playbooks/${p.slug}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "All Sectors",
            item: SITE,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Playbooks",
            item: `${SITE}/playbooks`,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${SITE}/playbooks#webpage`,
        url: `${SITE}/playbooks`,
        name: "Playbooks — operator how-tos for VC deal flow via GitHub signals",
        description:
          "Reproducible how-tos for operator-investors, scouts, solo founders, and angels.",
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE}/#website` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [
            "[data-speakable]",
            "h1",
            "h2",
            ".speakable",
            "[data-agent-summary]",
          ],
        },
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/playbooks`}
        languages={DEFAULT_HREFLANG_LANGUAGES}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/playbooks" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-3">
            Playbooks
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-3 leading-tight">
            Operator how-tos for VC deal flow.
          </h1>
          <p
            className="text-gray-400 text-base leading-relaxed"
            data-speakable
          >
            Reproducible playbooks for operator-investors, scouts, solo
            founders, and angels — each shipping a fixed time budget, a
            step-by-step rubric, and a clean handoff into the live product.
            Steal them, fork them, run them weekly.
          </p>
        </header>

        <ul className="space-y-4">
          {playbooks.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/playbooks/${p.slug}`}
                className="block rounded-lg border border-slate-800 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-900 px-5 py-4 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wider ${DIFFICULTY_BADGE[p.difficulty]}`}
                  >
                    {p.difficulty}
                  </span>
                  <span className="text-[10px] text-slate-500 tabular-nums font-semibold uppercase tracking-wider">
                    {formatDuration(p.totalTime)} · {p.steps.length} steps
                  </span>
                </div>
                <p className="text-gray-100 font-semibold text-base mb-1">
                  {p.h1}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {p.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <section
          className="mt-12 rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3"
          aria-label="How playbooks connect to the product"
        >
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            How these connect to the product
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Playbook → tool → outcome.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Every playbook hands off to the right surface at the right step
            — the free public signals feed for sourcing pulls, the methodology
            page for scoring questions, the free book for worked examples, and{" "}
            <Link
              href="/firstlook"
              className="text-sky-300 underline decoration-dotted hover:text-sky-200"
            >
              /firstlook
            </Link>{" "}
            for the live preview. Run a playbook end-to-end and you&rsquo;ll
            naturally see which surface you want next.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/firstlook"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-colors"
            >
              See the live preview →
            </Link>
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Grab the free book →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
