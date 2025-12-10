/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCategoryBrandSelection.ts
"use client";

import { IProduct } from "@/types/product.interface";
import { useEffect, useState } from "react";

interface UseCategoryBrandSelectionProps {
    product?: IProduct;
    isEdit: boolean;
    open: boolean;
}

interface UseCategoryBrandSelectionReturn {
    // Categories (similar to specialties)
    selectedCategoryIds: string[];
    removedCategoryIds: string[];
    currentCategoryId: string;
    setCurrentCategoryId: (id: string) => void;
    handleAddCategory: () => void;
    handleRemoveCategory: (id: string) => void;
    getNewCategories: () => string[];
    getAvailableCategories: (allCategories: any[]) => any[];
    
    // Brand (single selection)
    selectedBrandId: string;
    removedBrandId: string;
    handleBrandChange: (id: string) => void;
    handleRemoveBrand: () => void;
    getAvailableBrands: (allBrands: any[]) => any[];
}

export const useCategoryBrandSelection = ({
    product,
    isEdit,
    open,
}: UseCategoryBrandSelectionProps): UseCategoryBrandSelectionReturn => {
    // Initialize categories from product
    const getInitialCategoryIds = () => {
        if (isEdit && product?.productCategories) {
            return (
                product?.productCategories
                    ?.map((pc) => {
                        return pc?.category?.id || null;
                    })
                    ?.filter((id): id is string => !!id) || []
            );
        }
        return [];
    };

    // Initialize brand from product
    const getInitialBrandId = () => {
        if (isEdit && product?.brand) {
            return product.brand.id || "";
        }
        return "";
    };

    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
        getInitialCategoryIds
    );
    const [removedCategoryIds, setRemovedCategoryIds] = useState<string[]>([]);
    const [currentCategoryId, setCurrentCategoryId] = useState<string>("");

    const [selectedBrandId, setSelectedBrandId] = useState<string>(
        getInitialBrandId
    );
    const [removedBrandId, setRemovedBrandId] = useState<string>("");

    // Handle adding a category
    const handleAddCategory = () => {
        if (
            currentCategoryId &&
            !selectedCategoryIds.includes(currentCategoryId)
        ) {
            setSelectedCategoryIds([...selectedCategoryIds, currentCategoryId]);
            // If in edit mode and we're re-adding a removed category
            if (removedCategoryIds.includes(currentCategoryId)) {
                setRemovedCategoryIds(
                    removedCategoryIds.filter((id) => id !== currentCategoryId)
                );
            }
            setCurrentCategoryId("");
        }
    };

    // Handle removing a category
    const handleRemoveCategory = (categoryId: string) => {
        setSelectedCategoryIds(
            selectedCategoryIds.filter((id) => id !== categoryId)
        );

        // In edit mode, track removed categories
        if (isEdit && product?.productCategories) {
            const wasOriginalCategory = product?.productCategories?.some((pc) => {
                const id = pc?.category?.id || null;
                return id === categoryId;
            });
            if (wasOriginalCategory && !removedCategoryIds.includes(categoryId)) {
                setRemovedCategoryIds([...removedCategoryIds, categoryId]);
            }
        }
    };

    // Handle brand change
    const handleBrandChange = (brandId: string) => {
        // In edit mode, track removed brand if changing from existing
        if (isEdit && selectedBrandId && selectedBrandId !== brandId) {
            setRemovedBrandId(selectedBrandId);
        }
        setSelectedBrandId(brandId);
    };

    // Handle removing brand
    const handleRemoveBrand = () => {
        if (isEdit && selectedBrandId) {
            setRemovedBrandId(selectedBrandId);
        }
        setSelectedBrandId("");
    };

    // Get new categories (for edit mode)
    const getNewCategories = (): string[] => {
        if (!isEdit || !product?.productCategories) {
            return selectedCategoryIds;
        }
        const originalIds =
            product?.productCategories
                ?.map(
                    (pc) => pc?.category?.id || null
                )
                ?.filter((id): id is string => !!id) || [];
        return selectedCategoryIds.filter((id) => !originalIds.includes(id));
    };

    // Get available categories
    const getAvailableCategories = (allCategories: any[]) => {
        return allCategories?.filter((c) => !selectedCategoryIds?.includes(c?.id)) || [];
    };

    // Get available brands
    const getAvailableBrands = (allBrands: any[]) => {
        return selectedBrandId 
            ? allBrands?.filter((b) => b?.id !== selectedBrandId) || []
            : allBrands || [];
    };

    // Reset state when dialog opens
    useEffect(() => {
        if (open && product) {
            const initialCategoryIds = getInitialCategoryIds();
            const initialBrandId = getInitialBrandId();
            
            setSelectedCategoryIds(initialCategoryIds);
            setRemovedCategoryIds([]);
            setCurrentCategoryId("");
            
            setSelectedBrandId(initialBrandId);
            setRemovedBrandId("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, product?.id]);

    return {
        // Categories
        selectedCategoryIds,
        removedCategoryIds,
        currentCategoryId,
        setCurrentCategoryId,
        handleAddCategory,
        handleRemoveCategory,
        getNewCategories,
        getAvailableCategories,
        
        // Brand
        selectedBrandId,
        removedBrandId,
        handleBrandChange,
        handleRemoveBrand,
        getAvailableBrands,
    };
};