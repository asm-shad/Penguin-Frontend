"use client";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/types/product.interface";
import useStore from "../../../../store";

interface Props {
  product: IProduct;
  className?: string;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const QuantityButtons = ({
  product,
  className,
  onIncrease,
  onDecrease,
}: Props) => {
  const { getItemCount } = useStore();
  const itemCount = getItemCount(product?.id);
  const isOutOfStock = product?.stock === 0;

  return (
    <div className={cn("flex items-center gap-1 pb-1 text-base", className)}>
      <Button
        onClick={onDecrease}
        variant="outline"
        size="icon"
        disabled={isOutOfStock} // Changed to 1 to prevent going below 0
        className="w-6 h-6 border hover:bg-shop_dark_green/20 hoverEffect"
      >
        <Minus />
      </Button>

      <span className="font-semibold text-sm w-6 text-center text-darkColor">
        {itemCount}
      </span>

      <Button
        onClick={onIncrease}
        variant="outline"
        size="icon"
        disabled={isOutOfStock || itemCount >= product.stock} // Added stock check
        className="w-6 h-6 border hover:bg-shop_dark_green/20 hoverEffect"
      >
        <Plus />
      </Button>
    </div>
  );
};

export default QuantityButtons;
