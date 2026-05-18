import { z } from "zod";

// ── Course ────────────────────────────────────────────────────────
export const createCourseSchema = z.object({
  titleEn: z.string().min(3, "Title must be at least 3 characters").max(120),
  titleAr: z.string().min(3, "يجب أن يكون العنوان 3 أحرف على الأقل").max(120),
  descriptionEn: z.string().max(2000).optional(),
  descriptionAr: z.string().max(2000).optional(),
  priceEgp: z.coerce.number().min(0, "Price must be non-negative"),
  billingCycle: z.enum(["ONE_TIME", "MONTHLY"]).default("ONE_TIME"),
  coverUrl: z.string().url().optional().or(z.literal("")),
});

export const updateCourseSchema = createCourseSchema.partial();

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;

// ── Module ────────────────────────────────────────────────────────
export const createModuleSchema = z.object({
  courseId: z.string().cuid(),
  titleEn: z.string().min(1).max(120),
  titleAr: z.string().min(1).max(120),
  order: z.coerce.number().int().min(0).optional(),
});

export const updateModuleSchema = createModuleSchema.omit({ courseId: true }).partial();

export type CreateModuleInput = z.infer<typeof createModuleSchema>;
export type UpdateModuleInput = z.infer<typeof updateModuleSchema>;

// ── Resource ──────────────────────────────────────────────────────
export const createResourceSchema = z.object({
  moduleId: z.string().cuid(),
  type: z.enum(["PDF", "VIDEO", "EXAM"]),
  titleEn: z.string().min(1).max(120),
  titleAr: z.string().min(1).max(120),
  order: z.coerce.number().int().min(0).optional(),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;

// ── PDF Resource ──────────────────────────────────────────────────
export const createPdfResourceSchema = z.object({
  resourceId: z.string().cuid(),
  bunnyFileId: z.string().min(1),
  sizeBytes: z.coerce.number().int().positive(),
  pageCount: z.coerce.number().int().positive().optional(),
  downloadable: z.boolean().default(false),
});

export type CreatePdfResourceInput = z.infer<typeof createPdfResourceSchema>;

// ── Video Resource ─────────────────────────────────────────────────

/** Save a YouTube video resource (provider = YOUTUBE) */
export const saveYouTubeVideoSchema = z.object({
  resourceId: z.string().cuid(),
  youtubeVideoId: z
    .string()
    .regex(/^[\w-]{11}$/, "Invalid YouTube video ID"),
  durationSec: z.coerce.number().int().positive().optional(),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
});

/** Save a Bunny Stream video resource (provider = BUNNY) */
export const saveBunnyVideoSchema = z.object({
  resourceId: z.string().cuid(),
  bunnyLibraryId: z.string().min(1),
  bunnyVideoId: z.string().min(1),
  durationSec: z.coerce.number().int().positive().optional(),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
});

export type SaveYouTubeVideoInput = z.infer<typeof saveYouTubeVideoSchema>;
export type SaveBunnyVideoInput = z.infer<typeof saveBunnyVideoSchema>;
