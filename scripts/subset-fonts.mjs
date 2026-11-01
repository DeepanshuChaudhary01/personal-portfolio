// Builds the two Japanese fonts (Noto Sans JP and DotGothic16) as subsets that contain only the
// characters this site uses, instead of shipping dozens of unicode-range slices. Google Fonts does
// the subsetting (the `text` parameter); the files are saved to src/fonts and served by next/font/local.
//
// Noto Sans JP is the signage font (station names, labels). Japanese prose (the /ja translations) is set
// in the reader's system Japanese font instead, so those files are left out of its subset; otherwise
// every English visitor would download hundreds of kanji. DotGothic16 (the LED boards) also covers the
// Japanese board messages in content/ja/site.ts.
//
// Runs before `dev` and `build`, but only downloads when a character set has changed since the last run
// (recorded in src/fonts/manifest.json). Run it by hand with `npm run fonts`.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const srcDir = path.join(root, "src");
const fontsDir = path.join(srcDir, "fonts");
const manifestFile = path.join(fontsDir, "manifest.json");

const rel = (file) => path.relative(srcDir, file).split(path.sep).join("/");
const isJapaneseProse = (file) => rel(file).startsWith("content/ja/") || rel(file) === "i18n/ja.ts";
const isLedMessages = (file) => rel(file) === "content/ja/site.ts";

const FONTS = [
  // One variable file covering every weight the site uses.
  { file: "noto-sans-jp.woff2", family: "Noto+Sans+JP:wght@400..900", includes: (f) => !isJapaneseProse(f) },
  { file: "dotgothic16.woff2", family: "DotGothic16", includes: (f) => !isJapaneseProse(f) || isLedMessages(f) },
];

// Google only serves WOFF2 to browsers it recognises.
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

function sourceFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "fonts" ? [] : sourceFiles(full);
    return /\.(tsx?|css)$/.test(entry.name) ? [full] : [];
  });
}

function characters(files) {
  const chars = new Set();
  // Printable ASCII is always included: these fonts also set Latin text (badges, LED boards).
  for (let c = 0x20; c < 0x7f; c++) chars.add(String.fromCharCode(c));
  for (const file of files) {
    for (const ch of readFileSync(file, "utf8")) if (ch.codePointAt(0) > 0x7e) chars.add(ch);
  }
  return [...chars].sort().join("");
}

const files = sourceFiles(srcDir);
const wanted = Object.fromEntries(FONTS.map((f) => [f.file, characters(files.filter(f.includes))]));
const manifest = existsSync(manifestFile) ? JSON.parse(readFileSync(manifestFile, "utf8")) : {};
const stale = FONTS.filter((f) => manifest[f.file] !== wanted[f.file] || !existsSync(path.join(fontsDir, f.file)));

if (stale.length === 0) {
  console.log(`✓ Font subsets are up to date (${FONTS.map((f) => `${f.file}: ${[...wanted[f.file]].length}`).join(", ")} characters).`);
  process.exit(0);
}

async function download(font) {
  const text = encodeURIComponent(wanted[font.file]);
  const url = `https://fonts.googleapis.com/css2?family=${font.family}&text=${text}&display=swap`;
  const css = await (await fetch(url, { headers: { "User-Agent": USER_AGENT } })).text();
  const src = css.match(/src:\s*url\((https:[^)]+)\)\s*format\(['"]woff2['"]\)/)?.[1];
  if (!src) throw new Error(`No WOFF2 subset returned for ${font.family}`);
  const bytes = Buffer.from(await (await fetch(src)).arrayBuffer());
  writeFileSync(path.join(fontsDir, font.file), bytes);
  manifest[font.file] = wanted[font.file];
  return `${font.file} ${(bytes.length / 1024).toFixed(1)} KB (${[...wanted[font.file]].length} characters)`;
}

try {
  mkdirSync(fontsDir, { recursive: true });
  const written = await Promise.all(stale.map(download));
  delete manifest.chars; // format used before per-font sets
  writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`✓ Font subsets rebuilt: ${written.join(", ")}.`);
} catch (err) {
  if (FONTS.every((f) => existsSync(path.join(fontsDir, f.file)))) {
    // Offline: keep the old subsets. Any new characters fall back to system Japanese fonts.
    console.warn(`! Couldn't refresh font subsets (${err.message}); using the existing files.`);
  } else {
    console.error(`✗ Couldn't build font subsets: ${err.message}`);
    process.exit(1);
  }
}
