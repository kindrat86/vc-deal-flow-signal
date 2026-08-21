import Link from "next/link";
import type { PublicProof } from "@/lib/public-proof-core";

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function PublicScorecardProof({ proof }: { proof: PublicProof }) {
  const { scorecard } = proof;
  return (
    <aside className="rounded-xl border border-sky-700/40 bg-sky-950/30 p-5 sm:p-6" aria-label="Public scorecard proof">
      <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider mb-2">Public scorecard, updated {formatDate(proof.asOf)}</p>
      <p className="text-gray-100 text-lg font-semibold leading-snug">
        {scorecard.published} published picks, {scorecard.graded} graded, {scorecard.hits} hits, {scorecard.misses} misses, {scorecard.pending} pending.
      </p>
      <p className="text-gray-300 text-sm leading-relaxed mt-2">
        Each pick is dated before its 60-day and 90-day checks. Outcomes stay public, including misses.
      </p>
      <Link href={scorecard.source} className="inline-block mt-3 text-sky-300 hover:text-sky-200 underline decoration-dotted text-sm font-medium">
        See every pick and grading rule →
      </Link>
    </aside>
  );
}
