"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { Lang } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { getCopy, introBoard, person } from "@/content/site";
import { useTokyoClock } from "@/lib/useTokyoClock";
import { LangSwitch } from "./LangSwitch";
import { Led } from "./Led";
import { Skyline } from "./Skyline";
import { Train } from "./Train";
import styles from "./IntroGate.module.css";

// The intro screen: a night platform where the visitor's train pulls in. "Board the train" opens
// the doors and steps through them into the site. Whether it shows at all is decided before first
// paint by the script in layout.tsx (once per session, home page only, not for deep links or
// reduced motion), which sets <html data-intro="show">.

type Phase = "pending" | "arriving" | "stopped" | "boarding" | "leaving" | "done";

const SEEN_KEY = "dc-intro-seen";
const TRAIN_DELAY = 1200;
const TRAIN_DURATION = 3400;
const TUBES = 8;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function IntroGate({ lang }: { lang: Lang }) {
  const t = ui[lang].intro;
  const copy = getCopy(lang).intro;
  const [phase, setPhase] = useState<Phase>("pending");
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [japaneseName, setJapaneseName] = useState(false);
  const phaseRef = useRef<Phase>("pending");
  const gateRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const trainRef = useRef<HTMLDivElement>(null);
  const streaksRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const boardButtonRef = useRef<HTMLButtonElement>(null);
  const motion = useRef<Animation[]>([]);
  const clock = useTokyoClock();

  const go = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Storage can be blocked; the intro just shows again next time.
    }
    delete document.documentElement.dataset.intro;
    const site = document.getElementById("site");
    if (site) site.inert = false;
    window.scrollTo(0, 0);
    go("done");
  }, []);

  const leave = useCallback(async () => {
    if (phaseRef.current === "leaving" || phaseRef.current === "done") return;
    go("leaving");
    await gateRef.current
      ?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 550, easing: "ease", fill: "forwards" })
      .finished.catch(() => {});
    finish();
  }, [finish]);

  // The train stops with the middle door of its second car at the centre of the screen.
  const trainPath = useCallback((): Keyframe[] => {
    const train = trainRef.current;
    const car = train?.querySelector('[data-car="1"]');
    if (!train || !car) return [];
    const t = train.getBoundingClientRect();
    const c = car.getBoundingClientRect();
    const stop = window.innerWidth / 2 - (c.left - t.left + c.width / 2);
    return [{ transform: `translateX(${window.innerWidth + 60}px)` }, { transform: `translateX(${stop}px)` }];
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (root.dataset.intro !== "show" || reduced) {
      delete root.dataset.intro;
      go("done");
      return;
    }

    const site = document.getElementById("site");
    if (site) site.inert = true;
    go("arriving");
    boardButtonRef.current?.focus({ preventScroll: true });

    const train = trainRef.current!;
    const drive = train.animate(trainPath(), {
      duration: TRAIN_DURATION,
      delay: TRAIN_DELAY,
      easing: "cubic-bezier(0.05, 0.55, 0.15, 1)",
      fill: "both",
    });
    const blur = streaksRef.current!.animate([{ opacity: 0.9 }, { opacity: 0 }], {
      duration: TRAIN_DURATION * 0.8,
      delay: TRAIN_DELAY,
      easing: "ease-out",
      fill: "both",
    });
    motion.current = [drive, blur];
    drive.finished
      .then(() => {
        if (phaseRef.current === "arriving") go("stopped");
      })
      .catch(() => {});

    const nameTimer = window.setInterval(() => setJapaneseName((j) => !j), 3200);
    const onResize = () => (drive.effect as KeyframeEffect | null)?.setKeyframes(trainPath());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") leave();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearInterval(nameTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
      drive.cancel();
      blur.cancel();
    };
  }, [leave, trainPath]);

  const board = useCallback(async () => {
    if (phaseRef.current !== "arriving" && phaseRef.current !== "stopped") return;
    go("boarding");

    // Boarding early: the train brakes harder instead of making anyone wait.
    const [drive, blur] = motion.current;
    if (drive && drive.playState !== "finished") {
      drive.updatePlaybackRate(5);
      blur?.updatePlaybackRate(5);
      await drive.finished.catch(() => {});
    }
    await wait(150);
    setDoorsOpen(true);
    await wait(850);

    // Step through the doorway: zoom into it while the warm interior light fills the screen.
    const doorway = trainRef.current?.querySelector('[data-car="1"] [data-door="1"]');
    const scene = sceneRef.current;
    if (doorway && scene) {
      const r = doorway.getBoundingClientRect();
      scene.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
      scene.animate([{ transform: "scale(1)" }, { transform: "scale(3.4)" }], {
        duration: 1000,
        easing: "cubic-bezier(0.6, 0, 0.25, 1)",
        fill: "forwards",
      });
    }
    await flashRef.current
      ?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 850, delay: 250, easing: "ease-in", fill: "forwards" })
      .finished.catch(() => {});
    await leave();
  }, [leave]);

  if (phase === "done") return null;

  const stage = phase === "pending" ? "arriving" : phase === "leaving" ? "boarding" : phase;
  const status = introBoard.status[stage];
  const announcement = introBoard.announcements[stage];
  const destination = japaneseName ? person.nameJa : person.nameEn;
  const jaFirst = lang === "ja";

  return (
    <div
      ref={gateRef}
      className={styles.gate}
      data-phase={phase}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
    >
      <h2 id="intro-title" className="sr-only">
        {t.title(jaFirst ? person.nameJa : person.nameEn)}
      </h2>

      <div ref={sceneRef} className={styles.scene}>
        <div className={styles.sky} />
        <Skyline className={styles.skyline} />
        <div className={styles.cityGlow} />
        <div className={styles.approach} />
        <div className={styles.rails} />
        <Train ref={trainRef} streaksRef={streaksRef} doorsOpen={doorsOpen} />

        <div className={styles.platform} aria-hidden="true">
          <div className={styles.edge} />
          <div className={`tactile ${styles.tactile}`} />
          <div className={styles.glow} />
        </div>

        <div className={styles.canopy} aria-hidden="true">
          {Array.from({ length: TUBES }, (_, n) => (
            <span key={n} className={styles.tube} style={{ "--n": n } as CSSProperties} />
          ))}
        </div>

        <div className={styles.boardWrap}>
          <div className={styles.board}>
            <div className={styles.boardHead}>
              <span>
                <span className="jp" lang="ja">発車案内</span> <span className={styles.boardEn}>{t.departures}</span>
              </span>
              <span className={styles.clock} aria-hidden="true">
                {clock ? `${clock.h}:${clock.m}` : "--:--"}
              </span>
            </div>
            <div className={styles.screen}>
              <div className={styles.row}>
                <Led text="先発" tone="green" className={styles.service} />
                <span className={styles.destination}>
                  <Led key={destination} text={destination} className={styles.name} />
                  <Led key={status} text={status} tone={stage === "arriving" ? "amber" : "green"} className={styles.status} />
                </span>
                <span className={styles.track}>1</span>
              </div>
              <div className={styles.row}>
                <Led text="次発" className={styles.service} />
                <Led text={jaFirst ? "貴社" : "Your team"} className={styles.next} />
                <span className={styles.track}>2</span>
              </div>
              <div className={styles.marquee}>
                <div key={announcement} className={styles.marqueeTrack}>
                  <span>{announcement}</span>
                  <span aria-hidden="true">{announcement}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={flashRef} className={styles.flash} aria-hidden="true" />

      <p className={styles.corner}>
        {jaFirst ? (
          <span className="jp">DC線・1番線</span>
        ) : (
          <>
            DC Line · <span className="jp" lang="ja">1番線</span> Platform 1
          </>
        )}
      </p>
      <div className={styles.topRight}>
        <LangSwitch lang={lang} tone="dark" size="sm" />
        <button type="button" className={styles.skip} onClick={leave}>
          {t.skip} <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className={styles.cta}>
        <p className={styles.tagline}>{copy.tagline}</p>
        <button ref={boardButtonRef} type="button" className={styles.boardButton} onClick={board}>
          {jaFirst ? (
            t.board
          ) : (
            <>
              <span className="jp" lang="ja">乗車</span> {t.board}
            </>
          )}{" "}
          <span aria-hidden="true">→</span>
        </button>
        {/* Shown once the train has pulled in. */}
        <p className={styles.inspired}>{copy.inspired}</p>
      </div>
    </div>
  );
}
