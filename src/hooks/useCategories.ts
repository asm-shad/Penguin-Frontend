/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCategories.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ICategory } from "@/types/product.interface";
import { fetchCategories } from "@/services/product/category.actions";

interface UseCategoriesProps {
  searchTerm?: string;
  isFeatured?: boolean;
  hasProducts?: boolean;
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const useCategories = (props?: UseCategoriesProps) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const propsRef = useRef(props);

  // Update ref when props change
  useEffect(() => {
    propsRef.current = props;
  }, [props]);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchCategories(propsRef.current);
      
      if (result.success) {
        setCategories(result.data || []);
      } else {
        setError(result.message || "Failed to load categories");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed because we use ref

  useEffect(() => {
    loadCategories();
  }, [loadCategories]); // Now loadCategories is stable

  const refetch = () => {
    loadCategories();
  };

  return {
    categories,
    loading,
    error,
    refetch,
  };
};