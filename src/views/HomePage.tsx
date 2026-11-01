import { Contact } from "@/components/Contact";
import { Departures } from "@/components/Departures";
import { Hero } from "@/components/Hero";
import { IntroGate } from "@/components/IntroGate";
import { Journey } from "@/components/Journey";
import { ResumeTicket } from "@/components/ResumeTicket";
import { RouteMap } from "@/components/RouteMap";
import { SectionSign } from "@/components/SectionSign";
import { SiteHeader } from "@/components/SiteHeader";
import { WorkSection } from "@/components/WorkSection";
import type { Lang } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { person } from "@/content/site";

// The whole line, in one language. Served at "/" (English) and "/ja" (Japanese).
export function HomePage({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const name = lang === "ja" ? person.nameJa : person.nameEn;

  return (
    <div lang={lang} className={lang === "ja" ? "lang-ja" : undefined}>
      <IntroGate lang={lang} />

      {/* Made inert while the intro is showing. */}
      <div id="site">
        <a href="#main" className="skip">
          {lang === "ja" ? "本文へ移動" : "Skip to content"}
        </a>
        <SiteHeader lang={lang} />
        <main id="main">
          <Hero lang={lang} />

          <div className="container">
            <div className="tactile" role="presentation" />
          </div>

          <section id="route-map" data-station="02" className="section" aria-labelledby="route-map-title">
            <div className="container">
              <SectionSign num="02" ja="路線図" en="Route map" id="route-map-title" lang={lang}>
                {t.sections.routeMap}
              </SectionSign>
              <RouteMap lang={lang} />
            </div>
          </section>

          <WorkSection lang={lang} />

          <Journey lang={lang} />

          <Departures lang={lang} />

          <ResumeTicket lang={lang} />

          <Contact lang={lang} />
        </main>

        <footer className="footer">
          <div className="container">
            <div className="tactile" role="presentation" />
            <div className="footer-row">
              <span>
                <span className="jp" lang="ja">終点</span> {t.footer.end}
              </span>
              <span>
                © {new Date().getFullYear()} {name} · <span className="jp" lang="ja">東京</span>
                {lang === "ja" ? "" : ` ${t.footer.city}`}
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
