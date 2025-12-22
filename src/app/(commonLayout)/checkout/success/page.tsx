/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Home,
  Package,
  Truck,
  Clock,
  AlertCircle,
  Copy,
  ShoppingBag,
  CreditCard,
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Download,
  Share2,
} from "lucide-react";
import Link from "next/link";
import useStore from "../../../../../store";
import { getOrderById } from "@/services/order/order.actions";
import Container from "@/components/shared/Container";

export const dynamic = "force-dynamic";

const SuccessPageContent = () => {
  const { resetCart } = useStore();
  const searchParams = useSearchParams();

  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");

  const [orderData, setOrderData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [cartCleared, setCartCleared] = useState(false);

  // Move the fetch logic directly into useEffect instead of separate function
  useEffect(() => {
    // Clear cart - this should run only once on mount
    if (!cartCleared) {
      resetCart();
      // Use setTimeout to make setState asynchronous
      setTimeout(() => {
        setCartCleared(true);
      }, 0);
      console.log("Cart cleared on success page");
    }
  }, [resetCart, cartCleared]);

  useEffect(() => {
    // Fetch order details if we have orderId
    const fetchOrderData = async () => {
      if (!orderId) return;

      try {
        const result = await getOrderById(orderId);
        if (result.success && result.data) {
          // Use setTimeout to make setState asynchronous
          setTimeout(() => {
            setOrderData(result.data);
          }, 0);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    if (orderId) {
      fetchOrderData();
    }

    // Log for debugging
    // console.log("Success page loaded with:", { sessionId, orderId });
  }, [orderId, sessionId]);

  const displayOrderNumber =
    orderData?.orderNumber ||
    (orderId ? `ORD-${orderId.substring(0, 8).toUpperCase()}` : "Your Order");

  const hasShippingInfo = orderData?.shipping !== null;
  const trackingNumber = orderData?.shipping?.trackingNumber;
  const carrier = orderData?.shipping?.carrier;
  const shippingStatus = orderData?.status;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getOrderProgress = () => {
    const steps = [
      { label: "Order Placed", status: "completed" },
      { label: "Payment Processed", status: "completed" },
      {
        label: "Processing",
        status: shippingStatus === "PROCESSING" ? "current" : "pending",
      },
      {
        label: "Shipped",
        status:
          shippingStatus === "SHIPPED" || shippingStatus === "DELIVERED"
            ? "completed"
            : "pending",
      },
      {
        label: "Delivered",
        status: shippingStatus === "DELIVERED" ? "completed" : "pending",
      },
    ];
    return steps;
  };

  return (
    <Container>
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
        {/* Header Banner */}
        <div className="bg-linear-to-r from-green-500 to-emerald-600 text-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="bg-white/20 p-3 rounded-full">
                  <Check className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Order Confirmed!</h1>
                  <p className="text-green-100">
                    Thank you for your purchase,{" "}
                    {orderData?.customerName || "Customer"}!
                  </p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-sm text-green-100">Order Reference</p>
                <p className="text-2xl font-bold tracking-wider">
                  {displayOrderNumber}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Success Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                  <div className="bg-green-100 p-4 rounded-full">
                    <Check className="w-12 h-12 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Payment Successful! 🎉
                    </h2>
                    <p className="text-gray-600">
                      Your order has been received and payment has been
                      processed successfully. We&apos;ve sent a confirmation
                      email to{" "}
                      <span className="font-semibold text-blue-600">
                        {orderData?.customerEmail}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Order Progress */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Progress
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    {getOrderProgress().map((step, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                            step.status === "completed"
                              ? "bg-green-500 text-white"
                              : step.status === "current"
                              ? "bg-blue-500 text-white ring-4 ring-blue-100"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          {step.status === "completed" ? (
                            <Check className="w-6 h-6" />
                          ) : (
                            <span className="font-bold">{index + 1}</span>
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            step.status === "completed"
                              ? "text-green-600"
                              : step.status === "current"
                              ? "text-blue-600"
                              : "text-gray-500"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{
                        width:
                          shippingStatus === "DELIVERED"
                            ? "100%"
                            : shippingStatus === "SHIPPED"
                            ? "75%"
                            : "50%",
                      }}
                    ></div>
                  </div>
                </div>

                {/* Tracking Information */}
                {hasShippingInfo && trackingNumber ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Truck className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-blue-900">
                          Your Package is Shipped!
                        </h3>
                        <p className="text-blue-700">
                          Track your package with {carrier}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          Tracking Number
                        </p>
                        <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
                          <code className="font-mono text-xl font-bold text-gray-900">
                            {trackingNumber}
                          </code>
                          <button
                            onClick={() => copyToClipboard(trackingNumber)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                            {copied ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Link
                          href={`/tracking/${trackingNumber}`}
                          className="flex-1 text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                          <Truck className="inline w-5 h-5 mr-2" />
                          Track Package
                        </Link>
                        <Link
                          href="/orders"
                          className="flex-1 text-center bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                        >
                          <Package className="inline w-5 h-5 mr-2" />
                          View Order Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-amber-100 p-3 rounded-lg">
                        <Clock className="w-8 h-8 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-amber-900">
                          Processing Your Order
                        </h3>
                        <p className="text-amber-700">
                          Your order is being prepared for shipment
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-amber-800">
                        <AlertCircle className="inline w-4 h-4 mr-2" />
                        Tracking information will be available once your package
                        is shipped. Typically within 24-48 hours.
                      </p>
                      <div className="grid grid-cols-4 gap-2 mt-4">
                        {[
                          "Order Confirmed",
                          "Processing",
                          "Ready to Ship",
                          "Shipped",
                        ].map((step, index) => (
                          <div key={index} className="text-center">
                            <div
                              className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                                index === 0
                                  ? "bg-amber-500 text-white"
                                  : "bg-gray-200 text-gray-400"
                              }`}
                            >
                              {index === 0 ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <span className="text-sm font-bold">
                                  {index + 1}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                {orderData?.orderItems && orderData.orderItems.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        Order Summary
                      </h3>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                          <Download className="w-4 h-4" />
                          Download Invoice
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                      </div>
                    </div>
                    <div className="border rounded-xl overflow-hidden">
                      <div className="bg-gray-50 px-6 py-4 border-b">
                        <div className="grid grid-cols-12 text-sm font-semibold text-gray-600">
                          <div className="col-span-7">Product</div>
                          <div className="col-span-2 text-center">Quantity</div>
                          <div className="col-span-3 text-right">Price</div>
                        </div>
                      </div>
                      <div className="divide-y">
                        {orderData.orderItems.map((item: any) => (
                          <div
                            key={item.id}
                            className="px-6 py-4 hover:bg-gray-50"
                          >
                            <div className="grid grid-cols-12 items-center">
                              <div className="col-span-7">
                                <div className="flex items-center gap-4">
                                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <Package className="w-8 h-8 text-gray-400" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {item.productName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {item.productSlug}
                                    </p>
                                    {item.variantInfo && (
                                      <p className="text-xs text-gray-400">
                                        {item.variantInfo}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="col-span-2 text-center">
                                <span className="font-medium">
                                  {item.quantity}
                                </span>
                              </div>
                              <div className="col-span-3 text-right">
                                <p className="font-bold text-gray-900">
                                  ${(item.unitPrice * item.quantity).toFixed(2)}
                                </p>
                                {item.discount > 0 && (
                                  <p className="text-xs text-green-600">
                                    Saved: ${item.discount.toFixed(2)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-gray-50 px-6 py-4 border-t">
                        <div className="space-y-2">
                          <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>${orderData.subtotal?.toFixed(2)}</span>
                          </div>
                          {orderData.discountAmount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Discount</span>
                              <span>
                                -${orderData.discountAmount?.toFixed(2)}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                            <span>Total Amount</span>
                            <span>${orderData.totalPrice?.toFixed(2)}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Paid via Stripe • {orderData.currency}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Next Steps Card */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  What&apos;s Next?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Check Your Email
                    </h4>
                    <p className="text-sm text-gray-600">
                      You&apos;ll receive order confirmation and shipping
                      updates via email
                    </p>
                  </div>
                  <div className="text-center p-6 border rounded-xl hover:border-green-300 hover:bg-green-50 transition-colors">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Truck className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Track Your Order
                    </h4>
                    <p className="text-sm text-gray-600">
                      Use our tracking page to monitor your package in real-time
                    </p>
                  </div>
                  <div className="text-center p-6 border rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-colors">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Safe Delivery
                    </h4>
                    <p className="text-sm text-gray-600">
                      Your package is insured and handled with care
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Order Details Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Order Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order Number</p>
                    <p className="font-mono font-bold text-gray-900">
                      {displayOrderNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order Date</p>
                    <p className="font-medium text-gray-900">
                      {orderData?.orderDate
                        ? formatDate(orderData.orderDate)
                        : "Today"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order Status</p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        shippingStatus === "DELIVERED"
                          ? "bg-green-100 text-green-800"
                          : shippingStatus === "SHIPPED"
                          ? "bg-blue-100 text-blue-800"
                          : shippingStatus === "PROCESSING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {shippingStatus || "Processing"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        Credit Card • Stripe
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${orderData?.totalPrice?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Recipient</p>
                    <p className="font-medium text-gray-900">
                      {orderData?.shippingName || orderData?.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Address</p>
                    <p className="text-gray-900">
                      {orderData?.shippingAddress || "Address not specified"}
                    </p>
                    <p className="text-gray-600">
                      {orderData?.shippingCity}, {orderData?.shippingState}{" "}
                      {orderData?.shippingZipCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-blue-600">
                      {orderData?.customerEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Estimated Timeline */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Estimated Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Processing</span>
                    <span className="font-medium text-gray-900">1-2 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-900">3-7 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-medium text-gray-900">
                      {orderData?.orderDate
                        ? new Date(
                            new Date(orderData.orderDate).getTime() +
                              9 * 24 * 60 * 60 * 1000
                          ).toLocaleDateString()
                        : "Within 10 days"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/"
                    className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    <Home className="w-5 h-5" />
                    Continue Shopping
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    <Package className="w-5 h-5" />
                    View All Orders
                  </Link>
                  {trackingNumber && (
                    <Link
                      href={`/tracking/${trackingNumber}`}
                      className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <Truck className="w-5 h-5" />
                      Track This Package
                    </Link>
                  )}
                </div>
              </div>

              {/* Support Card */}
              <div className="bg-linear-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-3">
                  Need Help?
                </h3>
                <p className="text-blue-800 mb-4">
                  Our customer support team is here to help with any questions
                  about your order.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-800">support@example.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-800">1-800-ORDER-NOW</span>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Banner */}
          <div className="mt-12 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl font-bold mb-2">
                  Love Your Purchase? Share It!
                </h3>
                <p className="text-emerald-100">
                  Share your shopping experience with friends and family
                </p>
              </div>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
                  <Share2 className="w-5 h-5" />
                  Share Order
                </button>
                <Link
                  href="/"
                  className="flex items-center gap-2 bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Shop More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

const SuccessPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-gray-200 rounded-full"></div>
              <div className="w-24 h-24 border-4 border-green-500 border-t-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Loading Your Order Details
            </h2>
            <p className="mt-2 text-gray-600">
              Please wait while we confirm your purchase...
            </p>
          </div>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
};

export default SuccessPage;
