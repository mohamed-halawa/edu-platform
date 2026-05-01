"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2 } from "lucide-react";
import { createModuleAction } from "@/lib/course-actions";

export function AddModuleDialog({
  courseId,
  courseSlug,
}: {
  courseId: string;
  courseSlug: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("courseId", courseId);
    startTransition(async () => {
      const res = await createModuleAction(fd);
      if (res.success) {
        setOpen(false);
        (e.target as HTMLFormElement).reset();
      } else {
        setError(res.error ?? "Failed");
      }
    });
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Module
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <p className="text-xs text-destructive">{error}</p>}
        <div>
          <input
            name="titleEn"
            required
            placeholder="Module title (English)"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <input
            name="titleAr"
            required
            dir="rtl"
            placeholder="عنوان الوحدة (بالعربية)"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
          >
            {pending && <Loader2 className="h-3 w-3 animate-spin" />}
            Add Module
          </button>
        </div>
      </form>
    </div>
  );
}
