import HomeBanner from "@/components/Home/HomeBanner";
import HomeCategories from "@/components/Home/HomeCategories";
import LatestBlog from "@/components/Home/LatestBlog";
import ShopByBrands from "@/components/Home/ShopByBrands";
import ProductGrid from "@/components/modules/Product/ProductGrid";
import Container from "@/components/shared/Container";
import { fetchFeaturedCategories } from "@/services/product/category.actions";

const Home = async () => {
  const categoriesResult = await fetchFeaturedCategories(6); // Get 6 featured categories

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
