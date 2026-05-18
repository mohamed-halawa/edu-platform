"use client";

import { useState, useCallback } from "react";
import { Upload, CheckCircle2, Loader2, X, FileText } from "lucide-react";
import { savePdfResourceAction } from "@/lib/course-actions";

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

interface PdfUploaderProps {
  resourceId: string;
  courseSlug: string;
  onSuccess?: () => void;
}

export function PdfUploader({ resourceId, courseSlug, onSuccess }: PdfUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "saving" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = useCallback((f: File) => {
    if (f.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }
    if (f.size > MAX_SIZE_BYTES) {
      setError("File must be smaller than 50 MB");
      return;
    }
    setFile(f);
    setError(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    setError(null);

    try {
      // 1. Get a presigned upload path from our API
      const metaRes = await fetch("/api/bunny/upload-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId, courseSlug, fileName: file.name }),
      });

      if (!metaRes.ok) {
        throw new Error(`Failed to get upload URL: ${metaRes.status}`);
      }

      const { uploadUrl, bunnyFileId } = await metaRes.json();

      // 2. PUT the file directly to Bunny Storage
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader("Content-Type", "application/pdf");
      xhr.setRequestHeader("AccessKey", ""); // Key is set server-side via proxy

      await new Promise<void>((resolve, reject) => {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`));
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(file);
      });

      // 3. Save metadata to DB via server action
      setStatus("saving");
      const fd = new FormData();
      fd.set("resourceId", resourceId);
      fd.set("bunnyFileId", bunnyFileId);
      fd.set("sizeBytes", String(file.size));
      fd.set("downloadable", "false");

      const saveRes = await savePdfResourceAction(fd);
      if (!saveRes.success) throw new Error(saveRes.error);

      setStatus("done");
      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  if (status === "done") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-emerald-600">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <span className="text-sm font-medium">PDF uploaded successfully</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer ${
          isDragOver
            ? "border-primary bg-primary/5"
            : file
              ? "border-emerald-500/40 bg-emerald-500/5"
              : "border-border/60 hover:border-primary/40 hover:bg-accent/30"
        }`}
        onClick={() => document.getElementById("pdf-file-input")?.click()}
      >
        <input
          id="pdf-file-input"
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className="h-8 w-8 text-emerald-500" />
            <div className="text-start">
              <div className="text-sm font-medium">{file.name}</div>
              <div className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setProgress(0);
                setStatus("idle");
              }}
              className="ms-auto text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">
              Drag & drop a PDF or{" "}
              <span className="text-primary">click to browse</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">PDF only • Max 50 MB</p>
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      {/* Progress */}
      {status === "uploading" && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-border/40 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {status === "saving" && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Saving...
        </div>
      )}

      {/* Upload Button */}
      {file && status === "idle" && (
        <button
          type="button"
          onClick={handleUpload}
          className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:brightness-110"
        >
          Upload PDF
        </button>
      )}
    </div>
  );
}
