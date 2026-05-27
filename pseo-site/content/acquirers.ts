/**
 * /acquirer/[slug] entity pages — public-acquirer M&A pattern pages.
 *
 * Each entry is a well-known public-company tech acquirer with a
 * documented acquisition history. The page maps their stated M&A
 * focus to the sectors we track, links to /signal/ companies in
 * those sectors, and lists their notable public acquisitions with
 * year + announced amount where publicly disclosed.
 *
 * Strict source threshold: every acquisition listed here was
 * announced publicly via press release, SEC filing, or both — the
 * same threshold Wikipedia uses for M&A list articles. We do not
 * publish private deals, rumored acquisitions, or "they might
 * acquire X next" speculation. The "what they typically scout for"
 * paragraph is editorial inference from their announced focus.
 *
 * Marcus 100 fit: Corp Dev teams running competitive scans, PE
 * operating partners modeling exit paths for portfolio companies,
 * non-engineer tech VPs benchmarking their employer's M&A cadence.
 */

export interface NotableAcquisition {
  /** Acquired company name as publicly announced. */
  name: string;
  /** Year the deal closed (or was announced if not yet closed). */
  year: number;
  /** Announced enterprise value in USD if publicly disclosed. */
  announcedAmount?: string;
  /** One-line note on what the acquired company did. */
  note: string;
}

export interface Acquirer {
  slug: string;
  name: string;
  homepageUrl: string;
  hq: string;
  // SEO surfaces
  title: string;
  metaDescription: string;
  h1: string;
  tagline: string;
  intro: string;
  acquisitionStrategy: string;
  whatTheyScoutFor: string;
  /** Sectors from sectors.ts that overlap with their M&A focus. */
  focusSectors: string[];
  notableAcquisitions: NotableAcquisition[];
}

function build(a: {
  slug: string;
  name: string;
  homepage: string;
  hq: string;
  strategy: string;
  scout: string;
  focusSectors: string[];
  acquisitions: NotableAcquisition[];
}): Acquirer {
  const acqCount = a.acquisitions.length;
  return {
    slug: a.slug,
    name: a.name,
    homepageUrl: a.homepage,
    hq: a.hq,
    title: `${a.name} Acquisitions & M&A Pattern (2026) — VC Deal Flow Signal`,
    metaDescription: `${a.name}'s public acquisition history, M&A focus areas, and the engineering-signal patterns we track in their target sectors. ${acqCount} notable acquisitions documented. Built for Corp Dev, PE operating partners, and competitive analysts.`,
    h1: `${a.name} — Acquisitions & M&A Pattern`,
    tagline: `${a.name}'s public acquisition history (${acqCount} notable deals) mapped against the engineering-signal panel we publish.`,
    intro: `${a.name} (HQ ${a.hq}) is one of the public-company acquirers whose M&A cadence shapes the technical-startup exit landscape. This page summarizes their publicly disclosed acquisitions, their stated focus areas, and how those map against the engineering-acceleration signals VC Deal Flow Signal tracks. ${a.strategy} No private data is published here — every deal listed below was announced via press release, SEC filing, or both.`,
    acquisitionStrategy: a.strategy,
    whatTheyScoutFor: a.scout,
    focusSectors: a.focusSectors,
    notableAcquisitions: a.acquisitions.sort((x, y) => y.year - x.year),
  };
}

export const ACQUIRERS: Acquirer[] = [
  build({
    slug: "microsoft",
    name: "Microsoft",
    homepage: "https://www.microsoft.com",
    hq: "Redmond, WA",
    strategy:
      "Microsoft runs the most aggressive multi-vertical M&A program in tech — strategic infrastructure consolidation (GitHub, LinkedIn, Nuance) layered with category-defining content plays (Activision Blizzard, ZeniMax, Mojang). Their developer-tools M&A pattern follows public-OSS leverage: acquire the network effect, integrate it into Azure or Microsoft 365, expand the contributor pool from inside.",
    scout:
      "Microsoft tends to scout developer-tools and AI/ML companies whose engineering org is already 100+ contributors at acquisition time. The four signals that have historically preceded their interest: sustained contributor influx, multi-language SDK breadth, large public-repo footprint, and visible enterprise-tier production usage. Recent priorities skew toward AI-infra and security.",
    focusSectors: ["developer-tools", "ai-ml", "ai-infra", "productivity", "infrastructure"],
    acquisitions: [
      { name: "Activision Blizzard", year: 2023, announcedAmount: "$68.7B", note: "Gaming and content platform — Microsoft's largest tech acquisition." },
      { name: "Nuance Communications", year: 2022, announcedAmount: "$19.7B", note: "Conversational AI and healthcare voice tech." },
      { name: "ZeniMax / Bethesda", year: 2021, announcedAmount: "$7.5B", note: "Gaming studio portfolio." },
      { name: "GitHub", year: 2018, announcedAmount: "$7.5B", note: "Developer-tools platform — the canonical OSS-network acquisition." },
      { name: "LinkedIn", year: 2016, announcedAmount: "$26.2B", note: "Professional social network and B2B data." },
      { name: "Mojang / Minecraft", year: 2014, announcedAmount: "$2.5B", note: "Sandbox game IP and Java-based engineering team." },
      { name: "Skype", year: 2011, announcedAmount: "$8.5B", note: "Voice/video communications stack." },
      { name: "aQuantive", year: 2007, announcedAmount: "$6.3B", note: "Digital advertising — Microsoft's adtech pivot." },
    ],
  }),
  build({
    slug: "google",
    name: "Google / Alphabet",
    homepage: "https://www.google.com",
    hq: "Mountain View, CA",
    strategy:
      "Google's M&A blends platform foundation bets (Android, YouTube, DoubleClick), AI talent acquisitions (DeepMind), and security/cloud consolidation (Mandiant, Looker, Wiz). They favor companies where the engineering org has shipped a category-defining product that GCP or Workspace can absorb as a first-party feature.",
    scout:
      "Security (Mandiant, Wiz), analytics infrastructure (Looker), and AI/ML are the dominant acquisition lanes in recent years. Engineering-signal hallmarks of Google interest: deep distributed-systems experience, public-repo activity in Go/Python/C++, multi-cloud enterprise customer base.",
    focusSectors: ["ai-ml", "ai-infra", "infrastructure", "observability", "analytics"],
    acquisitions: [
      { name: "Wiz", year: 2025, announcedAmount: "$32B", note: "Cloud security platform — Google's largest acquisition ever." },
      { name: "Mandiant", year: 2022, announcedAmount: "$5.4B", note: "Threat intelligence and incident response." },
      { name: "Looker", year: 2019, announcedAmount: "$2.6B", note: "BI and embedded analytics — core to GCP data stack." },
      { name: "Fitbit", year: 2021, announcedAmount: "$2.1B", note: "Wearables and health data." },
      { name: "DeepMind", year: 2014, announcedAmount: "~$500M", note: "Frontier AI research lab." },
      { name: "Nest", year: 2014, announcedAmount: "$3.2B", note: "Smart-home hardware and platform." },
      { name: "Motorola Mobility", year: 2011, announcedAmount: "$12.5B", note: "Mobile hardware (later divested to Lenovo)." },
      { name: "DoubleClick", year: 2007, announcedAmount: "$3.1B", note: "Display advertising stack." },
      { name: "YouTube", year: 2006, announcedAmount: "$1.65B", note: "Video platform." },
      { name: "Android", year: 2005, note: "Mobile operating system." },
    ],
  }),
  build({
    slug: "salesforce",
    name: "Salesforce",
    homepage: "https://www.salesforce.com",
    hq: "San Francisco, CA",
    strategy:
      "Salesforce M&A is the textbook category-extension playbook — every major acquisition becomes a Cloud product line within the Customer 360 architecture. Slack became Slack at Salesforce, MuleSoft became Integration Cloud, Tableau became Analytics Cloud, ExactTarget became Marketing Cloud.",
    scout:
      "Salesforce scouts enterprise-saas companies with strong product-led adoption that can be re-packaged as a Cloud-prefix product within the Customer 360 stack. Engineering-signal hallmarks: multi-tenant architecture, REST-API surface area, public developer ecosystem (apps, plugins, extensions).",
    focusSectors: ["productivity", "analytics", "developer-tools"],
    acquisitions: [
      { name: "Slack", year: 2021, announcedAmount: "$27.7B", note: "Team messaging and collaboration." },
      { name: "Tableau", year: 2019, announcedAmount: "$15.7B", note: "Data visualization and BI." },
      { name: "MuleSoft", year: 2018, announcedAmount: "$6.5B", note: "Integration platform and API management." },
      { name: "Demandware", year: 2016, announcedAmount: "$2.8B", note: "Cloud commerce (became Commerce Cloud)." },
      { name: "Quip", year: 2016, announcedAmount: "$750M", note: "Collaborative documents." },
      { name: "ExactTarget", year: 2013, announcedAmount: "$2.5B", note: "Email marketing (became Marketing Cloud)." },
      { name: "Heroku", year: 2010, announcedAmount: "$212M", note: "Cloud application platform." },
    ],
  }),
  build({
    slug: "adobe",
    name: "Adobe",
    homepage: "https://www.adobe.com",
    hq: "San Jose, CA",
    strategy:
      "Adobe M&A is highly disciplined around the Document Cloud + Creative Cloud + Experience Cloud trinity. The failed $20B Figma deal in 2023 was the largest signal of intent in their history; subsequent moves are smaller, focused tuck-ins (Frame.io, Workfront) that extend specific workflows.",
    scout:
      "Adobe scouts creative-workflow tools, content collaboration platforms, and marketing-tech where the engineering org has shipped a product that integrates with their existing pipelines. Engineering-signal hallmarks: JavaScript/TypeScript depth, web-native rendering pipelines, public design-tool plugin ecosystems.",
    focusSectors: ["productivity", "developer-tools"],
    acquisitions: [
      { name: "Frame.io", year: 2021, announcedAmount: "$1.275B", note: "Video review and collaboration." },
      { name: "Workfront", year: 2020, announcedAmount: "$1.5B", note: "Work-management platform." },
      { name: "Marketo", year: 2018, announcedAmount: "$4.75B", note: "Marketing automation." },
      { name: "Magento", year: 2018, announcedAmount: "$1.68B", note: "Open-source e-commerce platform." },
      { name: "Behance", year: 2012, announcedAmount: "~$150M", note: "Creative portfolio network." },
      { name: "Omniture", year: 2009, announcedAmount: "$1.8B", note: "Web analytics (became Adobe Analytics)." },
      { name: "Macromedia", year: 2005, announcedAmount: "$3.4B", note: "Flash, Dreamweaver, ColdFusion." },
    ],
  }),
  build({
    slug: "apple",
    name: "Apple",
    homepage: "https://www.apple.com",
    hq: "Cupertino, CA",
    strategy:
      "Apple M&A is famously disciplined and quiet — they acquire ~one company per month on average, almost always small teams shipping a specific technical primitive (a sensor stack, an audio algorithm, a machine-learning model). Major exceptions (Beats, NeXT) are rare and category-defining.",
    scout:
      "Apple scouts companies with deeply specialized hardware-software co-design teams: AR/VR optics, voice synthesis, on-device ML, semiconductor IP, health sensors. Engineering signals that historically precede Apple interest: small, focused teams (often <50 engineers), advanced patents portfolio, hardware-adjacent software depth.",
    focusSectors: ["ai-ml", "infrastructure"],
    acquisitions: [
      { name: "Beats Electronics", year: 2014, announcedAmount: "$3B", note: "Audio hardware and streaming." },
      { name: "Intel modem business", year: 2019, announcedAmount: "$1B", note: "5G modem IP and team." },
      { name: "Shazam", year: 2018, announcedAmount: "$400M", note: "Music recognition." },
      { name: "Workflow", year: 2017, note: "iOS automation (became Shortcuts)." },
      { name: "Beddit", year: 2017, note: "Sleep tracking sensors." },
      { name: "AuthenTec", year: 2012, announcedAmount: "$356M", note: "Fingerprint sensors (became Touch ID)." },
      { name: "P.A. Semi", year: 2008, announcedAmount: "$278M", note: "Custom silicon team (foundation of Apple Silicon)." },
      { name: "NeXT Computer", year: 1996, announcedAmount: "$429M", note: "Operating system foundation of macOS." },
    ],
  }),
  build({
    slug: "amazon-aws",
    name: "Amazon / AWS",
    homepage: "https://www.amazon.com",
    hq: "Seattle, WA",
    strategy:
      "Amazon M&A spans three corridors: retail/logistics (Whole Foods, Ring, MGM, iRobot attempt), AWS infrastructure (Annapurna, E8 Storage, CloudEndure), and consumer media (Twitch). AWS-side acquisitions tend to be deep technical teams shipping specific runtime, storage, or silicon primitives.",
    scout:
      "AWS scouts infrastructure companies with specialized silicon, storage, or runtime IP. Twitch demonstrated the consumer-media corridor. Engineering signals that historically map to interest: deep distributed-systems expertise, AWS-region-scale deployment experience, custom silicon or kernel-level work.",
    focusSectors: ["infrastructure", "ai-infra", "developer-tools"],
    acquisitions: [
      { name: "MGM", year: 2022, announcedAmount: "$8.45B", note: "Film and TV content library." },
      { name: "Ring", year: 2018, announcedAmount: "$1B", note: "Home security cameras." },
      { name: "Whole Foods", year: 2017, announcedAmount: "$13.7B", note: "Grocery retail." },
      { name: "Annapurna Labs", year: 2015, announcedAmount: "$370M", note: "Custom silicon (foundation of Graviton)." },
      { name: "Twitch", year: 2014, announcedAmount: "$970M", note: "Live streaming platform." },
      { name: "Zappos", year: 2009, announcedAmount: "$1.2B", note: "Online shoe retailer." },
      { name: "Kiva Systems", year: 2012, announcedAmount: "$775M", note: "Warehouse robotics." },
    ],
  }),
  build({
    slug: "cisco",
    name: "Cisco",
    homepage: "https://www.cisco.com",
    hq: "San Jose, CA",
    strategy:
      "Cisco runs one of the most consistent M&A programs in enterprise tech — high cadence, strong focus on networking, security, and observability primitives. The Splunk acquisition (2024) was their largest ever and signals a multi-year observability consolidation push.",
    scout:
      "Cisco scouts security, observability, and networking companies with mature enterprise sales motions. Engineering-signal hallmarks: production deployments at >1,000 enterprise accounts, deep packet-level or kernel-level engineering, mature SOC or NOC integrations.",
    focusSectors: ["observability", "infrastructure", "developer-tools"],
    acquisitions: [
      { name: "Splunk", year: 2024, announcedAmount: "$28B", note: "Observability and SIEM — Cisco's largest acquisition." },
      { name: "Isovalent", year: 2024, note: "eBPF networking (Cilium)." },
      { name: "Acacia Communications", year: 2021, announcedAmount: "$4.5B", note: "Coherent optical networking." },
      { name: "AppDynamics", year: 2017, announcedAmount: "$3.7B", note: "APM and observability." },
      { name: "OpenDNS", year: 2015, announcedAmount: "$635M", note: "DNS-layer security." },
      { name: "Sourcefire", year: 2013, announcedAmount: "$2.7B", note: "Open-source IDS/IPS (Snort)." },
      { name: "Meraki", year: 2012, announcedAmount: "$1.2B", note: "Cloud-managed networking." },
    ],
  }),
  build({
    slug: "ibm",
    name: "IBM",
    homepage: "https://www.ibm.com",
    hq: "Armonk, NY",
    strategy:
      "IBM M&A is anchored by the Red Hat acquisition (2019, $34B) and a follow-on series of hybrid-cloud and developer-platform consolidations (HashiCorp, Apptio, StreamSets). They scout companies whose engineering org already serves the Fortune 500 with on-premises and hybrid deployment options.",
    scout:
      "IBM scouts hybrid-cloud, developer-platform, and AI-infra companies with strong enterprise customer bases. The HashiCorp acquisition signals intent to consolidate the infrastructure-as-code layer. Engineering-signal hallmarks: hybrid (on-prem + cloud) deployment maturity, Fortune 500 customer references, deep Linux/Kubernetes ecosystem integration.",
    focusSectors: ["infrastructure", "ai-ml", "developer-tools", "observability"],
    acquisitions: [
      { name: "HashiCorp", year: 2024, announcedAmount: "$6.4B", note: "Infrastructure as code and secrets management." },
      { name: "Apptio", year: 2023, announcedAmount: "$4.6B", note: "FinOps and technology business management." },
      { name: "Software AG StreamSets + webMethods", year: 2024, announcedAmount: "$2.3B", note: "Data integration and API management." },
      { name: "Red Hat", year: 2019, announcedAmount: "$34B", note: "Open-source enterprise Linux — IBM's largest acquisition." },
      { name: "Promontory Financial", year: 2016, note: "Regulatory and risk consulting (Watson Financial Services)." },
      { name: "The Weather Company", year: 2016, announcedAmount: "$2B", note: "Weather data (Watson IoT)." },
      { name: "SoftLayer", year: 2013, announcedAmount: "$2B", note: "Cloud infrastructure (foundation of IBM Cloud)." },
    ],
  }),
  build({
    slug: "oracle",
    name: "Oracle",
    homepage: "https://www.oracle.com",
    hq: "Austin, TX",
    strategy:
      "Oracle's M&A is dominated by the Cerner acquisition (2022, $28.3B), pushing them into healthcare verticals on top of their database + ERP base. Earlier deals (NetSuite, MICROS, BEA, Sun) consolidated the enterprise stack around the database tier.",
    scout:
      "Oracle scouts enterprise applications, healthcare workflow software, and database-adjacent middleware with mature Fortune 500 deployments. Engineering-signal hallmarks: deep Oracle database integration, healthcare-grade compliance, complex multi-tenant architectures.",
    focusSectors: ["database", "analytics", "productivity"],
    acquisitions: [
      { name: "Cerner", year: 2022, announcedAmount: "$28.3B", note: "Healthcare EHR — Oracle's largest acquisition." },
      { name: "NetSuite", year: 2016, announcedAmount: "$9.3B", note: "Cloud ERP." },
      { name: "MICROS Systems", year: 2014, announcedAmount: "$5.3B", note: "Hospitality and retail POS." },
      { name: "Sun Microsystems", year: 2010, announcedAmount: "$7.4B", note: "Java, MySQL, Solaris, hardware." },
      { name: "BEA Systems", year: 2008, announcedAmount: "$8.5B", note: "Application server (WebLogic)." },
      { name: "PeopleSoft", year: 2005, announcedAmount: "$10.3B", note: "Enterprise applications." },
    ],
  }),
  build({
    slug: "nvidia",
    name: "Nvidia",
    homepage: "https://www.nvidia.com",
    hq: "Santa Clara, CA",
    strategy:
      "Nvidia M&A is heavily concentrated around the AI/ML and high-performance networking corridors. The Mellanox acquisition (2020) gave them InfiniBand and Ethernet primitives. The Arm acquisition attempt (2022, $40B) failed regulatory review. Recent moves (Run:AI 2024) target the AI orchestration layer.",
    scout:
      "Nvidia scouts AI infrastructure orchestration, high-performance networking, and inference-runtime companies. Engineering-signal hallmarks: CUDA-level optimization expertise, GPU-cluster orchestration at scale, deep ties to the open-source ML stack (PyTorch, JAX, Triton).",
    focusSectors: ["ai-infra", "ai-ml", "infrastructure"],
    acquisitions: [
      { name: "Run:AI", year: 2024, announcedAmount: "~$700M", note: "GPU orchestration and Kubernetes scheduling." },
      { name: "Cumulus Networks", year: 2020, note: "Open networking software." },
      { name: "Mellanox", year: 2020, announcedAmount: "$6.9B", note: "InfiniBand and Ethernet networking." },
      { name: "Bright Computing", year: 2022, note: "HPC cluster management." },
      { name: "OmniML", year: 2023, note: "Model optimization (acqui-hire)." },
    ],
  }),
  build({
    slug: "atlassian",
    name: "Atlassian",
    homepage: "https://www.atlassian.com",
    hq: "Sydney, Australia / San Francisco, CA",
    strategy:
      "Atlassian M&A is the textbook product-led tuck-in playbook — every acquisition is a tool that already had product-market fit with developer or PM teams, then gets integrated into the Jira/Confluence/Bitbucket suite. Loom (2023, $975M) was their largest non-stock deal.",
    scout:
      "Atlassian scouts collaboration, project-management, and developer-workflow tools with strong PLG adoption inside engineering and product orgs. Engineering-signal hallmarks: JavaScript/TypeScript-heavy frontend, REST API maturity, third-party-developer plugin ecosystem.",
    focusSectors: ["developer-tools", "productivity"],
    acquisitions: [
      { name: "Loom", year: 2023, announcedAmount: "$975M", note: "Async video messaging." },
      { name: "Halp", year: 2020, note: "Slack-native ticketing." },
      { name: "Mindville", year: 2020, note: "Asset and IT management." },
      { name: "OpsGenie", year: 2018, announcedAmount: "$295M", note: "On-call and incident management." },
      { name: "Trello", year: 2017, announcedAmount: "$425M", note: "Kanban-style project management." },
      { name: "AgileCraft", year: 2019, announcedAmount: "$166M", note: "Enterprise agile planning (became Jira Align)." },
    ],
  }),
  build({
    slug: "servicenow",
    name: "ServiceNow",
    homepage: "https://www.servicenow.com",
    hq: "Santa Clara, CA",
    strategy:
      "ServiceNow M&A is a steady cadence of AI and observability tuck-ins extending the Now Platform into adjacent workflow categories. They scout companies whose engineering org already integrates with major ITSM/ITOM stacks (ServiceNow itself, Jira, Splunk, Datadog).",
    scout:
      "ServiceNow scouts AI-for-IT, observability, and configuration-management companies. Engineering-signal hallmarks: AIOps maturity, deep CMDB integration patterns, enterprise SOC/NOC workflow alignment.",
    focusSectors: ["observability", "ai-ml", "productivity"],
    acquisitions: [
      { name: "Element AI", year: 2020, announcedAmount: "~$230M", note: "Applied AI consulting and platform." },
      { name: "Lightstep", year: 2021, note: "Distributed tracing and observability." },
      { name: "Loom Systems", year: 2020, note: "AIOps and anomaly detection." },
      { name: "Era Software", year: 2022, note: "Log management." },
      { name: "Hitch Works", year: 2022, note: "Skills and talent intelligence." },
      { name: "G2K Group", year: 2022, note: "Visual intelligence (computer vision for retail/manufacturing)." },
    ],
  }),
  build({
    slug: "stripe",
    name: "Stripe",
    homepage: "https://stripe.com",
    hq: "San Francisco, CA / Dublin, Ireland",
    strategy:
      "Stripe M&A is rare and selective — they acquire infrastructure primitives that extend the payments stack (Paystack for Africa, TaxJar for sales tax, Bouncer for payment-method intelligence) rather than buying scale or revenue. Indie Hackers (2017) was a developer-community play.",
    scout:
      "Stripe scouts payments infrastructure, fraud/risk primitives, tax/compliance tooling, and developer communities aligned to their API model. Engineering-signal hallmarks: clean REST API design, strong testing culture, deep fintech-compliance experience.",
    focusSectors: ["fintech", "developer-tools"],
    acquisitions: [
      { name: "Lemon Squeezy", year: 2024, note: "Merchant-of-record for digital goods." },
      { name: "Okay", year: 2024, note: "Engineering productivity analytics." },
      { name: "Bouncer", year: 2021, note: "Card-authentication / fraud intelligence." },
      { name: "TaxJar", year: 2021, note: "Sales tax automation." },
      { name: "Paystack", year: 2020, announcedAmount: "~$200M", note: "African payments infrastructure." },
      { name: "Indie Hackers", year: 2017, note: "Developer community and content platform." },
    ],
  }),
  build({
    slug: "cloudflare",
    name: "Cloudflare",
    homepage: "https://www.cloudflare.com",
    hq: "San Francisco, CA",
    strategy:
      "Cloudflare M&A is small, focused, and platform-extending — every acquisition becomes a first-party feature on the Cloudflare Edge (Area 1 → Email Security, Zaraz → Third-party Tag Manager, S2 Systems → Browser Isolation). They scout infrastructure primitives that fit their global anycast network model.",
    scout:
      "Cloudflare scouts edge-runtime, security, and developer-platform primitives. Engineering-signal hallmarks: Rust or Go runtime expertise, distributed-systems depth, public APIs with developer-tooling integration.",
    focusSectors: ["infrastructure", "developer-tools", "observability"],
    acquisitions: [
      { name: "BastionZero", year: 2024, note: "Zero-trust infrastructure access." },
      { name: "Area 1 Security", year: 2022, announcedAmount: "$162M", note: "Email security (anti-phishing)." },
      { name: "Vectrix", year: 2021, note: "SaaS security posture management." },
      { name: "Zaraz", year: 2021, note: "Third-party tag management at edge." },
      { name: "S2 Systems", year: 2020, note: "Browser isolation (became Cloudflare Browser Isolation)." },
      { name: "Linc", year: 2021, note: "Frontend application platform." },
    ],
  }),
  build({
    slug: "shopify",
    name: "Shopify",
    homepage: "https://www.shopify.com",
    hq: "Ottawa, Canada",
    strategy:
      "Shopify M&A is dominated by the Deliverr fulfillment acquisition (2022, $2.1B) which was later largely unwound. Their pattern favors developer-ecosystem tuck-ins (Mechanic, Sphere, theme builders) and last-mile fulfillment primitives that fit the merchant platform.",
    scout:
      "Shopify scouts e-commerce infrastructure, fulfillment, and merchant-developer tooling. Engineering-signal hallmarks: Ruby/Rails or Go infrastructure, e-commerce-platform integration depth, merchant-app marketplace presence.",
    focusSectors: ["fintech", "developer-tools", "productivity"],
    acquisitions: [
      { name: "Remix", year: 2022, note: "React framework (now under Shopify stewardship)." },
      { name: "Deliverr", year: 2022, announcedAmount: "$2.1B", note: "Fulfillment network (later largely divested)." },
      { name: "6 River Systems", year: 2019, announcedAmount: "$450M", note: "Warehouse robotics." },
      { name: "Tictail", year: 2018, note: "Mobile-first marketplace." },
      { name: "Oberlo", year: 2017, note: "Dropshipping integration." },
    ],
  }),
  build({
    slug: "snowflake",
    name: "Snowflake",
    homepage: "https://www.snowflake.com",
    hq: "Bozeman, MT",
    strategy:
      "Snowflake M&A is concentrated around the data app and AI platform layers above their warehouse engine. Streamlit (2022, $800M) was their largest deal, extending the warehouse into application-development territory. They scout data app frameworks, governance tools, and AI/ML primitives.",
    scout:
      "Snowflake scouts data application frameworks, data governance, and AI infrastructure layered on warehouses. Engineering-signal hallmarks: Python-heavy data-platform expertise, deep multi-cloud deployment, native Snowflake ecosystem integration.",
    focusSectors: ["database", "analytics", "ai-ml"],
    acquisitions: [
      { name: "Streamlit", year: 2022, announcedAmount: "$800M", note: "Python data app framework." },
      { name: "Applica", year: 2022, note: "Unstructured-data AI." },
      { name: "Mountain", year: 2024, note: "Data networking / collaboration." },
      { name: "Neeva", year: 2023, note: "Generative AI search (talent and tech)." },
      { name: "TruEra", year: 2024, note: "AI observability and ML monitoring." },
    ],
  }),
  build({
    slug: "databricks",
    name: "Databricks",
    homepage: "https://www.databricks.com",
    hq: "San Francisco, CA",
    strategy:
      "Databricks M&A is the most AI-aggressive of any infrastructure acquirer. MosaicML (2023, $1.3B) gave them open-source LLM training stack; Tabular (2024) brought them the Iceberg open-table format; Lilac (2024) added data curation. They scout open-source AI primitives and the lakehouse-adjacent governance layer.",
    scout:
      "Databricks scouts open-source AI/ML training and inference primitives, lakehouse governance, and applied AI. Engineering-signal hallmarks: heavy PyTorch / JAX usage, open-source maintainer activity (Spark, Delta, Iceberg, MLflow ecosystems), strong distributed-training infrastructure experience.",
    focusSectors: ["ai-ml", "ai-infra", "database", "analytics"],
    acquisitions: [
      { name: "Tabular", year: 2024, announcedAmount: "~$1B", note: "Apache Iceberg lakehouse table format." },
      { name: "Lilac", year: 2024, note: "Data curation and analysis." },
      { name: "Einblick", year: 2024, note: "AI-native analytics interface." },
      { name: "Mooncake Labs", year: 2024, note: "Streaming postgres / serverless OLTP." },
      { name: "MosaicML", year: 2023, announcedAmount: "$1.3B", note: "Open-source LLM training and inference." },
      { name: "Okera", year: 2023, note: "Data governance and access control." },
      { name: "8080 Labs", year: 2021, note: "Low-code analytics (Bamboolib)." },
    ],
  }),
  build({
    slug: "github",
    name: "GitHub",
    homepage: "https://github.com",
    hq: "San Francisco, CA",
    strategy:
      "GitHub M&A (as a Microsoft subsidiary) targets developer-workflow primitives that extend the GitHub platform — dependency management (Dependabot), code analysis (Semmle → CodeQL), package distribution (npm). Each acquisition becomes a first-party platform feature.",
    scout:
      "GitHub scouts developer-tools and code-intelligence companies whose primitives fit inside the GitHub platform: scanning, dependency analysis, package registries, automation. Engineering-signal hallmarks: deep Git or static-analysis expertise, large open-source community, public maintainer activity.",
    focusSectors: ["developer-tools"],
    acquisitions: [
      { name: "npm", year: 2020, note: "JavaScript package registry." },
      { name: "Semmle", year: 2019, note: "Code analysis (became CodeQL)." },
      { name: "Dependabot", year: 2019, note: "Automated dependency updates." },
      { name: "Spectrum", year: 2018, note: "Community chat platform." },
      { name: "Pull Panda", year: 2019, note: "Code-review notification tools." },
    ],
  }),
  build({
    slug: "hubspot",
    name: "HubSpot",
    homepage: "https://www.hubspot.com",
    hq: "Cambridge, MA",
    strategy:
      "HubSpot M&A is small and focused on data + AI primitives that fit the marketing/sales/service hubs. Clearbit (2023) was their largest deal, giving them B2B data enrichment as a core HubSpot capability. They scout companies that extend the CRM-adjacent data layer.",
    scout:
      "HubSpot scouts B2B data, sales intelligence, and customer-success tooling that fits the CRM platform. Engineering-signal hallmarks: data-enrichment pipeline depth, deep CRM-integration experience, focus on SMB and mid-market customer segments.",
    focusSectors: ["productivity", "analytics", "fintech"],
    acquisitions: [
      { name: "Clearbit", year: 2023, announcedAmount: "~$150M", note: "B2B data enrichment." },
      { name: "Hustle", year: 2021, note: "Conversation marketing / SMS." },
      { name: "The Hustle", year: 2021, announcedAmount: "~$27M", note: "Newsletter / business media." },
      { name: "Kemvi", year: 2017, note: "AI for sales (talent acqui-hire)." },
    ],
  }),
  build({
    slug: "intel",
    name: "Intel",
    homepage: "https://www.intel.com",
    hq: "Santa Clara, CA",
    strategy:
      "Intel M&A is concentrated in silicon-adjacent IP. Mobileye (2017, $15.3B, later partially divested in IPO) extended into automotive ADAS. Altera (2015, $16.7B) gave them FPGAs. Habana Labs (2019, $2B) brought AI accelerators. Recent activity is muted as Intel restructures around foundry strategy.",
    scout:
      "Intel scouts companies with specialized silicon IP, AI accelerator architectures, and automotive/robotics compute stacks. Engineering-signal hallmarks: deep verilog/RTL expertise, large patent portfolios, AI accelerator architecture experience.",
    focusSectors: ["ai-infra", "infrastructure"],
    acquisitions: [
      { name: "Granulate Cloud Solutions", year: 2022, announcedAmount: "$650M", note: "Runtime optimization." },
      { name: "Tower Semiconductor", year: 2024, note: "Foundry acquisition (later cancelled $5.4B)." },
      { name: "Habana Labs", year: 2019, announcedAmount: "$2B", note: "AI training/inference accelerators." },
      { name: "Mobileye", year: 2017, announcedAmount: "$15.3B", note: "ADAS and autonomous-driving stack." },
      { name: "Altera", year: 2015, announcedAmount: "$16.7B", note: "FPGAs." },
      { name: "McAfee", year: 2011, announcedAmount: "$7.7B", note: "Security (later divested)." },
    ],
  }),
];

export function getAllAcquirerSlugs(): string[] {
  return ACQUIRERS.map((a) => a.slug);
}

export function getAcquirer(slug: string): Acquirer | undefined {
  return ACQUIRERS.find((a) => a.slug === slug);
}
