/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { IUser, IUserAddress } from "@/types/user.interface";
import useStore from "../../../../store";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { createCheckoutSession } from "@/services/order/createCheckoutSession";
import NoAccess from "@/components/modules/Cart/NoAccess";
import EmptyCart from "@/components/modules/Cart/EmptyCart";
import Container from "@/components/shared/Container";
import { Title } from "@/components/ui/text";
import PriceFormatter from "@/components/modules/Product/PriceFormatter";

// Helper function for price calculations
const calculateItemPrice = (product: any, variant?: any, quantity: number = 1) => {
  const basePrice = variant?.price || product.price || 0;
  const discount = product.discount || 0;
  const discountAmount = (basePrice * discount) / 100;
  const salePrice = basePrice - discountAmount;
  
  return {
    originalPrice: basePrice,
    salePrice: salePrice,
    discountPercent: discount,
    discountAmount: discountAmount,
    originalTotal: basePrice * quantity,
    saleTotal: salePrice * quantity,
    discountTotal: discountAmount * quantity
  };
};

const CartPage = () => {
  const {
    items,
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    getDiscountTotal,
    resetCart,
    getGroupedItems,
  } = useStore();
  
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<IUserAddress | null>(null);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const router = useRouter();
  
  const groupedItems = getGroupedItems();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserInfo();
        setUser(userData);
        
        // Set default address
        if (userData.userAddresses && userData.userAddresses.length > 0) {
          const defaultAddress = userData.userAddresses.find(
            (addr) => addr.isDefault
          );
          setSelectedAddress(defaultAddress || userData.userAddresses[0]);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setAddressesLoading(false);
      }
    };
    
    if (items.length > 0) {
      fetchUser();
    }
  }, [items.length]);

  const handleResetCart = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset your cart?"
    );
    if (confirmed) {
      resetCart();
      toast.success("Cart reset successfully!");
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to checkout");
      router.push("/login");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    setLoading(true);
    try {
      const checkoutUrl = await createCheckoutSession(groupedItems, selectedAddress);
      
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to initiate checkout");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <NoAccess />;
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

  // Calculate totals
  const subtotal = getSubTotalPrice(); // Sum of original prices
  const total = getTotalPrice(); // Sum of sale prices
  const discountTotal = getDiscountTotal(); // Total discount
  const hasDiscount = discountTotal > 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-20 md:pb-10">
      <Container>
        {/* Header */}
        <div className="flex items-center gap-2 py-5">
          <ShoppingBag className="text-darkColor" />
          <Title>Shopping Cart</Title>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border shadow-sm">
              {groupedItems.map(({ product, selectedVariant }) => {
                const itemCount = getItemCount(product.id);
                const priceInfo = calculateItemPrice(product, selectedVariant, itemCount);
                const variant = selectedVariant;
                const hasItemDiscount = priceInfo.discountPercent > 0;

                return (
                  <div
                    key={`${product.id}-${variant?.id || "no-variant"}`}
                    className="border-b p-4 md:p-6 last:border-b-0 flex items-center justify-between gap-4 md:gap-6"
                  >
                    {/* Product Image */}
                    <div className="flex-1 flex items-start gap-4">
                      {product.productImages && product.productImages.length > 0 && (
                        <Link
                          href={`/product/${product.slug}`}
                          className="border p-1 rounded-md overflow-hidden group shrink-0"
                        >
                          <Image
                            src={product.productImages[0].imageUrl}
                            alt={product.name}
                            width={120}
                            height={120}
                            className="w-24 h-24 md:w-32 md:h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                      )}
                      
                      {/* Product Info */}
                      <div className="flex-1">
                        <Link href={`/product/${product.slug}`}>
                          <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        
                        {variant && (
                          <p className="text-sm text-gray-600 mt-1">
                            {variant.name}: {variant.value}
                          </p>
                        )}
                        
                        <div className="mt-4 flex items-center gap-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              deleteCartProduct(product.id);
                              toast.success("Product removed from cart");
                            }}
                            className="flex items-center gap-2"
                          >
                            <Trash className="w-4 h-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex flex-col items-end gap-4">
                      {/* Display both original and sale price if there's a discount */}
                      {hasItemDiscount ? (
                        <div className="text-right">
                          <PriceFormatter
                            amount={priceInfo.originalTotal}
                            className="line-through text-gray-500 text-sm block"
                          />
                          <PriceFormatter
                            amount={priceInfo.saleTotal}
                            className="text-xl font-bold text-green-600 block"
                          />
                          <span className="text-xs font-semibold text-red-600 mt-1 block">
                            Save {priceInfo.discountPercent}%
                          </span>
                        </div>
                      ) : (
                        <PriceFormatter
                          amount={priceInfo.originalTotal}
                          className="text-xl font-bold"
                        />
                      )}
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => useStore.getState().removeItem(product.id)}
                          disabled={itemCount <= 1}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {itemCount}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => useStore.getState().addItem(product, variant)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Reset Cart Button */}
              <div className="p-4 md:p-6">
                <Button
                  onClick={handleResetCart}
                  variant="destructive"
                  className="font-semibold"
                >
                  Reset Cart
                </Button>
              </div>
            </div>
          </div>

          {/* Order Summary - Right Column */}
          <div className="space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                {/* Subtotal - Only show line-through if there's a discount */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <PriceFormatter 
                    amount={subtotal} 
                    className={hasDiscount ? "line-through text-gray-500 text-sm" : "text-base"}
                    showLineThrough={hasDiscount}
                  />
                </div>
                
                {/* Only show Discount section if there's a discount */}
                {hasDiscount && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Discount</span>
                    <PriceFormatter 
                      amount={discountTotal} 
                      className="text-red-600 font-semibold"
                      prefix="-"
                    />
                  </div>
                )}
                
                <Separator />
                
                {/* Total - After discount */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <div className="text-right">
                    <PriceFormatter 
                      amount={total} 
                      className="text-primary text-2xl font-bold"
                    />
                    {hasDiscount && (
                      <p className="text-xs text-green-600 mt-1">
                        You save {((discountTotal / subtotal) * 100).toFixed(1)}%
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Only show savings banner if there's a discount */}
                {hasDiscount && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-sm text-green-700 text-center font-medium">
                      🎉 You&apos;re saving{" "}
                      <span className="font-bold">
                        <PriceFormatter 
                          amount={discountTotal} 
                          className="font-bold"
                          prefix=""
                        />
                      </span>
                    </p>
                  </div>
                )}
                
                <Button
                  className="w-full mt-4 py-6 text-lg font-semibold bg-black hover:bg-gray-800 text-white"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={loading || !selectedAddress || items.length === 0}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Processing...
                    </span>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </Button>
                
                {/* Free shipping notice */}
                {total >= 50 && (
                  <div className="mt-3 p-2 bg-blue-50 rounded text-center">
                    <p className="text-sm text-blue-700">
                      🚚 Free shipping on orders over $50
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Address Selection Card */}
            {user.userAddresses && user.userAddresses.length > 0 && (
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                {addressesLoading ? (
                  <div className="text-center py-4">
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
                    <p className="mt-2 text-gray-500 text-sm">Loading addresses...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {user.userAddresses.map((address) => (
                      <div
                        key={address.id}
                        onClick={() => setSelectedAddress(address)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedAddress?.id === address.id
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold flex items-center gap-2">
                              {address.addressName}
                              {address.isDefault && (
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 mt-2">
                              <p className="font-medium">{address.address?.addressLine}</p>
                              <p>
                                {address.address?.city}, {address.address?.state}{" "}
                                {address.address?.zipCode}
                              </p>
                              {address.address?.country && (
                                <p>{address.address.country}</p>
                              )}
                              {address.email && (
                                <p className="mt-1 text-blue-600">Email: {address.email}</p>
                              )}
                            </div>
                          </div>
                          <div className={`h-4 w-4 rounded-full border ${
                            selectedAddress?.id === address.id 
                              ? "bg-primary border-primary" 
                              : "border-gray-300"
                          }`}>
                            {selectedAddress?.id === address.id && (
                              <div className="h-2 w-2 bg-white rounded-full m-auto mt-0.5"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => router.push("/account/addresses")}
                >
                  Manage Addresses
                </Button>
              </div>
            )}
            
            {/* Cart Summary */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="font-semibold mb-4">Cart Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items in cart:</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total quantity:</span>
                  <span className="font-medium">
                    {items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {hasDiscount ? "Original price:" : "Subtotal:"}
                  </span>
                  <PriceFormatter 
                    amount={subtotal} 
                    className={hasDiscount ? "line-through text-gray-500" : "font-medium"}
                    showLineThrough={hasDiscount}
                  />
                </div>
                {hasDiscount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount applied:</span>
                    <PriceFormatter 
                      amount={discountTotal} 
                      className="text-red-600 font-semibold"
                      prefix="-"
                    />
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>You pay:</span>
                  <PriceFormatter amount={total} className="text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CartPage;