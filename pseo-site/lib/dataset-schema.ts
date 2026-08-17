/**
 * Source-truth Dataset JSON-LD builder (RAG-readiness).
 *
 * Every data page (acquirer / city / sector / startup, and previously the
 * other dataset-derived templates) emits a schema.org Dataset node so answer
 * engines can extract a grounded statistic and trace it to the canonical
 * dataset via isBasedOn -> https://signals.gitdealflow.com/dataset#dataset.
 *
 * The module was lost to a branch-fragmentation event (2026-08-19) and
 * re-created from the four surviving call sites (acquirer/city/sector/startup)
 * plus the §58 guard's provenance contract. It is the single source of truth
 * for the Dataset node shape; do not hand-roll Dataset nodes in pages.
 */

export interface SourceTruthDatasetVariable {
  name: string;
  value: string | number;
  description?: string;
  unitText?: string;
}

export interface SourceTruthDatasetInput {
  url: string;
  name: string;
  description: string;
  variableMeasured: SourceTruthDatasetVariable[];
  keywords?: string[];
  temporalCoverage?: string;
}

/** Canonical dataset id every derived page traces back to via isBasedOn. */
export const SOURCE_TRUTH_DATASET_ID = "https://signals.gitdealflow.com/dataset#dataset";

export function buildSourceTruthDataset(input: SourceTruthDatasetInput) {
  const node: Record<string, unknown> = {
    "@type": "Dataset",
    "@id": `${input.url}#dataset`,
    name: input.name,
    description: input.description,
    url: input.url,
    isBasedOn: SOURCE_TRUTH_DATASET_ID,
    variableMeasured: input.variableMeasured,
    creator: { "@id": "https://signals.gitdealflow.com/about#person" },
    license: "https://creativecommons.org/licenses/by/4.0/",
  };
  if (input.keywords && input.keywords.length) {
    node.keywords = input.keywords;
  }
  if (input.temporalCoverage) {
    node.temporalCoverage = input.temporalCoverage;
  }
  return node;
}
