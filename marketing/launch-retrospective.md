# Launch Retrospective — Wave 1 + 2 + 3
## Posts to publish Apr 26 (Sun) after Product Hunt goes live

Two artifacts here, both with placeholders to fill on launch morning with real numbers from PostHog (eu.posthog.com), Substack/email tool, MCP npm stats, and PH itself.

Replace every `{X}` before posting.

---

## Artifact 1: Indie Hackers retrospective post

**Destination:** https://www.indiehackers.com/post/new
**Account:** The Data Nerd
**Group/Tags:** Indie Hackers (main feed) + tag with "Launch", "Marketing", "Building"
**Post type:** Text post (no link card)

### Title
What 7 days of launching taught me — VC Deal Flow Signal launch retrospective

### Body

Last Sunday I launched VC Deal Flow Signal on IH and Reddit. Tuesday on Show HN. Today on Product Hunt. Here's the honest scoreboard.

**The numbers (Apr 19 → Apr 26):**

- Unique visitors: {X}
- Email signups: {X} ({X}% conversion)
- Paid signups (EUR 9.97/mo): {X}
- MCP server installs: {X} (`npx @gitdealflow/mcp-signal`)
- IH post (Apr 19): {X} upvotes, {X} comments
- Show HN (Apr 21): rank {X}, {X} points, {X} comments
- Reddit (r/venturecapital, r/startups, r/SideProject): combined {X} upvotes
- Product Hunt (Apr 26, today): {X} upvotes so far

**What worked:**

1. **Staggered the launch over 7 days, not 1.** IH and Reddit on Sunday let me iterate the pitch before Show HN on Tuesday. By the time Product Hunt landed, the messaging was tight.
2. **Seeded Reddit and IH for 4 days before launching.** The launch posts didn't come from a cold account. The 696-karma Reddit account had visible comment history in r/venturecapital, r/startups, r/Entrepreneur, r/dataisbeautiful. Same on IH. Result: launch posts didn't get filtered or downvoted.
3. **Led with one specific number, not the product.** "orbiternassp +329% commit velocity, 3 weeks before any announcement" beat "we monitor GitHub for VCs."
4. **The MCP server got more dev attention than the dashboard.** I almost didn't ship it. 14 of the {X} signups came from the `npx @gitdealflow/mcp-signal` install path.

**What flopped:**

1. **{Fill: a thing that flopped — likely a channel or tweet that didn't land}**
2. **{Fill: a tactical mistake — likely posting too late, weak headline, or HN flagged}**
3. **Pricing question came up constantly and I didn't have a tight answer.** "Why 9.97 not 49?" "What's in Insider Circle?" Need to ship a comparison page this week.

**What I'd do differently:**

- Build the email list earlier. I had {X} subscribers at launch. Should have had 500. The launch inflates traffic but the email list is what compounds.
- Start the Twitter account 60 days earlier, not 14. @data_nerd had {X} followers at launch. Most launch accounts have 2-5K minimum to clear the algorithm.
- Demo GIF for the MCP server should have been ready Day 1 of the MCP wave. Recording it post-launch is too late.

**The real lesson:** distribution-first is not just a slogan. The 4 days I spent seeding Reddit and IH did more for launch traction than the 4 weeks I spent polishing the landing page.

If you're building something, start digging your distribution well 30 days before you ship code. By the time you launch, the well should already have water.

Happy to answer anything about the data pipeline, the MCP server, the seeding strategy, or the Brunson + Isenberg playbook I used.

— The Data Nerd

(Live on Product Hunt today if you want to see the listing: {PH-link})

---

## Artifact 2: Twitter retrospective thread

**Destination:** https://x.com/data_nerd/compose/tweet
**Account:** @data_nerd
**Post timing:** 10:06 EEST Sunday Apr 26 (right after PH goes live)
**Format:** 9-tweet thread

### Tweet 1 (hook)

7 days ago I launched VC Deal Flow Signal.

Today it's live on Product Hunt.

Between those two events: IH, Reddit, Show HN, an MCP launch, and {X} email signups.

Here's what 7 days of launching actually taught me 🧵

### Tweet 2

The launch was staggered, not simultaneous.

Day 1 (Sun): IH + Reddit — low stakes, refine messaging
Day 3 (Tue): Show HN — technical audience, methodology questions
Day 8 (Sun): Product Hunt — best version of the pitch

Single-day launches waste 2/3 of your shots.

### Tweet 3

The accounts I launched from weren't cold.

I spent 4 days before launch dropping pure-value comments on Reddit and IH. No URL. No "I built a tool." Just observations from the data.

By launch day the accounts had visible histories. The launch posts didn't get filtered.

### Tweet 4

What I led with wasn't the product. It was one specific number:

"orbiternassp: +329% commit velocity in 14 days. Space Tech, 37 contributors. The signal was public the whole time."

Specific data > "we monitor GitHub for VCs."

### Tweet 5

The MCP server outperformed the dashboard for developer-investors.

`npx @gitdealflow/mcp-signal`

Install it once, query our startup data from Claude.

{X}/{Y} signups came from this path. I almost didn't ship it.

### Tweet 6

What flopped:

- {Fill: weak channel or weak day}
- {Fill: pricing confusion}
- Twitter account had {X} followers at launch — too few to clear the algorithm

Should have started the @ 60 days earlier, not 14.

### Tweet 7

Numbers (raw, no spin):

Visitors: {X}
Email signups: {X}
Paid: {X}
MCP installs: {X}
HN: rank {X}
PH: {X} upvotes (still climbing)

The email list is the only number I'll care about in 90 days.

### Tweet 8

The lesson I'll carry into the next thing:

Distribution-first isn't a slogan. The 4 days I spent seeding Reddit + IH did more for traction than the 4 weeks I spent polishing the landing page.

Start digging the well 30 days before you ship code.

### Tweet 9 (CTA)

If you invest, sourceing alpha from public engineering data is what we do.

Free Signal Digest (monthly): gitdealflow.com
EUR 9.97/mo dashboard: signals.gitdealflow.com
Live on Product Hunt today: {PH-link}

Thanks for following along this week.

---

## Pre-publish checklist (Apr 26 morning)

- [ ] Pull final numbers from PostHog (eu.posthog.com)
- [ ] Pull MCP install count from npm: `npm view @gitdealflow/mcp-signal`
- [ ] Replace every `{X}` and `{Fill: ...}` placeholder
- [ ] Confirm PH link is live before posting
- [ ] IH post first (10:10 EEST), then Twitter thread (10:15 EEST) so IH crowd sees both
- [ ] Cross-link: IH post mentions PH, Twitter thread mentions IH and PH
- [ ] Pin the Twitter thread for the week
