/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { createBlogCategoryZodSchema, updateBlogCategoryZodSchema } from "@/zod/blogCategory.validation";
import { createBrandZodSchema, updateBrandZodSchema } from "@/zod/brand.validation";
import { 
  createCategoryZodSchema, 
  updateCategoryZodSchema 
} from "@/zod/category.validation";
import { revalidateTag } from "next/cache";

// Create Category
export async function createCategory(_prevState: any, formData: FormData) {
  const validationPayload = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    isFeatured: formData.get("isFeatured") === "true",
  };

  const validatedPayload = zodValidator(
    validationPayload, 
    createCategoryZodSchema
  );

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: false,
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

  const newFormData = new FormData();
  newFormData.append("data", JSON.stringify(validatedPayload.data));
  
  // Handle file upload if present
  const file = formData.get("file") as File;
  if (file && file.size > 0) {
    newFormData.append("file", file);
  }

  try {
    const response = await serverFetch.post("/category", {
      body: newFormData,
    });

    const result = await response.json();

    if (result.success) {
      // Next.js 15: Fixed revalidateTag syntax
      revalidateTag("categories-list", "max");
      revalidateTag("featured-categories", "max");
    }

    return result;
  } catch (error: any) {
    console.error("Create category error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`,
      formData: validationPayload,
    };
  }
}

// Update Category
export async function updateCategory(
  id: string,
  _prevState: any,
  formData: FormData
) {
  const validationPayload = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    imageUrl: formData.get("imageUrl") as string,
    isFeatured: formData.get("isFeatured") === "true",
  };

  const validatedPayload = zodValidator(
    validationPayload,
    updateCategoryZodSchema
  );

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: false,
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

  const newFormData = new FormData();
  newFormData.append("data", JSON.stringify(validatedPayload.data));
  
  // Handle file upload if present
  const file = formData.get("file") as File;
  if (file && file.size > 0) {
    newFormData.append("file", file);
  }

  try {
    const response = await serverFetch.patch(`/category/${id}`, {
      body: newFormData,
    });

    const result = await response.json();

    if (result.success) {
      // Next.js 15: Fixed revalidateTag syntax
      revalidateTag("categories-list", "max");
      revalidateTag("featured-categories", "max");
      revalidateTag(`category-${id}`, "max");
    }

    return result;
  } catch (error: any) {
    console.error("Update category error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`,
      formData: validationPayload,
    };
  }
}

// Delete Category
export async function deleteCategory(id: string) {
  try {
    const response = await serverFetch.delete(`/category/${id}`);
    const result = await response.json();

    if (result.success) {
      // Next.js 15: Fixed revalidateTag syntax
      revalidateTag("categories-list", "max");
      revalidateTag("featured-categories", "max");
    }

    return result;
  } catch (error: any) {
    console.error("Delete category error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`,
    };
  }
}

// Create Brand
export async function createBrand(_prevState: any, formData: FormData) {
  const validationPayload = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
  };

  const validatedPayload = zodValidator(
    validationPayload, 
    createBrandZodSchema
  );

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: false,
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

  const newFormData = new FormData();
  newFormData.append("data", JSON.stringify(validatedPayload.data));
  
  // Handle file upload if present
  const file = formData.get("file") as File;
  if (file && file.size > 0) {
    newFormData.append("file", file);
  }

  try {
    const response = await serverFetch.post("/brand", {
      body: newFormData,
    });

    const result = await response.json();

    if (result.success) {
      // Next.js 16: revalidateTag with options
      revalidateTag("brands-list", "max");
      revalidateTag("popular-brands", "max");
      revalidateTag("brands-dropdown", "max");
    }

    return result;
  } catch (error: any) {
    console.error("Create brand error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`,
      formData: validationPayload,
    };
  }
}

// Update Brand
export async function updateBrand(
  id: string,
  _prevState: any,
  formData: FormData
) {
  const validationPayload = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    imageUrl: formData.get("imageUrl") as string,
  };

  const validatedPayload = zodValidator(
    validationPayload,
    updateBrandZodSchema
  );

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: false,
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

  const newFormData = new FormData();
  newFormData.append("data", JSON.stringify(validatedPayload.data));
  
  // Handle file upload if present
  const file = formData.get("file") as File;
  if (file && file.size > 0) {
    newFormData.append("file", file);
  }

  try {
    const response = await serverFetch.patch(`/brand/${id}`, {
      body: newFormData,
    });

    const result = await response.json();

    if (result.success) {
      // Next.js 16: revalidateTag with options
      revalidateTag("brands-list", "max");
      revalidateTag("popular-brands", "max");
      revalidateTag("brands-dropdown", "max");
      revalidateTag(`brand-${id}`, "max");
    }

    return result;
  } catch (error: any) {
    console.error("Update brand error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`,
      formData: validationPayload,
    };
  }
}

// Delete Brand
export async function deleteBrand(id: string) {
  try {
    const response = await serverFetch.delete(`/brand/${id}`);
    const result = await response.json();

    if (result.success) {
      // Next.js 16: revalidateTag with options
      revalidateTag("brands-list", "max");
      revalidateTag("popular-brands", "max");
      revalidateTag("brands-dropdown", "max");
    }

    return result;
  } catch (error: any) {
    console.error("Delete brand error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`,
    };
  }
}

// Create Blog Category
export async function createBlogCategory(_prevState: any, formData: FormData) {
  const validationPayload = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
  };

  const validatedPayload = zodValidator(
    validationPayload, 
    createBlogCategoryZodSchema
  );

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: false,
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
    const response = await serverFetch.post("/blog-category", {
      body: JSON.stringify(validatedPayload.data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.success) {
      // Next.js 16: revalidateTag with options
      revalidateTag("blog-categories-list", "max");
      revalidateTag("blog-categories-dropdown", "max");
    }

    return result;
  } catch (error: any) {
    console.error("Create blog category error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`,
      formData: validationPayload,
    };
  }
}

// Update Blog Category
export async function updateBlogCategory(
  id: string,
  _prevState: any,
  formData: FormData
) {
  const validationPayload = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
  };

  const validatedPayload = zodValidator(
    validationPayload,
    updateBlogCategoryZodSchema
  );

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: false,
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
    const response = await serverFetch.patch(`/blog-category/${id}`, {
      body: JSON.stringify(validatedPayload.data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.success) {
      // Next.js 16: revalidateTag with options
      revalidateTag("blog-categories-list", "max");
      revalidateTag("blog-categories-dropdown", "max");
      revalidateTag(`blog-category-${id}`, "max");
    }

    return result;
  } catch (error: any) {
    console.error("Update blog category error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`,
      formData: validationPayload,
    };
  }
}

// Delete Blog Category
export async function deleteBlogCategory(id: string) {
  try {
    const response = await serverFetch.delete(`/blog-category/${id}`);
    const result = await response.json();

    if (result.success) {
      // Next.js 16: revalidateTag with options
      revalidateTag("blog-categories-list", "max");
      revalidateTag("blog-categories-dropdown", "max");
    }

    return result;
  } catch (error: any) {
    console.error("Delete blog category error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`,
    };
  }
}