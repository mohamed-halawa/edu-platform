"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createCourseAction } from "@/lib/course-actions";
import { useState } from "react";
import { Loader2, GraduationCap } from "lucide-react";

export default function NewCoursePage() {
  const t = useTranslations("instructor.course");
  const tf = useTranslations("instructor.course.form");
  const tc = useTranslations("common");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await createCourseAction(new FormData(e.currentTarget));
    setLoading(false);
    if (result.success) {
      router.push(`/instructor/courses/${result.slug}`);
    } else {
      setError(result.error ?? "Failed to create course");
    }
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("new.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("new.subtitle")}</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titles */}
        <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            Course Titles
          </h2>
          <div>
            <label htmlFor="titleEn" className="block text-sm font-medium mb-1.5">
              {tf("titleEn")} <span className="text-destructive">*</span>
            </label>
            <input
              id="titleEn"
              name="titleEn"
              type="text"
              required
              minLength={3}
              placeholder={tf("titleEnPlaceholder")}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label htmlFor="titleAr" className="block text-sm font-medium mb-1.5">
              {tf("titleAr")} <span className="text-destructive">*</span>
            </label>
            <input
              id="titleAr"
              name="titleAr"
              type="text"
              required
              minLength={3}
              dir="rtl"
              placeholder={tf("titleArPlaceholder")}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-right"
            />
          </div>
        </div>

        {/* Descriptions */}
        <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
          <h2 className="font-semibold">Descriptions</h2>
          <div>
            <label htmlFor="descriptionEn" className="block text-sm font-medium mb-1.5">
              {tf("descriptionEn")}
            </label>
            <textarea
              id="descriptionEn"
              name="descriptionEn"
              rows={3}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
          <div>
            <label htmlFor="descriptionAr" className="block text-sm font-medium mb-1.5">
              {tf("descriptionAr")}
            </label>
            <textarea
              id="descriptionAr"
              name="descriptionAr"
              rows={3}
              dir="rtl"
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-right"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
          <h2 className="font-semibold">Pricing</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priceEgp" className="block text-sm font-medium mb-1.5">
                {tf("price")} <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  id="priceEgp"
                  name="priceEgp"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder={tf("pricePlaceholder")}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 pe-14 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <span className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  EGP
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="billingCycle" className="block text-sm font-medium mb-1.5">
                {tf("billingCycle")}
              </label>
              <select
                id="billingCycle"
                name="billingCycle"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="ONE_TIME">{tf("oneTime")}</option>
                <option value="MONTHLY">{tf("monthly")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
          <h2 className="font-semibold">Cover Image</h2>
          <div>
            <label htmlFor="coverUrl" className="block text-sm font-medium mb-1.5">
              {tf("coverUrl")}
            </label>
            <input
              id="coverUrl"
              name="coverUrl"
              type="url"
              placeholder="https://..."
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-1 text-xs text-muted-foreground">{tf("coverUrlHint")}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
          >
            {tc("cancel")}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:brightness-110 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {tf("submit")}
          </button>
        </div>
      </form>
    </div>
  );
}
