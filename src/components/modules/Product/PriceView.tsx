"use client";

import { cn } from "@/lib/utils";

interface PriceViewProps {
  price: number;
  discount: number;
  salePrice?: number;
  className?: string;
}

const PriceView = ({
  price,
  discount,
  salePrice,
  className,
}: PriceViewProps) => {
  const hasDiscount = discount > 0;
  // Use salePrice if provided, otherwise calculate it
  const finalPrice =
    salePrice || (hasDiscount ? price - (price * discount) / 100 : price);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {hasDiscount && (
        <span className="text-sm line-through text-gray-500">
          ${price.toFixed(2)}
        </span>
      )}
      <span className="text-lg font-bold text-shop_dark_green">
        ${finalPrice.toFixed(2)}
      </span>
      {hasDiscount && (
        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
          -{discount}%
        </span>
      )}
    </div>
  );
};

export default PriceView;
