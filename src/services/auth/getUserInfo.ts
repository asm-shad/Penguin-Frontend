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
import { IOrder } from "@/types/order.interface";

export const getUserInfo = async (): Promise<IUser> => {
  try {
    const response = await serverFetch.get("/auth/me", {
      cache: "no-store", // Changed to no-store to get fresh data
      next: { tags: ["user-info"] },
    });

    const result = await response.json();
    console.log("User info API response:", result); // Debug log

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to fetch user info");
    }

    const apiData = result.data;
    const accessToken = await getCookie("accessToken");

    // Build user info from API data INCLUDING ORDERS
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
      // ADD ORDERS from the backend response - FIXED MAPPING
      orders: apiData.orders?.map((order: any): IOrder => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        orderDate: order.orderDate ? new Date(order.orderDate) : new Date(),
        subtotal: order.subtotal,
        discountAmount: order.discountAmount,
        totalPrice: order.totalPrice,
        status: order.status,
        shippingName: order.shippingName,
        shippingAddress: order.shippingAddress,
        shippingCity: order.shippingCity,
        shippingState: order.shippingState,
        shippingZipCode: order.shippingZipCode,
        createdAt: order.createdAt ? new Date(order.createdAt) : new Date(),
        updatedAt: order.updatedAt ? new Date(order.updatedAt) : new Date(),
        // Add required fields from IOrder interface
        currency: order.currency || "USD", // Default to USD if not provided
        userId: order.userId || apiData.id, // Use user ID from apiData as fallback
        // Order Items
        orderItems: order.orderItems?.map((item: any) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          variantInfo: item.variantInfo,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          product: item.product ? {
            id: item.product.id,
            name: item.product.name,
            productImages: item.product.productImages?.map((img: any) => ({
              id: img.id,
              imageUrl: img.imageUrl,
              isPrimary: img.isPrimary,
            })) || []
          } : undefined
        })) || [],
        // Payments
        payments: order.payments?.map((payment: any) => ({
          id: payment.id,
          paymentMethod: payment.paymentMethod,
          paymentStatus: payment.paymentStatus,
          amount: payment.amount,
          paidAt: payment.paidAt ? new Date(payment.paidAt) : undefined,
        })) || [],
        // Shipping (optional)
        shipping: order.shipping ? {
          id: order.shipping.id,
          shippingMethod: order.shipping.shippingMethod,
          shippingCost: order.shipping.shippingCost,
          // Add optional fields to match IShipping interface
          carrier: order.shipping.carrier || "",
          createdAt: order.shipping.createdAt ? new Date(order.shipping.createdAt) : new Date(),
          updatedAt: order.shipping.updatedAt ? new Date(order.shipping.updatedAt) : new Date(),
          orderId: order.shipping.orderId || order.id,
        } : undefined,
        // Order Trackings
        orderTrackings: order.orderTrackings?.map((tracking: any) => ({
          id: tracking.id,
          status: tracking.status,
          notes: tracking.notes,
          createdAt: tracking.createdAt ? new Date(tracking.createdAt) : new Date(),
        })) || [],
        // Invoice (optional)
        invoice: order.invoice ? {
          id: order.invoice.id,
          hostedInvoiceUrl: order.invoice.hostedInvoiceUrl,
          invoiceNumber: order.invoice.invoiceNumber,
          // Add optional fields to match IInvoice interface
          createdAt: order.invoice.createdAt ? new Date(order.invoice.createdAt) : new Date(),
          updatedAt: order.invoice.updatedAt ? new Date(order.invoice.updatedAt) : new Date(),
          orderId: order.invoice.orderId || order.id,
        } : undefined,
      })) || [],
    };

    console.log("Mapped user info with orders:", {
      ordersCount: userInfo.orders?.length || 0,
      orders: userInfo.orders?.map(o => ({ id: o.id, orderNumber: o.orderNumber }))
    }); // Debug log

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
    console.log("Error fetching user info:", error);

    // Try to get minimal info from token
    try {
      const accessToken = await getCookie("accessToken");
      if (accessToken) {
        const verifiedToken = jwt.verify(
          accessToken,
          process.env.JWT_SECRET as string
        ) as JwtPayload;

        // Return minimal user info with empty orders array
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
          orders: [], // Empty orders array for fallback
        };
      }
    } catch (tokenError) {
      console.log("Token fallback failed:", tokenError);
    }

    // Return minimal default with empty orders
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
      orders: [], // Empty orders array for fallback
    };
  }
};