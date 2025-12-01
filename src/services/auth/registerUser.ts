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
        isDefault: formData.get("isDefault") === "on" || true,
      },
    };

    // Validate with Zod
    const validation = zodValidator(payload, registerUserValidationZodSchema);
    if (validation.success === false) {
      return validation;
    }

    // Prepare data for backend (matches your API structure)
    const validatedPayload: any = validation.data;
    const registerData = {
      email: validatedPayload.email,
      password: validatedPayload.password,
      name: validatedPayload.name,
      phone: validatedPayload.phone,
      gender: validatedPayload.gender,
      address: validatedPayload.address,
      userAddress: validatedPayload.userAddress,
    };

    // Create FormData for file upload
    const newFormData = new FormData();
    newFormData.append("data", JSON.stringify(registerData));

    // Handle file upload if present
    if (formData.get("file")) {
      newFormData.append("file", formData.get("file") as Blob);
    }

    // Make API call to your backend
    const res = await serverFetch.post("/user/create-user", {
      body: newFormData,
    });

    const result = await res.json();

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
    console.log(error);
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
