# Community posting checklist

Use this checklist before any GitDealFlow post, comment, channel message, or community pitch.

## 1. Choose the right channel

- [ ] This is an existing, active account or partner community. Do not open a new account for this post.
- [ ] The community has a clear fit for public GitHub engineering data, investor diligence, or startup research.
- [ ] The post gives the community a useful finding, method, or dataset before mentioning GitDealFlow.
- [ ] The channel is not Stack Overflow.
- [ ] The channel is not Hacker News. All HN posting, warm-up, and appeals remain human-only and paused.
- [ ] LinkedIn means the GitDealFlow company page only, and has explicit approval.

## 2. Check the community's rules

- [ ] Read the current rules and pinned posts.
- [ ] Check whether self-promotion, external links, charts, datasets, and research posts are allowed.
- [ ] If the rules are unclear, ask a moderator before posting the dataset or methodology piece.
- [ ] Record the approved content type, flair, link rule, disclosure rule, and pacing rule in the channel log.
- [ ] For Reddit, run the existing pacing and participation gate. Never post to r/SaaS.

## 3. Verify every claim and link

- [ ] Run `/Users/sipi/.local/bin/python3.11 ~/.hermes/scripts/gdf_claims_guard.py <draft-path>` and stop on any failure.
- [ ] The only panel claim is `350+ startups` or `350+ orgs`.
- [ ] The sector claim is `15 sectors`.
- [ ] If citing the research panel, use `219 startup-period observations across 55 startups` exactly. Do not recast it as a count of funding events.
- [ ] `21-47 days` is the interquartile range before public fundraise announcements. It is not a prediction promise.
- [ ] The live data, methodology, and final UTM link return HTTP 200.
- [ ] The UTM names the channel and campaign.

## 4. Write and publish safely

- [ ] Open with ownership disclosure when linking to GitDealFlow.
- [ ] Use one useful finding and one link, not a product pitch or a list of links.
- [ ] Do not claim that an engineering signal proves funding, revenue, company quality, or a buy decision.
- [ ] Use the required flair or post format.
- [ ] Do not send a post if a CAPTCHA, rate limit, moderation block, or permission gate appears. Report it once.
- [ ] Telegram: the bot must be an admin before it can repair or publish channel posts.

## 5. Prove the placement and learn

- [ ] Record the live URL, post ID, date, channel, UTM, and whether the post is visible while logged out.
- [ ] Monitor comments and respond to real questions for 48 hours.
- [ ] Log qualified visits, replies, subscribers, demos, and revenue. Do not count a draft, submission, or bot-generated asset as reach.
- [ ] After four published placements without a business signal, stop or redesign that channel.

## Channel notes

| Channel | Current operating rule |
|---|---|
| Slack | Only pursue a recurring drop after an established investor community accepts it. |
| Telegram | Repair the existing channel first. Requires bot admin rights. Then publish one useful weekly post. |
| Facebook and LinkedIn groups | Do not prioritize unless a named angel or investor group accepts the research format. |
| Quora | Publish a complete answer that explains GitHub signals and cites the dataset. |
| Niche investor forums | Contribute for a month in three active communities before requesting a data placement. |
| Indie Hackers | Restart with one monthly, evidence-based build log. |
| Reddit | Max four actions per day. Keep seven days between promotional posts and the 5:1 participation gate. |
| Hacker News | Hard-disabled for autonomous activity. No new appeal follow-up. |
