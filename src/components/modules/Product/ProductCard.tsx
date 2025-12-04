import Image from "next/image";
import Link from "next/link";
import { Flame } from "lucide-react";
import { Star } from "lucide-react";
import { Title } from "@/components/ui/text";
import PriceView from "@/components/modules/Product/PriceView";
import { IProduct } from "@/types/product.interface";
import AddToCartButton from "./AddToCartButton";
import ProductSideMenu from "./ProductSideMenu";

const ProductCard = ({ product }: { product: IProduct }) => {
  // Get primary image
  const primaryImage =
    product.productImages?.find((img) => img.isPrimary)?.imageUrl ||
    product.productImages?.[0]?.imageUrl;

  // Get categories
  const categories =
    product.productCategories?.map((pc) => pc.category.name) || [];

  // Safely get review count
  const reviewCount = product._count?.productReviews || 0;

  return (
    <div className="text-sm border rounded-md border-darkBlue/20 group bg-white hover:shadow-lg transition-shadow">
      <div className="relative group overflow-hidden bg-shop_light_bg">
        {primaryImage && (
          <Link href={`/products/${product?.slug}`}>
            <Image
              src={primaryImage}
              alt={product.name}
              width={500}
              height={500}
              priority
              className={`w-full h-64 object-cover object-center overflow-hidden transition-transform bg-shop_light_bg duration-500 
  ${product?.stock !== 0 ? "group-hover:scale-105" : "opacity-50"}`}
            />
          </Link>
        )}

        {/* Wishlist button */}
        <ProductSideMenu product={product} />

        {/* Flame icon for HOT status */}
        {product?.status === "HOT" && (
          <div className="absolute top-2 left-2 z-10 border border-shop_orange/50 p-1 rounded-full group-hover:border-shop_orange hover:text-shop_dark_green hoverEffect bg-white/80">
            <Flame
              size={18}
              fill="#fb6c08"
              className="text-shop_orange/50 group-hover:text-shop_orange hoverEffect"
            />
          </div>
        )}

        {/* Sale badge */}
        {product?.discount > 0 && (
          <div className="absolute top-2 left-10 z-10 text-xs bg-red-500 text-white px-2 py-1 rounded-full font-semibold">
            -{product.discount}%
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-2">
        {/* Categories */}
        {categories.length > 0 && (
          <p className="uppercase line-clamp-1 text-xs font-medium text-lightText">
            {categories.join(", ")}
          </p>
        )}

        {/* Product Name */}
        <Title className="text-sm line-clamp-1 hover:text-shop_dark_green transition-colors">
          <Link href={`/products/${product?.slug}`}>{product?.name}</Link>
        </Title>

        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500">{product.brand.name}</p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={index < 4 ? "text-yellow-400" : "text-gray-300"}
                size={14}
                fill={index < 4 ? "#fbbf24" : "#d1d5db"}
              />
            ))}
          </div>
          <p className="text-lightText text-xs tracking-wide">
            {reviewCount} Review{reviewCount !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-2 h-2 rounded-full ${
              product?.stock > 0 ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <p
            className={`text-sm ${
              product?.stock === 0
                ? "text-red-600"
                : "text-shop_dark_green/80 font-semibold"
            }`}
          >
            {product?.stock > 0 ? `${product?.stock} in stock` : "Out of Stock"}
          </p>
        </div>

        {/* Price */}
        <PriceView
          price={product?.price}
          discount={product?.discount}
          salePrice={product?.salePrice}
          className="text-sm"
        />

        {/* Add to Cart Button */}
        <AddToCartButton
          product={product}
          className="w-full rounded-full mt-2"
        />
      </div>
    </div>
  );
};

export default ProductCard;
