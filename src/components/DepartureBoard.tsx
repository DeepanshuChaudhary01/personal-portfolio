"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { getCopy } from "@/content/site";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useTokyoClock } from "@/lib/useTokyoClock";
import { Led } from "./Led";
import styles from "./DepartureBoard.module.css";

export function DepartureBoard({ lang }: { lang: Lang }) {
  const t = ui[lang].board;
  const board = getCopy(lang).board;
  const reducedMotion = usePrefersReducedMotion();
  const clock = useTokyoClock();
  const [nowIndex, setNowIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => setNowIndex((i) => (i + 1) % board.now.length), 6000);
    return () => window.clearInterval(id);
  }, [reducedMotion, board.now.length]);

  const hour = clock ? Number(clock.h) : null;
  const asleep = hour !== null && hour < 7;
  const time = clock ? `${clock.h}:${clock.m}` : "";
  const note = !clock ? t.clockUnknown : asleep ? t.asleep(time) : t.awake(time);
  const notice = board.notice.join("   ·   ");

  return (
    <figure className={styles.board}>
      <div className={styles.head}>
        <div className={styles.title}>
          <span className="jp" lang="ja">運行情報</span>
          <span className={styles.titleEn}>{t.title}</span>
        </div>
        <div className={styles.clock}>
          <span className={styles.city}>{t.city}</span>
          <span className={styles.clockLed} aria-hidden="true">
            {clock ? `${clock.h}:${clock.m}` : "--:--"}
            <span className={styles.seconds}>{clock ? `:${clock.s}` : ":--"}</span>
          </span>
        </div>
      </div>

      <div className={styles.cols} aria-hidden="true">
        <span>
          <span className="jp">種別</span>
          {t.service}
        </span>
        <span>
          <span className="jp">行先</span>
          {t.destination}
        </span>
        <span className={styles.trackHead}>
          <span className="jp">番線</span>
          {t.track}
        </span>
      </div>

      <div className={styles.screen}>
        <div className={styles.row}>
          <span className={styles.service}>
            <Led text="先発" tone="green" className={styles.ledText} />
            <small>{t.now}</small>
          </span>
          <Led key={`${lang}-${nowIndex}`} text={board.now[nowIndex]} className={styles.ledText} />
          <span className={styles.track}>1</span>
        </div>
        <div className={styles.row}>
          <span className={styles.service}>
            <Led text="次発" className={styles.ledText} />
            <small>{t.next}</small>
          </span>
          <Led text={board.next} className={styles.ledText} />
          <span className={styles.track}>2</span>
        </div>
        <div className={styles.marquee}>
          <div className={styles.marqueeTrack}>
            <span>{notice}</span>
            <span aria-hidden="true">{notice}</span>
          </div>
        </div>
      </div>

      <figcaption className={styles.note} data-asleep={asleep || undefined}>
        {note}
      </figcaption>
    </figure>
  );
}
