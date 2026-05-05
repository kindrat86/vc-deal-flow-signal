# Variant 15 — Chrome extension popup teaser (engineering task)

**Status:** Engineering backlog item. File a Tier-1 entry in `brunson/idea-queue.md`.

---

## One-line copy (popup header)

```
Signal of the Week: airbytehq +866% velocity. 100 contributors. Tap to read.
```

Char budget: 76 / approximate Chrome popup header limit (88 chars before truncation in 320-px popup).

## Two-line variant (popup body)

```
Signal of the Week: airbytehq
+866% commit velocity / 14d · 100 contributors · deploy frequency spike
```

## Backlog entry to add to `brunson/idea-queue.md` (Tier 1)

```
- [ ] Tier 1 — Chrome extension popup: render Signal of the Week pill at top of popup. Pulls from /api/signal-of-the-week.json (new endpoint required). Updates Mondays at 09:00 EEST. Single CTA opens the SoTW blog post in a new tab. Effort: half day. Owner: Claude (next eng cycle).
```

## CTA

Click target: `https://signals.gitdealflow.com/blog/signal-of-the-week-2026-05-04` (this week's post; next week's URL is week-of-Monday formatted).

## API contract for the new endpoint

`/api/signal-of-the-week.json` returns:

```json
{
  "slug": "signal-of-the-week-2026-05-04",
  "startup": "airbytehq",
  "sector": "Data Infrastructure",
  "velocityChange": "+866%",
  "contributors": 100,
  "signalType": "Deploy frequency spike",
  "permalink": "https://signals.gitdealflow.com/blog/signal-of-the-week-2026-05-04",
  "publishedAt": "2026-05-04T06:00:00Z"
}
```

Cache: 6 hours, revalidate on Monday cron.
