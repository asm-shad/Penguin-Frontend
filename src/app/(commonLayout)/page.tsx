// app/page.tsx
import HomeBanner from "@/components/Home/HomeBanner";
import HomeCategories from "@/components/Home/HomeCategories";
import LatestBlog from "@/components/Home/LatestBlog";
import ShopByBrands from "@/components/Home/ShopByBrands";
import ProductGrid from "@/components/modules/Product/ProductGrid";
import Container from "@/components/shared/Container";
import { fetchFeaturedCategoriesWithCounts } from "@/services/product/category.actions";

const Home = async () => {
  // Use the new function that fetches featured categories with counts
  const categoriesResult = await fetchFeaturedCategoriesWithCounts();

  // The endpoint already returns only featured categories with counts
  const featuredCategories = categoriesResult.success
    ? categoriesResult.data
    : [];

  return (
    <Container>
      <HomeBanner />
      <ProductGrid />
      <HomeCategories categories={featuredCategories} />
      <ShopByBrands />
      <LatestBlog />
    </Container>
  );
};

export default Home;
