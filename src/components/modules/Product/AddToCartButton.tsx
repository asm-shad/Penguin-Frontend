"use client";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/types/product.interface";
import { useState } from "react";
import toast from "react-hot-toast";
import QuantityButtons from "@/components/modules/Product/QuantityButtons";
import PriceFormatter from "@/components/modules/Product/PriceFormatter";

interface Props {
  product: IProduct;
  className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
  const [quantity, setQuantity] = useState(0);
  const isOutOfStock = product?.stock === 0;

  const handleAddToCart = () => {
    if (product?.stock > 0) {
      setQuantity(1);
      toast.success(`${product?.name?.substring(0, 12)}... added to cart!`);
      // If using store: addItem(product);
    } else {
      toast.error("Product is out of stock");
    }
  };

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
      toast.success("Quantity Increased successfully!");
      // If using store: addItem(product);
    } else {
      toast.error("Cannot add more than available stock");
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      toast.success("Quantity Decreased successfully!");
      // If using store: removeItem(product.id);
    } else {
      setQuantity(0);
      toast.success(`${product?.name?.substring(0, 12)}... removed from cart!`);
      // If using store: removeItem(product.id);
    }
  };

  return (
    <div className="w-full h-12 flex items-center">
      {quantity > 0 ? (
        <div className="text-sm w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs text-darkColor/80">Quantity</span>
            <QuantityButtons
              product={product}
              quantity={quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
            />
          </div>
          <div className="flex items-center justify-between border-t pt-1 mt-1">
            <span className="text-xs font-semibold">Subtotal</span>
            <PriceFormatter
              amount={product?.price * quantity}
              className="text-sm"
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
          <ShoppingBag /> {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
