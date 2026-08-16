# VC Deal Flow Signal

Track 350+ venture-backed startup GitHub organizations across 15 sectors using
engineering-velocity data. Open methodology, live dashboard, MCP server.

**The finding:** engineering acceleration plus low contributor concentration
preceded Series A announcements by 21 to 47 days (3.4x lift, n = 219 confirmed
funding rounds). The full methodology, cleaning protocol (bot contamination,
survivorship bias), and the pre-registered prediction ledger are published and
auditable.

## What is here

- Signal engine configuration and sector taxonomy
- The public prediction ledger, including a 0-for-10 first cohort published anyway
- MCP server wiring for agent access to the deal flow data API
- Benchmark data behind the sector benchmark pages

## Live surfaces

- [VC Deal Flow Signal](https://signals.gitdealflow.com) - the signal dashboard (weekly refresh)
- [GitDealFlow](https://gitdealflow.com) - product home
- [commit-velocity methodology](https://signals.gitdealflow.com/methodology) - how the signal is built
- [the public ledger](https://signals.gitdealflow.com/predicted) - prediction track record, misses included

## Citation

The dataset paper: SSRN 6606558, DOI 10.2139/ssrn.6606558. Zenodo dataset:
10.5281/zenodo.19650920 (CC BY 4.0). Cite the data, not this repo.

## Resources

- MCP server: `npx -y @gitdealflow/mcp-signal`
- JSON API: `https://signals.gitdealflow.com/api/signals.json`
- Checklist companion: [vc-due-diligence-checklist](https://github.com/kindrat86/vc-due-diligence-checklist)
