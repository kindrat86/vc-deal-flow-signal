import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import {
  SWIPE_TEMPLATES,
  SWIPE_KIT_META,
  type SwipeArchetype,
} from "@/content/affiliate-swipe-kit";

export const dynamic = "force-static";

const PORTAL_URL = "https://gitdealflow.refgrow.com";

export const metadata: Metadata = {
  title:
    "Affiliate Swipe Kit — Clone-ready content templates | GitDealFlow",
  description:
    "Six clone-ready content templates for GitDealFlow affiliates: 7-tweet thread, LinkedIn post, long-form blog post, 100-word newsletter mention, 3-min podcast script, 3-email sequence. The bait is the free 31k-word book; you funnel; the BOOK_DRIP sequence converts. 60-day cookie.",
  alternates: { canonical: "/affiliates/funnel-hack" },
  openGraph: {
    title: "Affiliate Swipe Kit — Clone-ready templates",
    description:
      "6 ready-made content pieces. 7-tweet thread, LinkedIn post, blog post, newsletter mention, podcast script, 3-email sequence. 60-day cookie, 20% lifetime commission.",
    url: "https://signals.gitdealflow.com/affiliates/funnel-hack",
    type: "article",
  },
};

const ARCHETYPE_LABELS: Record<SwipeArchetype, string> = {
  "tweet-thread": "Twitter / X thread",
  "linkedin-post": "LinkedIn post",
  "blog-post": "Blog / Substack",
  "newsletter-mention": "Newsletter mention",
  "podcast-segment": "Podcast script",
  "email-sequence-3": "3-email sequence",
};

const ARCHETYPE_TONES: Record<SwipeArchetype, string> = {
  "tweet-thread": "border-sky-700/40 bg-sky-950/20",
  "linkedin-post": "border-blue-700/40 bg-blue-950/20",
  "blog-post": "border-emerald-700/40 bg-emerald-950/20",
  "newsletter-mention": "border-amber-700/40 bg-amber-950/20",
  "podcast-segment": "border-violet-700/40 bg-violet-950/20",
  "email-sequence-3": "border-rose-700/40 bg-rose-950/20",
};

export default function AffiliateFunnelHackPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id":
          "https://signals.gitdealflow.com/affiliates/funnel-hack#webpage",
        url: "https://signals.gitdealflow.com/affiliates/funnel-hack",
        name: "GitDealFlow Affiliate Swipe Kit",
        description:
          "Six clone-ready content templates that pre-sell GitDealFlow to an affiliate's audience. Tweet thread, LinkedIn post, blog post, newsletter mention, podcast script, 3-email sequence.",
        inLanguage: "en-US",
        isPartOf: { "@id": "https://signals.gitdealflow.com/#website" },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", ".speakable", "[data-agent-summary]"],
        },
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
            name: "Affiliates",
            item: "https://signals.gitdealflow.com/affiliates",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Swipe Kit",
            item: "https://signals.gitdealflow.com/affiliates/funnel-hack",
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Affiliate swipe-kit templates",
        numberOfItems: SWIPE_TEMPLATES.length,
        itemListElement: SWIPE_TEMPLATES.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.title,
          description: `${ARCHETYPE_LABELS[t.archetype]} · ${t.bestFor}`,
        })),
      },
    ],
  };

  return (
    <>
      <AgentMirrorLinks
        path="/affiliates/funnel-hack"
        qaCategory="business-model"
      />
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
            href="/affiliates"
            className="hover:text-gray-300 transition-colors"
          >
            Affiliates
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Swipe Kit</span>
        </nav>

        <header className="mb-10">
          <p className="text-amber-400 text-sm font-medium mb-3 uppercase tracking-wider">
            Affiliate · Clone-ready · 60-day cookie
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            The Affiliate Swipe Kit
          </h1>
          <p
            className="text-gray-300 text-base leading-relaxed mb-3 max-w-2xl"
            data-agent-summary
          >
            Six clone-ready content templates that pre-sell GitDealFlow to your
            audience without you writing the body. The mechanic is simple: you
            funnel your audience to the free 31k-word book; the book&rsquo;s
            built-in BOOK_DRIP sequence does the rest of the heavy lifting; you
            earn 20% lifetime commission on any downstream conversion within 60
            days.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
            Pick the template that matches your channel. Replace{" "}
            <code className="text-amber-300 bg-amber-950/40 px-1 rounded">
              YOUR_AFFILIATE_ID
            </code>{" "}
            with your Refgrow ID (see your dashboard at{" "}
            <a
              href={PORTAL_URL}
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              gitdealflow.refgrow.com
            </a>
            ). Customize lightly. Ship.
          </p>
        </header>

        {/* The mechanic — Brunson Sneaky Affiliate Funnel anchor. */}
        <section
          className="mb-10 rounded-xl border border-amber-700/40 bg-amber-950/20 p-6 sm:p-8"
          aria-label="The funnel mechanic"
        >
          <h2 className="text-amber-300 text-sm font-medium mb-3 uppercase tracking-wider">
            How the funnel works
          </h2>
          <ol className="space-y-3 text-gray-200 text-sm leading-relaxed">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span>
                You publish one of the swipe templates with your{" "}
                <code className="text-amber-300 bg-amber-950/40 px-1 rounded">
                  ?via=YOUR_AFFILIATE_ID
                </code>{" "}
                link to <code>/book</code>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span>
                Your reader clicks through, downloads the book (free, no card),
                and is automatically enrolled in the BOOK_DRIP follow-up — three
                emails over 7 days that walk through the methodology and offer
                the three rungs (Free Sunday digest / €49/mo Dashboard /
                €1,997 Sector Sweep).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold flex items-center justify-center">
                3
              </span>
              <span>
                Any downstream conversion within 60 days — Dashboard upgrade,
                Insider Circle subscription, or Sector Sweep purchase — pays
                you 20% lifetime commission. €19.40/mo per Insider sub. €399 on
                each Sector Sweep. €1.99/mo on each Dashboard sub.
              </span>
            </li>
          </ol>
          <p className="text-gray-400 text-xs leading-relaxed mt-5 pt-5 border-t border-amber-900/40">
            Why this works better than direct linking: the bait (the book) is
            valuable enough that your audience reads it cover-to-cover, which
            pre-sells the offer. By the time they hit the upgrade page they
            already know the methodology, the team, and the price. Conversion
            rates run 3-5× higher than affiliate-link-only campaigns.
          </p>
        </section>

        {/* Stats panel. */}
        <section
          className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-3"
          aria-label="Swipe kit stats"
        >
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
              Templates
            </p>
            <p className="text-gray-100 font-mono text-lg">
              {SWIPE_KIT_META.totalTemplates}
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
              Cookie
            </p>
            <p className="text-gray-100 font-mono text-base">
              60 days
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
              Bait
            </p>
            <p className="text-gray-100 font-mono text-base">
              Free book
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
              Avg CVR
            </p>
            <p className="text-emerald-300 font-mono text-base">
              5-8%
            </p>
          </div>
        </section>

        {/* The templates. Each one in a details/summary so the page is
            scannable but the body stays available verbatim for copy-paste. */}
        <section className="mb-12" aria-label="Swipe templates">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            Six templates — pick one and ship
          </h2>
          <div className="space-y-3">
            {SWIPE_TEMPLATES.map((t) => (
              <details
                key={t.id}
                className={`rounded-xl border p-5 ${ARCHETYPE_TONES[t.archetype]}`}
              >
                <summary className="cursor-pointer">
                  <div className="inline-flex flex-col gap-1">
                    <p className="text-xs font-mono uppercase tracking-wider text-gray-500">
                      {ARCHETYPE_LABELS[t.archetype]}
                    </p>
                    <p className="text-gray-100 font-semibold text-base">
                      {t.title}
                    </p>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Best for: {t.bestFor}
                    </p>
                  </div>
                </summary>
                <div className="mt-5 pt-5 border-t border-slate-700/40">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5 text-xs">
                    <div>
                      <span className="text-gray-500">Customize:</span>{" "}
                      <span className="text-gray-300">
                        {t.estimatedTimeToCustomize}
                      </span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-gray-500">Expected CVR:</span>{" "}
                      <span className="text-emerald-300 font-mono">
                        {t.expectedCVR}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 mb-4">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-3 font-medium">
                      Body — copy verbatim, replace YOUR_AFFILIATE_ID
                    </p>
                    <pre className="whitespace-pre-wrap text-gray-200 text-xs leading-relaxed font-mono">
                      {t.body}
                    </pre>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-medium">
                      Customization notes
                    </p>
                    <ul className="space-y-1.5 text-gray-300 text-xs leading-relaxed">
                      {t.customizationNotes.map((n, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-amber-400 mt-0.5">→</span>
                          <span>{n}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Prohibited channels. */}
        <section
          className="mb-10 rounded-xl border border-rose-700/40 bg-rose-950/20 p-6"
          aria-label="Prohibited channels"
        >
          <h2 className="text-rose-300 text-sm font-medium mb-3 uppercase tracking-wider">
            Channels you can&rsquo;t use
          </h2>
          <ul className="space-y-2 text-gray-300 text-sm leading-relaxed">
            {SWIPE_KIT_META.prohibitedChannels.map((c) => (
              <li key={c} className="flex gap-3">
                <span className="text-rose-400 mt-0.5">×</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA. */}
        <section className="mb-10 rounded-xl border border-emerald-700/40 bg-emerald-950/20 p-6 sm:p-8 text-center">
          <h2 className="text-emerald-300 text-sm font-medium mb-2 uppercase tracking-wider">
            Not in the program yet?
          </h2>
          <p className="text-gray-200 text-base leading-relaxed mb-5">
            20% lifetime commission. €399 on each Sector Sweep. €19.40/mo on
            each Insider Circle sub. 60-day cookie. No approval queue — start
            sharing in 60 seconds.
          </p>
          <a
            href={PORTAL_URL}
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors"
          >
            Sign up at gitdealflow.refgrow.com →
          </a>
        </section>

        <p className="text-xs text-gray-400 text-center">
          See also:{" "}
          <Link
            href="/affiliates"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            /affiliates
          </Link>{" "}
          (program overview) ·{" "}
          <Link
            href="/affiliates/leaderboard"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            /affiliates/leaderboard
          </Link>{" "}
          (top 10 earners)
        </p>
      </div>
    </>
  );
}
