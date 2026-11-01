import type { Metadata } from "next";
import { alternates } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { ResumeView } from "@/views/ResumeView";

export const metadata: Metadata = {
  title: ui.en.resume.metaTitle,
  description: ui.en.resume.metaDescription,
  alternates: alternates("en", "/resume"),
};

export default function Page() {
  return <ResumeView lang="en" />;
}
