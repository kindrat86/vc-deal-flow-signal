# Investor distribution package

GitDealFlow publishes one prepared, source-backed package each week for three buyer-facing paths:

1. **Angels and scouts:** a practical diligence discussion.
2. **Seed investors:** a short newsletter editor contribution.
3. **VC communities:** a disclosed discussion seed, not a product drop.

## Operating contract

The generator fetches the live public signals API and writes a dated Markdown package. It creates assets only. It never sends email, posts to LinkedIn, or submits to a community.

- LinkedIn is the GitDealFlow company page only. It needs explicit approval before posting.
- Use newsletter copy only where an editor accepts a contribution or has invited it. Do not turn it into bulk cold outreach.
- Open a community post by disclosing GitDealFlow ownership.
- Do not describe a public engineering signal as a funding prediction, a buy recommendation, or evidence of revenue or company quality.
- Use the tracked link for the actual publishing channel. Log a published URL in the canonical channel board before measuring outcomes.

## Run locally

```bash
python3 tools/campaign/generate-investor-distribution-brief.py \
  --output-dir "$HOME/.hermes/reports/gitdealflow-investor-brief"
```

The dated file and `latest.md` are both written. The recurring GitDealFlow-profile cron uses the same command every Monday at 09:10 Europe/Athens.

## Success and stop rule

The package is an asset, not reach. Measure qualified visitors, replies, subscribers, demos, and revenue by UTM. Do not call it a working channel until one of those signals is recorded. Stop or redesign the channel after four published packages without any of them.

## Sources

- Public signals API: `https://signals.gitdealflow.com/api/signals.json`
- Methodology: `https://signals.gitdealflow.com/methodology`
- Investor landing page: `https://gitdealflow.com/for/angel-investors`
