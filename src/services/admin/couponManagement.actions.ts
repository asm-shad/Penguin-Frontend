// services/admin/couponManagement.actions.ts
"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/server-fetch";
import { DiscountType, ICoupon, ICouponValidationResult, ICreateCoupon, IUpdateCoupon } from "@/types/coupon.interface";
import { revalidateTag } from "next/cache";
import { cache } from "react";


// Get all coupons with pagination
export const fetchCoupons = cache(
  async (options?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    isActive?: boolean;
    valid?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    try {
      const queryParams = new URLSearchParams({
        page: (options?.page || 1).toString(),
        limit: (options?.limit || 10).toString(),
        ...(options?.searchTerm && { searchTerm: options.searchTerm }),
        ...(options?.isActive !== undefined && { isActive: options.isActive.toString() }),
        ...(options?.valid !== undefined && { valid: options.valid.toString() }),
        ...(options?.sortBy && { sortBy: options.sortBy }),
        ...(options?.sortOrder && { sortOrder: options.sortOrder }),
      });

      const response = await serverFetch.get(`/coupon?${queryParams}`);

      if (!response.ok) {
        throw new Error("Failed to fetch coupons");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch coupons");
      }

      return {
        success: true,
        data: result.data as ICoupon[],
        meta: result.meta,
      };
    } catch (error: any) {
      console.error("Error fetching coupons:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch coupons",
        data: [],
        meta: { 
          page: options?.page || 1, 
          limit: options?.limit || 10, 
          total: 0, 
          totalPages: 0 
        },
      };
    }
  }
);

// Get single coupon by ID
export const fetchCouponById = async (id: string) => {
  try {
    const response = await serverFetch.get(`/coupon/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch coupon");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch coupon");
    }

    return {
      success: true,
      data: result.data as ICoupon,
    };
  } catch (error: any) {
    console.error("Error fetching coupon:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch coupon",
      data: null,
    };
  }
};

// Create coupon
export async function createCoupon(
  _prevState: any,
  formData: FormData
): Promise<{
  success: boolean;
  message: string;
  data?: any;
  formData?: any;
  errors?: Array<{ field: string; message: string }>;
}> {
  try {
    // Extract form data for potential return in case of error
    const formDataPayload = {
      code: formData.get("code") as string,
      description: formData.get("description") as string,
      discountType: formData.get("discountType") as string,
      discountValue: formData.get("discountValue") as string,
      maxUses: formData.get("maxUses") as string,
      minOrderAmount: formData.get("minOrderAmount") as string,
      validFrom: formData.get("validFrom") as string,
      validUntil: formData.get("validUntil") as string,
      isActive: formData.get("isActive") as string,
    };

    // Basic validation
    const discountValue = parseFloat(formData.get("discountValue") as string);
    if (isNaN(discountValue)) {
      return {
        success: false,
        message: "Discount value must be a valid number",
        formData: formDataPayload,
        errors: [{ field: "discountValue", message: "Must be a valid number" }],
      };
    }

    const couponData: ICreateCoupon = {
      code: formData.get("code") as string,
      description: formData.get("description") as string,
      discountType: formData.get("discountType") as DiscountType,
      discountValue,
      maxUses: formData.get("maxUses")
        ? parseInt(formData.get("maxUses") as string)
        : undefined,
      minOrderAmount: formData.get("minOrderAmount")
        ? parseFloat(formData.get("minOrderAmount") as string)
        : 0,
      validFrom: formData.get("validFrom")
        ? new Date(formData.get("validFrom") as string)
        : new Date(),
      validUntil: formData.get("validUntil")
        ? new Date(formData.get("validUntil") as string)
        : undefined,
      isActive: formData.get("isActive") === "true",
    };

    // Validate discount type
    if (!Object.values(DiscountType).includes(couponData.discountType)) {
      return {
        success: false,
        message: "Invalid discount type",
        formData: formDataPayload,
        errors: [{ field: "discountType", message: "Invalid discount type" }],
      };
    }

    const response = await serverFetch.post("/coupon", {
      body: JSON.stringify(couponData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create coupon");
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message: result.message || "Coupon created successfully",
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.message || "Failed to create coupon",
        formData: formDataPayload,
      };
    }
  } catch (error: any) {
    console.error("Create coupon error:", error);
    return {
      success: false,
      message: error.message || "Failed to create coupon",
      formData: Object.fromEntries(formData.entries()),
    };
  }
}

// Update coupon
export async function updateCoupon(
  _prevState: any,
  formData: FormData
): Promise<{
  success: boolean;
  message: string;
  data?: any;
  formData?: any;
  errors?: Array<{ field: string; message: string }>;
}> {
  try {
    const id = formData.get("id") as string;
    if (!id) {
      throw new Error("Coupon ID is required");
    }

    // Extract form data for potential return in case of error
    const formDataPayload = {
      id,
      code: formData.get("code") as string,
      description: formData.get("description") as string,
      discountType: formData.get("discountType") as string,
      discountValue: formData.get("discountValue") as string,
      maxUses: formData.get("maxUses") as string,
      minOrderAmount: formData.get("minOrderAmount") as string,
      validFrom: formData.get("validFrom") as string,
      validUntil: formData.get("validUntil") as string,
      isActive: formData.get("isActive") as string,
    };

    const couponData: IUpdateCoupon = {
      code: formData.get("code") as string,
      description: formData.get("description") as string,
      discountType: formData.get("discountType") as DiscountType,
      discountValue: formData.get("discountValue")
        ? parseFloat(formData.get("discountValue") as string)
        : undefined,
      maxUses: formData.get("maxUses")
        ? parseInt(formData.get("maxUses") as string)
        : undefined,
      minOrderAmount: formData.get("minOrderAmount")
        ? parseFloat(formData.get("minOrderAmount") as string)
        : undefined,
      validFrom: formData.get("validFrom")
        ? new Date(formData.get("validFrom") as string)
        : undefined,
      validUntil: formData.get("validUntil")
        ? new Date(formData.get("validUntil") as string)
        : undefined,
      isActive: formData.get("isActive")
        ? formData.get("isActive") === "true"
        : undefined,
    };

    // Remove undefined values
    Object.keys(couponData).forEach(
      (key) =>
        couponData[key as keyof IUpdateCoupon] === undefined &&
        delete couponData[key as keyof IUpdateCoupon]
    );

    const response = await serverFetch.patch(`/coupon/${id}`, {
      body: JSON.stringify(couponData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update coupon");
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message: result.message || "Coupon updated successfully",
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.message || "Failed to update coupon",
        formData: formDataPayload,
      };
    }
  } catch (error: any) {
    console.error("Update coupon error:", error);
    return {
      success: false,
      message: error.message || "Failed to update coupon",
      formData: Object.fromEntries(formData.entries()),
    };
  }
}

// Delete coupon
export async function deleteCoupon(id: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const response = await serverFetch.delete(`/coupon/${id}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete coupon");
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message: result.message || "Coupon deleted successfully",
      };
    } else {
      return {
        success: false,
        message: result.message || "Failed to delete coupon",
      };
    }
  } catch (error: any) {
    console.error("Delete coupon error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete coupon",
    };
  }
}

// Toggle coupon status
export async function toggleCouponStatus(
  id: string,
  isActive: boolean
): Promise<{
  success: boolean;
  message: string;
  data?: ICoupon;
}> {
  try {
    const response = await serverFetch.patch(`/coupon/${id}/status`, {
      body: JSON.stringify({ isActive }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update coupon status");
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message: result.message || "Coupon status updated successfully",
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.message || "Failed to update coupon status",
      };
    }
  } catch (error: any) {
    console.error("Toggle coupon status error:", error);
    return {
      success: false,
      message: error.message || "Failed to update coupon status",
    };
  }
}

// Validate coupon
export async function validateCoupon(
  code: string,
  orderAmount: number
): Promise<{
  success: boolean;
  message: string;
  data?: ICouponValidationResult;
}> {
  try {
    const response = await serverFetch.post("/coupon/validate", {
      body: JSON.stringify({ code, orderAmount }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to validate coupon");
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message: result.message || "Coupon validated successfully",
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.message || "Invalid coupon",
      };
    }
  } catch (error: any) {
    console.error("Validate coupon error:", error);
    return {
      success: false,
      message: error.message || "Failed to validate coupon",
    };
  }
}