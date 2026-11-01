import type { Lang } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { getCopy, person } from "@/content/site";
import { DepartureBoard } from "./DepartureBoard";
import { EmailMenu } from "./EmailMenu";
import { StationCode } from "./StationCode";
import styles from "./Hero.module.css";

export function Hero({ lang }: { lang: Lang }) {
  const t = ui[lang].hero;
  const hero = getCopy(lang).hero;
  // On Japanese signs the Japanese name is the big one, with the romanised name beneath.
  const jaFirst = lang === "ja";

  return (
    <section id="here" data-station="01" className={styles.hero} aria-labelledby="hero-name">
      <div className="container">
        {/* Station name sign (駅名標) */}
        <div className={styles.sign}>
          <p className={styles.here} aria-hidden="true">
            <span className="jp" lang="ja">現在地</span> {t.here}
          </p>

          <div className={styles.signTop}>
            <StationCode line="DC" num="01" size="lg" />
            <div className={styles.names}>
              <p className={`${styles.ja} ${jaFirst ? "" : "jp"}`} lang={jaFirst ? "en" : "ja"}>
                {jaFirst ? person.nameEn : person.nameJa}
              </p>
              <h1 id="hero-name" className={`${styles.en} ${jaFirst ? `jp ${styles.enJa}` : ""}`}>
                {jaFirst ? person.nameJa : person.nameEn}
              </h1>
              <p className={styles.role}>
                {hero.role.map((part, i) => (
                  <span key={part}>
                    {i > 0 && (
                      <span className={styles.sep} aria-hidden="true">
                        /
                      </span>
                    )}
                    {part}
                  </span>
                ))}
              </p>
            </div>
          </div>

          <div className={styles.band} aria-hidden="true">
            <span className={styles.marker} />
          </div>

          <div className={styles.adjacent}>
            <div className={styles.prev}>
              <span className={styles.dir}>
                <span aria-hidden="true">←</span> <span className="jp" lang="ja">前</span>{" "}
                {jaFirst ? "Previous" : t.previous}
              </span>
              <strong>{hero.previous.name}</strong>
              <span className={styles.sub}>{hero.previous.detail}</span>
            </div>
            <div className={styles.next}>
              <span className={styles.dir}>
                {jaFirst ? "Next" : t.next} <span className="jp" lang="ja">次</span> <span aria-hidden="true">→</span>
              </span>
              <strong>{hero.next.name}</strong>
              <span className={styles.sub}>{hero.next.detail}</span>
            </div>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.intro}>
            <p className={styles.statement}>{hero.statement}</p>
            <p className={styles.lede}>{hero.lede}</p>
            <div className={styles.actions}>
              <a href="#route-map" className={styles.primary}>
                {t.explore} <span aria-hidden="true">→</span>
              </a>
              <EmailMenu email={person.email} lang={lang} className={styles.secondary}>
                {t.email}
              </EmailMenu>
            </div>
          </div>
          <DepartureBoard lang={lang} />
        </div>
      </div>
    </section>
  );
}
