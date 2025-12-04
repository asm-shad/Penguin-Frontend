"use client";
import {
  ICategory,
  IBrand,
  IProduct,
  IProductFilters,
} from "@/types/product.interface";
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Title } from "@/components/ui/text";
import Container from "@/components/shared/Container";
import CategoryList from "./CategoryList";
import BrandList from "./BrandList";
import PriceList from "./PriceList";
import ProductCard from "../Product/ProductCard";
import NoProductAvailable from "../Product/NoProductAvailable";
import { fetchProducts } from "@/services/product/product.actions";

interface Props {
  categories: ICategory[];
  brands: IBrand[];
}

const Shop = ({ categories, brands }: Props) => {
  const searchParams = useSearchParams();
  const brandParams = searchParams?.get("brand");
  const categoryParams = searchParams?.get("category");
  const priceParams = searchParams?.get("price");

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParams || null
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    brandParams || null
  );
  const [selectedPrice, setSelectedPrice] = useState<string | null>(
    priceParams || null
  );

  // Build filters object - memoized
  const buildFilters = useCallback((): IProductFilters => {
    const filters: IProductFilters = {
      isActive: true,
      sortBy: "name",
      sortOrder: "asc",
    };

    if (selectedCategory) {
      const category = categories.find((cat) => cat.slug === selectedCategory);
      if (category) {
        filters.category = category.id;
      }
    }

    if (selectedBrand) {
      const brand = brands.find((b) => b.slug === selectedBrand);
      if (brand) {
        filters.brand = brand.id;
      }
    }

    if (selectedPrice) {
      const [min, max] = selectedPrice.split("-").map(Number);
      filters.minPrice = min;
      filters.maxPrice = max;
    }

    return filters;
  }, [selectedCategory, selectedBrand, selectedPrice, categories, brands]);

  // Fetch products function - memoized
  const fetchShopProducts = useCallback(async () => {
    setLoading(true);
    try {
      const filters = buildFilters();
      const result = await fetchProducts(filters);

      if (result.success && result.data) {
        setProducts(result.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.log("Shop product fetching Error", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [buildFilters]); // Now depends on buildFilters which is memoized

  // Update URL when filters change - memoized
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedBrand) params.set("brand", selectedBrand);
    if (selectedPrice) params.set("price", selectedPrice);

    const queryString = params.toString();
    const newUrl = queryString ? `/shop?${queryString}` : "/shop";

    window.history.pushState({}, "", newUrl);
  }, [selectedCategory, selectedBrand, selectedPrice]);

  // Handle initial URL params
  useEffect(() => {
    if (categoryParams) setSelectedCategory(categoryParams);
    if (brandParams) setSelectedBrand(brandParams);
    if (priceParams) setSelectedPrice(priceParams);
  }, [brandParams, categoryParams, priceParams]);

  // Fetch products when filters change
  useEffect(() => {
    fetchShopProducts();
  }, [fetchShopProducts]); // fetchShopProducts is now memoized

  // Update URL when filters change
  useEffect(() => {
    updateURL();
  }, [updateURL]); // updateURL is now memoized

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedPrice(null);
  };

  // Get selected category and brand names for display
  const selectedCategoryName = selectedCategory
    ? categories.find((cat) => cat.slug === selectedCategory)?.name
    : null;

  const selectedBrandName = selectedBrand
    ? brands.find((b) => b.slug === selectedBrand)?.name
    : null;

  return (
    <div className="border-t">
      <Container className="mt-5">
        <div className="sticky top-0 z-10 mb-5 bg-white pb-3">
          <div className="flex items-center justify-between">
            <div>
              <Title className="text-lg uppercase tracking-wide">
                Get the products as your needs
              </Title>

              {/* Active filters display */}
              {(selectedCategory || selectedBrand || selectedPrice) && (
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {selectedCategoryName && (
                    <span className="px-2 py-1 text-xs bg-shop_dark_green/10 text-shop_dark_green rounded-full">
                      Category: {selectedCategoryName}
                    </span>
                  )}
                  {selectedBrandName && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Brand: {selectedBrandName}
                    </span>
                  )}
                  {selectedPrice && (
                    <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                      Price: ${selectedPrice.replace("-", " - $")}
                    </span>
                  )}
                </div>
              )}
            </div>

            {(selectedCategory !== null ||
              selectedBrand !== null ||
              selectedPrice !== null) && (
              <button
                onClick={handleResetFilters}
                className="text-shop_dark_green underline text-sm mt-2 font-medium hover:text-darkRed hoverEffect whitespace-nowrap"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5 border-t border-t-shop_dark_green/50">
          {/* Filters Sidebar */}
          <div className="md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 md:border-r border-r-shop_btn_dark_green/50 scrollbar-hide">
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <BrandList
              brands={brands}
              setSelectedBrand={setSelectedBrand}
              selectedBrand={selectedBrand}
            />
            <PriceList
              setSelectedPrice={setSelectedPrice}
              selectedPrice={selectedPrice}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1 pt-5">
            <div className="h-[calc(100vh-160px)] overflow-y-auto pr-2 scrollbar-hide">
              {loading ? (
                <div className="p-20 flex flex-col gap-2 items-center justify-center bg-white">
                  <Loader2 className="w-10 h-10 text-shop_dark_green animate-spin" />
                  <p className="font-semibold tracking-wide text-base">
                    Loading products...
                  </p>
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <NoProductAvailable
                  className="bg-white mt-0"
                  selectedTab={
                    selectedCategoryName || selectedBrandName || "shop"
                  }
                />
              )}

              {/* Results count */}
              {!loading && products.length > 0 && (
                <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                  Showing {products.length} product
                  {products.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
