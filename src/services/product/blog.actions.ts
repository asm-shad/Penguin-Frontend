/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import {
  IBlogCategory,
  IBlogPost,
  IBlogPostFilters,
} from "@/types/blog.interface";

// Fetch all blog posts (with pagination and filters)
export const fetchBlogPosts = async (filters?: IBlogPostFilters) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();

    if (filters?.searchTerm)
      queryParams.append("searchTerm", filters.searchTerm);
    if (filters?.categoryId)
      queryParams.append("categoryId", filters.categoryId);
    if (filters?.categorySlug)
      queryParams.append("categorySlug", filters.categorySlug);
    if (filters?.isFeatured !== undefined)
      queryParams.append("isFeatured", filters.isFeatured.toString());
    if (filters?.isLatest !== undefined)
      queryParams.append("isLatest", filters.isLatest.toString());
    if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
    if (filters?.page) queryParams.append("page", filters.page.toString());
    if (filters?.limit) queryParams.append("limit", filters.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/blog-post?${queryString}` : "/blog-post";

    const res = await serverFetch.get(endpoint);

    if (!res.ok) {
      throw new Error(`Failed to fetch blog posts: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch blog posts");
    }

    return {
      success: true,
      data: result.data as IBlogPost[],
      meta: result.meta,
    };
  } catch (error: any) {
    console.error("Error fetching blog posts:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch blog posts",
      data: [],
      meta: undefined,
    };
  }
}

// Fetch latest blog posts
export const fetchLatestBlogPosts = async (limit: number = 5) => {
  try {
    const res = await serverFetch.get(`/blog-post/latest?limit=${limit}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch latest blog posts: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch latest blog posts");
    }

    return {
      success: true,
      data: result.data as IBlogPost[],
    };
  } catch (error: any) {
    console.error("Error fetching latest blog posts:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch latest blog posts",
      data: [],
    };
  }
}

// Fetch blog post by slug
export const fetchBlogPostBySlug = async (slug: string) => {
  try {
    const res = await serverFetch.get(`/blog-post/slug/${slug}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch blog post: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch blog post");
    }

    return {
      success: true,
      data: result.data as IBlogPost,
    };
  } catch (error: any) {
    console.error("Error fetching blog post:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch blog post",
      data: null,
    };
  }
}

// Fetch blog post by ID
export const fetchBlogPostById = async (id: string) => {
  try {
    const res = await serverFetch.get(`/blog-post/${id}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch blog post: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch blog post");
    }

    return {
      success: true,
      data: result.data as IBlogPost,
    };
  } catch (error: any) {
    console.error("Error fetching blog post:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch blog post",
      data: null,
    };
  }
}

// Fetch featured blog posts
export const fetchFeaturedBlogPosts = async (limit: number = 3) => {
  try {
    const res = await serverFetch.get(
      `/blog-post?isFeatured=true&limit=${limit}`
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch featured blog posts: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch featured blog posts");
    }

    return {
      success: true,
      data: result.data as IBlogPost[],
    };
  } catch (error: any) {
    console.error("Error fetching featured blog posts:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch featured blog posts",
      data: [],
    };
  }
}

// services/blog/blog-category.actions.ts
export const fetchBlogCategories = 
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
      const endpoint = queryString ? `/blog-category?${queryString}` : "/blog-category";

      const res = await serverFetch.get(endpoint);

      if (!res.ok) {
        throw new Error(`Failed to fetch blog categories: ${res.statusText}`);
      }

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch blog categories");
      }

      return {
        success: true,
        data: result.data as (IBlogCategory & {
          _count?: { blogPosts: number };
          createdAt?: string;
        })[],
        meta: result.meta, // Make sure your API returns meta info
      };
    } catch (error: any) {
      console.error("Error fetching blog categories:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch blog categories",
        data: [],
      };
    }
  }


// Fetch blog category by slug
export const fetchBlogCategoryBySlug = async (slug: string) => {
  try {
    const res = await serverFetch.get(`/blog-category/slug/${slug}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch blog category: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch blog category");
    }

    return {
      success: true,
      data: result.data as IBlogCategory,
    };
  } catch (error: any) {
    console.error("Error fetching blog category:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch blog category",
      data: null,
    };
  }
}
