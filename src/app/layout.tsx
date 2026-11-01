import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import {
  Atkinson_Hyperlegible_Mono,
  Atkinson_Hyperlegible_Next,
  DotGothic16,
  Noto_Sans_JP,
} from "next/font/google";
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
// Japanese fonts are served in unicode-range slices, so only the glyphs we use get downloaded.
const jp = Noto_Sans_JP({ variable: "--font-jp", display: "swap", preload: false });
const dot = DotGothic16({ weight: "400", variable: "--font-dot", display: "swap", preload: false });

export const metadata: Metadata = {
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${jp.variable} ${dot.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
