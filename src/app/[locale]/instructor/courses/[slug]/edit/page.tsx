import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditCourseForm } from "@/components/edit-course-form";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) notFound();
  if (
    course.instructorId !== session!.user!.id &&
    session!.user!.role !== "SUPER_ADMIN"
  ) notFound();

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href={`/instructor/courses/${slug}`}
          className="p-2 rounded-lg text-muted-foreground hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Course</h1>
          <p className="text-sm text-muted-foreground">{course.titleEn}</p>
        </div>
      </div>
      <EditCourseForm
        course={{
          slug: course.slug,
          titleEn: course.titleEn,
          titleAr: course.titleAr,
          descriptionEn: course.descriptionEn ?? null,
          descriptionAr: course.descriptionAr ?? null,
          priceEgp: course.priceEgp,
          billingCycle: course.billingCycle,
          coverUrl: course.coverUrl ?? null,
        }}
      />
    </div>
  );
}
