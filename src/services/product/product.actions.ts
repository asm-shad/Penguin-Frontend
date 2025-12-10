/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { ProductStatusType } from "@/types/user.interface";
import { 
  CreateProductInput,
  UpdateProductInput,
  UpdateProductStatusInput,
  updateProductStatusSchema,
  UpdateProductFeaturedInput,
  updateProductFeaturedSchema,
  UpdateProductStockInput,
  updateProductStockSchema,
  createProductValidationSchema,
  updateProductValidationSchema,
} from "@/zod/product.validation";


export async function createProduct(_prevState: any, formData: FormData) {
  // 1️⃣ Parse arrays from FormData
  let categoryIds: string[] = [];
  const categoryIdsRaw = formData.get("categoryIds") as string;
  if (categoryIdsRaw) {
    try {
      const parsed = JSON.parse(categoryIdsRaw);
      if (Array.isArray(parsed)) categoryIds = parsed;
    } catch {
      categoryIds = [];
    }
  }

  let variants: any[] = [];
  const variantsRaw = formData.get("variants") as string;
  if (variantsRaw) {
    try {
      const parsed = JSON.parse(variantsRaw);
      if (Array.isArray(parsed)) variants = parsed;
    } catch {
      variants = [];
    }
  }

  // 2️⃣ Get other fields from FormData
  const name = (formData.get("name") as string) || "";
  const description = (formData.get("description") as string) || undefined;
  const price = parseFloat(formData.get("price") as string) || 0;
  const discount = parseFloat(formData.get("discount") as string) || 0;
  const stock = parseInt(formData.get("stock") as string) || 0;
  const status = (formData.get("status") as ProductStatusType) || "NEW";
  const isFeatured = formData.get("isFeatured") === "true";
  const isActive = formData.get("isActive") === "true";
  const sku = (formData.get("sku") as string) || undefined;
  const brandId = (formData.get("brandId") as string) || undefined;

  // 3️⃣ Build validation payload
  const validationPayload: CreateProductInput = {
    name,
    description,
    price,
    discount,
    status,
    isFeatured,
    isActive,
    sku,
    stock,
    brandId,
    categoryIds,
    variants: variants.length > 0 ? variants : undefined,
  };

  // 4️⃣ Validate with Zod
  const validatedPayload = zodValidator(validationPayload, createProductValidationSchema);
  if (!validatedPayload.success || !validatedPayload.data) {
    return {
      success: false,
      message: "Validation failed",
      formData: validationPayload,
      errors: validatedPayload.errors,
    };
  }

  // 5️⃣ Create FormData to send to backend
  const newFormData = new FormData();

  // Stringify the product object
  newFormData.append("data", JSON.stringify(validatedPayload.data));

  // Append actual files
  const files = formData.getAll("files") as File[];
  files.forEach((file) => {
    if (file && file.size > 0) {
      newFormData.append("files", file);
    }
  });

  // 6️⃣ Send to backend
  try {
    const response = await serverFetch.post("/product", { body: newFormData });
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Create product error:", error);
    return {
      success: false,
      message: process.env.NODE_ENV === "development" ? error.message : "Failed to create product",
      formData: validationPayload,
    };
  }
}

export async function updateProduct(
  productId: string,
  _prevState: any,
  formData: FormData
) {
  // 1️⃣ Parse arrays from FormData
  let categoryIds: string[] | undefined;
  const categoryIdsRaw = formData.get("categoryIds") as string;
  if (categoryIdsRaw) {
    try {
      const parsed = JSON.parse(categoryIdsRaw);
      if (Array.isArray(parsed)) categoryIds = parsed;
    } catch {
      categoryIds = undefined;
    }
  }

  let variants: any[] | undefined;
  const variantsRaw = formData.get("variants") as string;
  if (variantsRaw) {
    try {
      const parsed = JSON.parse(variantsRaw);
      if (Array.isArray(parsed)) variants = parsed;
    } catch {
      variants = undefined;
    }
  }

  // 2️⃣ Get other fields from FormData
  const name = (formData.get("name") as string) || undefined;
  const description = (formData.get("description") as string) || undefined;
  const priceStr = formData.get("price") as string;
  const discountStr = formData.get("discount") as string;
  const stockStr = formData.get("stock") as string;
  const status = (formData.get("status") as ProductStatusType) || undefined;
  const isFeaturedRaw = formData.get("isFeatured");
  const isActiveRaw = formData.get("isActive");
  const sku = (formData.get("sku") as string) || undefined;
  const brandId = (formData.get("brandId") as string) || undefined;

  const price = priceStr ? parseFloat(priceStr) : undefined;
  const discount = discountStr ? parseFloat(discountStr) : undefined;
  const stock = stockStr ? parseInt(stockStr) : undefined;
  const isFeatured = isFeaturedRaw !== null ? isFeaturedRaw === "true" : undefined;
  const isActive = isActiveRaw !== null ? isActiveRaw === "true" : undefined;

  // 3️⃣ Build validation payload
  const validationPayload: UpdateProductInput = {
    name,
    description,
    price,
    discount,
    status,
    isFeatured,
    isActive,
    sku,
    stock,
    brandId,
    categoryIds,
    variants,
  };

  // 4️⃣ Validate with Zod
  const validatedPayload = zodValidator(validationPayload, updateProductValidationSchema);
  if (!validatedPayload.success || !validatedPayload.data) {
    return {
      success: false,
      message: "Validation failed",
      formData: validationPayload,
      errors: validatedPayload.errors,
    };
  }

  // 5️⃣ Prepare FormData for backend
  const newFormData = new FormData();
  newFormData.append("data", JSON.stringify(validatedPayload.data));

  // Append new files if any
  const files = formData.getAll("files") as File[];
  files.forEach((file) => {
    if (file && file.size > 0) {
      newFormData.append("files", file);
    }
  });

  // 6️⃣ Send update request
  try {
    const response = await serverFetch.put(`/product/${productId}`, {
      body: newFormData,
    });
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Update product error:", error);
    return {
      success: false,
      message: process.env.NODE_ENV === "development" ? error.message : "Failed to update product",
      formData: validationPayload,
    };
  }
}

// Get Products with filters
export async function getProducts(_prevState: any, formData?: FormData) {
  try {
    // Build query string from form data or use empty
    const queryParams = new URLSearchParams();
    
    if (formData) {
      const searchTerm = formData.get("searchTerm") as string;
      const category = formData.get("category") as string;
      const brand = formData.get("brand") as string;
      const status = formData.get("status") as string;
      const isFeatured = formData.get("isFeatured") as string;
      const isActive = formData.get("isActive") as string;
      const page = formData.get("page") as string;
      const limit = formData.get("limit") as string;
      const sortBy = formData.get("sortBy") as string;
      const sortOrder = formData.get("sortOrder") as string;
      
      if (searchTerm) queryParams.append("searchTerm", searchTerm);
      if (category) queryParams.append("categoryId", category);
      if (brand) queryParams.append("brandId", brand);
      if (status) queryParams.append("status", status);
      if (isFeatured) queryParams.append("isFeatured", isFeatured);
      if (isActive) queryParams.append("isActive", isActive);
      if (page) queryParams.append("page", page);
      if (limit) queryParams.append("limit", limit);
      if (sortBy) queryParams.append("sortBy", sortBy);
      if (sortOrder) queryParams.append("sortOrder", sortOrder);
    }

    const queryString = queryParams.toString();
    const response = await serverFetch.get(`/product${queryString ? `?${queryString}` : ""}`);
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Get products error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Failed to fetch products"}`,
    };
  }
}

// Get Product by ID
export async function getProductById(id: string) {
  try {
    const response = await serverFetch.get(`/product/${id}`);
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Get product by ID error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Failed to fetch product"}`,
    };
  }
}

// Get Product by Slug
export async function getProductBySlug(slug: string) {
  try {
    const response = await serverFetch.get(`/product/slug/${slug}`);
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Get product by slug error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Failed to fetch product"}`,
    };
  }
}

// Update Product Status
export async function updateProductStatus(id: string, _prevState: any, formData: FormData) {
  const discountValue = formData.get("discount");

  const validationPayload: UpdateProductStatusInput = {
    status: formData.get("status") as ProductStatusType,
    discount: discountValue ? Number(discountValue) : undefined,
  };

  const validatedPayload = zodValidator(validationPayload, updateProductStatusSchema);

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: validatedPayload.success,
      message: "Validation failed",
      formData: validationPayload,
      errors: validatedPayload.errors,
    };
  }

  if (!validatedPayload.data) {
    return {
      success: false,
      message: "Validation failed",
      formData: validationPayload,
    };
  }

  try {
    const response = await serverFetch.patch(`/product/${id}/status`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedPayload.data),
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Update product status error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Failed to update product status"}`,
      formData: validationPayload,
    };
  }
}

// Update Product Featured Status
export async function updateProductFeatured(id: string, _prevState: any, formData: FormData) {
  const validationPayload: UpdateProductFeaturedInput = {
    isFeatured: formData.get("isFeatured") === "true",
  };

  const validatedPayload = zodValidator(validationPayload, updateProductFeaturedSchema);

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: validatedPayload.success,
      message: "Validation failed",
      formData: validationPayload,
      errors: validatedPayload.errors,
    };
  }

  if (!validatedPayload.data) {
    return {
      success: false,
      message: "Validation failed",
      formData: validationPayload,
    };
  }

  try {
    const response = await serverFetch.patch(`/product/${id}/featured`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedPayload.data),
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Update product featured error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Failed to update product featured status"}`,
      formData: validationPayload,
    };
  }
}

// Update Product Stock
export async function updateProductStock(id: string, _prevState: any, formData: FormData) {
  const stockValue = formData.get("stock");

  const validationPayload: UpdateProductStockInput = {
    stock: stockValue ? Number(stockValue) : 0,
    variantId: formData.get("variantId") as string || undefined,
    reason: formData.get("reason") as string || undefined,
  };

  const validatedPayload = zodValidator(validationPayload, updateProductStockSchema);

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: validatedPayload.success,
      message: "Validation failed",
      formData: validationPayload,
      errors: validatedPayload.errors,
    };
  }

  if (!validatedPayload.data) {
    return {
      success: false,
      message: "Validation failed",
      formData: validationPayload,
    };
  }

  try {
    const response = await serverFetch.patch(`/product/${id}/stock`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedPayload.data),
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Update product stock error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Failed to update product stock"}`,
      formData: validationPayload,
    };
  }
}

// Soft Delete Product
export async function softDeleteProduct(id: string) {
  try {
    const response = await serverFetch.delete(`/product/soft/${id}`);
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Soft delete product error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Failed to soft delete product"}`,
    };
  }
}

// Delete Product
export async function deleteProduct(id: string) {
  try {
    const response = await serverFetch.delete(`/product/${id}`);
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Delete product error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Failed to delete product"}`,
    };
  }
}

// Get Featured Products
export async function getFeaturedProducts() {
  try {
    const response = await serverFetch.get("/product/featured");
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Get featured products error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Failed to fetch featured products"}`,
    };
  }
}

// Get Products by Status
export async function getProductsByStatus(status: string, options?: { limit?: number; page?: number }) {
  try {
    const queryParams = new URLSearchParams();
    
    if (options?.limit) queryParams.append("limit", options.limit.toString());
    if (options?.page) queryParams.append("page", options.page.toString());
    
    const queryString = queryParams.toString();
    const response = await serverFetch.get(`/product/status/${status}${queryString ? `?${queryString}` : ""}`);
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error(`Get products by status ${status} error:`, error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : `Failed to fetch products with status ${status}`}`,
    };
  }
}

// Get Products by Category Slug
export async function getProductsByCategorySlug(categorySlug: string, _prevState?: any, formData?: FormData) {
  try {
    const queryParams = new URLSearchParams();
    
    if (formData) {
      const searchTerm = formData.get("searchTerm") as string;
      const brand = formData.get("brand") as string;
      const status = formData.get("status") as string;
      const isFeatured = formData.get("isFeatured") as string;
      const isActive = formData.get("isActive") as string;
      const page = formData.get("page") as string;
      const limit = formData.get("limit") as string;
      const sortBy = formData.get("sortBy") as string;
      const sortOrder = formData.get("sortOrder") as string;
      
      if (searchTerm) queryParams.append("searchTerm", searchTerm);
      if (brand) queryParams.append("brandId", brand);
      if (status) queryParams.append("status", status);
      if (isFeatured) queryParams.append("isFeatured", isFeatured);
      if (isActive) queryParams.append("isActive", isActive);
      if (page) queryParams.append("page", page);
      if (limit) queryParams.append("limit", limit);
      if (sortBy) queryParams.append("sortBy", sortBy);
      if (sortOrder) queryParams.append("sortOrder", sortOrder);
    }

    const queryString = queryParams.toString();
    const response = await serverFetch.get(`/product/category/${categorySlug}${queryString ? `?${queryString}` : ""}`);
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Get products by category error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Failed to fetch products by category"}`,
    };
  }
}
