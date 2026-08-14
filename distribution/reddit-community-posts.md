# Reddit community posts — r/venturecapital, r/startups, r/SaaS

Backlog item from progress.md ("Draft posts for r/venturecapital, r/startups, r/SaaS").
Rules baked in: value-first, no link in the post body on r/venturecapital (link only in a
comment if someone asks), one sub per day, never the same week as the MCP posts
(reddit-mcp-posts.md) to avoid account-level spam flags.

Account: use the established account that posted the MCP threads. Do NOT use a fresh account.

---

## 1. r/venturecapital — value post, zero links

**Title:** GitHub activity as a sourcing signal: what 8 weeks of tracking 350+ startups taught me

**Body:**

I've been tracking public GitHub activity (commit velocity, contributor growth, new repo
creation) across 350+ startup engineering orgs in 15 sectors since April, trying to answer
one question: does engineering acceleration actually lead funding events, or is that just a
nice story?

What I've seen so far:

1. **Contributor step functions beat commit spikes.** Commits are noisy — one refactor or
   an intern's weekend produces a +999% artifact on a small base (literally in this week's
   data). A team going from 9 to 15 active contributors in 30 days almost never happens
   without new money or serious traction.

2. **The lead time is real but shorter than I hoped.** Where I could match acceleration to a
   later announcement, the gap clustered around 3-6 weeks, not the 3-6 months that would make
   this a true crystal ball. It's an early-confirmation tool, not a divination tool.

3. **Sector waves are visible.** Right now cybersecurity orgs are accelerating as a group
   (three orgs above +90% velocity this week). Last month it was AI infra. Infra-layer
   acceleration seems to lead application-layer acceleration by a couple of quarters.

4. **The signal dies above Series B.** Big orgs have steady-state engineering rhythms;
   acceleration stops meaning anything. This only works pre-seed through A/B.

Curious whether anyone here actually weights engineering signals in sourcing, or if this
stays a curiosity next to warm intros. What would make a signal like this decision-grade
for you?

*(No link — if someone asks where the data lives, reply with signals.gitdealflow.com and
nothing else.)*

---

## 2. r/startups — founder-angle value post

**Title:** Investors can see your GitHub heating up before you announce anything — I measured it

**Body:**

I run a small project that tracks public GitHub activity across 350+ startup orgs for
investors. Founders should know what's visible from the outside, because most of you are
leaking your roadmap without realizing it:

- **Hiring shows up first.** New contributors appear in public repos weeks before the
  LinkedIn announcements. A +72% contributor jump in 30 days reads as "they closed a round
  or found PMF" to anyone watching.
- **New public repos telegraph strategy.** Three new repos in a month = new product surface.
  Competitors and investors both read this.
- **Docs sprints telegraph fundraising.** A sudden documentation/README/security-policy
  cleanup wave is the classic "preparing for technical due diligence" tell.

None of this requires access to anything private — it's all in the public API.

If you're in stealth: keep the real work in private repos until launch, and assume anything
public is being indexed (it is — by me, among others).

If you're NOT in stealth: this cuts the other way. Visible engineering momentum is free
credibility with investors who track this stuff. Some founders deliberately ship in public
for exactly this reason.

Happy to answer questions about what's visible / how to read your own org's external signal.

---

## 3. r/SaaS — build-in-public / business angle

**Title:** My SaaS has perfect SEO scores, 5 free APIs, an MCP server — and zero revenue. Lessons from over-building distribution infrastructure

**Body:**

Eight weeks in on a B2B data product (GitHub engineering signals for VC deal sourcing,
EUR 9.97-97/mo). Honest scoreboard:

**What I built:** weekly-updated dataset, free JSON/CSV APIs, MCP server (~15 npm
downloads/day), A2A endpoint, Chrome extension, 80+ pSEO pages (Lighthouse SEO 100/100),
12-email drip funnel, Telegram channel, automated YouTube briefs, an SSRN paper.

**What I have:** ~0 weekly visitors, 0 paying customers.

The lesson I'd hand to past-me: I kept choosing infrastructure over conversations because
infrastructure doesn't reject you. Every piece above is real and works, and none of it
matters because the target buyer (seed-stage VCs) doesn't wander into pSEO pages — they
move on trust networks: other VCs, founder Twitter, a handful of newsletters.

What I'm changing this month: dropping all new build work, doing 20 direct conversations
with seed investors, posting data observations daily where they already hang out, and
treating the free dataset as the conversation-starter instead of the destination.

Will report back. AMA about any of the infra if useful — at least the over-building
produced reusable parts.

*(This one CAN carry the link if mods allow: signals.gitdealflow.com. The vulnerability
angle is the hook — r/SaaS rewards honest zero-revenue posts far more than launch posts.)*

---

## Posting order

| Day | Sub | Why this order |
|---|---|---|
| Day 1 | r/SaaS | Lowest risk, builds comment karma on the account |
| Day 3 | r/startups | Founder-angle, no self-promo, safe |
| Day 5 | r/venturecapital | Smallest, strictest sub — go in last with a warmed account |
