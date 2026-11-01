// All visible copy lives here so it can be reviewed in one place; Japanese versions are in ja/site.ts.
// NDA rule: never name the current employer or quote numbers about its systems.

import type { Lang } from "@/i18n/config";
import { siteJa } from "./ja/site";

// Whether the site says you're job hunting. While false (quiet mode), it reads as a portfolio:
// "looking for roles" lines are swapped for neutral ones in both languages (see `quiet` below and
// `journeyQuiet` in journey.ts). Set to true and push when you're actively looking or have resigned.
export const openToWork = false;

export const person = {
  nameEn: "Deepanshu Chaudhary",
  nameJa: "チャウダリ ディーパンシュ",
  email: "deepanshu123chaudhary@gmail.com",
  github: "https://github.com/DeepanshuChaudhary01",
  linkedin: "https://www.linkedin.com/in/deepanzhu-chaudhary",
  codeforces: "https://codeforces.com/profile/deep_dc",
};

export type NavStation = {
  code: string;
  id: string;
  ja: string;
  en: string;
  open: boolean;
};

export const navStations: NavStation[] = [
  { code: "01", id: "here", ja: "現在地", en: "You are here", open: true },
  { code: "02", id: "route-map", ja: "路線図", en: "Route map", open: true },
  { code: "03", id: "work", ja: "実績", en: "Work", open: true },
  { code: "04", id: "journey", ja: "経歴", en: "Journey", open: true },
  { code: "05", id: "departures", ja: "発車案内", en: "Departures", open: true },
  { code: "06", id: "resume", ja: "履歴書", en: "Resume", open: true },
  { code: "07", id: "contact", ja: "連絡先", en: "Contact", open: true },
];

// Exit signs for DC07 · Contact. `ja` is the sign's Japanese line, shown in both languages.
export const exits = [
  { code: "A1", ja: "メール", label: "Email", href: `mailto:${person.email}` },
  { code: "A2", ja: "リンクトイン", label: "LinkedIn", href: person.linkedin },
  { code: "A3", ja: "ギットハブ", label: "GitHub", href: person.github },
  { code: "A4", ja: "コードフォース", label: "Codeforces", href: person.codeforces },
  { code: "B1", ja: "履歴書", label: "Resume", href: "/resume" },
];

// The intro's arrival status and platform announcements, already bilingual like real boards.
export const introBoard = {
  status: {
    arriving: "接近 Approaching",
    stopped: "到着 Arrived",
    boarding: "乗車 Boarding",
  },
  announcements: {
    arriving:
      "まもなく 1番線に 電車がまいります。黄色い点字ブロックの内側まで お下がりください。   The train for Deepanshu Chaudhary is now arriving at Platform 1. Please stand behind the yellow line.",
    stopped:
      "この電車は チャウダリ ディーパンシュ 行きです。   This train is bound for Deepanshu Chaudhary: software engineer, LLM systems and backend, Tokyo.",
    boarding: "ドアが開きます。ご注意ください。   Doors opening. Please mind the gap.",
  },
};

const siteEn = {
  hero: {
    role: ["Software Engineer", "LLM systems & backend", "Tokyo"],
    previous: { name: "IIT Patna", detail: "B.Tech, Mechanical Engineering · 2020–24" },
    next: { name: "Your team", detail: "SDE · AI engineering · global" },
    statement:
      "I put LLMs into production systems, along with the queues, checks and monitoring that keep them honest.",
    lede: "Software engineer at a large HR-tech company in Tokyo. I work mostly in Ruby on Rails, with Go, Python and JavaScript where they fit, on systems that review, rank and search job data. Trained as a mechanical engineer at IIT Patna, then changed lines to software.",
  },
  board: {
    now: ["LLM systems in production", "Backend services & APIs", "Search and ranking pipelines"],
    next: "SDE / AI roles, global teams",
    notice: [
      "平常運転 Good service on all lines",
      "Based in Tokyo (JST, UTC+9)",
      "English: fluent",
      "日本語: JLPT N3",
      "Facebook Hacker Cup 2022: Round 3",
      "1,000+ problems solved on Codeforces & LeetCode",
    ],
  },
  contact: {
    lead: "Looking for software and AI engineering roles with global teams.",
    text: "I'm based in Tokyo (JST, UTC+9). Email is the fastest way to reach me, and I usually reply within a day.",
    // Where each exit leads, by exit code.
    dest: {
      A1: person.email,
      A2: "linkedin.com/in/deepanzhu-chaudhary",
      A3: "github.com/DeepanshuChaudhary01",
      A4: "codeforces.com/profile/deep_dc",
      B1: "View or download the PDF",
    } as Record<string, string>,
  },
  // Where the resume ticket and the intro's "next" train are headed. `alt` is the sign's other language.
  destination: { name: "Your team", alt: "貴社" },
  intro: {
    tagline: "Software engineer in Tokyo · LLM systems & backend",
    inspired: "Inspired by Tokyo's Yamanote Line. The journey continues.",
  },
  // Shown next to the resume ticket. Keep it in step with the PDF in /resume.
  resumeHighlights: [
    { label: "Experience", text: "LLM systems, backend services and search at a major HR-tech company in Tokyo, 2024 – present." },
    { label: "Internship", text: "A metaverse contact center on Unity and AWS, 2023." },
    { label: "Education", text: "B.Tech, Mechanical Engineering, IIT Patna, 2020 – 24." },
    { label: "Also", text: "Scrum Master, Hacker Cup 2022 Round 3, English and Japanese (JLPT N3)." },
  ],
  // Added to the board's scrolling notices only while openToWork is true.
  openNotice: "Open to SDE and AI engineering roles with global teams",
  // Replaces the job-seeking lines above while openToWork is false.
  quiet: {
    heroNext: { name: "Under construction", detail: "Always building" },
    boardNext: "Learning, building, shipping",
    contactLead: "Happy to talk about LLM systems, backend engineering and life in Tokyo.",
    destination: { name: "Anywhere", alt: "どこまでも" },
  },
};

export type SiteContent = typeof siteEn;
export type SiteCopy = Omit<SiteContent, "openNotice" | "quiet">;

// Picks the open-to-work or quiet version of the job-seeking lines.
function resolve({ openNotice, quiet, ...copy }: SiteContent): SiteCopy {
  if (openToWork) {
    const notice = [...copy.board.notice];
    notice.splice(2, 0, openNotice);
    return { ...copy, board: { ...copy.board, notice } };
  }
  return {
    ...copy,
    hero: { ...copy.hero, next: quiet.heroNext },
    board: { ...copy.board, next: quiet.boardNext },
    contact: { ...copy.contact, lead: quiet.contactLead },
    destination: quiet.destination,
  };
}

export function getCopy(lang: Lang): SiteCopy {
  return resolve(lang === "ja" ? siteJa : siteEn);
}
