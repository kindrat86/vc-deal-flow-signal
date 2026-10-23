import type { Metadata } from "next";
import Link from "next/link";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-static";

export const metadata: Metadata = withEditorialOverride({
  title: { absolute: "Pre-Round Report confirmed, delivery within 48 hours" },
  description:
    "Payment confirmed for the Pre-Round Report. Your 25-startup shortlist, PDF plus CSV, arrives by email within 48 hours.",
  alternates: { canonical: "/thanks/pre-round" },
  robots: { index: false, follow: false },
});

export default function ThanksPreRound() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <header className="space-y-3">
        <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
          Payment confirmed · Pre-Round Report
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-[1.1] tracking-tight">
          €49 received. Your report lands within 48 hours.
        </h1>
        <p className="text-gray-300 text-base leading-relaxed">
          The Stripe receipt is in your inbox. We send the PDF and CSV to the
          email you paid with. If you picked a sector at checkout, the list is
          filtered to it; if not, you get the cross-sector top 25.
        </p>
      </header>
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
        <p className="text-gray-100 font-medium text-sm">Want a different sector or a specific thesis?</p>
        <p className="text-gray-400 text-sm leading-relaxed">
          Reply to the receipt or write to{" "}
          <a href="mailto:signals@gitdealflow.com" className="underline underline-offset-2">signals@gitdealflow.com</a>{" "}
          before delivery and we will cut the list your way.
        </p>
      </section>
      <p className="text-gray-400 text-sm">
        While you wait: <Link href="/predicted" className="underline underline-offset-2">see the public prediction ledger</Link>{" "}
        or <Link href="/pricing" className="underline underline-offset-2">how the €49 credit toward the Dashboard works</Link>.
      </p>
    </div>
  );
}
