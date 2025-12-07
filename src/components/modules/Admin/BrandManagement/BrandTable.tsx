// components/modules/Brand/BrandTable.tsx
"use client";

import { deleteBrand } from "@/services/admin/catalogManagement.actions";
import { IBrand } from "@/types/product.interface";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import ManagementTable from "../../Dashboard/shared/ManagementTable";
import { BrandColumns } from "./BrandColumns";
import DeleteConfirmationDialog from "../../Dashboard/shared/DeleteConfirmationDialog";

interface BrandTableProps {
  brands: IBrand[];
}

const BrandTable = ({ brands }: BrandTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deletingBrand, setDeletingBrand] = useState<IBrand | null>(null);
  const [isDeletingDialog, setIsDeletingDialog] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDelete = (brand: IBrand) => {
    setDeletingBrand(brand);
  };

  const confirmDelete = async () => {
    if (!deletingBrand) return;

    setIsDeletingDialog(true);
    const result = await deleteBrand(deletingBrand.id);
    setIsDeletingDialog(false);
    
    if (result.success) {
      toast.success(result.message || "Brand deleted successfully");
      setDeletingBrand(null);
      handleRefresh();
    } else {
      toast.error(result.message || "Failed to delete brand");
    }
  };

  return (
    <>
      <ManagementTable
        data={brands}
        columns={BrandColumns}
        onDelete={handleDelete}
        getRowKey={(brand) => brand.id}
        emptyMessage="No brands found"
      />

      <DeleteConfirmationDialog
        open={!!deletingBrand}
        onOpenChange={(open) => !open && setDeletingBrand(null)}
        onConfirm={confirmDelete}
        title="Delete Brand"
        description={`Are you sure you want to delete "${deletingBrand?.name}"? This action cannot be undone.`}
        isDeleting={isDeletingDialog}
      />
    </>
  );
};

export default BrandTable;