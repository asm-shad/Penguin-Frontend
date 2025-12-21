import { z } from "zod";

export const createCouponZodSchema = z.object({
  code: z
    .string()
    .min(3, "Coupon code must be at least 3 characters")
    .max(20, "Coupon code must be at most 20 characters")
    .regex(
      /^[A-Z0-9_-]+$/,
      "Coupon code can only contain uppercase letters, numbers, underscores, and hyphens"
    ),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z
    .number()
    .positive("Discount value must be positive")
    .refine((val) => val <= 100, {
      message: "Percentage discount cannot exceed 100%",
      path: ["discountValue"],
    })
    .optional(),
  maxUses: z.number().int().positive().optional(),
  minOrderAmount: z.number().nonnegative().default(0),
  validFrom: z.date().optional(),
  validUntil: z.date().optional(),
  isActive: z.boolean().default(true),
});

// Update coupon schema
export const updateCouponZodSchema = createCouponZodSchema.partial().extend({
  code: z
    .string()
    .min(3, "Coupon code must be at least 3 characters")
    .max(20, "Coupon code must be at most 20 characters")
    .regex(
      /^[A-Z0-9_-]+$/,
      "Coupon code can only contain uppercase letters, numbers, underscores, and hyphens"
    )
    .optional(),
  discountValue: z
    .number()
    .positive("Discount value must be positive")
    .optional(),
});

// Validate coupon schema
export const validateCouponZodSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  orderAmount: z.number().positive("Order amount must be positive"),
});

// Update status schema
export const updateCouponStatusZodSchema = z.object({
  isActive: z.boolean(),
});

export type CreateCouponInput = z.infer<typeof createCouponZodSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponZodSchema>;
export type UpdateCouponStatusInput = z.infer<
  typeof updateCouponStatusZodSchema
>;
export type ValidateCouponInput = z.infer<typeof validateCouponZodSchema>;
