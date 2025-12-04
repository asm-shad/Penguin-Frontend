import AddToCartButton from "@/components/modules/Product/AddToCartButton";
import PriceView from "@/components/modules/Product/PriceView";
import FavoriteButton from "@/components/modules/SingleProduct/FavoriteButton";
import ImageView from "@/components/modules/SingleProduct/ImageView";
import ProductCharacteristics from "@/components/modules/SingleProduct/ProductCharacteristics";
import ProductDetails from "@/components/modules/SingleProduct/ProductDetails";
import Container from "@/components/shared/Container";
import { fetchProductBySlug } from "@/services/product/product.actions";
import { CornerDownLeft, StarIcon, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { RxBorderSplit } from "react-icons/rx";
import { TbTruckDelivery } from "react-icons/tb";

const SingleProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  // Fetch product using your backend API
  const productResult = await fetchProductBySlug(slug);

  if (!productResult.success || !productResult.data) {
    return notFound();
  }

  const product = productResult.data;

  return (
    <>
      <Container className="flex flex-col md:flex-row gap-10 py-10">
        {/* Product Images */}
        {product?.productImages && product.productImages.length > 0 && (
          <ImageView images={product.productImages} isStock={product.stock} />
        )}

        {/* Product Details */}
        <div className="w-full md:w-1/2 flex flex-col gap-5">
          {/* Product Title and Description */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className="text-sm text-gray-600 tracking-wide">
              {product.description}
            </p>
            {/* Ratings */}
            <div className="flex items-center gap-0.5 text-xs">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  size={12}
                  className="text-shop_light_green"
                  fill={
                    index < Math.round(product.averageRating || 0)
                      ? "#3b9c3c"
                      : "none"
                  }
                />
              ))}
              <p className="font-semibold">
                ({product._count?.productReviews || 0} reviews)
              </p>
            </div>
          </div>

          {/* Price and Stock Status */}
          <div className="space-y-2 border-t border-b border-gray-200 py-5">
            <PriceView
              price={product.price}
              discount={product.discount}
              salePrice={product.salePrice}
              className="text-lg font-bold"
            />
            <p
              className={`px-4 py-1.5 text-sm text-center inline-block font-semibold rounded-lg ${
                product.stock === 0
                  ? "bg-red-100 text-red-600"
                  : "text-green-600 bg-green-100"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 lg:gap-3">
            <AddToCartButton product={product} />
            <FavoriteButton showProduct={true} product={product} />
          </div>

          {/* Product Characteristics */}
          <ProductCharacteristics product={product} />

          {/* Additional Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-b-gray-200 py-5 -mt-2">
            <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
              <RxBorderSplit className="text-lg" />
              <p>Compare color</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
              <FaRegQuestionCircle className="text-lg" />
              <p>Ask a question</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
              <TbTruckDelivery className="text-lg" />
              <p>Delivery & Return</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
              <FiShare2 className="text-lg" />
              <p>Share</p>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="flex flex-col">
            <div className="border border-lightColor/25 border-b-0 p-3 flex items-center gap-2.5">
              <Truck size={30} className="text-shop_orange" />
              <div>
                <p className="text-base font-semibold text-black">
                  Free Delivery
                </p>
                <p className="text-sm text-gray-500 underline underline-offset-2">
                  Enter your Postal code for Delivery Availability.
                </p>
              </div>
            </div>
            <div className="border border-lightColor/25 p-3 flex items-center gap-2.5">
              <CornerDownLeft size={30} className="text-shop_orange" />
              <div>
                <p className="text-base font-semibold text-black">
                  Return Delivery
                </p>
                <p className="text-sm text-gray-500 ">
                  Free 30 days Delivery Returns.{" "}
                  <span className="underline underline-offset-2">Details</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Product Details Tabs Section - Full width below */}
      <Container>
        <ProductDetails
          product={product}
          reviews={product.productReviews || []}
        />
      </Container>
    </>
  );
};

export default SingleProductPage;
