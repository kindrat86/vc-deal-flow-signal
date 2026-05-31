# Recurring task prompt — weekly tip-line drop

The scheduled-task system blocks self-spawn (same lift as receipts-of-the-week + leaderboard-friday). Run `/schedule` from a fresh session and paste the prompt body below to wire the Monday-09:00-UTC cron.

## Schedule

- **Cron**: `0 9 * * 1` (Mondays 09:00 UTC — same morning the new /predicted week ships)
- **Title**: `Weekly tip-line drop generator`
- **Description**: Auto-generates 5 deal-flow newsletter drafts in `tools/campaign/drafts/` from the latest /predicted week.

## Prompt body (paste into `/schedule`)

```
Generate this week's tip-line newsletter drop.

Run: node tools/campaign/generate-weekly-tipline.mjs

Then post a brief status to this thread:
- Which week was generated (slug + dates)
- How many picks were drafted (should be 5)
- Whether HOLD is active (warn me if so)
- Paths to the 5 draft files + the MANIFEST

Do NOT auto-send anything. The script writes drafts only — I'll review and forward manually from the drafts/ folder.

If the script fails, do not retry — surface the error and stop.
```

## Manual run (any Monday)

```bash
node tools/campaign/generate-weekly-tipline.mjs
TIPLINE_VERBOSE=1 node tools/campaign/generate-weekly-tipline.mjs   # full body print
```

## Recipients

Edit the `OUTLETS` array in `generate-weekly-tipline.mjs` to add/remove tip lines. Current set:

| Outlet | Tip address | Beat |
|---|---|---|
| StrictlyVC | `tips@strictlyvc.com` | Daily VC deal-flow |
| Term Sheet (Fortune) | `termsheet@fortune.com` | Institutional deal news |
| Axios Pro Rata | `proratatips@axios.com` | Quick-hit, scannable |
| Newcomer | `tips@newcomer.co` | Pre-announce / scoops |
| The Information | `tips@theinformation.com` | Premium / data exclusives |

## Anti-spam guards

- **Drafts only** — script never sends. Manual `cat | mail` or copy/paste.
- **One tip per outlet per week** — filenames are stamped `tipline-YYYY-Wxx-{outlet}.txt`; same week → same filename → idempotent overwrite.
- **HOLD-aware** — script prints a warning if `tools/campaign/HOLD` exists (drafts still generate, but don't forward).
- **Pacing** — Mailreach domain reputation 98/100 as of 2026-05-02; ≤2 sends/day across all paths is the user-set ceiling. Five tip-line forwards on Monday morning is within budget if other outreach is paused that day.

## When to demote

If after 4 weekly drops no outlet has cited or replied, swap recipients (next 5 from `marketing/dream-100.md` Section A) and retry. Or pivot to the embed widget play (M2 in the dream-100 mechanism table) — much higher passive yield.
