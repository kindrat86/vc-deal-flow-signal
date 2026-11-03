import {
  THESIS_WATCHLIST_PAYMENT_LINK,
  thesisWatchlistDataAsOf,
  thesisWatchlistOfferLive,
} from "@/lib/thesis-watchlist";

/**
 * Post-EUR 1 continuity offer. Renders nothing unless the manual flag is on
 * AND the signal data passes the freshness gate (see lib/thesis-watchlist.ts).
 * Copy below is the exact text Maryan approved 2026-11-03, do not edit
 * without a new «так».
 */
export function ThesisWatchlistOffer() {
  if (!thesisWatchlistOfferLive()) return null;
  return (
    <section
      id="thesis-watchlist"
      className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6 space-y-3"
    >
      <h2 className="text-emerald-200 text-lg font-semibold">
        Thesis Watchlist, €29/month
      </h2>
      <p className="text-gray-300 text-sm leading-relaxed">
        Every week: your sectors and stages, five accelerating teams with
        commit/contributor evidence, repo links, and why now. Plus a public
        scorecard of past picks vs who actually raised.
      </p>
      <p className="text-gray-400 text-xs leading-relaxed">
        Cancel anytime. Data as of the Sunday refresh date shown in each
        issue. If we miss a week, that month is free.
      </p>
      <p className="text-gray-500 text-xs">
        Data as of {thesisWatchlistDataAsOf()}
      </p>
      <p className="pt-1">
        <a
          href={THESIS_WATCHLIST_PAYMENT_LINK}
          className="inline-block rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2"
          rel="nofollow"
        >
          Thesis Watchlist, €29/month →
        </a>
      </p>
    </section>
  );
}
