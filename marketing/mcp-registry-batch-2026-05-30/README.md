# MCP Registry Batch — diligence tool + v1.8.0 propagation

**Date:** 2026-05-30
**Trigger:** `get_diligence_dossier` shipped across the whole agent surface (PR
`feat/agent-diligence-grounding`). This doc is the runbook to propagate the new
capability (and the version bump) to the MCP registry ecosystem.

> **Headline for every submission:** the server now answers diligence questions
> — *who acquired X · which funds backed Y · what's the signal on Z* — in one
> cited dossier, on top of the existing engineering-signal tools. Public-source,
> honest `found:false` (never guesses), CC BY 4.0.

---

## ⚠️ Pre-flight #1 — reconcile the version split BEFORE any registry push

The npm version is currently inconsistent across four places. The official MCP
registry **rejects** a `server.json` whose version doesn't match a *published*
npm version, so this must be fixed first:

| Location | Current value |
|---|---|
| npm published (`npm view @gitdealflow/mcp-signal version`) | `1.7.0` |
| `mcp-server/package.json` (this branch) | `1.8.0` |
| `mcp-server/src/server.ts` → `SERVER_VERSION` | `2.0.0` |
| `mcp-server/server.json` → `version` + `packages[0].version` | `2.0.0` |

**Action (maintainer):** pick ONE next version `> 1.7.0` (and `>` whatever the
`claude/corpus-feed-2026-05-30` sibling branch publishes — it adds
`predict_funding`/`shortlist_signals`/`compare_signals`). Suggest **`2.1.0`** if
merging both, or `1.8.0` if shipping this branch alone. Then align all four
fields, `npm publish`, and only then update `server.json` + republish to the
registry. Do not `mcp-publisher publish` against an unpublished version.

## Pre-flight #2 — the PAT blocker (for PR-based registries)

Cross-fork PRs are blocked by the current OAuth token scope (see
`feedback_gh_cli_cross_fork_pr_blocked`). The official MCP registry, Glama, and
Smithery do **not** need it (CLI / manifest / auto-index). Cursor-directory and
any awesome-list PRs **do** — set a fine-grained `GITHUB_TOKEN` (repo + PR
scope) as env before firing those, or I ship the branch and hand you a 1-click
compare URL.

---

## The leverage move: publish once, propagate everywhere

The **official MCP registry is the hub** — PulseMCP, mcp.directory, mcp.so,
and Glama all auto-index from it. The repo is already wired for it
(`mcp-server/server.json`, namespace `io.github.kindrat86/vc-deal-flow-signal`).
So ~80% of the ecosystem updates from a single republish.

```bash
# from mcp-server/ , after the version reconcile + npm publish
mcp-publisher login            # GitHub device flow → authorizes io.github.kindrat86/*
mcp-publisher publish server.json
```

---

## Registry runbook

| Registry | Mechanism | Needs PAT? | Propagates from official? | Action |
|---|---|---|---|---|
| **Official MCP Registry** (`registry.modelcontextprotocol.io`) | `mcp-publisher publish server.json` | No | — (it *is* the hub) | Reconcile version → `npm publish` → `mcp-publisher publish`. **Do first.** |
| **PulseMCP** (`pulsemcp.com`) | Auto-index from official registry | No | ✅ | Verify listing refreshes ~24–48h after the official publish; if stale, use their "submit/refresh" form. |
| **mcp.directory** | Auto-index from official registry | No | ✅ | Same — verify, no manual action expected. |
| **mcp.so** | Auto-index + optional submit form | No | mostly | Verify; submit via form if the new tool/desc doesn't refresh. |
| **Glama** (`glama.ai`) | `glama.json` (already in repo, A-tier) | No | partial | Re-scan triggers on npm republish. Confirm the diligence tool shows + score holds A-tier. |
| **Smithery** (`smithery.ai`, Verified 98/100) | Manifest re-scan on npm republish | No | — | Confirm tool count + description update post-publish. |
| **Cursor Directory** (`cursor.directory/mcp`) | PR to their repo / submit form | **Yes (if PR)** | No | Update the listing blurb with the diligence capability. Ship branch + 1-click URL when PAT is set. |
| **awesome-mcp-servers** (#4933, merged) | One-line entry already live | **Yes (to edit)** | No | Optional: refresh the one-liner to mention diligence. Low priority. |

---

## Ready-to-paste copy

**Package:** `@gitdealflow/mcp-signal` · `npx -y @gitdealflow/mcp-signal`
**Namespace:** `io.github.kindrat86/vc-deal-flow-signal`
**Canonical tool list:** https://signals.gitdealflow.com/.well-known/mcp.json
**HTTP transport:** https://signals.gitdealflow.com/api/mcp/rpc
**Skills manifest:** https://signals.gitdealflow.com/.well-known/skills.json

**Short description (≤160 chars):**
> GitHub signals for VC deal flow — trending startups, commit velocity, and a
> public-source diligence dossier (who acquired X, who backed Y, signal on Z).

**Long description:**
> Read-only MCP server exposing engineering-acceleration signals across 20
> sectors of venture-backed startups, refreshed weekly. New: `get_diligence_dossier`
> returns a single cited, public-source dossier for any company — its M&A
> history (who acquired it), disclosed investors (which funds backed it), and
> published engineering signal — with an honest `found:false` when an entity is
> outside the tracked corpus (it never guesses). Sources held to a press-release
> / SEC-filing / both-sides-disclosed threshold. CC BY 4.0, SSRN-grounded
> methodology (abstract 6606558).

**New-tool blurb (for changelog-style fields):**
> `get_diligence_dossier(company)` — who acquired it · which funds backed it ·
> what's the engineering signal. One cited object, found:false never a guess.

---

## Verification checklist (post-publish)

- [ ] `npm view @gitdealflow/mcp-signal version` == the reconciled version
- [ ] `npx -y @gitdealflow/mcp-signal` lists `get_diligence_dossier` in tools/list
- [ ] Official registry entry shows the new version
- [ ] PulseMCP / mcp.directory / Glama / Smithery reflect the diligence tool (≤48h)
- [ ] `https://signals.gitdealflow.com/.well-known/mcp.json` already shows it (shipped in this PR)

## Already done (no action) — per memory

Smithery (Verified 98/100), Glama (A-tier), awesome-mcp-servers (#4933 merged),
Cline (`mcp-marketplace#1491`), Raycast (`extensions#28376`). This batch only
adds the **diligence tool + version** on top of those existing listings.
