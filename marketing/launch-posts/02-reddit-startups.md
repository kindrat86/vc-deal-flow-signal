# Reddit r/startups Post — Wave 1 (Sunday April 19)
## Frame as build story with data insight

---

### Title
I'm building a deal flow tool for VCs using GitHub data. Here's what I've learned about engineering signals.

### Body (copy-paste below)

I've been building a tool that monitors GitHub engineering activity across thousands of startup orgs and ranks them by engineering acceleration for investors.

The core idea: when a startup's commit velocity spikes sharply compared to their own historical baseline, it often signals something meaningful — a fundraise in progress, a major product push, rapid team scaling. This pattern tends to show up 3-6 weeks before any public announcement.

**What I learned building this:**

1. **Absolute commit count is meaningless.** A company with 500 commits/week isn't more interesting than one with 50. What matters is the *rate of change* — acceleration.

2. **Contributor growth is the strongest fundraise predictor.** When a startup's unique contributor count jumps 50%+ in a 2-week window, they almost certainly just hired a batch of engineers. That usually means capital just came in.

3. **Weekend activity spikes are a real signal.** When multiple contributors start committing on weekends consistently, the team is pushing toward a deadline. Product launches, fundraise demos, competitive responses — all interesting.

4. **Not all GitHub activity is signal.** Docs sprints, CI/CD noise, and open-source maintenance inflate numbers without reflecting product work. Measuring change from baseline (not absolute numbers) filters most of this out.

**How this is different from Harmonic, Dealroom, etc.:** Those platforms cost $10K+/year, require demo calls to get in, and use proprietary data you can't verify. This uses public GitHub data (fully transparent), is self-serve (no sales call), and starts at EUR 9.97/mo. None of them track engineering momentum — they tell you about rounds *after* they happen. This shows you the acceleration *before* the pitch deck exists.

**Current state of the tool:**
- 20 sectors tracked weekly (AI, Fintech, Healthcare, Cybersecurity, etc.)
- 60+ startups showing measurable engineering acceleration right now
- Free Signal Digest and a paid Dashboard (EUR 9.97/mo beta)

**Top signal this week:** carlos-emr (healthcare) — +199% commit velocity, 94 contributors. A burst like that in open-source health tech is unusual.

If anyone's curious about the data or wants to see specific sectors, happy to share: https://signals.gitdealflow.com

Two free Chrome extensions if you want the signal in your browser:
- Crunchbase + Wellfound badge: https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn
- GitHub hover lookup (new): https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm — useful for competitive intelligence too.

Building this solo. Would love feedback from founders on whether this kind of data would concern you (an investor watching your GitHub) or whether you'd find it useful for competitive intelligence.
