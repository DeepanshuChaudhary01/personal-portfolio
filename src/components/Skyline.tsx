import styles from "./Skyline.module.css";

// A night city behind the tracks. Generated from a fixed seed so the server and the browser draw
// exactly the same buildings (no hydration mismatch), and it costs nothing at runtime.

const W = 1600;
const H = 420;

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Box = { x: number; w: number; h: number };
type Light = { x: number; y: number; warm: boolean; twinkle: boolean; delay: number };

const rand = mulberry32(20261101);
const round = (n: number) => Math.round(n * 10) / 10;

function buildings(minW: number, maxW: number, minH: number, maxH: number, towerChance: number): Box[] {
  const out: Box[] = [];
  for (let x = -20; x < W; ) {
    const w = minW + rand() * (maxW - minW);
    const tower = rand() < towerChance;
    const h = tower ? 290 + rand() * 100 : minH + rand() * (maxH - minH);
    out.push({ x: round(x), w: round(w), h: round(h) });
    x += w + rand() * 8;
  }
  return out;
}

const far = buildings(30, 90, 90, 230, 0);
const near = buildings(48, 120, 60, 250, 0.09);

const lights: Light[] = [];
for (const b of near) {
  const cols = Math.floor((b.w - 10) / 12);
  const rows = Math.floor((b.h - 16) / 16);
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      if (rand() < 0.15) {
        lights.push({
          x: round(b.x + 7 + c * 12),
          y: round(H - b.h + 10 + r * 16),
          warm: rand() < 0.72,
          twinkle: rand() < 0.05,
          delay: round(rand() * 6),
        });
      }
    }
  }
}

// Red aviation lights on the tallest towers, as on Tokyo's skyline at night.
const beacons = [...near].sort((a, b) => b.h - a.h).slice(0, 3);

export function Skyline({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <g fill="#111a29">
        {far.map((b) => (
          <rect key={`f${b.x}`} x={b.x} y={H - b.h - 30} width={b.w} height={b.h + 30} />
        ))}
      </g>
      <g fill="#080d15">
        {near.map((b) => (
          <rect key={`n${b.x}`} x={b.x} y={H - b.h} width={b.w} height={b.h} />
        ))}
      </g>
      <g>
        {lights.map((l) => (
          <rect
            key={`${l.x}-${l.y}`}
            x={l.x}
            y={l.y}
            width="5"
            height="7"
            fill={l.warm ? "#ffcf8a" : "#bcd6ff"}
            opacity={l.warm ? 0.55 : 0.4}
            className={l.twinkle ? styles.twinkle : undefined}
            style={l.twinkle ? { animationDelay: `${l.delay}s` } : undefined}
          />
        ))}
      </g>
      <g fill="#ff3b30">
        {beacons.map((b, i) => (
          <circle
            key={b.x}
            cx={round(b.x + b.w / 2)}
            cy={H - b.h - 4}
            r="3"
            className={styles.beacon}
            style={{ animationDelay: `${i * 0.7}s` }}
          />
        ))}
      </g>
    </svg>
  );
}
