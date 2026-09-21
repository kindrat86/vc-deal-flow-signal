# Company Post Inventory

## Aug 21-22 remediation log

- Target: Aug 19 weekly signal report, first sentence: `Weekly signal report: 411 startups across 15 sectors.`
- Recorded performance before edit: 29 impressions, 0 clicks, 0 reactions, 0 comments, 0 reposts, 0 follows shown.
- Risk: banned exact panel count `411`.
- First automation attempt: the LinkedIn company-admin overflow menu rendered empty. No undocumented API or destructive workaround was used.
- User opened the standard company edit modal. The post was confirmed as `VC Deal Flow Signal`, then the full replacement copy passed `gdf_claims_guard.py` before saving.
- Saved at 2026-08-22 00:14 EEST. Final first sentence: `Weekly signal report: public GitHub activity across 350+ startup orgs in 15 sectors.`
- Public activity URL: `https://www.linkedin.com/feed/update/urn:li:activity:7495847124396466178/`
- View checks: company-admin list showed one corrected post and zero matching `411` posts. The public activity route showed the corrected text, zero old-claim text, `VC Deal Flow Signal`, and `Visible to anyone on or off LinkedIn`.
- UTM: none, legacy post. Qualified actions: none exposed. Post-level clicks, reactions, comments, reposts, and follows were not exposed after edit, so the pre-edit table values remain the only recorded values.

## Known table rows captured in plan baseline

| Post | Date | Format | Impressions | Clicks | Reactions | Comments | Reposts | Follows | Claim status |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| Best PitchBook Alternatives for Startup Signals | Aug 17 | Article | 80 | 3 | 2 | 2 | 0 | not exposed | destination returned HTTP 200 and claims guard passed, but not feature-safe yet: unsupported “highest-signal” claim, incorrect daily-update claim, em dash, and body URL |
| AI & Machine Learning Startups Heating Up | Aug 19 | Article | 36 | 2 | 0 | 0 | 0 | not exposed | review needed |
| Weekly signal report | Aug 19 | Article | 29 | 0 | 0 | 0 | 0 | not exposed | corrected 2026-08-22, activity 7495847124396466178, public activity route verified |
| Commit cadence tells you more than a pitch deck | Aug 18 | Document | 13 | 1 | 0 | 0 | 0 | not exposed | review needed |
| GitHub activity is not a funding oracle | Aug 20 | Document | 11 | 12 | 1 | 0 | 0 | not exposed | review needed |
| Hiring pages are the most gamed signal | Aug 11 | Document | 8 | 3 | 0 | 0 | 0 | not exposed | review needed |
| Best Crunchbase Alternatives for VC Deal Flow | Aug 10 | Article | 8 | 3 | 0 | 0 | 0 | not exposed | review needed |
| GitHub Momentum Checker | Aug 13 | Article | 7 | 1 | 0 | 0 | 0 | not exposed | review needed |
| Velocity Verdict Cheat Sheet | Aug 12 | Article | 7 | 1 | 0 | 0 | 0 | not exposed | review needed |
| Free Open Datasets | Aug 20 | Article | 3 | 0 | 0 | 0 | 0 | not exposed | review needed |
| Free Open Datasets | Aug 21 | Article | 3 | 0 | 0 | 0 | 0 | not exposed | review needed |
| Backtest your last three angel checks | Aug 21 | Article | 3 | 0 | 0 | 0 | 0 | not exposed | unsafe testimonials and em dash, review needed |
