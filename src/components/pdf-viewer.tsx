"use client";

import { useEffect, useState } from "react";
import { Loader2, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Use the bundled worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  resourceId: string;
  downloadable?: boolean;
  title?: string;
}

export function PdfViewer({ resourceId, downloadable = false, title }: PdfViewerProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageError, setPageError] = useState(false);

  // Fetch signed URL
  useEffect(() => {
    fetch(`/api/bunny/sign?resourceId=${resourceId}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Access denied");
        }
        return res.json();
      })
      .then(({ url }) => setUrl(url))
      .catch((err) => setLoadError(err.message));
  }, [resourceId]);

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-12 text-center">
        <p className="text-destructive font-medium">{loadError}</p>
        {loadError === "No active subscription" && (
          <p className="mt-2 text-sm text-muted-foreground">
            Subscribe to this course to access the materials.
          </p>
        )}
      </div>
    );
  }

  if (!url) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-border/40 bg-card p-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Toolbar */}
      <div className="w-full flex items-center justify-between rounded-xl border border-border/40 bg-card px-4 py-2.5">
        <span className="text-sm font-medium truncate max-w-xs">{title}</span>
        <div className="flex items-center gap-3">
          {/* Page Navigation */}
          {numPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-muted-foreground">
                {currentPage} / {numPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                disabled={currentPage === numPages}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Download */}
          {downloadable && (
            <a
              href={url}
              download
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </a>
          )}
        </div>
      </div>

      {/* PDF Document */}
      <div className="w-full rounded-2xl border border-border/40 bg-card overflow-hidden">
        {pageError ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            Failed to load PDF. Please try refreshing.
          </div>
        ) : (
          <Document
            file={url}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={() => setPageError(true)}
            className="flex justify-center py-6"
            loading={
              <div className="flex justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            }
          >
            <Page
              pageNumber={currentPage}
              renderTextLayer
              renderAnnotationLayer
              className="shadow-xl shadow-black/10"
              width={Math.min(typeof window !== "undefined" ? window.innerWidth - 80 : 800, 800)}
            />
          </Document>
        )}
      </div>
    </div>
  );
}
