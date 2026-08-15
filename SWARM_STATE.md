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
