import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RouteStrip } from "@/components/RouteStrip";
import { StationCodes } from "@/components/StationCodes";
import { LINE_BY_ID } from "@/content/network";
import { caseStudies, getCaseStudy } from "@/content/work";
import styles from "./case.module.css";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study) return {};
  return {
    title: `${study.title}: ${study.kind} · Deepanshu Chaudhary`,
    description: study.summary,
  };
}

function SectionTitle({ num, ja, en }: { num: string; ja: string; en: string }) {
  return (
    <h2 className={styles.h2}>
      <span className={styles.h2Num}>{num}</span>
      <span className={`${styles.h2Ja} jp`} lang="ja">
        {ja}
      </span>
      {en}
    </h2>
  );
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const index = caseStudies.findIndex((c) => c.slug === slug);
  if (index < 0) notFound();

  const study = caseStudies[index];
  const total = caseStudies.length;
  const prev = caseStudies[(index - 1 + total) % total];
  const next = caseStudies[(index + 1) % total];
  const colors = study.lines.map((id) => LINE_BY_ID[id].color);
  const routeNo = (n: number) => String(n + 1).padStart(2, "0");
  // The sign's band shows every line the interchange serves, stacked like the map's trunk.
  const band = `linear-gradient(to bottom, ${colors
    .map((c, n) => `${c} ${(n / colors.length) * 100}% ${((n + 1) / colors.length) * 100}%`)
    .join(", ")})`;

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={`container ${styles.toolbarInner}`}>
          <Link href="/#work" className={styles.back}>
            <span aria-hidden="true">←</span> DC03 · Work
          </Link>
          <span className={styles.position}>
            Route {routeNo(index)} of {String(total).padStart(2, "0")}
          </span>
          <Link href={`/work/${next.slug}`} className={styles.nextLink}>
            Next route <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <main className="container">
        <header className={styles.sign}>
          <div className={styles.signTop}>
            <StationCodes codes={study.codes} size="md" />
            <span className={styles.signKind}>
              <span className="jp" lang="ja">乗換駅</span> Interchange · Route {routeNo(index)}
            </span>
          </div>
          <h1 className={styles.title}>{study.title}</h1>
          <p className={styles.kind}>{study.kind}</p>
          <p className={styles.summary}>{study.summary}</p>
          <div className={styles.band} style={{ "--band": band } as CSSProperties} aria-hidden="true" />
        </header>

        {study.nda && (
          <p className={styles.nda}>
            Names and internal figures are withheld under NDA. The engineering is described as built.
          </p>
        )}

        <section className={styles.routeCard} aria-labelledby="route-title">
          <h2 id="route-title" className={styles.routeTitle}>
            <span className="jp" lang="ja">路線</span> The route, simplified
          </h2>
          <RouteStrip stops={study.route} colors={colors} size="full" />
        </section>

        <div className={styles.body}>
          <article className={styles.main}>
            <section>
              <SectionTitle num="01" ja="課題" en="Problem" />
              {study.problem.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>

            <section>
              <SectionTitle num="02" ja="構成" en="What I built" />
              {study.built.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>

            <section>
              <SectionTitle num="03" ja="判断" en="Decisions" />
              <ol className={styles.decisions}>
                {study.decisions.map((d, i) => (
                  <li key={d.title}>
                    <span className={styles.decisionNum} aria-hidden="true">
                      {i + 1}
                    </span>
                    <div>
                      <h3>{d.title}</h3>
                      <p>{d.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <SectionTitle num="04" ja="結果" en="Outcome" />
              {study.outcome.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          </article>

          <aside className={styles.aside}>
            <dl className={styles.facts}>
              <div>
                <dt>Where</dt>
                <dd>{study.where}</dd>
              </div>
              <div>
                <dt>My role</dt>
                <dd>{study.role}</dd>
              </div>
              <div>
                <dt>Lines</dt>
                <dd className={styles.lines}>
                  {study.lines.map((id) => (
                    <span key={id} style={{ "--c": LINE_BY_ID[id].color } as CSSProperties}>
                      {LINE_BY_ID[id].name}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd>
                  <ul className={styles.stack}>
                    {study.stack.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>

            {study.numbers && study.numbers.length > 0 && (
              <div className={styles.numbers}>
                <p className={styles.numbersTitle}>By the numbers</p>
                <dl>
                  {study.numbers.map((n) => (
                    <div key={n.label}>
                      <dt>{n.value}</dt>
                      <dd>{n.label}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </aside>
        </div>

        <nav className={styles.adjacent} aria-label="More case studies">
          <div className={styles.adjacentBand} aria-hidden="true">
            <span className={styles.marker} />
          </div>
          <div className={styles.adjacentRow}>
            <Link href={`/work/${prev.slug}`} className={styles.prev}>
              <span className={styles.dir}>
                <span aria-hidden="true">←</span> <span className="jp" lang="ja">前</span> Previous route
              </span>
              <strong>{prev.title}</strong>
              <span className={styles.dirKind}>{prev.kind}</span>
            </Link>
            <Link href={`/work/${next.slug}`} className={styles.next}>
              <span className={styles.dir}>
                Next route <span className="jp" lang="ja">次</span> <span aria-hidden="true">→</span>
              </span>
              <strong>{next.title}</strong>
              <span className={styles.dirKind}>{next.kind}</span>
            </Link>
          </div>
        </nav>
      </main>
    </div>
  );
}
