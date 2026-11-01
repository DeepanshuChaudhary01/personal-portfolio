// All visible copy lives here so it can be reviewed in one place.
// NDA rule: never name the current employer or quote numbers about its systems.

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
  { code: "03", id: "work", ja: "実績", en: "Work", open: false },
  { code: "04", id: "journey", ja: "経歴", en: "Journey", open: false },
  { code: "05", id: "departures", ja: "発車案内", en: "Departures", open: false },
  { code: "06", id: "resume", ja: "履歴書", en: "Resume", open: true },
  { code: "07", id: "contact", ja: "連絡先", en: "Contact", open: false },
];

export const hero = {
  role: ["Software Engineer", "LLM systems & backend", "Tokyo"],
  previous: { name: "IIT Patna", detail: "B.Tech, Mechanical Engineering · 2020–24" },
  next: { name: "Your team", detail: "SDE · AI engineering · global" },
  statement:
    "I put LLMs into production systems, along with the queues, checks and monitoring that keep them honest.",
  lede:
    "Software engineer at a large HR-tech company in Tokyo. I work mostly in Ruby on Rails, with Go, Python and JavaScript where they fit, on systems that review, rank and search job data. Trained as a mechanical engineer at IIT Patna, then changed lines to software.",
};

// Shown next to the resume ticket. Keep it in step with the PDF in /resume.
export const resumeHighlights = [
  { label: "Experience", text: "LLM systems, backend services and search at a major HR-tech company in Tokyo, 2024 – present." },
  { label: "Internship", text: "A metaverse contact center on Unity and AWS, 2023." },
  { label: "Education", text: "B.Tech, Mechanical Engineering, IIT Patna, 2020 – 24." },
  { label: "Also", text: "Scrum Master, Hacker Cup 2022 Round 3, English and Japanese (JLPT N3)." },
];

export const board = {
  now: ["LLM systems in production", "Backend services & APIs", "Search and ranking pipelines"],
  next: "SDE / AI roles, global teams",
  notice: [
    "平常運転 Good service on all lines",
    "Based in Tokyo (JST, UTC+9)",
    "Open to SDE and AI engineering roles with global teams",
    "English: fluent",
    "日本語: JLPT N3",
    "Facebook Hacker Cup 2022: Round 3",
    "1,000+ problems solved on Codeforces & LeetCode",
  ],
};
