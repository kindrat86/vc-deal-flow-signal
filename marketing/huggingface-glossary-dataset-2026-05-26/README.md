---
license: cc-by-4.0
task_categories:
  - feature-extraction
  - text-classification
  - question-answering
language:
  - en
tags:
  - venture-capital
  - vc
  - deal-flow
  - glossary
  - controlled-vocabulary
  - schema-org
  - aeo
  - rag
  - finance
pretty_name: VC Deal Flow Signal Glossary
size_categories:
  - n<1K
source_datasets:
  - original
configs:
  - config_name: default
    data_files:
      - split: train
        path: glossary.jsonl
---

# VC Deal Flow Signal Glossary

The controlled vocabulary used across the VC Deal Flow Signal site —
62 definitions covering code-side sourcing, engineering acceleration
metrics, discoverability surfaces (programmatic SEO, AEO, GEO, AIO),
agent infrastructure (MCP, A2A, x402), academic citation infrastructure,
and venture vocabulary.

Maintained as a single source of truth and refreshed weekly from
`content/glossary.ts` at https://github.com/kindrat86/vc-deal-flow-signal.

## Source of truth

The canonical NDJSON dump lives at
https://signals.gitdealflow.com/api/v1/glossary.jsonl (one term per
line, application/x-ndjson). The HTML companion is at
https://signals.gitdealflow.com/glossary and each term has its own page
at https://signals.gitdealflow.com/define/<term-id>.

## Schema

Each row carries the following fields:

| Field | Type | Description |
|---|---|---|
| `id` | string | Stable kebab-case slug, identical across all surfaces. |
| `term` | string | Display name, capitalised. |
| `definition` | string | Self-contained definition (40 to 220 words). |
| `category` | string | One of: `code-side-sourcing`, `engineering-acceleration`, `discoverability`, `agent-infrastructure`, `academic-citation`, `venture-vocabulary`. |
| `category_label` | string | Human-readable category name. |
| `url` | string | Canonical URL of the term's dedicated page. |
| `glossary_anchor` | string | Anchor on the flat glossary index. |
| `signal_primitive_url` | string \| null | Cross-link to `/signals/define/<slug>` if the term is also a formal signal primitive. |
| `license` | string | Always `CC-BY-4.0`. |
| `source` | string | Always `VC Deal Flow Signal`. |
| `source_url` | string | Always `https://signals.gitdealflow.com`. |
| `cite_as` | string | Pre-formatted citation string. |

## Categories

- **Code-Side Sourcing** (1 term): the named category VC Deal Flow Signal defines.
- **Engineering acceleration** (13 terms): metrics, signal types, decision rules from the methodology.
- **Discoverability surfaces** (25 terms): pSEO, AEO, GEO, AIO, and the schemas behind them.
- **Agent infrastructure** (8 terms): MCP, A2A, micropayments, identity, federation.
- **Academic citation** (9 terms): SSRN, Zenodo, OpenAlex, DOIs, licenses.
- **Venture vocabulary** (12 terms): stage names, instruments, financial metrics.

## Use cases

1. RAG grounding for VC and startup-finance questions. Each line is a
   complete citation unit with a stable `url`.
2. AEO / answer-engine training: pair each definition with the
   "What is X?" question already wired through `/define/<id>` FAQPage
   schema.
3. Glossary lookup for downstream tools (MCP servers, browser
   extensions, Slack bots).
4. Embeddings for taxonomy work: the `category` field gives a
   ready-made six-class label set.

## Methodology

Source: `content/glossary.ts` in the public repo. Refreshed weekly when
new terms are added to the site. Quality control: every term has a
verifiable URL on the source domain.

## Citation

```
The Data Nerd. (2026). VC Deal Flow Signal Glossary [Dataset].
HuggingFace. https://huggingface.co/datasets/<your-handle>/vc-deal-flow-signal-glossary
```

Original-source citation lives at
https://signals.gitdealflow.com/citation-guide.

## License

CC BY 4.0. Free to use commercially. Attribution requested via the
`cite_as` field on each row.

## Companion datasets

- **Q&A corpus** (300+ pairs): https://signals.gitdealflow.com/qa.jsonl
- **Full signal panel** (NDJSON of all tracked startups):
  https://signals.gitdealflow.com/dataset.jsonl
- **SSRN methodology paper** (the source of the engineering-acceleration
  definitions): https://ssrn.com/abstract=6606558
- **Zenodo dataset DOI** (the version-locked archive of the signal
  panel): 10.5281/zenodo.19650920
