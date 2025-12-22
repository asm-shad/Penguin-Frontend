/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface CouponValidationResult {
  isValid: boolean;
  message: string;
  coupon?: {
    id: string;
    code: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
    discountAmount: number;
    maxUses?: number;
    usedCount: number;
    minOrderAmount: number;
  };
  error?: string;
}

export async function validateCoupon(
  code: string,
  orderAmount: number
): Promise<CouponValidationResult> {
  try {
    const response = await serverFetch.post("/coupon/validate", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, orderAmount }),
    });

    const result = await response.json();

    if (result.success && result.data?.isValid) {
      return {
        isValid: true,
        message: result.message || "Coupon applied successfully!",
        coupon: result.data.coupon,
      };
    }

    return {
      isValid: false,
      message: result.message || "Invalid coupon",
      error: result.message,
    };
  } catch (error: any) {
    console.error("Coupon validation error:", error);
    return {
      isValid: false,
      message: error.message || "Failed to validate coupon",
      error: error.message,
    };
  }
}

// export interface CouponValidationResult {
//   isValid: boolean;
//   message: string;
//   coupon?: {
//     id: string;
//     code: string;
//     discountType: "PERCENTAGE" | "FIXED";
//     discountValue: number;
//     discountAmount: number;
//   };
//   error?: string;
// }

// export async function applyCouponToCart(
//   code: string,
//   orderAmount: number
// ): Promise<CouponValidationResult> {
//   try {
//     const result = await validateCoupon({ code, orderAmount });

//     if (result.success && result.data?.isValid) {
//       return {
//         isValid: true,
//         message: "Coupon applied successfully!",
//         coupon: result.data.coupon,
//       };
//     }

//     return {
//       isValid: false,
//       message: result.message || "Invalid coupon",
//       error: result.message,
//     };
//   } catch (error: any) {
//     console.error("Coupon validation error:", error);
//     return {
//       isValid: false,
//       message: error.message || "Failed to validate coupon",
//       error: error.message,
//     };
//   }
// }
