/* eslint-disable @typescript-eslint/no-explicit-any */
// app/actions/user.actions.ts
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { 
  createAdminSchema, 
  createProductManagerSchema, 
  createCustomerSupportSchema,
  updateUserStatusSchema,
} from "@/zod/user.validation";
import { IUpdateUserStatus } from "@/types/user.interface";

// Create Admin - FIXED VERSION
export async function createAdmin(_prevState: any, formData: FormData) {
  // Create validation payload WITHOUT role (it will be added by Zod default)
  const validationPayload = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    name: formData.get("name") as string,
    phone: formData.get("phone") as string || undefined,
    gender: formData.get("gender") as "MALE" | "FEMALE" | "OTHER" || undefined,
  };

  const validatedPayload = zodValidator(validationPayload, createAdminSchema);

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: validatedPayload.success,
      message: "Validation failed",
      errors: validatedPayload.errors,
    };
  }

  if (!validatedPayload.data) {
    return {
      success: false,
      message: "Validation failed",
    };
  }

  // Backend payload will include the role from Zod default
  const backendPayload = {
    ...validatedPayload.data,
  };

  const newFormData = new FormData();
  newFormData.append("data", JSON.stringify(backendPayload));
  
  const file = formData.get("file") as File;
  if (file && file.size > 0) {
    newFormData.append("file", file);
  }

  try {
    const response = await serverFetch.post("/user/create-admin", {
      body: newFormData,
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Create admin error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Failed to create admin"}`,
    };
  }
}

// Update Admin (for editing)
export async function updateAdmin(id: string, _prevState: any, formData: FormData) {
  try {
    // For edit, we use the update-my-profile endpoint but with admin privileges
    const userData = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string || undefined,
      gender: formData.get("gender") as string || undefined,
    };
    
    // Note: Since we're using update-my-profile endpoint, we need to handle this differently
    // For now, we'll use a PATCH request to update user data
    const newFormData = new FormData();
    newFormData.append("data", JSON.stringify(userData));
    
    const file = formData.get("file") as File;
    if (file && file.size > 0) {
      newFormData.append("file", file);
    }

    // We need a specific endpoint for updating other users
    // For now, we'll use a workaround - you should create an endpoint like /user/:id
    const response = await serverFetch.patch(`/user/${id}`, {
      body: newFormData,
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Update admin error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Failed to update admin"}`,
    };
  }
}

// Create Product Manager
export async function createProductManager(_prevState: any, formData: FormData) {
  const validationPayload = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    name: formData.get("name") as string,
    phone: formData.get("phone") as string || undefined,
    gender: formData.get("gender") as "MALE" | "FEMALE" | "OTHER" || undefined,
  };

  const validatedPayload = zodValidator(validationPayload, createProductManagerSchema);

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: validatedPayload.success,
      message: "Validation failed",
      errors: validatedPayload.errors,
    };
  }

  if (!validatedPayload.data) {
    return {
      success: false,
      message: "Validation failed",
    };
  }

  const backendPayload = {
    ...validatedPayload.data,
  };

  const newFormData = new FormData();
  newFormData.append("data", JSON.stringify(backendPayload));
  
  const file = formData.get("file") as File;
  if (file && file.size > 0) {
    newFormData.append("file", file);
  }

  try {
    const response = await serverFetch.post("/user/create-product-manager", {
      body: newFormData,
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Create product manager error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Failed to create product manager"}`,
    };
  }
}

// Update Product Manager
export async function updateProductManager(id: string, _prevState: any, formData: FormData) {
  try {
    const userData = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string || undefined,
      gender: formData.get("gender") as string || undefined,
    };
    
    const newFormData = new FormData();
    newFormData.append("data", JSON.stringify(userData));
    
    const file = formData.get("file") as File;
    if (file && file.size > 0) {
      newFormData.append("file", file);
    }

    const response = await serverFetch.patch(`/user/${id}`, {
      body: newFormData,
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Update product manager error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Failed to update product manager"}`,
    };
  }
}

// Create Customer Support - FIXED VERSION
export async function createCustomerSupport(_prevState: any, formData: FormData) {
  const validationPayload = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    name: formData.get("name") as string,
    phone: formData.get("phone") as string || undefined,
    gender: formData.get("gender") as "MALE" | "FEMALE" | "OTHER" || undefined,
  };

  const validatedPayload = zodValidator(validationPayload, createCustomerSupportSchema);

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: validatedPayload.success,
      message: "Validation failed",
      errors: validatedPayload.errors,
    };
  }

  if (!validatedPayload.data) {
    return {
      success: false,
      message: "Validation failed",
    };
  }

  const backendPayload = {
    ...validatedPayload.data,
  };

  const newFormData = new FormData();
  newFormData.append("data", JSON.stringify(backendPayload));
  
  const file = formData.get("file") as File;
  if (file && file.size > 0) {
    newFormData.append("file", file);
  }

  try {
    const response = await serverFetch.post("/user/create-customer-support", {
      body: newFormData,
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Create customer support error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Failed to create customer support"}`,
    };
  }
}

export async function updateCustomerSupport(id: string, _prevState: any, formData: FormData) {
  try {
    const userData = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string || undefined,
      gender: formData.get("gender") as string || undefined,
    };
    
    const newFormData = new FormData();
    newFormData.append("data", JSON.stringify(userData));
    
    const file = formData.get("file") as File;
    if (file && file.size > 0) {
      newFormData.append("file", file);
    }

    const response = await serverFetch.patch(`/user/${id}`, {
      body: newFormData,
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Update customer support error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Failed to update customer support"}`,
    };
  }
}

// Get all users with filters
export async function getUsers(queryString?: string) {
  try {
    const response = await serverFetch.get(`/user${queryString ? `?${queryString}` : ""}`);
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Get users error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Failed to fetch users"}`,
      data: [],
      meta: { total: 0, page: 1, limit: 10 },
    };
  }
}

// Get user by ID
export async function getUserById(id: string) {
  try {
    const response = await serverFetch.get(`/user/${id}`);
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Get user by ID error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Failed to fetch user"}`,
    };
  }
}

// Update user status
export async function updateUserStatus(id: string, statusData: IUpdateUserStatus) {
  const validatedPayload = zodValidator(statusData, updateUserStatusSchema);

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedPayload.errors,
    };
  }

  try {
    const response = await serverFetch.patch(`/user/${id}/status`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedPayload.data),
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Update user status error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Failed to update user status"}`,
    };
  }
}

export async function deleteUser(id: string) {
  try {
    const response = await serverFetch.delete(`/user/${id}`);
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Delete user error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Failed to delete user"}`,
    };
  }
}
