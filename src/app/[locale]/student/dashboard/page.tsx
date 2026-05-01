import { useTranslations } from "next-intl";
import { BookOpen } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function StudentDashboard() {
  const t = useTranslations("student.dashboard");

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("noCourses")}</p>

      {/* Empty State */}
      <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 p-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BookOpen className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">{t("noCourses")}</h3>
        <Link
          href="/"
          className="mt-4 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:brightness-110"
        >
          {t("browseCourses")}
        </Link>
      </div>
    </div>
  );
}
