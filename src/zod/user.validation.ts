// zod/user.validation.ts
import { z } from "zod";

// Gender enum
export const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);

// Base user schema (for staff/admin creation - no address)
export const createStaffBaseSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  gender: GenderEnum.optional(),
});

// Admin creation schema - make role optional with default
export const createAdminSchema = createStaffBaseSchema.extend({
  role: z.literal("ADMIN").optional().default("ADMIN"),
});

// Product Manager creation schema
export const createProductManagerSchema = createStaffBaseSchema.extend({
  role: z.literal("PRODUCT_MANAGER").optional().default("PRODUCT_MANAGER"),
});

// Customer Support creation schema
export const createCustomerSupportSchema = createStaffBaseSchema.extend({
  role: z.literal("CUSTOMER_SUPPORT").optional().default("CUSTOMER_SUPPORT"),
});

// Regular user creation schema (with address)
export const addressSchema = z.object({
  addressLine: z.string().min(1, "Address line is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().optional().default("US"),
});

export const userAddressSchema = z.object({
  addressName: z.string().min(1, "Address name is required"),
  email: z.email("Invalid email format").optional(),
  isDefault: z.boolean().default(false),
});

export const createRegularUserSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  gender: GenderEnum.optional(),
  address: addressSchema,
  userAddress: userAddressSchema,
  role: z.literal("USER").optional().default("USER"),
});

// Update user status schema
export const updateUserStatusSchema = z.object({
  userStatus: z.enum(["ACTIVE", "INACTIVE", "DELETED"]),
});

// Update profile schema
export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  gender: GenderEnum.optional(),
});

// Type inference from schemas
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type CreateProductManagerInput = z.infer<typeof createProductManagerSchema>;
export type CreateCustomerSupportInput = z.infer<typeof createCustomerSupportSchema>;
export type CreateRegularUserInput = z.infer<typeof createRegularUserSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;