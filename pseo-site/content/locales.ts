/**
 * Hand-curated, short locale landings. We do NOT ship machine-translated
 * full-site copy, Google penalizes thin/translated pages, and bad
 * translations hurt brand. Each entry is a short "what we are" landing in
 * the target language, written so a native speaker would not flag it as
 * machine-translated, with a clear pointer back to the canonical English
 * surfaces.
 *
 * 12 locales now: zh, ja, de, es, fr, pt, ko, hi, ru, it, nl, ar.
 * Arabic carries dir="rtl" so the layout flips correctly.
 *
 * Structural i18n we ship across the whole site:
 *   - hreflang declarations on every canonical page (lib/hreflang.ts)
 *   - inLanguage on every JSON-LD WebPage / Article
 *   - Multilingual Organization.name + description (@language arrays)
 *   - availableLanguage on ContactPoint covers all 12 locales
 *   - dir="rtl" on Arabic page wrappers
 *   - i18n-annotated /sitemap-i18n.xml with xhtml:link rel=alternate
 */

export type LocaleDir = "ltr" | "rtl";

export interface Locale {
  code: string; // BCP-47
  display: string;
  nativeName: string;
  region: string;
  dir: LocaleDir;
  /** Hand-written canonical statement of what the product does, in the target language. */
  intro: string;
  /** Hand-written link callout to the English canonical surfaces. */
  englishCanonicalNote: string;
  /** Translated label for the "Methodology" link. */
  methodologyLabel: string;
  /** Translated label for the "Free signal report" link. */
  signalReportLabel: string;
}

export const LOCALES: Locale[] = [
  {
    code: "zh",
    display: "Chinese (Simplified)",
    nativeName: "简体中文",
    region: "Greater China",
    dir: "ltr",
    intro:
      "VC Deal Flow Signal（GitDealFlow）通过追踪 GitHub 公开数据中的提交速率、贡献者增长和仓库扩张，识别处于工程加速期的初创公司。我们的研究表明，此类信号通常在融资公告前 3 至 6 周出现。方法论已在 SSRN 公开发表（DOI 10.2139/ssrn.6606558，CC BY 4.0），数据集开放下载。",
    englishCanonicalNote:
      "本页面为简明摘要。完整产品、方法论和数据集页面以英文为权威版本。",
    methodologyLabel: "方法论 (Methodology)",
    signalReportLabel: "免费每周信号简报 (Free Weekly Signal Report)",
  },
  {
    code: "ja",
    display: "Japanese",
    nativeName: "日本語",
    region: "Japan",
    dir: "ltr",
    intro:
      "VC Deal Flow Signal（GitDealFlow）は、公開された GitHub データからコミット速度、コントリビューター増加、リポジトリ拡張を追跡し、エンジニアリング加速期にあるスタートアップを特定します。当社の調査では、こうしたシグナルは資金調達発表の 3〜6 週間前に観測される傾向があります。方法論は SSRN にて公開済み（DOI 10.2139/ssrn.6606558、CC BY 4.0）、データセットも開放されています。",
    englishCanonicalNote:
      "本ページは要約版です。完全な製品ページ、方法論、データセットの正本は英語版です。",
    methodologyLabel: "方法論 (Methodology)",
    signalReportLabel: "無料週次シグナルレポート (Free Weekly Signal Report)",
  },
  {
    code: "de",
    display: "German",
    nativeName: "Deutsch",
    region: "DACH",
    dir: "ltr",
    intro:
      "VC Deal Flow Signal (GitDealFlow) erkennt Startups in einer Phase beschleunigter Engineering-Aktivität, indem wir Commit-Geschwindigkeit, Mitwirkenden-Wachstum und Repository-Erweiterung aus öffentlichen GitHub-Daten messen. Unsere Forschung zeigt, dass solche Signale typischerweise drei bis sechs Wochen vor Finanzierungsankündigungen auftreten. Die Methodik ist auf SSRN veröffentlicht (DOI 10.2139/ssrn.6606558, CC BY 4.0); der Datensatz ist offen verfügbar.",
    englishCanonicalNote:
      "Diese Seite ist eine Kurzfassung. Vollständige Produktseiten, Methodik und Datensatz sind kanonisch in englischer Sprache.",
    methodologyLabel: "Methodik (Methodology)",
    signalReportLabel: "Kostenloser wöchentlicher Signalbericht (Free Weekly Signal Report)",
  },
  {
    code: "es",
    display: "Spanish",
    nativeName: "Español",
    region: "Spain &amp; LATAM",
    dir: "ltr",
    intro:
      "VC Deal Flow Signal (GitDealFlow) identifica startups en una fase de aceleración de ingeniería midiendo la velocidad de commits, el crecimiento de colaboradores y la expansión de repositorios a partir de datos públicos de GitHub. Nuestra investigación muestra que estas señales suelen aparecer entre tres y seis semanas antes de los anuncios de ronda. La metodología está publicada en SSRN (DOI 10.2139/ssrn.6606558, CC BY 4.0) y el conjunto de datos es abierto.",
    englishCanonicalNote:
      "Esta página es un resumen. Las páginas completas de producto, metodología y dataset son canónicas en inglés.",
    methodologyLabel: "Metodología (Methodology)",
    signalReportLabel: "Informe semanal gratuito (Free Weekly Signal Report)",
  },
  {
    code: "fr",
    display: "French",
    nativeName: "Français",
    region: "France &amp; Francophonie",
    dir: "ltr",
    intro:
      "VC Deal Flow Signal (GitDealFlow) identifie les startups en accélération technique en mesurant la vélocité des commits, la croissance des contributeurs et l'expansion des dépôts à partir de données GitHub publiques. Nos recherches montrent que ces signaux apparaissent typiquement de trois à six semaines avant les annonces de levée de fonds. La méthodologie est publiée sur SSRN (DOI 10.2139/ssrn.6606558, CC BY 4.0) ; le jeu de données est ouvert.",
    englishCanonicalNote:
      "Cette page est un résumé. Les pages produit, méthodologie et dataset complètes sont canoniques en anglais.",
    methodologyLabel: "Méthodologie (Methodology)",
    signalReportLabel: "Rapport hebdomadaire gratuit (Free Weekly Signal Report)",
  },
  {
    code: "pt",
    display: "Portuguese",
    nativeName: "Português",
    region: "Brazil &amp; Portugal",
    dir: "ltr",
    intro:
      "VC Deal Flow Signal (GitDealFlow) identifica startups em fase de aceleração de engenharia medindo velocidade de commits, crescimento de contribuidores e expansão de repositórios a partir de dados públicos do GitHub. Nossa pesquisa mostra que esses sinais aparecem tipicamente de três a seis semanas antes do anúncio de captação. A metodologia está publicada no SSRN (DOI 10.2139/ssrn.6606558, CC BY 4.0) e o conjunto de dados é aberto.",
    englishCanonicalNote:
      "Esta página é um resumo. As páginas completas de produto, metodologia e dataset são canônicas em inglês.",
    methodologyLabel: "Metodologia (Methodology)",
    signalReportLabel: "Relatório semanal gratuito (Free Weekly Signal Report)",
  },
  // ============================================================
  // 6 NEW LOCALES (round 3)
  // ============================================================
  {
    code: "ko",
    display: "Korean",
    nativeName: "한국어",
    region: "South Korea",
    dir: "ltr",
    intro:
      "VC Deal Flow Signal(GitDealFlow)은 GitHub의 공개 데이터에서 커밋 속도, 기여자 증가, 저장소 확장을 추적하여 엔지니어링 가속 단계에 있는 스타트업을 식별합니다. 저희 연구에 따르면 이러한 신호는 통상 펀드레이즈 발표보다 3~6주 앞서 관찰됩니다. 방법론은 SSRN에 영어로 공개되어 있으며(DOI 10.2139/ssrn.6606558, CC BY 4.0), 데이터셋도 공개 다운로드가 가능합니다.",
    englishCanonicalNote:
      "이 페이지는 요약본입니다. 전체 제품 페이지, 방법론, 데이터셋은 영어를 정본으로 합니다.",
    methodologyLabel: "방법론 (Methodology)",
    signalReportLabel: "무료 주간 시그널 리포트 (Free Weekly Signal Report)",
  },
  {
    code: "hi",
    display: "Hindi",
    nativeName: "हिन्दी",
    region: "India",
    dir: "ltr",
    intro:
      "VC Deal Flow Signal (GitDealFlow) सार्वजनिक GitHub डेटा से कमिट वेलॉसिटी, कॉन्ट्रिब्यूटर वृद्धि और रिपॉज़िटरी विस्तार को ट्रैक करके इंजीनियरिंग एक्सेलरेशन चरण में मौजूद स्टार्टअप्स की पहचान करता है। हमारे शोध के अनुसार ये सिग्नल सामान्यतः फ़ंडरेज़ घोषणा से तीन से छह सप्ताह पहले दिखाई देते हैं। मेथडोलॉजी SSRN पर अंग्रेज़ी में प्रकाशित है (DOI 10.2139/ssrn.6606558, CC BY 4.0), डेटासेट भी खुले रूप से उपलब्ध है।",
    englishCanonicalNote:
      "यह पृष्ठ एक सारांश है। पूर्ण प्रोडक्ट, मेथडोलॉजी और डेटासेट पृष्ठ अंग्रेज़ी में आधिकारिक रूप से उपलब्ध हैं।",
    methodologyLabel: "मेथडोलॉजी (Methodology)",
    signalReportLabel: "मुफ़्त साप्ताहिक सिग्नल रिपोर्ट (Free Weekly Signal Report)",
  },
  {
    code: "ru",
    display: "Russian",
    nativeName: "Русский",
    region: "Russia &amp; CIS",
    dir: "ltr",
    intro:
      "VC Deal Flow Signal (GitDealFlow) выявляет стартапы в фазе ускорения инженерной разработки, отслеживая скорость коммитов, рост числа участников и расширение репозиториев в публичных данных GitHub. Наше исследование показывает, что такие сигналы обычно появляются за три-шесть недель до объявлений о раундах финансирования. Методология опубликована на SSRN на английском языке (DOI 10.2139/ssrn.6606558, CC BY 4.0); набор данных также доступен открыто.",
    englishCanonicalNote:
      "Эта страница, краткая сводка. Полные страницы продукта, методологии и набора данных каноничны на английском.",
    methodologyLabel: "Методология (Methodology)",
    signalReportLabel: "Бесплатный еженедельный сигнальный отчёт (Free Weekly Signal Report)",
  },
  {
    code: "it",
    display: "Italian",
    nativeName: "Italiano",
    region: "Italy &amp; Switzerland",
    dir: "ltr",
    intro:
      "VC Deal Flow Signal (GitDealFlow) identifica le startup in una fase di accelerazione tecnica misurando la velocità dei commit, la crescita dei contributori e l'espansione dei repository a partire dai dati pubblici di GitHub. La nostra ricerca mostra che questi segnali compaiono tipicamente da tre a sei settimane prima degli annunci di raccolta fondi. La metodologia è pubblicata su SSRN in inglese (DOI 10.2139/ssrn.6606558, CC BY 4.0) e il dataset è disponibile in open access.",
    englishCanonicalNote:
      "Questa pagina è un riassunto. Le pagine complete di prodotto, metodologia e dataset sono canoniche in inglese.",
    methodologyLabel: "Metodologia (Methodology)",
    signalReportLabel: "Report settimanale gratuito (Free Weekly Signal Report)",
  },
  {
    code: "nl",
    display: "Dutch",
    nativeName: "Nederlands",
    region: "Netherlands &amp; Belgium",
    dir: "ltr",
    intro:
      "VC Deal Flow Signal (GitDealFlow) identificeert startups in een fase van versnelde engineering door commit-snelheid, groei van bijdragers en repository-uitbreiding in publieke GitHub-data te volgen. Ons onderzoek laat zien dat dit soort signalen doorgaans drie tot zes weken vóór financierings-aankondigingen verschijnt. De methodologie staat in het Engels op SSRN (DOI 10.2139/ssrn.6606558, CC BY 4.0); de dataset is open beschikbaar.",
    englishCanonicalNote:
      "Deze pagina is een samenvatting. De volledige product-, methodologie- en datasetpagina's zijn canoniek in het Engels.",
    methodologyLabel: "Methodologie (Methodology)",
    signalReportLabel: "Gratis wekelijks signaalrapport (Free Weekly Signal Report)",
  },
  {
    code: "ar",
    display: "Arabic",
    nativeName: "العربية",
    region: "MENA",
    dir: "rtl",
    intro:
      "تُحدِّد VC Deal Flow Signal (GitDealFlow) الشركات الناشئة التي تمر بمرحلة تسارع هندسي من خلال تتبع سرعة الـ commits ونمو المساهمين وتوسع المستودعات في بيانات GitHub العامة. تُظهر أبحاثنا أن هذه الإشارات تظهر عادةً قبل إعلانات جولات التمويل بثلاثة إلى ستة أسابيع. المنهجية منشورة باللغة الإنجليزية على SSRN (DOI 10.2139/ssrn.6606558، رخصة CC BY 4.0)، ومجموعة البيانات متاحة للتنزيل مفتوحًا.",
    englishCanonicalNote:
      "هذه الصفحة ملخص. صفحات المنتج الكاملة والمنهجية ومجموعة البيانات مرجعها الرسمي باللغة الإنجليزية.",
    methodologyLabel: "المنهجية (Methodology)",
    signalReportLabel: "تقرير الإشارات الأسبوعي المجاني (Free Weekly Signal Report)",
  },
];

export function getLocaleByCode(code: string): Locale | undefined {
  return LOCALES.find((l) => l.code === code);
}

export function getAllLocaleCodes(): string[] {
  return LOCALES.map((l) => l.code);
}

/**
 * BCP 47 codes the entire i18n surface advertises. Used by:
 *   - lib/hreflang.ts to emit per-page hreflang map
 *   - sitemap-i18n.xml to annotate xhtml:link rel=alternate
 *   - RootIdentitySchema Organization.availableLanguage
 */
export const ALL_LANGUAGES_AVAILABLE = [
  "en",
  ...LOCALES.map((l) => l.code),
] as const;
