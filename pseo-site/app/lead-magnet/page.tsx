import type { Metadata } from "next";
import LeadMagnetForm from "./LeadMagnetForm";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Velocity Verdict: a one-page GitHub signal check for investors",
  description: "Get the one-page Velocity Verdict. Three public GitHub signals, false positives to remove, and one diligence question before you contact a founder.",
  alternates: { canonical: "/lead-magnet" },
};

export default function LeadMagnetPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Free investor cheat sheet</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">The Velocity Verdict</h1>
        <p className="mt-5 text-lg leading-relaxed text-gray-300">A one-page check for deciding whether a startup&rsquo;s public GitHub activity is a real buildout, a migration, or noise.</p>
        <ul className="mt-8 space-y-4 text-gray-200">
          <li><strong className="text-sky-300">Three signals to check together:</strong> commit velocity, contributor growth, and repository expansion.</li>
          <li><strong className="text-sky-300">False positives to remove:</strong> migrations, hackathons, release bursts, and busy open-source communities.</li>
          <li><strong className="text-sky-300">One diligence question:</strong> the fastest way to turn a public signal into a useful founder conversation.</li>
        </ul>
        <section className="mt-10 space-y-5 text-gray-300 leading-relaxed">
          <h2 className="text-2xl font-semibold text-gray-100">What the check is for</h2>
          <p>
            Public engineering activity can make a research process more concrete. A change in commits, contributors, or repositories may reflect a product release, a migration, a growing open-source community, or a team doing ordinary maintenance. The useful question is not whether a metric moved in isolation. It is whether several changes point to a story that can be checked with public context.
          </p>
          <p>
            Start with the company&rsquo;s repository history. Compare the latest 14-day window with its own recent baseline, then inspect who contributed and what kind of work appeared. New authentication, observability, billing, deployment, or documentation work can be worth understanding. A burst of generated files or a popular dependency update usually needs a different explanation.
          </p>
          <h2 className="text-2xl font-semibold text-gray-100">How to use the result</h2>
          <p>
            Use the sheet to form a short research list, not a score or a prediction. Read the repository, check the company&rsquo;s public product material, and verify relevant facts through independent sources. A pattern can help decide where to spend diligence time. It cannot establish that a financing event, commercial milestone, or outcome will happen.
          </p>
          <p>
            The research release behind GitDealFlow is descriptive: 219 startup-period observations of public engineering activity, with no linked funding-event labels. That limitation matters. The sheet is designed to make the limits visible before you act on a public signal.
          </p>
          <p>
            Keep a note of the evidence that changed your view and the sources you used to confirm it. That simple record makes later decisions easier to review and reduces the chance that a noisy public spike becomes an unsupported conclusion.
          </p>
        </section>
        <div className="mt-9"><LeadMagnetForm /></div>
        <p className="mt-8 text-sm leading-relaxed text-gray-400">GitDealFlow tracks public engineering activity across 350+ startups in 15 sectors. This is a diligence aid, not a funding prediction or a buy list.</p>
      </div>
    </main>
  );
}
