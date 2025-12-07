/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useOrders.ts
import { useState, useCallback } from "react";
import { initPayment, initSSLPayment } from "@/services/order/payment.actions";
import { redirectToStripeCheckout } from "@/services/order/stripe-utils";
import { cancelOrder, createOrder, fetchMyOrders, fetchOrderById, fetchOrderStatistics } from "@/services/order/order.actions";

export const useOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNewOrder = useCallback(async (orderData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await createOrder(orderData);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMyOrders = useCallback(async (filters?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchMyOrders(filters);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrderDetails = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchOrderById(id);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelMyOrder = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await cancelOrder(id);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchOrderStatistics();
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createNewOrder,
    getMyOrders,
    getOrderDetails,
    cancelMyOrder,
    getStatistics,
  };
};

export const usePayments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = useCallback(async (orderId: string, gateway = "STRIPE", urls?: { successUrl?: string; cancelUrl?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await initPayment(orderId, {
        gateway,
        successUrl: urls?.successUrl,
        cancelUrl: urls?.cancelUrl,
      });
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Handle Stripe redirect
      if (gateway === "STRIPE" && result.data?.sessionId) {
        await redirectToStripeCheckout(result.data.sessionId);
      }
      
      // Handle SSL redirect
      if (gateway === "SSLCOMMERZ" && result.data?.url) {
        window.location.href = result.data.url;
      }
      
      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const initiateSSLPayment = useCallback(async (orderId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await initSSLPayment(orderId);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Redirect to SSL payment page
      if (result.data?.url) {
        window.location.href = result.data.url;
      }
      
      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    initiatePayment,
    initiateSSLPayment,
  };
};