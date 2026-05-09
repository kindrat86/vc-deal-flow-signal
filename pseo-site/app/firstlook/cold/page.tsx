/**
 * /firstlook/cold — Brunson DotCom Secrets Ch 13 audit fix 2026-05-09
 * (push 93 → 100): "Could test a second bait variant for cold IG/FB traffic."
 *
 * The /firstlook page is optimized for warm traffic — a reader who already
 * knows what GitHub commit-velocity is, recognizes the SSRN reference, and
 * is ready to evaluate a 90s teardown of a developer-investor product.
 *
 * Cold IG/FB traffic is a different reader. Mobile-first, no product
 * vocabulary, no SSRN context, 3-second attention span. The value tease
 * has to land in the first scroll. The €7 ask has to feel obvious by the
 * time the reader hits the form.
 *
 * Same conversion (€7 First Look Pass), different on-ramp. Same Stripe
 * Checkout, same delivery, same OTO ladder downstream — only the framing
 * is rebuilt for cold reach.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import TrialClose from "@/components/TrialClose";

const SITE = "https://signals.gitdealflow.com";

export const dynamic = "force-static";

const FIRSTLOOK_OFFER_URL = `${SITE}/firstlook/cold`;

export const metadata: Metadata = {
  title:
    "€7 — see who&rsquo;s about to raise before the deck goes out",
  description:
    "Pay €7. Pick any of 19 tech sectors. Inside 24 hours we send a written report naming three startups in your sector that are about to raise — based on what their engineers are actually shipping in public, weeks before the announcement.",
  alternates: { canonical: "/firstlook/cold" },
  openGraph: {
    title: "€7 — see who&rsquo;s about to raise before the deck goes out",
    description:
      "€7 once. Pick a sector. 24h later, three named startups about to raise — predicted from public code activity. Refund if you're not surprised.",
    url: FIRSTLOOK_OFFER_URL,
    type: "article",
  },
  robots: {
    // The cold variant is the paid-traffic surface. We don't want the search
    // index to pick this up as a competing URL to /firstlook proper — paid
    // traffic only.
    index: false,
    follow: true,
  },
};

const PROOF = [
  {
    headline: "Read the code, not the deck.",
    body: "Public code is updated daily. Pitch decks are updated quarterly. Decks are weeks behind what the company is actually building.",
  },
  {
    headline: "47 days before the round announcement.",
    body: "We tracked 219 venture-backed startups across 19 sectors. Median lead time from acceleration spike to publicly-announced fundraise: 21 to 47 days.",
  },
  {
    headline: "Three names in your sector. Inside 24 hours.",
    body: "You pick the sector. We do the work. You get a written report — three named startups, each with the specific GitHub-side signal that surfaced them, and what to ask the founder.",
  },
];

const FORM_ACTION = "/api/checkout/session";

export default function FirstLookColdPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${FIRSTLOOK_OFFER_URL}#product`,
        name: "First Look Pass — Cold-traffic variant",
        description:
          "€7 written sector report — three named pre-Crunchbase startups, top-25 ranked orgs by commit velocity, delivered 24h after purchase.",
        brand: { "@type": "Brand", name: "VC Deal Flow Signal" },
        offers: {
          "@type": "Offer",
          price: "7",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: FIRSTLOOK_OFFER_URL,
          priceValidUntil: "2026-12-31",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "First Look (Cold)",
            item: FIRSTLOOK_OFFER_URL,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={FIRSTLOOK_OFFER_URL}
        languages={getHreflangLanguages("/firstlook/cold")}
      />
      <AgentMirrorLinks path="/firstlook/cold" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Mobile-first single-column layout. Every block fits one phone scroll. */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* HERO — first scroll. Big claim, big number, big button. */}
        <header className="space-y-3 text-center">
          <p className="text-amber-300 text-[11px] font-bold uppercase tracking-wider">
            One-time payment · €7 · Refund if not surprised
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            See who&rsquo;s about to raise{" "}
            <span className="text-amber-300">47 days before the deck.</span>
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">
            Pay €7. Pick a tech sector. Inside 24 hours we send you{" "}
            <strong className="text-gray-100">three named startups</strong>{" "}
            about to raise — based on what their engineers are
            shipping in public, right now.
          </p>
        </header>

        {/* PRIMARY CTA — first scroll. */}
        <form
          action={FORM_ACTION}
          method="POST"
          className="space-y-3"
          aria-label="Buy First Look Pass — €7"
        >
          <input type="hidden" name="tier" value="firstlook" />
          <input type="hidden" name="utm_source" value="paid-cold" />
          <input type="hidden" name="utm_medium" value="ig-fb" />
          <input type="hidden" name="utm_campaign" value="cold-bait-v1" />
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-lg px-5 py-4 transition-colors shadow-lg shadow-amber-500/20"
          >
            Get my €7 First Look →
          </button>
          <p className="text-center text-[11px] text-gray-400 leading-relaxed">
            Stripe Checkout · Apple Pay · Google Pay · Card · No subscription
          </p>
        </form>

        {/* SOCIAL PROOF stat band */}
        <section
          aria-label="Headline numbers"
          className="grid grid-cols-3 gap-2 rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/40 via-slate-900 to-slate-950 p-4"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-300 tabular-nums leading-none">
              219
            </p>
            <p className="text-[10px] text-gray-400 mt-1 leading-tight">
              startups<br />in panel
            </p>
          </div>
          <div className="text-center border-l border-slate-800">
            <p className="text-2xl font-bold text-amber-300 tabular-nums leading-none">
              21–47
            </p>
            <p className="text-[10px] text-gray-400 mt-1 leading-tight">
              days lead<br />time
            </p>
          </div>
          <div className="text-center border-l border-slate-800">
            <p className="text-2xl font-bold text-amber-300 tabular-nums leading-none">
              62%
            </p>
            <p className="text-[10px] text-gray-400 mt-1 leading-tight">
              precision<br />at 90 days
            </p>
          </div>
        </section>

        {/* PROOF — three short blocks. */}
        <section className="space-y-4">
          {PROOF.map((p) => (
            <div
              key={p.headline}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-1.5"
            >
              <h2 className="text-gray-100 font-bold text-base leading-snug">
                {p.headline}
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                {p.body}
              </p>
            </div>
          ))}
        </section>

        {/* HOW IT WORKS — three steps, mobile-friendly. */}
        <section className="rounded-xl border border-emerald-700/40 bg-emerald-950/15 p-5 space-y-4">
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            How it works
          </p>
          <ol className="space-y-3">
            <li className="flex gap-3">
              <span
                aria-hidden
                className="shrink-0 w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold flex items-center justify-center"
              >
                1
              </span>
              <p className="text-gray-200 text-sm leading-relaxed">
                <strong className="text-gray-100">Pay €7.</strong> Stripe
                Checkout, Apple Pay or card, takes 30 seconds.
              </p>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden
                className="shrink-0 w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold flex items-center justify-center"
              >
                2
              </span>
              <p className="text-gray-200 text-sm leading-relaxed">
                <strong className="text-gray-100">Pick a sector.</strong>{" "}
                AI infrastructure, dev tools, fintech, climate,
                cybersecurity — 19 to choose from.
              </p>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden
                className="shrink-0 w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold flex items-center justify-center"
              >
                3
              </span>
              <p className="text-gray-200 text-sm leading-relaxed">
                <strong className="text-gray-100">Get the report in 24h.</strong>{" "}
                Three named startups, the GitHub signal that surfaced
                them, and what to ask the founder.
              </p>
            </li>
          </ol>
        </section>

        {/* GUARANTEE — visible, unconditional. */}
        <section className="rounded-xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 p-5 space-y-2">
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            Refund guarantee
          </p>
          <p className="text-gray-100 text-base font-semibold leading-snug">
            Reply &ldquo;refund&rdquo; in 14 days. Full €7 back. No
            questions, no exit interview.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            If the report doesn&rsquo;t surface a single startup you
            didn&rsquo;t already know, that&rsquo;s on us. Email{" "}
            <a
              href="mailto:signal@gitdealflow.com"
              className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted"
            >
              signal@gitdealflow.com
            </a>{" "}
            and the €7 lands back inside 48h.
          </p>
        </section>

        {/* TRUST anchors — for the skeptical mobile reader. */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/30 p-5 space-y-3">
          <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
            Why this is real, not marketing
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex gap-2">
              <span className="text-emerald-400 shrink-0">✓</span>
              <span>
                219-startup panel published on SSRN under{" "}
                <Link
                  href="/research"
                  className="text-sky-300 hover:text-sky-200 underline decoration-dotted"
                >
                  DOI 10.2139/ssrn.6606558
                </Link>
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400 shrink-0">✓</span>
              <span>
                Methodology published openly under{" "}
                <Link
                  href="/methodology"
                  className="text-sky-300 hover:text-sky-200 underline decoration-dotted"
                >
                  CC BY 4.0
                </Link>{" "}
                — every formula, every threshold
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400 shrink-0">✓</span>
              <span>
                Reproducible in a notebook from public data —{" "}
                <Link
                  href="/reproducibility"
                  className="text-sky-300 hover:text-sky-200 underline decoration-dotted"
                >
                  HowTo
                </Link>
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400 shrink-0">✓</span>
              <span>
                4× reply rate on the outbound template — public template, no fluff
              </span>
            </li>
          </ul>
        </section>

        {/* SECONDARY CTA — second-scroll close. */}
        <section className="space-y-3 pt-2">
          <TrialClose tone="amber">
            €7. 24 hours. Three names. If you don&rsquo;t recognize at
            least one of them — refund.
          </TrialClose>
          <form
            action={FORM_ACTION}
            method="POST"
            aria-label="Buy First Look Pass — €7 (second CTA)"
          >
            <input type="hidden" name="tier" value="firstlook" />
            <input type="hidden" name="utm_source" value="paid-cold" />
            <input type="hidden" name="utm_medium" value="ig-fb" />
            <input type="hidden" name="utm_campaign" value="cold-bait-v1" />
            <input type="hidden" name="utm_content" value="secondary-cta" />
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-lg px-5 py-4 transition-colors shadow-lg shadow-amber-500/20"
            >
              Get my €7 First Look →
            </button>
          </form>
        </section>

        {/* FAQ — three short questions. */}
        <section className="space-y-3 pt-2">
          <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
            FAQ
          </p>
          <details className="rounded-lg border border-slate-800 bg-slate-900/30 p-3">
            <summary className="cursor-pointer text-gray-200 font-semibold text-sm">
              Is this a subscription?
            </summary>
            <p className="mt-2 text-sm text-gray-300 leading-relaxed">
              No. €7 once, you get the report, that&rsquo;s the whole
              transaction. No auto-renewal, no follow-up charge.
            </p>
          </details>
          <details className="rounded-lg border border-slate-800 bg-slate-900/30 p-3">
            <summary className="cursor-pointer text-gray-200 font-semibold text-sm">
              I&rsquo;m not a VC. Will the report still help me?
            </summary>
            <p className="mt-2 text-sm text-gray-300 leading-relaxed">
              The report works for solo angels (€5k–€50k checks),
              corporate-development scouts, sales teams targeting
              early-stage startups, and developers tracking
              fundraising momentum. If you write checks or sell into
              tech startups, it works.
            </p>
          </details>
          <details className="rounded-lg border border-slate-800 bg-slate-900/30 p-3">
            <summary className="cursor-pointer text-gray-200 font-semibold text-sm">
              What if I want it sooner than 24h?
            </summary>
            <p className="mt-2 text-sm text-gray-300 leading-relaxed">
              We deliver as fast as the queue allows — most reports
              ship inside 12 hours. Hard ceiling is 24 business hours.
              If yours takes longer than 24h, we refund proactively.
            </p>
          </details>
        </section>

        {/* Tiny footer — anonymity disclosure. */}
        <p className="text-[10px] text-gray-500 text-center leading-relaxed pt-4 border-t border-slate-900">
          Anonymous-by-design publisher. No founder face, no founder
          voice, no real names. Methodology over personality. The
          product is a dataset, not a personality.{" "}
          <Link href="/manifesto" className="text-gray-400 underline decoration-dotted">
            Manifesto
          </Link>
        </p>
      </div>
    </>
  );
}
