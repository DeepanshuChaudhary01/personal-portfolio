import Link from "next/link";
import { LangSwitch } from "@/components/LangSwitch";
import { PdfViewer } from "@/components/PdfViewer";
import { localize, type Lang } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { person } from "@/content/site";
import { formatIssued, getResume, RESUME_DOWNLOAD_NAME, RESUME_URL } from "@/lib/resumeFile";
import styles from "./resume.module.css";

// Shows whichever PDF is in /resume at the project root. Served at /resume and /ja/resume.
export async function ResumeView({ lang }: { lang: Lang }) {
  const t = ui[lang].resume;
  const resume = await getResume();
  const name = lang === "ja" ? person.nameJa : person.nameEn;

  return (
    <div className={`${styles.desk} ${lang === "ja" ? "lang-ja" : ""}`} lang={lang}>
      <div className={styles.toolbar}>
        <div className={styles.start}>
          <Link href={localize(lang, "/#resume")} className={styles.back}>
            <span aria-hidden="true">←</span> {t.back}
          </Link>
          <LangSwitch lang={lang} />
        </div>
        {resume && (
          <>
            <span className={styles.toolbarTitle}>
              <span className="jp" lang="ja">履歴書</span> {t.label} ·{" "}
              {t.summary(ui[lang].ticket.pages(resume.pages), formatIssued(resume.updated, lang))}
            </span>
            <div className={styles.actions}>
              <a href={RESUME_URL} target="_blank" rel="noreferrer" className={styles.open}>
                {t.open} <span aria-hidden="true">↗</span>
              </a>
              <a href={RESUME_URL} download={RESUME_DOWNLOAD_NAME} className={styles.download}>
                {t.download} <span aria-hidden="true">↓</span>
              </a>
            </div>
          </>
        )}
      </div>

      <h1 className="sr-only">{t.heading(name)}</h1>

      {resume ? (
        <PdfViewer
          src={RESUME_URL}
          downloadName={RESUME_DOWNLOAD_NAME}
          pages={resume.pages}
          aspect={resume.aspect}
          lang={lang}
        />
      ) : (
        <div className={styles.empty}>
          <p className={`${styles.emptyJa} jp`} lang="ja">
            運休中
          </p>
          <p className={styles.emptyTitle}>{t.emptyTitle}</p>
          <p>
            {t.emptyBefore} <a href={`mailto:${person.email}`}>{person.email}</a> {t.emptyAfter}
          </p>
        </div>
      )}
    </div>
  );
}
