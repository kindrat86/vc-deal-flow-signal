# Introduction, Why public data beats private intros

There is a quiet truth in venture capital that nobody likes to say out loud. The deals that go to the partners with the best networks are not the deals with the best founders. They are the deals with the loudest founders. The two overlap less than you would think.

This book exists for the investors who do not want to wait for a warm intro to surface a Series A bound company. It exists for the developer-investors who know how to read a commit log, understand a contributor graph, and trace a dependency tree, and who suspect, correctly, that those three skills are now the highest-leverage sourcing tools in the venture stack.

If you have spent any time at all on Crunchbase Pro, PitchBook, or the dozen tools that promise to surface the next Series A round, you have already learned that the surface area of those tools is built around what has already happened. Funding announcements. LinkedIn job changes. Press releases. Conference talks. The data shows up after the fact, and by the time it shows up, the round is closed and the carry is gone.

The data that fires *before* the round is not in those tools. It is in the place where the company is actually being built, the public GitHub repository.

## What this book is

This book is a field manual. It is the practical, operationalized version of the methodology paper hosted on SSRN as preprint 6606558, written for investors and engineers who want to move from reading the paper to running the computation on their own watchlist this Monday morning.

It is not a book about venture capital theory. There are already shelves of those, and most of them are stale. It is not a book about angel investing as a lifestyle, or about portfolio construction at scale, or about the merits of the seed-versus-Series-A debate. There are excellent books for each of those topics, and this is not one of them.

What this book is, specifically, is a step-by-step decoder for seven public signals on GitHub that, when read together with appropriate scepticism, in the right combination, with the right thresholds, historically fire three to six weeks before a Series A announcement. The signals are computable from a single public REST endpoint, free, no scraping, no proprietary data licences. Every claim in the book is reproducible by you, with a $0 budget and a personal access token.

You will finish this book in a single sitting if you read briskly. You will finish all of the appendix exercises in a long weekend. By the end of that weekend you will be able to look at any GitHub organization and tell, in about two minutes, whether the engineering acceleration there is the kind of acceleration that precedes a fundraise, or the kind that just looks like one.

## Why I wrote it

I built the GitDealFlow signal stack because I was tired of explaining the same thing three times a month to friends who run angel checkbooks. The conversation was always the same: a friend would tell me about a startup they had just heard about; I would pull up its public GitHub; we would scroll the contributor graph for two minutes; and they would either commit to writing a check that week or pass entirely on what they had been on the verge of committing to before the call. The data was that decisive.

After the fifteenth or twentieth conversation it became clear that the bottleneck was not investor judgement. The bottleneck was access to a workflow. Most of the people I was talking to could read a commit log in their sleep. What they could not do, without forty hours of plumbing work, was do it across two hundred startups at once, on a recurring weekly cadence, with the kind of consistency that produces a deal-flow funnel rather than a series of one-off bets.

So I built the workflow. The first version was a Google Sheet. The second was a Python notebook. The third was a tool that ran on a cron and emailed me the top movers every Monday. The fourth, eventually, became GitDealFlow, a public, auditable, free-tier-having, methodology-published platform with an MCP server, a JSON API, a written digest, and a buyers guide.

The book in your hands is the part of GitDealFlow that does not depend on the platform. It is the part of the workflow that lives in your head. The platform automates it; this book teaches you how to do it yourself, even if our servers vanish tomorrow.

## What you will learn

By the time you finish the book you will be able to:

1. Compute the 14-day commit-velocity acceleration for any organization using only the GitHub public REST API and a one-paragraph script.
2. Identify a real contributor influx and distinguish it from the noise of a documentation sprint, a hackathon, a contracting team, or a security-bot push.
3. Read a startup's infrastructure repository pattern and infer what it is about to launch, and roughly when.
4. Spot a star-velocity detachment that signals an off-platform inflection (a launch, a viral demo, a Hacker News spike) before the inflection is public knowledge.
5. Use issue-closure cadence as a leadership-quality tie-breaker when two startups score similarly on every other axis.
6. Trace dependency adoption across npm, PyPI, Maven, and crates.io to find the developer-tools companies whose user bases are quietly compounding.
7. Read the public visibility footprint of a founding team, engineering blog cadence, conference talks, OSS maintenance, and tell the difference between marketing visibility and trust-market visibility.
8. Compose all seven signals into a single Scout Score that ranks any sector watchlist in about ninety minutes.
9. Replicate any rank on the live GitDealFlow leaderboard from raw public data, to verify that we are not making it up, and so that you can audit your own workflow against an external benchmark.
10. Avoid the seven most common false-positive patterns that look like Series A signals but are actually something else entirely.

That is what the book will give you. What it will not give you is a private network, a deeper Rolodex, a warmer intro path, or any of the other social goods that nobody can mass-produce on demand. Those are still useful. They are just no longer the only path.

## Who this book is for

The primary reader I have in my head while writing this is the developer-investor, somebody who writes software professionally and also writes angel checks, or who is preparing to. If that is you, this book is calibrated to your existing intuitions; you will be able to skip the parts about how to use a JSON API and dive straight into the threshold-tuning chapters.

The secondary reader is the analyst at a small fund or a syndicate, who knows the venture domain very well and has occasionally wished they had a more programmatic way to surface the deals their partners are missing. If that is you, this book is also for you, though you will probably want to pair it with a colleague who can run the curl commands while you read the methodology.

The tertiary reader is the investor who does not write code and does not intend to start. If that is you, you will find about thirty per cent of the book directly readable, and the rest will give you a clear-eyed picture of what your developer-investor competitors are doing, which is itself useful, because you cannot effectively price an asset class you do not understand the discovery economics of.

## Why public data, and why now

There has never been a better moment to be a developer-investor. Three things have changed in roughly the last five years:

First, the public GitHub REST API has stayed free, well-documented, and rate-limited at a level that lets a serious individual investigator pull six-figure-row datasets per week with a single personal access token. This is a quiet miracle. Most other social and professional platforms have either paywalled or actively closed their public APIs in the same window. GitHub has not. As long as that holds, every claim in this book is reproducible by every reader, on a zero-budget curl-and-jq stack, indefinitely.

Second, the average serious technical startup now does its real building in public from day one. Five years ago you could find a stealth-mode AI infra company with a private monorepo and no public footprint. That is now the exception. Most of the breakout AI infra companies of the 2024 and 2025 cohort had their core repository public from week one. They publish their evaluation harnesses, their model weights, their benchmarks, their contribution guidelines, their terraform, all of it. They build in public because the developer audience they need to recruit, the open-source maintainers they need to integrate with, and the hiring funnel they need to fill all live on the public side of GitHub. This is true even when the founders are coming out of private-by-default cultures like Google or Apple.

Third, model context protocol (MCP) and the broader agent-tool ecosystem now lets an investor compose this kind of public-data analysis directly inside their LLM workflow. You can ask Claude or Cursor or Mistral Le Chat to look up a startup's commit-velocity acceleration the same way you ask it to look up the weather. This is new, none of it existed eighteen months ago. It changes what an individual investor can sustain as a recurring weekly workflow from what used to take a half-day to what now takes nine minutes.

These three things together have produced a small, brief, possibly closing window in which an individual investor with a laptop, a personal GitHub token, and a willingness to read this book can systematically out-source the consensus deal-flow tools on the long-tail Series A. That is the window this book is written for. I do not know how long it will last. I would not bet that it stays open past the end of this decade, because either the data will get pay-walled (the pessimistic scenario), or the patterns will saturate as more capital learns them (the optimistic scenario for the asset class, less so for individual carry). Read the book now.

## How to read this book

The book is structured to be read straight through in the order it is presented, and the seven signal chapters build on each other in ways that make skipping costly. The introduction you are now finishing, plus the methodology chapter (chapter eight) and the replication appendix (chapter nine), can be read as a self-contained crash course if you only have one evening, but you will get more out of every signal chapter if you read in sequence.

Each signal chapter follows the same structure. First, the signal in plain English: what it is, what it measures, why it precedes a Series A, what the median lead time is. Second, a worked example from the public record, a real startup, a real signal firing, a real outcome. Third, the false-positive patterns that look identical at first glance and how to distinguish them. Fourth, the threshold guidance: when to act, when to wait for two-period confirmation, when to walk away. Fifth, a small set of exercises that take fifteen to thirty minutes each and produce concrete output you can paste into your watchlist.

The methodology chapter and the replication appendix are written in the practical, get-to-the-curl-command style of a good engineering README. They are intended to be read with a terminal open. If you do not have a terminal open while reading them, you will not get the value out of them, and you should either skip them or come back later when you are at a desk.

The conclusion is short. Read it last. It contains the only material in the book that is opinion-laden and forward-looking, and it is intentionally separated from the signal mechanics to keep the mechanics clean.

## A note on falsifiability

Every claim in this book is, in principle, falsifiable. Every threshold has a number. Every signal has a formal definition. Every example has a public URL you can verify. Where my numbers differ from the SSRN preprint, I have updated the book to match the preprint, because the preprint was peer-reviewed first and the book second. Where my reasoning differs from a well-formed counter-argument I have read or heard, I have tried to acknowledge the counter and explain why I still think the original holds.

This matters because there is a long history in venture-capital writing of unfalsifiable claims dressed up as data-driven insight. The phrase "great founders" alone has been used to retrofit success and failure with equal explanatory power, and it is not the only one. I do not want this book to be that. If you find a place where a threshold I gave does not hold up against a representative public-data sample of your own choosing, write to me and I will publish your finding in the next edition. The contact information is in the back.

## The deal we are making

Here is the deal we are making across these one hundred-odd pages. I am going to teach you a workflow that, done correctly, at sustained cadence, against a watchlist of even modest size, will measurably change the quality of the deal flow that lands on your desk. In exchange, I am going to ask you to do three things. The first is to actually run the workflow, not merely read about it. The second is to share what you learn, not the deals, but the methodology critiques, back into the public record, so that the methodology improves over time. The third is to subscribe to the free Monday-morning Signal Digest at gitdealflow.com, because the signal stack is not static and you should know when the thresholds change.

That is the deal. If it sounds reasonable, turn the page.
