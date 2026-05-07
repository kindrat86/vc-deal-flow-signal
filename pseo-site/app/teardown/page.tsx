import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

// €1 Tweet Teardown — Brunson DotCom Secrets buyer-threshold breaker.
// Bridges the €0 → €7 jump that Russell flagged as psychologically large.
// One paragraph, one number, one shipped via email within 24h.
//
// Direct Stripe payment link with a custom field for the startup name
// (plink_1TU4ZvCwGoUDklReEjuprkH0 → buy.stripe.com/bJe5kC48H2d2cEKg6s0x209).
// On success the buyer is redirected to /thanks/teardown; the Stripe webhook
// fires the post-purchase email server-side. The env var lets future link
// rotations stay in env without a code redeploy. `||` over `??` because empty
// strings should fall back too.
const TEARDOWN_CHECKOUT =
  process.env.NEXT_PUBLIC_STRIPE_TEARDOWN_LINK ||
  "https://buy.stripe.com/bJe5kC48H2d2cEKg6s0x209";

export const metadata: Metadata = {
  title: "Tweet Teardown — €1. One startup. 24-hour signal call.",
  description:
    "Pay €1 once, name one venture-backed startup, and within 24 hours get a tweet-length teardown of its GitHub momentum: signal type, 14-day acceleration %, and the kicker insight. €1 credited toward First Look Pass if you upgrade in 7 days.",
  alternates: { canonical: "/teardown" },
  openGraph: {
    title: "Tweet Teardown — €1. One startup. 24-hour signal call.",
    description:
      "€1 once, name a startup, get a tweet-length teardown of its engineering momentum in 24h.",
    url: "https://signals.gitdealflow.com/teardown",
    type: "article",
  },
};

const STACK = [
  {
    label: "Signal classification (one of four types)",
    detail:
      "Hiring burst, shipping sprint, infrastructure buildout, or platform migration — the same taxonomy the Dashboard uses, applied to the org you name.",
  },
  {
    label: "14-day acceleration delta",
    detail:
      "Two-period commit-velocity comparison with a confirmation window — the specific number that says whether the team is speeding up or coasting.",
  },
  {
    label: "The kicker insight",
    detail:
      "What the metric means for a check-writer right now. Not a generic comment — the specific edge or risk this signal implies for this team this month.",
  },
  {
    label: "Tweet-shaped output (≤280 chars)",
    detail:
      "Paste-able into Twitter/X, into your IC memo, into a partner Slack. Written by the founder, not auto-generated. Your name is never attached unless you ask.",
  },
] as const;

const FAQS = [
  {
    q: "Why €1?",
    a: "Brunson rule: the €0-to-€7 jump is psychologically larger than the €7-to-€97 jump. €1 isn't margin — it's a buyer-threshold breaker. Once you've put a card on file at any price, the next purchase is no longer a first purchase. We'd rather you trial the signal at the lowest possible cost, see whether the output reads true on a startup you already know, and then decide if the €7 First Look Pass or the €9.97/mo Dashboard is worth a real budget line.",
  },
  {
    q: "What's the deliverable, exactly?",
    a: "One paragraph (≤280 characters) emailed to your inbox within 24h on weekdays. Three sentences: signal classification, the acceleration number, the kicker insight. No PDF. No CSV. No call. No follow-up. The whole point is brutal compression — if a signal can't be summarised in a tweet, it isn't a signal worth selling.",
  },
  {
    q: "Can I name a private/stealth-mode startup?",
    a: "If they have a public GitHub org, yes — that's exactly the point of the methodology. If their entire engineering footprint is private GitLab, no — there's no public commit data to analyse and we'll refund the €1 inside the same hour. Public GitHub orgs cover roughly 70% of YC, Antler, and Entrepreneur First batches by default.",
  },
  {
    q: "What happens if I upgrade?",
    a: "The €1 is credited toward the First Look Pass (€7) if you upgrade within 7 days. Reply to the delivery email with REQUEST CREDIT and the founder applies it manually. After the First Look, the standard €7 → Dashboard upgrade credit also applies — so you can effectively start at €1 and roll the spend forward into the subscription if the signal reads true.",
  },
  {
    q: "Is this just an AI-generated summary?",
    a: "No — the founder writes every Teardown personally. The metrics are computed from public GitHub data with the same engine as the Dashboard, but the kicker insight (the third sentence) is a human read on what the data implies for a buyer. AI is a poor judge of which signals matter to a fund's specific thesis; a human writing a tweet about a startup the buyer already knows is the highest-signal version of this product.",
  },
] as const;

export default function TeardownPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": "https://signals.gitdealflow.com/teardown#product",
        name: "Tweet Teardown",
        description:
          "€1 one-time micro-tripwire — a tweet-length (≤280 char) GitHub-momentum teardown of one startup you name, written by the founder and delivered within 24 hours.",
        offers: {
          "@type": "Offer",
          price: "1.00",
          priceCurrency: "EUR",
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/InStock",
          url: "https://signals.gitdealflow.com/teardown",
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
            name: "Tweet Teardown",
            item: "https://signals.gitdealflow.com/teardown",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/teardown"
        languages={getHreflangLanguages("/teardown")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/teardown" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <p className="text-rose-300 text-xs font-medium uppercase tracking-wider">
            Buyer-threshold breaker · €1 · One-time
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Name one startup. Pay €1.{" "}
            <span className="text-rose-300">
              Get a tweet-length teardown in 24 hours.
            </span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Three sentences. One number. Hand-written by the founder, not an
            LLM. The tightest possible read of an engineering team you already
            have a name for &mdash; for less than a vending-machine coffee.
          </p>
        </header>

        {/* WHY €1 — close the psychological gap explicitly. The visitor
            arrived here expecting the cheapest paid product to be €7;
            seeing €1 invites suspicion. Pre-empt it before the form. */}
        <aside
          aria-label="Why €1"
          className="rounded-xl border border-rose-700/40 bg-rose-950/15 p-5 sm:p-6 space-y-2"
        >
          <p className="text-rose-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            Why a euro and not free
          </p>
          <h2 className="text-gray-100 font-bold text-lg sm:text-xl leading-snug">
            €1 is the smallest barrier between &ldquo;curious&rdquo; and
            &ldquo;paying customer.&rdquo;
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Free buyers and paying buyers are different psychological
            categories. The smallest viable charge that converts the first
            into the second is €1 &mdash; the price of a vending-machine
            coffee. After this, the €7 First Look Pass and the €9.97/mo
            Dashboard are no longer your first purchase; you&rsquo;re a
            returning customer at progressively larger numbers, which is the
            only path that scales. The €1 is credited toward the First Look
            Pass if you upgrade within 7 days, so you&rsquo;re effectively
            starting the subscription clock at €0.
          </p>
        </aside>

        <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-100">
            What lands in your inbox
          </h2>
          <ul className="space-y-3">
            {STACK.map((item) => (
              <li key={item.label} className="flex items-start gap-3">
                <span className="text-rose-300 font-bold shrink-0 mt-0.5">
                  →
                </span>
                <div>
                  <p className="text-gray-100 font-semibold text-sm">
                    {item.label}
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-l-2 border-rose-700/60 pl-4 mt-4 space-y-1">
            <p className="text-rose-300 text-[10px] font-semibold uppercase tracking-wider">
              Sample shape
            </p>
            <p className="text-gray-200 text-sm leading-relaxed font-mono">
              [Acme AI] · Shipping Sprint · 14-day commit velocity +312%
              vs prior period (two-period confirmed). Three new infra
              repos in 9 days; first PRs from a former Anthropic eng.
              Read: pre-fundraise hardening, expect press 4-6 weeks out.
            </p>
            <p className="text-gray-400 text-xs italic">
              Real format. Real numbers when you name a real org.
            </p>
          </div>
        </section>

        {/* COMMIT — email capture matches the firstlook flow on apex.
            Stripe link is wired on the apex JS; this page is the SEO
            landing surface and the on-page CTA target. */}
        <section className="bg-gradient-to-br from-rose-950/30 via-slate-900 to-slate-950 border border-rose-700/40 rounded-xl p-6 sm:p-8 text-center space-y-4">
          <p className="text-rose-300 text-xs font-semibold uppercase tracking-wider">
            One-time payment · No subscription · No upsell wall
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-rose-200">€1</h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-xl mx-auto">
            Stripe checkout. The startup name goes in the order field.
            Delivery to your inbox within 24h on weekdays. €1 credited
            toward the €7 First Look Pass if you upgrade within 7 days.
          </p>
          <a
            href={TEARDOWN_CHECKOUT}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-base shadow-lg shadow-rose-500/30 transition-all"
          >
            Buy the Teardown — €1 <span aria-hidden="true">→</span>
          </a>
          <p className="text-gray-400 text-xs">
            Already know you want the full sector deep dive?{" "}
            <Link
              href="/firstlook"
              className="text-amber-300 hover:text-amber-200 underline decoration-dotted"
            >
              Skip to the €7 First Look Pass →
            </Link>
          </p>
        </section>

        {/* UPSELL PREVIEW — what the buyer sees in the delivery email.
            Brunson DotCom Ch 12: never surprise the buyer with the upsell. */}
        <aside
          className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 sm:p-6 space-y-2"
          aria-label="Post-purchase upsell preview"
        >
          <p className="text-amber-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            What happens after delivery
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Inside the delivery email there&rsquo;s a one-time invitation to
            roll the €1 into the €7{" "}
            <Link
              href="/firstlook"
              className="text-amber-300 hover:text-amber-200 underline decoration-dotted"
            >
              First Look Pass
            </Link>{" "}
            for <strong className="text-gray-100">€6 instead of €7</strong>{" "}
            &mdash; the €1 credit applies for 7 days, then expires. Decline
            it and the Teardown is yours; nothing else fires.
          </p>
        </aside>

        {/* DOWNSELL — never let a visitor leave at zero commitment if
            there's a free rung below. Same Brunson rule the firstlook
            page applies to its €7 step. */}
        <aside
          className="border-l-2 border-slate-700 pl-4 py-1 space-y-1"
          aria-label="Downsell to free list"
        >
          <p className="text-gray-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            Not ready for €1?
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
            sends 5 startups every Monday &mdash; sector-tagged, with the
            same engine behind the Teardown. No card. Subscribe, watch the
            rhythm for two weeks, then decide whether €1 buys you something
            you can&rsquo;t already see.
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

        <p className="text-gray-400 text-sm border-t border-slate-800 pt-5">
          Want the full pricing ladder?{" "}
          <Link
            href="/pricing"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            See all seven tiers
          </Link>
          .
        </p>
      </div>
    </>
  );
}
