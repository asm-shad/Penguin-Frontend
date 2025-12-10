/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modules/Product/ProductTable.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ManagementTable from "../../Dashboard/shared/ManagementTable";
import DeleteConfirmationDialog from "../../Dashboard/shared/DeleteConfirmationDialog";
import ProductViewDialog from "./ProductViewDialog";
import ProductFormDialog from "./ProductFormDialog";
import { softDeleteProduct, deleteProduct } from "@/services/product/product.actions";
import { productColumns } from "./productColumns";
import { IProduct, IBrand, ICategory } from "@/types/product.interface";

interface ProductTableProps {
  products: IProduct[];
  categories: ICategory[];
  brands: IBrand[];
}

const ProductTable = ({ products, categories, brands }: ProductTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  
  // State management
  const [viewingProduct, setViewingProduct] = useState<IProduct | null>(null);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<IProduct | null>(null);
  const [deleteType, setDeleteType] = useState<"soft" | "hard">("soft");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleView = (product: IProduct) => {
    setViewingProduct(product);
  };

  const handleEdit = (product: IProduct) => {
    setEditingProduct(product);
  };

  const handleDelete = (product: IProduct, type: "soft" | "hard" = "soft") => {
    setDeletingProduct(product);
    setDeleteType(type);
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;

    setIsDeleting(true);
    let result;

    try {
      if (deleteType === "soft") {
        result = await softDeleteProduct(deletingProduct.id);
      } else {
        result = await deleteProduct(deletingProduct.id);
      }

      if (result.success) {
        toast.success(result.message || "Product deleted successfully");
        setDeletingProduct(null);
        handleRefresh();
      } else {
        toast.error(result.message || "Failed to delete product");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  const getDeleteDialogConfig = () => {
    if (!deletingProduct) return { title: "", description: "" };

    if (deleteType === "soft") {
      return {
        title: "Archive Product",
        description: `Are you sure you want to archive "${deletingProduct.name}"? This will hide the product from the store but keep it in the database.`,
      };
    } else {
      return {
        title: "Delete Product Permanently",
        description: `⚠️ WARNING: Are you sure you want to permanently delete "${deletingProduct.name}"? This action cannot be undone and will remove all associated data including variants, images, and reviews.`,
      };
    }
  };

  const { title, description } = getDeleteDialogConfig();

  return (
    <>
      <ManagementTable
        data={products}
        columns={productColumns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={(product) => product.id}
        emptyMessage={
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No products found
            </h3>
            <p className="text-gray-500 mb-4">
              {products.length === 0
                ? "Get started by creating your first product."
                : "Try adjusting your search or filter to find what you're looking for."}
            </p>
          </div>
        }
        // className="mt-4"
      />

      {/* View Product Dialog */}
      <ProductViewDialog
        open={!!viewingProduct}
        onOpenChange={(open) => !open && setViewingProduct(null)}
        product={viewingProduct}
      />

      {/* Edit Product Dialog */}
      <ProductFormDialog
        open={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSuccess={() => {
          setEditingProduct(null);
          handleRefresh();
        }}
        product={editingProduct!}
        categories={categories}
        brands={brands}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!deletingProduct}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingProduct(null);
            setDeleteType("soft");
          }
        }}
        onConfirm={confirmDelete}
        title={title}
        description={description}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default ProductTable;