// The route map: skills are lines, projects are interchanges where lines meet.
// Coordinates are in the SVG's 1280-wide viewBox. Lines only run at 0°, 45° and 90°.

export type LineId = "A" | "B" | "D" | "C";

export type Line = {
  id: LineId;
  name: string;
  ja: string;
  color: string;
  points: [number, number][];
  glintSeconds: number;
};

export type Station = {
  id: string;
  name: string;
  meta?: string;
  x: number;
  y: number;
  lines: LineId[];
  codes: string[];
  kind: "stop" | "interchange";
  // Vertical extent of an interchange capsule.
  span?: [number, number];
  label: "above" | "below";
  summary: string;
};

export const LINES: Line[] = [
  {
    id: "A",
    name: "AI Line",
    ja: "AI線",
    color: "var(--line-ai)",
    points: [[56, 216], [330, 216], [420, 306], [900, 306], [990, 216], [1224, 216]],
    glintSeconds: 9,
  },
  {
    id: "B",
    name: "Backend Line",
    ja: "バックエンド線",
    color: "var(--line-backend)",
    points: [[56, 322], [1224, 322]],
    glintSeconds: 7.5,
  },
  {
    id: "D",
    name: "Data Line",
    ja: "データ線",
    color: "var(--line-data)",
    points: [[56, 428], [330, 428], [420, 338], [900, 338], [990, 428], [1224, 428]],
    glintSeconds: 10.5,
  },
  {
    id: "C",
    name: "Cloud Line",
    ja: "クラウド線",
    color: "var(--line-cloud)",
    points: [[56, 560], [380, 560], [450, 490], [450, 354], [870, 354], [870, 490], [940, 560], [1224, 560]],
    glintSeconds: 12,
  },
];

export const LINE_BY_ID = Object.fromEntries(LINES.map((l) => [l.id, l])) as Record<LineId, Line>;

export const STATIONS: Station[] = [
  // AI line
  {
    id: "prompting",
    name: "Prompt engineering",
    x: 110, y: 216, lines: ["A"], codes: ["A01"], kind: "stop", label: "above",
    summary: "Prompts engineered to return structured, actionable findings instead of open-ended text.",
  },
  {
    id: "structured",
    name: "Structured outputs",
    x: 255, y: 216, lines: ["A"], codes: ["A02"], kind: "stop", label: "below",
    summary: "Model responses shaped into structured results that can be stored, reviewed and acted on.",
  },
  {
    id: "validation",
    name: "Output validation",
    x: 1075, y: 216, lines: ["A"], codes: ["A05"], kind: "stop", label: "above",
    summary:
      "Automated quality gates on every response: output validation and error handling that guard against hallucinations and API failures.",
  },
  {
    id: "ranking",
    name: "LLM ranking",
    x: 1170, y: 216, lines: ["A"], codes: ["A06"], kind: "stop", label: "below",
    summary: "Scoring and prioritising candidates against each job's requirements, replacing manual criteria-based search.",
  },

  // Backend line
  {
    id: "go",
    name: "Go",
    x: 110, y: 322, lines: ["B"], codes: ["B01"], kind: "stop", label: "above",
    summary: "Data pipelines for indexing, querying and validating search data.",
  },
  {
    id: "rails",
    name: "Ruby on Rails",
    x: 250, y: 322, lines: ["B"], codes: ["B02"], kind: "stop", label: "above",
    summary: "My main framework: full-stack apps, reviewer UIs, versioned JSON APIs and background jobs, tested with RSpec.",
  },
  {
    id: "apis",
    name: "REST & JSON APIs",
    x: 1050, y: 322, lines: ["B"], codes: ["B06"], kind: "stop", label: "above",
    summary: "A versioned JSON API with dynamic SQL generation for search over a nested, multi-category filter schema.",
  },
  {
    id: "nextjs",
    name: "Next.js",
    x: 1170, y: 322, lines: ["B"], codes: ["B07"], kind: "stop", label: "above",
    summary: "The recruiter-facing frontend of an AI matching tool, and the site you're looking at.",
  },

  // Data line
  {
    id: "opensearch",
    name: "OpenSearch",
    x: 110, y: 428, lines: ["D"], codes: ["D01"], kind: "stop", label: "below",
    summary: "Indexing, querying and validation pipelines behind a job-search platform.",
  },
  {
    id: "python",
    name: "Python pipelines",
    x: 255, y: 428, lines: ["D"], codes: ["D02"], kind: "stop", label: "below",
    summary: "Batch jobs applying clustering and de-duplication to improve search relevance, data consistency and SEO.",
  },
  {
    id: "bigquery",
    name: "BigQuery",
    x: 1060, y: 428, lines: ["D"], codes: ["D06"], kind: "stop", label: "below",
    summary:
      "Two-phase retrieval (look up IDs first, then enrich profiles) to keep query cost down, with parallel queries that time out and cancel cleanly.",
  },
  {
    id: "sql",
    name: "MySQL · PostgreSQL",
    x: 1170, y: 428, lines: ["D"], codes: ["D07"], kind: "stop", label: "above",
    summary: "Relational storage for structured review results and application data.",
  },

  // Cloud line
  {
    id: "docker",
    name: "Docker & CI/CD",
    x: 260, y: 560, lines: ["C"], codes: ["C02"], kind: "stop", label: "above",
    summary: "Containerised services with automated CI/CD and deployments.",
  },
  {
    id: "aws",
    name: "AWS",
    x: 1030, y: 560, lines: ["C"], codes: ["C06"], kind: "stop", label: "above",
    summary: "EC2, S3, RDS, OpenSearch, Lambda and Cognito. I've led deployments end to end.",
  },
  {
    id: "newrelic",
    name: "New Relic",
    x: 1150, y: 560, lines: ["C"], codes: ["C07"], kind: "stop", label: "above",
    summary: "Logs, alerts and dashboards, set up so problems in production get noticed fast.",
  },

  // Interchanges (projects)
  {
    id: "contact-center",
    name: "Virtual Contact Center",
    meta: "internship · Unity · AWS",
    x: 110, y: 560, lines: ["C"], codes: ["C01"], kind: "interchange", span: [546, 574], label: "below",
    summary:
      "A contact center in a metaverse environment, built with a cross-functional team during an internship at a contact-center services company in Tokyo. Backend on Amazon GameLift; Unity client integrated with Cognito, Lambda and Amazon Connect.",
  },
  {
    id: "search",
    name: "Job Search",
    meta: "search platform",
    x: 530, y: 338, lines: ["B", "D", "C"], codes: ["B03", "D03", "C03"], kind: "interchange", span: [314, 362], label: "below",
    summary:
      "Backend services for a large job-search platform: complex search and ranking logic, batch clustering and de-duplication, and Python/Go pipelines on OpenSearch.",
  },
  {
    id: "review",
    name: "Content Review",
    meta: "LLM review pipeline",
    x: 680, y: 330, lines: ["A", "B", "D", "C"], codes: ["A03", "B04", "D04", "C04"], kind: "interchange", span: [298, 362], label: "below",
    summary:
      "Automated pre-publication quality checks for job postings, replacing a fully manual review. An asynchronous batch pipeline runs LLM validation and stores structured findings; reviewers work through them in a Rails UI. I owned it end to end, from design to deployment and monitoring.",
  },
  {
    id: "matching",
    name: "Candidate Matching",
    meta: "LLM ranking & outreach",
    x: 810, y: 330, lines: ["A", "B", "D", "C"], codes: ["A04", "B05", "D05", "C05"], kind: "interchange", span: [298, 362], label: "above",
    summary:
      "Ranks candidates against each job's requirements and drafts tailored outreach, which a person approves before anything is sent. Rails API over BigQuery, Next.js frontend, deployed on AWS.",
  },
];

// Turns a 45°/90° polyline into a path with rounded corners, the way metro maps draw bends.
export function roundedPath(points: [number, number][], radius = 26): string {
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i - 1];
    const [cx, cy] = points[i];
    const [nx, ny] = points[i + 1];
    const inLen = Math.hypot(cx - px, cy - py);
    const outLen = Math.hypot(nx - cx, ny - cy);
    const r = Math.min(radius, inLen / 2, outLen / 2);
    const ax = cx - ((cx - px) / inLen) * r;
    const ay = cy - ((cy - py) / inLen) * r;
    const bx = cx + ((nx - cx) / outLen) * r;
    const by = cy + ((ny - cy) / outLen) * r;
    d += ` L${ax.toFixed(1)},${ay.toFixed(1)} Q${cx},${cy} ${bx.toFixed(1)},${by.toFixed(1)}`;
  }
  const [lx, ly] = points[points.length - 1];
  return `${d} L${lx},${ly}`;
}
