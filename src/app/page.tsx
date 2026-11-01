import type { Metadata } from "next";
import { alternates } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { HomePage } from "@/views/HomePage";

// Rebuild the page (and its Departures board) at most every 6 hours.
// Keep in step with DEPARTURES.refreshSeconds in content/feeds.ts; Next needs a literal here.
export const revalidate = 21600;

export const metadata: Metadata = {
  title: ui.en.meta.title,
  description: ui.en.meta.description,
  alternates: alternates("en", "/"),
};

export default function Page() {
  return <HomePage lang="en" />;
}
