import Shop from "@/components/modules/Shop/Shop";
import { fetchCategories } from "@/services/product/category.actions";
import { fetchAllBrands } from "@/services/product/brand.actions";

const ShopPage = async () => {
  const [categoriesResult, brandsResult] = await Promise.all([
    fetchCategories({
      isFeatured: true,
      sortBy: "name",
      sortOrder: "asc",
    }),
    fetchAllBrands(),
  ]);

  const categories = categoriesResult.success ? categoriesResult.data : [];
  const brands = brandsResult.success ? brandsResult.data : [];

  return (
    <div className="bg-white">
      <Shop categories={categories} brands={brands} />
    </div>
  );
};

export default ShopPage;
