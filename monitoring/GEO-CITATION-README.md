# GEO Citation-Share Tracking

Closes the one open gap in our GEO posture: on-page GEO (llms.txt, corpus feeds,
MCP / A2A / NLWeb, schema) is maxed, but GEO *success* is downstream and was
unverifiable from our side. This harness instruments it — so "are answer engines
actually citing us?" becomes a tracked number with a trend, not a guess.

## Files

| File | Role |
|---|---|
| `geo-citation-probe.py` | The probe. Provider-pluggable, computes citation metrics, appends history, writes snapshot. |
| `geo-queries.json` | The query battery — 12 representative buyer/agent prompts, tagged by `intent`. Edit freely. |
| `geo-citation-log.jsonl` | Append-only history, one record per run. The trend lives here. |
| `geo-citation-latest.md` | Human-readable snapshot of the most recent run. |
| `geo-baseline-2026-05-31.json` | First live baseline, collected via You.com Research (manual-ingest format reference). |
| `com.gitdealflow.geo-citation.plist` | Weekly launchd job (Mondays 10:00 local, after the Monday data refresh). |

## Running

```bash
# Automated engine: Claude + server-side web_search tool (needs ANTHROPIC_API_KEY,
# auto-read from tools/.env). Samples each query 3x to capture citation variance.
python3 geo-citation-probe.py --samples 3

# Manual: ingest a dump you collected elsewhere (You.com / Perplexity / ChatGPT).
python3 geo-citation-probe.py --provider manual --ingest geo-baseline-2026-05-31.json

# Inspect the battery without spending any API calls.
python3 geo-citation-probe.py --dry-run
```

## Metrics

- **Own-domain citation rate** — answers that cite `signals.gitdealflow.com` /
  `gitdealflow.com`. The truest GEO win: our URL in front of the user.
- **Owned-ecosystem citation rate** — also counts GitHub / Glama / Cursor / npm /
  dev.to / HackerNoon / earezki (owned + earned surfaces that still credit us).
- **Brand mention rate** — brand named in the answer prose, even without a link.
- **Surfaced rate** — cited OR named anywhere.
- **Share of voice** — us ÷ (us + competitor brands seen), a rough dominance read.

Each is rolled up overall, **by intent cluster**, and **by query**.

## Baseline (2026-05-31, You.com Research, 9 answers / 4 unique prompts)

| Intent | Surfaced | Own-domain | Read |
|---|---:|---:|---|
| methodology | 100% | 100% | We own the "does commit velocity predict fundraises" answer. |
| agent-infra | 100% | 50% | Cited #1 for MCP/API queries; GitHub/Glama/Cursor carry it. |
| discovery | 67% | 67% | Probabilistic — identical prompt missed once, hit twice. |
| **alternatives** | **0%** | **0%** | **The gap.** Harmonic/Tracxn/Dealroom/Evertrace own the "Crunchbase alternatives" answer even though we ship `/alternatives/*` pages. |

**Headline:** own-domain citation 56%, surfaced 67%, share of voice 19%.

### What the baseline tells us to do next
1. **Attack the `alternatives` cluster** — highest commercial intent, 0% citation.
   For "X alternatives" queries, answer engines cite third-party *roundups*, not
   first-party comparison pages, so the lever is off-page placement. Campaign:
   `marketing/alternatives-cluster-geo-2026-05-31/`.
2. **Stabilize `discovery`** — the flip-flop means we're on the bubble; a little more
   authority should convert it to a reliable cite.
3. Keep `methodology` + `agent-infra` defended (they're at ceiling).

## Install the weekly job

**Status: INSTALLED 2026-05-31** (`launchctl list | grep geo-citation` → registered).

The job runs from a **stable runner dir** (`~/Library/Application Support/gitdealflow-geo/`),
not the git checkout — so it survives worktree cleanup and doesn't depend on which
branch the main checkout is parked on. To (re)install or update after editing the probe:

```bash
RUN="$HOME/Library/Application Support/gitdealflow-geo"
mkdir -p "$RUN"
cp monitoring/geo-citation-probe.py monitoring/geo-queries.json \
   monitoring/geo-baseline-2026-05-31.json "$RUN/"
cp monitoring/com.gitdealflow.geo-citation.plist ~/Library/LaunchAgents/
launchctl unload ~/Library/LaunchAgents/com.gitdealflow.geo-citation.plist 2>/dev/null
launchctl load   ~/Library/LaunchAgents/com.gitdealflow.geo-citation.plist
```

Schedule: Mondays 10:00 local (after the Monday data refresh), `--samples 3`.
Runs locally (not deployed to Vercel — consumes the Anthropic API, no secrets shipped).

> ⚠️ The scheduled run will **fail-fast** until `ANTHROPIC_API_KEY` in `tools/.env`
> is refreshed (the current value is a 23-char truncated placeholder → 401). The
> harness exits cleanly on auth failure without corrupting the log. Until then,
> refresh the baseline manually via `--provider manual --ingest <dump>`.
