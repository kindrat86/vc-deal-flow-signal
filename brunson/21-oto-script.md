# Chapter 21 — The OTO Script (the `/thanks` Dashboard offer)

**Framework:** Brunson, *DotCom Secrets* Secret #21 "The OTO Script" (Funnel
Scripts, Section Three). **Applied to:** the One Time Offer on
[`landing/thanks.html`](../landing/thanks.html) — the upsell shown the moment
Marcus opts into the free Sunday email.

**Canonical inputs (not redefined here):**
- Dream customer **Marcus** — `brand/voice.md` §Avatar + [`08-dream-customer.md`](08-dream-customer.md).
  Corp-dev / PE operator / non-engineer VP. **Does not read code.** Core fear:
  looking non-technical in a technical room. Needs the signal in plain business
  English.
- Attractive Character **The Data Nerd** — `pseo-site/lib/data-nerd.ts`.
  Reluctant Reporter. Polarities in play: "trust the math, not me",
  "methodology before metrics", "€9.97 is a feature", **no fake timers**, **no
  hype words**.
- Value Ladder: **free** (Sunday email, 5 names) → **Dashboard €9.97/mo** (this
  OTO) → Insider / Sharp / Sweep (higher tiers, not sold here).

## The context: this is a post-opt-in OTO, not a cart OTO

Classic Brunson OTOs fire after a *purchase* ("Wait, your order isn't
complete"). Here the trigger is a *free opt-in*. So beat 1 is not "complete your
order" — it is "you just made a smart free decision; here is the one-time
upgrade while you're warm." Same script, adapted trigger.

## The Big Domino (the one belief the whole OTO rests on)

> **If I can make Marcus believe that five names a week is a taste and that the
> name he'd have missed is the one he most needed to reach first, then the
> Dashboard is the only logical way to never miss it — and nothing else needs
> to be sold.**

Everything below is in service of that single domino.

## Hook · Story · Offer

| Element | The fill |
|---|---|
| **Hook** | "Before Sunday, here's the one thing five names can't do for you." (curiosity headline, Secret #18) |
| **Story** | The 61-names epiphany: the first full read flagged 61, I mailed myself 5 and sat on the rest, two I left off raised inside a month. I'd done the work; I just hadn't given myself the whole board. |
| **Offer** | The Dashboard: the entire field re-ranked weekly in plain English, €9.97/mo founding rate locked for life, early-deal guarantee. |

## The OTO Script, beat by beat

**Beat 1 — Confirm the wise decision.**
Reaffirm the free opt-in so there is zero dissonance before the ask. *"Getting on
it was the right call — keep it even if you read nothing else on this page."*
The free thing is never threatened by the paid thing.

**Beat 2 — The epiphany (deliver the Big Domino as a story, not a claim).**
Five names is a taste, not the field → 61 flagged → sat on the rest → two raised
inside a month → *"I'd already done the work to find them. I just hadn't given
myself the whole board."* The miss is the emotional core, because Marcus's
deepest fear is missing the obvious winner.

**Beat 3 — Bridge to the offer + kill the avatar's fear in one line.**
*"…the entire field, re-ranked every week, in plain English… I read the engine;
you read the verdict. You never touch a line of code."* This is the load-bearing
sentence for Marcus: the AC (an engineer) does the technical part so the
non-coder buyer never has to, which turns his fear off instead of poking it.

**Trial close (micro-yes before the price).**
*"If you've ever heard about a round the week after it closed, you already know
why I built this."* A question Marcus answers "yes" to in his head before he
sees a number.

**Beat 4 — The offer / stack (benefit-first, ZERO invented numbers).**
Six checkmark line-items. No fabricated per-item "$199/mo" pricing — that was
removed in [PR #357](https://github.com/kindrat86/vc-deal-flow-signal/pull/357)
because invented numbers are the one thing that trips this skeptical buyer and
violate the "trust the math, no hype" polarity.

**Beat 5 — The value anchor (the only true comparison).**
A single PitchBook seat is **$20,000/yr** vs **€9.97/mo**, plus open
methodology + dataset + sample before you pay. One real, external, devastating
anchor beats a stack of made-up ones.

**Beat 6 — The price reveal.**
€49 struck → €9.97/mo. "More than 10x the value before you count a single deal"
(conservative against the PitchBook anchor). Founding rate, locked for life.

**Beat 7 — Risk reversal.**
The early-deal guarantee: run one full sourcing cycle; if it doesn't surface a
single name worth a real conversation, full refund, *"the risk is mine; the
cycle is yours to keep."*

**Beat 8 — Honest urgency (the OTO "this is the moment" beat, no fake timer).**
Two true reasons: (1) the founding rate is a real cohort, not a sale — lock it
and keep €9.97/mo for life; (2) the names flagged this week are early *this*
week, and in a month they're someone else's warm intro. Both are structurally
true, so they survive the AC's no-fake-timer rule.

**Beat 9 — The single CTA.**
One button: "Lock €9.97/mo — start the Dashboard." Email carried over (friction
removed), Stripe, cancel anytime. No competing actions.

**Beat 10 — The graceful no (the take-away that keeps the relationship warm).**
*"Don't buy this if five names still covers your week. Buy it the week missing
the right company would actually sting."* The honest decline is what wins a
burned, skeptical buyer — and it keeps him on the free list either way.

**Beat 11 — P.S.**
The free Sunday email never goes away; the Dashboard is just the difference
between watching five names and owning the whole board the week you decide to
move.

## Hard constraints honored

- **No fabricated numbers.** Only true figures: $20,000/yr PitchBook, €49, €9.97,
  60+, 21–47 days.
- **No fake countdown.** Urgency is structural (real cohort + signal decay).
- **Plain English for Marcus.** Nothing he has to decode; "you never touch code"
  is stated outright. "Engine/verdict" is plain-English metaphor (the *Loud
  Engine* parable), never a load-bearing code term.
- **One voice.** Every line is first-person The Data Nerd; signed once at the
  close.

## Page mapping

| Beat | DOM block in `landing/thanks.html` |
|---|---|
| 1–3 + trial close | the `space-y-4` note under the avatar header |
| 4 | `Here's the whole stack` `<ul>` |
| 5 | `The only comparison that matters` box |
| 6 | `Your price` block |
| 7 | `The early-deal guarantee` box |
| 8 | `Two honest reasons this is the moment` list |
| 9 | the `btn-primary` CTA + email-carry note |
| 10–11 | the `graceful no` block + P.S. |

## What changed vs the prior page (this rewrite)

Sharpening, not a tear-down — the page was already strong. Added the explicit
**reaffirmation** (beat 1), tightened the **epiphany** to land the miss harder,
added the **"I read the engine; you read the verdict / you never touch code"**
fear-relief, added a **trial close**, sharpened the **guarantee** to a clean
full-refund promise, and reframed the urgency intro from "reasons not to wait"
to **"this is the moment to decide."** Conversion mechanics, classes, and the
no-fabrication / no-fake-timer constraints are all preserved.
