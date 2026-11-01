import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Atkinson_Hyperlegible_Mono, Atkinson_Hyperlegible_Next } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const sans = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: false,
});
const mono = Atkinson_Hyperlegible_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  adjustFontFallback: false,
});
// The Japanese fonts are subsets holding only the characters this site uses (~90 KB together,
// instead of dozens of slices). scripts/subset-fonts.mjs rebuilds them when the copy changes.
const jp = localFont({
  src: "../fonts/noto-sans-jp.woff2",
  weight: "400 900",
  variable: "--font-jp",
  display: "swap",
});
const dot = localFont({
  src: "../fonts/dotgothic16.woff2",
  weight: "400",
  variable: "--font-dot",
  display: "swap",
});

// Absolute base for canonical and hreflang links: Vercel's production domain once deployed.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Deepanshu Chaudhary · Software Engineer, LLM systems",
  description:
    "Software engineer in Tokyo building LLM systems and backend services that run in production.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f3ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d10" },
  ],
};

// Runs before first paint so the saved theme never flashes.
const themeScript = `(()=>{try{let t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})()`;

// Japanese pages live under /ja. The root layout is shared, so <html lang> is corrected here before
// first paint (each page's content also carries its own lang attribute for the server-rendered HTML).
const langScript = `document.documentElement.lang=/^\\/ja(\\/|$)/.test(location.pathname)?"ja":"en"`;

// Also before first paint: show the intro (IntroGate) on the home page once per session, but not for
// deep links (/#resume) or reduced motion. Adding ?intro to the URL always shows it, for previewing.
const introScript = `(()=>{try{const f=new URLSearchParams(location.search).has("intro");if((location.pathname==="/"||location.pathname==="/ja")&&(f||(!location.hash&&!sessionStorage.getItem("dc-intro-seen")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)))document.documentElement.dataset.intro="show"}catch(e){}})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${jp.variable} ${dot.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: langScript }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
