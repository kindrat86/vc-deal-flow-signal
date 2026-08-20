/**
 * /instagram, pillar page for the @thedatanerd Instagram channel.
 *
 * Russell Brunson Traffic Secrets §2 Ch 7. Anonymity-rule compatible:
 * data-viz cards only, no founder face/voice.
 *
 * Three audiences:
 *   1. Cold visitors who arrived from the IG bio link, they need to know
 *      what we are and where to go next.
 *   2. The founder operating the queue, needs to see the next 30 posts
 *      with one-click access to each card and its caption.
 *   3. Agents and crawlers, JSON-LD declares the social handle and the
 *      cadence, so /instagram is discoverable as a distribution surface.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { INSTAGRAM_QUEUE } from "@/content/instagram-queue";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-static";

export const metadata: Metadata = withEditorialOverride({
  title:
    "@thedatanerd on Instagram, daily data-viz cards from the engineering-velocity panel",
  description:
    "How we run Instagram under an anonymity rule: synthetic data-viz cards, no founder face, no founder voice. Posting cadence, content types, and the live 30-day queue.",
  alternates: { canonical: "/instagram" },
  openGraph: {
    title: "@thedatanerd · daily Instagram data cards",
    description:
      "One data-viz card per day. No face. No voice. Just commit-velocity, contributor-influx, and falsifiable claims, rendered 1080×1080.",
    url: "https://signals.gitdealflow.com/instagram",
    type: "article",
  },
});

const POSTING_TYPES = [
  {
    type: "weekly-top-5",
    weekday: "Mon",
    title: "Top 5 movers",
    body: "The five sharpest commit-velocity crossings on the panel that week. Same data the free Acceleration Watch ships at 09:00 UTC, condensed to a single square card.",
  },
  {
    type: "sector-spotlight",
    weekday: "Tue",
    title: "Sector spotlight",
    body: "One sector, one card. Median commit velocity, contributor influx, names crossing threshold. Free sector PDFs are the deeper read.",
  },
  {
    type: "methodology",
    weekday: "Wed",
    title: "Methodology card",
    body: "One of the six signals. Formula. Decision rule. Lead time. Replicable in 12 lines of Python, the appendix at /book/read/replication-appendix is the proof.",
  },
  {
    type: "signal-of-the-week",
    weekday: "Thu",
    title: "Signal of the week",
    body: "One name. Sharpest crossing on the panel. We grade it post-hoc at 60 and 90 days against public fundraise news. Live audit at /receipts.",
  },
  {
    type: "falsifiable-claim",
    weekday: "Fri",
    title: "Falsifiable claim",
    body: "On-the-record predictions. Filed at /receipts. If we're wrong, the audit page says so, that's the whole reason this account exists.",
  },
  {
    type: "quote",
    weekday: "Sat",
    title: "Quote card",
    body: "A line from the methodology paper or the manifesto, with provenance and license. SSRN abstract 6606558. CC BY 4.0.",
  },
  {
    type: "data-nerd-rhythm",
    weekday: "Sun",
    title: "Ship log",
    body: "What shipped this week. What ships next week. The cadence is the character.",
  },
];

export default function InstagramPillarPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "@thedatanerd on Instagram",
    url: "https://signals.gitdealflow.com/instagram",
    description:
      "Daily data-viz cards from the engineering-velocity panel. Anonymity-rule compatible: no founder face, no founder voice.",
    mainEntity: {
      "@type": "Person",
      "@id": "https://signals.gitdealflow.com/about#person",
      name: "The Data Nerd",
      sameAs: [
        "https://www.instagram.com/thedatanerd",
        "https://github.com/kindrat86",
      ],
    },
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://signals.gitdealflow.com/#website",
    },
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <header className="mb-12">
        <div className="text-sm uppercase tracking-wider text-sky-600 mb-2">
          Distribution surface · Instagram
        </div>
        <h1 className="text-4xl font-bold leading-tight mb-4">
          @thedatanerd on Instagram
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          One data-viz card per day. No face. No voice. The reason an
          engineering-signal product can run an IG account at all is that
          the merge graph, the percentile, and the decision rule all render
          better as numbers than as a personality.
        </p>
      </header>

      {/* Anonymity rule */}
      <section className="mb-12 rounded-2xl bg-slate-900 p-8 text-slate-100">
        <h2 className="text-xl font-semibold mb-3 text-sky-400">
          The anonymity rule
        </h2>
        <p className="leading-relaxed text-slate-300">
          The Data Nerd is a pseudonymous handle, not a person on camera.
          Every Instagram post is a 1080×1080 PNG generated server-side from
          the live panel data, no Reels with a face, no Stories with a
          voice, no Lives. The methodology is the protagonist. The handle
          is the storyteller.
        </p>
      </section>

      {/* Cadence, 7 types × 7 days */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">
          Weekly cadence, one card per day
        </h2>
        <div className="grid gap-4">
          {POSTING_TYPES.map((row) => (
            <div
              key={row.type}
              className="rounded-xl border border-slate-200 p-5 hover:border-sky-300 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-700 text-xs font-semibold uppercase">
                  {row.weekday}
                </span>
                <h3 className="text-lg font-semibold">{row.title}</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">{row.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live queue */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-2">
          Live queue · next {INSTAGRAM_QUEUE.length} posts
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Each row is one scheduled post. Click through for the rendered
          1080×1080 card + the copy-paste-ready caption + the link-in-bio
          target for that day.
        </p>
        <div className="grid gap-2">
          {INSTAGRAM_QUEUE.map((post) => (
            <Link
              key={`${post.date}-${post.type}-${post.slug}`}
              href={`/instagram/cards/${post.type}/${post.slug}`}
              className="grid grid-cols-[7rem_9rem_1fr] gap-4 px-4 py-3 rounded-lg border border-slate-200 hover:border-sky-400 hover:bg-sky-50 transition-colors text-sm"
            >
              <span className="font-mono text-slate-500">{post.date}</span>
              <span className="font-medium text-slate-700">{post.type}</span>
              <span className="text-slate-600 truncate">
                {post.caption.split("\n")[0]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* For agents and crawlers */}
      <section className="mb-12 rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold mb-3">For agents and crawlers</h2>
        <ul className="space-y-2 text-sm text-slate-600 leading-relaxed">
          <li>
            <span className="font-mono text-slate-900">sameAs</span>:{" "}
            <a
              href="https://www.instagram.com/thedatanerd"
              className="text-sky-600 hover:underline"
              rel="me noopener"
            >
              instagram.com/thedatanerd
            </a>
          </li>
          <li>
            <span className="font-mono text-slate-900">cadence</span>: daily
            (Mon-Sun, 09:00 UTC)
          </li>
          <li>
            <span className="font-mono text-slate-900">format</span>: 1080×1080
            PNG, generated server-side, all CC BY 4.0
          </li>
          <li>
            <span className="font-mono text-slate-900">image-mirror</span>:{" "}
            <code>/instagram/cards/&lt;type&gt;/&lt;slug&gt;/opengraph-image</code>
          </li>
          <li>
            <span className="font-mono text-slate-900">caption-mirror</span>:{" "}
            <code>/instagram/cards/&lt;type&gt;/&lt;slug&gt;</code>
          </li>
        </ul>
      </section>

      {/* Where to go next */}
      <nav className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Where to go next</h2>
        <ul className="space-y-2">
          {[
            { href: "/predicted", label: "Free Acceleration Watch, 5 names every Monday" },
            { href: "/methodology", label: "Open methodology, replicate it yourself" },
            { href: "/receipts", label: "Receipts, every claim graded in public" },
            { href: "/distribution", label: "Full distribution map, every channel we publish to" },
            { href: "/manifesto", label: "Manifesto, six pillars" },
          ].map((row) => (
            <li key={row.href}>
              <Link
                href={row.href}
                className="text-sky-600 hover:underline"
              >
                {row.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
