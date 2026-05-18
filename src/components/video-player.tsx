"use client";

import { useState } from "react";
import { Play, AlertCircle } from "lucide-react";
import { youtubeEmbedUrl } from "@/lib/youtube";

type VideoPlayerProps =
  | {
      provider: "YOUTUBE";
      youtubeVideoId: string;
      title?: string;
      thumbnailUrl?: string | null;
    }
  | {
      provider: "BUNNY";
      bunnyLibraryId: string;
      bunnyVideoId: string;
      title?: string;
      thumbnailUrl?: string | null;
    };

export function VideoPlayer(props: VideoPlayerProps) {
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(false);

  const thumbnail = props.thumbnailUrl ?? null;
  const title = props.title ?? "Video";

  // Build embed URL based on provider
  const embedUrl =
    props.provider === "YOUTUBE"
      ? youtubeEmbedUrl(props.youtubeVideoId) + "&autoplay=1"
      : `https://iframe.mediadelivery.net/embed/${props.bunnyLibraryId}/${props.bunnyVideoId}?autoplay=true&preload=true`;

  const providerLabel =
    props.provider === "YOUTUBE" ? "YouTube" : "Bunny Stream";

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-12 text-center aspect-video">
        <AlertCircle className="h-10 w-10 text-destructive mb-3" />
        <p className="font-medium text-destructive">Failed to load video</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The video could not be played. Try refreshing the page.
        </p>
      </div>
    );
  }

  // Clickable thumbnail → load iframe on click (avoids heavy iframe load on mount)
  if (!started) {
    return (
      <div
        className="relative cursor-pointer rounded-2xl overflow-hidden bg-black aspect-video group"
        onClick={() => setStarted(true)}
        role="button"
        tabIndex={0}
        aria-label={`Play ${title}`}
        onKeyDown={(e) => e.key === "Enter" && setStarted(true)}
      >
        {/* Thumbnail */}
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-violet-600/30" />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

        {/* Play button */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-2xl transition-transform duration-200 group-hover:scale-110">
            <Play className="h-7 w-7 text-primary fill-primary ms-1" />
          </div>
          <span className="rounded-full bg-black/50 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
            {providerLabel}
          </span>
        </div>

        {/* Title bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
          <p className="text-white text-sm font-medium truncate">{title}</p>
        </div>
      </div>
    );
  }

  // Active iframe
  return (
    <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-2xl shadow-black/30">
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
        onError={() => setError(true)}
      />
    </div>
  );
}
