/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { ICategory } from "@/types/product.interface";
import { cache } from "react";

// Server-side function to fetch featured categories WITH product counts
export const fetchFeaturedCategoriesWithCounts = cache(async () => {
  try {
    // Use the correct endpoint for featured categories with counts
    const res = await serverFetch.get("/category/featured");

    if (!res.ok) {
      throw new Error(`Failed to fetch featured categories: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch featured categories");
    }

    return {
      success: true,
      data: result.data as ICategory[],
    };
  } catch (error: any) {
    console.error("Error fetching featured categories:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch featured categories",
      data: [],
    };
  }
});
