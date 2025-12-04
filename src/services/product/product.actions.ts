/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import {
  ICategory,
  IProduct,
  IProductFilters,
} from "@/types/product.interface";
import { ProductStatusType } from "@/types/user.interface";
import { cache } from "react";

export const fetchProducts = cache(async (filters?: IProductFilters) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();

    if (filters?.searchTerm)
      queryParams.append("searchTerm", filters.searchTerm);
    if (filters?.category) queryParams.append("categoryId", filters.category);
    if (filters?.brand) queryParams.append("brandId", filters.brand);
    if (filters?.minPrice)
      queryParams.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice)
      queryParams.append("maxPrice", filters.maxPrice.toString());
    if (filters?.status) queryParams.append("status", filters.status);
    if (filters?.isFeatured !== undefined)
      queryParams.append("isFeatured", filters.isFeatured.toString());
    if (filters?.isActive !== undefined)
      queryParams.append("isActive", filters.isActive.toString());
    if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
    if (filters?.page) queryParams.append("page", filters.page.toString());
    if (filters?.limit) queryParams.append("limit", filters.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/products?${queryString}` : "/products";

    const res = await serverFetch.get(endpoint);

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
      meta: result.meta,
    };
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch products",
      data: [],
      meta: undefined,
    };
  }
});

export const fetchFeaturedProducts = cache(async () => {
  try {
    const res = await serverFetch.get("/product/featured");

    if (!res.ok) {
      throw new Error(`Failed to fetch featured products: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch featured products");
    }

    return {
      success: true,
      data: result.data as IProduct[],
    };
  } catch (error: any) {
    console.error("Error fetching featured products:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch featured products",
      data: [],
    };
  }
});

export const fetchProductsByStatus = cache(
  async (status: string, options?: { limit?: number; page?: number }) => {
    try {
      const queryParams = new URLSearchParams();

      // Add pagination options if provided
      if (options?.limit) queryParams.append("limit", options.limit.toString());
      if (options?.page) queryParams.append("page", options.page.toString());

      const queryString = queryParams.toString();
      const endpoint = queryString
        ? `/product/status/${status}?${queryString}`
        : `/product/status/${status}`;

      const res = await serverFetch.get(endpoint);

      if (!res.ok) {
        throw new Error(
          `Failed to fetch products with status ${status}: ${res.statusText}`
        );
      }

      const result = await res.json();

      if (!result.success) {
        throw new Error(
          result.message || `Failed to fetch products with status ${status}`
        );
      }

      return {
        success: true,
        data: result.data as IProduct[],
        meta: result.meta,
      };
    } catch (error: any) {
      console.error(`Error fetching products with status ${status}:`, error);
      return {
        success: false,
        message:
          error.message || `Failed to fetch products with status ${status}`,
        data: [],
        meta: undefined,
      };
    }
  }
);

export const fetchNewArrivals = cache(async (limit?: number) => {
  return fetchProductsByStatus("NEW", { limit });
});

export const fetchProductsOnSale = cache(async (limit?: number) => {
  return fetchProductsByStatus("SALE", { limit });
});

export const fetchHotProducts = cache(async (limit?: number) => {
  return fetchProductsByStatus("HOT", { limit });
});

export const fetchOutOfStockProducts = cache(async (limit?: number) => {
  return fetchProductsByStatus("OUT_OF_STOCK", { limit });
});

export const fetchDiscontinuedProducts = cache(async (limit?: number) => {
  return fetchProductsByStatus("DISCONTINUED", { limit });
});

export const fetchProductBySlug = cache(async (slug: string) => {
  try {
    const res = await serverFetch.get(`/product/slug/${slug}`);

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

export const fetchProductById = cache(async (id: string) => {
  try {
    const res = await serverFetch.get(`/product/${id}`);

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

export const createProduct = cache(async (productData: FormData) => {
  try {
    const res = await serverFetch.post("/products", {
      body: productData,
      headers: {
        // Content-Type will be set automatically for FormData
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to create product: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to create product");
    }

    return {
      success: true,
      data: result.data as IProduct,
    };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return {
      success: false,
      message: error.message || "Failed to create product",
      data: null,
    };
  }
});

export const updateProduct = cache(
  async (id: string, productData: FormData) => {
    try {
      const res = await serverFetch.patch(`/product/${id}`, {
        body: productData,
      });

      if (!res.ok) {
        throw new Error(`Failed to update product: ${res.statusText}`);
      }

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to update product");
      }

      return {
        success: true,
        data: result.data as IProduct,
      };
    } catch (error: any) {
      console.error("Error updating product:", error);
      return {
        success: false,
        message: error.message || "Failed to update product",
        data: null,
      };
    }
  }
);

export const updateProductStatus = cache(
  async (
    id: string,
    status: ProductStatusType,
    discount?: number // Add optional discount parameter
  ) => {
    try {
      const body: any = { status };

      // Include discount if provided (only valid for HOT and SALE statuses)
      if (discount !== undefined) {
        body.discount = discount;
      }

      const res = await serverFetch.patch(`/product/${id}/status`, {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to update product status: ${res.statusText}`);
      }

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to update product status");
      }

      return {
        success: true,
        data: result.data as IProduct,
      };
    } catch (error: any) {
      console.error("Error updating product status:", error);
      return {
        success: false,
        message: error.message || "Failed to update product status",
        data: null,
      };
    }
  }
);

export const updateProductFeatured = cache(
  async (id: string, isFeatured: boolean) => {
    try {
      const res = await serverFetch.patch(`/product/${id}/featured`, {
        body: JSON.stringify({ isFeatured }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(
          `Failed to update product featured status: ${res.statusText}`
        );
      }

      const result = await res.json();

      if (!result.success) {
        throw new Error(
          result.message || "Failed to update product featured status"
        );
      }

      return {
        success: true,
        data: result.data as IProduct,
      };
    } catch (error: any) {
      console.error("Error updating product featured status:", error);
      return {
        success: false,
        message: error.message || "Failed to update product featured status",
        data: null,
      };
    }
  }
);

export const updateProductActive = cache(
  async (id: string, isActive: boolean) => {
    try {
      const res = await serverFetch.patch(`/product/${id}/active`, {
        body: JSON.stringify({ isActive }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(
          `Failed to update product active status: ${res.statusText}`
        );
      }

      const result = await res.json();

      if (!result.success) {
        throw new Error(
          result.message || "Failed to update product active status"
        );
      }

      return {
        success: true,
        data: result.data as IProduct,
      };
    } catch (error: any) {
      console.error("Error updating product active status:", error);
      return {
        success: false,
        message: error.message || "Failed to update product active status",
        data: null,
      };
    }
  }
);

export const updateProductStock = cache(
  async (id: string, stock: number, variantId?: string, reason?: string) => {
    try {
      const res = await serverFetch.patch(`/product/${id}/stock`, {
        body: JSON.stringify({ stock, variantId, reason }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to update product stock: ${res.statusText}`);
      }

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to update product stock");
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error: any) {
      console.error("Error updating product stock:", error);
      return {
        success: false,
        message: error.message || "Failed to update product stock",
        data: null,
      };
    }
  }
);

export const deleteProduct = cache(async (id: string) => {
  try {
    const res = await serverFetch.delete(`/product/${id}`);

    if (!res.ok) {
      throw new Error(`Failed to delete product: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete product");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      message: error.message || "Failed to delete product",
      data: null,
    };
  }
});

export const fetchActiveProducts = cache(async (limit?: number) => {
  try {
    const filters: IProductFilters = {
      isActive: true,
      limit: limit || 12,
      sortBy: "createdAt",
      sortOrder: "desc",
    };

    return await fetchProducts(filters);
  } catch (error: any) {
    console.error("Error fetching active products:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch active products",
      data: [],
    };
  }
});

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
