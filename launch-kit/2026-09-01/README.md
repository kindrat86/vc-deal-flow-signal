# GitDealFlow coordinated launch packet

**Launch date:** Tuesday, 2026-09-01
**Primary target:** Hacker News at 08:30 US Eastern / 15:30 Europe/Athens
**Campaign:** `gdf-launch-2026-09`
**North-star metric:** qualified first-touch visitors, measured independently from signups or revenue.

## Sequence

| Athens | Channel | Asset | State |
|---|---|---|---|
| Sun Aug 30, 16:00 | Sunday digest | P.S. launch/capture note | exact draft in `pseo-site/data/ps-notes.json`; fail-closed as `status: draft` until reviewed |
| Tue Sep 1, 15:25 | Hacker News | `show-hn.md` | Maryan-only manual post, per standing rule |
| Tue Sep 1, 15:30 | Bluesky | `bluesky.json` | staged; public send requires final approval |
| Tue Sep 1, 15:35 | Telegram @gitdealflow | `telegram.md` | staged; existing cron is blocked by missing CRON_SECRET and stale masked token |
| Tue Sep 1, 15:45 | LinkedIn company page | `linkedin.md` | staged; company page only, never personal profile |
| Tue Sep 1, 15:50 | X | `x-thread.md` | staged; official X API credits depleted on 2026-08-29 |
| Tue Sep 1, 16:00-17:00 | HN | Comment response window | Maryan-only; answer every genuine question, no upvote asks |

## Attribution links

- HN: `https://github.com/kindrat86/gitdealflow-signal-engine?utm_source=hackernews&utm_medium=community&utm_campaign=gdf-launch-2026-09&utm_content=show-hn`
- Telegram: `https://gitdealflow.com/?utm_source=telegram&utm_medium=social&utm_campaign=gdf-launch-2026-09&utm_content=signal-of-week`
- LinkedIn: `https://gitdealflow.com/?utm_source=linkedin&utm_medium=organic&utm_campaign=gdf-launch-2026-09&utm_content=company-page`
- X: `https://gitdealflow.com/?utm_source=x&utm_medium=organic&utm_campaign=gdf-launch-2026-09&utm_content=thread`
- Bluesky: `https://gitdealflow.com/?utm_source=bluesky&utm_medium=organic&utm_campaign=gdf-launch-2026-09&utm_content=top-mover`
- Email: auto-tagged by `pseo-site/lib/digest-email.ts` as `utm_source=email&utm_medium=email&utm_campaign=signal-digest`.

## Launch rules

1. Run every outbound asset through `~/.hermes/scripts/gdf_claims_guard.py` immediately before publishing.
2. Run the encoding preflight. Block on `‚Ä`, `Ã`, `Â`, `â€`, or `�`.
3. Never ask for upvotes or coordinate voting.
4. Do not mention the HN post on another channel during the first two hours.
5. Use only the locked claims: 350+ orgs, 15 sectors, 219 startup-period observations across 55 startups, 21 to 47 days.
6. Naming a company means its public engineering activity matched the pattern, not that it is raising.
7. HN writing and posting remain Maryan-only.
8. LinkedIn remains company-page-only.

## Measurement

- Compare `dashboard/data/gitdealflow_distribution.json` before launch and at +24h, +72h, and +7d.
- Primary: human, bot-filtered first-touch qualified visitors by source.
- Secondary: total visitors, explicit UTM coverage, share/copy events, new confirmed subscribers.
- Kill rule: no repeated promotional posts on any channel if the first placement yields fewer than 3 qualified visitors in 7 days.
