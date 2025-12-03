import Link from "next/link";
import { Title } from "../ui/text";
import { ICategory } from "@/types/product.interface";
import CategoryImage from "./CategoryImage";

interface HomeCategoriesProps {
  categories: ICategory[];
}

const HomeCategories = ({ categories }: HomeCategoriesProps) => {
  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&h=500&fit=crop";

  return (
    <div className="bg-white border border-shop_light_green/20 my-10 md:my-20 p-5 lg:p-7 rounded-md">
      <Title className="border-b pb-3">Popular Categories</Title>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories?.map((category) => {
          // Calculate product count from multiple possible sources
          let productCount = 0;

          // 1. Check for direct productCount property
          if (typeof category.productCount === "number") {
            productCount = category.productCount;
          }
          // 2. Check for Prisma _count object
          else if (category._count?.productCategories !== undefined) {
            productCount = category._count.productCategories;
          }
          // 3. Check for productCategories array length
          else if (
            category.productCategories &&
            category.productCategories.length > 0
          ) {
            productCount = category.productCategories.length;
          }

          return (
            <div
              key={category.id}
              className="bg-shop_light_bg p-5 flex items-center gap-3 group"
            >
              <div className="overflow-hidden border border-shop_orange/30 hover:border-shop_orange hoverEffect w-20 h-20 p-1">
                <Link href={`/category/${category.slug}`}>
                  <CategoryImage
                    src={category.imageUrl || FALLBACK_IMAGE}
                    alt={category.name || "Category image"}
                    fallbackSrc={FALLBACK_IMAGE}
                    href={`/category/${category.slug}`}
                  />
                </Link>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold">{category.name}</h3>
                <p className="text-sm">
                  <span className="font-bold text-shop_dark_green">{`(${productCount})`}</span>{" "}
                  items Available
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeCategories;
