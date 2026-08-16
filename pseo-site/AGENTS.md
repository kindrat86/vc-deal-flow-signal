<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes, APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Author identity in JSON-LD, never hand-roll it

"The Data Nerd" is the site's single pseudonymous author entity. For
E-E-A-T, every `author` / `accountablePerson` / `spokenByCharacter` /
`creator` Person node MUST reconcile to ONE entity. There is exactly one
canonical `@id`: `https://signals.gitdealflow.com/about#person`, and the
authoritative full node is emitted on `/about`.

**Rule:** import from `@/lib/data-nerd`, never write an inline author Person.

- `DATA_NERD_AUTHOR_REF`, use for `author` / `accountablePerson` /
  `spokenByCharacter` / `creator` fields. Carries the canonical `@id`, the
  ORCID `PropertyValue`, and the full verified `sameAs` set.
- `DATA_NERD_PERSON_SCHEMA`, the full node; emit only on `/about` and
  `/data-nerd` (high-authority profile pages).
- `DATA_NERD_AUTHOR_ID` / `DATA_NERD_AUTHOR_SAMEAS`, the raw id + anchor
  list if you need a bare `{ "@id": DATA_NERD_AUTHOR_ID }` pointer.

Hard "don'ts": no second `@id` (no `#author`, no per-page ids); never add a
real name/face/voice (anonymity is a design pillar, see `lib/data-nerd.ts`);
only add a `sameAs` URL that is already published and vetted in `/citations`.
Wikidata `Q139376302` is the *brand* entity, it belongs on the
Organization node, never on the Person.

# Деплой і граблі (signals.gitdealflow.com)

- Канонічний лайнідж: `main` у `~/signals-gitdealflow` (див. секцію "One canonical deploy lineage" нижче); worldclass-signals та Downloads RETIRED 2026-08-12
- Домен: `vercel deploy --prebuilt --prod` САМ аліасить live (рядок "▲ Aliased", перевірено 08-16/08-18) → окремий `vercel alias` ЗАЙВИЙ і створює гонку. Після деплою перевір `vercel inspect signals.gitdealflow.com`, бо сворм може обігнати (last-deploy-wins)
- CSP `require-trusted-types-for` → React-сайт стає ПОРОЖНІМ без Trusted Types policy (fix у commit 22d6de1c). Це протилежний фікс до gitdealflow/churnlens PostHog-кейсу
- `/ux.js` у layout.tsx блank-скринив сайт (App Router hydration wipe), видалено, НЕ повертати; ux.css можна
- Headings/heroes ЦЕНТРОВАНІ, body-текст ЛІВОРУЧ, свідома система вирівнювання
- Auto-deploy loop ВИМКНЕНО навмисно, не вмикати
- Верифікація ТІЛЬКИ скріншотом: curl 200 вже приховував порожню сторінку
- Гейти деплою: чисте дерево, clean-tree gate; перед правками перевір `ps aux | grep hermes` (сворм-гонки)

# Multiple agents share this worktree, check before you commit/deploy

2026-07-24: two independent Claude Code sessions worked in the same
worktree at the same time with zero coordination, one fixing `/pricing`
founding-rate copy, the other doing GSC schema fixes and an MCP-catalog
build-guard fix. It mostly resolved fine because the file-level changes did
not overlap, but along the way: three separate `vercel deploy --prebuilt
--prod` processes queued concurrently against the same project (real
contention, nothing progressing for minutes), the live
`signals.gitdealflow.com` alias changed to an unrecognized deployment
mid-session with no warning, and a blind `git stash pop` grabbed the other
session's WIP stash instead of mine (recoverable via `git stash list`, but
only because I checked before assuming).

**Before you touch this worktree:**
- `ps aux | grep -E "vercel (deploy|build)"`: if a deploy is already
  running for this project, wait or coordinate rather than queueing a
  second concurrent one.
- `git stash list` BEFORE any `git stash pop`: if there is more than one
  entry, pop by explicit `stash@{n}` (matched by its message), never a bare
  `pop`. A bare pop grabs whichever stash landed most recently, which may
  not be yours.
- After any deploy attempt, re-check `vercel inspect signals.gitdealflow.com`
  before assuming your build is what is live. Another process may have
  deployed first; cancel your redundant queued build with
  `vercel remove <url> --yes` rather than racing the alias.
- If a stash pop conflicts on a file you never intentionally edited, check
  `git log -- <file>` first. HEAD may already carry a real committed fix
  from another session; keep HEAD's version and discard your stale stashed
  copy.

# One canonical deploy lineage (sentinel-enforced since 2026-08-12)

The domain is an alias-pinned Vercel project (`pseo-site`). It used to be
deployed from multiple checkouts on multiple branches, and whichever deploy
ran last silently reverted the others' fixes (on 2026-08-03/04 that put
deactivated Stripe payment links and post-payment 404s back into
production). That era is over: on 2026-08-12 the lineages were resolved
down to ONE canonical tree, and a sentinel file makes it impossible to
deploy from a stale one.

| checkout | branch | role |
|---|---|---|
| `~/signals-gitdealflow/pseo-site` | `main` | **CANONICAL. Work and deploy from here only.** |
| `~/signals-worldclass/pseo-site` | `worldclass-signals` | RETIRED 2026-08-12. Do not work here, do not deploy from it. |
| `~/Downloads/vc-deal-flow-signal` | (checkout removed) | RETIRED. Do not deploy from any stray copy. |

Every checkout carries `pseo-site/.deploy-lineage` (sentinel with
`role=CANONICAL` or `role=RETIRED`). `scripts/assert-canonical-lineage.mjs`
checks it FIRST in `prebuild`: a missing or RETIRED sentinel fails the
build, so no stale tree can deploy through any path.

Do not edit `.deploy-lineage` or the lineage guard to make a build pass.
That is fixing the test, not the tree. If that failure appears, you are in
the wrong checkout: switch to `~/signals-gitdealflow/pseo-site` on `main`.

**A fix is not done when it is deployed. It is done when a tree that lacks
it cannot build.**

`scripts/verify-no-regressions.ts` runs in `prebuild`, so every deploy path
(scheduled task, agent, temp-worktree deploy via
`~/growth-loop/lib/deploy_from_commit.sh`, `scripts/deploy-prod.sh`, manual
`vercel build`) fails on a regressed tree. When you fix a defect that would
be expensive to re-discover, add a content assertion there in the same
commit. Run it standalone with `npm run verify:no-regressions`.

Do not "fix" a guard failure by editing the guard. It is telling you the
tree you are about to deploy is older than production.
