/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { registerUserValidationZodSchema } from "@/zod/auth.validation";
import { loginUser } from "./loginUser";

export const registerUser = async (
  _currentState: any,
  formData: any
): Promise<any> => {
  try {
    // Extract form data
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      gender: formData.get("gender") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      address: {
        addressLine: formData.get("addressLine") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        zipCode: formData.get("zipCode") as string,
        country: (formData.get("country") as string) || "US",
      },
      userAddress: {
        addressName: formData.get("addressName") as string,
        email: formData.get("email") as string,
        isDefault: formData.get("isDefault") === "on",
      },
    };

    // Validate with Zod
    const validation = zodValidator(payload, registerUserValidationZodSchema);
    if (validation.success === false) {
      return validation;
    }

    const validatedPayload: any = validation.data;

    // Create FormData - BUT we need a different approach
    // Since your middleware expects JSON, let's send everything as JSON
    const newFormData = new FormData();

    // Create the complete request object
    const requestBody = {
      email: validatedPayload.email,
      password: validatedPayload.password,
      name: validatedPayload.name,
      phone: validatedPayload.phone || "",
      gender: validatedPayload.gender || "MALE",
      address: validatedPayload.address, // Already an object
      userAddress: validatedPayload.userAddress, // Already an object
    };

    // Append the entire request as JSON
    newFormData.append("data", JSON.stringify(requestBody));

    // Handle file upload if present
    const file = formData.get("file");
    if (file && file.size > 0 && file.name) {
      newFormData.append("file", file);
    } else {
      console.log("No file or empty file provided");
    }

    // Debug: Log what we're sending
    console.log("Sending data structure:", requestBody);
    console.log("File exists?", !!file);
    if (file) {
      console.log("File size:", file.size, "bytes");
    }

    // Make API call to your backend
    const res = await serverFetch.post("/user/create-user", {
      body: newFormData,
      // Don't set Content-Type header - let browser set it with boundary
    });

    const result = await res.json();
    console.log("Backend response:", result);

    // Auto-login after successful registration
    if (result.success) {
      // Prepare login data
      const loginFormData = new FormData();
      loginFormData.append("email", validatedPayload.email);
      loginFormData.append("password", validatedPayload.password);

      await loginUser(_currentState, loginFormData);
    }

    return result;
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors so Next.js can handle them
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.log("Registration error:", error);
    return {
      success: false,
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Registration Failed. Please try again."
      }`,
    };
  }
};
