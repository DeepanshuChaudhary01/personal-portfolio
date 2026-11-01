import { hero, person } from "@/content/site";
import { DepartureBoard } from "./DepartureBoard";
import { StationCode } from "./StationCode";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section id="here" data-station="01" className={styles.hero} aria-labelledby="hero-name">
      <div className="container">
        {/* Station name sign (駅名標) */}
        <div className={styles.sign}>
          <p className={styles.here} aria-hidden="true">
            <span className="jp" lang="ja">現在地</span> You are here
          </p>

          <div className={styles.signTop}>
            <StationCode line="DC" num="01" size="lg" />
            <div className={styles.names}>
              <p className={`${styles.ja} jp`} lang="ja">
                {person.nameJa}
              </p>
              <h1 id="hero-name" className={styles.en}>
                {person.nameEn}
              </h1>
              <p className={styles.role}>
                {hero.role.map((part, i) => (
                  <span key={part}>
                    {i > 0 && <span className={styles.sep} aria-hidden="true">/</span>}
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
                <span aria-hidden="true">←</span> <span className="jp" lang="ja">前</span> Previous
              </span>
              <strong>{hero.previous.name}</strong>
              <span className={styles.sub}>{hero.previous.detail}</span>
            </div>
            <div className={styles.next}>
              <span className={styles.dir}>
                Next <span className="jp" lang="ja">次</span> <span aria-hidden="true">→</span>
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
                Explore the route map <span aria-hidden="true">→</span>
              </a>
              <a href={`mailto:${person.email}`} className={styles.secondary}>
                Email me
              </a>
            </div>
          </div>
          <DepartureBoard />
        </div>
      </div>
    </section>
  );
}
