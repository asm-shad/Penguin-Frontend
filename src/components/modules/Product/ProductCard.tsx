import Image from "next/image";
import Link from "next/link";
import { Flame, ShoppingBag, Eye, Heart, StarIcon } from "lucide-react";
import { IProduct } from "@/types/product.interface";
import { Title } from "@/components/ui/text";
import AddToCartButton from "./AddToCartButton";
import PriceView from "./PriceView";
import { ProductStatus, ProductStatusType } from "@/types/user.interface";
import AddToWishlistButton from "./ProductSideMenu";

const ProductCard = ({ product }: { product: IProduct }) => {
  // Get status badge text and style
  const getStatusBadge = (status: ProductStatusType) => {
    switch (status) {
      case ProductStatus.SALE:
        return { text: "Sale!", className: "bg-red-500 text-white" };
      case ProductStatus.HOT:
        return { text: "Hot", className: "bg-orange-500 text-white" };
      case ProductStatus.NEW:
        return { text: "New", className: "bg-green-500 text-white" };
      case ProductStatus.OUT_OF_STOCK:
        return { text: "Out of Stock", className: "bg-gray-500 text-white" };
      default:
        return null;
    }
  };

  const statusBadge = getStatusBadge(product.status);
  const isOutOfStock =
    product.status === ProductStatus.OUT_OF_STOCK || product.stock === 0;
  const primaryImage = product.primaryImage || "/images/placeholder.png";

  return (
    <div className="text-sm border rounded-md border-darkBlue/20 group bg-white hover:shadow-lg transition-shadow duration-300">
      <div className="relative group overflow-hidden bg-shop_light_bg rounded-t-md">
        <Link href={`/product/${product.slug}`}>
          <div className="relative w-full h-64 bg-white">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className={`object-contain p-4 transition-transform duration-500 
                ${!isOutOfStock ? "group-hover:scale-105" : "opacity-50"}`}
              priority={true}
            />
          </div>
        </Link>

        <AddToWishlistButton product={product} />

        {statusBadge && (
          <span
            className={`absolute top-2 left-2 z-10 text-xs px-2 py-1 rounded-full ${statusBadge.className}`}
          >
            {statusBadge.text}
          </span>
        )}

        {product.isFeatured && (
          <span className="absolute top-2 right-2 z-10 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col gap-2">
        {/* Categories */}
        {product.categories && product.categories.length > 0 && (
          <p className="uppercase line-clamp-1 text-xs font-medium text-lightText">
            {product.categories.map((cat) => cat.name).join(", ")}
          </p>
        )}

        {/* Product Name */}
        <Title className="text-sm line-clamp-1 font-semibold hover:text-blue-600">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </Title>

        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500">
            Brand: <span className="font-medium">{product.brand.name}</span>
          </p>
        )}

        {/* Rating */}
        <Title className="text-sm line-clamp-1">{product?.name}</Title>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                size={13}
                key={index}
                className={
                  index < 4
                    ? "text-shop_lighter_green"
                    : "text-shop_lighter_text"
                }
                fill={index < 4 ? "#fbbf24" : "#d1d5db"}
              />
            ))}
          </div>
          <p className="text-lightText text-xs tracking-wide">
            ({product.reviewCount || 0} Reviews)
          </p>
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2.5">
          <p
            className={`font-medium ${
              isOutOfStock ? "text-red-600" : "text-green-600"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : "In Stock"}
          </p>
          {!isOutOfStock && (
            <p className="text-shop_dark_green/80 font-semibold">
              {product.stock} units
            </p>
          )}
        </div>

        {/* Price */}
        <PriceView
          price={product.price}
          discount={product.discount}
          salePrice={product.salePrice}
          className="text-base"
        />

        {/* Add to Cart Button */}
        <AddToCartButton
          product={product}
          className="w-full rounded-md mt-2"
          // disabled={isOutOfStock}
        />
      </div>
    </div>
  );
};

export default ProductCard;
