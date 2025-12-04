"use client";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/types/product.interface";
// import useStore from "@/store"; // If you have a cart store

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
  quantity,
  onIncrease,
  onDecrease,
}: Props) => {
  // If you're using a store, uncomment this:
  // const { addItem, removeItem, getItemCount } = useStore();
  // const itemCount = getItemCount(product?.id);

  const isOutOfStock = product?.stock === 0;

  // If using store, uncomment these:
  /*
  const handleRemoveProduct = () => {
    removeItem(product?.id);
    if (itemCount > 1) {
      toast.success("Quantity Decreased successfully!");
    } else {
      toast.success(`${product?.name?.substring(0, 12)} removed successfully!`);
    }
  };

  const handleAddToCart = () => {
    if (product?.stock > itemCount) {
      addItem(product);
      toast.success("Quantity Increased successfully!");
    } else {
      toast.error("Cannot add more than available stock");
    }
  };
  */

  return (
    <div className={cn("flex items-center gap-1 pb-1 text-base", className)}>
      <Button
        onClick={onDecrease}
        variant="outline"
        size="icon"
        disabled={quantity === 0 || isOutOfStock}
        className="w-6 h-6 border hover:bg-shop_dark_green/20 hoverEffect"
      >
        <Minus />
      </Button>
      <span className="font-semibold text-sm w-6 text-center text-darkColor">
        {quantity}
      </span>
      <Button
        onClick={onIncrease}
        variant="outline"
        size="icon"
        disabled={isOutOfStock}
        className="w-6 h-6 border hover:bg-shop_dark_green/20 hoverEffect"
      >
        <Plus />
      </Button>
    </div>
  );
};

export default QuantityButtons;
