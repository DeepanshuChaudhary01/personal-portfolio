import type { ReactNode } from "react";
import type { Lang } from "@/i18n/config";
import { StationCode } from "./StationCode";
import styles from "./SectionSign.module.css";

type Props = {
  num: string;
  ja: string;
  en: string;
  id?: string;
  lang?: Lang;
  children?: ReactNode;
};

// A smaller platform sign that opens every section. Both languages are always on it; the page's
// language decides which one is large, the way Japanese station signs put Japanese first.
export function SectionSign({ num, ja, en, id, lang = "en", children }: Props) {
  const jaFirst = lang === "ja";
  return (
    <header className={styles.sign}>
      <StationCode line="DC" num={num} size="md" />
      <div>
        <p className={`${styles.secondary} ${jaFirst ? "" : "jp"}`} lang={jaFirst ? "en" : "ja"}>
          {jaFirst ? en : ja}
        </p>
        <h2 id={id} className={`${styles.primary} ${jaFirst ? "jp" : ""}`}>
          {jaFirst ? ja : en}
        </h2>
      </div>
      {children && <p className={styles.desc}>{children}</p>}
    </header>
  );
}
