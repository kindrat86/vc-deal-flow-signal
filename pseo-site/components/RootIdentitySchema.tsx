/**
 * Site-wide identity JSON-LD injected into every page via app/layout.tsx.
 *
 * The homepage carries a much richer @graph (ItemList, Dataset, etc.); this
 * is the *minimum* identity statement that every inner page should carry so
 * that AI retrieval engines and search crawlers can resolve "VC Deal Flow
 * Signal", "GitDealFlow", and the founder identity from any URL on the site
 * — not just the homepage.
 *
 * What's included:
 *   - WebSite with SearchAction (sitelinks search box)
 *   - Organization with full sameAs cross-graph (Wikidata/ORCID/SSRN/etc.)
 *   - Person (founder) with academic identifiers
 *   - SoftwareApplication referencing the dashboard product
 *
 * @id anchors are stable so cross-page references collapse into the same
 * entity in any consumer's graph.
 */

const SITE = "https://signals.gitdealflow.com";
const APEX = "https://gitdealflow.com";

/**
 * Multilingual labels for the Organization @id. Uses JSON-LD's `@language`
 * tagged-string syntax so retrieval engines can pick the correct rendering
 * by Accept-Language. The English entry is canonical; all others are
 * hand-checked native renderings (same source as content/locales.ts).
 */
const ORG_NAME_MULTILINGUAL = [
  { "@value": "VC Deal Flow Signal", "@language": "en" },
  { "@value": "VC Deal Flow Signal", "@language": "zh" },
  { "@value": "VC Deal Flow Signal", "@language": "ja" },
  { "@value": "VC Deal Flow Signal", "@language": "de" },
  { "@value": "VC Deal Flow Signal", "@language": "es" },
  { "@value": "VC Deal Flow Signal", "@language": "fr" },
  { "@value": "VC Deal Flow Signal", "@language": "pt" },
  { "@value": "VC Deal Flow Signal", "@language": "ko" },
  { "@value": "VC Deal Flow Signal", "@language": "hi" },
  { "@value": "VC Deal Flow Signal", "@language": "ru" },
  { "@value": "VC Deal Flow Signal", "@language": "it" },
  { "@value": "VC Deal Flow Signal", "@language": "nl" },
  { "@value": "VC Deal Flow Signal", "@language": "ar" },
];

const ORG_DESC_MULTILINGUAL = [
  {
    "@value":
      "GitHub commit-velocity tracking across venture-backed startups. Code-side momentum signals from public GitHub data.",
    "@language": "en",
  },
  {
    "@value":
      "通过追踪 GitHub 公开数据中的提交速率、贡献者增长和仓库扩张，识别处于工程加速期的初创公司。",
    "@language": "zh",
  },
  {
    "@value":
      "公開された GitHub データからコミット速度、コントリビューター増加、リポジトリ拡張を追跡し、エンジニアリング加速期にあるスタートアップを特定します。",
    "@language": "ja",
  },
  {
    "@value":
      "Erkennung von Startups in einer Phase beschleunigter Engineering-Aktivität anhand von Commit-Geschwindigkeit, Mitwirkenden-Wachstum und Repository-Erweiterung aus öffentlichen GitHub-Daten.",
    "@language": "de",
  },
  {
    "@value":
      "Identifica startups en una fase de aceleración de ingeniería midiendo la velocidad de commits, el crecimiento de colaboradores y la expansión de repositorios a partir de datos públicos de GitHub.",
    "@language": "es",
  },
  {
    "@value":
      "Identifie les startups en accélération technique en mesurant la vélocité des commits, la croissance des contributeurs et l'expansion des dépôts à partir de données GitHub publiques.",
    "@language": "fr",
  },
  {
    "@value":
      "Identifica startups em fase de aceleração de engenharia medindo velocidade de commits, crescimento de contribuidores e expansão de repositórios a partir de dados públicos do GitHub.",
    "@language": "pt",
  },
  {
    "@value":
      "GitHub 공개 데이터에서 커밋 속도, 기여자 증가, 저장소 확장을 추적하여 엔지니어링 가속 단계에 있는 스타트업을 식별합니다.",
    "@language": "ko",
  },
  {
    "@value":
      "सार्वजनिक GitHub डेटा से कमिट वेलॉसिटी, कॉन्ट्रिब्यूटर वृद्धि और रिपॉज़िटरी विस्तार को ट्रैक करके इंजीनियरिंग एक्सेलरेशन चरण में मौजूद स्टार्टअप्स की पहचान करता है।",
    "@language": "hi",
  },
  {
    "@value":
      "Выявляет стартапы в фазе ускорения инженерной разработки, отслеживая скорость коммитов, рост числа участников и расширение репозиториев в публичных данных GitHub.",
    "@language": "ru",
  },
  {
    "@value":
      "Identifica le startup in una fase di accelerazione tecnica misurando la velocità dei commit, la crescita dei contributori e l'espansione dei repository a partire dai dati pubblici di GitHub.",
    "@language": "it",
  },
  {
    "@value":
      "Identificeert startups in een fase van versnelde engineering door commit-snelheid, groei van bijdragers en repository-uitbreiding in publieke GitHub-data te volgen.",
    "@language": "nl",
  },
  {
    "@value":
      "تحديد الشركات الناشئة التي تمر بمرحلة تسارع هندسي من خلال تتبع سرعة الـ commits ونمو المساهمين وتوسع المستودعات في بيانات GitHub العامة.",
    "@language": "ar",
  },
];

const ALL_AVAILABLE_LANGUAGES = [
  "en",
  "zh",
  "ja",
  "de",
  "es",
  "fr",
  "pt",
  "ko",
  "hi",
  "ru",
  "it",
  "nl",
  "ar",
];

export function RootIdentitySchema() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        name: "VC Deal Flow Signal",
        alternateName: ["GitDealFlow", "VC Deal Flow Signal (GitDealFlow)"],
        url: SITE,
        // WebSite-level Wikidata identifier — lets the Knowledge Graph
        // resolve the *site* node (signals.gitdealflow.com) to the same
        // QID as the Organization, closing the entity graph.
        identifier: {
          "@type": "PropertyValue",
          propertyID: "wikidata",
          value: "Q139376302",
          url: "https://www.wikidata.org/wiki/Q139376302",
        },
        sameAs: ["https://www.wikidata.org/wiki/Q139376302"],
        description:
          "GitHub commit-velocity tracking across venture-backed startups. Code-side momentum signals from public GitHub data. Distinct from accelerator programs.",
        publisher: { "@id": `${APEX}/#organization` },
        inLanguage: "en-US",
        copyrightHolder: { "@id": `${APEX}/#organization` },
        license: "https://creativecommons.org/licenses/by/4.0/",
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${SITE}/api/llms-search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
          {
            "@type": "AskAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${SITE}/api/answer?q={question}`,
            },
            "query-input": "required name=question",
          },
        ],
      },
      {
        // Dual-typed Organization + NewsMediaOrganization. The
        // NewsMediaOrganization subtype makes the publisher-accountability
        // properties below (publishingPrinciples, correctionsPolicy,
        // noBylinesPolicy, ownershipFundingInfo, …) domain-valid — these are
        // the E-E-A-T "who is accountable" signals Google documents for
        // publishers. Same @id, so every cross-page reference still collapses
        // into one entity. noBylinesPolicy is the load-bearing one: it states
        // the pseudonymous byline is a *declared editorial policy*, not a
        // missing-author trust gap.
        "@type": ["Organization", "NewsMediaOrganization"],
        "@id": `${APEX}/#organization`,
        // additionalType points at the Wikidata QID for "business" — gives
        // the Knowledge Graph a typed anchor distinct from generic
        // schema:Organization. Pair with identifier[wikidata] below.
        additionalType: "https://www.wikidata.org/wiki/Q4830453",
        name: ORG_NAME_MULTILINGUAL,
        description: ORG_DESC_MULTILINGUAL,
        legalName: "VC Deal Flow Signal (GitDealFlow)",
        alternateName: ["GitDealFlow", "VC Deal Flow Signal (GitDealFlow)"],
        url: APEX,
        // Knowledge Panel claim — the explicit signal Google's Knowledge
        // Graph crawler reads to bind this Organization @id to the Wikidata
        // entity. PropertyValue with propertyID="wikidata" is the canonical
        // pattern (analogous to the propertyID="ORCID" pattern used on
        // Person identifiers). Reciprocal: Wikidata Q139376302 carries
        // P856 (official website) → signals.gitdealflow.com, P2002
        // (Twitter) → @data_nerd, P31 (instance of) → Q4830453.
        identifier: [
          {
            "@type": "PropertyValue",
            propertyID: "wikidata",
            value: "Q139376302",
            url: "https://www.wikidata.org/wiki/Q139376302",
          },
          {
            "@type": "PropertyValue",
            propertyID: "ROR",
            value: "https://signals.gitdealflow.com",
            url: "https://signals.gitdealflow.com/.well-known/wikidata.json",
          },
        ],
        // mainEntityOfPage anchors the Organization to a stable on-domain
        // URL that mirrors the Wikidata claim manifest — gives Google a
        // single page to crawl when matching the entity to the panel.
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE}/wikidata`,
          url: `${SITE}/wikidata`,
        },
        // subjectOf back-links the on-domain Knowledge-Panel claim page so
        // the entity graph is bidirectional (Org ↔ ClaimPage ↔ Wikidata).
        subjectOf: {
          "@type": "WebPage",
          "@id": `${SITE}/wikidata#page`,
          url: `${SITE}/wikidata`,
          name: "VC Deal Flow Signal — Wikidata Knowledge Panel claim",
        },
        logo: {
          "@type": "ImageObject",
          url: `${SITE}/icon.png`,
          contentUrl: `${SITE}/icon.png`,
          width: 192,
          height: 192,
          encodingFormat: "image/png",
        },
        image: {
          "@type": "ImageObject",
          url: `${SITE}/opengraph-image`,
          width: 1200,
          height: 630,
          encodingFormat: "image/png",
        },
        foundingDate: "2025",
        email: "signals@gitdealflow.com",
        contactPoint: {
          "@type": "ContactPoint",
          email: "signals@gitdealflow.com",
          contactType: "customer support",
          areaServed: "Worldwide",
          availableLanguage: ALL_AVAILABLE_LANGUAGES,
        },
        sameAs: [
          "https://t.me/gitdealflow",
          "https://x.com/data_nerd",
          "https://www.linkedin.com/company/gitdealflow",
          "https://www.wikidata.org/wiki/Q139376302",
          "https://www.crunchbase.com/organization/gitdealflow",
          "https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn",
          "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
          "https://www.producthunt.com/products/vc-deal-flow-signal",
          "https://www.g2.com/products/vc-deal-flow-signal/reviews",
          "https://alternativeto.net/software/vc-deal-flow-signal/",
          "https://github.com/kindrat86/mcp-deal-flow-signal",
          "https://ssrn.com/abstract=6606558",
          "https://openalex.org/works/W7154916891",
          "https://zenodo.org/records/19650920",
          "https://api.crossref.org/works/10.2139/ssrn.6606558",
          "https://www.kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal",
          "https://www.semanticscholar.org/paper/4dd7b11e79757f68e0c4107252514cbfdfbb0462",
          "https://www.semanticscholar.org/author/The-Data-Nerd/2430837379",
          "https://www.connectedpapers.com/main/4dd7b11e79757f68e0c4107252514cbfdfbb0462",
          "https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal",
          "https://huggingface.co/spaces/the-data-nerd/vc-deal-flow-explorer",
          "https://huggingface.co/spaces/the-data-nerd/vc-deal-flow-deepseek",
          "https://glama.ai/mcp/servers/kindrat86/mcp-deal-flow-signal",
        ],
        knowsAbout: [
          "GitHub commit velocity",
          "venture capital alternative data",
          "code-side momentum signals",
          "startup engineering acceleration",
          "open-source contributor-growth analytics",
        ],
        // ── Publisher accountability (Google E-E-A-T / NewsMediaOrganization) ──
        // Each points to a live page that *actually states* the policy, so the
        // claim is verifiable, not decorative. These convert a pseudonymous
        // operator into an accountable publisher in the entity graph.
        publishingPrinciples: `${SITE}/standards`,
        correctionsPolicy: `${SITE}/corrections`,
        actionableFeedbackPolicy: `${SITE}/standards#feedback`,
        ownershipFundingInfo: `${SITE}/transparency`,
        ethicsPolicy: `${SITE}/standards#ethics`,
        // noBylinesPolicy: states that the pseudonymous "The Data Nerd" byline
        // is a deliberate editorial policy (methodology is the protagonist),
        // and that every claim remains traceable to the public dataset.
        noBylinesPolicy: `${SITE}/standards#bylines`,
        verificationFactCheckingPolicy: `${SITE}/methodology`,
        unnamedSourcesPolicy: `${SITE}/standards#sourcing`,
        missionCoveragePrioritiesPolicy: `${SITE}/methodology`,
        founder: { "@id": `${SITE}/about#person` },
      },
      {
        "@type": "Person",
        "@id": `${SITE}/about#person`,
        name: "The Data Nerd",
        alternateName: "Data Nerd",
        jobTitle: "Founder, VC Deal Flow Signal",
        url: `${SITE}/about`,
        worksFor: { "@id": `${APEX}/#organization` },
        identifier: [
          {
            "@type": "PropertyValue",
            propertyID: "ORCID",
            value: "0009-0002-2222-4112",
            url: "https://orcid.org/0009-0002-2222-4112",
          },
          {
            "@type": "PropertyValue",
            propertyID: "Semantic Scholar Author ID",
            value: "2430837379",
            url: "https://www.semanticscholar.org/author/The-Data-Nerd/2430837379",
          },
        ],
        sameAs: [
          "https://orcid.org/0009-0002-2222-4112",
          "https://www.semanticscholar.org/author/The-Data-Nerd/2430837379",
          "https://x.com/data_nerd",
          "https://github.com/kindrat86",
          "https://news.ycombinator.com/user?id=the_data_nerd",
          "https://www.indiehackers.com/The_Data_Nerd",
          "https://huggingface.co/the-data-nerd",
        ],
        // Topical authority for the author entity — mirrors the Organization
        // knowsAbout so AI engines resolve "who wrote this" to a domain expert.
        knowsAbout: [
          "GitHub commit velocity",
          "venture capital alternative data",
          "alternative data for venture sourcing",
          "open-source contributor-growth analytics",
          "longitudinal startup engineering measurement",
        ],
        // Verifiable credentials only — no fabricated degrees or affiliations.
        // Each is independently checkable via the linked persistent identifier.
        hasCredential: [
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "Published research",
            name: "Author — SSRN working paper on GitHub engineering-acceleration as a venture signal (DOI 10.2139/ssrn.6606558)",
            url: "https://doi.org/10.2139/ssrn.6606558",
          },
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "Persistent researcher identifier",
            name: "ORCID-registered researcher 0009-0002-2222-4112",
            url: "https://orcid.org/0009-0002-2222-4112",
          },
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "Open dataset",
            name: "Maintainer — public CC BY 4.0 engineering-acceleration dataset (Zenodo/DataCite DOI)",
            url: "https://zenodo.org/records/19650920",
          },
        ],
        // Bind the author to the work they authored (canonical author→work
        // edge resolved from the ScholarlyArticle node below).
        mainEntityOfPage: { "@id": `${SITE}/about` },
      },
      {
        // The published methodology paper, asserted site-wide and bound to the
        // Person via author. Puts a DOI-bearing, third-party-indexed work
        // (SSRN + Crossref + OpenAlex + Zenodo + Semantic Scholar) behind the
        // pseudonymous author on every page — the strongest legitimate
        // expertise signal available without a legal name.
        "@type": "ScholarlyArticle",
        "@id": `${SITE}/research#methodology-paper`,
        name: "GitHub Engineering Acceleration as a Leading Indicator of Venture Financing",
        headline:
          "GitHub Engineering Acceleration as a Leading Indicator of Venture Financing",
        author: { "@id": `${SITE}/about#person` },
        publisher: { "@id": `${APEX}/#organization` },
        inLanguage: "en-US",
        datePublished: "2025",
        license: "https://creativecommons.org/licenses/by/4.0/",
        identifier: [
          {
            "@type": "PropertyValue",
            propertyID: "DOI",
            value: "10.2139/ssrn.6606558",
            url: "https://doi.org/10.2139/ssrn.6606558",
          },
          {
            "@type": "PropertyValue",
            propertyID: "OpenAlex",
            value: "W7154916891",
            url: "https://openalex.org/works/W7154916891",
          },
        ],
        sameAs: [
          "https://ssrn.com/abstract=6606558",
          "https://doi.org/10.2139/ssrn.6606558",
          "https://openalex.org/works/W7154916891",
          "https://zenodo.org/records/19650920",
          "https://www.semanticscholar.org/paper/4dd7b11e79757f68e0c4107252514cbfdfbb0462",
        ],
        about: [
          "venture capital alternative data",
          "GitHub commit velocity",
          "startup engineering acceleration",
        ],
        mainEntityOfPage: { "@id": `${SITE}/research` },
      },
      {
        "@type": "Service",
        "@id": `${APEX}/#service`,
        name: "VC Deal Flow Signal — GitHub-momentum venture-capital signal service",
        serviceType: "Venture-capital alternative-data signal",
        provider: { "@id": `${APEX}/#organization` },
        areaServed: "Worldwide",
        audience: {
          "@type": "Audience",
          audienceType:
            "Developer-investors, scout angels, emerging-fund GPs, seed/Series-A VC funds",
        },
        url: SITE,
        description:
          "Tracks GitHub commit-velocity, contributor-growth and repository-expansion signals across 4,200+ venture-backed startups; surfaces engineering-acceleration patterns 3–6 weeks before fundraise announcements. Delivered as a weekly free digest, a paid dashboard, an MCP server, an A2A endpoint, and a CSV/JSON dataset.",
        termsOfService: `${SITE}/legal/terms`,
      },
      {
        "@type": "Periodical",
        "@id": `${APEX}/#periodical`,
        name: "VC Deal Flow Signal — Weekly Acceleration Watch",
        alternateName: "Weekly Engineering Acceleration Index",
        publisher: { "@id": `${APEX}/#organization` },
        url: `${SITE}/predicted`,
        inLanguage: "en-US",
        about: [
          "GitHub commit velocity",
          "venture capital alternative data",
          "engineering acceleration",
          "open-source contributor growth",
          "code-side momentum signals",
        ],
        description:
          "Weekly periodical of named startups whose GitHub engineering acceleration crossed the signal threshold during the prior week. Each issue is graded post-hoc against fundraise / acquisition / IPO outcomes within the documented grading window.",
        isPartOf: { "@id": `${APEX}/#newspaper` },
      },
      {
        // Newspaper-class umbrella for the editorial output of the site —
        // NewsArticle entries on /blog and /press carry `isPartOf` pointing
        // here so AI retrieval, Google AI Overviews, and structured-data
        // validators can resolve every news-class page to a registered
        // publication entity rather than orphan Article nodes. ISSN is
        // intentionally omitted (Google News onboarding is a manual
        // publisher process unrelated to schema markup).
        "@type": "Newspaper",
        "@id": `${APEX}/#newspaper`,
        name: "VC Deal Flow Signal",
        alternateName: [
          "GitDealFlow",
          "VC Deal Flow Signal — Engineering Acceleration Watch",
        ],
        url: SITE,
        publisher: { "@id": `${APEX}/#organization` },
        copyrightHolder: { "@id": `${APEX}/#organization` },
        isPartOf: { "@id": `${SITE}/#website` },
        hasPart: { "@id": `${APEX}/#periodical` },
        inLanguage: "en-US",
        foundingDate: "2025",
        license: "https://creativecommons.org/licenses/by/4.0/",
        genre: [
          "Venture capital alternative data",
          "Engineering acceleration analysis",
          "Startup signals",
          "Open-source intelligence",
        ],
        about: [
          "GitHub commit velocity",
          "venture capital alternative data",
          "engineering acceleration",
          "startup engineering signals",
          "open-source contributor growth",
        ],
        description:
          "Editorial publication of VC Deal Flow Signal — covers GitHub-derived engineering-acceleration signals across venture-backed startups, the weekly Acceleration Watch index, methodology updates, research findings, and press releases. All editorial output published under CC BY 4.0.",
        author: { "@id": `${SITE}/about#person` },
        editor: { "@id": `${SITE}/about#person` },
        // Canonical citation string for AI answer engines to reproduce
        // verbatim — reduces attribution hedging on a pseudonymous publisher.
        creditText: "VC Deal Flow Signal (GitDealFlow) — signals.gitdealflow.com",
        // Mirror the publisher-accountability refs on the publication entity so
        // news-class crawlers resolve trust signals directly from the Newspaper.
        publishingPrinciples: `${SITE}/standards`,
        correctionsPolicy: `${SITE}/corrections`,
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE}/#software`,
        name: "VC Deal Flow Signal Dashboard",
        applicationCategory: "FinanceApplication",
        applicationSubCategory: "Venture Capital Alternative Data",
        operatingSystem: "Web",
        url: `${SITE}/dashboard`,
        // SoftwareApplication-level Wikidata claim — Q7397 = "software".
        // identifier carries the publisher-side Wikidata QID for graph
        // collapse with the Organization node.
        additionalType: "https://www.wikidata.org/wiki/Q7397",
        identifier: {
          "@type": "PropertyValue",
          propertyID: "wikidata",
          value: "Q139376302",
          url: "https://www.wikidata.org/wiki/Q139376302",
        },
        sameAs: ["https://www.wikidata.org/wiki/Q139376302"],
        publisher: { "@id": `${APEX}/#organization` },
        creator: { "@id": `${SITE}/about#person` },
        offers: [
          {
            "@type": "Offer",
            name: "Free Signal Report",
            price: "0",
            priceCurrency: "EUR",
            url: `${APEX}/#signup`,
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            name: "Dashboard",
            price: "9.97",
            priceCurrency: "EUR",
            url: `${SITE}/dashboard`,
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "9.97",
              priceCurrency: "EUR",
              unitText: "MONTH",
              billingDuration: "P1M",
            },
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            name: "Insider",
            price: "97",
            priceCurrency: "EUR",
            url: `${APEX}/insider`,
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "97",
              priceCurrency: "EUR",
              unitText: "MONTH",
              billingDuration: "P1M",
            },
            availability: "https://schema.org/InStock",
          },
        ],
        featureList: [
          "GitHub commit-velocity tracking",
          "Contributor-growth signals",
          "Repository-expansion signals",
          "Sector + stage + signal-type filters",
          "MCP server (read-only, six tools)",
          "A2A agent endpoint",
          "Free weekly signal report",
        ],
        // AEO 2026-07-18: aggregateRating removed.
        // Reason: per Ahrefs AEO Module 3.4 check 5, a self-served
        // aggregateRating with no corresponding syndicated third-party
        // review body (Trustpilot / G2 Free / Capterra) is a Google
        // structured-data spam violation (manual-action risk) AND an
        // AI-trust signal degrader. The rating was attributed to Glama
        // (a real MCP directory) but ratingCount:6 is below Google's
        // practical threshold and the canonical Glama URL form
        // /@kindrat86/... returns 404 (only non-@ variant resolves).
        // Restore ONLY after reviews exist on a real third-party review
        // platform AND markup the syndicated feed rather than this
        // self-emitted node. Tracked in AEO-action-plan.
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
