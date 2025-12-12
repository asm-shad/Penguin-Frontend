/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { IPayment } from "@/types/order.interface";
import { IInitiateRefundDto, IInitPaymentDto, IUpdatePaymentStatusDto } from "@/types/orderPayment";


// Initialize payment
export const initPayment = async (orderId: string, paymentData: IInitPaymentDto) => {
  try {
    const res = await serverFetch.post(`/payments/${orderId}/initiate`, {
      body: JSON.stringify(paymentData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to initiate payment: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to initiate payment");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Error initiating payment:", error);
    return {
      success: false,
      message: error.message || "Failed to initiate payment",
      data: null,
    };
  }
};

// Initialize SSL payment
export const initSSLPayment = async (orderId: string) => {
  try {
    const res = await serverFetch.post(`/payments/${orderId}/initiate-ssl`);

    if (!res.ok) {
      throw new Error(`Failed to initiate SSL payment: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to initiate SSL payment");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Error initiating SSL payment:", error);
    return {
      success: false,
      message: error.message || "Failed to initiate SSL payment",
      data: null,
    };
  }
};

// Create payment (admin)
export const createPayment = async (
  orderId: string,
  paymentData: {
    paymentMethod: string;
    paymentGateway: string;
    amount: number;
    transactionId?: string;
    gatewayResponse?: any;
  }
) => {
  try {
    const res = await serverFetch.post(`/payments/order/${orderId}`, {
      body: JSON.stringify(paymentData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to create payment: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to create payment");
    }

    return {
      success: true,
      data: result.data as IPayment,
    };
  } catch (error: any) {
    console.error("Error creating payment:", error);
    return {
      success: false,
      message: error.message || "Failed to create payment",
      data: null,
    };
  }
};

// Update payment status
export const updatePaymentStatus = async (
  paymentId: string,
  statusData: IUpdatePaymentStatusDto
) => {
  try {
    const res = await serverFetch.patch(`/payments/${paymentId}/status`, {
      body: JSON.stringify(statusData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to update payment status: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to update payment status");
    }

    return {
      success: true,
      data: result.data as IPayment,
    };
  } catch (error: any) {
    console.error("Error updating payment status:", error);
    return {
      success: false,
      message: error.message || "Failed to update payment status",
      data: null,
    };
  }
};

// Initiate refund
export const initiateRefund = async (
  paymentId: string,
  refundData: IInitiateRefundDto
) => {
  try {
    const res = await serverFetch.patch(`/payments/${paymentId}/refund`, {
      body: JSON.stringify(refundData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to initiate refund: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to initiate refund");
    }

    return {
      success: true,
      data: result.data as IPayment,
    };
  } catch (error: any) {
    console.error("Error initiating refund:", error);
    return {
      success: false,
      message: error.message || "Failed to initiate refund",
      data: null,
    };
  }
};

// Handle SSL IPN (public endpoint - no auth needed)
export const handleSSLIPN = async (queryParams: Record<string, string>) => {
  try {
    const queryString = new URLSearchParams(queryParams).toString();
    const endpoint = queryString ? `/payments/ipn?${queryString}` : "/payments/ipn";
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}${endpoint}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to handle SSL IPN: ${res.statusText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to handle SSL IPN");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Error handling SSL IPN:", error);
    return {
      success: false,
      message: error.message || "Failed to handle SSL IPN",
      data: null,
    };
  }
};

// Handle Stripe webhook (public endpoint - no auth needed)
export const handleStripeWebhook = async (payload: any, signature: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Stripe-Signature": signature,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to handle Stripe webhook: ${res.statusText}`);
    }

    const result = await res.json();
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("Error handling Stripe webhook:", error);
    return {
      success: false,
      message: error.message || "Failed to handle Stripe webhook",
      data: null,
    };
  }
};