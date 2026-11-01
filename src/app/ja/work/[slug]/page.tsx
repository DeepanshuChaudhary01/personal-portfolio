import type { Metadata } from "next";
import { alternates } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { caseStudies, getCaseStudy } from "@/content/work";
import { CaseStudyView } from "@/views/CaseStudyView";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug, "ja");
  if (!study) return {};
  return {
    title: ui.ja.caseStudy.metaTitle(study.title, study.kind),
    description: study.summary,
    alternates: alternates("ja", `/work/${slug}`),
  };
}

export default async function Page({ params }: Params) {
  return <CaseStudyView slug={(await params).slug} lang="ja" />;
}
