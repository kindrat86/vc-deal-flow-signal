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

# Multiple agents share this worktree — check before you commit/deploy

2026-07-24: two independent Claude Code sessions worked in
`~/signals-worldclass` at the same time with zero coordination — one fixing
`/pricing` founding-rate copy, the other doing GSC schema fixes and an
MCP-catalog build-guard fix. It mostly resolved fine because the file-level
changes didn't overlap, but along the way: three separate `vercel deploy
--prebuilt --prod` processes ended up queued concurrently against this same
project (real contention, nothing progressing for minutes), the live
`signals.gitdealflow.com` alias changed to an unrecognized deployment
mid-session with no warning, and a blind `git stash pop` grabbed the *other*
session's WIP stash instead of mine (recoverable — `git stash list` still
had both — but only because I checked before assuming).

**Before you touch this worktree:**
- `ps aux | grep -E "vercel (deploy|build)"` — if something's already
  deploying this project, wait or coordinate rather than adding a second
  concurrent deploy.
- `git stash list` **before** any `git stash pop` — if there's more than one
  entry, pop by explicit `stash@{n}` (matched by its message), never a bare
  `pop`. A bare pop always grabs whichever stash landed most recently,
  which may not be yours.
- After any deploy attempt, re-check `vercel inspect signals.gitdealflow.com`
  before assuming your build is what's live — another process may have
  already deployed (in which case yours is redundant — cancel the queued
  one with `vercel remove <url> --yes` rather than letting it race the
  alias).
- If you find a merge conflict from a stash pop against a file you never
  intentionally edited, check `git log -- <file>` first — the current HEAD
  version may already be a real, committed fix from the other session, in
  which case keep HEAD's version and discard your stale stashed copy.
