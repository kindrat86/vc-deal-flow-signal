import "server-only";
import { getAllPredictionWeeks } from "@/lib/predictions";
import { buildPublicProof, type PublicProof } from "@/lib/public-proof-core";

export type { PublicProof } from "@/lib/public-proof-core";

/** The one public count for Acceleration Watch proof, derived from dated rows. */
export function getPublicProof(): PublicProof {
  return buildPublicProof(getAllPredictionWeeks());
}
