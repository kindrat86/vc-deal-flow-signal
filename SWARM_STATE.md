# Swarm State, ~/signals-gitdealflow (recorded 2026-08-14 ~17:50 EEST)

## What "swarm active" means
A concurrent agent (or agents) is committing and deploying signals.gitdealflow.com
at high frequency. Observed ~10 production Vercel deploys in the last hour, with
HEAD advancing multiple times at peak. Lineage resolved since 2026-08-12:
single canonical `main` in ~/signals-gitdealflow (sentinel-enforced). The
remaining hazard is agents racing commits/deploys on that one lineage.

## Current state (at record time)
- HEAD: c904201b (moving; was 38f8e290 when the guard was pushed and deployed)
- commits in prior 15 min: 6
- active deploy processes: 0 (a deploy of 38f8e290 completed successfully)
- uncommitted tracked files: ~130 (normal for this repo mid-sweep)

## Already DONE (do not redo)
- Crawl-delay removal in pseo-site/public/robots.txt: LIVE (0 Crawl-delay lines).
- verify-no-regressions.ts section 12 (Crawl-delay absence assertion): committed,
  pushed (origin/main at 38f8e290), and baked into the 38f8e290 production build.
  Verified pass (exit 0) and catch (exit 1).
- Both fixes survive in HEAD c904201b (assertion = 5 Crawl-delay matches,
  robots.txt = 0).

## "Settled" = quiesced
Per swarm-quiesce-check.sh: no pseo-site source changes for 12 minutes (excluding
node_modules / .next / .vercel / build artifacts). The existing
gitdealflow-quiesce-deploy cron (every 5m) auto-deploys on this transition.

## Circle-back (folded into the existing quiesce-deploy cron)
The Crawl-delay integrity check is folded into the gitdealflow-quiesce-deploy cron
(e5831f74d828, every 5m, monitor swarm-quiesce-check.sh): its STEP 2(e) verifies,
after the clean deploy, that live robots.txt has 0 Crawl-delay lines and that
verify-no-regressions.ts still carries the section 12 guard (5 matches).

## 2026-08-18 PAA-40 RESOLVED (was a live-content warning; merge complete, do not redo)
The 2026-08-18 warning is OBSOLETE. The swarm carried the deployed PAA lineage into
main itself (bf53580a "Bases: deployed PAA lineage (01d373ca)" + e59c4e36 answers
restore after the 58f99447 lineage reset). Verified in main 2026-08-18: all 27 pair
questions + answers-page + acquirer FAQs present (11 faqs blocks in
content/competitor-vs.ts + agent-queries.ts + acquirer template).
Defect found+fixed at merge time (3e8b9d8e): sibling's direction-consolidation 308
(/vs/cb-insights-vs-crunchbase -> /vs/crunchbase-vs-cb-insights) had stranded the
4 CB Insights entity FAQs on the redirected slug's data block; now moved to the
canonical block and the SS40 guard is SLUG-BOUND (extracts the canonical pair's
block, asserts questions live inside it -> any future consolidation that strands
FAQs fails the build). IndexNow ping script restored to main (a711df6f) with the
canonical URL; fired 200 (13 URLs). Branch paa-40 is redundant (only commit
34b74c27, its content shipped in a711df6f) -> branch + /private/tmp/paa-worktree-40
removable. Baseline for the 2026-09-02 re-score cron (gdf-paa-rescore
ce1e2443a746): data/paa-candidates.json (14 queries, 450 imps, 0 clicks).
