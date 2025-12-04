import ProductCard from "@/components/modules/Product/ProductCard";
import Container from "@/components/shared/Container";
import { Title } from "@/components/ui/text";
import { fetchHotProducts } from "@/services/product/product.actions";

const HotProductsPage = async () => {
  const result = await fetchHotProducts();
  const products = result.data || [];

  return (
    <div className="py-10 bg-deal-bg">
      <Container>
        <Title className="mb-5 underline underline-offset-4 decoration text-base uppercase tracking-wide">
          Hot Deals of the Week
        </Title>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {products?.map((product) => (
            <ProductCard key={product?.id} product={product} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default HotProductsPage;
