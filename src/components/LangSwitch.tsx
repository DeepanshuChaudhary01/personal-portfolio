"use client";

import type { MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { counterpart, LANGS, type Lang } from "@/i18n/config";
import styles from "./LangSwitch.module.css";

type Props = {
  lang: Lang;
  // Section to land on in the other language (the home page passes the current station).
  anchor?: string;
  tone?: "light" | "dark";
  size?: "sm" | "md";
};

// EN | 日本語. A full page load, so the new page's <html lang> and fonts are set from the start.
export function LangSwitch({ lang, anchor, tone = "light", size = "md" }: Props) {
  const pathname = usePathname();

  const go = (to: Lang) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const hash = anchor ? `#${anchor}` : window.location.hash;
    window.location.assign(counterpart(pathname, to) + hash);
  };

  return (
    <div className={styles.switch} data-tone={tone} data-size={size} role="group" aria-label="Language / 言語">
      {LANGS.map((l) => (
        <a
          key={l}
          href={counterpart(pathname, l)}
          hrefLang={l}
          lang={l}
          aria-current={l === lang ? "true" : undefined}
          onClick={l === lang ? undefined : go(l)}
          className={l === "ja" ? "jp" : undefined}
        >
          {l === "en" ? "EN" : "日本語"}
        </a>
      ))}
    </div>
  );
}
