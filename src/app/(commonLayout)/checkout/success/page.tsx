/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { getOrderById } from "@/services/order/order.actions";

export default function StripeSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('loading');
  const [message, setMessage] = useState<string>('');
  const [order, setOrder] = useState<any>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId || !orderId) {
        setStatus('error');
        setMessage('Missing payment information');
        return;
      }

      try {
        // First, try to get updated order status
        const orderResult = await getOrderById(orderId);
        
        if (orderResult.success) {
          const orderData = orderResult.data;
          setOrder(orderData);
          
          // Check if payment is already processed
          if (orderData.status === 'PAID' || orderData.status === 'COMPLETED') {
            setStatus('success');
            setMessage('Payment successful!');
            return;
          }
          
          if (orderData.status === 'FAILED' || orderData.status === 'CANCELLED') {
            setStatus('error');
            setMessage(`Payment ${orderData.status.toLowerCase()}`);
            return;
          }
        }

        // If still pending, poll for status
        if (retryCount < 10) { // Max 10 retries
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            verifyPayment();
          }, 2000); // Retry every 2 seconds
        } else {
          setStatus('error');
          setMessage('Payment verification timeout. Please check your email or contact support.');
        }
      } catch (error: any) {
        console.error('Payment verification error:', error);
        
        if (retryCount < 5) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            verifyPayment();
          }, 3000);
        } else {
          setStatus('error');
          setMessage('Unable to verify payment. Please contact support.');
        }
      }
    };

    verifyPayment();
  }, [sessionId, orderId, retryCount]);

  // Update your backend success URL in CartPage:
  const successUrl = `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`;
  const cancelUrl = `${window.location.origin}/checkout/cancelled?order_id=${order.id}`;

  const handleContactSupport = () => {
    // Implement support contact logic
    console.log('Contact support');
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
            <p className="text-sm text-gray-500 mt-2">Attempt {retryCount + 1} of 10</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your order. Your payment has been confirmed.
            </p>
            
            {order && (
              <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mb-6">
                <h3 className="text-xl font-semibold mb-4">Order Details</h3>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-semibold">{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-semibold">${order.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-green-600">{order.status}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => router.push(`/orders/${orderId}`)}
                className="min-w-[200px]"
              >
                View Order Details
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push("/")}
                className="min-w-[200px]"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        );
      
      case 'pending':
        return (
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Payment Processing</h2>
            <p className="text-gray-600 mb-4">
              Your payment is still being processed. This may take a few minutes.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              You&apos;ll receive an email confirmation once it&apos;s complete.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => window.location.reload()}>
                Check Again
              </Button>
              <Button variant="outline" onClick={() => router.push("/orders")}>
                View Orders
              </Button>
            </div>
          </div>
        );
      
      case 'error':
        return (
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Payment Issue</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => router.push("/cart")}>
                Return to Cart
              </Button>
              <Button variant="outline" onClick={handleContactSupport}>
                Contact Support
              </Button>
              <Button variant="ghost" onClick={() => router.push("/orders")}>
                View Orders
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
        {renderContent()}
      </div>
    </div>
  );
}