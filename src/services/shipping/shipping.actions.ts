/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";

// Public: Track shipping by tracking number (no authentication required)
export const trackShippingByNumber = async (trackingNumber: string) => {
  try {
    const res = await serverFetch.get(`/shipping/track/${trackingNumber}`);

    if (!res.ok) {
      throw new Error(`Failed to track shipping: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to track shipping");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Error tracking shipping:", error);
    return {
      success: false,
      message: error.message || "Failed to track shipping",
      data: null,
    };
  }
};

// Admin: Add shipping to order (requires authentication)
export const addShippingToOrder = async (
  orderId: string,
  shippingData: any
) => {
  try {
    const res = await serverFetch.post(`/shipping/order/${orderId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shippingData),
    });

    if (!res.ok) {
      throw new Error(`Failed to add shipping: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to add shipping");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Error adding shipping:", error);
    return {
      success: false,
      message: error.message || "Failed to add shipping",
      data: null,
    };
  }
};

// Admin: Update shipping information (requires authentication)
export const updateShippingInfo = async (
  orderId: string,
  shippingData: any
) => {
  try {
    const res = await serverFetch.patch(`/shipping/order/${orderId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shippingData),
    });

    if (!res.ok) {
      throw new Error(`Failed to update shipping: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to update shipping");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Error updating shipping:", error);
    return {
      success: false,
      message: error.message || "Failed to update shipping",
      data: null,
    };
  }
};
