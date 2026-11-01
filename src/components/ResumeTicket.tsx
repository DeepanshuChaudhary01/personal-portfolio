import Link from "next/link";
import { localize, type Lang } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { getCopy, person } from "@/content/site";
import { formatIssued, getResume, RESUME_DOWNLOAD_NAME, RESUME_URL } from "@/lib/resumeFile";
import { EmailMenu } from "./EmailMenu";
import { SectionSign } from "./SectionSign";
import styles from "./ResumeTicket.module.css";

// DC06: the resume, issued as a train ticket (乗車券). Details come from the PDF in /resume.
export async function ResumeTicket({ lang }: { lang: Lang }) {
  const t = ui[lang].ticket;
  const highlights = getCopy(lang).resumeHighlights;
  const resume = await getResume();
  const sep = lang === "ja" ? "・" : " · ";
  const format = resume ? ["PDF", t.pages(resume.pages), resume.paper].join(sep) : t.reprinting;

  return (
    <section id="resume" data-station="06" className="section" aria-labelledby="resume-title">
      <div className="container">
        <SectionSign num="06" ja="履歴書" en="Resume" id="resume-title" lang={lang}>
          {ui[lang].sections.resume}
        </SectionSign>

        <div className={styles.layout}>
          <div className={styles.ticketWrap}>
            <div className={styles.ticket}>
              <div className={styles.main}>
                <div className={styles.head}>
                  <span className={`${styles.kind} jp`} lang="ja">
                    乗車券
                  </span>
                  <span className={styles.line}>{t.line}</span>
                  <span className={styles.serial}>No. 0006</span>
                </div>

                <div className={styles.route}>
                  <div>
                    <span className={styles.small}>{t.from}</span>
                    <strong>{t.fromPlace}</strong>
                    <span className={`${styles.place} jp`} lang={lang === "ja" ? "en" : "ja"}>
                      {lang === "ja" ? "Tokyo" : "東京"}
                    </span>
                  </div>
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                  <div>
                    <span className={styles.small}>{t.to}</span>
                    <strong>{t.toPlace}</strong>
                    <span className={`${styles.place} jp`} lang={lang === "ja" ? "en" : "ja"}>
                      {lang === "ja" ? "Your team" : "貴社"}
                    </span>
                  </div>
                </div>

                <dl className={styles.details}>
                  <div>
                    <dt>{t.passenger}</dt>
                    <dd>{lang === "ja" ? person.nameJa : person.nameEn}</dd>
                  </div>
                  <div>
                    <dt>{t.class}</dt>
                    <dd>{t.classValue}</dd>
                  </div>
                  <div>
                    <dt>{t.format}</dt>
                    <dd>{format}</dd>
                  </div>
                  <div>
                    <dt>{t.issued}</dt>
                    <dd>{resume ? formatIssued(resume.updated, lang) : t.soon}</dd>
                  </div>
                </dl>
              </div>

              <div className={styles.stub}>
                {resume ? (
                  <>
                    <Link href={localize(lang, "/resume")} className={styles.primary}>
                      {t.view} <span aria-hidden="true">→</span>
                    </Link>
                    <a href={RESUME_URL} download={RESUME_DOWNLOAD_NAME} className={styles.secondary}>
                      {t.download} <span aria-hidden="true">↓</span>
                    </a>
                  </>
                ) : (
                  <EmailMenu email={person.email} lang={lang} className={styles.primary} block>
                    {t.emailForCopy} <span aria-hidden="true">→</span>
                  </EmailMenu>
                )}
                <span className={`${styles.fine} jp`} lang="ja" title={t.fineTitle}>
                  下車前途無効
                </span>
              </div>
            </div>
          </div>

          <div className={styles.inside}>
            <p className={styles.insideTitle}>{t.inside}</p>
            <ul>
              {highlights.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}</strong>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
            <p className={styles.note}>{t.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
