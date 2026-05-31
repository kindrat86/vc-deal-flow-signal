import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import {
  CHARTER_COHORT_TOTAL_SEATS,
  getRemainingSeats,
} from "@/content/charter-cohort";
import CharterApplicationForm from "./CharterApplicationForm";

export const dynamic = "force-static";

const SITE = "https://signals.gitdealflow.com";

/**
 * /members/join — Charter Cohort application page.
 *
 * Brunson DotCom Secrets §23 (Application Funnel) — async-only equivalent of
 * the phone-close, anonymity-preserving. The form posts to
 * /api/charter-application and the founder reads + replies in 48h.
 *
 * Brunson Expert Secrets Ch 16+17 (Setter+Closer) — the founder is both,
 * since async-only. The 48h SLA replaces the live call.
 */

export const metadata: Metadata = {
  title:
    "Claim a Charter Seat — VC Deal Flow Signal · Cohort 2026",
  description:
    "Submit your charter application. Pseudonymous handles welcome. Real name never required. The founder reads every application personally and replies within 48 business hours with a draft profile to confirm.",
  alternates: { canonical: "/members/join" },
  openGraph: {
    title: "Claim a Charter Seat — Cohort 2026",
    description:
      "5-field application. Pseudonymous welcome. 48h written reply.",
    url: `${SITE}/members/join`,
    type: "article",
  },
};

interface RouteContext {
  searchParams: Promise<{ archetype?: string | string[] }>;
}

export default async function MembersJoinPage(ctx: RouteContext) {
  const sp = await ctx.searchParams;
  const rawArchetype = Array.isArray(sp.archetype)
    ? sp.archetype[0]
    : sp.archetype;
  const initialArchetype = rawArchetype && /^[a-z0-9-]{1,40}$/.test(rawArchetype)
    ? rawArchetype
    : undefined;

  const remaining = getRemainingSeats();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/members/join#webpage`,
        url: `${SITE}/members/join`,
        name: "Claim a Charter Seat — VC Deal Flow Signal",
        description:
          "Charter Cohort 2026 application form. Pseudonymous welcome. 48h reply.",
        isPartOf: { "@id": `${SITE}/#website` },
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
            name: "Claim a seat",
            item: `${SITE}/members/join`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/members/join`}
        languages={getHreflangLanguages("/members/join")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/members/join" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <header className="space-y-3">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/members" className="hover:text-gray-300">
              Charter Cohort
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Claim a seat</span>
          </nav>

          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            Charter Cohort 2026 · {remaining} of {CHARTER_COHORT_TOTAL_SEATS}{" "}
            seats open
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Claim a charter seat.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Five fields, four minutes. The founder reads every application
            personally and replies inside 48 business hours with a draft
            profile to confirm — or a written no with the reason.
          </p>
        </header>

        <CharterApplicationForm initialArchetype={initialArchetype} />

        <section className="border-t border-slate-800 pt-6 text-sm text-gray-400 leading-relaxed space-y-2">
          <p>
            <strong className="text-gray-300">What happens next:</strong>{" "}
            Application logs to founder queue → 48h written review → draft
            profile sent for your edits → publish at /members/{"{handle}"}.
            Anonymity-preserving end-to-end.
          </p>
          <p>
            Prefer email?{" "}
            <a
              href="mailto:signal@gitdealflow.com?subject=Charter%20Cohort%20Application"
              className="text-amber-400 hover:text-amber-300 underline decoration-dotted"
            >
              signal@gitdealflow.com
            </a>{" "}
            with the same fields works too.
          </p>
        </section>
      </div>
    </>
  );
}
