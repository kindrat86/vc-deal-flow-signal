# GuidedConcierge — spec recovered from production telemetry

The original `docs/guided-concierge-spec.md` and `guided-concierge-event-map.md`
were referenced in `seo-command-center.md` but **never committed** — no blob for
either exists anywhere in git history. The only concierge blob ever committed is
the 5-line stub.

This document reconstructs the contract from the events the real widget emitted
in production on 2026-05-24/25, before `688d300d` replaced it with the stub. These
are observed payloads, not a design proposal: matching them means the two months
of existing telemetry stays comparable with whatever ships next.

## Events

All three carry `source_page`, `source_type` and `variant`.

| Event | Additional properties | When |
|---|---|---|
| `concierge_opened` | `referrer_domain`, `utm_source`, `utm_medium`, `utm_campaign` | widget becomes visible |
| `concierge_option_clicked` | `option_key`, `destination_page` | user picks an option |
| `concierge_dismissed` | — | user closes it |

`variant` was `v1_default` on every observed event — the field exists so a second
variant can be compared later. Keep emitting it.

## `source_type` — the widget is route-aware

Observed values, each tied to a page archetype:

| `source_type` | Path observed |
|---|---|
| `landing_home` | `/` |
| `weekly_top_100` | `/weekly/top-100` |
| `receipts` | `/receipts` |
| `compare` | `/compare/*` |

## `option_key` → `destination_page`

The options offered depend on `source_type`. Observed pairs:

| `option_key` | `destination_page` | Seen on |
|---|---|---|
| `weekly_shortlist` | `/weekly/top-100` | `landing_home` |
| `methodology` | `/methodology` | `weekly_top_100`, `compare` |
| `scout_score` | `/receipts` | `weekly_top_100` |
| `mcp_workflow` | `/integrations/best-mcp-server-for-vc-research` | `receipts` |
| `compare` | `/compare/best-startup-signal-tools-for-investors` | `receipts` |

Note `destination_page` was an absolute URL in one early event and a root-relative
path in all later ones. Prefer root-relative and stay consistent.

## Behaviour implied by the telemetry

- It is a **guided next-step navigator**, not a chat or a capture form. Every
  observed option click routes to another page on the site.
- Open → click gaps of 2–4 seconds, and one session moving `/` → `/weekly/top-100`
  → `/receipts` → `/compare/...` each time opening the concierge, indicate it
  appears on every archetype page and offers context-appropriate onward routes.
- `concierge_opened` fires on the destination page carrying `referrer_domain`, so
  it fires on page load/visibility, not only on user click.

## Constraint

`app/layout.tsx` renders `<GuidedConcierge />` inside `<NotInEmbed>`, so it is
already correctly gated off `/embed/<widget>/...` surfaces. Do not add a second gate.

## What shipped beyond the recovered contract

Everything above is *observed*. The following was added deliberately on top of
it, and is flagged here so a later reader can tell reconstruction from decision.

**Extra `source_type` values.** The four observed archetypes match only 12% of
this site's pageviews (374 of 3,087 in the 28 days to 2026-07-23). This is a
~4,000-page pSEO surface where the long tail *is* the traffic, so the shipped
component adds arms for `methodology`, `vs`, `alternatives`, `answers`,
`startups_to_watch` and `research`, plus an `other` catch-all. Coverage goes to
99.9%. New values are additive — the four original `source_type`s still mean
exactly what they meant, so pre-stub comparisons remain valid.

**Exact-path `/compare`.** `/compare` (no trailing segment) is the #2 landing
page at 46 views/28d. A bare `startsWith("/compare/")` misses it, so the match
is `p === "/compare" || p.startsWith("/compare/")`.

**Suppressed surfaces.** `/account`, `/dashboard` and `/md/` get no concierge —
app-like pages the visitor reached deliberately, plus the Markdown mirror.

**`<a>`, not `next/link`.** `capture()` is fire-and-forget and PostHog batches
on a timer; a client-side route transition can tear the page down before the
request leaves. A real navigation lets the beacon flush on `pagehide`. Verified:
`concierge_option_clicked` survives the navigation it triggers.

**DNT/GPC.** Browsers sending `DNT: 1` or Global Privacy Control get no panel,
matching `CookieNotice` — the widget exists to emit analytics, so honoring the
opt-out means not showing it.

## Verification

After shipping, confirm in PostHog EU project 143861:

```sql
SELECT event, count() FROM events
WHERE event LIKE 'concierge%'
  AND properties.$host = 'signals.gitdealflow.com'
  AND timestamp > now() - INTERVAL 1 DAY
GROUP BY event
```

A deploy that returns HTTP 200 proves nothing here — the stub did that for two
months. Confirm the rendered page and the events.
