# GitDealFlow Distribution Audit and Autonomous Execution Brief

**Audited:** 2026-08-21, 11:44 EEST
**Scope:** `gitdealflow.com`, `signals.gitdealflow.com`, the public MCP/API surfaces, and known distribution accounts/assets. This is a distribution audit only: qualified reach, placement, frequency, share of voice, and cost per qualified visitor. It does not score conversion or organic ranking.

**Evidence used**

- Live apex, signals site, RSS feed, JSON API, MCP discovery manifest, Agent Card, HTTP MCP endpoint, Glama listing, and Chrome Web Store listing all returned HTTP 200.
- Repo: `/Users/sipi/signals-gitdealflow`, current tip `d7b752e033757dadef2fba1058e9ee28ba568c4d` at audit time. The worktree already contains unrelated modified monitoring and ledger files. Do not discard or commit those by accident.
- PostHog, 90-day, GitDealFlow-scoped data: Reddit 293 unique visitors, email 203, LinkedIn 27, GitHub 26, X `t.co` 17, Dev.to 6, Indie Hackers 3. `distribution_landing` fired 89 times in the week starting 2026-08-16, but zero associated `signup_verify_sent` events were recorded in that same weekly roll-up.
- Account/access probe: X has no verified API backend, Reddit has no read backend, LinkedIn has no verified backend. This is an account-operability gap, not proof that the accounts do not exist.
- Canonical claims ledger and `AGENTS.md` are authoritative for public numbers.

## Executive distribution verdict

**Overall distribution score: 43/100.** The product has unusually strong distributable proof, machine-readable entry points, and a working owned-email surface. Human investor distribution is shallow. Reddit is the only earned channel with material measured traffic, and paid Reddit has already shown bad qualified-visitor economics. The MCP ecosystem is the best scalable placement wedge, but it lacks a current visual demo, proven registry install attribution, and regular community use.

**The main issue:** Ferrari in the garage. The assets exist. The repeatable placement loop, per-channel source-quality reporting, and active account rhythm do not.

**Do not spend the next session on:** paid ads, cold-email volume, more pSEO routes, personal LinkedIn, or another HN submission. The expected qualified reach is weak or the channel is currently unsafe.

## Truth and claim-control note

There is a live credibility risk in the supplied landing copy: it mixed a descriptive observation count with financing-outcome claims. The primary SSRN release is **219 startup-period observations across 55 startups**, with no linked funding-event labels. Before new distribution, reconcile methodology, landing, newsletter, directory copy, and social templates against that wording. A strong distribution placement will magnify this error, not hide it.

---

# 1. Channel strategy and portfolio

| Item | Score | One-line reason | Single highest-impact fix |
|---|---:|---|---|
| POEM mix, owned | 72 | Owned site, RSS, API, MCP, email digest, Telegram, Discord, and GitHub give GitDealFlow durable surfaces. | Name one owned distribution KPI: weekly qualified visitors by placement ID, not total traffic. |
| POEM mix, earned | 31 | Reddit has measurable reach, but HN is frozen and most editorial/community placements are unproven. | Run one disclosed, source-backed community placement every week and log its URL and UTM. |
| POEM mix, paid | 14 | Paid Reddit produced 277 visitors and one qualified visitor, about €19.39 CPQV, so paid readiness is poor. | Keep paid paused until an organic placement proves a source and audience message worth amplifying. |
| POEM mix, rented | 28 | X, LinkedIn, Discord, directories, Product Hunt, and communities exist as concepts, but cadence and account access are patchy. | Build an account/placement board with owner, login state, last action, next permitted action, and policy risk. |
| Channel portfolio completeness | 58 | The product spans developer, investor, email, community, directory, and extension surfaces, but many are only listed rather than active. | Cut the active portfolio to four core lanes for eight weeks: Reddit, MCP registries/GitHub, email, and invited editorial/community. |
| ICP-channel fit | 65 | Developer-investors fit MCP, GitHub, HN, technical newsletters, Discord, and X; traditional investors fit email, warm communities, and Chrome extension. | Split every placement into one of two messages: developer-investor/MCP or traditional investor/Chrome-extension and plain-English report. |
| Channel concentration risk | 36 | Measured non-direct reach is heavily concentrated in Reddit and search/referral noise, not a diversified qualified-investor portfolio. | Build two independent recurring sources: a technical-investor newsletter/editor relationship and MCP-directory/README install flow. |
| Channel capacity/scalability | 53 | APIs, RSS, public data cards, and programmatic assets scale; human posting and editorial acceptance do not. | Turn the weekly signal into a reusable asset pack with a short post, chart, GIF, PDF snippet, and canonical tracked URLs. |
| Always-on vs burst cadence | 39 | The Sunday email is always-on, but community and social planning is largely historical or aspirational. | Install a weekly rhythm with one publishable asset, one community contribution, one registry check, and a Friday scorecard. |
| Channel unit economics | 24 | Paid CPQV is known and bad, while organic channel cost and qualified-visitor cost are not consistently captured. | Add cost minutes and cash spend to every placement log, then calculate CPQV only after source-quality criteria are met. |
| CAC, CPA, ROAS by channel | 18 | Checkout starts exist, but no reliable channel-level cost-to-qualified-visitor or revenue report is evidenced. | Create a PostHog/HogQL report for visitor, qualified visitor, signup start, checkout start, cost, and CPQV per UTM source. |
| Diminishing-returns detection | 15 | There is no evidenced rule that detects repeat posting to the same audience after reach has decayed. | Add a stop rule: pause a channel after four properly tagged placements produce fewer than two qualified visitors each. |
| Kill/pivot criteria | 27 | One existing package says stop/redesign after four published packages with no signal, but this is not portfolio-wide. | Put a target, review date, and kill/pivot rule on every active channel card. |
| Experiment portfolio, ICE/PIE | 22 | There are many old channel ideas but no current scored experiment ledger. | Score the next eight experiments with reach confidence, ICP fit, effort, risk, and measurement readiness before execution. |
| Distribution funnel mapping | 47 | The site has newsletter, lead magnet, MCP, extension, Discord, and content assets, but channels are not consistently mapped to awareness through captured attention. | Require every placement to declare one job: awareness, interest, click, or capture, and one matching CTA. |
| PMF prerequisite check | 51 | The core signal has open methodology and repeated artifacts, but qualified investor demand is not yet shown as a repeating distribution response. | Treat repeat qualified visitor and voluntary sharing as the distribution-side PMF test, not generic pageviews. |

# 2. Content distribution and repurposing

| Item | Score | One-line reason | Single highest-impact fix |
|---|---:|---|---|
| 1-to-many repurposing pipeline | 61 | Weekly signals, research, open data, public API, and generator scripts create raw material for a real pipeline. | Ship one automated weekly asset packet from the live signal API with approved claim-safe variants. |
| Content-channel matching | 56 | MCP stories fit dev channels and diligence cards fit investor communities, but packaging is not consistently channel-specific. | Use a two-column editorial calendar: investor-native diligence card versus developer-native MCP demo. |
| Cross-posting | 35 | Repo history refers to Dev.to, Hashnode, Medium, Substack Notes, and HackerNoon, but live cadence and canonical discipline are not verified. | Inventory every live post with canonical URL, date, UTM, and next repurpose date before publishing another. |
| Syndication, Medium/Dev.to/HackerNoon | 30 | Dev.to sent six measured visitors; the others have no current measured evidence and HackerNoon must not be called a placement before publication. | Republish one proven research article to Dev.to and Hashnode with canonical and unique UTM, then compare qualified visits. |
| WebSub/RSS/IndexNow instant distribution | 75 | Live RSS returned 200 and the project has machine-readable content surfaces; this is strong distribution plumbing. | Verify actual hub delivery receipts and submit only newly published URLs, with a log tied to the source asset. |
| Newsletter distribution | 69 | The free Sunday Signal and lead-magnet welcome sequence exist and email drove 203 identified source visitors. | Publish a public issue archive with a single forward/share action and a per-issue referral UTM. |
| Guest posts | 25 | Draft/pitch ideas exist, but no accepted recurring guest outlet is evidenced. | Target one invited contributor slot with a concrete data contribution, not a generic product pitch. |
| Podcast appearances | 12 | No verified appearance pipeline or booked slot is shown, and anonymous founder positioning limits the format. | Pitch an anonymous data-contributor segment with one exclusive sector chart once the outlier policy is final. |
| Short-form video clips | 22 | A video playbook exists, but there is no current proof asset or measured video distribution loop. | Make a 30-second MCP query-to-answer demo, then deploy it to README, registry listings, X, Discord, and Dev.to. |
| Embeddable widgets/badges | 38 | Chrome extension and public data/API suggest embed potential, but no proven publisher-installed widget is evidenced. | Build one copy-paste “GitHub Momentum Watch” badge with a unique placement ID per embed. |
| Viral artifacts | 40 | “Velocity Verdict” is a credible shareable concept, but no visible share loop or propagation measurement is shown. | Turn Velocity Verdict into a personalized, shareable signal card with a source link and disclosure footer. |
| Shareable free tools, momentum checker | 44 | MCP/API/extension provide free utility, but a browser-native one-minute checker is not clearly distributed as a standalone artifact. | Publish a no-login startup momentum checker that outputs a linkable report card. |
| PDF/workbook assets | 63 | The one-page Velocity Verdict exists and has a direct distribution job. | Add a printable one-page QR/share footer that carries a channel-specific UTM. |
| Screenshot/social-card design | 46 | Landing imagery and data cards exist, but current placement-ready visual proof is weak. | Create a single visual system: one research chart, one live query screenshot, one investor signal card, all claim-guarded. |
| Hook/headline engineering | 57 | The product has strong specific hooks around public engineering activity and lead time, but some copy overstates prediction certainty. | Standardize three claim-safe hook families and test them across comparable placements. |
| Curiosity gap | 52 | “What are five teams accelerating before a round is public?” is naturally curiosity-inducing. | Pair every curiosity hook with a visible public-data receipt so it does not read as a black-box promise. |
| Zero-click value | 35 | Long-form research and feed content are useful, but social/community posts are not evidenced as consistently delivering a standalone insight. | Publish one specific, disclosed weekly observation in the post body before linking anywhere. |
| Share-rate/amplification levers | 24 | No measured share, save, repost, or referral loop is evidenced. | Instrument `share_clicked`, `copy_link`, and `embed_copied`, including platform and placement ID. |
| 5:1 participation rule | 28 | Historical plans mention reply-first behavior, but no current contribution log proves it. | Require five useful comments/replies for every owned link post, recorded in the channel board. |

# 3. Community distribution

| Item | Score | One-line reason | Single highest-impact fix |
|---|---:|---|---|
| Hacker News, Show/Ask/comment strategy | 8 | Account health is unsafe: submissions/warm-up are stopped until a moderator confirms recovery or an item has `dead:false`. | Do not post or warm up; monitor the recovery gate only and preserve a factual future Show HN draft. |
| HN karma and shadowban risk | 5 | Karma is eight and 24 historical dead submissions are reported; live-item survival is the only health metric. | Treat HN as closed until independent recovery evidence exists. |
| Reddit subreddit fit | 59 | Reddit drove 293 visitors, the largest measured earned source; safe subreddits and banned r/SaaS are known. | Use the four-week disclosed rotation: r/datasets, r/juststart, r/devops, then a carefully checked investor community. |
| Reddit anti-ban pacing | 71 | Four actions/day, seven-day promotional spacing, and subreddit restrictions are known and enforceable. | Use the existing state file and posting script as the hard gate before every Reddit action. |
| Reddit self-promo ratio | 41 | A value-first intent exists, but current comment/post ratio is not measured. | Log comments and submissions per subreddit and enforce at least five helpful contributions per owned post. |
| Reddit safe-subreddit coverage | 45 | Three safe communities are known, but their live rules and audience-to-product fit need per-post validation. | Refresh each community’s rules and top-post patterns before choosing the weekly angle. |
| X/Twitter, Dream 100 | 29 | X contributed 17 `t.co` visitors, and API/backend access is unverified. | Re-establish a reply-first rhythm around investor/developer conversations, with one tracked canonical link only when relevant. |
| X threads | 33 | Historical thread drafts exist but current output and engagement measurements are not proved. | Publish one weekly evidence thread built from the same asset packet, then compare it with reply-only activity. |
| LinkedIn company page only | 16 | LinkedIn drove 27 visitors, but no verified company-page operating rhythm exists; personal posting is prohibited. | Verify GitDealFlow company page access and prepare a twice-monthly, disclosure-first company-page post queue. |
| Discord/Slack communities | 35 | A GitDealFlow Discord invite is live and old MCP Discord plans exist, but active server participation and referrals are not measured. | Make one value-first Discord contribution per week and use a unique link per community. |
| Facebook/LinkedIn groups | 12 | No verified access, rules research, or measured placements. | Do not add this lane until the core four lanes have a repeatable qualified-visitor result. |
| Quora/Stack Overflow | 16 | Historical Quora plans exist, but Stack Overflow is a poor product-promotion fit and neither has current proof. | Use Quora only for directly answered investor research questions, with no copied product pitch. |
| Niche forums | 34 | Technical-investor, alternative-data, and MCP communities fit the product but are not mapped to named active communities. | Build a 20-community map with audience, rules, URL policy, activity level, and one honest contribution angle. |
| Community norms and moderator relations | 22 | Disclosure rules are understood, but no active moderator relationship or channel-specific permission record is shown. | For each target community, document rules and ask moderators only when the rules require approval. |
| Account health, age/history | 29 | Reddit safeguards exist; HN is unhealthy; other accounts are not live-verified. | Create an account-health register and block publication if health, access, or policy is unknown. |
| Ban-risk management and appeals | 53 | HN recovery criteria and Reddit safeguards are concrete, which is better than ad-hoc posting. | Add equivalent escalation and appeal records for every active rented platform. |

# 4. Marketplaces, directories, and platforms

| Item | Score | One-line reason | Single highest-impact fix |
|---|---:|---|---|
| Product Hunt | 33 | A listing/draft history exists, but current launch state, reviews, and source-quality data are not verified. | Audit the live listing, update claim-safe assets, and use it as an evergreen launch page only if the audience sends qualified visitors. |
| Indie Hackers | 27 | Only three measured visitors and historical plans, with no active measured cadence. | Publish one honest build-data retrospective after real channel metrics are pulled, not a launch replay with placeholders. |
| G2/Capterra/GetApp/Software Advice | 18 | G2 ownership has a known account-product mismatch; no meaningful investor-tool review demand is shown. | Resolve G2 ownership once, then decide whether the category actually contains the ICP before spending more time. |
| Startup directories | 32 | Some small referrals exist, but no single directory is proven to send qualified traffic. | Keep only directories with an editable profile, UTM support, and an attributable visitor report. |
| MCP registries, Glama | 76 | Glama returns 200, MCP discovery surfaces are live, and this is tightly aligned with developer-investors. | Add the visual MCP demo, current claim-safe copy, and a unique registry UTM to every supported listing. |
| MCP registries, Smithery/MCPT/Open Tools | 48 | Existing presence and version parity are noted, but live status and install/referral attribution are not all verified. | Re-audit each registry live, fix stale descriptions, and record install or outbound-click source separately. |
| Chrome Web Store | 57 | The listing returns 200 and reaches a traditional-investor workflow, but the update/review loop is staged rather than verified live. | Publish the claim-safe 0.2.1 update only after Chrome developer dashboard access is confirmed, then measure store listing referrals. |
| GitHub topics/stars | 52 | Open-source engine and MCP repository are credible distribution assets, but star/referral growth is not on a current scorecard. | Upgrade the README around a real demo GIF, install command, and one link tagged `utm_source=github`. |
| npm/PyPI | 46 | npm package exists, but public fetch is 403 from this environment and download/install telemetry is not evidenced. | Query npm downloads through its API or npm CLI, then add weekly downloads and install-source tracking to the dashboard. |
| Hugging Face | 10 | Publishing is blocked on `hf auth login`; no reproducible notebook is live. | Complete the human login, then publish one reproducible notebook with dataset citation and canonical links. |
| App stores/ASO | 8 | The product is not primarily an app-store product; Chrome Web Store is the relevant store. | Do not spend effort on mobile app stores. |
| Review sites | 17 | No verified review acquisition loop and the category fit is uncertain. | Seek reviews only after real recurring user value and a correct category are established. |
| Dev-tool directories | 52 | MCP ecosystems, GitHub, npm, and Chrome form a credible dev-tool directory stack. | Maintain one canonical directory manifest with URL, status, owner, claims, asset, UTM, and next check date. |
| HARO/media databases | 20 | The data-first angle could work, but no active journalist request-monitoring or media response workflow is evidenced. | Monitor only relevant data/VC/AI requests and respond with a specific chart or methodology comment. |
| Press/PR | 18 | There is no earned press pipeline or newsworthy recurring release calendar. | Create a quarterly transparent outcomes report after the data-quality gate clears. |
| Affiliate networks | 9 | No program, tracking, payout logic, or partner demand is shown. | Defer until there is a proven product-market pull and referral attribution. |
| Deal sites/AppSumo | 5 | Community-driven positioning and investor ICP make discount-led deal sites a poor fit. | Explicitly keep this channel off the roadmap. |

# 5. Owned audience and email

| Item | Score | One-line reason | Single highest-impact fix |
|---|---:|---|---|
| List-building velocity | 34 | The lead magnet and Sunday digest exist, but current weekly net-list growth is not shown. | Publish weekly net-new verified subscribers by acquisition source, excluding bots and bounces. |
| Lead magnet to list distribution | 68 | Velocity Verdict has a clear audience and immediate delivery, backed by a welcome sequence. | Add a share/forward loop to the PDF and track its first-touch source through confirmation. |
| Cold outreach, Dream 100, 30-minute cadence | 0 | Autonomous cold outreach and scraped outreach are rejected for this product. | Replace it with invited editorial contributions, public replies, and relationship-led co-marketing only. |
| Deliverability | 63 | SPF/DKIM/DMARC and suppression discipline are documented, but inbox placement is not reported here. | Run a monthly seed-inbox placement test and show delivery/open/click/bounce by sending domain. |
| List hygiene | 74 | Three suppression layers are active and must remain respected. | Reconcile bounces, complaints, unsubscribes, and all aliases into the suppression audit monthly. |
| Welcome sequence | 62 | Five short welcome emails over seven days are stated live. | Add one explicit forward/share action tied to a source-tagged link in email two or three. |
| Newsletter cadence | 79 | A free Sunday Signal is a concrete, primary owned distribution habit. | Publish the next-send schedule and public archive so every issue can be shared and cited. |
| Re-engagement drips | 31 | Not evidenced as an active, measured program. | Build one low-frequency reactivation sequence that asks readers to choose their sector, not to buy. |
| Reply handling | 62 | Sending and receiving conventions are clear, but response-time and qualitative signal reporting are absent. | Tag replies as investor, operator, press, partner, or irrelevant, and review the weekly mix. |
| Personalization | 43 | The product has sector and signal data, but no evidence of permissioned segment-level content distribution. | Let subscribers opt into one sector or investor type and measure issue engagement by chosen segment. |

# 6. Referrals, viral loops, and partnerships

| Item | Score | One-line reason | Single highest-impact fix |
|---|---:|---|---|
| Referral program design | 24 | Refgrow/webhook infrastructure exists but activation awaits the user’s Refgrow Starter plan. | Activate Refgrow, configure the signed webhook, and test one referral link end-to-end before promotion. |
| K-factor/viral coefficient | 12 | Measurement scaffolding exists but no live referral event stream is verified. | Define the denominator and a weekly K-factor report using confirmed referral events only. |
| Viral loop mechanics | 27 | Weekly signal, PDF card, and MCP output can be shared, but no share-to-new-user loop is closed. | Add one frictionless “share this signal card” action with referral tracking. |
| Share incentives | 18 | No honest, durable incentive is active for GitDealFlow. | Offer a non-monetary incentive such as a public methodology addendum or sector pack after verified sharing, only if it remains truthful and useful. |
| Advocate/ambassador program | 10 | No recruited advocates, charter, or reporting is evidenced. | Defer until three organic repeat sharers are identified from real behavior. |
| Affiliates | 9 | No tracking, contract, payout, or partner fit is evidenced. | Defer until referral tracking has real activity. |
| Co-marketing | 22 | The product has strong data contribution potential, but no two-way partner placement is verified. | Secure one reciprocal, disclosed sector report with a newsletter, community, or podcast that already reaches technical investors. |
| Integrations/API distribution | 74 | MCP, HTTP MCP, A2A, NLWeb, function calling, JSON, CSV, and OpenAPI are unusually strong embedded-distribution surfaces. | Create one “install and first query” proof asset per runtime, tracked separately by runtime. |
| Cross-portfolio cross-promotion | 42 | Portfolio infrastructure exists but cross-promotion has not shown qualified investor traffic. | Use only relevant sibling properties and a single tracked placement, then keep or remove based on qualified visits. |
| Embeddable badge distribution | 31 | The concept is promising but not proven installed by third parties. | Ship a minimal badge embed with a public leaderboard of opted-in installs. |
| Reciprocity loops | 19 | No deliberate give-first partnership loop is visible. | Contribute a useful public-data chart to one community/editor before asking for any link or listing. |

# 7. Paid distribution, non-SEM

| Item | Score | One-line reason | Single highest-impact fix |
|---|---:|---|---|
| Meta/LinkedIn/X ads | 8 | No reliable pixel, audience, creative, or tested economics justify spend. | Keep paused. Earn a proven organic message first. |
| Retargeting/remarketing | 21 | Events and pixels may exist, but audience growth and pixel firing are not live-verified in this audit. | Verify the actual network requests and audience population before allocating spend. |
| Display/GDN | 5 | Low precision for a narrow investor ICP and no evidence of viable unit economics. | Keep off the plan. |
| Newsletter sponsorship | 18 | Audience fit can be high, but no sponsor inventory, rate card, or CPQV model is evidenced. | Price one tightly aligned newsletter slot against an explicit qualified-visitor break-even before buying. |
| Podcast sponsorship | 8 | Expensive, weakly measurable, and no tested audience match. | Do not buy. Pursue earned data-contributor participation instead. |
| Influencer/creator partnerships | 15 | A data visual or MCP demo could earn creator coverage, but no partner has been validated. | Offer one creator a useful exclusive analysis, never a generic sponsored post. |
| UGC | 4 | Poor fit for an anonymous, research-led investor product. | Do not pursue. |
| Deal platforms | 5 | The discount behavior conflicts with the product and community-led strategy. | Do not pursue. |

# 8. Measurement and analytics

| Item | Score | One-line reason | Single highest-impact fix |
|---|---:|---|---|
| UTM hygiene | 52 | Some live links have UTM parameters and a placement-ID system is described, but many sources remain raw referrers or `direct`. | Enforce required `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and immutable `placement_id` for every distributable link. |
| Per-channel attribution | 38 | PostHog source data exists, but 6,403 of 7,895 90-day unique pageview visitors are recorded as `$direct`. | Fix first-touch capture and persist campaign context through email confirmation, MCP installs, and cross-domain hops. |
| Source-quality scoring | 19 | The audit can see visitors and a few funnel events, but no written qualified-visitor definition or scoring report is evidenced. | Define qualified visitor as an explicit non-PII behavior bundle and publish a weekly score by source. |
| Channel ROI/CAC/LTV | 16 | Paid CPQV is known for one failed test, but full economics are not operationalized. | Start with CPQV and cost per subscriber, not LTV estimates, until revenue data supports LTV. |
| Share of voice | 8 | No competitor mention, community discussion, citation, or directory visibility monitoring report exists. | Track monthly mentions, listed directories, share of category posts, and competitor appearances in the same 20 communities. |
| Earned media value | 10 | No accepted placements or comparable paid rates are logged. | Record earned placement reach and only calculate EMV when a defensible comparable ad rate exists. |
| Engagement metrics | 25 | Page and email events exist, but platform-level replies, shares, saves, and comments are not centralized. | Add a manual weekly platform metric import to the channel board. |
| Reach vs engagement vs conversion | 47 | PostHog distinguishes many events, but the report currently mixes noisy web events with distribution decision metrics. | Use a three-stage weekly report: reach, qualified engagement, qualified visitor. |
| Cohort analysis by channel | 17 | No recurring channel cohorts are evidenced. | Create 30-day source cohorts and compare return visits, email engagement, and qualified behavior. |
| Bot/junk filtering | 39 | The large direct bucket and web-vitals volume show likely noise risk; explicit filter rules are not evidenced. | Exclude known bots, internal traffic, test traffic, and suspicious user agents before channel scorecards. |
| Distribution north-star KPI | 24 | Subscriber and checkout events exist but no distribution-specific north star is named. | Use weekly qualified visitors from non-direct, attributable placements as the north-star KPI. |
| Per-channel dashboards | 32 | PostHog can query the data, but no current decision dashboard is evidenced. | Create one dashboard: source, placement, cost, qualified visitors, CPQV, and next decision. |
| Experiment logging | 18 | Plans and drafts exist, but no live hypothesis-result-decision ledger is evidenced. | Add a simple experiment table to the repo and update it every Friday. |

# 9. Audience and targeting

| Item | Score | One-line reason | Single highest-impact fix |
|---|---:|---|---|
| ICP definition quality | 74 | Developer-investors and technical scouts are clearly described, with a separate traditional-VC extension path. | Separate primary ICP language from adjacent operator/scout language in every placement. |
| Persona-channel matrix | 47 | Good narrative mapping exists but no current operational matrix drives channel choice. | Create a matrix that maps each persona to top five channels, job-to-be-done, proof asset, CTA, and exclusion rule. |
| Buyer-community mapping | 43 | HN, MCP, technical newsletters, Discord, X, and investor communities are named, but active community evidence is shallow. | Validate each community with current discussions and rules before putting it in the active queue. |
| Channel-specific audience research | 27 | Little current research is connected to actual content formats or community norms. | Capture the top 20 posts/comments per target community and extract the language, questions, and link norms. |
| Competitor distribution teardown | 19 | Competitor positioning pages exist, but no current distribution-presence benchmark is evident. | Audit five alternative-data/investor tools across newsletters, X, communities, directories, and GitHub. |
| Dream 100 list quality | 34 | A historical list exists, but no qualified mutual interaction or source-of-truth status is shown. | Replace static names with 30 active voices who have posted about VC scouting, alternative data, MCP, or GitHub signals in the last 30 days. |
| Timing/cadence/timezones | 33 | Athens time is known, but platform peak testing is not recorded. | Test two posting windows per active platform for four weeks and compare qualified visits, not likes. |
| Localization | 14 | No localization angle or local community plan is evidenced. | Defer localization until English-language channels show repeatable qualified reach. |

# 10. Platform and account health

| Item | Score | One-line reason | Single highest-impact fix |
|---|---:|---|---|
| Account trust/age | 31 | Reddit is governed, HN is unhealthy, and several accounts are not live-verified. | Maintain an account health register with age, access, recent activity, policy history, and safe cadence. |
| Anti-ban pacing | 67 | Reddit limits and HN stop conditions are specific and defensible. | Apply the same explicit pacing record to X, Discord, LinkedIn company page, and directories. |
| Rate limits | 42 | Some limits are known, but no central tracker stops accidental repeat actions. | Add a channel board field for last action and next permitted action. |
| CAPTCHA/session hygiene | 58 | There is a no-solver policy and human-gate ladder. | Treat login, Google OAuth, and native upload as explicit gates; otherwise use honest retries and documented alternatives. |
| Shadowban detection | 25 | HN has a recovery metric, but other platforms have no visibility checks. | Add a post visibility check from a logged-out or public view after each new placement. |
| ToS compliance | 70 | Disclosure, no personal LinkedIn, no cold scraping, and anti-ban posture are strong. | Add platform-specific disclosure copy to the asset packet so compliance is not recreated ad hoc. |
| Platform policy risk | 49 | Major risks are known but not scored per campaign. | Require a policy-risk rating before any new platform is activated. |
| Brand handle consistency | 43 | GitDealFlow, The Data Nerd, `@sipiteno`, and other historical handle variants create fragmentation. | Publish one approved identity map with canonical brand, pseudonym, account handles, and allowed byline per platform. |
| Moderation history | 22 | HN history is documented; broader platform history is not. | Record all moderation outcomes and rule clarifications in the account-health register. |

# 11. Distribution assets and launch readiness

| Item | Score | One-line reason | Single highest-impact fix |
|---|---:|---|---|
| Logo kit | 45 | A live branded site exists, but a portable channel-specific logo/export kit is not evidenced. | Create a small approved kit: avatar, wordmark, favicon, monochrome mark, and dimensions list. |
| Screenshots | 49 | Product and research pages provide raw material but a current proof-first screenshot pack is not evidenced. | Export three approved screenshots: live signal, MCP response, and methodology receipt. |
| Demo videos/GIFs | 22 | The repo repeatedly identifies this gap, and no current reusable demo is verified. | Produce the 30-second MCP demo first. |
| Social cards | 46 | Landing visuals exist but no consistent current social-card library is demonstrated. | Build four reusable card templates with claims guard checked copy. |
| One-pagers | 68 | Velocity Verdict is a concrete investor-facing one-pager. | Add a lightweight shared link and referral/UTM footer. |
| Per-channel landing pages | 39 | The site has multiple conceptual paths, but channel-specific pages and reporting are not evidenced. | Make two pages only: `/for/developer-investors` and `/for/investors`, each with a unique CTA and placement ID. |
| Tracking links | 52 | Some UTMs exist, but inconsistent first-touch attribution leaves a large direct bucket. | Make a link builder that refuses a missing campaign or placement ID. |
| Coupon/discount codes | 8 | No good need is demonstrated, and discounting risks undermining a research product. | Do not add discounts until a partner channel needs a controlled incentive. |
| Approval workflows | 42 | Claim guard and platform restrictions exist, but a unified asset-to-publish approval gate is not clear. | Require claims guard, live-link check, account health check, and UTM check before every external action. |
| Launch playbook | 54 | Historical launch material is broad but contains placeholders and stale timing. | Replace it with an evergreen, date-free launch sequence based on the current channel board and measured stop rules. |

---

# Ranked top 10 distribution wins

Scores reflect expected qualified-distribution impact divided by implementation effort. They do not assume conversion lift or invented reach.

| Rank | Win | Why it ranks here | Impact | Effort | First proof of success |
|---:|---|---|---:|---:|---|
| 1 | Weekly disclosed Reddit rotation with unique UTMs | Reddit is the only earned channel with material measured traffic and a safe pacing system. | High | Low | One visible post plus attributable qualified visitors. |
| 2 | 30-second MCP demo deployed everywhere | One proof asset upgrades GitHub, Glama, registries, Dev.to, Discord, and X simultaneously. | High | Medium | Registry/GitHub referral visits and demo engagement. |
| 3 | Fix first-touch attribution and placement IDs | Current direct traffic hides the answer to which distribution work deserves more time. | High | Medium | Every new placement appears as a named source/content row in PostHog. |
| 4 | Claim reconciliation before amplification | Prevents trust damage, moderator pushback, and directory rejections around the 219 sample wording. | High | Low | Guarded copy inventory is clean and live claims match the study. |
| 5 | MCP directory refresh and install path audit | Strongest scalable fit for developer-investors, with live Glama and rich machine-readable surfaces. | High | Medium | Each registry is live, accurate, visual, and tagged. |
| 6 | Public Sunday issue archive with forward/share action | Extends each email issue beyond one inbox and creates a durable linkable distribution asset. | Medium-high | Medium | Share clicks and email-forward/referral traffic per issue. |
| 7 | One invited data-contributor placement | A credible technical-investor outlet can produce higher trust than many self-posts. | High | Medium | Accepted placement with a tagged referral URL. |
| 8 | Launch an instrumented Velocity Verdict share card | Turns the existing lead magnet into a zero-click, shareable research artifact. | Medium-high | Medium | Copy/share actions and referred readers. |
| 9 | Account health and channel board | Prevents ban risk, duplicate work, untracked posts, and calendar drift. | Medium | Low | Every active platform has a safe next action and visibility check. |
| 10 | Chrome Web Store update and review flow | It reaches traditional-investor workflows and is already live, but needs current release and measurement. | Medium | Medium | Updated store version and attributable store referrals. |

---

# Autonomous execution plan for the next session

> **Objective:** Establish a safe, measured eight-week earned-distribution operating system for GitDealFlow. Execute the ranked wins in order. Do not publish to Maryan’s personal LinkedIn or restart HN activity. Do not run cold outreach, scraped outreach, paid ads, affiliate campaigns, AppSumo, or deal-site promotions.

## Immutable constraints

1. Use the canonical claims ledger and `AGENTS.md` before writing public copy. Never use `400+`, `369`, `411`, `4,200+`, or wording that converts 219 observations into financing outcomes.
2. GitDealFlow public identity is GitDealFlow or The Data Nerd. Do not reveal Maryan’s real name.
3. Reddit: maximum four actions/day, seven-day promotional spacing, never r/SaaS. Use the existing pacing state and script. Disclose ownership in the opening sentence.
4. HN: do not submit, comment, warm up, or appeal unless recovery is independently verified by a moderator confirmation or `dead:false` item evidence.
5. LinkedIn: company page only, and only with explicit approval. Never personal LinkedIn.
6. No autonomous cold email or scraped outreach. Editorial or community work must be invited, relationship-led, or a response to an active public request.
7. Paid distribution remains paused. Do not spend money without a concrete price, a source-quality model, and Maryan’s choice.
8. Every external action needs: claim-guard pass, HTTP 200 destination check, unique UTM plus immutable placement ID, account-health check, and a public visibility read-back.
9. Keep the unrelated dirty files untouched: `monitoring/subscriber-count.jsonl`, `monitoring/subscriber-count.md`, `pseo-site/scripts/ancestry-ledger.json`.

## Phase 0: preflight and baseline

- [ ] Read `/Users/sipi/signals-gitdealflow/AGENTS.md` and `CLAIMS-LEDGER.md`.
- [ ] Read the actual primary study/SSRN abstract and reconcile the `219` wording. Search the entire repo and live surfaces for unsupported outcome, prediction, timing, precision, or lift claims attached to the observation count. Make only the truthful wording survive.
- [ ] Verify, by HTTP status and body where relevant: apex, signals homepage, methodology, RSS, JSON API, MCP manifest, Agent Card, HTTP MCP endpoint, Glama, npm API, Chrome Web Store, GitHub repositories, Discord invite, Telegram channel, and all active directory links.
- [ ] Query PostHog for the last 90 days and the last 28 days, scoped to GitDealFlow, with: source, medium, campaign, content, placement ID, unique people, pageviews, qualified visitor count, signup starts, email engagement, checkout starts, and known cash cost.
- [ ] Create `distribution/channel-board.md` with: channel, ICP, account/profile URL, access status, policy risk, last action, next permitted action, asset, URL, UTM, placement ID, reach, qualified visitors, cost, CPQV, status, kill date, and decision.
- [ ] Create `distribution/experiment-log.md` with hypothesis, ICE score, date, owner, asset, placement, result, next action, and kill/pivot decision.

**Verification:** each live URL records status, final destination, and title; PostHog output has no cross-product rows; every current source is either attributable or explicitly marked unattributable.

## Phase 1: measurement repair

- [ ] Inspect landing and pSEO tracking code. Find why `distribution_landing` appears while first-touch source often falls into `$direct`, and why the week with 89 distribution landings has zero signup verification events.
- [ ] Write failing tests or deterministic browser checks for query-string persistence from entry URL through form submit and confirmation.
- [ ] Add the standard properties to all distribution events: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `placement_id`, `asset_id`, `surface`, and non-PII first-touch referrer.
- [ ] Add source metadata to `signup_verify_sent`, confirmed subscription, email open/click, MCP install/first query where technically possible, Chrome extension outbound events, PDF download, share click, and copy-link/embed events.
- [ ] Add bot/internal/test traffic exclusion rules. Do not use IP addresses or email addresses as exported dashboard fields.
- [ ] Build a GitDealFlow-only PostHog report or script that outputs weekly distribution scorecards.

**Verification:** run a fresh browser session with a test URL containing every UTM field and placement ID, complete the safe non-production portion of the path, and query PostHog to prove the exact values arrived once without duplicate events.

## Phase 2: weekly asset packet

- [ ] Build a generator that fetches the live signals API and outputs one claim-safe weekly packet in `distribution/generated/YYYY-MM-DD/`.
- [ ] The packet must include: investor diligence card, developer MCP prompt/output card, 150-word zero-click community post, 5-reply comment bank, one X thread, one Discord note, one newsletter/archive summary, source list, approved canonical URLs, UTM links, and image brief.
- [ ] Require `/Users/sipi/.local/bin/python3.11 ~/.hermes/scripts/gdf_claims_guard.py <each-draft>` to pass before any item is eligible for publishing.
- [ ] Do not call a signal a funding prediction, investment recommendation, revenue evidence, or proof a company is raising.
- [ ] Use the real data period and exact resolved sample wording everywhere.

**Verification:** claims guard exits zero for every text draft, all destinations return HTTP 200, and generated links retain all UTM and placement fields.

## Phase 3: MCP proof asset and directory refresh

- [ ] Make a 30-second, premium screen recording: ask an MCP client for current startup signals, show the returned plain-English result, show the live methodology receipt, and end with the install command. No static slides.
- [ ] Export MP4, GIF, an accessible thumbnail, and a transcript/caption file.
- [ ] Update GitHub README, npm README, Glama, Smithery/other confirmed registries, and Chrome extension listing only where access is already available. Use the same approved claims and registry-specific UTM.
- [ ] Verify current package version, registry descriptions, supported transports, and listed tool count against the runtime. Correct only truthfully verified drift.
- [ ] Do not touch a login, payment, or native file-selection gate without Maryan present. For Google OAuth/Chrome Web Store, surface the exact human step and keep all prepared assets ready.

**Verification:** video plays locally, captions match, each updated live profile renders the current approved copy and asset, and each outbound link returns HTTP 200 with its unique placement ID.

## Phase 4: community rotation

- [ ] Read `~/.hermes/scripts/reddit-distribution/state.json` and run the pacing script before selecting any subreddit.
- [ ] Select exactly one permitted community from the rotation based on live rules and latest post patterns. Preferred order: r/datasets, r/juststart, r/devops, then a checked investor community.
- [ ] Use a disclosed, zero-click post. The first line must state GitDealFlow ownership. The post must give a useful data/method lesson before any link.
- [ ] Add the link only where rules permit. If links in post bodies are filtered, place the unique tracked link in the approved fallback comment.
- [ ] After posting, verify public visibility without relying on author view. Capture post ID, URL, timestamp, community rule evidence, UTM, and placement ID in the channel board.
- [ ] Make up to four helpful non-promotional contributions that day only if pacing permits. Do not force volume.
- [ ] Do not post on HN. Do not post to personal LinkedIn. Do not automate personal X DMs.

**Verification:** pacing script allows it, claims guard passes, the post is publicly visible, the exact URL and ID are in the board, and the link resolves 200.

## Phase 5: invited and relationship-led distribution

- [ ] Research currently active technical-investor newsletters, podcasts, and communities that accept data contributions or public request responses. Do not scrape contacts or send cold campaigns.
- [ ] Select one path where there is a genuine public call, open contributor form, existing warm relationship, or invite.
- [ ] Offer a small original asset: a sector chart, methodology note, reproducible notebook, or public-data analysis. The offer must work without a product link.
- [ ] If a human/editor accepts, create a placement-specific asset and tracked destination. If no invitation or public request exists, record “no qualified path” and move on.

**Verification:** accepted means a public acceptance or editor reply, not a draft or a sent pitch. Log status as proposed, invited, accepted, published, or declined.

## Phase 6: owned sharing and referrals

- [ ] Create a public Sunday issue archive page or equivalent archived issue asset with forward/share controls and no invented performance claims.
- [ ] Add `share_clicked`, `copy_link`, PDF download, and forward/referral properties using the same placement ID system.
- [ ] If Refgrow Starter is active, finish signed webhook configuration and test referral creation, webhook receipt, duplicate handling, and attribution live. If it is not active, leave referral promotion disabled and report the exact human activation step.
- [ ] Add a one-line forward action to the welcome sequence and issue archive only after the share tracking works.

**Verification:** simulate a share/referral without publishing personal data, read back the event and signed webhook receipt, and prove the recipient landing link carries a distinct referral/placement value.

## Phase 7: Friday decision gate

- [ ] Pull a scorecard for every active channel: posts/placements, reach, qualified visitors, cost, CPQV, signup starts, shares, replies, status, and next permitted action.
- [ ] Apply the stop rule: after four correctly measured placements with fewer than two qualified visitors each, pause or redesign that channel.
- [ ] Apply the spend rule: no paid restart unless an earned asset produces qualified visitors at a price that makes a paid test economically plausible, and Maryan chooses a quoted budget.
- [ ] Commit only files owned by this execution. Leave pre-existing modified monitoring and ledger files alone.
- [ ] Deploy only after tests/build succeed and live production verification confirms the intended public result.

**Verification:** report a table with real rows, not inferred totals. Every external write is read back from its public destination. Every “published” claim includes a URL and visibility evidence.

## Exact next-session prompt

```text
Execute autonomously the GitDealFlow distribution plan at /Users/sipi/signals-gitdealflow/distribution/2026-08-21-distribution-audit-and-autonomous-execution.md.

Start with Phase 0 and follow every immutable constraint. This is distribution only, not SEO/CRO. Use live evidence, PostHog scoped only to gitdealflow.com, and do not invent results. Do not touch HN until its recovery gate is independently satisfied. Never post or DM from Maryan’s personal LinkedIn. No cold email, scraped outreach, paid ads, AppSumo, or deal sites.

The repo tip at audit time was d7b752e033757dadef2fba1058e9ee28ba568c4d. Preserve these unrelated dirty files: monitoring/subscriber-count.jsonl, monitoring/subscriber-count.md, pseo-site/scripts/ancestry-ledger.json. Read AGENTS.md and CLAIMS-LEDGER.md first. Reconcile all live research wording to “219 startup-period observations” with no linked funding-event labels before amplifying anything.

Deliver working artifacts, not a plan: channel board, experiment log, fixed attribution with live PostHog proof, a claims-safe weekly asset packet, a playable MCP demo asset, refreshed live directory surfaces where access is already available, one safe measured community placement if pacing allows, and a Friday scorecard. Verify every external write by reading its exact live URL. If blocked by a true human-only login, payment, Google OAuth, or native upload picker, prepare everything and state the one exact handoff action.
```
