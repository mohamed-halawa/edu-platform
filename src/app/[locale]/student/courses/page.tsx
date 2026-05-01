import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BookOpen, Clock } from "lucide-react";

export default async function StudentCoursesPage() {
  const session = await auth();
  const t = await getTranslations("student");

  const subscriptions = await prisma.subscription.findMany({
    where: {
      studentId: session!.user!.id as string,
      status: "ACTIVE",
    },
    include: {
      course: {
        include: {
          _count: { select: { modules: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-2">{t("courses.title")}</h1>
      <p className="text-muted-foreground mb-8">
        {subscriptions.length} active{" "}
        {subscriptions.length === 1 ? "course" : "courses"}
      </p>

      {subscriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 p-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{t("dashboard.noCourses")}</h3>
          <Link
            href="/"
            className="mt-4 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25"
          >
            {t("dashboard.browseCourses")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map(({ course }) => (
            <Link
              key={course.id}
              href={`/student/courses/${course.slug}`}
              className="group rounded-2xl border border-border/40 bg-card overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20"
            >
              {/* Cover */}
              <div className="relative h-36 bg-gradient-to-br from-primary/20 to-violet-500/20">
                {course.coverUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={course.coverUrl}
                    alt={course.titleEn}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-base leading-tight line-clamp-2 mb-1">
                  {course.titleEn}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1 mb-4">
                  {course.titleAr}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    {course._count.modules} modules
                  </span>
                </div>
                <div className="mt-4 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary text-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {t("courses.continue")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
