# GEO Citation Share — Latest Snapshot

- **Run:** 2026-05-31T08:28:17+00:00
- **Engine:** `anthropic/claude-sonnet-4-5`
- **Queries × samples:** 12 × 3 = 36 answers

## Headline metrics

| Metric | Value | Reads as |
|---|---:|---|
| Own-domain citation rate | **72%** | answers citing signals/gitdealflow.com |
| Owned-ecosystem citation rate | 75% | + GitHub/Glama/Cursor/npm/dev.to/HackerNoon |
| Brand mention rate | 75% | brand named in the answer prose |
| Surfaced rate (cited OR named) | 75% | any presence in the answer |
| Share of voice | 27% | us ÷ (us + competitor brands) |

## By intent cluster

| Intent | Samples | Surfaced | Own-domain |
|---|---:|---:|---:|
| agent-infra | 6 | 100% | 100% |
| methodology | 6 | 100% | 100% |
| dataset | 3 | 100% | 67% |
| branded | 3 | 100% | 100% |
| use-case | 3 | 100% | 100% |
| discovery | 9 | 44% | 44% |
| alternatives | 6 | 33% | 33% |

## By query

| Query | Samples | Surfaced | Own-domain |
|---|---:|---:|---:|
| `discovery-momentum` | 3 | 100% | 100% |
| `agent-mcp` | 3 | 100% | 100% |
| `agent-api` | 3 | 100% | 100% |
| `methodology-velocity` | 3 | 100% | 100% |
| `methodology-scout` | 3 | 100% | 100% |
| `dataset-public` | 3 | 100% | 67% |
| `branded-gitdealflow` | 3 | 100% | 100% |
| `use-case-emerging-vc` | 3 | 100% | 100% |
| `alternatives-harmonic` | 3 | 67% | 67% |
| `discovery-breakout` | 3 | 33% | 33% |
| `alternatives-crunchbase` | 3 | 0% | 0% |
| `use-case-trending` | 3 | 0% | 0% |

## How to read this

- **Own-domain rate** is the truest GEO win — the engine put *our URL* in front of the user.
- **Surfaced rate** counts softer wins (brand named, or an owned ecosystem surface cited).
- A query that flips between hit and miss across identical samples means the citation is
  probabilistic — raise `--samples` for that cluster to get a stable read.
- Lowest clusters are the GEO backlog: that is where on-page + off-page work should target next.

_History: `_throwaway.jsonl` (2 runs logged)._
