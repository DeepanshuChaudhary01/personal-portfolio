import type { CSSProperties } from "react";
import Link from "next/link";
import { localize, type Lang } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { LINE_BY_ID } from "@/content/network";
import { getCaseStudies } from "@/content/work";
import { RouteStrip } from "./RouteStrip";
import { SectionSign } from "./SectionSign";
import { StationCodes } from "./StationCodes";
import styles from "./WorkSection.module.css";

// DC03: each case study is a route card linking to its full write-up.
export function WorkSection({ lang }: { lang: Lang }) {
  const t = ui[lang];
  return (
    <section id="work" data-station="03" className="section" aria-labelledby="work-title">
      <div className="container">
        <SectionSign num="03" ja="実績" en="Work" id="work-title" lang={lang}>
          {t.sections.work}
        </SectionSign>

        <ol className={styles.grid}>
          {getCaseStudies(lang).map((study, i) => {
            const colors = study.lines.map((id) => LINE_BY_ID[id].color);
            const first = study.route[0].name;
            const last = study.route[study.route.length - 1].name;
            const stripe = colors
              .map((c, n) => `${c} ${(n / colors.length) * 100}% ${((n + 1) / colors.length) * 100}%`)
              .join(", ");
            return (
              <li key={study.slug}>
                <Link
                  href={localize(lang, `/work/${study.slug}`)}
                  className={styles.card}
                  style={{ "--stripe": `linear-gradient(90deg, ${stripe})` } as CSSProperties}
                >
                  <div className={styles.top}>
                    <StationCodes codes={study.codes} />
                    <span className={styles.routeNo}>{t.work.route(String(i + 1).padStart(2, "0"))}</span>
                  </div>

                  <h3 className={styles.title}>
                    {study.title}
                    <span className={styles.kind}>{study.kind}</span>
                  </h3>
                  <p className={styles.summary}>{study.summary}</p>

                  <div className={styles.route}>
                    <RouteStrip stops={study.route} colors={colors} size="mini" />
                    <p className={styles.caption}>{t.work.stops(first, last, study.route.length)}</p>
                  </div>

                  <div className={styles.foot}>
                    <span className={styles.stack}>{study.stack.slice(0, 4).join(" · ")}</span>
                    <span className={styles.more}>
                      {t.work.read} <span aria-hidden="true">→</span>
                    </span>
                  </div>

                  {!study.nda && (
                    <span className={styles.onboard}>
                      <span className="jp" lang="ja">乗車中</span> {t.work.onboard}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
