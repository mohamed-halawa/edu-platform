"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2 } from "lucide-react";
import { createResourceAction } from "@/lib/course-actions";
import { PdfUploader } from "./pdf-uploader";

export function AddResourceDialog({
  moduleId,
  courseSlug,
}: {
  moduleId: string;
  courseSlug: string;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"meta" | "upload">("meta");
  const [resourceId, setResourceId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<"PDF" | "VIDEO" | "EXAM">("PDF");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleMetaSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("moduleId", moduleId);
    startTransition(async () => {
      const res = await createResourceAction(fd);
      if (res.success && res.resourceId) {
        setResourceId(res.resourceId);
        if (selectedType === "PDF") {
          setStep("upload");
        } else {
          setOpen(false);
          setStep("meta");
        }
      } else {
        setError(res.error ?? "Failed");
      }
    });
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Resource
      </button>
    );
  }

  if (step === "upload" && resourceId) {
    return (
      <div className="rounded-xl border border-border/40 bg-background p-4">
        <h4 className="text-sm font-medium mb-3">Upload PDF</h4>
        <PdfUploader
          resourceId={resourceId}
          courseSlug={courseSlug}
          onSuccess={() => {
            setOpen(false);
            setStep("meta");
            setResourceId(null);
          }}
        />
        <button
          onClick={() => {
            setOpen(false);
            setStep("meta");
          }}
          className="mt-2 text-xs text-muted-foreground hover:text-foreground"
        >
          Skip upload for now
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/40 bg-background p-4">
      <form onSubmit={handleMetaSubmit} className="space-y-3">
        {error && <p className="text-xs text-destructive">{error}</p>}

        {/* Type Selector */}
        <div className="flex gap-2">
          {(["PDF", "VIDEO", "EXAM"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedType(t)}
              className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors ${
                selectedType === t
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              {t === "PDF" ? "📄 PDF" : t === "VIDEO" ? "🎬 Video" : "📝 Exam"}
            </button>
          ))}
        </div>
        <input type="hidden" name="type" value={selectedType} />

        <input
          name="titleEn"
          required
          placeholder="Resource title (English)"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <input
          name="titleAr"
          required
          dir="rtl"
          placeholder="عنوان المصدر (بالعربية)"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary/20"
        />

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
          >
            {pending && <Loader2 className="h-3 w-3 animate-spin" />}
            {selectedType === "PDF" ? "Next: Upload PDF" : "Add Resource"}
          </button>
        </div>
      </form>
    </div>
  );
}
