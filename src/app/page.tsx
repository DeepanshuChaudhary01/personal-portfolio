import { Extension } from "@/components/Extension";
import { Hero } from "@/components/Hero";
import { ResumeTicket } from "@/components/ResumeTicket";
import { RouteMap } from "@/components/RouteMap";
import { SectionSign } from "@/components/SectionSign";
import { SiteHeader } from "@/components/SiteHeader";
import { person } from "@/content/site";

export default function Home() {
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Hero />

        <div className="container">
          <div className="tactile" role="presentation" />
        </div>

        <section id="route-map" data-station="02" className="section" aria-labelledby="route-map-title">
          <div className="container">
            <SectionSign num="02" ja="路線図" en="Route map" id="route-map-title">
              Skills are the lines; projects are the interchanges where they meet. Hover or tap anything on the
              map.
            </SectionSign>
            <RouteMap />
          </div>
        </section>

        <ResumeTicket />

        <Extension />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="tactile" role="presentation" />
          <div className="footer-row">
            <span>© {new Date().getFullYear()} {person.nameEn}</span>
            <span>
              <span className="jp" lang="ja">東京</span> Tokyo · Built with Next.js
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
