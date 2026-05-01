"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { updateCourseAction } from "@/lib/course-actions";
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";

type Course = {
  slug: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  priceEgp: number;
  billingCycle: string;
  coverUrl: string | null;
};

export function EditCourseForm({ course }: { course: Course }) {
  const tf = useTranslations("instructor.course.form");
  const tc = useTranslations("common");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await updateCourseAction(course.slug, new FormData(e.currentTarget));
    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push(`/instructor/courses/${course.slug}`), 1200);
    } else {
      setError(result.error ?? "Failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-600">
          Saved! Redirecting...
        </div>
      )}

      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
        <h2 className="font-semibold">Titles</h2>
        <div>
          <label className="block text-sm font-medium mb-1.5">{tf("titleEn")}</label>
          <input
            name="titleEn"
            defaultValue={course.titleEn}
            required
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">{tf("titleAr")}</label>
          <input
            name="titleAr"
            defaultValue={course.titleAr}
            required
            dir="rtl"
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-right focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
        <h2 className="font-semibold">Descriptions</h2>
        <div>
          <label className="block text-sm font-medium mb-1.5">{tf("descriptionEn")}</label>
          <textarea
            name="descriptionEn"
            defaultValue={course.descriptionEn ?? ""}
            rows={3}
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm resize-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">{tf("descriptionAr")}</label>
          <textarea
            name="descriptionAr"
            defaultValue={course.descriptionAr ?? ""}
            rows={3}
            dir="rtl"
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-right resize-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
        <h2 className="font-semibold">Pricing & Cover</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">{tf("price")}</label>
            <div className="relative">
              <input
                name="priceEgp"
                type="number"
                defaultValue={course.priceEgp}
                min="0"
                step="0.01"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 pe-14 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <span className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">EGP</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">{tf("coverUrl")}</label>
            <input
              name="coverUrl"
              type="url"
              defaultValue={course.coverUrl ?? ""}
              placeholder="https://..."
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
        >
          {tc("cancel")}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110 disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {tf("update")}
        </button>
      </div>
    </form>
  );
}
