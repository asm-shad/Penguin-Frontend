"use client";

import InputFieldError from "@/components/shared/InputFieldError";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProduct, updateProduct } from "@/services/product/product.actions";
import { useActionState, useEffect, useRef, useState, useCallback, useTransition } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { IBrand, ICategory, IProduct } from "@/types/product.interface";
import { ProductStatusType, ProductStatus } from "@/types/user.interface";
import { X } from "lucide-react";
import CategoryBrandMultiSelect from "./CategoryBrandMultiSelect";
import { useCategoryBrandSelection } from "@/hooks/UseCategoryBrandSelectionProps";

interface IProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: IProduct;
  categories: ICategory[];
  brands: IBrand[];
}

const ProductFormDialog = ({
  open,
  onClose,
  onSuccess,
  product,
  categories,
  brands,
}: IProductFormDialogProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = !!product;


 const categoryBrandSelection = useCategoryBrandSelection({
    product,
    isEdit,
    open,
  });

 const getCategoryTitle = (id: string): string => {
   return categories.find((c) => c.id === id)?.name || "Unknown Category";
 };

 const getBrandTitle = (id: string): string => {
   return brands.find((b) => b.id === id)?.name || "Unknown Brand";
 };

const [state, formAction, pending] = useActionState(
  isEdit ? updateProduct.bind(null, product.id) : createProduct,
  null
);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      if (formRef.current) {
        formRef.current.reset();
      }
      onSuccess();
      onClose();
    } else if (state && !state.success) {
      toast.error(state.message);

    //   if (selectedFile && fileInputRef.current) {
    //     const dataTransfer = new DataTransfer();
    //     dataTransfer.items.add(selectedFile);
    //     fileInputRef.current.files = dataTransfer.files;
    //   }
    }
  }, [state, onSuccess, onClose, selectedFile]);


const [isPending, startTransition] = useTransition();

const [status, setStatus] = useState<ProductStatusType>(
  product?.status || ProductStatus.NEW
);

  const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false);
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [hasDiscount, setHasDiscount] = useState(
    product?.discount ? product.discount > 0 : false
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    product?.productImages?.map(img => img.imageUrl) || []
  );

  // Track processed state to prevent loops
  const processedStateRef = useRef<string | null>(null);
  const imagePreviewsRef = useRef<string[]>([]);
  const selectedFilesRef = useRef<File[]>([]);

  // Keep refs in sync with state
  useEffect(() => {
    imagePreviewsRef.current = imagePreviews;
    selectedFilesRef.current = selectedFiles;
  }, [imagePreviews, selectedFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = useCallback((index: number) => {
    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      const previewToRemove = newPreviews[index];
      if (previewToRemove.startsWith("blob:")) {
        URL.revokeObjectURL(previewToRemove);
      }
      return newPreviews.filter((_, i) => i !== index);
    });
    
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Fix: Use bind like in DoctorFormDialog


  const handleClose = useCallback(() => {
    // Clean up object URLs using ref
    imagePreviewsRef.current.forEach((preview) => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    });

    // Use transition for state resets
    startTransition(() => {
      setSelectedFiles([]);
      setImagePreviews([]);
      setStatus(ProductStatus.NEW);
      setIsFeatured(false);
      setIsActive(true);
      setHasDiscount(false);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (formRef.current) {
      formRef.current.reset();
    }

    onClose();
  }, [onClose]);

  // Initialize form when opening
  useEffect(() => {
    if (open) {
      processedStateRef.current = null;
      
      // Use transition for initialization
      startTransition(() => {
        if (product) {
          setStatus(product.status || ProductStatus.NEW);
          setIsFeatured(product.isFeatured || false);
          setIsActive(product.isActive ?? true);
          setHasDiscount(product.discount ? product.discount > 0 : false);
          setImagePreviews(product.productImages?.map(img => img.imageUrl) || []);
        } else {
          // Reset to defaults for new product
          setStatus(ProductStatus.NEW);
          setIsFeatured(false);
          setIsActive(true);
          setHasDiscount(false);
          setSelectedFiles([]);
          setImagePreviews([]);
        }
      });
    }
  }, [open, product]);

  // Handle state changes without causing cascading renders
  useEffect(() => {
    // Don't process if dialog is closed or no state
    if (!open || !state) return;
    
    // Create a unique key for this state
    const stateKey = JSON.stringify(state);
    
    // Only process if we haven't seen this state before
    if (stateKey !== processedStateRef.current) {
      processedStateRef.current = stateKey;
      
      if (state.success) {
        toast.success(state.message || "Product saved successfully");
        
        // Clean up object URLs using ref instead of state
        const previewsToClean = imagePreviewsRef.current;
        previewsToClean.forEach((preview) => {
          if (preview.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
          }
        });
        
        // Use transition for state resets
        startTransition(() => {
          setSelectedFiles([]);
          setImagePreviews([]);
          setStatus(ProductStatus.NEW);
          setIsFeatured(false);
          setIsActive(true);
          setHasDiscount(false);
        });
        
        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        if (formRef.current) {
          formRef.current.reset();
        }
        
        // Close dialog and trigger success callbacks
        setTimeout(() => {
          onClose();
          setTimeout(() => {
            onSuccess();
          }, 50);
        }, 100);
      } else if (!state.success && state.message) {
        toast.error(state.message || "Failed to save product");
        
        // Re-populate file input if there was an error using ref
        const filesToRestore = selectedFilesRef.current;
        if (filesToRestore.length > 0 && fileInputRef.current) {
          const dataTransfer = new DataTransfer();
          filesToRestore.forEach(file => dataTransfer.items.add(file));
          fileInputRef.current.files = dataTransfer.files;
        }
      }
    }
  }, [state, open, onSuccess, onClose, startTransition]); // Added startTransition to dependencies

  const combinedPending = pending || isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-6">
          {/* Important: Add hidden ID field for updateProduct to find */}
          {isEdit && <input type="hidden" name="id" value={product.id} />}

          {/* Hidden inputs for arrays */}
          <input 
            type="hidden" 
            name="categoryIds" 
            value={JSON.stringify(categoryBrandSelection.selectedCategoryIds)} 
          />
          <input 
            type="hidden" 
            name="brandId" 
            value={categoryBrandSelection.selectedBrandId} 
          />
          <input 
            type="hidden" 
            name="status" 
            value={status} 
          />
          <input 
            type="hidden" 
            name="isFeatured" 
            value={isFeatured.toString()} 
          />
          <input 
            type="hidden" 
            name="isActive" 
            value={isActive.toString()} 
          />

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <FieldLabel htmlFor="name">
                Product Name <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder="Enter product name"
                defaultValue={
                  state?.formData?.name || (isEdit ? product?.name : "")
                }
                required
                disabled={combinedPending}
              />
              <InputFieldError field="name" state={state} />
            </Field>

            <Field>
              <FieldLabel htmlFor="slug">
                Slug <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="slug"
                name="slug"
                placeholder="product-slug"
                defaultValue={
                  state?.formData?.slug || (isEdit ? product?.slug : "")
                }
                required
                disabled={combinedPending}
              />
              <InputFieldError field="slug" state={state} />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="description">
              Description <span className="text-red-500">*</span>
            </FieldLabel>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter product description"
              defaultValue={
                state?.formData?.description || 
                (isEdit ? product?.description : "")
              }
              rows={4}
              required
              disabled={combinedPending}
            />
            <InputFieldError field="description" state={state} />
          </Field>

            {/* Category & Brand Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Category & Brand</h3>
              
                <CategoryBrandMultiSelect
                    // Categories
                    selectedCategoryIds={categoryBrandSelection.selectedCategoryIds}
                    removedCategoryIds={categoryBrandSelection.removedCategoryIds}
                    currentCategoryId={categoryBrandSelection.currentCategoryId}
                    availableCategories={categoryBrandSelection.getAvailableCategories(categories)}
                    
                    // Brand
                    selectedBrandId={categoryBrandSelection.selectedBrandId}
                    removedBrandId={categoryBrandSelection.removedBrandId}
                    availableBrands={categoryBrandSelection.getAvailableBrands(brands)}
                    
                    isEdit={isEdit}
                    onCurrentCategoryChange={categoryBrandSelection.setCurrentCategoryId}
                    onAddCategory={categoryBrandSelection.handleAddCategory}
                    onRemoveCategory={categoryBrandSelection.handleRemoveCategory}
                    onBrandChange={categoryBrandSelection.handleBrandChange}
                    onRemoveBrand={categoryBrandSelection.handleRemoveBrand}
                    getCategoryTitle={getCategoryTitle}
                    getBrandTitle={getBrandTitle}
                    getNewCategories={categoryBrandSelection.getNewCategories}
                />
              
              <InputFieldError field="categoryIds" state={state} />
              <InputFieldError field="brandId" state={state} />
            </div>

          {/* Pricing Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Field>
              <FieldLabel htmlFor="price">
                Price ($) <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                defaultValue={
                  state?.formData?.price || 
                  (isEdit ? product?.price?.toString() : "")
                }
                required
                disabled={combinedPending}
              />
              <InputFieldError field="price" state={state} />
            </Field>

            <Field>
              <FieldLabel htmlFor="stock">
                Stock Quantity <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                placeholder="0"
                defaultValue={
                  state?.formData?.stock || 
                  (isEdit ? product?.stock?.toString() : "")
                }
                required
                disabled={combinedPending}
              />
              <InputFieldError field="stock" state={state} />
            </Field>

            <Field>
              <FieldLabel htmlFor="sku">
                SKU
              </FieldLabel>
              <Input
                id="sku"
                name="sku"
                placeholder="PROD-001"
                defaultValue={
                  state?.formData?.sku || (isEdit ? product?.sku : "")
                }
                disabled={combinedPending}
              />
              <InputFieldError field="sku" state={state} />
            </Field>
          </div>

          {/* Discount Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="discount">Discount (%)</FieldLabel>
                <Switch
                  id="hasDiscount"
                  checked={hasDiscount}
                  onCheckedChange={setHasDiscount}
                  disabled={combinedPending}
                />
              </div>
              {hasDiscount && (
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Discount percentage"
                  defaultValue={
                    state?.formData?.discount || 
                    (isEdit ? product?.discount?.toString() : "0")
                  }
                  className="mt-2"
                  disabled={combinedPending}
                />
              )}
              <InputFieldError field="discount" state={state} />
            </Field>

            <Field>
              <FieldLabel htmlFor="status">Product Status</FieldLabel>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as ProductStatusType)}
                disabled={combinedPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ProductStatus.NEW}>New Arrival</SelectItem>
                  <SelectItem value={ProductStatus.HOT}>Hot</SelectItem>
                  <SelectItem value={ProductStatus.SALE}>On Sale</SelectItem>
                  <SelectItem value={ProductStatus.OUT_OF_STOCK}>Out of Stock</SelectItem>
                  <SelectItem value={ProductStatus.DISCONTINUED}>Discontinued</SelectItem>
                </SelectContent>
              </Select>
              <InputFieldError field="status" state={state} />
            </Field>
          </div>

          {/* Images Section */}
          <Field>
            <FieldLabel htmlFor="images">Product Images</FieldLabel>
            <Input
              ref={fileInputRef}
              onChange={handleFileChange}
              id="images"
              name="images"
              type="file"
              accept="image/*"
              multiple
              disabled={combinedPending}
            />
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      disabled={combinedPending}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <InputFieldError field="images" state={state} />
          </Field>

          {/* Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field className="flex items-center justify-between">
              <FieldLabel htmlFor="isFeatured">Featured Product</FieldLabel>
              <Switch
                id="isFeatured"
                checked={isFeatured}
                onCheckedChange={setIsFeatured}
                disabled={combinedPending}
              />
            </Field>

            <Field className="flex items-center justify-between">
              <FieldLabel htmlFor="isActive">Active</FieldLabel>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
                disabled={combinedPending}
              />
            </Field>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={combinedPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={combinedPending}>
              {combinedPending
                ? "Saving..."
                : isEdit
                ? "Update Product"
                : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;