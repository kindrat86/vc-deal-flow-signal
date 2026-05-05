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

        {/* ORDER BUMP — DotCom Secrets Ch 12. The bump sits between the stack
            and the CTA, after the visitor has seen the offer but before they
            click. Bigger sibling at a real discount, framed as a one-time
            decision. Russell calls this the "yes-and-also". */}
        <aside
          className="border-2 border-dashed border-emerald-500/60 bg-emerald-950/20 rounded-xl p-5 sm:p-6 space-y-3"
          aria-label="Order bump"
        >
          <div className="flex items-start gap-3">
            <span aria-hidden="true" className="text-emerald-400 font-bold text-lg shrink-0 mt-0.5">
              ☑
            </span>
            <div className="space-y-2">
              <p className="text-emerald-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                Add to your order · Save €200
              </p>
              <h3 className="text-gray-100 font-semibold text-lg leading-snug">
                Bump up to the full Sector Sweep — €1,797 instead of €1,997
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Same 24-hour intake, but instead of the top-25 in one sector,
                you get the <strong className="text-gray-100">full panel</strong>{" "}
                — every venture-backed GitHub org in the sector, ranked across
                three time windows, with a 60-minute walkthrough call and an
                open follow-up Q&amp;A window. €13,000+ standalone value at €1,797
                if you commit at this step. Mention{" "}
                <code className="text-xs text-gray-200 bg-slate-900 px-1.5 py-0.5 rounded">
                  FIRSTLOOK-BUMP
                </code>{" "}
                in the order field to lock the discount.
              </p>
              <a
                href="https://buy.stripe.com/bJe14m34DbNC6gm1by0x204"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 text-sm font-medium underline decoration-dotted underline-offset-2"
              >
                Take the Sector Sweep instead — €1,797 →
              </a>
            </div>
          </div>
        </aside>

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
            free list. Russell rule: never let a visitor leave at zero
            commitment if there's a free rung below. */}
        <aside
          className="border-l-2 border-slate-700 pl-4 py-1 space-y-1"
          aria-label="Downsell to free list"
        >
          <p className="text-gray-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            Not ready for €7?
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            The free{" "}
            <a
              href="https://gitdealflow.com/#signup"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 underline decoration-dotted"
            >
              Acceleration Watch
            </a>{" "}
            sends 5 startups every Monday — sector-tagged, with the same engine
            behind the First Look Pass. No card. Subscribe, watch the rhythm
            for two weeks, then decide.
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
