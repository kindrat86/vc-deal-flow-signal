/**
 * Honest, deterministic per-startup projections for the email-gated
 * curiosity row (see components/CuriosityGate.tsx).
 *
 * Every output is a pure function of data ALREADY shown on the page —
 * a startup's own commit-velocity acceleration and its classified signal
 * type. Nothing is invented:
 *   - the lead-time window is bucketed against the SSRN panel finding
 *     (median 31 days, IQR 21-47 days before the announced round);
 *   - the next milestone is the documented meaning of the signal type.
 * Both render blurred + labeled "model estimate" — the curiosity is the
 * gate, the honesty is the label.
 */

/** Parse "+340%" → 340 (or pass a number through). Non-numeric → 0. */
export function accelPct(change: string | number): number {
  if (typeof change === "number") return Number.isFinite(change) ? change : 0;
  const n = parseInt(change.replace(/[^0-9-]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

/** Lead-time bucket anchored to the SSRN 21-47d finding. Varies per org. */
export function projectedLeadWindow(change: string | number): string {
  const a = accelPct(change);
  if (a >= 200) return "≈21-day lead window";
  if (a >= 100) return "≈31-day lead window";
  if (a >= 25) return "≈47-day lead window";
  return "no active window";
}

/** Documented meaning of each signal type → a plain-English next milestone. */
export function projectedMilestone(signalType: string): string {
  switch (signalType) {
    case "Engineering hiring burst":
      return "Team expansion / round prep";
    case "Infrastructure buildout":
      return "Major product milestone";
    case "Deploy frequency spike":
      return "Public launch / release";
    default:
      return "Platform or stack transition";
  }
}
