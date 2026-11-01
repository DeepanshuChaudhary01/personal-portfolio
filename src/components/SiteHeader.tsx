"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { navStations, person } from "@/content/site";
import { LangSwitch } from "./LangSwitch";
import styles from "./SiteHeader.module.css";

function toggleTheme() {
  const root = document.documentElement;
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  const apply = () => {
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be blocked; the theme still applies for this visit.
    }
  };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduced) {
    apply();
    return;
  }
  root.dataset.vt = "theme";
  const transition = document.startViewTransition(apply);
  transition.finished.finally(() => delete root.dataset.vt);
}

export function SiteHeader({ lang }: { lang: Lang }) {
  const t = ui[lang].header;
  const jaFirst = lang === "ja";
  const [current, setCurrent] = useState("01");
  const [menuOpen, setMenuOpen] = useState(false);

  // Light up the station whose section is crossing the middle of the viewport.
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-station]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent((entry.target as HTMLElement).dataset.station ?? "01");
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const currentId = navStations.find((s) => s.code === current)?.id;

  const stationList = (onNavigate?: () => void) =>
    navStations.map((s) => (
      <li key={s.code} data-open={s.open} data-current={current === s.code || undefined}>
        <a href={`#${s.id}`} aria-current={current === s.code ? "location" : undefined} onClick={onNavigate}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.code}>DC{s.code}</span>
          <span className={`${styles.en} ${jaFirst ? "jp" : ""}`}>{jaFirst ? s.ja : s.en}</span>
          <span className={`${styles.ja} ${jaFirst ? "" : "jp"}`} lang={jaFirst ? "en" : "ja"}>
            {jaFirst ? s.en : s.ja}
          </span>
        </a>
      </li>
    ));

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href="#here" className={styles.brand}>
          <span className={styles.brandBadge} aria-hidden="true">
            DC
          </span>
          <span className={styles.brandText}>
            <strong className={jaFirst ? "jp" : undefined}>{jaFirst ? person.nameJa : person.nameEn}</strong>
            <span>
              {jaFirst ? person.nameEn : t.lineName}{" "}
              <span className="jp" lang="ja">
                DC線
              </span>
            </span>
          </span>
        </a>

        <nav aria-label={t.stations} className={styles.nav}>
          <ol className={styles.strip}>{stationList()}</ol>
        </nav>

        <div className={styles.actions}>
          <LangSwitch lang={lang} anchor={currentId === "here" ? undefined : currentId} />
          <button type="button" className={styles.theme} onClick={toggleTheme}>
            <span className={styles.toDark}>
              {jaFirst ? (
                <span className="jp">終電モード</span>
              ) : (
                <>
                  <span className="jp" lang="ja">終電</span> {t.toDark}
                </>
              )}
            </span>
            <span className={styles.toLight}>
              {jaFirst ? (
                <span className="jp">始発モード</span>
              ) : (
                <>
                  <span className="jp" lang="ja">始発</span> {t.toLight}
                </>
              )}
            </span>
            <span className="sr-only"> {t.themeHint}</span>
          </button>
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={menuOpen}
            aria-controls="station-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {t.stations}
          </button>
        </div>
      </div>

      <div id="station-menu" className={styles.menu} hidden={!menuOpen}>
        <ol className={`container ${styles.menuList}`}>{stationList(() => setMenuOpen(false))}</ol>
      </div>
    </header>
  );
}
