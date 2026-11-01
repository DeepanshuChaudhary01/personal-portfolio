// Case studies for DC03 · Work. Written as short design docs: problem, what was built, decisions, outcome.
//
// NDA rule: no employer names, no internal figures. Facts come from the resume; anything that is
// reasoning rather than a stated fact is marked `CHECK:` so it can be confirmed before publishing.

import type { LineId } from "./network";

export type RouteStop = { name: string; note: string };

export type CaseStudy = {
  slug: string;
  title: string;
  kind: string;
  // Station badges: the project's codes on the route map, or its own for this site.
  codes: { line: string; num: string; color: string }[];
  lines: LineId[];
  where: string;
  role: string;
  summary: string;
  stack: string[];
  route: RouteStop[];
  problem: string[];
  built: string[];
  decisions: { title: string; body: string }[];
  outcome: string[];
  nda: boolean;
  numbers?: { value: string; label: string }[];
};

const ai = "var(--line-ai)";
const backend = "var(--line-backend)";
const data = "var(--line-data)";
const cloud = "var(--line-cloud)";

export const caseStudies: CaseStudy[] = [
  {
    slug: "llm-content-review",
    title: "Content Review",
    kind: "LLM review pipeline",
    codes: [
      { line: "A", num: "03", color: ai },
      { line: "B", num: "04", color: backend },
      { line: "D", num: "04", color: data },
      { line: "C", num: "04", color: cloud },
    ],
    lines: ["A", "B", "D", "C"],
    where: "Major HR-tech company · Tokyo",
    role: "Owned it end to end: design, prompts, the Rails app and reviewer UI, AWS deployment, monitoring and tests.",
    summary:
      "Automated pre-publication quality checks for job postings with an LLM pipeline, replacing a fully manual review.",
    stack: ["Ruby on Rails", "Solid Queue", "MySQL (RDS)", "AWS", "LLM APIs", "New Relic", "RSpec"],
    route: [
      { name: "New postings", note: "picked up on a schedule" },
      { name: "Solid Queue", note: "batch job, in the background" },
      { name: "LLM check", note: "structured findings" },
      { name: "Quality gate", note: "validate, or fail" },
      { name: "MySQL", note: "review results" },
      { name: "Reviewer UI", note: "people act on findings" },
    ],
    problem: [
      // CHECK: the costs of the manual process are inferred, not stated on the resume.
      "Every job posting was checked by a person before it went live. Reviewers read each posting from scratch, so the process was slow, grew with volume, and was only as consistent as whoever picked it up.",
    ],
    built: [
      "A background pipeline that picks up new postings on a schedule, has an LLM review each one, checks the answer, and stores structured findings. Reviewers work through those findings in a Rails app built for them.",
    ],
    decisions: [
      {
        title: "Run it in the background, on a schedule",
        // CHECK: the reasons for batching are inferred from "asynchronous batch pipeline".
        body: "Model calls are slow and can fail, so reviews run as Solid Queue batch jobs instead of inside anyone's request. New postings are picked up on a fixed schedule; a slow or failed call delays one review, not the people using the system.",
      },
      {
        title: "Ask for findings, not essays",
        body: "Prompts ask for specific, actionable findings in a fixed structure rather than free-form text. Structured results can be stored in MySQL, filtered and shown in a UI, which a paragraph of model prose can't.",
      },
      {
        title: "Don't trust the model's output",
        // CHECK: "handled as a failure rather than shown as a finding" describes what the gate is for.
        body: "Every response passes automated quality gates before it counts: output validation catches malformed or unsupported answers, and error handling covers API failures. A response that fails the gate is handled as a failure rather than shown to reviewers as a finding.",
      },
      {
        title: "Make it observable from day one",
        body: "New Relic logs, alerts and dashboards show how the pipeline behaves in production, and RSpec unit and integration tests cover the pipeline and the app.",
      },
    ],
    outcome: [
      "Pre-publication review moved from fully manual checking to an automated first pass, with reviewers working from structured findings in their own UI. The pipeline runs in production on AWS.",
    ],
    nda: true,
  },
  {
    slug: "llm-candidate-matching",
    title: "Candidate Matching",
    kind: "LLM ranking & outreach",
    codes: [
      { line: "A", num: "04", color: ai },
      { line: "B", num: "05", color: backend },
      { line: "D", num: "05", color: data },
      { line: "C", num: "05", color: cloud },
    ],
    lines: ["A", "B", "D", "C"],
    where: "Major HR-tech company · Tokyo",
    role: "Built the full stack: the Next.js frontend, the Rails API, the LLM services and the AWS deployment.",
    summary:
      "Ranks candidates against each job's requirements and drafts tailored outreach, with a person approving every message before it's sent.",
    stack: ["Ruby on Rails", "Next.js", "Google BigQuery", "AWS", "LLM APIs"],
    route: [
      { name: "Recruiter filters", note: "Next.js" },
      { name: "JSON API", note: "Rails, versioned" },
      { name: "ID lookup", note: "BigQuery, phase 1" },
      { name: "Profiles", note: "BigQuery, phase 2, parallel" },
      { name: "LLM ranking", note: "scored against the job" },
      { name: "Outreach draft", note: "tailored to the job" },
      { name: "Human review", note: "approve, then schedule" },
    ],
    problem: [
      "Recruiters found candidates through manual, criteria-based search, then judged fit and wrote outreach by hand.",
    ],
    built: [
      "A versioned Rails JSON API over BigQuery that turns recruiters' filters into queries, an LLM service that scores candidates against each job's requirements, and LLM-drafted outreach that a person reviews before it's scheduled to send.",
    ],
    decisions: [
      {
        title: "Look up IDs first, fetch profiles second",
        // CHECK: the cost explanation assumes BigQuery's usual pricing by data scanned.
        body: "Search runs in two phases: a narrow query finds the IDs that match the filters, and only then are full profiles fetched for that shortlist. BigQuery cost follows the data a query reads, so the heavy read happens on far fewer rows.",
      },
      {
        title: "Generate SQL from the filter schema",
        body: "Filters arrive as a nested, multi-category structure. The API generates the SQL from that structure dynamically, rather than hand-writing a query for each combination of filters.",
      },
      {
        title: "Parallel, with a deadline",
        body: "Profile queries run in parallel, each bounded by a timeout. If one fails, the others' BigQuery jobs are cancelled automatically, so a request that has already failed doesn't leave work running behind it. Profiles load faster and failures stay contained.",
      },
      {
        title: "The model drafts, a person decides",
        body: "The LLM ranks candidates and writes outreach tailored to each job description, but every message goes through human review before its scheduled delivery.",
      },
    ],
    outcome: [
      "Recruiters went from manual, criteria-based search to ranked candidates with drafted outreach, and a person still approves every message that goes out.",
    ],
    nda: true,
  },
  {
    slug: "job-search-platform",
    title: "Job Search",
    kind: "Search platform",
    codes: [
      { line: "B", num: "03", color: backend },
      { line: "D", num: "03", color: data },
      { line: "C", num: "03", color: cloud },
    ],
    lines: ["B", "D", "C"],
    where: "Major HR-tech company · Tokyo",
    role: "Backend services, batch data pipelines, CI/CD and AWS deployments.",
    summary:
      "Backend services and data pipelines for a large job-search platform: search and ranking, clustering and de-duplication, indexing on OpenSearch.",
    stack: ["Ruby on Rails", "Python", "Go", "OpenSearch", "AWS"],
    route: [
      { name: "Job data", note: "incoming postings" },
      { name: "Clustering", note: "group similar jobs" },
      { name: "De-duplication", note: "one listing per job" },
      { name: "Indexing", note: "Python and Go" },
      { name: "OpenSearch", note: "query and validate" },
      { name: "Search & ranking", note: "backend services" },
    ],
    problem: [
      // CHECK: why duplicates hurt is inferred from "clustering and deduplication to improve relevance, consistency and SEO".
      "Search is only as good as the data behind it. When the same job reaches the platform more than once, duplicates crowd out other results, make the data inconsistent and split pages for search engines.",
    ],
    built: [
      // CHECK: the order (clean, then index) is a simplification of separate pipelines.
      "Backend services for search and ranking, batch pipelines that cluster and de-duplicate job data, and Python and Go pipelines that index, query and validate that data on OpenSearch.",
    ],
    decisions: [
      {
        title: "Clean the data in batch",
        body: "Clustering groups similar postings and de-duplication keeps one listing per job. Doing it in batch pipelines improves search relevance, data consistency and SEO together, without adding work to every search request.",
      },
      {
        title: "Validate what you index",
        // CHECK: the reason for validation is inferred.
        body: "The Python and Go pipelines don't just index: they also query and validate the data on OpenSearch, so problems surface in the pipeline rather than in someone's search results.",
      },
      {
        title: "Same deploy, every time",
        body: "CI/CD and AWS deployments are automated. The work spanned the AI and IT teams, in Japanese and English.",
      },
    ],
    outcome: [
      "Search and ranking services scaled for a large platform, with cleaner, de-duplicated data behind them for better relevance and SEO.",
    ],
    nda: true,
  },
  {
    slug: "dc-line",
    title: "DC Line",
    kind: "this website",
    codes: [{ line: "DC", num: "00", color: ai }],
    lines: ["B", "C"],
    where: "Personal project · 2026",
    role: "Design and code.",
    summary:
      "The site you're on: a Tokyo rail line in Next.js, with a resume that publishes itself and a build that refuses to leak private details.",
    stack: ["Next.js", "TypeScript", "React", "pdf.js", "pdf-lib", "Vercel"],
    route: [
      { name: "Content files", note: "copy, map, case studies" },
      { name: "resume/ folder", note: "the PDF is the source" },
      { name: "Privacy check", note: "runs before every build" },
      { name: "Static build", note: "every route prerendered" },
      { name: "Vercel", note: "free tier, global CDN" },
      { name: "Your browser", note: "SVG, CSS, Web Animations" },
    ],
    problem: [
      "Most of my work is under NDA, so the usual portfolio of screenshots and metrics was off the table. I still wanted something that shows how I build: a site with a point of view, a resume that's easy to keep current, and no way to leak what has to stay private.",
    ],
    built: [
      "A static Next.js site themed as a Tokyo rail line. Sections are stations, skills are a route map, and the intro is a train pulling into the platform. Everything is drawn in code.",
    ],
    decisions: [
      {
        title: "The resume is a file, not a page",
        body: "Whatever PDF sits in the resume/ folder is the resume. A static route serves it, pdf.js draws it on the page so it looks the same on every device, and pdf-lib reads its page count, paper size and date for the ticket on the home page. Updating it means replacing one file.",
      },
      {
        title: "A build that refuses to leak",
        body: "Before every build, a script extracts the PDF's text and stops the build if it finds a phone number or any term from a private blocklist. The blocklist lives outside the repo (a git-ignored file locally, an environment variable on Vercel), because committing the list would publish it.",
      },
      {
        title: "Motion drawn in code",
        body: "The intro, the route map and the LED boards are SVG, CSS and the Web Animations API: no video and no animation library. All of it respects reduced-motion settings, and the intro decides whether to show before the first paint, so nothing flashes.",
      },
      {
        title: "Static and free",
        body: "Every route, the PDF included, is prerendered at build time and served from Vercel's free tier. There is no server to keep warm, so the first visitor never waits for one to wake up.",
      },
    ],
    outcome: [
      "A portfolio that can show NDA'd work honestly, a resume that updates by replacing one file, and a privacy check on every build.",
    ],
    nda: false,
    // Counts that hold wherever it's hosted; byte sizes depend on the host's compression.
    numbers: [
      { value: "7", label: "routes, all prerendered at build time" },
      { value: "0", label: "images or videos in the page; everything is drawn in code" },
      { value: "0", label: "animation libraries: SVG, CSS and the Web Animations API" },
      { value: "1", label: "PDF, checked for private details before every build" },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
