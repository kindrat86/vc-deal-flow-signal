import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Earned Plays — the traffic playbook we actually run",
  description:
    "GitDealFlow's earned-traffic playbook. Reddit AEO, dev.to long-form, Substack mirror, MCP integration, Federated social, Academic citation, GitHub. Specific plays, specific frequency, specific reasons.",
  alternates: { canonical: "/earned-plays" },
  openGraph: {
    title: "Earned Plays — the traffic playbook",
    description:
      "Specific plays we run on every earned channel. Cadence, format, reason.",
    url: "https://signals.gitdealflow.com/earned-plays",
    type: "article",
  },
};

type Play = {
  id: string;
  channel: string;
  cadence: string;
  format: string;
  what: string;
  why: string;
  rule?: string;
  link?: { label: string; href: string; external?: boolean };
};

const PLAYS: Play[] = [
  {
    id: "reddit-aeo",
    channel: "Reddit AEO comments",
    cadence: "≤ 4 per week, paced over 2-3 days",
    format: "200–350 word pillar comment, replying to top commenter (not OP)",
    what: "On Google-page-1 Reddit threads in r/venturecapital, r/AngelInvesting, r/MachineLearning, r/ExperiencedDevs, we contribute a substantive 200-350 word comment that compounds via AI Overview / ChatGPT / Perplexity citations.",
    why: "Reddit AEO is the highest-leverage Reddit layer — Google indexes top Reddit threads, and LLMs cite them in answers. A 350-word comment on a high-rank thread keeps producing for months.",
    rule: "Reply to top commenter not OP. Never edit after posting (cache busts re-cite). No em-dashes. Statements beat questions.",
    link: { label: "/target-list#communities — communities map", href: "/target-list#communities" },
  },
  {
    id: "devto",
    channel: "dev.to long-form",
    cadence: "Bi-weekly",
    format: "1,200–2,000 word essay with code or chart",
    what: "Engineering-side essays on the methodology, on what GitHub-momentum reading actually looks like in practice, and on tooling that overlaps with readers who care about earlier startup signal.",
    why: "dev.to is where long-form technical reading happens. The platform's sub-tag system + Forem cross-pub + RSS pickup compound the long tail. Essays surface in inboxes via the daily digest.",
    link: { label: "@gitdealflow on dev.to", href: "https://dev.to/gitdealflow", external: true },
  },
  {
    id: "substack-mirror",
    channel: "Substack mirror",
    cadence: "Weekly · Sunday 12:00 UTC",
    format: "Mirror of weekly Top-100 + Acceleration Watch, canonical back to signals.gitdealflow.com",
    what: "gitdealflow.substack.com mirrors the weekly Top-100 startup list and Acceleration Watch. Same data, same methodology, Substack-native typography for newsletter readers.",
    why: "Substack readers don't visit websites. Meet them in their inbox + the Substack app discovery layer. Canonical back protects SEO.",
    rule: "Free publication, never split list. Canonical-back enforced (memory: feedback_substack_passive_mirror.md).",
    link: { label: "gitdealflow.substack.com", href: "https://gitdealflow.substack.com", external: true },
  },
  {
    id: "mcp-distribution",
    channel: "MCP server distribution",
    cadence: "Continuous (npm + GitHub releases)",
    format: "Free 6-tool MCP server, single-line install, agent-native",
    what: "@gitdealflow/mcp-signal on npm. Six read-only tools (get_top_movers, search_startups, get_signal, get_methodology, etc.). Free forever, never gated.",
    why: "If you already live inside Claude Desktop and Cursor, meeting you there with read-only tools is stronger than asking for another dashboard habit. Distribution-as-product: install is free, the data is the upsell.",
    rule: "Five core tools stay free forever. New paid tools are added alongside, never gate the existing ones (memory: feedback_free_mcp_never_gate.md).",
    link: { label: "/install — full instructions", href: "/install" },
  },
  {
    id: "federated",
    channel: "Federated social (Bluesky / Mastodon / Farcaster)",
    cadence: "Weekly batch (every Monday + opportunistic)",
    format: "≤170 weighted-character post + branded URL, never bare deeplink",
    what: "Bluesky (gitdealflow.bsky.social), Mastodon (fosstodon.org/@gitdealflow), Farcaster (gitdealflow). Cross-post the Acceleration Watch + featured commits.",
    why: "Federated networks are decentralised redundancy. None will be the channel. Together they're an SEO + AEO + agent-discoverability surface.",
    rule: "Lead with the claim, not 'Shipped a...'. Hook-first. End with gitdealflow.com/<page>. No bare CWS deeplink (memory: feedback_tweet_style_short_branded.md, feedback_bluesky_300_grapheme_cap.md).",
    link: { label: "/distribution#social — full handles", href: "/distribution#social" },
  },
  {
    id: "ssrn-citation",
    channel: "SSRN paper as credibility anchor",
    cadence: "Permanent (cite-able from any post)",
    format: "ssrn.com/abstract=6606558 + Zenodo dataset",
    what: "The methodology paper (n=219 paired observations, 21–47 day lead-time IQR) is the credibility anchor for every strong claim on the site.",
    why: "Tough audiences (HN, r/venturecapital) don't trust product URLs but do trust SSRN. Lead with the academic citation; the product follows.",
    rule: "Cite SSRN, not the product, in cold pitches and tough-audience posts (memory: feedback_ssrn_credibility_anchor.md).",
    link: { label: "ssrn.com/abstract=6606558", href: "https://ssrn.com/abstract=6606558", external: true },
  },
  {
    id: "github-org",
    channel: "GitHub org + open data",
    cadence: "On-merge (PR-driven public log)",
    format: "Public repos, public issues, public roadmap",
    what: "github.com/gitdealflow — the MCP server, the dataset tooling, the public roadmap. Building in public on GitHub is the same audience-side primitive as the Acceleration Watch is for our buyer.",
    why: "Engineers trust git logs. Public commit cadence on our own GitHub is the meta-signal for the product (we read commit logs; we publish ours).",
    link: { label: "github.com/gitdealflow", href: "https://github.com/gitdealflow", external: true },
  },
  {
    id: "wikidata-academic",
    channel: "Academic / reference indexing",
    cadence: "Quarterly review",
    format: "Wikidata anchor, citation guide, reproducibility page, OpenAPI",
    what: "Wikidata Q-number, /citation-guide (BibTeX/APA/Chicago), /reproducibility (clone-the-dataset walkthrough), /api/actions/openapi.json. Pre-academic indexing surfaces.",
    why: "A measurement product is only as durable as its reproducibility surface. The buyer who wants to challenge our claims should be able to clone the panel and re-run the regression in an hour.",
    link: { label: "/citation-guide", href: "/citation-guide" },
  },
  {
    id: "agent-readability",
    channel: "Agent-side readability",
    cadence: "Continuous (every page ships with the mirrors)",
    format: "/md/<path>, agents.json, llms.txt, llms-full.txt, knowledge-graph.json",
    what: "Every public page has a markdown mirror at /md/<path>. agents.json, llms.txt + llms-full.txt corpus, OpenAPI 21 endpoints, knowledge-graph.json. Six redundant agent surfaces.",
    why: "Half the readers in 2026 are agents. The agent that retrieves /md/target-list quotes us in the answer; the agent that retrieves the HTML version doesn't. Build for both.",
    link: { label: "/distribution#agent-mirrors", href: "/distribution#agent-mirrors" },
  },
  {
    id: "linkedin-dream-100",
    channel: "LinkedIn top-100 engagement",
    cadence: "2x per week (Tue + Fri 14:00 EEST)",
    format: "Company-page comments on top-100 posts (max 4/week)",
    what: "Company page only (no founder personal account, anonymity rule). Substantive replies to top-100 LinkedIn posts that match our buyer's reading habits.",
    why: "LinkedIn algorithm rewards consistent commenting on the same network's posts. Comments compound; broadcast posts don't.",
    rule: "Company page only. First-comment self-tactic in 15 min: preempt skeptic + SSRN anchor + CTA URL on own line (memory: feedback_linkedin_self_comment_tactic.md).",
    link: { label: "Top-100 voices we read", href: "/target-list" },
  },
];

const NOT_PLAYING: { channel: string; why: string }[] = [
  { channel: "Hacker News submissions", why: "Account blocked since 2026-05-04 (memory: feedback_hn_account_blocked.md). Resolution requires real-name email to dang." },
  { channel: "Twitter/X broadcasting", why: "Anonymity rule + extension throttling. Reactive only on @-mentions." },
  { channel: "Instagram / Facebook", why: "Anonymity rule. Both require persona content we won't produce." },
  { channel: "YouTube channel", why: "Anonymity rule. No founder-face content." },
  { channel: "Podcast appearances", why: "Anonymity rule. No voice + no real-name signature." },
  { channel: "Paid newsletter sponsorships", why: "HOLD until earned Tier-1 citation OR 500 paying subs + 3:1 CAC/LTV." },
];

export default function EarnedPlaysPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/earned-plays",
        name: "Earned Plays — the traffic playbook",
        description:
          "Specific traffic plays we run on every earned channel — Reddit AEO, dev.to, Substack, MCP, federated social, SSRN, GitHub, Wikidata, agent-side mirrors, LinkedIn top-100.",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Earned Plays", item: "https://signals.gitdealflow.com/earned-plays" },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/earned-plays"
        languages={getHreflangLanguages("/earned-plays")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/earned-plays" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Earned Plays</span>
          </nav>
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            Working way in · Applied
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Ten earned plays. <span className="text-emerald-400">Specific cadence, specific format, specific reason.</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Don&rsquo;t buy traffic until you can earn it. Here&rsquo;s the
            actual playbook we run, with the cadence we honour and the rules
            we don&rsquo;t bend. If you&rsquo;re building something parallel,
            you can fork this directly.
          </p>
        </header>

        <section className="rounded-xl border border-emerald-700/30 bg-emerald-950/20 p-6 sm:p-8 space-y-3">
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-[0.14em]">
            Start with the highest-intent routes
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Use this page if you want the full earned-distribution playbook. But if your real question is affiliate promotion, outreach targets, or a concrete partnership lane, start with the sharper routes first.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/affiliates" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition-colors">
              Join the affiliate program →
            </Link>
            <Link href="/target-list" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Open the target list →
            </Link>
            <Link href="/partners" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              See partner tracks →
            </Link>
          </div>
        </section>

        <section className="space-y-5">
          {PLAYS.map((p, i) => (
            <article
              key={p.id}
              id={p.id}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-3 scroll-mt-20"
            >
              <header className="space-y-1">
                <p className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                  Play {i + 1} · {p.cadence}
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
                  {p.channel}
                </h2>
                <p className="text-gray-400 text-xs italic">
                  Format: {p.format}
                </p>
              </header>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-400 uppercase tracking-wider text-[10px] mr-2">
                    What
                  </span>
                  <span className="text-gray-300 leading-relaxed">
                    {p.what}
                  </span>
                </p>
                <p>
                  <span className="text-gray-400 uppercase tracking-wider text-[10px] mr-2">
                    Why
                  </span>
                  <span className="text-gray-300 leading-relaxed">
                    {p.why}
                  </span>
                </p>
                {p.rule && (
                  <p>
                    <span className="text-amber-400 uppercase tracking-wider text-[10px] mr-2">
                      Rule
                    </span>
                    <span className="text-gray-200 leading-relaxed font-medium">
                      {p.rule}
                    </span>
                  </p>
                )}
                {p.link && (
                  <p className="pt-1">
                    →{" "}
                    {p.link.external ? (
                      <a
                        href={p.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted text-sm"
                      >
                        {p.link.label}
                      </a>
                    ) : (
                      <Link
                        href={p.link.href}
                        className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted text-sm"
                      >
                        {p.link.label}
                      </Link>
                    )}
                  </p>
                )}
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-xl border border-rose-700/40 bg-gradient-to-br from-rose-950/15 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3">
          <p className="text-rose-300 text-xs font-semibold uppercase tracking-wider">
            What we don&rsquo;t play
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Six channels we&rsquo;re actively NOT on, and why.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Name what you cut so visitors don&rsquo;t suggest it on a loop.
            Each cut is durable — they&rsquo;re not on the &ldquo;maybe
            Q3&rdquo; list, they&rsquo;re on the structurally-blocked list.
          </p>
          <ul className="space-y-2 pt-1">
            {NOT_PLAYING.map((np) => (
              <li
                key={np.channel}
                className="flex gap-3 items-start text-sm leading-relaxed"
              >
                <span className="text-rose-400 shrink-0 font-bold">✗</span>
                <span>
                  <strong className="text-gray-100">{np.channel}.</strong>{" "}
                  <span className="text-gray-400">{np.why}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            How to use this page
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Pick three plays, run them for a quarter, and only then add a fourth.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Don&rsquo;t run all ten channels at half-volume. Run three at
            full volume for ninety days, measure, keep the two that compound,
            retire the third, then add a fourth. Every play above had to
            earn its slot against this same test.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/distribution"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors"
            >
              See the full distribution map →
            </Link>
            <Link
              href="/experiments"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Or the conversion-test log →
            </Link>
          </div>
        </section>

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Earned-traffic playbook drawn from direct-response sales canon.
        </p>
      </div>
    </>
  );
}
