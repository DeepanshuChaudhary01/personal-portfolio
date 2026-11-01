// Builds the two Japanese fonts (Noto Sans JP and DotGothic16) as subsets that contain only the
// characters this site uses, instead of shipping dozens of unicode-range slices. Google Fonts does
// the subsetting (the `text` parameter); the files are saved to src/fonts and served by next/font/local.
//
// Runs before `dev` and `build`, but only downloads when the set of characters in src/ has changed
// since the last run (recorded in src/fonts/manifest.json). Run it by hand with `npm run fonts`.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const srcDir = path.join(root, "src");
const fontsDir = path.join(srcDir, "fonts");
const manifestFile = path.join(fontsDir, "manifest.json");

const FONTS = [
  // One variable file covering every weight the site uses.
  { file: "noto-sans-jp.woff2", family: "Noto+Sans+JP:wght@400..900" },
  { file: "dotgothic16.woff2", family: "DotGothic16" },
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

function siteCharacters() {
  const chars = new Set();
  // Printable ASCII is always included: these fonts also set Latin text (badges, LED boards).
  for (let c = 0x20; c < 0x7f; c++) chars.add(String.fromCharCode(c));
  for (const file of sourceFiles(srcDir)) {
    for (const ch of readFileSync(file, "utf8")) if (ch.codePointAt(0) > 0x7e) chars.add(ch);
  }
  return [...chars].sort().join("");
}

const chars = siteCharacters();
const manifest = existsSync(manifestFile) ? JSON.parse(readFileSync(manifestFile, "utf8")) : null;
const haveFiles = FONTS.every((f) => existsSync(path.join(fontsDir, f.file)));

if (manifest?.chars === chars && haveFiles) {
  console.log(`✓ Font subsets are up to date (${[...chars].length} characters).`);
  process.exit(0);
}

async function download(font) {
  const url = `https://fonts.googleapis.com/css2?family=${font.family}&text=${encodeURIComponent(chars)}&display=swap`;
  const css = await (await fetch(url, { headers: { "User-Agent": USER_AGENT } })).text();
  const src = css.match(/src:\s*url\((https:[^)]+)\)\s*format\(['"]woff2['"]\)/)?.[1];
  if (!src) throw new Error(`No WOFF2 subset returned for ${font.family}`);
  const bytes = Buffer.from(await (await fetch(src)).arrayBuffer());
  writeFileSync(path.join(fontsDir, font.file), bytes);
  return `${font.file} ${(bytes.length / 1024).toFixed(1)} KB`;
}

try {
  mkdirSync(fontsDir, { recursive: true });
  const written = await Promise.all(FONTS.map(download));
  writeFileSync(manifestFile, JSON.stringify({ chars }, null, 2) + "\n");
  console.log(`✓ Font subsets rebuilt for ${[...chars].length} characters: ${written.join(", ")}.`);
} catch (err) {
  if (haveFiles) {
    // Offline: keep the old subsets. Any new characters fall back to system Japanese fonts.
    console.warn(`! Couldn't refresh font subsets (${err.message}); using the existing files.`);
  } else {
    console.error(`✗ Couldn't build font subsets: ${err.message}`);
    process.exit(1);
  }
}
