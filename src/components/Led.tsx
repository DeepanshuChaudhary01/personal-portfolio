import type { CSSProperties } from "react";
import styles from "./Led.module.css";

type Props = {
  text: string;
  tone?: "amber" | "green";
  className?: string;
};

// LED dot-matrix text. Each character lights up a beat after the previous one, like a board refreshing;
// give it a new `key` to replay the refresh when the text changes.
export function Led({ text, tone = "amber", className }: Props) {
  return (
    <span className={`${styles.led} ${className ?? ""}`} data-tone={tone}>
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
