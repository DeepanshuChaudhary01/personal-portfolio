// Reads the resume PDF from /resume at the project root. Server-only (uses the file system);
// on Vercel this runs at build time, so the deployed site serves whatever PDF was committed.

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import type { Lang } from "@/i18n/config";

const RESUME_DIR = path.join(process.cwd(), "resume");

export const RESUME_URL = "/resume.pdf";
export const RESUME_DOWNLOAD_NAME = "Deepanshu-Chaudhary-Resume.pdf";

export type ResumeFile = {
  bytes: Uint8Array<ArrayBuffer>;
  sourceName: string;
  pages: number;
  paper: string;
  // First page height ÷ width, so the viewer can reserve space before the PDF loads.
  aspect: number;
  updated: Date;
};

// Sizes in PDF points (1/72 inch).
const PAPER_SIZES = [
  { name: "A4", w: 595.28, h: 841.89 },
  { name: "Letter", w: 612, h: 792 },
];

function paperName(width: number, height: number): string {
  const [w, h] = width < height ? [width, height] : [height, width];
  const match = PAPER_SIZES.find((p) => Math.abs(p.w - w) < 3 && Math.abs(p.h - h) < 3);
  const mm = (pt: number) => Math.round((pt / 72) * 25.4);
  return match?.name ?? `${mm(w)} × ${mm(h)} mm`;
}

async function readCandidate(name: string): Promise<ResumeFile> {
  const file = path.join(RESUME_DIR, name);
  const [buffer, info] = await Promise.all([readFile(file), stat(file)]);
  const doc = await PDFDocument.load(buffer, { updateMetadata: false, ignoreEncryption: true });
  const { width, height } = doc.getPage(0).getSize();
  return {
    bytes: new Uint8Array(buffer),
    sourceName: name,
    pages: doc.getPageCount(),
    paper: paperName(width, height),
    aspect: height / width,
    // The date stored inside the PDF survives git checkouts; file times don't.
    updated: doc.getModificationDate() ?? doc.getCreationDate() ?? info.mtime,
  };
}

// The PDF to publish: the newest one in /resume, or null if the folder has none.
export async function getResume(): Promise<ResumeFile | null> {
  let names: string[];
  try {
    names = (await readdir(RESUME_DIR)).filter((n) => n.toLowerCase().endsWith(".pdf"));
  } catch {
    return null;
  }

  const results = await Promise.allSettled(names.map(readCandidate));
  const files: ResumeFile[] = [];
  results.forEach((result, i) => {
    if (result.status === "fulfilled") files.push(result.value);
    else console.warn(`resume/${names[i]} could not be read as a PDF and was skipped.`);
  });

  files.sort((a, b) => b.updated.getTime() - a.updated.getTime() || b.sourceName.localeCompare(a.sourceName));
  return files[0] ?? null;
}

export function formatIssued(date: Date, lang: Lang = "en"): string {
  const options: Intl.DateTimeFormatOptions =
    lang === "ja" ? { year: "numeric", month: "long" } : { month: "short", year: "numeric" };
  return new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-GB", { ...options, timeZone: "Asia/Tokyo" }).format(date);
}
