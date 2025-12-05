"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import HomeTabbar from "./HomeTabbar";
import Container from "@/components/shared/Container";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import { IProduct } from "@/types/product.interface";
import {
  fetchNewArrivals,
  fetchHotProducts,
  fetchProductsOnSale,
} from "@/services/product/product.actions";

const ProductGrid = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>("new");

  // Prepare tabs for tabbar
  const productTabs = [
    { id: "new", title: "New Arrivals", slug: "new" },
    { id: "hot", title: "Hot Deals", slug: "hot" },
    { id: "sale", title: "On Sale", slug: "sale" },
  ];

  // Fetch products when tab changes
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let result;

        // Handle different tabs
        switch (selectedTab) {
          case "new":
            result = await fetchNewArrivals(10);
            break;
          case "hot":
            result = await fetchHotProducts(10);
            break;
          case "sale":
            result = await fetchProductsOnSale(10);
            break;
          default:
            result = await fetchNewArrivals(10);
            break;
        }

        if (result.success) {
          setProducts(result.data || []);
        } else {
          setProducts([]);
          console.error("Failed to fetch products:", result.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedTab]);

  return (
    <div className="py-10 bg-gray-50">
      <Container className="flex flex-col lg:px-0">
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
          <>
            {/* ✅ FIXED: Removed AnimatePresence mode="wait" */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-10">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.random() * 0.1 }} // Optional: staggered animation
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <NoProductAvailable selectedTab={selectedTab} />
        )}
      </Container>
    </div>
  );
};

export default ProductGrid;
