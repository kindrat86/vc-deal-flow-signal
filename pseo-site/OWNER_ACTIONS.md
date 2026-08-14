# OWNER ACTIONS — signals.gitdealflow.com

Deploys prepared by the growth loop that the owner must run manually. The
auto-deploy loop is **disabled on purpose** (AGENTS.md) — nothing listed here
has been deployed. Newest entry last.

---

## 2026-08-10 — conversion runbook T2 + T3 (on-page capture on /explore, honest proof on home)

**Commit to ship:** `318240a0` (author `sales@sipiteno.com`)
**Lives in:** `/Users/sipi/growth-loop/sites/signals.gitdealflow.com/worktrees/20260810T041258Z-backlog-conversion-SIGNALS-remainder`
(detached worktree off `main` @ `9cc9e977`; the site is the `pseo-site/` subdir)
**Status:** committed, tree clean, **not deployed**.

### What changed

| file | why |
|---|---|
| `components/InlineSubscribe.tsx` (new) | same-domain email capture; POSTs `/api/subscribe`, honeypot `website` field the route already understands, fires PostHog `signals_inline_subscribed {template, path}` |
| `app/explore/page.tsx` | **T2** — conversion block at the foot of the browse hub: `InlineSubscribe` + link to the real sample issue |
| `components/HomeSqueeze.tsx` | **T3** — real screenshot of `gitdealflow.com/report` beside the squeeze form, linked to that page |
| `public/report-thumbnail.png` (new) | that screenshot, captured live 2026-08-10 (800×560) |
| `scripts/verify-no-regressions.ts` | four assertions covering all of the above, so a tree missing them fails `prebuild` and cannot be deployed by any path |

**Zero fabrication:** the proof is a screenshot of the live sample page plus a
link to it. No subscriber counts, no testimonials, no logo wall — none of those
are substantiated.

### Why this was needed even though it "already shipped"

T2/T3 shipped to `worldclass-signals` on 2026-07-23 (`53718c19`). A live
screenshot check on 2026-08-10 found **neither in production**: `/explore` had
no email input at all, and the homepage had no images and no link to the sample
issue. Another lineage deployed after it and silently reverted it — the exact
multi-lineage race AGENTS.md documents. Hence the assertions: they make any
tree lacking these undeployable rather than merely re-landing them.

### Pre-deploy checks (from AGENTS.md — do not skip)

1. **Swarm race.** `ps aux | grep hermes` — there were **18** hermes processes
   running when this was prepared. Another lineage deploying after you silently
   reverts this. Deploy when the swarm is quiet, and re-check the live pages
   afterwards (below), not just at deploy time.
2. **Do not deploy from `~/signals-gitdealflow/pseo-site`'s working tree** — it
   had **471 uncommitted files** when this was prepared. A working-tree deploy
   ships all of them. Use the export-based command below.
3. **The domain is ALIAS-PINNED.** `vercel --prod` alone does **not** move the
   live site; you must `vercel alias` afterwards.
4. **`.env.local` is gitignored**, so the commit export will not contain it. It
   exists only at `/Users/sipi/signals-gitdealflow/pseo-site/.env.local`. If the
   build needs it, copy it into the export or run `vercel pull`.

### Deploy command (run exactly this)

```bash
~/growth-loop/lib/deploy_from_commit.sh \
  --worktree /Users/sipi/growth-loop/sites/signals.gitdealflow.com/worktrees/20260810T041258Z-backlog-conversion-SIGNALS-remainder \
  --commit 318240a0:pseo-site \
  --build-cmd "npm ci && npx vercel build --prod" \
  --deploy-cmd "npx vercel deploy --prebuilt --prod --archive=tgz" \
  --repo-path /Users/sipi/signals-gitdealflow/pseo-site
```

Notes on why each flag is what it is — these are not interchangeable:

- `--commit 318240a0:pseo-site` — **the `:pseo-site` suffix is required.** The
  script does `git archive "$SHA"`; without the subtree the export root is the
  repo root and Vercel deploys the wrong directory (this is how
  gitdealflow.com's `landing/` deploy 404'd). Verified: it resolves to tree
  `5209037e`.
- `npm ci &&` in the build — the script symlinks `node_modules` from
  `$WORKTREE/node_modules`, but this repo's `node_modules` is at
  `pseo-site/node_modules`, so the symlink does **not** fire and the export
  builds with no dependencies unless you install. `package-lock.json` is
  committed.
- `--deploy-cmd` matches `scripts/deploy-prod.sh`: vanilla
  `vercel deploy --prebuilt --prod` fails with HTTP 400 here — `--archive=tgz`
  is required. Keep it prebuilt; cloud builds trip the $30 spend cap that
  auto-pauses every project at once.
- `--repo-path` supplies `.vercel/project.json` (gitignored, so the export
  can't have it). It exists **only** at
  `/Users/sipi/signals-gitdealflow/pseo-site/.vercel/` — without this flag the
  script aborts rather than creating a new Vercel project.

The script gates on a clean tree, runs `prebuild` (which runs
`verify-no-regressions`) and `verify-jsonld.mjs` against the bytes about to be
uploaded, and keeps the export directory on failure — inspect the printed path
rather than re-running blindly.

**Then re-alias** (note the deployment URL the command prints):

```bash
npx vercel alias <deployment-url> signals.gitdealflow.com
```

### Verify AFTER aliasing — screenshot only

`curl` returning 200 has hidden a fully blank page on this site before. Open
these in a real browser and look at them:

- `https://signals.gitdealflow.com/explore` → email input **and** "Read a sample
  issue" present at the foot of the page
- `https://signals.gitdealflow.com/` → the sample-issue thumbnail is **visible**
  (a real screenshot, not an empty bordered box) below the squeeze form

Re-check both again ~10 minutes later. A pass immediately after deploy proves
only that moment; the failure mode here is another lineage aliasing over you.

### ⚠️ Landmine found while doing this — deliberately NOT fixed here

`public/ux.css:371` sets `img[loading="lazy"] { opacity: 0 }` and only reveals
the image via a `.loaded` class added by `public/ux.js` — but ux.js was removed
on 2026-07-21 for blank-screening the site and must not be restored.

**Every `<img loading="lazy">` on this site is therefore invisible in
production** (~13 of them across `app/` and `components/`). The T3 thumbnail
omits `loading="lazy"` to dodge this, with a comment so nobody re-adds it. The
underlying rule is untouched — out of scope here, and it wants its own
screenshot pass across every page using lazy images. Tracked in `plan.md` as
`ux-css-lazy-image-opacity-landmine`.

---

## 2026-08-11 — `measure-gsc-wrong-day-of-record` (measurement infra) — **NO SITE DEPLOY**

**Commit to ship:** none. **Deploy command: do not run one for this entry.**
**Status:** no site files were changed; nothing to deploy.

This entry exists so the record is complete, not because there is a deploy
pending. The defect was in the growth loop's own measurement code, not in the
site. The worktree
`/Users/sipi/growth-loop/sites/signals.gitdealflow.com/worktrees/20260811T041156Z-measure-gsc-wrong-day-of-record`
is clean and still at `d47402bf` — the previous iteration's commit, untouched.

### What changed (all outside this repo)

| file | repo | state |
|---|---|---|
| `engine/lib/gsc.py` | `~/growth-harness` | **committed** as `fa2a498` (author `sales@sipiteno.com`), explicit path only |
| `lib/measure.py` | `~/growth-loop` | **edited, uncommitted — cannot be committed** |
| `README.md` | `~/growth-loop` | **edited, uncommitted — cannot be committed** |

`measure.py` asked `GSCClient` for a date range, but the class only exposed
`fetch_day`, so its `except AttributeError` fallback reported the window's
**first day** as the 28-day figure — with `_status: ok`, so nothing looked
wrong. Measured against this property for 2026-07-15→2026-08-11:

| | clicks | impressions | avg_position |
|---|---|---|---|
| old path (`fetch_day(start_day)`) | 4 | 1,009 | 10.01 |
| new path (`fetch_range(start, end)`) | 51 | 26,617 | 10.82 |

So every snapshot this loop has taken understated clicks ~13× and impressions
~26×. `fetch_day`'s body moved verbatim into a private `_fetch_window(start,
end)` and `fetch_day(p, day)` is now `_fetch_window(p, day, day)` — behaviour
identical, so `engine/snapshot.py` (the only other caller) is unaffected. The
fallback in `measure.py` is now an explicit `hasattr` check that records
`_status: "error"` rather than `ok` over wrong data.

### Owner action — the only one this entry asks for

**`~/growth-loop` is not a git repository**, so the `measure.py` and `README.md`
edits above exist only in the working tree and will be lost silently if that
directory is ever reset, re-cloned, or swept. If you want them kept, put it
under version control:

```bash
git -C ~/growth-loop init && git -C ~/growth-loop add lib/measure.py README.md
```

Decide on a `.gitignore` for `sites/*/logs/` before staging anything broader —
those directories hold every iteration transcript and would dominate the repo.

### Caveats

- **Historical `metrics-*.json` are not trendable.** Every file written before
  2026-08-11 carries single-day GSC figures labelled as a 28-day window. They
  were **not** rewritten or deleted; `~/growth-loop/README.md` now flags them.
  The next MEASURE run produces the first correct snapshot, and only from then
  can site-side tasks be scored against search data.
- GSC's ~3-day reporting lag is unchanged and intentional (it matches
  `snapshot.py`), so the last ~3 days of a window ending today are legitimately
  thin. `end_day` was deliberately **not** clamped — that would silently
  desynchronise the GSC window from the PostHog window in the same file. The
  payload now states the window it queried instead.
- Unrelated: the **2026-08-10 entry above is still pending**. Its commit
  `318240a0` is not an ancestor of `main`'s `d47402bf` — it lives only on
  branch `growth-loop/signals.gitdealflow.com-20260810T041258Z`. Nothing in
  this entry supersedes it or affects it.

---

## 2026-08-12 — `ux-css-lazy-image-opacity-landmine` (every lazy image invisible in production)

**Commit to ship:** `d83a338d` (author `sales@sipiteno.com`)
**Lives in:** `/Users/sipi/growth-loop/sites/signals.gitdealflow.com/worktrees/20260812T041620Z-ux-css-lazy-image-opacity-landmine`
(detached worktree off `main` @ `e5e82e42`; the site is the `pseo-site/` subdir. Export tree `a3e67eda`)
**Status:** committed, tree clean, **not deployed**.

This is the fix for the landmine the 2026-08-10 entry above found and
deliberately left alone.

### What changed (two files, nothing else)

| file | why |
|---|---|
| `public/ux.css` | deleted `img[loading="lazy"] { opacity: 0; transition: … }` and its `.loaded { opacity: 1 }` partner (section 17), plus the now-dead `img[loading="lazy"] { opacity: 1 }` override in the `prefers-reduced-data` block (section 38) that existed only to cancel the fade. An explanatory comment replaces them. |
| `scripts/verify-no-regressions.ts` | new guard 3b asserting the `opacity: 0` rule is absent, so any lineage that reintroduces it fails `prebuild` and cannot be deployed by any path. Its hint says explicitly **not** to "fix" a failure by restoring `/ux.js`. |

The `.loaded` class came from `/ux.js`, removed 2026-07-21 for blank-screening
the App Router site — **it must not be restored**. With the JS gone the rule
left **29** `<img loading="lazy">` across five pages rendering at opacity 0.

### Verification already done (screenshot, not curl)

Local `next dev` + Chromium/Playwright over the five pages that actually contain
lazy images — `/badge-builder` (12), `/embed` (12), `/built-with` (3),
`/startup/huggingface` (1), `/watch/walkthrough-vsl` (1) — scrolled to bottom so
each image enters the viewport:

- **after the fix:** 29/29 at computed opacity 1; badge tiles and the YouTube
  poster visibly render.
- **before (same run, the two deleted rules re-injected via Playwright — no file
  was reverted):** 29/29 at opacity < 1, blank tiles and blank poster.

Evidence in `~/growth-loop/sites/signals.gitdealflow.com/logs/evidence-20260812T041620Z/`.
`npx tsx scripts/verify-no-regressions.ts` passes on this tree, and the new
regex was checked against the exact deleted rule text (the guard would have
caught the bug).

### Pre-deploy checks (from AGENTS.md — do not skip)

1. **Swarm race.** `ps aux | grep hermes` — **10** hermes processes were running
   when this was prepared. Another lineage deploying after you silently reverts
   this. Deploy when the swarm is quiet and re-check the live pages afterwards,
   not just at deploy time.
2. **Do not deploy from `~/signals-gitdealflow/pseo-site`'s working tree** — it
   had **427 uncommitted files** when this was prepared. Use the export-based
   command below.
3. **The domain is ALIAS-PINNED.** `vercel --prod` alone does not move the live
   site; you must `vercel alias` afterwards.
4. **Ordering vs. the 2026-08-10 entry.** `318240a0` is **not** an ancestor of
   this commit (checked), so `d83a338d` does not contain T2/T3 — no
   `InlineSubscribe` on `/explore`, no home thumbnail, and none of that entry's
   four assertions. If you have already shipped `318240a0`, deploying this
   commit **reverts it**. Ship `318240a0` first, then rebase/cherry-pick this
   two-file change on top of it, or cherry-pick `d83a338d` onto that lineage and
   deploy the result. Deploying both independently, in either order, loses one
   of them.
5. **`.env.local` is gitignored** so the export will not contain it; it exists
   only at `/Users/sipi/signals-gitdealflow/pseo-site/.env.local`. Copy it into
   the export or run `vercel pull` if the build needs it.

### Deploy command (run exactly this)

```bash
~/growth-loop/lib/deploy_from_commit.sh \
  --worktree /Users/sipi/growth-loop/sites/signals.gitdealflow.com/worktrees/20260812T041620Z-ux-css-lazy-image-opacity-landmine \
  --commit d83a338d:pseo-site \
  --build-cmd "npm ci && npx vercel build --prod" \
  --deploy-cmd "npx vercel deploy --prebuilt --prod --archive=tgz" \
  --repo-path /Users/sipi/signals-gitdealflow/pseo-site
```

Flag rationale is unchanged from the 2026-08-10 entry: `:pseo-site` because the
site is a subdir (without it Vercel gets the repo root and 404s), `npm ci`
because the script's `node_modules` symlink does not fire for a subdir repo,
`--archive=tgz` because plain `vercel deploy --prebuilt --prod` returns HTTP 400
here, `--repo-path` to supply the gitignored `.vercel/project.json`. Keep it
prebuilt — cloud builds trip the $30 spend cap that auto-pauses every project.

If `npm ci` fails at puppeteer's postinstall (blocked browser download, npm then
rolls back `node_modules` entirely), prefix the build with
`PUPPETEER_SKIP_DOWNLOAD=1`.

**Then re-alias** (note the deployment URL the command prints):

```bash
npx vercel alias <deployment-url> signals.gitdealflow.com
```

### Verify AFTER aliasing — screenshot only

`curl` returning 200 has hidden a fully blank page on this site before. Open
these in a real browser, scroll to the bottom so the lazy images load, and look:

- `https://signals.gitdealflow.com/badge-builder` → the 12 momentum badges under
  "Live examples" are **visible**, not blank tiles
- `https://signals.gitdealflow.com/built-with` → the three badges render
- `https://signals.gitdealflow.com/watch/walkthrough-vsl` → the YouTube poster
  image is visible, not an empty box

Re-check ~10 minutes later. A pass immediately after deploy proves only that
moment; the failure mode here is another lineage aliasing over you.
---

## 2026-08-13 — internal links into the /research-paper silo (striking-distance work on /research-paper/hu-2021-lora-low-rank-adaptation)

**Commit to ship:** `20e761e4` — *feat(define): link glossary terms back into
the /research-paper silo* (this OWNER_ACTIONS entry lands in a separate
docs-only commit on top; it does not need to ship).
**Lives in:** `/Users/sipi/growth-loop/sites/signals.gitdealflow.com/worktrees/20260813T042220Z-harness-action-internal_links-https:/signals.gitdealflow.com/research-paper/hu-2021-lora-low-rank-adaptation`
(detached worktree off `1b1ad5a0`; the site is the `pseo-site/` subdir)
**Status:** implemented + verified on `next dev` by screenshot, **not deployed**.

### What changed

| file | why |
|---|---|
| `app/define/[term]/page.tsx` | new "Source research on <term>" section — reverse-indexes `content/research-papers.ts` `relatedGlossaryIds` and links the papers that ground each term |
| `scripts/verify-no-regressions.ts` | one assertion so a lineage without that section cannot build |

### Why

`/research-paper/hu-2021-lora-low-rank-adaptation` is a striking-distance page
with only **4 inbound internal links**, all auto-generated siblings inside its
own `/research-paper` silo (`data/internal-links.json`). The paper leaves
already linked *out* to `/define/[term]`, but nothing linked back. The reverse
index adds 4 cross-silo inbound links to the LoRA paper — from `/define/lora`,
`/define/fine-tuning`, `/define/foundation-model`, `/define/open-weight-model` —
with the paper title as anchor text. The other 8 paper leaves gain the same
treatment from the same code path. No new copy was invented: venue, year, title
and the summary line all come from `content/research-papers.ts`.

`data/internal-links.json` was deliberately NOT hand-edited — it is regenerated
from the live sitemaps by `scripts/build-internal-links.ts`, so an edit there
would be overwritten on the next run.

### Pre-deploy checks (AGENTS.md)

- **Which lineage is live?** The domain is alias-pinned and deployed from at
  least three checkouts (`~/Downloads/vc-deal-flow-signal` on `main`,
  `~/signals-worldclass` on `worldclass-signals`, `~/signals-gitdealflow` on
  `internal-link-engine`). Whichever aliases last wins. `20e761e4` is built on
  `1b1ad5a0`; if production has moved past that, cherry-pick rather than alias
  over the newer lineage.
- **Check for swarm races first:** `ps aux | grep hermes` — another agent
  mid-deploy will silently revert this.
- `prebuild` runs `verify-no-regressions.ts`, which now asserts this section
  exists. A stale lineage will fail the build rather than revert the fix. Do
  not edit the guard to make a build pass.
- `vercel --prod` alone does NOT move the domain — the alias step below is
  mandatory.

### Deploy command (same flags as the 2026-08-12 entry; rationale unchanged)

```bash
~/growth-loop/lib/deploy_from_commit.sh \
  --worktree "/Users/sipi/growth-loop/sites/signals.gitdealflow.com/worktrees/20260813T042220Z-harness-action-internal_links-https:/signals.gitdealflow.com/research-paper/hu-2021-lora-low-rank-adaptation" \
  --commit 20e761e4:pseo-site \
  --build-cmd "npm ci && npx vercel build --prod" \
  --deploy-cmd "npx vercel deploy --prebuilt --prod --archive=tgz" \
  --repo-path /Users/sipi/signals-gitdealflow/pseo-site
```

Then re-alias: `npx vercel alias <deployment-url> signals.gitdealflow.com`.

### Verify AFTER aliasing — screenshot only

- `https://signals.gitdealflow.com/define/lora` → a **"Source research on LoRA
  (Low-Rank Adaptation)"** section sits between "Related terms" and "Citation",
  with one card linking to the LoRA paper
- `https://signals.gitdealflow.com/define/foundation-model` → the same section
  lists **six** paper cards
- `https://signals.gitdealflow.com/research-paper/hu-2021-lora-low-rank-adaptation`
  → still renders (non-blank), unchanged by this diff

Re-check ~10 minutes later. A pass immediately after deploy proves only that
moment; the failure mode here is another lineage aliasing over you.

### Notes

- Section blurb was corrected before commit: it read "The academic papers
  behind this term … canonical arXiv/Semantic Scholar links", but
  `forsgren-2018-accelerate-dora-research` (the card on `/define/commit-velocity`)
  is a book with no arXiv ID. Now reads "The research behind this term,
  summarised with key findings and canonical source links" — true for all nine
  entries. `tsc --noEmit` and `npm run verify:no-regressions` re-run clean after
  the edit.
- Known, NOT fixed here (out of scope): four `relatedGlossaryIds` in
  `content/research-papers.ts` point at glossary ids that do not exist —
  `vector-database` (lewis-2020-rag) and `compute-efficiency`,
  `model-capacity`, `conditional-computation` (all shazeer-2017-mixture-of-experts).
  They are filtered out silently on both sides, so they are missed links rather
  than broken ones — but the MoE paper gains no inbound links from this change
  until they are corrected.
