# Runbook: vc-deal-flow-signal

## Status: DEPLOYED, pre-launch

| Session | Status | Date |
|---|---|---|
| Triage | COMPLETE | 2026-04-13 |
| A. Strategy part 1 | COMPLETE | 2026-04-13 |
| B. Strategy part 2 + Build prep | COMPLETE | 2026-04-13 |
| C. Deploy fake door | COMPLETE | 2026-04-13 |
| C+. Replace ConvertKit with Resend+Supabase+Cron | DEPLOYED | 2026-04-14 |
| D. pSEO handoff | COMPLETE | 2026-04-13 |
| D. pSEO stack decisions | COMPLETE | 2026-04-13 |
| D. pSEO build (Next.js site + data pipeline) | DEPLOYED | 2026-04-13 |
| D. Weekly data refresh cron | DEPLOYED | 2026-04-13 |

## Open TODOs

### Domain + Email
- [x] Buy domain: gitdealflow.com (Namecheap)
- [x] Set up Zoho Mail: signal@gitdealflow.com
- [x] Add DNS records (Zoho MX/SPF/DKIM) in Namecheap
- [x] Connect custom domain to Vercel (gitdealflow.com → landing, signals.gitdealflow.com → pSEO)

### Email Automation
- [x] Build subscribe API route on Vercel (signals.gitdealflow.com/api/subscribe)
- [x] Replace ConvertKit form with custom form -> Resend API
- [x] Load 12 Brunson emails into Pocketbase (5 Soap Opera + 7 Seinfeld)
- [x] Build local email-api drip engine (Hono + Resend + Pocketbase)
- [x] Add RESEND_API_KEY to Vercel env and local email-api .env
- [x] Set up daily launchd cron for drip email sending (9am daily, com.gitdealflow.email-cron)
- [x] Add Resend DNS records (DKIM, SPF, MX) to Namecheap
- [x] Verify Resend domain (gitdealflow.com verified 2026-04-14)

### When someone pays for Dashboard Beta (EUR 9.97/mo)
- [ ] Send personal welcome email within 24h from your Zoho email
- [ ] Explain: "Dashboard is in beta, launching in [X weeks]. You're locked in at EUR 9.97 forever."
- [ ] Share a sample signal preview (PDF or screenshot of mock dashboard with 5-10 real startups)
- [ ] Ask what sectors/stages they care about most (early product feedback)
- [ ] Add them to a "Beta Users" list for priority updates
- [ ] Give them a timeline for when the live dashboard ships

### When someone pays for Insider Circle (EUR 97/mo)
- [ ] Send personal welcome email within 24h from your Zoho email
- [ ] Explain: "Insider Circle is in beta, launching in [X weeks]. You're locked in at EUR 97 forever."
- [ ] Invite them to the private investor Telegram group
- [ ] Share a detailed signal preview (full sample report with 10+ startups, enrichment data)
- [ ] Ask via email what sectors/stages they invest in (custom watchlist input)
- [ ] Add them to "Insider" list for monthly live briefing invites
- [ ] Send calendar invite for the first monthly signal briefing call

### Infrastructure
- [x] Set up Pocketbase on Mac mini (http://127.0.0.1:8090, launchd service, auto-restarts)

### Marketing (Brunson + Isenberg audit, 2026-04-15)
- [x] Add social proof strip to landing page (2,000+ orgs, 20 sectors, weekly, 3 weeks)
- [x] Build Dream 100 list (20 newsletters, 15 podcasts, 25 Twitter, 15 communities, 5 paid)
- [x] Write 3-wave launch plan (IH Day 1, HN Day 3, PH Day 7)
- [x] Update seinfeld-1 and seinfeld-2 with real startup data as trip wire
- [x] Create free Telegram channel: https://t.me/gitdealflow (public, broadcast-only)
- [x] Write content repurposing pipeline (1 signal -> 10 pieces, 2hr/week)
- [x] Outline Perfect Webinar for Insider Circle conversion (target: May 2026)
- [x] Draft outreach pitches for Not Boring, Pragmatic Engineer, Hustle Fund
- [x] Spec Chrome extension for Crunchbase/AngelList (Phase 2)
- [x] Post first Signal of the Week to Telegram channel (carlos-emr, healthcare)
- [x] Wire Telegram channel into landing page (CTA + footer) and emails
- [x] Redeploy landing page to Vercel (live)
- [x] Reload Pocketbase emails (12 emails, updated)
- [x] Set up Twitter/X account and post first thread (@data_nerd, 6-tweet thread, 2026-04-15)
- [x] SEO: FAQ JSON-LD schema on all blog posts + visible FAQ sections
- [x] SEO: Rewrite H2s as questions across all 7 blog posts (11 H2s updated)
- [x] SEO: Internal cross-linking mesh (14 links across 7 posts, 2 per post)
- [ ] LinkedIn strategy (TBD, discuss later)
- [ ] Execute Wave 1 launch (target: Sun April 19, 11:00 EEST)
- [x] Schedule newsletter outreach emails (5 emails, Resend, launchd cron 9:15am daily, auto-sends on date)
- [ ] Schedule first Perfect Webinar (target: first Thursday of May)
- [ ] Build Chrome extension (Phase 2, after 50 subscribers)

### Pre-requisites (do before driving any traffic)
- [x] Create private Telegram group for Insider Circle members
