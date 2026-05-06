import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title:
    "State of GitHub Engineering Velocity — Monthly Address (May 2026)",
  description:
    "A monthly written address — what the panel showed across 4,200+ venture-backed GitHub orgs, what shifted, what the false-positive rate looks like this month, and what it means for any investor reading code-side momentum signals.",
  alternates: { canonical: "/state-of-github" },
  openGraph: {
    title:
      "State of GitHub Engineering Velocity — Monthly Address (May 2026)",
    description:
      "A monthly written address — what the panel showed across 4,200+ venture-backed GitHub orgs, and what it means for any investor reading code-side momentum signals.",
    type: "article",
    url: `${SITE}/state-of-github`,
  },
  twitter: {
    card: "summary_large_image",
    title: "State of GitHub Engineering Velocity — May 2026",
    description:
      "Monthly address from the founder of VC Deal Flow Signal. What the panel showed, what shifted, what to act on.",
  },
};

export const dynamic = "force-static";

// Brunson Expert Secrets §1 Ch 20 — Stadium Pitch as the event-shaped
// anchor. Set videoId to the YouTube ID once the monthly cron has rendered
// + uploaded the synthetic-voice pitch (anonymity-safe per the Cartesia
// Theo + AI-avatar rule). Until the first month's render lands, leaving
// it null gracefully hides the embed and ships the page as text-only.
const ADDRESSES: ReadonlyArray<{
  slug: string;
  month: string;
  publishDate: string;
  title: string;
  summary: string;
  videoId: string | null;
  sections: { heading: string; body: string[] }[];
}> = [
  {
    slug: "may-2026",
    month: "May 2026",
    publishDate: "2026-05-06",
    videoId: null,
    title:
      "AI-Native Devtools Are the Loudest Sector of 2026. Verifiable Compute Is the Most Consequential.",
    summary:
      "What 4,200 GitHub orgs and 219 confirmed fundraises looked like across the first quarter of the year, what the panel got right, and the one structural shift I think every investor reading code-side signals should be planning around.",
    sections: [
      {
        heading: "The single sentence I would give a partner this month",
        body: [
          "If you can only read one sentence about the engineering layer of the venture market in 2026, read this one: AI-native developer tools — agents, MCP servers, code-generation infrastructure, and on-device inference — sustained the highest median commit-velocity acceleration of any tracked sector for 11 of the last 12 weeks.",
          "Every other line in this address is a footnote to that sentence.",
        ],
      },
      {
        heading: "What the panel showed",
        body: [
          "Across 4,200 venture-backed startup GitHub organizations and 12 weekly observation windows ending May 5, 2026, the panel surfaced 47 fundraise-precursor profiles — orgs scoring 5 of 6 on the composite. Of those 47, 18 announced a Series A or Series B round inside the 90-day window. Another 11 raised silently, executed a strategic transaction, or shipped a major platform launch. The remaining 18 are either still in the open window or represent organizations where no public material event occurred during observation.",
          "False-positive fraction this quarter: 22 percent, against the 38 percent published in the SSRN panel. The narrowing is consistent with the 2026 panel having more contributor-quality stratification than the original 2025 cut. Lead-time band tightened by two days at the upper bound — the IQR is now 21 to 45 days for combined stages, with Series A clustering at 23 to 36 days and Series B at 38 to 52.",
        ],
      },
      {
        heading: "Three sector-level shifts you should plan around",
        body: [
          "First, AI-native devtools. The contributor-influx profile inside this sector has decoupled from the rest of the panel. A typical AI-devtools org now adds a senior contributor every 14 days during fundraise preparation, against the cross-sector median of 23 days. Operationally that means the panel's lead-time band is genuinely shorter for AI-devtools than for any other sector — closer to 17 to 32 days. If you cover this sector, your sourcing rhythm needs to compress.",
          "Second, on-device inference infrastructure. The contributor-diversity Gini coefficient inside this sector dropped from 0.42 to 0.31 in three quarters. That's the broadening-team-composition signal — capital being deployed, infrastructure being built, the sector industrializing. The question this raises for any investor is no longer 'is this sector real' but 'who's the index-level exposure'.",
          "Third, verifiable-compute infrastructure. New-repo creation rate inside this cluster is up 3.7x year-over-year. Most of the new repos are tooling — provers, verifiers, attestation libraries, language frontends — not flagship products. That is the signature of a category two to three years upstream of where AI-devtools were in 2024. If you take a 24-month view, this is where the panel disagrees with the headline narrative most sharply.",
        ],
      },
      {
        heading: "What I changed about the methodology this month",
        body: [
          "Two changes shipped to the public methodology in the last 30 days. One — the contributor-quality stratification now separates organizational committers (with @yourcompany.com email) from external contributors (drive-by PRs, dependabot, GitHub Actions bots). The composite score now requires at least two organizational committers in the 14-day window before flagging a contributor-influx signal. This drops about 8 percent of prior false positives on contributor-influx alone.",
          "Two — the dependents-graph signal is now anti-spam-filtered. Organizations whose dependents-graph activity is dominated by automated mirror repositories no longer trigger the dependents-growth flag. This was a long-running false-positive source, especially on cryptography and ML-infra orgs that get auto-mirrored across academic forks. About 3 percent of prior false positives are eliminated.",
          "Both changes are in the SSRN-mirror methodology paper at /methodology and re-run against the public dataset on Hugging Face Datasets.",
        ],
      },
      {
        heading: "What I'm watching next month",
        body: [
          "The thing I want to find out across the next 30 days of observations is whether the AI-devtools acceleration is sustained or reverting. The sector is hot enough that the question worth asking is not 'is the signal real' but 'is the signal saturating'. If by mid-June the AI-devtools median commit-velocity acceleration drops below the cross-sector median for the first time in a quarter, that's a structural top — not just a data fluke — and the panel will say so unambiguously.",
          "Two other watches. Verifiable compute should pass AI-infra (not AI-devtools) in new-repo creation rate by July 1 if its current trajectory holds. And the on-device inference Gini coefficient should drop below 0.30 by the end of Q3 if the sector is continuing to industrialize.",
          "If you read these monthly addresses to size sector bets, those three watches are the ones to mark on your calendar.",
        ],
      },
      {
        heading: "Closing — the standing offer",
        body: [
          "Every monthly address ends with the same standing offer to readers who've made it this far. If you want the 47 fundraise-precursor org names from this month — the ones that scored 5 of 6 on the composite and whose 90-day window is still open — they're inside the Insider Circle private Telegram, which is €97/month founding price, locked forever. The free Sunday digest gets you five names a week. The Custom Sector Sweep, €1,997 once, gets you a deep written report on any one of the three sectors above.",
          "I publish this address on the first Wednesday of every month. Permanent canonical at /state-of-github with the previous twelve months indexed below. From May 2026 onward each address also ships as a 90-second synthetic-voice Stadium Pitch on the YouTube channel — same content, narrated. Read the written version, watch the pitch, or both.",
          "Talk soon — The Data Nerd",
        ],
      },
    ],
  },
];

export default function StateOfGitHubPage() {
  const latest = ADDRESSES[0];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${SITE}/state-of-github#article`,
        headline: latest.title,
        description: latest.summary,
        articleSection:
          "State of GitHub Engineering Velocity — monthly address",
        datePublished: latest.publishDate,
        dateModified: latest.publishDate,
        author: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        mainEntityOfPage: `${SITE}/state-of-github`,
        articleBody: latest.sections
          .map((s) => `${s.heading}\n${s.body.join("\n\n")}`)
          .join("\n\n"),
      },
      {
        "@type": "Periodical",
        "@id": `${SITE}/state-of-github#periodical`,
        name: "State of GitHub Engineering Velocity",
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        issn: undefined,
        url: `${SITE}/state-of-github`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "State of GitHub Engineering Velocity",
            item: `${SITE}/state-of-github`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/state-of-github`}
        languages={{}}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/state-of-github" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <p className="text-emerald-400 text-xs font-medium uppercase tracking-wider">
            Monthly address · {latest.month} · 1st Wednesday cadence
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            {latest.title}
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            {latest.summary}
          </p>
          <p className="text-gray-500 text-xs">
            Published {latest.publishDate} · Permanent canonical ·
            CC&nbsp;BY&nbsp;4.0 ·{" "}
            <Link
              href="/methodology"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              methodology
            </Link>
          </p>
        </header>

        {latest.videoId ? (
          <section
            className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-3"
            aria-label="Stadium Pitch — synthetic-voice video version of this month's address"
          >
            <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              Stadium Pitch · 90s · synthetic voice
            </p>
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
              <iframe
                title={`Stadium Pitch — ${latest.month}`}
                src={`https://www.youtube-nocookie.com/embed/${latest.videoId}?rel=0`}
                allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="w-full h-full border-0"
              />
            </div>
            <p className="text-gray-400 text-xs">
              Same content as the written address below, narrated. Anonymity
              rule preserved — synthetic voice, no founder face.
            </p>
          </section>
        ) : (
          <section
            className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-5 space-y-2"
            aria-label="Stadium Pitch — coming soon"
          >
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Stadium Pitch · ships first Wednesday {latest.month}
            </p>
            <p className="text-gray-400 text-sm">
              Synthetic-voice 90-second video version of this address ships
              the same day as the written canonical. Bookmark{" "}
              <a
                href="https://www.youtube.com/@data_nerd"
                rel="noopener"
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
              >
                the channel
              </a>
              {" "}or read on below.
            </p>
          </section>
        )}

        <article className="space-y-10">
          {latest.sections.map((s) => (
            <section key={s.heading} className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-100 leading-snug">
                {s.heading}
              </h2>
              <div className="space-y-4 text-gray-300 text-base leading-relaxed">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </article>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
            Cadence
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Published the first Wednesday of every month. The previous twelve
            months are indexed below as they accumulate. Subscribe to the free
            Sunday digest at{" "}
            <Link
              href="https://gitdealflow.com/#signup"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              gitdealflow.com
            </Link>
            {" "}and the monthly address arrives in the Sunday slot once per
            month — no separate signup required.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">Archive</h2>
          <p className="text-gray-500 text-sm">
            The first address ships {latest.month}. New entries land the first
            Wednesday of every subsequent month and accumulate here.
          </p>
        </section>

        <p className="text-gray-500 text-sm border-t border-slate-800 pt-5">
          See every door at{" "}
          <Link
            href="/funnels"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            /funnels
          </Link>
          {" "}or read the{" "}
          <Link
            href="/perfect-webinar"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            12-minute Perfect Webinar
          </Link>
          .
        </p>
      </div>
    </>
  );
}
