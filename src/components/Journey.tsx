"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { localize, type Lang } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { getJourney, type JourneyStop } from "@/content/journey";
import { EmailMenu } from "./EmailMenu";
import { SectionSign } from "./SectionSign";
import styles from "./Journey.module.css";

// "Jul 2020" → a big year with the month under it, like a timetable. "2022" or "Next" stay whole.
function When({ when, lang }: { when: string; lang: Lang }) {
  const t = ui[lang].journey;
  const match = when.match(/^(\w{3}) (\d{4})$/);
  return (
    <span className={styles.when}>
      {match ? (
        <>
          <span className={styles.year}>{match[2]}</span>
          <span className={styles.month}>{t.months[ui.en.journey.months.indexOf(match[1])]}</span>
        </>
      ) : (
        <span className={styles.year}>{when === "Next" ? t.next : when}</span>
      )}
    </span>
  );
}

function StopLinks({ links, lang }: { links: NonNullable<JourneyStop["links"]>; lang: Lang }) {
  return (
    <ul className={styles.links}>
      {links.map((link) => {
        const external = link.href.startsWith("http");
        const inner = (
          <>
            {link.label} <span aria-hidden="true">{external ? "↗" : "→"}</span>
          </>
        );
        return (
          <li key={link.href}>
            {link.href.startsWith("mailto:") ? (
              <EmailMenu email={link.href.slice("mailto:".length)} lang={lang} className={styles.linkButton}>
                {inner}
              </EmailMenu>
            ) : link.href.startsWith("/") ? (
              <Link href={localize(lang, link.href)}>{inner}</Link>
            ) : (
              <a href={link.href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
                {inner}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// A small train seen from above, heading down the line.
function Train() {
  return (
    <svg viewBox="0 0 22 56" className={styles.trainCar} aria-hidden="true">
      <rect x="1" y="1" width="20" height="54" rx="8" className={styles.trainBody} />
      <rect x="9.5" y="5" width="3" height="40" rx="1.5" className={styles.trainStripe} />
      <rect x="5" y="10" width="12" height="7" rx="1.5" className={styles.trainRoof} />
      <rect x="5" y="31" width="12" height="7" rx="1.5" className={styles.trainRoof} />
      <rect x="4.5" y="47" width="13" height="4" rx="2" className={styles.trainGlass} />
    </svg>
  );
}

export function Journey({ lang }: { lang: Lang }) {
  const journey = useMemo(() => getJourney(lang), [lang]);
  const trackRef = useRef<HTMLDivElement>(null);
  const [reached, setReached] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const markers = Array.from(track.querySelectorAll<HTMLElement>("[data-marker]"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReached(markers.length);
      return;
    }

    // The train follows a point just below the middle of the screen, held between the first
    // and last stations; every station above it counts as reached.
    let frame = 0;
    const update = () => {
      frame = 0;
      const top = track.getBoundingClientRect().top;
      const centres = markers.map((m) => {
        const r = m.getBoundingClientRect();
        return r.top + r.height / 2 - top;
      });
      const y = Math.min(Math.max(window.innerHeight * 0.55 - top, centres[0]), centres[centres.length - 1]);
      track.style.setProperty("--train-y", `${y}px`);
      setReached(centres.filter((c) => c <= y + 2).length);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    setReady(true);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <section id="journey" data-station="04" className="section" aria-labelledby="journey-title">
      <div className="container">
        <SectionSign num="04" ja="経歴" en="Journey" id="journey-title" lang={lang}>
          {ui[lang].sections.journey}
        </SectionSign>

        <div ref={trackRef} className={styles.track} data-ready={ready || undefined}>
          <ol className={styles.list}>
            {journey.map((stop, i) => (
              <li
                key={stop.id}
                className={styles.stop}
                data-kind={stop.kind}
                data-line={i < journey.length - 1 ? stop.line : undefined}
                data-reached={i < reached || undefined}
              >
                <When when={stop.when} lang={lang} />
                <span className={styles.rail}>
                  <span className={styles.marker} data-marker />
                </span>
                <div className={styles.body}>
                  {stop.ja && (
                    <span className={styles.tag}>
                      <span className="jp" lang="ja">
                        {stop.ja}
                      </span>
                      {stop.jaEn && ` ${stop.jaEn}`}
                    </span>
                  )}
                  <h3 className={styles.title}>{stop.title}</h3>
                  <p className={styles.meta}>{stop.meta}</p>
                  {stop.body && <p className={styles.text}>{stop.body}</p>}
                  {stop.points && (
                    <ul className={styles.points}>
                      {stop.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  )}
                  {stop.links && <StopLinks links={stop.links} lang={lang} />}
                </div>
              </li>
            ))}
          </ol>
          <div className={styles.train} aria-hidden="true">
            <span className={styles.beam} />
            <Train />
          </div>
        </div>
      </div>
    </section>
  );
}
