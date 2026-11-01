import type { CSSProperties } from "react";
import type { RouteStop } from "@/content/work";
import styles from "./RouteStrip.module.css";

const BAND = 4;
const GAP = 2;

// Parallel bands, one per line colour, the way the route map draws a shared trunk.
function bands(colors: string[], direction: "to bottom" | "to right") {
  const stops = colors.flatMap((color, i) => {
    const start = i * (BAND + GAP);
    const end = start + BAND;
    const band = `${color} ${start}px ${end}px`;
    return i < colors.length - 1 ? [band, `transparent ${end}px ${end + GAP}px`] : [band];
  });
  return `linear-gradient(${direction}, ${stops.join(", ")})`;
}

type Props = {
  stops: RouteStop[];
  colors: string[];
  size: "mini" | "full";
};

// A project drawn as its own short line: each stop is a part of the system.
export function RouteStrip({ stops, colors, size }: Props) {
  const width = colors.length * BAND + (colors.length - 1) * GAP;
  return (
    <ol
      className={styles.strip}
      data-size={size}
      // The mini strip is decoration; its card spells the route out in text.
      aria-hidden={size === "mini" || undefined}
      style={
        {
          "--band": `${width}px`,
          "--band-h": bands(colors, "to bottom"),
          "--band-v": bands(colors, "to right"),
        } as CSSProperties
      }
    >
      {stops.map((stop, i) => (
        <li key={stop.name} className={styles.stop} style={{ "--i": i } as CSSProperties}>
          <span className={styles.marker} data-marker aria-hidden="true" />
          {size === "full" && (
            <span className={styles.label}>
              <span className={styles.name}>{stop.name}</span>
              <span className={styles.note}>{stop.note}</span>
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
