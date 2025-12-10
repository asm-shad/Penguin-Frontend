// components/modules/Product/ProductViewDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IProduct } from "@/types/product.interface";
import { formatDateTime } from "@/lib/formatters";
import Image from "next/image";
import { 
  Package, 
  Tag, 
  DollarSign, 
  Box, 
  Star, 
  Calendar,
  Hash,
  Layers,
  Database
} from "lucide-react";

interface ProductViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: IProduct | null;
}

const ProductViewDialog = ({ 
  open, 
  onOpenChange, 
  product 
}: ProductViewDialogProps) => {
  if (!product) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "destructive" | "outline" | "secondary", label: string }> = {
      ACTIVE: { variant: "default", label: "Active" },
      INACTIVE: { variant: "destructive", label: "Inactive" },
      NEW: { variant: "secondary", label: "New Arrival" },
      HOT: { variant: "destructive", label: "Hot" },
      SALE: { variant: "secondary", label: "On Sale" },
      OUT_OF_STOCK: { variant: "outline", label: "Out of Stock" },
      DISCONTINUED: { variant: "destructive", label: "Discontinued" },
    };

    const config = statusConfig[status] || { variant: "default", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Get primary image
  const primaryImage = product.productImages?.find(img => img.isPrimary)?.imageUrl || 
                      product.productImages?.[0]?.imageUrl;

  // Get all categories
  const categories = product.productCategories?.map(pc => pc.category) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Image */}
              <div className="space-y-4">
                {primaryImage ? (
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={primaryImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                    <Package className="h-24 w-24 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Hash className="h-4 w-4 mr-2" />
                        SKU:
                      </span>
                      <span className="font-medium">{product.sku || "N/A"}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Tag className="h-4 w-4 mr-2" />
                        Brand:
                      </span>
                      <Badge variant="outline">{product.brand?.name || "N/A"}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Created:
                      </span>
                      <span>{formatDateTime(product.createdAt)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Database className="h-4 w-4 mr-2" />
                        Last Updated:
                      </span>
                      <span>{formatDateTime(product.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Pricing & Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Price:
                      </span>
                      <div className="text-right">
                        <span className="text-2xl font-bold">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.discount > 0 && (
                          <div className="text-sm text-red-600">
                            {product.discount}% discount
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Box className="h-4 w-4 mr-2" />
                        Stock:
                      </span>
                      <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "outline" : "destructive"}>
                        {product.stock} units
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Star className="h-4 w-4 mr-2" />
                        Status:
                      </span>
                      {getStatusBadge(product.status)}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Featured:</span>
                      <Badge variant={product.isFeatured ? "default" : "outline"}>
                        {product.isFeatured ? "Yes" : "No"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active:</span>
                      <Badge variant={product.isActive ? "default" : "destructive"}>
                        {product.isActive ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="whitespace-pre-line">{product.description || "No description available"}</p>
              </div>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product Categories</h3>
              {categories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <div key={category.id} className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Layers className="h-5 w-5 mr-2 text-muted-foreground" />
                        <h4 className="font-medium">{category.name}</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Slug:</span>
                          <Badge variant="outline">{category.slug}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Featured:</span>
                          <Badge variant={category.isFeatured ? "default" : "outline"}>
                            {category.isFeatured ? "Yes" : "No"}
                          </Badge>
                        </div>
                        {category.description && (
                          <div className="mt-2 pt-2 border-t">
                            <span className="text-muted-foreground">Description:</span>
                            <p className="mt-1">{category.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-muted rounded-lg">
                  <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No categories assigned</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Variants Tab */}
          <TabsContent value="variants" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product Variants</h3>
              {product.productVariants && product.productVariants.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Variant Name</th>
                        <th className="text-left py-3 px-4">Value</th>
                        <th className="text-left py-3 px-4">SKU</th>
                        <th className="text-left py-3 px-4">Price</th>
                        <th className="text-left py-3 px-4">Stock</th>
                        <th className="text-left py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.productVariants.map((variant) => (
                        <tr key={variant.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{variant.name}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">{variant.value}</Badge>
                          </td>
                          <td className="py-3 px-4">{variant.sku || "N/A"}</td>
                          <td className="py-3 px-4">
                            ${variant.price?.toFixed(2) || product.price.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={variant.stock > 10 ? "default" : variant.stock > 0 ? "outline" : "destructive"}>
                              {variant.stock} units
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={variant.isActive ? "default" : "destructive"}>
                              {variant.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-muted rounded-lg">
                  <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No variants available</p>
                </div>
              )}
            </div>

            {/* Variant Stats */}
            {product.productVariants && product.productVariants.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Total Variants</h4>
                  <div className="text-3xl font-bold">
                    {product.productVariants.length}
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Total Stock (All Variants)</h4>
                  <div className="text-3xl font-bold">
                    {product.productVariants.reduce((sum, variant) => sum + variant.stock, 0)}
                    <span className="text-sm font-normal ml-2">units</span>
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Active Variants</h4>
                  <div className="text-3xl font-bold">
                    {product.productVariants.filter(v => v.isActive).length}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product Images</h3>
              {product.productImages && product.productImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {product.productImages.map((image, index) => (
                    <div
                      key={image.id}
                      className="relative aspect-square rounded-lg overflow-hidden border group"
                    >
                      <Image
                        src={image.imageUrl}
                        alt={image.altText || `${product.name} - Image ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {image.isPrimary ? "Primary" : `Image ${index + 1}`}
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        Order: {image.sortOrder}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No product images available</p>
                </div>
              )}
            </div>

            {/* Image Details */}
            {product.productImages && product.productImages.length > 0 && (
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-3">Image Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.productImages.map((image) => (
                    <div key={image.id} className="bg-background p-3 rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {image.isPrimary ? "🌟 Primary Image" : "Image"}
                        </span>
                        <Badge variant="outline">Order: {image.sortOrder}</Badge>
                      </div>
                      {image.altText && (
                        <p className="text-sm text-muted-foreground">Alt: {image.altText}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2 truncate">
                        {image.imageUrl}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Reviews and Stats */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {product._count?.productReviews || 0}
              </div>
              <div className="text-sm text-muted-foreground">Reviews</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {product._count?.wishlists || 0}
              </div>
              <div className="text-sm text-muted-foreground">Wishlists</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {categories.length}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {product.productVariants?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Variants</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductViewDialog;