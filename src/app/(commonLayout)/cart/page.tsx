/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EmptyCart from "@/components/modules/Cart/EmptyCart";
import NoAccess from "@/components/modules/Cart/NoAccess";
import PriceFormatter from "@/components/modules/Product/PriceFormatter";
import ProductSideMenu from "@/components/modules/Product/ProductSideMenu";
import QuantityButtons from "@/components/modules/Product/QuantityButtons";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Title } from "@/components/ui/text";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShoppingBag, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import useStore from "../../../../store";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { createOrder } from "@/services/order/order.actions";
import { initPayment } from "@/services/order/payment.actions";
import { redirectToStripeCheckout } from "@/services/order/stripe-utils";

const CartPage = () => {
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    resetCart,
  } = useStore();
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"STRIPE" | "CASH_ON_DELIVERY">("STRIPE");
  
  const groupedItems = useStore((state) => state.getGroupedItems());
  const router = useRouter();

  useEffect(() => {
    console.log('Stripe key:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    console.log('Environment:', process.env.NODE_ENV);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getUserInfo();
        if (user?.id) {
          setUserInfo(user);
          setIsAuthenticated(true);
          
          // Safely check addresses
          if (user.userAddresses && user.userAddresses.length > 0) {
            setAddresses(user.userAddresses);
            const defaultAddr = user.userAddresses.find((a: any) => a.isDefault);
            setSelectedAddress(defaultAddr || user.userAddresses[0]);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  const handleResetCart = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset your cart?"
    );
    if (confirmed) {
      resetCart();
      toast.success("Cart reset successfully!");
    }
  };

  // Helper to get variant info from product
  const getVariantInfo = (product: any) => {
    if (product?.variant) {
      return product.variant;
    }
    
    if (product?.productVariants && product.productVariants.length > 0) {
      const selectedVariant = product.productVariants[0];
      return `${selectedVariant.name}: ${selectedVariant.value}`;
    }
    
    return undefined;
  };

  // Helper to get selected variant ID
  const getVariantId = (product: any) => {
    if (product?.productVariants && product.productVariants.length > 0) {
      return product.productVariants[0].id;
    }
    return undefined;
  };

  const handleCheckout = async () => {
    if (!isAuthenticated || !userInfo) {
      toast.error("Please sign in to checkout");
      router.push("/login?redirect=/cart");
      return;
    }

    if (groupedItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (addresses.length === 0) {
      toast.error("Please add a shipping address first");
      router.push("/profile/addresses");
      return;
    }

    setLoading(true);

    try {
      // Get address details
      const address = selectedAddress?.address;
      const shippingInfo = {
        shippingName: userInfo.name || "Customer",
        shippingAddress: address?.addressLine || "",
        shippingCity: address?.city || "",
        shippingState: address?.state || "",
        shippingZipCode: address?.zipCode || "",
      };

      // Prepare order items
      const orderItems = groupedItems.map(({ product }) => {
        const variantInfo = getVariantInfo(product);
        const variantId = getVariantId(product);
        
        return {
          productId: product?.id || "",
          variantId: variantId,
          quantity: getItemCount(product?.id),
          unitPrice: product?.price || 0,
          productName: product?.name || "Product",
          productSlug: product?.slug || "",
          variantInfo: variantInfo,
        };
      }).filter(item => item.productId && item.quantity > 0);

      if (orderItems.length === 0) {
        throw new Error("No valid items in cart");
      }

      // Calculate totals
      const subtotal = getSubTotalPrice();
      const totalPrice = getTotalPrice();

      // Create order data
      const orderData = {
        userId: userInfo.id,
        customerName: userInfo.name || "Customer",
        customerEmail: userInfo.email || "",
        subtotal,
        totalPrice,
        currency: "USD",
        ...shippingInfo,
        orderItems,
      };

      console.log("Creating order with data:", orderData);

      // Step 1: Create order
      const orderResult = await createOrder(orderData);
      
      if (!orderResult.success) {
        throw new Error(orderResult.message || "Failed to create order");
      }

      const order = orderResult.data;
      
      // Step 2: Handle payment based on method
      if (paymentMethod === "STRIPE") {
        // Use processing page as success URL
        const successUrl = `${window.location.origin}/checkout/processing?order_id=${order.id}`;
        const cancelUrl = `${window.location.origin}/cart`;
        
        const paymentResult = await initPayment(order.id, {
          gateway: paymentMethod,
          successUrl,
          cancelUrl,
        });

        if (!paymentResult.success) {
          throw new Error(paymentResult.message || "Failed to initiate payment");
        }

        const paymentData = paymentResult.data;
        console.log("Payment data received:", paymentData);

        // Store order info for processing page
        localStorage.setItem('pendingOrderId', order.id);
        localStorage.setItem('pendingOrderTime', Date.now().toString());
        
        // Clear cart before redirecting
        resetCart();
        
        // Use the updated redirectToStripeCheckout function
        const redirectResult = await redirectToStripeCheckout(paymentData.sessionId);
        
        if (!redirectResult.success) {
          toast.error(redirectResult.message || "Failed to redirect to Stripe");
          // Fallback to processing page
          router.push(`/checkout/processing?order_id=${order.id}`);
        }
      } else if (paymentMethod === "CASH_ON_DELIVERY") {
        // For COD, go directly to success page
        const successUrl = `${window.location.origin}/checkout/success?order_id=${order.id}`;
        const cancelUrl = `${window.location.origin}/cart`;
        
        const paymentResult = await initPayment(order.id, {
          gateway: paymentMethod,
          successUrl,
          cancelUrl,
        });

        if (!paymentResult.success) {
          throw new Error(paymentResult.message || "Failed to initiate payment");
        }

        // Clear cart
        resetCart();
        
        // Redirect to success page
        router.push(`/checkout/success?order_id=${order.id}`);
        toast.success("Order placed! Pay on delivery.");
      }

    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  // Get primary image
  const getPrimaryImage = (product: any) => {
    if (product?.productImages && product.productImages.length > 0) {
      const primary = product.productImages.find((img: any) => img.isPrimary);
      return primary?.imageUrl || product.productImages[0].imageUrl;
    }
    return "/placeholder.jpg";
  };

  if (checkingAuth) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cart...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return <NoAccess />;
  }

  return (
    <div className="bg-gray-50 pb-52 md:pb-10">
      {isAuthenticated ? (
        <Container>
          {groupedItems?.length ? (
            <>
              <div className="flex items-center gap-2 py-5">
                <ShoppingBag className="text-darkColor" />
                <Title>Shopping Cart</Title>
              </div>
              
              {/* Payment Method Selection */}
              <div className="mb-6 bg-white p-4 rounded-md border">
                <h3 className="text-lg font-semibold mb-3">Select Payment Method</h3>
                <div className="flex gap-4">
                  <Button
                    variant={paymentMethod === "STRIPE" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("STRIPE")}
                    className="flex-1"
                  >
                    Credit/Debit Card (Stripe)
                  </Button>
                  <Button
                    variant={paymentMethod === "CASH_ON_DELIVERY" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("CASH_ON_DELIVERY")}
                    className="flex-1"
                  >
                    Cash on Delivery
                  </Button>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 md:gap-8">
                <div className="lg:col-span-2 rounded-lg">
                  <div className="border bg-white rounded-md">
                    {groupedItems?.map(({ product }) => {
                      const itemCount = getItemCount(product?.id);
                      const primaryImage = getPrimaryImage(product);
                      
                      return (
                        <div
                          key={product?.id}
                          className="border-b p-2.5 last:border-b-0 flex items-center justify-between gap-5"
                        >
                          <div className="flex flex-1 items-start gap-2 h-36 md:h-44">
                            <Link
                              href={`/product/${product?.slug}`}
                              className="border p-0.5 md:p-1 mr-2 rounded-md overflow-hidden group"
                            >
                              <Image
                                src={primaryImage}
                                alt={product?.name || "Product"}
                                width={500}
                                height={500}
                                loading="lazy"
                                className="w-32 md:w-40 h-32 md:h-40 object-cover group-hover:scale-105 hoverEffect"
                              />
                            </Link>
                            <div className="h-full flex flex-1 flex-col justify-between py-1">
                              <div className="flex flex-col gap-0.5 md:gap-1.5">
                                <h2 className="text-base font-semibold line-clamp-1">
                                  {product?.name}
                                </h2>
                                <p className="text-sm capitalize">
                                  Variant:{" "}
                                  <span className="font-semibold">
                                    {getVariantInfo(product) || "Standard"}
                                  </span>
                                </p>
                                <p className="text-sm capitalize">
                                  Status:{" "}
                                  <span className="font-semibold">
                                    {product?.status || "Available"}
                                  </span>
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div>
                                        <ProductSideMenu
                                          product={product}
                                          className="relative top-0 right-0"
                                        />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold">
                                      Add to Favorite
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div>
                                        <Trash
                                          onClick={() => {
                                            deleteCartProduct(product?.id);
                                            toast.success(
                                              "Product deleted successfully!"
                                            );
                                          }}
                                          className="w-4 h-4 md:w-5 md:h-5 mr-1 text-gray-500 hover:text-red-600 hoverEffect cursor-pointer"
                                        />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold bg-red-600">
                                      Delete product
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-start justify-between h-36 md:h-44 p-0.5 md:p-1">
                            <PriceFormatter
                              amount={(product?.price || 0) * itemCount}
                              className="font-bold text-lg"
                            />
                            <QuantityButtons product={product} />
                          </div>
                        </div>
                      );
                    })}
                    <Button
                      onClick={handleResetCart}
                      className="m-5 font-semibold"
                      variant="destructive"
                    >
                      Reset Cart
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="lg:col-span-1">
                    <div className="hidden md:inline-block w-full bg-white p-6 rounded-lg border">
                      <h2 className="text-xl font-semibold mb-4">
                        Order Summary
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>SubTotal</span>
                          <PriceFormatter amount={getTotalPrice()} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Discount</span>
                          <PriceFormatter
                            amount={getSubTotalPrice() - getTotalPrice()}
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between font-semibold text-lg">
                          <span>Total</span>
                          <PriceFormatter
                            amount={getSubTotalPrice()}
                            className="text-lg font-bold text-black"
                          />
                        </div>
                        <Button
                          className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                          size="lg"
                          disabled={loading || addresses.length === 0}
                          onClick={handleCheckout}
                        >
                          {loading ? "Please wait..." : "Proceed to Checkout"}
                        </Button>
                        {addresses.length === 0 && (
                          <p className="text-sm text-red-600 text-center mt-2">
                            Please add a shipping address to checkout
                          </p>
                        )}
                      </div>
                    </div>
                    {addresses && addresses.length > 0 && (
                      <div className="bg-white rounded-md mt-5">
                        <Card>
                          <CardHeader>
                            <CardTitle>Delivery Address</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <RadioGroup
                              value={selectedAddress?.id || ""}
                              onValueChange={(value) => {
                                const addr = addresses.find((a: any) => a.id === value);
                                if (addr) setSelectedAddress(addr);
                              }}
                            >
                              {addresses?.map((address) => (
                                <div
                                  key={address?.id}
                                  className={`flex items-center space-x-2 mb-4 cursor-pointer ${
                                    selectedAddress?.id === address?.id &&
                                    "text-shop_dark_green"
                                  }`}
                                >
                                  <RadioGroupItem
                                    value={address?.id}
                                    id={`address-${address?.id}`}
                                  />
                                  <Label
                                    htmlFor={`address-${address?.id}`}
                                    className="grid gap-1.5 flex-1"
                                  >
                                    <span className="font-semibold">
                                      {address?.addressName}
                                    </span>
                                    <span className="text-sm text-black/60">
                                      {address?.address?.addressLine}, {address?.address?.city},{" "}
                                      {address?.address?.state} {address?.address?.zipCode}
                                    </span>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                            <Button 
                              variant="outline" 
                              className="w-full mt-4"
                              onClick={() => router.push("/profile/addresses")}
                            >
                              Manage Addresses
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>
                {/* Order summary for mobile view */}
                <div className="md:hidden fixed bottom-0 left-0 w-full bg-white pt-2">
                  <div className="bg-white p-4 rounded-lg border mx-4">
                    <h2>Order Summary</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>SubTotal</span>
                        <PriceFormatter amount={getSubTotalPrice()} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Discount</span>
                        <PriceFormatter
                          amount={getSubTotalPrice() - getTotalPrice()}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between font-semibold text-lg">
                        <span>Total</span>
                        <PriceFormatter
                          amount={getTotalPrice()}
                          className="text-lg font-bold text-black"
                        />
                      </div>
                      <Button
                        className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                        size="lg"
                        disabled={loading || addresses.length === 0}
                        onClick={handleCheckout}
                      >
                        {loading ? "Please wait..." : "Proceed to Checkout"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <EmptyCart />
          )}
        </Container>
      ) : (
        <NoAccess />
      )}
    </div>
  );
};

export default CartPage;