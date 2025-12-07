/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail,
  CreditCard,
  Package,
  ShoppingBag,
} from "lucide-react";
import { getOrderById } from "@/services/order/order.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CheckoutProcessingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'processing' | 'success' | 'failed' | 'cancelled' | 'timeout'>('processing');
  const [progress, setProgress] = useState(0);
  const [pollCount, setPollCount] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(30); // seconds
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  // Check localStorage for pending order if no orderId in URL
  useEffect(() => {
    if (!orderId) {
      const savedOrderId = localStorage.getItem('pendingOrderId');
      const savedTime = localStorage.getItem('pendingOrderTime');
      
      if (savedOrderId) {
        const timeElapsed = Date.now() - parseInt(savedTime || '0');
        const maxAge = 30 * 60 * 1000; // 30 minutes
        
        if (timeElapsed < maxAge) {
          router.replace(`/checkout/processing?order_id=${savedOrderId}`);
        } else {
          // Clear expired order
          localStorage.removeItem('pendingOrderId');
          localStorage.removeItem('pendingOrderTime');
          setStatus('timeout');
          setErrorMessage('Your session has expired. Please start over.');
          setLoading(false);
        }
      } else {
        router.push('/cart');
      }
    }
  }, [orderId, router]);

  // Poll for order status updates
// Poll for order status updates
useEffect(() => {
  if (!orderId) return;

  const fetchOrderStatus = async () => {
    try {
      const result = await getOrderById(orderId);
      
      if (result.success) {
        const orderData = result.data;
        setOrder(orderData);
        setLastUpdate(new Date().toLocaleTimeString());
        
        // Determine payment method
        if (orderData.payments && orderData.payments.length > 0) {
          setPaymentMethod(orderData.payments[0].paymentGateway || 'Stripe');
        }
        
        // Check order status
        switch (orderData.status) {
          case 'PAID':
          case 'COMPLETED':
          case 'CONFIRMED':
            setStatus('success');
            setProgress(100);
            
            // Clear localStorage on success
            localStorage.removeItem('pendingOrderId');
            localStorage.removeItem('pendingOrderTime');
            
            // Redirect to success page after 3 seconds
            setTimeout(() => {
              router.push(`/checkout/success?order_id=${orderId}`);
            }, 3000);
            break;
            
          case 'FAILED':
          case 'CANCELLED':
            setStatus('failed');
            setProgress(100);
            setErrorMessage(`Payment ${orderData.status.toLowerCase()}. Please try again.`);
            break;
            
          case 'REFUNDED':
            setStatus('failed');
            setProgress(100);
            setErrorMessage('Payment has been refunded.');
            break;
            
          default:
            // Still processing
            setPollCount(prev => prev + 1);
            
            // Update progress bar (0-90%)
            const newProgress = Math.min(90, pollCount * 10);
            setProgress(newProgress);
            
            // Update estimated time
            setEstimatedTime(Math.max(10, 30 - pollCount * 2));
        }
      }
    } catch (error: any) {
      console.error('Error fetching order:', error);
      setPollCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  fetchOrderStatus();

  // Set up polling interval (every 3 seconds)
  const intervalId = setInterval(fetchOrderStatus, 3000);

  // Set timeout for maximum wait time (2 minutes)
  const timeoutId = setTimeout(() => {
    if (status === 'processing') {
      setStatus('timeout');
      setErrorMessage('Payment verification is taking longer than expected. Please check your email for confirmation.');
      clearInterval(intervalId);
    }
  }, 120000); // 2 minutes

  return () => {
    clearInterval(intervalId);
    clearTimeout(timeoutId);
  };
}, [orderId, pollCount, status, router]);

  // Animate progress bar for processing state
  useEffect(() => {
    if (status === 'processing' && progress < 90) {
      const timer = setTimeout(() => {
        setProgress(prev => Math.min(prev + 1, 90));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [progress, status]);

  const handleRetryPayment = () => {
    if (orderId) {
      router.push(`/payments/${orderId}/retry`);
    }
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent(`Payment Issue - Order #${order?.orderNumber || orderId}`);
    const body = encodeURIComponent(`Hello,\n\nI'm having an issue with my payment for order #${order?.orderNumber || orderId}.\n\nPlease assist.`);
    window.open(`mailto:support@example.com?subject=${subject}&body=${body}`, '_blank');
  };

  const renderProcessingState = () => (
    <div className="text-center space-y-6">
      <div className="relative inline-block">
        <div className="relative">
          <Loader2 className="h-20 w-20 animate-spin text-primary" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Clock className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="absolute -top-2 -right-2">
          <Badge variant="outline" className="animate-pulse bg-primary/10">
            Live
          </Badge>
        </div>
      </div>
      
      <div>
        <h2 className="text-3xl font-bold mb-2">Processing Your Payment</h2>
        <p className="text-gray-600">
          Please wait while we confirm your payment with {paymentMethod || 'the payment processor'}.
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Payment Initiated</span>
          <span>Verifying...</span>
          <span>Confirming Order</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="flex flex-col items-center space-y-2 p-3 bg-blue-50 rounded-lg">
            <CreditCard className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium">Payment Processing</span>
          </div>
          <div className="flex flex-col items-center space-y-2 p-3 bg-yellow-50 rounded-lg">
            <Package className="h-6 w-6 text-yellow-600" />
            <span className="text-sm font-medium">Order Verification</span>
          </div>
          <div className="flex flex-col items-center space-y-2 p-3 bg-green-50 rounded-lg">
            <ShoppingBag className="h-6 w-6 text-green-600" />
            <span className="text-sm font-medium">Order Confirmation</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-500">
          <Clock className="inline h-4 w-4 mr-1" />
          Estimated time remaining: <span className="font-semibold">{estimatedTime}</span> seconds
        </p>
        <p className="text-sm text-gray-500">
          Polling attempts: <span className="font-semibold">{pollCount}</span>
        </p>
        {lastUpdate && (
          <p className="text-xs text-gray-400">
            Last update: {lastUpdate}
          </p>
        )}
      </div>

      <div className="pt-4 border-t">
        <p className="text-sm text-gray-600 mb-4">
          <AlertCircle className="inline h-4 w-4 mr-1" />
          Do not close this window or refresh the page
        </p>
      </div>
    </div>
  );

  const renderSuccessState = () => (
    <div className="text-center space-y-6 animate-in fade-in duration-500">
      <div className="relative inline-block">
        <CheckCircle className="h-20 w-20 text-green-500" />
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-green-500">Complete</Badge>
        </div>
      </div>
      
      <div>
        <h2 className="text-3xl font-bold mb-2">Payment Confirmed!</h2>
        <p className="text-gray-600">
          Your payment has been successfully processed. Redirecting you to the order details...
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
        <p className="text-sm text-gray-500 mt-2">
          Redirecting in 3 seconds
        </p>
      </div>
    </div>
  );

  const renderFailedState = () => (
    <div className="text-center space-y-6 animate-in fade-in duration-500">
      <XCircle className="h-20 w-20 text-red-500 mx-auto" />
      
      <div>
        <h2 className="text-3xl font-bold mb-2">Payment Issue</h2>
        <p className="text-gray-600">{errorMessage}</p>
      </div>

      {order && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-gray-600">Order #:</span>
              <span className="font-semibold">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold">${order.totalPrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <Badge variant={order.status === 'FAILED' ? 'destructive' : 'outline'}>
                {order.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={handleRetryPayment}>
          Retry Payment
        </Button>
        <Button variant="outline" onClick={() => router.push('/cart')}>
          Return to Cart
        </Button>
        <Button variant="ghost" onClick={handleContactSupport}>
          Contact Support
        </Button>
      </div>
    </div>
  );

  const renderTimeoutState = () => (
    <div className="text-center space-y-6 animate-in fade-in duration-500">
      <AlertCircle className="h-20 w-20 text-yellow-500 mx-auto" />
      
      <div>
        <h2 className="text-3xl font-bold mb-2">Verification Timeout</h2>
        <p className="text-gray-600">{errorMessage}</p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">What&apos;s Next?</CardTitle>
          <CardDescription>
            Here are your options:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-primary mt-0.5" />
            <div className="text-left">
              <h4 className="font-semibold">Check Your Email</h4>
              <p className="text-sm text-gray-600">
                Look for a confirmation email from us. It may take a few minutes to arrive.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <ShoppingBag className="h-5 w-5 text-primary mt-0.5" />
            <div className="text-left">
              <h4 className="font-semibold">View Your Orders</h4>
              <p className="text-sm text-gray-600">
                Check your order history to see the current status.
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="text-sm text-gray-500">
            <p>Order Reference: <span className="font-mono">{orderId}</span></p>
            <p className="mt-1">Please save this reference for support inquiries.</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => router.push('/orders')}>
          View My Orders
        </Button>
        <Button variant="outline" onClick={() => router.push('/')}>
          Continue Shopping
        </Button>
        <Button variant="ghost" onClick={handleContactSupport}>
          <Mail className="h-4 w-4 mr-2" />
          Email Support
        </Button>
      </div>
    </div>
  );

  const renderOrderDetails = () => {
    if (!order) return null;

    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="items" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="items">Items ({order.orderItems?.length || 0})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="items" className="space-y-3">
              {order.orderItems?.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-500">{item.variantInfo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.unitPrice?.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="shipping">
              {order.shippingAddress ? (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {order.shippingName}</p>
                  <p><strong>Address:</strong> {order.shippingAddress}</p>
                  <p><strong>City:</strong> {order.shippingCity}</p>
                  <p><strong>State:</strong> {order.shippingState}</p>
                  <p><strong>Zip Code:</strong> {order.shippingZipCode}</p>
                </div>
              ) : (
                <p className="text-gray-500">Shipping details will be added after payment confirmation.</p>
              )}
            </TabsContent>
            
            <TabsContent value="payment">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span className="text-green-600">-${order.discountAmount?.toFixed(2) || '0.00'}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${order.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  };

  if (loading && !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Loading Order Details</h1>
        <p className="text-gray-600">Please wait...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Processing</h1>
          <p className="text-gray-600">
            Tracking order #{order?.orderNumber || orderId || 'Loading...'}
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            {status === 'processing' && renderProcessingState()}
            {status === 'success' && renderSuccessState()}
            {status === 'failed' && renderFailedState()}
            {status === 'cancelled' && renderFailedState()}
            {status === 'timeout' && renderTimeoutState()}
          </CardContent>
        </Card>

        {order && renderOrderDetails()}

        {/* Debug information (visible in development only) */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="mt-6 border-dashed border-yellow-300 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Debug Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Order ID:</strong> {orderId}</p>
                  {/* <p><strong>Status:</strong> {order.status}</p> */}
                  <p><strong>Poll Count:</strong> {pollCount}</p>
                </div>
                <div>
                  <p><strong>Payment Method:</strong> {paymentMethod}</p>
                  <p><strong>Progress:</strong> {progress}%</p>
                  <p><strong>Last Update:</strong> {lastUpdate}</p>
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  Refresh Manually
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <button 
              onClick={handleContactSupport}
              className="text-primary hover:underline font-medium"
            >
              Contact our support team
            </button>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            This page will automatically update with your order status.
          </p>
        </div>
      </div>
    </div>
  );
}