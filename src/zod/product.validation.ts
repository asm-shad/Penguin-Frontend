// zod/product.validation.ts
import { ProductStatus } from "@/types/user.interface";
import { z } from "zod";

// IMPORTANT: Use the SAME enum values as backend (Prisma enum)
export const ProductStatusEnum = z.enum([
  "NEW",
  "HOT", 
  "SALE",
  "OUT_OF_STOCK",
  "DISCONTINUED",
]);

// Create product base schema - REMOVE slug from here!
export const createProductValidationSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .min(3, "Product name must be at least 3 characters"),
  description: z.string().optional(),
  price: z
    .number()
    .min(0.01, "Price must be a positive number")
    .positive("Price must be a positive number"),
  discount: z.number().min(0).max(100).default(0),
  status: z.enum(ProductStatus).default("NEW"),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sku: z.string().optional(),
  stock: z.number().int().min(0).default(0),
  brandId: z.string().optional(),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
  variants: z
    .array(
      z.object({
        name: z.string().min(1, "Variant name is required"),
        value: z.string().min(1, "Variant value is required"),
        sku: z.string().optional(),
        price: z.number().positive().optional(),
        stock: z.number().int().min(0).default(0),
        imageUrl: z.string().optional(),
        isActive: z.boolean().default(true),
      })
    )
    .optional(),
//  productImages: z
//         .array(
//             z.instanceof(File)
//         )
//     .optional(),
});

export const updateProductValidationSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .min(3, "Product name must be at least 3 characters")
    .optional(),
  description: z.string().optional(),
  price: z
    .number()
    .min(0.01, "Price must be a positive number")
    .positive("Price must be a positive number")
    .optional(),
  discount: z.number().min(0).max(100).optional(),
  status: z.enum(ProductStatus).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sku: z.string().optional(),
  stock: z.number().int().min(0).optional(),
  brandId: z.string().optional().nullable(),
  categoryIds: z.array(z.string()).optional(),
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1, "Variant name is required"),
        value: z.string().min(1, "Variant value is required"),
        sku: z.string().optional(),
        price: z.number().positive().optional(),
        stock: z.number().int().min(0, "Stock must be 0 or more"),
        imageUrl: z.string().optional(),
        isActive: z.boolean().default(true),
      })
    )
    .optional(),
//   productImages: z
//         .array(
//             z.instanceof(File)
//         )
//     .optional(),
});


// Update product status schema
export const updateProductStatusSchema = z.object({
  status: ProductStatusEnum,
  discount: z.number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%")
    .optional(),
});

// Update product featured status schema
export const updateProductFeaturedSchema = z.object({
  isFeatured: z.boolean(),
});

// Update product stock schema
export const updateProductStockSchema = z.object({
  stock: z.number().int().min(0, "Stock quantity is required"),
  variantId: z.string().optional(),
  reason: z.string().optional(),
});


// Export types
export type CreateProductInput = z.infer<typeof createProductValidationSchema>;
export type UpdateProductInput = z.infer<typeof updateProductValidationSchema>;
export type UpdateProductStatusInput = z.infer<typeof updateProductStatusSchema>;
export type UpdateProductFeaturedInput = z.infer<typeof updateProductFeaturedSchema>;
export type UpdateProductStockInput = z.infer<typeof updateProductStockSchema>;