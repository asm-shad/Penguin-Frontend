// components/modules/Product/ProductFilters.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IBrand, ICategory } from "@/types/product.interface";
import { Search, Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

interface ProductFiltersProps {
  categories: ICategory[];
  brands: IBrand[];
  showFilters?: boolean;
}

const ProductFilters = ({ 
  categories, 
  brands, 
  showFilters = true 
}: ProductFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    status: searchParams.get("status") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    inStock: searchParams.get("inStock") || "",
    isFeatured: searchParams.get("isFeatured") || "",
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
  });

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Remove page when filters change
    params.delete("page");
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      category: "",
      brand: "",
      status: "",
      minPrice: "",
      maxPrice: "",
      inStock: "",
      isFeatured: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    
    const params = new URLSearchParams();
    params.set("sortBy", "createdAt");
    params.set("sortOrder", "desc");
    
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => 
      value && 
      !["sortBy", "sortOrder"].includes(key) && 
      (key !== "searchTerm" || value.trim() !== "")
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products by name, description, or SKU..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className="pl-10"
          />
        </div>
        <Button onClick={applyFilters}>Search</Button>
        {showFilters && (
          <Button
            variant="outline"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                !
              </span>
            )}
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {isFiltersOpen && showFilters && (
        <div className="bg-muted p-6 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Advanced Filters</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Category Filter */}
            <Field>
              <FieldLabel htmlFor="category">Category</FieldLabel>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Brand Filter */}
            <Field>
              <FieldLabel htmlFor="brand">Brand</FieldLabel>
              <Select
                value={filters.brand}
                onValueChange={(value) => handleFilterChange("brand", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Brands</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Status Filter */}
            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="NEW">New Arrival</SelectItem>
                  <SelectItem value="HOT">Hot</SelectItem>
                  <SelectItem value="SALE">On Sale</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                  <SelectItem value="DISCONTINUED">Discontinued</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* Price Range */}
            <Field>
              <FieldLabel htmlFor="minPrice">Min Price ($)</FieldLabel>
              <Input
                id="minPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="maxPrice">Max Price ($)</FieldLabel>
              <Input
                id="maxPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="1000.00"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              />
            </Field>

            {/* Stock Status */}
            <Field>
              <FieldLabel htmlFor="inStock">Stock Status</FieldLabel>
              <Select
                value={filters.inStock}
                onValueChange={(value) => handleFilterChange("inStock", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any Stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Stock</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock (&lt; 10)</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* Featured Filter */}
            <Field>
              <FieldLabel htmlFor="isFeatured">Featured</FieldLabel>
              <Select
                value={filters.isFeatured}
                onValueChange={(value) => handleFilterChange("isFeatured", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Products</SelectItem>
                  <SelectItem value="true">Featured Only</SelectItem>
                  <SelectItem value="false">Not Featured</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* Sort Options */}
            <Field>
              <FieldLabel htmlFor="sortBy">Sort By</FieldLabel>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange("sortBy", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date Created</SelectItem>
                  <SelectItem value="updatedAt">Last Updated</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="sku">SKU</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="sortOrder">Sort Order</FieldLabel>
              <Select
                value={filters.sortOrder}
                onValueChange={(value) => handleFilterChange("sortOrder", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsFiltersOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.searchTerm && (
            <Badge variant="secondary" className="px-3 py-1">
              Search: {filters.searchTerm}
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleFilterChange("searchTerm", "")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary" className="px-3 py-1">
              Category: {categories.find(c => c.id === filters.category)?.name || filters.category}
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleFilterChange("category", "")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.brand && (
            <Badge variant="secondary" className="px-3 py-1">
              Brand: {brands.find(b => b.id === filters.brand)?.name || filters.brand}
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleFilterChange("brand", "")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {/* Add more active filter badges as needed */}
        </div>
      )}
    </div>
  );
};

export default ProductFilters;