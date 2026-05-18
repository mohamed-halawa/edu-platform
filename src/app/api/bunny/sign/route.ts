import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateSignedUrl } from "@/lib/bunny-storage";

/**
 * GET /api/bunny/sign?resourceId=...
 *
 * Verifies the student has an active subscription to the course
 * that contains this resource, then returns a signed CDN URL.
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resourceId = req.nextUrl.searchParams.get("resourceId");
  if (!resourceId) {
    return NextResponse.json({ error: "Missing resourceId" }, { status: 400 });
  }

  // Fetch resource to get the course + pdf path
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    include: {
      pdfResource: true,
      module: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!resource || !resource.pdfResource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  const courseId = resource.module.course.id;
  const instructorId = resource.module.course.instructorId;

  // Instructors and admins can always access
  const role = session.user.role as string;
  const userId = session.user.id as string;
  const isInstructor = role === "SUPER_ADMIN" || userId === instructorId;

  if (!isInstructor) {
    // Check for active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        studentId: userId,
        courseId,
        status: "ACTIVE",
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "No active subscription" },
        { status: 403 }
      );
    }
  }

  // Generate signed URL (1 hour TTL)
  const filePath = resource.pdfResource.bunnyFileId;
  const signedUrl = generateSignedUrl(filePath, 3600);

  return NextResponse.json({
    url: signedUrl,
    downloadable: resource.pdfResource.downloadable,
  });
}
