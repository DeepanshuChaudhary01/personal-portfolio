import type { Metadata } from "next";
import Link from "next/link";
import { PdfViewer } from "@/components/PdfViewer";
import { person } from "@/content/site";
import { formatIssued, getResume, RESUME_DOWNLOAD_NAME, RESUME_URL } from "@/lib/resumeFile";
import styles from "./resume.module.css";

export const metadata: Metadata = {
  title: "Resume · Deepanshu Chaudhary",
  description: "Resume of Deepanshu Chaudhary, software engineer in Tokyo building LLM systems and backend services.",
};

// Shows whichever PDF is in /resume at the project root.
export default async function ResumePage() {
  const resume = await getResume();

  return (
    <div className={styles.desk}>
      <div className={styles.toolbar}>
        <Link href="/#resume" className={styles.back}>
          <span aria-hidden="true">←</span> DC Line
        </Link>
        {resume && (
          <>
            <span className={styles.toolbarTitle}>
              <span className="jp" lang="ja">履歴書</span> Resume · {resume.pages}{" "}
              {resume.pages === 1 ? "page" : "pages"} · updated {formatIssued(resume.updated)}
            </span>
            <div className={styles.actions}>
              <a href={RESUME_URL} target="_blank" rel="noreferrer" className={styles.open}>
                Open PDF <span aria-hidden="true">↗</span>
              </a>
              <a href={RESUME_URL} download={RESUME_DOWNLOAD_NAME} className={styles.download}>
                Download <span aria-hidden="true">↓</span>
              </a>
            </div>
          </>
        )}
      </div>

      <h1 className="sr-only">Resume of {person.nameEn}</h1>

      {resume ? (
        <PdfViewer src={RESUME_URL} downloadName={RESUME_DOWNLOAD_NAME} pages={resume.pages} aspect={resume.aspect} />
      ) : (
        <div className={styles.empty}>
          <p className={`${styles.emptyJa} jp`} lang="ja">
            運休中
          </p>
          <p className={styles.emptyTitle}>The resume is being reprinted.</p>
          <p>
            Email <a href={`mailto:${person.email}`}>{person.email}</a> and I&apos;ll send a copy.
          </p>
        </div>
      )}
    </div>
  );
}
