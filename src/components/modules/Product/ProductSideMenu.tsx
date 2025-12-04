/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IProduct } from "@/types/product.interface";

const ProductSideMenu = ({
  product,
  className,
}: {
  product: IProduct;
  className?: string;
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if product is in favorites
  useEffect(() => {
    let mounted = true;

    // Use requestAnimationFrame or setTimeout to defer the state update
    const checkFavorite = () => {
      if (!mounted) return;

      try {
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        const isFav = favorites.some((fav: any) => fav.id === product.id);
        if (mounted) {
          setIsFavorite(isFav);
        }
      } catch (error) {
        console.error("Error reading favorites:", error);
      }
    };

    // Defer the state update
    const timeoutId = setTimeout(checkFavorite, 0);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [product.id]);

  const handleFavorite = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

      if (isFavorite) {
        // Remove from favorites
        const updatedFavorites = favorites.filter(
          (fav: any) => fav.id !== product.id
        );
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        setIsFavorite(false);
        toast.success("Removed from favorites!");
      } else {
        // Add to favorites
        const productToAdd = {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.productImages?.[0]?.imageUrl,
          slug: product.slug,
        };

        favorites.push(productToAdd);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        setIsFavorite(true);
        toast.success("Added to favorites!");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to update favorites");
    }
  };

  return (
    <div
      className={cn(
        "absolute top-2 right-2 hover:cursor-pointer z-20",
        className
      )}
    >
      <div
        onClick={handleFavorite}
        className={`p-2.5 rounded-full hover:bg-shop_dark_green/80 hover:text-white hoverEffect transition-all ${
          isFavorite
            ? "bg-shop_dark_green/80 text-white"
            : "bg-lightColor/10 text-gray-600"
        }`}
      >
        <Heart size={15} fill={isFavorite ? "#ffffff" : "none"} />
      </div>
    </div>
  );
};

export default ProductSideMenu;
