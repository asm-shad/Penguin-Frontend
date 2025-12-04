"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";
import HomeTabbar from "./HomeTabbar";
import Container from "@/components/shared/Container";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import { ICategory, IProduct } from "@/types/product.interface";
import { fetchCategories } from "@/services/product/category.actions";
import {
  fetchProducts,
  fetchProductsByStatus,
} from "@/services/product/product.actions";

// Replace the hardcoded productType with dynamic categories
const ProductGrid = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>("featured");

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await fetchCategories({
          limit: 6,
          sortBy: "name",
          sortOrder: "asc",
        });
        if (result.success) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    loadCategories();
  }, []);

  // Fetch products when tab changes
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let result;

        // Handle different tabs
        if (selectedTab === "featured") {
          // Fetch featured products
          result = await fetchProducts({ isFeatured: true, limit: 10 });
        } else if (selectedTab === "new") {
          // Fetch new arrivals
          result = await fetchProductsByStatus("NEW", { limit: 10 });
        } else if (selectedTab === "hot") {
          // Fetch hot products
          result = await fetchProductsByStatus("HOT", { limit: 10 });
        } else if (selectedTab === "sale") {
          // Fetch products on sale
          result = await fetchProductsByStatus("SALE", { limit: 10 });
        } else if (selectedTab === "all") {
          // Fetch all active products
          result = await fetchProducts({
            isActive: true,
            limit: 10,
            sortBy: "createdAt",
            sortOrder: "desc",
          });
        } else {
          // Fetch products by category
          const category = categories.find(
            (cat) => cat.id === selectedTab || cat.slug === selectedTab
          );
          if (category) {
            result = await fetchProducts({
              category: category.id,
              isActive: true,
              limit: 10,
            });
          } else {
            // Fallback to featured products
            result = await fetchProducts({ isFeatured: true, limit: 10 });
          }
        }

        if (result.success) {
          setProducts(result.data || []);
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
  }, [selectedTab, categories]);

  // Prepare tabs for tabbar - ADD SLUG PROPERTY
  const productTabs = [
    { id: "featured", title: "Featured", icon: "⭐", slug: "featured" },
    { id: "new", title: "New Arrivals", icon: "🆕", slug: "new" },
    { id: "hot", title: "Hot Deals", icon: "🔥", slug: "hot" },
    { id: "sale", title: "On Sale", icon: "💰", slug: "sale" },
    { id: "all", title: "All Products", icon: "📦", slug: "all" },
  ];

  return (
    <div className="py-10 bg-gray-50">
      <Container className="flex flex-col lg:px-0">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Featured Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated selection of premium products. From
            the latest trends to timeless classics, find something perfect for
            you.
          </p>
        </div>

        <HomeTabbar
          selectedTab={selectedTab}
          onTabSelect={setSelectedTab}
          categories={productTabs}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 min-h-80 space-y-4 text-center bg-white rounded-lg w-full mt-10 border">
            <motion.div className="flex items-center space-x-3 text-shop_dark_green">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-lg font-medium">Loading products...</span>
            </motion.div>
            <p className="text-gray-500 text-sm">
              Please wait while we fetch the best products for you
            </p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-10">
            <AnimatePresence mode="wait">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0.2, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <NoProductAvailable selectedTab={selectedTab} />
        )}

        {/* View All Button */}
        {products.length > 0 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setSelectedTab("all")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-shop_dark_green text-white rounded-full hover:bg-shop_dark_green/90 transition-colors font-medium"
            >
              View All Products
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default ProductGrid;
