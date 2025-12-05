"use client";
import { IProduct } from "@/types/product.interface";
import { Heart } from "lucide-react";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import useStore from "../../../../store";

const FavoriteButton = ({
  showProduct = false,
  product,
}: {
  showProduct?: boolean;
  product?: IProduct | null | undefined;
}) => {
  const { favoriteProduct, addToFavorite } = useStore();

  const isFavorite = product?.id
    ? favoriteProduct.some((item) => item?.id === product.id)
    : false;

  const handleFavorite = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering parent click events

    if (product?.id) {
      addToFavorite(product)
        .then(() => {
          // Use isFavorite (current state before toggle) for accurate message
          toast.success(
            isFavorite ? "Removed from favorites!" : "Added to favorites!",
            {
              icon: isFavorite ? "❌" : "❤️",
              duration: 2000,
            }
          );
        })
        .catch((error) => {
          toast.error("Failed to update favorites");
          console.error("Favorite error:", error);
        });
    }
  };

  return (
    <>
      {!showProduct ? (
        // Wishlist icon with count (for navbar/header)
        <Link
          href="/wishlist"
          className="group relative"
          aria-label={`Wishlist (${favoriteProduct.length} items)`}
        >
          <Heart className="w-5 h-5 hover:text-shop_light_green transition-colors duration-200" />
          {favoriteProduct.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-shop_dark_green text-white h-4 w-4 rounded-full text-xs font-semibold flex items-center justify-center animate-pulse">
              {favoriteProduct.length}
            </span>
          )}
        </Link>
      ) : (
        // Favorite toggle button (for product cards)
        <button
          onClick={handleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className="group relative hover:text-shop_light_green transition-all duration-200 border border-shop_light_green/80 hover:border-shop_light_green p-1.5 rounded-sm focus:outline-none focus:ring-2 focus:ring-shop_light_green/50"
          disabled={!product?.id}
        >
          <Heart
            className={`mt-.5 w-5 h-5 transition-colors ${
              isFavorite
                ? "text-shop_light_green fill-shop_light_green"
                : "text-shop_light_green/80 group-hover:text-shop_light_green"
            }`}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
      )}
    </>
  );
};

export default FavoriteButton;
