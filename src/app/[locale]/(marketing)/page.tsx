import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  GraduationCap,
  Play,
  BookOpen,
  ClipboardCheck,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Users,
  Star,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("landing");
  const tNav = await getTranslations("nav");

  return (
    <div className="relative overflow-hidden bg-[#0a0b0f] text-white min-h-screen">
      {/* ── Global ambient blobs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -start-40 h-[600px] w-[600px] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-1/3 -end-40 h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute bottom-0 start-1/3 h-[400px] w-[400px] rounded-full bg-pink-600/10 blur-[100px]" />
      </div>

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-28 px-4">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            منصة تعليمية متكاملة للطلاب المصريين
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05]">
            <span className="block text-white">{t("hero.title")}</span>
            <span className="mt-3 block bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              أينما كنت
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-400 leading-relaxed md:text-xl">
            {t("hero.subtitle")}
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 px-8 py-3.5 text-base font-semibold text-white shadow-2xl shadow-indigo-500/30 transition-all duration-300 hover:shadow-indigo-500/50 hover:scale-105"
            >
              {t("hero.cta")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20"
            >
              <Play className="h-4 w-4 text-indigo-400" />
              {t("hero.ctaSecondary")}
            </Link>
          </div>

          {/* Social proof row */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            {[
              { icon: Users, text: "+10,000 طالب نشط" },
              { icon: Star, text: "تقييم 4.9/5" },
              { icon: Shield, text: "محتوى موثوق 100%" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-indigo-400" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="relative mx-auto mt-20 max-w-4xl px-4">
          <div className="relative rounded-2xl border border-white/10 bg-white/5 p-1 shadow-2xl shadow-black/60 backdrop-blur-sm">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 rounded-t-xl border-b border-white/10 bg-white/5 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500/70" />
              <div className="h-3 w-3 rounded-full bg-amber-500/70" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
              <div className="ms-3 h-5 flex-1 rounded-md bg-white/5 border border-white/10" />
            </div>
            {/* Mock dashboard content */}
            <div className="rounded-b-xl bg-gradient-to-br from-slate-900 to-slate-950 p-6">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "الدورات النشطة", value: "12" },
                  { label: "الطلاب", value: "2,840" },
                  { label: "معدل الإتمام", value: "94%" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 text-center"
                  >
                    <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                      {s.value}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {["Python للمبتدئين", "تصميم UI/UX", "الذكاء الاصطناعي", "تطوير الويب"].map((c) => (
                  <div
                    key={c}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                  >
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500/30 to-violet-500/30 flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div className="text-sm font-medium text-slate-300">{c}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Glow under the card */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-24 w-3/4 bg-indigo-500/20 blur-[60px] rounded-full" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS TICKER
      ══════════════════════════════════════════════ */}
      <section className="relative border-y border-white/5 bg-white/[0.02] py-12">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "10,000+", label: t("stats.students") },
              { value: "500+", label: t("stats.courses") },
              { value: "100+", label: t("stats.instructors") },
              { value: "50,000+", label: t("stats.hours") },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent md:text-5xl">
                  {s.value}
                </div>
                <div className="mt-2 text-sm text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════ */}
      <section className="relative py-28 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300">
              <Zap className="h-3.5 w-3.5" />
              كل شيء في مكان واحد
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              <span className="text-white">{t("features.title")}</span>
            </h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto">
              منصة شاملة تجمع بين المحتوى المرئي والمقروء والاختبارات التفاعلية
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Play,
                title: t("features.videos.title"),
                desc: t("features.videos.description"),
                gradient: "from-indigo-500 to-blue-500",
                glow: "shadow-indigo-500/20",
                badge: "YouTube & Bunny",
              },
              {
                icon: BookOpen,
                title: t("features.pdfs.title"),
                desc: t("features.pdfs.description"),
                gradient: "from-violet-500 to-purple-600",
                glow: "shadow-violet-500/20",
                badge: "محمي بالاشتراك",
              },
              {
                icon: ClipboardCheck,
                title: t("features.exams.title"),
                desc: t("features.exams.description"),
                gradient: "from-pink-500 to-rose-500",
                glow: "shadow-pink-500/20",
                badge: "تصحيح تلقائي",
              },
            ].map(({ icon: Icon, title, desc, gradient, glow, badge }) => (
              <div
                key={title}
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/8 hover:-translate-y-1"
              >
                {/* Top gradient line */}
                <div className={`absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r ${gradient} opacity-60`} />

                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-xl ${glow}`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>

                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                  {badge}
                </div>

                <h3 className="mt-3 text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-slate-400 leading-relaxed">{desc}</p>

                <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100">
                  اعرف المزيد <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════ */}
      <section className="relative py-28 px-4 border-t border-white/5 bg-white/[0.015]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
              كيف يعمل؟
            </h2>
            <p className="mt-4 text-slate-400">ثلاث خطوات بسيطة للبدء</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "أنشئ حسابك",
                desc: "سجّل مجاناً في دقيقة واحدة باستخدام بريدك الإلكتروني أو حساب جوجل.",
                color: "from-indigo-500 to-indigo-600",
              },
              {
                step: "02",
                title: "اختر دورتك",
                desc: "تصفّح مئات الدورات من أفضل المدرسين في مصر واشترك في ما يناسبك.",
                color: "from-violet-500 to-violet-600",
              },
              {
                step: "03",
                title: "تعلّم وتقدّم",
                desc: "شاهد المحاضرات، اقرأ المواد، وأجرِ الاختبارات في أي وقت ومن أي مكان.",
                color: "from-pink-500 to-pink-600",
              },
            ].map(({ step, title, desc, color }, i) => (
              <div key={step} className="relative flex flex-col items-center text-center">
                {/* Connector line */}
                {i < 2 && (
                  <div className="absolute top-8 start-1/2 hidden h-px w-full bg-gradient-to-r from-white/10 to-transparent md:block" />
                )}
                <div className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-2xl mb-6`}>
                  <span className="text-2xl font-black text-white">{step}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════ */}
      <section className="relative py-28 px-4 border-t border-white/5">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              ماذا يقول طلابنا؟
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "أحمد محمود",
                role: "مطور برمجيات",
                text: "المنصة غيّرت مسيرتي المهنية تماماً. المحتوى عالي الجودة والمدرسون متميزون.",
                rating: 5,
              },
              {
                name: "سارة عبدالله",
                role: "مصممة جرافيك",
                text: "تجربة تعلم لا مثيل لها. الوصول للمحتوى سهل وسريع، والاختبارات التفاعلية رائعة.",
                rating: 5,
              },
              {
                name: "محمد علي",
                role: "طالب هندسة",
                text: "أفضل استثمار في حياتي. تعلمت في شهر ما لم أتعلمه في سنة.",
                rating: 5,
              },
            ].map(({ name, role, text, rating }) => (
              <div
                key={name}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-white/20"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 leading-relaxed mb-6">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
                    {name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{name}</div>
                    <div className="text-xs text-slate-400">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PRICING TEASER
      ══════════════════════════════════════════════ */}
      <section className="relative py-28 px-4 border-t border-white/5 bg-white/[0.015]">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-sm font-medium text-pink-300">
            <Zap className="h-3.5 w-3.5" />
            أسعار تنافسية
          </div>
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
            دفعة واحدة أو اشتراك شهري
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            ادفع مرة واحدة للوصول الدائم، أو اشترك شهرياً للحصول على أفضل قيمة.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
            {[
              {
                label: "دفعة واحدة",
                sublabel: "وصول دائم للدورة",
                features: ["وصول مدى الحياة", "تحميل المواد", "شهادة إتمام"],
                gradient: "from-indigo-500/20 to-violet-500/20",
                border: "border-indigo-500/30",
                cta: "ابدأ الآن",
              },
              {
                label: "اشتراك شهري",
                sublabel: "وصول لجميع الدورات",
                features: ["جميع الدورات", "محتوى جديد باستمرار", "دعم مباشر"],
                gradient: "from-violet-500/20 to-pink-500/20",
                border: "border-violet-500/30",
                cta: "اشترك الآن",
              },
            ].map(({ label, sublabel, features, gradient, border, cta }) => (
              <div
                key={label}
                className={`rounded-2xl border ${border} bg-gradient-to-br ${gradient} p-8 backdrop-blur-sm text-start`}
              >
                <h3 className="text-xl font-bold text-white">{label}</h3>
                <p className="text-sm text-slate-400 mt-1">{sublabel}</p>
                <ul className="mt-6 space-y-3">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <CheckCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/register"
                  className="mt-8 block rounded-full border border-white/10 bg-white/10 py-2.5 text-center text-sm font-semibold text-white transition-all hover:bg-white/20"
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════ */}
      <section className="relative py-28 px-4 border-t border-white/5">
        <div className="relative mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-900/60 to-violet-900/60 p-16 text-center backdrop-blur-sm overflow-hidden">
          {/* Blobs inside card */}
          <div className="absolute -top-20 -start-20 h-64 w-64 rounded-full bg-indigo-600/30 blur-[80px]" />
          <div className="absolute -bottom-20 -end-20 h-64 w-64 rounded-full bg-pink-600/20 blur-[80px]" />

          <div className="relative">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
              ابدأ رحلتك التعليمية
              <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                اليوم مجاناً
              </span>
            </h2>
            <p className="mt-6 text-slate-300 max-w-lg mx-auto text-lg">
              انضم لأكثر من 10,000 طالب يتعلمون ويتطورون على منصتنا كل يوم.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/auth/register"
                className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 px-10 py-4 text-base font-semibold text-white shadow-2xl shadow-indigo-500/40 transition-all hover:scale-105 hover:shadow-indigo-500/60"
              >
                {tNav("register")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-medium text-slate-300 transition-all hover:border-white/40 hover:text-white"
              >
                {tNav("login")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════ */}
      <footer className="relative border-t border-white/5 bg-white/[0.02] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">EduPlatform</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                منصة تعليمية متكاملة تجمع بين أفضل المدرسين وأحدث أدوات التعلم.
              </p>
            </div>

            {/* Links */}
            {[
              {
                title: "المنصة",
                links: ["الدورات", "الأسعار", "لوحة التحكم", "الاختبارات"],
              },
              {
                title: "الشركة",
                links: ["عنّا", "تواصل معنا", "سياسة الخصوصية", "الشروط والأحكام"],
              },
              {
                title: "الدعم",
                links: ["مركز المساعدة", "الأسئلة الشائعة", "الإبلاغ عن مشكلة"],
              },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="mb-4 text-sm font-semibold text-white">{title}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
            <p className="text-sm text-slate-500">
              © 2026 EduPlatform. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Shield className="h-3.5 w-3.5" />
              <span>مشفّر وآمن 100%</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
