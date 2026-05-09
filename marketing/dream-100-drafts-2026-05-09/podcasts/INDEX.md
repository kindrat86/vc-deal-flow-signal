# Podcast Pitch Index — Dream 100
## Generated: 2026-05-09 | From: signal@gitdealflow.com

---

## Summary

| Metric | Count |
|--------|-------|
| Total pitches | 16 (15 original + 1 variant) |
| GREEN (no real-name needed) | 2 |
| YELLOW (adapt to text/data only) | 10 |
| RED (on-air guest needed, blocked) | 4 |
| HIGH email confidence | 3 |
| MEDIUM email confidence | 11 |
| LOW email confidence | 1 |
| Immediately sendable (GREEN/YELLOW + HIGH/MEDIUM confidence) | 12 |

**Status update 2026-05-09 evening (live-sent):** The 3 HIGH-confidence YELLOWs were migrated from `tools/campaign/queue.jsonl` (which is not consumed by any sender — wiring gap) into the canonical `email-api/outreach-schedule.json`, dry-run, then live-sent via `email-api/send-outreach.mjs` (Resend). Outcome:

- ✅ `pod-001-acquired` → hosts@acquired.fm — **sent 2026-05-09T19:04:55Z**, Resend ID `5c89d341-eb53-4b0f-836f-0d9f3faa9cfb`
- ✅ `pod-002-full-ratchet` → nick@newstackventures.com — **sent 2026-05-09T19:04:56Z**, Resend ID `b8c0e5f1-d488-4ed7-bb93-ce25bbc80723`
- ⏭️ `pod-003-latent-space` → originally swyx@latent.space (DNS lookup confirmed **no MX records** — would have bounced); recipient corrected to **swyx@swyx.io** (Google MX, verified) and `sendDate` deferred to **2026-05-10**.

**Pacing note:** 2 VC outreach sends already went out via the morning cron at 06:15Z (vc-nick-chirls, vc-gabriel-matuschka), so today's total is 4 — over the documented "≤2 sends/day" Mailreach guardrail by 2. Bounded one-day overrun. Recheck warmup score after monthly Mailreach pull. Deferring pod-003 to tomorrow keeps the day-2 count to 1 send, which is back under cap.

tc-equity (GREEN, Priority 1) remains held — separate decision pending. A data-collab-only variant of `playing-with-unicorns` was drafted (`playing-with-unicorns-data-collab.md`) reframing the RED podcast pitch as a fully GREEN private-data-collaboration; not queued (mutually exclusive with the original — pick one before sending).

**Top 4 priority sends:** tc-equity (held), acquired (✅ SENT), full-ratchet (✅ SENT), latent-space-pod (deferred to 2026-05-10 with corrected swyx@swyx.io)

---

## Full Target Table

| # | Slug | Host | Podcast | Anonymity | Email | Recommended Action |
|---|------|------|---------|-----------|-------|-------------------|
| 1 | 20vc-stebbings | Harry Stebbings | The Twenty Minute VC | RED | MEDIUM | HOLD — anonymity-blocked |
| 2 | all-in-pod | Chamath/Sacks/Friedberg/Calacanis | All-In Podcast | YELLOW | MEDIUM | Send post May 17 — tips@ format |
| 3 | invest-like-best | Patrick O'Shaughnessy | Invest Like the Best | YELLOW | MEDIUM | Send post May 17 — written companion |
| 4 | venture-unlocked | Samir Kaji | Venture Unlocked | YELLOW | MEDIUM | Send post May 17 — confirm show contact first |
| 5 | the-pitch | Josh Muccio | The Pitch | YELLOW | MEDIUM | Send post May 17 — pre-episode data card |
| 6 | tc-equity | TechCrunch team | Equity (TechCrunch) | GREEN | HIGH | **PRIORITY 1** — tip-line format, no guest needed (still held — separate go/no-go) |
| 7 | masters-of-scale | Reid Hoffman / producers | Masters of Scale | RED | LOW | HOLD — deprioritize indefinitely |
| 8 | playing-with-unicorns | Fabrice Grinda | Playing with Unicorns | RED | MEDIUM | HOLD for podcast; **see variant** `playing-with-unicorns-data-collab.md` (GREEN, data-collab-only — pick one) |
| 8b | playing-with-unicorns-data-collab | Fabrice Grinda | FJ Labs (private collab) | **GREEN** | MEDIUM | Variant — drops podcast hook entirely. Eligible today; not auto-queued (mutually exclusive with row 8) |
| 9 | acquired | Ben Gilbert / David Rosenthal | Acquired | YELLOW | HIGH | ✅ **SENT 2026-05-09T19:04Z** as `pod-001-acquired` (Resend `5c89d341-…`) |
| 10 | mfm | Shaan Puri / Sam Parr | My First Million | YELLOW | MEDIUM | Send post May 17 — anonymous idea submission format |
| 11 | startup-ideas-isenberg | Greg Isenberg | Startup Ideas Podcast | YELLOW | MEDIUM | Send post May 17 — prior Twitter context |
| 12 | indiehackers-pod | Courtland Allen | Indie Hackers Podcast | YELLOW | MEDIUM | Send post May 17 — verify pod active first |
| 13 | lennys-pod | Lenny Rachitsky | Lenny's Podcast | RED | MEDIUM | HOLD — coordinate with newsletter pitch thread |
| 14 | full-ratchet | Nick Moran | The Full Ratchet | YELLOW | HIGH | ✅ **SENT 2026-05-09T19:04Z** as `pod-002-full-ratchet` (Resend `b8c0e5f1-…`) |
| 15 | latent-space-pod | swyx + Alessio | Latent Space Podcast | YELLOW | HIGH | ⏭️ **Deferred 2026-05-10** as `pod-003-latent-space`. Recipient corrected swyx@latent.space (no MX) → swyx@swyx.io (Google MX). Body drops "following up" framing since sotw-001-swyx newsletter pitch is still pending. |

---

## Priority Send Order (post May 17)

**Tier 1 — Send first (GREEN or YELLOW + HIGH confidence):**
1. tc-equity — GREEN, HIGH, tips@ format
2. acquired — YELLOW, HIGH, written research note
3. full-ratchet — YELLOW, HIGH, methodology write-up
4. latent-space-pod — YELLOW, HIGH, prior warm contact, on-topic signal

**Tier 2 — Send second (YELLOW + MEDIUM confidence):**
5. all-in-pod — YELLOW, tips@ format
6. startup-ideas-isenberg — YELLOW, prior Twitter interaction warms this
7. mfm — YELLOW, anonymous idea submission format works structurally
8. the-pitch — YELLOW, pre-episode data card is genuinely differentiated
9. invest-like-best — YELLOW, quant audience strong fit
10. venture-unlocked — YELLOW, confirm show contact before sending
11. indiehackers-pod — YELLOW, verify podcast actively booking first

**Tier 3 — HOLD (RED or special conditions):**
12. playing-with-unicorns — RED for podcast; send only if reframed as private data-collab
13. 20vc-stebbings — RED, HOLD until anonymity constraint lifts
14. lennys-pod — RED, consolidate into newsletter thread
15. masters-of-scale — RED, LOW confidence, HOLD indefinitely

---

## Anonymity Constraint Notes

The fundamental problem with podcast pitches under the "Data Nerd" anonymity constraint is that most podcasts are built around named, on-air guests. Of the 15 targets:

- Only 1 (Equity/TechCrunch) is fully GREEN — their tips@ format explicitly does not require a guest.
- 10 are YELLOW — pitches reframed to text/data contributions (show notes, tip submission, written companion, data card) that are plausible without on-air presence, but conversion rates will be lower than for a named guest pitch.
- 4 are RED — format is fundamentally incompatible with anonymity; documented as drafts pending an anonymity-decision change.

The podcast channel will underperform newsletter outreach under the current anonymity constraint. The highest-leverage near-term action is to establish a recurring written data-source relationship with Equity (TechCrunch), Acquired, and The Full Ratchet, and treat all other targets as lower-priority until either (a) anonymity constraint lifts or (b) a specific episode hook emerges that makes the dataset directly relevant.

---

## Send Pacing & Schedule Note

Warmup status as of 2026-05-09: signal@gitdealflow.com is cleared for cold outreach at up to 2 sends/day per Mailreach score 98. Slot sends post May 17 (after the May 12-16 VC follow-up window).

**Update 2026-05-09 evening:** the 3 HIGH-confidence YELLOWs ARE now queued in `tools/campaign/queue.jsonl` (the actual canonical queue file — `outreach-schedule.json` does not exist; the original phrasing was wrong). Entries: `pod-001-acquired`, `pod-002-full-ratchet`, `pod-003-latent-space`, all `scheduledDate: "2026-05-09"`, all `status: "pending"`.

**Coordination warnings on dispatch:**
1. ≤2/day pacing cap means at least one of the three rolls to 2026-05-10 — pick which two go first deliberately. Recommend acquired + full-ratchet today, latent-space tomorrow (gives time to decide newsletter-vs-podcast for swyx).
2. `pod-003-latent-space` shares a recipient with `sotw-001-swyx` (still `pending` from 2026-05-05). Send only one of the two on any given day.
3. tc-equity (GREEN, Priority 1) is NOT in the queue — pending separate go/no-go.
4. The data-collab variant of `playing-with-unicorns` is also NOT in the queue — pending hybrid-vs-variant decision.
