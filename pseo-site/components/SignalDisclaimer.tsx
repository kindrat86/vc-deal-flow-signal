/**
 * SignalDisclaimer — one-line YMYL disclaimer for signal-bearing pages.
 *
 * Sector hubs, comparison pages, and alternatives pages make claims that sit
 * adjacent to investment decisions. E-E-A-T for YMYL-adjacent content wants a
 * visible (not just JSON-LD) statement that this is sourcing data, not advice.
 * Keep it to a single muted line — the goal is honest framing, not a banner
 * that shouts at users. Render it below the hero/title, above the main body.
 */

interface Props {
  className?: string;
}

export function SignalDisclaimer({ className = "" }: Props) {
  return (
    <p className={`text-xs text-gray-500 leading-relaxed ${className}`}>
      Not investment advice. Engineering signals are one sourcing input among
      many — verify independently.
    </p>
  );
}

export default SignalDisclaimer;
