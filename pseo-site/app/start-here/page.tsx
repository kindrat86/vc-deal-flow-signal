import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Start Here — what GitDealFlow is, and where to begin",
  description:
    "Three-minute primer for the developer-investor who hit this site cold. What we measure (GitHub commit-velocity acceleration), why (47 days before the deck), and the four entry points sized to your week.",
  alternates: { canonical: "/start-here" },
  openGraph: {
    title: "Start Here — GitDealFlow primer",
    description:
      "Three-minute primer + four entry points sized to your week.",
    url: "https://signals.gitdealflow.com/start-here",
    type: "article",
  },
};

const PATHS = [
  {
    minutes: "3 min",
    label: "Read the 90-second pitch",
    desc: "The Hook / Story / Offer in five sections. No email gate, no popup. The fastest way to know if this is for you.",
    href: "/pitch",
    badge: "Curious",
    color: "sky",
  },
  {
    minutes: "12 min",
    label: "Read the Perfect Webinar",
    desc: "The full epiphany — Big Domino, three objections collapsed, stack, and the four closes. Read it the way you'd read a long-form blog post.",
    href: "/perfect-webinar",
    badge: "Convinced you want to read more",
    color: "violet",
  },
  {
    minutes: "5 min",
    label: "Read the 5-minute Perfect Webinar",
    desc: "Same argument, condensed to ~820 words. For the buyer who has 5, not 12.",
    href: "/perfect-webinar/5min",
    badge: "Short on time",
    color: "amber",
  },
  {
    minutes: "90 sec",
    label: "Take the routing quiz",
    desc: "Four questions, then a routed recommendation. Most people overpay for tools they barely use, or skip the one that would have paid for itself.",
    href: "/quiz",
    badge: "Not sure which tier",
    color: "indigo",
  },
] as const;

const ENTRY_POINTS = [
  {
    price: "Free forever",
    name: "Acceleration Watch",
    desc: "Five startups every Monday. Sector-tagged, 6-week historical context. The signal in your inbox.",
    href: "https://gitdealflow.com/#signup",
    external: true,
    color: "emerald",
  },
  {
    price: "€7 once",
    name: "First Look Pass",
    desc: "Pick a sector. 24-hour deep dive. Top 25 ranked orgs, contributor maps, three pre-Crunchbase breakouts. €7 credited if you upgrade in 14 days.",
    href: "/firstlook",
    external: false,
    color: "amber",
  },
  {
    price: "€9.97/mo",
    name: "Dashboard",
    desc: "Live dashboard refreshed every Monday. Filter by sector, stage, geography. Founding-member price locked forever before the public hike to €49/mo.",
    href: "/pricing",
    external: false,
    color: "sky",
  },
  {
    price: "€97/mo",
    name: "Insider Circle",
    desc: "Everything in Dashboard + JSON/CSV API + spike alerts + monthly briefing call + portfolio overlap report.",
    href: "/pricing#insider",
    external: false,
    color: "teal",
  },
] as const;

const COLOR_MAP = {
  sky: "border-sky-700/40 text-sky-300 bg-sky-950/15",
  violet: "border-violet-700/40 text-violet-300 bg-violet-950/15",
  amber: "border-amber-700/40 text-amber-300 bg-amber-950/15",
  indigo: "border-indigo-700/40 text-indigo-300 bg-indigo-950/15",
  emerald: "border-emerald-700/40 text-emerald-300 bg-emerald-950/15",
  teal: "border-teal-700/40 text-teal-300 bg-teal-950/15",
} as const;

export default function StartHerePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/start-here",
        name: "Start Here — GitDealFlow primer",
        description:
          "Three-minute primer for the developer-investor on what GitDealFlow is, what we measure, and where to begin.",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Start Here", item: "https://signals.gitdealflow.com/start-here" },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/start-here"
        languages={getHreflangLanguages("/start-here")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/start-here" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-500">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Start Here</span>
          </nav>
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            Traffic Secrets · Cool Traffic Onramp
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Hi. <span className="text-emerald-400">Here&rsquo;s what this is</span> in three minutes.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            If you came in cold — from a search, a thread, a podcast mention,
            an agent that found us — read this page and pick the door at the
            bottom that fits the time you have.
          </p>
        </header>

        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-7">
          <h2 className="text-2xl font-bold text-gray-100">The 90-second version</h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Crunchbase tells you the day a startup raised. <strong className="text-gray-100">We tell
            you the day they started preparing to raise — 21 to 47 days
            earlier — by reading their public GitHub.</strong>
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            We track 100+ venture-backed orgs across 19 sectors. Every
            Monday at 06:00 UTC we re-rank them by 14-day commit-velocity
            acceleration. The five highest-momentum names go into a free
            email digest. The full ranked dashboard is €9.97/mo. The
            methodology is on{" "}
            <a
              href="https://ssrn.com/abstract=6606558"
              className="text-amber-300 hover:text-amber-200 underline decoration-dotted"
              target="_blank"
              rel="noopener noreferrer"
            >
              SSRN (n=219)
            </a>{" "}
            and the dataset is on Zenodo, CC BY 4.0.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            The buyer is the developer-investor — the engineer who reads
            commit logs for fun and writes €5k–€50k checks on the side.
            That&rsquo;s why pricing matches the buyer (€9.97/mo, not
            €1,000/mo) and why we don&rsquo;t have a sales team.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">What you can do next, sized to your week</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PATHS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className={`group rounded-xl border ${COLOR_MAP[p.color]} p-5 transition-colors hover:bg-opacity-30`}
              >
                <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${COLOR_MAP[p.color].split(" ")[1]}`}>
                  {p.minutes} · {p.badge}
                </p>
                <h3 className="text-gray-100 font-semibold text-base mb-2 group-hover:underline">
                  {p.label} →
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {p.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">If you already know what you want, jump in</h2>
          <ul className="space-y-3">
            {ENTRY_POINTS.map((e) => {
              const c = COLOR_MAP[e.color];
              return (
                <li
                  key={e.name}
                  className={`rounded-xl border ${c} p-5`}
                >
                  <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1">
                    <h3 className="text-gray-100 font-semibold text-base">
                      {e.external ? (
                        <a
                          href={e.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {e.name} →
                        </a>
                      ) : (
                        <Link href={e.href} className="hover:underline">
                          {e.name} →
                        </Link>
                      )}
                    </h3>
                    <span className={`${c.split(" ")[1]} text-sm font-mono`}>
                      {e.price}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {e.desc}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            If you build agents
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            The MCP server is free, forever, and never gated.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Six read-only tools inside Claude / Cursor / any MCP host. Ask{" "}
            <em>&ldquo;which AI infra startups are accelerating this
            week?&rdquo;</em> and get the answer inline. Five core tools
            stay free forever — we add new paid tools alongside them, never
            gate the existing ones.
          </p>
          <code className="block bg-slate-900 border border-slate-800 rounded px-3 py-2 text-amber-300 text-sm font-mono">
            npx @gitdealflow/mcp-signal
          </code>
          <Link
            href="/install"
            className="inline-block bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold px-5 py-2.5 rounded transition-colors"
          >
            Install instructions →
          </Link>
        </section>

        <section className="space-y-3 border-t border-slate-800 pt-8">
          <h2 className="text-xl font-bold text-gray-100">If you want the long version</h2>
          <ul className="space-y-2 text-gray-300 text-sm leading-relaxed">
            <li>→ <Link href="/origin" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">Origin</Link> — the Hero&rsquo;s Two Journeys story behind the product.</li>
            <li>→ <Link href="/about/founder" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">About the founder</Link> — identity, parables, the polarity that drew you here.</li>
            <li>→ <Link href="/funnels" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">Funnel Hub</Link> — every entry point to the product, mapped on one page.</li>
            <li>→ <Link href="/dream-100" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">Dream 100</Link> — the 100 voices we read on the engineering-signal frontier.</li>
            <li>→ <Link href="/distribution" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">Distribution</Link> — every channel where we publish + every feed we expose.</li>
            <li>→ <Link href="/manifesto" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">Manifesto</Link> — what we believe, what we&rsquo;re replacing, who&rsquo;s on the bus.</li>
            <li>→ <Link href="/roadmap" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">Roadmap</Link> — what&rsquo;s shipping next + what&rsquo;s on the public bet.</li>
            <li>→ <Link href="/methodology" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">Methodology</Link> — the regression, the panel, the false-positive controls.</li>
          </ul>
        </section>

        <p className="text-gray-500 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Built for cold visitors per <em>Traffic Secrets</em> Section 2 Ch
          18 (Cool Traffic) by Russell Brunson (2020). The Cool Traffic
          visitor doesn&rsquo;t know us yet — this page exists so they
          don&rsquo;t have to fight the rest of the site to find a place to
          land.
        </p>
      </div>
    </>
  );
}
