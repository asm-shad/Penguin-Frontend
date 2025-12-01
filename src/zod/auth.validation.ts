import { z } from "zod";

// Address validation schema
const addressSchema = z.object({
  addressLine: z.string().min(1, "Address line is required!"),
  city: z.string().min(1, "City is required!"),
  state: z.string().min(1, "State is required!"),
  zipCode: z.string().min(1, "Zip code is required!"),
  country: z.string().optional().default("US"),
});

// User address validation schema - UPDATED
const userAddressSchema = z.object({
  addressName: z.string().min(1, "Address name is required!"),
  email: z.email("Invalid email format").optional(),
  // Accept string and convert to boolean
  isDefault: z.preprocess((val) => {
    if (val === "true" || val === "1" || val === true) {
      return true;
    }
    if (val === "false" || val === "0" || val === false) {
      return false;
    }
    return val;
  }, z.boolean().default(false)),
});

export const registerUserValidationZodSchema = z
  .object({
    name: z.string().min(1, "Name is required!"),
    email: z.email("Invalid email format"),
    phone: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    address: addressSchema,
    userAddress: userAddressSchema, // This now accepts strings and converts to boolean
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginValidationZodSchema = z.object({
  email: z.email("Invalid email format"), // Keep using z.email() directly
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .max(100, {
      message: "Password must be at most 100 characters",
    }),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
