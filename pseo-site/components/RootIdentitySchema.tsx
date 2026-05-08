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
 *     and knowsAbout vocabulary anchors
 *   - Brand (distinct from Organization) with slogan + logo + brand-channel
 *     sameAs; Organization.brand back-references it
 *   - Person (founder) with academic identifiers, knowsAbout, knowsLanguage
 *   - Service + Periodical + SoftwareApplication referencing the offerings
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
        "@type": "Organization",
        "@id": `${APEX}/#organization`,
        name: ORG_NAME_MULTILINGUAL,
        description: ORG_DESC_MULTILINGUAL,
        legalName: "VC Deal Flow Signal (GitDealFlow)",
        alternateName: ["GitDealFlow", "VC Deal Flow Signal (GitDealFlow)"],
        url: APEX,
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
        email: "signal@gitdealflow.com",
        contactPoint: {
          "@type": "ContactPoint",
          email: "signal@gitdealflow.com",
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
          "https://www.saashub.com/vc-deal-flow-signal",
          "https://alternativeto.net/software/vc-deal-flow-signal/",
          "https://github.com/kindrat86/mcp-deal-flow-signal",
          "https://smithery.ai/server/@kindrat86/mcp-deal-flow-signal",
          "https://www.youtube.com/channel/UCSK4ZC9EJAHjHyncb5cSh8w",
          "https://ssrn.com/abstract=6606558",
          "https://doi.org/10.2139/ssrn.6606558",
          "https://openalex.org/works/W7154916891",
          "https://zenodo.org/records/19650920",
          "https://doi.org/10.5281/zenodo.19650920",
          "https://api.crossref.org/works/10.2139/ssrn.6606558",
          "https://kaggle.com/datasets/thedatanerd/vc-deal-flow-signal",
          "https://www.semanticscholar.org/paper/4dd7b11e79757f68e0c4107252514cbfdfbb0462",
          "https://www.semanticscholar.org/author/The-Data-Nerd/2430837379",
          "https://www.connectedpapers.com/main/4dd7b11e79757f68e0c4107252514cbfdfbb0462",
          "https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal",
          "https://huggingface.co/spaces/the-data-nerd/vc-deal-flow-explorer",
          "https://huggingface.co/spaces/the-data-nerd/vc-deal-flow-deepseek",
        ],
        knowsAbout: [
          "GitHub commit velocity",
          "venture capital alternative data",
          "code-side momentum signals",
          "startup engineering acceleration",
          "open-source contributor-growth analytics",
          "Model Context Protocol",
          "Agent-to-Agent (A2A) interoperability",
          "engineering hiring bursts",
          "framework migration signals",
          "deploy-frequency analytics",
        ],
        brand: { "@id": `${APEX}/#brand` },
        founder: { "@id": `${SITE}/about#person` },
      },
      {
        "@type": "Brand",
        "@id": `${APEX}/#brand`,
        name: "GitDealFlow",
        alternateName: ["VC Deal Flow Signal", "Engineering Acceleration Watch"],
        slogan: "Read the code; predict the round.",
        url: APEX,
        logo: {
          "@type": "ImageObject",
          url: `${SITE}/icon.png`,
          contentUrl: `${SITE}/icon.png`,
          width: 192,
          height: 192,
          encodingFormat: "image/png",
        },
        sameAs: [
          "https://www.wikidata.org/wiki/Q139376302",
          "https://www.linkedin.com/company/gitdealflow",
          "https://x.com/data_nerd",
          "https://t.me/gitdealflow",
          "https://www.youtube.com/channel/UCSK4ZC9EJAHjHyncb5cSh8w",
          "https://www.producthunt.com/products/vc-deal-flow-signal",
          "https://www.g2.com/products/vc-deal-flow-signal/reviews",
          "https://www.saashub.com/vc-deal-flow-signal",
          "https://alternativeto.net/software/vc-deal-flow-signal/",
        ],
        owner: { "@id": `${APEX}/#organization` },
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
          "https://dev.to/the_data_nerd",
          "https://huggingface.co/the-data-nerd",
        ],
        knowsAbout: [
          "GitHub commit velocity",
          "venture capital alternative data",
          "code-side momentum signals",
          "engineering acceleration",
          "open-source contributor analytics",
          "Model Context Protocol",
          "Agent-to-Agent (A2A) interoperability",
          "Schema.org structured data",
          "programmatic SEO",
          "Generative Engine Optimization",
        ],
        knowsLanguage: [
          "en",
          "ja",
          "es",
          "fr",
          "de",
        ],
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
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Delivery channels",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Weekly free Signal Digest (email)",
                url: `${APEX}/#signup`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Dashboard (paid, €9.97/mo)",
                url: `${SITE}/dashboard`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "MCP server (free, no API key)",
                url: `${SITE}/.well-known/agent-card.json`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "A2A agent endpoint",
                url: `${SITE}/.well-known/agents.json`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Open dataset (CC BY 4.0)",
                url: `${SITE}/dataset`,
              },
            },
          ],
        },
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
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE}/#software`,
        name: "VC Deal Flow Signal Dashboard",
        applicationCategory: "FinanceApplication",
        applicationSubCategory: "Venture Capital Alternative Data",
        operatingSystem: "Web",
        url: `${SITE}/dashboard`,
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
