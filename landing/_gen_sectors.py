#!/usr/bin/env python3
"""
GitDealFlow startup-sector pSEO generator.
Produces /sectors/{sector}/index.html for 25 startup sectors.
Matches the existing /sectors/biotech/index.html template structure (header wordmark + nav, related pages, BRUNSON trust bar, footer).
Updates sitemap-pages.xml.
"""
import json
import re
from pathlib import Path

ROOT = Path("/Users/sipi/Downloads/vc-deal-flow-signal/landing")
BASE = "https://gitdealflow.com"
SIGNALS = "https://signals.gitdealflow.com"
TODAY = "2026-07-18"

# 25 startup sectors. Matches MCP `search_startups_by_sector` enumerated values where possible.
# (slug, display, tagline, sub-focus areas, github-signal blurb, recent-trend blurb, top-signals list)
SECTORS = [
    ("fintech", "Fintech", "banking, payments, and embedded-finance infrastructure",
     ["neobank core systems", "embedded-lending APIs", "treasury and yield infrastructure", "stablecoin rails", "B2B payments orchestration"],
     "Fintech engineering teams signal momentum through backend service commits, ledger and reconciliation work, and regulatory-compliance module expansion. Frontend-heavy repos rarely indicate infra depth — GitDealFlow weights backend and integration repo growth most heavily for this sector.",
     "Fintech GitHub momentum through Q2 2026 has clustered around stablecoin payment rails, embedded-lending orchestration, and cross-border treasury tooling. Teams building compliance-adjacent infrastructure show the most consistent contributor growth — a signal that typically precedes a Series A or B raise by 3–6 weeks.",
     ["Backend service commit velocity (weekly)", "New integration repo creation", "Contributor growth in compliance/ledger modules", "Stars on internal SDKs released as open source"]),
    ("healthtech", "Healthtech", "clinical workflow, EHR integration, and patient-infrastructure software",
     ["EHR integration layers (FHIR/HL7)", "clinical workflow automation", "patient-data infrastructure", "telehealth platforms", "HIPAA-compliant analytics"],
     "Healthtech momentum shows up as commits to integration adapters (FHIR, HL7, EHR vendor SDKs), clinical-workflow automation services, and patient-data infrastructure. GitDealFlow weights FHIR-adapter and EHR-integration repo growth heavily because it correlates with paid pilot expansion.",
     "Healthtech GitHub acceleration in 2026 has concentrated on FHIR-native infrastructure, ambient clinical documentation, and prior-authorization automation. Teams that ship EHR adapters weekly are typically 4–6 weeks from a fundraise announcement.",
     ["FHIR/HL7 adapter commit frequency", "New EHR-vendor integration repos", "Contributor growth in clinical-workflow services", "Release cadence on HIPAA-scoped packages"]),
    ("ai-ml", "AI/ML", "model training, inference, and applied-AI infrastructure",
     ["training and fine-tuning frameworks", "inference and serving infrastructure", "vector databases", "agent orchestration", "evaluation harnesses"],
     "AI/ML momentum signals come from training-framework commits, inference-serving infrastructure, eval harness activity, and agent-orchestration repo growth. GitDealFlow weights eval and serving repos highest — they correlate with production deployment, not just research output.",
     "AI/ML GitHub momentum in 2026 is concentrated in inference-serving optimization (vLLM-adjacent), agent orchestration frameworks, and evaluation tooling. Teams shipping weekly eval improvements are the strongest predictor of a near-term raise.",
     ["Inference-serving repo commit velocity", "Eval harness release cadence", "Agent-orchestration contributor growth", "Open-source SDK star acceleration"]),
    ("saas", "SaaS", "horizontal and vertical B2B SaaS platforms",
     ["multi-tenant core platforms", "workflow automation", "vertical SaaS (legal, construction, HR)", "integration marketplaces", "analytics dashboards"],
     "SaaS momentum shows up as multi-tenant platform commits, workflow-engine work, and integration-connector repo growth. GitDealFlow weights integration-connector creation highly — it correlates with paid customer onboarding.",
     "Vertical SaaS (legal, construction, HR) has been the strongest GitHub momentum cluster in 2026, with integration-connector repo growth outpacing horizontal SaaS by ~2x. Teams adding new connectors weekly are typically mid-fundraise.",
     ["Integration-connector repo creation rate", "Multi-tenant platform commit velocity", "Workflow-engine contributor growth", "Public API SDK release cadence"]),
    ("ecommerce", "E-commerce", "storefront, payments, and merchant-infrastructure software",
     ["headless storefront frameworks", "checkout and payments orchestration", "merchant analytics", "subscription billing", "inventory and fulfillment"],
     "E-commerce momentum signals come from storefront-framework commits, checkout/payment integration work, and merchant-analytics repo growth. GitDealFlow weights checkout and payments-orchestration repos highest.",
     "Headless commerce and subscription-billing infrastructure have dominated e-commerce GitHub momentum in 2026. Teams shipping payment-processor integrations weekly are typically 3–5 weeks from a raise.",
     ["Checkout/payments integration commit velocity", "Storefront framework contributor growth", "Subscription-billing repo creation", "Public webhook SDK releases"]),
    ("cybersecurity", "Cybersecurity", "threat detection, identity, and SecOps infrastructure",
     ["SIEM and detection engines", "identity and access management", "cloud security posture", "threat intelligence platforms", "DevSecOps pipelines"],
     "Cybersecurity momentum shows up as detection-engine commits, SIEM integration work, and identity-provider connector growth. GitDealFlow weights detection-rule and integration-connector repos highest — they correlate with paid deployment.",
     "Cloud security posture management and identity-infrastructure have led cybersecurity GitHub momentum in 2026. Teams that ship detection rules and cloud-connector integrations weekly are typically 4–6 weeks from a fundraise.",
     ["Detection-engine commit velocity", "Cloud-provider connector creation rate", "SIEM integration contributor growth", "Threat-intel feed release cadence"]),
    ("devtools", "DevTools", "developer productivity, CI/CD, and API infrastructure",
     ["CI/CD platforms", "API gateways and client SDKs", "observability and tracing", "IDE extensions", "package registries"],
     "DevTools momentum signals come from CI/CD platform commits, SDK releases across languages, and observability repo growth. GitDealFlow weights multi-language SDK release cadence highly — it correlates with enterprise adoption.",
     "DevTools GitHub momentum in 2026 is concentrated in observability, multi-language SDK generation, and internal developer portals. Teams shipping SDKs across 5+ languages weekly are the strongest near-term-raise signal in the sector.",
     ["Multi-language SDK release cadence", "CI/CD platform commit velocity", "Observability repo contributor growth", "Public CLI tool star acceleration"]),
    ("climate-tech", "Climate Tech", "carbon accounting, grid, and sustainability infrastructure",
     ["carbon accounting platforms", "grid optimization software", "ESG reporting infrastructure", "renewables asset management", "climate risk modeling"],
     "Climate-tech momentum shows up as carbon-accounting platform commits, grid-optimization service work, and ESG-reporting integration growth. GitDealFlow weights regulatory-reporting module commits highest — they correlate with enterprise procurement.",
     "Carbon accounting and grid-optimization infrastructure have dominated climate-tech GitHub momentum in 2026. Teams shipping regulatory-reporting modules weekly are typically 5–7 weeks from a raise.",
     ["Carbon-accounting platform commit velocity", "Regulatory-reporting module creation", "Grid-integration connector growth", "ESG-framework adapter releases"]),
    ("edtech", "Edtech", "learning platforms, assessment, and workforce-training software",
     ["LMS core platforms", "assessment and proctoring", "workforce training infrastructure", "adaptive learning engines", "district integration layers"],
     "Edtech momentum signals come from LMS platform commits, district-integration (Clever, ClassLink) adapter work, and adaptive-learning repo growth. GitDealFlow weights district-integration repos highest — they correlate with paid district contracts.",
     "Workforce-training infrastructure and district-integration layers have led edtech GitHub momentum in 2026. Teams adding new SIS/vendor adapters weekly are typically mid-sales-cycle for a large district or enterprise deal.",
     ["District-integration adapter creation rate", "LMS platform commit velocity", "Assessment-engine contributor growth", "Adaptive-learning model releases"]),
    ("mobility", "Mobility", "autonomous, fleet, and transportation-infrastructure software",
     ["autonomous-vehicle stacks", "fleet management platforms", "routing and dispatch", "EV charging infrastructure", "transit data platforms"],
     "Mobility momentum shows up as AV-stack commits, fleet-management platform work, and routing-engine repo growth. GitDealFlow weights perception and planning module commits highest — they correlate with on-road milestones.",
     "Fleet-management and EV-charging infrastructure have led mobility GitHub momentum in 2026. Teams shipping routing/perception improvements weekly are typically 4–8 weeks from a milestone-driven raise.",
     ["AV-stack perception/planning commit velocity", "Fleet-management platform contributor growth", "EV-charging connector creation", "Routing-engine optimization releases"]),
    ("proptech", "Proptech", "real-estate, property management, and construction software",
     ["property management platforms", "transaction and title infrastructure", "construction project management", "smart-building IoT", "mortgage and lending stacks"],
     "Proptech momentum signals come from property-management platform commits, MLS/integration adapter work, and construction-PM repo growth. GitDealFlow weights MLS and transaction-integration repos highest.",
     "Property-management and construction-PM platforms have led proptech GitHub momentum in 2026. Teams adding new MLS or transaction integrations weekly are typically 4–6 weeks from a raise.",
     ["MLS/integration adapter creation rate", "Property-management platform commit velocity", "Construction-PM contributor growth", "Transaction-infrastructure releases"]),
    ("biotech", "BioTech & Life Sciences", "computational biology, drug discovery, and lab informatics",
     ["drug discovery AI", "genomics and sequencing pipelines", "lab automation software", "clinical trial infrastructure", "molecular modeling"],
     "Biotech momentum shows up as computational-biology pipeline commits, genomics workflow work, and lab-informatics repo growth. GitDealFlow weights workflow-pipeline (Nextflow, Snakemake-adjacent) and clinical-trial repos highest.",
     "Computational drug discovery and lab-informatics have dominated biotech GitHub momentum in 2026. Teams shipping genomics pipelines and clinical-trial integrations weekly are typically 5–8 weeks from a raise.",
     ["Genomics-pipeline commit velocity", "Clinical-trial integration creation", "Lab-informatics contributor growth", "Molecular-modeling releases"]),
    ("robotics", "Robotics", "robot control, perception, and fleet-orchestration software",
     ["robot control stacks (ROS-adjacent)", "perception and planning", "fleet orchestration", "simulation environments", "hardware abstraction layers"],
     "Robotics momentum signals come from control-stack commits, perception/planning module work, and simulation-environment repo growth. GitDealFlow weights simulation and fleet-orchestration repos highest — they correlate with deployment scale.",
     "Fleet orchestration and simulation environments have led robotics GitHub momentum in 2026. Teams shipping perception/planning and simulation improvements weekly are typically 4–8 weeks from a milestone raise.",
     ["Control-stack perception/planning commit velocity", "Simulation-environment contributor growth", "Fleet-orchestration releases", "Hardware-abstraction layer creation"]),
    ("web3", "Web3", "blockchain infrastructure, DeFi, and on-chain analytics",
     ["smart-contract platforms", "DeFi protocols", "on-chain analytics", "wallet and identity infrastructure", "L2 and rollup infrastructure"],
     "Web3 momentum shows up as protocol contract commits, SDK releases across chains, and on-chain-analytics repo growth. GitDealFlow weights SDK and infrastructure repos higher than contract repos — infrastructure correlates with sustained team activity.",
     "L2 infrastructure and on-chain analytics have led web3 GitHub momentum in 2026. Teams shipping multi-chain SDKs weekly are typically 3–6 weeks from a raise.",
     ["Multi-chain SDK release cadence", "Protocol infrastructure commit velocity", "On-chain analytics contributor growth", "Wallet/identity SDK releases"]),
    ("gaming", "Gaming", "game engines, multiplayer infrastructure, and live-ops tooling",
     ["game engine frameworks", "multiplayer netcode infrastructure", "live-ops and telemetry", "in-game commerce", "content creation tooling"],
     "Gaming momentum signals come from engine framework commits, netcode infrastructure work, and live-ops repo growth. GitDealFlow weights netcode and live-ops repos highest — they correlate with shipped titles.",
     "Multiplayer infrastructure and live-ops tooling have dominated gaming GitHub momentum in 2026. Teams shipping netcode and live-ops improvements weekly are typically 4–6 weeks from a raise tied to a title launch.",
     ["Netcode infrastructure commit velocity", "Live-ops tooling contributor growth", "Engine framework releases", "In-game commerce integration creation"]),
    ("agritech", "Agritech", "farm management, precision agriculture, and supply-chain software",
     ["farm management platforms", "precision agriculture and IoT", "supply-chain traceability", "commodity trading infrastructure", "climate-adaptive crop modeling"],
     "Agritech momentum shows up as farm-management platform commits, IoT/edge integration work, and supply-chain repo growth. GitDealFlow weights IoT and traceability repos highest.",
     "Precision-agriculture and supply-chain traceability have led agritech GitHub momentum in 2026. Teams adding new IoT and traceability integrations weekly are typically 5–8 weeks from a raise.",
     ["IoT-integration adapter creation rate", "Farm-management platform commit velocity", "Traceability contributor growth", "Climate-modeling releases"]),
    ("insurtech", "Insurtech", "carrier infrastructure, underwriting, and claims software",
     ["policy administration systems", "underwriting and rating engines", "claims processing infrastructure", "broker and distribution platforms", "reinsurance analytics"],
     "Insurtech momentum signals come from PAS platform commits, rating-engine work, and claims-infrastructure repo growth. GitDealFlow weights carrier-integration and claims repos highest.",
     "Underwriting automation and claims infrastructure have led insurtech GitHub momentum in 2026. Teams shipping carrier-integration and rating-engine improvements weekly are typically 4–7 weeks from a raise.",
     ["Carrier-integration creation rate", "Rating-engine commit velocity", "Claims-infrastructure contributor growth", "Reinsurance-analytics releases"]),
    ("legaltech", "Legaltech", "practice management, contract intelligence, and e-discovery software",
     ["practice management platforms", "contract analysis and CLM", "e-discovery infrastructure", "court and filing integrations", "regulatory research tooling"],
     "Legaltech momentum shows up as practice-management platform commits, CLM/contract-analysis work, and court-filing-integration repo growth. GitDealFlow weights court-filing integrations highest — they correlate with sticky enterprise contracts.",
     "Contract intelligence and court-filing integrations have led legaltech GitHub momentum in 2026. Teams adding new jurisdiction/filing integrations weekly are typically 4–6 weeks from a raise.",
     ["Court-filing integration creation rate", "CLM platform commit velocity", "E-discovery contributor growth", "Regulatory-research releases"]),
    ("hrtech", "HR Tech", "HRIS, recruiting, and people-analytics software",
     ["HRIS core platforms", "recruiting and ATS", "payroll and benefits infrastructure", "people analytics", "employee engagement tooling"],
     "HR-tech momentum signals come from HRIS platform commits, payroll/benefits-integration work, and ATS repo growth. GitDealFlow weights payroll and benefits-integration repos highest — they correlate with regulated, sticky deployments.",
     "Payroll infrastructure and people-analytics have led HR-tech GitHub momentum in 2026. Teams shipping payroll and benefits integrations weekly are typically 4–6 weeks from a raise.",
     ["Payroll/benefits integration creation rate", "HRIS platform commit velocity", "ATS contributor growth", "People-analytics releases"]),
    ("martech", "MarTech", "marketing automation, CDP, and growth-tooling software",
     ["CDP and customer data infrastructure", "marketing automation platforms", "attribution and analytics", "personalization engines", "marketing-integration connectors"],
     "MarTech momentum shows up as CDP platform commits, attribution-engine work, and integration-connector repo growth. GitDealFlow weights integration-connector creation highest — it correlates with paid customer onboarding.",
     "CDP and attribution infrastructure have led martech GitHub momentum in 2026. Teams adding new marketing-platform connectors weekly are typically 3–5 weeks from a raise.",
     ["Marketing-connector creation rate", "CDP platform commit velocity", "Attribution-engine contributor growth", "Personalization releases"]),
    ("logistics", "Logistics", "freight, warehouse, and last-mile delivery software",
     ["TMS and freight platforms", "WMS and warehouse automation", "last-mile delivery infrastructure", "port and customs software", "supply-chain visibility"],
     "Logistics momentum signals come from TMS platform commits, WMS work, and carrier-integration repo growth. GitDealFlow weights carrier and EDI integrations highest — they correlate with shipper onboarding.",
     "Last-mile and warehouse automation have led logistics GitHub momentum in 2026. Teams adding new carrier/EDI integrations weekly are typically 4–6 weeks from a raise.",
     ["Carrier/EDI integration creation rate", "TMS platform commit velocity", "WMS contributor growth", "Visibility-platform releases"]),
    ("media", "Media", "streaming, publishing, and content-distribution infrastructure",
     ["streaming infrastructure", "publishing platforms", "ad-tech and monetization", "content delivery and encoding", "audience analytics"],
     "Media momentum shows up as streaming-platform commits, encoding/CDN work, and ad-tech repo growth. GitDealFlow weights encoding and ad-tech repos highest.",
     "Streaming infrastructure and ad-tech have led media GitHub momentum in 2026. Teams shipping encoding and monetization improvements weekly are typically 4–6 weeks from a raise.",
     ["Encoding/CDN commit velocity", "Ad-tech integration creation rate", "Publishing-platform contributor growth", "Audience-analytics releases"]),
    ("consumer", "Consumer", "consumer apps, social, and marketplace software",
     ["consumer mobile and web apps", "marketplace platforms", "social and community infrastructure", "subscription consumer products", "creator economy tooling"],
     "Consumer momentum signals come from app repo commits, backend API growth, and marketplace-platform work. GitDealFlow weights backend service and growth-infra repos higher than client repos.",
     "Creator-economy tooling and consumer marketplaces have led consumer GitHub momentum in 2026. Teams shipping backend growth and retention features weekly are typically 3–5 weeks from a raise.",
     ["Backend service commit velocity", "Growth/retention infra contributor growth", "Marketplace-platform releases", "Client app release cadence"]),
    ("enterprise", "Enterprise", "enterprise infrastructure, data, and platform software",
     ["data infrastructure and warehouses", "enterprise integration platforms", "security and identity infrastructure", "workflow and BPM platforms", "observability and APM"],
     "Enterprise momentum shows up as data-platform commits, integration-platform work, and security repo growth. GitDealFlow weights data and integration repos highest — they correlate with six-figure deals.",
     "Data infrastructure and enterprise integration have led enterprise GitHub momentum in 2026. Teams shipping connector and platform improvements weekly are typically 5–8 weeks from a large-round raise.",
     ["Data-platform commit velocity", "Integration-connector creation rate", "Security/identity contributor growth", "Workflow-platform releases"]),
    ("deep-tech", "Deep Tech", "frontier research, quantum, and advanced-computing software",
     ["quantum computing stacks", "advanced materials modeling", "satellite and space infrastructure", "photonics and optics simulation", "scientific computing frameworks"],
     "Deep-tech momentum signals come from research-stack commits, simulation-framework work, and infrastructure repo growth. GitDealFlow weights simulation and infra repos highest — pure research output rarely signals commercial traction.",
     "Quantum infrastructure and space-software have led deep-tech GitHub momentum in 2026. Teams shipping simulation and infra improvements weekly are typically 6–10 weeks from a milestone-driven raise.",
     ["Simulation-framework commit velocity", "Infrastructure repo contributor growth", "Research-stack releases", "Hardware-integration creation"]),
]


def jd(q, a):
    return {"@type": "Question", "name": q,
            "acceptedAnswer": {"@type": "Answer", "text": a}}


def build_page(sec):
    slug, display, tagline, sub_focus, signal_blurb, trend_blurb, top_signals = sec
    url = f"{BASE}/sectors/{slug}"

    title = f"{display} Startups — Funding Signals & Deal Flow | GitDealFlow"
    desc = (f"Track {tagline} startup momentum on GitHub before fundraises are announced. "
            f"GitDealFlow surfaces breakout {display.lower()} engineering teams 3–6 weeks early. "
            f"Free API, MCP server, and live signal data.")

    faqs = [
        (f"How does GitDealFlow detect breakout {display.lower()} startups?",
         f"GitDealFlow tracks {tagline} across 369 startup GitHub orgs. For {display.lower()}, the strongest early signal is {top_signals[0].lower()} — teams accelerating backend infrastructure work are typically 3–6 weeks from a fundraise announcement. The methodology weights production-deployment signals (serving, integration, and SDK repos) higher than research output."),
        (f"What {display.lower()} sub-sectors does GitDealFlow cover?",
         f"The {display.lower()} sector bucket includes: " + "; ".join(sub_focus[:-1]) + f"; and {sub_focus[-1]}. Each is tracked at the GitHub-org level, with weekly commit velocity, contributor growth, and new repo creation decomposed by sub-focus area."),
        (f"Is the {display.lower()} signal data free?",
         f"Yes. The {display.lower()} signal feed is free and public via the JSON API, CSV export, and the @gitdealflow/mcp-signal MCP server. No authentication required. See signals.gitdealflow.com for live data and the OpenAPI spec."),
    ]

    article_json = {
        "@context": "https://schema.org", "@type": "Article",
        "headline": f"{display} Startups — Funding Signals & Deal Flow",
        "description": desc,
        "author": {"@type": "Organization", "name": "GitDealFlow", "url": BASE},
        "publisher": {"@type": "Organization", "name": "GitDealFlow", "url": BASE},
        "mainEntityOfPage": {"@type": "WebPage", "@id": url},
        "datePublished": TODAY, "dateModified": TODAY,
    }
    faq_json = {"@context": "https://schema.org", "@type": "FAQPage",
                "mainEntity": [jd(q, a) for q, a in faqs]}
    breadcrumb_json = {
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{BASE}/"},
            {"@type": "ListItem", "position": 2, "name": "Sectors", "item": f"{BASE}/sectors"},
            {"@type": "ListItem", "position": 3, "name": display, "item": url},
        ],
    }
    faq_visible = "\n".join(f"<h3>{q}</h3>\n<p>{a}</p>" for q, a in faqs)
    top_signals_html = "\n".join(f"<li>{s}</li>" for s in top_signals)
    sub_focus_html = "; ".join(sub_focus)

    # Pick 3 related sectors (deterministic rotation)
    all_slugs = [s[0] for s in SECTORS]
    idx = all_slugs.index(slug)
    related = [all_slugs[(idx + i) % len(all_slugs)] for i in (5, 9, 13)]
    related_html = "\n".join(
        f'<li><a href="{BASE}/sectors/{r}" style="color:#0066cc">Sectors › {r.replace("-", " ").title()}</a></li>'
        for r in related
    )

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>{title}</title>
<link rel="stylesheet" href="/ux.css">
<meta name="theme-color" content="#ffffff">
<meta name="color-scheme" content="light">
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
<meta property="og:url" content="{url}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{desc}">
<meta name="robots" content="index, follow, max-image-preview:large">
<script type="application/ld+json">{json.dumps(article_json)}</script>
<script type="application/ld+json">{json.dumps(breadcrumb_json)}</script>
<script type="application/ld+json">{json.dumps(faq_json)}</script>
<script type="application/ld+json">{json.dumps({"@context":"https://schema.org","@type":"Organization","name":"GitDealFlow","url":BASE,"description":"GitDealFlow tracks commit velocity, contributor growth, and repository expansion across 369 startup GitHub orgs in 15 sectors. Surfaces breakout engineering teams 3–6 weeks before fundraise announcements."})}</script>
<script>
    !function(t,e){{var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){{function g(t,e){{var o=e.split('.');2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){{t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}}}(p=t.createElement('script')).type='text/javascript',p.async=!0,p.src=s.api_host+'/static/array.js',(r=t.getElementsByTagName('script')[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a='posthog',u.people=u.people||[],u.toString=function(t){{var e='posthog';return'posthog'!==a&&(e+='.'+a),t||(e+=' (stub)'),e}},u.people.toString=function(){{return u.toString(1)+'.people (stub)'}},o='init capture register register_once register_for_session unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group setPersonProperties resetPersonProperties setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags'.split(' '),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])}},e.__SV=1)}}(document,window.posthog||[]);
    (function(){{function _init(){{ if(/^https?:$/.test(location.protocol)) posthog.init('phc_lyZCgvTpicjLzAO3rY2GhxuX5WUc5jQjP8ZVwwJqauX', {{api_host: 'https://eu.i.posthog.com', persistence: 'memory', person_profiles: 'identified_only'}}); }} if('requestIdleCallback' in window){{requestIdleCallback(_init,{{timeout:2500}});}} else {{setTimeout(_init,2000);}} }})();
</script>
<script src="/ux.js" defer></script>
</head>
<body style="font-family:-apple-system,system-ui,sans-serif;max-width:760px;margin:60px auto;padding:0 20px;line-height:1.7;color:#1a1a1a;background:#fff">
<header style="margin-bottom:40px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem"><a href="{BASE}" style="font-weight:800;font-size:1.1rem;color:#1a1a1a;text-decoration:none;min-height:44px;display:inline-flex;align-items:center">GitDealFlow</a><nav aria-label="Primary navigation" style="display:flex;gap:1.25rem"><a href="{BASE}/pricing" style="color:#0066cc;text-decoration:none;min-height:44px;display:inline-flex;align-items:center">Pricing</a><a href="{SIGNALS}" style="color:#0066cc;text-decoration:none;min-height:44px;display:inline-flex;align-items:center">Live signals</a></nav></header>
<main>
<nav style="font-size:.9rem;color:#666;margin-bottom:1.5rem"><a href="{BASE}" style="color:#0066cc">Home</a> › <a href="{BASE}/sectors" style="color:#0066cc">Sectors</a> › {display}</nav>
<h1 style="font-size:2em;font-weight:800;margin-bottom:.5em;line-height:1.2">{display} Startups — Funding Signals & Deal Flow</h1>
<p style="font-size:1.1em;color:#555;margin-bottom:2em">{tagline.capitalize()} — tracked at the GitHub-org level across 369 startups.</p>
<p>GitDealFlow tracks {tagline} startup momentum derived from public GitHub activity: commit velocity, contributor growth, and repository expansion. We surface breakout {display.lower()} engineering teams 3–6 weeks before their fundraise is announced — early enough to matter, late enough to be real. The {display.lower()} sector bucket includes {sub_focus_html}.</p>

<h2 style="font-size:1.45rem;margin-top:2rem;border-bottom:2px solid #e5e7eb;padding-bottom:.3rem">{display} sector overview</h2>
<p>{signal_blurb}</p>
<p>The sector covers approximately {len(sub_focus)} active sub-focus areas. Teams that ship weekly commits across multiple sub-areas are the strongest predictor of near-term commercial traction; single-repo teams are typically earlier-stage and noisier.</p>

<h2 style="font-size:1.45rem;margin-top:2rem;border-bottom:2px solid #e5e7eb;padding-bottom:.3rem">Recent {display.lower()} funding trends</h2>
<p>{trend_blurb}</p>
<p>The pattern repeats across sectors: engineering acceleration in production-deployment repos (serving, integration, SDK) precedes fundraise announcements by 3–6 weeks. Research-output acceleration alone is a weaker signal — it correlates with academic output, not commercial traction.</p>

<h2 style="font-size:1.45rem;margin-top:2rem;border-bottom:2px solid #e5e7eb;padding-bottom:.3rem">Top {display.lower()} signals to track</h2>
<p>The GitDealFlow methodology weights the following signals most heavily when scoring {display.lower()} startup momentum:</p>
<ul style="line-height:1.9">
{top_signals_html}
</ul>

<div style="background:#f0f7ff;border-left:4px solid #0066cc;padding:1rem 1.25rem;margin:1.5rem 0;border-radius:0 .375rem .375rem">
<strong>How to verify a {display.lower()} signal:</strong> pull the org's last 12 weeks of commits via <code style="background:#f3f4f6;padding:.1em .35em;border-radius:.25em">GET {SIGNALS}/api/signals.json?sector={slug}</code>, or install the MCP server with <code style="background:#f3f4f6;padding:.1em .35em;border-radius:.25em">npx -y @gitdealflow/mcp-signal</code> and call <code style="background:#f3f4f6;padding:.1em .35em;border-radius:.25em">search_startups_by_sector("{slug}")</code>.
</div>

<h2 style="font-size:1.45rem;margin-top:2rem;border-bottom:2px solid #e5e7eb;padding-bottom:.3rem">Frequently asked questions</h2>
{faq_visible}

<p style="margin-top:2rem"><a href="{BASE}" style="color:#0066cc">Back to GitDealFlow →</a></p>
</main>

<section style="margin-top:40px;padding-top:20px;border-top:1px solid #e0e0e0">
<h3 style="font-size:1.1em;font-weight:700;margin-bottom:12px">Related pages</h3>
<ul style="list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px">
{related_html}
<li><a href="{BASE}" style="color:#0066cc">GitDealFlow home</a></li>
<li><a href="{SIGNALS}" style="color:#0066cc">Live signal data</a></li>
</ul>
</section>

<section style="margin-top:30px;padding:20px;background:#f0f7ff;border-radius:8px;border-left:4px solid #0066cc">
<p style="margin:0;font-weight:600">🔍 See live {display.lower()} startup momentum at <a href="{SIGNALS}" style="color:#0066cc">{SIGNALS}</a> — free API, MCP server, CSV export, and real-time GitHub acceleration tracking.</p>
</section>

<footer style="margin-top:60px;padding-top:20px;border-top:1px solid #e0e0e0;color:#888;font-size:.85em">
<p><strong>GitDealFlow</strong> — See which startups are heating up before they raise.</p>
<p><a href="{BASE}" style="color:#555">Home</a> · <a href="{BASE}/pricing" style="color:#555">Pricing</a> · <a href="{SIGNALS}" style="color:#555">Live signals</a></p>
</footer>

<section class="brunson-trust-bar" style="background:linear-gradient(135deg, #0f172a, #1e293b);color:#e8eaed;padding:40px 24px;margin:60px 0 0;border-top:3px solid #00d4aa;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:900px;margin:0 auto">
<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:28px;margin-bottom:28px">
<div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">21–47</span><br><span style="font-size:.82rem;color:#94a3b8">Days earlier</span></div>
<div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">47</span><br><span style="font-size:.82rem;color:#94a3b8">Days before deck</span></div>
<div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">3</span><br><span style="font-size:.82rem;color:#94a3b8">Clicks to verify</span></div>
<div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">€5</span><br><span style="font-size:.82rem;color:#94a3b8">First teardown</span></div>
</div>
<p style="font-size:1.05rem;margin-bottom:24px;color:#cbd5e1">Every deal you hear about late already had a signal 3 weeks ago. Stop being last.</p>
<a href="{BASE}/#get-teardown" style="display:inline-block;background:linear-gradient(135deg,#00d4aa,#2deec0);color:#04130e;padding:14px 32px;border-radius:12px;font-weight:700;text-decoration:none;font-size:.95rem;box-shadow:0 8px 24px -10px rgba(0,212,170,.5)">Get a Teardown →</a>
<p style="margin-top:18px;font-size:.78rem;color:#6b7178">🛡️ Verify the claim in three clicks or you do not pay. Founding price locked.</p>
</div>
</section>
</body>
</html>
"""
    out_dir = ROOT / "sectors" / slug
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "index.html").write_text(html, encoding="utf-8")
    return url


def update_sitemap(urls):
    sm = ROOT / "sitemap-pages.xml"
    text = sm.read_text(encoding="utf-8")
    # Idempotent: remove any existing /sectors/ entries we own, then re-add
    text = re.sub(r"\n\s*<url>\s*<loc>[^\n]*gitdealflow\.com/sectors/[^\n]*</loc>[^\n]*</url>\n*", "\n", text, flags=re.DOTALL)
    # Simpler: line-based
    lines = [l for l in text.splitlines() if "/sectors/" not in l]
    text = "\n".join(lines)
    additions = "\n".join(
        f"  <url>\n    <loc>{u}</loc>\n    <lastmod>{TODAY}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>"
        for u in urls
    )
    text = text.replace("</urlset>", additions + "\n</urlset>")
    sm.write_text(text, encoding="utf-8")


def main():
    urls = [build_page(sec) for sec in SECTORS]
    update_sitemap(urls)
    print(f"Generated {len(urls)} sector pages")
    print(f"Sample: {urls[0]}")


if __name__ == "__main__":
    main()
