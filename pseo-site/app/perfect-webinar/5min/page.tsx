import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DataNerdAudio } from "@/components/DataNerdAudio";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "The 5-Minute Perfect Webinar — GitDealFlow in 800 words",
  description:
    "The Brunson Perfect Webinar, condensed. Big Domino, three objections, stack, four closes — in five minutes flat. For the buyer who doesn't have twelve.",
  alternates: { canonical: "/perfect-webinar/5min" },
  openGraph: {
    title: "The 5-Minute Perfect Webinar",
    description:
      "GitDealFlow's full sales argument in 800 words. Read it on the way to a meeting.",
    url: "https://signals.gitdealflow.com/perfect-webinar/5min",
    type: "article",
  },
};

const STRIPE_DASHBOARD = "https://buy.stripe.com/28E7sK48H04U8ou07u0x200";
const SIGNUP_URL = "https://gitdealflow.com/#signup";

export default function FiveMinPerfectWebinarPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://signals.gitdealflow.com/perfect-webinar/5min#article",
        headline: "The 5-Minute Perfect Webinar — GitDealFlow in 800 words",
        description:
          "Brunson's Perfect Webinar architecture, condensed to 5 minutes. Big Domino, three objections, stack, four closes.",
        url: "https://signals.gitdealflow.com/perfect-webinar/5min",
        datePublished: "2026-05-05T00:00:00.000Z",
        dateModified: "2026-05-05T00:00:00.000Z",
        author: {
          "@type": "Organization",
          name: "GitDealFlow",
          url: "https://signals.gitdealflow.com",
        },
        publisher: {
          "@type": "Organization",
          name: "GitDealFlow",
          url: "https://signals.gitdealflow.com",
        },
        mainEntityOfPage: "https://signals.gitdealflow.com/perfect-webinar/5min",
        wordCount: 820,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Perfect Webinar", item: "https://signals.gitdealflow.com/perfect-webinar" },
          { "@type": "ListItem", position: 3, name: "5-Minute Edition", item: "https://signals.gitdealflow.com/perfect-webinar/5min" },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/perfect-webinar/5min"
        languages={getHreflangLanguages("/perfect-webinar/5min")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/perfect-webinar/5min" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <header className="space-y-3">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-500">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/perfect-webinar" className="hover:text-gray-300">Perfect Webinar</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">5-Minute Edition</span>
          </nav>
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
            Expert Secrets · Ch 14 · The 5-Minute Perfect Webinar
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-[1.15] tracking-tight">
            GitDealFlow, the whole pitch — <span className="text-amber-400">in 800 words</span>.
          </h1>
          <p className="text-gray-400 text-sm">
            Reading time: 5 min. If you have 12, the{" "}
            <Link href="/perfect-webinar" className="text-amber-300 hover:text-amber-200 underline decoration-dotted">
              full Perfect Webinar
            </Link>{" "}
            is here.
          </p>
          <DataNerdAudio
            slug="perfect-webinar-5min"
            label="Press play — 5-minute auto-webinar, narrated by The Data Nerd"
            subtitle="The whole pitch as audio. Read it, listen to it, or both. Hook → Story → Three Secrets → Stack → Four Closes — in five minutes flat."
          />
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-100">Hook</h2>
          <p className="text-gray-200 text-base leading-relaxed">
            Crunchbase tells you the day a startup raised. We tell you the
            day they started preparing — 21 to 47 days earlier — by reading
            their public GitHub.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-100">Story (1 sentence)</h2>
          <p className="text-gray-200 text-base leading-relaxed">
            In 2023 I passed on a dev-tool company because the deck looked
            weak; eleven months later they raised at a 9× valuation, and
            their public GitHub had been telling that story the whole
            time — five new repos, a 4× contributor expansion, a clean
            velocity curve I would have read in two minutes if I had known
            to look.
          </p>
        </section>

        <section className="space-y-3 border-l-4 border-sky-500 pl-5 py-2">
          <h2 className="text-xl font-bold text-gray-100">The Big Domino</h2>
          <p className="text-gray-100 text-lg font-semibold leading-snug">
            If commit-velocity acceleration is the most leading public signal
            in venture capital, every other deal-flow source — pitch decks,
            AngelList, Crunchbase, warm intros — is a lagging indicator.
          </p>
          <p className="text-gray-400 text-sm">
            The whole investing thesis falls or stands on whether that
            single belief is true. Our SSRN paper (n=219, abstract=6606558)
            says it is.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-100">Three objections — collapsed</h2>
          <ol className="space-y-3 text-gray-300 text-base leading-relaxed">
            <li className="border-l-2 border-rose-700 pl-4">
              <strong className="text-gray-100">&ldquo;GitHub data is too noisy.&rdquo;</strong>{" "}
              Two-period confirmation + contributor-quality filter cuts
              false-positives below 8%. The methodology is published.
            </li>
            <li className="border-l-2 border-rose-700 pl-4">
              <strong className="text-gray-100">&ldquo;The good orgs are private.&rdquo;</strong>{" "}
              The 219-startup panel is venture-backed and 100% public-GitHub.
              Private repos are absent because they don&rsquo;t need to be
              there for the signal to fire.
            </li>
            <li className="border-l-2 border-rose-700 pl-4">
              <strong className="text-gray-100">&ldquo;Why €9.97/mo when comparable tools cost €1k+/mo?&rdquo;</strong>{" "}
              We don&rsquo;t have a sales team. The buyer is a
              developer-investor writing €5k–€50k checks, not a partner
              with a six-figure data budget. Pricing matches the buyer.
            </li>
          </ol>
        </section>

        <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <h2 className="text-xl font-bold text-gray-100">The Stack — eight objects</h2>
          <ul className="space-y-1.5 text-gray-300 text-sm leading-relaxed">
            <li>→ Live dashboard, refreshed every Monday at 06:00 UTC.</li>
            <li>→ 219-startup backtest CSV — load it into any notebook, replicate the regression.</li>
            <li>→ Monthly sector deep-dive PDF — top 25 ranked, contributor maps, three breakout candidates.</li>
            <li>→ Two free Chrome extensions (Crunchbase / Wellfound badge + GitHub Lookup).</li>
            <li>→ The MCP server — six tools inside Claude / Cursor. Free forever.</li>
            <li>→ Async watchlist build — send your thesis, get the 10 highest-acceleration matches.</li>
            <li>→ Methodology vault — full SSRN preprint, signal definitions, regression code.</li>
            <li>→ 30-day Signal-or-It&rsquo;s-Free guarantee.</li>
          </ul>
          <div className="border-t border-slate-700 pt-3 mt-3 flex items-baseline justify-between text-sm">
            <span className="text-gray-400">Total standalone value</span>
            <span className="text-gray-500 line-through">€1,728/yr</span>
          </div>
          <div className="flex items-baseline justify-between text-lg font-bold pt-1">
            <span className="text-gray-100">Founding-member price</span>
            <span className="text-amber-400">€9.97/mo · locked forever</span>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-100">Four closes — pick yours</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-emerald-700/40 bg-emerald-950/10 p-4">
              <p className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">Money</p>
              <p className="text-gray-200 text-sm leading-relaxed mt-1">
                The price isn&rsquo;t the cost. The deal you miss is.
                €119.64/yr vs €40k expected loss on one missed seed name.
              </p>
            </div>
            <div className="rounded-lg border border-sky-700/40 bg-sky-950/10 p-4">
              <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">Identity</p>
              <p className="text-gray-200 text-sm leading-relaxed mt-1">
                You&rsquo;re not a VC. You&rsquo;re a developer-investor. Built
                around your identity, not adapted to it.
              </p>
            </div>
            <div className="rounded-lg border border-indigo-700/40 bg-indigo-950/10 p-4">
              <p className="text-indigo-400 text-[10px] font-semibold uppercase tracking-wider">Pricing</p>
              <p className="text-gray-200 text-sm leading-relaxed mt-1">
                €1,728/yr stack, €119.64 founding-member rate, locked before
                public launch hike to €49/mo.
              </p>
            </div>
            <div className="rounded-lg border border-rose-700/40 bg-rose-950/10 p-4">
              <p className="text-rose-400 text-[10px] font-semibold uppercase tracking-wider">Urgency</p>
              <p className="text-gray-200 text-sm leading-relaxed mt-1">
                The window is the lead time, not the discount. 21–47 days
                before the deck. Every Monday skipped is one window closed.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 text-center space-y-4">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            Trial close
          </p>
          <p className="text-gray-100 text-base sm:text-lg leading-relaxed">
            If all this did was surface <strong className="text-amber-300">one
            name</strong> you would have missed in the next 12 months — would
            €119.64 be worth it?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href={STRIPE_DASHBOARD}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/30 transition-colors"
            >
              Lock €9.97/mo founder price →
            </a>
            <a
              href={SIGNUP_URL}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-base transition-colors"
            >
              Or start with the free digest
            </a>
          </div>
          <p className="text-gray-500 text-xs pt-1">
            30-day Signal-or-It&rsquo;s-Free guarantee · No call · Reply REFUND
          </p>
        </section>

        <p className="text-gray-500 text-xs leading-relaxed border-t border-slate-800 pt-5">
          Need the long version? The full{" "}
          <Link href="/perfect-webinar" className="text-amber-300 hover:text-amber-200 underline decoration-dotted">
            12-minute Perfect Webinar
          </Link>{" "}
          adds the origin story, the epiphany bridge, the conversion-story
          script, the encore close, and the FAQ. Same argument, more depth.
        </p>
      </div>
    </>
  );
}
