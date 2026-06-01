import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import {
  CHARTER_COHORT,
  CHARTER_COHORT_TOTAL_SEATS,
  CHECK_SIZE_LABELS,
  SECTOR_LABELS,
  getClaimedCount,
  getRemainingSeats,
} from "@/content/charter-cohort";

export const dynamic = "force-static";

const SITE = "https://signals.gitdealflow.com";

/**
 * /members — Charter Cohort hub.
 *
 * Brunson Expert Secrets §1 Ch 4 (Mass Movement Vehicle). The chapter teaches
 * that a movement requires *visible momentum* — the new member sees other
 * members, not just the founder. This page is the membership-side surface
 * that pairs with /wins (the startup-side surface).
 *
 * Brunson DotCom Secrets Ch 4 (Three Core Markets) — the secondary market is
 * Status. A public profile that ranks members by their picks delivers the
 * Status payoff that the IdentityBanner promises but doesn't operationalise.
 *
 * Honesty rule: 0 of 25 charter seats are currently claimed. The four
 * archetype templates below are clearly labeled "open seat" and the
 * scorecards are Pending. No fabricated members, no fabricated hit rates.
 */

export const metadata: Metadata = {
  title:
    "Charter Cohort 2026 — 25 founding-member seats · VC Deal Flow Signal",
  description:
    "25 charter seats for readers who want to publish picks, track receipts, and build a public scorecard around earlier startup signal. Pseudonymous handles welcome.",
  alternates: { canonical: "/members" },
  openGraph: {
    title: "Charter Cohort 2026 — Public picks and scorecards",
    description:
      "25 founding-member seats. Public thesis, public picks, public scorecard. Pseudonymous handles welcome.",
    url: `${SITE}/members`,
    type: "website",
  },
};

export default function MembersPage() {
  const claimed = getClaimedCount();
  const remaining = getRemainingSeats();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/members#webpage`,
        url: `${SITE}/members`,
        name: "Charter Cohort 2026",
        description:
          "25 charter members publishing public thesis, public picks, and a public scorecard.",
        isPartOf: { "@id": `${SITE}/#website` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Charter Cohort",
            item: `${SITE}/members`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Charter Cohort — open seats",
        numberOfItems: CHARTER_COHORT.length,
        itemListElement: CHARTER_COHORT.map((m, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: m.archetype,
          url: `${SITE}/members/${m.handle}`,
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/members`}
        languages={getHreflangLanguages("/members")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/members" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* HEADER */}
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Charter Cohort</span>
          </nav>
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            Public scorecards, member-side
          </p>
          <h1
            data-speakable
            className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight"
          >
            Charter Cohort 2026 — <span className="text-amber-400">25 seats.</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            The Charter Cohort just opened. The first investors to claim a
            public seat are the founding members — <strong>{remaining} of {CHARTER_COHORT_TOTAL_SEATS} seats open.</strong>{" "}
            <Link
              href="/wins"
              className="text-amber-400 hover:text-amber-300 underline decoration-dotted"
            >
              The wins ledger
            </Link>{" "}
            tracks the startups our methodology surfaced before fundraise. This
            page tracks the <strong>investors</strong> reading those signals.
            Public thesis. Public picks. Public scorecard. Pseudonymous handles
            welcome.
          </p>
        </header>

        <section className="rounded-2xl border border-amber-700/30 bg-amber-950/20 p-6 sm:p-8 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-[0.14em]">
            Start with the highest-intent routes
          </p>
          <p className="text-gray-300 text-sm leading-relaxed max-w-3xl">
            Use this page if you want the full charter-cohort system. But if your real question is how to join, how public receipts work, or whether the buyer workflow fits you, start with the sharper routes first.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/members/join" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-amber-500 text-slate-950 text-sm font-semibold hover:bg-amber-400 transition-colors">
              Claim a seat →
            </Link>
            <Link href="/members/leaderboard" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              See the live leaderboard →
            </Link>
            <Link href="/wins" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Read the wins ledger →
            </Link>
          </div>
        </section>

        {/* SEAT COUNTER */}
        <section
          aria-label="Cohort status"
          className="rounded-2xl border border-amber-700/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 p-6 sm:p-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4">
            <div>
              <p className="text-amber-300 text-[11px] uppercase tracking-wider font-semibold mb-1">
                Total seats
              </p>
              <p className="text-3xl font-bold text-gray-100 tabular-nums">
                {CHARTER_COHORT_TOTAL_SEATS}
              </p>
            </div>
            <div>
              <p className="text-amber-300 text-[11px] uppercase tracking-wider font-semibold mb-1">
                Claimed
              </p>
              <p className="text-3xl font-bold text-gray-100 tabular-nums">
                {claimed}
              </p>
            </div>
            <div>
              <p className="text-amber-300 text-[11px] uppercase tracking-wider font-semibold mb-1">
                Open
              </p>
              <p className="text-3xl font-bold text-amber-400 tabular-nums">
                {remaining}
              </p>
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-amber-800/30">
            <p className="text-gray-300 text-sm leading-relaxed">
              <strong className="text-gray-100">The board is empty because the cohort just opened.</strong>{" "}
              Every one of the {CHARTER_COHORT_TOTAL_SEATS} seats is still a
              founding seat — the people who claim them now are the names the
              later cohort reads. The Charter Cohort caps at{" "}
              {CHARTER_COHORT_TOTAL_SEATS} for 2026. Each seat ships a public
              profile page (this site, indexed by search engines and agent
              crawlers), inclusion in the Sunday Insider briefing, and a
              co-author byline on any methodology update the cohort
              participates in.{" "}
              <Link
                href="/members/join"
                className="text-amber-400 hover:text-amber-300 underline"
              >
                Claim a seat →
              </Link>{" "}
              ·{" "}
              <Link
                href="/members/leaderboard"
                className="text-amber-400 hover:text-amber-300 underline"
              >
                See the live leaderboard →
              </Link>
            </p>
          </div>
        </section>

        {/* WHAT YOU GET */}
        <section className="space-y-5" aria-label="What charter members receive">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            What every charter seat ships with.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                head: "A public profile page",
                body: "Your pseudonymous handle, your written thesis, your tracked picks, your rolling scorecard. Indexed by Google, surfaced in our /sitemap.xml, citable from external posts. The page is yours — it stays even if you cancel your subscription.",
              },
              {
                head: "60d / 90d scorecard",
                body: "Every pick you publish gets graded at the 60-day and 90-day windows against fundraise announcements or 4× sustained velocity. Hits, misses, and pendings are public. Brunson's rule: receipts beat testimonials.",
              },
              {
                head: "Sunday Insider briefing co-author",
                body: "When the cohort's collective picks include a confirmed hit that week, your handle appears in the Sunday Insider briefing as a co-spotter. The hit attribution is permanent and citable.",
              },
              {
                head: "Anonymity-preserving by default",
                body: "Pseudonymous handles welcome — same rule as @thedatanerd. Application form asks for a verifiable email + your chosen handle. Real name never required, never published.",
              },
            ].map((item) => (
              <div
                key={item.head}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6"
              >
                <h3 className="text-gray-100 font-semibold text-base mb-2">
                  {item.head}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* OPEN SEATS GRID */}
        <section className="space-y-5" aria-label="Open seats">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
              Open seats — claim an archetype.
            </h2>
            <p className="text-gray-400 text-xs">
              Templates illustrate the format. You write your own thesis.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CHARTER_COHORT.map((m) => {
              const claimed = m.claimed;
              return (
                <Link
                  key={m.handle}
                  href={`/members/${m.handle}`}
                  className={`group block rounded-xl border p-5 sm:p-6 transition-colors ${
                    claimed
                      ? "border-emerald-700/40 bg-emerald-950/15 hover:border-emerald-600/60"
                      : "border-slate-800 bg-slate-900/40 hover:border-amber-700/40 hover:bg-amber-950/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p
                      className={`text-[10px] font-semibold uppercase tracking-wider ${
                        claimed ? "text-emerald-300" : "text-amber-300"
                      }`}
                    >
                      {claimed ? "Claimed" : "Open seat"}
                    </p>
                    <span
                      className="text-gray-500 group-hover:text-gray-300 transition-colors"
                      aria-hidden
                    >
                      →
                    </span>
                  </div>
                  <h3 className="text-gray-100 font-bold text-lg leading-snug mb-2">
                    {m.archetype}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">
                    {m.tagline}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <span className="text-[10px] text-sky-300 border border-sky-800/40 bg-sky-950/30 rounded-full px-2 py-0.5 uppercase tracking-wider font-semibold">
                      {CHECK_SIZE_LABELS[m.checkSize]}
                    </span>
                    {m.sectors.slice(0, 2).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] text-violet-300 border border-violet-800/40 bg-violet-950/30 rounded-full px-2 py-0.5 uppercase tracking-wider font-semibold"
                      >
                        {SECTOR_LABELS[s]}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="space-y-5 border-t border-slate-800 pt-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            How a charter seat works.
          </h2>
          <ol className="space-y-4">
            {[
              {
                n: 1,
                title: "Submit a 5-field application",
                body: "Pseudonymous handle (or real name, your call), verifiable email, 2–4 sentence thesis, check-size band, sectors you track. The form is at /members/join. Takes about 4 minutes.",
              },
              {
                n: 2,
                title: "48-hour written review",
                body: "The founder reviews every charter application personally. You get a written reply inside 48 business hours — yes with a draft profile to confirm, or no with a written reason. No phone call. Anonymity-preserving.",
              },
              {
                n: 3,
                title: "Profile ships to production",
                body: "Once you confirm the draft, your /members/{handle} page goes live. It's static, indexed, hreflang-tagged, and includes Person + ProfilePage JSON-LD so search engines + AI agents can cite you.",
              },
              {
                n: 4,
                title: "Publish picks weekly",
                body: "Each pick is one GitHub org + a 1-sentence why. The 60-day and 90-day grading windows open automatically. Hits and misses are both public — that's the methodology rule.",
              },
              {
                n: 5,
                title: "Sunday Insider briefing co-author",
                body: "When a confirmed hit lands inside the cohort, the Sunday Insider briefing names the co-spotter. Permanent, citable, indexed.",
              },
            ].map((step) => (
              <li
                key={step.n}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 flex gap-4"
              >
                <span className="text-amber-300 font-bold tabular-nums shrink-0 text-lg">
                  {step.n}.
                </span>
                <div>
                  <h3 className="text-gray-100 font-semibold text-base mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* CLOSE */}
        <section className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 text-center space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            Charter window
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            {remaining} of {CHARTER_COHORT_TOTAL_SEATS} seats still open.
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Once 25 charter seats are claimed, the cohort closes. New members
            can subscribe to the Dashboard or Insider tier, but charter status
            (co-author byline, locked founding rate, permanent profile) only
            ships to the first 25.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/members/join"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-base shadow-lg shadow-amber-500/30 transition-colors"
            >
              Claim a charter seat <span aria-hidden>→</span>
            </Link>
            <Link
              href="/manifesto"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-base transition-colors"
            >
              Read the manifesto first
            </Link>
          </div>
        </section>

        {/* CROSS-LINKS */}
        <section className="border-t border-slate-800 pt-8 text-sm text-gray-400 leading-relaxed space-y-2">
          <p>
            <strong className="text-gray-300">Related surfaces:</strong>{" "}
            <Link
              href="/members/leaderboard"
              className="text-amber-400 hover:text-amber-300 underline decoration-dotted"
            >
              /members/leaderboard
            </Link>{" "}
            (member ranking by 60d/90d hits) ·{" "}
            <Link
              href="/wins"
              className="text-amber-400 hover:text-amber-300 underline decoration-dotted"
            >
              /wins
            </Link>{" "}
            (startup-side track record) ·{" "}
            <Link
              href="/scorecard"
              className="text-amber-400 hover:text-amber-300 underline decoration-dotted"
            >
              /scorecard
            </Link>{" "}
            (the founder's rolling pick scorecard) ·{" "}
            <Link
              href="/manifesto"
              className="text-amber-400 hover:text-amber-300 underline decoration-dotted"
            >
              /manifesto
            </Link>{" "}
            (what we believe, who&rsquo;s on the bus) ·{" "}
            <Link
              href="/identity"
              className="text-amber-400 hover:text-amber-300 underline decoration-dotted"
            >
              /identity
            </Link>{" "}
            (the seven shifts behind trusting earlier public signal).
          </p>
        </section>
      </div>
    </>
  );
}
