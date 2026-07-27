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
- УВЕСЬ текст ЦЕНТРОВАНИЙ (власник підтвердив 2026-07-25). Це скасовує стару
  систему "headings центровані / body ліворуч" — не повертати без прямої вказівки.
  Правила: `body { text-align: center }` + `main, main *` з `!important` у
  `app/globals.css`; `pre`/`code` лишаються ліворуч. ~61 статична сторінка в
  `public/` не тягне ані globals.css, ані ux.css — для них є
  `scripts/center-static-pages.sh` (ідемпотентний, за маркером)
- ⚠️ Центрувати ТЕКСТ мало — треба центрувати ще й КОРОБКИ. `ux.css` підключений
  БЕЗ каскадного шару, а Tailwind v4 тримає утиліти в `@layer utilities`, і
  нешарова декларація б'є будь-який шар незалежно від специфічності. Через це
  `*, *::before, *::after { margin: 0; padding: 0 }` в ux.css перебивало КОЖЕН
  `mx-auto` / `px-*` / `mt-*` у застосунку: на /methodology при 1280px
  `div.max-w-3xl.mx-auto` мав `margin-left: 0` і стояв на x 0..768 — усі колонки
  тулилися ліворуч без полів. Скидання márginʼів має жити в Tailwind preflight
  (`@layer base`), НЕ в ux.css. Той самий клас багу вже ловили на кольорі кнопок
  (`58a152a1`). Перевірка: `getComputedStyle($0).marginLeft` на `.mx-auto`
- Auto-deploy loop ВИМКНЕНО навмисно — не вмикати
- Верифікація ТІЛЬКИ скріншотом: curl 200 вже приховував порожню сторінку
- Гейти деплою: чисте дерево, clean-tree gate; перед правками перевір `ps aux | grep hermes` (сворм-гонки)
