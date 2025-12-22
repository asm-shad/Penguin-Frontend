/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getCookie } from "@/services/auth/tokenHandlers";
import { IUser, IUserAddress } from "@/types/user.interface";
import { CartItem } from "../../../store";
import { getUserInfo } from "../auth/getUserInfo";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export async function createCheckoutSession(
  items: CartItem[],
  address?: IUserAddress,
  couponCode?: string
) {
  try {
    const user: IUser = await getUserInfo();

    console.log("🔄 Starting checkout process for user:", user.email);

    if (!user.id) {
      throw new Error("Please login to checkout");
    }

    let shippingAddress = address;
    if (!shippingAddress && user.userAddresses?.length) {
      shippingAddress =
        user.userAddresses.find((addr) => addr.isDefault) ||
        user.userAddresses[0];
    }

    if (!shippingAddress) {
      throw new Error("Please select a shipping address");
    }

    const accessToken = await getCookie("accessToken");

    // 1. Create order in YOUR backend
    const orderPayload = {
      shippingName: user.name,
      shippingAddress: shippingAddress.address.addressLine,
      shippingCity: shippingAddress.address.city,
      shippingState: shippingAddress.address.state,
      shippingZipCode: shippingAddress.address.zipCode,
      couponCode: couponCode,
      orderItems: items.map((item) => ({
        productId: item.product.id,
        variantId: item.selectedVariant?.id || undefined,
        quantity: item.quantity,
      })),
    };

    console.log("📤 Sending order to backend:", orderPayload);

    const orderResponse = await fetch(`${BACKEND_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify(orderPayload),
    });

    const orderResult = await orderResponse.json();
    console.log("📥 Order response:", {
      success: orderResult.success,
      orderNumber: orderResult.data?.orderNumber,
      subtotal: orderResult.data?.subtotal,
      discountAmount: orderResult.data?.discountAmount,
      totalPrice: orderResult.data?.totalPrice,
    });

    if (!orderResponse.ok) {
      throw new Error(orderResult.message || "Failed to create order");
    }

    const orderId = orderResult.data.id;
    console.log("✅ Order created successfully with ID:", orderId);

    // 2. Initiate payment - use YOUR backend payment endpoint
    const paymentPayload = {
      gateway: "STRIPE",
    };

    console.log("💳 Initiating payment for order:", orderId);

    const paymentResponse = await fetch(
      `${BACKEND_API_URL}/payments/${orderId}/initiate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        body: JSON.stringify(paymentPayload),
      }
    );

    const paymentResult = await paymentResponse.json();
    console.log("💳 Payment response:", paymentResult);

    if (!paymentResponse.ok) {
      throw new Error(paymentResult.message || "Failed to initiate payment");
    }

    console.log("✅ Payment URL received:", paymentResult.data.url);
    return paymentResult.data.url;
  } catch (error: any) {
    console.error("❌ Checkout error:", error);
    throw new Error(error.message || "Checkout failed");
  }
}
