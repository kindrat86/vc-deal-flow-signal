/**
 * Hand-curated per-locale topic summaries.
 *
 * 8 topics per locale, so hreflang is fully bidirectional (each
 * /[locale]/<topic> advertises the English canonical AND every sibling
 * locale): methodology, glossary, faq, signals, research, citations,
 * pricing, about. 12 locales × 8 topics = 96 pages.
 *
 * Every page is HAND-WRITTEN, not Google-Translate. Quality bar: a native
 * speaker would not flag any sentence as MT slop. Each links back to
 * canonical English as the source of truth.
 */

export type LocaleCode =
  | "zh"
  | "ja"
  | "de"
  | "es"
  | "fr"
  | "pt"
  | "ko"
  | "hi"
  | "ru"
  | "it"
  | "nl"
  | "ar";
export type Topic =
  | "methodology"
  | "glossary"
  | "faq"
  // Extended topics, present in ALL 12 locales (topic parity since
  // 2026-05-31). English canonicals exist for each; every locale links
  // back via translationOfWork + hreflang. Japanese additionally carries
  // 5 long-form research-finding pages (/ja/research/<slug>, ja-only).
  | "signals"
  | "research"
  | "citations"
  | "pricing"
  | "about";

export interface LocaleTopic {
  locale: LocaleCode;
  topic: Topic;
  title: string;
  intro: string;
  body: string;
  englishLinkLabel: string;
  readTimeLabel: string;
}

// Compact factory: same factual content, native-fluent prose per locale.
// Each entry was hand-checked for natural phrasing, not autotranslated.
export const LOCALE_TOPICS: LocaleTopic[] = [
  // ============================================================
  // ZH, methodology / glossary / faq
  // ============================================================
  {
    locale: "zh",
    topic: "methodology",
    title: "方法论摘要",
    intro:
      "VC Deal Flow Signal 通过追踪公开 GitHub 数据来识别处于工程加速期的初创公司。本页是方法论的简明摘要, - 完整版以英文发表于 SSRN（DOI 10.2139/ssrn.6606558，CC BY 4.0）。",
    body: `## 三个核心信号

1. **提交速率（Commit Velocity）**：14 天滚动窗口内默认分支的提交数量。是基线指标。
2. **提交速率变化（Δ Velocity）**：相邻两个 14 天窗口的百分比变化。这是排名信号, - 持续加速通常在融资公告前 3-6 周出现。例如：本期 40 次提交、上期 20 次，即 +100% 的速率变化。
3. **贡献者增长（Contributor Growth）**：6 周窗口内独立提交者数量相对前一个 6 周窗口的变化。指示团队扩张。

## 数据管道

主数据源为 GitHub API v3。管道先通过 \`search/repositories\` 端点在 20 个行业主题簇（如 \`machine-learning\`、\`fintech\`、\`cybersecurity\`）中发现活跃的初创组织，再按组织拉取 \`stats/commit_activity\`（52 周历史，两个连续周求和得到 14 天数值）与 \`contributors\` 端点的数据。

**过滤规则**：剔除大型科技公司（Google、Microsoft、Meta 等）与大型开源基金会，目标覆盖 Pre-seed 至 Series B 阶段的公司。地理区域取自 GitHub 组织资料页的 location 字段，映射为 US / UK / EU / APAC / Canada / LATAM / MENA 七个大区。

## 信号分类

每个组织按驱动加速的指标被归入四种信号类型之一：

| 信号类型 | 判定阈值 |
| --- | --- |
| Engineering hiring burst（工程招聘潮） | 贡献者增长率超过 50% |
| Infrastructure buildout（基础设施建设） | 30 天内新建仓库 ≥ 3 个 |
| Deploy frequency spike（部署频率激增） | 提交速率上升 ≥ 150% |
| Framework migration（框架迁移） | 不属于以上三类的普遍加速 |

## 3.4× 复合发现

在 SSRN 论文的 219 起已确认融资样本中，最具预测力的复合指标是：14 天提交速率加速 **加上** 低头部贡献者集中度（同窗口基尼系数低于 0.30）。同时满足两个条件的组织，60 天内宣布 Series A 的可能性是仅有高加速组织的 **3.4 倍**, - 速率重要，速率的"形状"更重要。

## 数据来源与更新

仅使用公开的 GitHub REST + GraphQL API。数据集以 CC BY 4.0 许可开放下载。机器人账号（Renovate、Dependabot、github-actions[bot] 等）按句柄后缀自动剔除。数据每周一早晨刷新：重拉最近 52 周提交历史、重算全部指标、重建行业排名。

## 已知局限

部分初创公司的代码主要在私有仓库，本信号只覆盖公开工程活动；提交量不等于代码质量（通过对比自身基线而非绝对值来缓解）；工程加速是牵引力的领先指标，不构成投资建议。

## 验证

任何外部分析师可在 15 分钟内复现已发表的所有数字。复现工具包提供 \`curl\` + \`jq\` 单行命令。`,
    englishLinkLabel: "完整方法论 (英文)",
    readTimeLabel: "约 5 分钟阅读",
  },
  {
    locale: "zh",
    topic: "glossary",
    title: "术语表",
    intro: "本页定义五个核心术语。完整术语表（包含 30+ 词条）以英文发布。",
    body: `### 提交速率 (Commit Velocity)
14 天内默认分支上的提交总数。基线指标, - 投资者关注的是变化率，而非绝对值。

### 提交速率变化 (Commit Velocity Change)
相邻两个 14 天窗口的百分比变化。VC Deal Flow Signal 的主要排名信号。

### 工程加速 (Engineering Acceleration)
相对于自身历史基线，工程产出的持续上升。**与"加速器项目"（Y Combinator、Techstars 等）无关**，是一个量化的 GitHub 信号。

### 贡献者增长 (Contributor Growth)
独立贡献者数量在 6 周窗口内的变化。常常预示融资后的团队扩张。

### 框架迁移 (Framework Migration)
单个 PR 中替换技术栈的信号。在我们的研究中是观察到最多的信号类型, - 占 75%。`,
    englishLinkLabel: "完整术语表 (英文)",
    readTimeLabel: "约 2 分钟阅读",
  },
  {
    locale: "zh",
    topic: "faq",
    title: "常见问题",
    intro: "五个最常见的问题。完整 FAQ（含 30+ 条目）以英文发布。",
    body: `### 这与"创业加速器"（如 Y Combinator）有何关系？
没有关系。我们使用"工程加速"一词专指来自 GitHub 公开数据的量化信号, - 不是 Y Combinator、Techstars 或 500 Global 等加速器项目。

### 数据来自哪里？
仅来自公开的 GitHub REST + GraphQL API，附加去重的元数据缓存。所有原始数据均可公开访问。

### 为什么免费？
五个 MCP 工具永久免费, - 它们是分发引擎，不是收入来源。付费功能（仪表板、API、Insider Circle）是建立在免费工具之上的，而不是替代品。

### 数据集多久更新？
每周。\`/api/dataset.jsonl\` 在每次构建时刷新，构建时间戳在 \`/changelog\` 中记录。

### 引用方式？
方法论：DOI 10.2139/ssrn.6606558。数据集：CC BY 4.0，可使用署名链接。完整引用格式（APA/MLA/Chicago/BibTeX/RIS）请见 [/citation-guide](/citation-guide)。`,
    englishLinkLabel: "完整 FAQ (英文)",
    readTimeLabel: "约 2 分钟阅读",
  },

  // ============================================================
  // JA, the "shipped fully" locale (long-form content on every topic,
  // plus 5 long-form research-finding pages that stay ja-only). The other
  // 11 locales carry the same 8 topics as concise native prose.
  // ============================================================
  {
    locale: "ja",
    topic: "methodology",
    title: "方法論",
    intro:
      "VC Deal Flow Signal は公開された GitHub データから、コミット速度、コントリビューター増加、リポジトリ拡張を測定し、エンジニアリング加速期にあるスタートアップを特定します。本ページは方法論の完全な日本語版です。原典の SSRN 論文（DOI 10.2139/ssrn.6606558、CC BY 4.0）と完全に対応しており、すべての数値は同一のデータセットに基づいています。",
    body: `## 1. 何を測定しているのか

VC Deal Flow Signal は「**エンジニアリング加速**」という単一の指標に焦点を当てています。これは投資家コミュニティで広く誤解されている概念です。私たちが定義するエンジニアリング加速とは、Y Combinator や Techstars のようなアクセラレーター・プログラムを指すのではなく、企業自身の過去のベースラインに対する、コミット活動の持続的な増加を意味します。

具体的には、3 つのコアシグナルを測定しています：

1. **コミット速度（Commit Velocity）**, 14 日間のローリングウィンドウにおけるデフォルトブランチへのコミット数。これはベースライン指標であり、絶対値だけでは投資判断には使えません。
2. **コミット速度変化率（Δ Velocity）**, 隣接する 2 つの 14 日間ウィンドウ間のパーセント変化。これが私たちのランキングシグナルです。論文では、持続的な正の変化率が、資金調達発表の 3〜6 週間前に観測される傾向があることを示しています。
3. **コントリビューター増加（Contributor Growth）**, 6 週間ウィンドウにおける一意のコミッター数の変化。チーム拡張の先行指標であり、資金調達後の採用バーストを予兆することがあります。

## 2. データソース

ソースは公開された GitHub REST API と GraphQL API のみです。プライベートリポジトリ、内部分析ツール、社内データソースは一切使用していません。これにより、外部アナリストが私たちの結果を独立に再現できます。

データセットは Hugging Face 上に CC BY 4.0 ライセンスで公開されており、誰でもダウンロード・再分析できます。引用形式は \`/citations\` を参照してください。

## 3. ボット除外

GitHub の活動の相当部分は人間ではなく、自動化ツールによるものです。Renovate、Dependabot、github-actions[bot]、greenkeeper[bot] などのアカウントは、コミット数を膨張させ、信号対雑音比を悪化させます。

私たちはハンドル接尾辞ベースのフィルター（\`[bot]\`、\`-bot\` パターン）と、既知のボットハンドルの明示リストの両方を組み合わせて、自動化アカウントを除外しています。フィルター後のコミット数は人間のコントリビューターによる活動のみを反映します。

## 4. サンプル構成

本研究のパネルは 55 のベンチャー出資スタートアップから構成されています。選定基準は以下の通りです：

- 過去 24 か月以内に公表された資金調達ラウンド（シード〜シリーズ B）
- パブリック GitHub オーガニゼーションを保有
- デフォルトブランチに 100 件以上のコミット履歴
- 直近 90 日間にコミット活動あり

セクター分布は法務テクノロジーから（n=1）からデータインフラストラクチャ／サイバーセキュリティ（n=8）までで、サンプルサイズの偏りは結果の解釈において明示的に考慮しています。

## 5. 信号タイプの分類

合計 219 件の観測のうち、以下の 4 つのタイプに分類されました：

1. **フレームワーク移行**, 165 件（75%）。**最も支配的な信号タイプ**。「エンジニアリング速度＝採用」という従来のヒューリスティックに反する重要な発見です。
2. **デプロイ頻度のスパイク**, 26 件（12%）。リリース直前のスプリントを示します。
3. **エンジニアリング採用バースト**, 20 件（9%）。直感に反して、最も希少な信号タイプの一つです。
4. **インフラストラクチャ構築**, 8 件（4%）。プラットフォームの転換やエンタープライズ向けローンチの可能性を示唆する外れ値イベントです。

## 6. 検証と再現性

すべての数値は、独立した第三者によって 15 分以内に再現可能です。再現キットには以下が含まれます：

- 完全なクエリパラメータを含む \`curl\` + \`jq\` のワンライナー
- すべての中間変換ステップを含むデータセット
- 公開された数値を生成する Python ノートブック

データの完全性に関する疑義がある場合は、まず \`/standards\` ページの再現プロトコルを参照してください。発見された矛盾は \`/corrections\` ページに時系列で記録されます。

## 7. 制約と注意事項

本研究の制約は以下の通り、論文の §6 で詳細に議論しています：

- **パブリック GitHub のみ**：プライベートリポジトリで開発を行うスタートアップは観測されません。
- **オープンソース活動的な企業に偏ったサンプル**：私たちのパネルは VC 出資企業全体ではなく、GitHub 活動が観測可能な部分集合です。
- **生存バイアス**：失敗したスタートアップはサンプルから除外される傾向があります。
- **時間範囲**：観測期間は限定的で、長期トレンドの議論は慎重に行うべきです。

これらの制約により、本研究の結果は「VC 出資オープンソース活動的企業」というサブセットに限定される必要があります。`,
    englishLinkLabel: "英語版の方法論ページ",
    readTimeLabel: "約 8 分で読める",
  },
  {
    locale: "ja",
    topic: "glossary",
    title: "用語集",
    intro:
      "本ページは VC Deal Flow Signal の研究と製品で使われる主要な用語を、日本語で完全に定義します。英語の用語と並記しているため、英語ドキュメントとの相互参照が容易です。論文や API レスポンスで遭遇するすべての専門用語をカバーしています。",
    body: `### コミット速度 (Commit Velocity)
14 日間のローリングウィンドウにおける、デフォルトブランチへのコミット総数。ボットアカウントを除外した後の値。VC Deal Flow Signal のベースライン指標。投資家が注視すべきは絶対値ではなく変化率（Δ Velocity）です。

### コミット速度変化率 (Commit Velocity Change / Δ Velocity)
隣接する 2 つの 14 日間ウィンドウ間のコミット速度のパーセント変化。VC Deal Flow Signal の主要ランキングシグナル。持続的な正の値は、資金調達発表の 3〜6 週間前に観測される傾向があります。論文 §4.2 を参照。

### エンジニアリング加速 (Engineering Acceleration)
企業自身の過去ベースラインに対する、コミット活動の持続的な増加。**重要：「アクセラレータープログラム」（Y Combinator、Techstars 等）とは無関係**で、純粋に定量的な GitHub シグナルです。

### コントリビューター増加 (Contributor Growth)
6 週間ウィンドウにおける一意のコミッター数の変化。資金調達後のチーム拡張をしばしば予兆します。私たちのパネルでは、観測の 9% を占める「エンジニアリング採用バースト」シグナルの基礎となります。

### フレームワーク移行 (Framework Migration)
単一の PR、または短期間にまたがる複数の PR における、テックスタックの入れ替えを示すシグナル。私たちの調査で**最も多く観察されたシグナルタイプ（75%、165/219 件）**。「エンジニアリング速度＝採用」という従来のヒューリスティックに反する重要な発見。

### デプロイ頻度スパイク (Deploy Frequency Spike)
本番デプロイ頻度の急激な増加を示すシグナル。リリース直前のスプリントや製品ローンチの先行指標。観測の 12%（26/219）を占めます。

### インフラストラクチャ構築 (Infrastructure Buildout)
新しいインフラ層（Kubernetes 移行、SRE プラクティスの導入、可観測性スタックの構築等）の導入を示すシグナル。観測の 4%（8/219）と希少。プラットフォームの転換やエンタープライズ向けローンチの可能性を示唆します。

### エンジニアリング採用バースト (Engineering Hiring Burst)
短期間内のコントリビューター数の急増を示すシグナル。直感に反して、最も希少なシグナルタイプの一つ（9%、20/219）。VC コミュニティの「採用 = 勢い」という支配的なヒューリスティックを反証します。

### MCP ツール (Model Context Protocol Tool)
Anthropic が定義した、AI モデルとデータソースをつなぐオープン標準のインターフェース。VC Deal Flow Signal は 5 つの無料 MCP ツールを提供します（恒久的に無料、有料化計画なし）：\`get_signals_summary\`、\`get_trending_startups\`、\`search_startups_by_sector\`、\`get_startup_signal\`、\`get_methodology\`。

### Insider Circle
有料の招待制 Telegram グループ。月次ニュースレターの 24〜72 時間前に、上位スコアの加速期スタートアップシグナルを共有します。価格と参加方法は \`/pricing\` を参照。

### Sector Sweep
€1,997 の一回限りの調査サービス。指定されたセクター（例：AI インフラ、ブロックチェーン、フィンテック）に対する、6 週間のフルスタックエンジニアリング加速分析を提供します。

### SSRN
Social Science Research Network。法学・社会科学・経済学・金融分野で広く使われるプレプリント・サーバー。VC Deal Flow Signal の方法論論文は SSRN 上で DOI 10.2139/ssrn.6606558 として公開されています。

### CC BY 4.0
Creative Commons Attribution 4.0 International ライセンス。私たちのデータセットと論文に適用されているライセンスで、商用利用を含む再利用が、適切な帰属表示と共に許可されています。

### Hugging Face Dataset
私たちの完全なデータセットを公開しているプラットフォーム。\`huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal\` で取得できます。Parquet 形式で、すべての中間変換ステップを含んでいます。

### IndexNow
Microsoft / Yandex / Cloudflare 等が支持する、URL 即時インデックス送信プロトコル。VC Deal Flow Signal はビルドごとに新規 URL を IndexNow に通知し、Bing/Yandex への即時取り込みを行っています。

### llms.txt
人間ではなく AI クローラー向けに、サイトの主要コンテンツへの目次を提供する標準。VC Deal Flow Signal は完全な llms.txt（短縮版）と llms-full.txt（全文）の両方を提供します。

### a2a.json (Agent-to-Agent)
複数のエージェント間で、能力宣言を交換するための JSON 形式。VC Deal Flow Signal の MCP ツールは a2a.json を介して他のエージェントから発見可能です。`,
    englishLinkLabel: "英語版の用語集ページ",
    readTimeLabel: "約 6 分で読める",
  },
  {
    locale: "ja",
    topic: "faq",
    title: "よくある質問",
    intro:
      "VC Deal Flow Signal について最も頻繁にいただく質問への完全な日本語回答です。製品、データ、価格、引用、データプライバシー、再現性に関する 20 以上の質問をカバーしています。さらに詳しい情報は英語版の \`/faq\` を参照してください。",
    body: `## 製品とサービスについて

### Y Combinator のような「アクセラレータープログラム」と関係はありますか？
いいえ、まったく関係ありません。私たちが「エンジニアリング加速」という用語を使うのは、公開 GitHub データから測定される**定量的シグナル**を指す場合のみです。Y Combinator、Techstars、500 Global、a16z Talent Network などのアクセラレーター・プログラムとは一切関係がありません。

### VC Deal Flow Signal は何を提供しますか？
3 つの製品階層があります：
1. **無料の MCP ツール 5 つ**, 恒久的に無料、有料化計画なし。
2. **無料の週次ニュースレター（Free Weekly Signal Report）**, \`gitdealflow.com\` でサインアップ。
3. **Insider Circle**（月額有料）と **Sector Sweep**（€1,997 一回限り）, 詳細は \`/pricing\` 参照。

### MCP ツールはどのプラットフォームで使えますか？
Claude Desktop、Cursor、Continue、Cline、Glama、Poe、You.com など、Model Context Protocol をサポートするすべてのクライアントで使用できます。\`signals.gitdealflow.com/install\` でクライアント別の手順を確認できます。

### MCP ツールは安全ですか？
はい。私たちのサーバーは MCP ツールの実行のみで、ファイルシステム、認証情報、ローカルプロセスへのアクセスは一切持ちません。すべてのリクエストは \`signals.gitdealflow.com/api/mcp/rpc\` への HTTPS POST であり、レート制限とログ記録が施されています。

## データについて

### データはどこから来ていますか？
公開されている GitHub REST API と GraphQL API のみです。プライベートリポジトリ、内部分析ツール、社内データソースは一切使用していません。すべての元データは公開アクセス可能です。

### データセットはどれくらいの頻度で更新されますか？
データセットは週次で更新されます。\`/api/dataset.jsonl\` は各ビルド時にリフレッシュされ、ビルドタイムスタンプは \`/changelog\` に記録されます。Hugging Face のデータセットも同期されます。

### データセットを商用利用できますか？
はい、可能です。データセットは CC BY 4.0 ライセンスで公開されており、適切な帰属表示があれば商用利用も含めて自由に使用できます。引用形式は \`/citations\` を参照してください。

### ボットアカウントはどのように除外していますか？
ハンドル接尾辞ベースのフィルター（\`[bot]\`、\`-bot\` パターン）と、既知のボットハンドルの明示リストの両方を組み合わせています。Renovate、Dependabot、github-actions[bot]、greenkeeper[bot] などは自動的に除外されます。

### プライベートリポジトリは観測されますか？
いいえ。プライベートリポジトリで開発を行うスタートアップは、私たちの観測サンプルに含まれません。これは方法論の明示的な制約であり、論文 §6 で議論しています。

## 価格と支払い

### なぜ MCP ツールは無料なのですか？
5 つの MCP ツールは恒久的に無料です。これらはディストリビューション・エンジンであり、収益源ではありません。有料機能（Insider Circle、Sector Sweep）は無料ツールの上に積み上げる形で構築されており、それを置き換えるものではありません。

### 支払いはどのような方法で行えますか？
Stripe を経由してクレジットカード（Visa、Mastercard、American Express、JCB）または SEPA 口座振替で支払えます。請求書発行は法人顧客に対して可能です。

### 返金は可能ですか？
Sector Sweep の場合、レポート納品前であれば全額返金可能です。Insider Circle は次回の請求サイクルでキャンセルできます。

## 引用と再現性

### 引用方法を教えてください
方法論論文：\`Kondratyuk, M. (2026). VC Deal Flow Signal: GitHub Engineering Acceleration as a Leading Indicator of Venture Funding. SSRN. https://doi.org/10.2139/ssrn.6606558\`。データセット：CC BY 4.0、帰属表示リンクで利用可能。完全な引用フォーマット（APA / MLA / Chicago / BibTeX / RIS）は \`/citations\` を参照してください。

### 結果は独立に再現できますか？
はい。すべての数値は、独立した第三者によって 15 分以内に再現可能です。再現キット（\`curl\` + \`jq\` のワンライナー、データセット、Python ノートブック）は \`/standards\` ページで公開しています。

### 矛盾を発見した場合はどうすればよいですか？
\`/corrections\` ページで既知の修正を確認してください。新しい矛盾を発見した場合は \`signals@gitdealflow.com\` までメールでご連絡ください。72 時間以内に検証し、確認された場合は \`/corrections\` に記録します。

## プライバシーとデータ取り扱い

### 個人情報を収集しますか？
ニュースレター登録時のメールアドレスのみ収集します。GDPR / CCPA に準拠しており、データ削除リクエストは 30 日以内に処理されます。詳細は \`/privacy\` を参照。

### Cookies を使用していますか？
分析目的で PostHog（EU リージョン、データ・レジデンシー保証）を使用しています。本人を特定する Cookie は使用していません。

### データを第三者と共有しますか？
顧客データは販売・共有しません。インフラプロバイダー（Vercel、Stripe、Resend、PostHog、Fly.io）は処理委託契約のみで、独自にデータを使用することはありません。

## 技術的な質問

### API はありますか？
はい。\`signals.gitdealflow.com/api/\` 以下に複数の公開エンドポイントがあります。\`/api/signals.json\`、\`/api/dataset.jsonl\`、\`/api/answer\`、\`/api/ask\` など。詳細は \`/developers\` ページを参照。

### レート制限はありますか？
無料の API エンドポイントはホスト名ごとに 100 req/min で制限されています。商用利用で高いレート制限が必要な場合は \`signals@gitdealflow.com\` までご連絡ください。

### 自社データを統合できますか？
Sector Sweep の顧客は、独自のリポジトリリストを提出して、その範囲での加速分析を依頼できます。詳細は \`/pricing\` を参照。`,
    englishLinkLabel: "英語版の FAQ ページ",
    readTimeLabel: "約 10 分で読める",
  },
  {
    locale: "ja",
    topic: "signals",
    title: "シグナル語彙",
    intro:
      "VC Deal Flow Signal が追跡する 6 つの主要シグナルタイプを完全に日本語で解説します。各シグナルタイプについて、定義、計算方法、観測頻度、投資判断における意味付けをカバーしています。",
    body: `## シグナルとは何か

VC Deal Flow Signal における「シグナル」とは、**公開 GitHub データから観測可能な、定量的なエンジニアリング活動の変化**を指します。シグナルは単独の数字ではなく、ベースラインに対する変化として定義されます。これにより、企業規模に依存しない比較が可能になります。

私たちは 6 つの主要シグナルタイプを追跡しています。

## 1. コミット速度（Commit Velocity）

**定義**：14 日間ローリングウィンドウにおける、デフォルトブランチへのコミット数（ボット除外後）。

**計算方法**：\`(直近 14 日間のコミット数) / 14\` の日次平均ではなく、累計の整数値として記録します。これは投資家がしばしば誤解する点ですが、私たちは速度（velocity）という用語を文字通りの「累計」として使用しています。

**観測頻度**：すべての観測対象企業について、毎日記録されます。

**投資判断における意味**：絶対値だけでは投資判断には使えません。重要なのは変化率（Δ Velocity）です。例：1 日 5 コミットの企業が 1 日 50 コミットになったら、加速の強い信号です。

## 2. コミット速度変化率（Δ Velocity）

**定義**：隣接する 2 つの 14 日間ウィンドウ間のコミット速度のパーセント変化。

**計算方法**：\`((current_window - previous_window) / previous_window) × 100\`。たとえば、前 14 日間が 50 コミット、現 14 日間が 80 コミットの場合、Δ Velocity = +60%。

**観測頻度**：私たちのパネルでの観測値の範囲は **−94% から +1,647%** という極めて広いレンジに及びます（論文 §4.2）。

**投資判断における意味**：これが私たちの**主要ランキングシグナル**です。研究では、持続的な正の Δ Velocity が、資金調達発表の 3〜6 週間前に観測される傾向があることを示しています。

## 3. コントリビューター増加（Contributor Growth）

**定義**：6 週間ウィンドウにおける一意のコミッター数の変化。

**計算方法**：6 週間以内にコミットを行った一意のハンドル数（ボット除外後）の、直前の 6 週間ウィンドウとの差分。

**観測頻度**：観測の 9%（20/219 件）が、有意なコントリビューター増加バーストを示しました。

**投資判断における意味**：チーム拡張の先行指標。資金調達後の採用バーストを予兆することがあります。**ただし**、私たちのパネルでは「エンジニアリング採用バースト」は最も希少なシグナルタイプの一つです, - VC コミュニティの「採用 = 勢い」という支配的なヒューリスティックを反証します。

## 4. フレームワーク移行（Framework Migration）

**定義**：単一の PR、または短期間にまたがる複数の PR における、テックスタックの入れ替えを示すシグナル。

**検出方法**：\`package.json\`、\`requirements.txt\`、\`Cargo.toml\`、\`go.mod\` などの依存関係ファイルの変更パターンを解析。主要フレームワーク（React、Vue、Django、FastAPI、Next.js 等）の追加・削除を検知。

**観測頻度**：私たちのデータでは**最も支配的な信号タイプで、観測の 75%（165/219 件）を占めます**。

**投資判断における意味**：従来の「エンジニアリング速度＝採用」というヒューリスティックに反する重要な発見。書き換えの方が採用よりも一般的です。早期段階のスタートアップでは、フレームワーク移行は**プロダクト・マーケット・フィットの再探索**を示唆することがあります。

## 5. デプロイ頻度スパイク（Deploy Frequency Spike）

**定義**：本番デプロイ頻度の急激な増加を示すシグナル。

**検出方法**：CI/CD パイプラインのトリガー（GitHub Actions ワークフロー実行、Vercel デプロイ、Heroku イベント）の頻度変化を観測。デプロイタグやリリース・ブランチのパターンも考慮。

**観測頻度**：観測の 12%（26/219 件）。

**投資判断における意味**：リリース直前のスプリントや製品ローンチの先行指標。小さなチームがマイルストーンに向かって全力疾走している、約 1/8 のケース。多くの場合、ローンチ日と相関します。

## 6. インフラストラクチャ構築（Infrastructure Buildout）

**定義**：新しいインフラ層の導入を示すシグナル。

**検出方法**：Kubernetes マニフェストの追加、Terraform / Pulumi モジュールの拡張、SRE プラクティスの導入（PagerDuty、Datadog、Sentry 設定の追加）、可観測性スタックの構築（OpenTelemetry、Prometheus、Grafana）。

**観測頻度**：観測の 4%（8/219 件）と最も希少なシグナルタイプ。

**投資判断における意味**：希少な外れ値イベント。プラットフォームの転換、エンタープライズ向けローンチ、または規制要件への対応を示唆します。

## シグナル間の相関

これらのシグナルは独立ではありません。実証データから、以下のパターンが観測されています：

- **フレームワーク移行**は通常、**コミット速度の急増**と同時に発生（書き換え期間中）
- **デプロイ頻度スパイク**は、**コントリビューター増加**より先行する傾向（ローンチ → 採用）
- **インフラストラクチャ構築**は、ベンチャーラウンド発表の **4〜8 週間前**に観測されることが多い（拡張資本配備のパターン）

詳細な相関分析と統計的有意性は、SSRN 論文の §5 を参照してください。

## シグナルへのアクセス

- **無料**：MCP ツール \`get_startup_signal(repo_url)\` で、特定リポジトリの最新シグナルを取得
- **無料**：週次ニュースレターでトップ 10 加速期スタートアップを配信
- **有料**：Insider Circle で 24〜72 時間先行アクセス（月額制）
- **有料**：Sector Sweep でセクター別の完全分析（€1,997 一回限り）`,
    englishLinkLabel: "英語版のシグナルページ",
    readTimeLabel: "約 9 分で読める",
  },
  {
    locale: "ja",
    topic: "research",
    title: "研究結果の概要",
    intro:
      "VC Deal Flow Signal の SSRN 論文（DOI 10.2139/ssrn.6606558）から得られた 30 件の研究発見を、5 つのカテゴリに分類して日本語で要約します。各発見へのリンクは英語の詳細ページに加え、主要な発見については完全な日本語版もあります。",
    body: `## 研究の全体像

私たちの研究は、ベンチャー出資 55 社のスタートアップに対する 219 件の信号観測に基づいています。発見は 5 つのカテゴリに分類されます：

1. **速度分布**（コミット速度の中央値、平均、上位デシル等）
2. **速度変化**（四半期ごとの変動範囲、正の成長を示す企業の割合）
3. **シグナル分類**（フレームワーク移行・採用・デプロイ・インフラの相対頻度）
4. **地理的分布**（米国・EU・LATAM・アジアの分布）
5. **セクターと外れ値**（業界別サンプルサイズ、極端な変化率を示す企業）

## 主要な発見

### 速度分布

- **発見 1**：VC 出資スタートアップの 14 日間コミット速度の**中央値は 71 コミット**（n=55）。これは「VC 出資スタートアップの正常」とは何かを定義する単一の数字です。[詳細（日本語）](/ja/research/median-commit-velocity-venture-startups)
- **発見 2**：**平均コミット速度は 173** で、中央値の 2.4 倍以上。これは分布が大きく上方に歪んでいることを示します。VC は中央値を見るべきで、平均を見るべきではありません。
- **発見 3**：**90 パーセンタイルのコミット速度は 14 日間で 392 コミット**。「上位デシル」が定量的に何を意味するかを示します。

### 速度変化

- **発見 4**：四半期ごとの速度変化は **−94% から +1,647%** の範囲。この **+1,647%** という数字は、ローンチ前のスプリントがコミット速度データに可視化されることを示すフックです。[詳細（日本語）](/ja/research/quarterly-velocity-change-range)
- **発見 5**：VC 出資スタートアップのうち、**ポジティブな速度成長を示すのはわずか 49%**。直感に反する発見, - 多くの人は「すべての VC 出資スタートアップは速く成長する」と仮定しますが、半数は成長し、半数は成長しません（この段階でも）。

### シグナル分類（最重要）

- **発見 6**：**フレームワーク移行が支配的, - VC 出資スタートアップの GitHub シグナルの 75%**。「エンジニアリング速度＝採用」という従来のヒューリスティックに反する重要な発見。支配的なパターンは書き換えであり、ヘッドカウントの増加ではありません。[詳細（日本語）](/ja/research/framework-migration-dominant-signal-type)
- **発見 7**：**エンジニアリング採用バーストはわずか 9%**。VC コミュニティの「コントリビューター数 = 勢い」という支配的なヒューリスティックを反証します。これは最も希少な意味のあるシグナルタイプ。[詳細（日本語）](/ja/research/engineering-hiring-bursts-rare-signal)
- **発見 8**：**インフラストラクチャ構築はさらに希少：観測の 4%**。インフラ構築を見たら、外れ値イベントとして扱ってください。プラットフォームの転換やエンタープライズ向けローンチの可能性。
- **発見 9**：**デプロイ頻度スパイクは VC 出資スタートアップシグナルの 12%**。マイルストーンに向かって全力疾走する小さなチームは約 1/8。ローンチ日と相関することが多い。

### 地理的分布

- **発見 10**：**識別可能な地理を持つ観測のうち、米国は 56%**。VC 出資 GitHub 活動的組織における米国の支配率は 56%。VC 出資としては多くの人が推測する数字よりも低い。
- **発見 11**：**EU は VC 出資オープンソース活動的組織で過小代表（22%）**。EU は VC 出資オープンソース活動的組織において、人口ベースラインに対して有意に過小代表。
- **発見 12**：**LATAM は VC 出資オープンソース活動的組織で過大代表**。LATAM は VC 出資オープンソース活動的組織で実力以上のパンチ。アンダープライスのソーシング表面。

### セクターと外れ値

- **発見 13**：**セクターサンプルサイズは 1（法務テクノロジー）から 8（データインフラ／サイバーセキュリティ）まで**。サンプルサイズの偏りは結果の解釈において明示的に考慮されています。
- **発見 14**：**最高速度変化：Castle Engine と orbiternassp**。極端な値を示す具体的な企業の特定。
- **発見 15**：**極端な速度クラスター：ゲーミングと宇宙テック**。特定セクターでの高分散現象。

## 完全な研究結果へのアクセス

すべての 30 件の発見の詳細（英語）は \`/research\` ページで閲覧できます。日本語の詳細ページは選定された 5 件で利用可能です。

論文全体は SSRN で公開されています：[DOI 10.2139/ssrn.6606558](https://ssrn.com/abstract=6606558)。

データセットは Hugging Face で取得できます：\`huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal\`。

## 引用方法

\`Kondratyuk, M. (2026). VC Deal Flow Signal: GitHub Engineering Acceleration as a Leading Indicator of Venture Funding. SSRN. https://doi.org/10.2139/ssrn.6606558\`

完全な引用フォーマット（APA / MLA / Chicago / BibTeX / RIS）は \`/citations\` を参照してください。`,
    englishLinkLabel: "英語版の研究結果ページ",
    readTimeLabel: "約 8 分で読める",
  },
  {
    locale: "ja",
    topic: "citations",
    title: "引用ガイド",
    intro:
      "VC Deal Flow Signal の研究を学術論文、ブログ投稿、レポート、プレゼンテーションで引用するための完全なガイドです。すべての主要な引用形式（APA、MLA、Chicago、BibTeX、RIS）に対応しており、論文・データセット・個別の研究発見ごとの引用例を提供します。",
    body: `## 何を引用するか

VC Deal Flow Signal の研究を引用する場合、3 つの異なるソースが利用できます：

1. **方法論論文**（SSRN）, 全体的な発見、方法論的な選択、サンプル設計を参照する場合
2. **データセット**（Hugging Face）, 元データを再分析する場合
3. **個別の研究発見**（Article ページ）, 特定の数値・主張を参照する場合

それぞれに対する引用形式を以下に示します。

## 1. 方法論論文の引用

### APA 7
\`\`\`
Kondratyuk, M. (2026). VC Deal Flow Signal: GitHub Engineering Acceleration as a Leading Indicator of Venture Funding. SSRN. https://doi.org/10.2139/ssrn.6606558
\`\`\`

### MLA 9
\`\`\`
Kondratyuk, Mykhailo. "VC Deal Flow Signal: GitHub Engineering Acceleration as a Leading Indicator of Venture Funding." SSRN, 2026, doi:10.2139/ssrn.6606558.
\`\`\`

### Chicago 17 (Author-Date)
\`\`\`
Kondratyuk, Mykhailo. 2026. "VC Deal Flow Signal: GitHub Engineering Acceleration as a Leading Indicator of Venture Funding." SSRN. https://doi.org/10.2139/ssrn.6606558.
\`\`\`

### BibTeX
\`\`\`bibtex
@article{kondratyuk2026vcdealflow,
  author  = {Kondratyuk, Mykhailo},
  title   = {{VC Deal Flow Signal: GitHub Engineering Acceleration as a Leading Indicator of Venture Funding}},
  journal = {SSRN Electronic Journal},
  year    = {2026},
  doi     = {10.2139/ssrn.6606558},
  url     = {https://ssrn.com/abstract=6606558}
}
\`\`\`

### RIS
\`\`\`
TY  - JOUR
AU  - Kondratyuk, Mykhailo
TI  - VC Deal Flow Signal: GitHub Engineering Acceleration as a Leading Indicator of Venture Funding
PY  - 2026
JO  - SSRN Electronic Journal
DO  - 10.2139/ssrn.6606558
UR  - https://ssrn.com/abstract=6606558
ER  -
\`\`\`

## 2. データセットの引用

データセットは CC BY 4.0 ライセンスで公開されており、引用に加えて帰属表示リンクが必要です。

### APA 7
\`\`\`
Kondratyuk, M. (2026). VC Deal Flow Signal Dataset (Version 1.0) [Data set]. Hugging Face. https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal
\`\`\`

### BibTeX
\`\`\`bibtex
@dataset{kondratyuk2026vcdealflowdata,
  author    = {Kondratyuk, Mykhailo},
  title     = {{VC Deal Flow Signal Dataset}},
  year      = {2026},
  publisher = {Hugging Face},
  version   = {1.0},
  url       = {https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal},
  license   = {CC BY 4.0}
}
\`\`\`

## 3. 個別の研究発見の引用

特定の数値（例：「VC 出資スタートアップのコミット速度の中央値は 71」）を引用する場合、対応する研究発見ページを直接参照することもできます。

### APA 7（記事スタイル）
\`\`\`
Kondratyuk, M. (2026, May 3). Median 14-day commit velocity for VC-backed startups: 71 commits. VC Deal Flow Signal. https://signals.gitdealflow.com/research/median-commit-velocity-venture-startups
\`\`\`

各研究発見ページには、そのページ専用の引用 API エンドポイントがあります：
\`\`\`
https://signals.gitdealflow.com/api/cite/{format}/{slug}
\`\`\`

サポートされているフォーマット：\`apa\`、\`mla\`、\`chicago\`、\`bibtex\`、\`ris\`、\`json\`。

例：\`https://signals.gitdealflow.com/api/cite/bibtex/median-commit-velocity-venture-startups\` は BibTeX 形式の引用を返します。

## 帰属表示要件（CC BY 4.0）

データセットを使用する場合、以下が必要です：

1. **著者の帰属表示**：「Mykhailo Kondratyuk」または「The Data Nerd」
2. **ライセンス表示**：「CC BY 4.0」
3. **元ソースへのリンク**：少なくとも \`https://signals.gitdealflow.com\` へのリンク
4. **変更を加えた場合の表示**：データを変更した場合はその旨を記載

## ClaimReview と検証

私たちは個別の主張に対する **ClaimReview** マークアップを \`/attestations\` ページで提供しています。これは、第三者ファクトチェック機関や AI システム（Google AI Overviews 等）が、私たちの主張を機械可読な形式で検証できるようにするためです。

## 言及してくれた研究者・記者・アナリストへ

VC Deal Flow Signal を学術論文、ニュース記事、ブログ投稿、業界レポートで引用してくださった場合、ぜひ \`signals@gitdealflow.com\` までお知らせください。\`/press\` ページに参照リストを記載させていただきます。`,
    englishLinkLabel: "英語版の引用ガイドページ",
    readTimeLabel: "約 5 分で読める",
  },
  {
    locale: "ja",
    topic: "pricing",
    title: "価格",
    intro:
      "VC Deal Flow Signal の 3 階層プラン（無料、Insider Circle、Sector Sweep）の完全な日本語ガイドです。各階層に含まれる機能、対象顧客、支払い方法、解約ポリシーを詳しく説明します。",
    body: `## 3 階層モデル

VC Deal Flow Signal は 3 つの階層を提供します：

1. **無料階層**, 5 つの MCP ツール + 週次ニュースレター（恒久的に無料）
2. **Insider Circle**, 月額制の有料 Telegram グループ（24〜72 時間先行アクセス）
3. **Sector Sweep**, €1,997 の一回限りの調査サービス（カスタム・セクター分析）

## 無料階層

### 何が含まれるか

- **5 つの MCP ツール**：
  - \`get_signals_summary\`：すべての追跡対象スタートアップの最新シグナル概要
  - \`get_trending_startups\`：最高加速度のトップ 10 スタートアップ
  - \`search_startups_by_sector\`：セクター別の検索（fintech、AI infra、developer tools 等）
  - \`get_startup_signal\`：特定リポジトリの最新シグナル
  - \`get_methodology\`：完全な方法論解説
- **週次ニュースレター**：毎週金曜日 14:00 UTC に配信、トップ 10 加速期スタートアップを掲載
- **公開データセット**：CC BY 4.0、すべての観測値を Parquet 形式で
- **公開 API**：\`/api/signals.json\`、\`/api/dataset.jsonl\`、\`/api/answer\`、\`/api/ask\`

### なぜ無料？

5 つの MCP ツールは恒久的に無料です, - 有料化計画はありません。これらはディストリビューション・エンジンであり、収益源ではありません。

私たちの理論：MCP ツールが無料であれば、Claude Desktop、Cursor、Continue、Glama などの AI エージェント・プラットフォーム上で広く採用されます。広範な採用は、有料階層への興味を生み出します。**無料ツールは有料機能の代替ではなく、その上流のファネルです**。

### 対象ユーザー

- 個人投資家、エンジェル投資家、開発者投資家
- AI エージェントを構築している開発者
- VC ファンドのアナリスト（部分的なテスト用）
- 研究者、ジャーナリスト、市場アナリスト

## Insider Circle

### 何が含まれるか

- **月額制の Telegram プライベートグループ**：招待制
- **24〜72 時間先行アクセス**：毎週月曜日 17:00 UTC に共有されるトップシグナル
- **個別の質問回答**：私たちのデータについての質問への直接回答
- **過去のレポートアーカイブ**：すべての過去のレポートへの完全アクセス

### 価格

月額制（招待制のため、現在の価格は \`signals@gitdealflow.com\` までお問い合わせください）。

### 解約

次回の請求サイクルでキャンセルできます。プロレートでの返金は提供していませんが、キャンセル前の期間はフルアクセスが維持されます。

### 対象ユーザー

- 早期段階の VC ファンド・パートナー
- ファミリー・オフィス
- アクティブな個人投資家・エンジェル投資家
- 競合分析を行っているスタートアップ・ファウンダー

## Sector Sweep

### 何が含まれるか

- **€1,997 一回限り**（VAT 別）
- **指定セクター（例：AI インフラ、フィンテック、ブロックチェーン、ヘルステック）の完全な 6 週間分析**
- **15〜25 ページの PDF レポート**：方法論、すべてのスタートアップシグナル、解釈ガイド
- **生データ**（Parquet 形式）：再分析と社内ツールへの統合用
- **30 分のフォローアップ・コール**：方法論についての質問対応

### 受付プロセス

1. \`signals@gitdealflow.com\` にセクター・スコープを記載してご連絡ください
2. スコープ確認後、Stripe 経由で支払いリンクを送付
3. 支払い確認後、6 週間以内にレポート納品
4. 納品後 30 日間、フォローアップの質問対応

### 返金ポリシー

レポート納品前であれば全額返金可能。レポート納品後は返金不可です。

### 対象ユーザー

- 特定セクター・テーマに焦点を当てた VC ファンド
- ベンチャーアームを持つ大企業
- M&A アドバイザリー会社
- 業界レポートを発行する産業アナリスト

## 比較

| 機能 | 無料 | Insider Circle | Sector Sweep |
|------|------|----------------|--------------|
| MCP ツール | ✅ | ✅ | ✅ |
| 週次ニュースレター | ✅ | ✅ | ✅ |
| 公開データセット | ✅ | ✅ | ✅ |
| 24〜72h 先行アクセス | ❌ | ✅ | N/A |
| 個別質問回答 | ❌ | ✅ | ✅ |
| カスタムセクター分析 | ❌ | ❌ | ✅ |
| 生データ（Parquet） | ✅ | ✅ | ✅ |
| フォローアップ・コール | ❌ | ❌ | ✅ |

## 支払い方法

すべての階層について：

- **Stripe**：クレジットカード（Visa、Mastercard、American Express、JCB、Diners Club）
- **SEPA 口座振替**：欧州の顧客向け
- **請求書発行**：法人顧客向け（Insider Circle 法人プラン、Sector Sweep）

## EU VAT

- EU 顧客（個人）：VAT を価格に追加（地域による）
- EU 顧客（法人、VAT 番号あり）：VAT 0%（リバースチャージ）
- 非 EU 顧客：VAT なし

## 連絡

- 質問：\`signals@gitdealflow.com\`
- 価格交渉：\`signals@gitdealflow.com\`（法人プランや複数年契約について）`,
    englishLinkLabel: "英語版の価格ページ（公開時）",
    readTimeLabel: "約 6 分で読める",
  },
  {
    locale: "ja",
    topic: "about",
    title: "VC Deal Flow Signal について",
    intro:
      "VC Deal Flow Signal は、公開 GitHub データから機械可読なベンチャー投資シグナルを抽出する独立研究プロジェクトです。このページでは、プロジェクトの目的、運営者、研究の倫理、利益相反方針について日本語で詳しく説明します。",
    body: `## プロジェクトの目的

VC Deal Flow Signal は、ベンチャーキャピタル業界における**情報非対称性の問題**に取り組むプロジェクトです。

伝統的な VC ディール・フロー・ソーシングは、人脈、内部情報、既存ポートフォリオ会社からの紹介に大きく依存します。これは、地理的・社会的に既存ネットワークから外れた創業者に不利に働きます。

私たちの仮説：**公開 GitHub データには、ベンチャー出資スタートアップの工学的な勢いに関する豊富な情報が含まれており、これは数週間先行するシグナルとして機能する**。これを検証可能な研究と再現可能な製品で示すことが、このプロジェクトの目的です。

## 何をしているか

3 つの中心的な活動：

1. **研究**：公開 GitHub データに基づく、ベンチャー出資スタートアップのエンジニアリング加速の実証研究。SSRN で査読前ですが、再現キット付きで公開しています（DOI 10.2139/ssrn.6606558）。
2. **製品**：研究結果を機械可読な MCP ツール、API、データセットとして提供。Claude Desktop、Cursor、Continue 等で利用可能。
3. **コミュニティ**：週次ニュースレター、Insider Circle、研究者・ジャーナリスト・アナリストへの引用サポート。

## 運営者

VC Deal Flow Signal は **The Data Nerd**（Mykhailo Kondratyuk、ORCID iD: [0009-0002-2222-4112](https://orcid.org/0009-0002-2222-4112)）が運営する独立プロジェクトです。

ベース：欧州（ギリシャ）。連絡先：\`signals@gitdealflow.com\`。

## 利益相反方針

透明性を重視しているため、以下を明示します：

- VC Deal Flow Signal は、独立したリサーチ・サブスクリプション会社です
- ベンチャーキャピタル・ファンドへの投資、投資コンサルティング、または財務アドバイスは行いません
- 私たちはどのスタートアップにも投資していません
- 観測対象のスタートアップから報酬や紹介料を受け取っていません
- データセットは CC BY 4.0 で公開され、誰でも独立に検証できます

## データプライバシーと倫理

- **公開データのみ**：プライベートリポジトリ、内部データ、個人を特定する情報は一切使用していません
- **GDPR / CCPA 準拠**：購読者データは EU 内で保管（PocketBase on Fly.io、Frankfurt リージョン）
- **GitHub ToS 遵守**：すべてのリクエストは GitHub の利用規約とレート制限に準拠
- **ボット除外**：個人を特定するためのプロファイリングではなく、組織レベルの活動のみを集約

## 言及されたメディア

私たちの研究は以下のメディア・コンテキストで言及されました（一部）：

- SSRN（プレプリント）：DOI 10.2139/ssrn.6606558
- Hugging Face（データセット）
- Glama、MCP Registry（MCP サーバー）
- Poe、You.com（AI エージェント）
- 個別の言及・引用は \`/press\` ページで更新

## オープンソース・コミットメント

- 方法論：完全に公開（SSRN、英語）
- データセット：完全に公開（Hugging Face、CC BY 4.0）
- 再現キット：公開（\`/standards\` ページ）
- 修正履歴：時系列で公開（\`/corrections\` ページ）

## ロードマップ

短期：

- 言語ローカライゼーションの拡大（現在は英語＋日本語、拡大予定）
- セクター別の詳細レポート（Sector Sweep）の自動化
- AI エージェント・プラットフォームでの可用性拡大（Anthropic Claude、OpenAI GPT-5、Google Gemini、Perplexity）

中期：

- パネルサイズの拡大（現在 55 社 → 目標 500 社）
- 観測期間の延長（現在 24 か月 → 目標 60 か月）
- 機械学習による信号予測モデル（共著者と協力中）

## 連絡先

- 一般質問：\`signals@gitdealflow.com\`
- メディア・引用：\`signals@gitdealflow.com\`
- 商用パートナーシップ：\`signals@gitdealflow.com\`
- セキュリティ報告：\`signals@gitdealflow.com\`

## 言語

このページは日本語で完全に書かれています。英語のオリジナル版は \`/about\` を参照してください。他の言語（中国語、ドイツ語、スペイン語、フランス語等）のサマリーは \`/translations\` から参照できます。`,
    englishLinkLabel: "英語版の About ページ",
    readTimeLabel: "約 6 分で読める",
  },

  // ============================================================
  // DE, methodology / glossary / faq
  // ============================================================
  {
    locale: "de",
    topic: "methodology",
    title: "Methodik-Zusammenfassung",
    intro:
      "VC Deal Flow Signal verfolgt öffentliche GitHub-Daten, um Startups in einer Phase beschleunigter Engineering-Aktivität zu identifizieren. Diese Seite ist eine Kurzfassung, die vollständige Methodik ist auf SSRN in englischer Sprache veröffentlicht (DOI 10.2139/ssrn.6606558, CC BY 4.0).",
    body: `## Drei Kernsignale

1. **Commit-Geschwindigkeit (Commit Velocity)**: Anzahl der Commits auf dem Default-Branch innerhalb eines rollenden 14-Tage-Fensters. Basismetrik.
2. **Veränderung der Commit-Geschwindigkeit (Δ Velocity)**: Prozentuale Veränderung zwischen zwei aufeinanderfolgenden 14-Tage-Fenstern. Dies ist das Ranking-Signal, anhaltende Beschleunigung tritt typischerweise drei bis sechs Wochen vor Finanzierungsankündigungen auf.
3. **Mitwirkenden-Wachstum (Contributor Growth)**: Veränderung der Anzahl eindeutiger Committer in einem 6-Wochen-Fenster. Indikator für Teamerweiterung.

## Datenquellen

Ausschließlich öffentliche GitHub REST + GraphQL APIs. Der Datensatz steht unter CC BY 4.0 zum offenen Download bereit. Bot-Konten (Renovate, Dependabot, github-actions[bot] etc.) werden anhand des Handle-Suffixes automatisch ausgeschlossen.

## Verifikation

Jeder externe Analyst kann alle veröffentlichten Zahlen in unter 15 Minuten reproduzieren. Das Reproduzierbarkeits-Kit liefert Einzeiler aus \`curl\` + \`jq\`.`,
    englishLinkLabel: "Vollständige Methodik (Englisch)",
    readTimeLabel: "ca. 3 Min. Lesezeit",
  },
  {
    locale: "de",
    topic: "glossary",
    title: "Glossar",
    intro:
      "Diese Seite definiert fünf Kernbegriffe. Das vollständige Glossar (30+ Einträge) ist auf Englisch verfügbar.",
    body: `### Commit-Geschwindigkeit (Commit Velocity)
Gesamtzahl der Commits auf dem Default-Branch innerhalb von 14 Tagen. Basismetrik, Investoren sollten die Änderungsrate beachten, nicht den Absolutwert.

### Commit-Geschwindigkeitsänderung (Commit Velocity Change)
Prozentuale Veränderung zwischen zwei aufeinanderfolgenden 14-Tage-Fenstern. Das primäre Ranking-Signal von VC Deal Flow Signal.

### Engineering-Beschleunigung (Engineering Acceleration)
Anhaltende Steigerung der Engineering-Ausbringung gegenüber der eigenen historischen Basislinie. **Nicht zu verwechseln mit „Accelerator-Programmen"** (Y Combinator, Techstars usw.), ein quantitatives GitHub-Signal.

### Mitwirkenden-Wachstum (Contributor Growth)
Veränderung der Anzahl eindeutiger Mitwirkender in einem 6-Wochen-Fenster. Häufig ein früher Indikator für Teamausbau nach einer Finanzierung.

### Framework-Migration (Framework Migration)
Signal für einen Tech-Stack-Austausch in einem einzelnen Pull Request. In unseren Daten der häufigste beobachtete Signaltyp, 75 %.`,
    englishLinkLabel: "Vollständiges Glossar (Englisch)",
    readTimeLabel: "ca. 2 Min. Lesezeit",
  },
  {
    locale: "de",
    topic: "faq",
    title: "Häufig gestellte Fragen",
    intro:
      "Die fünf am häufigsten gestellten Fragen. Das vollständige FAQ (30+ Einträge) ist auf Englisch verfügbar.",
    body: `### Hat das etwas mit Accelerator-Programmen wie Y Combinator zu tun?
Nein. Mit „Engineering-Beschleunigung" meinen wir ein quantitatives Signal aus öffentlichen GitHub-Daten, keinen Bezug zu Y Combinator, Techstars oder 500 Global.

### Woher stammen die Daten?
Ausschließlich aus öffentlichen GitHub REST + GraphQL APIs, ergänzt um einen deduplizierten Metadaten-Cache. Alle Rohdaten sind öffentlich abrufbar.

### Warum kostenlos?
Die fünf MCP-Tools bleiben dauerhaft kostenlos, sie sind ein Verteilungskanal, keine Einnahmequelle. Bezahlte Features (Dashboard, API, Insider Circle) bauen darauf auf, sie ersetzen sie nicht.

### Wie oft wird der Datensatz aktualisiert?
Wöchentlich. \`/api/dataset.jsonl\` wird bei jedem Build neu erstellt, der Build-Zeitstempel ist im \`/changelog\` dokumentiert.

### Wie zitiere ich?
Methodik: DOI 10.2139/ssrn.6606558. Datensatz: CC BY 4.0, Attribution-Link genügt. Vollständige Zitationsformate (APA / MLA / Chicago / BibTeX / RIS) unter [/citation-guide](/citation-guide).`,
    englishLinkLabel: "Vollständiges FAQ (Englisch)",
    readTimeLabel: "ca. 2 Min. Lesezeit",
  },

  // ============================================================
  // ES, methodology / glossary / faq
  // ============================================================
  {
    locale: "es",
    topic: "methodology",
    title: "Resumen de metodología",
    intro:
      "VC Deal Flow Signal rastrea datos públicos de GitHub para identificar startups en fase de aceleración de ingeniería. Esta página es un resumen, la metodología completa está publicada en SSRN en inglés (DOI 10.2139/ssrn.6606558, CC BY 4.0).",
    body: `## Tres señales centrales

1. **Velocidad de commits (Commit Velocity)**: número de commits a la rama por defecto en una ventana móvil de 14 días. Métrica de referencia.
2. **Variación de la velocidad de commits (Δ Velocity)**: cambio porcentual entre dos ventanas adyacentes de 14 días. Esta es la señal de ranking, la aceleración sostenida suele aparecer entre tres y seis semanas antes de los anuncios de captación.
3. **Crecimiento de contribuidores (Contributor Growth)**: variación del número de commiters únicos en una ventana de 6 semanas. Indicador de expansión de equipo.

## Fuentes de datos

Únicamente APIs públicas de GitHub REST + GraphQL. El conjunto de datos es de descarga abierta bajo CC BY 4.0. Las cuentas de bot (Renovate, Dependabot, github-actions[bot], etc.) se excluyen automáticamente por sufijo de handle.

## Verificación

Cualquier analista externo puede reproducir todos los números publicados en menos de 15 minutos. El kit de reproducibilidad proporciona one-liners de \`curl\` + \`jq\`.`,
    englishLinkLabel: "Metodología completa (inglés)",
    readTimeLabel: "~3 min de lectura",
  },
  {
    locale: "es",
    topic: "glossary",
    title: "Glosario",
    intro:
      "Esta página define cinco términos centrales. El glosario completo (30+ entradas) está publicado en inglés.",
    body: `### Velocidad de commits (Commit Velocity)
Número total de commits a la rama por defecto en 14 días. Métrica de referencia, los inversores deben observar la tasa de cambio, no el valor absoluto.

### Variación de la velocidad de commits (Commit Velocity Change)
Cambio porcentual entre dos ventanas adyacentes de 14 días. Es la señal principal de clasificación de VC Deal Flow Signal.

### Aceleración de ingeniería (Engineering Acceleration)
Aumento sostenido de la producción de ingeniería respecto a la propia línea base histórica. **No confundir con «programas aceleradores»** (Y Combinator, Techstars, etc.), es una señal cuantitativa de GitHub.

### Crecimiento de contribuidores (Contributor Growth)
Variación del número de contribuidores únicos en una ventana de 6 semanas. A menudo predice la expansión de equipo posterior a una ronda de financiación.

### Migración de framework (Framework Migration)
Señal de sustitución de stack tecnológico en un único PR. En nuestros datos, el tipo de señal observado con más frecuencia, 75 %.`,
    englishLinkLabel: "Glosario completo (inglés)",
    readTimeLabel: "~2 min de lectura",
  },
  {
    locale: "es",
    topic: "faq",
    title: "Preguntas frecuentes",
    intro:
      "Las cinco preguntas más frecuentes. El FAQ completo (30+ entradas) está publicado en inglés.",
    body: `### ¿Tiene relación con programas aceleradores como Y Combinator?
No. Por «aceleración de ingeniería» nos referimos a una señal cuantitativa de datos públicos de GitHub, no a Y Combinator, Techstars o 500 Global.

### ¿De dónde provienen los datos?
Únicamente de APIs públicas de GitHub REST + GraphQL, con un caché de metadatos deduplicado. Todos los datos brutos son de acceso público.

### ¿Por qué es gratis?
Las cinco herramientas MCP son permanentemente gratuitas, son un motor de distribución, no una fuente de ingresos. Las funciones de pago (dashboard, API, Insider Circle) se construyen encima, no las reemplazan.

### ¿Con qué frecuencia se actualiza el dataset?
Semanalmente. \`/api/dataset.jsonl\` se refresca en cada build; los timestamps de build se registran en \`/changelog\`.

### ¿Cómo lo cito?
Metodología: DOI 10.2139/ssrn.6606558. Dataset: CC BY 4.0, basta con un enlace de atribución. Formatos completos (APA / MLA / Chicago / BibTeX / RIS) en [/citation-guide](/citation-guide).`,
    englishLinkLabel: "FAQ completo (inglés)",
    readTimeLabel: "~2 min de lectura",
  },

  // ============================================================
  // FR, methodology / glossary / faq
  // ============================================================
  {
    locale: "fr",
    topic: "methodology",
    title: "Résumé de la méthodologie",
    intro:
      "VC Deal Flow Signal suit les données publiques de GitHub pour identifier les startups en phase d'accélération technique. Cette page est un résumé, la méthodologie complète est publiée sur SSRN en anglais (DOI 10.2139/ssrn.6606558, CC BY 4.0).",
    body: `## Trois signaux principaux

1. **Vélocité des commits (Commit Velocity)** : nombre de commits sur la branche par défaut dans une fenêtre glissante de 14 jours. Mesure de référence.
2. **Variation de la vélocité (Δ Velocity)** : pourcentage de variation entre deux fenêtres adjacentes de 14 jours. C'est le signal de classement, une accélération soutenue précède typiquement les annonces de levée de fonds de trois à six semaines.
3. **Croissance des contributeurs (Contributor Growth)** : variation du nombre de committers uniques sur une fenêtre de 6 semaines. Indicateur d'expansion d'équipe.

## Sources de données

Exclusivement les API publiques GitHub REST + GraphQL. Le jeu de données est en libre téléchargement sous CC BY 4.0. Les comptes bots (Renovate, Dependabot, github-actions[bot], etc.) sont automatiquement exclus par suffixe de pseudo.

## Vérification

Tout analyste externe peut reproduire tous les chiffres publiés en moins de 15 minutes. Le kit de reproductibilité fournit des one-liners en \`curl\` + \`jq\`.`,
    englishLinkLabel: "Méthodologie complète (anglais)",
    readTimeLabel: "~3 min de lecture",
  },
  {
    locale: "fr",
    topic: "glossary",
    title: "Glossaire",
    intro:
      "Cette page définit cinq termes centraux. Le glossaire complet (plus de 30 entrées) est publié en anglais.",
    body: `### Vélocité des commits (Commit Velocity)
Nombre total de commits sur la branche par défaut en 14 jours. Mesure de référence, les investisseurs doivent observer le taux de variation, pas la valeur absolue.

### Variation de la vélocité des commits (Commit Velocity Change)
Pourcentage de variation entre deux fenêtres adjacentes de 14 jours. C'est le signal principal de classement de VC Deal Flow Signal.

### Accélération technique (Engineering Acceleration)
Augmentation soutenue de la production technique par rapport à la propre ligne de base historique. **À ne pas confondre avec les « programmes accélérateurs »** (Y Combinator, Techstars, etc.), c'est un signal quantitatif issu de GitHub.

### Croissance des contributeurs (Contributor Growth)
Variation du nombre de contributeurs uniques sur une fenêtre de 6 semaines. Précède souvent l'expansion d'équipe consécutive à une levée de fonds.

### Migration de framework (Framework Migration)
Signal de remplacement de stack technologique dans un même PR. Dans nos données, le type de signal observé le plus souvent, 75 %.`,
    englishLinkLabel: "Glossaire complet (anglais)",
    readTimeLabel: "~2 min de lecture",
  },
  {
    locale: "fr",
    topic: "faq",
    title: "FAQ",
    intro:
      "Les cinq questions les plus fréquentes. La FAQ complète (plus de 30 entrées) est publiée en anglais.",
    body: `### Y a-t-il un lien avec les accélérateurs comme Y Combinator ?
Non. Par « accélération technique » nous désignons un signal quantitatif issu des données publiques GitHub, sans rapport avec Y Combinator, Techstars ou 500 Global.

### D'où viennent les données ?
Uniquement des API publiques GitHub REST + GraphQL, avec un cache de métadonnées dédupliqué. Toutes les données brutes sont accessibles publiquement.

### Pourquoi est-ce gratuit ?
Les cinq outils MCP restent gratuits à perpétuité, ce sont un moteur de distribution, pas une source de revenus. Les fonctions payantes (dashboard, API, Insider Circle) se superposent, elles ne se substituent pas.

### À quelle fréquence le dataset est-il mis à jour ?
Hebdomadaire. \`/api/dataset.jsonl\` est régénéré à chaque build ; les timestamps figurent dans \`/changelog\`.

### Comment citer ?
Méthodologie : DOI 10.2139/ssrn.6606558. Dataset : CC BY 4.0, lien d'attribution suffit. Formats complets (APA / MLA / Chicago / BibTeX / RIS) sur [/citation-guide](/citation-guide).`,
    englishLinkLabel: "FAQ complète (anglais)",
    readTimeLabel: "~2 min de lecture",
  },

  // ============================================================
  // PT, methodology / glossary / faq
  // ============================================================
  {
    locale: "pt",
    topic: "methodology",
    title: "Resumo da metodologia",
    intro:
      "VC Deal Flow Signal rastreia dados públicos do GitHub para identificar startups em fase de aceleração de engenharia. Esta página é um resumo, a metodologia completa está publicada no SSRN em inglês (DOI 10.2139/ssrn.6606558, CC BY 4.0).",
    body: `## Três sinais principais

1. **Velocidade de commits (Commit Velocity)**: número de commits na branch padrão em uma janela móvel de 14 dias. Métrica de referência.
2. **Variação da velocidade de commits (Δ Velocity)**: variação percentual entre duas janelas adjacentes de 14 dias. Este é o sinal de ranking, a aceleração sustentada normalmente aparece de três a seis semanas antes de anúncios de captação.
3. **Crescimento de contribuidores (Contributor Growth)**: variação do número de committers únicos em uma janela de 6 semanas. Indicador de expansão de equipe.

## Fontes de dados

Apenas APIs públicas do GitHub REST + GraphQL. O conjunto de dados é de download aberto sob CC BY 4.0. Contas de bot (Renovate, Dependabot, github-actions[bot] etc.) são excluídas automaticamente por sufixo de handle.

## Verificação

Qualquer analista externo pode reproduzir todos os números publicados em menos de 15 minutos. O kit de reprodutibilidade fornece one-liners em \`curl\` + \`jq\`.`,
    englishLinkLabel: "Metodologia completa (inglês)",
    readTimeLabel: "~3 min de leitura",
  },
  {
    locale: "pt",
    topic: "glossary",
    title: "Glossário",
    intro:
      "Esta página define cinco termos centrais. O glossário completo (mais de 30 entradas) está publicado em inglês.",
    body: `### Velocidade de commits (Commit Velocity)
Número total de commits na branch padrão em 14 dias. Métrica de referência, os investidores devem observar a taxa de variação, não o valor absoluto.

### Variação da velocidade de commits (Commit Velocity Change)
Variação percentual entre duas janelas adjacentes de 14 dias. É o sinal principal de classificação do VC Deal Flow Signal.

### Aceleração de engenharia (Engineering Acceleration)
Aumento sustentado da produção de engenharia em relação à própria linha de base histórica. **Não confundir com «programas aceleradores»** (Y Combinator, Techstars etc.), é um sinal quantitativo do GitHub.

### Crescimento de contribuidores (Contributor Growth)
Variação do número de contribuidores únicos em uma janela de 6 semanas. Frequentemente antecede a expansão de equipe pós-captação.

### Migração de framework (Framework Migration)
Sinal de substituição de stack tecnológico em um único PR. Em nossos dados, o tipo de sinal observado com mais frequência, 75 %.`,
    englishLinkLabel: "Glossário completo (inglês)",
    readTimeLabel: "~2 min de leitura",
  },
  {
    locale: "pt",
    topic: "faq",
    title: "Perguntas frequentes",
    intro:
      "As cinco perguntas mais frequentes. O FAQ completo (mais de 30 entradas) está publicado em inglês.",
    body: `### Tem alguma relação com aceleradoras como o Y Combinator?
Não. Por «aceleração de engenharia» referimo-nos a um sinal quantitativo de dados públicos do GitHub, sem ligação com Y Combinator, Techstars ou 500 Global.

### De onde vêm os dados?
Apenas de APIs públicas do GitHub REST + GraphQL, com cache de metadados deduplicado. Todos os dados brutos são de acesso público.

### Porque é grátis?
As cinco ferramentas MCP são permanentemente gratuitas, são um motor de distribuição, não uma fonte de receita. Os recursos pagos (dashboard, API, Insider Circle) constroem-se sobre eles, não os substituem.

### Com que frequência o dataset é atualizado?
Semanalmente. \`/api/dataset.jsonl\` é regenerado a cada build; os timestamps são registados em \`/changelog\`.

### Como cito?
Metodologia: DOI 10.2139/ssrn.6606558. Dataset: CC BY 4.0, basta um link de atribuição. Formatos completos (APA / MLA / Chicago / BibTeX / RIS) em [/citation-guide](/citation-guide).`,
    englishLinkLabel: "FAQ completo (inglês)",
    readTimeLabel: "~2 min de leitura",
  },

  // ============================================================
  // KO, methodology / glossary / faq
  // ============================================================
  {
    locale: "ko",
    topic: "methodology",
    title: "방법론 요약",
    intro:
      "VC Deal Flow Signal은 GitHub 공개 데이터를 추적해 엔지니어링 가속 단계의 스타트업을 식별합니다. 본 페이지는 요약본이며, 전체 방법론은 SSRN에 영어로 게시되어 있습니다(DOI 10.2139/ssrn.6606558, CC BY 4.0).",
    body: `## 세 가지 핵심 신호

1. **커밋 속도 (Commit Velocity)**: 14일 롤링 윈도우 내 기본 브랜치에 대한 커밋 수. 베이스라인 지표입니다.
2. **커밋 속도 변화율 (Δ Velocity)**: 인접한 두 14일 윈도우 사이의 백분율 변화. 핵심 랭킹 신호이며, 지속적인 가속은 통상 펀드레이즈 발표 3~6주 전에 관찰됩니다.
3. **기여자 증가 (Contributor Growth)**: 6주 윈도우 내 고유 커미터 수의 변화. 팀 확장의 지표입니다.

## 데이터 출처

오직 공개된 GitHub REST + GraphQL API만 사용합니다. 데이터셋은 CC BY 4.0 라이선스로 공개 다운로드가 가능합니다. 봇 계정(Renovate, Dependabot, github-actions[bot] 등)은 핸들 접미사로 자동 제외됩니다.

## 검증

외부 분석가는 누구나 15분 이내에 공개된 모든 수치를 재현할 수 있습니다. 재현 키트는 \`curl\` + \`jq\` 한 줄 명령을 제공합니다.`,
    englishLinkLabel: "전체 방법론 (영어)",
    readTimeLabel: "약 3분 분량",
  },
  {
    locale: "ko",
    topic: "glossary",
    title: "용어집",
    intro: "본 페이지는 다섯 가지 핵심 용어를 정의합니다. 전체 용어집(30개 이상 항목)은 영어로 발행됩니다.",
    body: `### 커밋 속도 (Commit Velocity)
14일 동안 기본 브랜치에 적용된 총 커밋 수. 베이스라인 지표, 투자자는 절대값이 아닌 변화율을 봐야 합니다.

### 커밋 속도 변화율 (Commit Velocity Change)
인접한 두 14일 윈도우 사이의 백분율 변화. VC Deal Flow Signal의 주요 랭킹 신호입니다.

### 엔지니어링 가속 (Engineering Acceleration)
자체 과거 베이스라인 대비 엔지니어링 산출량의 지속적 증가. **「액셀러레이터 프로그램」(Y Combinator, Techstars 등)과는 무관**한 정량적 GitHub 신호입니다.

### 기여자 증가 (Contributor Growth)
6주 윈도우 내 고유 기여자 수의 변화. 펀드레이즈 후의 팀 확장을 자주 예고합니다.

### 프레임워크 마이그레이션 (Framework Migration)
단일 PR에서 테크 스택을 교체하는 신호. 저희 데이터에서 가장 빈번하게 관찰되는 신호 유형, 75%를 차지합니다.`,
    englishLinkLabel: "전체 용어집 (영어)",
    readTimeLabel: "약 2분 분량",
  },
  {
    locale: "ko",
    topic: "faq",
    title: "자주 묻는 질문",
    intro: "가장 자주 받는 다섯 가지 질문. 전체 FAQ(30개 이상 항목)는 영어로 발행됩니다.",
    body: `### Y Combinator 같은 액셀러레이터 프로그램과 관련이 있나요?
아니요. 「엔지니어링 가속」은 공개된 GitHub 데이터에서 측정한 정량적 신호를 가리키며, Y Combinator, Techstars, 500 Global 등 액셀러레이터와는 무관합니다.

### 데이터는 어디서 오나요?
공개된 GitHub REST + GraphQL API에서만 가져오며, 중복 제거된 메타데이터 캐시를 추가로 사용합니다. 모든 원본 데이터는 공개적으로 접근 가능합니다.

### 왜 무료인가요?
다섯 개 MCP 도구는 영구 무료입니다, 수익원이 아닌 배포 엔진이기 때문입니다. 유료 기능(대시보드, API, Insider Circle)은 무료 도구 위에 쌓이는 구조이며, 무료 도구를 대체하지 않습니다.

### 데이터셋은 얼마나 자주 갱신되나요?
주간입니다. \`/api/dataset.jsonl\`은 매 빌드마다 새로 생성되고, 빌드 타임스탬프는 \`/changelog\`에 기록됩니다.

### 어떻게 인용하나요?
방법론: DOI 10.2139/ssrn.6606558. 데이터셋: CC BY 4.0, 출처 표시 링크로 충분합니다. 전체 인용 형식(APA / MLA / Chicago / BibTeX / RIS)은 [/citation-guide](/citation-guide)를 참조하세요.`,
    englishLinkLabel: "전체 FAQ (영어)",
    readTimeLabel: "약 2분 분량",
  },

  // ============================================================
  // HI, methodology / glossary / faq
  // ============================================================
  {
    locale: "hi",
    topic: "methodology",
    title: "मेथडोलॉजी सारांश",
    intro:
      "VC Deal Flow Signal सार्वजनिक GitHub डेटा का अनुसरण करके इंजीनियरिंग एक्सेलरेशन चरण में मौजूद स्टार्टअप्स की पहचान करता है। यह पृष्ठ एक सारांश है, पूर्ण मेथडोलॉजी SSRN पर अंग्रेज़ी में प्रकाशित है (DOI 10.2139/ssrn.6606558, CC BY 4.0)।",
    body: `## तीन मुख्य सिग्नल

1. **कमिट वेलॉसिटी (Commit Velocity)**: 14-दिन की रोलिंग विंडो में डिफ़ॉल्ट ब्रांच पर कमिट्स की संख्या। बेसलाइन मीट्रिक।
2. **कमिट वेलॉसिटी परिवर्तन (Δ Velocity)**: दो आसन्न 14-दिन विंडोज़ के बीच प्रतिशत परिवर्तन। यह रैंकिंग सिग्नल है, निरंतर त्वरण आमतौर पर फ़ंडरेज़ घोषणाओं से तीन से छह सप्ताह पहले दिखाई देता है।
3. **कॉन्ट्रिब्यूटर वृद्धि (Contributor Growth)**: 6-सप्ताह विंडो में अद्वितीय कमिटर्स की संख्या में परिवर्तन। टीम विस्तार का संकेतक।

## डेटा स्रोत

केवल सार्वजनिक GitHub REST + GraphQL API। डेटासेट CC BY 4.0 लाइसेंस के तहत खुले रूप से डाउनलोड के लिए उपलब्ध है। बॉट अकाउंट्स (Renovate, Dependabot, github-actions[bot] आदि) को हैंडल सफ़िक्स द्वारा स्वतः बाहर रखा जाता है।

## सत्यापन

कोई भी बाहरी विश्लेषक 15 मिनट के अंदर सभी प्रकाशित संख्याओं को पुनरुत्पादित कर सकता है। पुनरुत्पादन किट \`curl\` + \`jq\` वन-लाइनर्स प्रदान करता है।`,
    englishLinkLabel: "पूर्ण मेथडोलॉजी (अंग्रेज़ी)",
    readTimeLabel: "लगभग 3 मिनट",
  },
  {
    locale: "hi",
    topic: "glossary",
    title: "शब्दावली",
    intro:
      "यह पृष्ठ पाँच केंद्रीय शब्दों को परिभाषित करता है। पूर्ण शब्दावली (30+ प्रविष्टियाँ) अंग्रेज़ी में प्रकाशित है।",
    body: `### कमिट वेलॉसिटी (Commit Velocity)
14 दिनों में डिफ़ॉल्ट ब्रांच पर कुल कमिट्स। बेसलाइन मीट्रिक, निवेशकों को निरपेक्ष मान नहीं, परिवर्तन दर देखनी चाहिए।

### कमिट वेलॉसिटी परिवर्तन (Commit Velocity Change)
दो आसन्न 14-दिन विंडोज़ के बीच प्रतिशत परिवर्तन। VC Deal Flow Signal का मुख्य रैंकिंग सिग्नल।

### इंजीनियरिंग एक्सेलरेशन (Engineering Acceleration)
अपनी ही ऐतिहासिक बेसलाइन की तुलना में इंजीनियरिंग आउटपुट की निरंतर वृद्धि। **«एक्सेलरेटर प्रोग्राम्स»** (Y Combinator, Techstars आदि) से **असंबंधित**, यह एक मात्रात्मक GitHub सिग्नल है।

### कॉन्ट्रिब्यूटर वृद्धि (Contributor Growth)
6-सप्ताह विंडो में अद्वितीय योगदानकर्ताओं की संख्या में परिवर्तन। अक्सर फ़ंडरेज़ के बाद टीम विस्तार का अग्रदूत।

### फ़्रेमवर्क माइग्रेशन (Framework Migration)
एक ही PR में टेक स्टैक प्रतिस्थापन का सिग्नल। हमारे डेटा में सबसे अधिक देखा गया सिग्नल प्रकार, 75%।`,
    englishLinkLabel: "पूर्ण शब्दावली (अंग्रेज़ी)",
    readTimeLabel: "लगभग 2 मिनट",
  },
  {
    locale: "hi",
    topic: "faq",
    title: "अक्सर पूछे जाने वाले प्रश्न",
    intro:
      "सबसे अधिक पूछे जाने वाले पाँच प्रश्न। पूर्ण FAQ (30+ प्रविष्टियाँ) अंग्रेज़ी में प्रकाशित है।",
    body: `### क्या इसका Y Combinator जैसे एक्सेलरेटर प्रोग्राम्स से कोई संबंध है?
नहीं। «इंजीनियरिंग एक्सेलरेशन» से हमारा अर्थ सार्वजनिक GitHub डेटा से मापा गया मात्रात्मक सिग्नल है, Y Combinator, Techstars या 500 Global से कोई संबंध नहीं।

### डेटा कहाँ से आता है?
केवल सार्वजनिक GitHub REST + GraphQL API से, साथ ही एक डीडुप्लिकेटेड मेटाडेटा कैश से। सभी कच्चा डेटा सार्वजनिक रूप से सुलभ है।

### निःशुल्क क्यों है?
पाँच MCP टूल्स स्थायी रूप से मुफ़्त हैं, यह वितरण इंजन है, राजस्व स्रोत नहीं। सशुल्क सुविधाएँ (डैशबोर्ड, API, Insider Circle) इन्हीं के ऊपर बनती हैं, उनका स्थान नहीं लेतीं।

### डेटासेट कितनी बार अद्यतन होता है?
साप्ताहिक। \`/api/dataset.jsonl\` हर बिल्ड पर पुनर्निर्मित होता है; बिल्ड टाइमस्टैम्प \`/changelog\` में दर्ज होते हैं।

### कैसे उद्धृत करें?
मेथडोलॉजी: DOI 10.2139/ssrn.6606558। डेटासेट: CC BY 4.0, एट्रिब्यूशन लिंक पर्याप्त है। पूर्ण उद्धरण प्रारूप (APA / MLA / Chicago / BibTeX / RIS) [/citation-guide](/citation-guide) पर उपलब्ध हैं।`,
    englishLinkLabel: "पूर्ण FAQ (अंग्रेज़ी)",
    readTimeLabel: "लगभग 2 मिनट",
  },

  // ============================================================
  // RU, methodology / glossary / faq
  // ============================================================
  {
    locale: "ru",
    topic: "methodology",
    title: "Краткая методология",
    intro:
      "VC Deal Flow Signal отслеживает публичные данные GitHub, чтобы выявлять стартапы в фазе ускорения инженерной разработки. Эта страница, краткая сводка; полная методология опубликована на SSRN на английском языке (DOI 10.2139/ssrn.6606558, CC BY 4.0).",
    body: `## Три ключевых сигнала

1. **Скорость коммитов (Commit Velocity)**: число коммитов в основную ветку за скользящее окно в 14 дней. Базовая метрика.
2. **Изменение скорости коммитов (Δ Velocity)**: процентное изменение между двумя соседними 14-дневными окнами. Это рейтинговый сигнал, устойчивое ускорение обычно появляется за три-шесть недель до объявления раунда.
3. **Рост числа контрибьюторов (Contributor Growth)**: изменение числа уникальных коммитеров за окно в 6 недель. Индикатор расширения команды.

## Источники данных

Только публичные GitHub REST + GraphQL API. Набор данных доступен для свободной загрузки по лицензии CC BY 4.0. Бот-аккаунты (Renovate, Dependabot, github-actions[bot] и т. д.) автоматически исключаются по суффиксу хэндла.

## Верификация

Любой внешний аналитик может воспроизвести все опубликованные числа менее чем за 15 минут. Набор для воспроизведения предоставляет однострочные команды \`curl\` + \`jq\`.`,
    englishLinkLabel: "Полная методология (английский)",
    readTimeLabel: "≈ 3 мин чтения",
  },
  {
    locale: "ru",
    topic: "glossary",
    title: "Глоссарий",
    intro:
      "На этой странице определены пять центральных терминов. Полный глоссарий (30+ записей) публикуется на английском языке.",
    body: `### Скорость коммитов (Commit Velocity)
Общее число коммитов в основную ветку за 14 дней. Базовая метрика, инвесторам важна скорость изменения, а не абсолютное значение.

### Изменение скорости коммитов (Commit Velocity Change)
Процентное изменение между двумя соседними 14-дневными окнами. Главный рейтинговый сигнал VC Deal Flow Signal.

### Инженерное ускорение (Engineering Acceleration)
Устойчивый рост инженерной выработки относительно собственной исторической базовой линии. **Не путать с «акселераторами»** (Y Combinator, Techstars и др.), это количественный сигнал из GitHub.

### Рост числа контрибьюторов (Contributor Growth)
Изменение числа уникальных контрибьюторов за окно в 6 недель. Часто предвещает расширение команды после раунда финансирования.

### Миграция фреймворка (Framework Migration)
Сигнал о замене технологического стека в одном PR. В наших данных самый часто наблюдаемый тип сигнала, 75 %.`,
    englishLinkLabel: "Полный глоссарий (английский)",
    readTimeLabel: "≈ 2 мин чтения",
  },
  {
    locale: "ru",
    topic: "faq",
    title: "Часто задаваемые вопросы",
    intro:
      "Пять самых частых вопросов. Полный FAQ (30+ записей) публикуется на английском языке.",
    body: `### Связано ли это с акселераторами вроде Y Combinator?
Нет. Под «инженерным ускорением» мы имеем в виду количественный сигнал из публичных данных GitHub, без отношения к Y Combinator, Techstars или 500 Global.

### Откуда берутся данные?
Только из публичных GitHub REST + GraphQL API, плюс дедуплицированный кэш метаданных. Все исходные данные общедоступны.

### Почему бесплатно?
Пять инструментов MCP бесплатны бессрочно, это канал распространения, а не источник дохода. Платные функции (дашборд, API, Insider Circle) надстраиваются сверху, а не заменяют их.

### Как часто обновляется набор данных?
Еженедельно. \`/api/dataset.jsonl\` пересоздаётся при каждом билде, отметки времени фиксируются в \`/changelog\`.

### Как цитировать?
Методология: DOI 10.2139/ssrn.6606558. Набор данных: CC BY 4.0, достаточно атрибуционной ссылки. Полные форматы цитирования (APA / MLA / Chicago / BibTeX / RIS), [/citation-guide](/citation-guide).`,
    englishLinkLabel: "Полный FAQ (английский)",
    readTimeLabel: "≈ 2 мин чтения",
  },

  // ============================================================
  // IT, methodology / glossary / faq
  // ============================================================
  {
    locale: "it",
    topic: "methodology",
    title: "Sintesi della metodologia",
    intro:
      "VC Deal Flow Signal traccia i dati pubblici di GitHub per identificare startup in una fase di accelerazione tecnica. Questa pagina è una sintesi, la metodologia completa è pubblicata su SSRN in inglese (DOI 10.2139/ssrn.6606558, CC BY 4.0).",
    body: `## Tre segnali principali

1. **Velocità dei commit (Commit Velocity)**: numero di commit sul branch di default in una finestra mobile di 14 giorni. Metrica di base.
2. **Variazione della velocità dei commit (Δ Velocity)**: variazione percentuale tra due finestre adiacenti di 14 giorni. È il segnale di ranking, l'accelerazione sostenuta precede tipicamente di tre-sei settimane gli annunci di raccolta fondi.
3. **Crescita dei contributori (Contributor Growth)**: variazione del numero di committer unici in una finestra di 6 settimane. Indicatore di espansione del team.

## Fonti dei dati

Esclusivamente API pubbliche GitHub REST + GraphQL. Il dataset è scaricabile liberamente sotto licenza CC BY 4.0. Gli account bot (Renovate, Dependabot, github-actions[bot] ecc.) vengono esclusi automaticamente dal suffisso di handle.

## Verifica

Qualsiasi analista esterno può riprodurre tutti i numeri pubblicati in meno di 15 minuti. Il kit di riproducibilità fornisce one-liner di \`curl\` + \`jq\`.`,
    englishLinkLabel: "Metodologia completa (inglese)",
    readTimeLabel: "≈ 3 min di lettura",
  },
  {
    locale: "it",
    topic: "glossary",
    title: "Glossario",
    intro:
      "Questa pagina definisce cinque termini chiave. Il glossario completo (oltre 30 voci) è pubblicato in inglese.",
    body: `### Velocità dei commit (Commit Velocity)
Numero totale di commit sul branch di default in 14 giorni. Metrica di base, gli investitori dovrebbero osservare il tasso di variazione, non il valore assoluto.

### Variazione della velocità dei commit (Commit Velocity Change)
Variazione percentuale tra due finestre adiacenti di 14 giorni. Il segnale di ranking principale di VC Deal Flow Signal.

### Accelerazione ingegneristica (Engineering Acceleration)
Aumento sostenuto della produzione ingegneristica rispetto alla propria baseline storica. **Da non confondere con i «programmi acceleratori»** (Y Combinator, Techstars ecc.), è un segnale quantitativo da GitHub.

### Crescita dei contributori (Contributor Growth)
Variazione del numero di contributori unici in una finestra di 6 settimane. Spesso precede l'espansione del team dopo una raccolta fondi.

### Migrazione di framework (Framework Migration)
Segnale di sostituzione dello stack tecnologico in un singolo PR. Nei nostri dati, il tipo di segnale osservato più di frequente, 75 %.`,
    englishLinkLabel: "Glossario completo (inglese)",
    readTimeLabel: "≈ 2 min di lettura",
  },
  {
    locale: "it",
    topic: "faq",
    title: "Domande frequenti",
    intro:
      "Le cinque domande più frequenti. La FAQ completa (oltre 30 voci) è pubblicata in inglese.",
    body: `### Ha relazione con acceleratori come Y Combinator?
No. Per «accelerazione ingegneristica» intendiamo un segnale quantitativo dai dati pubblici di GitHub, senza relazione con Y Combinator, Techstars o 500 Global.

### Da dove provengono i dati?
Esclusivamente da API pubbliche GitHub REST + GraphQL, con cache di metadati deduplicato. Tutti i dati grezzi sono pubblicamente accessibili.

### Perché è gratuito?
I cinque strumenti MCP sono gratuiti in modo permanente, sono un motore di distribuzione, non una fonte di ricavi. Le funzionalità a pagamento (dashboard, API, Insider Circle) si costruiscono sopra, non le sostituiscono.

### Con quale frequenza viene aggiornato il dataset?
Settimanalmente. \`/api/dataset.jsonl\` viene rigenerato ad ogni build; i timestamp sono registrati in \`/changelog\`.

### Come si cita?
Metodologia: DOI 10.2139/ssrn.6606558. Dataset: CC BY 4.0, basta un link di attribuzione. Formati completi (APA / MLA / Chicago / BibTeX / RIS) su [/citation-guide](/citation-guide).`,
    englishLinkLabel: "FAQ completa (inglese)",
    readTimeLabel: "≈ 2 min di lettura",
  },

  // ============================================================
  // NL, methodology / glossary / faq
  // ============================================================
  {
    locale: "nl",
    topic: "methodology",
    title: "Samenvatting methodologie",
    intro:
      "VC Deal Flow Signal volgt publieke GitHub-data om startups te identificeren in een fase van versnelde engineering. Deze pagina is een samenvatting, de volledige methodologie staat in het Engels op SSRN (DOI 10.2139/ssrn.6606558, CC BY 4.0).",
    body: `## Drie kernsignalen

1. **Commit-snelheid (Commit Velocity)**: aantal commits op de default-branch binnen een rollend venster van 14 dagen. Basismaatstaf.
2. **Verandering van commit-snelheid (Δ Velocity)**: procentuele verandering tussen twee opeenvolgende vensters van 14 dagen. Dit is het ranking-signaal, aanhoudende versnelling komt doorgaans drie tot zes weken vóór financierings-aankondigingen.
3. **Groei van bijdragers (Contributor Growth)**: verandering van het aantal unieke committers binnen een venster van 6 weken. Indicator van teamuitbreiding.

## Databronnen

Uitsluitend publieke GitHub REST + GraphQL API's. De dataset is openbaar te downloaden onder CC BY 4.0. Bot-accounts (Renovate, Dependabot, github-actions[bot] enz.) worden automatisch uitgesloten op basis van handle-suffix.

## Verificatie

Elke externe analist kan alle gepubliceerde cijfers reproduceren in minder dan 15 minuten. De reproduceerbaarheidskit biedt one-liners in \`curl\` + \`jq\`.`,
    englishLinkLabel: "Volledige methodologie (Engels)",
    readTimeLabel: "± 3 min leestijd",
  },
  {
    locale: "nl",
    topic: "glossary",
    title: "Verklarende woordenlijst",
    intro:
      "Deze pagina definieert vijf kernbegrippen. De volledige verklarende woordenlijst (30+ vermeldingen) is gepubliceerd in het Engels.",
    body: `### Commit-snelheid (Commit Velocity)
Totaal aantal commits op de default-branch in 14 dagen. Basismaatstaf, investeerders moeten kijken naar de mate van verandering, niet naar de absolute waarde.

### Verandering van commit-snelheid (Commit Velocity Change)
Procentuele verandering tussen twee opeenvolgende vensters van 14 dagen. Het primaire ranking-signaal van VC Deal Flow Signal.

### Engineering-versnelling (Engineering Acceleration)
Aanhoudende toename van engineering-output ten opzichte van de eigen historische baseline. **Niet te verwarren met «accelerator-programma's»** (Y Combinator, Techstars etc.), een kwantitatief GitHub-signaal.

### Groei van bijdragers (Contributor Growth)
Verandering van het aantal unieke bijdragers binnen een venster van 6 weken. Vaak een vroege indicator van teamuitbreiding na een financieringsronde.

### Framework-migratie (Framework Migration)
Signaal van het vervangen van een tech-stack in een enkele PR. In onze data het meest voorkomende signaaltype, 75 %.`,
    englishLinkLabel: "Volledige woordenlijst (Engels)",
    readTimeLabel: "± 2 min leestijd",
  },
  {
    locale: "nl",
    topic: "faq",
    title: "Veelgestelde vragen",
    intro:
      "De vijf meestgestelde vragen. De volledige FAQ (30+ vermeldingen) is in het Engels gepubliceerd.",
    body: `### Heeft dit verband met accelerator-programma's zoals Y Combinator?
Nee. Met «engineering-versnelling» bedoelen we een kwantitatief signaal uit publieke GitHub-data, zonder verband met Y Combinator, Techstars of 500 Global.

### Waar komen de gegevens vandaan?
Uitsluitend uit publieke GitHub REST + GraphQL API's, aangevuld met een ontdubbelde metadata-cache. Alle ruwe data is publiek toegankelijk.

### Waarom gratis?
De vijf MCP-tools blijven permanent gratis, het is een distributiekanaal, geen inkomstenbron. Betaalde functies (dashboard, API, Insider Circle) bouwen erop voort, ze vervangen ze niet.

### Hoe vaak wordt de dataset bijgewerkt?
Wekelijks. \`/api/dataset.jsonl\` wordt bij elke build opnieuw gegenereerd; build-tijdstempels worden in \`/changelog\` vastgelegd.

### Hoe citeer ik?
Methodologie: DOI 10.2139/ssrn.6606558. Dataset: CC BY 4.0, een attributielink volstaat. Volledige citatieformaten (APA / MLA / Chicago / BibTeX / RIS) op [/citation-guide](/citation-guide).`,
    englishLinkLabel: "Volledige FAQ (Engels)",
    readTimeLabel: "± 2 min leestijd",
  },

  // ============================================================
  // AR, methodology / glossary / faq  (RTL)
  // ============================================================
  {
    locale: "ar",
    topic: "methodology",
    title: "ملخص المنهجية",
    intro:
      "تتتبع VC Deal Flow Signal بيانات GitHub العامة لتحديد الشركات الناشئة التي تمر بمرحلة تسارع هندسي. هذه الصفحة ملخص, المنهجية الكاملة منشورة على SSRN باللغة الإنجليزية (DOI 10.2139/ssrn.6606558، CC BY 4.0).",
    body: `## ثلاث إشارات أساسية

1. **سرعة الـ commits (Commit Velocity)**: عدد الـ commits على الفرع الافتراضي ضمن نافذة متحركة لمدة 14 يومًا. مقياس مرجعي.
2. **تغيّر سرعة الـ commits (Δ Velocity)**: التغيّر النسبي بين نافذتين متجاورتين مدتهما 14 يومًا. هذه هي إشارة التصنيف, يظهر التسارع المستدام عادةً قبل ثلاثة إلى ستة أسابيع من إعلانات جولات التمويل.
3. **نمو المساهمين (Contributor Growth)**: تغيّر عدد المساهمين الفريدين ضمن نافذة لمدة 6 أسابيع. مؤشر على توسّع الفريق.

## مصادر البيانات

حصرًا واجهات GitHub REST + GraphQL API العامة. مجموعة البيانات متاحة للتنزيل المفتوح بموجب رخصة CC BY 4.0. حسابات الـ bots (Renovate وDependabot وgithub-actions[bot] وغيرها) تُستبعد تلقائيًا حسب لاحقة الـ handle.

## التحقق

يمكن لأي محلل خارجي إعادة إنتاج جميع الأرقام المنشورة في أقل من 15 دقيقة. تقدّم حزمة إعادة الإنتاج أوامر سطر واحد من \`curl\` + \`jq\`.`,
    englishLinkLabel: "المنهجية الكاملة (الإنجليزية)",
    readTimeLabel: "حوالي 3 دقائق",
  },
  {
    locale: "ar",
    topic: "glossary",
    title: "مسرد المصطلحات",
    intro:
      "تُعرّف هذه الصفحة خمسة مصطلحات مركزية. المسرد الكامل (أكثر من 30 مدخلًا) منشور بالإنجليزية.",
    body: `### سرعة الـ commits (Commit Velocity)
إجمالي عدد الـ commits على الفرع الافتراضي خلال 14 يومًا. مقياس مرجعي, يجب على المستثمرين النظر إلى معدّل التغيّر لا إلى القيمة المطلقة.

### تغيّر سرعة الـ commits (Commit Velocity Change)
التغيّر النسبي بين نافذتين متجاورتين مدتهما 14 يومًا. إشارة التصنيف الرئيسية لـ VC Deal Flow Signal.

### التسارع الهندسي (Engineering Acceleration)
زيادة مستدامة في الإنتاج الهندسي مقارنة بخطّ الأساس التاريخي للشركة نفسها. **يجب عدم الخلط مع «برامج الـ Accelerators»** (مثل Y Combinator وTechstars), هي إشارة كميّة من GitHub.

### نمو المساهمين (Contributor Growth)
تغيّر عدد المساهمين الفريدين ضمن نافذة 6 أسابيع. كثيرًا ما يسبق توسّع الفريق بعد جولة تمويل.

### ترحيل إطار العمل (Framework Migration)
إشارة استبدال الـ tech stack في PR واحد. في بياناتنا، أكثر أنواع الإشارات ملاحظةً, بنسبة 75%.`,
    englishLinkLabel: "المسرد الكامل (الإنجليزية)",
    readTimeLabel: "حوالي دقيقتين",
  },
  {
    locale: "ar",
    topic: "faq",
    title: "الأسئلة الشائعة",
    intro:
      "أكثر خمسة أسئلة شيوعًا. الأسئلة الشائعة الكاملة (أكثر من 30 مدخلًا) منشورة بالإنجليزية.",
    body: `### هل لذلك صلة ببرامج الـ Accelerators مثل Y Combinator؟
لا. نقصد بـ«التسارع الهندسي» إشارة كميّة من بيانات GitHub العامة, لا علاقة لها بـ Y Combinator أو Techstars أو 500 Global.

### من أين تأتي البيانات؟
حصرًا من واجهات GitHub REST + GraphQL API العامة، إضافةً إلى ذاكرة بيانات وصفية مزالة منها التكرارات. جميع البيانات الأولية متاحة للعموم.

### لماذا الخدمة مجانية؟
الأدوات الخمس لـ MCP مجانية بشكل دائم, فهي محرّك توزيع لا مصدر دخل. المزايا المدفوعة (لوحة التحكم، الـ API، Insider Circle) تُبنى فوقها ولا تحلّ محلّها.

### بأي وتيرة تُحدَّث مجموعة البيانات؟
أسبوعيًا. تتم إعادة توليد \`/api/dataset.jsonl\` مع كل بناء، وتُسجَّل أختام التوقيت في \`/changelog\`.

### كيف أُشير إلى المصدر؟
المنهجية: DOI 10.2139/ssrn.6606558. مجموعة البيانات: CC BY 4.0، يكفي رابط إسناد. صيغ الاستشهاد الكاملة (APA / MLA / Chicago / BibTeX / RIS) على [/citation-guide](/citation-guide).`,
    englishLinkLabel: "الأسئلة الشائعة الكاملة (الإنجليزية)",
    readTimeLabel: "حوالي دقيقتين",
  },

  // ============================================================
  // 2026-05-03 expansion: signals + about topics for the 6 largest
  // European-language locales (es, fr, pt, it, de, nl). Hand-written
  // native prose; each body is 250-350 words. Distinct from the ja
  // deep articles, locale-specific summaries that point back to the
  // canonical English methodology / about pages.
  // ============================================================

  // ----- SPANISH -----
  {
    locale: "es",
    topic: "signals",
    title: "Tipos de señal",
    intro:
      "Las seis señales cuantitativas que rastreamos a partir de datos públicos de GitHub. Cada una se mide como un cambio respecto a la línea base de la propia empresa, no como un número absoluto.",
    body: `## Qué es una «señal»

En VC Deal Flow Signal, una **señal** es un cambio observable y medible en la actividad de ingeniería pública de una startup. Las señales se definen siempre como variaciones respecto a la línea base histórica de la propia empresa, lo que permite comparar startups de tamaños muy distintos.

## Las seis señales que rastreamos

1. **Velocidad de commits**, número de commits a la rama principal en una ventana móvil de 14 días, excluyendo bots. Es el indicador base.
2. **Δ Velocidad**, variación porcentual entre dos ventanas consecutivas de 14 días. Esta es nuestra **señal principal de ranking**: el rango observado en nuestro panel va de −94 % a +1.647 %.
3. **Crecimiento de contribuyentes**, alta neta de contribuyentes únicos por trimestre. Detecta contrataciones de ingeniería antes del anuncio formal.
4. **Expansión de repositorios**, apertura de nuevos repositorios públicos en la organización, en particular cuando se trata de servicios o SDK.
5. **Migración de framework**, sustitución de la pila tecnológica en un único pull request. En nuestros datos, es el tipo de señal más frecuente: aproximadamente el 75 % de las observaciones.
6. **Frecuencia de despliegue**, cadencia de tags y releases públicos. Aproxima el ritmo de producción.

## Por qué importa el cambio, no el valor absoluto

Una empresa con 5 commits diarios que pasa a 50 emite una señal mucho más fuerte que una con 200 commits diarios estables. La metodología completa, el cuaderno de réplica y la justificación estadística están publicados en SSRN (DOI 10.2139/ssrn.6606558, CC BY 4.0).`,
    englishLinkLabel: "Glosario completo de señales (en inglés)",
    readTimeLabel: "≈ 2 min",
  },
  {
    locale: "es",
    topic: "about",
    title: "Acerca de VC Deal Flow Signal",
    intro:
      "Proyecto de investigación independiente que extrae señales legibles por máquinas a partir de datos públicos de GitHub para inversores en venture capital. Esta página resume el objetivo, la persona responsable y la política de conflictos de interés.",
    body: `## Qué somos

VC Deal Flow Signal (también GitDealFlow) es un proyecto independiente que aborda la **asimetría informativa** en el sourcing de venture capital. Mientras que el deal flow tradicional depende de redes personales y referencias, nuestra hipótesis es que los datos públicos de GitHub contienen información rica sobre la aceleración de ingeniería de las startups con financiación, y que esa señal aparece varias semanas antes que el anuncio público de la ronda.

## Tres actividades centrales

1. **Investigación**, estudio empírico sobre 219 observaciones de 55 startups con financiación, publicado en SSRN (DOI 10.2139/ssrn.6606558) con kit de réplica completo.
2. **Producto**, los hallazgos se exponen como servidor MCP, API HTTP y conjunto de datos descargable. Compatible con Claude Desktop, Cursor, Continue y otros agentes.
3. **Comunidad**, boletín semanal gratuito, Insider Circle de pago y soporte de citación para investigadores, periodistas y analistas.

## Quién está detrás

VC Deal Flow Signal lo opera **The Data Nerd** (ORCID iD [0009-0002-2222-4112](https://orcid.org/0009-0002-2222-4112)) desde Europa (Grecia). Contacto: \`signals@gitdealflow.com\`.

## Política de conflictos de interés

- VC Deal Flow Signal es una empresa independiente de investigación y suscripción. No invertimos directamente en las startups que clasificamos.
- No aceptamos pagos por mejorar la posición de ninguna empresa.
- Las correcciones de datos se publican en [/corrections](/corrections) con sello de tiempo.
- El conjunto de datos se publica con licencia CC BY 4.0; basta un enlace de atribución.`,
    englishLinkLabel: "Página completa Acerca de (en inglés)",
    readTimeLabel: "≈ 2 min",
  },

  // ----- FRENCH -----
  {
    locale: "fr",
    topic: "signals",
    title: "Types de signaux",
    intro:
      "Les six signaux quantitatifs que nous suivons à partir des données publiques de GitHub. Chacun est mesuré comme une variation par rapport à la ligne de base propre à l'entreprise, jamais comme une valeur absolue.",
    body: `## Qu'est-ce qu'un « signal »

Chez VC Deal Flow Signal, un **signal** est un changement observable et mesurable dans l'activité d'ingénierie publique d'une startup. Les signaux sont toujours définis comme des variations par rapport à la ligne de base historique de la même entreprise, ce qui permet de comparer des startups de tailles très différentes.

## Les six signaux que nous suivons

1. **Vitesse de commits**, nombre de commits sur la branche par défaut dans une fenêtre glissante de 14 jours, hors bots. C'est l'indicateur de base.
2. **Δ Vitesse**, variation en pourcentage entre deux fenêtres consécutives de 14 jours. Il s'agit de notre **signal principal de classement** : la plage observée dans notre panel va de −94 % à +1 647 %.
3. **Croissance des contributeurs**, solde net de nouveaux contributeurs uniques par trimestre. Détecte les recrutements d'ingénierie avant l'annonce formelle.
4. **Expansion des dépôts**, ouverture de nouveaux dépôts publics dans l'organisation, en particulier des services ou SDK.
5. **Migration de framework**, remplacement de la pile technique dans une seule pull request. Dans nos données, c'est le type de signal le plus fréquent : environ 75 % des observations.
6. **Fréquence de déploiement**, cadence de tags et de releases publiques. Approxime le rythme de mise en production.

## Pourquoi le changement compte, pas la valeur absolue

Une entreprise passant de 5 commits par jour à 50 émet un signal bien plus fort qu'une autre stable à 200 commits par jour. La méthodologie complète, le notebook de réplication et la justification statistique sont publiés sur SSRN (DOI 10.2139/ssrn.6606558, CC BY 4.0).`,
    englishLinkLabel: "Glossaire complet des signaux (en anglais)",
    readTimeLabel: "≈ 2 min",
  },
  {
    locale: "fr",
    topic: "about",
    title: "À propos de VC Deal Flow Signal",
    intro:
      "Projet de recherche indépendant qui extrait des signaux lisibles par machine à partir de données publiques de GitHub pour les investisseurs en venture capital. Cette page résume l'objectif du projet, la personne responsable et la politique en matière de conflits d'intérêts.",
    body: `## Ce que nous sommes

VC Deal Flow Signal (également GitDealFlow) est un projet indépendant qui s'attaque à l'**asymétrie d'information** dans le sourcing en venture capital. Là où le deal flow traditionnel repose sur des réseaux personnels et des recommandations, notre hypothèse est que les données publiques de GitHub contiennent des informations riches sur l'accélération d'ingénierie des startups financées, et que ce signal apparaît plusieurs semaines avant l'annonce publique de la levée.

## Trois activités principales

1. **Recherche**, étude empirique sur 219 observations de 55 startups financées, publiée sur SSRN (DOI 10.2139/ssrn.6606558) avec un kit de réplication complet.
2. **Produit**, les résultats sont exposés via un serveur MCP, une API HTTP et un jeu de données téléchargeable. Compatible Claude Desktop, Cursor, Continue et autres agents.
3. **Communauté**, newsletter hebdomadaire gratuite, Insider Circle payant et support de citation pour chercheurs, journalistes et analystes.

## Qui est derrière

VC Deal Flow Signal est opéré par **The Data Nerd** (ORCID iD [0009-0002-2222-4112](https://orcid.org/0009-0002-2222-4112)) depuis l'Europe (Grèce). Contact : \`signals@gitdealflow.com\`.

## Politique de conflits d'intérêts

- VC Deal Flow Signal est une société indépendante de recherche et d'abonnement. Nous n'investissons pas directement dans les startups que nous classons.
- Aucun paiement n'est accepté pour améliorer le classement d'une entreprise.
- Les corrections de données sont publiées sur [/corrections](/corrections) avec horodatage.
- Le jeu de données est sous licence CC BY 4.0 ; un simple lien d'attribution suffit.`,
    englishLinkLabel: "Page À propos complète (en anglais)",
    readTimeLabel: "≈ 2 min",
  },

  // ----- PORTUGUESE -----
  {
    locale: "pt",
    topic: "signals",
    title: "Tipos de sinal",
    intro:
      "Os seis sinais quantitativos que rastreamos a partir de dados públicos do GitHub. Cada um é medido como uma variação em relação à linha de base da própria empresa, nunca como um valor absoluto.",
    body: `## O que é um «sinal»

Na VC Deal Flow Signal, um **sinal** é uma alteração observável e mensurável na atividade pública de engenharia de uma startup. Os sinais são sempre definidos como variações em relação à linha de base histórica da mesma empresa, o que permite comparar startups de dimensões muito diferentes.

## Os seis sinais que rastreamos

1. **Velocidade de commits**, número de commits no ramo principal numa janela móvel de 14 dias, excluindo bots. É o indicador de base.
2. **Δ Velocidade**, variação percentual entre duas janelas consecutivas de 14 dias. Este é o nosso **sinal principal de ranking**: o intervalo observado no nosso painel vai de −94 % a +1.647 %.
3. **Crescimento de contribuidores**, saldo líquido de contribuidores únicos por trimestre. Deteta contratações de engenharia antes do anúncio formal.
4. **Expansão de repositórios**, abertura de novos repositórios públicos na organização, em particular serviços ou SDK.
5. **Migração de framework**, substituição da pilha tecnológica num único pull request. Nos nossos dados, é o tipo de sinal mais frequente: cerca de 75 % das observações.
6. **Frequência de deploy**, cadência de tags e releases públicas. Aproxima o ritmo de produção.

## Porque importa a variação, e não o valor absoluto

Uma empresa que passa de 5 commits por dia para 50 emite um sinal muito mais forte do que outra estável em 200 commits por dia. A metodologia completa, o notebook de réplica e a justificação estatística estão publicados na SSRN (DOI 10.2139/ssrn.6606558, CC BY 4.0).`,
    englishLinkLabel: "Glossário completo de sinais (em inglês)",
    readTimeLabel: "≈ 2 min",
  },
  {
    locale: "pt",
    topic: "about",
    title: "Sobre a VC Deal Flow Signal",
    intro:
      "Projeto de investigação independente que extrai sinais legíveis por máquina a partir de dados públicos do GitHub para investidores de venture capital. Esta página resume o objetivo do projeto, a pessoa responsável e a política de conflitos de interesse.",
    body: `## O que somos

A VC Deal Flow Signal (também GitDealFlow) é um projeto independente que aborda a **assimetria de informação** no sourcing de venture capital. Enquanto o deal flow tradicional depende de redes pessoais e referências, a nossa hipótese é que os dados públicos do GitHub contêm informação rica sobre a aceleração de engenharia das startups financiadas, e que esse sinal surge várias semanas antes do anúncio público da ronda.

## Três atividades centrais

1. **Investigação**, estudo empírico sobre 219 observações de 55 startups financiadas, publicado na SSRN (DOI 10.2139/ssrn.6606558) com kit de réplica completo.
2. **Produto**, os resultados são expostos como servidor MCP, API HTTP e conjunto de dados descarregável. Compatível com Claude Desktop, Cursor, Continue e outros agentes.
3. **Comunidade**, newsletter semanal gratuita, Insider Circle pago e suporte de citação para investigadores, jornalistas e analistas.

## Quem está por detrás

A VC Deal Flow Signal é operada por **The Data Nerd** (ORCID iD [0009-0002-2222-4112](https://orcid.org/0009-0002-2222-4112)) a partir da Europa (Grécia). Contacto: \`signals@gitdealflow.com\`.

## Política de conflitos de interesse

- A VC Deal Flow Signal é uma empresa independente de investigação e subscrição. Não investimos diretamente nas startups que classificamos.
- Não aceitamos pagamentos para melhorar a posição de qualquer empresa.
- As correções de dados são publicadas em [/corrections](/corrections) com selo temporal.
- O conjunto de dados está licenciado em CC BY 4.0; basta um link de atribuição.`,
    englishLinkLabel: "Página Sobre completa (em inglês)",
    readTimeLabel: "≈ 2 min",
  },

  // ----- ITALIAN -----
  {
    locale: "it",
    topic: "signals",
    title: "Tipi di segnale",
    intro:
      "I sei segnali quantitativi che monitoriamo a partire dai dati pubblici di GitHub. Ognuno è misurato come variazione rispetto alla linea di base della stessa azienda, mai come valore assoluto.",
    body: `## Cos'è un «segnale»

In VC Deal Flow Signal, un **segnale** è una variazione osservabile e misurabile nell'attività di ingegneria pubblica di una startup. I segnali sono sempre definiti come variazioni rispetto alla linea di base storica della stessa azienda, il che permette di confrontare startup di dimensioni molto diverse.

## I sei segnali che monitoriamo

1. **Velocità di commit**, numero di commit sul ramo principale in una finestra mobile di 14 giorni, esclusi i bot. È l'indicatore di base.
2. **Δ Velocità**, variazione percentuale tra due finestre consecutive di 14 giorni. È il nostro **segnale principale di ranking**: l'intervallo osservato nel nostro panel va da −94 % a +1.647 %.
3. **Crescita dei contributor**, saldo netto di contributor unici per trimestre. Rileva le assunzioni di ingegneria prima dell'annuncio formale.
4. **Espansione dei repository**, apertura di nuovi repository pubblici nell'organizzazione, in particolare servizi o SDK.
5. **Migrazione di framework**, sostituzione dello stack tecnologico in una singola pull request. Nei nostri dati è il tipo di segnale più frequente: circa il 75 % delle osservazioni.
6. **Frequenza di deploy**, cadenza di tag e release pubbliche. Approssima il ritmo di produzione.

## Perché conta la variazione, non il valore assoluto

Un'azienda che passa da 5 commit al giorno a 50 emette un segnale molto più forte di una stabile a 200 commit al giorno. La metodologia completa, il notebook di replica e la giustificazione statistica sono pubblicati su SSRN (DOI 10.2139/ssrn.6606558, CC BY 4.0).`,
    englishLinkLabel: "Glossario completo dei segnali (in inglese)",
    readTimeLabel: "≈ 2 min",
  },
  {
    locale: "it",
    topic: "about",
    title: "Informazioni su VC Deal Flow Signal",
    intro:
      "Progetto di ricerca indipendente che estrae segnali leggibili da macchine a partire dai dati pubblici di GitHub per gli investitori di venture capital. Questa pagina riassume l'obiettivo del progetto, la persona responsabile e la politica sui conflitti di interesse.",
    body: `## Cosa siamo

VC Deal Flow Signal (anche GitDealFlow) è un progetto indipendente che affronta l'**asimmetria informativa** nel sourcing di venture capital. Mentre il deal flow tradizionale dipende da reti personali e referenze, la nostra ipotesi è che i dati pubblici di GitHub contengano informazioni ricche sull'accelerazione ingegneristica delle startup finanziate, e che questo segnale appaia diverse settimane prima dell'annuncio pubblico del round.

## Tre attività centrali

1. **Ricerca**, studio empirico su 219 osservazioni di 55 startup finanziate, pubblicato su SSRN (DOI 10.2139/ssrn.6606558) con kit di replica completo.
2. **Prodotto**, i risultati sono esposti come server MCP, API HTTP e dataset scaricabile. Compatibile con Claude Desktop, Cursor, Continue e altri agenti.
3. **Comunità**, newsletter settimanale gratuita, Insider Circle a pagamento e supporto alla citazione per ricercatori, giornalisti e analisti.

## Chi c'è dietro

VC Deal Flow Signal è gestito da **The Data Nerd** (ORCID iD [0009-0002-2222-4112](https://orcid.org/0009-0002-2222-4112)) dall'Europa (Grecia). Contatto: \`signals@gitdealflow.com\`.

## Politica sui conflitti di interesse

- VC Deal Flow Signal è una società indipendente di ricerca e abbonamento. Non investiamo direttamente nelle startup che classifichiamo.
- Non accettiamo pagamenti per migliorare il posizionamento di alcuna azienda.
- Le correzioni dei dati sono pubblicate su [/corrections](/corrections) con timestamp.
- Il dataset è rilasciato con licenza CC BY 4.0; è sufficiente un link di attribuzione.`,
    englishLinkLabel: "Pagina Informazioni completa (in inglese)",
    readTimeLabel: "≈ 2 min",
  },

  // ----- GERMAN -----
  {
    locale: "de",
    topic: "signals",
    title: "Signal-Typen",
    intro:
      "Die sechs quantitativen Signale, die wir aus öffentlichen GitHub-Daten verfolgen. Jedes wird als Veränderung gegenüber der eigenen Baseline des Unternehmens gemessen, nie als absoluter Wert.",
    body: `## Was ist ein «Signal»

Bei VC Deal Flow Signal ist ein **Signal** eine beobachtbare, messbare Veränderung in der öffentlichen Engineering-Aktivität eines Startups. Signale werden stets als Abweichungen gegenüber der historischen Baseline desselben Unternehmens definiert, wodurch sich Startups sehr unterschiedlicher Grösse vergleichbar machen lassen.

## Die sechs Signale, die wir verfolgen

1. **Commit-Geschwindigkeit**, Anzahl der Commits auf dem Hauptzweig in einem rollierenden 14-Tage-Fenster, ohne Bots. Der Basis-Indikator.
2. **Δ Geschwindigkeit**, prozentuale Veränderung zwischen zwei aufeinanderfolgenden 14-Tage-Fenstern. Dies ist unser **primäres Ranking-Signal**: der in unserem Panel beobachtete Bereich reicht von −94 % bis +1.647 %.
3. **Mitwirkenden-Wachstum**, Netto-Zuwachs an einzigartigen Contributors pro Quartal. Erkennt Engineering-Einstellungen vor der formellen Ankündigung.
4. **Repository-Erweiterung**, Eröffnung neuer öffentlicher Repositories in der Organisation, insbesondere Services oder SDKs.
5. **Framework-Migration**, Austausch des Tech-Stacks in einem einzigen Pull Request. In unseren Daten ist dies der häufigste Signaltyp: rund 75 % der Beobachtungen.
6. **Deploy-Frequenz**, Kadenz öffentlicher Tags und Releases. Approximiert das Produktions-Tempo.

## Warum die Veränderung zählt, nicht der absolute Wert

Ein Unternehmen, das von 5 auf 50 Commits pro Tag wechselt, sendet ein viel stärkeres Signal als eines, das stabil bei 200 Commits pro Tag liegt. Die vollständige Methodik, das Reproduktions-Notebook und die statistische Begründung sind auf SSRN veröffentlicht (DOI 10.2139/ssrn.6606558, CC BY 4.0).`,
    englishLinkLabel: "Vollständiges Signal-Glossar (auf Englisch)",
    readTimeLabel: "≈ 2 Min.",
  },
  {
    locale: "de",
    topic: "about",
    title: "Über VC Deal Flow Signal",
    intro:
      "Unabhängiges Forschungsprojekt, das maschinenlesbare Signale aus öffentlichen GitHub-Daten für Venture-Capital-Investoren extrahiert. Diese Seite fasst Projektziel, verantwortliche Person und Interessenkonflikt-Richtlinie zusammen.",
    body: `## Was wir sind

VC Deal Flow Signal (auch GitDealFlow) ist ein unabhängiges Projekt, das die **Informationsasymmetrie** im Venture-Capital-Sourcing adressiert. Während traditioneller Deal Flow auf persönlichen Netzwerken und Empfehlungen beruht, ist unsere Hypothese: Öffentliche GitHub-Daten enthalten reichhaltige Informationen über die Engineering-Beschleunigung finanzierter Startups, und dieses Signal erscheint mehrere Wochen vor der öffentlichen Bekanntgabe der Finanzierungsrunde.

## Drei Kernaktivitäten

1. **Forschung**, empirische Studie über 219 Beobachtungen von 55 finanzierten Startups, auf SSRN veröffentlicht (DOI 10.2139/ssrn.6606558) mit vollständigem Replikations-Kit.
2. **Produkt**, die Ergebnisse werden als MCP-Server, HTTP-API und herunterladbarer Datensatz exponiert. Kompatibel mit Claude Desktop, Cursor, Continue und weiteren Agenten.
3. **Community**, kostenloser wöchentlicher Newsletter, kostenpflichtiger Insider Circle und Zitations-Support für Forschende, Journalist:innen und Analyst:innen.

## Wer dahintersteht

VC Deal Flow Signal wird von **The Data Nerd** (ORCID iD [0009-0002-2222-4112](https://orcid.org/0009-0002-2222-4112)) aus Europa (Griechenland) betrieben. Kontakt: \`signals@gitdealflow.com\`.

## Interessenkonflikt-Richtlinie

- VC Deal Flow Signal ist ein unabhängiges Forschungs- und Abonnement-Unternehmen. Wir investieren nicht direkt in die Startups, die wir ranken.
- Wir akzeptieren keine Zahlungen, um die Platzierung eines Unternehmens zu verbessern.
- Datenkorrekturen werden mit Zeitstempel unter [/corrections](/corrections) veröffentlicht.
- Der Datensatz steht unter CC BY 4.0; ein Attribution-Link genügt.`,
    englishLinkLabel: "Vollständige Über-uns-Seite (auf Englisch)",
    readTimeLabel: "≈ 2 Min.",
  },

  // ----- DUTCH -----
  {
    locale: "nl",
    topic: "signals",
    title: "Signaaltypen",
    intro:
      "De zes kwantitatieve signalen die we volgen op basis van publieke GitHub-data. Elk signaal wordt gemeten als verandering ten opzichte van de eigen baseline van het bedrijf, nooit als absolute waarde.",
    body: `## Wat is een «signaal»

Bij VC Deal Flow Signal is een **signaal** een waarneembare, meetbare verandering in de publieke engineering-activiteit van een startup. Signalen worden altijd gedefinieerd als afwijkingen ten opzichte van de historische baseline van hetzelfde bedrijf, waardoor startups van zeer verschillende omvang vergelijkbaar worden.

## De zes signalen die we volgen

1. **Commit-snelheid**, aantal commits op de hoofdbranch in een rollend venster van 14 dagen, exclusief bots. De basisindicator.
2. **Δ Snelheid**, procentuele verandering tussen twee opeenvolgende vensters van 14 dagen. Dit is ons **primaire ranking-signaal**: het bereik in ons panel loopt van −94 % tot +1.647 %.
3. **Bijdrager-groei**, netto-toename van unieke bijdragers per kwartaal. Detecteert engineering-aanwervingen vóór de formele aankondiging.
4. **Repository-uitbreiding**, opening van nieuwe publieke repositories in de organisatie, met name services of SDK's.
5. **Framework-migratie**, vervanging van de tech-stack in één enkele pull request. In onze data is dit het meest voorkomende signaaltype: ongeveer 75 % van de waarnemingen.
6. **Deploy-frequentie**, cadans van publieke tags en releases. Benadert het productie-tempo.

## Waarom de verandering ertoe doet, niet de absolute waarde

Een bedrijf dat van 5 naar 50 commits per dag gaat, zendt een veel sterker signaal dan een bedrijf dat stabiel op 200 commits per dag blijft. De volledige methodologie, het replicatie-notebook en de statistische onderbouwing zijn gepubliceerd op SSRN (DOI 10.2139/ssrn.6606558, CC BY 4.0).`,
    englishLinkLabel: "Volledige signalenwoordenlijst (in het Engels)",
    readTimeLabel: "≈ 2 min",
  },
  {
    locale: "nl",
    topic: "about",
    title: "Over VC Deal Flow Signal",
    intro:
      "Onafhankelijk onderzoeksproject dat machineleesbare signalen extraheert uit publieke GitHub-data voor venture-capital-investeerders. Deze pagina vat het projectdoel, de verantwoordelijke persoon en het belangenconflict-beleid samen.",
    body: `## Wat we zijn

VC Deal Flow Signal (ook GitDealFlow) is een onafhankelijk project dat de **informatie-asymmetrie** in venture-capital sourcing aanpakt. Waar traditionele deal flow afhankelijk is van persoonlijke netwerken en verwijzingen, is onze hypothese dat publieke GitHub-data rijke informatie bevatten over de engineering-versnelling van gefinancierde startups, en dat dit signaal meerdere weken vóór de publieke aankondiging van de ronde verschijnt.

## Drie kernactiviteiten

1. **Onderzoek**, empirische studie van 219 waarnemingen op 55 gefinancierde startups, gepubliceerd op SSRN (DOI 10.2139/ssrn.6606558) met volledige replicatiekit.
2. **Product**, de bevindingen worden blootgesteld als MCP-server, HTTP-API en downloadbare dataset. Compatibel met Claude Desktop, Cursor, Continue en andere agenten.
3. **Community**, gratis wekelijkse nieuwsbrief, betaalde Insider Circle en citatie-ondersteuning voor onderzoekers, journalisten en analisten.

## Wie erachter zit

VC Deal Flow Signal wordt beheerd door **The Data Nerd** (ORCID iD [0009-0002-2222-4112](https://orcid.org/0009-0002-2222-4112)) vanuit Europa (Griekenland). Contact: \`signals@gitdealflow.com\`.

## Belangenconflict-beleid

- VC Deal Flow Signal is een onafhankelijk onderzoeks- en abonnementsbedrijf. We investeren niet direct in de startups die we rangschikken.
- We accepteren geen betalingen om de positie van een bedrijf te verbeteren.
- Datacorrecties worden met tijdstempel gepubliceerd op [/corrections](/corrections).
- De dataset is gepubliceerd onder CC BY 4.0; een attributie-link is voldoende.`,
    englishLinkLabel: "Volledige Over-pagina (in het Engels)",
    readTimeLabel: "≈ 2 min",
  },

  // ============================================================
  // 2026-05-03 second i18n expansion: signals + about topics for
  // Chinese (Simplified), Korean, Russian. Hand-written native
  // prose, ~250-350 words per body. Skipped hi + ar this pass -
  // technical-finance terminology in those languages needs a
  // native-speaker review before shipping.
  // ============================================================

  // ----- CHINESE (Simplified) -----
  {
    locale: "zh",
    topic: "signals",
    title: "信号类型",
    intro:
      "我们从公开 GitHub 数据中追踪的六种定量信号。每个信号都以企业自身基线的相对变化来衡量,而不是以绝对值。",
    body: `## 什么是「信号」

在 VC Deal Flow Signal 中,**信号**是指可观测、可量化的工程活动变化。我们始终将信号定义为相对于该企业自身历史基线的偏离值,因此可以横向比较体量差异巨大的初创公司。

## 我们追踪的六种信号

1. **提交速率(Commit Velocity)**, 14 天滚动窗口内主分支的提交数量(已剔除机器人)。这是最基础的指标。
2. **Δ 速率(Delta Velocity)**, 相邻两个 14 天窗口之间的百分比变化。这是我们的**主要排序信号**:在我们的面板中,观测范围从 −94% 到 +1,647%。
3. **贡献者增长(Contributor Growth)**, 每季度净新增的独立贡献者数量。可在正式公告之前识别工程招聘活动。
4. **仓库扩张(Repository Expansion)**, 组织内新增公开仓库,尤其是服务或 SDK 类。
5. **框架迁移(Framework Migration)**, 在单个 Pull Request 中替换技术栈。在我们的数据中,这是最常见的信号类型,约占观测的 75%。
6. **部署频率(Deploy Frequency)**, 公开 tag 与 release 的发布节奏,近似生产节奏。

## 为什么变化比绝对值重要

一家从每天 5 个提交跃升到 50 个提交的企业,其信号强度远高于一家长期稳定在每天 200 个提交的企业。完整方法论、复现 notebook 和统计论证已在 SSRN 公开发表(DOI 10.2139/ssrn.6606558,CC BY 4.0)。`,
    englishLinkLabel: "完整的信号术语表(英文版)",
    readTimeLabel: "约 2 分钟",
  },
  {
    locale: "zh",
    topic: "about",
    title: "关于 VC Deal Flow Signal",
    intro:
      "面向风险投资人的独立研究项目,从公开 GitHub 数据中提取机器可读的投资信号。本页概述项目目标、负责人,以及利益冲突政策。",
    body: `## 我们是什么

VC Deal Flow Signal(亦即 GitDealFlow)是一个独立项目,致力于解决风险投资源端的**信息不对称**问题。传统 deal flow 高度依赖人脉网络与转介,我们的假设是:**公开 GitHub 数据中包含丰富的工程加速信息,且该信号通常会比公开融资公告早数周出现**。

## 三项核心活动

1. **研究**, 基于 55 家融资初创公司的 219 次观测的实证研究,已在 SSRN 公开发表(DOI 10.2139/ssrn.6606558),并附完整复现工具包。
2. **产品**, 研究成果通过 MCP 服务器、HTTP API 与可下载数据集对外开放,兼容 Claude Desktop、Cursor、Continue 等代理。
3. **社区**, 免费周刊、付费 Insider Circle,以及面向研究者、记者、分析师的引用支持。

## 谁在运营

VC Deal Flow Signal 由 **The Data Nerd**(ORCID iD [0009-0002-2222-4112](https://orcid.org/0009-0002-2222-4112))在欧洲(希腊)独立运营。联系方式:\`signals@gitdealflow.com\`。

## 利益冲突政策

- VC Deal Flow Signal 是一家独立的研究与订阅公司,不直接投资我们排名中出现的初创公司。
- 我们不接受任何为提升企业排名而支付的费用。
- 数据更正会在 [/corrections](/corrections) 上以时间戳形式公布。
- 数据集以 CC BY 4.0 协议发布,只需附带一条归属链接即可使用。`,
    englishLinkLabel: "完整的「关于」页面(英文版)",
    readTimeLabel: "约 2 分钟",
  },

  // ----- KOREAN -----
  {
    locale: "ko",
    topic: "signals",
    title: "시그널 유형",
    intro:
      "공개 GitHub 데이터에서 추적하는 6가지 정량적 시그널입니다. 각 시그널은 절댓값이 아니라 해당 기업 자체 베이스라인 대비 변화량으로 측정됩니다.",
    body: `## 「시그널」이란

VC Deal Flow Signal에서 **시그널**이란 스타트업의 공개 엔지니어링 활동에서 관찰 가능하고 측정 가능한 변화를 뜻합니다. 시그널은 항상 동일 기업의 과거 베이스라인 대비 편차로 정의되므로, 규모가 크게 다른 스타트업도 동일한 기준으로 비교할 수 있습니다.

## 우리가 추적하는 6가지 시그널

1. **커밋 속도(Commit Velocity)**, 14일 롤링 윈도우 동안 기본 브랜치에 들어온 커밋 수(봇 제외). 가장 기본적인 지표입니다.
2. **Δ 속도(Delta Velocity)**, 인접한 두 14일 윈도우 간의 퍼센트 변화량. 이것이 우리의 **주요 랭킹 시그널**이며, 패널에서 관측된 범위는 −94%에서 +1,647%까지입니다.
3. **컨트리뷰터 증가(Contributor Growth)**, 분기당 신규 단일 컨트리뷰터 순증. 공식 발표 이전의 엔지니어링 채용을 감지합니다.
4. **저장소 확장(Repository Expansion)**, 조직 내 신규 공개 저장소(특히 서비스 또는 SDK)의 개설.
5. **프레임워크 마이그레이션(Framework Migration)**, 단일 PR에서 기술 스택을 교체. 우리 데이터에서 가장 흔한 시그널 유형으로 관측의 약 75%를 차지합니다.
6. **배포 빈도(Deploy Frequency)**, 공개 태그와 릴리스의 케이던스. 프로덕션 속도를 근사합니다.

## 왜 절댓값이 아니라 변화율이 중요한가

하루 5건이던 커밋이 50건으로 증가한 기업이 보내는 시그널은, 안정적으로 하루 200건을 유지하는 기업보다 훨씬 강합니다. 전체 방법론, 재현용 노트북, 통계적 근거는 SSRN에 공개되어 있습니다(DOI 10.2139/ssrn.6606558, CC BY 4.0).`,
    englishLinkLabel: "전체 시그널 용어집 (영문)",
    readTimeLabel: "약 2분",
  },
  {
    locale: "ko",
    topic: "about",
    title: "VC Deal Flow Signal 소개",
    intro:
      "벤처 캐피털 투자자를 위해 공개 GitHub 데이터에서 기계 판독 가능한 시그널을 추출하는 독립 연구 프로젝트입니다. 본 페이지는 프로젝트의 목적, 운영자, 이해상충 정책을 정리합니다.",
    body: `## 우리는 무엇인가

VC Deal Flow Signal(또는 GitDealFlow)은 벤처 캐피털 소싱 영역의 **정보 비대칭** 문제를 다루는 독립 프로젝트입니다. 전통적인 딜플로우는 개인 네트워크와 추천에 크게 의존하는 반면, 우리의 가설은 다음과 같습니다: **공개 GitHub 데이터에는 자금을 조달한 스타트업의 엔지니어링 가속에 관한 풍부한 정보가 담겨 있으며, 그 시그널은 공개 라운드 발표보다 수 주 앞서 나타난다**.

## 세 가지 핵심 활동

1. **연구**, 55개 자금 조달 스타트업에 대한 219건의 관측에 기반한 실증 연구. SSRN에 공개되어 있으며(DOI 10.2139/ssrn.6606558) 전체 재현 키트가 함께 제공됩니다.
2. **제품**, 연구 결과는 MCP 서버, HTTP API, 다운로드 가능한 데이터셋으로 노출됩니다. Claude Desktop, Cursor, Continue 등 에이전트와 호환됩니다.
3. **커뮤니티**, 무료 주간 뉴스레터, 유료 Insider Circle, 그리고 연구자, 기자, 분석가를 위한 인용 지원.

## 누가 운영하는가

VC Deal Flow Signal은 유럽(그리스)에 거점을 둔 **The Data Nerd**(ORCID iD [0009-0002-2222-4112](https://orcid.org/0009-0002-2222-4112))가 독립적으로 운영합니다. 연락처: \`signals@gitdealflow.com\`.

## 이해상충 정책

- VC Deal Flow Signal은 독립적인 리서치 및 구독 기업입니다. 우리가 순위를 매기는 스타트업에 직접 투자하지 않습니다.
- 기업의 순위 개선을 대가로 한 어떠한 금전적 지급도 받지 않습니다.
- 데이터 수정은 [/corrections](/corrections)에 타임스탬프와 함께 게시됩니다.
- 데이터셋은 CC BY 4.0으로 공개되며, 출처 링크 한 줄로 충분합니다.`,
    englishLinkLabel: "전체 「소개」 페이지 (영문)",
    readTimeLabel: "약 2분",
  },

  // ----- RUSSIAN -----
  {
    locale: "ru",
    topic: "signals",
    title: "Типы сигналов",
    intro:
      "Шесть количественных сигналов, которые мы отслеживаем по публичным данным GitHub. Каждый измеряется как изменение относительно собственной базовой линии компании, а не как абсолютное значение.",
    body: `## Что такое «сигнал»

В VC Deal Flow Signal **сигнал**, это наблюдаемое и измеримое изменение в публичной инженерной активности стартапа. Сигналы всегда определяются как отклонения от исторической базовой линии той же компании, что позволяет сравнивать стартапы существенно разного масштаба.

## Шесть сигналов, которые мы отслеживаем

1. **Скорость коммитов (Commit Velocity)**, количество коммитов в основную ветку за скользящее окно в 14 дней, без учёта ботов. Базовый индикатор.
2. **Δ Скорость**, процентное изменение между двумя последовательными 14-дневными окнами. Это наш **основной ранжирующий сигнал**: диапазон, наблюдаемый в нашей панели, простирается от −94 % до +1 647 %.
3. **Рост числа контрибьюторов**, чистый прирост уникальных контрибьюторов за квартал. Обнаруживает инженерный найм до формального объявления.
4. **Расширение репозиториев**, открытие новых публичных репозиториев в организации, прежде всего сервисов или SDK.
5. **Миграция фреймворка**, замена технологического стека в одном Pull Request. В наших данных это самый частый тип сигнала: около 75 % наблюдений.
6. **Частота деплоев**, каденция публичных тегов и релизов. Аппроксимирует темп выхода в продакшн.

## Почему важно изменение, а не абсолютное значение

Компания, перешедшая с 5 коммитов в день на 50, посылает гораздо более сильный сигнал, чем стабильно держащаяся на уровне 200 коммитов в день. Полная методика, ноутбук репликации и статистическое обоснование опубликованы на SSRN (DOI 10.2139/ssrn.6606558, CC BY 4.0).`,
    englishLinkLabel: "Полный глоссарий сигналов (на английском)",
    readTimeLabel: "≈ 2 мин",
  },
  {
    locale: "ru",
    topic: "about",
    title: "О проекте VC Deal Flow Signal",
    intro:
      "Независимый исследовательский проект, который извлекает машиночитаемые сигналы из публичных данных GitHub для венчурных инвесторов. На этой странице кратко изложены цель проекта, ответственное лицо и политика по конфликту интересов.",
    body: `## Что мы из себя представляем

VC Deal Flow Signal (он же GitDealFlow), независимый проект, направленный на устранение **информационной асимметрии** в венчурном сорсинге. В то время как традиционный deal flow зависит от личных сетей и рекомендаций, наша гипотеза состоит в том, что **публичные данные GitHub содержат богатую информацию об инженерном ускорении проинвестированных стартапов, и этот сигнал появляется за несколько недель до публичного объявления раунда**.

## Три основных направления

1. **Исследование**, эмпирическое исследование на 219 наблюдениях по 55 проинвестированным стартапам, опубликованное на SSRN (DOI 10.2139/ssrn.6606558) с полным комплектом репликации.
2. **Продукт**, результаты доступны как MCP-сервер, HTTP-API и загружаемый набор данных. Совместим с Claude Desktop, Cursor, Continue и другими агентами.
3. **Сообщество**, бесплатная еженедельная рассылка, платный Insider Circle и поддержка цитирования для исследователей, журналистов и аналитиков.

## Кто стоит за проектом

VC Deal Flow Signal независимо ведёт **The Data Nerd** (ORCID iD [0009-0002-2222-4112](https://orcid.org/0009-0002-2222-4112)) из Европы (Греция). Контакт: \`signals@gitdealflow.com\`.

## Политика по конфликту интересов

- VC Deal Flow Signal, независимая исследовательская и подписочная компания. Мы не инвестируем напрямую в стартапы, которые ранжируем.
- Мы не принимаем платежей за улучшение позиции какой-либо компании.
- Исправления данных публикуются на [/corrections](/corrections) с временной меткой.
- Набор данных распространяется по лицензии CC BY 4.0; достаточно одной ссылки атрибуции.`,
    englishLinkLabel: "Полная страница «О проекте» (на английском)",
    readTimeLabel: "≈ 2 мин",
  },

  // ============================================================
  // 2026-05-08 expansion: signals + about for hi + ar.
  // Closes the gap so all 12 locales now carry the universal core
  // of {methodology, glossary, faq, signals, about}, i18n SEO
  // surface goes 36 → 40 hand-curated entries.
  // ============================================================

  // ----- HINDI -----
  {
    locale: "hi",
    topic: "signals",
    title: "सिग्नल के प्रकार",
    intro:
      "GitHub के सार्वजनिक डेटा से हम जो छह मात्रात्मक सिग्नल ट्रैक करते हैं। प्रत्येक सिग्नल को कंपनी के अपने ऐतिहासिक बेसलाइन के सापेक्ष परिवर्तन के रूप में मापा जाता है, कभी निरपेक्ष मान के रूप में नहीं।",
    body: `## «सिग्नल» का क्या अर्थ है

VC Deal Flow Signal में **सिग्नल** का अर्थ है किसी स्टार्टअप की सार्वजनिक इंजीनियरिंग गतिविधि में एक देखने योग्य, मापने योग्य परिवर्तन। सिग्नल को हमेशा उसी कंपनी की ऐतिहासिक बेसलाइन के सापेक्ष विचलन के रूप में परिभाषित किया जाता है, इसी कारण बहुत भिन्न आकार की कंपनियों की भी तुलना संभव हो जाती है।

## जिन छह सिग्नल को हम ट्रैक करते हैं

1. **कमिट वेलॉसिटी (Commit Velocity)**, 14 दिनों की रोलिंग विंडो में डिफ़ॉल्ट ब्रांच पर बॉट-छँटे कमिट्स की संख्या। बेसलाइन मीट्रिक।
2. **Δ वेलॉसिटी**, दो आसन्न 14-दिन विंडोज़ के बीच प्रतिशत परिवर्तन। यह हमारा **मुख्य रैंकिंग सिग्नल** है: हमारे पैनल में देखी गई सीमा −94% से +1,647% तक है।
3. **कॉन्ट्रिब्यूटर वृद्धि**, प्रति तिमाही अद्वितीय कॉन्ट्रिब्यूटरों का शुद्ध जोड़। औपचारिक घोषणा से पहले इंजीनियरिंग हायरिंग को पकड़ता है।
4. **रिपॉज़िटरी विस्तार**, संगठन में नई सार्वजनिक रिपॉज़िटरी का खुलना, ख़ासकर सर्विस या SDK वाले।
5. **फ़्रेमवर्क माइग्रेशन**, एकल PR में टेक स्टैक का प्रतिस्थापन। हमारे डेटा में यह सबसे अधिक देखा जाने वाला सिग्नल प्रकार है, लगभग 75% अवलोकन।
6. **डिप्लॉय फ़्रीक्वेंसी**, सार्वजनिक टैग और रिलीज़ की कैडेंस। प्रोडक्शन की लय का अनुमान लगाती है।

## बदलाव क्यों मायने रखता है, मूल्य नहीं

जो कंपनी प्रतिदिन 5 कमिट से 50 कमिट तक पहुँचती है, वह स्थिर 200 कमिट प्रतिदिन वाली कंपनी से कहीं अधिक प्रबल सिग्नल भेजती है। पूर्ण मेथडोलॉजी, रेप्लिकेशन नोटबुक और सांख्यिकीय औचित्य SSRN पर अंग्रेज़ी में प्रकाशित हैं (DOI 10.2139/ssrn.6606558, CC BY 4.0)।`,
    englishLinkLabel: "सिग्नलों की पूरी शब्दावली (अंग्रेज़ी)",
    readTimeLabel: "लगभग 2 मिनट",
  },
  {
    locale: "hi",
    topic: "about",
    title: "VC Deal Flow Signal के बारे में",
    intro:
      "एक स्वतंत्र अनुसंधान प्रोजेक्ट, जो वेंचर कैपिटल निवेशकों के लिए सार्वजनिक GitHub डेटा से मशीन-पठनीय सिग्नल निकालता है। यह पृष्ठ प्रोजेक्ट के उद्देश्य, ज़िम्मेदार व्यक्ति और हितों के टकराव संबंधी नीति को संक्षेप में प्रस्तुत करता है।",
    body: `## हम क्या हैं

VC Deal Flow Signal (या GitDealFlow) एक स्वतंत्र प्रोजेक्ट है, जो वेंचर कैपिटल सोर्सिंग में मौजूद **सूचना असंतुलन** को संबोधित करता है। पारंपरिक डील फ़्लो व्यक्तिगत नेटवर्क और रेफ़रल पर निर्भर करता है; हमारी परिकल्पना यह है कि **सार्वजनिक GitHub डेटा फ़ंडेड स्टार्टअप्स की इंजीनियरिंग एक्सेलरेशन के बारे में समृद्ध जानकारी रखता है, और यह सिग्नल किसी सार्वजनिक राउंड घोषणा से कई हफ़्ते पहले प्रकट होता है**।

## तीन मुख्य गतिविधियाँ

1. **अनुसंधान**, फ़ंडेड 55 स्टार्टअप्स पर 219 अवलोकनों का अनुभवजन्य अध्ययन, SSRN पर पूर्ण रेप्लिकेशन किट के साथ प्रकाशित (DOI 10.2139/ssrn.6606558)।
2. **उत्पाद**, परिणाम MCP सर्वर, HTTP API और डाउनलोड योग्य डेटासेट के रूप में उपलब्ध। Claude Desktop, Cursor, Continue और अन्य एजेंटों के साथ संगत।
3. **समुदाय**, निःशुल्क साप्ताहिक न्यूज़लेटर, सशुल्क Insider Circle, तथा शोधकर्ताओं, पत्रकारों और विश्लेषकों के लिए उद्धरण समर्थन।

## इसे चलाता कौन है

VC Deal Flow Signal को यूरोप (ग्रीस) से **The Data Nerd** स्वतंत्र रूप से संचालित करते हैं (ORCID iD [0009-0002-2222-4112](https://orcid.org/0009-0002-2222-4112))। संपर्क: \`signals@gitdealflow.com\`।

## हितों के टकराव की नीति

- VC Deal Flow Signal एक स्वतंत्र अनुसंधान एवं सब्सक्रिप्शन कंपनी है। हम जिन स्टार्टअप्स की रैंकिंग करते हैं, उनमें प्रत्यक्ष रूप से निवेश नहीं करते।
- किसी कंपनी की स्थिति सुधारने के लिए कोई भुगतान स्वीकार नहीं किया जाता।
- डेटा सुधार [/corrections](/corrections) पर टाइमस्टैम्प के साथ प्रकाशित होते हैं।
- डेटासेट CC BY 4.0 लाइसेंस के तहत वितरित है; एक एट्रिब्यूशन लिंक पर्याप्त है।`,
    englishLinkLabel: "पूर्ण «हमारे बारे में» पृष्ठ (अंग्रेज़ी)",
    readTimeLabel: "लगभग 2 मिनट",
  },

  // ----- ARABIC -----
  {
    locale: "ar",
    topic: "signals",
    title: "أنواع الإشارات",
    intro:
      "الإشارات الكميّة الست التي نتتبّعها انطلاقًا من بيانات GitHub العامة. تُقاس كل إشارة بوصفها تغيّرًا نسبةً إلى الخط القاعدي للشركة نفسها، لا قيمةً مطلقة.",
    body: `## ما المقصود بـ«الإشارة»

في VC Deal Flow Signal، تعني **الإشارة** تغيّرًا قابلًا للملاحظة والقياس في النشاط الهندسي العام لإحدى الشركات الناشئة. تُعرَّف الإشارات دائمًا بوصفها انحرافات عن الخط القاعدي التاريخي للشركة ذاتها، ما يتيح المقارنة بين شركات تختلف أحجامها اختلافًا كبيرًا.

## الإشارات الست التي نتتبّعها

1. **سرعة الـ commits**, عدد الـ commits على الفرع الافتراضي ضمن نافذة متحركة لـ 14 يومًا، باستثناء الـ bots. هي المؤشر المرجعي.
2. **Δ السرعة**, التغيّر النسبي بين نافذتين متعاقبتين مدّة كل منهما 14 يومًا. هذه هي **إشارة التصنيف الرئيسية** لدينا: المدى المُلاحَظ في لوحتنا يمتد من −94% إلى +1,647%.
3. **نمو المساهمين**, صافي إضافة مساهمين فريدين خلال الربع. يكشف عن التوظيف الهندسي قبل الإعلان الرسمي.
4. **توسّع المستودعات**, افتتاح مستودعات عامة جديدة في المؤسسة، خصوصًا الخدمات أو الـ SDKs.
5. **ترحيل إطار العمل**, استبدال الـ tech stack ضمن Pull Request واحد. في بياناتنا، هذا أكثر أنواع الإشارات شيوعًا, نحو 75% من الملاحظات.
6. **وتيرة النشر**, إيقاع الوسوم والإصدارات العامة. يقارب وتيرة الانتقال إلى الإنتاج.

## لماذا التغيّر هو ما يهم، لا القيمة المطلقة

شركة تنتقل من 5 commits يوميًا إلى 50 تُرسل إشارة أقوى بكثير من شركة مستقرة عند 200 commit يوميًا. المنهجية الكاملة، ودفتر إعادة الإنتاج، والتبرير الإحصائي منشورة بالإنجليزية على SSRN (DOI 10.2139/ssrn.6606558، CC BY 4.0).`,
    englishLinkLabel: "المسرد الكامل للإشارات (الإنجليزية)",
    readTimeLabel: "حوالي دقيقتين",
  },
  {
    locale: "ar",
    topic: "about",
    title: "نبذة عن VC Deal Flow Signal",
    intro:
      "مشروع بحثي مستقل يستخرج إشارات قابلة للقراءة الآلية من بيانات GitHub العامة لمستثمري رأس المال الجريء. تلخّص هذه الصفحة هدف المشروع، والشخص المسؤول، وسياسة تعارض المصالح.",
    body: `## ما نحن

VC Deal Flow Signal (أو GitDealFlow) هو مشروع مستقل يعالج **عدم تماثل المعلومات** في تدفّق الصفقات لدى رأس المال الجريء. في حين يعتمد deal flow التقليدي على الشبكات الشخصية والترشيحات، فإن فرضيتنا هي أن **بيانات GitHub العامة تحوي معلومات ثرية عن التسارع الهندسي للشركات الناشئة الممولة، وأن هذه الإشارة تظهر قبل الإعلان العام عن الجولة بأسابيع عدّة**.

## ثلاثة أنشطة محورية

1. **البحث**, دراسة تجريبية على 219 ملاحظة لـ 55 شركة ناشئة ممولة، منشورة على SSRN (DOI 10.2139/ssrn.6606558) مع حزمة إعادة إنتاج كاملة.
2. **المنتج**, تُتاح النتائج عبر خادم MCP، وواجهة HTTP، ومجموعة بيانات قابلة للتنزيل. متوافق مع Claude Desktop وCursor وContinue ووكلاء آخرين.
3. **المجتمع**, نشرة أسبوعية مجانية، وحلقة Insider Circle مدفوعة، ودعم استشهادي للباحثين والصحفيين والمحللين.

## من يقف خلف المشروع

يدير VC Deal Flow Signal بصورة مستقلة **The Data Nerd** (ORCID iD [0009-0002-2222-4112](https://orcid.org/0009-0002-2222-4112)) من أوروبا (اليونان). للتواصل: \`signals@gitdealflow.com\`.

## سياسة تعارض المصالح

- VC Deal Flow Signal شركة بحث واشتراك مستقلة. لا نستثمر مباشرة في الشركات الناشئة التي نصنّفها.
- لا نقبل أي مدفوعات لتحسين موقع شركة بعينها.
- تُنشر تصحيحات البيانات على [/corrections](/corrections) مع ختم زمني.
- تُوزَّع مجموعة البيانات وفق رخصة CC BY 4.0؛ يكفي رابط إسناد واحد.`,
    englishLinkLabel: "صفحة «نبذة عنّا» الكاملة (الإنجليزية)",
    readTimeLabel: "حوالي دقيقتين",
  },

  // ============================================================
  // 2026-05-31 topic-parity expansion: research + citations + pricing
  // for the 11 non-ja locales. Brings every locale to the same 8-topic
  // floor that ja already had (the 5 long-form ja research findings stay
  // ja-only as the deep-market differentiator). Hand-written native prose,
  // ~200-280 words each, pointing back to the canonical English
  // /research, /citation-guide and /pricing pages. NOT machine-translated.
  // ============================================================

  // ----- SPANISH -----
  {
    locale: "es",
    topic: "research",
    title: "Resumen de la investigación",
    intro:
      "Resumen en español de los 30 hallazgos del estudio empírico publicado en SSRN (DOI 10.2139/ssrn.6606558). Las páginas de detalle de cada hallazgo son canónicas en inglés.",
    body: `## El estudio en una frase

Analizamos **219 observaciones de señal sobre 55 startups con financiación de venture capital** y agrupamos los resultados en cinco categorías: distribución de velocidad, variación de velocidad, tipos de señal, distribución geográfica y sectores/valores atípicos.

## Cifras clave

- **Velocidad de commits mediana: 71** en una ventana de 14 días. Es la definición cuantitativa de «normal» para una startup financiada.
- **Media: 173**, 2,4× la mediana-, lo que revela una distribución muy sesgada hacia arriba. Use la mediana, no la media.
- **Percentil 90: 392 commits** en 14 días.
- **La migración de framework domina: el 75 %** de las señales. Contradice la heurística «velocidad = contratación».
- **Las ráfagas de contratación son solo el 9 %**, y la construcción de infraestructura apenas el 4 %.
- **Solo el 49 %** de las startups financiadas muestran crecimiento positivo de velocidad.
- **Reparto geográfico:** EE. UU. 56 %, UE infrarrepresentada (22 %), LATAM sobrerrepresentada.
- **Variación trimestral de velocidad: de −94 % a +1.647 %.**

## Acceso completo

Los 30 hallazgos detallados (en inglés) están en \`/research\`. El artículo completo está en SSRN (DOI 10.2139/ssrn.6606558) y el conjunto de datos en Hugging Face (\`the-data-nerd/vc-deal-flow-signal\`, CC BY 4.0).`,
    englishLinkLabel: "Página completa de investigación (en inglés)",
    readTimeLabel: "≈ 3 min",
  },
  {
    locale: "es",
    topic: "citations",
    title: "Guía de citación",
    intro:
      "Cómo citar la investigación, el conjunto de datos y los hallazgos individuales de VC Deal Flow Signal en APA, MLA, Chicago, BibTeX y RIS.",
    body: `## Qué se puede citar

1. **El artículo de metodología** (SSRN), para los hallazgos generales y el diseño del estudio.
2. **El conjunto de datos** (Hugging Face, CC BY 4.0), si reanaliza los datos originales; basta un enlace de atribución.
3. **Un hallazgo concreto** (página de artículo), para citar una cifra específica.

## APA 7 (artículo)

Kondratyuk, M. (2026). VC Deal Flow Signal: GitHub Engineering Acceleration as a Leading Indicator of Venture Funding. SSRN. https://doi.org/10.2139/ssrn.6606558

## Otros formatos y API de citación

MLA 9, Chicago 17, BibTeX y RIS están disponibles en la guía completa. Cada página de hallazgo expone una API de citación en \`/api/cite/{format}/{slug}\` con los formatos \`apa\`, \`mla\`, \`chicago\`, \`bibtex\`, \`ris\` y \`json\`. Guía completa en [/citation-guide](/citation-guide).`,
    englishLinkLabel: "Guía de citación completa (en inglés)",
    readTimeLabel: "≈ 2 min",
  },
  {
    locale: "es",
    topic: "pricing",
    title: "Precios",
    intro:
      "Los tres niveles de VC Deal Flow Signal: gratuito, Insider Circle y Sector Sweep. Qué incluye cada uno, para quién es y cómo se paga.",
    body: `## Tres niveles

1. **Gratuito**, las 5 herramientas MCP + el boletín semanal. Gratis de forma permanente: son el motor de distribución, no una fuente de ingresos.
2. **Insider Circle**, grupo privado de Telegram con cuota mensual, acceso anticipado de 24 a 72 horas a las señales principales. Por invitación; consulte el precio actual en \`signals@gitdealflow.com\`.
3. **Sector Sweep**, **1.997 €** (pago único, IVA aparte): análisis completo de 6 semanas de un sector a elegir, informe PDF de 15-25 páginas, datos en bruto (Parquet) y una llamada de seguimiento de 30 minutos.

## Pago

Stripe (Visa, Mastercard, American Express), domiciliación SEPA para clientes europeos y facturación para empresas. IVA de la UE: inversión del sujeto pasivo para empresas con número de IVA válido; sin IVA fuera de la UE.

## Contacto

Consultas y planes corporativos: \`signals@gitdealflow.com\`. La página de precios canónica en inglés está en [/pricing](/pricing).`,
    englishLinkLabel: "Página de precios completa (en inglés)",
    readTimeLabel: "≈ 2 min",
  },

  // ----- FRENCH -----
  {
    locale: "fr",
    topic: "research",
    title: "Synthèse de la recherche",
    intro:
      "Résumé en français des 30 résultats de l'étude empirique publiée sur SSRN (DOI 10.2139/ssrn.6606558). Les pages détaillées de chaque résultat font foi en anglais.",
    body: `## L'étude en une phrase

Nous avons analysé **219 observations de signaux portant sur 55 startups financées** et réparti les résultats en cinq catégories : distribution de la vitesse, variation de la vitesse, types de signaux, répartition géographique et secteurs/valeurs aberrantes.

## Chiffres clés

- **Vitesse de commits médiane : 71** sur une fenêtre de 14 jours. C'est la définition chiffrée du « normal » pour une startup financée.
- **Moyenne : 173**, 2,4× la médiane-, ce qui révèle une distribution fortement asymétrique vers le haut. Utilisez la médiane, pas la moyenne.
- **90e centile : 392 commits** en 14 jours.
- **La migration de framework domine : 75 %** des signaux. Cela contredit l'heuristique « vitesse = recrutement ».
- **Les vagues de recrutement ne représentent que 9 %**, et la construction d'infrastructure à peine 4 %.
- **Seules 49 %** des startups financées affichent une croissance positive de leur vitesse.
- **Répartition géographique :** États-Unis 56 %, UE sous-représentée (22 %), LATAM surreprésentée.
- **Variation trimestrielle de la vitesse : de −94 % à +1 647 %.**

## Accès complet

Les 30 résultats détaillés (en anglais) sont sur \`/research\`. L'article complet est sur SSRN (DOI 10.2139/ssrn.6606558) et le jeu de données sur Hugging Face (\`the-data-nerd/vc-deal-flow-signal\`, CC BY 4.0).`,
    englishLinkLabel: "Page de recherche complète (en anglais)",
    readTimeLabel: "≈ 3 min",
  },
  {
    locale: "fr",
    topic: "citations",
    title: "Guide de citation",
    intro:
      "Comment citer la recherche, le jeu de données et les résultats individuels de VC Deal Flow Signal en APA, MLA, Chicago, BibTeX et RIS.",
    body: `## Ce qui peut être cité

1. **L'article de méthodologie** (SSRN), pour les résultats globaux et la conception de l'étude.
2. **Le jeu de données** (Hugging Face, CC BY 4.0), si vous réanalysez les données brutes ; un lien d'attribution suffit.
3. **Un résultat précis** (page d'article), pour citer un chiffre spécifique.

## APA 7 (article)

Kondratyuk, M. (2026). VC Deal Flow Signal: GitHub Engineering Acceleration as a Leading Indicator of Venture Funding. SSRN. https://doi.org/10.2139/ssrn.6606558

## Autres formats et API de citation

MLA 9, Chicago 17, BibTeX et RIS sont disponibles dans le guide complet. Chaque page de résultat expose une API de citation à \`/api/cite/{format}/{slug}\` avec les formats \`apa\`, \`mla\`, \`chicago\`, \`bibtex\`, \`ris\` et \`json\`. Guide complet sur [/citation-guide](/citation-guide).`,
    englishLinkLabel: "Guide de citation complet (en anglais)",
    readTimeLabel: "≈ 2 min",
  },
  {
    locale: "fr",
    topic: "pricing",
    title: "Tarifs",
    intro:
      "Les trois offres de VC Deal Flow Signal : gratuite, Insider Circle et Sector Sweep. Ce que chacune inclut, à qui elle s'adresse et comment payer.",
    body: `## Trois offres

1. **Gratuite**, les 5 outils MCP + la newsletter hebdomadaire. Gratuit de façon permanente : c'est le moteur de distribution, pas une source de revenus.
2. **Insider Circle**, groupe Telegram privé sur abonnement mensuel, accès anticipé de 24 à 72 heures aux principaux signaux. Sur invitation ; demandez le tarif actuel à \`signals@gitdealflow.com\`.
3. **Sector Sweep**, **1 997 €** (paiement unique, hors TVA) : analyse complète de 6 semaines d'un secteur au choix, rapport PDF de 15 à 25 pages, données brutes (Parquet) et un appel de suivi de 30 minutes.

## Paiement

Stripe (Visa, Mastercard, American Express), prélèvement SEPA pour les clients européens et facturation pour les entreprises. TVA UE : autoliquidation pour les entreprises disposant d'un numéro de TVA valide ; pas de TVA hors UE.

## Contact

Questions et offres entreprises : \`signals@gitdealflow.com\`. La page de tarifs canonique en anglais est sur [/pricing](/pricing).`,
    englishLinkLabel: "Page de tarifs complète (en anglais)",
    readTimeLabel: "≈ 2 min",
  },

  // ----- PORTUGUESE -----
  {
    locale: "pt",
    topic: "research",
    title: "Resumo da pesquisa",
    intro:
      "Resumo em português dos 30 achados do estudo empírico publicado no SSRN (DOI 10.2139/ssrn.6606558). As páginas detalhadas de cada achado são canônicas em inglês.",
    body: `## O estudo em uma frase

Analisamos **219 observações de sinal sobre 55 startups com financiamento de venture capital** e organizamos os resultados em cinco categorias: distribuição de velocidade, variação de velocidade, tipos de sinal, distribuição geográfica e setores/valores atípicos.

## Números-chave

- **Velocidade de commits mediana: 71** em uma janela de 14 dias. É a definição quantitativa de "normal" para uma startup financiada.
- **Média: 173**, 2,4× a mediana-, revelando uma distribuição fortemente assimétrica para cima. Use a mediana, não a média.
- **Percentil 90: 392 commits** em 14 dias.
- **A migração de framework domina: 75 %** dos sinais. Contraria a heurística "velocidade = contratação".
- **Picos de contratação são apenas 9 %**, e construção de infraestrutura mal chega a 4 %.
- **Apenas 49 %** das startups financiadas apresentam crescimento positivo de velocidade.
- **Distribuição geográfica:** EUA 56 %, UE sub-representada (22 %), LATAM sobre-representada.
- **Variação trimestral de velocidade: de −94 % a +1.647 %.**

## Acesso completo

Os 30 achados detalhados (em inglês) estão em \`/research\`. O artigo completo está no SSRN (DOI 10.2139/ssrn.6606558) e o conjunto de dados no Hugging Face (\`the-data-nerd/vc-deal-flow-signal\`, CC BY 4.0).`,
    englishLinkLabel: "Página completa de pesquisa (em inglês)",
    readTimeLabel: "≈ 3 min",
  },
  {
    locale: "pt",
    topic: "citations",
    title: "Guia de citação",
    intro:
      "Como citar a pesquisa, o conjunto de dados e os achados individuais do VC Deal Flow Signal em APA, MLA, Chicago, BibTeX e RIS.",
    body: `## O que pode ser citado

1. **O artigo de metodologia** (SSRN), para os achados gerais e o desenho do estudo.
2. **O conjunto de dados** (Hugging Face, CC BY 4.0), se você reanalisar os dados brutos; basta um link de atribuição.
3. **Um achado específico** (página de artigo), para citar um número específico.

## APA 7 (artigo)

Kondratyuk, M. (2026). VC Deal Flow Signal: GitHub Engineering Acceleration as a Leading Indicator of Venture Funding. SSRN. https://doi.org/10.2139/ssrn.6606558

## Outros formatos e API de citação

MLA 9, Chicago 17, BibTeX e RIS estão disponíveis no guia completo. Cada página de achado expõe uma API de citação em \`/api/cite/{format}/{slug}\` com os formatos \`apa\`, \`mla\`, \`chicago\`, \`bibtex\`, \`ris\` e \`json\`. Guia completo em [/citation-guide](/citation-guide).`,
    englishLinkLabel: "Guia de citação completo (em inglês)",
    readTimeLabel: "≈ 2 min",
  },
  {
    locale: "pt",
    topic: "pricing",
    title: "Preços",
    intro:
      "Os três níveis do VC Deal Flow Signal: gratuito, Insider Circle e Sector Sweep. O que cada um inclui, para quem é e como pagar.",
    body: `## Três níveis

1. **Gratuito**, as 5 ferramentas MCP + a newsletter semanal. Gratuito permanentemente: é o motor de distribuição, não uma fonte de receita.
2. **Insider Circle**, grupo privado no Telegram por assinatura mensal, acesso antecipado de 24 a 72 horas aos principais sinais. Por convite; consulte o preço atual em \`signals@gitdealflow.com\`.
3. **Sector Sweep**, **€ 1.997** (pagamento único, sem IVA): análise completa de 6 semanas de um setor à escolha, relatório PDF de 15 a 25 páginas, dados brutos (Parquet) e uma chamada de acompanhamento de 30 minutos.

## Pagamento

Stripe (Visa, Mastercard, American Express), débito SEPA para clientes europeus e faturamento para empresas. IVA da UE: autoliquidação para empresas com número de IVA válido; sem IVA fora da UE.

## Contato

Dúvidas e planos corporativos: \`signals@gitdealflow.com\`. A página de preços canônica em inglês está em [/pricing](/pricing).`,
    englishLinkLabel: "Página de preços completa (em inglês)",
    readTimeLabel: "≈ 2 min",
  },

  // ----- ITALIAN -----
  {
    locale: "it",
    topic: "research",
    title: "Sintesi della ricerca",
    intro:
      "Riepilogo in italiano dei 30 risultati dello studio empirico pubblicato su SSRN (DOI 10.2139/ssrn.6606558). Le pagine di dettaglio di ciascun risultato fanno fede in inglese.",
    body: `## Lo studio in una frase

Abbiamo analizzato **219 osservazioni di segnale su 55 startup finanziate da venture capital** e raggruppato i risultati in cinque categorie: distribuzione della velocità, variazione della velocità, tipi di segnale, distribuzione geografica e settori/valori anomali.

## Numeri chiave

- **Velocità di commit mediana: 71** in una finestra di 14 giorni. È la definizione quantitativa di "normale" per una startup finanziata.
- **Media: 173**, 2,4× la mediana-, indice di una distribuzione fortemente asimmetrica verso l'alto. Usate la mediana, non la media.
- **90° percentile: 392 commit** in 14 giorni.
- **La migrazione di framework domina: il 75 %** dei segnali. Contraddice l'euristica "velocità = assunzioni".
- **Le ondate di assunzioni sono solo il 9 %**, e la costruzione di infrastruttura appena il 4 %.
- **Solo il 49 %** delle startup finanziate mostra una crescita positiva della velocità.
- **Distribuzione geografica:** USA 56 %, UE sottorappresentata (22 %), LATAM sovrarappresentata.
- **Variazione trimestrale della velocità: da −94 % a +1.647 %.**

## Accesso completo

I 30 risultati dettagliati (in inglese) sono su \`/research\`. L'articolo completo è su SSRN (DOI 10.2139/ssrn.6606558) e il dataset su Hugging Face (\`the-data-nerd/vc-deal-flow-signal\`, CC BY 4.0).`,
    englishLinkLabel: "Pagina di ricerca completa (in inglese)",
    readTimeLabel: "≈ 3 min",
  },
  {
    locale: "it",
    topic: "citations",
    title: "Guida alla citazione",
    intro:
      "Come citare la ricerca, il dataset e i singoli risultati di VC Deal Flow Signal in APA, MLA, Chicago, BibTeX e RIS.",
    body: `## Cosa si può citare

1. **L'articolo metodologico** (SSRN), per i risultati complessivi e il disegno dello studio.
2. **Il dataset** (Hugging Face, CC BY 4.0), se rianalizzate i dati grezzi; è sufficiente un link di attribuzione.
3. **Un singolo risultato** (pagina articolo), per citare un dato specifico.

## APA 7 (articolo)

Kondratyuk, M. (2026). VC Deal Flow Signal: GitHub Engineering Acceleration as a Leading Indicator of Venture Funding. SSRN. https://doi.org/10.2139/ssrn.6606558

## Altri formati e API di citazione

MLA 9, Chicago 17, BibTeX e RIS sono disponibili nella guida completa. Ogni pagina di risultato espone un'API di citazione su \`/api/cite/{format}/{slug}\` con i formati \`apa\`, \`mla\`, \`chicago\`, \`bibtex\`, \`ris\` e \`json\`. Guida completa su [/citation-guide](/citation-guide).`,
    englishLinkLabel: "Guida alla citazione completa (in inglese)",
    readTimeLabel: "≈ 2 min",
  },
  {
    locale: "it",
    topic: "pricing",
    title: "Prezzi",
    intro:
      "I tre livelli di VC Deal Flow Signal: gratuito, Insider Circle e Sector Sweep. Cosa include ciascuno, a chi si rivolge e come si paga.",
    body: `## Tre livelli

1. **Gratuito**, i 5 strumenti MCP + la newsletter settimanale. Gratuito in modo permanente: sono il motore di distribuzione, non una fonte di ricavi.
2. **Insider Circle**, gruppo Telegram privato con abbonamento mensile, accesso anticipato di 24-72 ore ai segnali principali. Su invito; chiedete il prezzo attuale a \`signals@gitdealflow.com\`.
3. **Sector Sweep**, **1.997 €** (pagamento una tantum, IVA esclusa): analisi completa di 6 settimane di un settore a scelta, report PDF di 15-25 pagine, dati grezzi (Parquet) e una call di follow-up di 30 minuti.

## Pagamento

Stripe (Visa, Mastercard, American Express), addebito SEPA per i clienti europei e fatturazione per le aziende. IVA UE: inversione contabile per le aziende con partita IVA valida; nessuna IVA fuori dall'UE.

## Contatto

Domande e piani aziendali: \`signals@gitdealflow.com\`. La pagina prezzi canonica in inglese è su [/pricing](/pricing).`,
    englishLinkLabel: "Pagina prezzi completa (in inglese)",
    readTimeLabel: "≈ 2 min",
  },

  // ----- GERMAN -----
  {
    locale: "de",
    topic: "research",
    title: "Forschungsüberblick",
    intro:
      "Deutsche Zusammenfassung der 30 Ergebnisse der auf SSRN veröffentlichten empirischen Studie (DOI 10.2139/ssrn.6606558). Die Detailseiten zu jedem Ergebnis sind auf Englisch maßgeblich.",
    body: `## Die Studie in einem Satz

Wir haben **219 Signalbeobachtungen zu 55 risikokapitalfinanzierten Startups** analysiert und die Ergebnisse in fünf Kategorien gegliedert: Geschwindigkeitsverteilung, Geschwindigkeitsveränderung, Signaltypen, geografische Verteilung sowie Sektoren/Ausreißer.

## Kernzahlen

- **Mediane Commit-Geschwindigkeit: 71** in einem 14-Tage-Fenster. Das ist die quantitative Definition von „normal" für ein finanziertes Startup.
- **Mittelwert: 173**, das 2,4-Fache des Medians-, was eine stark rechtsschiefe Verteilung belegt. Nutzen Sie den Median, nicht den Mittelwert.
- **90. Perzentil: 392 Commits** in 14 Tagen.
- **Framework-Migration dominiert: 75 %** der Signale. Das widerlegt die Heuristik „Geschwindigkeit = Einstellungen".
- **Einstellungswellen machen nur 9 %** aus, Infrastrukturaufbau lediglich 4 %.
- **Nur 49 %** der finanzierten Startups zeigen positives Geschwindigkeitswachstum.
- **Geografische Verteilung:** USA 56 %, EU unterrepräsentiert (22 %), LATAM überrepräsentiert.
- **Quartalsweise Geschwindigkeitsveränderung: von −94 % bis +1.647 %.**

## Vollständiger Zugang

Alle 30 detaillierten Ergebnisse (auf Englisch) finden Sie unter \`/research\`. Das vollständige Papier liegt auf SSRN (DOI 10.2139/ssrn.6606558), der Datensatz auf Hugging Face (\`the-data-nerd/vc-deal-flow-signal\`, CC BY 4.0).`,
    englishLinkLabel: "Vollständige Forschungsseite (auf Englisch)",
    readTimeLabel: "≈ 3 Min.",
  },
  {
    locale: "de",
    topic: "citations",
    title: "Zitierleitfaden",
    intro:
      "So zitieren Sie die Forschung, den Datensatz und einzelne Ergebnisse von VC Deal Flow Signal in APA, MLA, Chicago, BibTeX und RIS.",
    body: `## Was sich zitieren lässt

1. **Das Methodik-Papier** (SSRN), für die Gesamtergebnisse und das Studiendesign.
2. **Den Datensatz** (Hugging Face, CC BY 4.0), wenn Sie die Rohdaten neu auswerten; ein Attributionslink genügt.
3. **Ein einzelnes Ergebnis** (Artikelseite), um eine konkrete Zahl zu zitieren.

## APA 7 (Papier)

Kondratyuk, M. (2026). VC Deal Flow Signal: GitHub Engineering Acceleration as a Leading Indicator of Venture Funding. SSRN. https://doi.org/10.2139/ssrn.6606558

## Weitere Formate und Zitations-API

MLA 9, Chicago 17, BibTeX und RIS finden Sie im vollständigen Leitfaden. Jede Ergebnisseite stellt eine Zitations-API unter \`/api/cite/{format}/{slug}\` bereit, mit den Formaten \`apa\`, \`mla\`, \`chicago\`, \`bibtex\`, \`ris\` und \`json\`. Vollständiger Leitfaden unter [/citation-guide](/citation-guide).`,
    englishLinkLabel: "Vollständiger Zitierleitfaden (auf Englisch)",
    readTimeLabel: "≈ 2 Min.",
  },
  {
    locale: "de",
    topic: "pricing",
    title: "Preise",
    intro:
      "Die drei Stufen von VC Deal Flow Signal: kostenlos, Insider Circle und Sector Sweep. Was jede Stufe enthält, für wen sie gedacht ist und wie bezahlt wird.",
    body: `## Drei Stufen

1. **Kostenlos**, die 5 MCP-Tools + der wöchentliche Newsletter. Dauerhaft kostenlos: Sie sind der Distributionsmotor, keine Einnahmequelle.
2. **Insider Circle**, private Telegram-Gruppe mit monatlicher Gebühr, 24- bis 72-stündiger Vorabzugang zu den wichtigsten Signalen. Auf Einladung; den aktuellen Preis erfragen Sie unter \`signals@gitdealflow.com\`.
3. **Sector Sweep**, **1.997 €** (Einmalzahlung, zzgl. MwSt.): vollständige 6-Wochen-Analyse eines Sektors Ihrer Wahl, PDF-Bericht mit 15-25 Seiten, Rohdaten (Parquet) und ein 30-minütiges Follow-up-Gespräch.

## Zahlung

Stripe (Visa, Mastercard, American Express), SEPA-Lastschrift für europäische Kunden und Rechnungsstellung für Unternehmen. EU-Umsatzsteuer: Reverse-Charge für Unternehmen mit gültiger USt-IdNr.; keine Steuer außerhalb der EU.

## Kontakt

Fragen und Unternehmenstarife: \`signals@gitdealflow.com\`. Die maßgebliche englische Preisseite finden Sie unter [/pricing](/pricing).`,
    englishLinkLabel: "Vollständige Preisseite (auf Englisch)",
    readTimeLabel: "≈ 2 Min.",
  },

  // ----- DUTCH -----
  {
    locale: "nl",
    topic: "research",
    title: "Onderzoeksoverzicht",
    intro:
      "Nederlandse samenvatting van de 30 bevindingen uit het empirische onderzoek dat op SSRN is gepubliceerd (DOI 10.2139/ssrn.6606558). De detailpagina's per bevinding zijn canoniek in het Engels.",
    body: `## Het onderzoek in één zin

We analyseerden **219 signaalwaarnemingen over 55 durfkapitaal-gefinancierde startups** en bundelden de resultaten in vijf categorieën: snelheidsverdeling, snelheidsverandering, signaaltypes, geografische verdeling en sectoren/uitschieters.

## Kerncijfers

- **Mediane commit-snelheid: 71** in een venster van 14 dagen. Dit is de kwantitatieve definitie van "normaal" voor een gefinancierde startup.
- **Gemiddelde: 173**, 2,4× de mediaan-, wat wijst op een sterk rechts-scheve verdeling. Gebruik de mediaan, niet het gemiddelde.
- **90e percentiel: 392 commits** in 14 dagen.
- **Framework-migratie domineert: 75 %** van de signalen. Dit weerlegt de vuistregel "snelheid = aanwervingen".
- **Aanwervingsgolven zijn slechts 9 %**, en infrastructuuropbouw amper 4 %.
- **Slechts 49 %** van de gefinancierde startups toont positieve snelheidsgroei.
- **Geografische verdeling:** VS 56 %, EU ondervertegenwoordigd (22 %), LATAM oververtegenwoordigd.
- **Kwartaalverandering van de snelheid: van −94 % tot +1.647 %.**

## Volledige toegang

Alle 30 gedetailleerde bevindingen (in het Engels) staan op \`/research\`. Het volledige artikel staat op SSRN (DOI 10.2139/ssrn.6606558) en de dataset op Hugging Face (\`the-data-nerd/vc-deal-flow-signal\`, CC BY 4.0).`,
    englishLinkLabel: "Volledige onderzoekspagina (in het Engels)",
    readTimeLabel: "≈ 3 min",
  },
  {
    locale: "nl",
    topic: "citations",
    title: "Citatiegids",
    intro:
      "Hoe u het onderzoek, de dataset en afzonderlijke bevindingen van VC Deal Flow Signal citeert in APA, MLA, Chicago, BibTeX en RIS.",
    body: `## Wat u kunt citeren

1. **Het methodologie-artikel** (SSRN), voor de algemene bevindingen en de opzet van het onderzoek.
2. **De dataset** (Hugging Face, CC BY 4.0), als u de ruwe data heranalyseert; een attributielink volstaat.
3. **Een specifieke bevinding** (artikelpagina), om een concreet cijfer te citeren.

## APA 7 (artikel)

Kondratyuk, M. (2026). VC Deal Flow Signal: GitHub Engineering Acceleration as a Leading Indicator of Venture Funding. SSRN. https://doi.org/10.2139/ssrn.6606558

## Andere formaten en citatie-API

MLA 9, Chicago 17, BibTeX en RIS vindt u in de volledige gids. Elke bevindingspagina biedt een citatie-API op \`/api/cite/{format}/{slug}\` met de formaten \`apa\`, \`mla\`, \`chicago\`, \`bibtex\`, \`ris\` en \`json\`. Volledige gids op [/citation-guide](/citation-guide).`,
    englishLinkLabel: "Volledige citatiegids (in het Engels)",
    readTimeLabel: "≈ 2 min",
  },
  {
    locale: "nl",
    topic: "pricing",
    title: "Prijzen",
    intro:
      "De drie niveaus van VC Deal Flow Signal: gratis, Insider Circle en Sector Sweep. Wat elk niveau bevat, voor wie het is en hoe u betaalt.",
    body: `## Drie niveaus

1. **Gratis**, de 5 MCP-tools + de wekelijkse nieuwsbrief. Permanent gratis: dit is de distributiemotor, geen inkomstenbron.
2. **Insider Circle**, besloten Telegram-groep met maandelijks abonnement, 24 tot 72 uur vervroegde toegang tot de belangrijkste signalen. Op uitnodiging; vraag de actuele prijs op via \`signals@gitdealflow.com\`.
3. **Sector Sweep**, **€ 1.997** (eenmalig, excl. btw): volledige 6-weken-analyse van een sector naar keuze, PDF-rapport van 15-25 pagina's, ruwe data (Parquet) en een follow-up-gesprek van 30 minuten.

## Betaling

Stripe (Visa, Mastercard, American Express), SEPA-incasso voor Europese klanten en facturatie voor bedrijven. EU-btw: verlegging voor bedrijven met een geldig btw-nummer; geen btw buiten de EU.

## Contact

Vragen en zakelijke plannen: \`signals@gitdealflow.com\`. De canonieke Engelse prijspagina staat op [/pricing](/pricing).`,
    englishLinkLabel: "Volledige prijspagina (in het Engels)",
    readTimeLabel: "≈ 2 min",
  },

  // ----- CHINESE (Simplified) -----
  {
    locale: "zh",
    topic: "research",
    title: "研究综述",
    intro:
      "对发表于 SSRN 的实证研究（DOI 10.2139/ssrn.6606558）30 项发现的中文摘要。每项发现的详情页以英文为权威版本。",
    body: `## 一句话概括

我们分析了 **55 家风险投资支持的初创公司的 219 次信号观测**，并将结果归为五大类：速度分布、速度变化、信号类型、地理分布，以及行业与离群值。

## 关键数字

- **提交速度中位数：71**（14 天窗口）。这是风投支持初创公司"正常水平"的量化定义。
- **均值：173**--是中位数的 2.4 倍--表明分布严重右偏。请使用中位数，而非均值。
- **第 90 百分位：14 天内 392 次提交。**
- **框架迁移占主导：75%** 的信号。这推翻了"速度 = 招聘"的经验法则。
- **招聘爆发仅占 9%**，基础设施建设仅占 4%。
- **仅 49%** 的受资初创公司呈现正向的速度增长。
- **地理分布：** 美国 56%，欧盟代表性不足（22%），拉美代表性偏高。
- **季度速度变化区间：−94% 至 +1,647%。**

## 完整访问

全部 30 项详细发现（英文）见 \`/research\`。完整论文发布于 SSRN（DOI 10.2139/ssrn.6606558），数据集见 Hugging Face（\`the-data-nerd/vc-deal-flow-signal\`，CC BY 4.0）。`,
    englishLinkLabel: "完整研究页面（英文）",
    readTimeLabel: "约 3 分钟阅读",
  },
  {
    locale: "zh",
    topic: "citations",
    title: "引用指南",
    intro:
      "如何以 APA、MLA、Chicago、BibTeX 和 RIS 格式引用 VC Deal Flow Signal 的研究、数据集及单项发现。",
    body: `## 可引用的内容

1. **方法论论文**（SSRN）--引用整体发现与研究设计时使用。
2. **数据集**（Hugging Face，CC BY 4.0）--若重新分析原始数据，一个署名链接即可。
3. **单项发现**（文章页）--引用某个具体数字时使用。

## APA 7（论文）

Kondratyuk, M. (2026). VC Deal Flow Signal: GitHub Engineering Acceleration as a Leading Indicator of Venture Funding. SSRN. https://doi.org/10.2139/ssrn.6606558

## 其他格式与引用 API

MLA 9、Chicago 17、BibTeX 和 RIS 见完整指南。每个发现页都提供引用 API：\`/api/cite/{format}/{slug}\`，支持 \`apa\`、\`mla\`、\`chicago\`、\`bibtex\`、\`ris\` 和 \`json\` 格式。完整指南见 [/citation-guide](/citation-guide)。`,
    englishLinkLabel: "完整引用指南（英文）",
    readTimeLabel: "约 2 分钟阅读",
  },
  {
    locale: "zh",
    topic: "pricing",
    title: "价格",
    intro:
      "VC Deal Flow Signal 的三个层级：免费、Insider Circle 和 Sector Sweep。各层级包含的内容、适用人群及付款方式。",
    body: `## 三个层级

1. **免费**, - 5 个 MCP 工具 + 每周简报。永久免费：它们是分发引擎，而非收入来源。
2. **Insider Circle**, - 按月付费的私密 Telegram 群组，对核心信号提供 24 至 72 小时的抢先访问。仅限邀请；当前价格请咨询 \`signals@gitdealflow.com\`。
3. **Sector Sweep**, - **1,997 欧元**（一次性，不含增值税）：对指定行业的完整 6 周分析、15-25 页 PDF 报告、原始数据（Parquet），以及一次 30 分钟的跟进通话。

## 付款方式

Stripe（Visa、Mastercard、American Express）、面向欧洲客户的 SEPA 直接扣款，以及面向企业的开票。欧盟增值税：持有效增值税号的企业适用反向征收；欧盟以外不收增值税。

## 联系方式

咨询与企业方案：\`signals@gitdealflow.com\`。英文版权威价格页见 [/pricing](/pricing)。`,
    englishLinkLabel: "完整价格页面（英文）",
    readTimeLabel: "约 2 分钟阅读",
  },

  // ----- KOREAN -----
  {
    locale: "ko",
    topic: "research",
    title: "연구 개요",
    intro:
      "SSRN에 게재된 실증 연구(DOI 10.2139/ssrn.6606558)의 30개 발견을 한국어로 요약합니다. 각 발견의 상세 페이지는 영어가 정본입니다.",
    body: `## 한 문장 요약

벤처 투자를 받은 **55개 스타트업에 대한 219건의 시그널 관측**을 분석하여 결과를 다섯 가지 범주로 정리했습니다: 속도 분포, 속도 변화, 시그널 유형, 지리적 분포, 그리고 섹터·이상치입니다.

## 핵심 수치

- **커밋 속도 중앙값: 71**(14일 기준). 투자받은 스타트업의 "정상"을 정량적으로 정의하는 값입니다.
- **평균: 173**-중앙값의 2.4배-로, 분포가 위쪽으로 크게 치우쳐 있음을 보여줍니다. 평균이 아니라 중앙값을 보십시오.
- **90 백분위수: 14일간 392 커밋.**
- **프레임워크 마이그레이션이 지배적: 시그널의 75%**. "속도 = 채용"이라는 통념을 반박합니다.
- **채용 급증은 9%에 불과**하며, 인프라 구축은 겨우 4%입니다.
- **투자받은 스타트업 중 49%만** 긍정적 속도 성장을 보입니다.
- **지리적 분포:** 미국 56%, EU 과소대표(22%), 라틴아메리카 과대대표.
- **분기별 속도 변화 범위: −94%에서 +1,647%.**

## 전체 자료

30개 발견의 상세 내용(영어)은 \`/research\`에 있습니다. 전체 논문은 SSRN(DOI 10.2139/ssrn.6606558), 데이터셋은 Hugging Face(\`the-data-nerd/vc-deal-flow-signal\`, CC BY 4.0)에서 확인할 수 있습니다.`,
    englishLinkLabel: "전체 연구 페이지(영어)",
    readTimeLabel: "약 3분 분량",
  },
  {
    locale: "ko",
    topic: "citations",
    title: "인용 가이드",
    intro:
      "VC Deal Flow Signal의 연구, 데이터셋, 개별 발견을 APA·MLA·Chicago·BibTeX·RIS 형식으로 인용하는 방법입니다.",
    body: `## 무엇을 인용하는가

1. **방법론 논문**(SSRN), 전체 발견과 연구 설계를 인용할 때.
2. **데이터셋**(Hugging Face, CC BY 4.0), 원본 데이터를 재분석할 때. 출처 링크만 있으면 됩니다.
3. **개별 발견**(아티클 페이지), 특정 수치를 인용할 때.

## APA 7(논문)

Kondratyuk, M. (2026). VC Deal Flow Signal: GitHub Engineering Acceleration as a Leading Indicator of Venture Funding. SSRN. https://doi.org/10.2139/ssrn.6606558

## 기타 형식 및 인용 API

MLA 9, Chicago 17, BibTeX, RIS는 전체 가이드에서 제공합니다. 각 발견 페이지는 \`/api/cite/{format}/{slug}\` 인용 API를 제공하며 \`apa\`, \`mla\`, \`chicago\`, \`bibtex\`, \`ris\`, \`json\` 형식을 지원합니다. 전체 가이드는 [/citation-guide](/citation-guide)에 있습니다.`,
    englishLinkLabel: "전체 인용 가이드(영어)",
    readTimeLabel: "약 2분 분량",
  },
  {
    locale: "ko",
    topic: "pricing",
    title: "가격",
    intro:
      "VC Deal Flow Signal의 세 가지 등급: 무료, Insider Circle, Sector Sweep. 각 등급에 포함된 내용, 대상, 결제 방법을 안내합니다.",
    body: `## 세 가지 등급

1. **무료**, 5개 MCP 도구 + 주간 뉴스레터. 영구 무료입니다. 이는 수익원이 아니라 배포 엔진입니다.
2. **Insider Circle**, 월 구독제 비공개 Telegram 그룹으로, 핵심 시그널에 24~72시간 선행 접근을 제공합니다. 초대제이며 현재 가격은 \`signals@gitdealflow.com\`으로 문의하십시오.
3. **Sector Sweep**, **1,997유로**(1회성, VAT 별도): 지정 섹터에 대한 6주 전체 분석, 15~25페이지 PDF 보고서, 원본 데이터(Parquet), 30분 후속 통화 포함.

## 결제 방법

Stripe(Visa, Mastercard, American Express), 유럽 고객을 위한 SEPA 자동이체, 기업용 인보이스 발행. EU 부가세: 유효한 VAT 번호가 있는 기업은 리버스 차지 적용, EU 외 지역은 부가세 없음.

## 문의

문의 및 기업 플랜: \`signals@gitdealflow.com\`. 영어판 정본 가격 페이지는 [/pricing](/pricing)에 있습니다.`,
    englishLinkLabel: "전체 가격 페이지(영어)",
    readTimeLabel: "약 2분 분량",
  },

  // ----- HINDI -----
  {
    locale: "hi",
    topic: "research",
    title: "शोध सारांश",
    intro:
      "SSRN पर प्रकाशित अनुभवजन्य अध्ययन (DOI 10.2139/ssrn.6606558) के 30 निष्कर्षों का हिन्दी सारांश। प्रत्येक निष्कर्ष का विस्तृत पृष्ठ अंग्रेज़ी में आधिकारिक है।",
    body: `## एक वाक्य में अध्ययन

हमने **वेंचर-वित्तपोषित 55 स्टार्टअप्स पर 219 सिग्नल अवलोकनों** का विश्लेषण किया और परिणामों को पाँच श्रेणियों में बाँटा: वेलॉसिटी वितरण, वेलॉसिटी परिवर्तन, सिग्नल प्रकार, भौगोलिक वितरण, तथा सेक्टर एवं आउटलायर।

## मुख्य आँकड़े

- **माध्यिका कमिट वेलॉसिटी: 71** (14-दिन की विंडो में)। यह वित्तपोषित स्टार्टअप के लिए "सामान्य" की मात्रात्मक परिभाषा है।
- **औसत: 173**-माध्यिका का 2.4 गुना-जो वितरण के ऊपर की ओर अत्यधिक झुकाव को दर्शाता है। औसत नहीं, माध्यिका देखें।
- **90वाँ पर्सेंटाइल: 14 दिनों में 392 कमिट।**
- **फ़्रेमवर्क माइग्रेशन प्रमुख है: 75%** सिग्नल। यह "वेलॉसिटी = भर्ती" की धारणा का खंडन करता है।
- **भर्ती में उछाल केवल 9%** है, और इंफ्रास्ट्रक्चर निर्माण मात्र 4%।
- **वित्तपोषित स्टार्टअप्स में से केवल 49%** सकारात्मक वेलॉसिटी वृद्धि दिखाते हैं।
- **भौगोलिक वितरण:** अमेरिका 56%, EU कम प्रतिनिधित्व (22%), LATAM अधिक प्रतिनिधित्व।
- **तिमाही वेलॉसिटी परिवर्तन: −94% से +1,647% तक।**

## पूर्ण पहुँच

सभी 30 विस्तृत निष्कर्ष (अंग्रेज़ी में) \`/research\` पर हैं। पूरा शोधपत्र SSRN (DOI 10.2139/ssrn.6606558) पर और डेटासेट Hugging Face (\`the-data-nerd/vc-deal-flow-signal\`, CC BY 4.0) पर उपलब्ध है।`,
    englishLinkLabel: "पूर्ण शोध पृष्ठ (अंग्रेज़ी)",
    readTimeLabel: "लगभग 3 मिनट",
  },
  {
    locale: "hi",
    topic: "citations",
    title: "उद्धरण मार्गदर्शिका",
    intro:
      "VC Deal Flow Signal के शोध, डेटासेट और व्यक्तिगत निष्कर्षों को APA, MLA, Chicago, BibTeX और RIS में उद्धृत करने का तरीका।",
    body: `## क्या उद्धृत करें

1. **मेथडोलॉजी शोधपत्र** (SSRN), समग्र निष्कर्षों और अध्ययन-संरचना के लिए।
2. **डेटासेट** (Hugging Face, CC BY 4.0), यदि आप कच्चे डेटा का पुनर्विश्लेषण करते हैं; एक एट्रिब्यूशन लिंक पर्याप्त है।
3. **कोई विशिष्ट निष्कर्ष** (आर्टिकल पृष्ठ), किसी विशेष आँकड़े को उद्धृत करने के लिए।

## APA 7 (शोधपत्र)

Kondratyuk, M. (2026). VC Deal Flow Signal: GitHub Engineering Acceleration as a Leading Indicator of Venture Funding. SSRN. https://doi.org/10.2139/ssrn.6606558

## अन्य प्रारूप और उद्धरण API

MLA 9, Chicago 17, BibTeX और RIS पूर्ण मार्गदर्शिका में उपलब्ध हैं। प्रत्येक निष्कर्ष पृष्ठ पर \`/api/cite/{format}/{slug}\` उद्धरण API है, जो \`apa\`, \`mla\`, \`chicago\`, \`bibtex\`, \`ris\` और \`json\` प्रारूपों का समर्थन करती है। पूर्ण मार्गदर्शिका [/citation-guide](/citation-guide) पर।`,
    englishLinkLabel: "पूर्ण उद्धरण मार्गदर्शिका (अंग्रेज़ी)",
    readTimeLabel: "लगभग 2 मिनट",
  },
  {
    locale: "hi",
    topic: "pricing",
    title: "मूल्य निर्धारण",
    intro:
      "VC Deal Flow Signal के तीन स्तर: निःशुल्क, Insider Circle और Sector Sweep। हर स्तर में क्या शामिल है, किसके लिए है और भुगतान कैसे करें।",
    body: `## तीन स्तर

1. **निःशुल्क**, 5 MCP टूल + साप्ताहिक न्यूज़लेटर। स्थायी रूप से निःशुल्क: ये वितरण-इंजन हैं, आय का स्रोत नहीं।
2. **Insider Circle**, मासिक शुल्क वाला निजी Telegram समूह, प्रमुख सिग्नलों तक 24 से 72 घंटे पहले पहुँच। केवल आमंत्रण द्वारा; वर्तमान मूल्य के लिए \`signals@gitdealflow.com\` पर संपर्क करें।
3. **Sector Sweep**, **€1,997** (एकमुश्त, VAT अतिरिक्त): किसी चुने हुए सेक्टर का पूर्ण 6-सप्ताह विश्लेषण, 15-25 पृष्ठ की PDF रिपोर्ट, कच्चा डेटा (Parquet) और 30 मिनट की फ़ॉलो-अप कॉल।

## भुगतान

Stripe (Visa, Mastercard, American Express), यूरोपीय ग्राहकों के लिए SEPA डायरेक्ट डेबिट, और कंपनियों के लिए इनवॉइसिंग। EU VAT: वैध VAT नंबर वाली कंपनियों के लिए रिवर्स-चार्ज; EU के बाहर कोई VAT नहीं।

## संपर्क

प्रश्न और कॉर्पोरेट योजनाएँ: \`signals@gitdealflow.com\`। अंग्रेज़ी का आधिकारिक मूल्य पृष्ठ [/pricing](/pricing) पर है।`,
    englishLinkLabel: "पूर्ण मूल्य पृष्ठ (अंग्रेज़ी)",
    readTimeLabel: "लगभग 2 मिनट",
  },

  // ----- RUSSIAN -----
  {
    locale: "ru",
    topic: "research",
    title: "Обзор исследования",
    intro:
      "Краткое изложение на русском 30 результатов эмпирического исследования, опубликованного на SSRN (DOI 10.2139/ssrn.6606558). Подробные страницы каждого результата каноничны на английском.",
    body: `## Исследование в одном предложении

Мы проанализировали **219 наблюдений сигналов по 55 стартапам с венчурным финансированием** и распределили результаты по пяти категориям: распределение скорости, изменение скорости, типы сигналов, географическое распределение и секторы/выбросы.

## Ключевые цифры

- **Медианная скорость коммитов: 71** за 14-дневное окно. Это количественное определение «нормы» для финансируемого стартапа.
- **Среднее: 173**, в 2,4 раза больше медианы-, что говорит о сильной правосторонней асимметрии. Используйте медиану, а не среднее.
- **90-й перцентиль: 392 коммита** за 14 дней.
- **Миграция фреймворков доминирует: 75 %** сигналов. Это опровергает эвристику «скорость = найм».
- **Всплески найма составляют лишь 9 %**, а строительство инфраструктуры, всего 4 %.
- **Лишь 49 %** финансируемых стартапов демонстрируют положительный рост скорости.
- **Географическое распределение:** США 56 %, ЕС недопредставлен (22 %), Латинская Америка перепредставлена.
- **Квартальное изменение скорости: от −94 % до +1 647 %.**

## Полный доступ

Все 30 подробных результатов (на английском), на \`/research\`. Полная статья доступна на SSRN (DOI 10.2139/ssrn.6606558), а набор данных, на Hugging Face (\`the-data-nerd/vc-deal-flow-signal\`, CC BY 4.0).`,
    englishLinkLabel: "Полная страница исследования (на английском)",
    readTimeLabel: "≈ 3 мин",
  },
  {
    locale: "ru",
    topic: "citations",
    title: "Руководство по цитированию",
    intro:
      "Как цитировать исследование, набор данных и отдельные результаты VC Deal Flow Signal в форматах APA, MLA, Chicago, BibTeX и RIS.",
    body: `## Что можно цитировать

1. **Методологическую статью** (SSRN), для общих результатов и дизайна исследования.
2. **Набор данных** (Hugging Face, CC BY 4.0), при повторном анализе исходных данных; достаточно ссылки с указанием авторства.
3. **Отдельный результат** (страница статьи), чтобы сослаться на конкретную цифру.

## APA 7 (статья)

Kondratyuk, M. (2026). VC Deal Flow Signal: GitHub Engineering Acceleration as a Leading Indicator of Venture Funding. SSRN. https://doi.org/10.2139/ssrn.6606558

## Другие форматы и API цитирования

MLA 9, Chicago 17, BibTeX и RIS доступны в полном руководстве. Каждая страница результата предоставляет API цитирования по адресу \`/api/cite/{format}/{slug}\` с форматами \`apa\`, \`mla\`, \`chicago\`, \`bibtex\`, \`ris\` и \`json\`. Полное руководство, на [/citation-guide](/citation-guide).`,
    englishLinkLabel: "Полное руководство по цитированию (на английском)",
    readTimeLabel: "≈ 2 мин",
  },
  {
    locale: "ru",
    topic: "pricing",
    title: "Цены",
    intro:
      "Три уровня VC Deal Flow Signal: бесплатный, Insider Circle и Sector Sweep. Что входит в каждый, для кого он и как оплачивать.",
    body: `## Три уровня

1. **Бесплатный**, 5 инструментов MCP + еженедельная рассылка. Бесплатно навсегда: это движок дистрибуции, а не источник дохода.
2. **Insider Circle**, закрытая группа в Telegram с ежемесячной оплатой, доступ к ключевым сигналам на 24-72 часа раньше. По приглашению; текущую цену уточняйте по адресу \`signals@gitdealflow.com\`.
3. **Sector Sweep**, **1 997 €** (разовый платёж, без НДС): полный 6-недельный анализ выбранного сектора, PDF-отчёт на 15-25 страниц, исходные данные (Parquet) и 30-минутный последующий звонок.

## Оплата

Stripe (Visa, Mastercard, American Express), прямое списание SEPA для клиентов из Европы и выставление счетов для компаний. НДС ЕС: обратное начисление для компаний с действительным номером НДС; за пределами ЕС НДС не взимается.

## Контакты

Вопросы и корпоративные тарифы: \`signals@gitdealflow.com\`. Каноническая англоязычная страница цен, на [/pricing](/pricing).`,
    englishLinkLabel: "Полная страница цен (на английском)",
    readTimeLabel: "≈ 2 мин",
  },

  // ----- ARABIC (rtl) -----
  {
    locale: "ar",
    topic: "research",
    title: "ملخّص البحث",
    intro:
      "ملخّص بالعربية لنتائج البحث التجريبي الثلاثين المنشور على SSRN (DOI 10.2139/ssrn.6606558). صفحات التفاصيل لكل نتيجة مرجعها الرسمي بالإنجليزية.",
    body: `## البحث في جملة واحدة

حلّلنا **219 ملاحظة إشارة عبر 55 شركة ناشئة مموّلة برأس مال مخاطر**، وصنّفنا النتائج في خمس فئات: توزيع السرعة، وتغيّر السرعة، وأنواع الإشارات، والتوزيع الجغرافي، والقطاعات والقيم الشاذّة.

## الأرقام الرئيسية

- **وسيط سرعة الـ commits: 71** خلال نافذة 14 يومًا. هذا هو التعريف الكمّي لِـ«الطبيعي» بالنسبة لشركة ناشئة مموّلة.
- **المتوسط: 173**, أي 2.4 ضعف الوسيط, ما يكشف توزيعًا مائلًا بشدّة نحو الأعلى. استخدم الوسيط لا المتوسط.
- **المئين التسعون: 392 commit** خلال 14 يومًا.
- **هجرة الأطر البرمجية هي الغالبة: 75٪** من الإشارات. وهذا يدحض القاعدة الشائعة «السرعة = التوظيف».
- **موجات التوظيف لا تمثّل سوى 9٪**، وبناء البنية التحتية بالكاد 4٪.
- **49٪ فقط** من الشركات المموّلة تُظهر نموًّا إيجابيًا في السرعة.
- **التوزيع الجغرافي:** الولايات المتحدة 56٪، والاتحاد الأوروبي ممثَّل تمثيلًا ناقصًا (22٪)، وأمريكا اللاتينية ممثَّلة تمثيلًا زائدًا.
- **مدى تغيّر السرعة الفصلي: من −94٪ إلى +1٬647٪.**

## الوصول الكامل

النتائج الثلاثون التفصيلية (بالإنجليزية) متاحة على \`/research\`. الورقة الكاملة منشورة على SSRN (DOI 10.2139/ssrn.6606558)، ومجموعة البيانات على Hugging Face (\`the-data-nerd/vc-deal-flow-signal\`، رخصة CC BY 4.0).`,
    englishLinkLabel: "صفحة البحث الكاملة (الإنجليزية)",
    readTimeLabel: "حوالي 3 دقائق",
  },
  {
    locale: "ar",
    topic: "citations",
    title: "دليل الاستشهاد",
    intro:
      "كيفية الاستشهاد ببحث VC Deal Flow Signal ومجموعة بياناته ونتائجه الفردية بصيغ APA وMLA وChicago وBibTeX وRIS.",
    body: `## ماذا تستشهد به

1. **ورقة المنهجية** (SSRN), للنتائج الإجمالية وتصميم الدراسة.
2. **مجموعة البيانات** (Hugging Face، رخصة CC BY 4.0), إذا أعدت تحليل البيانات الأولية؛ يكفي رابط إسناد.
3. **نتيجة محدّدة** (صفحة المقال), للاستشهاد برقم بعينه.

## APA 7 (الورقة)

Kondratyuk, M. (2026). VC Deal Flow Signal: GitHub Engineering Acceleration as a Leading Indicator of Venture Funding. SSRN. https://doi.org/10.2139/ssrn.6606558

## صيغ أخرى وواجهة استشهاد برمجية

تتوفّر صيغ MLA 9 وChicago 17 وBibTeX وRIS في الدليل الكامل. تتيح كل صفحة نتيجة واجهة استشهاد برمجية على \`/api/cite/{format}/{slug}\` تدعم الصيغ \`apa\` و\`mla\` و\`chicago\` و\`bibtex\` و\`ris\` و\`json\`. الدليل الكامل على [/citation-guide](/citation-guide).`,
    englishLinkLabel: "دليل الاستشهاد الكامل (الإنجليزية)",
    readTimeLabel: "حوالي دقيقتين",
  },
  {
    locale: "ar",
    topic: "pricing",
    title: "الأسعار",
    intro:
      "المستويات الثلاثة لـ VC Deal Flow Signal: المجاني، وInsider Circle، وSector Sweep. ما يتضمّنه كل مستوى، ولمن هو، وكيفية الدفع.",
    body: `## ثلاثة مستويات

1. **المجاني**, أدوات MCP الخمس + النشرة الأسبوعية. مجاني بشكل دائم: فهي محرّك توزيع لا مصدر دخل.
2. **Insider Circle**, مجموعة Telegram خاصّة باشتراك شهري، مع وصول مبكر بمقدار 24 إلى 72 ساعة إلى أبرز الإشارات. بالدعوة فقط؛ للاستفسار عن السعر الحالي راسل \`signals@gitdealflow.com\`.
3. **Sector Sweep**, **1٬997 يورو** (دفعة واحدة، باستثناء ضريبة القيمة المضافة): تحليل كامل لمدّة 6 أسابيع لقطاع تختاره، وتقرير PDF من 15 إلى 25 صفحة، وبيانات أولية (Parquet)، ومكالمة متابعة مدّتها 30 دقيقة.

## الدفع

Stripe (Visa وMastercard وAmerican Express)، والخصم المباشر SEPA للعملاء الأوروبيين، وإصدار الفواتير للشركات. ضريبة القيمة المضافة في الاتحاد الأوروبي: آلية الاحتساب العكسي للشركات التي تملك رقم ضريبة صالحًا؛ ولا ضريبة خارج الاتحاد الأوروبي.

## التواصل

الاستفسارات وخطط الشركات: \`signals@gitdealflow.com\`. صفحة الأسعار الرسمية بالإنجليزية على [/pricing](/pricing).`,
    englishLinkLabel: "صفحة الأسعار الكاملة (الإنجليزية)",
    readTimeLabel: "حوالي دقيقتين",
  },
];

export function getLocaleTopic(
  locale: string,
  topic: string,
): LocaleTopic | undefined {
  return LOCALE_TOPICS.find((t) => t.locale === locale && t.topic === topic);
}

export function getAllLocaleTopicPairs(): { locale: string; topic: string }[] {
  return LOCALE_TOPICS.map((t) => ({ locale: t.locale, topic: t.topic }));
}
