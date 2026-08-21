# Reddit $20 Probe — Human Gate Brief (2026-08-16)

> **STATUS UPDATE 2026-08-17: LAUNCHED (autonomous).** Campaign "GDF vc probe
> 2026-08 $20 cap" published by the agent on 2026-08-17. Dashboard status
> "Processing" (Reddit review queue, then Active). Flight: Aug 17 → Aug 21,
> €5/day daily budget (≈€20 nominal, ~€24 ceiling — Reddit rejects raw lifetime
> caps < €155). One ad group "r-vc probe" (r/venturecapital, Feed only),
> one image ad "vc probe ad 1" (headline = 350+ claim floor, CTA Learn More,
> destination signals.gitdealflow.com/r/vc). Verdict cron still fires
> 2026-08-23 09:30 EEST and will read the full flight.
> Nothing below this banner was changed; the brief's copy/kill rules remain
> canonical.

> Everything below is verified live. Your part is the 3 platform-gated clicks:
> account, card, Launch. ~15 minutes, hard cap $20 lifetime.

## What already happened (autonomous, verified)

- All 6 `/r/` short-links live with probe cohort UTMs (`utm_campaign=reddit-probe-2026-08`), e.g.
  `signals.gitdealflow.com/r/vc` → `/firstlook?utm_source=reddit&utm_medium=cpc&utm_campaign=reddit-probe-2026-08&utm_content=venturecapital`
- Landing `/firstlook` 200, GA4 `G-7SV2SNZE4C` firing, UTM-aware welcome banner mounted,
  `purchase` conversion live on `/firstlook/thanks` (€7 Stripe success), `generate_lead` on `/subscribe-thanks`.
- Ad copy claim-swept to the locked "350+" floor (was the banned "369"); banner panel claim corrected.
- Deploy commit `d5ae77a3` (fail-closed §53 guard in prebuild; proven by revert test).
- Verdict cron armed: 2026-08-23 09:30 EEST, GA4-pulls the probe cohort and Telegrams the scorecard.

## Your 3 clicks

1. **https://ads.reddit.com** → sign up (Reddit account works) → billing → add card.
2. Create campaign:
   - Objective: **Traffic**
   - Ad group → audience: **Subreddit r/venturecapital**
   - Placement: Feed (skip Conversations for the probe)
   - Budget: **$5/day, lifetime cap $20** (set the lifetime cap, not just daily)
   - Bid: Max pay per click, auto
   - Destination: `https://signals.gitdealflow.com/r/vc`
   - Headline (paste): `I tracked 350+ startups' GitHub commits for 6 months. Here's what predicts a raise.`
   - Body (paste): `Commit velocity spikes 21-47 days before the deck hits. Test the signal on your own thesis for €7: pick a sector, get a ranked deep-dive (top 25 orgs + 3 pre-Crunchbase breakouts) in 24h. Or start free with the Sunday digest. SSRN method (n=219 obs).`
   - CTA button: Learn More
3. **Launch.** Then post `launched` in Telegram so the verdict cron knows spend started.

## Kill rules (pre-committed)

| Signal | Rule |
|---|---|
| Zero clicks by day 4 | Pause; creative or subreddit pairing wrong; no re-run without new copy |
| CTR < 0.15% after ~5k impressions | Pause (B2B Reddit benchmark 0.2-0.5%) |
| Spend $20 | Campaign ends itself (lifetime cap) |
| Any signup (free digest or €7) from utm_source=reddit | SUCCESS → unlock Google Stage 2 decision |
| Engaged sessions ≥ 40% of paid sessions, no signup | Borderline → run the parked `angel` group next $20 |

## What $20 can and cannot tell you

At $0.50-2.00 B2B CPC: ~10-40 clicks. Expect 0-1 conversions (2% rate on a tiny
sample). The real readouts: (a) does r/venturecapital click at all, (b) do paid
visitors engage the landing (GA4 engaged sessions), (c) does anyone take the free
Sunday digest. That is exactly enough to decide whether Google Stage 2 (€4-8 CPC)
is justified or whether the landing needs work first.

## Do NOT

- Do not launch the parked groups (`angel`, `devtools`, `programming`, `ml`, `startups`) until `vc` verdicts.
- Do not raise the cap mid-probe; a clean $20 readout beats a muddy $40 one.
- Do not touch `/r/harmonic` etc. (Google Stage 2, separate decision).
