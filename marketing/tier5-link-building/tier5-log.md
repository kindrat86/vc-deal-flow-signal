# Tier 5 — Off-Page Authority Log (live status)

Ground-truth tracker for the binding constraint (off-page authority = ~58/100 in the
2026-05-31 audit; everything on-page is maxed). Updated 2026-05-31.

> **Two hard rules** (from MEMORY):
> 1. **No autonomous cold email.** Outreach is staged and surfaced for 1-click send only.
> 2. **Cross-fork GitHub PRs are blocked** by the current OAuth token (gist+read:org+repo+workflow,
>    no cross-fork PR scope). Workaround: fork + push the branch autonomously, then surface the
>    compare URL as a 1-click for the user. A fine-grained PAT as `GITHUB_TOKEN` removes this limit.

## ✅ Earned (live backlinks — verified 2026-05-31)

| Source | Type | DR tier | Evidence |
|---|---|---|---|
| **awesome-quant** (wilsonfreitas) | awesome-list, dofollow | High | `GitDealFlow` line live in README (PR #360 merged). Listed under data sources. |
| **awesome-mcp-servers** (punkpeye) | awesome-list, dofollow | High | `kindrat86/mcp-deal-flow-signal` line live in README (PR #4933 merged), with Glama score badge. |
| **HuggingFace datasets** ×2 | dataset registry | High | `the-data-nerd/vc-deal-flow-signal-corpus` + `-glossary`, CC-BY-4.0, indexed → feeds Google Dataset Search. |
| **Glama MCP** (A-tier) | directory | Med-High | Scored listing + badge. |
| **Smithery** (Verified 98/100) | directory | Med | Verified MCP listing. |
| **SSRN / Zenodo / Wikidata Q139376302 / ORCID** | scholarly + entity | High | Abstract 6606558 + DOI + entity graph live. |

## 🟡 In flight / shipped-but-unproven

| Lever | Status | Next |
|---|---|---|
| **Embed-backlink widgets** | PR #295 (2026-05-31) — ships the per-page "Embed this" snippet across 144 pages (/define ×135, /tools ×8, /weekly) with a **visible crawlable `<a>`** to the canonical page (the old iframe-only snippet passed zero equity). | Merge + deploy. Then monitor referring domains in GSC for embed adoption. |
| **Resource-page outreach Batch 1** | 3/5 delivered 2026-05-30 (Growth Equity Guide, Visible.vc, Affinity). 0 placements yet. | **Follow-up 2026-06-13** — 1 nudge to non-repliers (check Zoho inbox first). |
| **Researcher outreach (Track 1.4)** | 4 academics emailed 2026-05-09, watch closed, no replies. | Cold; revisit only with a new hook (e.g. a citable result). |

## 🎯 Action queue — ordered by ROI-per-hour (what to do next)

Permanent, zero-reply, dofollow first; reply-dependent last.

1. **[1-click — user] awesome-list PRs (fork+branch ready to push).** Highest ROI: one-time, permanent.
   Token can't open the cross-fork PR, so the flow is: agent forks + pushes `add-gitdealflow` branch →
   user clicks the surfaced compare URL → "Create PR". Viable targets re-validated for editorial fit:
   - `igorbarinov/awesome-data-engineering` → only if a Datasets/Ingestion section fits (entry drafted in github-awesome-lists.md)
   - `best-of-mcp-servers` (tolkonepiu) — likely auto-pulls from awesome-mcp-servers; verify before manual PR
   - Re-check niche VC lists quarterly (most are unmaintained → low value, currently SKIP)
2. **[1-click — user] Resource-page Batch 2** (drafts staged): BrightData, Papermark, Peony, ExtractAlpha,
   BattleFin, FundedIQ, Failory. Hand-crafted per the anti-template rule. Send from warmed Zoho/Resend.
3. **[user] HARO/journalist services** — Help a B2B Writer → Qwoted → Featured → SOS (signup checklist
   ready in haro-signup-checklist.md). Each placement = a high-DA editorial link + named-source E-E-A-T.
4. **[agent, code] Extend embed widgets to high-value ENTITY pages** — build `/embed/signal/[slug]` +
   `/embed/fund/[slug]` cards so a VC writing about a company can embed our momentum card (the most
   citable, most link-worthy surface). Net-new code; the single biggest remaining code-movable lever.

## The one thing that moves E-E-A-T most

≥1 **independent third-party citation** of the SSRN paper / HF dataset (not a self-link). Not yet achieved.
Best path: a placement from #3 (a journalist citing the dataset) or an academic citing the SSRN abstract.
This is the lever that lifts the pseudonymity-capped E-E-A-T axis, which no amount of on-page work can.
