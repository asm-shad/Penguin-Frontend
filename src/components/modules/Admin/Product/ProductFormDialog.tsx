"use client";

import InputFieldError from "@/components/shared/InputFieldError";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  createProduct,
  updateProduct,
} from "@/services/product/product.actions";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { toast } from "sonner";
import Image from "next/image";
import { IBrand, ICategory, IProduct } from "@/types/product.interface";
import { ProductStatusType, ProductStatus } from "@/types/user.interface";
import { X, Upload } from "lucide-react";
import CategoryBrandMultiSelect from "./CategoryBrandMultiSelect";
import { useCategoryBrandSelection } from "@/hooks/UseCategoryBrandSelectionProps";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface IProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: IProduct;
  categories: ICategory[];
  brands: IBrand[];
}

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// Maximum number of files
const MAX_FILE_COUNT = 10;

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

  const [status, setStatus] = useState<ProductStatusType>(
    product?.status || ProductStatus.NEW
  );
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false);
  const [hasDiscount, setHasDiscount] = useState(
    product?.discount ? product.discount > 0 : false
  );

  // FIX 1: Keep existing image URLs separate from new file previews
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(
    product?.productImages?.map((img) => img.imageUrl) || []
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const categoryBrandSelection = useCategoryBrandSelection({
    product,
    isEdit,
    open,
  });

  // FIX: Add ref to track processed state
  const processedStateRef = useRef<string | null>(null);

  const getCategoryTitle = (id: string): string => {
    return categories.find((c) => c.id === id)?.name || "Unknown Category";
  };

  const getBrandTitle = (id: string): string => {
    return brands.find((b) => b.id === id)?.name || "Unknown Brand";
  };

  // FIX: Properly bind the product ID for edit mode
  const updateProductWithId = isEdit 
    ? updateProduct.bind(null, product.id)  // Bind product ID as first parameter
    : createProduct;

  // Use useActionState to get the state from server actions
  const [state, formAction, pending] = useActionState(
    updateProductWithId,
    null
  );

  // Reset processed state when dialog opens/closes
  useEffect(() => {
    if (open) {
      processedStateRef.current = null;
    }
  }, [open]);

  // Handle the state from server actions
  useEffect(() => {
    // Don't process if dialog is closed or no state
    if (!open || !state) return;
    
    // Create a unique key for this state
    const stateKey = JSON.stringify(state);
    
    // Only process if we haven't seen this state before
    if (stateKey !== processedStateRef.current) {
      processedStateRef.current = stateKey;
      
      if (state.success) {
        toast.success(state.message);
        if (formRef.current) {
          formRef.current.reset();
        }
        
        // Clean up object URLs
        imagePreviews.forEach((preview) => {
          if (preview.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
          }
        });
        
        // Close dialog first, then trigger success
        setTimeout(() => {
          onClose();
          // Small delay before success callback
          setTimeout(() => {
            onSuccess();
          }, 50);
        }, 100);
      } else if (state && !state.success) {
        toast.error(state.message);

        // FIX 2: Properly restore multiple files
        if (selectedFiles.length > 0 && fileInputRef.current) {
          const dataTransfer = new DataTransfer();
          selectedFiles.forEach((file) => {
            dataTransfer.items.add(file);
          });
          fileInputRef.current.files = dataTransfer.files;
        }
      }
    }
  }, [state, open, onSuccess, onClose, selectedFiles, imagePreviews]);

  const validateFiles = (files: File[]): { valid: boolean; message?: string } => {
    // Check file count
    const totalFiles = selectedFiles.length + files.length;
    if (totalFiles > MAX_FILE_COUNT) {
      return {
        valid: false,
        message: `Maximum ${MAX_FILE_COUNT} images allowed. You have ${selectedFiles.length} and trying to add ${files.length} more.`,
      };
    }

    // Check file sizes and types
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return {
          valid: false,
          message: `File "${file.name}" is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
        };
      }

      if (!file.type.startsWith('image/')) {
        return {
          valid: false,
          message: `File "${file.name}" is not an image.`,
        };
      }
    }

    return { valid: true };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate files
    const validation = validateFiles(files);
    if (!validation.valid) {
      toast.error(validation.message);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    
    // Show success toast
    toast.success(`Added ${files.length} image${files.length > 1 ? 's' : ''}`);
  };

  const removeImage = useCallback(
    (index: number, isExisting: boolean = false) => {
      if (isExisting) {
        // Remove from existing images
        setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
        toast.info("Existing image will be removed on save");
      } else {
        // Remove from new uploads
        setImagePreviews((prev) => {
          const newPreviews = [...prev];
          const previewToRemove = newPreviews[index];
          if (previewToRemove.startsWith("blob:")) {
            URL.revokeObjectURL(previewToRemove);
          }
          return newPreviews.filter((_, i) => i !== index);
        });

        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        toast.info("Image removed");
      }
    },
    []
  );

  // FIX 3: Proper cleanup
  const handleClose = () => {
    // Clean up object URLs
    imagePreviews.forEach((preview) => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Reset states
    setSelectedFiles([]);
    setImagePreviews([]);
    setExistingImageUrls(product?.productImages?.map((img) => img.imageUrl) || []);
    setStatus(product?.status || ProductStatus.NEW);
    setIsFeatured(product?.isFeatured || false);
    setHasDiscount(product?.discount ? product.discount > 0 : false);

    if (formRef.current) {
      formRef.current.reset();
    }

    onClose();
  };

  // Combine existing and new images for display
  const allImages = [...existingImageUrls, ...imagePreviews];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? "Update product details, pricing, and images." 
              : "Fill in the product details to add a new product to your store."
            }
          </DialogDescription>
        </DialogHeader>

        <form
          ref={formRef}
          action={formAction} 
          className="flex flex-col flex-1 min-h-0 space-y-6"
        >
          {/* Hidden fields for form data */}
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="isFeatured" value={isFeatured.toString()} />
          <input 
            type="hidden" 
            name="categoryIds" 
            value={JSON.stringify(categoryBrandSelection.selectedCategoryIds)}
          />
          <input 
            type="hidden" 
            name="brandId" 
            value={categoryBrandSelection.selectedBrandId || ""}
          />
          <input 
            type="hidden" 
            name="variants" 
            value="[]" 
          />
          
          {/* Basic Information Section */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
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
                    disabled={pending}
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
                    disabled={pending}
                  />
                  <InputFieldError field="slug" state={state} />
                </Field>
              </div>

              <Field className="mt-4">
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
                  disabled={pending}
                />
                <InputFieldError field="description" state={state} />
              </Field>
            </CardContent>
          </Card>

          {/* Category & Brand Selection */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Category & Brand</h3>
              <CategoryBrandMultiSelect
                // Categories
                selectedCategoryIds={categoryBrandSelection.selectedCategoryIds}
                removedCategoryIds={categoryBrandSelection.removedCategoryIds}
                currentCategoryId={categoryBrandSelection.currentCategoryId}
                availableCategories={categoryBrandSelection.getAvailableCategories(
                  categories
                )}
                // Brand
                selectedBrandId={categoryBrandSelection.selectedBrandId}
                removedBrandId={categoryBrandSelection.removedBrandId}
                availableBrands={categoryBrandSelection.getAvailableBrands(
                  brands
                )}
                isEdit={isEdit}
                onCurrentCategoryChange={
                  categoryBrandSelection.setCurrentCategoryId
                }
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
            </CardContent>
          </Card>

          {/* Pricing & Details Section */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Pricing & Details</h3>
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
                    disabled={pending}
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
                    disabled={pending}
                  />
                  <InputFieldError field="stock" state={state} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="sku">SKU (Optional)</FieldLabel>
                  <Input
                    id="sku"
                    name="sku"
                    placeholder="PROD-001"
                    defaultValue={
                      state?.formData?.sku || (isEdit ? product?.sku : "")
                    }
                    disabled={pending}
                  />
                  <InputFieldError field="sku" state={state} />
                </Field>
              </div>

              {/* Discount & Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="discount">Discount (%)</FieldLabel>
                    <Switch
                      id="hasDiscount"
                      checked={hasDiscount}
                      onCheckedChange={setHasDiscount}
                      disabled={pending}
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
                      disabled={pending}
                    />
                  )}
                  <InputFieldError field="discount" state={state} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="statusSelect">Product Status</FieldLabel>
                  <Select
                    value={status}
                    onValueChange={(value) => setStatus(value as ProductStatusType)}
                    disabled={pending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ProductStatus.NEW}>New Arrival</SelectItem>
                      <SelectItem value={ProductStatus.HOT}>Hot</SelectItem>
                      <SelectItem value={ProductStatus.SALE}>On Sale</SelectItem>
                      <SelectItem value={ProductStatus.OUT_OF_STOCK}>
                        Out of Stock
                      </SelectItem>
                      <SelectItem value={ProductStatus.DISCONTINUED}>
                        Discontinued
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <InputFieldError field="status" state={state} />
                </Field>
              </div>
            </CardContent>
          </Card>

          {/* Images Section */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Product Images</h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <FieldLabel htmlFor="images" className="block mb-2">
                    Upload Images
                  </FieldLabel>
                  <p className="text-sm text-gray-500 mb-4">
                    Upload up to {MAX_FILE_COUNT} images. Max {MAX_FILE_SIZE / 1024 / 1024}MB each.
                    Supported: JPG, PNG, WebP
                  </p>
                  <Input
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    id="images"
                    name="files"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    disabled={pending}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={pending || allImages.length >= MAX_FILE_COUNT}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                  {selectedFiles.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      {selectedFiles.length} new file{selectedFiles.length > 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>

                {/* Image previews */}
                {allImages.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Preview ({allImages.length}/{MAX_FILE_COUNT})</h4>
                      <p className="text-sm text-gray-500">Click × to remove</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {allImages.map((image, index) => {
                        const isExisting = index < existingImageUrls.length;
                        const displayIndex = index + 1;

                        return (
                          <div 
                            key={`image-${index}-${isExisting ? "existing" : "new"}`} 
                            className="relative group border rounded-lg overflow-hidden"
                          >
                            <div className="aspect-square relative">
                              <Image
                                src={image}
                                alt={`Product image ${displayIndex}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                removeImage(
                                  isExisting
                                    ? index
                                    : index - existingImageUrls.length,
                                  isExisting
                                )
                              }
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              disabled={pending}
                            >
                              <X className="h-3 w-3" />
                            </button>
                            {isExisting && (
                              <div className="absolute bottom-1 left-1 text-xs bg-blue-600 text-white px-2 py-1 rounded">
                                Existing
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <InputFieldError field="images" state={state} />
              </div>
            </CardContent>
          </Card>

          {/* Settings Section */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <FieldLabel htmlFor="isFeatured" className="text-sm font-medium">
                      Featured Product
                    </FieldLabel>
                    <p className="text-xs text-gray-500">Show in featured sections</p>
                  </div>
                  <Switch
                    id="isFeatured"
                    checked={isFeatured}
                    onCheckedChange={setIsFeatured}
                    disabled={pending}
                    className="ml-4"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={pending}
              className="min-w-[120px]"
            >
              {pending ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;