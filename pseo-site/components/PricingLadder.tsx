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
    pitch: "Weekly signal email + Receipts + MCP server.",
    bullets: [
      "Top 5 breakout startups every Monday",
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
    pitch: "8-object stack — €1,932 of value, 60-day refund.",
    bullets: [
      "Sunday Digest, Full Dashboard (85+ startups, 20 sectors)",
      "219-startup Backtest CSV (the SSRN dataset)",
      "Monthly Sector Deep Dive PDF (your pick)",
      "Chrome Extension + Claude MCP + Async Watchlist Build",
      "60-day no-questions refund. Reply to refund.",
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
      "60-day no-questions refund.",
    ],
    cta: "Join the Insider Circle",
    href: "https://buy.stripe.com/4gM00ifRpcRG2069I40x202",
    external: true,
  },
];

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
        <p className="text-gray-500 text-xs">
          Beta pricing — Dashboard goes to €49/mo and Insider to €197/mo after
          launch. Founders keep their price forever.
        </p>
      </div>
      <p className="text-gray-400 text-sm mb-6">
        Three doors. The free tier is enough for most solo angels and scouts.
        Upgrade only when filtering the full universe pays for itself.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TIERS.map((t) => {
          const ring = t.highlight
            ? "border-sky-500 ring-1 ring-sky-500/30"
            : "border-slate-800";
          const cta = t.highlight
            ? "bg-sky-600 hover:bg-sky-500"
            : "bg-slate-800 hover:bg-slate-700 border border-slate-700";
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
              className={`relative flex flex-col rounded-xl border ${ring} bg-slate-900 p-6`}
            >
              {t.highlight && (
                <span className="absolute -top-2 left-6 inline-block bg-sky-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                  Most popular
                </span>
              )}
              <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-2">
                {t.name}
              </p>
              <div className="mb-3">
                <span className="text-gray-100 font-bold text-3xl">
                  {t.price}
                </span>
                <span className="text-gray-500 text-sm ml-1">{t.cadence}</span>
              </div>
              <p className="text-gray-300 text-sm font-medium mb-4">
                {t.pitch}
              </p>
              <ul className="space-y-2 mb-6 flex-1">
                {t.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-gray-400 text-sm"
                  >
                    <span className="text-emerald-400 mt-0.5 shrink-0" aria-hidden="true">
                      ✓
                    </span>
                    <span className="leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
              <Wrapper>
                <span
                  className={`inline-flex w-full items-center justify-center px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-colors ${cta}`}
                >
                  {t.cta} &rarr;
                </span>
              </Wrapper>
            </div>
          );
        })}
      </div>

      <p className="text-gray-500 text-xs mt-4">
        Or try the{" "}
        <Link href="https://gitdealflow.com/firstlook/sample" className="text-sky-500 hover:text-sky-400 underline decoration-dotted">
          €7 First Look Pass
        </Link>{" "}
        — one sector deep-dive, one-time payment, ahead of the next weekly
        digest. <strong className="text-emerald-400">60-day &ldquo;Signal or
        It&rsquo;s Free&rdquo; refund</strong> on all paid tiers — reply to any
        email, no forms, no call.
      </p>
    </section>
  );
}
