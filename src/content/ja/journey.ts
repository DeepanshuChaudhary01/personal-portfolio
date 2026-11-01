// Japanese text for the journey stops in ../journey.ts, by stop id. `jaEn` is the second line of a stop's
// sign tag (the first, `ja`, is shared); "" leaves just the Japanese word.

import type { JourneyText } from "../journey";

export const journeyJa: Record<string, JourneyText> = {
  iit: {
    jaEn: "",
    title: "インド工科大学パトナ校",
    meta: "機械工学 学士・インド パトナ",
    body: "4年間、機械工学を学びました。",
    points: ["就職支援部門（Training & Placement Cell）のアシスタント・ヘッド・コーディネーター（2023年1月〜2024年4月）。"],
  },
  transfer: {
    jaEn: "ソフトウェア線にお乗り換え",
    title: "競技プログラミング",
    meta: "学業と並行して",
    points: ["Facebook Hacker Cup 2022：Round 3 進出。", "CodeforcesとLeetCodeで1,000問以上を解答。"],
    links: [{ label: "Codeforces プロフィール" }],
  },
  internship: {
    title: "ソフトウェア開発インターン",
    meta: "コンタクトセンター事業の企業・東京",
    body: "メタバース上のバーチャルコンタクトセンターを、部門横断のチームで共同開発しました。",
    points: [
      "UnityクライアントをAWS（Cognito、Lambda、CodeCommit、Amazon Connect）と連携。",
      "バックエンドをAmazon GameLiftにデプロイ。",
    ],
  },
  graduated: {
    title: "卒業",
    meta: "インド工科大学パトナ校 学士・CPI 8.36/10",
  },
  sde: {
    jaEn: "",
    title: "ソフトウェアエンジニア",
    meta: "大手HRテック企業・東京",
    body: "大規模な求人プラットフォーム向けに、LLMシステムとバックエンドサービスを、日本語と英語の環境で開発しています。",
    links: [{ label: "コンテンツ審査" }, { label: "候補者マッチング" }, { label: "求人検索" }],
  },
  scrum: {
    jaEn: "",
    title: "スクラムマスター",
    meta: "同じチーム・東京",
    body: "エンジニアとしての業務と並行して、チームのスプリント計画・デイリースタンドアップ・振り返りを運営しています。",
  },
  next: {
    jaEn: "次の停車駅",
    title: "貴社",
    meta: "SDE・AIエンジニア・グローバル",
    body: "この路線は、まだ続きます。グローバルなチームでの、ソフトウェア／AIエンジニア職を探しています。",
    links: [{ label: "メールを送る" }, { label: "レジュメ" }],
  },
};
