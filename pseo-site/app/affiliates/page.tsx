import type { Metadata } from "next";
import Link from "next/link";
import { withEditorialOverride } from "@/lib/metadata";

export const metadata: Metadata = withEditorialOverride({
  title: "Affiliate Program Status",
  description:
    "GitDealFlow is not accepting affiliate enrollment. The program will publish verified terms, payout operations, and measured performance only after they exist.",
  alternates: { canonical: "/affiliates" },
  openGraph: {
    title: "Affiliate Program Status",
    description: "Affiliate enrollment is not open. No partner earnings or conversion claims are published without evidence.",
    url: "https://signals.gitdealflow.com/affiliates",
  },
});

export default function AffiliatesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "GitDealFlow Affiliate Program Status",
    url: "https://signals.gitdealflow.com/affiliates",
    description: "Affiliate enrollment is not open. GitDealFlow does not publish unverified partner earnings, conversion, or payout claims.",
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <nav className="text-sm text-slate-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-sky-300">Home</Link>
          <span className="mx-2">/</span>
          <span>Affiliates</span>
        </nav>

        <header className="space-y-4">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-widest">Program status</p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">Affiliate enrollment is not open.</h1>
          <p className="text-lg leading-relaxed text-slate-300">
            We will not publish earnings examples, conversion rates, payout claims, or partner rankings without a working programme and evidence that those figures are real.
          </p>
        </header>

        <section className="rounded-2xl border border-amber-600/40 bg-amber-950/20 p-6 space-y-3">
          <h2 className="text-xl font-semibold">What must be public before a programme opens</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-300 leading-relaxed">
            <li>Verified programme terms, attribution rules, and payout process.</li>
            <li>A real partner dashboard and a tested payout path.</li>
            <li>Measured partner metrics, only once there is enough data to publish them honestly.</li>
            <li>Clear community-first promotion rules that prohibit spam and misleading claims.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Why the programme stays closed</h2>
          <p className="text-slate-300 leading-relaxed">
            An affiliate programme is not a landing-page widget. It creates obligations to partners and to the people they refer: attribution needs to work, terms need to match the product, payouts need to be tested, and promotion rules need to protect communities from spam. Publishing an attractive commission or a leader board before those operations are live would create a claim that cannot yet be checked.
          </p>
          <p className="text-slate-300 leading-relaxed">
            We also will not use invented partner success to manufacture social proof. A future programme can publish real information once it has a working dashboard, documented terms, and enough measured activity to report without cherry-picking. Until then, no payout, conversion, cookie, partner-count, or earnings number belongs on this page.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">How a responsible programme would work</h2>
          <p className="text-slate-300 leading-relaxed">
            Before enrollment opens, GitDealFlow will publish a single public terms page, a clear explanation of how links are attributed, and a tested support path for disputes. It will also prohibit scraped outreach, bulk messages, fake endorsements, undisclosed paid relationships, and promotion where a community's rules do not allow it. Community trust matters more than adding another acquisition channel.
          </p>
          <p className="text-slate-300 leading-relaxed">
            The same truth rule applies to the product itself. Partners should point readers to the methodology, the research panel, and the smallest appropriate proof step. They should not promise funding outcomes, privileged access, or performance that GitDealFlow cannot evidence. This lets a future partner relationship improve distribution without turning evidence-led research into hype.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Evaluate the public work directly</h2>
          <p className="text-slate-300 leading-relaxed">
            You do not need an affiliate relationship to assess GitDealFlow. Review the dataset and methodology, compare the public signals with the surrounding context, and decide whether the workflow is useful for your own research process. The product is a diligence input, not a financing forecast and not a substitute for independent judgment.
          </p>
        </section>

        <section className="space-y-3">
          <p className="text-slate-300 leading-relaxed">
            If you want to evaluate GitDealFlow, start with the method and the public research. Those are available now and do not require an affiliate relationship.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/research" className="rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400">Read the research panel</Link>
            <Link href="/mechanism" className="rounded-lg border border-slate-700 px-5 py-3 font-semibold hover:border-slate-500">Inspect the method</Link>
            <Link href="/buyers-guide" className="rounded-lg border border-slate-700 px-5 py-3 font-semibold hover:border-slate-500">Read the buyer&apos;s guide</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
