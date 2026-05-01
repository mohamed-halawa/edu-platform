import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BookOpen, Play, ClipboardCheck, ArrowRight, Sparkles } from "lucide-react";

export default function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // We need to handle the async params in a server component
  return <LandingContent />;
}

function LandingContent() {
  const t = useTranslations("landing");
  const tNav = useTranslations("nav");

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-violet-500/5" />
        <div className="absolute top-20 start-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-20 end-1/4 h-72 w-72 rounded-full bg-violet-500/10 blur-[100px]" />

        <div className="container relative py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Welcome to the future of learning</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="gradient-text">{t("hero.title")}</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              {t("hero.subtitle")}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 hover:brightness-110"
              >
                {t("hero.cta")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-accent"
              >
                {t("hero.ctaSecondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border/40 bg-card/30">
        <div className="container py-24">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            {t("features.title")}
          </h2>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
            {/* Video Feature */}
            <div className="group relative rounded-2xl border border-border/40 bg-background p-8 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Play className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t("features.videos.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("features.videos.description")}
              </p>
            </div>

            {/* PDF Feature */}
            <div className="group relative rounded-2xl border border-border/40 bg-background p-8 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 transition-colors group-hover:bg-violet-500 group-hover:text-white">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t("features.pdfs.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("features.pdfs.description")}
              </p>
            </div>

            {/* Exam Feature */}
            <div className="group relative rounded-2xl border border-border/40 bg-background p-8 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                <ClipboardCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t("features.exams.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("features.exams.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-border/40">
        <div className="container py-20">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "10,000+", label: t("stats.students") },
              { value: "500+", label: t("stats.courses") },
              { value: "100+", label: t("stats.instructors") },
              { value: "50,000+", label: t("stats.hours") },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold gradient-text md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 bg-gradient-to-r from-primary/5 via-background to-violet-500/5">
        <div className="container py-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to start learning?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Join our platform today and get access to top-quality courses from the best instructors.
          </p>
          <Link
            href="/auth/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 hover:brightness-110"
          >
            {tNav("register")}
          </Link>
        </div>
      </section>
    </div>
  );
}
