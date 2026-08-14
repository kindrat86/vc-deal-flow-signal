# GitDealFlow — Dream-Customer Messaging Guide

**Single source of truth for how we talk to dream customers** (VCs, scouts, corp
dev, family offices). Every email, DM, landing page, bio, post, and ad must
comply. Written 2026-05-29 from live feedback by two dream customers (Evan
Buhler, Pascal Levy-Garboua). See memory `project-dream-customer-positioning-2026-05-29`.

## The problem this fixes
- **Evan:** "Are you trying to be a VC, or trying to sell deal flow? I don't get
  it." + "Not interested in momentum." → category confusion + "momentum" reads
  as hype.
- **Pascal:** "We're not the most analytical firm... walk me through it." →
  needs plain, simple, non-quant language.

Root cause: we led with the **mechanism** ("rank 400 startups by GitHub
momentum"), which sounds like we're the VC/picker and reads as a hype metric. A
confused mind says no.

## What we are (say this when asked)
> "I'm not a VC, not competing with you. GitDealFlow is a **tool**. It reads
> startups' public GitHub engineering activity and flags the ones quietly taking
> off, in your sectors, before they're raising or in the press. Investors use it
> to source early. You don't crunch anything — it surfaces them, you just look."

**One-liner:** A deal-flow signal tool for investors — not a fund.

## Lead with the JOB, not the machine
- The job: **see startups heating up before they raise**, in your sectors.
- The proof: SSRN panel (n=219), 21–47d median lead time, public methodology + dataset.
- The simplicity: no code-reading, no quant work — plain-English notes.

## ✅ Approved phrasing
- "a tool, not a fund" / "we're not a VC, not competing with you"
- "startups heating up on GitHub before they raise"
- "early engineering signal" / "shipping cadence" / "contributor growth"
- "see them first, before the round or the press"
- "we surface the signal, you make the calls"
- "you don't read code / you don't crunch anything"

## ❌ Banned as the lead/hook (when talking to a dream customer)
- **"momentum"** as the pitch word → reframe as "early engineering signal" /
  "heating up early". (It's fine as a precise term inside the methodology; never
  as the hook to a skeptic.)
- **"I rank 400 startups…"** → sounds like *we're* the investor/picker.
- **"briefing" / "watchlist" / "Sunday issue" / "five names"** as the core
  identity → that's newsletter framing; the free email is a *secondary* entry,
  not what we are.
- Any line that describes WHAT it is before stating it's a **tool, not a fund**.
- Quant/jargon-heavy framing for non-analytical buyers.

## Audience (keep targeting these)
VCs, corp dev, family offices, solo angels, scouts, seed funds. Name their world
in their language.

## Email & sequence rules
- Subjects: story/benefit-driven (current sequence is good). Don't lead a subject
  with "momentum" or "watchlist".
- The first identity-setting email must say, in plain words, **tool not a fund**.
- The free weekly email is the no-friction entry, not the product's identity.
- Keep the SSRN/dataset proof; keep plain-English signal notes.

## DM / outreach rules (extreme personalization)
1. Research first — read their portfolio + bio + last ~5 posts; write their thesis
   in one line. (Evan: "reverse-engineer my portfolio.")
2. Open by proving you know them (real reference, not generic flattery).
3. ONE real signal **in their lane** — true company, numbers, link. Never off-thesis,
   never reuse the same company across people.
4. Bake in the "tool, not a fund" identity to preempt confusion.
5. Frame = early discovery in their space, NOT ranking/momentum.
6. Match medium + register; soft, low-friction ask.
7. Only when warm (engagement trigger), or proactively for whales after working in.

**DM template** (slots MUST be real/researched, never boilerplate):
> "[name], you're backing [1-2 real portfolio names] — so you live in [lane]. I
> built a tool, not a fund: it reads startups' GitHub engineering activity and
> flags the ones heating up early, before they raise. One in your lane that just
> popped: [real company + numbers + link]. Want it filtered to just [sector]?"

## Voice
Plain, confident, peer-to-peer. Match the dream customer's register (lowercase/
casual on X is fine). Honesty over hype — a dream customer literally said
"honesty feels good."

## Live surfaces already aligned (2026-05-29)
- Apex gitdealflow.com — rebuilt + deployed (PR #267).
- signals.gitdealflow.com — "tool, not a fund" in hero + meta, deployed (PR #268).
- @sipiteno X bio — new copy supplied.
- Welcome email (`pseo-site/lib/emails.ts` SOAP_OPERA_EMAILS[0]) — "tool, not a
  fund" clarity added.

## Still to align as they're touched
The ~50-email soap-opera/challenge/seinfeld sequences and the broader pSEO/book
copy are narrative and mostly compliant; bring each into line with this guide
when edited. Do NOT blanket find-replace "momentum" (it's legitimate methodology
language outside the dream-customer hook).
