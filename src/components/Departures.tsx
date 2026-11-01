import type { CSSProperties } from "react";
import type { Lang } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { DEPARTURES, FEEDS, TOPICS } from "@/content/feeds";
import { getDepartures } from "@/lib/departures";
import { SectionSign } from "./SectionSign";
import styles from "./Departures.module.css";

const NEW_WITHIN_MS = 48 * 60 * 60 * 1000;

function formats(lang: Lang) {
  const tokyo = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(ui[lang].dateLocale, { timeZone: "Asia/Tokyo", ...options });
  return lang === "ja"
    ? { day: tokyo({ month: "2-digit", day: "2-digit" }), stamp: tokyo({ month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }) }
    : {
        day: tokyo({ day: "2-digit", month: "short" }),
        stamp: tokyo({ day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
      };
}

// DC05: recent articles from blogs I follow, as a station's departure board.
export async function Departures({ lang }: { lang: Lang }) {
  const t = ui[lang].departures;
  const { day, stamp } = formats(lang);
  const { rows, sources, updated } = await getDepartures();

  return (
    <section id="departures" data-station="05" className="section" aria-labelledby="departures-title">
      <div className="container">
        <SectionSign num="05" ja="発車案内" en="Departures" id="departures-title" lang={lang}>
          {ui[lang].sections.departures(DEPARTURES.refreshSeconds / 3600)}
        </SectionSign>

        <div className={styles.board}>
          <div className={styles.head}>
            <p className={styles.title}>
              <span className="jp" lang="ja">発車案内</span>
              <span className={styles.titleEn}>{t.title}</span>
            </p>
            <p className={styles.updated}>
              <span className="jp" lang="ja">更新</span> {stamp.format(updated)} JST
            </p>
          </div>

          <div className={styles.cols} aria-hidden="true">
            <span>
              <span className="jp">時刻</span>
              {t.date}
            </span>
            <span>
              <span className="jp">種別</span>
              {t.line}
            </span>
            <span>
              <span className="jp">行先</span>
              {t.destination}
            </span>
          </div>

          {rows.length > 0 ? (
            <ol className={styles.rows}>
              {rows.map((row) => {
                const topic = TOPICS[row.topic];
                const fresh = updated.getTime() - row.date.getTime() < NEW_WITHIN_MS;
                return (
                  <li key={row.url}>
                    <a href={row.url} target="_blank" rel="noreferrer" className={styles.row} lang="en">
                      <time dateTime={row.date.toISOString()} className={styles.date}>
                        {day.format(row.date)}
                      </time>
                      <span className={styles.type} style={{ "--c": topic.color } as CSSProperties} lang={lang}>
                        <b>{topic.letter}</b>
                        {lang === "ja" ? topic.labelJa : topic.label}
                      </span>
                      <span className={styles.dest}>
                        <span className={styles.headline}>
                          {fresh && (
                            <span className={styles.fresh} lang={lang}>
                              <span className="jp" lang="ja">新着</span>
                              {t.fresh && ` ${t.fresh}`}
                            </span>
                          )}
                          {row.title}
                        </span>
                        <span className={styles.source}>{row.source}</span>
                      </span>
                      <span className={styles.go} aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className={styles.suspended}>
              <span className="jp" lang="ja">運転見合わせ</span> {t.suspended}
            </p>
          )}

          <p className={styles.foot}>
            {t.running(sources, FEEDS.length)} · {FEEDS.map((f) => f.name).join(" · ")}
          </p>
        </div>
      </div>
    </section>
  );
}
