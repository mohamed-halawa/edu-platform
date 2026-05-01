import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function InstructorCourses() {
  const t = useTranslations("instructor.dashboard");

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("myCourses")}</h1>
        <Link
          href="/instructor/courses"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          {t("createCourse")}
        </Link>
      </div>

      {/* Empty State */}
      <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 p-16 text-center">
        <p className="text-muted-foreground">
          No courses yet. Create your first course to get started.
        </p>
      </div>
    </div>
  );
}
