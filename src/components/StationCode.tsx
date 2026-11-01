import type { CSSProperties } from "react";
import styles from "./StationCode.module.css";

type Props = {
  line: string;
  num: string;
  color?: string;
  size?: "lg" | "md" | "sm";
};

// The numbered station badge used on Tokyo signage: line code on top, station number below.
export function StationCode({ line, num, color = "var(--accent)", size = "md" }: Props) {
  return (
    <span
      className={`${styles.code} ${styles[size]}`}
      style={{ "--c": color } as CSSProperties}
      aria-hidden="true"
    >
      <span className={styles.line}>{line}</span>
      <span className={styles.num}>{num}</span>
    </span>
  );
}
