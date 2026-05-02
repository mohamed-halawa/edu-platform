import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  GraduationCap, Play, BookOpen, ClipboardCheck,
  ArrowRight, Sparkles, Shield, Zap, Users, Star, CheckCircle, ChevronRight,
} from "lucide-react";

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  const t = await getTranslations("landing");
  const tNav = await getTranslations("nav");

  return (
    <div className="relative overflow-hidden">
      {/* ── Ambient blobs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -start-40 h-[600px] w-[600px] rounded-full bg-indigo-600/10 dark:bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-1/3 -end-40 h-[500px] w-[500px] rounded-full bg-violet-600/10 dark:bg-violet-600/15 blur-[120px]" />
        <div className="absolute bottom-0 start-1/3 h-[400px] w-[400px] rounded-full bg-pink-600/5 dark:bg-pink-600/10 blur-[100px]" />
      </div>

      {/* ══ HERO ══ */}
      <section className="relative pt-32 pb-28 px-4">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            منصة تعليمية متكاملة للطلاب المصريين
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05]">
            <span className="block text-foreground">{t("hero.title")}</span>
            <span className="mt-3 block bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
              أينما كنت
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
            {t("hero.subtitle")}
          </p>

          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:scale-105"
            >
              {t("hero.cta")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-8 py-3.5 text-base font-semibold text-foreground backdrop-blur-sm transition-all hover:bg-accent"
            >
              <Play className="h-4 w-4 text-indigo-500" />
              {t("hero.ctaSecondary")}
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            {[
              { icon: Users, text: "+10,000 طالب نشط" },
              { icon: Star, text: "تقييم 4.9/5" },
              { icon: Shield, text: "محتوى موثوق 100%" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-indigo-500" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="relative border-y border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "10,000+", label: t("stats.students") },
              { value: "500+", label: t("stats.courses") },
              { value: "100+", label: t("stats.instructors") },
              { value: "50,000+", label: t("stats.hours") },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-clip-text text-transparent md:text-5xl">
                  {s.value}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="relative py-28 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-600 dark:text-violet-300">
              <Zap className="h-3.5 w-3.5" />كل شيء في مكان واحد
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground">
              {t("features.title")}
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              منصة شاملة تجمع بين المحتوى المرئي والمقروء والاختبارات التفاعلية
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Play, title: t("features.videos.title"), desc: t("features.videos.description"), gradient: "from-indigo-500 to-blue-500", shadow: "shadow-indigo-500/20", badge: "YouTube & Bunny" },
              { icon: BookOpen, title: t("features.pdfs.title"), desc: t("features.pdfs.description"), gradient: "from-violet-500 to-purple-600", shadow: "shadow-violet-500/20", badge: "محمي بالاشتراك" },
              { icon: ClipboardCheck, title: t("features.exams.title"), desc: t("features.exams.description"), gradient: "from-pink-500 to-rose-500", shadow: "shadow-pink-500/20", badge: "تصحيح تلقائي" },
            ].map(({ icon: Icon, title, desc, gradient, shadow, badge }) => (
              <div key={title} className="group relative rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1">
                <div className={`absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r ${gradient} opacity-50`} />
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-xl ${shadow}`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {badge}
                </div>
                <h3 className="mt-3 text-xl font-bold text-foreground">{title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{desc}</p>
                <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-indigo-500 opacity-0 transition-opacity group-hover:opacity-100">
                  اعرف المزيد <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="relative py-28 px-4 border-t border-border bg-muted/20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground">كيف يعمل؟</h2>
            <p className="mt-4 text-muted-foreground">ثلاث خطوات بسيطة للبدء</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "01", title: "أنشئ حسابك", desc: "سجّل مجاناً في دقيقة واحدة باستخدام بريدك الإلكتروني أو حساب جوجل.", color: "from-indigo-500 to-indigo-600" },
              { step: "02", title: "اختر دورتك", desc: "تصفّح مئات الدورات من أفضل المدرسين في مصر واشترك في ما يناسبك.", color: "from-violet-500 to-violet-600" },
              { step: "03", title: "تعلّم وتقدّم", desc: "شاهد المحاضرات، اقرأ المواد، وأجرِ الاختبارات في أي وقت ومن أي مكان.", color: "from-pink-500 to-pink-600" },
            ].map(({ step, title, desc, color }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-2xl mb-6`}>
                  <span className="text-2xl font-black text-white">{step}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="relative py-28 px-4 border-t border-border">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">ماذا يقول طلابنا؟</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "أحمد محمود", role: "مطور برمجيات", text: "المنصة غيّرت مسيرتي المهنية تماماً. المحتوى عالي الجودة والمدرسون متميزون." },
              { name: "سارة عبدالله", role: "مصممة جرافيك", text: "تجربة تعلم لا مثيل لها. الوصول للمحتوى سهل وسريع، والاختبارات التفاعلية رائعة." },
              { name: "محمد علي", role: "طالب هندسة", text: "أفضل استثمار في حياتي. تعلمت في شهر ما لم أتعلمه في سنة." },
            ].map(({ name, role, text }) => (
              <div key={name} className="rounded-2xl border border-border bg-card p-8 transition-all hover:border-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/5">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
                    {name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{name}</div>
                    <div className="text-xs text-muted-foreground">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section className="relative py-28 px-4 border-t border-border bg-muted/20">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-sm font-medium text-pink-600 dark:text-pink-300">
            <Zap className="h-3.5 w-3.5" />أسعار تنافسية
          </div>
          <h2 className="text-4xl font-extrabold text-foreground sm:text-5xl">دفعة واحدة أو اشتراك شهري</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">ادفع مرة واحدة للوصول الدائم، أو اشترك شهرياً للحصول على أفضل قيمة.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
            {[
              { label: "دفعة واحدة", sub: "وصول دائم للدورة", features: ["وصول مدى الحياة", "تحميل المواد", "شهادة إتمام"], border: "border-indigo-500/30", bg: "bg-indigo-500/5", cta: "ابدأ الآن" },
              { label: "اشتراك شهري", sub: "وصول لجميع الدورات", features: ["جميع الدورات", "محتوى جديد باستمرار", "دعم مباشر"], border: "border-violet-500/30", bg: "bg-violet-500/5", cta: "اشترك الآن" },
            ].map(({ label, sub, features, border, bg, cta }) => (
              <div key={label} className={`rounded-2xl border ${border} ${bg} p-8 text-start`}>
                <h3 className="text-xl font-bold text-foreground">{label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{sub}</p>
                <ul className="mt-6 space-y-3">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                      <CheckCircle className="h-4 w-4 text-indigo-500 shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/register" className="mt-8 block rounded-full border border-border bg-background py-2.5 text-center text-sm font-semibold text-foreground transition-all hover:bg-accent">
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section className="relative py-28 px-4 border-t border-border">
        <div className="relative mx-auto max-w-4xl rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-pink-500/10 p-16 text-center overflow-hidden">
          <div className="absolute -top-20 -start-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-[80px]" />
          <div className="absolute -bottom-20 -end-20 h-64 w-64 rounded-full bg-pink-500/10 blur-[80px]" />
          <div className="relative">
            <h2 className="text-4xl font-extrabold text-foreground sm:text-5xl">
              ابدأ رحلتك التعليمية
              <span className="block mt-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">اليوم مجاناً</span>
            </h2>
            <p className="mt-6 text-muted-foreground max-w-lg mx-auto text-lg">انضم لأكثر من 10,000 طالب يتعلمون ويتطورون على منصتنا كل يوم.</p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/auth/register" className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 px-10 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 hover:shadow-indigo-500/50">
                {tNav("register")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Link>
              <Link href="/auth/login" className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-4 text-sm font-medium text-muted-foreground transition-all hover:border-indigo-500/30 hover:text-foreground">
                {tNav("login")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="relative border-t border-border bg-muted/20 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-foreground">EduPlatform</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">منصة تعليمية متكاملة تجمع بين أفضل المدرسين وأحدث أدوات التعلم.</p>
            </div>
            {[
              { title: "المنصة", links: ["الدورات", "الأسعار", "لوحة التحكم", "الاختبارات"] },
              { title: "الشركة", links: ["عنّا", "تواصل معنا", "سياسة الخصوصية", "الشروط والأحكام"] },
              { title: "الدعم", links: ["مركز المساعدة", "الأسئلة الشائعة", "الإبلاغ عن مشكلة"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="mb-4 text-sm font-semibold text-foreground">{title}</h4>
                <ul className="space-y-2.5">
                  {links.map((l) => <li key={l} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{l}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
            <p className="text-sm text-muted-foreground">© 2026 EduPlatform. جميع الحقوق محفوظة.</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" /><span>مشفّر وآمن 100%</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
