// components/modules/Product/CategoryBrandMultiSelect.tsx
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
import { ICategory, IBrand } from "@/types/product.interface";
import { X } from "lucide-react";

interface CategoryBrandMultiSelectProps {
  // Categories (multi-select)
  selectedCategoryIds: string[];
  removedCategoryIds: string[];
  currentCategoryId: string;
  availableCategories: ICategory[];
  
  // Brand (single select)
  selectedBrandId: string;
  removedBrandId: string;
  availableBrands: IBrand[];
  
  isEdit: boolean;
  onCurrentCategoryChange: (id: string) => void;
  onAddCategory: () => void;
  onRemoveCategory: (id: string) => void;
  onBrandChange: (id: string) => void;
  onRemoveBrand: () => void;
  getCategoryTitle: (id: string) => string;
  getBrandTitle: (id: string) => string;
  getNewCategories: () => string[];
}

const CategoryBrandMultiSelect = ({
  // Categories
  selectedCategoryIds,
  removedCategoryIds,
  currentCategoryId,
  availableCategories,
  
  // Brand
  selectedBrandId,
  removedBrandId,
  availableBrands,
  
  isEdit,
  onCurrentCategoryChange,
  onAddCategory,
  onRemoveCategory,
  onBrandChange,
  onRemoveBrand,
  getCategoryTitle,
  getBrandTitle,
  getNewCategories,
}: CategoryBrandMultiSelectProps) => {
  return (
    <div className="space-y-6">
      {/* Categories Section (Multi-select like specialties) */}
      <Field>
        <FieldLabel htmlFor="categories">
          Categories <span className="text-red-500">*</span>
        </FieldLabel>

        {/* Hidden Inputs for Form Submission */}
        <Input
          type="hidden"
          name="categoryIds"
          value={JSON.stringify(
            isEdit ? getNewCategories() : selectedCategoryIds
          )}
        />
        {isEdit && (
          <Input
            type="hidden"
            name="removeCategoryIds"
            value={JSON.stringify(removedCategoryIds)}
          />
        )}

        {/* Selected Categories Display */}
        {selectedCategoryIds?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 p-3 bg-muted rounded-lg">
            {selectedCategoryIds?.map((id) => (
              <Badge key={id} variant="secondary" className="px-3 py-1.5 text-sm">
                {getCategoryTitle(id)}
                <Button
                  type="button"
                  variant="link"
                  onClick={() => onRemoveCategory(id)}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Add Category Selector */}
        {availableCategories?.length > 0 && (
          <div className="flex gap-2">
            <Select
              value={currentCategoryId}
              onValueChange={onCurrentCategoryChange}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a category to add" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories?.map((category) => (
                  <SelectItem key={category?.id} value={category?.id}>
                    {category?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={onAddCategory}
              disabled={!currentCategoryId}
              variant="outline"
            >
              Add
            </Button>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-1">
          {selectedCategoryIds?.length === 0
            ? "Select at least one category for the product"
            : isEdit
            ? "Add new categories or remove existing ones"
            : "Add more categories if needed"}
        </p>

        {/* Edit Mode: Show Category Changes */}
        {isEdit && (
          <div className="mt-2 space-y-1">
            {getNewCategories()?.length > 0 && (
              <p className="text-xs text-green-600">
                ✓ Will add:{" "}
                {getNewCategories()?.map(getCategoryTitle)?.join(", ")}
              </p>
            )}
            {removedCategoryIds?.length > 0 && (
              <p className="text-xs text-red-600">
                ✗ Will remove:{" "}
                {removedCategoryIds?.map(getCategoryTitle)?.join(", ")}
              </p>
            )}
          </div>
        )}
      </Field>

      {/* Brand Section (Single select) */}
      <Field>
        <FieldLabel htmlFor="brand">
          Brand <span className="text-red-500">*</span>
        </FieldLabel>

        {/* Hidden Inputs for Form Submission */}
        <Input
          type="hidden"
          name="brandId"
          value={selectedBrandId}
        />
        {isEdit && removedBrandId && (
          <Input
            type="hidden"
            name="removedBrandId"
            value={removedBrandId}
          />
        )}

        {/* Selected Brand Display */}
        {selectedBrandId && (
          <div className="mb-3 p-3 bg-muted rounded-lg flex items-center justify-between">
            <Badge variant="secondary" className="px-3 py-1.5 text-sm">
              {getBrandTitle(selectedBrandId)}
            </Badge>
            <Button
              type="button"
              variant="link"
              onClick={onRemoveBrand}
              className="text-destructive hover:text-destructive/80"
            >
              <X className="h-4 w-4" />
              Remove
            </Button>
          </div>
        )}

        {/* Brand Selector (only show if no brand selected) */}
        {!selectedBrandId && availableBrands?.length > 0 && (
          <Select
            value={selectedBrandId}
            onValueChange={onBrandChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a brand" />
            </SelectTrigger>
            <SelectContent>
              {availableBrands?.map((brand) => (
                <SelectItem key={brand?.id} value={brand?.id}>
                  {brand?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Edit Mode: Show Brand Changes */}
        {isEdit && removedBrandId && (
          <p className="text-xs text-red-600 mt-2">
            ✗ Will remove brand: {getBrandTitle(removedBrandId)}
          </p>
        )}
      </Field>
    </div>
  );
};

export default CategoryBrandMultiSelect;