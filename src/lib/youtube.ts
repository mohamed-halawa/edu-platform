/**
 * YouTube URL utilities
 *
 * Extracts a YouTube video ID from any of these formats:
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 *   https://www.youtube.com/embed/VIDEO_ID
 *   https://www.youtube.com/shorts/VIDEO_ID
 *   VIDEO_ID  (bare ID, 11 chars)
 */
export function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();

  // Bare 11-char video ID
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);

    // youtu.be/ID
    if (url.hostname === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0];
      return id.length === 11 ? id : null;
    }

    // youtube.com/watch?v=ID
    if (url.hostname.includes("youtube.com")) {
      // /watch?v=
      const v = url.searchParams.get("v");
      if (v && v.length === 11) return v;

      // /embed/ID or /shorts/ID or /v/ID
      const parts = url.pathname.split("/").filter(Boolean);
      const idx = parts.findIndex((p) =>
        ["embed", "shorts", "v"].includes(p)
      );
      if (idx !== -1 && parts[idx + 1]?.length === 11) return parts[idx + 1];
    }
  } catch {
    // not a valid URL — already handled bare ID above
  }

  return null;
}

/** Build the embed URL for a YouTube video ID */
export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`;
}

/** Build the thumbnail URL for a YouTube video ID (hqdefault) */
export function youtubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
