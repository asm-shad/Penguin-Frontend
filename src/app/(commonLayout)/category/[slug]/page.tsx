import CategoryProducts from "@/components/modules/Product/CategoryProducts";
import Container from "@/components/shared/Container";
import { Title } from "@/components/ui/text";
import { fetchCategories } from "@/services/product/category.actions";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  // Fetch categories from your backend
  const categoriesResult = await fetchCategories({
    isFeatured: true,
    sortBy: "name",
    sortOrder: "asc",
  });

  const categories = categoriesResult.success ? categoriesResult.data : [];

  return (
    <div className="py-10">
      <Container>
        <Title>
          Products by Category:{" "}
          <span className="font-bold text-green-600 capitalize tracking-wide">
            {slug && decodeURIComponent(slug)}
          </span>
        </Title>
        <CategoryProducts categories={categories} slug={slug} />
      </Container>
    </div>
  );
};

export default CategoryPage;
