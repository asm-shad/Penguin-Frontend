/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { IBrand } from "@/types/product.interface";
import { cache } from "react";

// Fetch popular brands (with product counts)
export const fetchPopularBrands = cache(async () => {
  try {
    const res = await serverFetch.get("/brand/popular");

    if (!res.ok) {
      throw new Error(`Failed to fetch popular brands: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch popular brands");
    }

    return {
      success: true,
      data: result.data as (IBrand & { _count?: { products: number } })[],
    };
  } catch (error: any) {
    console.error("Error fetching popular brands:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch popular brands",
      data: [],
    };
  }
});

// Fetch all brands (for shop page)
export const fetchAllBrands = cache(
  async (options?: {
    searchTerm?: string;
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    try {
      const queryParams = new URLSearchParams();

      if (options?.searchTerm)
        queryParams.append("searchTerm", options.searchTerm);
      if (options?.limit) queryParams.append("limit", options.limit.toString());
      if (options?.page) queryParams.append("page", options.page.toString());
      if (options?.sortBy) queryParams.append("sortBy", options.sortBy);
      if (options?.sortOrder)
        queryParams.append("sortOrder", options.sortOrder);

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/brand?${queryString}` : "/brand";

      const res = await serverFetch.get(endpoint);

      if (!res.ok) {
        throw new Error(`Failed to fetch brands: ${res.statusText}`);
      }

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch brands");
      }

      return {
        success: true,
        data: result.data as IBrand[],
        meta: result.meta, // Make sure your API returns meta info
      };
    } catch (error: any) {
      console.error("Error fetching brands:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch brands",
        data: [],
      };
    }
  }
);

// Fetch brand by slug
export const fetchBrandBySlug = cache(async (slug: string) => {
  try {
    const res = await serverFetch.get(`/brand/slug/${slug}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch brand: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch brand");
    }

    return {
      success: true,
      data: result.data as IBrand,
    };
  } catch (error: any) {
    console.error("Error fetching brand:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch brand",
      data: null,
    };
  }
});
