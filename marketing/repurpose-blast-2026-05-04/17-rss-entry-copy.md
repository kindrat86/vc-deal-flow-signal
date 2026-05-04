# Variant 17 — RSS feed entry copy

**Cadence:** Monday · auto-publishes via `pseo-site/app/feed.xml/route.ts` once the blog post is live (already live at `/blog/signal-of-the-week-2026-05-04`)
**CTA:** /predict (single)

---

## RSS entry XML (canonical form for the feed.xml route)

```xml
<item>
  <title>Signal of the Week — airbytehq (Data Infrastructure), +866% commit velocity</title>
  <link>https://signals.gitdealflow.com/blog/signal-of-the-week-2026-05-04</link>
  <guid isPermaLink="true">https://signals.gitdealflow.com/blog/signal-of-the-week-2026-05-04</guid>
  <pubDate>Mon, 04 May 2026 06:00:00 GMT</pubDate>
  <author>signal@gitdealflow.com (The Data Nerd)</author>
  <category>Signal of the Week</category>
  <category>Data Infrastructure</category>
  <description><![CDATA[
    airbytehq is the #1 engineering-acceleration mover this week across 100 tracked startup GitHub orgs in 20 sectors. Commit velocity is +866% over 14 days, off a baseline of 1864 commits, with 100 active contributors shipping in lockstep. The dominant pattern is a deploy frequency spike, which historically precedes announced fundraises by 2 to 4 weeks. Run the same scoring on any GitHub org: https://signals.gitdealflow.com/predict
  ]]></description>
</item>
```

## Note on automation

The blog post is already live so the feed.xml route should already be emitting this entry. Verify by curl on Monday afternoon:

```
curl -s https://signals.gitdealflow.com/feed.xml | grep -A2 "signal-of-the-week-2026-05-04"
```

If the entry is missing, redeploy `pseo-site` — the feed regenerates from the posts list at build time per memory `feedback_vercel_mtime_reset` (clamped lastModified).
