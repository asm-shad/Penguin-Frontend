/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { IUser, UserRoleType } from "@/types/user.interface";

export const getUserInfo = async (): Promise<IUser> => {
  try {
    const response = await serverFetch.get("/auth/me", {
      cache: "no-store",
      next: { tags: ["user-info"] },
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to fetch user info");
    }

    const apiData = result.data;

    // Return simplified user info (adjust based on your actual API response)
    return {
      id: apiData.id || "",
      name: apiData.name || apiData.admin?.name || apiData.doctor?.name || "Unknown User",
      email: apiData.email || "",
      role: (apiData.role as UserRoleType) || "USER",
      gender: apiData.gender,
      phone: apiData.phone,
      profileImageUrl: apiData.profileImageUrl,
      userStatus: apiData.userStatus || "ACTIVE",
      needPasswordReset: apiData.needPasswordReset !== undefined ? apiData.needPasswordReset : true,
      isDeleted: apiData.isDeleted || false,
      createdAt: apiData.createdAt ? new Date(apiData.createdAt) : new Date(),
      updatedAt: apiData.updatedAt ? new Date(apiData.updatedAt) : new Date(),
      userAddresses: apiData.userAddresses || [],
      orders: apiData.orders || [],
      // Include all other properties from apiData
      ...apiData
    };
  } catch (error: any) {
    console.log("Error fetching user info:", error);
    
    // Return minimal fallback
    return {
      id: "",
      name: "Unknown User",
      email: "",
      role: "USER",
      userStatus: "ACTIVE",
      needPasswordReset: true,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userAddresses: [],
      orders: [],
    };
  }
};