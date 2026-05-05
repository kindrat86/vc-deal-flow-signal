# Variant 20 — Short-form video script (15s, TikTok / Shorts / YouTube)

**Status:** Engineering backlog item — production blocked by anonymity rule. Per memory `feedback_anonymity_no_podcasts`, no voice or face on camera. Variant ships as a screen-recording + on-screen-text format only.
**CTA:** /predict (single, in caption + final frame)

---

## Script — 15 seconds, screen-recording + text overlay

| Time | Visual | On-screen text |
|------|--------|----------------|
| 0.0s | airbyte.io homepage hero, faded | "100 contributors at this open-source project just" |
| 1.5s | Cut to GitHub airbytehq org page | "stepped up commit velocity by +866% in 14 days" |
| 3.5s | Zoom on contributor avatars in airbytehq | "100 engineers shipping in lockstep" |
| 5.5s | Cut to gitdealflow.com/predict, type "airbytehq" | "I rank 100 startup GitHub orgs every Monday" |
| 8.0s | Predictor result loads, signal score shown | "This pattern leads announced rounds by 2 to 4 weeks" |
| 11.0s | Anchor blog post hero | "Free, non-gated, citation-encouraged" |
| 13.0s | Closing card with URL | "signals.gitdealflow.com/predict" |
| 15.0s | End | (loop) |

## Caption (for TikTok, Shorts, YouTube)

```
The rare third pattern in startup GitHub data: a 100-contributor org accelerating in lockstep. airbytehq cleared all four gates this week (+866% velocity, deploy frequency spike). Run the scorer on any GitHub org: https://signals.gitdealflow.com/predict
```

## Hashtags (TikTok + Shorts only)

```
#venturecapital #github #startups #datascience #opensource #ai
```

## Backlog entry to add to `brunson/idea-queue.md` (Tier 1)

```
- [ ] Tier 1 — Short-form video pipeline: screen-record + text-overlay format only (no voice, no face per anonymity rule). 15s template producible in CapCut or similar with reusable layers (intro card, predictor demo, closing CTA card). One per Signal of the Week. Effort: 2 hours per video once template is built; template build is half-day. Owner: Claude (next eng cycle).
```

## Production notes

- Use the TikTok-favored 9:16 aspect ratio. Crop predictor demo to focus on the hero number (signal score).
- Captions burned into the video, not relying on platform auto-captions.
- No music (anonymity-safe; avoids identifiable taste signals). Use silent recording.
- Same template reusable for every Signal of the Week — only the org name, sector, and velocity number change.
