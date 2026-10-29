import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-static";

const STRIPE_INSIDER = "https://buy.stripe.com/bJeaEWfRpcRG6gm2fC0x20d";

export const metadata: Metadata = withEditorialOverride({
  title: "Insider Circle, €197/mo",
  description:
    "Insider Circle is €197 per month: everything in the Dashboard plus JSON API and bulk CSV pulls, webhooks, custom watchlists and a private group with a direct line for diligence questions. 30-day Signal-or-It's-Free guarantee.",
  alternates: { canonical: "/insider" },
  openGraph: {
    title: "Insider Circle, €197/mo",
    description:
      "Dashboard plus API, webhooks and custom watchlists, €197/mo, cancel any time, 30-day guarantee.",
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
        name: "Insider Circle",
        url: "https://signals.gitdealflow.com/insider",
        description:
          "GitDealFlow Insider Circle, €197 per month: Dashboard plus JSON API, bulk CSV, webhooks, custom watchlists and a private group for diligence questions.",
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
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-widest">Step 4 · Insider Circle</p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">Insider Circle, €197 per month.</h1>
          <p className="text-lg leading-relaxed text-slate-300">
            For investors whose sourcing runs through a pipeline, a CRM or a syndicate. You get everything in the Dashboard, plus the data in a form your own tools can use.
          </p>
        </header>

        <section className="rounded-2xl border border-sky-600/40 bg-sky-950/20 p-6 space-y-4">
          <h2 className="text-xl font-semibold">What you get</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-300 leading-relaxed">
            <li>Everything in Dashboard: the full ranked field across 15 sectors, refreshed weekly, with filters, history and watchlists.</li>
            <li>JSON API and bulk CSV pulls.</li>
            <li>Webhook delivery on threshold triggers, into Slack, Discord or your own tools.</li>
            <li>Custom watchlists built around your thesis.</li>
            <li>Private Insider group with briefings and a direct line for diligence questions.</li>
          </ul>
          <p className="text-slate-300 leading-relaxed">
            €197 per month, billed monthly through Stripe. Cancel any time from the Stripe receipt or by emailing signals@gitdealflow.com. The 30-day Signal-or-It&apos;s-Free guarantee applies: if the signal does not surface a startup you find genuinely interesting, reply REFUND within 30 days and you get the full payment back.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={STRIPE_INSIDER} className="rounded-lg bg-sky-500 px-5 py-3 font-semibold text-slate-950 hover:bg-sky-400">
              Join Insider Circle, €197/mo →
            </a>
            <Link href="/pricing" className="rounded-lg border border-slate-700 px-5 py-3 font-semibold hover:border-slate-500">
              Compare all four steps
            </Link>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">What it is, and what it is not</h2>
          <p className="text-slate-300 leading-relaxed">
            GitDealFlow is a public-data diligence signal. It helps you decide what to investigate, it does not forecast financing or replace investment diligence.
          </p>
          <p className="text-slate-300 leading-relaxed">
            The public-data workflow is deliberately modest: observe an engineering change, compare it with the organisation&apos;s baseline, inspect the surrounding evidence, and corroborate before acting. It helps narrow a research queue. It cannot tell you that a company will raise, guarantee access to a founder, or replace the work of investment diligence.
          </p>
          <p className="text-slate-300 leading-relaxed">
            This page does not use a member count, an urgency deadline, a member-cap claim, an earnings comparison, or a projected outcome. None of those would help a careful investor assess the offer. The public prediction ledger, misses included, is at <Link href="/predicted" className="text-sky-400 hover:text-sky-300 underline">/predicted</Link>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Where Insider sits in the four steps</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-300 leading-relaxed">
            <li>Step 1, free: the Signal Digest, five startups every Sunday, each with a plain-English reason.</li>
            <li>Step 2, €49 once: the Pre-Round Report, 25 ranked startups with evidence, PDF and CSV within 48 hours.</li>
            <li>Step 3, €49 per month: the Dashboard, the full ranked field across 15 sectors, refreshed every week.</li>
            <li>Step 4, €197 per month: Insider Circle, the Dashboard plus API access, webhooks and custom watchlists, for teams that move the signal into their own systems instead of reading it on a page.</li>
          </ul>
          <p className="text-slate-300 leading-relaxed">
            Every paid step carries the same 30-day Signal-or-It&apos;s-Free guarantee, so you can test whether the data fits your process before you commit to it.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Not sure Insider is the right step?</h2>
          <p className="text-slate-300 leading-relaxed">
            If you read the signal yourself each week and do not need the API or webhooks, the €49/mo Dashboard covers the same ranked field. Start with the public method if you need to understand the research first.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-lg border border-slate-700 px-5 py-3 font-semibold hover:border-slate-500">
              See the Dashboard
            </Link>
            <Link href="/research" className="rounded-lg border border-slate-700 px-5 py-3 font-semibold hover:border-slate-500">
              Read the research panel
            </Link>
            <Link href="/mechanism" className="rounded-lg border border-slate-700 px-5 py-3 font-semibold hover:border-slate-500">
              Inspect the method
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
