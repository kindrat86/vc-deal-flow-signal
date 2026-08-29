import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-static";

export const metadata: Metadata = withEditorialOverride({
  title:
    "Partner with GitDealFlow, distribution, co-marketing, white-label MCP",
  description:
    "Six concrete partnership tracks for funds, accelerators, newsletters, and platforms. Embed our scores via badge/widget. Co-publish a Sector Sweep. White-label the MCP server with your portfolio. Cite the methodology paper. Co-host a quarterly synthetic-voice webinar. Refer customers via the affiliate program.",
  alternates: { canonical: "/partners" },
  openGraph: {
    title: "Partner with GitDealFlow, six concrete tracks",
    description:
      "Embed · co-publish · white-label MCP · cite · co-host · refer. Founder anonymity preserved across every track.",
    url: "https://signals.gitdealflow.com/partners",
    type: "article",
  },
});

type Track = {
  rank: number;
  slug: string;
  name: string;
  audience: string;
  mechanic: string;
  deliverables: readonly string[];
  cost: string;
  timeline: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  status: "live" | "available-on-request" | "by-application";
  fitFor: readonly string[];
};

const TRACKS: readonly Track[] = [
  {
    rank: 1,
    slug: "embed",
    name: "Embed our scores",
    audience: "Newsletter publishers, fund-internal tools, accelerator dashboards",
    mechanic:
      "Drop a one-line script tag (or use the badge SVG) to surface a startup's GitDealFlow score in your own UI. Updates daily, attribution required, CC BY 4.0.",
    deliverables: [
      "Live badge SVG, 3 sizes, light + dark theme",
      "Embed script (one-line, defer-loaded, ~3KB)",
      "Per-org JSON via /api/v1/signals.json (filter by GitHub org)",
      "Crunchbase/Wellfound Chrome extensions for score-on-card augmentation",
    ],
    cost: "Free",
    timeline: "Live the same day you copy the script",
    primaryCta: { label: "Open the badge builder →", href: "/badge-builder" },
    secondaryCta: { label: "Embed examples", href: "/embed" },
    status: "live",
    fitFor: [
      "Substack/newsletter writers covering specific sectors",
      "Funds that publish a public 'companies we follow' page",
      "Accelerators with a portfolio dashboard",
      "Developer-tools directories",
    ],
  },
  {
    rank: 2,
    slug: "co-published-sector-sweep",
    name: "Co-published Sector Sweep",
    audience: "Sector-focused funds, vertical newsletters, industry analysts",
    mechanic:
      "We co-publish a 40-page sector deep-dive under both brands. You bring sector expertise + distribution; we bring the methodology + the live scoring engine. Co-author bylines, dual landing pages, joint email blast to both lists.",
    deliverables: [
      "40-page written deep-dive on one sector (top 25 ranked orgs, contributor maps, three pre-Crunchbase breakouts, raw CSV)",
      "Co-branded PDF + landing page + OG image",
      "Joint email to both subscriber bases (synced send)",
      "30-day async Q&A from joint readers",
      "First-year SEO benefit accrues to both domains",
    ],
    cost: "Revenue split: 50/50 of any Sector Sweep sales attributed inside 90 days. No fee to participate.",
    timeline: "5 business days from kickoff to publish",
    primaryCta: {
      label: "Apply for a co-publish slot →",
      href: "mailto:partnerships@gitdealflow.com?subject=Co-Published%20Sector%20Sweep",
    },
    secondaryCta: { label: "See standalone Sector Sweep", href: "/sector-sweep" },
    status: "by-application",
    fitFor: [
      "Sector funds (vertical SaaS, fintech infra, dev tools, climate tech, AI infra)",
      "Subject-matter expert newsletters with 5k+ subs",
      "Industry analyst groups already publishing quarterly reports",
    ],
  },
  {
    rank: 3,
    slug: "white-label-mcp",
    name: "White-label MCP server",
    audience: "Funds running internal sourcing tools, multi-fund platforms",
    mechanic:
      "Run a fund-branded MCP server on your own subdomain. Your portfolio orgs pre-loaded as default tools. Same scoring engine; same methodology; your brand on the surface. Stays inside your firewall via the fund's own MCP host.",
    deliverables: [
      "Fund-branded MCP server (8 tools / 3 resources / 2 templates / 5 prompts)",
      "Pre-loaded with the fund's existing portfolio + watchlist",
      "Subdomain CNAME (mcp.yourfund.com → our MCP)",
      "Quarterly methodology updates synced automatically",
      "Custom prompts trained on the fund's investment thesis (one-page brief)",
    ],
    cost: "€4,997 one-time setup + €497/month hosting & updates",
    timeline: "10 business days from kickoff to live",
    primaryCta: {
      label: "Discuss white-label MCP →",
      href: "mailto:partnerships@gitdealflow.com?subject=White-Label%20MCP",
    },
    secondaryCta: { label: "See the public MCP server", href: "/mcp-demo" },
    status: "available-on-request",
    fitFor: [
      "Multi-fund VCs with internal investment platforms",
      "Funds running model-augmented diligence workflows",
      "Accelerators with cohort-monitoring tools",
      "Family offices with custom deal-flow dashboards",
    ],
  },
  {
    rank: 4,
    slug: "cite-the-methodology",
    name: "Cite the methodology",
    audience: "Researchers, writers, podcast hosts, analysts publishing original work",
    mechanic:
      "The methodology paper (SSRN id 6606558) is published under CC BY 4.0. Cite it in your own decks, blog posts, papers, podcasts, courses. Standard academic attribution; we don't charge for citation.",
    deliverables: [
      "DOI-permanent citation: 'GitHub Signals as Leading Indicators of Venture Fundraising' (SSRN id 6606558)",
      "Pre-formatted citation block on /press for paste-and-cite",
      "Right to use the methodology in commercial publications (CC BY 4.0)",
      "Optional: send your published piece to citations@gitdealflow.com to be added to the receipts ledger at /receipts",
    ],
    cost: "Free (CC BY 4.0)",
    timeline: "Immediate, no application needed",
    primaryCta: { label: "Open the press kit →", href: "/press" },
    secondaryCta: { label: "View citations ledger", href: "/citations" },
    status: "live",
    fitFor: [
      "Academic researchers in finance, computer science, organizational economics",
      "Journalists covering venture, alternative data, or developer tooling",
      "Course creators teaching VC, fundraising, or alt-data",
      "Podcast hosts with a research-driven episode format",
    ],
  },
  {
    rank: 5,
    slug: "quarterly-co-host",
    name: "Quarterly co-host webinar (synthetic voice)",
    audience: "Fund partners, accelerator directors, syndicate leads",
    mechanic:
      "Quarterly 30-minute webinar where the Data Nerd mascot (synthetic Cartesia voice) walks through the latest sector data, with you joining live to add the deal-side commentary. Founder anonymity preserved; you do the human-facing presentation.",
    deliverables: [
      "30-min webinar: 15 min scripted Data Nerd walkthrough, 15 min live partner commentary + Q&A",
      "Co-branded landing page + registration funnel",
      "Joint email blast to both lists",
      "Recording archived to YouTube under both brand handles",
      "Lead-list split 50/50 from registrations",
    ],
    cost: "Free to run; revenue split applies on any downstream Sector Sweep or Dashboard sales attributed within 60 days",
    timeline: "3 weeks from kickoff to webinar (incl. promo cycle)",
    primaryCta: {
      label: "Apply to co-host →",
      href: "mailto:partnerships@gitdealflow.com?subject=Quarterly%20Co-Host",
    },
    secondaryCta: { label: "Watch the latest State of GitHub", href: "/state-of-github" },
    status: "by-application",
    fitFor: [
      "Sector-focused fund partners",
      "Accelerator directors with a quarterly cohort cadence",
      "Syndicate leads with 200+ active members",
      "Industry conference organizers",
    ],
  },
  {
    rank: 6,
    slug: "affiliate-referral",
    name: "Affiliate referral program",
    audience: "Anyone with an audience that includes investors, analysts, or scouts",
    mechanic:
      "20% recurring commission on eligible referred subscriptions and purchases: €9.80/mo per Dashboard sub at the current public price and €399.40 on each Sector Sweep. Insider enrollment is closed. Six clone-ready content templates (tweet thread, LinkedIn post, blog post, newsletter mention, podcast script, 3-email sequence) handle the writing. Attribution and payout terms live in the Refgrow portal.",
    deliverables: [
      "Unique Refgrow tracking link",
      "Six clone-ready content templates at /affiliates/funnel-hack",
      "Terms, attribution rules, and payouts in the Refgrow portal",
      "Free book + course as your bait product",
    ],
    cost: "Free to join (no approval queue, no waiting list)",
    timeline: "Live within 60 seconds at gitdealflow.refgrow.com",
    primaryCta: { label: "Join the affiliate program →", href: "/affiliates" },
    secondaryCta: { label: "See the swipe kit", href: "/affiliates/funnel-hack" },
    status: "live",
    fitFor: [
      "Newsletter writers in venture, dev tools, or alt data",
      "Podcast hosts with VC/investor audiences",
      "Slack/Discord communities of scouts and angels",
      "AI agents integrating /api/v1/* signals into downstream tools",
    ],
  },
];

const STATUS_META: Record<
  Track["status"],
  { label: string; classes: string }
> = {
  live: {
    label: "Live",
    classes: "border-emerald-700/40 bg-emerald-950/20 text-emerald-300",
  },
  "available-on-request": {
    label: "On request",
    classes: "border-sky-700/40 bg-sky-950/20 text-sky-300",
  },
  "by-application": {
    label: "By application",
    classes: "border-amber-700/40 bg-amber-950/20 text-amber-300",
  },
};

export default function PartnersPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/partners#webpage",
        url: "https://signals.gitdealflow.com/partners",
        name: "Partner with GitDealFlow, six concrete tracks",
        description:
          "Six partnership tracks for funds, accelerators, newsletters, and platforms: embed scores, co-publish a Sector Sweep, white-label the MCP server, cite the methodology, co-host a quarterly synthetic-voice webinar, refer customers via the affiliate program.",
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
            name: "Partners",
            item: "https://signals.gitdealflow.com/partners",
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Partnership tracks",
        numberOfItems: TRACKS.length,
        itemListElement: TRACKS.map((t) => ({
          "@type": "ListItem",
          position: t.rank,
          name: t.name,
          description: t.audience,
        })),
      },
    ],
  };

  return (
    <>
      <AgentMirrorLinks path="/partners" qaCategory="business-model" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <section className="rounded-xl border border-sky-700/30 bg-sky-950/20 p-6 sm:p-8 space-y-3">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em]">
            Start with the highest-intent routes
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Use this page if you want the full partnership map. But if your real question is affiliate distribution, builder integration, or trust-proof material to cite, start with the sharper routes first.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/affiliates" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-signal-500 text-slate-950 text-sm font-semibold hover:bg-signal-600 transition-colors">
              Join the affiliate program →
            </Link>
            <Link href="/for-builders" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Read the builder offer →
            </Link>
            <Link href="/press" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Open the press kit →
            </Link>
          </div>
        </section>
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Partners</span>
        </nav>

        <header className="mb-10">
          <p className="text-sky-400 text-sm font-medium mb-3 uppercase tracking-wider">
            Six concrete tracks · Founder anonymity preserved · Most live today
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            Partner with GitDealFlow
          </h1>
          <p
            className="text-gray-300 text-base leading-relaxed mb-3 max-w-2xl"
            data-agent-summary
          >
            Six concrete tracks for distribution, co-marketing, and white-label
            integration. The methodology paper (CC BY 4.0) does the heavy
            lifting on credibility; the synthetic Data Nerd mascot keeps voice
            consistent; you keep your audience and your brand. Three tracks are
            live today (embed, citation, affiliate). Three are available by
            application or on request (co-published Sector Sweep, white-label
            MCP, quarterly co-host).
          </p>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
            Every track preserves the founder-anonymity rule:{" "}
            <Link
              href="/about/founder"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              the founder&rsquo;s real name, voice, and face never appear
            </Link>{" "}
the methodology, the data, and the synthetic mascot do all the
            talking. This makes us a clean co-marketing partner for funds and
            publishers who don&rsquo;t want a third-party founder personality
            on their distribution.
          </p>
        </header>

        {/* The six tracks. */}
        <section className="mb-12 space-y-5" aria-label="Partnership tracks">
          {TRACKS.map((track) => {
            const status = STATUS_META[track.status];
            return (
              <article
                key={track.slug}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8"
              >
                <div className="flex items-start gap-4 mb-4">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 font-mono text-sm font-bold flex items-center justify-center">
                    {track.rank}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <h2 className="text-gray-100 font-semibold text-lg">
                        {track.name}
                      </h2>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border font-medium ${status.classes}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs">{track.audience}</p>
                  </div>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-5">
                  {track.mechanic}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-medium">
                      Deliverables
                    </p>
                    <ul className="space-y-1.5 text-gray-300 text-xs leading-relaxed">
                      {track.deliverables.map((d) => (
                        <li key={d} className="flex gap-2">
                          <span className="text-emerald-400 mt-0.5">✓</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-medium">
                      Fit for
                    </p>
                    <ul className="space-y-1.5 text-gray-300 text-xs leading-relaxed">
                      {track.fitFor.map((f) => (
                        <li key={f} className="flex gap-2">
                          <span className="text-sky-400 mt-0.5">→</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-5 pt-5 border-t border-slate-700/40">
                  <div>
                    <span className="text-gray-500">Cost:</span>{" "}
                    <span className="text-gray-300">{track.cost}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Timeline:</span>{" "}
                    <span className="text-gray-300">{track.timeline}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={track.primaryCta.href}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-signal-500 hover:bg-signal-400 text-slate-950 font-semibold text-sm transition-colors"
                  >
                    {track.primaryCta.label}
                  </Link>
                  {track.secondaryCta ? (
                    <Link
                      href={track.secondaryCta.href}
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-md border border-slate-700 hover:border-slate-600 hover:bg-slate-800 text-gray-200 font-medium text-sm transition-colors"
                    >
                      {track.secondaryCta.label}
                    </Link>
                  ) : null}
                </div>
              </article>
            );
          })}
        </section>

        {/* Cross-track contact CTA. */}
        <section
          className="mb-10 rounded-xl border border-emerald-700/40 bg-emerald-950/20 p-6 sm:p-8 text-center"
          aria-label="Multi-track partnership"
        >
          <h2 className="text-emerald-300 text-sm font-medium mb-2 uppercase tracking-wider">
            Multi-track partnership?
          </h2>
          <p className="text-gray-200 text-base leading-relaxed mb-5 max-w-xl mx-auto">
            Most fund-side partners run 2-3 tracks together, typically embed +
            citation + co-published Sector Sweep, or white-label MCP +
            quarterly co-host. Email us with a sketch of which tracks fit your
            audience; we reply inside 48 business hours.
          </p>
          <a
            href="mailto:partnerships@gitdealflow.com?subject=Multi-Track%20Partnership"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors"
          >
            partnerships@gitdealflow.com
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
          ·{" "}
          <Link
            href="/integrations"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            /integrations
          </Link>{" "}
          ·{" "}
          <Link
            href="/badge-builder"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            /badge-builder
          </Link>{" "}
          ·{" "}
          <Link
            href="/press"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            /press
          </Link>{" "}
          ·{" "}
          <Link
            href="/data-nerd/social"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            /data-nerd/social
          </Link>
        </p>
      </div>
    </>
  );
}
