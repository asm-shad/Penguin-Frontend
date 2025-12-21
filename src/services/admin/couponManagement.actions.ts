/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

// Simple FormData to JSON converter
function formDataToJSON(formData: FormData) {
  const data: any = {};

  formData.forEach((value, key) => {
    if (key === "isActive") {
      data[key] = value === "true";
    } else if (key === "discountValue" || key === "minOrderAmount") {
      const num = parseFloat(value.toString());
      if (!isNaN(num)) data[key] = num;
    } else if (key === "maxUses") {
      const num = parseInt(value.toString());
      if (!isNaN(num)) data[key] = num > 0 ? num : undefined;
    } else if (key === "validFrom" || key === "validUntil") {
      if (value && value.toString().trim()) {
        const date = new Date(value.toString());
        if (!isNaN(date.getTime())) data[key] = date;
      }
    } else if (value && value.toString().trim()) {
      data[key] = value.toString().trim();
    }
  });

  // Convert FIXED_AMOUNT to FIXED for backend
  if (data.discountType === "FIXED_AMOUNT") {
    data.discountType = "FIXED";
  }

  return data;
}

// For useActionState - takes FormData
export async function createCoupon(_prevState: any, formData: FormData) {
  try {
    const couponData = formDataToJSON(formData);

    // Set defaults
    if (couponData.minOrderAmount === undefined) couponData.minOrderAmount = 0;
    if (couponData.isActive === undefined) couponData.isActive = true;

    // Ensure required fields exist
    if (
      !couponData.code ||
      !couponData.discountType ||
      !couponData.discountValue
    ) {
      return {
        success: false,
        message: "Missing required fields",
        errors: [],
      };
    }

    const response = await serverFetch.post("/coupon", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(couponData),
    });

    const result = await response.json();

    if (result.success) {
      revalidateTag("coupons-list", { expire: 0 });
      revalidateTag("active-coupons", { expire: 0 });
    }

    return result;
  } catch (error: any) {
    console.error("Create coupon error:", error);
    return {
      success: false,
      message: error.message || "Failed to create coupon",
      errors: [],
    };
  }
}

// For useActionState - update coupon with FormData
export async function updateCoupon(
  id: string,
  _prevState: any,
  formData: FormData
) {
  try {
    const couponData = formDataToJSON(formData);

    // Remove empty or undefined values
    Object.keys(couponData).forEach((key) => {
      if (couponData[key] === undefined || couponData[key] === null) {
        delete couponData[key];
      }
    });

    // Don't send code for update (shouldn't change)
    if (couponData.code) {
      delete couponData.code;
    }

    const response = await serverFetch.patch(`/coupon/${id}`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(couponData),
    });

    const result = await response.json();

    if (result.success) {
      revalidateTag("coupons-list", { expire: 0 });
      revalidateTag(`coupon-${id}`, { expire: 0 });
      revalidateTag("active-coupons", { expire: 0 });
    }

    return result;
  } catch (error: any) {
    console.error("Update coupon error:", error);
    return {
      success: false,
      message: error.message || "Failed to update coupon",
      errors: [],
    };
  }
}

// Simple get all coupons
export async function getCoupons(queryParams?: {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isActive?: boolean;
  valid?: boolean;
}) {
  try {
    const query = new URLSearchParams();

    if (queryParams?.searchTerm)
      query.append("searchTerm", queryParams.searchTerm);
    if (queryParams?.page) query.append("page", queryParams.page.toString());
    if (queryParams?.limit) query.append("limit", queryParams.limit.toString());
    if (queryParams?.sortBy) query.append("sortBy", queryParams.sortBy);
    if (queryParams?.sortOrder)
      query.append("sortOrder", queryParams.sortOrder);
    if (queryParams?.isActive !== undefined)
      query.append("isActive", queryParams.isActive.toString());
    if (queryParams?.valid !== undefined)
      query.append("valid", queryParams.valid.toString());

    const queryString = query.toString();

    const response = await serverFetch.get(
      `/coupon${queryString ? `?${queryString}` : ""}`,
      {
        next: {
          tags: ["coupons-list"],
          revalidate: 300,
        },
      }
    );

    return await response.json();
  } catch (error: any) {
    console.error("Get coupons error:", error);
    return {
      success: false,
      message: error.message || "Failed to get coupons",
      data: [],
      meta: {},
    };
  }
}

// Simple delete coupon
export async function deleteCoupon(id: string) {
  try {
    const response = await serverFetch.delete(`/coupon/${id}`);
    const result = await response.json();

    if (result.success) {
      revalidateTag("coupons-list", { expire: 0 });
      revalidateTag(`coupon-${id}`, { expire: 0 });
      revalidateTag("active-coupons", { expire: 0 });
    }

    return result;
  } catch (error: any) {
    console.error("Delete coupon error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete coupon",
    };
  }
}

// Simple toggle status
export async function toggleCouponStatus(id: string, isActive: boolean) {
  try {
    console.log("Toggle coupon status called:", { id, isActive });

    const response = await serverFetch.patch(`/coupon/${id}/status`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ isActive }),
    });

    console.log("Toggle response status:", response.status);

    // Check if response has body
    const responseText = await response.text();
    console.log("Toggle response text:", responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      result = { success: false, message: "Invalid JSON response" };
    }

    console.log("Toggle parsed result:", result);

    if (result.success) {
      revalidateTag("coupons-list", { expire: 0 });
      revalidateTag(`coupon-${id}`, { expire: 0 });
      revalidateTag("active-coupons", { expire: 0 });
    }

    return result;
  } catch (error: any) {
    console.error("Toggle coupon status error:", error);
    return {
      success: false,
      message: error.message || "Failed to update coupon status",
    };
  }
}

export async function updateCouponStatus(id: string, isActive: boolean) {
  try {
    const response = await serverFetch.patch(`/coupon/${id}`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });

    const result = await response.json();

    if (result.success) {
      revalidateTag("coupons-list", { expire: 0 });
      revalidateTag(`coupon-${id}`, { expire: 0 });
      revalidateTag("active-coupons", { expire: 0 });
    }

    return result;
  } catch (error: any) {
    console.error("Update coupon status error:", error);
    return {
      success: false,
      message: error.message || "Failed to update coupon status",
    };
  }
}
