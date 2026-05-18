"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { deleteFromBunny, pdfStoragePath } from "@/lib/bunny-storage";
import {
  createCourseSchema,
  updateCourseSchema,
  createModuleSchema,
  createResourceSchema,
  createPdfResourceSchema,
  saveYouTubeVideoSchema,
  saveBunnyVideoSchema,
} from "@/lib/validators/course";
import { revalidatePath } from "next/cache";

// ── Helpers ───────────────────────────────────────────────────────

async function requireInstructor() {
  const session = await auth();
  if (!session?.user || !["INSTRUCTOR", "SUPER_ADMIN"].includes(session.user.role as string)) {
    throw new Error("UNAUTHORIZED");
  }
  return session.user;
}

function generateSlug(titleEn: string): string {
  return (
    titleEn
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 80) +
    "-" +
    Math.random().toString(36).slice(2, 7)
  );
}

// ── Course Actions ────────────────────────────────────────────────

export async function createCourseAction(formData: FormData) {
  const user = await requireInstructor();

  const raw = {
    titleEn: formData.get("titleEn"),
    titleAr: formData.get("titleAr"),
    descriptionEn: formData.get("descriptionEn") || undefined,
    descriptionAr: formData.get("descriptionAr") || undefined,
    priceEgp: formData.get("priceEgp"),
    billingCycle: formData.get("billingCycle") || "ONE_TIME",
    coverUrl: formData.get("coverUrl") || undefined,
  };

  const parsed = createCourseSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const slug = generateSlug(parsed.data.titleEn);

  const course = await prisma.course.create({
    data: {
      instructorId: user.id as string,
      slug,
      titleEn: parsed.data.titleEn,
      titleAr: parsed.data.titleAr,
      descriptionEn: parsed.data.descriptionEn,
      descriptionAr: parsed.data.descriptionAr,
      priceEgp: parsed.data.priceEgp,
      billingCycle: parsed.data.billingCycle as "ONE_TIME" | "MONTHLY",
      coverUrl: parsed.data.coverUrl || null,
    },
  });

  revalidatePath("/instructor/courses");
  return { success: true, slug: course.slug };
}

export async function updateCourseAction(slug: string, formData: FormData) {
  const user = await requireInstructor();

  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course || course.instructorId !== user.id) {
    return { success: false, error: "NOT_FOUND" };
  }

  const raw = {
    titleEn: formData.get("titleEn") || undefined,
    titleAr: formData.get("titleAr") || undefined,
    descriptionEn: formData.get("descriptionEn") || undefined,
    descriptionAr: formData.get("descriptionAr") || undefined,
    priceEgp: formData.get("priceEgp") || undefined,
    coverUrl: formData.get("coverUrl") || undefined,
  };

  const parsed = updateCourseSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  await prisma.course.update({
    where: { slug },
    data: parsed.data,
  });

  revalidatePath(`/instructor/courses/${slug}`);
  return { success: true };
}

export async function publishCourseAction(slug: string) {
  const user = await requireInstructor();
  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course || course.instructorId !== user.id) {
    return { success: false, error: "NOT_FOUND" };
  }

  const newStatus = course.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
  await prisma.course.update({
    where: { slug },
    data: { status: newStatus },
  });

  revalidatePath(`/instructor/courses`);
  return { success: true, status: newStatus };
}

export async function deleteCourseAction(slug: string) {
  const user = await requireInstructor();
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        include: {
          resources: { include: { pdfResource: true } },
        },
      },
    },
  });
  if (!course || course.instructorId !== user.id) {
    return { success: false, error: "NOT_FOUND" };
  }

  // Delete PDF files from Bunny Storage first
  for (const module of course.modules) {
    for (const resource of module.resources) {
      if (resource.pdfResource) {
        await deleteFromBunny(
          pdfStoragePath(slug, resource.id)
        ).catch(() => {});
      }
    }
  }

  await prisma.course.delete({ where: { slug } });
  revalidatePath("/instructor/courses");
  return { success: true };
}

// ── Module Actions ────────────────────────────────────────────────

export async function createModuleAction(formData: FormData) {
  const user = await requireInstructor();

  const parsed = createModuleSchema.safeParse({
    courseId: formData.get("courseId"),
    titleEn: formData.get("titleEn"),
    titleAr: formData.get("titleAr"),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const course = await prisma.course.findUnique({
    where: { id: parsed.data.courseId },
  });
  if (!course || course.instructorId !== user.id) {
    return { success: false, error: "NOT_FOUND" };
  }

  // Auto-set order to last position
  const lastModule = await prisma.module.findFirst({
    where: { courseId: parsed.data.courseId },
    orderBy: { order: "desc" },
  });
  const order = (lastModule?.order ?? -1) + 1;

  const mod = await prisma.module.create({
    data: {
      courseId: parsed.data.courseId,
      titleEn: parsed.data.titleEn,
      titleAr: parsed.data.titleAr,
      order,
    },
  });

  revalidatePath(`/instructor/courses/${course.slug}`);
  return { success: true, moduleId: mod.id };
}

export async function deleteModuleAction(moduleId: string) {
  const user = await requireInstructor();

  const mod = await prisma.module.findUnique({
    where: { id: moduleId },
    include: {
      course: true,
      resources: { include: { pdfResource: true } },
    },
  });
  if (!mod || mod.course.instructorId !== user.id) {
    return { success: false, error: "NOT_FOUND" };
  }

  // Delete Bunny files
  for (const resource of mod.resources) {
    if (resource.pdfResource) {
      await deleteFromBunny(pdfStoragePath(mod.course.slug, resource.id)).catch(() => {});
    }
  }

  await prisma.module.delete({ where: { id: moduleId } });
  revalidatePath(`/instructor/courses/${mod.course.slug}`);
  return { success: true };
}

export async function reorderModulesAction(
  courseId: string,
  orderedIds: string[]
) {
  const user = await requireInstructor();
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.instructorId !== user.id) {
    return { success: false, error: "NOT_FOUND" };
  }

  await prisma.$transaction(
    orderedIds.map((id, idx) =>
      prisma.module.update({ where: { id }, data: { order: idx } })
    )
  );

  revalidatePath(`/instructor/courses/${course.slug}`);
  return { success: true };
}

// ── Resource Actions ──────────────────────────────────────────────

export async function createResourceAction(formData: FormData) {
  const user = await requireInstructor();

  const parsed = createResourceSchema.safeParse({
    moduleId: formData.get("moduleId"),
    type: formData.get("type"),
    titleEn: formData.get("titleEn"),
    titleAr: formData.get("titleAr"),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const mod = await prisma.module.findUnique({
    where: { id: parsed.data.moduleId },
    include: { course: true },
  });
  if (!mod || mod.course.instructorId !== user.id) {
    return { success: false, error: "NOT_FOUND" };
  }

  const lastResource = await prisma.resource.findFirst({
    where: { moduleId: parsed.data.moduleId },
    orderBy: { order: "desc" },
  });
  const order = (lastResource?.order ?? -1) + 1;

  const resource = await prisma.resource.create({
    data: {
      moduleId: parsed.data.moduleId,
      type: parsed.data.type,
      titleEn: parsed.data.titleEn,
      titleAr: parsed.data.titleAr,
      order,
    },
  });

  revalidatePath(`/instructor/courses/${mod.course.slug}`);
  return { success: true, resourceId: resource.id };
}

export async function savePdfResourceAction(formData: FormData) {
  const user = await requireInstructor();

  const parsed = createPdfResourceSchema.safeParse({
    resourceId: formData.get("resourceId"),
    bunnyFileId: formData.get("bunnyFileId"),
    sizeBytes: formData.get("sizeBytes"),
    pageCount: formData.get("pageCount") || undefined,
    downloadable: formData.get("downloadable") === "true",
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  // Verify ownership via resource → module → course → instructor
  const resource = await prisma.resource.findUnique({
    where: { id: parsed.data.resourceId },
    include: { module: { include: { course: true } } },
  });
  if (!resource || resource.module.course.instructorId !== user.id) {
    return { success: false, error: "NOT_FOUND" };
  }

  await prisma.pdfResource.upsert({
    where: { resourceId: parsed.data.resourceId },
    create: {
      resourceId: parsed.data.resourceId,
      bunnyFileId: parsed.data.bunnyFileId,
      sizeBytes: parsed.data.sizeBytes,
      pageCount: parsed.data.pageCount,
      downloadable: parsed.data.downloadable,
    },
    update: {
      bunnyFileId: parsed.data.bunnyFileId,
      sizeBytes: parsed.data.sizeBytes,
      pageCount: parsed.data.pageCount,
      downloadable: parsed.data.downloadable,
    },
  });

  revalidatePath(`/instructor/courses/${resource.module.course.slug}`);
  return { success: true };
}

export async function deleteResourceAction(resourceId: string) {
  const user = await requireInstructor();

  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    include: {
      pdfResource: true,
      module: { include: { course: true } },
    },
  });
  if (!resource || resource.module.course.instructorId !== user.id) {
    return { success: false, error: "NOT_FOUND" };
  }

  if (resource.pdfResource) {
    await deleteFromBunny(
      pdfStoragePath(resource.module.course.slug, resourceId)
    ).catch(() => {});
  }

  await prisma.resource.delete({ where: { id: resourceId } });
  revalidatePath(`/instructor/courses/${resource.module.course.slug}`);
  return { success: true };
}

// ── Video Resource Actions ─────────────────────────────────────────

/** Save a YouTube (unlisted) video link for a resource. */
export async function saveYouTubeVideoAction(formData: FormData) {
  const user = await requireInstructor();

  const parsed = saveYouTubeVideoSchema.safeParse({
    resourceId: formData.get("resourceId"),
    youtubeVideoId: formData.get("youtubeVideoId"),
    durationSec: formData.get("durationSec") || undefined,
    thumbnailUrl: formData.get("thumbnailUrl") || undefined,
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const resource = await prisma.resource.findUnique({
    where: { id: parsed.data.resourceId },
    include: { module: { include: { course: true } } },
  });
  if (!resource || resource.module.course.instructorId !== user.id) {
    return { success: false, error: "NOT_FOUND" };
  }

  await prisma.videoResource.upsert({
    where: { resourceId: parsed.data.resourceId },
    create: {
      resourceId: parsed.data.resourceId,
      provider: "YOUTUBE",
      youtubeVideoId: parsed.data.youtubeVideoId,
      thumbnailUrl:
        parsed.data.thumbnailUrl ||
        `https://img.youtube.com/vi/${parsed.data.youtubeVideoId}/hqdefault.jpg`,
      durationSec: parsed.data.durationSec,
    },
    update: {
      provider: "YOUTUBE",
      youtubeVideoId: parsed.data.youtubeVideoId,
      thumbnailUrl:
        parsed.data.thumbnailUrl ||
        `https://img.youtube.com/vi/${parsed.data.youtubeVideoId}/hqdefault.jpg`,
      durationSec: parsed.data.durationSec,
      // clear any previous Bunny fields
      bunnyLibraryId: null,
      bunnyVideoId: null,
    },
  });

  revalidatePath(`/instructor/courses/${resource.module.course.slug}`);
  return { success: true };
}

/** Save a Bunny Stream video for a resource. */
export async function saveBunnyVideoAction(formData: FormData) {
  const user = await requireInstructor();

  const parsed = saveBunnyVideoSchema.safeParse({
    resourceId: formData.get("resourceId"),
    bunnyLibraryId: formData.get("bunnyLibraryId"),
    bunnyVideoId: formData.get("bunnyVideoId"),
    durationSec: formData.get("durationSec") || undefined,
    thumbnailUrl: formData.get("thumbnailUrl") || undefined,
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const resource = await prisma.resource.findUnique({
    where: { id: parsed.data.resourceId },
    include: { module: { include: { course: true } } },
  });
  if (!resource || resource.module.course.instructorId !== user.id) {
    return { success: false, error: "NOT_FOUND" };
  }

  await prisma.videoResource.upsert({
    where: { resourceId: parsed.data.resourceId },
    create: {
      resourceId: parsed.data.resourceId,
      provider: "BUNNY",
      bunnyLibraryId: parsed.data.bunnyLibraryId,
      bunnyVideoId: parsed.data.bunnyVideoId,
      thumbnailUrl: parsed.data.thumbnailUrl,
      durationSec: parsed.data.durationSec,
    },
    update: {
      provider: "BUNNY",
      bunnyLibraryId: parsed.data.bunnyLibraryId,
      bunnyVideoId: parsed.data.bunnyVideoId,
      thumbnailUrl: parsed.data.thumbnailUrl,
      durationSec: parsed.data.durationSec,
      // clear any previous YouTube fields
      youtubeVideoId: null,
    },
  });

  revalidatePath(`/instructor/courses/${resource.module.course.slug}`);
  return { success: true };
}
