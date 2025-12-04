"use client";
import { useFavoritesStore } from "@/components/store";
import { IProduct } from "@/types/product.interface";
import { Heart } from "lucide-react";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";

interface FavoriteButtonProps {
  showProduct?: boolean;
  product?: IProduct;
}

const FavoriteButton = ({
  showProduct = false,
  product,
}: FavoriteButtonProps) => {
  const { favoriteProducts, addToFavorite, removeFromFavorite, isFavorite } =
    useFavoritesStore();

  const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product) return;

    if (isFavorite(product.id)) {
      removeFromFavorite(product.id);
      toast.success("Product removed from favorites!");
    } else {
      addToFavorite(product);
      toast.success("Product added to favorites!");
    }
  };

  // Get primary image URL
  // const getPrimaryImage = () => {
  //   if (product?.productImages) {
  //     const primary = product.productImages.find((img) => img.isPrimary);
  //     return primary?.imageUrl || product.productImages[0]?.imageUrl;
  //   }
  //   return "";
  // };

  return (
    <>
      {!showProduct ? (
        // For navbar/footer - shows count and links to wishlist page
        <Link href="/wishlist" className="group relative">
          <Heart className="w-5 h-5 hover:text-shop_light_green hoverEffect" />
          {favoriteProducts.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-shop_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
              {favoriteProducts.length}
            </span>
          )}
        </Link>
      ) : (
        // For product page - toggle favorite
        <button
          onClick={handleFavorite}
          className="group relative hover:text-shop_light_green hoverEffect border border-shop_light_green/80 hover:border-shop_light_green p-1.5 rounded-sm transition-all duration-200"
          aria-label={
            isFavorite(product?.id || "")
              ? "Remove from favorites"
              : "Add to favorites"
          }
        >
          <Heart
            className={`mt-.5 w-5 h-5 transition-colors ${
              product && isFavorite(product.id)
                ? "text-shop_light_green fill-shop_light_green"
                : "text-shop_light_green/80 group-hover:text-shop_light_green"
            }`}
          />
        </button>
      )}
    </>
  );
};

export default FavoriteButton;
