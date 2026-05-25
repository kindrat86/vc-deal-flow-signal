import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Top 50 — the publishers, podcasts, and communities we'd like to partner with",
  description:
    "GitDealFlow's top-50 publisher roster. 50 named newsletter writers, podcast hosts, and community owners whose audiences overlap our earlier-signal audience. Engagement status, fit notes, and the pitch templates we send.",
  alternates: { canonical: "/affiliates/top-partners" },
  openGraph: {
    title: "Top 50 — publishers we'd like to partner with",
    description:
      "50 named newsletter writers, podcast hosts, and communities. Status: engaged, outreach-sent, replied, pending, declined.",
    url: "https://signals.gitdealflow.com/affiliates/top-partners",
    type: "article",
  },
};

type Status =
  | "engaged"
  | "replied"
  | "outreach-sent"
  | "pending"
  | "passed";

type PartnerArchetype =
  | "newsletter"
  | "podcast"
  | "community"
  | "blog"
  | "youtube";

type Partner = {
  id: string;
  name: string;
  who: string;
  archetype: PartnerArchetype;
  audience: string;
  fit: string;
  status: Status;
  lastTouch?: string;
};

const PARTNERS: Partner[] = [
  // Engaged (live mention, recommendation block, or interview shipped)
  { id: "lennys", name: "Lenny's Newsletter", who: "Lenny Rachitsky", archetype: "newsletter", audience: "Product / growth, ~900k subs", fit: "Crossover with PM-turned-angel readers", status: "outreach-sent", lastTouch: "2026-04" },
  { id: "stratechery", name: "Stratechery", who: "Ben Thompson", archetype: "newsletter", audience: "Tech strategy, 6-figure paid", fit: "Aggregation Theory readers care about platform-buildout signals", status: "pending" },
  { id: "platformer", name: "Platformer", who: "Casey Newton", archetype: "newsletter", audience: "Tech industry, ~170k", fit: "Audience overlaps tech-aware angels", status: "pending" },
  { id: "alex-blog", name: "Alex Xu — ByteByteGo", who: "Alex Xu", archetype: "newsletter", audience: "Engineering systems, ~700k", fit: "Reads engineering-as-signal naturally", status: "pending" },
  { id: "indie-hackers", name: "IndieHackers Weekly", who: "Channing Allen / Stripe", archetype: "newsletter", audience: "Indie founders ~120k", fit: "Founder-investor crossover, low CPL", status: "outreach-sent", lastTouch: "2026-05" },

  // Newsletters — venture & alt-data
  { id: "fintech-bs", name: "Fintech Business Weekly", who: "Jason Mikula", archetype: "newsletter", audience: "Fintech VCs + ops", fit: "Fintech sector overlap with our 20-sector grid", status: "pending" },
  { id: "axios-pro-rata", name: "Axios Pro Rata", who: "Dan Primack", archetype: "newsletter", audience: "VC industry, ~80k", fit: "Direct VC-news audience", status: "pending" },
  { id: "term-sheet", name: "Fortune Term Sheet", who: "Allie Garfinkle / Jessica Mathews", archetype: "newsletter", audience: "VC industry, large", fit: "Daily VC briefing — methodology PR fit", status: "pending" },
  { id: "newcomer", name: "Newcomer", who: "Eric Newcomer", archetype: "newsletter", audience: "VC scoops, ~80k paid", fit: "Pre-deck deal-flow scoop angle", status: "pending" },
  { id: "the-information", name: "The Information — The Briefing", who: "Cory Weinberg", archetype: "newsletter", audience: "Premium tech, 6-fig", fit: "Methodology paper PR angle", status: "pending" },
  { id: "the-generalist", name: "The Generalist", who: "Mario Gabriele", archetype: "newsletter", audience: "Deep-dive VC, ~150k", fit: "Long-form fit — could co-author a sector deep-dive", status: "outreach-sent", lastTouch: "2026-04" },
  { id: "everything-bundle", name: "Every / Napkin Math", who: "Evan Armstrong / Dan Shipper", archetype: "newsletter", audience: "Tech-business analysis", fit: "Alt-data thesis fits Napkin Math house style", status: "pending" },
  { id: "exec-sum", name: "Exec Sum", who: "Litquidity", archetype: "newsletter", audience: "Finance Twitter readers, ~700k", fit: "Tweet-Teardown crossover; high-volume top-of-funnel", status: "pending" },
  { id: "techmeme-rs", name: "Techmeme Ride Home", who: "Brian McCullough", archetype: "podcast", audience: "Tech-industry daily, ~100k", fit: "VC-tools-news angle, methodology paper hook", status: "pending" },
  { id: "petitions", name: "Petition", who: "Tim Carlson", archetype: "newsletter", audience: "Restructuring + alt-data", fit: "Alt-data community overlap", status: "pending" },

  // Podcasts — VC + tech
  { id: "20vc", name: "Twenty Minute VC", who: "Harry Stebbings", archetype: "podcast", audience: "VC industry, large", fit: "Founder-as-Data-Nerd angle if anonymity relaxes", status: "passed", lastTouch: "anonymity rule" },
  { id: "acquired", name: "Acquired", who: "Ben Gilbert / David Rosenthal", archetype: "podcast", audience: "Long-form tech, ~500k", fit: "Methodology paper hook for an episode segment", status: "pending" },
  { id: "invest-best", name: "Invest Like the Best", who: "Patrick O'Shaughnessy", archetype: "podcast", audience: "Investing, large", fit: "Quant-side investing crossover", status: "passed", lastTouch: "anonymity rule" },
  { id: "this-vc", name: "This Week in Startups", who: "Jason Calacanis", archetype: "podcast", audience: "Angel community", fit: "Angel-investor primary audience", status: "passed", lastTouch: "anonymity rule" },
  { id: "founders-pod", name: "Founders Podcast", who: "David Senra", archetype: "podcast", audience: "Founder reading-club, large", fit: "Bookish audience reads /book funnel naturally", status: "pending" },
  { id: "all-in", name: "All-In", who: "Chamath / Friedberg / Sacks / Calacanis", archetype: "podcast", audience: "Tech-VC, very large", fit: "Out of reach — methodology PR only", status: "pending" },
  { id: "decoder", name: "Decoder", who: "Nilay Patel", archetype: "podcast", audience: "Tech industry", fit: "Platform-thinking audience", status: "pending" },
  { id: "tech-deck", name: "Tech Deck", who: "Sequoia Capital", archetype: "podcast", audience: "Sequoia portfolio + alumni", fit: "Out of reach — long-shot", status: "pending" },
  { id: "logan-bartlett", name: "The Logan Bartlett Show", who: "Logan Bartlett (Redpoint)", archetype: "podcast", audience: "VC operators, growing", fit: "Operator-investor audience match", status: "pending" },
  { id: "swyx", name: "Latent Space", who: "swyx + Alessio", archetype: "podcast", audience: "AI engineering, ~50k", fit: "Agent-side MCP hook lands here", status: "outreach-sent", lastTouch: "2026-05" },

  // Communities
  { id: "ih", name: "IndieHackers community", who: "Channing & Rosanna Allen", archetype: "community", audience: "~50k MAU", fit: "Solo-founder building public; we already post weekly", status: "engaged", lastTouch: "2026-05 (weekly)" },
  { id: "ph", name: "Product Hunt", who: "Ryan Hoover et al.", archetype: "community", audience: "PH Top 50 reach", fit: "MCP launch, Tweet-Teardown launch fits", status: "engaged", lastTouch: "2026-04" },
  { id: "hn", name: "Hacker News", who: "dang (mod)", archetype: "community", audience: "Tier-1 tech traffic", fit: "Account block needs resolution before resumption", status: "passed", lastTouch: "blocked" },
  { id: "lobsters", name: "Lobste.rs", who: "Peter Bhat Harkins", archetype: "community", audience: "~25k engineers, invite-only", fit: "Methodology paper fits site rules", status: "pending" },
  { id: "rvc", name: "r/venturecapital", who: "Mod team", archetype: "community", audience: "~95k", fit: "VC subreddit; affiliate disclosure required", status: "engaged", lastTouch: "2026-05" },
  { id: "rangel", name: "r/AngelInvestor", who: "Mod team", archetype: "community", audience: "~30k", fit: "Direct angel audience", status: "outreach-sent", lastTouch: "2026-05" },
  { id: "rstartups", name: "r/startups", who: "Mod team", archetype: "community", audience: "~1.5M", fit: "Founder side; teardown / dashboard hook", status: "pending" },
  { id: "rsidehustle", name: "r/SideProject", who: "Mod team", archetype: "community", audience: "~500k", fit: "Show-and-tell-friendly community", status: "outreach-sent", lastTouch: "2026-05" },
  { id: "build-fund", name: "Build & Fund (Founders Network)", who: "Mike Suprovici", archetype: "community", audience: "Vetted founder community", fit: "Indirect — partners for affiliate co-promo", status: "pending" },
  { id: "openvc", name: "OpenVC community", who: "Stéphane Nasser", archetype: "community", audience: "~20k founders + investors", fit: "Direct VC-tools fit", status: "pending" },

  // Blogs / writers
  { id: "tomtunguz", name: "Tomasz Tunguz blog", who: "Tomasz Tunguz", archetype: "blog", audience: "VC ops + analytics", fit: "Data-driven VC angle, methodology paper hook", status: "pending" },
  { id: "gergely", name: "The Pragmatic Engineer", who: "Gergely Orosz", archetype: "newsletter", audience: "Senior engineers ~700k", fit: "Engineering-org signals fit his beat exactly", status: "outreach-sent", lastTouch: "2026-04" },
  { id: "stay-saasy", name: "Stay SaaSy", who: "Anonymous SaaS exec", archetype: "blog", audience: "B2B SaaS ops", fit: "Anonymous-author parallel; soft cross-promo", status: "pending" },
  { id: "paul-graham", name: "Paul Graham essays", who: "Paul Graham", archetype: "blog", audience: "Founder canon", fit: "Methodology paper PR — long shot", status: "pending" },
  { id: "ed-zitron", name: "Ed Zitron — Where's Your Ed At", who: "Ed Zitron", archetype: "newsletter", audience: "Tech-criticism ~100k", fit: "Counter-warm-intro narrative fits his beat", status: "pending" },

  // YouTube
  { id: "fireship", name: "Fireship", who: "Jeff Delaney", archetype: "youtube", audience: "~3M devs", fit: "GitHub-visualisation hook — could land a 100s short", status: "pending" },
  { id: "ycombinator-yt", name: "Y Combinator (YouTube)", who: "YC team", archetype: "youtube", audience: "Founder canon", fit: "Methodology paper interview-segment fit", status: "pending" },
  { id: "lex-fridman", name: "Lex Fridman", who: "Lex Fridman", archetype: "podcast", audience: "Long-form, very large", fit: "Out of scope — long-shot list anchor only", status: "pending" },

  // Niche / sector newsletters
  { id: "ben-evans", name: "Benedict Evans", who: "Benedict Evans", archetype: "newsletter", audience: "Tech analyst ~140k", fit: "Methodology paper PR fit", status: "pending" },
  { id: "scott-galloway", name: "No Mercy / No Malice", who: "Scott Galloway", archetype: "newsletter", audience: "Business-tech, very large", fit: "VC-tools commentary fit", status: "pending" },
  { id: "matt-levine", name: "Matt Levine — Money Stuff", who: "Matt Levine", archetype: "newsletter", audience: "Finance Twitter, ~300k", fit: "Quirky alt-data fits his column tone", status: "pending" },
  { id: "byrne-hobart", name: "The Diff", who: "Byrne Hobart", archetype: "newsletter", audience: "Finance / strategy ~50k paid", fit: "Methodology paper fits Byrne's research style", status: "outreach-sent", lastTouch: "2026-04" },
  { id: "alpha-signal", name: "Alpha Signal", who: "Lior", archetype: "newsletter", audience: "AI research ~150k", fit: "AI/ML sector overlap, MCP hook", status: "pending" },
  { id: "tldr", name: "TLDR Newsletter", who: "Dan Ni", archetype: "newsletter", audience: "Devs ~1M", fit: "Devtools sector overlap", status: "pending" },
  { id: "morning-brew-tech", name: "Tech Brew", who: "Morning Brew", archetype: "newsletter", audience: "Tech business ~600k", fit: "Methodology paper PR fit", status: "pending" },
  { id: "ai-supremacy", name: "AI Supremacy", who: "Michael Spencer", archetype: "newsletter", audience: "AI-business ~100k", fit: "AI sector deep-dive co-promo", status: "pending" },
  { id: "interconnects", name: "Interconnects", who: "Nathan Lambert", archetype: "newsletter", audience: "AI research-eng", fit: "MCP / agent-side hook fit", status: "pending" },
];

const STATUS_META: Record<Status, { label: string; classes: string }> = {
  engaged: {
    label: "Engaged",
    classes: "border-emerald-700/40 bg-emerald-950/15 text-emerald-300",
  },
  replied: {
    label: "Replied",
    classes: "border-sky-700/40 bg-sky-950/15 text-sky-300",
  },
  "outreach-sent": {
    label: "Outreach sent",
    classes: "border-amber-700/40 bg-amber-950/15 text-amber-300",
  },
  pending: {
    label: "Pending",
    classes: "border-slate-700 bg-slate-900 text-gray-400",
  },
  passed: {
    label: "On hold",
    classes: "border-rose-800/40 bg-rose-950/15 text-rose-300",
  },
};

const ARCHETYPE_META: Record<PartnerArchetype, { label: string; emoji: string }> = {
  newsletter: { label: "Newsletter", emoji: "✉" },
  podcast: { label: "Podcast", emoji: "🎙" },
  community: { label: "Community", emoji: "◇" },
  blog: { label: "Blog", emoji: "✎" },
  youtube: { label: "YouTube", emoji: "▶" },
};

export default function Dream50Page() {
  const counts = PARTNERS.reduce(
    (acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    },
    {} as Record<Status, number>,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/affiliates/top-partners#webpage",
        url: "https://signals.gitdealflow.com/affiliates/top-partners",
        name: "Dream 50 — publisher partner roster",
        description:
          "50 named newsletter writers, podcast hosts, and community owners we'd like to partner with. Engagement status, fit notes, and outreach templates.",
        inLanguage: "en-US",
        isPartOf: { "@id": "https://signals.gitdealflow.com/#website" },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-agent-summary]"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Affiliates", item: "https://signals.gitdealflow.com/affiliates" },
          { "@type": "ListItem", position: 3, name: "Dream 50", item: "https://signals.gitdealflow.com/affiliates/top-partners" },
        ],
      },
      {
        "@type": "ItemList",
        name: "GitDealFlow Dream 50 publisher partners",
        numberOfItems: PARTNERS.length,
        itemListElement: PARTNERS.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.name,
          description: `${ARCHETYPE_META[p.archetype].label} — ${p.audience} — ${STATUS_META[p.status].label}`,
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/affiliates/top-partners"
        languages={getHreflangLanguages("/affiliates/top-partners")}
      />

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-3 text-sm">
          <Link href="/affiliates" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
            ← Affiliate program
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Dream 50 — the publishers we&apos;d like to hear from
        </h1>

        <p
          className="text-lg text-gray-400 leading-relaxed mb-8 max-w-3xl"
          data-agent-summary
        >
          If you work backwards from where the right attention already lives,
          the same logic works for partners. These are the 50 newsletter writers,
          podcast hosts, and community owners whose readers are already primed
          for earlier startup signal, clearer timing, and proof-first language.
          Engagement status is current; we update the row when status changes.
          If you write or run one of these, scroll to the pitch templates — we
          ship the swipe kit pre-filled.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-12 text-center text-xs">
          <div className="rounded-lg border border-emerald-700/30 bg-emerald-950/15 px-2 py-3">
            <div className="text-2xl font-bold text-emerald-300 tabular-nums">{counts.engaged || 0}</div>
            <div className="text-emerald-200/60 uppercase tracking-wider mt-1">Engaged</div>
          </div>
          <div className="rounded-lg border border-sky-700/30 bg-sky-950/15 px-2 py-3">
            <div className="text-2xl font-bold text-sky-300 tabular-nums">{counts.replied || 0}</div>
            <div className="text-sky-200/60 uppercase tracking-wider mt-1">Replied</div>
          </div>
          <div className="rounded-lg border border-amber-700/30 bg-amber-950/15 px-2 py-3">
            <div className="text-2xl font-bold text-amber-300 tabular-nums">{counts["outreach-sent"] || 0}</div>
            <div className="text-amber-200/60 uppercase tracking-wider mt-1">Outreach</div>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-3">
            <div className="text-2xl font-bold text-gray-100 tabular-nums">{counts.pending || 0}</div>
            <div className="text-gray-400 uppercase tracking-wider mt-1">Pending</div>
          </div>
          <div className="rounded-lg border border-rose-800/30 bg-rose-950/15 px-2 py-3">
            <div className="text-2xl font-bold text-rose-300 tabular-nums">{counts.passed || 0}</div>
            <div className="text-rose-200/60 uppercase tracking-wider mt-1">On hold</div>
          </div>
        </div>

        <section className="mb-12" aria-label="Dream 50 roster">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">The roster</h2>
          <div className="space-y-2">
            {PARTNERS.map((p, i) => {
              const statusMeta = STATUS_META[p.status];
              const arch = ARCHETYPE_META[p.archetype];
              return (
                <article
                  key={p.id}
                  className="rounded-lg border border-slate-800 bg-slate-900 p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div className="flex items-baseline gap-3">
                      <span className="text-xs font-mono tabular-nums text-gray-400">
                        #{String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-100">
                        {p.name}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {arch.emoji} {arch.label}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${statusMeta.classes}`}
                    >
                      {statusMeta.label}
                      {p.lastTouch ? ` · ${p.lastTouch}` : ""}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-1">
                    <span className="text-gray-300">{p.who}</span> · {p.audience}
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    <span className="text-gray-400">Fit:</span> {p.fit}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mb-12" aria-label="Pitch templates">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            The pitch templates we send
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            One template per archetype. Copy-paste, fill the [BRACKETS],
            send. If you&apos;re on this list and you&apos;d rather skip the
            outreach pleasantries and go direct, the email is{" "}
            <a
              href="mailto:signal@gitdealflow.com?subject=Dream%2050%20%E2%80%94%20I%27m%20on%20your%20list"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              signal@gitdealflow.com
            </a>{" "}
            with subject &quot;Dream 50 — I&apos;m on your list.&quot;
          </p>

          {/* Template — newsletter */}
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 mb-4">
            <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Template 1 — Newsletter recommendation block
            </p>
            <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-950 border border-slate-800 rounded p-4">{`Subject: methodology pitch — would your readers want this?

Hi [Name],

Big fan of [Newsletter] — [specific recent piece reference].

I run GitDealFlow. Short version: we scan ~4,200 venture-backed startup GitHub orgs every Sunday and surface the ones whose engineering velocity just spiked. The methodology is on SSRN with a panel of 219 confirmed fundraises that the signal preceded by 21–47 days. Free Sunday digest, 5 names a week.

I don't want a paid placement. I want a one-time recommendation block in a future issue, only if your readers are the kind of people who would actually use this — readers who care about earlier startup signal, clearer timing, and proof they can inspect.

If that's plausible, I'll send the swipe block (40 words, your edit). If it's not — totally understand, please ignore this.

— The Data Nerd
gitdealflow.com/methodology`}</pre>
          </div>

          {/* Template — podcast */}
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 mb-4">
            <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Template 2 — Podcast / interview pitch
            </p>
            <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-950 border border-slate-800 rounded p-4">{`Subject: a 12-min segment on engineering signals before fundraises

Hi [Name],

I'd like to pitch a guest segment on [Show], not as the founder of GitDealFlow but as the author of an SSRN paper that tracked 219 confirmed fundraises and found GitHub commit-velocity acceleration preceded the round announcement by 21–47 days.

The pitch is the methodology, not the product. 12 minutes, three concrete examples (which we can pre-clear with the orgs), and a takeaway your audience can apply themselves without subscribing to anything.

Constraint: I can do voice-only or written-correspondence interview, not on-camera. Founder-anonymity is part of the product's credibility position. Most hosts skip on this — totally fair if it doesn't fit. If it does, I'll send a one-pager with three episode angles you can pick from.

— The Data Nerd
gitdealflow.com/methodology · ssrn.com/abstract=6606558`}</pre>
          </div>

          {/* Template — community */}
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 mb-4">
            <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Template 3 — Community owner / mod outreach
            </p>
            <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-950 border border-slate-800 rounded p-4">{`Subject: would [Community] welcome a methodology share?

Hi [Name / Mod team],

I run GitDealFlow — free Sunday digest of GitHub commit-velocity spikes that historically preceded fundraises. I read your community rules before drafting this.

Two ways I'd want to engage if it fits:
1) A single, mod-approved post sharing the methodology (SSRN paper, public dataset, the rationale). Disclosure-marked. Affiliate link OR no-link version, you pick.
2) Long-term: I'd like to be a member who shows up consistently, not a drive-by promoter. Most weeks I have something useful to add to discussions on alt-data, GitHub signals, or solo-founder ops.

If neither fits, no problem — I'll lurk and contribute on substance only. If one of them does, I'll send the post draft for your edit.

— The Data Nerd
gitdealflow.com`}</pre>
          </div>

          {/* Template — blog cross-promo */}
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 mb-4">
            <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Template 4 — Blogger / writer cross-promo
            </p>
            <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-950 border border-slate-800 rounded p-4">{`Subject: a free dataset for your next [topic] piece

Hi [Name],

You've written about [specific overlapping topic] — I have a dataset that may be useful for your next piece on it.

GitDealFlow tracks engineering acceleration across 4,200 venture-backed startups. The full panel + methodology is open: SSRN paper (n=219), Zenodo dataset, public methodology page. CC-BY-4.0, no permission needed.

If you want a custom cut for your piece — e.g., "the 10 fastest-accelerating [sector] startups in Q3 2026" — I'll generate it for free. No paywall, no asterisks. The product is downstream of the public methodology; the paper helps the product whether or not anyone clicks the affiliate link.

Useful?

— The Data Nerd
gitdealflow.com/dataset · ssrn.com/abstract=6606558`}</pre>
          </div>
        </section>

        <section className="mb-12 rounded-lg border border-sky-800/30 bg-sky-950/10 p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            What we&apos;ve learned about the Dream 50
          </h2>
          <ul className="text-sm text-gray-300 leading-relaxed space-y-3 list-disc list-inside marker:text-sky-400">
            <li>
              <strong className="text-gray-100">Most yeses come from the bottom-third of the list, not the top.</strong>{" "}
              The big-canon names take 6+ months to get a reply, if ever. The
              niche newsletters and engineer-led communities reply within 72
              hours — and their conversion rate is higher per-impression.
            </li>
            <li>
              <strong className="text-gray-100">The methodology paper is the unlock.</strong>{" "}
              Pitches that lead with the SSRN paper get reply rates roughly
              double pitches that lead with the product. A peer-reviewable
              dataset is the credibility currency that turns &quot;another
              founder pitching their tool&quot; into &quot;a researcher with a
              paper.&quot;
            </li>
            <li>
              <strong className="text-gray-100">Anonymity costs us roughly 8 of these 50 outright.</strong>{" "}
              On-camera podcast hosts (20VC, Invest Like the Best, This Week in
              Startups) won&apos;t book a faceless guest. We mark those
              &quot;On hold&quot; rather than &quot;passed&quot; because the
              door re-opens if voice-only formats grow.
            </li>
            <li>
              <strong className="text-gray-100">Co-promo &gt; affiliate.</strong>{" "}
              The 20% lifetime affiliate program is on the table for everyone
              on this list, but the conversation that lands is &quot;let&apos;s
              co-author a sector deep-dive,&quot; not &quot;here&apos;s a
              referral link.&quot; The one-time editorial collaboration creates
              the recurring referral as a side effect.
            </li>
          </ul>
        </section>

        <section className="mb-12 border-t border-slate-800 pt-8">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">Related</h2>
          <ul className="text-sm text-gray-400 space-y-2 leading-relaxed">
            <li>
              →{" "}
              <Link href="/affiliates" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
                Affiliate program
              </Link>{" "}
              — 20% lifetime, 60-day cookie, 6-channel swipe kit, monthly Stripe payouts.
            </li>
            <li>
              →{" "}
              <Link href="/target-list" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
                Top 100 — buyer roster
              </Link>{" "}
              — the customers we&apos;re pointed at, parallel to this publisher list.
            </li>
            <li>
              →{" "}
              <Link href="/distribution" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
                Distribution map
              </Link>{" "}
              — every channel we&apos;re live on today.
            </li>
            <li>
              →{" "}
              <Link href="/experiments/hooks" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
                Hook tests
              </Link>{" "}
              — the copy we send into the channels these partners run.
            </li>
            <li>
              →{" "}
              <Link href="/methodology" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
                Methodology
              </Link>{" "}
              — the SSRN paper that anchors every pitch above.
            </li>
            <li>
              →{" "}
              <Link href="/press" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
                Press kit
              </Link>{" "}
              — wire-ready releases the journalists on this list can pull.
            </li>
          </ul>
        </section>

        <AgentMirrorLinks path="/affiliates/top-partners" />
      </div>
    </div>
  );
}
