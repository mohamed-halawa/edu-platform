import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ModuleList } from "@/components/module-list";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Edit,
  Users,
  BookOpen,
} from "lucide-react";
import { publishCourseAction } from "@/lib/course-actions";

export default async function CourseManagePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const session = await auth();

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          resources: {
            orderBy: { order: "asc" },
            include: { pdfResource: true },
          },
        },
      },
      _count: { select: { subscriptions: true } },
    },
  });

  if (!course) notFound();
  if (course.instructorId !== session!.user!.id &&
      session!.user!.role !== "SUPER_ADMIN") notFound();

  const totalResources = course.modules.reduce(
    (acc, m) => acc + m.resources.length,
    0
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <Link
          href="/instructor/courses"
          className="mt-1 p-2 rounded-lg text-muted-foreground hover:bg-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                course.status === "PUBLISHED"
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-amber-500/10 text-amber-600"
              }`}
            >
              {course.status}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight truncate">
            {course.titleEn}
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">{course.titleAr}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/instructor/courses/${slug}/edit`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Link>
          <form
            action={async () => {
              "use server";
              await publishCourseAction(slug);
            }}
          >
            <button
              type="submit"
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                course.status === "PUBLISHED"
                  ? "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20"
              }`}
            >
              {course.status === "PUBLISHED" ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  Unpublish
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Publish
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Modules",
            value: course.modules.length,
            icon: BookOpen,
            color: "text-primary bg-primary/10",
          },
          {
            label: "Resources",
            value: totalResources,
            icon: BookOpen,
            color: "text-violet-500 bg-violet-500/10",
          },
          {
            label: "Students",
            value: course._count.subscriptions,
            icon: Users,
            color: "text-emerald-500 bg-emerald-500/10",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/40 bg-card p-5 flex items-center gap-4"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Module List */}
      <ModuleList
        modules={course.modules.map((m) => ({
          id: m.id,
          titleEn: m.titleEn,
          titleAr: m.titleAr,
          order: m.order,
          resources: m.resources.map((r) => ({
            id: r.id,
            type: r.type as "PDF" | "VIDEO" | "EXAM",
            titleEn: r.titleEn,
            titleAr: r.titleAr,
            order: r.order,
          })),
        }))}
        courseId={course.id}
        courseSlug={course.slug}
        locale={locale}
      />
    </div>
  );
}
