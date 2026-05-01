import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PdfViewer } from "@/components/pdf-viewer";
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
      module: { include: { course: true } },
    },
  });

  if (!resource || !resource.pdfResource) notFound();
  if (resource.module.course.slug !== slug) notFound();

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

      {/* PDF Viewer */}
      <PdfViewer
        resourceId={id}
        downloadable={resource.pdfResource.downloadable}
        title={resource.titleEn}
      />
    </div>
  );
}
