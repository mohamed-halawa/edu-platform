import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { FileText, Video, ClipboardList, Lock, ChevronDown, ArrowLeft } from "lucide-react";

export default async function StudentCourseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const session = await auth();
  const userId = session!.user!.id as string;

  const course = await prisma.course.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          resources: {
            orderBy: { order: "asc" },
            include: { pdfResource: true, videoResource: true },
          },
        },
      },
    },
  });

  if (!course) notFound();

  const subscription = await prisma.subscription.findFirst({
    where: { studentId: userId, courseId: course.id, status: "ACTIVE" },
  });
  const isSubscribed = !!subscription;

  // Per-type display config
  const typeConfig = {
    PDF:   { Icon: FileText,      color: "text-primary",   bg: "bg-primary/10",   label: "PDF",   action: "Open",  actionClass: "border-border" },
    VIDEO: { Icon: Video,         color: "text-red-500",   bg: "bg-red-500/10",   label: "Video", action: "Watch", actionClass: "border-red-500/20 text-red-600 hover:bg-red-500/5" },
    EXAM:  { Icon: ClipboardList, color: "text-amber-500", bg: "bg-amber-500/10", label: "Exam",  action: "Take",  actionClass: "border-amber-500/20 text-amber-600 hover:bg-amber-500/5" },
  } as const;

  return (
    <div className="animate-fade-in max-w-3xl">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <Link
          href="/student/courses"
          className="mt-1 p-2 rounded-lg text-muted-foreground hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{course.titleEn}</h1>
          <p className="text-muted-foreground mt-1">{course.titleAr}</p>
          {course.descriptionEn && (
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {course.descriptionEn}
            </p>
          )}
        </div>
      </div>

      {/* Subscribe CTA */}
      {!isSubscribed && (
        <div className="mb-8 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-violet-500/5 p-6 flex items-center justify-between">
          <div>
            <p className="font-semibold">Get full access</p>
            <p className="text-sm text-muted-foreground">Subscribe to unlock all materials</p>
          </div>
          <div className="text-end">
            <div className="text-2xl font-bold">{course.priceEgp.toLocaleString()} EGP</div>
            <button className="mt-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25">
              Subscribe
            </button>
          </div>
        </div>
      )}

      {/* Module Accordion */}
      <div className="space-y-3">
        {course.modules.map((module, idx) => (
          <details
            key={module.id}
            className="group rounded-2xl border border-border/40 bg-card overflow-hidden"
            open={idx === 0}
          >
            <summary className="flex cursor-pointer items-center gap-3 px-5 py-4 hover:bg-accent/30 transition-colors list-none">
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180 shrink-0" />
              <div className="flex-1">
                <div className="font-medium">{module.titleEn}</div>
                <div className="text-xs text-muted-foreground">{module.titleAr}</div>
              </div>
              <span className="text-xs text-muted-foreground">
                {module.resources.length} items
              </span>
            </summary>

            <div className="border-t border-border/40 divide-y divide-border/20">
              {module.resources.map((resource) => {
                const isLocked = !isSubscribed;
                const cfg = typeConfig[resource.type as keyof typeof typeConfig];
                const { Icon, color, bg, label, action, actionClass } = cfg ?? {
                  Icon: FileText, color: "text-primary", bg: "bg-primary/10",
                  label: resource.type, action: "Open", actionClass: "border-border",
                };

                const hasContent =
                  resource.type === "PDF"   ? !!resource.pdfResource :
                  resource.type === "VIDEO" ? !!resource.videoResource :
                  false;

                return (
                  <div
                    key={resource.id}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-accent/20 transition-colors"
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isLocked ? "bg-muted/50 text-muted-foreground" : `${bg} ${color}`}`}>
                      {isLocked ? <Lock className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{resource.titleEn}</div>
                      <div className="text-xs text-muted-foreground">{label}</div>
                    </div>
                    {!isLocked && hasContent && (
                      <Link
                        href={`/student/courses/${slug}/resources/${resource.id}`}
                        className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent ${actionClass}`}
                      >
                        {action}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
