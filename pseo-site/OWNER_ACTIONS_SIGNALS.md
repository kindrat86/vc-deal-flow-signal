# Owner Actions — signals.gitdealflow.com

_Generated 2026-07-23. Actions requiring manual owner intervention._

## 1. Google Search Console

**Action:** Verify `signals.gitdealflow.com` as a URL-prefix property.

- Go to [Google Search Console](https://search.google.com/search-console)
- Add property → URL prefix → `https://signals.gitdealflow.com`
- Choose **HTML file upload** verification method
- Download the HTML verification file from GSC UI
- Place it at: `pseo-site/public/<verification-file>.html`
- Redeploy and click Verify in GSC
- Once verified, submit sitemaps:
  - `https://signals.gitdealflow.com/sitemap.xml` (sitemap index)
  - `https://signals.gitdealflow.com/news-sitemap.xml`

> Note: The existing `google-site-verification` meta tag (`s-WDDQiO4arDn993LDiErqQeGIhlIgRZq67kg-NC5k8`) may belong to a different property or the apex domain. Verify the current GSC setup before adding new tokens.

## 2. Bing Webmaster Tools

**Action:** Import site into Bing Webmaster Tools.

- Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
- Add site → `https://signals.gitdealflow.com`
- Choose import from Google Search Console if already verified
- Alternative: place Bing verification XML file in `public/`
- Once verified, submit sitemap: `https://signals.gitdealflow.com/sitemap.xml`
- IndexNow key `22dfd6f8f816469b8c216bc7eaf8b936` is already deployed — Bing will auto-discover it

## 3. Bot Mitigation — Vercel WAF Rule

**Observation:** ~75% of pageviews (~3,083/4,071 per 30d) are datacenter traffic from CN/HK/SG hitting via `$direct`. These inflate analytics and waste bandwidth.

**Recommended action (owner decision):**

- Go to Vercel Dashboard → `pseo-site` project → **Security** → **WAF** (Web Application Firewall)
- Create a **Custom Rule**:
  - **Condition:** `ASN` matches known datacenter ASNs OR `Country` in `CN, HK, SG` AND `Referer` = `$direct`
  - **Action:** `Challenge` (JavaScript/CAPTCHA challenge — legitimate crawlers pass, headless scrapers fail)
- Known datacenter ASNs to target:
  - AS4134 (China Telecom), AS4837 (China Unicom), AS9808 (China Mobile)
  - AS45102 (Alibaba Cloud), AS132203 (Tencent Cloud), AS37963 (Huawei Cloud)
  - AS63949 (Linode/Akamai — Singapore DC)
- **Dashboard path:** Vercel → `pseo-site` → Security → WAF → Custom Rules → Add Rule
- Start with `Log` mode first to measure false-positive rate before switching to `Challenge`

## 4. Content Distribution Drafts

### Draft 1: IndieHackers — "We tracked 20,000+ GitHub commits. Here's what predicted a $157B round."

**Hook:** I built a dataset tracking commit velocity across ~400 venture-backed startups. One signal stood out: orgs with high acceleration + low contributor concentration (Gini < 0.30) were 3.4× more likely to announce Series A within 60 days.

**Body:** VC Deal Flow Signal (free) monitors public GitHub activity — commit velocity, contributor growth, new repos — and ranks startups by engineering acceleration. The dataset covers 20 sectors and is published under CC BY 4.0 with a Zenodo DOI. The MCP server is free, the dashboard is €49/mo.

**Link:** https://signals.gitdealflow.com

### Draft 2: IndieHackers — "The 3-6 week gap between code and fundraise"

**Hook:** Startups don't announce fundraises the day they close. They announce 3-6 weeks later, after legal, PR, and blog posts. But their GitHub activity spikes immediately. That gap is where we operate.

**Body:** We track ~400 startup GitHub orgs across 20 sectors and publish weekly rankings of which teams are accelerating fastest. The free MCP server lets AI agents query signals directly. The dataset includes 4 quarters of history, and we validate predictions openly on our scorecard.

**Link:** https://signals.gitdealflow.com

### Draft 3: r/startups — "We analyzed 20,000 GitHub commits from venture-backed startups — here's what the data says about engineering velocity"

> **⚠️ DISCLAIMER:** This account was banned from r/startups. Posting requires a new account or manual cross-posting by someone else. Verify current ban status before attempting.

**Title:** We analyzed 20,000+ GitHub commits from venture-backed startups — 3.4× more likely to raise Series A within 60 days

**Body:**
I run a free tool called VC Deal Flow Signal that tracks GitHub commit velocity across ~400 venture-backed startup orgs.

The working hypothesis: engineering acceleration precedes fundraise announcements by 3-6 weeks. We compute 6 atomic signals from public GitHub data and rank startups weekly.

Key findings from the Q2 2026 panel (published on SSRN, CC BY 4.0):
- 75% of tracked startups showed "framework migration" as their dominant signal pattern
- Orgs with commit velocity change >150% vs prior period AND contributor Gini < 0.30 were 3.4× more likely to announce Series A within 60 days
- 20 sectors tracked, AI/ML and devtools dominate the top 10

The tool is free — MCP server, JSON/CSV API, and Scout Score tool are all no-auth. The dashboard is €49/mo.

Questions? I'm the founder (pseudonymous — the data speaks for itself). Full methodology, scorecard, and dataset are linked from the site: https://signals.gitdealflow.com

## 5. Post-Deploy Verification

After deploy:
```bash
# Verify homepage renders (not blank — React hydration check)
curl -s https://signals.gitdealflow.com/ | grep -c '<h1'  # must be ≥ 1
curl -s https://signals.gitdealflow.com/ | wc -c            # must be > 100000

# Verify key pages
curl -so /dev/null -w '%{http_code}\n' https://signals.gitdealflow.com/explore
curl -so /dev/null -w '%{http_code}\n' https://signals.gitdealflow.com/llms-full.txt
curl -so /dev/null -w '%{http_code}\n' https://signals.gitdealflow.com/sitemap.xml

# Verify IndexNow key
curl -s https://signals.gitdealflow.com/22dfd6f8f816469b8c216bc7eaf8b936.txt | grep -c '22dfd6f8'
```
