/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { ICategory, IProduct } from "@/types/product.interface";
import { cache } from "react";

// Server-side function to fetch products
export const fetchProducts = cache(async (category?: string) => {
  try {
    const url = category
      ? `/products?category=${encodeURIComponent(category)}&isActive=true`
      : "/products?isActive=true";

    const res = await serverFetch.get(url);

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch products");
    }

    return {
      success: true,
      data: result.data as IProduct[],
    };
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch products",
      data: [],
    };
  }
});

// Server-side function to fetch categories
export const fetchCategories = cache(async () => {
  try {
    const res = await serverFetch.get("/category?isFeatured=true");

    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.statusText}`);
    }

    const result = await res.json();
    console.log("API Result:", result);

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch categories");
    }

    return {
      success: true,
      data: result.data as ICategory[],
    };
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch categories",
      data: [],
    };
  }
});

// Fetch product by slug
export const fetchProductBySlug = cache(async (slug: string) => {
  try {
    const res = await serverFetch.get(`/products/slug/${slug}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch product: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch product");
    }

    return {
      success: true,
      data: result.data as IProduct,
    };
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch product",
      data: null,
    };
  }
});
