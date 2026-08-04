<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Author identity in JSON-LD — never hand-roll it

"The Data Nerd" is the site's single pseudonymous author entity. For
E-E-A-T, every `author` / `accountablePerson` / `spokenByCharacter` /
`creator` Person node MUST reconcile to ONE entity. There is exactly one
canonical `@id`: `https://signals.gitdealflow.com/about#person`, and the
authoritative full node is emitted on `/about`.

**Rule:** import from `@/lib/data-nerd`, never write an inline author Person.

- `DATA_NERD_AUTHOR_REF` — use for `author` / `accountablePerson` /
  `spokenByCharacter` / `creator` fields. Carries the canonical `@id`, the
  ORCID `PropertyValue`, and the full verified `sameAs` set.
- `DATA_NERD_PERSON_SCHEMA` — the full node; emit only on `/about` and
  `/data-nerd` (high-authority profile pages).
- `DATA_NERD_AUTHOR_ID` / `DATA_NERD_AUTHOR_SAMEAS` — the raw id + anchor
  list if you need a bare `{ "@id": DATA_NERD_AUTHOR_ID }` pointer.

Hard "don'ts": no second `@id` (no `#author`, no per-page ids); never add a
real name/face/voice (anonymity is a design pillar — see `lib/data-nerd.ts`);
only add a `sameAs` URL that is already published and vetted in `/citations`.
Wikidata `Q139376302` is the *brand* entity — it belongs on the
Organization node, never on the Person.

# Деплой і граблі (signals.gitdealflow.com)

- Live source = гілка `worldclass-signals` через worktree, НЕ main
- Домен ALIAS-PINNED: `vercel --prod` НЕ оновлює live — треба `vercel alias` на новий деплой
- CSP `require-trusted-types-for` → React-сайт стає ПОРОЖНІМ без Trusted Types policy (fix у commit 22d6de1c). Це протилежний фікс до gitdealflow/churnlens PostHog-кейсу
- `/ux.js` у layout.tsx блank-скринив сайт (App Router hydration wipe) — видалено, НЕ повертати; ux.css можна
- Headings/heroes ЦЕНТРОВАНІ, body-текст ЛІВОРУЧ — свідома система вирівнювання
- Auto-deploy loop ВИМКНЕНО навмисно — не вмикати
- Верифікація ТІЛЬКИ скріншотом: curl 200 вже приховував порожню сторінку
- Гейти деплою: чисте дерево, clean-tree gate; перед правками перевір `ps aux | grep hermes` (сворм-гонки)
  which case keep HEAD's version and discard your stale stashed copy.

# signals.gitdealflow.com is deployed from MORE THAN ONE lineage — read this before fixing anything

The domain is an alias-pinned Vercel project (`pseo-site`) that is deployed
from at least three checkouts, on three different branches:

| checkout | branch |
|---|---|
| `~/Downloads/vc-deal-flow-signal/pseo-site` | `main` |
| `~/signals-worldclass/pseo-site` | `worldclass-signals` |
| `~/signals-gitdealflow/pseo-site` | `internal-link-engine` |

**Whichever deploys last wins.** A fix landed on one lineage is silently
reverted the moment another lineage deploys. This is not theoretical — on
2026-08-03/04 it put deactivated Stripe payment links and post-payment 404s
back into production, days after they were fixed and verified live.

**Therefore: a fix is not done when it is deployed. It is done when a tree
that lacks it cannot build.**

`scripts/verify-no-regressions.ts` runs in `prebuild`, so every deploy path
(scheduled task, agent, temp-worktree deploy via
`~/growth-loop/lib/deploy_from_commit.sh`, `scripts/deploy-prod.sh`, manual
`vercel build`) fails on a regressed tree. When you fix a defect that would
be expensive to re-discover, add a content assertion there in the same
commit. Run it standalone with `npm run verify:no-regressions`.

Do not "fix" a guard failure by editing the guard. It is telling you the
tree you are about to deploy is older than production.
