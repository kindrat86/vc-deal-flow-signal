/**
 * Thesis Watchlist continuity offer (EUR 29/month), shown after the EUR 1
 * Tweet Teardown purchase.
 *
 * Price + copy approved by Maryan 2026-11-03 11:12 Athens («так»).
 * Stripe (live, acct Sipiteno): product prod_VYlKC7BDHlN7qc,
 * price price_1UXdnyCwGoUDklReWbZLqfd5 (EUR 29/month), payment link
 * plink_1UXdnzCwGoUDklReIwTOCRwP. No annual price exists yet.
 *
 * TWO gates, both must pass:
 *  1. THESIS_WATCHLIST_ENABLED, manual switch, OFF. Flip to true only after
 *     the weekly signal data is verified fresh (the copy promises weekly data
 *     with a visible "data as of" date; data was frozen 2026-08-18).
 *  2. isDigestDataFresh(), the same freshness gate the Sunday digest uses
 *     (data <= FRESH_DAYS old and >= 5 fresh startups). If data goes stale
 *     again the offer disappears on the next build even with the switch on.
 *
 * Turn on: set THESIS_WATCHLIST_ENABLED = true, commit on local main, deploy
 * pseo-site (signals.gitdealflow.com). /thanks/teardown is force-static, so
 * the freshness gate is evaluated at build time.
 */
import { dataDate, isDigestDataFresh } from "@/lib/digest-builder";

export const THESIS_WATCHLIST_ENABLED = false;

export const THESIS_WATCHLIST_PAYMENT_LINK =
  "https://buy.stripe.com/eVq5kC8oX4labAG9I40x20V";

export function thesisWatchlistOfferLive(now = Date.now()): boolean {
  return THESIS_WATCHLIST_ENABLED && isDigestDataFresh(now);
}

/** "Nov 1, 2026" style date of the data in the current build. */
export function thesisWatchlistDataAsOf(): string {
  return dataDate().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
