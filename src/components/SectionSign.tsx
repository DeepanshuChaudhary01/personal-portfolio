import type { ReactNode } from "react";
import { StationCode } from "./StationCode";
import styles from "./SectionSign.module.css";

type Props = {
  num: string;
  ja: string;
  en: string;
  id?: string;
  children?: ReactNode;
};

// A smaller platform sign that opens every section.
export function SectionSign({ num, ja, en, id, children }: Props) {
  return (
    <header className={styles.sign}>
      <StationCode line="DC" num={num} size="md" />
      <div>
        <p className={`${styles.ja} jp`} lang="ja">
          {ja}
        </p>
        <h2 id={id} className={styles.en}>
          {en}
        </h2>
      </div>
      {children && <p className={styles.desc}>{children}</p>}
    </header>
  );
}
