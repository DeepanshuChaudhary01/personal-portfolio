import Link from "next/link";
import { person, resumeHighlights } from "@/content/site";
import { formatIssued, getResume, RESUME_DOWNLOAD_NAME, RESUME_URL } from "@/lib/resumeFile";
import { SectionSign } from "./SectionSign";
import styles from "./ResumeTicket.module.css";

// DC06: the resume, issued as a train ticket (乗車券). Details come from the PDF in /resume.
export async function ResumeTicket() {
  const resume = await getResume();
  const format = resume
    ? `PDF · ${resume.pages} ${resume.pages === 1 ? "page" : "pages"} · ${resume.paper}`
    : "Reprinting";

  return (
    <section id="resume" data-station="06" className="section" aria-labelledby="resume-title">
      <div className="container">
        <SectionSign num="06" ja="履歴書" en="Resume" id="resume-title">
          One page, kept current. Read it here or take a copy with you.
        </SectionSign>

        <div className={styles.layout}>
          <div className={styles.ticketWrap}>
            <div className={styles.ticket}>
              <div className={styles.main}>
                <div className={styles.head}>
                  <span className={`${styles.kind} jp`} lang="ja">
                    乗車券
                  </span>
                  <span className={styles.line}>DC Line · Resume</span>
                  <span className={styles.serial}>No. 0006</span>
                </div>

                <div className={styles.route}>
                  <div>
                    <span className={styles.small}>From</span>
                    <strong>Tokyo</strong>
                    <span className={`${styles.place} jp`} lang="ja">東京</span>
                  </div>
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                  <div>
                    <span className={styles.small}>To</span>
                    <strong>Your team</strong>
                    <span className={`${styles.place} jp`} lang="ja">貴社</span>
                  </div>
                </div>

                <dl className={styles.details}>
                  <div>
                    <dt>Passenger</dt>
                    <dd>{person.nameEn}</dd>
                  </div>
                  <div>
                    <dt>Class</dt>
                    <dd>SDE · AI engineering</dd>
                  </div>
                  <div>
                    <dt>Format</dt>
                    <dd>{format}</dd>
                  </div>
                  <div>
                    <dt>Issued</dt>
                    <dd>{resume ? formatIssued(resume.updated) : "Soon"}</dd>
                  </div>
                </dl>
              </div>

              <div className={styles.stub}>
                {resume ? (
                  <>
                    <Link href="/resume" className={styles.primary}>
                      View resume <span aria-hidden="true">→</span>
                    </Link>
                    <a href={RESUME_URL} download={RESUME_DOWNLOAD_NAME} className={styles.secondary}>
                      Download PDF <span aria-hidden="true">↓</span>
                    </a>
                  </>
                ) : (
                  <a href={`mailto:${person.email}`} className={styles.primary}>
                    Email for a copy <span aria-hidden="true">→</span>
                  </a>
                )}
                <span className={`${styles.fine} jp`} lang="ja" title="Not valid if you leave the train early">
                  下車前途無効
                </span>
              </div>
            </div>
          </div>

          <div className={styles.inside}>
            <p className={styles.insideTitle}>What&apos;s inside</p>
            <ul>
              {resumeHighlights.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}</strong>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
            <p className={styles.note}>
              The public copy leaves out employer names and internal figures. Happy to go into detail in
              conversation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
