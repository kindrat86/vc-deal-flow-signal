import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import {
  DATA_NERD,
  HASHTAG_BANK,
  POSTING_HOURS_UTC,
} from "@/content/social-mascot";
import { SOCIAL_BATCH, BATCH_META } from "@/content/social-content-batch";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-static";

export const metadata: Metadata = withEditorialOverride({
  title:
    "The Data Nerd, social mascot · pillar mix · cadence | GitDealFlow",
  description:
    "GitDealFlow's anonymous social mascot, character bible, voice rules, content pillars, posting cadence across Twitter/Instagram/LinkedIn/Facebook/TikTok/YouTube. Synthetic voice (Cartesia Theo) + abstract avatar; founder identity stays private.",
  alternates: { canonical: "/data-nerd/social" },
  // Internal social-ops playbook (pillars, cadence, sample posts). Noindex:
  // it's an internal reference and its jargon-dense sample copy contradicts the
  // public "you never read a line of code" promise, keep it out of cold search
  // so Marcus never lands here. (Audit 2026-06-01.)
  robots: { index: false, follow: true },
  openGraph: {
    title: "The Data Nerd, GitDealFlow's social mascot",
    description:
      "Character bible · 5 content pillars · cadence across 7 channels · synthetic voice · 30-day content batch.",
    url: "https://signals.gitdealflow.com/data-nerd/social",
    type: "article",
  },
});

const HANDLE_STATUS_COLOR: Record<string, string> = {
  live: "border-emerald-700/40 bg-emerald-950/20 text-emerald-300",
  reserved: "border-amber-700/40 bg-amber-950/20 text-amber-300",
};

export default function DataNerdSocialPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id":
          "https://signals.gitdealflow.com/data-nerd/social#webpage",
        url: "https://signals.gitdealflow.com/data-nerd/social",
        name: "The Data Nerd, GitDealFlow's Social Mascot",
        description:
          "Character bible for the GitDealFlow synthetic mascot, voice rules, visual identity, content pillars, posting cadence across seven channels.",
        inLanguage: "en-US",
        isPartOf: { "@id": "https://signals.gitdealflow.com/#website" },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", ".speakable", "[data-agent-summary]"],
        },
      },
      {
        "@type": "Person",
        "@id":
          "https://signals.gitdealflow.com/data-nerd/social#datanerd",
        name: DATA_NERD.name,
        description:
          "Anonymous synthetic mascot for GitDealFlow. Composed of an abstract constellation avatar (one dot per atomic GitHub signal), a synthetic voice (Cartesia Theo), and a deliberately data-first writing style. Used across Twitter, Instagram, LinkedIn, Facebook, TikTok, YouTube, Threads, Bluesky, and Substack Notes.",
        knowsAbout: [
          "GitHub engineering signals",
          "Venture deal-flow sourcing",
          "Code-side sourcing methodology",
          "Alternative data for venture",
        ],
        sameAs: Object.values(DATA_NERD.handles).filter(Boolean),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "All Sectors",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Data Nerd",
            item: "https://signals.gitdealflow.com/data-nerd",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Social",
            item: "https://signals.gitdealflow.com/data-nerd/social",
          },
        ],
      },
    ],
  };

  return (
    <>
      <AgentMirrorLinks path="/data-nerd/social" qaCategory="brand" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/data-nerd"
            className="hover:text-gray-300 transition-colors"
          >
            Data Nerd
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Social</span>
        </nav>

        <header className="mb-10">
          <p className="text-sky-400 text-sm font-medium mb-3 uppercase tracking-wider">
            Anonymous · Synthetic · Cross-channel
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            The Data Nerd, social mascot bible
          </h1>
          <p
            className="text-gray-300 text-base leading-relaxed mb-3 max-w-2xl"
            data-agent-summary
          >
            GitDealFlow ships behind a synthetic mascot. The Data Nerd is
            composed of an abstract constellation avatar (seven dots, one for
            each atomic GitHub signal), a synthetic voice generated by
            Cartesia Theo, and a deliberately data-first writing style. The
            founder&rsquo;s real name, voice, and face never appear, the
            framework, the data, and the methodology paper do all the talking.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
            This page is the public character bible. Operators of partner
            accounts (LPs, syndicate members, affiliate community managers)
            use it to keep voice consistent when they re-share or repurpose
            content. The 30-day content batch updates monthly.
          </p>
        </header>

        {/* Channel handles + status. */}
        <section className="mb-12" aria-label="Channels and handles">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            Channels
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(DATA_NERD.handles).map(([channel, handle]) => {
              const status = (DATA_NERD.status as Record<string, string>)[channel];
              return (
                <div
                  key={channel}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 p-3"
                >
                  <div>
                    <p className="text-gray-100 text-sm font-medium capitalize">
                      {channel.replace(/_/g, " ")}
                    </p>
                    <p className="text-gray-400 text-xs font-mono">{handle}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border font-medium ${HANDLE_STATUS_COLOR[status] || ""}`}
                  >
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-gray-500 text-xs mt-3 italic">
            <span className="text-emerald-300">Live</span>: actively posting.{" "}
            <span className="text-amber-300">Reserved</span>: handle secured,
            account spin-up scheduled. Cross-posting via existing pipeline.
          </p>
        </section>

        {/* Voice rules. */}
        <section className="mb-12" aria-label="Voice and tone">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            Voice rules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-emerald-700/40 bg-emerald-950/20 p-4">
              <p className="text-emerald-300 text-xs font-medium mb-2 uppercase tracking-wider">
                Primary
              </p>
              <ul className="space-y-1.5 text-gray-200 text-sm leading-relaxed">
                {DATA_NERD.tone.primary.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-emerald-400 mt-0.5">→</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-rose-700/40 bg-rose-950/20 p-4">
              <p className="text-rose-300 text-xs font-medium mb-2 uppercase tracking-wider">
                Avoid
              </p>
              <ul className="space-y-1.5 text-gray-200 text-sm leading-relaxed">
                {DATA_NERD.tone.avoid.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-rose-400 mt-0.5">×</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-3 rounded-lg border border-amber-700/40 bg-amber-950/20 p-4">
            <p className="text-amber-300 text-xs font-medium mb-2 uppercase tracking-wider">
              Hard rules
            </p>
            <ul className="space-y-1.5 text-gray-200 text-sm leading-relaxed">
              {DATA_NERD.tone.rules.map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="text-amber-400 mt-0.5">⚠</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Content pillars + ratio. */}
        <section className="mb-12" aria-label="Content pillars">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            Content pillars (target ratio across 30 days)
          </h2>
          <div className="space-y-3">
            {DATA_NERD.pillars.map((p) => (
              <div
                key={p.slug}
                className="rounded-lg border border-slate-800 bg-slate-900/60 p-4"
              >
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <p className="text-gray-100 font-semibold text-sm">
                    {p.label}
                  </p>
                  <p className="text-sky-300 font-mono text-sm">
                    {Math.round(p.ratio * 100)}%
                  </p>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed mb-2">
                  {p.description}
                </p>
                <p className="text-gray-300 text-xs italic leading-relaxed">
                  &ldquo;{p.example}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Posting cadence. */}
        <section className="mb-12" aria-label="Posting cadence">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            Posting cadence + UTC slots
          </h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-950/60">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-400 text-xs font-medium uppercase tracking-wider">
                    Channel
                  </th>
                  <th className="px-4 py-2 text-left text-gray-400 text-xs font-medium uppercase tracking-wider">
                    Frequency
                  </th>
                  <th className="px-4 py-2 text-left text-gray-400 text-xs font-medium uppercase tracking-wider">
                    UTC slots
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(DATA_NERD.cadence).map(([channel, freq]) => {
                  const slots =
                    (POSTING_HOURS_UTC as Record<string, readonly string[]>)[
                      channel
                    ] ?? [];
                  return (
                    <tr key={channel} className="border-t border-slate-800">
                      <td className="px-4 py-3 text-gray-200 capitalize text-sm">
                        {channel.replace(/_/g, " ")}
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-xs leading-relaxed">
                        {freq}
                      </td>
                      <td className="px-4 py-3 text-sky-300 font-mono text-xs">
                        {slots.length > 0 ? slots.join(", ") : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Hashtag bank. */}
        <section className="mb-12" aria-label="Hashtag bank">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            Hashtag bank
          </h2>
          <div className="space-y-3">
            {(["primary", "vertical", "topical", "reach"] as const).map(
              (tier) => (
                <div
                  key={tier}
                  className="rounded-lg border border-slate-800 bg-slate-900/60 p-3"
                >
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                    {tier}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {HASHTAG_BANK[tier].map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded border border-slate-700 bg-slate-950/60 text-gray-300 font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        {/* Sample batch. */}
        <section className="mb-12" aria-label="Sample 5-post batch">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            Sample batch, first 5 posts of the canonical pillar mix
          </h2>
          <div className="space-y-3">
            {SOCIAL_BATCH.map((post) => (
              <details
                key={post.id}
                className="rounded-lg border border-slate-800 bg-slate-900/60 p-4"
              >
                <summary className="cursor-pointer">
                  <span className="text-sky-300 text-xs font-mono uppercase tracking-wider mr-2">
                    {post.scheduledIsoDate}
                  </span>
                  <span className="text-gray-100 text-sm font-medium">
                    {post.pillar.replace(/-/g, " ")}
                  </span>
                  <span className="text-gray-500 text-xs ml-2">
                    · primary: {post.primary}
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-slate-700/40 space-y-3">
                  {Object.entries(post.bodies).map(([channel, body]) => (
                    <div key={channel}>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1.5">
                        {channel}
                      </p>
                      <pre className="whitespace-pre-wrap text-gray-200 text-xs leading-relaxed font-mono bg-slate-950/40 p-3 rounded border border-slate-800">
                        {body}
                      </pre>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-3 italic">
            Total in current batch: {BATCH_META.total} posts. Full 30-day batch
            generated monthly from{" "}
            <code className="text-sky-300">/api/v1/signals.json</code> +{" "}
            <code className="text-sky-300">
              /api/v1/methodology.json
            </code>
            . Programmatic mirror at{" "}
            <Link
              href="/api/v1/social-mascot.json"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              /api/v1/social-mascot.json
            </Link>
            .
          </p>
        </section>

        <p className="text-xs text-gray-400 text-center">
          See also:{" "}
          <Link
            href="/data-nerd"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            /data-nerd
          </Link>{" "}
          (mascot hub) ·{" "}
          <Link
            href="/about/founder"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            /about/founder
          </Link>{" "}
          (anonymity rule) ·{" "}
          <Link
            href="/disclosure"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            /disclosure
          </Link>{" "}
          (founder disclosure)
        </p>
      </div>
    </>
  );
}
