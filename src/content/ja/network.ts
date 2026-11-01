// Japanese text for the route map's stations, by station id. Names stay short: they sit on the map
// between their neighbours. A missing id fails the build (see getStations in ../network.ts).

export const stationsJa: Record<string, { name: string; meta?: string; summary: string }> = {
  prompting: {
    name: "プロンプト設計",
    summary: "自由な文章ではなく、構造化された具体的で対応可能な指摘を返すように設計したプロンプト。",
  },
  structured: {
    name: "構造化出力",
    summary: "保存・確認・対応がしやすい構造化された結果として、モデルの応答を整形。",
  },
  validation: {
    name: "出力検証",
    summary: "すべての応答に自動の品質ゲートを設け、出力検証とエラー処理でハルシネーションやAPI障害から守ります。",
  },
  ranking: {
    name: "LLMランキング",
    summary: "求人ごとの要件に照らして候補者を採点・優先順位付けし、条件指定による手作業の検索を置き換えました。",
  },
  go: {
    name: "Go",
    summary: "検索データのインデックス作成・クエリ・検証を行うデータパイプライン。",
  },
  rails: {
    name: "Ruby on Rails",
    summary: "メインのフレームワーク。フルスタックのアプリ、審査画面、バージョン管理されたJSON API、バックグラウンドジョブを開発し、RSpecでテストしています。",
  },
  apis: {
    name: "REST・JSON API",
    summary: "入れ子になった複数カテゴリの検索条件から、動的にSQLを生成するバージョン管理されたJSON API。",
  },
  nextjs: {
    name: "Next.js",
    summary: "AIマッチングツールの採用担当者向けフロントエンド、そしてこのサイト。",
  },
  opensearch: {
    name: "OpenSearch",
    summary: "求人検索プラットフォームを支える、インデックス作成・クエリ・検証のパイプライン。",
  },
  python: {
    name: "Pythonパイプライン",
    summary: "クラスタリングと重複排除を行うバッチ処理で、検索の関連性・データの一貫性・SEOを改善。",
  },
  bigquery: {
    name: "BigQuery",
    summary: "まずIDを検索し、次にプロフィールを取得する2段階の検索でクエリのコストを抑制。並列クエリはタイムアウト付きで、失敗時は自動でキャンセルされます。",
  },
  sql: {
    name: "MySQL・PostgreSQL",
    summary: "構造化された審査結果やアプリケーションデータを保存するリレーショナルデータベース。",
  },
  docker: {
    name: "Docker・CI/CD",
    summary: "コンテナ化したサービスと、自動化されたCI/CD・デプロイ。",
  },
  aws: {
    name: "AWS",
    summary: "EC2、S3、RDS、OpenSearch、Lambda、Cognito。デプロイを一貫して主導してきました。",
  },
  newrelic: {
    name: "New Relic",
    summary: "本番環境の問題にすぐ気づけるように整えた、ログ・アラート・ダッシュボード。",
  },
  "contact-center": {
    name: "仮想コンタクトセンター",
    meta: "インターン・Unity・AWS",
    summary:
      "東京のコンタクトセンター事業の企業でのインターンで、部門横断のチームとともに開発したメタバース上のコンタクトセンター。バックエンドはAmazon GameLift、UnityクライアントはCognito、Lambda、Amazon Connectと連携しています。",
  },
  search: {
    name: "求人検索",
    meta: "検索プラットフォーム",
    summary:
      "大規模な求人検索プラットフォームのバックエンド。複雑な検索・ランキングのロジック、バッチによるクラスタリングと重複排除、OpenSearch上のPython/Goパイプライン。",
  },
  review: {
    name: "コンテンツ審査",
    meta: "LLM審査パイプライン",
    summary:
      "求人原稿の掲載前品質チェックを自動化し、完全に手作業だった審査を置き換えました。非同期のバッチパイプラインがLLMで検証して構造化された指摘を保存し、審査担当者はRailsの画面で対応します。設計からデプロイ、監視まで一貫して担当しました。",
  },
  matching: {
    name: "候補者マッチング",
    meta: "LLMランキング・スカウト文",
    summary:
      "求人ごとの要件に照らして候補者をランク付けし、求人に合わせたスカウト文を下書きします。送信前には必ず担当者が承認します。BigQuery上のRails API、Next.jsのフロントエンド、AWSにデプロイ。",
  },
};
