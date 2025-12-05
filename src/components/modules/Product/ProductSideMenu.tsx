"use client";
import { cn } from "@/lib/utils";
import { IProduct } from "@/types/product.interface";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import useStore from "../../../../store";

const ProductSideMenu = ({
  product,
  className,
}: {
  product: IProduct;
  className?: string;
}) => {
  const { favoriteProduct, addToFavorite } = useStore();

  // ✅ DIRECT COMPUTATION - No useEffect, No duplicate state
  const isFavorite = favoriteProduct.some((item) => item.id === product.id);

  const handleFavorite = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Important for ecommerce - prevent card clicks

    if (product?.id) {
      addToFavorite(product)
        .then(() => {
          // ✅ This works because Zustand state updates IMMEDIATELY
          toast.success(
            isFavorite ? "Removed from wishlist!" : "Added to wishlist!",
            {
              icon: isFavorite ? "❌" : "❤️",
            }
          );
        })
        .catch(() => {
          toast.error("Failed to update wishlist");
        });
    }
  };

  return (
    <div className={cn("absolute top-2 right-2 z-10", className)}>
      <button
        onClick={handleFavorite}
        aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        className={`p-2.5 rounded-full transition-all duration-200 hover:scale-110 ${
          isFavorite
            ? "bg-shop_dark_green text-white shadow-lg"
            : "bg-gray-200 text-gray-700 hover:bg-gray-100"
        }`}
      >
        <Heart
          size={18}
          fill={isFavorite ? "currentColor" : "none"}
          className={isFavorite ? "animate-pulse-scale" : ""}
        />
      </button>
    </div>
  );
};

export default ProductSideMenu;
