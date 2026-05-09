import Link from "next/link";

/**
 * TelegramCTA — drop-in card promoting the public Telegram channel as the
 * SECOND owned distribution channel (after email).
 *
 * Brunson Traffic Secrets §3 Ch 11 ("After the Slap") — Russell-style audit
 * V8 (2026-05-09) flagged that we had a Telegram link buried in JSON-LD
 * sameAs, the footer, and one integration card, but no funnel-shape push
 * for it. Email is owned channel #1 but the rented-platform exposure is
 * still high — every Reddit/HN/Twitter cohort that ghosts email needs a
 * second owned hook. Public Telegram fits the anonymity rule (no founder
 * face, no DMs, broadcast-only, pseudonymous handle).
 *
 * Variants:
 *   - default: full card with stack + CTA, used on thank-you pages and
 *     mid-funnel surfaces where vertical real estate is available.
 *   - compact: single-line "also follow on Telegram" pill, used on dense
 *     pages (homepage above-fold, footer-adjacent).
 *
 * Tone variants drive the border/background hue so the same component can
 * sit on amber (firstlook), emerald (dashboard), sky (insider) thank-you
 * pages without colour clashes.
 */

type Tone = "amber" | "emerald" | "sky" | "violet" | "neutral";
type Variant = "default" | "compact";

type Props = {
  variant?: Variant;
  tone?: Tone;
  context?: "post-purchase" | "post-signup" | "homepage" | "footer" | "generic";
};

const TONE_STYLES: Record<Tone, { border: string; bg: string; accent: string; chip: string }> = {
  amber: {
    border: "border-amber-700/40",
    bg: "from-amber-950/20 via-slate-900 to-slate-950",
    accent: "text-amber-300",
    chip: "bg-amber-900/40 text-amber-200",
  },
  emerald: {
    border: "border-emerald-700/40",
    bg: "from-emerald-950/20 via-slate-900 to-slate-950",
    accent: "text-emerald-300",
    chip: "bg-emerald-900/40 text-emerald-200",
  },
  sky: {
    border: "border-sky-700/40",
    bg: "from-sky-950/20 via-slate-900 to-slate-950",
    accent: "text-sky-300",
    chip: "bg-sky-900/40 text-sky-200",
  },
  violet: {
    border: "border-violet-700/40",
    bg: "from-violet-950/20 via-slate-900 to-slate-950",
    accent: "text-violet-300",
    chip: "bg-violet-900/40 text-violet-200",
  },
  neutral: {
    border: "border-slate-700/60",
    bg: "from-slate-900 via-slate-900 to-slate-950",
    accent: "text-cyan-300",
    chip: "bg-cyan-900/40 text-cyan-200",
  },
};

const TELEGRAM_HREF = "https://t.me/gitdealflow";

// Context-specific opener so the same component reads differently after
// payment, after free signup, or on cold homepage traffic. The mid-line
// stays consistent (what you get + cadence + price) — only the lead beat
// changes per context.
function leadFor(ctx: Props["context"]): string {
  switch (ctx) {
    case "post-purchase":
      return "Pin the public channel while you wait for delivery";
    case "post-signup":
      return "Mirror your email — pin the channel as the second pipe";
    case "homepage":
      return "Real-time alerts, no signup";
    case "footer":
      return "Follow on Telegram";
    default:
      return "The second pipe";
  }
}

// Three plain-English value lines. Each is a falsifiable claim, not a
// marketing platitude — Russell rule: a stack item must hold up to a
// "prove it" test, otherwise drop it.
const STACK_LINES = [
  {
    label: "Mondays at 09:00 UTC",
    detail:
      "The same five-name Acceleration Watch that hits email — mirrored to the channel within 60 seconds.",
  },
  {
    label: "Mid-week sector teasers",
    detail:
      "When a sector breaks the panel's 2× threshold mid-week, the channel pings before the next email goes out.",
  },
  {
    label: "Public, broadcast-only, free forever",
    detail:
      "No DMs. No threads. No login. No founder face or voice. Methodology updates and SSRN preprint anchors post here too.",
  },
] as const;

export default function TelegramCTA({
  variant = "default",
  tone = "neutral",
  context = "generic",
}: Props) {
  const t = TONE_STYLES[tone];

  if (variant === "compact") {
    return (
      <div
        aria-label="Public Telegram channel"
        className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 rounded-lg border ${t.border} bg-slate-900/40 px-4 py-3`}
      >
        <p className={`text-xs font-semibold uppercase tracking-wider ${t.accent} shrink-0`}>
          Also on Telegram
        </p>
        <p className="text-gray-300 text-sm leading-relaxed flex-1">
          Public broadcast channel — five Monday names, mid-week sector
          alerts, no signup. The second owned pipe after email.
        </p>
        <Link
          href={TELEGRAM_HREF}
          rel="noopener noreferrer"
          target="_blank"
          className={`inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold ${t.chip} hover:opacity-90 transition-opacity`}
        >
          Open t.me/gitdealflow →
        </Link>
      </div>
    );
  }

  return (
    <section
      aria-label="Public Telegram channel — second owned distribution pipe"
      className={`rounded-xl border-2 ${t.border} bg-gradient-to-br ${t.bg} p-5 sm:p-6 space-y-4`}
    >
      <header className="space-y-2">
        <p className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${t.accent}`}>
          {leadFor(context)} · second owned pipe
        </p>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-100 leading-tight">
          Pin the public Telegram. Email + Telegram beats email alone.
        </h3>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          Email is the primary briefing. Telegram is the second pipe — same
          five Monday names, mid-week sector pings, methodology change notes.
          Pseudonymous, broadcast-only, no DMs, no login, free forever.
        </p>
      </header>

      <ul className="space-y-2.5">
        {STACK_LINES.map((line) => (
          <li
            key={line.label}
            className="flex items-start gap-3 text-sm leading-relaxed"
          >
            <span
              aria-hidden="true"
              className={`mt-1 inline-block w-1.5 h-1.5 rounded-full ${t.accent.replace("text-", "bg-")} shrink-0`}
            />
            <div>
              <span className="text-gray-200 font-semibold">{line.label}</span>
              <span className="text-gray-400"> — {line.detail}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <Link
          href={TELEGRAM_HREF}
          rel="noopener noreferrer"
          target="_blank"
          className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-base font-semibold ${t.chip} hover:opacity-90 transition-opacity`}
        >
          Join t.me/gitdealflow →
        </Link>
        <Link
          href="/telegram"
          className="inline-flex items-center text-sm text-gray-400 hover:text-gray-200 underline decoration-dotted"
        >
          Why a public Telegram (and not Slack)?
        </Link>
      </div>

      {/* Tone-coded trial close — Russell Expert Secrets Ch 13. The line is
          a thinking-prompt, not a buy-button echo, so it doesn't compete
          with the CTA above. */}
      <p className={`border-l-2 ${t.border} pl-3 italic text-sm leading-relaxed text-gray-400`}>
        If the inbox eats too many briefings already — does a pinned channel
        you can mute when you want, but never miss when it pings, sound like
        the right second pipe?
      </p>
    </section>
  );
}
