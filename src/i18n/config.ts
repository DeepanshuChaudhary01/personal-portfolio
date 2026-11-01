// English lives at the root ("/", "/work/…"); Japanese mirrors it under "/ja".

export type Lang = "en" | "ja";

export const LANGS: Lang[] = ["en", "ja"];

// "/" → "/ja", "/work/x" → "/ja/work/x", "/#work" → "/ja#work".
export function localize(lang: Lang, path: string): string {
  if (lang === "en") return path;
  if (path === "/") return "/ja";
  if (path.startsWith("/#")) return `/ja${path.slice(1)}`;
  return `/ja${path}`;
}

// The same page in the other language.
export function counterpart(pathname: string, to: Lang): string {
  const base = pathname === "/ja" ? "/" : pathname.startsWith("/ja/") ? pathname.slice(3) : pathname;
  return localize(to, base);
}

// hreflang alternates for a page, given its English path.
export function alternates(lang: Lang, path: string) {
  return {
    canonical: localize(lang, path),
    languages: { en: path, ja: localize("ja", path) },
  };
}
