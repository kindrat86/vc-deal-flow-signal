# Reddit Wiki — Contribution Strategy

**Reality check:** r/venturecapital and r/startups wikis are mod-edit-only. Community members cannot directly edit. The path is to propose additions via modmail and hope a mod accepts. Low-probability, low-cost — worth one attempt per sub.

**Account to use:** 705-karma Reddit account (per memory). Old enough + has karma = not a spam flag.

**Blocker to remember:** r/venturecapital already silently removes product posts (per memory: `feedback_rvc_autoremoves_product_posts.md`). Modmail might get filtered too. Keep expectations low.

---

## Target 1: r/venturecapital Wiki

### Modmail draft (send once, don't follow up)

> **Subject:** Resource list suggestion — alternative data tools for VCs
>
> Hi mods,
>
> Long-time lurker, 700+ karma. I've been collecting resources that come up in this sub frequently when the "how do I find startups earlier" question gets asked. The wiki doesn't currently have a centralized resource list on data-driven sourcing and I think a short one would cut down on repeat questions.
>
> Below is a draft addition — I'd suggest placing it under a new "Data-driven sourcing" header in the wiki. Everything is free or has a free tier. I've included one link to my own project (GitDealFlow) with full disclosure at the top; feel free to strip it and keep the rest if the attribution is a dealbreaker. I'd rather have the resource list land for the community than not land at all.
>
> Happy to revise.

### Proposed wiki text (give them the markdown)

```markdown
## Data-driven deal sourcing — resource list

_Contributor disclosure: I operate one of the tools below (GitDealFlow). Mods, feel free to remove it if that's a problem. The other resources are unaffiliated._

Data-driven sourcing supplements warm intros with quantitative signals. The common categories:

**Engineering / GitHub signals**
- [GitDealFlow](https://gitdealflow.com) — free weekly signal report on startup commit velocity across 15 sectors
- [GitHub Archive](https://www.gharchive.org/) — raw GitHub event data, BigQuery-accessible
- [OSS Insight](https://ossinsight.io/) — public analytics on OSS trends, useful for dev-tool sector mapping

**Hiring signals**
- [Revelio Labs](https://www.reveliolabs.com/) — workforce intelligence, paid
- [Draup](https://draup.com/) — hiring + talent intelligence, enterprise
- [Ashby careers pages](https://jobs.ashbyhq.com/) — public ATS, scrape-friendly

**Web traffic**
- [SimilarWeb](https://www.similarweb.com/) — free tier shows rough directional data
- [Cloudflare Radar](https://radar.cloudflare.com/) — free aggregate internet traffic stats

**Startup databases (coverage, not signal)**
- [Crunchbase](https://www.crunchbase.com/), [PitchBook](https://pitchbook.com/), [Dealroom](https://dealroom.co/), [Harmonic](https://www.harmonic.ai/), [Tracxn](https://tracxn.com/)

**Dev community listening**
- [Product Hunt](https://www.producthunt.com/), [Hacker News](https://news.ycombinator.com/), [Indie Hackers](https://www.indiehackers.com/), r/SideProject

**Academic primer**
- ["Engagement with Open Source Communities, Innovation, and Startup Funding: Evidence from GitHub"](https://pubsonline.informs.org/doi/10.1287/orsc.2023.18348) — Organization Science, 2023
- ["Alternative Data in Private Equity"](https://www.bain.com/insights/alternative-data-in-private-equity/) — Bain & Company
- ["How to Use Alternative Data to Find the Best Deals"](https://hbr.org/2022/11/how-to-use-alternative-data-to-find-the-best-deals) — Harvard Business Review
```

---

## Target 2: r/startups Wiki

### Modmail draft

> **Subject:** Wiki suggestion — "how investors evaluate my startup" resource list
>
> Hi mods,
>
> r/startups gets a steady stream of "how do investors actually evaluate me?" posts. The wiki has great founder-side resources but not much on the evaluator-side mental model.
>
> I've drafted a short section that could live under a new "Understanding investor due diligence" header. It covers what investors actually look at in public data (GitHub, hiring, web traffic) before they even reply to a cold deck. Useful for founders trying to understand their own funnel.
>
> Full disclosure: one link below is my project (GitDealFlow). Strip it and keep the rest if the attribution is an issue.

### Proposed wiki text

```markdown
## Understanding investor due diligence (founder-side)

What investors look at before they reply to your cold outreach:

**Engineering signals (for software startups)**
Most VCs with a data operation pull your public GitHub activity before the first call. They check commit velocity (are you shipping consistently?), contributor count (team size proxy), new repo creation (platform-building signal), and tech stack (stage-appropriateness). See [How VCs Use GitHub for Technical Due Diligence](https://signals.gitdealflow.com/blog/github-due-diligence-for-vcs) for the framework they use.

**Hiring signals**
Job posts tell investors you've raised or are raising. Senior-engineer and head-of-GTM posts signal Series A prep. If you don't want VCs inferring round timing, keep hiring quiet.

**Web traffic**
SimilarWeb and Cloudflare Radar give rough traffic estimates. A startup with 3x web traffic growth over 60 days is worth a warm intro even without one.

**Social mentions**
Late signal. By the time you're trending, your round is closing.

**What investors DON'T care about (that founders overweight)**
GitHub stars, forks, Product Hunt ranking three months ago, Twitter followers under 5k. These are vanity metrics for evaluation purposes. Consistency and trajectory beat peaks.

**Academic grounding**
["Engagement with Open Source Communities, Innovation, and Startup Funding: Evidence from GitHub"](https://pubsonline.informs.org/doi/10.1287/orsc.2023.18348) — 2023 study linking OSS engagement to funding outcomes.
```

---

## Target 3: r/SideProject, r/Entrepreneur wikis

**SKIP.** Both wikis are anemic and mod-inactive. Time is better spent on direct posts in those subs (already covered in the Reddit seeding plan per memory).

---

## Fallback: post as a standalone resource thread

If modmail doesn't land in 7 days:

**Post title:** `[Resource] Data-driven deal sourcing tools used by VCs in 2026`

Post the r/venturecapital wiki draft above as a standalone text post in both r/venturecapital and r/startups. Flair as "Resource" or "Tools" if those flairs exist. Expected: r/venturecapital removes it via automod (per memory). r/startups may keep it if the framing is founder-side.

**Monitor:** check post status at +1hr, +6hr, +24hr. If shadow-removed, flag in modmail and accept the outcome.

---

## Execution checklist

- [ ] Send r/venturecapital modmail Apr 21
- [ ] Send r/startups modmail Apr 21
- [ ] Monitor modmail for response through Apr 28
- [ ] If no response by Apr 28, post fallback thread in r/startups only (skip r/venturecapital per auto-remove history)
- [ ] Log modmail response + post outcome in `marketing/reddit-seeding/wiki-attempts.md`
