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
  type CharterMember,
  getClaimedCount,
  getRemainingSeats,
} from "@/content/charter-cohort";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-static";

const SITE = "https://signals.gitdealflow.com";

/**
 * /members/leaderboard, Charter Cohort public ranking surface.
 *
 * Brunson DotCom Secrets Ch 4 (Three Core Markets / Desires), the secondary
 * market is Status. The Charter Cohort hub at /members tells visitors WHO
 * the members are; this leaderboard tells them WHO IS WINNING. That's the
 * Status payoff that the IdentityBanner promises but the cohort hub
 * doesn't operationalise.
 *
 * Brunson Expert Secrets §1 Ch 4 (Mass Movement Vehicle), visible momentum
 * compounds when members can see their own ranking move. The page uses the
 * shared CHARTER_COHORT content file so claims surface here automatically.
 *
 * Honest empty state: 0 of 25 seats claimed at launch → leaderboard shows
 * no hits, no ranks, no fabricated data. The grading rules + the empty
 * roster + the "be the first to claim a seat" CTA do all the heavy lifting
 * until real picks land.
 */

export const metadata: Metadata = withEditorialOverride({
  title:
    // absolute: title already names the brand, bypass the layout template
    // (brand-doubling fix 2026-08-15)
    { absolute: "Member Leaderboard, Charter Cohort 2026 · VC Deal Flow Signal" },
  description:
    "Public ranking of Charter Cohort members by 60d/90d hit rate, picks published, and lead-time delta. Pseudonymous handles, public scorecards, no fabricated wins. Currently 0 of 25 seats claimed, be the first to land on the board.",
  alternates: { canonical: "/members/leaderboard" },
  openGraph: {
    title: "Member Leaderboard, Charter Cohort 2026",
    description:
      "Public ranking of Charter Cohort members by 60d/90d hit rate. Pseudonymous, transparent, methodology-grade.",
    url: `${SITE}/members/leaderboard`,
    type: "website",
  },
});

interface LeaderboardRow {
  member: CharterMember;
  picks: number;
  hits: number;
  misses: number;
  pending: number;
  hitRatePct: number | null; // null until at least one window closes
}

function buildRow(member: CharterMember): LeaderboardRow {
  const picks = member.picks.length;
  const hits = member.scorecard.filter((s) => s.status === "hit").length;
  const misses = member.scorecard.filter((s) => s.status === "miss").length;
  const pending = member.scorecard.filter((s) => s.status === "pending").length;
  const closed = hits + misses;
  const hitRatePct = closed > 0 ? Math.round((hits / closed) * 100) : null;
  return { member, picks, hits, misses, pending, hitRatePct };
}

export default function MembersLeaderboardPage() {
  const claimed = getClaimedCount();
  const remaining = getRemainingSeats();
  const rows = CHARTER_COHORT.map(buildRow);

  // Brunson rule: rank by hit count first (asymmetric upside), then by closed
  // window count (graded discipline), then by total picks (cadence). Ties
  // break alphabetically by handle so the order is deterministic at SSG time.
  const ranked = [...rows].sort((a, b) => {
    if (b.hits !== a.hits) return b.hits - a.hits;
    const aClosed = a.hits + a.misses;
    const bClosed = b.hits + b.misses;
    if (bClosed !== aClosed) return bClosed - aClosed;
    if (b.picks !== a.picks) return b.picks - a.picks;
    return a.member.handle.localeCompare(b.member.handle);
  });

  const totalPicks = rows.reduce((s, r) => s + r.picks, 0);
  const totalHits = rows.reduce((s, r) => s + r.hits, 0);
  const totalClosed = rows.reduce((s, r) => s + r.hits + r.misses, 0);
  const aggregateHitRatePct =
    totalClosed > 0 ? Math.round((totalHits / totalClosed) * 100) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/members/leaderboard#webpage`,
        url: `${SITE}/members/leaderboard`,
        name: "Member Leaderboard, Charter Cohort 2026",
        description:
          "Public ranking of Charter Cohort members by 60d/90d hit rate.",
        isPartOf: { "@id": `${SITE}/#website` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Charter Cohort",
            item: `${SITE}/members`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Leaderboard",
            item: `${SITE}/members/leaderboard`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Charter Cohort Leaderboard",
        numberOfItems: ranked.length,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        itemListElement: ranked.map((r, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: r.member.archetype,
          url: `${SITE}/members/${r.member.handle}`,
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/members/leaderboard`}
        languages={getHreflangLanguages("/members/leaderboard")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/members/leaderboard" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* HEADER */}
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/members" className="hover:text-gray-300">
              Charter Cohort
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Leaderboard</span>
          </nav>
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            Status, made public
          </p>
          <h1
            data-speakable
            className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight"
          >
            Member Leaderboard.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Charter Cohort members ranked by hits, closed grading windows, and
            picks published. Same grading rules as{" "}
            <Link
              href="/scorecard"
              className="text-amber-400 hover:text-amber-300 underline decoration-dotted"
            >
              /scorecard
            </Link>
            : a pick is a Hit at the 60d or 90d window if a public fundraise
            lands or commit velocity sustains 4× baseline. Misses and Pendings
            are public, that&rsquo;s the methodology rule.
          </p>
        </header>

        {/* AGGREGATE STATS */}
        <section
          aria-label="Aggregate cohort stats"
          className="rounded-2xl border border-amber-700/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 p-6 sm:p-8"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4">
            <div>
              <p className="text-amber-300 text-[11px] uppercase tracking-wider font-semibold mb-1">
                Seats claimed
              </p>
              <p className="text-3xl font-bold text-gray-100 tabular-nums">
                {claimed}
                <span className="text-gray-500 text-base font-normal">
                  {" "}
                  / {CHARTER_COHORT_TOTAL_SEATS}
                </span>
              </p>
            </div>
            <div>
              <p className="text-amber-300 text-[11px] uppercase tracking-wider font-semibold mb-1">
                Picks published
              </p>
              <p className="text-3xl font-bold text-gray-100 tabular-nums">
                {totalPicks}
              </p>
            </div>
            <div>
              <p className="text-amber-300 text-[11px] uppercase tracking-wider font-semibold mb-1">
                Hits (60d/90d)
              </p>
              <p className="text-3xl font-bold text-emerald-400 tabular-nums">
                {totalHits}
              </p>
            </div>
            <div>
              <p className="text-amber-300 text-[11px] uppercase tracking-wider font-semibold mb-1">
                Cohort hit rate
              </p>
              <p className="text-3xl font-bold text-gray-100 tabular-nums">
                {aggregateHitRatePct === null
                  ? "-"
                  : `${aggregateHitRatePct}%`}
              </p>
            </div>
          </div>
          {aggregateHitRatePct === null && (
            <p className="pt-4 mt-4 border-t border-amber-800/30 text-gray-400 text-sm leading-relaxed">
              <strong className="text-amber-300">Cohort hit rate is, </strong>{" "}
              because no grading window has closed yet. The first 60-day
              window opens 60 days after the first charter member publishes
              their first pick.
            </p>
          )}
        </section>

        {/* THE BOARD */}
        <section className="space-y-4" aria-label="Member ranking">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
              The board.
            </h2>
            <p className="text-gray-400 text-xs">
              Ranked by hits → closed windows → picks → handle.
            </p>
          </div>

          {/* Empty-state framing, when no members have published, the board
              shows the seat templates ranked alphabetically and admits the
              ranking will reshuffle once real picks land. */}
          {claimed === 0 && (
            <div
              role="status"
              className="rounded-lg border border-amber-700/50 bg-amber-950/15 px-4 py-3 text-sm text-amber-100"
            >
              <strong className="text-amber-300">
                The board is empty by design.
              </strong>{" "}
              0 of {CHARTER_COHORT_TOTAL_SEATS} charter seats have been
              claimed; no picks have been published; no grading windows have
              closed. The roster below shows the four open seat templates as
              placeholders.{" "}
              <Link
                href="/members/join"
                className="text-amber-300 hover:text-amber-200 underline decoration-dotted font-semibold"
              >
                Claim a seat →
              </Link>{" "}
              publish your first pick, and you&rsquo;ll be the first row on
              this board the moment the 60-day window grades the first hit.
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/60 text-gray-400 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="text-left font-semibold px-4 py-3">#</th>
                  <th className="text-left font-semibold px-4 py-3">Member</th>
                  <th className="text-left font-semibold px-4 py-3 hidden sm:table-cell">
                    Archetype
                  </th>
                  <th className="text-right font-semibold px-4 py-3 tabular-nums">
                    Picks
                  </th>
                  <th className="text-right font-semibold px-4 py-3 tabular-nums">
                    Hits
                  </th>
                  <th className="text-right font-semibold px-4 py-3 tabular-nums">
                    Pending
                  </th>
                  <th className="text-right font-semibold px-4 py-3 tabular-nums">
                    Hit rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((r, i) => {
                  const handle = r.member.claimed
                    ? r.member.claimedBy?.handle ?? `@${r.member.handle}`
                    : `Open seat`;
                  return (
                    <tr
                      key={r.member.handle}
                      className="border-t border-slate-800 hover:bg-slate-900/40 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-500 tabular-nums">
                        {i + 1}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/members/${r.member.handle}`}
                          className={`font-semibold hover:underline decoration-dotted ${
                            r.member.claimed
                              ? "text-emerald-300"
                              : "text-gray-300"
                          }`}
                        >
                          {handle}
                        </Link>
                        <div className="sm:hidden text-gray-500 text-xs mt-0.5">
                          {r.member.archetype}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">
                        {r.member.archetype}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-300 tabular-nums">
                        {r.picks}
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-400 tabular-nums font-semibold">
                        {r.hits}
                      </td>
                      <td className="px-4 py-3 text-right text-amber-300 tabular-nums">
                        {r.pending}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-300 tabular-nums">
                        {r.hitRatePct === null ? "-" : `${r.hitRatePct}%`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-gray-500 text-xs leading-relaxed pt-1">
            Same grading methodology as the founder&rsquo;s{" "}
            <Link
              href="/scorecard"
              className="text-amber-400 hover:text-amber-300 underline decoration-dotted"
            >
              /scorecard
            </Link>
            . Hit = public fundraise OR 4× sustained velocity within 60d/90d
            of pick. Miss = no fundraise AND velocity reverted to baseline.
            Pending = both windows still open. We never adjust a Hit
            retroactively after the 60d mark.
          </p>
        </section>

        {/* HOW TO LAND ON THE BOARD */}
        <section className="space-y-5 border-t border-slate-800 pt-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            How to land on the board.
          </h2>
          <ol className="space-y-3">
            {[
              {
                n: 1,
                body: (
                  <>
                    <Link
                      href="/members/join"
                      className="text-amber-400 hover:text-amber-300 underline decoration-dotted font-semibold"
                    >
                      Claim a charter seat
                    </Link>
                    {" "}, pseudonymous handle welcome, real name never
                    required. 48-hour written review.
                  </>
                ),
              },
              {
                n: 2,
                body: (
                  <>
                    Once your profile ships at <code className="text-gray-300 bg-slate-950/50 px-1 rounded text-[13px]">/members/{"{handle}"}</code>,
                    publish your first pick. One GitHub org plus a one-sentence
                    why.
                  </>
                ),
              },
              {
                n: 3,
                body: (
                  <>
                    The 60-day grading window opens automatically. If a public
                    fundraise lands or commit velocity sustains 4× baseline
                    inside 60 days, the pick grades Hit and you move up the
                    board.
                  </>
                ),
              },
              {
                n: 4,
                body: (
                  <>
                    Hits are permanent. The Sunday Insider briefing names you
                    as co-spotter the week the round announces. Citable,
                    indexed, anonymity-safe.
                  </>
                ),
              },
            ].map((step) => (
              <li
                key={step.n}
                className="flex gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5"
              >
                <span className="text-amber-300 font-bold tabular-nums shrink-0 text-lg">
                  {step.n}.
                </span>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* CLOSE */}
        <section className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 text-center space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            {remaining} of {CHARTER_COHORT_TOTAL_SEATS} seats still open
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            The first hit on this board belongs to whoever ships first.
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            We don&rsquo;t backfill. We don&rsquo;t fabricate. The first row
            on this leaderboard goes to the first charter member whose first
            pick grades Hit at the 60-day window. After that, it&rsquo;s
            cumulative, every Hit moves you up the board permanently.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/members/join"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-base shadow-lg shadow-amber-500/30 transition-colors"
            >
              Claim a seat → publish a pick → land on the board
            </Link>
          </div>
        </section>

        {/* CROSS-LINKS */}
        <section className="border-t border-slate-800 pt-8 text-sm text-gray-400 leading-relaxed space-y-2">
          <p>
            <strong className="text-gray-300">Related surfaces:</strong>{" "}
            <Link
              href="/members"
              className="text-amber-400 hover:text-amber-300 underline decoration-dotted"
            >
              /members
            </Link>{" "}
            (cohort hub) ·{" "}
            <Link
              href="/scorecard"
              className="text-amber-400 hover:text-amber-300 underline decoration-dotted"
            >
              /scorecard
            </Link>{" "}
            (founder&rsquo;s rolling pick scorecard) ·{" "}
            <Link
              href="/wins"
              className="text-amber-400 hover:text-amber-300 underline decoration-dotted"
            >
              /wins
            </Link>{" "}
            (startup-side validated panel).
          </p>
        </section>
      </div>
    </>
  );
}
