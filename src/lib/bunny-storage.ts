/**
 * Bunny Storage helpers
 * Docs: https://docs.bunny.net/reference/storage-api
 * Token Auth: https://docs.bunny.net/docs/cdn-token-authentication
 */

import { createHash } from "crypto";

const STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE ?? "";
const STORAGE_API_KEY = process.env.BUNNY_STORAGE_API_KEY ?? "";
const CDN_HOSTNAME = process.env.BUNNY_CDN_HOSTNAME ?? ""; // e.g. myzone.b-cdn.net
const STORAGE_BASE = `https://storage.bunnycdn.com/${STORAGE_ZONE}`;

// ── Upload / Delete ───────────────────────────────────────────────

/** Upload a Buffer directly to Bunny Storage (used server-side / in API routes). */
export async function uploadToBunny(
  path: string,
  body: Buffer,
  contentType = "application/pdf"
): Promise<void> {
  const res = await fetch(`${STORAGE_BASE}/${path}`, {
    method: "PUT",
    headers: {
      AccessKey: STORAGE_API_KEY,
      "Content-Type": contentType,
    },
    body: body as BodyInit,
  });
  if (!res.ok) {
    throw new Error(`Bunny upload failed [${res.status}]: ${await res.text()}`);
  }
}

/** Delete a file from Bunny Storage. Silently ignores 404. */
export async function deleteFromBunny(path: string): Promise<void> {
  const res = await fetch(`${STORAGE_BASE}/${path}`, {
    method: "DELETE",
    headers: { AccessKey: STORAGE_API_KEY },
  });
  if (!res.ok && res.status !== 404) {
    throw new Error(`Bunny delete failed [${res.status}]`);
  }
}

// ── Signed URL ────────────────────────────────────────────────────

/**
 * Generate a Bunny CDN signed URL (Token Authentication).
 * Token = base64url( SHA256( securityKey + "/" + filePath + expiry ) )
 * TTL defaults to 1 hour.
 */
export function generateSignedUrl(filePath: string, ttlSeconds = 3600): string {
  const expiry = Math.floor(Date.now() / 1000) + ttlSeconds;
  const hashInput = `${STORAGE_API_KEY}/${filePath}${expiry}`;
  const token = createHash("sha256")
    .update(hashInput)
    .digest("base64url");

  return `https://${CDN_HOSTNAME}/${filePath}?token=${token}&expires=${expiry}`;
}

// ── Path Helpers ──────────────────────────────────────────────────

/** Deterministic storage path: pdfs/{courseSlug}/{resourceId}.pdf */
export function pdfStoragePath(courseSlug: string, resourceId: string): string {
  return `pdfs/${courseSlug}/${resourceId}.pdf`;
}
