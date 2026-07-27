import Link from "next/link";

// Annual checkout links come from env so Stripe link rotation never needs a
// code change; fallbacks are the live links verified 2026-07-13.
const STRIPE_DASHBOARD_ANNUAL =
  process.env.NEXT_PUBLIC_STRIPE_DASHBOARD_ANNUAL_LINK ||
  "https://buy.stripe.com/aFa5kC34DeZOawC6vS0x20c";
const STRIPE_INSIDER_ANNUAL =
  process.env.NEXT_PUBLIC_STRIPE_INSIDER_ANNUAL_LINK ||
  "https://buy.stripe.com/cNieVc34DbNCcEK2fC0x20e";

interface Tier {
  name: string;
  price: string;
  cadence: string;
  pitch: string;
  bullets: readonly string[];
  cta: string;
  href: string;
  annualHref?: string;
  annualLabel?: string;
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
    price: "€49",
    cadence: "per month",
    pitch: "8-object stack — €1,728 of value, 30-day Signal-or-It's-Free guarantee.",
    bullets: [
      "Sunday Digest, Full Dashboard (140 startups, 20 sectors)",
      "219-startup Backtest CSV (the SSRN dataset)",
      "Monthly Sector Deep Dive PDF (your pick)",
      "Chrome Extension + Claude MCP + Async Watchlist Build",
      "30-day Signal-or-It's-Free guarantee. Email me, every cent back.",
    ],
    cta: "Start the Dashboard",
    href: "https://buy.stripe.com/4gMbJ07kTaJy7kqg6s0x20b",
    annualHref: STRIPE_DASHBOARD_ANNUAL,
    annualLabel: "or €490/yr — 2 months free",
    external: true,
    highlight: true,
  },
  {
    name: "Insider Circle",
    price: "€197",
    cadence: "per month",
    pitch: "Everything in Dashboard + 8-object Insider stack.",
    bullets: [
      "Private Investor Telegram + Monthly Live Briefing",
      "Insider API + Slack/Telegram Spike Alerts",
      "Quarterly Trend Briefing PDF + Portfolio Overlap report",
      "Direct line to the founder (text/email)",
      "30-day Signal-or-It's-Free guarantee.",
    ],
    cta: "Join the Insider Circle",
    href: "https://buy.stripe.com/bJeaEWfRpcRG6gm2fC0x20d",
    annualHref: STRIPE_INSIDER_ANNUAL,
    annualLabel: "or €1,970/yr — 2 months free",
    external: true,
  },
];

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 mt-0.5 shrink-0 text-[#4ade80]"
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
        <h2 className="text-[#f8fafc] font-bold text-[clamp(22px,3.2vw,30px)] tracking-[-0.02em]">
          Simple pricing
        </h2>
        <p className="text-[#64748b] text-xs">
          The founding window closed June 30 — exactly as promised. Founding
          members keep their price for life.
        </p>
      </div>
      <p className="text-[#94a3b8] text-sm mb-6 max-w-3xl">
        Three doors. The free tier is enough for most solo angels and scouts.
        Upgrade only when filtering the full universe pays for itself.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TIERS.map((t) => {
          const cardClasses = t.highlight
            ? "border-[rgba(14,165,233,0.3)] bg-gradient-to-b from-[rgba(14,165,233,0.1)] to-[rgba(148,163,184,0.03)]"
            : "border-[rgba(148,163,184,0.15)] bg-[rgba(148,163,184,0.03)]";
          const ctaClasses = t.highlight
            ? "bg-[#0ea5e9] hover:bg-[#38bdf8] text-[#04121f]"
            : "bg-[rgba(148,163,184,0.1)] hover:bg-[rgba(148,163,184,0.18)] text-[#e2e8f0]";
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
              className={`relative flex flex-col rounded-[16px] border ${cardClasses} p-7 transition-all`}
            >
              {t.highlight && (
                <span className="absolute -top-3 right-6 inline-flex items-center gap-1 bg-[#0ea5e9] text-[#04121f] text-xs font-bold px-3 py-1.5 rounded-full">
                  MOST POPULAR
                </span>
              )}
              <p className="text-[#7dd3fc] text-sm font-semibold mb-1.5">
                {t.name}
              </p>
              <div className="mb-4 flex items-baseline">
                <span className="text-[#f8fafc] font-bold text-[34px] tracking-tight">
                  {t.price}
                </span>
                <span className="text-[#64748b] text-[15px] font-medium ml-1.5">{t.cadence}</span>
              </div>
              <p className="text-[#cbd5e1] text-[14.5px] font-medium mb-5 leading-snug">
                {t.pitch}
              </p>
              <ul className="space-y-3 mb-6 flex-1">
                {t.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-[#cbd5e1] text-[14.5px]"
                  >
                    <CheckIcon />
                    <span className="leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
              <Wrapper>
                <span
                  className={`inline-flex w-full items-center justify-center gap-1.5 px-4 py-[14px] rounded-[10px] text-sm font-semibold transition-colors ${ctaClasses}`}
                >
                  {t.cta}
                  <span aria-hidden="true">→</span>
                </span>
              </Wrapper>
              {t.annualHref && t.annualLabel && (
                <a
                  href={t.annualHref}
                  className="mt-2 inline-flex justify-center text-xs text-[#38bdf8] hover:text-[#7dd3fc] underline decoration-dotted underline-offset-2"
                >
                  {t.annualLabel}
                </a>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[#64748b] text-xs mt-4">
        Or try the{" "}
        <Link href="https://signals.gitdealflow.com/firstlook/sample" className="text-[#38bdf8] hover:text-[#7dd3fc] underline decoration-dotted">
          €7 First Look Pass
        </Link>{" "}
        — one sector deep-dive, one-time payment, ahead of the next weekly
        digest. <strong className="text-[#4ade80]">30-day Signal-or-It&rsquo;s-Free
        guarantee</strong>: any paid rung, 30 days, email me, every cent back.
        No forms, no survey.
      </p>

      <div className="mt-6 rounded-[14px] border border-[rgba(148,163,184,0.12)] bg-gradient-to-br from-[rgba(14,165,233,0.06)] to-[rgba(148,163,184,0.03)] p-5">
        <p className="text-[#38bdf8] text-xs font-semibold uppercase tracking-wider mb-2">
          For active funds — high-ticket research partnerships
        </p>
        <h3 className="text-[#f8fafc] font-semibold text-base mb-3 leading-snug">
          The ladder doesn&rsquo;t stop at the Dashboard.
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <Link
            href="/pricing#sharp-tier"
            className="rounded-lg border border-[rgba(148,163,184,0.12)] bg-[rgba(148,163,184,0.04)] p-3 hover:border-[rgba(14,165,233,0.3)] transition-colors"
          >
            <p className="text-[#38bdf8] text-xs font-mono">€4,970 / yr</p>
            <p className="text-[#f8fafc] font-semibold text-sm leading-tight mt-0.5">
              Sharp Tier
            </p>
            <p className="text-[#64748b] text-xs mt-1 leading-snug">
              Application-gated. 8-fund cap.
            </p>
          </Link>
          <Link
            href="/methodology-partnership"
            className="rounded-lg border border-[rgba(148,163,184,0.12)] bg-[rgba(148,163,184,0.04)] p-3 hover:border-[rgba(14,165,233,0.3)] transition-colors"
          >
            <p className="text-[#38bdf8] text-xs font-mono">€14,997 / yr</p>
            <p className="text-[#f8fafc] font-semibold text-sm leading-tight mt-0.5">
              Methodology Partnership
            </p>
            <p className="text-[#64748b] text-xs mt-1 leading-snug">
              Done-with-you. 5-fund cap.
            </p>
          </Link>
          <Link
            href="/vault"
            className="rounded-lg border border-[rgba(148,163,184,0.12)] bg-[rgba(148,163,184,0.04)] p-3 hover:border-[rgba(14,165,233,0.3)] transition-colors"
          >
            <p className="text-[#38bdf8] text-xs font-mono">€49,997 / yr</p>
            <p className="text-[#f8fafc] font-semibold text-sm leading-tight mt-0.5">
              The Vault
            </p>
            <p className="text-[#64748b] text-xs mt-1 leading-snug">
              Methodology source. 2-fund cap.
            </p>
          </Link>
        </div>
        <p className="text-[#64748b] text-xs mt-3 leading-relaxed">
          All three are async-only — no live calls, no in-person attendance.
          See the{" "}
          <Link
            href="/pricing"
            className="text-[#38bdf8] hover:text-[#7dd3fc] underline decoration-dotted"
          >
            full ten-rung ladder
          </Link>{" "}
          on /pricing.
        </p>
      </div>
    </section>
  );
}
