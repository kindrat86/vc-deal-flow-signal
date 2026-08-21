import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import { getCurrentPeriod, getDataLastModified } from "@/lib/data";

/**
 * Reusable "source truth" Dataset JSON-LD for data pages.
 *
 * The site's canonical dataset entity lives at
 * `https://signals.gitdealflow.com/dataset#dataset` and is emitted in full on
 * `/dataset`. Every *data page* (a page whose primary content is numbers
 * derived from the dataset: sector hubs, stage/geo/trend directories,
 * startup profiles, fund/acquirer pages, benchmarks, momentum signals, etc.)
 * should carry a page-specific Dataset node that:
 *
 *   1. names the page's own data,
 *   2. carries the page's measured variables as machine-readable
 *      PropertyValue nodes (so a RAG/answer engine can extract a grounded
 *      number and its meaning without guessing from prose),
 *   3. back-links provenance via `isBasedOn` -> the canonical dataset, and
 *   4. carries the DOI + license + creator so any quoted stat is traceable.
 *
 * The `@id` is `${pageUrl}#dataset` (globally unique per page); provenance is
 * expressed as a *reference* (`isBasedOn`) rather than by re-stating the
 * canonical dataset's properties, which would trip GSC "Duplicate unique
 * property" entity-merge errors (see the schema-dot-org skill).
 */

export const SIGNALS_SITE = "https://signals.gitdealflow.com";
export const DATASET_CANONICAL_ID = `${SIGNALS_SITE}/dataset#dataset`;
export const DATASET_DOI = "10.5281/zenodo.19650920";
export const DATASET_LICENSE = "https://creativecommons.org/licenses/by/4.0/";

export const DATASET_PUBLISHER = {
  "@type": "Organization",
  name: "VC Deal Flow Signal",
  url: "https://gitdealflow.com",
} as const;

export interface SourceTruthVariable {
  name: string;
  value: string | number;
  description?: string;
  unitText?: string;
}

export interface SourceTruthDistribution {
  name: string;
  contentUrl: string;
  encodingFormat: string;
}

export interface SourceTruthDatasetOpts {
  /** Absolute canonical URL of the page carrying this node. */
  url: string;
  name: string;
  description: string;
  /** Page-specific measured statistics, rendered as PropertyValue nodes. */
  variableMeasured?: SourceTruthVariable[];
  /** Temporal coverage string; defaults to the current data period name. */
  temporalCoverage?: string;
  keywords?: string[];
  /** Extra distribution entries (live CSV/JSON endpoints are added automatically). */
  distribution?: SourceTruthDistribution[];
}

export function buildSourceTruthDataset(opts: SourceTruthDatasetOpts) {
  const pageUrl = opts.url;
  const period = getCurrentPeriod();
  const lastModified = getDataLastModified().toISOString().slice(0, 10);

  const node: Record<string, unknown> = {
    "@type": "Dataset",
    "@id": `${pageUrl}#dataset`,
    name: opts.name,
    description: opts.description,
    url: pageUrl,
    isBasedOn: { "@id": DATASET_CANONICAL_ID },
    identifier: {
      "@type": "PropertyValue",
      propertyID: "https://www.wikidata.org/wiki/Property:P356",
      name: "DOI",
      value: DATASET_DOI,
      url: `https://doi.org/${DATASET_DOI}`,
    },
    creator: DATA_NERD_AUTHOR_REF,
    publisher: DATASET_PUBLISHER,
    license: DATASET_LICENSE,
    isAccessibleForFree: true,
    dateModified: lastModified,
    temporalCoverage: opts.temporalCoverage ?? period.name,
    distribution: [
      {
        "@type": "DataDownload",
        name: "Startup signals, CSV (live)",
        encodingFormat: "text/csv",
        contentUrl: `${SIGNALS_SITE}/api/signals.csv`,
      },
      {
        "@type": "DataDownload",
        name: "Startup signals, JSON (live)",
        encodingFormat: "application/json",
        contentUrl: `${SIGNALS_SITE}/api/signals.json`,
      },
    ],
  };

  if (opts.variableMeasured?.length) {
    node.variableMeasured = opts.variableMeasured.map((v) => ({
      "@type": "PropertyValue",
      name: v.name,
      value: v.value,
      ...(v.description ? { description: v.description } : {}),
      ...(v.unitText ? { unitText: v.unitText } : {}),
    }));
  }

  if (opts.keywords?.length) {
    node.keywords = opts.keywords;
  }

  if (opts.distribution?.length) {
    node.distribution = [
      ...(node.distribution as Record<string, unknown>[]),
      ...opts.distribution.map((d) => ({
        "@type": "DataDownload",
        name: d.name,
        contentUrl: d.contentUrl,
        encodingFormat: d.encodingFormat,
      })),
    ];
  }

  return node;
}
