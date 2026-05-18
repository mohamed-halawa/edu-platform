import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Plus, BookOpen, Users, Eye, EyeOff } from "lucide-react";
import { publishCourseAction } from "@/lib/course-actions";

export default async function InstructorCoursesPage() {
  const session = await auth();
  const t = await getTranslations("instructor");
  const tc = await getTranslations("common");

  const courses = await prisma.course.findMany({
    where: { instructorId: session!.user!.id as string },
    include: {
      _count: { select: { modules: true, subscriptions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("courses.title")}</h1>
          <p className="text-muted-foreground mt-1">
            {courses.length} {courses.length === 1 ? "course" : "courses"}
          </p>
        </div>
        <Link
          href="/instructor/courses/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          {t("dashboard.createCourse")}
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 p-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{t("courses.empty")}</h3>
          <Link
            href="/instructor/courses/new"
            className="mt-4 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25"
          >
            {t("courses.createFirst")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group relative rounded-2xl border border-border/40 bg-card overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20"
            >
              {/* Cover */}
              <div className="relative h-40 bg-gradient-to-br from-primary/20 to-violet-500/20">
                {course.coverUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={course.coverUrl}
                    alt={course.titleEn}
                    className="h-full w-full object-cover"
                  />
                )}
                {/* Status Badge */}
                <span
                  className={`absolute top-3 end-3 rounded-full px-2.5 py-1 text-xs font-medium ${
                    course.status === "PUBLISHED"
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                  }`}
                >
                  {course.status === "PUBLISHED" ? tc("published") : tc("draft")}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-base leading-tight line-clamp-2 mb-1">
                  {course.titleEn}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1 mb-4">
                  {course.titleAr}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    {course._count.modules} {t("courses.modules")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {course._count.subscriptions} {t("courses.students")}
                  </span>
                  <span className="ms-auto font-semibold text-foreground text-sm">
                    {course.priceEgp.toLocaleString()} EGP
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/instructor/courses/${course.slug}`}
                    className="flex-1 rounded-lg border border-border py-2 text-xs font-medium text-center transition-colors hover:bg-accent"
                  >
                    {t("courses.manageCourse")}
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await publishCourseAction(course.slug);
                    }}
                  >
                    <button
                      type="submit"
                      className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                        course.status === "PUBLISHED"
                          ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                      }`}
                    >
                      {course.status === "PUBLISHED" ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
