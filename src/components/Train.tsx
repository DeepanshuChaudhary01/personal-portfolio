import type { Ref } from "react";
import styles from "./Train.module.css";

// A three-car commuter train drawn in SVG (each car is 820 × 300 units), front facing left.
// The doors are clipped to their doorways, so opening them slides the panels into the body
// like real pocket doors.

const DOORS = [150, 410, 670];
const WINDOWS: [number, number][] = [
  [24, 94],
  [206, 354],
  [466, 614],
  [726, 796],
];
const PANEL = 52;

const BODY = "M10 14 H810 Q820 14 820 24 V256 Q820 266 810 266 H10 Q0 266 0 256 V24 Q0 14 10 14 Z";
const LEAD_BODY = "M70 14 H810 Q820 14 820 24 V256 Q820 266 810 266 H12 Q0 266 0 252 V150 Q0 92 14 60 Q30 22 70 14 Z";
const CAB_WINDOW = "M22 66 Q32 40 66 34 L86 34 L86 124 L12 124 Q12 94 22 66 Z";

function Door({ car, index, center }: { car: number; index: number; center: number }) {
  const clip = `dc-door-${car}-${index}`;
  const left = center - PANEL;
  return (
    <g>
      <rect x={left} y="54" width={PANEL * 2} height="210" className={styles.doorway} data-door={index} />
      <clipPath id={clip}>
        <rect x={left} y="54" width={PANEL * 2} height="210" />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <g className={styles.doorLeft}>
          <rect x={left} y="54" width={PANEL} height="210" className={styles.doorPanel} />
          <rect x={left + 9} y="68" width={PANEL - 18} height="86" rx="4" className={styles.window} />
          <rect x={left} y="178" width={PANEL} height="12" className={styles.band} />
        </g>
        <g className={styles.doorRight}>
          <rect x={center} y="54" width={PANEL} height="210" className={styles.doorPanel} />
          <rect x={center + 9} y="68" width={PANEL - 18} height="86" rx="4" className={styles.window} />
          <rect x={center} y="178" width={PANEL} height="12" className={styles.band} />
        </g>
      </g>
      <rect x={left - 3} y="51" width={PANEL * 2 + 6} height="216" rx="3" className={styles.doorFrame} />
      <rect x={center - 14} y="40" width="28" height="7" rx="3" className={styles.doorLamp} />
    </g>
  );
}

function Car({ index, lead = false, label = false }: { index: number; lead?: boolean; label?: boolean }) {
  return (
    <svg className={styles.car} viewBox="0 0 820 300" data-car={index}>
      <rect x="60" y="4" width="150" height="12" rx="3" className={styles.roofUnit} />
      <rect x="610" y="4" width="150" height="12" rx="3" className={styles.roofUnit} />
      <path d={lead ? LEAD_BODY : BODY} className={styles.body} />

      {WINDOWS.filter(([from]) => !(lead && from < 100)).map(([from, to]) => (
        <g key={from}>
          <rect x={from} y="64" width={to - from} height="90" rx="7" className={styles.window} />
          <rect x={from + 4} y="68" width={to - from - 8} height="4" className={styles.ceiling} />
          <rect x={from + 4} y="134" width={to - from - 8} height="16" className={styles.seats} />
        </g>
      ))}

      <rect x={lead ? 48 : 0} y="178" width={lead ? 772 : 820} height="12" className={styles.band} />
      <rect x={lead ? 46 : 0} y="193" width={lead ? 774 : 820} height="3" className={styles.bandThin} />

      {DOORS.map((center, i) => (
        <Door key={center} car={index} index={i} center={center} />
      ))}

      {label && (
        <g>
          <rect x="232" y="22" width="152" height="24" rx="3" className={styles.ledPanel} />
          <text x="308" y="39" className={styles.ledText}>
            DC Line · Deepanshu
          </text>
        </g>
      )}

      <rect x="0" y="262" width="820" height="16" className={styles.skirt} />
      {[92, 150, 670, 728].map((x) => (
        <circle key={x} cx={x} cy="282" r="13" className={styles.wheel} />
      ))}

      {lead && (
        <>
          <path d={CAB_WINDOW} className={styles.cabWindow} />
          <circle cx="14" cy="214" r="8" className={styles.headlight} />
        </>
      )}
    </svg>
  );
}

type Props = {
  ref?: Ref<HTMLDivElement>;
  streaksRef?: Ref<HTMLDivElement>;
  doorsOpen: boolean;
};

export function Train({ ref, streaksRef, doorsOpen }: Props) {
  return (
    <div ref={ref} className={styles.train} data-doors={doorsOpen ? "open" : undefined} aria-hidden="true">
      <svg width="0" height="0" className={styles.defs}>
        <defs>
          <linearGradient id="dc-steel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#eceef0" />
            <stop offset="0.45" stopColor="#cfd4d9" />
            <stop offset="1" stopColor="#9aa1a8" />
          </linearGradient>
          <linearGradient id="dc-interior" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff6e6" />
            <stop offset="1" stopColor="#f1d29f" />
          </linearGradient>
          <linearGradient id="dc-doorway" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fffaf0" />
            <stop offset="1" stopColor="#f4dcae" />
          </linearGradient>
          <linearGradient id="dc-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2a3747" />
            <stop offset="1" stopColor="#0b1017" />
          </linearGradient>
        </defs>
      </svg>

      <span className={styles.beam} />
      <span className={styles.flare} />
      <Car index={0} lead />
      <span className={styles.gangway} />
      <Car index={1} label />
      <span className={styles.gangway} />
      <Car index={2} />
      <div ref={streaksRef} className={styles.streaks} />
    </div>
  );
}
