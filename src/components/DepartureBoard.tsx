"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { board } from "@/content/site";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import styles from "./DepartureBoard.module.css";

type Clock = { h: string; m: string; s: string };

function tokyoNow(): Clock {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return { h: get("hour"), m: get("minute"), s: get("second") };
}

// Each character lights up a beat after the previous one, like an LED board refreshing.
function Led({ text, tone = "amber" }: { text: string; tone?: "amber" | "green" }) {
  return (
    <span className={styles.led} data-tone={tone}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {Array.from(text).map((ch, i) => (
          <span key={i} style={{ "--i": i } as CSSProperties}>
            {ch}
          </span>
        ))}
      </span>
    </span>
  );
}

export function DepartureBoard() {
  const reducedMotion = usePrefersReducedMotion();
  const [clock, setClock] = useState<Clock | null>(null);
  const [nowIndex, setNowIndex] = useState(0);

  useEffect(() => {
    const tick = () => setClock(tokyoNow());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => setNowIndex((i) => (i + 1) % board.now.length), 6000);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  const hour = clock ? Number(clock.h) : null;
  const asleep = hour !== null && hour < 7;
  const note = !clock
    ? "Local time in Tokyo (JST, UTC+9)"
    : asleep
      ? `It's ${clock.h}:${clock.m} in Tokyo, so I'm probably asleep. I'll reply in the morning.`
      : `It's ${clock.h}:${clock.m} in Tokyo. I usually reply within a day.`;
  const notice = board.notice.join("   ·   ");

  return (
    <figure className={styles.board}>
      <div className={styles.head}>
        <div className={styles.title}>
          <span className="jp" lang="ja">運行情報</span>
          <span className={styles.titleEn}>Service status</span>
        </div>
        <div className={styles.clock}>
          <span className={styles.city}>Tokyo</span>
          <span className={styles.clockLed} aria-hidden="true">
            {clock ? `${clock.h}:${clock.m}` : "--:--"}
            <span className={styles.seconds}>{clock ? `:${clock.s}` : ":--"}</span>
          </span>
        </div>
      </div>

      <div className={styles.cols} aria-hidden="true">
        <span>
          <span className="jp">種別</span>Service
        </span>
        <span>
          <span className="jp">行先</span>Destination
        </span>
        <span className={styles.trackHead}>
          <span className="jp">番線</span>Track
        </span>
      </div>

      <div className={styles.screen}>
        <div className={styles.row}>
          <span className={styles.service}>
            <Led text="先発" tone="green" />
            <small>Now</small>
          </span>
          <Led key={nowIndex} text={board.now[nowIndex]} />
          <span className={styles.track}>1</span>
        </div>
        <div className={styles.row}>
          <span className={styles.service}>
            <Led text="次発" />
            <small>Next</small>
          </span>
          <Led text={board.next} />
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
