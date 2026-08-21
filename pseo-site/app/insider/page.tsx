import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-static";

export const metadata: Metadata = withEditorialOverride({
  title: "Insider Circle Status",
  description:
    "Insider Circle is not open for enrollment. GitDealFlow will publish a real delivery calendar and a redacted delivered artifact before it offers a higher-touch subscription.",
  alternates: { canonical: "/insider" },
  openGraph: {
    title: "Insider Circle Status",
    description:
      "Not open for enrollment. Start with public research or the current Dashboard instead.",
    url: "https://signals.gitdealflow.com/insider",
    type: "website",
  },
});

export default function InsiderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/insider#webpage",
        name: "Insider Circle Status",
        url: "https://signals.gitdealflow.com/insider",
        description:
          "GitDealFlow Insider Circle is not open for enrollment. No price, capacity, delivery timing, or member outcome is claimed until it can be evidenced publicly.",
        author: DATA_NERD_AUTHOR_REF,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Insider Circle", item: "https://signals.gitdealflow.com/insider" },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <HreflangLinks languages={getHreflangLanguages("/insider")} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AgentMirrorLinks path="/insider" />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <nav className="text-sm text-slate-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-sky-300">Home</Link>
          <span className="mx-2">/</span>
          <span>Insider Circle</span>
        </nav>

        <header className="space-y-4">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-widest">Offer status</p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">Insider enrollment is not open.</h1>
          <p className="text-lg leading-relaxed text-slate-300">
            A higher-touch research offer needs proof of its real delivery, not a persuasive stack. We are not taking payment for Insider while its calendar, artefacts, response process, and member experience are unproven on this site.
          </p>
        </header>

        <section className="rounded-2xl border border-amber-600/40 bg-amber-950/20 p-6 space-y-3">
          <h2 className="text-xl font-semibold">What must exist before enrollment opens</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-300 leading-relaxed">
            <li>A public delivery calendar with dated, realistic deliverables.</li>
            <li>A redacted delivered briefing or artefact that shows what members actually receive.</li>
            <li>A documented support and refund process backed by current operations.</li>
            <li>One verified price and a working Checkout probe, published only after the delivery proof is live.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Use the proof that exists today</h2>
          <p className="text-slate-300 leading-relaxed">
            GitDealFlow is a public-data diligence signal. It helps you decide what to investigate, it does not forecast financing or replace investment diligence.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/research" className="rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400">
              Read the research panel
            </Link>
            <Link href="/mechanism" className="rounded-lg border border-slate-700 px-5 py-3 font-semibold hover:border-slate-500">
              Inspect the method
            </Link>
            <Link href="/dashboard" className="rounded-lg border border-slate-700 px-5 py-3 font-semibold hover:border-slate-500">
              See the current Dashboard
            </Link>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Why this standard matters</h2>
          <p className="text-slate-300 leading-relaxed">
            A higher-touch subscription asks for more than access to a page. It asks buyers to trust a recurring operating promise: what arrives, when it arrives, what happens when a question needs an answer, and what recourse exists when delivery falls short. Those are operational facts. They should be visible before checkout, not imagined from a headline or inferred from a price.
          </p>
          <p className="text-slate-300 leading-relaxed">
            This page therefore does not use a waitlist count, an urgency deadline, a member-cap claim, an earnings comparison, or a projected outcome. None of those would help a careful investor assess the offer. The useful proof is a dated calendar, a redacted example, and terms that match the actual workflow. Until those exist, the honest decision is to keep enrollment closed.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">What to use in the meantime</h2>
          <p className="text-slate-300 leading-relaxed">
            Start with the public method if you need to understand the research. Use the Dashboard only when the currently available surface fits your weekly diligence process. If you are evaluating one live sector question, use the smaller First Look step after reading its current terms. Each route should stand on the evidence it can show today, rather than borrowing certainty from an unfinished higher tier.
          </p>
          <p className="text-slate-300 leading-relaxed">
            The public-data workflow is deliberately modest: observe an engineering change, compare it with the organisation's baseline, inspect the surrounding evidence, and corroborate before acting. It helps narrow a research queue. It cannot tell you that a company will raise, guarantee access to a founder, or replace the work of investment diligence.
          </p>
        </section>

        <aside className="border-l-2 border-slate-700 pl-4 text-sm leading-relaxed text-slate-400">
          When Insider has evidence-backed delivery, this page will show the calendar, the artefact, the terms, and the exact next step. Until then, do not over-buy.
        </aside>
      </article>
    </main>
  );
}
