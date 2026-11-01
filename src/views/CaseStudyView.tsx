import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LangSwitch } from "@/components/LangSwitch";
import { RouteStrip } from "@/components/RouteStrip";
import { StationCodes } from "@/components/StationCodes";
import { localize, type Lang } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { LINE_BY_ID, lineName } from "@/content/network";
import { getCaseStudies } from "@/content/work";
import styles from "./case.module.css";

// A heading that carries both languages; the page's language is the large one.
function SectionTitle({ num, ja, en, lang }: { num: string; ja: string; en: string; lang: Lang }) {
  const jaFirst = lang === "ja";
  return (
    <h2 className={styles.h2}>
      <span className={styles.h2Num}>{num}</span>
      <span className={`${styles.h2Ja} ${jaFirst ? "" : "jp"}`} lang={jaFirst ? "en" : "ja"}>
        {jaFirst ? en : ja}
      </span>
      <span className={jaFirst ? "jp" : undefined}>{jaFirst ? ja : en}</span>
    </h2>
  );
}

// One case study, written as a short design doc. Served at /work/<slug> and /ja/work/<slug>.
export function CaseStudyView({ slug, lang }: { slug: string; lang: Lang }) {
  const t = ui[lang].caseStudy;
  const en = ui.en.caseStudy;
  const studies = getCaseStudies(lang);
  const index = studies.findIndex((c) => c.slug === slug);
  if (index < 0) notFound();

  const study = studies[index];
  const total = studies.length;
  const prev = studies[(index - 1 + total) % total];
  const next = studies[(index + 1) % total];
  const colors = study.lines.map((id) => LINE_BY_ID[id].color);
  const routeNo = (n: number) => String(n + 1).padStart(2, "0");
  // The sign's band shows every line the interchange serves, stacked like the map's trunk.
  const band = `linear-gradient(to bottom, ${colors
    .map((c, n) => `${c} ${(n / colors.length) * 100}% ${((n + 1) / colors.length) * 100}%`)
    .join(", ")})`;

  return (
    <div className={`${styles.page} ${lang === "ja" ? "lang-ja" : ""}`} lang={lang}>
      <div className={styles.toolbar}>
        <div className={`container ${styles.toolbarInner}`}>
          <Link href={localize(lang, "/#work")} className={styles.back}>
            <span aria-hidden="true">←</span> {t.back}
          </Link>
          <span className={styles.position}>{t.position(routeNo(index), String(total).padStart(2, "0"))}</span>
          <div className={styles.toolbarEnd}>
            <LangSwitch lang={lang} />
            <Link href={localize(lang, `/work/${next.slug}`)} className={styles.nextLink}>
              {t.nextRoute} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      <main className="container">
        <header className={styles.sign}>
          <div className={styles.signTop}>
            <StationCodes codes={study.codes} size="md" />
            <span className={styles.signKind}>
              <span className="jp" lang="ja">乗換駅</span>{" "}
              {lang === "ja" ? `Interchange · Route ${routeNo(index)}` : t.interchange(routeNo(index))}
            </span>
          </div>
          <h1 className={styles.title}>{study.title}</h1>
          <p className={styles.kind}>{study.kind}</p>
          <p className={styles.summary}>{study.summary}</p>
          <div className={styles.band} style={{ "--band": band } as CSSProperties} aria-hidden="true" />
        </header>

        {study.nda && <p className={styles.nda}>{t.nda}</p>}

        <section className={styles.routeCard} aria-labelledby="route-title">
          <h2 id="route-title" className={styles.routeTitle}>
            <span className="jp" lang="ja">路線</span> {lang === "ja" ? en.route : t.route}
          </h2>
          <RouteStrip stops={study.route} colors={colors} size="full" />
        </section>

        <div className={styles.body}>
          <article className={styles.main}>
            <section>
              <SectionTitle num="01" ja="課題" en={en.problem} lang={lang} />
              {study.problem.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>

            <section>
              <SectionTitle num="02" ja="構成" en={en.built} lang={lang} />
              {study.built.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>

            <section>
              <SectionTitle num="03" ja="判断" en={en.decisions} lang={lang} />
              <ol className={styles.decisions}>
                {study.decisions.map((d, i) => (
                  <li key={d.title}>
                    <span className={styles.decisionNum} aria-hidden="true">
                      {i + 1}
                    </span>
                    <div>
                      <h3>{d.title}</h3>
                      <p>{d.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <SectionTitle num="04" ja="結果" en={en.outcome} lang={lang} />
              {study.outcome.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          </article>

          <aside className={styles.aside}>
            <dl className={styles.facts}>
              <div>
                <dt>{t.where}</dt>
                <dd>{study.where}</dd>
              </div>
              <div>
                <dt>{t.role}</dt>
                <dd>{study.role}</dd>
              </div>
              <div>
                <dt>{t.lines}</dt>
                <dd className={styles.lines}>
                  {study.lines.map((id) => (
                    <span key={id} style={{ "--c": LINE_BY_ID[id].color } as CSSProperties}>
                      {lineName(LINE_BY_ID[id], lang)}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt>{t.stack}</dt>
                <dd>
                  <ul className={styles.stack}>
                    {study.stack.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>

            {study.numbers && study.numbers.length > 0 && (
              <div className={styles.numbers}>
                <p className={styles.numbersTitle}>{t.numbers}</p>
                <dl>
                  {study.numbers.map((n) => (
                    <div key={n.label}>
                      <dt>{n.value}</dt>
                      <dd>{n.label}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </aside>
        </div>

        <nav className={styles.adjacent} aria-label={t.more}>
          <div className={styles.adjacentBand} aria-hidden="true">
            <span className={styles.marker} />
          </div>
          <div className={styles.adjacentRow}>
            <Link href={localize(lang, `/work/${prev.slug}`)} className={styles.prev}>
              <span className={styles.dir}>
                <span aria-hidden="true">←</span> <span className="jp" lang="ja">前</span>{" "}
                {lang === "ja" ? en.previousRoute : t.previousRoute}
              </span>
              <strong>{prev.title}</strong>
              <span className={styles.dirKind}>{prev.kind}</span>
            </Link>
            <Link href={localize(lang, `/work/${next.slug}`)} className={styles.next}>
              <span className={styles.dir}>
                {lang === "ja" ? en.nextRoute : t.nextRoute} <span className="jp" lang="ja">次</span>{" "}
                <span aria-hidden="true">→</span>
              </span>
              <strong>{next.title}</strong>
              <span className={styles.dirKind}>{next.kind}</span>
            </Link>
          </div>
        </nav>
      </main>
    </div>
  );
}
