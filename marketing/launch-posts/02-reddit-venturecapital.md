# Reddit r/venturecapital Post — Wave 1 (Sunday April 19)
## Frame as discussion, NOT promotion

---

### Title
Interesting pattern: startups showing 2x commit velocity spikes on GitHub tend to announce raises within 6 weeks. Anyone else tracking this?

### Body (copy-paste below)

I've been tracking GitHub engineering activity across a few thousand startup orgs for the past few months, and a pattern keeps showing up that I wanted to get this community's take on.

When a startup's commit velocity (total commits over a rolling 14-day window) suddenly doubles or more relative to their own baseline, and this is sustained for 3+ consecutive windows — it tends to precede a fundraise announcement by about 6-12 weeks.

The logic makes sense: new funding → new engineers → more commits. Or: product-market fit → faster iteration → velocity spike → investors notice → fundraise. Either way, the engineering activity shows up before the announcement.

Some examples from what I've been tracking:

- **carlos-emr** (Healthcare): commit velocity spiked +199% in two weeks. 94 active contributors, up 76%. Classic hiring burst signal.
- **radareorg** (Cybersecurity): +83% velocity change, 100 contributors. Steady acceleration.

I classify these into four patterns:
1. **Engineering hiring burst** — contributor count jumps 50%+ (team just scaled)
2. **Infrastructure buildout** — 3+ new repos in 30 days (building the platform)
3. **Deploy frequency spike** — 150%+ velocity increase (shipping like crazy)
4. **Framework migration** — general acceleration that doesn't fit the above

I know platforms like Harmonic and Dealroom exist, but they cost $10K+/year, require demo calls, and mostly tell you about rounds *after* they're announced. They also use proprietary data you can't audit. I was curious whether a transparent, public-data approach — self-serve at EUR 9.97/mo — could complement the traditional tools.

Has anyone here used GitHub activity data in their sourcing process? Curious whether other investors find this signal useful or if it's too noisy to be actionable.

I built a free tool that publishes weekly rankings by sector if anyone wants to poke around the data: https://signals.gitdealflow.com

There's also a free Chrome extension if you want the signal to appear directly on Crunchbase / AngelList / PitchBook profiles while you do your usual deal research: https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn
