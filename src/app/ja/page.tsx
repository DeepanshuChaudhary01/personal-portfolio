import type { Metadata } from "next";
import { alternates } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { HomePage } from "@/views/HomePage";

// Same refresh as the English home page (see app/page.tsx).
export const revalidate = 21600;

export const metadata: Metadata = {
  title: ui.ja.meta.title,
  description: ui.ja.meta.description,
  alternates: alternates("ja", "/"),
};

export default function Page() {
  return <HomePage lang="ja" />;
}
