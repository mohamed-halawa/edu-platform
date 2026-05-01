import { useTranslations } from "next-intl";
import { Users, CreditCard, TrendingUp, BookOpen } from "lucide-react";

export default function AdminDashboard() {
  const t = useTranslations("admin.dashboard");

  const stats = [
    {
      label: t("revenue"),
      value: "0 EGP",
      icon: TrendingUp,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      label: t("students"),
      value: "0",
      icon: Users,
      color: "text-primary bg-primary/10",
    },
    {
      label: t("instructors"),
      value: "0",
      icon: BookOpen,
      color: "text-violet-500 bg-violet-500/10",
    },
    {
      label: t("payments"),
      value: "0",
      icon: CreditCard,
      color: "text-amber-500 bg-amber-500/10",
    },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("overview")}</p>

      {/* Stats Grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/40 bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </span>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
