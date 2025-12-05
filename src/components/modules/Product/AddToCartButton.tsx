"use client";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import { IProduct } from "@/types/product.interface";
import useStore from "../../../../store";
import QuantityButtons from "./QuantityButtons";
import { Button } from "@/components/ui/button";

interface Props {
  product: IProduct;
  className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
  const { addItem, getItemCount, removeItem, deleteCartProduct } = useStore();
  const itemCount = getItemCount(product?.id);
  const isOutOfStock = product?.stock === 0;

  const handleAddToCart = () => {
    if (product?.stock > 0) {
      toast.success(`${product?.name?.substring(0, 12)}... added to cart!`);
      addItem(product);
    } else {
      toast.error("Product is out of stock");
    }
  };

  const handleIncrease = () => {
    if (itemCount < product.stock) {
      toast.success("Quantity Increased successfully!");
      addItem(product);
    } else {
      toast.error("Cannot add more than available stock");
    }
  };

  const handleDecrease = () => {
    if (itemCount > 1) {
      removeItem(product.id);
      toast.success("Quantity decreased!");
    } else {
      // When it's 1 and user clicks decrease, remove the item
      deleteCartProduct(product.id);
      toast.success(`${product?.name?.substring(0, 12)}... removed from cart!`);
    }
  };

  return (
    <div className="w-full h-12 flex items-center">
      {itemCount > 0 ? (
        <div className="text-sm w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs text-darkColor/80">Quantity</span>
            <QuantityButtons
              product={product}
              quantity={itemCount}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
            />
          </div>

          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">Subtotal</span>
            <PriceFormatter
              amount={product?.price ? product?.price * itemCount : 0}
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "w-full bg-shop_dark_green/80 text-lightBg shadow-none border border-shop_dark_green/80 font-semibold tracking-wide text-white hover:bg-shop_dark_green hover:border-shop_dark_green hoverEffect",
            className
          )}
        >
          <ShoppingBag />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
