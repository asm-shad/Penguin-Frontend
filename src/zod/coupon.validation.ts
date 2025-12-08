// validations/coupon.validation.ts
import { z } from "zod";

export const createCouponSchema = z.object({
  code: z.string().min(3, "Coupon code must be at least 3 characters"),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"] as const),
  discountValue: z.number().positive("Discount value must be positive"),
  maxUses: z.number().int().positive().optional(),
  minOrderAmount: z.number().min(0).default(0),
  validFrom: z.string().optional().transform((val) => val ? new Date(val) : new Date()),
  validUntil: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  isActive: z.boolean().default(true),
});

export const updateCouponSchema = createCouponSchema.partial();

export const updateCouponStatusSchema = z.object({
  isActive: z.boolean(),
});

export const validateCouponSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  orderAmount: z.number().positive("Order amount must be positive"),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
export type UpdateCouponStatusInput = z.infer<typeof updateCouponStatusSchema>;
export type ValidateCouponInput = z.infer<typeof validateCouponSchema>;