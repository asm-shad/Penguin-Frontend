"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { motion } from "motion/react";
import { Check, Home, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import useStore from "../../../../../store";

const SuccessPageContent = () => {
  const { resetCart } = useStore();
  const searchParams = useSearchParams();
  
  // Backend sends these parameters
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    // Clear cart immediately when page loads
    resetCart();
    
    // Log for debugging
    console.log("Success page loaded with:", {
      sessionId,
      orderId,
      timestamp: new Date().toISOString()
    });
  }, [resetCart, sessionId, orderId]);

  // Create a display order number from the order ID
  const displayOrderNumber = orderId 
    ? `ORD-${orderId.substring(0, 8).toUpperCase()}`
    : "Your Order";

  return (
    <div className="py-5 bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center mx-4 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl flex flex-col gap-8 shadow-2xl p-6 max-w-xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
        >
          <Check className="text-green-600 w-10 h-10" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful! 🎉
        </h1>
        
        <div className="space-y-4 mb-4 text-left">
          <p className="text-gray-700">
            Thank you for your purchase! Your payment has been processed successfully.
          </p>
          
          <p className="text-gray-700">
            We&apos;re preparing your order and will ship it soon. A confirmation email 
            with your order details has been sent to your email address.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Reference:</span>
              <span className="text-black font-semibold">{displayOrderNumber}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Status:</span>
              <span className="text-green-600 font-semibold">✅ Paid</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Confirmation:</span>
              <span className="text-black font-semibold">Email Sent</span>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2">📧 Check Your Email</h3>
            <p className="text-sm text-blue-700">
              Your order confirmation has been sent to your email address. 
              You&apos;ll receive shipping updates there as well.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
          >
            <Home className="w-5 h-5 mr-2" />
            Home
          </Link>
          <Link
            href="/orders"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-lightGreen text-black border border-lightGreen rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md"
          >
            <Package className="w-5 h-5 mr-2" />
            Orders
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Shop
          </Link>
        </div>
        
        {/* Help section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-2">Need Help?</h4>
          <p className="text-sm text-gray-600">
            Contact our support team at{" "}
            <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
              support@example.com
            </a>{" "}
            or visit our{" "}
            <Link href="/help" className="text-blue-600 hover:underline">
              Help Center
            </Link>
          </p>
        </div>
        
        {/* Debug info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
            <h4 className="text-sm font-mono text-gray-600 mb-2">Debug Info:</h4>
            <p className="text-xs font-mono break-all">
              Session ID: {sessionId || "None"}<br/>
              Order ID: {orderId || "None"}<br/>
              Timestamp: {new Date().toLocaleTimeString()}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const SuccessPage = () => {
  return (
    <Suspense fallback={
      <div className="py-5 bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your confirmation...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
};

export default SuccessPage;