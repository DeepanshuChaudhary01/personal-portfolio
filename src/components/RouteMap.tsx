"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { LINES, LINE_BY_ID, STATIONS, roundedPath, type LineId, type Station } from "@/content/network";
import styles from "./RouteMap.module.css";

const PATHS = LINES.map((line) => ({ ...line, d: roundedPath(line.points) }));
const VIEW = { x: 0, y: 168, w: 1280, h: 462 };

// "static" = fully drawn (server render, reduced motion, or already on screen at load).
type DrawState = "static" | "armed" | "drawn";

type MarkProps = {
  station: Station;
  active: boolean;
  pinned: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
};

function StationMark({ station, active, pinned, onHover, onSelect }: MarkProps) {
  const isInterchange = station.kind === "interchange";
  const [top, bottom] = station.span ?? [station.y, station.y];
  const above = station.label === "above";
  const nameY = isInterchange ? (above ? top - 30 : bottom + 26) : above ? station.y - 16 : station.y + 27;
  const metaY = above ? top - 14 : bottom + 42;
  const lineNames = station.lines.map((id) => LINE_BY_ID[id].name).join(", ");

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(station.id);
    }
  };

  return (
    <g
      className={styles.station}
      data-kind={station.kind}
      data-lines={station.lines.join(" ")}
      data-active={active || undefined}
      style={
        {
          "--c": LINE_BY_ID[station.lines[0]].color,
          "--d": `${0.5 + (station.x / VIEW.w) * 1.1}s`,
        } as CSSProperties
      }
      tabIndex={0}
      role="button"
      aria-pressed={pinned}
      aria-label={`${station.name}: ${isInterchange ? "project" : "skill"} on the ${lineNames}`}
      onMouseEnter={() => onHover(station.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(station.id)}
      onBlur={() => onHover(null)}
      onClick={() => onSelect(station.id)}
      onKeyDown={onKeyDown}
    >
      {isInterchange ? (
        <>
          <rect className={styles.hitArea} x={station.x - 18} y={top - 8} width={36} height={bottom - top + 16} rx={16} />
          <rect className={styles.capsule} x={station.x - 10} y={top} width={20} height={bottom - top} rx={10} />
        </>
      ) : (
        <>
          <circle className={styles.hitArea} cx={station.x} cy={station.y} r={16} />
          <circle className={styles.stop} cx={station.x} cy={station.y} r={6.5} />
        </>
      )}
      <text className={styles.label} x={station.x} y={nameY}>
        {station.name}
      </text>
      {station.meta && (
        <text className={styles.meta} x={station.x} y={metaY}>
          {station.meta}
        </text>
      )}
    </g>
  );
}

function StationInfo({ station }: { station: Station }) {
  const isInterchange = station.kind === "interchange";
  return (
    <>
      <div className={styles.infoCodes}>
        {station.codes.map((code) => (
          <span
            key={code}
            className={styles.infoCode}
            style={{ "--c": LINE_BY_ID[code[0] as LineId].color } as CSSProperties}
          >
            <span>{code[0]}</span>
            {code.slice(1)}
          </span>
        ))}
      </div>
      <div className={styles.infoBody}>
        <p className={styles.infoKind}>{isInterchange ? "Interchange · project" : "Station · skill"}</p>
        <h3 className={styles.infoName}>
          {station.name}
          {station.meta && <span className={styles.infoMeta}>{station.meta}</span>}
        </h3>
        <p className={styles.infoText}>{station.summary}</p>
        {isInterchange && station.lines.length > 1 && (
          <p className={styles.infoSoon}>Full case study opens with DC03 · Work</p>
        )}
      </div>
      <ul className={styles.infoLines}>
        {station.lines.map((id) => (
          <li key={id} style={{ "--c": LINE_BY_ID[id].color } as CSSProperties}>
            {LINE_BY_ID[id].name}
          </li>
        ))}
      </ul>
    </>
  );
}

function MapKey() {
  return (
    <>
      <svg className={styles.keySymbols} viewBox="0 0 96 48" width="96" height="48" aria-hidden="true">
        <path className={styles.keyLine} d="M0 24H96" />
        <circle className={styles.keyStop} cx="26" cy="24" r="6.5" />
        <rect className={styles.keyCapsule} x="60" y="8" width="20" height="32" rx="10" />
      </svg>
      <div className={styles.infoBody}>
        <p className={styles.infoKind}>How to read this map</p>
        <h3 className={styles.infoName}>Lines are skills. Interchanges are projects.</h3>
        <p className={styles.infoText}>
          Each line is an area I work in. Small stations are tools and techniques; the large white interchanges
          are projects where several lines meet. Hover or tap any of them for details.
        </p>
      </div>
    </>
  );
}

export function RouteMap() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [draw, setDraw] = useState<DrawState>("static");
  const [hoverLine, setHoverLine] = useState<LineId | null>(null);
  const [pinnedLine, setPinnedLine] = useState<LineId | null>(null);
  const [hoverStation, setHoverStation] = useState<string | null>(null);
  const [pinnedStation, setPinnedStation] = useState<string | null>(null);

  // Draw the lines in when the map first scrolls into view.
  useEffect(() => {
    const el = frameRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.8) return;
    setDraw("armed");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDraw("drawn");
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const activeLine = hoverLine ?? pinnedLine;
  const stationId = hoverStation ?? pinnedStation;
  const station = STATIONS.find((s) => s.id === stationId) ?? null;
  const togglePinnedLine = (id: LineId) => setPinnedLine((p) => (p === id ? null : id));
  const selectStation = (id: string) => setPinnedStation((p) => (p === id ? null : id));

  return (
    <div className={styles.frame} ref={frameRef}>
      <div className={styles.toolbar}>
        <div className={styles.legend} role="group" aria-label="Highlight a line">
          {LINES.map((line) => (
            <button
              key={line.id}
              type="button"
              className={styles.chip}
              style={{ "--c": line.color } as CSSProperties}
              aria-pressed={pinnedLine === line.id}
              onClick={() => togglePinnedLine(line.id)}
              onMouseEnter={() => setHoverLine(line.id)}
              onMouseLeave={() => setHoverLine(null)}
            >
              <span className={styles.chipBadge} aria-hidden="true">
                {line.id}
              </span>
              {line.name}
              <span className={`${styles.chipJa} jp`} lang="ja">
                {line.ja}
              </span>
            </button>
          ))}
        </div>
        <p className={styles.hint}>
          <span className={styles.hintWide}>Hover a line or station. Click to pin.</span>
          <span className={styles.hintNarrow}>Swipe the map sideways · tap to pin</span>
        </p>
      </div>

      <div className={styles.scroller}>
        <svg
          className={styles.map}
          viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
          data-draw={draw}
          data-focus={activeLine ?? undefined}
          role="group"
          aria-label="Route map: skills as lines, projects as interchanges"
        >
          <g>
            {PATHS.map((line, i) => (
              <path
                key={line.id}
                className={styles.line}
                d={line.d}
                pathLength={1}
                data-line={line.id}
                style={{ stroke: line.color, "--ld": `${i * 0.14}s` } as CSSProperties}
              />
            ))}
          </g>

          {/* A short highlight that runs along each line: the "trains". */}
          <g className={styles.glints} aria-hidden="true">
            {PATHS.map((line, i) => (
              <path
                key={line.id}
                className={styles.glint}
                d={line.d}
                pathLength={100}
                data-line={line.id}
                style={{ animationDuration: `${line.glintSeconds}s`, animationDelay: `${-i * 2.7}s` }}
              />
            ))}
          </g>

          <g aria-hidden="true">
            {PATHS.map((line) => (
              <path
                key={line.id}
                className={styles.hit}
                d={line.d}
                onMouseEnter={() => setHoverLine(line.id)}
                onMouseLeave={() => setHoverLine(null)}
                onClick={() => togglePinnedLine(line.id)}
              />
            ))}
          </g>

          <g aria-hidden="true">
            {LINES.flatMap((line) => {
              const [sx, sy] = line.points[0];
              const [ex, ey] = line.points[line.points.length - 1];
              return [
                [sx - 24, sy],
                [ex + 24, ey],
              ].map(([bx, by], k) => (
                <g
                  key={`${line.id}-${k}`}
                  className={styles.badge}
                  data-lines={line.id}
                  style={{ "--d": k === 0 ? "0.3s" : "1.7s" } as CSSProperties}
                >
                  <circle cx={bx} cy={by} r={15} style={{ stroke: line.color }} />
                  <text x={bx} y={by} dy="0.36em">
                    {line.id}
                  </text>
                </g>
              ));
            })}
          </g>

          <g>
            {STATIONS.map((s) => (
              <StationMark
                key={s.id}
                station={s}
                active={s.id === stationId}
                pinned={s.id === pinnedStation}
                onHover={setHoverStation}
                onSelect={selectStation}
              />
            ))}
          </g>
        </svg>
      </div>

      <div className={styles.info} aria-live="polite">
        {station ? <StationInfo station={station} /> : <MapKey />}
      </div>
    </div>
  );
}
