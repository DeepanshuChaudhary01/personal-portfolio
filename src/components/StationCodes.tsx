import type { CSSProperties } from "react";
import type { CaseStudy } from "@/content/work";
import styles from "./StationCodes.module.css";

// A row of station-number badges, one per line a project's interchange is served by.
export function StationCodes({ codes, size = "sm" }: { codes: CaseStudy["codes"]; size?: "sm" | "md" }) {
  return (
    <span className={styles.codes} data-size={size} aria-hidden="true">
      {codes.map((code) => (
        <span
          key={`${code.line}${code.num}`}
          className={styles.code}
          style={{ "--c": code.color } as CSSProperties}
        >
          <span className={styles.line}>{code.line}</span>
          {code.num}
        </span>
      ))}
    </span>
  );
}
