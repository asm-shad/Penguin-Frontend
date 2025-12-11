"use client";

import { IBrand, ICategory } from "@/types/product.interface";
import SearchFilter from "../../Dashboard/shared/SearchFilter";
import RefreshButton from "../../Dashboard/shared/RefreshButton";
import ClearFiltersButton from "@/components/shared/ClearFiltersButton";
import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SelectFilter from "../../Dashboard/shared/SelectFilter";
import { ProductStatus } from "@/types/user.interface";
import MultiSelectFilter from "@/components/shared/MultiSelectFilter";

interface ProductFiltersProps {
  categories: ICategory[];
  brands: IBrand[];
}

const ProductFilters = ({ categories, brands }: ProductFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Read directly from URL params
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  const updatePriceFilter = useCallback((type: "min" | "max", value: string) => {
    // const params = new URLSearchParams(searchParams.toString());
    
    if (type === "min") {
      setLocalMinPrice(value);
    } else {
      setLocalMaxPrice(value);
    }
    
    // Debounce the URL update
    const timeoutId = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams.toString());
      
      if (type === "min") {
        if (value) {
          newParams.set("minPrice", value);
        } else {
          newParams.delete("minPrice");
        }
      } else {
        if (value) {
          newParams.set("maxPrice", value);
        } else {
          newParams.delete("maxPrice");
        }
      }
      
      // Always reset to page 1
      newParams.set("page", "1");
      
      router.push(`?${newParams.toString()}`);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [router, searchParams]);

  const handlePriceChange = useCallback((type: "min" | "max", value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    updatePriceFilter(type, numericValue);
  }, [updatePriceFilter]);

  const clearPriceFilter = useCallback((type: "min" | "max") => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (type === "min") {
      params.delete("minPrice");
      setLocalMinPrice("");
    } else {
      params.delete("maxPrice");
      setLocalMaxPrice("");
    }
    
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="space-y-4">
      {/* Row 1: Search and Refresh */}
      <div className="flex items-center gap-3">
        <SearchFilter paramName="searchTerm" placeholder="Search products..." />
        <RefreshButton />
      </div>

      {/* Row 2: Filter Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Category Multi-Select */}
        <MultiSelectFilter
          paramName="categoryId"
          options={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
          placeholder="Select categories"
          searchPlaceholder="Search categories..."
          emptyMessage="No categories found."
          showBadges={false}
        />

        {/* Brand Multi-Select */}
        <MultiSelectFilter
          paramName="brandId"
          options={brands.map((brand) => ({
            value: brand.id,
            label: brand.name,
          }))}
          placeholder="Select brands"
          searchPlaceholder="Search brands..."
          emptyMessage="No brands found."
          showBadges={false}
        />

        {/* Price Range */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={localMinPrice}
              onChange={(e) => handlePriceChange("min", e.target.value)}
              placeholder="Min price"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              $
            </span>
          </div>
          <span className="text-gray-400">-</span>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={localMaxPrice}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              placeholder="Max price"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              $
            </span>
          </div>
        </div>

        {/* Product Status Filter - FIXED: Use "all" instead of empty string */}
        <SelectFilter
          paramName="status"
          placeholder="Product Status"
          // defaultValue="All Status"
          options={[
            // { label: "All Status", value: "all" },
            { label: "New", value: ProductStatus.NEW },
            { label: "Hot", value: ProductStatus.HOT },
            { label: "Sale", value: ProductStatus.SALE },
            { label: "Out of Stock", value: ProductStatus.OUT_OF_STOCK },
            { label: "Discontinued", value: ProductStatus.DISCONTINUED },
          ]}
        />

        {/* Clear All Filters */}
        <ClearFiltersButton preserveParams={["page", "limit"]} />
      </div>

      {/* Row 3: Active Filter Badges */}
      <div className="flex flex-wrap gap-2 min-h-10">
        <MultiSelectFilter
          paramName="categoryId"
          options={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
          placeholder=""
          badgesOnly={true}
        />

        <MultiSelectFilter
          paramName="brandId"
          options={brands.map((brand) => ({
            value: brand.id,
            label: brand.name,
          }))}
          placeholder=""
          badgesOnly={true}
        />

        {/* Price Badges */}
        {(minPrice || maxPrice) && (
          <div className="flex flex-wrap gap-2">
            {minPrice && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Min: ${minPrice}
                <button
                  onClick={() => clearPriceFilter("min")}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  type="button"
                >
                  ×
                </button>
              </span>
            )}
            {maxPrice && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Max: ${maxPrice}
                <button
                  onClick={() => clearPriceFilter("max")}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  type="button"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;