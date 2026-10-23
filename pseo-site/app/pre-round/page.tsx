import type { Metadata } from "next";
import Link from "next/link";
import { withEditorialOverride } from "@/lib/metadata";
import { PRE_ROUND_CHECKOUT, PRE_ROUND_PRICE_EUR } from "@/lib/pre-round";

export const dynamic = "force-static";

// Money page, not an SEO page: the §5.7 net-new URL budget is zero until
// ~2026-11-10, so this stays noindex and out of the sitemap. Traffic arrives
// from /pricing, the /vs comparison CTA, and the Sunday digest.
export const metadata: Metadata = withEditorialOverride({
  title: { absolute: "Pre-Round Report, €49: 25 Startups Before Their Raise" },
  description:
    "One-off €49 report: the 25 venture-backed startups with the strongest pre-round engineering signal right now, with evidence, links and CSV. 48h delivery.",
  alternates: { canonical: "/pre-round" },
  robots: { index: false, follow: true },
});

const INCLUDED = [
  {
    label: "25 startups, ranked",
    detail:
      "The 25 teams with the strongest pre-round engineering pattern this month, across all 15 sectors or filtered to the one you pick at checkout.",
  },
  {
    label: "The evidence for each name",
    detail:
      "Signal type, 14-day commit-velocity change, contributor growth, last public round and stage, so you can see why it made the list, not just that it did.",
  },
  {
    label: "Where to reach them",
    detail:
      "GitHub org, website and public founder profiles where they exist. Ready for a first-touch email the same day.",
  },
  {
    label: "PDF + CSV",
    detail:
      "A short readable PDF for you and a CSV you can drop straight into Affinity, a sheet, or your CRM.",
  },
] as const;

export default function PreRoundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <header className="space-y-4">
        <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
          One-off report · €{PRE_ROUND_PRICE_EUR} · delivered within 48 hours
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-[1.1] tracking-tight">
          The 25 startups speeding up before their next round
        </h1>
        <p className="text-gray-300 text-base leading-relaxed">
          The free Sunday digest gives you five names. The Pre-Round Report gives
          you the full shortlist for this month, with the evidence behind each
          one, so you can reach out before the deck starts circulating. One
          payment, no subscription.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href={PRE_ROUND_CHECKOUT}
            className="inline-flex items-center justify-center rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-5 py-3 text-sm"
          >
            Get the Pre-Round Report, €{PRE_ROUND_PRICE_EUR} →
          </a>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-lg border border-slate-700 text-gray-200 hover:border-sky-600 px-5 py-3 text-sm"
          >
            Compare all plans
          </Link>
        </div>
      </header>

      <section aria-label="What is included" className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-100">What you get</h2>
        <ul className="space-y-3">
          {INCLUDED.map((item) => (
            <li key={item.label} className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-gray-100 font-medium text-sm">{item.label}</p>
              <p className="text-gray-400 text-sm leading-relaxed mt-1">{item.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Honest limits" className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-2">
        <h2 className="text-amber-200 font-semibold text-base">What it is not</h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          These are engineering signals from public GitHub data, not a promise
          that a company will raise. Our prediction ledger publishes the misses
          too, see <Link href="/predicted" className="underline underline-offset-2">the public ledger</Link>.
          If the report is not useful to you, reply within 30 days and we refund it.
        </p>
      </section>

      <section aria-label="Upgrade path" className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">If you want it every week</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          The €{PRE_ROUND_PRICE_EUR} is credited in full toward the{" "}
          <Link href="/pricing" className="underline underline-offset-2">€49/mo Dashboard</Link>{" "}
          if you upgrade within 14 days, so your first month costs nothing extra.
        </p>
      </section>
    </div>
  );
}
