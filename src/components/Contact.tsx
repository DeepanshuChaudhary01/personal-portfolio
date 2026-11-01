import Link from "next/link";
import { localize, type Lang } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { exits, getCopy, person } from "@/content/site";
import { CopyEmail } from "./CopyEmail";
import { EmailMenu } from "./EmailMenu";
import { SectionSign } from "./SectionSign";
import styles from "./Contact.module.css";

// DC07: the last station. Ways out are signed like a Tokyo station's yellow exit signs.
export function Contact({ lang }: { lang: Lang }) {
  const t = ui[lang].contact;
  const copy = getCopy(lang).contact;

  return (
    <section id="contact" data-station="07" className="section" aria-labelledby="contact-title">
      <div className="container">
        <SectionSign num="07" ja="連絡先" en="Contact" id="contact-title" lang={lang}>
          {ui[lang].sections.contact}
        </SectionSign>

        <div className={styles.layout}>
          <div className={styles.intro}>
            <p className={styles.lead}>{copy.lead}</p>
            <p className={styles.text}>{copy.text}</p>
            <div className={styles.actions}>
              <EmailMenu email={person.email} lang={lang} className={styles.primary}>
                {t.email} <span aria-hidden="true">→</span>
              </EmailMenu>
              <CopyEmail email={person.email} label={t.copy} copied={t.copied} />
            </div>
          </div>

          <nav className={styles.exits} aria-labelledby="exits-title">
            <p id="exits-title" className={styles.exitsTitle}>
              <span className="jp" lang="ja">出口</span> {t.exits}
            </p>
            <ul>
              {exits.map((exit) => {
                const external = exit.href.startsWith("http");
                const inner = (
                  <>
                    <span className={styles.code}>{exit.code}</span>
                    <span className={styles.label}>
                      <span className={`${styles.ja} jp`} lang="ja">
                        {exit.ja}
                      </span>
                      <span className={styles.en}>{exit.label}</span>
                      <span className={styles.dest}>{copy.dest[exit.code]}</span>
                    </span>
                    <span className={styles.arrow} aria-hidden="true">
                      {external ? "↗" : "→"}
                    </span>
                  </>
                );
                return (
                  <li key={exit.code}>
                    {exit.href.startsWith("mailto:") ? (
                      <EmailMenu email={person.email} lang={lang} className={styles.exit} block>
                        {inner}
                      </EmailMenu>
                    ) : exit.href.startsWith("/") ? (
                      <Link href={localize(lang, exit.href)} className={styles.exit}>
                        {inner}
                      </Link>
                    ) : (
                      <a
                        href={exit.href}
                        className={styles.exit}
                        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                      >
                        {inner}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
