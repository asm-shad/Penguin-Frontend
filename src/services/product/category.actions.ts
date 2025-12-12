/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { ICategory } from "@/types/product.interface";

// Server-side function to fetch all categories with filtering and pagination
export const fetchCategories =
  async (options?: {
    searchTerm?: string;
    isFeatured?: boolean;
    hasProducts?: boolean;
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    try {
      const queryParams = new URLSearchParams();

      if (options?.searchTerm)
        queryParams.append("searchTerm", options.searchTerm);
      if (options?.isFeatured !== undefined)
        queryParams.append("isFeatured", options.isFeatured.toString());
      if (options?.hasProducts !== undefined)
        queryParams.append("hasProducts", options.hasProducts.toString());
      if (options?.limit) queryParams.append("limit", options.limit.toString());
      if (options?.page) queryParams.append("page", options.page.toString());
      if (options?.sortBy) queryParams.append("sortBy", options.sortBy);
      if (options?.sortOrder)
        queryParams.append("sortOrder", options.sortOrder);

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/category?${queryString}` : "/category";

      const res = await serverFetch.get(endpoint);

      if (!res.ok) {
        throw new Error(`Failed to fetch categories: ${res.statusText}`);
      }

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch categories");
      }

      return {
        success: true,
        data: result.data as ICategory[],
        meta: result.meta,
      };
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch categories",
        data: [],
      };
    }
  }

// Server-side function to fetch featured categories WITH product counts
export const fetchFeaturedCategories = async (limit?: number) => {
  try {
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append("limit", limit.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/category/featured?${queryString}`
      : "/category/featured";

    const res = await serverFetch.get(endpoint);

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
}

// Server-side function to fetch category by slug
export const fetchCategoryBySlug = async (slug: string) => {
  try {
    const res = await serverFetch.get(`/category/slug/${slug}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch category: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch category");
    }

    return {
      success: true,
      data: result.data as ICategory,
    };
  } catch (error: any) {
    console.error("Error fetching category by slug:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch category",
      data: null,
    };
  }
}

// Server-side function to fetch category by ID
export const fetchCategoryById = async (id: string) => {
  try {
    const res = await serverFetch.get(`/category/${id}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch category: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch category");
    }

    return {
      success: true,
      data: result.data as ICategory,
    };
  } catch (error: any) {
    console.error("Error fetching category by ID:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch category",
      data: null,
    };
  }
}

