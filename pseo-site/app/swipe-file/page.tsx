/**
 * /swipe-file — Brunson DotCom Secrets Ch 9 audit fix 2026-05-09
 * (push 93 → 100): "Could add a public 'swipe file' of 3 reverse-engineered
 * competitor funnels."
 *
 * Three competitor funnels reverse-engineered with the same 7-phase frame
 * we publish on /funnels: pre-frame bridge, qualifying, value-stack, cart,
 * upsell, downsell, continuity. The funnel-hack analysis is internal to
 * the developer-investor frame — a public artefact that demonstrates we
 * read the work before we shipped our own funnel.
 *
 * Anonymity rule: we name the products (Harmonic, Affinity, Tracxn) because
 * they're public commercial entities. We do NOT name our own founder; the
 * teardowns are signed pseudonymously by The Data Nerd. The teardowns are
 * factual reads of public marketing surfaces, not insider knowledge.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";

const SITE = "https://signals.gitdealflow.com";

export const dynamic = "force-static";
export const revalidate = 86400;

export const metadata: Metadata = {
  title:
    "Funnel Swipe File — Harmonic, Affinity, Tracxn reverse-engineered phase by phase",
  description:
    "Three competitor deal-flow products read against the same 7-phase funnel frame. Bait, qualifier, value stack, cart, upsell, downsell, continuity — what they ship at each step, where the gap is, what the developer-investor variant would do differently.",
  alternates: { canonical: "/swipe-file" },
  openGraph: {
    title: "Funnel Swipe File — 3 reverse-engineered deal-flow funnels",
    description:
      "Harmonic, Affinity, Tracxn — 7-phase funnel teardown for each. Public marketing surfaces only, signed The Data Nerd.",
    url: `${SITE}/swipe-file`,
    type: "article",
  },
};

interface FunnelStage {
  phase: string;
  what: string;
  read: string;
  ourMove: string;
}

interface SwipeEntry {
  slug: string;
  product: string;
  positioning: string;
  audience: string;
  stages: FunnelStage[];
  oneLineVerdict: string;
  whatWeBorrowed: string;
  whatWeRejected: string;
}

const SWIPES: SwipeEntry[] = [
  {
    slug: "harmonic",
    product: "Harmonic",
    positioning:
      "Enterprise pre-seed → Series A sourcing platform — founder-data + signal-aggregation, sold to VC funds at €1,000–€2,500/seat/month.",
    audience:
      "Mid-to-late-stage VC funds, family offices, late-Series-B funds doing pre-seed scouting on the side. Founder profiles are the headline UI.",
    stages: [
      {
        phase: "1 · Pre-frame bridge",
        what: "Free 'company database' surface (harmonic.ai/companies) seeded with thousands of pre-seed startups. Open access tease, no signup required to scan.",
        read: "The pre-frame is masterful — a reader can spend 20 minutes browsing without ever creating an account. By the time they hit the gate, they've self-qualified as someone who actually wants the data.",
        ourMove: "Same shape, different surface. /firstlook is the 90-second teardown that does the job in one click. /predicted is the weekly free leaderboard. Both are pre-frame surfaces a reader can consume without an account.",
      },
      {
        phase: "2 · Qualifier (lead capture)",
        what: "Email-gated company detail pages. To see contact, signal scores, or full founder bio, the reader has to register. Soft gate, no payment required.",
        read: "Email-only soft gate is the right shape for a high-LTV enterprise sale. The qualifier reads as 'are you serious enough to give us your email?' — low friction, high signal.",
        ourMove: "We use the same email-soft-gate pattern on /firstlook and /squeeze. The difference is we publish the full methodology on /methodology even before the gate — a reader can verify our claims without ever giving us an email.",
      },
      {
        phase: "3 · Value stack",
        what: "Demo request → discovery call → custom pricing quote. The 'value stack' is built up by the salesperson on the discovery call, not on a public page.",
        read: "Classic enterprise SaaS — the value stack is bespoke per customer. Works at €18k–€30k ACVs. Friction is high; the discovery-call qualifier is the entire funnel.",
        ourMove: "We rejected this. Our value stack is on /pricing publicly. €0 → €0.99 (book) → €77/mo (Insider) → €1,997 (Sector Sweep) → €13k retainer. No discovery call, no custom quote. Friction is dollars below the average enterprise demo.",
      },
      {
        phase: "4 · Cart / SLO",
        what: "Annual contracts only. €18k–€30k seat-year. No self-serve checkout. Sales-assisted close.",
        read: "Sales-assisted close is the right shape for €18k+ ACVs but it gates the bottom 80 percent of the audience — the developer-investor writing €25k angel checks would never pay €18k for sourcing data even if they wanted to.",
        ourMove: "We rejected this. Our cart is Stripe Checkout for every tier. €0.99, €77/mo, €1,997 — all self-serve. The €13k retainer tier requires a brief, but the brief is async-only and the buy link is in the reply email.",
      },
      {
        phase: "5 · Upsell / OTO",
        what: "Annual seat upgrades, additional users, custom-data packages. All sales-mediated.",
        read: "Upsells happen on QBRs and renewals, not at checkout. The customer-success motion drives ACV expansion via account growth.",
        ourMove: "We use one-click OTO upsells on /firstlook → Sector Sweep €1,797 + Insider €77/mo, and on /book → BOOK_DRIP follow-up. Stripe `setup_future_usage='off_session'` charges the saved card without a second checkout. Conversion lift is significantly higher at lower ticket sizes.",
      },
      {
        phase: "6 · Downsell",
        what: "No public downsell. If the prospect declines the seat-year, sales loses them.",
        read: "Enterprise SaaS rarely runs a downsell because the discovery-call qualifier already filtered out non-enterprise buyers. The downside is they leave money from the long-tail audience on the table.",
        ourMove: "We ship explicit downsells. /firstlook/downsell offers the €0.99 book to a prospect who declined the €7 First Look Pass. /firstlook/last-chance triggers if the user added to cart and abandoned. We don't lose the long-tail.",
      },
      {
        phase: "7 · Continuity",
        what: "Annual renewal cycle. Customer-success motion. Some content marketing (newsletter, sector reports), gated as marketing collateral.",
        read: "Continuity is built around the annual renewal. The product hopes the buyer integrates Harmonic deeply enough into the team workflow that switching costs make renewal automatic.",
        ourMove: "Our continuity is /continuity Monthly Insider Drop — €77/mo subscription with a fresh artefact every month. The renewal isn't a calendar event; it's a content artefact the buyer reads and would miss if they cancelled.",
      },
    ],
    oneLineVerdict:
      "Harmonic is the right funnel for €18k+ ACVs — and the wrong funnel for the developer-investor writing €25k angel checks.",
    whatWeBorrowed:
      "The free pre-frame database. The email-soft-gate qualifier. The principle that the product has to earn the price before the buyer pays it.",
    whatWeRejected:
      "Sales-assisted close. Custom quotes. The discovery-call qualifier. Sales-mediated upsells. Annual-only contracts. The whole top-of-funnel friction profile that makes Harmonic invisible to a solo angel investor.",
  },
  {
    slug: "affinity",
    product: "Affinity",
    positioning:
      "Relationship intelligence + deal-flow CRM, sold to mid-market and enterprise VC funds at €5k–€20k/seat/year.",
    audience:
      "VC partners + their analysts who want to manage deal flow + portfolio relationships from a single Outlook/Gmail-integrated CRM.",
    stages: [
      {
        phase: "1 · Pre-frame bridge",
        what: "Heavy content marketing — VC playbook PDFs, industry reports, sourcing-best-practices articles. All gated behind email signup.",
        read: "Content-led pre-frame — the gated PDF is the bait, the email is the qualifier. High-quality content, but every artefact is gated, which means the search-engine surface is also the signup surface.",
        ourMove: "We gate almost nothing. /book is €0.99 free+shipping (a tripwire, not a gate). /research, /methodology, /signals, /glossary, /faq, /attestations, /reproducibility are all free, indexed, and reproducible. The search-engine surface IS the trust-building surface.",
      },
      {
        phase: "2 · Qualifier (lead capture)",
        what: "Email + 'fund size' + 'role' qualifier on every PDF download. CRM-integrated lead scoring.",
        read: "The qualifier asks two friction-bearing questions (fund size, role) that filter out non-enterprise audiences. Smart for the target ACV; brutal for the long-tail.",
        ourMove: "Email-only qualifier on /firstlook and /squeeze. We don't ask fund size; we don't ask role. The audience self-qualifies via the price ladder — €7 First Look is a different buyer than €1,997 Sector Sweep.",
      },
      {
        phase: "3 · Value stack",
        what: "Live demo + SE-led ROI calculator + custom proposal. Headline metrics: 'replaces 4 tools', 'saves 12 hours per analyst per week'.",
        read: "ROI-calculator-led value stack is the dominant enterprise-SaaS playbook. Works when the buyer can compute the payback period in their head; works less well when the buyer is the sole decision-maker without a budget cycle.",
        ourMove: "We use a public stack slide on /pricing and /sector-sweep — every artefact has a retail value, the ladder collapses to the founding-rate price. The reader does the ROI math from public numbers, not from a salesperson's spreadsheet.",
      },
      {
        phase: "4 · Cart / SLO",
        what: "Annual contracts. Multi-seat deployments. €5k–€20k per seat per year. 6–12 week sales cycle.",
        read: "Multi-seat deployments are the right shape for a fund with 10+ partners, terrible fit for a solo angel. The 6–12 week sales cycle assumes a procurement department.",
        ourMove: "We rejected this. Our checkout is Stripe Checkout, single-seat, no procurement. The /enterprise tier exists for funds that want a multi-seat, but the default audience is the single-seat solo investor.",
      },
      {
        phase: "5 · Upsell / OTO",
        what: "Add-on modules: 'Affinity Capital', 'Affinity Industry', 'Custom Data Sources'. Sold via the customer-success motion.",
        read: "Add-on modules are the dominant ACV-expansion play. Works when the customer-success team is well-staffed and the customer is large enough to consume add-ons.",
        ourMove: "We use named OTOs at checkout time, not via a CSM. Sector Sweep €1,797 OTO on /firstlook checkout. Insider €77/mo OTO on Sector Sweep checkout. The OTO is a one-click decision the buyer makes inside 90 seconds, not a quarterly QBR.",
      },
      {
        phase: "6 · Downsell",
        what: "No public downsell. If the prospect declines, they're nurtured back through the email list.",
        read: "Email-list nurture as a downsell is fine but slow. The buyer who said no today often doesn't open the next eight emails.",
        ourMove: "Explicit downsells: /firstlook/last-chance, /firstlook/downsell, BOOK_DRIP buyer follow-up. The downsell happens at the moment of decline, not 60 days later in an email.",
      },
      {
        phase: "7 · Continuity",
        what: "Annual renewal + add-on expansion. Customer-success motion. Heavy content/community/event investment.",
        read: "The continuity is the renewal. Affinity has a strong community/event play (Affinity Reach Summit) that doubles as both retention and acquisition.",
        ourMove: "Our /summit is the same shape — anonymous-by-design, but the same dual-purpose retention/acquisition mechanic. The /continuity Monthly Insider Drop is the renewal anchor; the /summit is the seasonal acquisition pulse.",
      },
    ],
    oneLineVerdict:
      "Affinity is the right CRM for a fund with 10+ partners and a procurement department — and structurally invisible to the solo angel investor.",
    whatWeBorrowed:
      "The dual-purpose summit-as-retention-and-acquisition. Quality content gated only when the gate adds buyer-value (we go further: we don't gate even then).",
    whatWeRejected:
      "Multi-seat-only deployments. The procurement-cycle sales motion. CSM-mediated add-on upsells. The fund-size qualifier on every PDF.",
  },
  {
    slug: "tracxn",
    product: "Tracxn",
    positioning:
      "Sector-coverage research database, sold to VCs, corporate strategy teams, and investment banks at €5k–€15k/seat/year.",
    audience:
      "Analysts at multi-stage funds and IBs who need broad sector coverage with thematic dashboards. Heavier on emerging markets than the US-centric tools.",
    stages: [
      {
        phase: "1 · Pre-frame bridge",
        what: "Free 'sector reports' surface (tracxn.com/explore). Hundreds of public reports. Each report is partially-gated — first three pages free, full report behind email + demo request.",
        read: "Partial-gating is a clever middle ground. The reader gets enough to verify the analysis is real; the gate kicks in exactly when the reader is most invested.",
        ourMove: "We don't partial-gate. /research, /methodology, /book/read all publish in full. We trust that the buyer who reads the entire artefact is more likely to convert than the buyer who hit a paywall mid-paragraph.",
      },
      {
        phase: "2 · Qualifier (lead capture)",
        what: "Email + company + role + fund size + use case. Long form. CRM-integrated.",
        read: "Heavy qualifier — five fields. Filters aggressively for high-ACV buyers. Cost is signup-rate; benefit is sales-team productivity.",
        ourMove: "Email-only on /firstlook. We don't ask company; we don't ask role; we don't ask fund size. The price ladder is the qualifier — anyone who buys the €1,997 Sweep self-qualified by the choice.",
      },
      {
        phase: "3 · Value stack",
        what: "Live demo + sector-specific data sample. Headline pitch: 'broadest sector coverage', '1,500+ sectors tracked'.",
        read: "Coverage-led value stack — 'we have more sectors than anyone'. Works for the breadth-buyer (analyst at a multi-stage fund); works less well for the depth-buyer (sector specialist).",
        ourMove: "We're the depth-buyer's tool. We pick a small set of sectors, go deep, publish the methodology. The Sector Sweep is a 40-page deep-dive on one sector, not a 1-page summary on 1,500 sectors.",
      },
      {
        phase: "4 · Cart / SLO",
        what: "Annual seat-year. €5k–€15k. Sales-assisted. Custom multi-seat pricing for funds.",
        read: "Standard enterprise-SaaS shape. The interesting wrinkle is regional pricing — Tracxn discounts heavily for Indian and Southeast-Asian funds, which positions it well for emerging-market dominance.",
        ourMove: "We charge in EUR, single price worldwide, no regional discounting. The €1,997 Sector Sweep is the same in Bangalore as it is in Berlin. We rejected regional pricing on principle — the value of the artefact doesn't change with the buyer's currency.",
      },
      {
        phase: "5 · Upsell / OTO",
        what: "Premium 'Tracxn Pro' tier with deeper sector tooling. Add-on data exports. Sold via CSM.",
        read: "Tier-based upsells with the premium tier reserved for the heaviest users. Standard SaaS expansion play.",
        ourMove: "We use price-anchor OTOs at the cart, not tier-based upsells via CSM. /firstlook (€7) → Sector Sweep (€1,797) is a 257× anchor jump that converts in the moment of highest commitment.",
      },
      {
        phase: "6 · Downsell",
        what: "No clear downsell. The free sector reports themselves serve as long-term nurture.",
        read: "The partial-gated sector reports do double-duty as a top-of-funnel acquisition surface and as a passive downsell. Effective but slow.",
        ourMove: "Explicit downsells at the decline moment, plus a continuous-content surface (/predicted, /weekly, /signal-of-the-week) that serves the same long-term nurture function.",
      },
      {
        phase: "7 · Continuity",
        what: "Annual renewal. CSM-managed. Sector-report archive grows quarterly.",
        read: "The continuity asset is the report archive — buyers renew because they've integrated the report cadence into their analyst workflow. Strong workflow lock-in.",
        ourMove: "The Insider €77/mo and the Monthly Insider Drop are our continuity. Same workflow-integration play, lower price point, single-seat shape.",
      },
    ],
    oneLineVerdict:
      "Tracxn is the right tool for the breadth-buyer with an analyst pool — and the wrong tool for the depth-buyer running a focused-thesis fund.",
    whatWeBorrowed:
      "The partial-gating insight (we go further: full publishing). The cadence-based continuity model. Regional empathy (we expressed it differently — single price, not regional discounting).",
    whatWeRejected:
      "Coverage-led positioning. Tier-based upsells via CSM. The 5-field signup form. The breadth-over-depth product philosophy.",
  },
];

export default function SwipeFilePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${SITE}/swipe-file#article`,
        headline:
          "Funnel Swipe File — Harmonic, Affinity, Tracxn reverse-engineered phase by phase",
        description:
          "Three competitor deal-flow products read against the same 7-phase funnel frame. Bait, qualifier, value stack, cart, upsell, downsell, continuity.",
        author: {
          "@type": "Person",
          name: "The Data Nerd",
          jobTitle: "Founder, VC Deal Flow Signal",
        },
        publisher: { "@id": "https://gitdealflow.com/#organization" },
        datePublished: "2026-05-09",
        dateModified: "2026-05-09",
        url: `${SITE}/swipe-file`,
        about: SWIPES.map((s) => ({
          "@type": "Thing",
          name: s.product,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Swipe File",
            item: `${SITE}/swipe-file`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/swipe-file`}
        languages={getHreflangLanguages("/swipe-file")}
      />
      <AgentMirrorLinks path="/swipe-file" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <span className="mx-2">/</span>
          <span>Swipe File</span>
        </nav>

        {/* Hero */}
        <header className="space-y-4">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            Funnel teardown · Public marketing surfaces only
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Three competitor funnels, read phase by phase.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed" data-speakable>
            Harmonic, Affinity, Tracxn — the three commercial deal-flow
            products our buyers most often compare us against. Each is read
            against the same seven-phase funnel frame published on{" "}
            <Link
              href="/funnels"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              /funnels
            </Link>
            : pre-frame bridge, qualifier, value stack, cart, upsell,
            downsell, continuity. What they ship at each phase, how the
            shape reads, and what the developer-investor variant does
            differently. Public surfaces only — no insider knowledge, no
            scraped pricing, no privileged data.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            <strong className="text-gray-300">Why this exists:</strong> a
            measurement product that hasn&rsquo;t funnel-hacked the
            incumbents has no excuse. The teardowns below are the public
            record of how the developer-investor funnel diverges from the
            enterprise-VC-fund funnel — and why the divergence is
            structural, not stylistic.
          </p>
        </header>

        {/* TOC */}
        <nav
          aria-label="Funnel teardown index"
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3"
        >
          <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
            Three teardowns
          </p>
          <ol className="space-y-2 text-sm">
            {SWIPES.map((s, i) => (
              <li key={s.slug}>
                <a
                  href={`#${s.slug}`}
                  className="text-sky-300 hover:text-sky-200 underline decoration-dotted"
                >
                  {i + 1}. {s.product}
                </a>{" "}
                <span className="text-gray-400 text-xs">— {s.positioning.split(",")[0]}</span>
              </li>
            ))}
          </ol>
        </nav>

        {/* Teardowns */}
        {SWIPES.map((swipe, i) => (
          <article
            key={swipe.slug}
            id={swipe.slug}
            className="space-y-6 scroll-mt-20"
          >
            <header className="space-y-3 border-b border-slate-800 pb-4">
              <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
                Teardown {i + 1} of 3
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-tight">
                {swipe.product}
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                <strong className="text-gray-200">Positioning:</strong>{" "}
                {swipe.positioning}
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                <strong className="text-gray-200">Audience:</strong>{" "}
                {swipe.audience}
              </p>
            </header>

            <ol className="space-y-4">
              {swipe.stages.map((stage) => (
                <li
                  key={stage.phase}
                  className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 space-y-3"
                >
                  <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
                    {stage.phase}
                  </p>
                  <div className="space-y-2 text-sm leading-relaxed">
                    <p className="text-gray-200">
                      <strong className="text-gray-100">What they ship:</strong>{" "}
                      <span className="text-gray-300">{stage.what}</span>
                    </p>
                    <p className="text-gray-200">
                      <strong className="text-gray-100">How it reads:</strong>{" "}
                      <span className="text-gray-300">{stage.read}</span>
                    </p>
                    <p className="text-gray-200">
                      <strong className="text-emerald-300">Our move:</strong>{" "}
                      <span className="text-gray-300">{stage.ourMove}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <aside className="rounded-xl border border-emerald-700/40 bg-emerald-950/15 p-5 space-y-3">
              <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                One-line verdict
              </p>
              <p className="text-gray-100 font-semibold leading-snug">
                {swipe.oneLineVerdict}
              </p>
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <div className="rounded-lg border border-emerald-700/30 bg-emerald-950/20 p-3">
                  <p className="text-emerald-300 text-[11px] font-semibold uppercase tracking-wider mb-1.5">
                    What we borrowed
                  </p>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    {swipe.whatWeBorrowed}
                  </p>
                </div>
                <div className="rounded-lg border border-rose-700/30 bg-rose-950/15 p-3">
                  <p className="text-rose-300 text-[11px] font-semibold uppercase tracking-wider mb-1.5">
                    What we rejected
                  </p>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    {swipe.whatWeRejected}
                  </p>
                </div>
              </div>
            </aside>
          </article>
        ))}

        {/* Closing CTA */}
        <section className="rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">
            See our funnel from the same angle.
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            The same 7-phase frame, applied to our own funnel, lives at{" "}
            <Link
              href="/funnels"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              /funnels
            </Link>
            . The competitor teardowns above exist to make the difference
            visible: the developer-investor funnel is a different machine
            than the enterprise-VC funnel, and the divergence is
            structural.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/funnels"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-5 py-2.5 text-sm transition-colors"
            >
              Read our 7-phase funnel →
            </Link>
            <Link
              href="/firstlook"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 hover:border-slate-600 text-gray-200 font-semibold px-5 py-2.5 text-sm transition-colors"
            >
              Or test it for €7 — First Look Pass
            </Link>
          </div>
        </section>

        <DataNerdSignoff variant="long" catchphraseIndex={2} />

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Teardowns based on public marketing surfaces (each product&rsquo;s
          homepage, pricing page, signup flow, sample reports) as of May
          2026. No insider knowledge, no scraped data, no privileged
          information. If a vendor disputes a factual claim above, reply{" "}
          <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 text-xs">
            CORRECT
          </code>{" "}
          to{" "}
          <a
            href="mailto:signal@gitdealflow.com"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            signal@gitdealflow.com
          </a>{" "}
          and we&rsquo;ll update inside two business days.
        </p>
      </div>
    </>
  );
}
