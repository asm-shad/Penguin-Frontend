/* eslint-disable @typescript-eslint/no-explicit-any */
// services/product/product.actions.ts
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { cache } from "react";

export interface ProductStats {
  totalProducts: number;
  totalRevenue: number;
  averagePrice: number;
  outOfStockCount: number;
  lowStockCount: number;
  featuredProducts: number;
  activeProducts: number;
  categoriesCount: number;
  brandsCount: number;
}

export interface ProductStatusDistribution {
  NEW: number;
  HOT: number;
  SALE: number;
  OUT_OF_STOCK: number;
  DISCONTINUED: number;
}

export interface PriceDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  stock: number;
  status: string;
}

export interface StockOverview {
  totalStock: number;
  averageStock: number;
  lowStockThreshold: number;
  productsBelowThreshold: number;
}

export interface ProductDashboardData {
  stats: ProductStats;
  statusDistribution: ProductStatusDistribution;
  priceDistribution: PriceDistribution[];
  topProducts: TopProduct[];
  stockOverview: StockOverview;
  recentProducts: any[];
}

export const fetchProductStats = cache(async (): Promise<ProductDashboardData> => {
  try {
    // Fetch all products to calculate stats
    const response = await serverFetch.get("/product");
    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error("Failed to fetch products for dashboard");
    }

    const products = result.data;
    
    // Calculate statistics
    const stats = calculateProductStats(products);
    const statusDistribution = calculateStatusDistribution(products);
    const priceDistribution = calculatePriceDistribution(products);
    const topProducts = getTopProducts(products);
    const stockOverview = calculateStockOverview(products);
    const recentProducts = getRecentProducts(products);

    return {
      stats,
      statusDistribution,
      priceDistribution,
      topProducts,
      stockOverview,
      recentProducts,
    };
  } catch (error: any) {
    console.error("Error fetching product stats:", error);
    // Return empty data structure
    return {
      stats: {
        totalProducts: 0,
        totalRevenue: 0,
        averagePrice: 0,
        outOfStockCount: 0,
        lowStockCount: 0,
        featuredProducts: 0,
        activeProducts: 0,
        categoriesCount: 0,
        brandsCount: 0,
      },
      statusDistribution: {
        NEW: 0,
        HOT: 0,
        SALE: 0,
        OUT_OF_STOCK: 0,
        DISCONTINUED: 0,
      },
      priceDistribution: [],
      topProducts: [],
      stockOverview: {
        totalStock: 0,
        averageStock: 0,
        lowStockThreshold: 10,
        productsBelowThreshold: 0,
      },
      recentProducts: [],
    };
  }
});

// Helper functions
function calculateProductStats(products: any[]): ProductStats {
  const totalProducts = products.length;
  const totalRevenue = products.reduce((sum, product) => sum + (product.salePrice || 0) * (product.stock || 0), 0);
  const averagePrice = totalProducts > 0 ? products.reduce((sum, product) => sum + (product.salePrice || 0), 0) / totalProducts : 0;
  const outOfStockCount = products.filter(p => p.status === 'OUT_OF_STOCK').length;
  const lowStockCount = products.filter(p => (p.stock || 0) <= 10).length;
  const featuredProducts = products.filter(p => p.isFeatured).length;
  const activeProducts = products.filter(p => p.isActive).length;
  
  // Get unique categories and brands
  const categories = new Set();
  const brands = new Set();
  
  products.forEach(product => {
    product.productCategories?.forEach((pc: any) => categories.add(pc.categoryId));
    if (product.brandId) brands.add(product.brandId);
  });

  return {
    totalProducts,
    totalRevenue,
    averagePrice,
    outOfStockCount,
    lowStockCount,
    featuredProducts,
    activeProducts,
    categoriesCount: categories.size,
    brandsCount: brands.size,
  };
}

function calculateStatusDistribution(products: any[]): ProductStatusDistribution {
  const distribution = {
    NEW: 0,
    HOT: 0,
    SALE: 0,
    OUT_OF_STOCK: 0,
    DISCONTINUED: 0,
  };

  products.forEach(product => {
    if (distribution.hasOwnProperty(product.status)) {
      distribution[product.status as keyof ProductStatusDistribution]++;
    }
  });

  return distribution;
}

function calculatePriceDistribution(products: any[]): PriceDistribution[] {
  const priceRanges = [
    { min: 0, max: 50, label: "$0 - $50" },
    { min: 50, max: 100, label: "$50 - $100" },
    { min: 100, max: 200, label: "$100 - $200" },
    { min: 200, max: 500, label: "$200 - $500" },
    { min: 500, max: Infinity, label: "$500+" },
  ];

  const counts = priceRanges.map(range => ({
    ...range,
    count: products.filter(p => {
      const price = p.salePrice || p.price || 0;
      return price >= range.min && price < range.max;
    }).length,
  }));

  const total = products.length;
  
  return counts.map(item => ({
    range: item.label,
    count: item.count,
    percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
  }));
}

function getTopProducts(products: any[], limit: number = 5): TopProduct[] {
  // Sort by stock (as a proxy for sales since we don't have sales data)
  return products
    .sort((a, b) => b.stock - a.stock)
    .slice(0, limit)
    .map(product => ({
      id: product.id,
      name: product.name,
      sales: product.stock, // Using stock as placeholder
      revenue: (product.salePrice || 0) * product.stock,
      stock: product.stock,
      status: product.status,
    }));
}

function calculateStockOverview(products: any[]): StockOverview {
  const totalStock = products.reduce((sum, product) => sum + (product.stock || 0), 0);
  const averageStock = products.length > 0 ? totalStock / products.length : 0;
  const lowStockThreshold = 10;
  const productsBelowThreshold = products.filter(p => (p.stock || 0) <= lowStockThreshold).length;

  return {
    totalStock,
    averageStock,
    lowStockThreshold,
    productsBelowThreshold,
  };
}

function getRecentProducts(products: any[], limit: number = 5): any[] {
  return products
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
    .map(product => ({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      status: product.status,
      createdAt: product.createdAt,
      imageUrl: product.productImages?.[0]?.imageUrl,
    }));
}