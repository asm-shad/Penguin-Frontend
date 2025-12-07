/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { IOrder } from "@/types/order.interface";
import { CreateOrderDto, IOrderFilters, IUpdateOrderStatusDto } from "@/types/orderPayment";
import { cookies } from "next/headers";

import { cache } from "react";

// Create order
export const createOrder = async (orderData: CreateOrderDto) => {
  try {
    const res = await serverFetch.post("/orders", {
      body: JSON.stringify(orderData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to create order: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to create order");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Error creating order:", error);
    return {
      success: false,
      message: error.message || "Failed to create order",
      data: null,
    };
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const res = await serverFetch.get(`/orders/${orderId}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch order: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch order");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch order",
      data: null,
    };
  }
};

// Get all orders (admin/staff)
export const fetchAllOrders = cache(async (filters?: IOrderFilters) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();

    if (filters?.searchTerm)
      queryParams.append("searchTerm", filters.searchTerm);
    if (filters?.status) queryParams.append("status", filters.status);
    if (filters?.paymentStatus)
      queryParams.append("paymentStatus", filters.paymentStatus);
    if (filters?.customerEmail)
      queryParams.append("customerEmail", filters.customerEmail);
    if (filters?.startDate) queryParams.append("startDate", filters.startDate);
    if (filters?.endDate) queryParams.append("endDate", filters.endDate);
    if (filters?.minAmount)
      queryParams.append("minAmount", filters.minAmount.toString());
    if (filters?.maxAmount)
      queryParams.append("maxAmount", filters.maxAmount.toString());
    if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
    if (filters?.page) queryParams.append("page", filters.page.toString());
    if (filters?.limit) queryParams.append("limit", filters.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/orders?${queryString}` : "/orders";

    const res = await serverFetch.get(endpoint);

    if (!res.ok) {
      throw new Error(`Failed to fetch orders: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch orders");
    }

    return {
      success: true,
      data: result.data as IOrder[],
      meta: result.meta,
    };
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch orders",
      data: [],
      meta: undefined,
    };
  }
});

// Get my orders (authenticated user)
export async function getMyOrders(filters?: any) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    
    if (!accessToken) {
      throw new Error("Not authenticated");
    }

    const queryParams = new URLSearchParams();
    
    if (filters?.status) queryParams.append("status", filters.status);
    if (filters?.page) queryParams.append("page", filters.page.toString());
    if (filters?.limit) queryParams.append("limit", filters.limit.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? 
      `/orders/my-orders?${queryString}` : 
      "/orders/my-orders";

    const res = await serverFetch.get(endpoint);

    if (!res.ok) {
      throw new Error(`Failed to fetch orders: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch orders");
    }

    return {
      success: true,
      data: result.data as IOrder[],
      meta: result.meta,
    };
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch orders",
      data: [],
      meta: undefined,
    };
  }
}

// Get order by ID
export const fetchOrderById = cache(async (id: string) => {
  try {
    const res = await serverFetch.get(`/orders/${id}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch order: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch order");
    }

    return {
      success: true,
      data: result.data as IOrder,
    };
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch order",
      data: null,
    };
  }
});

// Get order by order number
export const fetchOrderByNumber = cache(async (orderNumber: string) => {
  try {
    const res = await serverFetch.get(`/orders/my-orders/number/${orderNumber}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch order: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch order");
    }

    return {
      success: true,
      data: result.data as IOrder,
    };
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch order",
      data: null,
    };
  }
});

// Update order status
export const updateOrderStatus = async (
  id: string,
  statusData: IUpdateOrderStatusDto
) => {
  try {
    const res = await serverFetch.patch(`/orders/${id}/status`, {
      body: JSON.stringify(statusData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to update order status: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to update order status");
    }

    return {
      success: true,
      data: result.data as IOrder,
    };
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return {
      success: false,
      message: error.message || "Failed to update order status",
      data: null,
    };
  }
};

// Cancel order
export const cancelOrder = async (id: string) => {
  try {
    const res = await serverFetch.patch(`/orders/my-orders/${id}/cancel`);

    if (!res.ok) {
      throw new Error(`Failed to cancel order: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to cancel order");
    }

    return {
      success: true,
      data: result.data as IOrder,
    };
  } catch (error: any) {
    console.error("Error cancelling order:", error);
    return {
      success: false,
      message: error.message || "Failed to cancel order",
      data: null,
    };
  }
};

// Get order statistics
export const fetchOrderStatistics = cache(async () => {
  try {
    const res = await serverFetch.get("/orders/my-orders/statistics");

    if (!res.ok) {
      throw new Error(`Failed to fetch order statistics: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch order statistics");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Error fetching order statistics:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch order statistics",
      data: null,
    };
  }
});

// Get admin order statistics
export const fetchAdminOrderStatistics = cache(async () => {
  try {
    const res = await serverFetch.get("/orders/statistics");

    if (!res.ok) {
      throw new Error(`Failed to fetch admin order statistics: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch admin order statistics");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Error fetching admin order statistics:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch admin order statistics",
      data: null,
    };
  }
});