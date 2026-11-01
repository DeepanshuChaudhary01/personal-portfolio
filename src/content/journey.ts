// DC04 · Journey: the career as one line. It starts on the mechanical line and changes to the
// software (DC) line at a transfer. Same NDA rule as everywhere: no employer names, no internal figures.

import type { Lang } from "@/i18n/config";
import { journeyJa, journeyQuietJa } from "./ja/journey";
import { openToWork, person } from "./site";

export type JourneyStop = {
  id: string;
  when: string;
  kind: "origin" | "transfer" | "stop" | "minor" | "present" | "next";
  // Small Japanese sign label for special stops.
  ja?: string;
  jaEn?: string;
  title: string;
  meta: string;
  body?: string;
  points?: string[];
  links?: { label: string; href: string }[];
  // Which line the track leaving this stop belongs to.
  line: "mech" | "dc" | "future";
};

export const journey: JourneyStop[] = [
  {
    id: "iit",
    when: "Jul 2020",
    kind: "origin",
    ja: "始発",
    jaEn: "Origin",
    title: "IIT Patna",
    meta: "B.Tech, Mechanical Engineering · Patna, India",
    body: "Four years of mechanical engineering.",
    points: ["Assistant-Head Coordinator of the Training & Placement Cell, Jan 2023 – Apr 2024."],
    line: "mech",
  },
  {
    id: "transfer",
    // CHECK: 2022 is the Hacker Cup year; the point where software took over may be earlier.
    when: "2022",
    kind: "transfer",
    ja: "乗換",
    jaEn: "Change here for software",
    title: "Competitive programming",
    meta: "Alongside the degree",
    points: [
      "Facebook Hacker Cup 2022: qualified for Round 3.",
      "1,000+ problems solved on Codeforces and LeetCode.",
    ],
    links: [{ label: "Codeforces profile", href: person.codeforces }],
    line: "dc",
  },
  {
    id: "internship",
    when: "Jun 2023",
    kind: "stop",
    title: "Software Development Intern",
    meta: "Contact-center services company · Tokyo",
    body: "Co-developed a virtual contact center in a metaverse environment with a cross-functional team.",
    points: [
      "Unity client integrated with AWS: Cognito, Lambda, CodeCommit and Amazon Connect.",
      "Backend deployed on Amazon GameLift.",
    ],
    line: "dc",
  },
  {
    id: "graduated",
    when: "May 2024",
    kind: "minor",
    title: "Graduated",
    meta: "B.Tech, IIT Patna · CPI 8.36/10",
    line: "dc",
  },
  {
    id: "sde",
    when: "Oct 2024",
    kind: "present",
    ja: "現在",
    jaEn: "Present",
    title: "Software Development Engineer",
    meta: "Major HR-tech company · Tokyo",
    body: "LLM systems and backend services for a large job platform, in Japanese and English.",
    links: [
      { label: "Content Review", href: "/work/llm-content-review" },
      { label: "Candidate Matching", href: "/work/llm-candidate-matching" },
      { label: "Job Search", href: "/work/job-search-platform" },
    ],
    line: "dc",
  },
  {
    id: "scrum",
    when: "Jan 2025",
    kind: "present",
    ja: "現在",
    jaEn: "Present",
    title: "Scrum Master",
    meta: "Same team · Tokyo",
    body: "Running sprint planning, stand-ups and retrospectives for my engineering team, alongside the engineering.",
    line: "future",
  },
  {
    id: "next",
    when: "Next",
    kind: "next",
    ja: "次",
    jaEn: "Next stop",
    title: "Your team",
    meta: "SDE · AI engineering · global",
    body: "The line continues. I'm looking for software and AI engineering roles with global teams.",
    links: [
      { label: "Email me", href: `mailto:${person.email}` },
      { label: "Resume", href: "/resume" },
    ],
    line: "future",
  },
];

// The text ja/journey.ts translates. Links keep their English hrefs; only the labels change.
export type JourneyText = {
  jaEn?: string;
  title: string;
  meta: string;
  body?: string;
  points?: string[];
  links?: { label: string }[];
};

// The last stop's text while openToWork is false: no "looking for roles", the line is simply still
// being built. Its links (email, resume) stay.
export type JourneyQuietText = Pick<JourneyText, "title" | "meta" | "body">;

const journeyQuiet: JourneyQuietText = {
  title: "Under construction",
  meta: "The line keeps going",
  body: "This line is still being built, and there's plenty left to make, starting with more LLM systems that hold up in production.",
};

function translate(lang: Lang): JourneyStop[] {
  if (lang === "en") return journey;
  return journey.map((stop) => {
    const text = journeyJa[stop.id];
    if (!text || (stop.links?.length ?? 0) !== (text.links?.length ?? 0)) {
      throw new Error(`Missing or incomplete Japanese text for journey stop "${stop.id}"`);
    }
    const { links, ...rest } = text;
    return {
      ...stop,
      ...rest,
      links: stop.links?.map((link, i) => ({ ...link, label: links![i].label })),
    };
  });
}

export function getJourney(lang: Lang): JourneyStop[] {
  const stops = translate(lang);
  if (openToWork) return stops;
  const quiet = lang === "ja" ? journeyQuietJa : journeyQuiet;
  return stops.map((stop) => (stop.id === "next" ? { ...stop, ...quiet } : stop));
}
