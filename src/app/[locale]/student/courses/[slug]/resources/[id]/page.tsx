import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PdfViewer } from "@/components/pdf-viewer";
import { VideoPlayer } from "@/components/video-player";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export default async function StudentResourcePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const session = await auth();

  const resource = await prisma.resource.findUnique({
    where: { id },
    include: {
      pdfResource: true,
      videoResource: true,
      module: { include: { course: true } },
    },
  });

  if (!resource) notFound();
  if (resource.module.course.slug !== slug) notFound();

  // Must have the relevant sub-resource
  if (resource.type === "PDF" && !resource.pdfResource) notFound();
  if (resource.type === "VIDEO" && !resource.videoResource) notFound();

  return (
    <div className="animate-fade-in">
      {/* Back nav */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/student/courses/${slug}`}
          className="p-2 rounded-lg text-muted-foreground hover:bg-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold">{resource.titleEn}</h1>
          <p className="text-sm text-muted-foreground">
            {resource.module.course.titleEn} · {resource.module.titleEn}
          </p>
        </div>
      </div>

      {/* PDF */}
      {resource.type === "PDF" && resource.pdfResource && (
        <PdfViewer
          resourceId={id}
          downloadable={resource.pdfResource.downloadable}
          title={resource.titleEn}
        />
      )}

      {/* Video */}
      {resource.type === "VIDEO" && resource.videoResource && (() => {
        const v = resource.videoResource;
        if (v.provider === "YOUTUBE" && v.youtubeVideoId) {
          return (
            <VideoPlayer
              provider="YOUTUBE"
              youtubeVideoId={v.youtubeVideoId}
              title={resource.titleEn}
              thumbnailUrl={v.thumbnailUrl}
            />
          );
        }
        if (v.provider === "BUNNY" && v.bunnyLibraryId && v.bunnyVideoId) {
          return (
            <VideoPlayer
              provider="BUNNY"
              bunnyLibraryId={v.bunnyLibraryId}
              bunnyVideoId={v.bunnyVideoId}
              title={resource.titleEn}
              thumbnailUrl={v.thumbnailUrl}
            />
          );
        }
        return (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center text-sm text-amber-700">
            Video source is not configured yet. Please check back later.
          </div>
        );
      })()}
    </div>
  );
}
