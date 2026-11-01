import { getResume, RESUME_DOWNLOAD_NAME } from "@/lib/resumeFile";

// Built once at deploy time from the PDF in /resume; in `next dev` it re-reads on every request.
export const dynamic = "force-static";

export async function GET() {
  const resume = await getResume();
  if (!resume) {
    return new Response("No resume has been published yet.", { status: 404 });
  }
  return new Response(resume.bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${RESUME_DOWNLOAD_NAME}"`,
    },
  });
}
