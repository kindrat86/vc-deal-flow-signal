import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Funnel Hub — every entry point to VC Deal Flow Signal",
  description:
    "Nine funnels, one map. Free Acceleration Watch, Quiz, 90-second Pitch, 12-minute Perfect Webinar, €7 First Look Pass, €9.97/mo Dashboard, €97/mo Insider Circle, €497/mo Sharp Tier, €1,997 Sector Sweep. Pick the door.",
  alternates: { canonical: "/funnels" },
  openGraph: {
    title: "Funnel Hub — VC Deal Flow Signal",
    description:
      "Every entry point to the GitHub-momentum deal-flow product, mapped on one page.",
    url: "https://signals.gitdealflow.com/funnels",
    type: "article",
  },
};

type Funnel = {
  slug: string;
  href: string;
  external?: boolean;
  tier: string;
  price: string;
  hook: string;
  who: string;
  offer: string;
  cta: string;
  color: "sky" | "emerald" | "amber" | "indigo" | "rose" | "violet" | "teal" | "slate";
};

const FUNNELS: Funnel[] = [
  {
    slug: "Free Acceleration Watch",
    href: "https://gitdealflow.com/#signup",
    external: true,
    tier: "Lead funnel",
    price: "Free forever",
    hook: "5 startups every Monday, the ones whose code shipped harder than last week.",
    who: "First-time visitors. Anyone who wants the signal before deciding on a tier.",
    offer: "Weekly email — the top 5 momentum movers, sector-tagged, 6-week historical context per pick.",
    cta: "Subscribe — free",
    color: "emerald",
  },
  {
    slug: "Quiz",
    href: "/quiz",
    tier: "Avatar router",
    price: "Free, 90 seconds",
    hook: "Four questions, then a routed recommendation — most people overpay or skip the tier that would have paid for itself.",
    who: "Visitors unsure which tier fits their check size and cadence.",
    offer: "Routed to Free / €7 / €9.97 / €97 with a one-line reason for the match.",
    cta: "Take the quiz",
    color: "indigo",
  },
  {
    slug: "90-Second Pitch",
    href: "/pitch",
    tier: "Bridge page",
    price: "Free, 90-second read",
    hook: "Crunchbase tells you the day they raised. We tell you 47 days before.",
    who: "Investors who want the case in five sections, not twelve minutes.",
    offer: "Problem → Shift → Proof → Stack → CTA. No video, no popup, no email gate.",
    cta: "Read the pitch",
    color: "sky",
  },
  {
    slug: "Perfect Webinar",
    href: "/perfect-webinar",
    tier: "Presentation funnel",
    price: "Free, 12-minute read",
    hook: "If commit-velocity acceleration is the most leading public signal, every other deal-flow source is lagging.",
    who: "Investors who want the full epiphany — origin story, three objections, full stack, trial closes, guarantee.",
    offer: "Brunson-canonical script. Big Domino → Origin → Three Secrets → Stack → Close.",
    cta: "Read the webinar",
    color: "violet",
  },
  {
    slug: "First Look Pass",
    href: "/firstlook",
    tier: "Tripwire (DotCom Ch 12)",
    price: "€7 one-time",
    hook: "Pick a sector. €7. Full deep dive in 24 hours.",
    who: "Investors who want the data on their thesis before subscribing.",
    offer: "Top 25 ranked GitHub orgs in your sector, 14-day acceleration deltas, contributor maps, three pre-Crunchbase breakouts. PDF + CSV. Credited toward Dashboard if you upgrade in 14 days.",
    cta: "Get the deep dive — €7",
    color: "amber",
  },
  {
    slug: "Dashboard",
    href: "/pricing",
    tier: "Core ascension",
    price: "€9.97/mo founding price (locked forever)",
    hook: "The full live dashboard, refreshed every Monday at 06:00 UTC.",
    who: "Active angel investors, GP scouts, syndicate leads.",
    offer: "8-item stack: live dashboard, 219-startup backtest CSV, monthly sector deep-dive PDF, two free Chrome extensions, free MCP server, async watchlist build, methodology vault, 30-day Signal-or-It's-Free guarantee. €1,728/yr standalone value at €9.97/mo.",
    cta: "Lock the founding price",
    color: "sky",
  },
  {
    slug: "Insider Circle",
    href: "/pricing#insider",
    tier: "Mid-ladder",
    price: "€97/mo",
    hook: "Private investor Telegram + monthly live briefing + Slack/Telegram spike alerts.",
    who: "Funds and syndicates who want the signal earlier than Monday's email.",
    offer: "Everything in Dashboard + JSON/CSV API + spike alerts + monthly briefing call + portfolio overlap report + quarterly trend PDF.",
    cta: "Join Insider Circle",
    color: "teal",
  },
  {
    slug: "Sharp Tier",
    href: "/apply",
    tier: "Application funnel (DotCom Ch 14)",
    price: "€497/mo · capped at 8 funds in 2026",
    hook: "Application-gated. Custom watchlists, white-labeled API, methodology source, quarterly review call.",
    who: "Active funds that already use the data and want sharper integration.",
    offer: "Everything in Insider + custom watchlists rebuilt monthly + white-labeled JSON/CSV endpoint + methodology source code (CC BY 4.0) + quarterly 60-min review call + first-look on every new signal type 30 days before public release.",
    cta: "Apply — reviewed in 48h",
    color: "rose",
  },
  {
    slug: "Sector Sweep",
    href: "/pricing#sector-sweep",
    tier: "High-ticket one-time",
    price: "€1,997 one-time",
    hook: "One sector. Full panel. Custom written analysis. 7 days.",
    who: "GPs running a quarterly thesis review or an LP responding to a specific sector inquiry.",
    offer: "9-item stack — every public org in a sector ranked by 14-day acceleration, top-25 contributor maps, breakouts not yet on Crunchbase, custom written narrative, raw CSV, CC-BY methodology export, 60-min walkthrough call, follow-up Q&A window. €13,000+ standalone value.",
    cta: "Buy the sweep",
    color: "slate",
  },
];

const COLOR_CLASSES: Record<Funnel["color"], { bar: string; pill: string; price: string; hover: string }> = {
  sky: { bar: "border-sky-500", pill: "text-sky-400", price: "text-sky-300", hover: "hover:border-sky-400" },
  emerald: { bar: "border-emerald-500", pill: "text-emerald-400", price: "text-emerald-300", hover: "hover:border-emerald-400" },
  amber: { bar: "border-amber-500", pill: "text-amber-400", price: "text-amber-300", hover: "hover:border-amber-400" },
  indigo: { bar: "border-indigo-500", pill: "text-indigo-400", price: "text-indigo-300", hover: "hover:border-indigo-400" },
  rose: { bar: "border-rose-500", pill: "text-rose-400", price: "text-rose-300", hover: "hover:border-rose-400" },
  violet: { bar: "border-violet-500", pill: "text-violet-400", price: "text-violet-300", hover: "hover:border-violet-400" },
  teal: { bar: "border-teal-500", pill: "text-teal-400", price: "text-teal-300", hover: "hover:border-teal-400" },
  slate: { bar: "border-slate-500", pill: "text-slate-300", price: "text-slate-200", hover: "hover:border-slate-400" },
};

export default function FunnelHubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/funnels#page",
        name: "Funnel Hub — VC Deal Flow Signal",
        description:
          "Every entry point to the GitHub-momentum deal-flow product, mapped on one page. Free Acceleration Watch, Quiz, Pitch, Perfect Webinar, First Look Pass, Dashboard, Insider Circle, Sharp Tier, Sector Sweep.",
        url: "https://signals.gitdealflow.com/funnels",
        inLanguage: "en-US",
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Funnels", item: "https://signals.gitdealflow.com/funnels" },
        ],
      },
      {
        "@type": "ItemList",
        name: "VC Deal Flow Signal — funnels",
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: FUNNELS.length,
        itemListElement: FUNNELS.map((f, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: f.slug,
          url: f.external ? f.href : `https://signals.gitdealflow.com${f.href}`,
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/funnels"
        languages={getHreflangLanguages("/funnels")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/funnels" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <nav className="text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Funnels</span>
        </nav>

        <header className="space-y-4 max-w-3xl">
          <p className="text-sky-400 text-xs font-medium uppercase tracking-wider">
            Funnel Hub · 9 entry points
          </p>
          <h1
            className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.05] tracking-tight"
            data-speakable
          >
            Every door into VC Deal Flow Signal,{" "}
            <span className="text-sky-400">on one page</span>.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed" data-speakable>
            Most products hide their funnels. Russell Brunson&rsquo;s playbook is the
            opposite — surface every entry point so the visitor self-selects the door
            that matches the way they want to buy. This is that page.
          </p>
        </header>

        <section className="space-y-1 max-w-3xl border-l-2 border-amber-500/50 pl-5 py-1">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            How to use this page
          </p>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Free if you&rsquo;re browsing. €7 if you want the data on your thesis.
            €9.97/mo if you want the full live dashboard. €97 if you want it earlier
            than Monday. €497 if your fund needs custom integration. €1,997 if you
            want one written sector report and you&rsquo;re done. There&rsquo;s no
            wrong door — only doors that fit different check sizes.
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="text-xl font-bold text-gray-100">All 9 funnels</h2>
          <div className="grid grid-cols-1 gap-4">
            {FUNNELS.map((f) => {
              const c = COLOR_CLASSES[f.color];
              if (f.external) {
                return (
                  <a
                    key={f.slug}
                    href={f.href}
                    rel="noopener noreferrer"
                    className={`block border-l-4 ${c.bar} ${c.hover} bg-slate-900/60 hover:bg-slate-900 p-5 sm:p-6 rounded-r-lg transition-colors group`}
                  >
                    <FunnelCardBody f={f} c={c} />
                  </a>
                );
              }
              return (
                <Link
                  key={f.slug}
                  href={f.href}
                  className={`block border-l-4 ${c.bar} ${c.hover} bg-slate-900/60 hover:bg-slate-900 p-5 sm:p-6 rounded-r-lg transition-colors group`}
                >
                  <FunnelCardBody f={f} c={c} />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="space-y-4 max-w-3xl">
          <h2 className="text-xl font-bold text-gray-100">The ladder, visualised</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Brunson calls this the Customer-Centric Value Ladder. Free at the bottom,
            higher commitment at each rung. You don&rsquo;t skip rungs — you climb when
            the previous rung paid for itself.
          </p>
          <ol className="text-gray-300 text-sm leading-relaxed space-y-2 pl-1">
            <li>
              <span className="text-emerald-400 font-mono text-xs mr-2">[Free]</span>
              <strong className="text-gray-100">Acceleration Watch</strong> — weekly
              email, no commitment, builds the habit.
            </li>
            <li>
              <span className="text-amber-400 font-mono text-xs mr-2">[€7]</span>
              <strong className="text-gray-100">First Look Pass</strong> — first dollar,
              tests whether the data fits your thesis.
            </li>
            <li>
              <span className="text-sky-400 font-mono text-xs mr-2">[€9.97/mo]</span>
              <strong className="text-gray-100">Dashboard</strong> — daily-rhythm tool,
              the founding price is locked forever.
            </li>
            <li>
              <span className="text-teal-400 font-mono text-xs mr-2">[€97/mo]</span>
              <strong className="text-gray-100">Insider Circle</strong> — earlier
              signal, private community, monthly briefing.
            </li>
            <li>
              <span className="text-rose-400 font-mono text-xs mr-2">[€497/mo]</span>
              <strong className="text-gray-100">Sharp Tier</strong> — fund-grade
              integration, application-gated, capped at 8.
            </li>
            <li>
              <span className="text-slate-200 font-mono text-xs mr-2">[€1,997 one-time]</span>
              <strong className="text-gray-100">Sector Sweep</strong> — full written
              report on one sector, end-of-quarter rhythm.
            </li>
          </ol>
        </section>

        <section className="space-y-3 max-w-3xl border-t border-slate-800 pt-8">
          <h2 className="text-xl font-bold text-gray-100">Two quieter doors</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            These don&rsquo;t fit the ladder neatly but they&rsquo;re real entry points
            into the same product surface.
          </p>
          <ul className="text-gray-300 text-sm leading-relaxed space-y-3 pl-1">
            <li>
              <Link
                href="/origin"
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted font-medium"
              >
                Origin →
              </Link>{" "}
              the Hero&rsquo;s Two Journeys story behind the product. Why a developer
              who also writes angel checks decided that warm-intro deal flow was a
              broken vehicle.
            </li>
            <li>
              <Link
                href="/about/founder"
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted font-medium"
              >
                About the founder →
              </Link>{" "}
              identity, backstory, three parables, the polarity that drew you here, and
              the character flaws this product has on purpose.
            </li>
            <li>
              <a
                href="https://www.npmjs.com/package/@gitdealflow/mcp-signal"
                rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted font-medium"
              >
                Free MCP server →
              </a>{" "}
              <code className="text-xs text-gray-400 bg-slate-900 px-1.5 py-0.5 rounded">
                npx @gitdealflow/mcp-signal
              </code>{" "}
              — six read-only tools inside Claude, Cursor, or any MCP host. Free
              forever, never gated.
            </li>
            <li>
              <Link
                href="/challenge"
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted font-medium"
              >
                7-Day Deal Flow Reset Challenge →
              </Link>{" "}
              an alternate email sequence — seven days, seven five-minute exercises on
              specific GitHub signals.
            </li>
          </ul>
        </section>

        <section className="border-t border-slate-800 pt-8 space-y-3">
          <h2 className="text-xl font-bold text-gray-100">If you only do one thing</h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Take the{" "}
            <Link
              href="/quiz"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted font-medium"
            >
              90-second quiz
            </Link>
            . It tells you which door fits. Most people overpay for tools they barely
            use, or skip the one that would have paid for itself the first month.
          </p>
        </section>
      </div>
    </>
  );
}

function FunnelCardBody({
  f,
  c,
}: {
  f: Funnel;
  c: { bar: string; pill: string; price: string; hover: string };
}) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-3 mb-2">
        <div className="flex items-baseline gap-3">
          <p className={`${c.pill} text-[10px] sm:text-xs font-semibold uppercase tracking-wider`}>
            {f.tier}
          </p>
          <h3 className="text-gray-100 font-semibold text-lg group-hover:text-white">
            {f.slug}
          </h3>
        </div>
        <p className={`${c.price} text-sm font-mono`}>{f.price}</p>
      </div>
      <p className="text-gray-200 text-base leading-relaxed mb-2">{f.hook}</p>
      <p className="text-gray-400 text-sm leading-relaxed mb-2">
        <span className="text-gray-500 uppercase tracking-wider text-[10px] mr-2">For</span>
        {f.who}
      </p>
      <p className="text-gray-400 text-sm leading-relaxed mb-3">
        <span className="text-gray-500 uppercase tracking-wider text-[10px] mr-2">You get</span>
        {f.offer}
      </p>
      <p className={`${c.pill} text-sm font-medium group-hover:underline`}>{f.cta} →</p>
    </>
  );
}
