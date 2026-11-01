import type { Metadata } from "next";
import { alternates } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { ResumeView } from "@/views/ResumeView";

export const metadata: Metadata = {
  title: ui.ja.resume.metaTitle,
  description: ui.ja.resume.metaDescription,
  alternates: alternates("ja", "/resume"),
};

export default function Page() {
  return <ResumeView lang="ja" />;
}
