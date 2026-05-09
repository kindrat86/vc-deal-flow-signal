# Social Mascot Operator Playbook — 2026-05-09

**Status:** Live for Twitter, LinkedIn, Bluesky, Substack Notes, YouTube. Reserved for Instagram, Facebook, TikTok, Threads.
**Owner:** Founder (manual posting; user-only).
**Cadence:** See `/data-nerd/social` for the canonical pillar-mix + slot schedule.

This playbook fills the Traffic Secrets Ch 7 (Instagram) + Ch 8 (Facebook) gaps that our anonymity rule otherwise blocks. The synthetic mascot ("Data Nerd") replaces founder identity as the brand carrier. Memory rule (2026-05-05): synthetic TTS, AI avatars, mascots EXPLICITLY allowed; founder face/voice/name never.

## 1. The mechanic in one paragraph

The Data Nerd is the canonical brand character. Abstract avatar, synthetic Cartesia "Theo" voice, deliberately data-first writing style. Every post fits one of five content pillars (Signal of the Week 30%, Framework Explainer 27%, Data Point 20%, Calibration Case 17%, Operator Prompt 7%). The hub at `/data-nerd/social` is the public character bible — affiliates, syndicate community managers, and partner accounts read it once and stay aligned with brand voice without needing the founder's identity.

## 2. Activation order (when each handle goes live)

| Channel | Status | Activation trigger |
|---|---|---|
| Twitter `@data_nerd` | LIVE | Already running |
| LinkedIn `GitDealFlow` | LIVE | Already running |
| YouTube `@gitdealflow` | LIVE | Already running |
| Bluesky `@datanerd.gitdealflow.com` | LIVE | Already running |
| Substack Notes `@gitdealflow` | LIVE | Already running |
| **Instagram `@gitdealflow.datanerd`** | **RESERVED** | **User creates Meta Business account → 2026-W21** |
| **Facebook `GitDealFlowDataNerd`** | **RESERVED** | **Bundled with IG via Meta Business → 2026-W21** |
| **Threads `@gitdealflow.datanerd`** | **RESERVED** | **Auto-spawns when IG goes live** |
| **TikTok `@data_nerd_signals`** | **RESERVED** | **2026-W23 (after IG validation)** |

The Meta Business activation is the chokepoint. One Business account → IG + FB + Threads spin up together.

## 3. Day-1 deliverables when Instagram + Facebook go live

The repo already contains everything needed to ship the first 5 posts within 60 minutes of account creation:

1. **Avatar + cover image** at `/public/data-nerd-avatar.svg`, `data-nerd-avatar-1024.png`, `data-nerd-cover.png` — paste into IG/FB profile.
2. **Bio text** (under 150 chars):
   > Anonymous mascot for GitDealFlow's 7-signal framework. We score GitHub before founders pitch. ↓
3. **Link in bio**: `https://signals.gitdealflow.com/data-nerd/social` (the public bible — pre-converts new visitors).
4. **First 5 posts**: in `content/social-content-batch.ts`, each with channel-specific bodies, image specs (slide-by-slide carousels), alt text, and hashtag composition.
5. **Scheduling slots**: `POSTING_HOURS_UTC` in `content/social-mascot.ts`.

## 4. Monthly batch generation rhythm

- **First Monday of every month**: regenerate the 30-day batch from current `/api/v1/signals.json` data.
- **Per-week selection**: Mon = Signal of the Week, Tue = Data Point, Wed = Framework Explainer, Thu = (skip / cross-post Tuesday's), Fri = Calibration Case, Sat = Operator Prompt, Sun = (skip / repost top-performer).
- **Per-channel adaptation**: Twitter (≤280 char or thread), LinkedIn (long-form ~1300 char), Instagram (carousel + caption + hashtags), Facebook (caption-only repurpose of IG), Threads/Bluesky (mirror Twitter).
- **Cross-posting**: pipeline already wired for Twitter ↔ Threads ↔ Bluesky via existing Substack Notes + ATproto integration. IG/FB stay manual until a third-party scheduler is connected.

## 5. Voice rules — hard guardrails

These come from `content/social-mascot.ts` and govern every Data Nerd post regardless of channel:

**Always:**
- Open with the number, not the conclusion
- Cite the SSRN paper or the panel data when making claims
- Specify edge cases / failure modes (credibility comes from naming when frameworks fail)
- Say "the framework" / "the data" — not "I" or "we"

**Never:**
- Hype words: "unlock", "leverage", "synergy", "paradigm", "disruptive"
- Empty enthusiasm: "!!!", "amazing", "incredible", "mind-blowing"
- Authority cosplay: "as a VC", "in my experience", "I've seen 100s..."
- Anything that requires the founder's identity to be credible

## 6. Conversion path from social

Every post links into one of three destinations based on pillar:

| Pillar | Primary CTA | Secondary CTA |
|---|---|---|
| Signal of the Week | `/predicted` (live ranking) | `/challenge` (manual procedure) |
| Framework Explainer | `/challenge` (free 30-day course) | `/methodology` |
| Data Point | `/challenge` | SSRN paper |
| Calibration Case | `/predicted` | `/sector-sweep` |
| Operator Prompt | `/challenge` | (none — reply-driven) |

UTM convention: `?utm_source=social&utm_medium=mascot&utm_campaign=batch-YYYY-MM` so attribution is clean.

## 7. Affiliate + community handoff

Affiliate operators (community managers, newsletter writers, podcast hosts) can re-share Data Nerd posts under the same brand voice. The swipe kit at `/affiliates/funnel-hack` is the long-form content companion to the daily mascot posts.

When an affiliate re-shares a Data Nerd post, attribution flows via the `?via=AFFILIATE_ID` parameter on whatever destination link they use. The mascot's `?utm_*` params and the affiliate's `?via=` param coexist on the same URL.

## 8. Failure mode log

| Failure | Recovery |
|---|---|
| Voice drift toward hype | Reread `content/social-mascot.ts` tone rules. Compare last 5 posts against the "Avoid" list. Rewrite the offending post; don't delete (consistency in voice rebuild matters more than purity in any one post). |
| Channel goes silent for 2+ weeks | Drop that channel from the live list; mark "reserved" until reactivation. Better silence than off-voice posts. |
| Reply mention of founder's real name | Don't engage. Mascot policy: never confirm or deny. The Data Nerd doesn't have a founder, the framework does. |
| One post performs 5× the average | Document why in the next monthly retro. Don't immediately replicate — pattern-matching on a single anchor post produces a feed that looks like the post and nothing else. |

## 9. Programmatic mirror

`/api/v1/social-mascot.json` exposes the bible to agents, RAG pipelines, and third-party schedulers. Includes voice rules, pillar mix, posting hours, hashtag bank, sample batch, and brand artefact URLs. Cached 1h at the edge.

## 10. What this playbook does NOT solve

- **Reddit Ads activation** — still user-gated per memory (account/card/launch are user-only). See `marketing/reddit-ads-launch-bundle-2026-05-06.md` §5 for the 10-step checklist.
- **Founder podcast appearances** — anonymity rule blocks. Synthetic-voice podcast segments (e.g. embedded in `/state-of-github`) are the analog.
- **Live IG/TikTok creator-style content** (face, hands, behind-the-scenes) — anonymity rule blocks. Mascot avatar + voiceover content is the substitute and ships at ~$0.05/video via the existing pipeline.

---

**Next review:** 2026-06-09 (concurrent with monthly batch regeneration).

**Files referenced:**
- `pseo-site/content/social-mascot.ts` — character bible
- `pseo-site/content/social-content-batch.ts` — 5-post canonical batch + helpers
- `pseo-site/app/data-nerd/social/page.tsx` — public hub
- `pseo-site/app/api/v1/social-mascot.json/route.ts` — programmatic mirror
- `pseo-site/app/.well-known/discover.json/route.ts` — agent discovery
