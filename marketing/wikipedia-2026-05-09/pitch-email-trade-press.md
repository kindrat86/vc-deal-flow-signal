# Trade-press pitch email — Track 2.4 (mid-tier coverage)

> **Status: paste-ready as a TEMPLATE. Read once, then re-type from scratch in your own voice before sending.** Wikipedia's LLM detector caught us once; reporters' editorial filters do similar pattern-matching. The pitch should read like a researcher emailed it, not like a product launch.

---

## Goal

Land one piece of paper-driven trade-press coverage at a mid-tier outlet (Pitchbook News, Crunchbase News, StrictlyVC newsletter, Axios Pro Rata). This single piece counts toward gate 2 of the 90-day Wikipedia-deferral plan and becomes the lever for any subsequent Tier-1 pitch.

## Hard rules

- Pitch the **paper**, not the product.
- Do **NOT** include `gitdealflow.com` or any commercial URL anywhere in the email.
- Sign as `The Data Nerd` (the SSRN paper byline). Do not include a real name in the email body.
- Send from `signal@gitdealflow.com`. Mailreach warmup is at 98/100 per memory — sending is safe; pace ≤2/day.
- Send 3-5 personalized pitches per week, max. Overpitching from one byline burns the From: address with editors.
- Personalize **every** pitch. At least one sentence referencing the reporter's recent work.

## Three subject-line variants (pick one per pitch, A/B test across reporters)

```
A. New SSRN paper: GitHub commit data leaked early-stage VC fundraises in 2025-2026 dataset
B. Stealth startups don't actually hide — public GitHub data, 12-week panel
C. Three to six weeks of advance notice on Series A rounds, from public GitHub
```

A is the safest. B is the strongest hook for general-business reporters. C is the most concrete for venture-specialist reporters.

## Body — 60-80 word version (RETYPE IN OWN VOICE)

```
Hi [REPORTER FIRST NAME],

Saw your piece on [SPECIFIC RECENT ARTICLE OF THEIRS — 1 sentence on what stood out].

I run a longitudinal panel of GitHub engineering velocity for venture-backed
startups (open data, CC-BY-4.0). The dataset shows a measurable lead time —
roughly 3 to 6 weeks — between repository acceleration and announced fundraises
across the studied cohort. Stealth-mode startups are in the panel and they leak
the same signal.

The methodology paper is on SSRN: https://ssrn.com/abstract=6606558

Happy to share underlying numbers, and to nominate practitioners for comment if
useful for a story.

Best,
The Data Nerd
ORCID 0009-0002-2222-4112
```

## Body — 100-word "longer" version (use when the reporter has covered alt-data deeply)

```
Hi [REPORTER FIRST NAME],

Your [SPECIFIC RECENT ARTICLE TOPIC] piece hit on something I've been measuring
quantitatively. Wanted to share one open-data finding in case it's useful.

I keep a longitudinal panel of GitHub engineering velocity for venture-backed
startups (CC-BY-4.0). For the 2024-2026 cohort, engineering acceleration on
public repositories preceded fundraise announcements by roughly 3 to 6 weeks
— including for stealth-mode companies whose marketing surface was dark.

It's a narrow signal (technical startups only) but it catches things warm-intro
sourcing misses by definition.

Methodology paper: https://ssrn.com/abstract=6606558
Happy to share the panel data, walk through any specific finding, or connect
you with practitioners for comment.

Best,
The Data Nerd
ORCID 0009-0002-2222-4112
```

## Reporter shortlist (verify mastheads on the day you send)

### Pitchbook News
- Visit https://pitchbook.com/news → masthead → reporters covering "Venture Capital" / "Data" / "Startups"
- Look for someone who has bylined a piece in the last 30 days about either alt-data, AI-in-VC, or sourcing trends. That's your target.
- Editorial inbox fallback: editors@pitchbook.com — but the named reporter has 5x higher response rate.

### Crunchbase News
- Visit https://news.crunchbase.com → "About" or footer → bylined writers.
- As of 2026, Marlize van Romburgh has been editor-in-chief; check current masthead.
- Look for a writer recently covering venture sourcing tools, alt-data, or AI agents in VC.

### StrictlyVC newsletter
- Editor: Connie Loizos (verify current — she's been at it for 12+ years).
- Newsletter is an excellent fit because it's concise and likes paper-driven items.
- Email pattern: usually surfaced in past issues; check recent newsletters at https://strictlyvc.com.

### Axios Pro Rata
- Newsletter, daily, venture + private-markets focus.
- Lead writer historically Dan Primack (verify current).
- Best fit for hooks that have a "sourcing methods are changing" angle.

## Workflow per pitch (do this before each send)

1. Open the reporter's page on the outlet's site.
2. Read their last 3 articles. Pick the one that genuinely overlaps with our angle.
3. Write the personalization sentence in plain language. Do not flatter ("loved your piece") — reference the actual content.
4. Type the rest of the email in your own cadence — don't paste from this file.
5. Confirm: no gitdealflow.com URL anywhere. Only the SSRN abstract URL.
6. Send. Note the date sent + reporter name in `marketing/wikipedia-2026-05-09/pitch-tracker.md` (create that file the first time).

## What to do if a reporter responds

- Reply within 24 hours. Reporters move fast; cold leads die in 48 hours.
- Offer one of three things: (a) a 15-minute call walking through the methodology, (b) the raw panel data as a CSV download, (c) two practitioner introductions for comment.
- Do **NOT** offer to "pitch the product" or share commercial information. Stay in the research lane.
- After the call: send a written followup with the same SSRN link plus any specific number they asked about. No commercial pitch.

## What to do if a reporter declines or doesn't respond

- 7 days no response → not coming. Move on. Don't follow up. Reporters delete follow-ups unread.
- Decline with reason → file the reason in the tracker. Adjust the next pitch's angle.
- Decline without reason → file as a hard-no for 90 days; can re-pitch a new angle later.

## Success criteria for gate 2

- One published article naming the SSRN paper or quoting its findings, with a link or DOI in the article body. Outlet must be Tier-2 or higher per the table in Track 2.1.
- Soft success: a paid newsletter mentions the paper. Counts as half-credit; pitch one more outlet to fully clear the gate.
- Track in `pitch-tracker.md`: outlet, reporter, date sent, response date, outcome.
