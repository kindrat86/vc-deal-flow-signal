# Indie Hackers build log, August 2026

## Title

I stopped calling GitHub activity a funding prediction. Here is what changed.

## Tags

Building, Data, Marketing

## Body

I build GitDealFlow, a public dataset of engineering activity across 350+ startups in 15 sectors.

The early version of the project made a familiar builder mistake: it treated a useful pattern as a product claim. Faster commits, more contributors, and new repositories can be useful diligence inputs. They do not prove that a company will raise money, become healthy, or be a good investment.

So I changed the operating rule.

The dataset now separates three things that had been blurred together:

1. **The live dataset:** public GitHub activity for 350+ startups, updated for Q3 2026.
2. **The retrospective research:** 219 startup-period observations across 55 startups. It gives context for what was seen historically, not a promise about a future company.
3. **The product decision:** a reader decides whether any public signal belongs in their own diligence process.

The practical work this month was less exciting than adding another feature:

- locked the public copy to a stable `350+` floor instead of publishing a changing raw count
- published machine-readable JSON and CSV endpoints with a methodology page
- added checks that block stale panel-size and sector claims before a distribution draft is used
- added one community-posting checklist that requires rule checks, ownership disclosure, tracked links, and a logged-out visibility check
- stopped autonomous Hacker News activity after repeated dead submissions

The distribution lesson has been just as clear.

A dataset link by itself is not a community contribution. The next round of work is one monthly build log like this, then useful replies where builders are already discussing research, data quality, and launch mistakes. If a community does not want that contribution, it does not get a post.

The open question I am working on: how would you show a skeptical founder that a public engineering signal is worth checking, without turning it into a fake prediction or a sales pitch?

Methodology: https://signals.gitdealflow.com/methodology
Public data: https://signals.gitdealflow.com/api/signals.json
