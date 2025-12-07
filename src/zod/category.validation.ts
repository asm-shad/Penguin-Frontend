// zod/category.validation.ts
import { z } from "zod";

export const createCategoryZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

export const updateCategoryZodSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isFeatured: z.boolean().optional(),
});