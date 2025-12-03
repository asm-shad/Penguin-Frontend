// import HomeCategories from "@/components/HomeCategories";
// import LatestBlog from "@/components/LatestBlog";
// import ShopByBrands from "@/components/ShopByBrands";

import HomeBanner from "@/components/Home/HomeBanner";
import ProductGrid from "@/components/modules/Product/ProductGrid";
import Container from "@/components/shared/Container";

const Home = async () => {
  return (
    <Container>
      <HomeBanner />
      <ProductGrid />
    </Container>
  );
};

export default Home;
