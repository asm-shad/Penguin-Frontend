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
import Pagination from "@/components/shared/Pagination";
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
  const pageParams = searchParams?.get("page");

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
  const [currentPage, setCurrentPage] = useState<number>(
    pageParams ? parseInt(pageParams) : 1
  );
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  // Build filters object
  const buildFilters = useCallback((): IProductFilters => {
    const filters: IProductFilters = {
      isActive: true,
      sortBy: "name",
      sortOrder: "asc",
      page: currentPage,
      limit: itemsPerPage,
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
  }, [
    selectedCategory,
    selectedBrand,
    selectedPrice,
    currentPage,
    itemsPerPage,
    categories,
    brands,
  ]);

  // Fetch products function
  const fetchShopProducts = useCallback(async () => {
    setLoading(true);
    try {
      const filters = buildFilters();
      const result = await fetchProducts(filters);

      if (result.success && result.data) {
        setProducts(result.data);
        if (result.meta) {
          setTotalProducts(result.meta.total || 0);
          setTotalPages(Math.ceil((result.meta.total || 0) / itemsPerPage));
          setItemsPerPage(result.meta.limit || 10);
          // Ensure current page is valid
          if (result.meta.page && result.meta.page !== currentPage) {
            setCurrentPage(result.meta.page);
          }
        }
      } else {
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      }
    } catch (error) {
      console.log("Shop product fetching Error", error);
      setProducts([]);
      setTotalPages(1);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  }, [buildFilters, currentPage, itemsPerPage]);

  // Update URL when filters change
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedBrand) params.set("brand", selectedBrand);
    if (selectedPrice) params.set("price", selectedPrice);
    if (currentPage > 1) params.set("page", currentPage.toString());

    const queryString = params.toString();
    const newUrl = queryString ? `/shop?${queryString}` : "/shop";

    window.history.pushState({}, "", newUrl);
  }, [selectedCategory, selectedBrand, selectedPrice, currentPage]);

  // Handle initial URL params
  useEffect(() => {
    if (categoryParams) setSelectedCategory(categoryParams);
    if (brandParams) setSelectedBrand(brandParams);
    if (priceParams) setSelectedPrice(priceParams);
    if (pageParams) setCurrentPage(parseInt(pageParams));
  }, [brandParams, categoryParams, priceParams, pageParams]);

  // Fetch products when filters change
  useEffect(() => {
    fetchShopProducts();
  }, [fetchShopProducts]);

  // Update URL when filters change
  useEffect(() => {
    updateURL();
  }, [updateURL]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedPrice(null);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                className="text-shop_dark_green underline text-sm font-medium hover:text-darkRed hoverEffect whitespace-nowrap self-start md:self-center"
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
              setSelectedCategory={(category) => {
                setSelectedCategory(category);
                setCurrentPage(1); // Reset to first page when filter changes
              }}
            />
            <BrandList
              brands={brands}
              setSelectedBrand={(brand) => {
                setSelectedBrand(brand);
                setCurrentPage(1); // Reset to first page when filter changes
              }}
              selectedBrand={selectedBrand}
            />
            <PriceList
              setSelectedPrice={(price) => {
                setSelectedPrice(price);
                setCurrentPage(1); // Reset to first page when filter changes
              }}
              selectedPrice={selectedPrice}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1 pt-5">
            <div className="min-h-[calc(100vh-160px)] flex flex-col">
              {loading ? (
                <div className="flex-1 p-20 flex flex-col gap-2 items-center justify-center bg-white">
                  <Loader2 className="w-10 h-10 text-shop_dark_green animate-spin" />
                  <p className="font-semibold tracking-wide text-base">
                    Loading products...
                  </p>
                </div>
              ) : products.length > 0 ? (
                <>
                  {/* Products Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 mb-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination Component */}
                  <div className="mt-auto pt-6 border-t mb-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={totalProducts}
                      itemsPerPage={itemsPerPage}
                      onPageChange={handlePageChange}
                      isLoading={loading}
                    />
                  </div>
                </>
              ) : (
                <NoProductAvailable
                  className="bg-white mt-0 flex-1"
                  selectedTab={
                    selectedCategoryName || selectedBrandName || "shop"
                  }
                />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
