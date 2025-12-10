// components/modules/Product/ProductManagementHeader.tsx
"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import ProductFormDialog from "./ProductFormDialog";
import ManagementPageHeader from "../../Dashboard/shared/ManagementPageHeader";
import { IBrand, ICategory } from "@/types/product.interface";

interface ProductManagementHeaderProps {
  categories: ICategory[];
  brands: IBrand[];
}

const ProductManagementHeader = ({ categories, brands }: ProductManagementHeaderProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);

  const handleSuccess = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleOpenDialog = () => {
    setDialogKey((prev) => prev + 1);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <ProductFormDialog
        key={dialogKey}
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
        categories={categories}
        brands={brands}
      />

      <ManagementPageHeader
        title="Product Management"
        description="Manage products, inventory, and pricing"
        action={{
          label: "Add Product",
          icon: Plus,
          onClick: handleOpenDialog,
        }}
      />
    </>
  );
};

export default ProductManagementHeader;