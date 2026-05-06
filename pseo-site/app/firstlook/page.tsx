import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

// First Look Pass uses an email-capture waitlist on the apex landing site
// (landing/index.html#firstlook) rather than a direct Stripe link, because
// the founder picks the sector + delivers manually within 24h. The dedicated
// Stripe payment link is on the roadmap; until then the apex anchor is the
// canonical commit point.
const FIRSTLOOK_CHECKOUT = "https://gitdealflow.com/#firstlook";

export const metadata: Metadata = {
  title: "First Look Pass — €7. One sector. 24-hour deep dive.",
  description:
    "Pay €7 once, pick any of 19 tracked sectors, and within 24 hours get a written sector deep dive: top 25 ranked GitHub orgs, 14-day acceleration deltas, contributor maps, and three pre-Crunchbase breakouts. Credited toward Dashboard if you upgrade in 14 days.",
  alternates: { canonical: "/firstlook" },
  openGraph: {
    title: "First Look Pass — €7. One sector. 24-hour deep dive.",
    description:
      "€7 once, pick a sector, get the full GitHub-momentum deep dive in 24h.",
    url: "https://signals.gitdealflow.com/firstlook",
    type: "article",
  },
};

const STACK = [
  {
    label: "Top 25 ranked GitHub orgs in your sector",
    detail:
      "Sorted by 14-day commit velocity acceleration, with two-period confirmation to filter out noise spikes.",
  },
  {
    label: "Contributor map per top org",
    detail:
      "Who's joined in the past 30 days. Matters because contributor influx precedes hiring announcements.",
  },
  {
    label: "Three pre-Crunchbase breakouts",
    detail:
      "Net-new orgs surfaced by the same engine — companies the consensus deal-flow tools haven't indexed yet.",
  },
  {
    label: "Raw CSV (every org × every metric)",
    detail:
      "Drop into your CRM or notebook. License-friendly. Every metric is re-derivable from public GitHub data.",
  },
  {
    label: "Written walkthrough (15-minute read)",
    detail:
      "What stood out. What's likely a false positive. The thesis-specific surprises in the data this quarter.",
  },
] as const;

const FAQS = [
  {
    q: "What's the deliverable, exactly?",
    a: "A PDF report (10–14 pages depending on sector) plus the raw CSV. Delivered to your inbox within 24 hours of payment, weekdays. Manually written by the founder, not auto-generated. The same engine that powers the Dashboard, but applied to one sector with a written narrative around it.",
  },
  {
    q: "How do I pick the sector?",
    a: "On the Stripe checkout page, the order field asks which sector. We track 19: AI/ML, AI infra, AI safety, climate tech, crypto/web3, cybersecurity, data infra, dev tools, edtech, fintech rails, future of work, gaming, healthtech, identity, observability, open source tooling, robotics, SaaS infra, vertical AI. If your thesis cuts across, name it and we'll pick the most relevant one.",
  },
  {
    q: "What happens if I upgrade to the Dashboard?",
    a: "The €7 is credited toward your first month of Dashboard if you upgrade within 14 days of receiving the deep dive. Reply to the delivery email with REQUEST CREDIT and the founder applies it manually — no automation, but it's never been missed.",
  },
  {
    q: "Why is it €7 and not free?",
    a: "Two reasons. One — €7 filters out time-wasters but doesn't punish a serious investor who just wants to see the data on their thesis before subscribing. Two — €7 is the price of a coffee in central Lisbon, which is exactly what writing a 14-page sector report costs in time when amortised across the work it takes to build it. The price isn't margin, it's a filter.",
  },
] as const;

export default function FirstLookPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": "https://signals.gitdealflow.com/firstlook#product",
        name: "First Look Pass",
        description:
          "€7 one-time tripwire — a sector-specific written deep dive on GitHub momentum, delivered within 24 hours.",
        offers: {
          "@type": "Offer",
          price: "7.00",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: "https://signals.gitdealflow.com/firstlook",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "First Look Pass",
            item: "https://signals.gitdealflow.com/firstlook",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/firstlook"
        languages={getHreflangLanguages("/firstlook")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/firstlook" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <p className="text-amber-400 text-xs font-medium uppercase tracking-wider">
            Tripwire offer · €7 · One-time
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Pick a sector. Pay €7.{" "}
            <span className="text-amber-400">Get the full deep dive in 24 hours.</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Most investors won&rsquo;t pay €9.97/mo for a tool they
            haven&rsquo;t tested on their actual thesis. Fair. The First Look
            Pass exists for that exact gap. €7, one-time, no subscription —
            and €7 of credit if you upgrade.
          </p>
        </header>

        {/* BEST BAIT — Brunson DotCom Secrets Ch 13. Frame the offer as
            bait specifically built for the developer-investor avatar so
            the buyer recognises it as their kind of trip-wire, not a
            generic upsell. The teaching is that bait is signal, not
            noise — match the bait to the buyer&rsquo;s identity. */}
        <aside
          aria-label="Why this is bait built for you"
          className="rounded-xl border border-amber-700/40 bg-amber-950/15 p-5 sm:p-6 space-y-2"
        >
          <p className="text-amber-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            Why this is the right bait
          </p>
          <h2 className="text-gray-100 font-bold text-lg sm:text-xl leading-snug">
            This pass isn&rsquo;t a generic trial. It&rsquo;s built for the
            developer-investor specifically.
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Brunson&rsquo;s rule of bait: match the offer to the avatar.
            A €7 PDF is the wrong bait for a fund partner with a
            six-figure data budget — too small to register. It&rsquo;s the
            <em> right </em>bait for the engineer-investor who reads
            commit logs for fun, writes €5k–€50k checks on the side, and
            wants to test the data on their actual thesis before
            subscribing. That&rsquo;s why the price is €7, the deliverable
            is sector-specific, and the format is PDF + raw CSV — not a
            sales call, not a demo, not a calendar invite.
          </p>
        </aside>

        <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-100">What lands in your inbox</h2>
          <ul className="space-y-3">
            {STACK.map((item) => (
              <li key={item.label} className="flex items-start gap-3">
                <span className="text-amber-400 font-bold shrink-0 mt-0.5">→</span>
                <div>
                  <p className="text-gray-100 font-semibold text-sm">{item.label}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* CHOOSE YOUR OFFER — Brunson order-bump pattern (DotCom Ch 12),
            upgraded from a one-line preview to a side-by-side A/B card so
            the buyer can SEE the bump as a deliberate choice, not a footnote.
            Two cards, two prices, two CTAs. The smaller offer is pre-marked
            as "most picked"; the bumped offer carries the savings flag. */}
        <section
          aria-label="Choose your First Look offer"
          className="space-y-4"
        >
          <div className="space-y-1">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
              Choose your offer
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
              Two ways to take the same 24-hour intake.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              The €7 First Look Pass works on its own. Or — only at this step —
              you can bump to the full Sector Sweep for €200 off and skip the
              upgrade later.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option A — €7 First Look (standard) */}
            <div className="rounded-xl border-2 border-amber-500/60 bg-amber-950/15 p-5 sm:p-6 space-y-3 relative">
              <span className="absolute -top-2.5 left-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                Most picked
              </span>
              <p className="text-amber-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider pt-1">
                Option A · First Look Pass
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-100">€7</span>
                <span className="text-gray-400 text-sm">one-time</span>
              </div>
              <ul className="space-y-1.5 text-gray-300 text-sm leading-relaxed">
                <li className="flex gap-2"><span className="text-amber-400 shrink-0">✓</span> Top-25 ranked startups in one sector</li>
                <li className="flex gap-2"><span className="text-amber-400 shrink-0">✓</span> Written PDF brief + raw CSV + JSON</li>
                <li className="flex gap-2"><span className="text-amber-400 shrink-0">✓</span> 24-hour intake, weekday delivery</li>
                <li className="flex gap-2"><span className="text-amber-400 shrink-0">✓</span> €7 credited if you upgrade Dashboard in 14d</li>
              </ul>
              <a
                href={FIRSTLOOK_CHECKOUT}
                className="block text-center w-full rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm py-3 transition-colors"
              >
                Get the First Look Pass — €7 →
              </a>
            </div>

            {/* Option B — €1,797 Sweep (bump) */}
            <div className="rounded-xl border-2 border-dashed border-emerald-500/60 bg-emerald-950/15 p-5 sm:p-6 space-y-3 relative">
              <span className="absolute -top-2.5 left-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
                Save €200 — this step only
              </span>
              <p className="text-emerald-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider pt-1">
                Option B · Bump to full Sector Sweep
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-100">€1,797</span>
                <span className="text-gray-500 line-through text-sm">€1,997</span>
              </div>
              <ul className="space-y-1.5 text-gray-300 text-sm leading-relaxed">
                <li className="flex gap-2"><span className="text-emerald-400 shrink-0">✓</span> Full panel — every venture-backed org in the sector</li>
                <li className="flex gap-2"><span className="text-emerald-400 shrink-0">✓</span> Three time windows (4w / 12w / 26w deltas)</li>
                <li className="flex gap-2"><span className="text-emerald-400 shrink-0">✓</span> 60-minute walkthrough call + Q&amp;A window</li>
                <li className="flex gap-2"><span className="text-emerald-400 shrink-0">✓</span> €13,000+ standalone value · 30-day guarantee</li>
              </ul>
              <a
                href="https://buy.stripe.com/bJe14m34DbNC6gm1by0x204"
                className="block text-center w-full rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm py-3 transition-colors"
              >
                Bump to Sector Sweep — €1,797 →
              </a>
              <p className="text-gray-400 text-[11px] leading-snug">
                Mention <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-200">FIRSTLOOK-BUMP</code> in the order field. The €200 discount is only available from this page — the standard Sweep buyer pays €1,997.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 border border-amber-700/40 rounded-xl p-6 sm:p-8 text-center space-y-4">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            One-time payment · No subscription
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-amber-200">€7</h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-xl mx-auto">
            Stripe checkout. The sector goes in the order field. Delivery to
            your inbox within 24h on weekdays. €7 credited toward Dashboard
            if you upgrade within 14 days of delivery.
          </p>
          <a
            href={FIRSTLOOK_CHECKOUT}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/30 transition-all"
          >
            Get the First Look Pass — €7 <span aria-hidden="true">→</span>
          </a>
          <p className="text-gray-500 text-xs">
            Or read the{" "}
            <Link href="/perfect-webinar" className="text-amber-300 hover:text-amber-200 underline decoration-dotted">
              12-minute Perfect Webinar
            </Link>{" "}
            if you&rsquo;re weighing the Dashboard tier directly.
          </p>
        </section>

        {/* POST-PURCHASE UPSELL PREVIEW — DotCom Ch 12. Show what's coming so
            the buyer isn't surprised by the offer in the delivery email. */}
        <aside
          className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 sm:p-6 space-y-2"
          aria-label="Post-purchase upsell preview"
        >
          <p className="text-teal-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            What happens after delivery
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Inside the delivery email there&rsquo;s a one-time invitation to add{" "}
            <Link href="/pricing#insider" className="text-teal-300 hover:text-teal-200 underline decoration-dotted">
              Insider Circle
            </Link>{" "}
            (private Telegram + spike alerts + monthly briefing) at{" "}
            <strong className="text-gray-100">€77 for the first month</strong>{" "}
            — €20 off the standard €97. The invite expires when the next
            Monday digest goes out, and never re-appears at this price.
            Decline it and your €7 First Look Pass still works exactly the
            same way.
          </p>
        </aside>

        {/* DOWNSELL — DotCom Ch 12. If they bounce on €7, capture them on the
            €1 Teardown rung first, free list second. Russell rule: never let
            a visitor leave at zero commitment if there's a paid-but-cheaper
            rung below — the €1 Teardown is the buyer-threshold breaker added
            specifically to close the €0-to-€7 psychological gap. */}
        <aside
          className="border-l-2 border-rose-700/50 pl-4 py-1 space-y-2"
          aria-label="Downsell to €1 Teardown then to free list"
        >
          <p className="text-rose-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            Not ready for €7?
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Try the{" "}
            <Link
              href="/teardown"
              className="text-rose-300 hover:text-rose-200 underline decoration-dotted"
            >
              €1 Tweet Teardown
            </Link>{" "}
            instead — name one startup, get a tweet-length read on its
            engineering momentum in 24h, written by the founder. €1 credits
            into the First Look Pass if you upgrade within 7 days, so this
            is the €0-to-€7 bridge, not a separate purchase.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Or skip paid entirely and join the free{" "}
            <a
              href="https://gitdealflow.com/#signup"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 underline decoration-dotted"
            >
              Acceleration Watch
            </a>{" "}
            — five startups every Monday, sector-tagged, no card.
          </p>
        </aside>

        <section className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-100">FAQ</h2>
          {FAQS.map((f) => (
            <div key={f.q} className="space-y-1.5">
              <h3 className="text-gray-100 font-semibold text-base">{f.q}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </section>

        <p className="text-gray-500 text-sm border-t border-slate-800 pt-5">
          Not sure if €7 fits or you should just lock the Dashboard?{" "}
          <Link href="/quiz" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
            Take the 90-second quiz
          </Link>
          .
        </p>
      </div>
    </>
  );
}
