"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2, PlayCircle, Cloud, CheckCircle2, AlertCircle } from "lucide-react";
import { createResourceAction, saveYouTubeVideoAction } from "@/lib/course-actions";
import { PdfUploader } from "./pdf-uploader";
import { extractYouTubeId, youtubeThumbnailUrl } from "@/lib/youtube";

type VideoInputMode = "youtube" | "bunny";

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
  const [videoMode, setVideoMode] = useState<VideoInputMode>("youtube");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // YouTube URL state
  const [ytUrl, setYtUrl] = useState("");
  const [ytId, setYtId] = useState<string | null>(null);
  const [ytSaving, setYtSaving] = useState(false);
  const [ytDone, setYtDone] = useState(false);

  const reset = () => {
    setStep("meta");
    setResourceId(null);
    setError(null);
    setYtUrl("");
    setYtId(null);
    setYtDone(false);
  };

  const handleMetaSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("moduleId", moduleId);
    startTransition(async () => {
      const res = await createResourceAction(fd);
      if (res.success && res.resourceId) {
        setResourceId(res.resourceId);
        // PDF and VIDEO both go to upload step
        if (selectedType === "PDF" || selectedType === "VIDEO") {
          setStep("upload");
        } else {
          setOpen(false);
          reset();
        }
      } else {
        setError(res.error ?? "Failed");
      }
    });
  };

  const handleYtUrlChange = (val: string) => {
    setYtUrl(val);
    setYtId(extractYouTubeId(val));
    setYtDone(false);
  };

  const handleSaveYouTube = async () => {
    if (!resourceId || !ytId) return;
    setYtSaving(true);
    setError(null);
    const fd = new FormData();
    fd.set("resourceId", resourceId);
    fd.set("youtubeVideoId", ytId);
    fd.set("thumbnailUrl", youtubeThumbnailUrl(ytId));
    const res = await saveYouTubeVideoAction(fd);
    setYtSaving(false);
    if (res.success) {
      setYtDone(true);
      setTimeout(() => {
        setOpen(false);
        reset();
      }, 1000);
    } else {
      setError(res.error ?? "Failed to save video");
    }
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

  // ── VIDEO upload step ─────────────────────────────────────────────
  if (step === "upload" && resourceId && selectedType === "VIDEO") {
    return (
      <div className="rounded-xl border border-border/40 bg-background p-4 space-y-4">
        <h4 className="text-sm font-semibold">Add Video</h4>

        {/* Provider toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setVideoMode("youtube")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-colors ${
              videoMode === "youtube"
                ? "border-red-500 bg-red-500/10 text-red-600"
                : "border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            <PlayCircle className="h-3.5 w-3.5" />
            YouTube (unlisted)
          </button>
          <button
            type="button"
            onClick={() => setVideoMode("bunny")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-colors ${
              videoMode === "bunny"
                ? "border-orange-500 bg-orange-500/10 text-orange-600"
                : "border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            <Cloud className="h-3.5 w-3.5" />
            Bunny Stream
          </button>
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        {/* YouTube input */}
        {videoMode === "youtube" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                YouTube Video URL or ID
              </label>
              <input
                value={ytUrl}
                onChange={(e) => handleYtUrlChange(e.target.value)}
                placeholder="https://youtube.com/watch?v=... or video ID"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Preview */}
            {ytId && !ytDone && (
              <div className="rounded-lg border border-border/40 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={youtubeThumbnailUrl(ytId)}
                  alt="YouTube thumbnail"
                  className="w-full h-28 object-cover"
                />
                <div className="px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <PlayCircle className="h-3.5 w-3.5 text-red-500" />
                    <span className="font-mono">{ytId}</span>
                  </div>
                  <span className="text-xs text-emerald-600 font-medium">Valid ✓</span>
                </div>
              </div>
            )}

            {!ytId && ytUrl.length > 3 && (
              <div className="flex items-center gap-1.5 text-xs text-amber-600">
                <AlertCircle className="h-3.5 w-3.5" />
                Could not extract a YouTube video ID from this URL
              </div>
            )}

            {ytDone && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                Saved! Closing...
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => { setOpen(false); reset(); }}
                className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!ytId || ytSaving || ytDone}
                onClick={handleSaveYouTube}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40"
              >
                {ytSaving && <Loader2 className="h-3 w-3 animate-spin" />}
                Save YouTube Video
              </button>
            </div>
          </div>
        )}

        {/* Bunny Stream — placeholder (Phase 3) */}
        {videoMode === "bunny" && (
          <div className="rounded-lg border border-dashed border-orange-400/40 bg-orange-400/5 p-6 text-center">
            <Cloud className="mx-auto h-8 w-8 text-orange-400 mb-2" />
            <p className="text-sm font-medium text-orange-700">Bunny Stream upload</p>
            <p className="text-xs text-muted-foreground mt-1">
              Direct Bunny upload coming in Phase 3.
              <br />Use YouTube (unlisted) for now.
            </p>
            <button
              type="button"
              onClick={() => setVideoMode("youtube")}
              className="mt-3 text-xs font-medium text-primary hover:underline"
            >
              Switch to YouTube →
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── PDF upload step ───────────────────────────────────────────────
  if (step === "upload" && resourceId && selectedType === "PDF") {
    return (
      <div className="rounded-xl border border-border/40 bg-background p-4">
        <h4 className="text-sm font-medium mb-3">Upload PDF</h4>
        <PdfUploader
          resourceId={resourceId}
          courseSlug={courseSlug}
          onSuccess={() => { setOpen(false); reset(); }}
        />
        <button
          onClick={() => { setOpen(false); reset(); }}
          className="mt-2 text-xs text-muted-foreground hover:text-foreground"
        >
          Skip upload for now
        </button>
      </div>
    );
  }

  // ── Meta form ─────────────────────────────────────────────────────
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

        {/* Show video mode hint */}
        {selectedType === "VIDEO" && (
          <div className="flex items-center gap-1.5 rounded-lg bg-primary/5 border border-primary/10 px-3 py-2 text-xs text-muted-foreground">
            <PlayCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
            <span>Supports YouTube unlisted links <span className="text-muted-foreground/60">& Bunny Stream</span></span>
          </div>
        )}

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
            {selectedType === "PDF"
              ? "Next: Upload PDF"
              : selectedType === "VIDEO"
              ? "Next: Add Video"
              : "Add Resource"}
          </button>
        </div>
      </form>
    </div>
  );
}
