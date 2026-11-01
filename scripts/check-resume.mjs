// Stops a build if a PDF the site would publish (any PDF directly inside /resume) contains details
// that must stay private. Runs before every `npm run build`; run it alone with `npm run check:resume`.
//
// Private terms are read from resume/private/blocklist.txt (git-ignored, one per line) and from the
// RESUME_BLOCKLIST environment variable (comma- or newline-separated), which is how Vercel gets them.
// They are kept out of the repo on purpose: listing them in a committed file would publish them too.
// Phone numbers are always checked.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// pdf.js expects Promise.withResolvers, which Node only has from v22.
Promise.withResolvers ??= function () {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

// pdf.js logs browser-only warnings ("Cannot polyfill DOMMatrix" etc.) that don't affect reading text.
for (const method of ["log", "warn"]) {
  const original = console[method];
  console[method] = (...args) => (String(args[0]).startsWith("Warning:") ? undefined : original(...args));
}

const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");

const resumeDir = fileURLToPath(new URL("../resume/", import.meta.url));
const blocklistFile = path.join(resumeDir, "private", "blocklist.txt");

const terms = [
  ...(process.env.RESUME_BLOCKLIST ?? "").split(/[,\n]/),
  ...(existsSync(blocklistFile) ? readFileSync(blocklistFile, "utf8").split(/\r?\n/) : []),
]
  .map((t) => t.trim())
  .filter((t) => t && !t.startsWith("#"));

const PHONE_PATTERNS = [
  /\+\d{1,3}[\s-]*\d[\d\s-]{7,}\d/, // +81 70 1234 5678
  /\b0\d{1,4}-\d{1,4}-\d{4}\b/, // 070-1234-5678
  /\b\d{10,11}\b/, // 07012345678
];

async function pdfText(file) {
  const task = getDocument({ data: new Uint8Array(readFileSync(file)), verbosity: 0, isEvalSupported: false });
  const doc = await task.promise;
  let text = "";
  for (let n = 1; n <= doc.numPages; n++) {
    const content = await (await doc.getPage(n)).getTextContent();
    text += content.items.map((item) => ("str" in item ? item.str : "")).join(" ") + "\n";
  }
  await task.destroy();
  return text.replace(/\s+/g, " ");
}

// PDF text extraction can split words oddly, so terms are also matched with all spaces removed.
const compact = (s) => s.replace(/\s+/g, "").toLowerCase();

const pdfs = existsSync(resumeDir) ? readdirSync(resumeDir).filter((n) => n.toLowerCase().endsWith(".pdf")) : [];
let problems = 0;

for (const name of pdfs) {
  const text = await pdfText(path.join(resumeDir, name));
  const flat = compact(text);
  const phone = PHONE_PATTERNS.map((re) => text.match(re)?.[0]).find(Boolean);
  const found = [
    ...terms.filter((t) => text.toLowerCase().includes(t.toLowerCase()) || flat.includes(compact(t))),
    ...(phone ? [`phone number (${phone.trim()})`] : []),
  ];
  if (found.length > 0) {
    problems += found.length;
    console.error(`\n✗ resume/${name} contains details the public site must not show:`);
    for (const f of found) console.error(`    - ${f}`);
  } else {
    console.log(`✓ resume/${name} is clear to publish.`);
  }
}

if (terms.length === 0) {
  console.warn(
    "! No private terms configured (resume/private/blocklist.txt or RESUME_BLOCKLIST), so only phone numbers were checked.",
  );
}

if (problems > 0) {
  console.error("\nRemove them from the PDF, or move the file into resume/private/ so it isn't published.\n");
  process.exit(1);
}
