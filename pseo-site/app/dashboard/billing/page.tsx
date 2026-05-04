import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { generateApiKey } from "@/lib/api-key";
import { getCustomerBalanceCents } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Billing — VC Deal Flow Signal",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

const PAYG_MIN_TOPUP_EUR = 19;
const PAYG_PRICE_PER_CALL_EUR = 0.10;
const INSIDER_MONTHLY_EUR = 29;

export default async function BillingPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const tier = session.tier;
  const apiKey = generateApiKey(session.customerId);
  const maskedKey = apiKey.slice(0, 8) + "•".repeat(20) + apiKey.slice(-4);

  let balanceCents = 0;
  let balanceError = false;
  try {
    balanceCents = await getCustomerBalanceCents(session.customerId);
  } catch (err) {
    console.error("Billing page balance fetch failed:", err);
    balanceError = true;
  }
  const balanceEur = (balanceCents / 100).toFixed(2);

  const tierLabel: Record<string, string> = {
    dashboard: "Free",
    payg: "Pay-as-you-go",
    insider: "Insider Circle",
  };
  const tierColor: Record<string, string> = {
    dashboard: "bg-slate-700/40 text-gray-300 border-slate-600",
    payg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    insider: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/dashboard" className="hover:text-gray-300 transition-colors">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">Billing</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-100 mb-2">Billing</h1>
      <p className="text-gray-400 mb-8">
        Manage your plan, top up pay-as-you-go credit, and view your API key.
      </p>

      {/* Current plan */}
      <section className="rounded-xl border border-slate-700 bg-slate-900 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Current plan
          </h2>
          <span
            className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tierColor[tier] ?? tierColor.dashboard}`}
          >
            {tierLabel[tier] ?? "Free"}
          </span>
        </div>

        {tier === "insider" && (
          <>
            <p className="text-gray-200 text-sm mb-1">
              Insider Circle —{" "}
              <span className="font-semibold">€{INSIDER_MONTHLY_EUR}</span> / month
            </p>
            <p className="text-gray-500 text-xs mb-5">
              Unlimited agent tool calls (1,000 / day fair use). Cancel any time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/api/billing/portal"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-slate-600 hover:border-slate-500 text-gray-200 hover:text-white text-sm font-medium transition-colors"
              >
                Manage subscription
              </Link>
              <Link
                href="/dashboard/api-keys"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
              >
                View API key →
              </Link>
            </div>
          </>
        )}
        {tier === "payg" && (
          <>
            <p className="text-gray-200 text-sm mb-1">
              Pay-as-you-go — €{PAYG_PRICE_PER_CALL_EUR.toFixed(2)} per paid agent call.
            </p>
            <p className="text-gray-500 text-xs mb-5">
              Free tools always work. Upgrade to Insider Circle for unlimited paid calls + dashboard filters.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/api/billing/checkout?plan=insider"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
              >
                Upgrade to Insider — €{INSIDER_MONTHLY_EUR}/mo
              </Link>
              <Link
                href="/dashboard/api-keys"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-slate-600 hover:border-slate-500 text-gray-200 hover:text-white text-sm font-medium transition-colors"
              >
                View API key →
              </Link>
            </div>
          </>
        )}
        {tier === "dashboard" && (
          <>
            <p className="text-gray-200 text-sm mb-1">
              Free tier — 5 MCP tools, public dataset endpoints, weekly report.
            </p>
            <p className="text-gray-500 text-xs mb-5">
              Upgrade for paid agent tools, full dashboard filters, and watchlist alerts.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/api/billing/checkout?plan=insider"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
              >
                Start Insider Circle — €{INSIDER_MONTHLY_EUR}/mo
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-slate-600 hover:border-slate-500 text-gray-200 hover:text-white text-sm font-medium transition-colors"
              >
                Compare plans
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Pay-as-you-go */}
      <section className="rounded-xl border border-slate-700 bg-slate-900 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
          Pay-as-you-go credit
        </h2>
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-3xl font-bold text-gray-100">€{balanceEur}</span>
          <span className="text-gray-500 text-sm">balance</span>
          {balanceError && (
            <span className="text-amber-400 text-xs ml-2">(lookup failed — retry shortly)</span>
          )}
        </div>
        <p className="text-gray-500 text-xs mb-5">
          Charged at €{PAYG_PRICE_PER_CALL_EUR.toFixed(2)} per paid agent call.
          Free tools never debit your balance.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/api/billing/checkout?plan=payg-${PAYG_MIN_TOPUP_EUR}`}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
          >
            Top up €{PAYG_MIN_TOPUP_EUR}
          </Link>
          <Link
            href="/api/billing/checkout?plan=payg-100"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-slate-600 hover:border-slate-500 text-gray-200 hover:text-white text-sm font-medium transition-colors"
          >
            Top up €100
          </Link>
        </div>
        <p className="text-gray-600 text-xs mt-4">
          Balance never expires. No auto-charge — top-ups are always explicit.
        </p>
      </section>

      {/* API key */}
      <section className="rounded-xl border border-slate-700 bg-slate-900 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
          Your API key
        </h2>
        <code className="block bg-slate-950 rounded-lg px-4 py-3 text-sm text-gray-300 font-mono mb-3 overflow-x-auto">
          {maskedKey}
        </code>
        <Link
          href="/dashboard/api-keys"
          className="text-sky-400 hover:text-sky-300 text-sm font-medium"
        >
          Reveal, copy, or rotate →
        </Link>
      </section>

      {/* Footer reassurance */}
      <section className="rounded-xl border border-emerald-700/40 bg-emerald-950/20 p-5">
        <ul className="space-y-1.5 text-sm text-gray-300">
          <li>
            <span className="text-emerald-400 mr-2">✓</span>
            The 5 free MCP tools never get gated.
          </li>
          <li>
            <span className="text-emerald-400 mr-2">✓</span>
            No auto-charge — every top-up is an explicit click.
          </li>
          <li>
            <span className="text-emerald-400 mr-2">✓</span>
            Insider cancels in one click via Stripe portal.
          </li>
        </ul>
      </section>
    </main>
  );
}
