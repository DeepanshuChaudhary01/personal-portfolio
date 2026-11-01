import { navStations, person } from "@/content/site";
import styles from "./Extension.module.css";

// Placeholder for the stations that haven't opened yet.
export function Extension() {
  const upcoming = navStations.filter((s) => !s.open);
  const links = [
    { label: "Email", href: `mailto:${person.email}` },
    { label: "GitHub", href: person.github },
    { label: "LinkedIn", href: person.linkedin },
    { label: "Codeforces", href: person.codeforces },
  ];

  return (
    <section id="extension" data-station={upcoming[0]?.code} className="section" aria-labelledby="extension-title">
      <div className="container">
        <header className={styles.head}>
          <p className={`${styles.ja} jp`} lang="ja">
            延伸工事中
          </p>
          <h2 id="extension-title" className={styles.title}>
            Line extension under construction
          </h2>
          <p className={styles.desc}>
            The rest of the line opens soon: a live board of tech articles, and contact.
          </p>
        </header>

        <ol className={styles.track}>
          {upcoming.map((s) => (
            <li key={s.code}>
              <span className={styles.code}>DC{s.code}</span>
              <span className={`${styles.stationJa} jp`} lang="ja">
                {s.ja}
              </span>
              <span className={styles.stationEn}>{s.en}</span>
            </li>
          ))}
        </ol>

        <div className={styles.meanwhile}>
          <span>Until then</span>
          <ul>
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
