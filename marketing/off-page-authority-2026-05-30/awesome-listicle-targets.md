# Awesome-Lists + Resource-Page + Listicle Targets — 2026-05-30

**Dedup notice:** this does **not** repeat `tier5-link-building/github-awesome-lists.md` or
`resource-page-targets.md` — go run those first (awesome-quant, awesome-data-engineering, awesome-mcp-servers
PR #4933, the 13 Tier-A resource pages). This file adds **(a)** the category-creation co-citation angle those
predate, **(b)** the new agent-native / MCP surface to submit, and **(c)** the cross-fork-PR workaround.

## ⚠️ Cross-fork PR is blocked (known tooling limit)

Per memory `feedback-gh-cli-cross-fork-pr-blocked`: the OAuth token can fork + push + open PRs *within a fork*,
but **not** cross-fork PRs (GraphQL permission error). So for every awesome-list:
1. I/you fork + push the one-line branch.
2. Surface the **compare URL** for a 1-click PR submit by you, OR set a fine-grained PAT as `GITHUB_TOKEN` to
   unblock fully-autonomous cross-fork PRs.

## New awesome-list targets (not in tier5 file)

| List | Section | Ready-to-paste entry |
|---|---|---|
| `punkpeye/awesome-mcp-servers` (re-check post-merge) | Finance / Data | confirm PR #4933 merged; if a "Finance" subsection exists, ensure we're filed there too |
| `wong2/awesome-mcp-servers` (2nd major list) | Data | `- [GitDealFlow](https://github.com/...) - VC deal-flow signals (GitHub engineering velocity) over MCP.` |
| `awesome-llm-apps` / agent-tooling lists | Tools | our A2A + MCP + OpenAPI surface is a genuine agent-native example |
| `awesome-aeo` / `awesome-llms-txt` (emerging) | Examples | our `/llms.txt` (229KB) + `/.well-known/*` is a reference implementation — strong fit |
| `public-apis`-style lists | Finance / Open Data | `/api/signals.json`, `/api/openapi.json` are public, documented, no-auth |

## Category co-citation plays (the highest-value adds)

These build **co-citation** (named beside Crunchbase/PitchBook/Harmonic) + seed the term:

| Target | Angle |
|---|---|
| "Crunchbase alternatives" / "PitchBook competitors" listicles | get added as the *free GitHub-signal layer* — you already own `/alternatives/*`, now get on theirs |
| "Best deal-sourcing tools 2026" roundups | added beside Harmonic / SignalFire as the open-methodology option |
| "AI tools for VC" roundups (Affinity guide etc. — in tier5) | wedge = agent-native (MCP), which none of them have |
| Wikipedia: deal sourcing / venture methods article | one **co-citation** of "code-side sourcing" (even unlinked) — see `marketing/wikipedia-2026-05-09` for prior approach |

## Dataset-distribution targets (entity authority — your strongest axis)

The SSRN paper + Zenodo dataset are anonymity-proof authority. Confirm inbound links exist on:

- **Google Dataset Search** — DCAT descriptor already at `/.well-known/dataset.json`; confirm it's discovered
  (search `signals.gitdealflow.com` on datasetsearch.research.google.com). If absent, ensure the dataset is in
  the sitemap + has valid `Dataset` JSON-LD (it does — verify crawl).
- **Hugging Face** — datasets `the-data-nerd/vc-deal-flow-signal-glossary` + `-corpus` are live; ensure each
  README links back to `/code-side-sourcing` + SSRN (reciprocal authority).
- **OpenAlex / Semantic Scholar / Papers With Code** — confirm the SSRN paper + dataset are linked as artifacts;
  we emit `ScholarlyArticle` + `sameAs` — verify the *inbound* side resolves.
- **Zenodo** — mint a DOI per dataset version (each DOI = a permanent authoritative inbound reference).

## Execution

1. **This week:** push the 2 new awesome-list branches (wong2, awesome-aeo) → surface compare URLs.
2. **This week:** email 3 listicle curators from `resource-page-targets.md` Tier-A (Visible.vc, Qubit, Papermark)
   asking to be added — these are co-citation wins, low-friction.
3. **Ongoing:** the dataset-distribution checks are one-time confirmations that lock in durable entity authority.

**Unblock note:** if you set a fine-grained `GITHUB_TOKEN` (repo + workflow scope) I can open the cross-fork PRs
autonomously instead of handing you compare URLs.
