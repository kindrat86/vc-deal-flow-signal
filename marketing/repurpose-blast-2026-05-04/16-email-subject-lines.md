# Variant 16 — Email digest subject line variants (3 A/B options)

**Cadence:** Monday weekly digest · auto-publish via `email-api/send-weekly-digest.mjs`
**CTA in body:** anchor signal post (single)

---

## Option A — pattern-led (curiosity-first)

```
Subject: 100 contributors at airbytehq just stepped up another order of magnitude
Preview: +866% commit velocity over 14 days. The rare third pattern.
```

Char count: subject 78 / preview 64 — within Gmail and Apple Mail clip limits.

## Option B — data-led (concrete-first)

```
Subject: Signal of the Week — airbytehq, +866% velocity, deploy frequency spike
Preview: #1 mover this week across 100 tracked startup GitHub orgs. Full breakdown.
```

Char count: subject 74 / preview 71.

## Option C — investor-framing (audience-first)

```
Subject: 20 minutes of diligence on airbytehq this week
Preview: +866% commit velocity, 100 contributors, the pattern that precedes rounds by 2 to 4 weeks.
```

Char count: subject 51 / preview 90.

---

## Recommendation

A/B the next three weeks at 33/33/33 split, then concentrate on whichever wins on `unique_opens / sent`. Track `verified_subscribers` only — `isExcluded()` filter applied per memory `feedback_never_send_to_testers_or_bots`.

Dry-run before send, per memory `feedback_dry_run_before_size_claims`. Real recipient count is roughly 1/50th of gross PocketBase count.
