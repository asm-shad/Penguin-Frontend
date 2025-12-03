/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getCookie } from "./tokenHandlers";
import {
  IUser,
  UserRoleType,
  GenderType,
  UserStatusType,
} from "@/types/user.interface";

export const getUserInfo = async (): Promise<IUser> => {
  try {
    const response = await serverFetch.get("/auth/me", {
      cache: "force-cache",
      next: { tags: ["user-info"] },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to fetch user info");
    }

    const apiData = result.data;
    const accessToken = await getCookie("accessToken");

    // Build user info from API data
    const userInfo: IUser = {
      id: apiData.id || "",
      email: apiData.email || "",
      name: apiData.name || "Unknown User",
      role: (apiData.role as UserRoleType) || "USER",
      gender: apiData.gender as GenderType,
      phone: apiData.phone,
      profileImageUrl: apiData.profileImageUrl,
      userStatus: (apiData.userStatus as UserStatusType) || "ACTIVE",
      needPasswordReset:
        apiData.needPasswordReset !== undefined
          ? apiData.needPasswordReset
          : true,
      isDeleted: apiData.isDeleted || false,
      createdAt: apiData.createdAt ? new Date(apiData.createdAt) : new Date(),
      updatedAt: apiData.updatedAt ? new Date(apiData.updatedAt) : new Date(),
      // Add user addresses if present
      userAddresses:
        apiData.userAddresses?.map((addr: any) => ({
          id: addr.id,
          addressName: addr.addressName,
          email: addr.email,
          isDefault: addr.isDefault,
          createdAt: addr.createdAt ? new Date(addr.createdAt) : new Date(),
          updatedAt: addr.updatedAt ? new Date(addr.updatedAt) : new Date(),
          userId: addr.userId,
          addressId: addr.addressId,
          address: addr.address
            ? {
                id: addr.address.id,
                addressLine: addr.address.addressLine,
                city: addr.address.city,
                state: addr.address.state,
                zipCode: addr.address.zipCode,
                country: addr.address.country,
                createdAt: addr.address.createdAt
                  ? new Date(addr.address.createdAt)
                  : new Date(),
                updatedAt: addr.address.updatedAt
                  ? new Date(addr.address.updatedAt)
                  : new Date(),
              }
            : undefined,
        })) || [],
    };

    // Validate with token if available
    if (accessToken) {
      try {
        const verifiedToken = jwt.verify(
          accessToken,
          process.env.JWT_SECRET as string
        ) as JwtPayload;

        // Cross-check critical fields
        if (verifiedToken.email !== userInfo.email) {
          console.warn("Token email doesn't match API email");
        }

        // Update needPasswordChange from token if API doesn't have it
        if (
          apiData.needPasswordReset === undefined &&
          verifiedToken.needPasswordReset !== undefined
        ) {
          userInfo.needPasswordReset = verifiedToken.needPasswordReset;
        }
      } catch (tokenError) {
        console.warn("Token verification failed:", tokenError);
      }
    }

    return userInfo;
  } catch (error: any) {
    console.log(error);

    // Try to get minimal info from token
    try {
      const accessToken = await getCookie("accessToken");
      if (accessToken) {
        const verifiedToken = jwt.verify(
          accessToken,
          process.env.JWT_SECRET as string
        ) as JwtPayload;

        return {
          id: verifiedToken.sub || verifiedToken.id || "",
          name: verifiedToken.name || "Unknown User",
          email: verifiedToken.email || "",
          role: (verifiedToken.role as UserRoleType) || "USER",
          gender: verifiedToken.gender as GenderType,
          phone: verifiedToken.phone,
          profileImageUrl: verifiedToken.profileImageUrl,
          userStatus: (verifiedToken.userStatus as UserStatusType) || "ACTIVE",
          needPasswordReset:
            verifiedToken.needPasswordReset !== undefined
              ? verifiedToken.needPasswordReset
              : true,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          userAddresses: [],
        };
      }
    } catch (tokenError) {
      console.log("Token fallback failed:", tokenError);
    }

    // Return minimal default
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
    };
  }
};
