import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE ?? "";
const STORAGE_API_KEY = process.env.BUNNY_STORAGE_API_KEY ?? "";
const STORAGE_BASE = `https://storage.bunnycdn.com/${STORAGE_ZONE}`;

/**
 * POST /api/bunny/upload-pdf
 * Body: { resourceId, courseSlug, fileName }
 *
 * Returns: { uploadUrl, bunnyFileId }
 *
 * The upload URL is a server-proxy URL — the client sends the file to
 * /api/bunny/upload-pdf?path=... which streams it to Bunny.
 * This avoids exposing the Bunny API key to the browser.
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !["INSTRUCTOR", "SUPER_ADMIN"].includes(session.user.role as string)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { resourceId, courseSlug } = await req.json();
  if (!resourceId || !courseSlug) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const bunnyFileId = `pdfs/${courseSlug}/${resourceId}.pdf`;

  // Return a proxy upload URL — the client will PUT to this endpoint
  const uploadUrl = `/api/bunny/upload-pdf?path=${encodeURIComponent(bunnyFileId)}`;

  return NextResponse.json({ uploadUrl, bunnyFileId });
}

/**
 * PUT /api/bunny/upload-pdf?path=...
 * Streams the client request body directly to Bunny Storage.
 */
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !["INSTRUCTOR", "SUPER_ADMIN"].includes(session.user.role as string)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const path = req.nextUrl.searchParams.get("path");
  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  const res = await fetch(`${STORAGE_BASE}/${path}`, {
    method: "PUT",
    headers: {
      AccessKey: STORAGE_API_KEY,
      "Content-Type": "application/pdf",
    },
    body: req.body,
    // @ts-expect-error - Next.js streaming
    duplex: "half",
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: `Bunny upload failed: ${text}` },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
