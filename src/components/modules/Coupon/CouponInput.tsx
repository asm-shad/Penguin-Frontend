/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Tag, X, CheckCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import useStore from "../../../../store";

const CouponInput = () => {
  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const {
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    getCouponDiscount,
    getTotalPrice,
    couponValidationResult,
    clearCouponValidation,
  } = useStore();

  // Clear validation message after 3 seconds
  useEffect(() => {
    if (couponValidationResult?.message && !couponValidationResult.isValid) {
      const timer = setTimeout(() => {
        clearCouponValidation();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [couponValidationResult, clearCouponValidation]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsApplying(true);
    try {
      const result = await applyCoupon(couponCode.toUpperCase());

      if (result.success) {
        toast.success(result.message);
        setCouponCode("");
        setShowInput(false);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to apply coupon");
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast.success("Coupon removed");
  };

  const totalBeforeCoupon = getTotalPrice();
  const discount = getCouponDiscount();
  const hasCoupon = !!appliedCoupon;
  const meetsMinAmount = hasCoupon
    ? totalBeforeCoupon >= (appliedCoupon?.minOrderAmount || 0)
    : true;

  if (hasCoupon && meetsMinAmount) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-700">
                Coupon Applied: {appliedCoupon.code}
              </p>
              <p className="text-sm text-green-600">
                {appliedCoupon.discountType === "PERCENTAGE"
                  ? `${appliedCoupon.discountValue}% off`
                  : `$${appliedCoupon.discountValue.toFixed(2)} off`}
                {appliedCoupon.minOrderAmount > 0 &&
                  ` • Min. order: $${appliedCoupon.minOrderAmount.toFixed(2)}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-green-700 font-bold">
              -${discount.toFixed(2)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveCoupon}
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (hasCoupon && !meetsMinAmount) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-700">Coupon Removed</p>
              <p className="text-sm text-amber-600">
                Minimum order amount (${appliedCoupon.minOrderAmount.toFixed(2)}
                ) not met
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveCoupon}
            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (showInput) {
    return (
      <div className="bg-gray-50 border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold">Apply Coupon Code</h3>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            className="font-mono uppercase flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleApplyCoupon();
            }}
          />
          <Button
            onClick={handleApplyCoupon}
            disabled={isApplying || !couponCode.trim()}
            className="min-w-20"
          >
            {isApplying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Apply"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setShowInput(false);
              setCouponCode("");
              clearCouponValidation();
            }}
            disabled={isApplying}
          >
            Cancel
          </Button>
        </div>

        {couponValidationResult?.message && !couponValidationResult.isValid && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {couponValidationResult.message}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-2">
          Enter your coupon code and click Apply
        </p>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => setShowInput(true)}
      className="w-full justify-start"
    >
      <Tag className="h-4 w-4 mr-2" />
      Have a coupon code?
    </Button>
  );
};

export default CouponInput;
