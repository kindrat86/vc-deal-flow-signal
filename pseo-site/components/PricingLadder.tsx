import Link from "next/link";

interface Tier {
  name: string;
  price: string;
  cadence: string;
  pitch: string;
  bullets: readonly string[];
  cta: string;
  href: string;
  external?: boolean;
  highlight?: boolean;
}

const TIERS: readonly Tier[] = [
  {
    name: "Free",
    price: "€0",
    cadence: "forever",
    pitch: "Acceleration Watch — the Monday email investors set their calendar to.",
    bullets: [
      "Acceleration Watch: top 5 breakouts every Monday 09:00 UTC",
      "Free Scout Receipts at /receipts",
      "MCP server for Claude / Cursor",
      "JSON / CSV / RSS public dataset",
    ],
    cta: "Subscribe free",
    href: "https://gitdealflow.com/#signup",
    external: true,
  },
  {
    name: "Dashboard",
    price: "€9.97",
    cadence: "per month",
    pitch: "8-object stack — €1,932 of value, 30-day refund.",
    bullets: [
      "Sunday Digest, Full Dashboard (85+ startups, 20 sectors)",
      "219-startup Backtest CSV (the SSRN dataset)",
      "Monthly Sector Deep Dive PDF (your pick)",
      "Chrome Extension + Claude MCP + Async Watchlist Build",
      "30-day no-questions refund. Reply to refund.",
    ],
    cta: "Lock in founder price",
    href: "https://buy.stripe.com/28E7sK48H04U8ou07u0x200",
    external: true,
    highlight: true,
  },
  {
    name: "Insider Circle",
    price: "€97",
    cadence: "per month",
    pitch: "Everything in Dashboard + 8-object Insider stack.",
    bullets: [
      "Private Investor Telegram + Monthly Live Briefing",
      "Insider API + Slack/Telegram Spike Alerts",
      "Quarterly Trend Briefing PDF + Portfolio Overlap report",
      "Direct line to the founder (text/email)",
      "30-day no-questions refund.",
    ],
    cta: "Join the Insider Circle",
    href: "https://buy.stripe.com/4gM00ifRpcRG2069I40x202",
    external: true,
  },
];

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 mt-0.5 shrink-0 text-emerald-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.5 7.6a1 1 0 0 1-1.42.006l-3.5-3.5a1 1 0 1 1 1.414-1.414l2.79 2.79 6.793-6.89a1 1 0 0 1 1.417-.006Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function PricingLadder() {
  return (
    <section
      aria-label="Pricing"
      id="pricing"
      className="my-12"
    >
      <div className="flex items-baseline justify-between mb-1 flex-wrap gap-2">
        <h2 className="text-gray-100 font-semibold text-2xl">
          Simple pricing. Free forever for the curious.
        </h2>
        <p className="text-gray-400 text-xs">
          Beta pricing — Dashboard goes to €49/mo and Insider to €197/mo after
          launch. Founders keep their price forever.
        </p>
      </div>
      <p className="text-gray-400 text-sm mb-6 max-w-3xl">
        Three doors. The free tier is enough for most solo angels and scouts.
        Upgrade only when filtering the full universe pays for itself.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TIERS.map((t) => {
          const cardClasses = t.highlight
            ? "border-sky-500/70 ring-1 ring-sky-500/30 bg-gradient-to-b from-sky-950/40 to-slate-900 shadow-lg shadow-sky-500/10"
            : "border-slate-800 bg-slate-900";
          const ctaClasses = t.highlight
            ? "bg-sky-600 hover:bg-sky-500 text-white shadow-sm shadow-sky-500/30"
            : "bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white";
          const Wrapper = ({ children }: { children: React.ReactNode }) =>
            t.external ? (
              <a href={t.href} className="block">
                {children}
              </a>
            ) : (
              <Link href={t.href} className="block">
                {children}
              </Link>
            );

          return (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-xl border ${cardClasses} p-6 transition-all`}
            >
              {t.highlight && (
                <span className="absolute -top-2.5 left-6 inline-flex items-center gap-1 bg-sky-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm shadow-sky-500/30">
                  <span aria-hidden="true">★</span> Most popular
                </span>
              )}
              <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-2">
                {t.name}
              </p>
              <div className="mb-3 flex items-baseline">
                <span className="text-gray-100 font-bold text-3xl tracking-tight">
                  {t.price}
                </span>
                <span className="text-gray-400 text-sm ml-1.5">{t.cadence}</span>
              </div>
              <p className="text-gray-300 text-sm font-medium mb-4 leading-snug">
                {t.pitch}
              </p>
              <ul className="space-y-2 mb-6 flex-1">
                {t.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-gray-400 text-sm"
                  >
                    <CheckIcon />
                    <span className="leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
              <Wrapper>
                <span
                  className={`inline-flex w-full items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${ctaClasses}`}
                >
                  {t.cta}
                  <span aria-hidden="true">→</span>
                </span>
              </Wrapper>
            </div>
          );
        })}
      </div>

      <p className="text-gray-400 text-xs mt-4">
        Or try the{" "}
        <Link href="https://gitdealflow.com/firstlook/sample" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
          €7 First Look Pass
        </Link>{" "}
        — one sector deep-dive, one-time payment, ahead of the next weekly
        digest. <strong className="text-emerald-400">30-day &ldquo;Signal or
        It&rsquo;s Free&rdquo; refund</strong> on all paid tiers — reply to any
        email, no forms, no call.
      </p>

      {/* Brunson Audit 2026-05-08 — Value Ladder ding fix. Show the
          high-ticket continuity above €1,997 so the buyer can see where the
          ladder actually goes. Async-only, anonymity-preserving. */}
      <div className="mt-6 rounded-xl border border-violet-700/30 bg-gradient-to-br from-violet-950/20 to-slate-900 p-5">
        <p className="text-violet-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2">
          For active funds — high-ticket research partnerships
        </p>
        <h3 className="text-gray-100 font-semibold text-base mb-3 leading-snug">
          The ladder doesn&rsquo;t stop at the Dashboard.
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <Link
            href="/pricing#sharp-tier"
            className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 hover:border-indigo-700/50 transition-colors"
          >
            <p className="text-indigo-400 text-xs font-mono">€4,970 / yr</p>
            <p className="text-gray-100 font-semibold text-sm leading-tight mt-0.5">
              Sharp Tier
            </p>
            <p className="text-gray-400 text-xs mt-1 leading-snug">
              Application-gated. 8-fund cap.
            </p>
          </Link>
          <Link
            href="/methodology-partnership"
            className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 hover:border-violet-700/50 transition-colors"
          >
            <p className="text-violet-400 text-xs font-mono">€14,997 / yr</p>
            <p className="text-gray-100 font-semibold text-sm leading-tight mt-0.5">
              Methodology Partnership
            </p>
            <p className="text-gray-400 text-xs mt-1 leading-snug">
              Done-with-you. 5-fund cap.
            </p>
          </Link>
          <Link
            href="/vault"
            className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 hover:border-amber-700/50 transition-colors"
          >
            <p className="text-amber-400 text-xs font-mono">€49,997 / yr</p>
            <p className="text-gray-100 font-semibold text-sm leading-tight mt-0.5">
              The Vault
            </p>
            <p className="text-gray-400 text-xs mt-1 leading-snug">
              Methodology source. 2-fund cap.
            </p>
          </Link>
        </div>
        <p className="text-gray-500 text-xs mt-3 leading-relaxed">
          All three are async-only — no live calls, no in-person attendance.
          See the{" "}
          <Link
            href="/pricing"
            className="text-violet-400 hover:text-violet-300 underline decoration-dotted"
          >
            full ten-rung ladder
          </Link>{" "}
          for application links and complete value stacks.
        </p>
      </div>
    </section>
  );
}
