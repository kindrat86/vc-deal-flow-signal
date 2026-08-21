import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import {
  CHARTER_COHORT,
  CHECK_SIZE_LABELS,
  SECTOR_LABELS,
  getAllCharterHandles,
  getCharterMember,
} from "@/content/charter-cohort";

export const dynamic = "force-static";
export const dynamicParams = false;

const SITE = "https://signals.gitdealflow.com";

interface RouteContext {
  params: Promise<{ handle: string }>;
}

/**
 * /members/[handle], Charter member profile page.
 *
 * Brunson Expert Secrets §1 Ch 4 (Mass Movement Vehicle), visible momentum
 * member-side. Each profile is the primary unit of social proof in the
 * member-side track record. Static, indexed, hreflang-tagged, with Person +
 * ProfilePage JSON-LD.
 *
 * For unclaimed seats: the page is honest, it says "Open seat, claim this
 * archetype" and the thesis is labeled illustrative. There are no fabricated
 * picks, no fabricated scorecards. The grading rules are documented and the
 * scorecard rows are empty until a real charter member publishes.
 */

export function generateStaticParams() {
  return getAllCharterHandles().map((handle) => ({ handle }));
}

export async function generateMetadata(
  ctx: RouteContext,
): Promise<Metadata> {
  const { handle } = await ctx.params;
  const member = getCharterMember(handle);
  if (!member) {
    return { title: { absolute: "Member not found · VC Deal Flow Signal" } };
  }
  const claimedLabel = member.claimed
    ? `${member.claimedBy?.handle ?? handle}`
    : `Open seat, ${member.archetype}`;
  return {
    // absolute: title already names the brand, bypass the layout template
    // (brand-doubling fix 2026-08-15)
    title: { absolute: `${claimedLabel} · Charter Cohort 2026 · VC Deal Flow Signal` },
    description: member.tagline,
    alternates: { canonical: `/members/${member.handle}` },
    openGraph: {
      title: claimedLabel,
      description: member.tagline,
      url: `${SITE}/members/${member.handle}`,
      type: "profile",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function MemberProfilePage(ctx: RouteContext) {
  const { handle } = await ctx.params;
  const member = getCharterMember(handle);
  if (!member) notFound();

  const headline = member.claimed
    ? member.claimedBy?.handle ?? `@${member.handle}`
    : `Open seat, ${member.archetype}`;

  const personSchema: Record<string, unknown> = {
    "@type": "Person",
    "@id": `${SITE}/members/${member.handle}#person`,
    name: member.claimed ? member.claimedBy?.handle ?? member.handle : `Open seat, ${member.archetype}`,
    description: member.tagline,
    url: `${SITE}/members/${member.handle}`,
    knowsAbout: member.sectors.map((s) => SECTOR_LABELS[s]),
    affiliation: {
      "@type": "Organization",
      "@id": "https://gitdealflow.com/#organization",
      name: "VC Deal Flow Signal, Charter Cohort 2026",
    },
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${SITE}/members/${member.handle}#profilepage`,
        url: `${SITE}/members/${member.handle}`,
        name: `${headline}, Charter Cohort 2026`,
        mainEntity: { "@id": `${SITE}/members/${member.handle}#person` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
        isPartOf: { "@id": `${SITE}/#website` },
      },
      personSchema,
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
            name: headline,
            item: `${SITE}/members/${member.handle}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/members/${member.handle}`}
        languages={getHreflangLanguages(`/members/${member.handle}`)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/members/${member.handle}`} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
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
            <span className="text-gray-400">{member.handle}</span>
          </nav>

          {/* Open-seat banner, explicit honesty marker */}
          {!member.claimed && (
            <div
              role="status"
              className="rounded-lg border border-amber-700/50 bg-amber-950/20 px-4 py-3 text-sm text-amber-200"
            >
              <strong className="text-amber-300">Open seat.</strong> The thesis
              and archetype below are an illustrative template. Claim this seat
              and the page becomes yours, your handle, your thesis, your
              picks, your scorecard.{" "}
              <Link
                href="/members/join"
                className="text-amber-300 hover:text-amber-200 underline decoration-dotted font-semibold"
              >
                Claim this archetype →
              </Link>
            </div>
          )}

          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            Charter Cohort 2026 · {member.claimed ? "Claimed" : "Open seat"}
          </p>
          <h1
            data-speakable
            className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight"
          >
            {headline}
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            {member.tagline}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-[11px] text-amber-300 border border-amber-700/40 bg-amber-950/30 rounded-full px-3 py-1 uppercase tracking-wider font-semibold">
              {member.archetype}
            </span>
            <span className="text-[11px] text-sky-300 border border-sky-800/40 bg-sky-950/30 rounded-full px-3 py-1 uppercase tracking-wider font-semibold">
              {CHECK_SIZE_LABELS[member.checkSize]}
            </span>
            {member.sectors.map((s) => (
              <span
                key={s}
                className="text-[11px] text-violet-300 border border-violet-800/40 bg-violet-950/30 rounded-full px-3 py-1 uppercase tracking-wider font-semibold"
              >
                {SECTOR_LABELS[s]}
              </span>
            ))}
          </div>
        </header>

        {/* THESIS */}
        <section className="space-y-3" aria-label="Public thesis">
          <h2 className="text-2xl font-bold text-gray-100">
            Public thesis
          </h2>
          {!member.claimed && (
            <p className="text-gray-500 text-xs italic">
              Illustrative, replace with your own when you claim this seat.
            </p>
          )}
          <p className="text-gray-200 text-base sm:text-lg leading-relaxed">
            {member.thesis}
          </p>
        </section>

        {/* ACTIVE PICKS */}
        <section className="space-y-3" aria-label="Active picks">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-gray-100">Active picks</h2>
            <p className="text-gray-500 text-xs">
              {member.picks.length} {member.picks.length === 1 ? "pick" : "picks"}
            </p>
          </div>
          {member.picks.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 text-center space-y-2">
              <p className="text-gray-300 text-base font-semibold">
                No published picks yet.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Picks land here once the seat is claimed and the first pick is
                published. Each pick is one GitHub org plus a one-sentence why.
                Grading windows open at +60 days and +90 days from publish.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {member.picks.map((pick, i) => {
                const score = member.scorecard[i];
                return (
                  <li
                    key={`${pick.org}-${pick.flaggedAt}`}
                    className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5"
                  >
                    <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
                      <a
                        href={`https://github.com/${pick.org}`}
                        rel="noopener noreferrer nofollow"
                        target="_blank"
                        className="text-sky-400 hover:text-sky-300 font-mono font-semibold text-sm"
                      >
                        github.com/{pick.org} →
                      </a>
                      <p className="text-gray-500 text-xs tabular-nums">
                        Flagged {pick.flaggedAt}
                      </p>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {pick.why}
                    </p>
                    {score && (
                      <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-gray-400 flex flex-wrap gap-3">
                        <span>
                          60d window:{" "}
                          <strong
                            className={
                              score.status === "hit"
                                ? "text-emerald-400"
                                : score.status === "miss"
                                  ? "text-rose-400"
                                  : "text-amber-300"
                            }
                          >
                            {score.status}
                          </strong>{" "}
                          (opens {score.graded60dAt})
                        </span>
                        <span>
                          90d window: closes {score.graded90dAt}
                        </span>
                        {score.hitEvent && (
                          <span className="text-emerald-300">
                            Validated by: {score.hitEvent}
                          </span>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* SCORECARD */}
        <section className="space-y-3" aria-label="Public scorecard">
          <h2 className="text-2xl font-bold text-gray-100">
            Public scorecard
          </h2>
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold mb-1">
                  Hits
                </p>
                <p className="text-2xl font-bold text-emerald-400 tabular-nums">
                  {member.scorecard.filter((s) => s.status === "hit").length}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold mb-1">
                  Misses
                </p>
                <p className="text-2xl font-bold text-rose-400 tabular-nums">
                  {member.scorecard.filter((s) => s.status === "miss").length}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold mb-1">
                  Pending
                </p>
                <p className="text-2xl font-bold text-amber-300 tabular-nums">
                  {member.scorecard.filter((s) => s.status === "pending").length}
                </p>
              </div>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed border-t border-slate-800 pt-3">
              Same grading rules as{" "}
              <Link
                href="/scorecard"
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
              >
                /scorecard
              </Link>
              : a pick is graded Hit at the 60-day or 90-day window if a public
              fundraise lands or commit velocity sustains 4× baseline. Misses
              and Pendings are public, that&rsquo;s the methodology rule.
            </p>
          </div>
        </section>

        {/* CLOSE */}
        {!member.claimed && (
          <section className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 text-center space-y-3">
            <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
              Claim this seat
            </p>
            <h2 className="text-2xl font-bold text-gray-100 leading-snug">
              Is this you? Replace this template with your real profile.
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xl mx-auto">
              The {member.archetype} seat is open. Submit your handle, your
              thesis, your check-size, and the founder will reply within 48
              business hours with a draft profile to confirm.
            </p>
            <div className="pt-2">
              <Link
                href={`/members/join?archetype=${encodeURIComponent(member.handle)}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-base shadow-lg shadow-amber-500/30 transition-colors"
              >
                Claim the {member.archetype} seat <span aria-hidden>→</span>
              </Link>
            </div>
          </section>
        )}

        {/* CROSS-LINKS */}
        <section className="border-t border-slate-800 pt-8 text-sm text-gray-400 leading-relaxed space-y-2">
          <p>
            <strong className="text-gray-300">Other open seats:</strong>{" "}
            {CHARTER_COHORT.filter((m) => m.handle !== member.handle).map(
              (m, i, arr) => (
                <span key={m.handle}>
                  <Link
                    href={`/members/${m.handle}`}
                    className="text-amber-400 hover:text-amber-300 underline decoration-dotted"
                  >
                    {m.archetype}
                  </Link>
                  {i < arr.length - 1 ? " · " : ""}
                </span>
              ),
            )}
          </p>
          <p>
            <Link
              href="/members"
              className="text-amber-400 hover:text-amber-300 underline decoration-dotted"
            >
              ← Back to the Charter Cohort
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}
