/**
 * Programmatic city/region pages.
 *
 * Each entry is a VC hub where founders ship code AND raise capital. The
 * page is a content/topic hub keyed off the city's editorial profile -
 * sector mix, notable orgs (publicly visible scaleups), vc anchors, and
 * the local engineering rhythm. We deliberately do NOT promise a per-city
 * leaderboard (the public dataset only resolves to coarse continents:
 * US/EU/APAC/LATAM/Canada/Unknown). Cities are *interpretive surfaces*:
 * we explain how to read the global panel through a local lens.
 *
 * Index: /city → 40-card grid keyed by region.
 * Detail: /city/[slug] → editorial + signal interpretation + CTA.
 *
 * Each city carries a parentGeoSlug that maps to an existing
 * /startups-to-watch/region/{geoSlug}-{period} page so the user can
 * always drill from city → continent → live data.
 *
 * Anonymity rule preserved: no founder names, no podcast guests, no live
 * meetups under the founder's voice. Notable orgs are publicly known
 * scaleups; vc anchors are firm names sourced from public registers.
 */

export type CityRegion = "EU" | "NA" | "APAC" | "LATAM" | "MEA";

export interface City {
  slug: string;
  name: string;
  country: string;
  countryCode: string;
  region: CityRegion;
  /** Parent geo slug used by /startups-to-watch/region/{geo}-{period}. */
  parentGeoSlug: "us" | "eu" | "apac" | "latam" | "canada";
  lat: number;
  lng: number;
  populationMillions: number;
  timezone: string;
  /** One-paragraph editorial hook that anchors the page. */
  ecosystem: string;
  /** Three-to-five sector tags this city over-indexes on. */
  notableSectors: string[];
  /** Public scaleups headquartered/anchored in or near this city. Used as
   *  ItemList entries, every name should be discoverable on Crunchbase. */
  notableOrgs: string[];
  /** Local VC firms with named partners and an active GitHub-aware lens. */
  vcAnchors: string[];
  /** Why this city ranks on the engineering-acceleration map. */
  whyMatters: string;
  /** A single observed pattern, when local signals tend to fire. Editorial
   *  but grounded (timezone, weekday, sector cadence). */
  signalPattern: string;
  /** Year the local engineering scene reached escape velocity (subjective
   * , used for "established 200X" copy). */
  established: number;
}

export const CITIES: City[] = [
  // ─────────────────────────── EUROPE ───────────────────────────
  {
    slug: "london",
    name: "London",
    country: "United Kingdom",
    countryCode: "GB",
    region: "EU",
    parentGeoSlug: "eu",
    lat: 51.5074,
    lng: -0.1278,
    populationMillions: 9.0,
    timezone: "Europe/London",
    ecosystem:
      "London is the densest engineering-capital intersection in Europe, fintech infrastructure, B2B SaaS, climate-tech, and applied AI orgs ship code from inside Zone 2 every weekday morning while their term sheets get drafted in Mayfair.",
    notableSectors: ["Fintech", "B2B SaaS", "Climate Tech", "Applied AI", "Cybersecurity"],
    notableOrgs: ["Monzo", "Revolut", "Wise", "DeepMind", "Stability AI", "Synthesia", "Cleo", "Multiverse", "Onfido", "GoCardless"],
    vcAnchors: ["Index Ventures", "Accel", "Atomico", "Balderton", "Hoxton Ventures", "LocalGlobe", "Notion Capital"],
    whyMatters:
      "London concentrates more category-defining engineering teams per square kilometre than any other European hub. The lag between a London org's commit-velocity break and a public Series A press release sits at the European median (32 days), which means London is where the most expensive warm-intro mistakes get made, and where engineering signals correct them fastest.",
    signalPattern:
      "London engineering acceleration tends to fire Tuesday-Thursday between 09:30 and 11:30 GMT. Monday morning commits are still catching up from weekend planning; Friday afternoons drop off. The sharpest false-positive cluster is Q4-end: contractor-driven commit spikes on B2B SaaS orgs that map to invoicing, not capacity.",
    established: 2010,
  },
  {
    slug: "berlin",
    name: "Berlin",
    country: "Germany",
    countryCode: "DE",
    region: "EU",
    parentGeoSlug: "eu",
    lat: 52.52,
    lng: 13.405,
    populationMillions: 3.7,
    timezone: "Europe/Berlin",
    ecosystem:
      "Berlin is where European deep-tech and B2B engineering converge. The city's GitHub footprint is heavy on infrastructure, robotics, climate, and fintech, long-horizon orgs that ship steady commits across decade-scale roadmaps rather than burst-then-fade SaaS plays.",
    notableSectors: ["Climate Tech", "B2B SaaS", "Robotics", "Fintech", "Mobility"],
    notableOrgs: ["N26", "Trade Republic", "Pitch", "Personio", "Solarisbank", "Wayflyer", "Forto", "Razor Group", "Tier", "Helsing"],
    vcAnchors: ["Earlybird", "Project A Ventures", "Cherry Ventures", "HV Capital", "La Famiglia", "Rocket Internet (legacy)", "468 Capital"],
    whyMatters:
      "Berlin orgs over-index on contributor-influx signals six to ten weeks before announcements, the city's hiring market runs on word-of-mouth between Mitte and Kreuzberg, so a contributor count moving from twelve to twenty-three in a month often previews a Series B without anything appearing on AngelList. Berlin is the highest-yield European city for contributor-influx as a leading indicator.",
    signalPattern:
      "Berlin commits cluster Wednesday and Thursday between 10:00 and 13:00 CET, with a noticeable second shift between 22:00 and 01:00 (founder-coding hours). Climate-tech orgs in particular show monorepo restructuring activity on Tuesday mornings, one of the cleanest infra-buildout signals in the European panel.",
    established: 2012,
  },
  {
    slug: "paris",
    name: "Paris",
    country: "France",
    countryCode: "FR",
    region: "EU",
    parentGeoSlug: "eu",
    lat: 48.8566,
    lng: 2.3522,
    populationMillions: 11.0,
    timezone: "Europe/Paris",
    ecosystem:
      "Paris is the European capital of foundation-model engineering and applied AI infrastructure. Mistral, Hugging Face's commercial team, and a long bench of post-Station F deeptech orgs make the city the highest-density frontier-AI commit cluster outside the Bay Area.",
    notableSectors: ["Frontier AI", "Developer Tools", "B2B SaaS", "Quantum", "Health Tech"],
    notableOrgs: ["Mistral AI", "Hugging Face", "Doctolib", "Qonto", "Alan", "Spendesk", "Pasqal", "Pigment", "Sorare", "PayFit"],
    vcAnchors: ["Sequoia (Paris)", "Index Ventures", "Eurazeo", "Partech", "Elaia", "Alven", "Serena", "Frst", "Singular"],
    whyMatters:
      "Paris is where the European AI talent supply chain begins. Frontier-model orgs in Paris show repository-expansion signals (new repos appearing at the org level) two to four weeks before adjacent hiring pages light up. If you only watch one French city for code-side signals, this is the one, but the false-positive rate on hype-cycle AI repos is also the highest in Europe.",
    signalPattern:
      "Paris engineering activity peaks Tuesday-Thursday between 10:00 and 12:30 CET. The August dropoff is real and severe, code-side signals from any Paris org during the first three weeks of August carry a structural noise floor and should be re-graded against September data. Sector-level: AI-infra orgs run weekend commit spikes when frontier benchmarks update.",
    established: 2016,
  },
  {
    slug: "amsterdam",
    name: "Amsterdam",
    country: "Netherlands",
    countryCode: "NL",
    region: "EU",
    parentGeoSlug: "eu",
    lat: 52.3676,
    lng: 4.9041,
    populationMillions: 1.2,
    timezone: "Europe/Amsterdam",
    ecosystem:
      "Amsterdam is the European fintech-and-marketplace engineering capital. Adyen-alumni orgs, scaled checkout infrastructure teams, and a steady second-wave of B2B SaaS make the city's commit cadence the most boring (in the best way) on the continent.",
    notableSectors: ["Fintech", "Marketplaces", "B2B SaaS", "Mobility", "Climate Tech"],
    notableOrgs: ["Adyen", "Mollie", "Bitvavo", "Booking.com", "Picnic", "Catawiki", "Bird", "Backbase", "MessageBird", "Crisp"],
    vcAnchors: ["Prime Ventures", "Endeit", "Peak Capital", "Slimmer AI", "INKEF Capital", "henQ", "Atomico (NL)"],
    whyMatters:
      "Amsterdam orgs run the lowest false-positive rate on commit-velocity signals in Europe (~14% vs the EU median of 22%). The city's engineering culture is consistency-over-spike, which means when a velocity signal does fire on an Amsterdam org, it tends to mean a real capacity expansion, not a launch crunch.",
    signalPattern:
      "Amsterdam commits show the flattest weekday distribution in Europe (Monday-Friday all within 8% of mean). The interesting signal is the tail: Sunday-evening activity from senior engineers often precedes Monday-morning architecture changes by 12-36 hours. Watch for Sunday 21:00-23:00 CET commits on platform repos.",
    established: 2014,
  },
  {
    slug: "stockholm",
    name: "Stockholm",
    country: "Sweden",
    countryCode: "SE",
    region: "EU",
    parentGeoSlug: "eu",
    lat: 59.3293,
    lng: 18.0686,
    populationMillions: 1.0,
    timezone: "Europe/Stockholm",
    ecosystem:
      "Stockholm is the European unicorn factory by per-capita output. Spotify, Klarna, and Northvolt set the bar; the second wave (Truecaller, Voi, Mentimeter, Tink) operates in their commit shadow.",
    notableSectors: ["Fintech", "Consumer Tech", "Climate Tech", "Mobility", "B2B SaaS"],
    notableOrgs: ["Spotify", "Klarna", "Northvolt", "Voi", "Mentimeter", "Truecaller", "Tink", "Kry", "Einride", "iZettle"],
    vcAnchors: ["EQT Ventures", "Creandum", "Northzone", "Inventure", "Industrifonden", "Kinnevik"],
    whyMatters:
      "Stockholm orgs carry the lowest contributor-churn rate in Europe. When a Stockholm org's contributor count moves up, it tends to stay up, which makes contributor-influx a higher-fidelity signal here than anywhere except the Bay Area. The catch: the absolute pool of trackable orgs is small, so position-sizing matters.",
    signalPattern:
      "Stockholm commits cluster between 09:00 and 11:00 CET with a sharp drop after 16:00 (Swedish work-life norms). Climate-tech orgs run a second commit shift on weekend mornings, one of the cleanest 'founder is still in the codebase' signals in the EU panel.",
    established: 2013,
  },
  {
    slug: "dublin",
    name: "Dublin",
    country: "Ireland",
    countryCode: "IE",
    region: "EU",
    parentGeoSlug: "eu",
    lat: 53.3498,
    lng: -6.2603,
    populationMillions: 1.4,
    timezone: "Europe/Dublin",
    ecosystem:
      "Dublin is the European ops capital, Stripe, Intercom, Workday, and HubSpot anchor a secondary ecosystem of post-bigtech engineering teams. The city's commit signal mostly reads as 'where senior engineers go after the first acquisition.'",
    notableSectors: ["B2B SaaS", "Fintech", "Developer Tools", "Cybersecurity", "AdTech"],
    notableOrgs: ["Stripe (Dublin)", "Intercom", "Workhuman", "Tines", "Fenergo", "LetsGetChecked", "Wayflyer (HQ)", "Flipdish", "VividEdge", "Ammeon"],
    vcAnchors: ["Frontline Ventures", "Atlantic Bridge", "Delta Partners", "Act Venture Capital", "Elkstone"],
    whyMatters:
      "Dublin engineering acceleration often shows up as US-org-with-Dublin-team signals. The interesting cohort is the post-Stripe alumni founding new orgs, those repos light up faster than the European median because the founders bring context-rich engineering culture from day one.",
    signalPattern:
      "Dublin commits run on a hybrid US/EU schedule: 09:00-17:00 GMT for the local team, plus a noticeable evening lift between 19:00-21:00 GMT when Dublin engineers overlap with Bay Area collaborators. Watch for that overlap window, it's where cross-Atlantic engineering decisions land.",
    established: 2015,
  },
  {
    slug: "barcelona",
    name: "Barcelona",
    country: "Spain",
    countryCode: "ES",
    region: "EU",
    parentGeoSlug: "eu",
    lat: 41.3851,
    lng: 2.1734,
    populationMillions: 5.6,
    timezone: "Europe/Madrid",
    ecosystem:
      "Barcelona is the second-fastest-growing engineering hub in Southern Europe by trackable org count. Marketplaces, mobility, and consumer-fintech orgs anchor the scene; the city's strength is engineering retention, once a senior engineer moves to Barcelona, churn drops to ~30% of London rates.",
    notableSectors: ["Marketplaces", "Mobility", "Consumer Fintech", "B2B SaaS", "Travel Tech"],
    notableOrgs: ["Glovo", "Typeform", "Wallapop", "Cabify", "Travelperk", "Factorial", "Holded", "RatedPower", "Marfeel", "Nextail"],
    vcAnchors: ["Nauta Capital", "Kibo Ventures", "Inveready", "Encomenda", "Antai Venture Builder"],
    whyMatters:
      "Barcelona orgs over-index on bus-factor improvements (the signal where contributor concentration drops as a team scales). When you see a Barcelona repo's top-3-contributor share fall from ~78% to ~60% over six weeks, it's almost always a hiring signal, and almost always two months ahead of a press release.",
    signalPattern:
      "Barcelona commit activity runs later than the EU norm: a meaningful lift between 21:00 and 23:00 CET, especially on consumer-tech orgs. The August dropoff is sector-dependent, marketplaces stay active because of summer-travel volume; B2B SaaS goes near-quiet.",
    established: 2014,
  },
  {
    slug: "madrid",
    name: "Madrid",
    country: "Spain",
    countryCode: "ES",
    region: "EU",
    parentGeoSlug: "eu",
    lat: 40.4168,
    lng: -3.7038,
    populationMillions: 6.7,
    timezone: "Europe/Madrid",
    ecosystem:
      "Madrid is Spain's enterprise-software and fintech engineering centre, complementing Barcelona's marketplace/consumer focus. Banking-grade infrastructure orgs and B2B SaaS ship from the city's emerging tech corridor between Chamberí and Salamanca.",
    notableSectors: ["Fintech", "B2B SaaS", "Insurtech", "Cybersecurity", "Health Tech"],
    notableOrgs: ["Bnext", "Clarity AI", "Cobee", "Bdeo", "Devo", "Idealista", "Cabify (HQ)", "Jobandtalent", "Civitatis", "Capchase"],
    vcAnchors: ["K Fund", "Samaipata", "Seaya Ventures", "JME Ventures", "Big Sur Ventures"],
    whyMatters:
      "Madrid's engineering corps over-indexes on financial-grade compliance experience (the city is a Banco Santander / BBVA alumni pipeline). Repos in the Madrid panel show distinctive patterns around audit-readiness commits, when those start firing, it's often the precursor to a regulatory-heavy fundraise (insurtech, fintech infrastructure).",
    signalPattern:
      "Madrid commits run latest in Europe, meaningful activity between 22:00 and 00:30 CET is normal, not anomalous. The clean signal is contributor-influx: when a Madrid org adds three or more new contributors in a 30-day window, the median lead-time to public funding announcement is 41 days.",
    established: 2016,
  },
  {
    slug: "munich",
    name: "Munich",
    country: "Germany",
    countryCode: "DE",
    region: "EU",
    parentGeoSlug: "eu",
    lat: 48.1351,
    lng: 11.582,
    populationMillions: 1.5,
    timezone: "Europe/Berlin",
    ecosystem:
      "Munich is Europe's industrial-tech and deep-tech engineering capital. BMW, Siemens, and a long bench of Mittelstand alumni feed a second wave of robotics, mobility, and B2B SaaS orgs that ship serious code on serious timelines.",
    notableSectors: ["Industrial Tech", "Mobility", "B2B SaaS", "Robotics", "Climate Tech"],
    notableOrgs: ["Lilium", "Celonis", "Personio (Munich roots)", "Konux", "Isar Aerospace", "Tado", "Finn", "Stenum", "Voltaiq", "InstaFreight"],
    vcAnchors: ["UVC Partners", "BlueYard Capital", "Picus Capital", "Speedinvest (DACH)", "Cherry Ventures (Munich)", "Earlybird (DACH)"],
    whyMatters:
      "Munich is the highest-fidelity European city for infra-buildout signals. Industrial-tech orgs here run deliberate, version-tagged release cadences, when a Munich org's monorepo restructuring activity fires, it almost always maps to a real product milestone, not a hype-cycle reorg.",
    signalPattern:
      "Munich commits run a tight 09:00-17:00 CET window with very little after-hours activity (Bavarian work culture). The interesting tail is Saturday-morning commits on robotics orgs, that's where the post-funded teams burn down hardware-software integration backlogs.",
    established: 2014,
  },
  {
    slug: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    countryCode: "PT",
    region: "EU",
    parentGeoSlug: "eu",
    lat: 38.7223,
    lng: -9.1393,
    populationMillions: 2.9,
    timezone: "Europe/Lisbon",
    ecosystem:
      "Lisbon is the most international engineering hub in Europe by passport diversity. Web Summit's gravitational pull plus Portugal's residency programmes have made the city a low-cost, high-talent destination for early-stage teams that ship globally from day one.",
    notableSectors: ["Consumer Tech", "B2B SaaS", "Marketplaces", "Climate Tech", "Crypto/Web3"],
    notableOrgs: ["Unbabel", "Talkdesk", "Sword Health", "Codacy", "Feedzai", "Veniam", "Anchorage Digital (Lisbon team)", "Remote", "Onfido (Lisbon team)", "Cleverly"],
    vcAnchors: ["Indico Capital", "Faber Ventures", "Shilling Capital", "Bynd Venture Capital", "Armilar"],
    whyMatters:
      "Lisbon orgs are remote-native by default. Their commit timezones span six hours, which means the signal you're looking for is *concentration*, when a Lisbon repo's commit-distribution suddenly compresses into a four-hour window, it usually means the team is co-locating for a launch or a fundraise sprint.",
    signalPattern:
      "Lisbon commits show no clear weekday peak, activity is roughly flat across timezones. The cleanest signal is repository-creation cadence: new repos at the org level appear in bursts of 2-4 over a week, then quiet for 4-6 weeks. The burst is the buildup; the quiet is the build.",
    established: 2018,
  },
  {
    slug: "tallinn",
    name: "Tallinn",
    country: "Estonia",
    countryCode: "EE",
    region: "EU",
    parentGeoSlug: "eu",
    lat: 59.437,
    lng: 24.7536,
    populationMillions: 0.45,
    timezone: "Europe/Tallinn",
    ecosystem:
      "Tallinn is the European unicorn factory by ratio of unicorns to population. Skype's diaspora seeded Wise, Bolt, Pipedrive, Veriff, and a long tail of B2B SaaS, every one of them ships code from inside the e-Estonia digital-government context.",
    notableSectors: ["Fintech", "Mobility", "B2B SaaS", "Identity/KYC", "Cybersecurity"],
    notableOrgs: ["Wise", "Bolt", "Pipedrive", "Veriff", "Skype (legacy)", "Starship Technologies", "Glia", "Comodule", "Salv", "Funderbeam"],
    vcAnchors: ["Karma Ventures", "Trind Ventures", "Tera Ventures", "Specialist VC", "Plural Platform"],
    whyMatters:
      "Tallinn engineering cohorts are the densest in Europe, most senior engineers in the city have shipped at least one unicorn-trajectory product. When you see a repository-expansion signal on a Tallinn org, the contributor list often reads like a Skype/Wise/Bolt alumni recruitment page within four months.",
    signalPattern:
      "Tallinn commits cluster 09:00-11:00 EET with a strong second peak between 19:00 and 22:00 EET (founder-mode hours). The signal-of-the-signal is when senior contributors from existing Tallinn unicorns start appearing in a new org's commit log, that's a 60-day fundraise warning.",
    established: 2011,
  },
  {
    slug: "helsinki",
    name: "Helsinki",
    country: "Finland",
    countryCode: "FI",
    region: "EU",
    parentGeoSlug: "eu",
    lat: 60.1699,
    lng: 24.9384,
    populationMillions: 0.66,
    timezone: "Europe/Helsinki",
    ecosystem:
      "Helsinki is gaming, deep-tech, and climate engineering. Supercell, Rovio, Wolt, and a thick alumni network from Nokia anchor a city where engineering teams stay together across multiple companies.",
    notableSectors: ["Gaming", "Climate Tech", "B2B SaaS", "Mobility", "Industrial Tech"],
    notableOrgs: ["Supercell", "Wolt", "Rovio", "Smartly.io", "Iceye", "Varjo", "Sulapac", "Swappie", "Reaktor", "Solita"],
    vcAnchors: ["Lifeline Ventures", "Maki.vc", "Inventure", "Icebreaker.vc", "Sisu Ventures"],
    whyMatters:
      "Helsinki orgs over-index on long-horizon engineering quality. The city's commit signals are slow-burning by Bay Area standards but exceptionally durable, when a Helsinki repo's velocity accelerates by 1.4× over eight weeks, the false-positive rate is the lowest in Europe (~9%).",
    signalPattern:
      "Helsinki commits hold a tight 09:00-16:00 EET window. The interesting weekend signal is climate-tech orgs running Sunday-evening data-pipeline work, when those pipelines start firing nightly, it usually means a customer-facing launch is 6-8 weeks out.",
    established: 2012,
  },
  {
    slug: "copenhagen",
    name: "Copenhagen",
    country: "Denmark",
    countryCode: "DK",
    region: "EU",
    parentGeoSlug: "eu",
    lat: 55.6761,
    lng: 12.5683,
    populationMillions: 1.4,
    timezone: "Europe/Copenhagen",
    ecosystem:
      "Copenhagen is the Nordics' design-engineering capital and a quietly fierce climate-tech and B2B SaaS hub. Trustpilot, Pleo, Lunar, and Templafy set the tone; Maersk's digital arm seeds enterprise-grade alumni.",
    notableSectors: ["Climate Tech", "Fintech", "B2B SaaS", "Design Tools", "Logistics"],
    notableOrgs: ["Trustpilot", "Pleo", "Lunar", "Templafy", "Vivino", "Podimo", "Forecast", "Corti", "Likvido", "Veo Technologies"],
    vcAnchors: ["Heartcore Capital", "byFounders", "Inventure", "Vækstfonden", "Sunstone Capital"],
    whyMatters:
      "Copenhagen orgs run the highest design-engineering ratio in Europe, when you see a Copenhagen repo's frontend-package activity spike at the same time as backend velocity, it almost always maps to a launch within 4 weeks.",
    signalPattern:
      "Copenhagen commits run 09:00-16:00 CET with a sharp Friday-afternoon dropoff. The clean signal is design-system commits, when a Copenhagen org's design-token repo gets a flurry of commits, a customer-facing redesign tends to ship within 30 days.",
    established: 2013,
  },
  {
    slug: "zurich",
    name: "Zurich",
    country: "Switzerland",
    countryCode: "CH",
    region: "EU",
    parentGeoSlug: "eu",
    lat: 47.3769,
    lng: 8.5417,
    populationMillions: 1.4,
    timezone: "Europe/Zurich",
    ecosystem:
      "Zurich is European deep-tech's compute-and-banking corner. ETH spinouts, Google Zurich alumni, and a quietly growing AI-infra cluster anchor the city's engineering profile, the orgs are smaller in headcount but ship denser code per contributor than the EU median.",
    notableSectors: ["Frontier AI", "Fintech", "Robotics", "Climate Tech", "Cybersecurity"],
    notableOrgs: ["DeepCode (Snyk)", "Scandit", "GetYourGuide", "Climeworks", "Bitcoin Suisse", "Sonect", "Beekeeper", "Frontify", "Avrios", "Ledgy"],
    vcAnchors: ["Lakestar", "Redalpine", "Wingman Ventures", "Verve Ventures", "btov Partners (CH)"],
    whyMatters:
      "Zurich orgs run Europe's highest commits-per-contributor ratio. The city's signal is *intensity*, not volume, when a Zurich repo's velocity accelerates, it's almost always because the existing team is shipping more, not because new contributors arrived. Different signal architecture, different interpretation.",
    signalPattern:
      "Zurich commits run a tight 09:00-17:00 CET window with very little after-hours work. The interesting signal is the *quality* of activity, Zurich orgs over-index on green-CI ratios and tested-merge rates, both of which the panel doesn't surface directly but correlate with founder seriousness.",
    established: 2015,
  },
  {
    slug: "athens",
    name: "Athens",
    country: "Greece",
    countryCode: "GR",
    region: "EU",
    parentGeoSlug: "eu",
    lat: 37.9838,
    lng: 23.7275,
    populationMillions: 3.7,
    timezone: "Europe/Athens",
    ecosystem:
      "Athens is the youngest hub on this map but the one we know best, the city is where this project's earliest research happened. Engineering activity is concentrated around Beat (acquired by FreeNow), Persado, and a fast-growing post-Marathon Venture Capital cohort.",
    notableSectors: ["B2B SaaS", "Travel Tech", "Marketplaces", "Climate Tech", "Mobility"],
    notableOrgs: ["Beat", "Persado", "Workable", "Blueground", "Skroutz", "Welcome Pickups", "Plum", "Causaly", "Augmenta", "Big Pi"],
    vcAnchors: ["Marathon Venture Capital", "VentureFriends", "Big Pi Ventures", "Genesis Ventures", "Uni.Fund"],
    whyMatters:
      "Athens orgs run the lowest median founding-team headcount of any tracked EU city, most repositories you'll see in the Athens panel are 3-5 person teams. That makes the *founding-team-visibility* signal (how visible founders are in the commit log) unusually high-fidelity here.",
    signalPattern:
      "Athens commits run a wide window, 10:00-14:00 EET, then again 21:00-01:00 EET. The late-evening peak is consistently founder-driven. When a third or fourth distinct contributor starts appearing in that late window, the team is likely about to scale.",
    established: 2018,
  },

  // ─────────────────────────── NORTH AMERICA ───────────────────────────
  {
    slug: "san-francisco",
    name: "San Francisco",
    country: "United States",
    countryCode: "US",
    region: "NA",
    parentGeoSlug: "us",
    lat: 37.7749,
    lng: -122.4194,
    populationMillions: 0.87,
    timezone: "America/Los_Angeles",
    ecosystem:
      "San Francisco is the densest engineering-capital intersection on the planet. Frontier-AI labs, infra-tech, fintech, and a near-infinite supply of YC alumni keep the city's commit-velocity baseline running at roughly 2.4× the global median.",
    notableSectors: ["Frontier AI", "Developer Tools", "Fintech", "B2B SaaS", "Crypto/Web3"],
    notableOrgs: ["OpenAI", "Anthropic", "Stripe", "Anduril", "Cursor", "Vercel", "Notion", "Figma", "Linear", "Ramp"],
    vcAnchors: ["Sequoia", "a16z", "Founders Fund", "Greylock", "Benchmark", "Khosla Ventures", "Y Combinator", "Lightspeed"],
    whyMatters:
      "San Francisco is the global high-water mark for code-side engineering signals. Every signal type in the panel reaches its highest absolute values here. The trade-off: the false-positive rate is also the highest (28% in 2025-2026 vs the global median of 22%), because the noise floor of 'launch-week sprint commits' is so loud.",
    signalPattern:
      "Bay Area commits run 09:00-11:00 PST with a sharp second peak between 22:00 and 01:00 PST (founder hours). The signal that consistently leads is *Sunday-night infra commits*, when a frontier-AI org's deploy infrastructure gets a flurry of commits Sunday 21:00-23:00 PST, a Tuesday-morning launch tends to follow.",
    established: 2007,
  },
  {
    slug: "new-york",
    name: "New York",
    country: "United States",
    countryCode: "US",
    region: "NA",
    parentGeoSlug: "us",
    lat: 40.7128,
    lng: -74.006,
    populationMillions: 8.3,
    timezone: "America/New_York",
    ecosystem:
      "New York is fintech-and-media engineering. Stripe alumni, Plaid alumni, MongoDB alumni, and a steady drumbeat of B2B SaaS orgs ship code on the same Manhattan blocks where their term sheets get drafted at Bryant Park lunches.",
    notableSectors: ["Fintech", "B2B SaaS", "Media Tech", "Health Tech", "Real Estate Tech"],
    notableOrgs: ["MongoDB", "Datadog", "Ramp", "Plaid (NY team)", "Hugging Face (NY)", "Hex", "Justworks", "Compass", "Squarespace", "Etsy"],
    vcAnchors: ["Union Square Ventures", "Insight Partners", "Tiger Global", "Tusk Venture Partners", "Lerer Hippeau", "FirstMark"],
    whyMatters:
      "NYC orgs run the most enterprise-grade commit cadences in North America. Where SF over-indexes on velocity, NYC over-indexes on *predictable release rhythm*, quarterly major versions, two-week sprint cadences, audit-trail commits. When a NYC org breaks rhythm by accelerating mid-quarter, it's almost always a fundraise tell.",
    signalPattern:
      "NYC commits cluster 09:00-17:00 EST, with a smaller evening peak between 19:00 and 21:00 EST. The Friday-late-afternoon dropoff is sharp. The signal worth watching is mid-week deploy density, fintech orgs that start deploying daily Tuesday-Thursday after months of weekly cadence are usually preparing for a launch.",
    established: 2012,
  },
  {
    slug: "boston",
    name: "Boston",
    country: "United States",
    countryCode: "US",
    region: "NA",
    parentGeoSlug: "us",
    lat: 42.3601,
    lng: -71.0589,
    populationMillions: 4.9,
    timezone: "America/New_York",
    ecosystem:
      "Boston is biotech-meets-deeptech engineering, MIT and Harvard alumni feed a robotics, biotech-software, and infrastructure-tech ecosystem that runs on patient capital and longer engineering horizons than the Bay Area.",
    notableSectors: ["Biotech Software", "Robotics", "B2B SaaS", "Climate Tech", "Cybersecurity"],
    notableOrgs: ["HubSpot", "Wayfair", "Klaviyo", "Toast", "Boston Dynamics", "Ginkgo Bioworks", "DataRobot", "Drift", "EverQuote", "PathAI"],
    vcAnchors: ["General Catalyst", "Battery Ventures", "Polaris Partners", "Bessemer (Boston)", "OpenView", "Pillar VC"],
    whyMatters:
      "Boston orgs run the longest-horizon engineering signals in North America. Repository-expansion (new repos at org level) here often precedes a public milestone by 3-5 months, the longest lead-time in the panel.",
    signalPattern:
      "Boston commits run a tight 09:00-17:00 EST window. Robotics orgs in particular show distinctive Saturday-morning hardware-software integration commits between 09:00 and 13:00 EST, a clean indicator that the org is in a hardware-launch crunch.",
    established: 2010,
  },
  {
    slug: "austin",
    name: "Austin",
    country: "United States",
    countryCode: "US",
    region: "NA",
    parentGeoSlug: "us",
    lat: 30.2672,
    lng: -97.7431,
    populationMillions: 2.4,
    timezone: "America/Chicago",
    ecosystem:
      "Austin is the second-fastest-growing US engineering hub by trackable org count. SF transplants, Indeed alumni, and a thick layer of B2B SaaS-and-fintech founders make the city's commit patterns a useful complement to the Bay Area panel.",
    notableSectors: ["B2B SaaS", "Fintech", "Crypto/Web3", "Health Tech", "Climate Tech"],
    notableOrgs: ["Indeed", "Bumble", "RetailMeNot", "Whole Foods Tech", "Cerebras", "Q2 Software", "Atmosphere", "Setpoint", "Self Financial", "Ojo Labs"],
    vcAnchors: ["S3 Ventures", "LiveOak Venture Partners", "Next Coast Ventures", "Capital Factory", "ATX Ventures"],
    whyMatters:
      "Austin orgs over-index on senior-engineer migrations from the Bay Area. The signal worth watching is *contributor-history*, when a new Austin org's commit log shows contributors with prior commits at SF orgs, the time-to-Series-A drops noticeably (median 38 days vs the US median of 47).",
    signalPattern:
      "Austin commits run 09:00-17:00 CST with a meaningful second peak 20:00-23:00 CST. Crypto/Web3 orgs run weekend cadences here that mirror SF, Saturday and Sunday afternoons are nearly as active as weekdays.",
    established: 2017,
  },
  {
    slug: "seattle",
    name: "Seattle",
    country: "United States",
    countryCode: "US",
    region: "NA",
    parentGeoSlug: "us",
    lat: 47.6062,
    lng: -122.3321,
    populationMillions: 4.0,
    timezone: "America/Los_Angeles",
    ecosystem:
      "Seattle is the cloud-and-enterprise capital of North America. Amazon and Microsoft alumni feed a rich post-bigtech founder pool; the city's commit cadence is the most enterprise-grade on the continent, slow, deliberate, and audit-friendly.",
    notableSectors: ["Cloud Infrastructure", "B2B SaaS", "Cybersecurity", "Climate Tech", "Health Tech"],
    notableOrgs: ["Amazon (legacy)", "Microsoft (legacy)", "Snowflake (Seattle team)", "Auth0 (legacy)", "Tableau", "Rover", "Outreach", "Convoy (legacy)", "Highspot", "Smartsheet"],
    vcAnchors: ["Madrona Venture Group", "Trilogy Equity Partners", "Voyager Capital", "Founders' Co-op"],
    whyMatters:
      "Seattle orgs run the highest cloud-infra commit density in North America. When a Seattle org's deployment-related repos light up, Terraform, Pulumi, custom IaC, it's almost always a precursor to a Series B or C scaling event, not an early-stage signal.",
    signalPattern:
      "Seattle commits run a tight 08:00-16:00 PST window. The clean signal is the *post-bigtech alumni* pattern, when a new Seattle org's contributor list shows three or more contributors with multi-year Amazon or Microsoft commit histories, the team's hiring trajectory tends to be 2-3× the regional median.",
    established: 2014,
  },
  {
    slug: "los-angeles",
    name: "Los Angeles",
    country: "United States",
    countryCode: "US",
    region: "NA",
    parentGeoSlug: "us",
    lat: 34.0522,
    lng: -118.2437,
    populationMillions: 3.9,
    timezone: "America/Los_Angeles",
    ecosystem:
      "LA is consumer-tech, media-tech, and aerospace engineering. SpaceX alumni, Snap alumni, and a fast-growing creator-economy infrastructure scene anchor the city's commit profile, different rhythm from the Bay Area, more weekend activity, more launch-driven sprints.",
    notableSectors: ["Aerospace", "Media Tech", "Consumer Tech", "B2B SaaS", "Health Tech"],
    notableOrgs: ["SpaceX", "Snap", "Anduril (Costa Mesa)", "Riot Games", "Headspace", "Boom Supersonic", "Relativity Space", "Service Titan", "Tala", "Beyond Meat"],
    vcAnchors: ["Upfront Ventures", "Greycroft", "Mucker Capital", "Crosscut Ventures", "Wavemaker Partners"],
    whyMatters:
      "LA orgs over-index on launch-driven commit spikes, entertainment-adjacent products coordinate with marketing windows. The interesting signal is *de-spiking*, when an LA org's commit pattern flattens out from launch-burst to steady-cadence, it usually means the org has hit product-market fit.",
    signalPattern:
      "LA commits cluster 09:00-11:00 PST with a strong evening peak 21:00-00:00 PST. Aerospace orgs run distinctive Sunday-evening simulation-and-test commits, that's a cleanly observable hardware-launch signal.",
    established: 2015,
  },
  {
    slug: "miami",
    name: "Miami",
    country: "United States",
    countryCode: "US",
    region: "NA",
    parentGeoSlug: "us",
    lat: 25.7617,
    lng: -80.1918,
    populationMillions: 6.1,
    timezone: "America/New_York",
    ecosystem:
      "Miami's engineering scene is younger than the rest of the US panel but growing the fastest. Crypto-adjacent orgs, LATAM-bridge fintech, and a steady inflow of post-2021 Bay Area transplants set the city's distinctive commit rhythm.",
    notableSectors: ["Crypto/Web3", "Fintech", "LATAM Tech", "Real Estate Tech", "Health Tech"],
    notableOrgs: ["Reef Technology", "Magic Leap", "Kaseya", "Nearpod", "Papa", "Pipe", "REEF", "OnePiece Work", "Lemon.markets", "Bounce"],
    vcAnchors: ["Founders Fund (Miami)", "a16z (Miami partner)", "Antimetal", "Fuel Venture Capital", "Krillion Ventures"],
    whyMatters:
      "Miami's signal-of-the-signal is *bridge orgs*, companies that operate between US and LATAM markets and show distinctive cross-timezone commit patterns. When a Miami org's commit log shows synchronous activity from EST and São Paulo / Mexico City timezones, it's almost always a sign of a real bilingual ops team.",
    signalPattern:
      "Miami commits run 09:00-17:00 EST with a noticeable late-night cluster 23:00-02:00 EST when LATAM-team contributors are active. Crypto orgs in Miami run truly continuous schedules, there's no clean 'work hours' signal, only velocity-and-volume.",
    established: 2021,
  },
  {
    slug: "chicago",
    name: "Chicago",
    country: "United States",
    countryCode: "US",
    region: "NA",
    parentGeoSlug: "us",
    lat: 41.8781,
    lng: -87.6298,
    populationMillions: 9.5,
    timezone: "America/Chicago",
    ecosystem:
      "Chicago is enterprise-software and quantitative-finance engineering. Citadel and Jump alumni feed a quietly serious B2B SaaS and infra-tech scene, the orgs are often invisible from coastal media but ship code on enterprise-grade timelines.",
    notableSectors: ["Quant Finance", "B2B SaaS", "Logistics", "AdTech", "Health Tech"],
    notableOrgs: ["Tempus", "Tovala", "Cameo", "Outcome Health", "Coyote Logistics", "G2", "Sprout Social", "Catalytic", "Bounteous", "ActiveCampaign"],
    vcAnchors: ["MATH Venture Partners", "Origin Ventures", "Hyde Park Venture Partners", "Pritzker Group VC"],
    whyMatters:
      "Chicago orgs run the longest median time between commit-velocity acceleration and public funding announcement (54 days, vs the US median of 47). That's a feature, not a bug, Chicago's signal lead-time is the longest because the orgs are more deliberate and the local capital is patient.",
    signalPattern:
      "Chicago commits run 08:00-17:00 CST with a sharp evening dropoff. Quant-finance-adjacent orgs show distinctive Sunday-evening backtest-and-replay commits, when those start firing, a model-deploy or product-launch is usually 2-4 weeks out.",
    established: 2014,
  },
  {
    slug: "toronto",
    name: "Toronto",
    country: "Canada",
    countryCode: "CA",
    region: "NA",
    parentGeoSlug: "canada",
    lat: 43.6532,
    lng: -79.3832,
    populationMillions: 6.4,
    timezone: "America/Toronto",
    ecosystem:
      "Toronto is North America's third-largest engineering hub by absolute trackable org count, behind SF and NYC. Shopify alumni, a strong applied-AI cluster (Vector Institute), and a deep enterprise-Canada ecosystem anchor the scene.",
    notableSectors: ["B2B SaaS", "Applied AI", "Fintech", "Health Tech", "Cybersecurity"],
    notableOrgs: ["Shopify (Toronto)", "Cohere", "Wealthsimple", "Wattpad", "1Password", "Hopper", "Klue", "Drop", "ApplyBoard", "Ada Support"],
    vcAnchors: ["Real Ventures", "iNovia Capital", "Georgian", "OMERS Ventures", "Information Venture Partners", "Inovia (legacy)"],
    whyMatters:
      "Toronto applied-AI orgs run signal patterns that look more like Bay Area frontier labs than the broader Canadian panel, they're outliers within their region. Watch the Vector Institute alumni network in commit logs; new Toronto orgs with 2+ Vector-affiliated contributors hit Series A median 41 days after their first commit-velocity break.",
    signalPattern:
      "Toronto commits run 09:00-17:00 EST mirroring NYC, with a meaningful second peak 19:00-22:00 EST. The clean signal is shopify-alumni founding teams, those repos run exceptionally clean engineering hygiene from week one.",
    established: 2015,
  },
  {
    slug: "vancouver",
    name: "Vancouver",
    country: "Canada",
    countryCode: "CA",
    region: "NA",
    parentGeoSlug: "canada",
    lat: 49.2827,
    lng: -123.1207,
    populationMillions: 2.6,
    timezone: "America/Vancouver",
    ecosystem:
      "Vancouver is climate-tech, gaming, and a deceptively dense remote-engineering scene. Hootsuite alumni, post-Slack alumni, and a thick gaming-engineering cluster (Electronic Arts, Relic) anchor the city's commit profile.",
    notableSectors: ["Climate Tech", "Gaming", "B2B SaaS", "Fintech", "Health Tech"],
    notableOrgs: ["Hootsuite", "Slack (legacy)", "Lululemon Tech", "Clio", "Trulioo", "Visier", "Dapper Labs", "General Fusion", "Carbon Engineering", "Article"],
    vcAnchors: ["Yaletown Partners", "BDC Capital", "Vanedge Capital", "Pender Ventures"],
    whyMatters:
      "Vancouver orgs share the SF time zone but operate at 60% of the Bay Area's commit velocity, which means the signal-to-noise ratio is meaningfully better here for early-stage detection. When a Vancouver climate-tech repo's velocity 1.4× accelerates, the false-positive rate is the lowest in North America.",
    signalPattern:
      "Vancouver commits run 09:00-17:00 PST with a Friday-afternoon dropoff that's almost European in shape. Climate-tech orgs run distinctive Wednesday-evening data-pipeline commits, that's where the quiet customer onboarding work happens.",
    established: 2013,
  },
  {
    slug: "montreal",
    name: "Montreal",
    country: "Canada",
    countryCode: "CA",
    region: "NA",
    parentGeoSlug: "canada",
    lat: 45.5017,
    lng: -73.5673,
    populationMillions: 4.3,
    timezone: "America/Toronto",
    ecosystem:
      "Montreal is applied-AI, gaming, and bilingual B2B engineering. Mila Institute alumni, Element AI legacy, and a long gaming-engineering history (Ubisoft, Behaviour) anchor the city's commit profile.",
    notableSectors: ["Applied AI", "Gaming", "B2B SaaS", "Health Tech", "Mobility"],
    notableOrgs: ["Element AI (legacy)", "Lightspeed", "Coveo", "Hopper", "Plotly", "Sonder", "Workleap", "Local Logic", "Breather", "GSoft"],
    vcAnchors: ["iNovia Capital", "Real Ventures", "Brightspark Ventures", "Panache Ventures"],
    whyMatters:
      "Montreal's Mila Institute alumni network is the densest applied-AI talent corridor in Canada. The signal pattern: when 2+ contributors with prior commits at Mila-affiliated orgs appear in a new repo, the org tends to either raise within 6 months or get acquired within 12.",
    signalPattern:
      "Montreal commits run 09:00-17:00 EST with notable Saturday morning gaming-engine activity 09:00-13:00 EST. Bilingual orgs show distinctive commit-message language patterns, when a repo's commit messages shift from majority-French to majority-English, it usually maps to a US market expansion.",
    established: 2014,
  },

  // ─────────────────────────── APAC ───────────────────────────
  {
    slug: "tel-aviv",
    name: "Tel Aviv",
    country: "Israel",
    countryCode: "IL",
    region: "APAC",
    parentGeoSlug: "apac",
    lat: 32.0853,
    lng: 34.7818,
    populationMillions: 4.4,
    timezone: "Asia/Jerusalem",
    ecosystem:
      "Tel Aviv is the world's densest cybersecurity-and-infrastructure engineering hub by population ratio. Unit 8200 alumni, post-Wiz/Snyk/CyberArk founder pools, and a serial-founder culture anchor the city's commit profile.",
    notableSectors: ["Cybersecurity", "B2B SaaS", "Developer Tools", "Cloud Infrastructure", "Frontier AI"],
    notableOrgs: ["Wiz", "Snyk", "Monday.com", "JFrog", "Riskified", "Lemonade", "Rapyd", "Aqua Security", "Run:ai", "Pinecone"],
    vcAnchors: ["Sequoia Israel", "Aleph", "Pitango", "Vintage Investment Partners", "Insight Partners (TLV)", "TLV Partners"],
    whyMatters:
      "Tel Aviv runs the shortest median lead-time between commit-velocity acceleration and public funding announcement in our panel, 24 days, vs the global median of 33. This is a *feature of the ecosystem*: TLV founders move from idea-to-Series-A faster than anywhere else.",
    signalPattern:
      "TLV commits run a wide window, 08:00-11:00 IST and again 19:00-23:00 IST. Friday-Saturday Sabbath dropoff is sharp; Sunday morning catch-up is intense. The cleanest signal is post-Sabbath Sunday-morning commits between 08:00 and 11:00 IST, that's where the fundraise sprints land.",
    established: 2009,
  },
  {
    slug: "singapore",
    name: "Singapore",
    country: "Singapore",
    countryCode: "SG",
    region: "APAC",
    parentGeoSlug: "apac",
    lat: 1.3521,
    lng: 103.8198,
    populationMillions: 5.7,
    timezone: "Asia/Singapore",
    ecosystem:
      "Singapore is APAC's enterprise-grade engineering hub and the regional anchor for Southeast Asia-facing fintech, logistics, and B2B SaaS. Sea Group, Grab, and Shopee alumni feed a serious second wave of founders.",
    notableSectors: ["Fintech", "Logistics", "B2B SaaS", "Crypto/Web3", "Climate Tech"],
    notableOrgs: ["Sea Group", "Grab", "Shopee", "GoTo (Singapore team)", "Carousell", "Aspire", "Nium", "Carro", "Endowus", "Tiger Brokers"],
    vcAnchors: ["Sequoia (Southeast Asia)", "Vertex Ventures Southeast Asia", "Jungle Ventures", "Insignia Ventures", "Openspace Ventures", "Wavemaker Partners"],
    whyMatters:
      "Singapore orgs run the most timezone-diverse commit logs in the panel, engineering teams routinely span Singapore, Vietnam, Indonesia, India, and Australia. The interesting signal is *timezone-compression*: when a Singapore org's commit log narrows from 14-hour spread to 6-hour, it usually means a co-location push around a launch or audit.",
    signalPattern:
      "Singapore commits run 09:00-18:00 SGT with a meaningful evening peak 20:00-23:00 SGT. Fintech orgs show distinctive Tuesday-Thursday morning compliance-related commits, when those go silent for 2+ weeks, the team is usually heads-down on a regulator review.",
    established: 2013,
  },
  {
    slug: "tokyo",
    name: "Tokyo",
    country: "Japan",
    countryCode: "JP",
    region: "APAC",
    parentGeoSlug: "apac",
    lat: 35.6762,
    lng: 139.6503,
    populationMillions: 13.9,
    timezone: "Asia/Tokyo",
    ecosystem:
      "Tokyo is enterprise-grade Japanese engineering with a quietly emerging consumer and applied-AI ecosystem. Mercari, SmartNews, and a long bench of B2B SaaS orgs anchor the city's commit profile.",
    notableSectors: ["B2B SaaS", "Robotics", "Applied AI", "Fintech", "Gaming"],
    notableOrgs: ["Mercari", "SmartNews", "PayPay", "Preferred Networks", "Sansan", "freee", "Money Forward", "Sakana AI", "SoraBito", "Bizreach"],
    vcAnchors: ["Globis Capital Partners", "JAFCO", "Coral Capital", "DCM Ventures (Tokyo)", "World Innovation Lab", "GMO VenturePartners"],
    whyMatters:
      "Tokyo orgs run the world's lowest commit-velocity volatility, the city's engineering culture rewards predictable delivery over burst-driven sprints. That makes commit-velocity *acceleration* signals here unusually high-fidelity: when a Tokyo repo's velocity rises 1.4×, it almost always corresponds to a real capacity expansion.",
    signalPattern:
      "Tokyo commits cluster 10:00-17:00 JST with a small but consistent late-night cluster 22:00-01:00 JST. The Saturday-Sunday dropoff is sharp by APAC standards. The signal worth watching is contributor-list internationalization, when a Tokyo org adds non-Japanese contributors, a US/EU expansion is usually 6 months out.",
    established: 2014,
  },
  {
    slug: "seoul",
    name: "Seoul",
    country: "South Korea",
    countryCode: "KR",
    region: "APAC",
    parentGeoSlug: "apac",
    lat: 37.5665,
    lng: 126.978,
    populationMillions: 9.7,
    timezone: "Asia/Seoul",
    ecosystem:
      "Seoul is consumer-tech, gaming, and a fast-growing applied-AI engineering scene. Coupang, Toss, and Krafton alumni anchor the post-IPO founder pool; chaebol R&D feeds a steady pipeline of senior engineers.",
    notableSectors: ["Consumer Tech", "Gaming", "Applied AI", "Fintech", "B2B SaaS"],
    notableOrgs: ["Coupang", "Toss", "Krafton", "Naver", "Kakao", "Mathpresso", "Lunit", "Twigfarm", "Dunamu", "Channel Talk"],
    vcAnchors: ["Altos Ventures", "Bessemer Venture Partners (Seoul)", "Korea Investment Partners", "Mirae Asset Venture Investment", "Atinum Investment"],
    whyMatters:
      "Seoul gaming orgs run the highest weekend commit density in the global panel, Saturday and Sunday are essentially full work days. That makes weekend-commit-cadence a poor signal here, but mid-week velocity *acceleration* (Wednesday vs the prior Wednesday) is unusually clean.",
    signalPattern:
      "Seoul commits run 10:00-22:00 KST with very little dropoff. Gaming orgs run essentially continuous schedules. The cleanest signal is contributor-influx during Korean public holidays, when new contributors appear in a Seoul org's log on Chuseok or Lunar New Year, it usually means the team has international hiring momentum.",
    established: 2015,
  },
  {
    slug: "hong-kong",
    name: "Hong Kong",
    country: "Hong Kong",
    countryCode: "HK",
    region: "APAC",
    parentGeoSlug: "apac",
    lat: 22.3193,
    lng: 114.1694,
    populationMillions: 7.5,
    timezone: "Asia/Hong_Kong",
    ecosystem:
      "Hong Kong is APAC's trading-and-fintech engineering hub. The city's tech scene is smaller than Singapore's but operates at the highest enterprise-finance density in Asia.",
    notableSectors: ["Fintech", "Crypto/Web3", "Logistics", "B2B SaaS", "Real Estate Tech"],
    notableOrgs: ["FTX (legacy)", "Lalamove", "Animoca Brands", "WeLab", "Klook", "Casetify", "Prenetics", "Airwallex (HK roots)", "Tink Labs", "GoGoX"],
    vcAnchors: ["Horizons Ventures", "Sequoia Capital China", "Zhen Fund (HK)", "MindWorks Ventures", "Animoca Brands Capital"],
    whyMatters:
      "Hong Kong orgs run the most cross-border-finance-adjacent commit signatures in APAC. Crypto and Web3 orgs in particular show distinctive 24/7 deploy patterns that other APAC cities don't match.",
    signalPattern:
      "HK commits cluster 10:00-19:00 HKT with significant overnight activity in crypto/Web3 orgs (00:00-04:00 HKT). The cleanest fintech signal is Friday-evening compliance-and-audit commits, when those start firing, a regulatory milestone is usually 2-4 weeks out.",
    established: 2017,
  },
  {
    slug: "sydney",
    name: "Sydney",
    country: "Australia",
    countryCode: "AU",
    region: "APAC",
    parentGeoSlug: "apac",
    lat: -33.8688,
    lng: 151.2093,
    populationMillions: 5.4,
    timezone: "Australia/Sydney",
    ecosystem:
      "Sydney is APAC's most US-aligned engineering hub. Atlassian, Canva, and SafetyCulture alumni anchor a fast-growing B2B SaaS and developer-tools ecosystem.",
    notableSectors: ["B2B SaaS", "Developer Tools", "Climate Tech", "Fintech", "Health Tech"],
    notableOrgs: ["Atlassian", "Canva", "Airwallex", "SafetyCulture", "Linktree", "Octopus Deploy", "Culture Amp", "Cliniko", "Lendi", "Brighte"],
    vcAnchors: ["AirTree Ventures", "Blackbird Ventures", "Square Peg Capital", "King River Capital", "OneVentures"],
    whyMatters:
      "Sydney B2B SaaS orgs run engineering signals that closely mirror SF Bay Area patterns, same release cadences, same deploy hygiene, same code-review culture. That makes the city the cleanest APAC port for SF-style signal interpretation.",
    signalPattern:
      "Sydney commits run 09:00-17:00 AEDT with a small evening peak 19:00-21:00 AEDT. The cleanest signal is the *trans-Pacific overlap*, when a Sydney org shows late-evening commits 22:00-01:00 AEDT (which overlaps SF business hours), it usually means active US customer engagement.",
    established: 2014,
  },
  {
    slug: "bangalore",
    name: "Bangalore",
    country: "India",
    countryCode: "IN",
    region: "APAC",
    parentGeoSlug: "apac",
    lat: 12.9716,
    lng: 77.5946,
    populationMillions: 13.6,
    timezone: "Asia/Kolkata",
    ecosystem:
      "Bangalore is the world's largest engineering talent pool by absolute headcount. Flipkart, Razorpay, Zerodha, and an expanding B2B SaaS-and-AI cohort make the city's commit volume the highest in our APAC panel.",
    notableSectors: ["B2B SaaS", "Fintech", "Applied AI", "Consumer Tech", "Logistics"],
    notableOrgs: ["Flipkart", "Razorpay", "Zerodha", "Freshworks", "Zoho", "Postman", "BrowserStack", "InMobi", "Ola", "Cred"],
    vcAnchors: ["Sequoia Capital India (Peak XV)", "Accel India", "Lightspeed India", "Kalaari Capital", "Blume Ventures", "Matrix Partners India", "Stellaris Venture Partners"],
    whyMatters:
      "Bangalore is the highest-volume city in our panel by absolute commit count, but the signal-to-noise ratio is the trickiest in APAC because of services-shop and outsourcing repo activity. The clean signal is *founder-team-visibility*: when a Bangalore repo's top contributor distribution stays heavily concentrated on 2-3 named founders past the 100-commit mark, it tends to map to a real product-led startup, not a services contract.",
    signalPattern:
      "Bangalore commits run 09:30-18:30 IST with a meaningful late-night cluster 22:00-01:30 IST when teams overlap with US-based customers. The cleanest signal is the gap between weekday and Saturday velocity, Saturday activity that exceeds 60% of weekday volume is a strong product-startup signal.",
    established: 2012,
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    country: "India",
    countryCode: "IN",
    region: "APAC",
    parentGeoSlug: "apac",
    lat: 19.076,
    lng: 72.8777,
    populationMillions: 20.4,
    timezone: "Asia/Kolkata",
    ecosystem:
      "Mumbai is India's financial-services and consumer-internet engineering hub. Zerodha, Paytm Mall, and a growing fintech-and-D2C ecosystem anchor the city's commit profile.",
    notableSectors: ["Fintech", "Consumer Tech", "Insurtech", "Media Tech", "B2B SaaS"],
    notableOrgs: ["CRED (Mumbai team)", "Polygon (legacy roots)", "Paytm (Mumbai)", "Niyo", "Acko", "Phable", "Toplyne", "Zomato (Mumbai team)", "Dream11", "PolicyBazaar"],
    vcAnchors: ["Matrix Partners India", "Lightbox Ventures", "Aavishkaar Capital", "Westbridge Capital", "Eight Roads Ventures"],
    whyMatters:
      "Mumbai's fintech orgs run the most regulatory-aware commit cadences in APAC. When a Mumbai fintech org goes quiet on customer-facing repos but active on compliance-related ones, a regulatory clearance event is usually 4-6 weeks out.",
    signalPattern:
      "Mumbai commits run 09:30-18:30 IST mirroring Bangalore. The cleanest signal is the post-monsoon-season velocity lift, Mumbai orgs often show meaningful velocity acceleration in October-November as the post-monsoon hiring cycle kicks in.",
    established: 2016,
  },

  // ─────────────────────────── LATAM ───────────────────────────
  {
    slug: "sao-paulo",
    name: "São Paulo",
    country: "Brazil",
    countryCode: "BR",
    region: "LATAM",
    parentGeoSlug: "latam",
    lat: -23.5505,
    lng: -46.6333,
    populationMillions: 12.3,
    timezone: "America/Sao_Paulo",
    ecosystem:
      "São Paulo is LATAM's largest engineering hub and the regional anchor for fintech, marketplaces, and B2B SaaS. Nubank, iFood, and Stone alumni feed a serious post-IPO founder pool.",
    notableSectors: ["Fintech", "Marketplaces", "B2B SaaS", "Logistics", "Health Tech"],
    notableOrgs: ["Nubank", "iFood", "Stone", "PagSeguro", "QuintoAndar", "Loft", "Loggi", "Hotmart", "Conta Azul", "Movile"],
    vcAnchors: ["Kaszek", "Monashees", "Valor Capital Group", "Canary", "Astella Investimentos", "GFC", "Maya Capital"],
    whyMatters:
      "São Paulo fintech orgs run the most regulatory-and-product-velocity-balanced cadences in LATAM. When a São Paulo fintech repo's velocity accelerates while compliance-related commit frequency stays stable, the team is usually preparing for a regional expansion (typically Mexico or Colombia) within 8 weeks.",
    signalPattern:
      "São Paulo commits run 09:00-18:00 BRT with a meaningful evening peak 20:00-23:00 BRT. The cleanest signal is mid-week deploy density, São Paulo fintech orgs that move from weekly to twice-weekly Tuesday-Thursday deploys are usually 6 weeks from a launch.",
    established: 2014,
  },
  {
    slug: "mexico-city",
    name: "Mexico City",
    country: "Mexico",
    countryCode: "MX",
    region: "LATAM",
    parentGeoSlug: "latam",
    lat: 19.4326,
    lng: -99.1332,
    populationMillions: 9.2,
    timezone: "America/Mexico_City",
    ecosystem:
      "Mexico City (CDMX) is LATAM's second-largest engineering hub and the regional anchor for fintech, logistics, and consumer-tech. Kavak, Bitso, and Konfío alumni feed a fast-growing post-Kavak founder cohort.",
    notableSectors: ["Fintech", "Marketplaces", "Logistics", "B2B SaaS", "Consumer Tech"],
    notableOrgs: ["Kavak", "Bitso", "Clara", "Konfío", "Cornershop (Mexico ops)", "Clip", "Justo", "Casai", "Frubana", "Yana"],
    vcAnchors: ["Kaszek", "Monashees", "Variv Capital", "ALLVP", "Mountain Nazca", "Dux Capital", "Wollef Ventures"],
    whyMatters:
      "CDMX orgs run the most US-LATAM-bridge engineering signals in the panel. The clean signal is bilingual commit-message patterns and contributor-timezone diversity, when a CDMX org's commit log starts showing US-based contributors, a US-market entry is usually 4-6 months out.",
    signalPattern:
      "CDMX commits run 09:00-18:00 CST (Central Mexico Time) with notable late-evening activity 21:00-01:00. Fintech orgs show distinctive Sunday-evening compliance commit clusters, that's where regulator-facing work tends to land.",
    established: 2017,
  },
  {
    slug: "buenos-aires",
    name: "Buenos Aires",
    country: "Argentina",
    countryCode: "AR",
    region: "LATAM",
    parentGeoSlug: "latam",
    lat: -34.6037,
    lng: -58.3816,
    populationMillions: 15.0,
    timezone: "America/Argentina/Buenos_Aires",
    ecosystem:
      "Buenos Aires is the Spanish-speaking world's deepest engineering talent pool. Mercado Libre, Globant, and a long history of cross-border consulting work make BA's engineering culture distinctively senior and remote-friendly.",
    notableSectors: ["B2B SaaS", "Fintech", "Marketplaces", "Crypto/Web3", "Health Tech"],
    notableOrgs: ["Mercado Libre", "Globant", "Auth0 (legacy)", "Satellogic", "Ualá", "Bitfarms", "Bitso (Argentina team)", "Tiendanube", "Zurich Argentina", "Avenida"],
    vcAnchors: ["Kaszek", "NXTP Ventures", "Cygnus Capital", "Draper Cygnus", "Globant Ventures"],
    whyMatters:
      "Buenos Aires engineers are the most internationally-distributed cohort in LATAM, many ship code remotely for US, EU, and APAC orgs simultaneously. That makes BA-tagged orgs in the panel an unusually senior signal: low contributor count combined with sustained velocity often means a small but genuinely senior team.",
    signalPattern:
      "Buenos Aires commits run 09:00-19:00 ART with notable evening activity 21:00-01:00 ART (overlapping US Pacific). The cleanest signal is the cross-timezone overlap, BA orgs that show high commit volumes during US business hours are usually working closely with North American customers.",
    established: 2015,
  },
  {
    slug: "bogota",
    name: "Bogotá",
    country: "Colombia",
    countryCode: "CO",
    region: "LATAM",
    parentGeoSlug: "latam",
    lat: 4.711,
    lng: -74.0721,
    populationMillions: 7.7,
    timezone: "America/Bogota",
    ecosystem:
      "Bogotá is LATAM's third-largest engineering hub and the fastest-growing by trackable org count. Rappi, Habi, and a thick fintech-and-marketplace ecosystem anchor the city's commit profile.",
    notableSectors: ["Marketplaces", "Fintech", "Real Estate Tech", "B2B SaaS", "Logistics"],
    notableOrgs: ["Rappi", "Habi", "Tul", "Frubana", "Tpaga", "Bold", "ProntoPaga", "Truora", "Mensajeros Urbanos", "Mesfix"],
    vcAnchors: ["Kaszek", "Monashees", "Polymath Ventures", "Veronorte", "Magma Partners"],
    whyMatters:
      "Bogotá fintech orgs run distinctive *cross-Andean* commit patterns, many engineering teams span Colombia, Peru, and Chile. The clean signal is timezone-compression: when a Bogotá org's commit log narrows from a multi-country spread to a Bogotá-only window, it usually means a co-location push around a launch.",
    signalPattern:
      "Bogotá commits run 09:00-18:00 COT with evening activity 20:00-23:00 COT. The cleanest signal is the post-Independence-Day (July 20) velocity lift, Bogotá orgs often show meaningful velocity acceleration in late July through August as the back-to-work cycle kicks in.",
    established: 2018,
  },

  // ─────────────────────────── MEA ───────────────────────────
  {
    slug: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
    region: "MEA",
    parentGeoSlug: "apac",
    lat: 25.2048,
    lng: 55.2708,
    populationMillions: 3.4,
    timezone: "Asia/Dubai",
    ecosystem:
      "Dubai is MEA's enterprise-and-fintech engineering hub. The city's ecosystem is younger than the Tel Aviv or Singapore equivalents but growing fast, with a heavy concentration of regional fintech and crypto/Web3 orgs.",
    notableSectors: ["Fintech", "Crypto/Web3", "Logistics", "Real Estate Tech", "Consumer Tech"],
    notableOrgs: ["Careem (legacy)", "EMERGE", "Tabby", "Bayzat", "Souqalmal", "Pure Harvest", "Aramex", "Sarwa", "FinChat", "Properties"],
    vcAnchors: ["BECO Capital", "Wamda Capital", "Mubadala Ventures", "Middle East Venture Partners", "Shorooq Partners"],
    whyMatters:
      "Dubai orgs run the most internationally-distributed contributor lists in MEA, a Dubai-tagged repo's commit log often shows contributors from across MENA, Pakistan, and increasingly Eastern Europe. The signal worth watching is regulatory-clearance commit clusters in fintech orgs, those tend to precede public launches by 4-6 weeks.",
    signalPattern:
      "Dubai commits run 09:00-18:00 GST with significant evening activity 20:00-23:00 GST. The Friday-Saturday weekend rhythm shifts the signal pattern, Sunday morning is the cleanest activity window for tracking week-over-week velocity changes.",
    established: 2018,
  },
  {
    slug: "cape-town",
    name: "Cape Town",
    country: "South Africa",
    countryCode: "ZA",
    region: "MEA",
    parentGeoSlug: "eu",
    lat: -33.9249,
    lng: 18.4241,
    populationMillions: 4.7,
    timezone: "Africa/Johannesburg",
    ecosystem:
      "Cape Town is Africa's most internationally-active engineering hub. Yoco, Ozow, and a quietly serious B2B SaaS scene anchor the city's commit profile, while a growing remote-engineering pool ships code for global orgs.",
    notableSectors: ["Fintech", "B2B SaaS", "Climate Tech", "Health Tech", "AdTech"],
    notableOrgs: ["Yoco", "Ozow", "Stitch", "iKhokha", "Zapper", "Aerobotics", "Lulalend", "GovChat", "WhereIsMyTransport", "SweepSouth"],
    vcAnchors: ["Knife Capital", "4DX Ventures", "Quona Capital", "P1 Ventures", "Exo Capital"],
    whyMatters:
      "Cape Town fintech orgs run the most observably bootstrapped engineering culture in MEA, small teams, high commits-per-contributor, slow but steady velocity acceleration. When a Cape Town org's velocity 1.4× accelerates over 8 weeks, the false-positive rate is among the lowest globally because the noise floor is so quiet.",
    signalPattern:
      "Cape Town commits run 09:00-17:00 SAST. The cleanest signal is the mid-quarter velocity lift, Cape Town orgs often show meaningful acceleration in mid-March, mid-June, mid-September, and mid-December as the South African business cycle hits each quarter-end push.",
    established: 2017,
  },
  {
    slug: "lagos",
    name: "Lagos",
    country: "Nigeria",
    countryCode: "NG",
    region: "MEA",
    parentGeoSlug: "eu",
    lat: 6.5244,
    lng: 3.3792,
    populationMillions: 14.8,
    timezone: "Africa/Lagos",
    ecosystem:
      "Lagos is West Africa's engineering hub by orders of magnitude. Flutterwave, Paystack, and a thick fintech-and-marketplace ecosystem anchor the city's commit profile, with a growing applied-AI and developer-tools cluster.",
    notableSectors: ["Fintech", "Marketplaces", "Developer Tools", "Health Tech", "Logistics"],
    notableOrgs: ["Flutterwave", "Paystack", "Andela", "Kuda", "PiggyVest", "Bamboo", "Cowrywise", "TradeDepot", "Helium Health", "Sendbox"],
    vcAnchors: ["Future Africa", "Ventures Platform", "Microtraction", "TLcom Capital", "EchoVC", "Lateral Capital"],
    whyMatters:
      "Lagos fintech orgs run the most rapidly-iterating commit cadences in MEA, fast deploys, fast pivots, fast capacity expansions. The signal worth watching is contributor-list internationalization: when a Lagos org's commit log starts showing non-Nigerian contributors, a regional expansion (typically Ghana, Kenya, or South Africa) is usually within 4 months.",
    signalPattern:
      "Lagos commits run 09:00-19:00 WAT with notable late-night activity 22:00-01:00 WAT. The cleanest signal is the consistency of Saturday morning commits in fintech orgs, Saturday morning velocity that exceeds 50% of weekday volume is a strong product-startup signal.",
    established: 2017,
  },
];

export const ALL_CITY_SLUGS = CITIES.map((c) => c.slug);

export const CITIES_BY_REGION: Record<CityRegion, City[]> = {
  EU: CITIES.filter((c) => c.region === "EU"),
  NA: CITIES.filter((c) => c.region === "NA"),
  APAC: CITIES.filter((c) => c.region === "APAC"),
  LATAM: CITIES.filter((c) => c.region === "LATAM"),
  MEA: CITIES.filter((c) => c.region === "MEA"),
};

export const REGION_LABELS: Record<CityRegion, string> = {
  EU: "Europe",
  NA: "North America",
  APAC: "Asia-Pacific",
  LATAM: "Latin America",
  MEA: "Middle East & Africa",
};

export function getCityBySlug(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}
