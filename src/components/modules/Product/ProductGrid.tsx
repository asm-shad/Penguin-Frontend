"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";
import HomeTabbar from "./HomeTabbar";
import Container from "@/components/shared/Container";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import { ICategory, IProduct } from "@/types/product.interface";
import {
  fetchCategories,
  fetchProducts,
} from "@/services/product/product.actions";

// Replace the hardcoded productType with dynamic categories
const ProductGrid = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await fetchCategories();
        if (result.success) {
          setCategories(result.data);
          // Set first category as default if available
          if (result.data.length > 0 && selectedCategory === "all") {
            setSelectedCategory(result.data[0].name);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    loadCategories();
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const categoryParam =
          selectedCategory === "all" ? undefined : selectedCategory;
        const result = await fetchProducts(categoryParam);

        if (result.success) {
          // Enhance products with primary image URL
          const enhancedProducts = result.data.map((product) => ({
            ...product,
            primaryImage:
              product.productImages?.find((img) => img.isPrimary)?.imageUrl ||
              product.productImages?.[0]?.imageUrl ||
              "/images/placeholder.png",
            averageRating: 4.5, // You would fetch this from reviews API
            reviewCount: 5, // You would fetch this from reviews API
          }));

          setProducts(enhancedProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory]);

  // Prepare categories for tabbar (add "All" option)
  const categoryTabs = [
    { id: "all", title: "All Products", slug: "all" },
    ...categories.map((cat) => ({
      id: cat.id,
      title: cat.name,
      slug: cat.slug,
    })),
  ];

  return (
    <Container className="flex flex-col lg:px-0 my-10">
      <HomeTabbar
        selectedTab={selectedCategory}
        onTabSelect={setSelectedCategory}
        categories={categoryTabs}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
          <motion.div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading products...</span>
          </motion.div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-10">
          <AnimatePresence mode="wait">
            {products.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0.2, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <NoProductAvailable selectedTab={selectedCategory} />
      )}
    </Container>
  );
};

export default ProductGrid;
