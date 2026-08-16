/**
 * Canonical public claim floors (user-locked 2026-08-16, see AGENTS.md and
 * CLAIMS-LEDGER.md at the repo root).
 *
 * The panel-size claim is the STABLE FLOOR "350+", never an exact count:
 * the live /api/signals.json serves a raw sector-sum (411 at the 2026-08-16
 * read; 540 after the Q3 sector reactivation) while the deduped unique-org
 * count sits under 400, so every exact number both drifts weekly AND
 * overclaims. "400+", "~400", "369", "411", "540" are BANNED in claim copy.
 *
 * Surfaces that STATE how large the tracked panel is must use PANEL_CLAIM
 * or panelClaimFloor(), not a raw or computed count. Live data readouts
 * (API meta, per-sector counts, sourced claim tables pointing at
 * signals.json) are exempt: they are data, not marketing claims.
 *
 * Guarded by verify-no-regressions.ts section 53 (fails the build on revert).
 */
export const PANEL_CLAIM = "350+";

/** Claim form of a measured count: the locked floor once the panel clears it. */
export function panelClaimFloor(count: number): string {
  return count >= 350 ? PANEL_CLAIM : String(count);
}
